import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { MessengerCta } from "@/components/MessengerCta";
import { getSiteSettings } from "@/lib/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты центра установки охранных систем и дооснащения автомобилей в Твери."
};

export default function ContactsPage() {
  const settings = getSiteSettings();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-8">
      <section className="glass glow rounded-3xl p-8">
        <h1 className="text-3xl font-bold md:text-4xl">Контакты</h1>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="glass rounded-2xl p-6 space-y-2 text-slate-200">
          <p><b>Телефон:</b> <a href={`tel:${settings.phone}`} className="text-cyan-200">{settings.phone}</a></p>
          <p><b>Email:</b> <a href={`mailto:${settings.email}`} className="text-cyan-200">{settings.email}</a></p>
          <p><b>Адрес:</b> {settings.address}</p>
          <p><b>Часы работы:</b> {settings.work_hours}</p>
        </article>

        <article className="glass rounded-2xl p-3 overflow-hidden">
          <div className="rounded-xl overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.map_iframe }} />
        </article>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Форма записи</h2>
        <MessengerCta whatsappUrl={settings.whatsapp_url} telegramUrl={settings.telegram_url} />
        <ContactForm />
      </section>
    </div>
  );
}
