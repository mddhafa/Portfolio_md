import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  // Kalau akses /admin/* tapi tidak punya token → redirect ke login
  if (isAdminRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // Kalau sudah login tapi akses login page → redirect ke dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin/projects', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};