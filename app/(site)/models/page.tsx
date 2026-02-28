import Link from "next/link";
import type { Metadata } from "next";
import { buildServiceModelPages } from "@/lib/model-pages";
import { listServices } from "@/lib/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Модели StarLine",
  description: "Отдельные SEO-страницы моделей сигнализаций StarLine с актуальными вариантами установки и ценами от."
};

export default function ModelsPage() {
  const models = buildServiceModelPages(listServices());

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-8">
      <section className="glass glow rounded-3xl p-8">
        <h1 className="text-3xl font-bold md:text-4xl">Модели сигнализаций</h1>
        <p className="mt-2 text-slate-200">Выберите серию и откройте отдельную страницу модели с вариантами комплексов и ценой от.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {models.map((model) => (
          <article key={model.slug} className="glass hover-lift rounded-2xl p-5">
            <p className="hero-kicker">{model.code}</p>
            <h2 className="mt-3 text-xl font-bold">{model.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{model.description}</p>
            <p className="mt-4 text-sm font-semibold text-cyan-200">{model.minPriceLabel}</p>
            <p className="mt-1 text-xs text-slate-400">Конфигураций: {model.services.length}</p>
            <Link href={`/models/${model.slug}`} className="mt-4 inline-block text-sm font-semibold text-cyan-200 hover:text-cyan-100">
              Открыть страницу модели →
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
