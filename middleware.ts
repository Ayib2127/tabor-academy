import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  console.log('Middleware: Executing for URL:', req.url);

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Attempt to get the session to refresh it.
    // This will refresh the user's session and extend their cookie expiration.
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Middleware: Error getting session:', error.message);
      // Depending on the error, you might want to redirect to login or show an error page
    }

    if (!session) {
      console.log('Middleware: No active session detected. User might be unauthenticated.');
      // You can add logic here to redirect unauthenticated users from protected routes
      // Example: If a non-logged-in user tries to access /dashboard, redirect to /login
      const protectedRoutes = ['/dashboard', '/dashboard/instructor', '/dashboard/admin']; // Add your protected routes
      if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        // If the path is protected and there's no session, redirect to login
        // Make sure to not redirect API calls or it will create a loop
        if (!req.nextUrl.pathname.startsWith('/api/')) {
            const redirectUrl = req.nextUrl.clone();
            redirectUrl.pathname = '/login';
            redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
            console.log('Middleware: Redirecting unauthenticated user to login.');
            return NextResponse.redirect(redirectUrl);
        }
      }
    } else {
      console.log('Middleware: Session found for user ID:', session.user.id);
    }
  } catch (e: any) {
    console.error('Middleware: Unexpected error during session refresh:', e.message);
  }

  // Ensure that responses from API routes also have the cookie updated
  // This is handled by createMiddlewareClient automatically, but good to be explicit
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api/auth (supabase auth routes)
     * - /login, /signup, /auth/callback (auth pages)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth|login|signup|auth/callback).*)',
  ],
};