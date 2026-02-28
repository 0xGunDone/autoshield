import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";
import { listReviews } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  await requireAdminPage();
  const reviews = listReviews();

  return (
    <AdminShell title="Отзывы (CRUD)">
      <div>
        <Link href="/admin/reviews/new" className="primary-btn inline-block font-semibold">
          + Добавить отзыв
        </Link>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <article key={review.id} className="glass rounded-2xl p-4 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold">{review.author}</h2>
              <p className="text-sm text-slate-300 line-clamp-2">{review.text}</p>
              <p className="text-xs text-emerald-200 mt-1">Оценка: {review.rating}/5</p>
            </div>
            <Link href={`/admin/reviews/${review.id}/edit`} className="ghost-btn text-sm mt-3 md:mt-0 inline-block">
              Редактировать
            </Link>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
