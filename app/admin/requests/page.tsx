import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";
import type { ContactRequest } from "@/lib/types";
import { getSiteSettings, listContactRequestsFiltered } from "@/lib/repository";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: {
    status?: string;
    tag?: string;
    q?: string;
    updated?: string;
    error?: string;
  };
};

function toYesNo(value: number): string {
  return value ? "Да" : "Нет";
}

function startTypeLabel(value: string): string {
  if (value === "button") {
    return "С кнопки";
  }
  if (value === "key") {
    return "С ключа";
  }
  return "Не указано";
}

function selectionStageLabel(value: string): string {
  if (value === "chosen") {
    return "Уже выбрал";
  }
  if (value === "consultation") {
    return "Нужна консультация";
  }
  return "Не указано";
}

function desiredSlotLabel(value: string): string {
  if (value === "today") {
    return "Сегодня";
  }
  if (value === "tomorrow") {
    return "Завтра";
  }
  if (value === "week") {
    return "На неделе";
  }
  if (value === "call") {
    return "По звонку";
  }
  return "Не указано";
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

function statusClass(value: string): string {
  if (value === "in_progress") {
    return "border-amber-500/40 bg-amber-50 text-amber-700";
  }
  if (value === "closed") {
    return "border-emerald-500/40 bg-emerald-50 text-emerald-700";
  }
  return "border-sky-500/40 bg-sky-50 text-sky-700";
}

function featuresLabel(value: string): string {
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
      return "Не выбрано";
    }
    return parsed.map((item) => map[item] || item).join(", ");
  } catch {
    return "Не выбрано";
  }
}

function getFilterValue(value: string | undefined, fallback: string): string {
  if (!value || value.trim().length === 0) {
    return fallback;
  }
  return value.trim();
}

function parseStatus(value: string): "all" | "new" | "in_progress" | "closed" {
  if (value === "new" || value === "in_progress" || value === "closed") {
    return value;
  }
  return "all";
}

function parseTag(value: string): "all" | "warranty" | "autostart" | "consultation" | "sla_overdue" {
  if (value === "warranty" || value === "autostart" || value === "consultation" || value === "sla_overdue") {
    return value;
  }
  return "all";
}

function isSlaOverdue(request: ContactRequest): boolean {
  if (request.status !== "new") {
    return false;
  }
  return Date.parse(request.created_at) <= Date.now() - 15 * 60 * 1000;
}

function buildRequestTags(request: ContactRequest): string[] {
  const tags: string[] = [];
  if (request.is_under_warranty) {
    tags.push("Гарантия");
  }
  if (request.needs_autostart) {
    tags.push("Автозапуск");
  }
  if (request.selection_stage === "consultation") {
    tags.push("Консультация");
  }
  if (isSlaOverdue(request)) {
    tags.push("SLA > 15 минут");
  }
  return tags;
}

function renderTemplate(template: string, request: ContactRequest, centerName: string): string {
  const replacements: Record<string, string> = {
    id: String(request.id),
    name: request.name,
    phone: request.phone,
    car_brand: request.car_brand,
    car_model: request.car_model,
    car_year: String(request.car_year),
    features: featuresLabel(request.features_json),
    center_name: centerName
  };

  return template.replace(/\{([a-z_]+)\}/gi, (_, key: string) => replacements[key] || "");
}

function normalizeWhatsappPhone(input: string): string {
  const digits = input.replace(/\D+/g, "");
  if (digits.length === 11 && digits.startsWith("8")) {
    return `7${digits.slice(1)}`;
  }
  return digits;
}

