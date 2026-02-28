import { AdminShell } from "@/components/AdminShell";
import { requireAdminPage } from "@/lib/auth";
import { getSiteSettings } from "@/lib/repository";

type Props = {
  searchParams?: {
    saved?: string;
    error?: string;
  };
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({ searchParams }: Props) {
  await requireAdminPage();
  const settings = getSiteSettings();

  return (
    <AdminShell title="Настройки сайта">
      <form action="/api/admin/settings" method="post" className="glass rounded-2xl p-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Название центра</label>
            <input name="center_name" defaultValue={settings.center_name} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Телефон</label>
            <input name="phone" defaultValue={settings.phone} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input name="email" type="email" defaultValue={settings.email} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Почта для заявок</label>
            <input name="request_email" type="email" defaultValue={settings.request_email} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Адрес</label>
            <input name="address" defaultValue={settings.address} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Время работы</label>
            <input name="work_hours" defaultValue={settings.work_hours} required />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm">Карта (iframe)</label>
          <textarea name="map_iframe" rows={5} defaultValue={settings.map_iframe} />
        </div>

        <h2 className="text-lg font-semibold">CTA мессенджеров</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">WhatsApp URL</label>
            <input name="whatsapp_url" defaultValue={settings.whatsapp_url} placeholder="https://wa.me/79990000000" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Telegram URL</label>
            <input name="telegram_url" defaultValue={settings.telegram_url} placeholder="https://t.me/your_username" />
          </div>
        </div>

        <h2 className="text-lg font-semibold">Telegram уведомления</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Bot token</label>
            <input name="telegram_bot_token" defaultValue={settings.telegram_bot_token} placeholder="123456:ABCDEF..." />
          </div>
          <div>
            <label className="mb-1 block text-sm">Chat ID</label>
            <input name="telegram_chat_id" defaultValue={settings.telegram_chat_id} placeholder="-1001234567890" />
          </div>
        </div>

        <h2 className="text-lg font-semibold">Аналитика</h2>
        <div>
          <label className="mb-1 block text-sm">Yandex Metrika ID</label>
          <input name="metrika_id" defaultValue={settings.metrika_id} placeholder="12345678" />
        </div>

        <h2 className="text-lg font-semibold">CRM шаблоны ответа</h2>
        <p className="text-sm text-slate-300">
          Плейсхолдеры: {"{id}"}, {"{name}"}, {"{phone}"}, {"{car_brand}"}, {"{car_model}"}, {"{car_year}"}, {"{features}"}, {"{center_name}"}
        </p>
        <div>
          <label className="mb-1 block text-sm">Шаблон WhatsApp</label>
          <textarea name="whatsapp_template" rows={3} defaultValue={settings.whatsapp_template} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Шаблон Telegram</label>
          <textarea name="telegram_template" rows={3} defaultValue={settings.telegram_template} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Скрипт звонка</label>
          <textarea name="call_template" rows={4} defaultValue={settings.call_template} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">SEO title (по умолчанию)</label>
            <input name="default_seo_title" defaultValue={settings.default_seo_title} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">SEO description (по умолчанию)</label>
            <input name="default_seo_description" defaultValue={settings.default_seo_description} required />
          </div>
        </div>

        <h2 className="text-lg font-semibold">SMTP Яндекс</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">SMTP host</label>
            <input name="smtp_host" defaultValue={settings.smtp_host} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">SMTP port</label>
            <input name="smtp_port" type="number" defaultValue={settings.smtp_port} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">SMTP secure (1/0)</label>
            <input name="smtp_secure" type="number" min={0} max={1} defaultValue={settings.smtp_secure} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">SMTP user</label>
            <input name="smtp_user" defaultValue={settings.smtp_user} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm">SMTP password</label>
          <input name="smtp_password" type="password" defaultValue={settings.smtp_password} />
        </div>

        <button className="primary-btn font-semibold" type="submit">
          Сохранить настройки
        </button>

        {searchParams?.saved ? <p className="text-sm text-emerald-200">Изменения сохранены.</p> : null}
        {searchParams?.error ? <p className="text-sm text-rose-300">Ошибка сохранения: {searchParams.error}</p> : null}
      </form>
    </AdminShell>
  );
}
