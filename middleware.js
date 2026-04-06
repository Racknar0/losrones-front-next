import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  const isLoginPath = pathname === '/';
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Si no hay sesión, no permitir dashboard
  if (isDashboardRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Si ya hay sesión, evitar quedarse en login
  if (isLoginPath && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard/reportes';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
