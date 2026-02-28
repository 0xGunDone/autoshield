import type { Service } from "@/lib/types";
import { slugify } from "@/lib/slug";

export type ServiceModelPage = {
  slug: string;
  code: string;
  title: string;
  description: string;
  minPriceLabel: string;
  minPriceValue: number;
  updatedAt: string;
  services: Service[];
};

function parsePrice(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function extractModelCode(title: string): string {
  const cleaned = title.replace(/^StarLine\s+/i, "").trim();
  if (!cleaned) {
    return "Модель";
  }

  const parts = cleaned.split(/\s+/);
  if (parts.length >= 2 && /^v\d+$/i.test(parts[1])) {
    return `${parts[0]} ${parts[1]}`;
  }

  return parts[0];
}

export function buildServiceModelPages(services: Service[]): ServiceModelPage[] {
  const groups = new Map<string, Service[]>();

  for (const service of services) {
    const code = extractModelCode(service.title);
    const key = slugify(code);
    const list = groups.get(key) || [];
    list.push(service);
    groups.set(key, list);
  }

  const pages: ServiceModelPage[] = [];

  for (const [slug, groupServices] of groups.entries()) {
    const first = groupServices[0];
    const code = extractModelCode(first.title);
    const minService = groupServices.reduce((best, current) => {
      return parsePrice(current.price_from) < parsePrice(best.price_from) ? current : best;
    }, first);

    const updatedAt = groupServices.reduce((latest, current) => {
      return latest > current.updated_at ? latest : current.updated_at;
    }, first.updated_at);

    pages.push({
      slug,
      code,
      title: `StarLine ${code}`,
      description: `Подбор и установка комплексов ${code} в Твери. Доступны варианты под ваш автомобиль, гарантию и задачи по охране.`,
      minPriceLabel: minService.price_from,
      minPriceValue: parsePrice(minService.price_from),
      updatedAt,
      services: groupServices.sort((a, b) => parsePrice(a.price_from) - parsePrice(b.price_from))
    });
  }

  return pages.sort((a, b) => a.minPriceValue - b.minPriceValue);
}

export function findServiceModelPageBySlug(services: Service[], slug: string): ServiceModelPage | undefined {
  const pages = buildServiceModelPages(services);
  return pages.find((item) => item.slug === slug);
}
