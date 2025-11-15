import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes: string[] = [
  // Add your protected routes here
  // Example: '/dashboard', '/profile', '/admin'
];

// Define public routes that should be accessible without authentication
const publicRoutes = [
  '/',
  '/nieuws',
  '/ploeg',
  '/wedstrijden',
  '/fotos',
  '/statistieken',
  '/contact',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if the route is public
  const isPublicRoute =
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route),
    ) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.');

  // If it's a public route or API route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check for session cookie
  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get('goldgetters_session');

    if (!sessionCookie) {
      // Redirect to home if no session
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
