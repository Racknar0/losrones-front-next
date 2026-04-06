/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/administracion/dashboard',
        destination: '/dashboard/reportes',
        permanent: false,
      },
      {
        source: '/administracion/dashboard/:path*',
        destination: '/dashboard/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
