import Home from './home/Home';

export const metadata = {
  title: 'Inicio',
  description:
    'Tienda en linea de Losrones: alimento, accesorios y productos para mascotas en Veracruz y Boca del Rio.',
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  return <Home />;
}
