import Noticias from './Noticias';

export const metadata = {
  title: 'Noticias',
  description:
    'Novedades, tips y noticias sobre mascotas de Losrones. Informacion util para el cuidado de tu mascota.',
  alternates: {
    canonical: '/noticias',
  },
};

export default function Page() {
  return <Noticias />;
}
