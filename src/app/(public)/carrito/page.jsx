import Carrito from './Carrito';

export const metadata = {
  title: 'Carrito',
  description: 'Resumen de productos seleccionados antes de finalizar tu pedido en Losrones.',
  alternates: {
    canonical: '/carrito',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <Carrito />;
}
