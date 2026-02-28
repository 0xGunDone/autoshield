import nodemailer from "nodemailer";
import { getSiteSettings } from "@/lib/repository";
import type { ContactRequest } from "@/lib/types";

function toYesNo(value: number): string {
  return value ? "Да" : "Нет";
}

function formatStartType(value: string): string {
  if (value === "button") {
    return "С кнопки";
  }
  if (value === "key") {
    return "С ключа";
  }
  return "Не указано";
}

function formatSelectionStage(value: string): string {
  if (value === "chosen") {
    return "Уже выбрал сигнализацию";
  }
  if (value === "consultation") {
    return "Нужна консультация";
  }
  return "Не указано";
}

function formatDesiredSlot(value: string): string {
  if (value === "today") {
    return "Сегодня";
  }
  if (value === "tomorrow") {
    return "Завтра";
  }
  if (value === "week") {
    return "На этой неделе";
  }
  if (value === "call") {
    return "Уточнить по звонку";
  }
  return "Не указано";
}

function formatFeatures(value: string): string {
  const map: Record<string, string> = {
    autostart: "Автозапуск",
    remote: "Управление с пульта",
    phone: "Управление с телефона",
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

export async function sendContactRequestEmail(request: ContactRequest): Promise<void> {
  const settings = getSiteSettings();

  if (!settings.smtp_user || !settings.smtp_password) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: settings.smtp_host,
    port: settings.smtp_port,
    secure: Boolean(settings.smtp_secure),
    auth: {
      user: settings.smtp_user,
      pass: settings.smtp_password
    }
  });

  const html = `
    <h2>Новая заявка с сайта ${settings.center_name}</h2>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse;">
      <tr><td><b>Имя</b></td><td>${request.name}</td></tr>
      <tr><td><b>Телефон</b></td><td>${request.phone}</td></tr>
      <tr><td><b>Марка</b></td><td>${request.car_brand}</td></tr>
      <tr><td><b>Модель</b></td><td>${request.car_model}</td></tr>
      <tr><td><b>Год</b></td><td>${request.car_year}</td></tr>
      <tr><td><b>Запуск двигателя</b></td><td>${formatStartType(request.start_type)}</td></tr>
      <tr><td><b>Авто на гарантии</b></td><td>${toYesNo(request.is_under_warranty)}</td></tr>
      <tr><td><b>Нужные функции</b></td><td>${formatFeatures(request.features_json)}</td></tr>
      <tr><td><b>Демонтаж старой системы</b></td><td>${toYesNo(request.needs_old_demount)}</td></tr>
      <tr><td><b>Статус выбора</b></td><td>${formatSelectionStage(request.selection_stage)}</td></tr>
      <tr><td><b>Желаемый слот</b></td><td>${formatDesiredSlot(request.desired_slot)}</td></tr>
      <tr><td><b>IP</b></td><td>${request.ip}</td></tr>
      <tr><td><b>Время</b></td><td>${request.created_at}</td></tr>
    </table>
  `;

  await transporter.sendMail({
    from: settings.smtp_user,
    to: settings.request_email,
    subject: `Новая заявка: ${request.name}`,
    html
  });
}

export async function sendTelegramRequestNotification(request: ContactRequest): Promise<void> {
  const settings = getSiteSettings();

  if (!settings.telegram_bot_token || !settings.telegram_chat_id) {
    return;
  }

  const text = [
    `Новая заявка (${settings.center_name})`,
    `Имя: ${request.name}`,
    `Телефон: ${request.phone}`,
    `Авто: ${request.car_brand} ${request.car_model}, ${request.car_year}`,
    `Запуск: ${formatStartType(request.start_type)}`,
    `Гарантия: ${toYesNo(request.is_under_warranty)}`,
    `Функции: ${formatFeatures(request.features_json)}`,
    `Демонтаж: ${toYesNo(request.needs_old_demount)}`,
    `Статус выбора: ${formatSelectionStage(request.selection_stage)}`,
    `Слот: ${formatDesiredSlot(request.desired_slot)}`
  ].join("\n");

  await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: settings.telegram_chat_id,
      text
    })
  });
}

export async function sendTelegramSlaAlert(request: ContactRequest): Promise<void> {
  const settings = getSiteSettings();

  if (!settings.telegram_bot_token || !settings.telegram_chat_id) {
    return;
  }

  const ageMinutes = Math.max(0, Math.floor((Date.now() - Date.parse(request.created_at)) / 60_000));

  const text = [
    "SLA ALERT: новая заявка без ответа",
    `Заявка: #${request.id}`,
    `Возраст: ${ageMinutes} мин`,
    `Имя: ${request.name}`,
    `Телефон: ${request.phone}`,
    `Авто: ${request.car_brand} ${request.car_model}, ${request.car_year}`
  ].join("\n");

  await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: settings.telegram_chat_id,
      text
    })
  });
}
