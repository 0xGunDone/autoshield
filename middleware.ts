import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyJwt } from "@/lib/jwt";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAdminAuth = pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.has(pathname);
  const needsApiAuth = pathname.startsWith("/api/admin");

  if (!needsAdminAuth && !needsApiAuth) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const secret = process.env.JWT_SECRET || "";

  if (!token || !secret) {
    if (needsApiAuth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const payload = await verifyJwt(token, secret);

  if (!payload) {
    if (needsApiAuth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
