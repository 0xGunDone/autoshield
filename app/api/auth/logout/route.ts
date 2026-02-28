import { NextResponse } from "next/server";
import { isJsonRequest, redirectTo } from "@/lib/api";
import { AUTH_COOKIE } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const jsonRequest = isJsonRequest(request);
  const response = jsonRequest ? NextResponse.json({ ok: true }) : redirectTo(request, "/admin/login");

  response.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    expires: new Date(0),
    path: "/"
  });

  return response;
}
