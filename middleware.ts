import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Use a Set for O(1) public path lookup
const publicPathSet = new Set([
  "/",
  "/login",
  "/register",
  "/reset-password",
  "/auth/google/callback",
]);
const authPages = new Set(["/login", "/register", "/reset-password"]);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Remove trailing slash except for root
  const normalizedPath =
    pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  // Check if the path is public (exact or subpath)
  const isPublicPath =
    publicPathSet.has(normalizedPath) ||
    Array.from(publicPathSet).some((path) => path !== "/" && normalizedPath.startsWith(`${path}/`));

  // Check if the path is an auth page
  const isAuthPage = authPages.has(normalizedPath);

  // If authenticated and on an auth page, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  // If not authenticated and not on a public path, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow request to proceed
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