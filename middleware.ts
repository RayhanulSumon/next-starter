import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Use a Set for O(1) public path lookup
const publicPathSet = new Set(["/", "/login", "/register", "/reset-password"]);

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