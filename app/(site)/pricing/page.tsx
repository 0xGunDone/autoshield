import type { Metadata } from "next";
import { listPricing } from "@/lib/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Цены",
  description: "Актуальные цены на установку охранных систем и дооснащение автомобилей в Твери."
};

export default function PricingPage() {
  const pricing = listPricing();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-8">
      <section className="glass glow rounded-3xl p-8">
        <h1 className="text-3xl font-bold md:text-4xl">Цены</h1>
        <p className="mt-2 text-slate-200">Стоимость зависит от модели автомобиля и выбранного комплекта оборудования.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {pricing.map((item, index) => (
          <article key={item.id} className="glass price-card hover-lift rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold leading-snug">{item.title}</h2>
              <span className="price-chip">{item.price_from}</span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{item.comment}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Монтаж и настройка</span>
              <span>#{index + 1}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
