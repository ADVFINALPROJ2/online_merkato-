import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

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
  matcher: ['/login'],
};