import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";
import { getPricingById } from "@/lib/repository";

type Props = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

export default async function EditPricingPage({ params }: Props) {
  await requireAdminPage();
  const item = getPricingById(Number(params.id));

  if (!item) {
    notFound();
  }

  return (
    <AdminShell title={`Редактирование цены: ${item.title}`}>
      <form action={`/api/admin/pricing/${item.id}`} method="post" className="glass rounded-2xl p-5 space-y-4">
        <input type="hidden" name="_action" value="update" />

        <div>
          <label className="mb-1 block text-sm">Название</label>
          <input name="title" defaultValue={item.title} required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Цена от</label>
          <input name="price_from" defaultValue={item.price_from} required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Комментарий</label>
          <textarea name="comment" rows={3} defaultValue={item.comment} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Порядок сортировки</label>
          <input name="sort_order" type="number" defaultValue={item.sort_order} required />
        </div>

        <div className="flex gap-3">
          <button className="primary-btn font-semibold" type="submit">
            Сохранить
          </button>
          <Link href="/admin/pricing" className="ghost-btn">
            Назад
          </Link>
        </div>
      </form>

      <form action={`/api/admin/pricing/${item.id}`} method="post" className="glass rounded-xl p-4">
        <input type="hidden" name="_action" value="delete" />
        <button className="ghost-btn border-rose-400/40 text-rose-200" type="submit">
          Удалить позицию
        </button>
      </form>
    </AdminShell>
  );
}
