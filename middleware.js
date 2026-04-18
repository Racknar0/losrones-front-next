import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'auth_token';

const parseJwtPayload = (token) => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const jsonPayload = atob(normalized);

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const isTokenValid = (token) => {
  if (!token) return false;

  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return false;

  return payload.exp * 1000 > Date.now();
};

const clearAuthCookie = (response) => {
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const hasValidToken = isTokenValid(token);
  const hasInvalidToken = Boolean(token) && !hasValidToken;

  const isLoginPath = pathname === '/login';
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Si no hay sesión, no permitir dashboard
  if (isDashboardRoute && !hasValidToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const response = NextResponse.redirect(url);
    return hasInvalidToken ? clearAuthCookie(response) : response;
  }

  // Si ya hay sesión, evitar quedarse en login
  if (isLoginPath && hasValidToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard/reportes';
    return NextResponse.redirect(url);
  }

  if (isLoginPath && hasInvalidToken) {
    return clearAuthCookie(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
};
