export async function generateMetadata({ params }) {
  const { slug } = await params;
  const readableName = String(slug || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());

  return {
    title: readableName ? `${readableName}` : 'Detalle de Producto',
    description: readableName
      ? `Conoce detalles, precio y disponibilidad de ${readableName} en Losrones.`
      : 'Conoce el detalle del producto en Losrones.',
    alternates: {
      canonical: `/productos/${slug}`,
    },
  };
}

export default async function ProductoDetallePage({ params }) {
  const { slug } = await params;

  return (
    <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1>Detalle de Producto</h1>
      <p>Producto: <strong>{slug}</strong></p>
    </section>
  );
}
