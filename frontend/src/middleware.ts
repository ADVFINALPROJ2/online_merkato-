import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const protectedRoutes = [
  '/dashboard',
  '/orders',
  '/products',
  '/categories',
  '/inventory',
  '/shop',
  '/checkout',
];


const authRoutes = ['/login', '/register', '/forgot-password'];

function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

function getDashboardByRole(role: string | null): string {
  switch (role) {
    case 'BUYER': return '/buyer/dashboard';
    case 'SELLER': return '/dashboard';
    case 'DELIVERY': return '/deliveries';
    default: return '/dashboard';
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    const role = getRoleFromToken(token);
    return NextResponse.redirect(new URL(getDashboardByRole(role), request.url));
  }
  console.log('Middleware Path:', pathname, 'Token exists:', !!token);

  // If user is logged in and trying to access /login, 
  // they are being forcefully redirected to /admin.
  // if (pathname === '/login' && token) {
  //   console.log('Redirecting logged-in user to /admin');
  //   return NextResponse.redirect(new URL('/admin', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
  // matcher: ['/login'],
};