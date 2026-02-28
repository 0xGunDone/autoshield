import { NextResponse } from "next/server";
import { isJsonRequest, redirectTo } from "@/lib/api";
import { isAuthorizedRequest } from "@/lib/auth";

export async function ensureAdminOrReject(request: Request, fallbackPath: string): Promise<NextResponse | null> {
  const authorized = await isAuthorizedRequest(request);
  if (authorized) {
    return null;
  }

  if (isJsonRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return redirectTo(request, "/admin/login", { next: fallbackPath });
}
