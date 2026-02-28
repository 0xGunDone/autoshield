import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { MessengerCta } from "@/components/MessengerCta";
import { PhoneLink } from "@/components/PhoneLink";
import { buildAlternates } from "@/lib/seo";
import { getPageContent, getSiteSettings, listPricing, listReviews, listServices } from "@/lib/repository";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const content = getPageContent();

  return {
    title: content.home_seo_title,
    description: content.home_seo_description,
    alternates: buildAlternates("/"),
    openGraph: {
      title: content.home_seo_title,
      description: content.home_seo_description,
      type: "website"
    }
  };
}

export default function HomePage() {
  const content = getPageContent();
  const settings = getSiteSettings();
  const services = listServices().slice(0, 6);
  const pricing = listPricing().slice(0, 6);
  const reviews = listReviews().slice(0, 4);

  const advantages = (() => {
    try {
      return JSON.parse(content.advantages_json) as string[];
    } catch {
      return ["Официальная установка", "Гарантия", "Опыт", "Сертифицированные специалисты"];
    }
  })();

  const faqItems = (() => {
    try {
      const parsed = JSON.parse(content.faq_json) as Array<{ question: string; answer: string }>;
      return parsed.filter((item) => item.question && item.answer);
    } catch {
      return [];
    }
  })();

  const baseUrl = process.env.SITE_URL || "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: settings.center_name,
        telephone: settings.phone,
        email: settings.email,
        url: baseUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.address
        },
        sameAs: [settings.whatsapp_url, settings.telegram_url].filter(Boolean)
      },
      {
        "@type": ["LocalBusiness", "AutoRepair"],
        name: settings.center_name,
        telephone: settings.phone,
        email: settings.email,
        url: baseUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.address
        },
        openingHours: settings.work_hours,
        makesOffer: services.map((service) => ({
          "@type": "Service",
          name: service.title,
          description: service.short_description,
          offers: {
            "@type": "Offer",
            priceCurrency: "RUB",
            priceSpecification: service.price_from
          }
        }))
      }
    ]
  };

  const faqSchema =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }
      : null;

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 pb-8">
      <section className="glass glow fade-up rounded-3xl p-8 md:p-12">
        <p className="mb-3 text-sm uppercase tracking-[0.22em] text-sky-200">Автоцентр в Твери</p>
        <h1 className="text-3xl font-bold leading-tight md:text-5xl text-gradient" style={{ fontFamily: "var(--font-display), sans-serif" }}>
          {content.hero_title}
        </h1>
        <p className="mt-4 max-w-3xl text-slate-200 md:text-lg">{content.hero_subtitle}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#contact-form" className="primary-btn font-semibold">
            {content.hero_button_text}
          </a>
          <Link href="/quiz" className="primary-btn font-semibold">
            Пройти опрос
          </Link>
          <Link href="/services" className="ghost-btn">
            Смотреть услуги
          </Link>
        </div>
      </section>

      <section className="space-y-4" id="services">
        <h2 className="text-2xl font-bold md:text-3xl">Наши услуги</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="glass glow hover-lift rounded-2xl overflow-hidden">
              <Image
                src={service.image_url}
                alt={service.title}
                width={640}
                height={360}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-200">{service.short_description}</p>
                <p className="mt-3 text-sm font-semibold text-cyan-200">{service.price_from}</p>
                <Link href={`/services/${service.slug}`} className="mt-4 inline-block text-sm text-cyan-200 hover:text-cyan-100">
                  Подробнее →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4" id="advantages">
        <h2 className="text-2xl font-bold md:text-3xl">Преимущества</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {advantages.map((item) => (
            <div key={item} className="glass rounded-xl p-4 text-slate-100">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4" id="pricing">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold md:text-3xl">Цены</h2>
          <Link href="/pricing" className="text-sm text-cyan-200 hover:text-cyan-100">
            Все цены
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pricing.map((item, index) => (
            <article key={item.id} className="glass price-card hover-lift rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-snug">{item.title}</h3>
                <span className="price-chip">{item.price_from}</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{item.comment}</p>
              <p className="mt-4 text-xs text-slate-400">Позиция #{index + 1}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4" id="reviews">
        <h2 className="text-2xl font-bold md:text-3xl">Отзывы</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className="glass hover-lift rounded-2xl p-5">
              <p className="text-sm text-emerald-200">{"★".repeat(review.rating)}</p>
              <p className="mt-2 text-slate-100">{review.text}</p>
              <p className="mt-3 text-sm text-slate-300">— {review.author}</p>
            </article>
          ))}
        </div>
      </section>

      {faqItems.length > 0 ? (
        <section className="space-y-4" id="faq">
          <h2 className="text-2xl font-bold md:text-3xl">FAQ</h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.question} className="glass rounded-xl p-4">
                <summary className="cursor-pointer list-none font-semibold">{item.question}</summary>
                <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2" id="about">
        <article className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold">О компании</h2>
          <p className="mt-3 whitespace-pre-line text-slate-200">{content.about_text}</p>
        </article>
        <article className="glass rounded-2xl p-6" id="contacts">
          <h2 className="text-2xl font-bold">Контакты</h2>
          <div className="mt-3 space-y-2 text-slate-200">
            <p>Телефон: <PhoneLink phone={settings.phone} className="text-cyan-200" source="home_contacts_phone">{settings.phone}</PhoneLink></p>
            <p>Email: <a className="text-cyan-200" href={`mailto:${settings.email}`}>{settings.email}</a></p>
            <p>Адрес: {settings.address}</p>
            <p>Часы работы: {settings.work_hours}</p>
          </div>
        </article>
      </section>

      <section id="contact-form" className="space-y-4">
        <h2 className="text-2xl font-bold md:text-3xl">Форма записи</h2>
        <MessengerCta whatsappUrl={settings.whatsapp_url} telegramUrl={settings.telegram_url} />
        <ContactForm />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}
    </div>
  );
}
