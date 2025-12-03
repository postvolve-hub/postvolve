import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedPaths = ["/dashboard"];
  const { pathname } = request.nextUrl;

  // Check if the path is a protected route
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // For protected routes, we'll handle auth check in the layout/component
  // Middleware can be extended later for token validation
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

