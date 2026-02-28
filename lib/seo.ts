import type { Metadata } from "next";

export function buildAlternates(pathname: string): Metadata["alternates"] {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return {
    canonical: normalized,
    languages: {
      "ru-RU": normalized
    }
  };
}
