import { NextRequest, NextResponse } from 'next/server';

// Define protected routes
const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check if the access_token cookie exists
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      // Redirect to login if no access token
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Optionally, you could also validate the token with your backend here
    // For now, we just check if it exists
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};