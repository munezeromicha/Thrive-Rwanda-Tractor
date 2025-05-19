// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that require authentication
const PROTECTED_PATHS = [
  '/admin',
  '/admin/bookings',
  '/admin/equipment',
  '/admin/upload',
  '/admin/analytics',
  '/admin/settings',
];

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'Thrive-Rwanda-2025';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  if (isProtectedRoute) {
    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Redirect to login page with return URL
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify the token
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secretKey);
      
      if (!payload) {
        // Token is invalid, redirect to login
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check if user is admin
      if (payload.role !== 'admin') {
        // User is not an admin, redirect to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      // Token verification failed, redirect to login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure the paths that trigger the middleware
export const config = {
  matcher: [
    '/admin/:path*',  // Protect all admin routes
  ]
};