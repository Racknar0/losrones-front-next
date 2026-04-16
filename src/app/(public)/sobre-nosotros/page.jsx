import SobreNosotros from './SobreNosotros';

export const metadata = {
  title: 'Sobre Nosotros',
  description:
    'Conoce la historia de Losrones, nuestra mision y compromiso con el bienestar de las mascotas.',
  alternates: {
    canonical: '/sobre-nosotros',
  },
};

export default function Page() {
  return <SobreNosotros />;
}
