import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  const isAdminLogin = pathname === '/administracion';
  const isAdminDashboard = pathname.startsWith('/administracion/dashboard');

  // Si no hay sesión, no permitir dashboard
  if (isAdminDashboard && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/administracion';
    return NextResponse.redirect(url);
  }

  // Si ya hay sesión, evitar quedarse en login
  if (isAdminLogin && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/administracion/dashboard/reportes';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/administracion', '/administracion/:path*'],
};
