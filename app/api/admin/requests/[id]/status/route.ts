import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureAdminOrReject } from "@/lib/admin-route";
import { isJsonRequest, redirectTo } from "@/lib/api";
import { ensureBodySize, HttpError, parseJsonBody } from "@/lib/http";
import { logApiError } from "@/lib/logger";
import { getContactRequestById, updateContactRequestStatus } from "@/lib/repository";

export const runtime = "nodejs";

const statusSchema = z.object({
  status: z.enum(["new", "in_progress", "closed"]),
  redirect: z.string().max(500).optional().default("/admin/requests")
});

type Params = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: Params) {
  const authError = await ensureAdminOrReject(request, "/admin/requests");
  if (authError) {
    return authError;
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0 || !getContactRequestById(id)) {
    return redirectTo(request, "/admin/requests", { error: "not-found" });
  }

  const jsonRequest = isJsonRequest(request);

  try {
    if (jsonRequest) {
      const payload = await parseJsonBody(request, statusSchema);
      updateContactRequestStatus(id, payload.status);
      return NextResponse.json({ ok: true });
    }

    ensureBodySize(request, 30_000);
    const formData = await request.formData();
    const parsed = statusSchema.safeParse({
      status: String(formData.get("status") || ""),
      redirect: String(formData.get("redirect") || "/admin/requests")
    });

    if (!parsed.success) {
      return redirectTo(request, "/admin/requests", { error: "validation" });
    }

    updateContactRequestStatus(id, parsed.data.status);

    const fallbackRedirect = "/admin/requests";
    const redirectPath = parsed.data.redirect.startsWith("/") ? parsed.data.redirect : fallbackRedirect;
    return redirectTo(request, redirectPath, { updated: "1" });
  } catch (error) {
    if (error instanceof HttpError) {
      if (jsonRequest) {
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      return redirectTo(request, "/admin/requests", { error: "validation" });
    }

    logApiError("api/admin/requests/status", error, { id, jsonRequest });
    if (jsonRequest) {
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
    return redirectTo(request, "/admin/requests", { error: "save" });
  }
}
