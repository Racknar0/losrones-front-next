import React, { useEffect, useState } from 'react';
import useStore from '@store/useStore';
import { confirmAlert, errorAlert, timerAlert } from '@helpers/alerts';
import TotalValue from '../totalValue/TotalValue';
import CuponTotal from '../cuponTotal/CuponTotal';
import SelectMetodoPago from '../selectMetodoPago/SelectMetodoPago';
import Cambio from '../cambio/Cambio';
import './ProcesoPago.scss';
import HttpService from '@services/HttpService';
import Spinner from '@admin-shared/spinner/Spinner';
import CashIcon from '@admin-shared/icons/CashIcon';

const ProcesoPago = ({
    fetchProducts
}) => {
    const totalCompra = useStore((s) => s.totalCompra);
    const setTotalCompra = useStore((s) => s.setTotalCompra);
    const totalCompraSinCupon = useStore((s) => s.totalCompraSinCupon);
    const tipoPago = useStore((s) => s.tipoPago);
    const setTipoPago = useStore((s) => s.setTipoPago);
    const setDineroRecibido = useStore((s) => s.setDineroRecibido);
    const cambio = useStore((s) => s.cambio);
    const setCambio = useStore((s) => s.setCambio);
    const cupones = useStore((s) => s.cupones);
    const selectedCoupon = useStore((s) => s.selectedCoupon);
    const setSelectedCoupon = useStore((s) => s.setSelectedCoupon);
    const cartItems = useStore((s) => s.cartItems);
    const selectedStore = useStore((s) => s.selectedStore);
    const jwtData = useStore((s) => s.jwtData);
    const resetFinisedSale = useStore((s) => s.resetFinisedSale);

    const [efectivo, setEfectivo] = useState('');
    const [cupon, setCupon] = useState('');
    const [loading, setLoading] = useState(false);
    const [isHomeDelivery, setIsHomeDelivery] = useState(false);

    const httpService = new HttpService();

    useEffect(() => {
        if (tipoPago === 'tarjeta' || tipoPago === 'transferencia') {
            // setear el efectivo al total de la compra
            setEfectivo(totalCompra);
            setCambio(0);
        } else {
            setEfectivo('');
            setCambio(0);
        }

    }, [tipoPago]);

    // ── Validación al salir del input ──
    const validarEfectivo = async (raw) => {
        const value = parseFloat(raw);

        if (isNaN(value)) { await errorAlert( 'Error', 'El monto recibido no es un número válido' ); setCambio(0); return; }
        if (value < 0) { await errorAlert( 'Error', 'El monto recibido no puede ser negativo' ); setCambio(0); return; }
        if (value < totalCompra) { await errorAlert( 'Error', 'El monto recibido no puede ser menor al total de la compra' ); setCambio(0); return; }

        // ✔ OK
        setDineroRecibido(value);
        setCambio(value - totalCompra);
    };


    const handleCuponChange = (e) => {
        setSelectedCoupon(null);
        const value = e.target.value.trim().toUpperCase();
        setCupon(value);
        const cuponEncontrado = cupones.find((cupon) => cupon.code === value);
        if (cuponEncontrado) {
            setSelectedCoupon(cuponEncontrado);
        } else {
            setSelectedCoupon(null);
        }
    }

    const handleSelectGlobalCoupon = (coupon) => {
        setCupon(coupon.code);
        setSelectedCoupon(coupon);
    };


    const hadleFinalizarVenta = async () => {
        // Aquí puedes agregar la lógica para finalizar la venta
        // Por ejemplo, enviar los datos al servidor o realizar cualquier otra acción necesaria
        console.log('Venta finalizada');

        if (!cartItems.length) return errorAlert('Error', 'No hay productos en el carrito');
        if (!tipoPago) return errorAlert('Error', 'Seleccione un método de pago');
        if (!efectivo) return errorAlert('Error', 'Ingrese el monto recibido');
        if (efectivo < totalCompra) return errorAlert('Error', 'El monto recibido no puede ser menor al total de la compra');
        if (cambio < 0) return errorAlert('Error', 'El cambio no puede ser negativo');
        if (cambio > efectivo) return errorAlert('Error', 'El cambio no puede ser mayor al monto recibido');

        const confirm = await confirmAlert('Confirmar', '¿Está seguro de que desea registrar la venta?');
        if (!confirm) return;


        const calculateTotalSinCupon = () => {
            const base = cartItems.reduce((acc, item) => acc + parseFloat(item.product.salePrice), 0);
            return base;
        };

        const dataToSend = {
            storeId: parseInt(selectedStore),
            userId: jwtData.id,
            paymentMethod: tipoPago,
            total: totalCompra,
            received: parseFloat(efectivo),
            change: parseFloat(cambio),
            totalSinCupon: calculateTotalSinCupon(),
            cupon: selectedCoupon ? selectedCoupon.code : null,
            isHomeDelivery,
            items: cartItems.map((item) => ({
                stockUnitId: item.id,
                productId: item.productId,
                price: item.product.salePrice,
                expirationDate: item.expirationDate,
                itemCoupon: item.itemCoupon ? item.itemCoupon.code : null,
            })),
        }

       

        try {
            setLoading(true);
            const res = await httpService.postData('/sale', dataToSend);
            if (res.status === 201) {
                const BACK_HOST = process.env.NEXT_PUBLIC_BACK_HOST;
                // Aquí puedes agregar la lógica para manejar la respuesta exitosa
                console.log('Venta registrada con éxito', res.data.sale.id);
                resetFinisedSale();
                setEfectivo('');
                setIsHomeDelivery(false);
                fetchProducts();
                await timerAlert('Éxito', 'Venta registrada con éxito', 2000);
                // Abrir en una nueva pestaña
                const newWindow = window.open(`${BACK_HOST}/sale/generate-pdf/${res.data.sale.id}`, '_blank');
                if (newWindow) {
                    newWindow.focus();
                }
                
            } else {
                errorAlert('Error', 'No se pudo finalizar la venta');
            }
        } catch (error) {
            errorAlert('Error', 'Ocurrió un error al finalizar la venta');
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="type_sale_container">
            {/* FILA 1: Total y Cupón */}
            <div className="payment_grid_row">
                <div className="payment_grid_col">
                    <p className="payment_section_title">Resumen de Venta</p>
                    <TotalValue
                        selectedCoupon={selectedCoupon}
                        totalCompra={totalCompra}
                        totalCompraSinCupon={totalCompraSinCupon}
                    />
                </div>
                <div className="payment_grid_col">
                    <p className="payment_section_title">Cupón Descuento</p>
                    <CuponTotal
                        cupon={cupon}
                        setCupon={setCupon}
                        handleCuponChange={handleCuponChange}
                        onSelectCoupon={handleSelectGlobalCoupon}
                    />
                </div>
            </div>

            {/* FILA 2: Método de Pago y Detalle de Efectivo */}
            <div className="payment_grid_row mt-3">
                <div className="payment_grid_col">
                    <p className="payment_section_title">Método de Pago</p>
                    <SelectMetodoPago
                        tipoPago={tipoPago}
                        setTipoPago={setTipoPago}
                    />
                </div>
                <div className="payment_grid_col">
                    <p className="payment_section_title">Monto Recibido / Cambio</p>
                    <Cambio
                        efectivo={efectivo}
                        setEfectivo={setEfectivo}
                        cambio={cambio}
                        validarEfectivo={validarEfectivo}
                        tipoPago={tipoPago}
                    />
                </div>
            </div>

            {/* FILA 3: Envío a Domicilio y Finalizar Venta */}
            <div className="payment_grid_row mt-4 align-items-end">
                <div className="payment_grid_col">
                    <p className="payment_section_title">Opciones de Entrega</p>
                    <div className="envio_domicilio_container">
                        <input
                            type="checkbox"
                            id="envioDomicilio"
                            checked={isHomeDelivery}
                            onChange={(e) => setIsHomeDelivery(e.target.checked)}
                        />
                        <label htmlFor="envioDomicilio">
                            ¿Es envío a domicilio?
                        </label>
                    </div>
                </div>
                <div className="payment_grid_col">
                    <div className='finish_sale_container'>
                        {
                            loading ? (
                                <Spinner loading={loading} color="#6564d8" />
                            ) : (
                                <button className="d-flex btn_finalizar_venta" onClick={hadleFinalizarVenta}>
                                    <CashIcon className="icon_finalizar_venta" />
                                    <p>Finalizar venta</p>
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default ProcesoPago;
