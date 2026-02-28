import Link from "next/link";
import type { Metadata } from "next";
import { listServices } from "@/lib/repository";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return {
    title: "Услуги",
    description: "Установка сигнализаций, автозапуска, иммобилайзеров, GSM/GPS и дооснащение автомобилей в Твери."
  };
}

export default function ServicesPage() {
  const services = listServices();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-8">
      <section className="glass glow rounded-3xl p-8">
        <h1 className="text-3xl font-bold md:text-4xl">Услуги</h1>
        <p className="mt-2 text-slate-200">Выберите услугу и узнайте детали монтажа, сроков и стоимости.</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service.id} className="glass hover-lift rounded-2xl overflow-hidden">
            <img src={service.image_url} alt={service.title} className="h-44 w-full object-cover" loading="lazy" decoding="async" />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{service.title}</h2>
              <p className="mt-2 text-sm text-slate-200">{service.short_description}</p>
              <p className="mt-3 text-sm font-semibold text-cyan-200">{service.price_from}</p>
              <Link href={`/services/${service.slug}`} className="mt-4 inline-block text-sm text-cyan-200 hover:text-cyan-100">
                Открыть услугу →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
