import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const locale = request.cookies.get("NEXT_LOCALE")?.value;
  if (!locale || !["fr", "ru"].includes(locale)) {
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", "fr", { path: "/", maxAge: 31536000 });
    return response;
  }

  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/inscription") ||
    pathname.startsWith("/declaration-arrivee") ||
    pathname.startsWith("/doleances") ||
    pathname.startsWith("/enregistrement-contractuel") ||
    pathname.startsWith("/presentation") ||
    pathname.startsWith("/espace-ressortissant") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signalements") ||
    pathname.startsWith("/conges") ||
    pathname.startsWith("/billets") ||
    pathname.startsWith("/actualites") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads");

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
