import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";
import { listServices } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  await requireAdminPage();
  const services = listServices();

  return (
    <AdminShell title="Услуги (CRUD)">
      <div>
        <Link href="/admin/services/new" className="primary-btn inline-block font-semibold">
          + Добавить услугу
        </Link>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <article key={service.id} className="glass rounded-2xl p-4 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold">{service.title}</h2>
              <p className="text-sm text-slate-300">{service.price_from}</p>
              <p className="text-xs text-slate-400 mt-1">/{service.slug}</p>
            </div>
            <Link href={`/admin/services/${service.id}/edit`} className="ghost-btn text-sm mt-3 md:mt-0 inline-block">
              Редактировать
            </Link>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
