import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <section className="glass glow rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold">Страница не найдена</h1>
        <p className="mt-3 text-slate-300">Запрашиваемая страница отсутствует или была перемещена.</p>
        <Link href="/" className="primary-btn mt-6 inline-block">
          На главную
        </Link>
      </section>
    </main>
  );
}
