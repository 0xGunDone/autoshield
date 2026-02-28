import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewReviewPage() {
  await requireAdminPage();

  return (
    <AdminShell title="Новый отзыв">
      <form action="/api/admin/reviews" method="post" className="glass rounded-2xl p-5 space-y-4">
        <input type="hidden" name="_action" value="create" />

        <div>
          <label className="mb-1 block text-sm">Автор</label>
          <input name="author" required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Текст</label>
          <textarea name="text" rows={5} required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Рейтинг (1-5)</label>
          <input name="rating" type="number" min={1} max={5} defaultValue={5} required />
        </div>

        <button className="primary-btn font-semibold" type="submit">
          Создать
        </button>
      </form>
    </AdminShell>
  );
}
