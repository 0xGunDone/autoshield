import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  await requireAdminPage();

  return (
    <AdminShell title="Новая услуга">
      <form action="/api/admin/services" method="post" className="glass rounded-2xl p-5 space-y-4">
        <input type="hidden" name="_action" value="create" />

        <div>
          <label className="mb-1 block text-sm">Название</label>
          <input name="title" required />
        </div>

        <div>
          <label className="mb-1 block text-sm">Краткое описание</label>
          <textarea name="short_description" rows={3} required />
        </div>

        <div>
          <label className="mb-1 block text-sm">Подробное описание</label>
          <textarea name="description" rows={6} required />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Цена от</label>
            <input name="price_from" required placeholder="от 10 000 ₽" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Изображение (URL)</label>
            <input name="image_url" required placeholder="https://..." />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm">SEO title</label>
          <input name="seo_title" required />
        </div>

        <div>
          <label className="mb-1 block text-sm">SEO description</label>
          <input name="seo_description" required />
        </div>

        <div>
          <label className="mb-1 block text-sm">Slug (необязательно, автогенерация)</label>
          <input name="slug" placeholder="ustanovka-signalizacii" />
        </div>

        <button className="primary-btn font-semibold" type="submit">
          Создать услугу
        </button>
      </form>
    </AdminShell>
  );
}
