type Props = {
  whatsappUrl?: string;
  telegramUrl?: string;
};

export function MessengerCta({ whatsappUrl, telegramUrl }: Props) {
  const hasWhatsapp = Boolean(whatsappUrl);
  const hasTelegram = Boolean(telegramUrl);

  if (!hasWhatsapp && !hasTelegram) {
    return null;
  }

  return (
    <aside className="glass glow rounded-2xl p-4 md:p-5">
      <p className="text-sm font-semibold text-slate-100">Быстрая связь</p>
      <p className="mt-1 text-sm text-slate-300">Напишите нам в мессенджер, чтобы уточнить детали до отправки заявки.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {hasWhatsapp ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-emerald-600/45 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:-translate-y-0.5"
          >
            WhatsApp
          </a>
        ) : null}

        {hasTelegram ? (
          <a
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-sky-600/45 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:-translate-y-0.5"
          >
            Telegram
          </a>
        ) : null}
      </div>
    </aside>
  );
}
