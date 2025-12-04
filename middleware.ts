import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // For now, we'll do a simplified middleware
  // The full auth checking is handled by the AuthProvider client-side
  
  const isAuthPage = req.nextUrl.pathname.startsWith("/signin") || 
                     req.nextUrl.pathname.startsWith("/signup") ||
                     req.nextUrl.pathname.startsWith("/forgot-password") ||
                     req.nextUrl.pathname.startsWith("/reset-password");
  
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnboardingPage = req.nextUrl.pathname.startsWith("/onboarding");

  // Check for Supabase auth cookies
  const hasAuthCookie = req.cookies.getAll().some(cookie => 
    cookie.name.includes("sb-") && cookie.name.includes("auth-token")
  );

  // If no auth cookie and trying to access protected routes
  if (!hasAuthCookie && (isDashboardPage || isOnboardingPage)) {
    const redirectUrl = new URL("/signin", req.url);
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If has auth cookie and trying to access auth pages, redirect to dashboard
  // (The client-side will handle more specific redirects based on onboarding status)
  if (hasAuthCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};

