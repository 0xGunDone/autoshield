import { NextResponse } from "next/server";
import { ensureAdminOrReject } from "@/lib/admin-route";
import { isJsonRequest, redirectTo } from "@/lib/api";
import { HttpError, parseFormBody, parseJsonBody } from "@/lib/http";
import { logApiError } from "@/lib/logger";
import { createReview } from "@/lib/repository";
import { reviewSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authError = await ensureAdminOrReject(request, "/admin/reviews");
  if (authError) {
    return authError;
  }

  const jsonRequest = isJsonRequest(request);

  try {
    const payload = jsonRequest ? await parseJsonBody(request, reviewSchema) : await parseFormBody(request, reviewSchema);

    const id = createReview({
      author: payload.author,
      text: payload.text,
      rating: payload.rating
    });

    if (jsonRequest) {
      return NextResponse.json({ ok: true, id });
    }

    return redirectTo(request, "/admin/reviews", { saved: "1" });
  } catch (error) {
    if (error instanceof HttpError) {
      if (jsonRequest) {
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      return redirectTo(request, "/admin/reviews/new", { error: error.message });
    }

    logApiError("api/admin/reviews:create", error, { jsonRequest });
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
