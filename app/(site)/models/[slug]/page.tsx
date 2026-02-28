import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { MessengerCta } from "@/components/MessengerCta";
import { findServiceModelPageBySlug } from "@/lib/model-pages";
import { buildAlternates } from "@/lib/seo";
import { getSiteSettings, listServices } from "@/lib/repository";

type Props = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: Props): Metadata {
  const modelPage = findServiceModelPageBySlug(listServices(), params.slug);
  if (!modelPage) {
    return { title: "Модель не найдена" };
  }

  const title = `${modelPage.title} в Твери - установка от ${modelPage.minPriceLabel}`;
  const description = `${modelPage.description} Цена от ${modelPage.minPriceLabel}. Профессиональная установка и поддержка.`;

  return {
    title,
    description,
    alternates: buildAlternates(`/models/${modelPage.slug}`),
    openGraph: {
      title,
      description,
      type: "article"
    }
  };
}

export default function ModelPage({ params }: Props) {
  const modelPage = findServiceModelPageBySlug(listServices(), params.slug);
  if (!modelPage) {
    notFound();
  }

  const settings = getSiteSettings();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${modelPage.title} установка`,
    description: modelPage.description,
    areaServed: "Тверь",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: modelPage.title,
      itemListElement: modelPage.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.short_description
        },
        priceCurrency: "RUB",
        priceSpecification: service.price_from
      }))
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-8">
      <section className="glass glow rounded-3xl p-8">
        <p className="hero-kicker">Модель</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">{modelPage.title}</h1>
        <p className="mt-3 text-slate-200">{modelPage.description}</p>
        <p className="mt-4 text-sm font-semibold text-cyan-200">Цена от: {modelPage.minPriceLabel}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {modelPage.services.map((service) => (
          <article key={service.id} className="glass hover-lift rounded-2xl overflow-hidden">
            <Image
              src={service.image_url}
              alt={service.title}
              width={640}
              height={360}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-44 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{service.title}</h2>
              <p className="mt-2 text-sm text-slate-200">{service.short_description}</p>
              <p className="mt-3 text-sm font-semibold text-cyan-200">{service.price_from}</p>
              <Link href={`/services/${service.slug}`} className="mt-3 inline-block text-sm text-cyan-200 hover:text-cyan-100">
                Перейти к услуге →
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section id="contact-form" className="space-y-3">
        <h2 className="text-2xl font-bold">Запись на установку</h2>
        <MessengerCta whatsappUrl={settings.whatsapp_url} telegramUrl={settings.telegram_url} />
        <ContactForm />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
