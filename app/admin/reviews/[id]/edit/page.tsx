import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";
import { getReviewById } from "@/lib/repository";

type Props = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

export default async function EditReviewPage({ params }: Props) {
  await requireAdminPage();
  const review = getReviewById(Number(params.id));

  if (!review) {
    notFound();
  }

  return (
    <AdminShell title={`Редактирование отзыва: ${review.author}`}>
      <form action={`/api/admin/reviews/${review.id}`} method="post" className="glass rounded-2xl p-5 space-y-4">
        <input type="hidden" name="_action" value="update" />

        <div>
          <label className="mb-1 block text-sm">Автор</label>
          <input name="author" defaultValue={review.author} required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Текст</label>
          <textarea name="text" rows={5} defaultValue={review.text} required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Рейтинг (1-5)</label>
          <input name="rating" type="number" min={1} max={5} defaultValue={review.rating} required />
        </div>

        <div className="flex gap-3">
          <button className="primary-btn font-semibold" type="submit">
            Сохранить
          </button>
          <Link href="/admin/reviews" className="ghost-btn">
            Назад
          </Link>
        </div>
      </form>

      <form action={`/api/admin/reviews/${review.id}`} method="post" className="glass rounded-xl p-4">
        <input type="hidden" name="_action" value="delete" />
        <button className="ghost-btn border-rose-400/40 text-rose-200" type="submit">
          Удалить отзыв
        </button>
      </form>
    </AdminShell>
  );
}
