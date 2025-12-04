import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Keep middleware minimal: we only use it to prevent logged-in users
  // from going back to auth pages. All other auth / onboarding logic
  // is handled client-side (via Supabase auth state + database checks).

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/signin") ||
    req.nextUrl.pathname.startsWith("/signup") ||
    req.nextUrl.pathname.startsWith("/forgot-password") ||
    req.nextUrl.pathname.startsWith("/reset-password");

  // Supabase typically sets cookies like:
  // - sb-<project-ref>-auth-token
  // - sb-<project-ref>-access-token / -refresh-token
  const hasAuthCookie = req.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-"));

  // If already authenticated and trying to access auth pages,
  // send user to dashboard. Onboarding vs dashboard is decided
  // in client code after checking the database flag.
  if (hasAuthCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/forgot-password", "/reset-password"],
};

