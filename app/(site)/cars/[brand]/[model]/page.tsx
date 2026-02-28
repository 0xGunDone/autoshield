import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { MessengerCta } from "@/components/MessengerCta";
import { findCarPage } from "@/lib/car-pages";
import { buildAlternates } from "@/lib/seo";
import { getSiteSettings, listServices } from "@/lib/repository";

type Props = {
  params: {
    brand: string;
    model: string;
  };
};

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: Props): Metadata {
  const carPage = findCarPage(params.brand, params.model);
  if (!carPage) {
    return { title: "Страница не найдена" };
  }

  const title = `Сигнализация на ${carPage.brand} ${carPage.model} в Твери`;
  const description = `Подбор и установка охранных систем на ${carPage.brand} ${carPage.model} (${carPage.years}). Автозапуск, GSM/GPS, консультация и монтаж.`;
  const canonicalPath = `/cars/${carPage.brandSlug}/${carPage.modelSlug}`;

  return {
    title,
    description,
    alternates: buildAlternates(canonicalPath),
    openGraph: {
      title,
      description,
      type: "article"
    }
  };
}

export default function CarModelPage({ params }: Props) {
  const carPage = findCarPage(params.brand, params.model);
  if (!carPage) {
    notFound();
  }

  const settings = getSiteSettings();
  const services = listServices().slice(0, 6);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Установка сигнализации на ${carPage.brand} ${carPage.model}`,
    areaServed: "Тверь",
    provider: {
      "@type": "AutoRepair",
      name: settings.center_name,
      telephone: settings.phone
    },
    description: `Подбор и установка охранной системы на ${carPage.brand} ${carPage.model}.`,
    offers: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title
      },
      priceCurrency: "RUB",
      priceSpecification: service.price_from
    }))
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-8">
      <section className="glass glow rounded-3xl p-8">
        <p className="hero-kicker">{carPage.brand}</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">{carPage.model}</h1>
        <p className="mt-3 text-sm text-slate-300">Рекомендуемые годы: {carPage.years}</p>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold">Что обычно важно владельцам {carPage.brand} {carPage.model}</h2>
        <ul className="mt-3 grid gap-2 text-slate-200 md:grid-cols-3">
          {carPage.painPoints.map((item) => (
            <li key={item} className="rounded-xl border border-slate-200/60 bg-white/75 p-3 text-sm">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Популярные комплексы</h2>
          <Link href="/services" className="text-sm text-cyan-200 hover:text-cyan-100">
            Все услуги
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="glass hover-lift rounded-2xl p-4">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-slate-200">{service.short_description}</p>
              <p className="mt-3 text-sm font-semibold text-cyan-200">{service.price_from}</p>
              <Link href={`/services/${service.slug}`} className="mt-3 inline-block text-sm text-cyan-200 hover:text-cyan-100">
                Подробнее →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3" id="contact-form">
        <h2 className="text-2xl font-bold">Запись на установку</h2>
        <MessengerCta whatsappUrl={settings.whatsapp_url} telegramUrl={settings.telegram_url} />
        <ContactForm />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
