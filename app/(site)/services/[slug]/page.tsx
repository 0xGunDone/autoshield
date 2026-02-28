import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { MessengerCta } from "@/components/MessengerCta";
import { ServiceCalculator } from "@/components/ServiceCalculator";
import { getServiceBySlug, getSiteSettings } from "@/lib/repository";

type Props = {
  params: {
    slug: string;
  };
};

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: Props): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    return {
      title: "Услуга не найдена"
    };
  }
  return {
    title: service.seo_title,
    description: service.seo_description,
    openGraph: {
      title: service.seo_title,
      description: service.seo_description,
      type: "article"
    }
  };
}

export default function ServicePage({ params }: Props) {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    notFound();
  }

  const settings = getSiteSettings();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      priceSpecification: service.price_from
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-8">
      <article className="glass glow rounded-3xl overflow-hidden">
        <img src={service.image_url} alt={service.title} className="h-64 w-full object-cover md:h-80" decoding="async" fetchPriority="high" />
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold md:text-4xl">{service.title}</h1>
          <p className="mt-2 text-cyan-200 font-semibold">{service.price_from}</p>
          <p className="mt-4 text-slate-200 whitespace-pre-line">{service.description}</p>
        </div>
      </article>

      <ServiceCalculator priceFrom={service.price_from} />

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Запись на услугу</h2>
        <MessengerCta whatsappUrl={settings.whatsapp_url} telegramUrl={settings.telegram_url} />
        <ContactForm />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
