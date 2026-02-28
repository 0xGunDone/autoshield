import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";
import { getPageContent } from "@/lib/repository";

type Props = {
  searchParams?: {
    saved?: string;
    error?: string;
  };
};

export const dynamic = "force-dynamic";

export default async function AdminContentPage({ searchParams }: Props) {
  await requireAdminPage();
  const content = getPageContent();

  return (
    <AdminShell title="Контент главной страницы">
      <form action="/api/admin/content" method="post" className="glass rounded-2xl p-5 space-y-4">
        <div>
          <label className="mb-1 block text-sm">Hero заголовок</label>
          <input name="hero_title" defaultValue={content.hero_title} required />
        </div>

        <div>
          <label className="mb-1 block text-sm">Hero подзаголовок</label>
          <textarea name="hero_subtitle" rows={3} defaultValue={content.hero_subtitle} required />
        </div>

        <div>
          <label className="mb-1 block text-sm">Текст кнопки</label>
          <input name="hero_button_text" defaultValue={content.hero_button_text} required />
        </div>

        <div>
          <label className="mb-1 block text-sm">Преимущества (JSON-массив строк)</label>
          <textarea name="advantages_json" rows={5} defaultValue={content.advantages_json} required />
        </div>

        <div>
          <label className="mb-1 block text-sm">FAQ (JSON-массив объектов {'{question, answer}'})</label>
          <textarea name="faq_json" rows={8} defaultValue={content.faq_json} required />
        </div>

        <div>
          <label className="mb-1 block text-sm">О компании</label>
          <textarea name="about_text" rows={6} defaultValue={content.about_text} required />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">SEO title главной</label>
            <input name="home_seo_title" defaultValue={content.home_seo_title} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">SEO description главной</label>
            <input name="home_seo_description" defaultValue={content.home_seo_description} required />
          </div>
        </div>

        <button className="primary-btn font-semibold" type="submit">
          Сохранить контент
        </button>

        {searchParams?.saved ? <p className="text-sm text-emerald-200">Изменения сохранены.</p> : null}
        {searchParams?.error ? <p className="text-sm text-rose-300">Ошибка сохранения: {searchParams.error}</p> : null}
      </form>
    </AdminShell>
  );
}
