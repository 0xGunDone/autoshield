import { NextResponse } from "next/server";
import { ensureAdminOrReject } from "@/lib/admin-route";
import { isJsonRequest, redirectTo } from "@/lib/api";
import { ensureBodySize, HttpError, parseJsonBody } from "@/lib/http";
import { deleteReview, getReviewById, updateReview } from "@/lib/repository";
import { reviewSchema } from "@/lib/validators";

export const runtime = "nodejs";

type Params = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: Params) {
  const authError = await ensureAdminOrReject(request, "/admin/reviews");
  if (authError) {
    return authError;
  }

  const id = Number(params.id);
  const current = getReviewById(id);
  if (!current) {
    return redirectTo(request, "/admin/reviews", { error: "not-found" });
  }

  try {
    ensureBodySize(request);
    const formData = await request.formData();
    const action = String(formData.get("_action") || "update");

    if (action === "delete") {
      deleteReview(id);
      return redirectTo(request, "/admin/reviews", { deleted: "1" });
    }

    const raw = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, typeof value === "string" ? value : value.name])
    );

    const parsed = reviewSchema.safeParse(raw);
    if (!parsed.success) {
      return redirectTo(request, `/admin/reviews/${id}/edit`, { error: parsed.error.issues[0]?.message || "validation" });
    }

    const payload = parsed.data;

    updateReview(id, {
      author: payload.author,
      text: payload.text,
      rating: payload.rating
    });

    return redirectTo(request, "/admin/reviews", { saved: "1" });
  } catch {
    return redirectTo(request, `/admin/reviews/${id}/edit`, { error: "save" });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const authError = await ensureAdminOrReject(request, "/admin/reviews");
  if (authError) {
    return authError;
  }

  const id = Number(params.id);
  const current = getReviewById(id);
  if (!current) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const payload = await parseJsonBody(request, reviewSchema);

    updateReview(id, {
      author: payload.author,
      text: payload.text,
      rating: payload.rating
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const authError = await ensureAdminOrReject(request, "/admin/reviews");
  if (authError) {
    return authError;
  }

  const id = Number(params.id);
  const current = getReviewById(id);
  if (!current) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  deleteReview(id);
  return NextResponse.json({ ok: true });
}
