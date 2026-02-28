import Link from "next/link";
import { PhoneLink } from "@/components/PhoneLink";
import { ShieldLogo } from "@/components/ShieldLogo";

type Props = {
  phone: string;
};

const links = [
  { href: "/", label: "Главная" },
  { href: "/quiz", label: "Опрос" },
  { href: "/services", label: "Услуги" },
  { href: "/models", label: "Модели" },
  { href: "/cars", label: "Автомобили" },
  { href: "/pricing", label: "Цены" },
  { href: "/contacts", label: "Контакты" }
];

export function SiteHeader({ phone }: Props) {
  return (
    <header className="sticky top-0 z-20 px-4 py-4">
      <div className="mx-auto max-w-6xl rounded-2xl glass glow px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <ShieldLogo className="h-11 w-11 shrink-0" />
            <div>
              <p className="text-base font-bold leading-none text-sky-900" style={{ fontFamily: "var(--font-display), sans-serif" }}>
                АВТОЩИТ69
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">Центр охранных систем</p>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-sky-800 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
          <PhoneLink phone={phone} className="primary-btn text-sm font-semibold" source="header_phone">
            {phone}
          </PhoneLink>
        </div>
      </div>
    </header>
  );
}
