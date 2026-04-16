'use client';

import { useState } from 'react';
import Link from 'next/link';
import usePublicCart from '@store/usePublicCart';
import ProductModal from '../../productos/components/ProductModal/ProductModal';
import './CartSidebar.scss';

const BACK_HOST = (process.env.NEXT_PUBLIC_BACK_HOST || '').replace(/\/+$/, '');

const getMediaSrc = (mediaPath) => {
  if (!mediaPath) return '';
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;

  const normalizedPath = String(mediaPath)
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');

  if (!BACK_HOST) return `/${normalizedPath}`;
  return `${BACK_HOST}/${normalizedPath}`;
};

const CartSidebar = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const items = usePublicCart((s) => s.items);
  const sidebarOpen = usePublicCart((s) => s.sidebarOpen);
  const closeSidebar = usePublicCart((s) => s.closeSidebar);
  const updateQty = usePublicCart((s) => s.updateQty);
  const removeItem = usePublicCart((s) => s.removeItem);
  const getTotal = usePublicCart((s) => s.getTotal);

  const getItemImage = (item) => {
    if (item?.image) return item.image;
    if (Array.isArray(item?.gallery) && item.gallery.length > 0) return item.gallery[0];
    return null;
  };

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && <div className="cart-sidebar__overlay" onClick={closeSidebar} />}

      {/* Sidebar */}
      <div className={`cart-sidebar ${sidebarOpen ? 'cart-sidebar--open' : ''}`}>
        {/* Header */}
        <div className="cart-sidebar__header">
          <h3 className="cart-sidebar__title">
            🛒 Carrito
            <span className="cart-sidebar__count">({items.length})</span>
          </h3>
          <button className="cart-sidebar__close" onClick={closeSidebar} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="cart-sidebar__body">
          {items.length === 0 ? (
            <div className="cart-sidebar__empty">
              <span className="cart-sidebar__empty-icon">🛒</span>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-sidebar__item" key={item.id}>
                <div className="cart-sidebar__item-img">
                  {getItemImage(item) ? (
                    <img
                      src={getMediaSrc(getItemImage(item))}
                      alt={item.name || 'Producto'}
                      loading="lazy"
                    />
                  ) : (
                    <span>📷</span>
                  )}
                </div>
                <div className="cart-sidebar__item-info">
                  <button
                    type="button"
                    className="cart-sidebar__item-name"
                    onClick={() => setSelectedProduct(item)}
                    title="Ver detalle"
                  >
                    {item.name}
                  </button>
                  <div className="cart-sidebar__item-price">${item.price.toFixed(2)}</div>
                  <div className="cart-sidebar__item-controls">
                    <button
                      className="cart-sidebar__qty-btn"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                    >−</button>
                    <span className="cart-sidebar__qty">{item.qty}</span>
                    <button
                      className="cart-sidebar__qty-btn"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                    >+</button>
                    <button
                      className="cart-sidebar__remove"
                      onClick={() => removeItem(item.id)}
                      aria-label="Eliminar"
                    >🗑</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-sidebar__footer">
            <div className="cart-sidebar__total">
              <span>Subtotal</span>
              <strong>${getTotal().toFixed(2)}</strong>
            </div>
            <Link
              href="/carrito"
              className="cart-sidebar__view-cart"
              onClick={closeSidebar}
            >
              Ver Carrito Completo
            </Link>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          allowAddToCart={false}
        />
      )}
    </>
  );
};

export default CartSidebar;
