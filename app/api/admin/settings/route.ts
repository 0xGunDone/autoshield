import { NextResponse } from "next/server";
import { ensureAdminOrReject } from "@/lib/admin-route";
import { isJsonRequest, redirectTo } from "@/lib/api";
import { HttpError, parseFormBody, parseJsonBody } from "@/lib/http";
import { updateSiteSettings } from "@/lib/repository";
import { settingsSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authError = await ensureAdminOrReject(request, "/admin/settings");
  if (authError) {
    return authError;
  }

  const jsonRequest = isJsonRequest(request);

  try {
    const payload = jsonRequest ? await parseJsonBody(request, settingsSchema) : await parseFormBody(request, settingsSchema, 300_000);

    updateSiteSettings(payload);

    if (jsonRequest) {
      return NextResponse.json({ ok: true });
    }

    return redirectTo(request, "/admin/settings", { saved: "1" });
  } catch (error) {
    if (error instanceof HttpError) {
      if (jsonRequest) {
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      return redirectTo(request, "/admin/settings", { error: "validation" });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
