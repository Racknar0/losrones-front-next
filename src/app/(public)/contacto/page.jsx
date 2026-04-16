import Contacto from './Contacto';

export const metadata = {
  title: 'Contacto',
  description:
    'Contacta a Losrones y conoce nuestras sucursales en Veracruz y Boca del Rio. Horarios, telefonos y ubicaciones.',
  alternates: {
    canonical: '/contacto',
  },
};

export default function Page() {
  return <Contacto />;
}
