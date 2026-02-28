import { NextResponse } from "next/server";
import { logApiError } from "@/lib/logger";
import { sendTelegramSlaAlert } from "@/lib/mailer";
import { listSlaOverdueRequests, markContactRequestSlaAlertSent } from "@/lib/repository";

export const runtime = "nodejs";

function hasAccess(request: Request): boolean {
  const secret = process.env.INTERNAL_CRON_SECRET || "";
  if (!secret) {
    return false;
  }

  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token") || "";
  const headerToken = request.headers.get("x-cron-token") || "";
  return queryToken === secret || headerToken === secret;
}

export async function POST(request: Request) {
  if (!hasAccess(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const overdue = listSlaOverdueRequests(15);
  let sent = 0;

  for (const item of overdue) {
    try {
      await sendTelegramSlaAlert(item);
      markContactRequestSlaAlertSent(item.id);
      sent += 1;
    } catch (error) {
      logApiError("api/internal/sla", error, { requestId: item.id });
    }
  }

  return NextResponse.json({ ok: true, overdue: overdue.length, sent });
}
