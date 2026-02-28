import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";
import { countContactRequestsByStatus, listContactRequests, listPricing, listReviews, listServices } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminPage();

  const servicesCount = listServices().length;
  const pricingCount = listPricing().length;
  const reviewsCount = listReviews().length;
  const requestsCount = listContactRequests().length;
  const requestStatus = countContactRequestsByStatus();

  return (
    <AdminShell title="Панель управления">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="glass rounded-xl p-4">
          <p className="text-sm text-slate-300">Услуги</p>
          <p className="mt-2 text-2xl font-bold">{servicesCount}</p>
        </article>
        <article className="glass rounded-xl p-4">
          <p className="text-sm text-slate-300">Позиции цен</p>
          <p className="mt-2 text-2xl font-bold">{pricingCount}</p>
        </article>
        <article className="glass rounded-xl p-4">
          <p className="text-sm text-slate-300">Отзывы</p>
          <p className="mt-2 text-2xl font-bold">{reviewsCount}</p>
        </article>
        <article className="glass rounded-xl p-4">
          <p className="text-sm text-slate-300">Заявки</p>
          <p className="mt-2 text-2xl font-bold">{requestsCount}</p>
          <p className="mt-2 text-xs text-slate-400">
            Новые: {requestStatus.new} · В работе: {requestStatus.in_progress} · Закрыто: {requestStatus.closed}
          </p>
        </article>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/admin/settings" className="glass rounded-xl p-4 hover:bg-white/10 transition">
          Настройки сайта
        </Link>
        <Link href="/admin/content" className="glass rounded-xl p-4 hover:bg-white/10 transition">
          Контент главной
        </Link>
        <Link href="/admin/services" className="glass rounded-xl p-4 hover:bg-white/10 transition">
          Управление услугами
        </Link>
        <Link href="/admin/requests" className="glass rounded-xl p-4 hover:bg-white/10 transition">
          Просмотр заявок
        </Link>
      </div>
    </AdminShell>
  );
}
