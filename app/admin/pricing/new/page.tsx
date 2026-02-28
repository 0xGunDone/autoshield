import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewPricingPage() {
  await requireAdminPage();

  return (
    <AdminShell title="Новая позиция цены">
      <form action="/api/admin/pricing" method="post" className="glass rounded-2xl p-5 space-y-4">
        <input type="hidden" name="_action" value="create" />

        <div>
          <label className="mb-1 block text-sm">Название</label>
          <input name="title" required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Цена от</label>
          <input name="price_from" required placeholder="от 6 000 ₽" />
        </div>
        <div>
          <label className="mb-1 block text-sm">Комментарий</label>
          <textarea name="comment" rows={3} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Порядок сортировки</label>
          <input name="sort_order" type="number" defaultValue={100} required />
        </div>

        <button className="primary-btn font-semibold" type="submit">
          Создать
        </button>
      </form>
    </AdminShell>
  );
}
