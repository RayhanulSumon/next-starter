import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/auth/register",
  "/reset-password",
  "/auth/reset-password",
];

export default function middleware(request: NextRequest) {
  // Get the pathname from the request
  const pathname = request.nextUrl.pathname;

  // Get auth token from cookies
  const token = request.cookies.get("token")?.value;

  // Normalize pathname to remove trailing slash (except for root)
  const normalizedPath =
    pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (path) => normalizedPath === path || normalizedPath.startsWith(`${path}/`)
  );

  // Debug logging
  // console.log('MIDDLEWARE DEBUG', {
  //   pathname,
  //   normalizedPath,
  //   isPublicPath,
  //   token,
  // });

  // Redirect to loginAction if accessing protected route without token
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if accessing auth pages with valid token
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/*)
     * - _next (Next.js internals)
     * - Static files like favicon.ico, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
