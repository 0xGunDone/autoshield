import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { isJsonRequest, redirectTo } from "@/lib/api";
import { getClientIp, HttpError, parseFormBody, parseJsonBody } from "@/lib/http";
import { AUTH_COOKIE, signJwt } from "@/lib/jwt";
import { logApiError } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { getAdminByLogin } from "@/lib/repository";
import { loginSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const jsonRequest = isJsonRequest(request);
  const ip = getClientIp(request);

  if (!rateLimit(`login:${ip}`, 10, 10 * 60 * 1000)) {
    if (jsonRequest) {
      return NextResponse.json({ message: "Too many attempts" }, { status: 429 });
    }
    return redirectTo(request, "/admin/login", { error: "rate" });
  }

  try {
    const payload = jsonRequest ? await parseJsonBody(request, loginSchema) : await parseFormBody(request, loginSchema);

    const admin = getAdminByLogin(payload.login);
    const isValid = admin ? await bcrypt.compare(payload.password, admin.password_hash) : false;

    if (!admin || !isValid) {
      if (jsonRequest) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
      }
      return redirectTo(request, "/admin/login", { error: "auth" });
    }

    const secret = process.env.JWT_SECRET || "";
    if (!secret) {
      return NextResponse.json({ message: "JWT_SECRET is not configured" }, { status: 500 });
    }

    const token = await signJwt({ sub: String(admin.id), login: admin.login }, secret);

    const response = jsonRequest ? NextResponse.json({ ok: true }) : redirectTo(request, "/admin");

    response.cookies.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/"
    });

    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      if (jsonRequest) {
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      return redirectTo(request, "/admin/login", { error: "validation" });
    }

    logApiError("api/auth/login", error, { ip, jsonRequest });
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
