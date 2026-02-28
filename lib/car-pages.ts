import { slugify } from "@/lib/slug";

export type CarPage = {
  brand: string;
  model: string;
  brandSlug: string;
  modelSlug: string;
  years: string;
  painPoints: string[];
};

const CAR_PAGE_SEEDS: Array<Omit<CarPage, "brandSlug" | "modelSlug">> = [
  {
    brand: "Toyota",
    model: "Camry",
    years: "2018–2025",
    painPoints: ["Автозапуск без конфликтов со штатным иммобилайзером", "Двустороннее оповещение", "Управление со смартфона"]
  },
  {
    brand: "Kia",
    model: "Rio",
    years: "2017–2025",
    painPoints: ["Бюджетный комплекс с автозапуском", "Стабильная работа зимой", "Сохранение гарантии"]
  },
  {
    brand: "Hyundai",
    model: "Solaris",
    years: "2017–2025",
    painPoints: ["Надежный диалоговый код", "Контроль запуска по температуре", "Управление через приложение"]
  },
  {
    brand: "Volkswagen",
    model: "Polo",
    years: "2016–2025",
    painPoints: ["Корректная интеграция по CAN", "Скрытый монтаж", "Защита от кодграббера"]
  },
  {
    brand: "Skoda",
    model: "Octavia",
    years: "2018–2025",
    painPoints: ["Телематика GSM/GPS", "Удаленный запуск и мониторинг", "Сервисная поддержка после установки"]
  },
  {
    brand: "Renault",
    model: "Duster",
    years: "2016–2025",
    painPoints: ["Защита для городской и загородной эксплуатации", "Настройка чувствительности зон", "Надежная работа в морозы"]
  },
  {
    brand: "LADA",
    model: "Vesta",
    years: "2018–2025",
    painPoints: ["Доступный комплект с автозапуском", "Стабильная работа по штатному ключу", "Поддержка после установки"]
  },
  {
    brand: "BMW",
    model: "X5",
    years: "2019–2025",
    painPoints: ["Премиум-комплексы с авторизацией", "GPS-мониторинг и антиугон", "Аккуратная интеграция без ошибок по электронике"]
  }
];

export function listCarPages(): CarPage[] {
  return CAR_PAGE_SEEDS.map((item) => ({
    ...item,
    brandSlug: slugify(item.brand),
    modelSlug: slugify(item.model)
  }));
}

export function findCarPage(brandSlug: string, modelSlug: string): CarPage | undefined {
  return listCarPages().find((item) => item.brandSlug === brandSlug && item.modelSlug === modelSlug);
}
