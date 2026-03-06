import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ["/profile", "/onboarding", "/payment", "/cancel"];

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Basic admin check (this should eventually verify the role in the JWT on the server)
  // For now, if we have no token at all, definitely redirect
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from login/signup
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/profile/:path*",
    "/onboarding/:path*",
    "/payment/:path*",
    "/cancel/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
