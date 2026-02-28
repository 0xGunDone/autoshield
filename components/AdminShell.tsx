import Link from "next/link";

type Props = {
  title: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/settings", label: "Настройки" },
  { href: "/admin/content", label: "Главная" },
  { href: "/admin/services", label: "Услуги" },
  { href: "/admin/pricing", label: "Цены" },
  { href: "/admin/reviews", label: "Отзывы" },
  { href: "/admin/requests", label: "Заявки" }
];

export function AdminShell({ title, children }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="glass rounded-2xl p-4 md:flex md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="ghost-btn text-sm">
              {item.label}
            </Link>
          ))}
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="ghost-btn text-sm" type="submit">
            Выйти
          </button>
        </form>
      </div>

      <div className="mt-5 glass glow rounded-2xl p-6">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
      </div>

      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}
