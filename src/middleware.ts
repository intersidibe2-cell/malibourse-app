import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const isLoggedIn = !!token;

  const locale = request.cookies.get("NEXT_LOCALE")?.value;
  if (!locale || !["fr", "ru"].includes(locale)) {
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", "fr", { path: "/", maxAge: 31536000 });
    return response;
  }

  const isLoginPage = pathname === "/login";
  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/declaration-arrivee") ||
    pathname.startsWith("/doleances") ||
    pathname.startsWith("/enregistrement-contractuel") ||
    pathname.startsWith("/presentation") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api");

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
