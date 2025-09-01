import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Environment-aware configuration
const isDevelopment = process.env.NODE_ENV === "development";

// Use a Set for O(1) public path lookup - more efficient than array operations
const publicPathSet = new Set([
  "/",
  "/login",
  "/register",
  "/reset-password",
  "/auth/google/callback",
]);

const authPages = new Set(["/login", "/register", "/reset-password"]);

// Cache the dashboard URL to avoid creating new URL objects repeatedly
const DASHBOARD_URL = "/user/dashboard";
const LOGIN_URL = "/login";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Remove trailing slash except for root - normalize path once
  const normalizedPath =
    pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  // Check if the path is public (exact match or subpath)
  const isPublicPath =
    publicPathSet.has(normalizedPath) ||
    // Check for subpaths efficiently
    (normalizedPath.startsWith("/auth/") && normalizedPath.includes("/callback")) ||
    normalizedPath.startsWith("/api/") || // API routes should be public by default
    normalizedPath.startsWith("/_next/") || // Next.js internals
    normalizedPath.includes("."); // Static files (favicon.ico, etc.)

  // Early return for static files and API routes
  if (
    normalizedPath.startsWith("/api/") ||
    normalizedPath.startsWith("/_next/") ||
    normalizedPath.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the path is an auth page
  const isAuthPage = authPages.has(normalizedPath);

  // If authenticated and on an auth page, redirect to dashboard
  if (token && isAuthPage) {
    const redirectUrl = new URL(DASHBOARD_URL, request.url);

    // Add development logging
    if (isDevelopment) {
      console.log(`[Middleware] Authenticated user on auth page, redirecting to dashboard`);
    }

    return NextResponse.redirect(redirectUrl);
  }

  // If not authenticated and not on a public path, redirect to login
  if (!token && !isPublicPath) {
    const loginUrl = new URL(LOGIN_URL, request.url);

    // Preserve the intended destination for post-login redirect
    if (normalizedPath !== "/" && !normalizedPath.startsWith("/login")) {
      loginUrl.searchParams.set("redirect", normalizedPath);
    }

    // Add development logging
    if (isDevelopment) {
      console.log(`[Middleware] Unauthenticated user accessing protected route: ${normalizedPath}`);
    }

    return NextResponse.redirect(loginUrl);
  }

  // Add security headers for enhanced protection
  const response = NextResponse.next();

  // Only add security headers in production
  if (!isDevelopment) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }

  return response;
}

// Optimized matcher - exclude more static files and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes (/api/*)
     * - Next.js internals (_next/*)
     * - Static files (favicon.ico, etc.)
     * - Images and assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};