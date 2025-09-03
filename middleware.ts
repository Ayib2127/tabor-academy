import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Unified middleware with basic error handling and comprehensive matcher.
export function middleware(request: NextRequest) {
  try {
    return NextResponse.next();
  } catch (error) {
    // Log once; keep response flowing.
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

/*
 * Match all request paths EXCEPT the following exclusions:
 *  - _next/static   (static files)
 *  - _next/image    (image optimization)
 *  - favicon.ico    (favicon)
 *  - public assets  (common image formats)
 *  - api/auth       (Supabase auth routes)
 *  - api/webhooks   (payment webhooks)
 *  - login signup auth/callback pages
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth|api/webhooks|login|signup|auth/callback).*)',
  ],
};