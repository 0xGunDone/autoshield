import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";
import { listPricing } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  await requireAdminPage();
  const pricing = listPricing();

  return (
    <AdminShell title="Цены (CRUD)">
      <div>
        <Link href="/admin/pricing/new" className="primary-btn inline-block font-semibold">
          + Добавить позицию
        </Link>
      </div>

      <div className="space-y-3">
        {pricing.map((item) => (
          <article key={item.id} className="glass rounded-2xl p-4 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-sm text-slate-300">{item.price_from}</p>
              <p className="text-xs text-slate-400">Порядок: {item.sort_order}</p>
            </div>
            <Link href={`/admin/pricing/${item.id}/edit`} className="ghost-btn text-sm mt-3 md:mt-0 inline-block">
              Редактировать
            </Link>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
