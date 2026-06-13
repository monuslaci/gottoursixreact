import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "six_session";

const PROTECTED_PATHS = ["/topics", "/profile", "/messages", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const needsAuth = PROTECTED_PATHS.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!needsAuth) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    return NextResponse.next();
  }

  const url = new URL("/auth", request.url);
  url.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/topics",
    "/topics/:path*",
    "/profile/:path*",
    "/messages/:path*",
    "/admin/:path*",
  ],
};
