import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";
import { getServiceById } from "@/lib/repository";
import { ImageUploader } from "@/components/ImageUploader";

type Props = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: Props) {
  await requireAdminPage();
  const service = getServiceById(Number(params.id));

  if (!service) {
    notFound();
  }

  return (
    <AdminShell title={`Редактирование: ${service.title}`}>
      <form
        action={`/api/admin/services/${service.id}`}
        method="post"
        className="glass rounded-2xl p-5 space-y-4"
      >
        <input type="hidden" name="_action" value="update" />

        <div>
          <label className="mb-1 block text-sm">Название</label>
          <input name="title" defaultValue={service.title} required />
        </div>

        <div>
          <label className="mb-1 block text-sm">Краткое описание</label>
          <textarea
            name="short_description"
            rows={3}
            defaultValue={service.short_description}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Подробное описание</label>
          <textarea
            name="description"
            rows={6}
            defaultValue={service.description}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Цена от</label>
            <input
              name="price_from"
              defaultValue={service.price_from}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">
              Изображение (URL или файл)
            </label>
            <ImageUploader name="image_url" defaultValue={service.image_url} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm">SEO title</label>
          <input name="seo_title" defaultValue={service.seo_title} required />
        </div>

        <div>
          <label className="mb-1 block text-sm">SEO description</label>
          <input
            name="seo_description"
            defaultValue={service.seo_description}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Slug</label>
          <input name="slug" defaultValue={service.slug} />
        </div>

        <div className="flex gap-3">
          <button className="primary-btn font-semibold" type="submit">
            Сохранить
          </button>
          <Link href="/admin/services" className="ghost-btn">
            Назад
          </Link>
        </div>
      </form>

      <form
        action={`/api/admin/services/${service.id}`}
        method="post"
        className="glass rounded-xl p-4"
      >
        <input type="hidden" name="_action" value="delete" />
        <button
          className="ghost-btn border-rose-400/40 text-rose-200"
          type="submit"
        >
          Удалить услугу
        </button>
      </form>
    </AdminShell>
  );
}
