import { NextResponse } from "next/server";
import { getClientIp, HttpError, parseJsonBody } from "@/lib/http";
import { logApiError } from "@/lib/logger";
import { sendContactRequestEmail, sendTelegramRequestNotification } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { createContactRequest, getContactRequestById } from "@/lib/repository";
import { contactRequestSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ message: "Слишком много запросов. Попробуйте позже." }, { status: 429 });
  }

  try {
    const payload = await parseJsonBody(request, contactRequestSchema);

    if (payload.honeypot) {
      return NextResponse.json({ ok: true });
    }
    const hasAutostart = payload.features.includes("autostart");

    const requestId = createContactRequest({
      name: payload.name,
      phone: payload.phone,
      car_brand: payload.car_brand,
      car_model: payload.car_model,
      car_year: payload.car_year,
      start_type: payload.start_type,
      is_under_warranty: payload.is_under_warranty === "yes" ? 1 : 0,
      features_json: JSON.stringify(payload.features),
      needs_old_demount: payload.needs_old_demount === "yes" ? 1 : 0,
      selection_stage: payload.selection_stage,
      desired_slot: payload.desired_slot,
      status: "new",
      service_id: null,
      service_name: "Подбор сигнализации",
      comment: "",
      needs_autostart: hasAutostart ? 1 : 0,
      consent: 1,
      ip
    });

    const savedRequest = getContactRequestById(requestId);
    if (savedRequest) {
      try {
        await sendContactRequestEmail(savedRequest);
      } catch {
        // Ошибка отправки письма не должна ломать прием заявки.
      }

      try {
        await sendTelegramRequestNotification(savedRequest);
      } catch {
        // Ошибка уведомления в Telegram не должна ломать прием заявки.
      }
    }

    return NextResponse.json({ ok: true, message: "Заявка принята" });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    logApiError("api/contact", error, { ip });
    return NextResponse.json({ message: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
