import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { MessengerCta } from "@/components/MessengerCta";
import { buildAlternates } from "@/lib/seo";
import { getSiteSettings } from "@/lib/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Подбор сигнализации",
  description: "Пошаговый опрос для подбора охранного комплекса под ваш автомобиль и задачи.",
  alternates: buildAlternates("/quiz"),
  openGraph: {
    title: "Подбор сигнализации",
    description: "Пройдите опрос и получите рекомендацию по сигнализации с установкой в Твери.",
    type: "website"
  }
};

export default function QuizPage() {
  const settings = getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pb-8">
      <section className="glass glow rounded-3xl p-8">
        <p className="hero-kicker">Квиз</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Подбор сигнализации по шагам</h1>
        <p className="mt-3 text-slate-200">
          Ответьте на несколько вопросов и оставьте контакты. Мы подберем подходящий комплекс и согласуем удобное время установки.
        </p>
      </section>

      <MessengerCta whatsappUrl={settings.whatsapp_url} telegramUrl={settings.telegram_url} />
      <ContactForm />
    </div>
  );
}
