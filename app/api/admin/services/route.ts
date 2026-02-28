import { NextResponse } from "next/server";
import { ensureAdminOrReject } from "@/lib/admin-route";
import { isJsonRequest, redirectTo } from "@/lib/api";
import { HttpError, parseFormBody, parseJsonBody } from "@/lib/http";
import { countSlug, createService } from "@/lib/repository";
import { slugify } from "@/lib/slug";
import { serviceSchema } from "@/lib/validators";

export const runtime = "nodejs";

function makeUniqueSlug(base: string): string {
  let attempt = base;
  let index = 2;

  while (countSlug(attempt) > 0) {
    attempt = `${base}-${index}`;
    index += 1;
  }

  return attempt;
}

export async function POST(request: Request) {
  const authError = await ensureAdminOrReject(request, "/admin/services");
  if (authError) {
    return authError;
  }

  const jsonRequest = isJsonRequest(request);

  try {
    const payload = jsonRequest ? await parseJsonBody(request, serviceSchema) : await parseFormBody(request, serviceSchema);

    const normalizedSlug = slugify(payload.slug || payload.title);
    const finalSlug = makeUniqueSlug(normalizedSlug);

    const id = createService({
      title: payload.title,
      short_description: payload.short_description,
      description: payload.description,
      price_from: payload.price_from,
      image_url: payload.image_url,
      seo_title: payload.seo_title,
      seo_description: payload.seo_description,
      slug: finalSlug
    });

    if (jsonRequest) {
      return NextResponse.json({ ok: true, id, slug: finalSlug });
    }

    return redirectTo(request, "/admin/services", { saved: "1" });
  } catch (error) {
    if (error instanceof HttpError) {
      if (jsonRequest) {
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      return redirectTo(request, "/admin/services/new", { error: error.message });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
