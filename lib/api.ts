import { NextResponse } from "next/server";

export function isJsonRequest(request: Request): boolean {
  const contentType = request.headers.get("content-type") || "";
  return contentType.includes("application/json");
}

export function redirectTo(request: Request, path: string, params?: Record<string, string>): NextResponse {
  const url = new URL(path, request.url);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return NextResponse.redirect(url);
}
