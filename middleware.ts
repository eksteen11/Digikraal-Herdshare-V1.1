import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Allow public routes
  if (
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/verify") ||
    path === "/"
  ) {
    return NextResponse.next();
  }

  // Require auth for app routes
  if (path.startsWith("/app")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based access control
    const role = (token as any).role;

    // Admin can access everything
    if (role === "Admin") {
      return NextResponse.next();
    }

    // Investor can only access investor routes
    if (role === "Investor") {
      if (!path.startsWith("/app/investor")) {
        return NextResponse.redirect(new URL("/app/investor", request.url));
      }
      return NextResponse.next();
    }

    // Farmer/Partner can only access farmer routes
    if (role === "Farmer" || role === "Partner") {
      if (!path.startsWith("/app/farmer")) {
        return NextResponse.redirect(new URL("/app/farmer", request.url));
      }
      return NextResponse.next();
    }

    // Default: redirect to login if role doesn't match
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/register"],
};