export default async function AdminRequestsPage({ searchParams }: Props) {
  await requireAdminPage();
  const status = parseStatus(getFilterValue(searchParams?.status, "all"));
  const tag = parseTag(getFilterValue(searchParams?.tag, "all"));
  const query = getFilterValue(searchParams?.q, "");
  const settings = getSiteSettings();

  const requests = listContactRequestsFiltered({
    status,
    tag,
    query
  });

  const filterParams = new URLSearchParams();
  if (status && status !== "all") {
    filterParams.set("status", status);
  }
  if (tag && tag !== "all") {
    filterParams.set("tag", tag);
  }
  if (query) {
    filterParams.set("q", query);
  }
  const redirectPath = `/admin/requests${filterParams.toString() ? `?${filterParams.toString()}` : ""}`;
  const exportHref = `/api/admin/requests/export${filterParams.toString() ? `?${filterParams.toString()}` : ""}`;

  return (
    <AdminShell title="Заявки с формы записи">
      <form className="glass rounded-2xl p-4 grid gap-3 md:grid-cols-[160px_170px_1fr_auto_auto]" method="get" action="/admin/requests">
        <select name="status" defaultValue={status}>
          <option value="all">Все статусы</option>
          <option value="new">Новые</option>
          <option value="in_progress">В работе</option>
          <option value="closed">Закрытые</option>
        </select>
        <select name="tag" defaultValue={tag}>
          <option value="all">Все теги</option>
          <option value="warranty">Гарантия</option>
          <option value="autostart">Автозапуск</option>
          <option value="consultation">Консультация</option>
          <option value="sla_overdue">SLA &gt; 15 мин</option>
        </select>
        <input name="q" defaultValue={query} placeholder="Поиск: имя, телефон, авто" />
        <button className="primary-btn font-semibold" type="submit">
          Применить
        </button>
        <a href={exportHref} className="ghost-btn text-center">
          Экспорт CSV
        </a>
      </form>

      {searchParams?.updated ? <p className="text-sm text-emerald-200">Статус заявки обновлён.</p> : null}
      {searchParams?.error ? <p className="text-sm text-rose-300">Ошибка: не удалось выполнить действие.</p> : null}

      <div className="space-y-3">
        {requests.length === 0 ? <p className="text-slate-300">Пока заявок нет.</p> : null}

        {requests.map((request) => (
          <article key={request.id} className="glass rounded-2xl p-4">
            {(() => {
              const quickTags = buildRequestTags(request);
              return quickTags.length > 0 ? (
                <div className="mb-2 flex flex-wrap gap-2">
                  {quickTags.map((item) => (
                    <span key={item} className="rounded-full border border-slate-300/70 bg-white/80 px-2 py-1 text-xs text-slate-700">
                      {item}
                    </span>
                  ))}
                </div>
              ) : null;
            })()}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">
                #{request.id} {request.name} — {request.phone}
              </h2>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(request.status)}`}>
                  {statusLabel(request.status)}
                </span>
                <p className="text-xs text-slate-400">{new Date(request.created_at).toLocaleString("ru-RU")}</p>
              </div>
            </div>
            <div className="mt-2 grid gap-2 text-sm text-slate-200 md:grid-cols-2">
              <p><b>Авто:</b> {request.car_brand} {request.car_model}, {request.car_year}</p>
              <p><b>Запуск:</b> {startTypeLabel(request.start_type)}</p>
              <p><b>На гарантии:</b> {toYesNo(request.is_under_warranty)}</p>
              <p><b>Функции:</b> {featuresLabel(request.features_json)}</p>
              <p><b>Демонтаж старой:</b> {toYesNo(request.needs_old_demount)}</p>
              <p><b>Статус выбора:</b> {selectionStageLabel(request.selection_stage)}</p>
              <p><b>Желаемый слот:</b> {desiredSlotLabel(request.desired_slot)}</p>
              <p><b>IP:</b> {request.ip}</p>
            </div>
            {request.comment ? <p className="mt-2 text-sm text-slate-300"><b>Комментарий:</b> {request.comment}</p> : null}

            <form method="post" action={`/api/admin/requests/${request.id}/status`} className="mt-3 flex flex-wrap gap-2">
              <input type="hidden" name="redirect" value={redirectPath} />
              <button type="submit" name="status" value="new" className="ghost-btn text-xs" disabled={request.status === "new"}>
                Новая
              </button>
              <button
                type="submit"
                name="status"
                value="in_progress"
                className="ghost-btn text-xs"
                disabled={request.status === "in_progress"}
              >
                В работе
              </button>
              <button type="submit" name="status" value="closed" className="ghost-btn text-xs" disabled={request.status === "closed"}>
                Закрыта
              </button>
            </form>

            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <a
                className="ghost-btn text-center text-xs"
                target="_blank"
                rel="noreferrer"
                href={`https://wa.me/${normalizeWhatsappPhone(request.phone)}?text=${encodeURIComponent(
                  renderTemplate(settings.whatsapp_template, request, settings.center_name)
                )}`}
              >
                WhatsApp
              </a>
              <a
                className="ghost-btn text-center text-xs"
                target="_blank"
                rel="noreferrer"
                href={`https://t.me/share/url?url=${encodeURIComponent(process.env.SITE_URL || "")}&text=${encodeURIComponent(
                  renderTemplate(settings.telegram_template, request, settings.center_name)
                )}`}
              >
                Telegram
              </a>
              <details className="glass rounded-xl p-2">
                <summary className="cursor-pointer text-xs font-semibold">Скрипт звонка</summary>
                <p className="mt-2 whitespace-pre-line text-xs text-slate-300">
                  {renderTemplate(settings.call_template, request, settings.center_name)}
                </p>
              </details>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
