import Link from "next/link";
import type { Metadata } from "next";
import { listCarPages } from "@/lib/car-pages";
import { buildAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Сигнализации по маркам и моделям",
  description: "Подбор охранных комплексов по марке и модели автомобиля в Твери.",
  alternates: buildAlternates("/cars"),
  openGraph: {
    title: "Сигнализации по маркам и моделям",
    description: "SEO-страницы по популярным автомобилям с рекомендациями по установке.",
    type: "website"
  }
};

export default function CarsPage() {
  const cars = listCarPages();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-8">
      <section className="glass glow rounded-3xl p-8">
        <h1 className="text-3xl font-bold md:text-4xl">Сигнализации по маркам авто</h1>
        <p className="mt-2 text-slate-200">Выберите марку и модель, чтобы посмотреть рекомендации и варианты установки.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cars.map((car) => (
          <article key={`${car.brandSlug}-${car.modelSlug}`} className="glass hover-lift rounded-2xl p-5">
            <p className="hero-kicker">{car.brand}</p>
            <h2 className="mt-3 text-xl font-bold">{car.model}</h2>
            <p className="mt-2 text-sm text-slate-300">Года: {car.years}</p>
            <Link
              href={`/cars/${car.brandSlug}/${car.modelSlug}`}
              className="mt-4 inline-block text-sm font-semibold text-cyan-200 hover:text-cyan-100"
            >
              Открыть страницу →
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
