const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://losrones.com';

export default function sitemap() {
  const now = new Date();
  const routes = [
    '/',
    '/productos',
    '/noticias',
    '/contacto',
    '/sobre-nosotros',
    '/carrito',
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
