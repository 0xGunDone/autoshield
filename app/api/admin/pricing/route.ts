import { NextResponse } from "next/server";
import { ensureAdminOrReject } from "@/lib/admin-route";
import { isJsonRequest, redirectTo } from "@/lib/api";
import { HttpError, parseFormBody, parseJsonBody } from "@/lib/http";
import { logApiError } from "@/lib/logger";
import { createPricing } from "@/lib/repository";
import { pricingSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authError = await ensureAdminOrReject(request, "/admin/pricing");
  if (authError) {
    return authError;
  }

  const jsonRequest = isJsonRequest(request);

  try {
    const payload = jsonRequest ? await parseJsonBody(request, pricingSchema) : await parseFormBody(request, pricingSchema);

    const id = createPricing({
      title: payload.title,
      price_from: payload.price_from,
      comment: payload.comment,
      sort_order: payload.sort_order
    });

    if (jsonRequest) {
      return NextResponse.json({ ok: true, id });
    }

    return redirectTo(request, "/admin/pricing", { saved: "1" });
  } catch (error) {
    if (error instanceof HttpError) {
      if (jsonRequest) {
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      return redirectTo(request, "/admin/pricing/new", { error: error.message });
    }

    logApiError("api/admin/pricing:create", error, { jsonRequest });
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
