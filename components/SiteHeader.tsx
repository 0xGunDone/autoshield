"use client";

import Link from "next/link";
import { useState } from "react";
import { PhoneLink } from "@/components/PhoneLink";
import { ShieldLogo } from "@/components/ShieldLogo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

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
  { href: "/contacts", label: "Контакты" },
];

export function SiteHeader({ phone }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 px-4 py-4">
      <div
        className={`mx-auto max-w-6xl rounded-2xl glass glow px-4 py-3 md:px-6 transition-all duration-300 ${isOpen ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg" : ""}`}
      >
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <ShieldLogo className="h-11 w-11 shrink-0" />
            <div>
              <p
                className="text-base font-bold leading-none text-sky-900 dark:text-sky-300 transition-colors"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                АВТОЩИТ69
              </p>
              <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors">
                Центр охранных систем
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <ThemeSwitcher />
            <PhoneLink
              phone={phone}
              className="primary-btn text-sm font-semibold"
              source="header_phone"
            >
              {phone}
            </PhoneLink>
          </div>

          {/* Mobile Toggle & Theme */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <ThemeSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 ghost-btn rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="mt-4 flex flex-col gap-2 pb-2 lg:hidden border-t border-slate-200 dark:border-slate-700/50 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 rounded-xl text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 px-4 pb-2">
              <PhoneLink
                phone={phone}
                className="w-full primary-btn text-center justify-center text-base font-semibold"
                source="header_phone"
              >
                {phone}
              </PhoneLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
