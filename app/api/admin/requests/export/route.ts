import { NextResponse } from "next/server";
import { ensureAdminOrReject } from "@/lib/admin-route";
import { listContactRequestsFiltered } from "@/lib/repository";

export const runtime = "nodejs";

function csvEscape(value: string | number): string {
  const raw = String(value ?? "");
  if (raw.includes(",") || raw.includes("\"") || raw.includes("\n") || raw.includes("\r")) {
    return `"${raw.replace(/"/g, "\"\"")}"`;
  }
  return raw;
}

function formatFeatures(value: string): string {
  const map: Record<string, string> = {
    autostart: "Автозапуск",
    remote: "С пульта",
    phone: "С телефона",
    gsm: "GSM",
    gps: "GPS",
    unsure: "Затрудняюсь"
  };

  try {
    const parsed = JSON.parse(value) as string[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return "";
    }
    return parsed.map((item) => map[item] || item).join(", ");
  } catch {
    return "";
  }
}

function statusLabel(value: string): string {
  if (value === "in_progress") {
    return "В работе";
  }
  if (value === "closed") {
    return "Закрыта";
  }
  return "Новая";
}

export async function GET(request: Request) {
  const authError = await ensureAdminOrReject(request, "/admin/requests");
  if (authError) {
    return authError;
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status") || "all";
  const status: "all" | "new" | "in_progress" | "closed" =
    statusParam === "new" || statusParam === "in_progress" || statusParam === "closed" ? statusParam : "all";
  const query = searchParams.get("q") || "";

  const requests = listContactRequestsFiltered({ status, query });

  const headers = [
    "ID",
    "Дата",
    "Статус",
    "Имя",
    "Телефон",
    "Марка",
    "Модель",
    "Год",
    "Запуск",
    "На гарантии",
    "Функции",
    "Демонтаж",
    "Выбор",
    "Желаемый слот",
    "IP"
  ];

  const lines = [
    headers.map(csvEscape).join(","),
    ...requests.map((item) =>
      [
        item.id,
        item.created_at,
        statusLabel(item.status),
        item.name,
        item.phone,
        item.car_brand,
        item.car_model,
        item.car_year,
        item.start_type,
        item.is_under_warranty ? "Да" : "Нет",
        formatFeatures(item.features_json),
        item.needs_old_demount ? "Да" : "Нет",
        item.selection_stage,
        item.desired_slot,
        item.ip
      ]
        .map(csvEscape)
        .join(",")
    )
  ];

  const csv = `\uFEFF${lines.join("\n")}`;
  const filenameDate = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="requests-${filenameDate}.csv"`,
      "Cache-Control": "no-store"
    }
  });
}
