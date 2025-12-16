import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protected routes that require authentication
  const protectedPaths = ["/dashboard"];
  const authPaths = ["/signin", "/signup"];
  const publicPaths = ["/", "/pricing", "/privacy", "/terms"];

  // Check if the path is a protected route
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  
  const isAuthRoute = authPaths.some((path) =>
    pathname.startsWith(path)
  );
  
  const isPublicRoute = publicPaths.includes(pathname) || pathname.startsWith("/api");

  // Check for Supabase auth session cookie
  // Supabase stores the session in a cookie named: sb-<project-ref>-auth-token
  const supabaseAuthCookie = request.cookies.get(
    request.cookies.getAll().find(c => c.name.includes('auth-token'))?.name || ''
  );
  
  // Alternative: check for any Supabase cookie
  const hasAuthCookie = request.cookies.getAll().some(
    cookie => cookie.name.includes('supabase') || cookie.name.includes('auth')
  );

  // For protected routes, redirect to signin if not authenticated
  if (isProtectedRoute && !hasAuthCookie) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // For auth routes, redirect to dashboard if already authenticated
  if (isAuthRoute && hasAuthCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

