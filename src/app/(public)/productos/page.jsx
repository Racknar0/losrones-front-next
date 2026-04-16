import Productos from './Productos';

export const metadata = {
  title: 'Productos',
  description:
    'Explora el catalogo de productos para mascotas de Losrones: alimento, premios, accesorios y mas.',
  alternates: {
    canonical: '/productos',
  },
};

export default function Page() {
  return <Productos />;
}
