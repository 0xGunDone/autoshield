import { NextResponse } from "next/server";
import { ensureAdminOrReject } from "@/lib/admin-route";
import { isJsonRequest, redirectTo } from "@/lib/api";
import { ensureBodySize, HttpError, parseJsonBody } from "@/lib/http";
import { countSlug, deleteService, getServiceById, updateService } from "@/lib/repository";
import { slugify } from "@/lib/slug";
import { serviceSchema } from "@/lib/validators";

export const runtime = "nodejs";

type Params = {
  params: {
    id: string;
  };
};

function makeUniqueSlug(base: string, excludeId: number): string {
  let attempt = base;
  let index = 2;

  while (countSlug(attempt, excludeId) > 0) {
    attempt = `${base}-${index}`;
    index += 1;
  }

  return attempt;
}

export async function POST(request: Request, { params }: Params) {
  const authError = await ensureAdminOrReject(request, "/admin/services");
  if (authError) {
    return authError;
  }

  const id = Number(params.id);
  const current = getServiceById(id);
  if (!current) {
    return redirectTo(request, "/admin/services", { error: "not-found" });
  }

  try {
    ensureBodySize(request);
    const formData = await request.formData();
    const action = String(formData.get("_action") || "update");

    if (action === "delete") {
      deleteService(id);
      return redirectTo(request, "/admin/services", { deleted: "1" });
    }

    const raw = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, typeof value === "string" ? value : value.name])
    );

    const parsed = serviceSchema.safeParse(raw);
    if (!parsed.success) {
      return redirectTo(request, `/admin/services/${id}/edit`, { error: parsed.error.issues[0]?.message || "validation" });
    }

    const payload = parsed.data;
    const baseSlug = slugify(payload.slug || payload.title);
    const finalSlug = makeUniqueSlug(baseSlug, id);

    updateService(id, {
      title: payload.title,
      short_description: payload.short_description,
      description: payload.description,
      price_from: payload.price_from,
      image_url: payload.image_url,
      seo_title: payload.seo_title,
      seo_description: payload.seo_description,
      slug: finalSlug
    });

    return redirectTo(request, "/admin/services", { saved: "1" });
  } catch {
    return redirectTo(request, `/admin/services/${id}/edit`, { error: "save" });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const authError = await ensureAdminOrReject(request, "/admin/services");
  if (authError) {
    return authError;
  }

  const id = Number(params.id);
  const current = getServiceById(id);
  if (!current) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const payload = await parseJsonBody(request, serviceSchema);
    const baseSlug = slugify(payload.slug || payload.title);
    const finalSlug = makeUniqueSlug(baseSlug, id);

    updateService(id, {
      title: payload.title,
      short_description: payload.short_description,
      description: payload.description,
      price_from: payload.price_from,
      image_url: payload.image_url,
      seo_title: payload.seo_title,
      seo_description: payload.seo_description,
      slug: finalSlug
    });

    return NextResponse.json({ ok: true, slug: finalSlug });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const authError = await ensureAdminOrReject(request, "/admin/services");
  if (authError) {
    return authError;
  }

  const id = Number(params.id);
  const current = getServiceById(id);
  if (!current) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  deleteService(id);
  return NextResponse.json({ ok: true });
}
