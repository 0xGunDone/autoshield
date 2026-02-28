import { NextResponse } from "next/server";
import { ensureAdminOrReject } from "@/lib/admin-route";
import { isJsonRequest, redirectTo } from "@/lib/api";
import { ensureBodySize, HttpError, parseJsonBody } from "@/lib/http";
import { logApiError } from "@/lib/logger";
import { deletePricing, getPricingById, updatePricing } from "@/lib/repository";
import { pricingSchema } from "@/lib/validators";

export const runtime = "nodejs";

type Params = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: Params) {
  const authError = await ensureAdminOrReject(request, "/admin/pricing");
  if (authError) {
    return authError;
  }

  const id = Number(params.id);
  const current = getPricingById(id);
  if (!current) {
    return redirectTo(request, "/admin/pricing", { error: "not-found" });
  }

  try {
    ensureBodySize(request);
    const formData = await request.formData();
    const action = String(formData.get("_action") || "update");

    if (action === "delete") {
      deletePricing(id);
      return redirectTo(request, "/admin/pricing", { deleted: "1" });
    }

    const raw = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, typeof value === "string" ? value : value.name])
    );

    const parsed = pricingSchema.safeParse(raw);
    if (!parsed.success) {
      return redirectTo(request, `/admin/pricing/${id}/edit`, { error: parsed.error.issues[0]?.message || "validation" });
    }

    const payload = parsed.data;

    updatePricing(id, {
      title: payload.title,
      price_from: payload.price_from,
      comment: payload.comment,
      sort_order: payload.sort_order
    });

    return redirectTo(request, "/admin/pricing", { saved: "1" });
  } catch (error) {
    logApiError("api/admin/pricing:update-form", error, { id });
    return redirectTo(request, `/admin/pricing/${id}/edit`, { error: "save" });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const authError = await ensureAdminOrReject(request, "/admin/pricing");
  if (authError) {
    return authError;
  }

  const id = Number(params.id);
  const current = getPricingById(id);
  if (!current) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const payload = await parseJsonBody(request, pricingSchema);

    updatePricing(id, {
      title: payload.title,
      price_from: payload.price_from,
      comment: payload.comment,
      sort_order: payload.sort_order
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    logApiError("api/admin/pricing:update-json", error, { id });
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const authError = await ensureAdminOrReject(request, "/admin/pricing");
  if (authError) {
    return authError;
  }

  const id = Number(params.id);
  const current = getPricingById(id);
  if (!current) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  deletePricing(id);
  return NextResponse.json({ ok: true });
}
