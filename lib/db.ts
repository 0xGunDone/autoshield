import bcrypt from "bcrypt";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATABASE_PATH = process.env.DATABASE_PATH || "./data/site.db";
const resolvedPath = path.isAbsolute(DATABASE_PATH) ? DATABASE_PATH : path.join(process.cwd(), DATABASE_PATH);

fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

const db = new Database(resolvedPath, { timeout: 8000 });

const DEFAULT_SETTINGS = {
  center_name: "Центр охранных систем",
  phone: "+7 (900) 000-00-00",
  email: "mail@example.ru",
  request_email: "requests@example.ru",
  whatsapp_url: "",
  telegram_url: "",
  telegram_bot_token: "",
  telegram_chat_id: "",
  metrika_id: "",
  address: "Тверь, укажите адрес в админке",
  work_hours: "Пн-Сб: 09:00 - 19:00",
  map_iframe:
    '<iframe src="https://yandex.ru/map-widget/v1/?ll=35.9176%2C56.8587&z=12" width="100%" height="320" frameborder="0"></iframe>',
  default_seo_title: "Установка охранных систем в Твери",
  default_seo_description:
    "Установка сигнализаций, автозапуска, GSM/GPS и дооснащение автомобилей в Твери.",
  smtp_host: "smtp.yandex.ru",
  smtp_port: 465,
  smtp_secure: 1,
  smtp_user: "",
  smtp_password: ""
};

const COPIED_CONTACT_DEFAULTS = {
  phone: "+7-920-157-0546",
  email: "info@starline69.ru",
  request_email: "info@starline69.ru",
  address: "г. Тверь, ул. 1-я за линией Октябрьской ж/д, ст. 1В"
};

const DEFAULT_CONTENT = {
  hero_title: "Официальный установочный центр StarLine в Твери",
  hero_subtitle:
    "Устанавливаем современные охранные комплексы StarLine, настраиваем автозапуск и телематику с гарантией и аккуратным монтажом.",
  hero_button_text: "Записаться",
  advantages_json: JSON.stringify([
    "100% клиентоориентированность",
    "Официальный центр StarLine",
    "Высокий уровень сервиса",
    "Гарантия на установку и оборудование"
  ]),
  faq_json: JSON.stringify([
    {
      question: "Сколько занимает установка охранного комплекса?",
      answer: "Обычно от 4 до 8 часов в зависимости от автомобиля и выбранной системы."
    },
    {
      question: "Можно ли сохранить гарантию на новый автомобиль?",
      answer: "Да, при корректной установке и оформлении документов гарантия на авто сохраняется."
    },
    {
      question: "Есть ли поддержка после установки?",
      answer: "Да, мы помогаем с настройкой приложения, консультациями и сервисным сопровождением."
    }
  ]),
  about_text:
    "Работаем с легковым и коммерческим транспортом, подбираем решения под задачи владельца и особенности автомобиля. По данным starline69.ru доступны комплексы серии A, S, E, T и B с установкой в Твери.",
  home_seo_title: "StarLine69 Тверь - установка сигнализаций и автозапуска",
  home_seo_description:
    "Цены на комплексы StarLine в Твери: A63, A93, S96, E96 и другие. Официальная установка, поддержка и гарантия."
};

type ServiceSeed = {
  title: string;
  short_description: string;
  description: string;
  price_from: string;
  image_url: string;
  seo_title: string;
  seo_description: string;
  slug: string;
};

const STARLINE_SERVICE_SEEDS: ServiceSeed[] = [
  {
    title: "StarLine A63 v2",
    short_description: "Базовый охранный комплекс с надежной диалоговой защитой и удобным управлением.",
    description:
      "Линейка A63 v2 подходит для ежедневной защиты автомобиля. На starline69.ru представлены варианты ECO, v2, 2CAN+2LIN ECO и LTE ECO.",
    price_from: "от 9 150 ₽",
    image_url: "https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&w=1200&q=80",
    seo_title: "StarLine A63 v2 в Твери - установка от 9 150 ₽",
    seo_description: "Установка StarLine A63 v2, ECO и LTE ECO в Твери. Официальный монтаж и гарантия.",
    slug: "starline-a63-v2"
  },
  {
    title: "StarLine A93 v2",
    short_description: "Популярный комплекс с автозапуском и расширенными CAN/LIN конфигурациями.",
    description:
      "Серия A93 v2 включает конфигурации ECO, 2CAN+2LIN и LTE. Решение для владельцев, которым важен удаленный запуск и стабильная защита.",
    price_from: "от 11 800 ₽",
    image_url: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80",
    seo_title: "StarLine A93 v2 в Твери - установка от 11 800 ₽",
    seo_description: "Официальная установка StarLine A93 v2, LTE и 2CAN+2LIN в Твери.",
    slug: "starline-a93-v2"
  },
  {
    title: "StarLine A90 BT",
    short_description: "Современная сигнализация с Bluetooth-авторизацией и автозапуском.",
    description:
      "Комплекс A90 BT повышает удобство управления и уровень противоугонной защиты. Подходит для городской и трассовой эксплуатации.",
    price_from: "от 13 500 ₽",
    image_url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
    seo_title: "StarLine A90 BT в Твери - установка от 13 500 ₽",
    seo_description: "Установка StarLine A90 BT в Твери у официального установочного центра.",
    slug: "starline-a90-bt"
  },
  {
    title: "StarLine S66 v2",
    short_description: "GSM-комплекс с управлением через приложение и интеграцией в штатные системы.",
    description:
      "Варианты S66 v2 (Mini, ECO, LTE) рассчитаны на владельцев, которым нужен удаленный контроль автомобиля и тревожные уведомления.",
    price_from: "от 14 900 ₽",
    image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    seo_title: "StarLine S66 v2 в Твери - установка от 14 900 ₽",
    seo_description: "Монтаж StarLine S66 v2 Mini, ECO и LTE в Твери. Настройка приложения и телематики.",
    slug: "starline-s66-v2"
  },
  {
    title: "StarLine E66 v2",
    short_description: "Комплекс среднего класса с усиленной защитой и GSM-функциями.",
    description:
      "Серия E66 v2 доступна в вариантах ECO и GSM ECO. Подходит для установки с учетом современных цифровых шин автомобиля.",
    price_from: "от 15 450 ₽",
    image_url: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=1200&q=80",
    seo_title: "StarLine E66 v2 в Твери - установка от 15 450 ₽",
    seo_description: "Установка StarLine E66 v2 и GSM ECO в Твери. Сертифицированный монтаж.",
    slug: "starline-e66-v2"
  },
  {
    title: "StarLine E96 v2",
    short_description: "Продвинутый охранно-телематический комплекс с GPS/GSM конфигурациями.",
    description:
      "Линейка E96 v2 включает варианты ECO, GSM, GSM GPS и GSM GPS PRO. Решение для контроля автомобиля в режиме реального времени.",
    price_from: "от 18 150 ₽",
    image_url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
    seo_title: "StarLine E96 v2 в Твери - установка от 18 150 ₽",
    seo_description: "Монтаж StarLine E96 v2 с GSM/GPS в Твери. Полная настройка телематических функций.",
    slug: "starline-e96-v2"
  },
  {
    title: "StarLine E97",
    short_description: "Система с поддержкой CAN FD и расширенными противоугонными возможностями.",
    description:
      "E97 рассчитан на современные автомобили с новыми цифровыми шинами, включая конфигурации CAN FD GSM GPS.",
    price_from: "от 20 650 ₽",
    image_url: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
    seo_title: "StarLine E97 в Твери - установка от 20 650 ₽",
    seo_description: "Установка StarLine E97 и E97 CAN FD GSM GPS в Твери у официального партнера.",
    slug: "starline-e97"
  },
  {
    title: "StarLine S96 v2",
    short_description: "Флагманская линейка с LTE/GPS и гибкими конфигурациями безопасности.",
    description:
      "S96 v2 доступен в версиях ECO, LTE, GPS и PRO. Комплекс для владельцев, которым нужна максимальная функциональность и контроль.",
    price_from: "от 19 450 ₽",
    image_url: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80",
    seo_title: "StarLine S96 v2 в Твери - установка от 19 450 ₽",
    seo_description: "StarLine S96 v2 LTE/GPS/PRO в Твери. Профессиональная установка и настройка.",
    slug: "starline-s96-v2"
  },
  {
    title: "StarLine T94 v2",
    short_description: "Решение для усиленной охраны с акцентом на надежность и устойчивость к помехам.",
    description:
      "T94 v2 ориентирован на автомобили, требующие стабильной работы в сложных условиях эксплуатации.",
    price_from: "от 23 500 ₽",
    image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    seo_title: "StarLine T94 v2 в Твери - установка от 23 500 ₽",
    seo_description: "Установка StarLine T94 v2 в Твери. Консультация, монтаж, гарантия.",
    slug: "starline-t94-v2"
  },
  {
    title: "StarLine S97 CAN FD GPS",
    short_description: "Комплекс для автомобилей с CAN FD с точным GPS-контролем.",
    description:
      "S97 CAN FD GPS сочетает противоугонные функции и спутниковый мониторинг, подходит для новых платформ авто.",
    price_from: "от 25 450 ₽",
    image_url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80",
    seo_title: "StarLine S97 CAN FD GPS в Твери - установка от 25 450 ₽",
    seo_description: "Монтаж StarLine S97 CAN FD GPS в Твери. Настройка и гарантийная поддержка.",
    slug: "starline-s97-can-fd-gps"
  },
  {
    title: "StarLine B97 v2 3CAN+FD+4LIN LTE",
    short_description: "Премиальный комплекс для сложных интеграций и максимальной защиты.",
    description:
      "B97 v2 рассчитан на комплексные проекты с расширенной цифровой интеграцией и LTE-каналом управления.",
    price_from: "от 47 300 ₽",
    image_url: "https://images.unsplash.com/photo-1556800572-1b8aeef2c54f?auto=format&fit=crop&w=1200&q=80",
    seo_title: "StarLine B97 v2 в Твери - установка от 47 300 ₽",
    seo_description: "Премиальная установка StarLine B97 v2 3CAN+FD+4LIN LTE в Твери.",
    slug: "starline-b97-v2-lte"
  }
];

type PricingSeed = {
  title: string;
  price_from: string;
  comment: string;
};

const STARLINE_PRICING_BASE: PricingSeed[] = [
  { title: "StarLine A63 v2 ECO", price_from: "9 150 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine A63 v2", price_from: "10 600 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine A63 2CAN+2LIN ECO", price_from: "15 450 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine A63 LTE ECO", price_from: "17 400 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine A93 v2 ECO", price_from: "11 800 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine A93 v2", price_from: "13 500 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine A93 2CAN+2LIN ECO", price_from: "18 150 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine A93 2CAN+2LIN", price_from: "20 650 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine A93 LTE", price_from: "22 300 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine A93 2CAN+2LIN LTE ECO", price_from: "28 900 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine A90 BT", price_from: "13 500 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine AS90 ECO", price_from: "13 500 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine S66 v2 Mini", price_from: "14 900 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine S66 v2", price_from: "17 100 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine S66 v2 ECO", price_from: "15 850 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine S66 v2 LTE", price_from: "19 700 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine E66 v2 ECO", price_from: "15 450 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine E66 GSM ECO", price_from: "23 700 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine E96 v2 ECO", price_from: "18 150 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine E96 v2", price_from: "20 650 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine E96 GSM ECO", price_from: "26 750 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine E96 GSM GPS", price_from: "30 400 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine E96 GSM GPS PRO", price_from: "36 100 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine E97", price_from: "20 650 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine E97 CAN FD GSM GPS", price_from: "30 400 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine S96 v2", price_from: "20 650 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine S96 GPS", price_from: "25 450 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine S96 LTE", price_from: "23 300 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine S96 ECO", price_from: "19 450 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine S96 LTE GPS", price_from: "28 100 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine S96 LTE GPS PRO", price_from: "35 700 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine T94 v2", price_from: "23 500 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine S97 CAN FD GPS", price_from: "25 450 ₽", comment: "По данным starline69.ru" },
  { title: "StarLine B97 v2 3CAN+FD+4LIN LTE", price_from: "47 300 ₽", comment: "По данным starline69.ru" }
];

const STARLINE_REVIEW_SEEDS = [
  {
    author: "Александр Глушаков",
    text: "Вежливый персонал, консультация и установка на хорошем уровне. Остался доволен сервисом.",
    rating: 5
  },
  {
    author: "Сергей Сальников",
    text: "Выполнили установку StarLine быстро и качественно, подробно объяснили работу системы.",
    rating: 5
  },
  {
    author: "Арсений Давыдов",
    text: "Понравилось отношение к клиенту и аккуратность работ. Рекомендую центр в Твери.",
    rating: 5
  }
];

function sleepSync(ms: number): void {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // busy wait for simple sync retry logic
  }
}

function withBusyRetry<T>(task: () => T, retries = 8): T {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return task();
    } catch (error) {
      const sqliteError = error as { code?: string };
      if (sqliteError.code !== "SQLITE_BUSY" || attempt === retries - 1) {
        throw error;
      }
      sleepSync(80 * (attempt + 1));
      attempt += 1;
    }
  }

  return task();
}

function now(): string {
  return new Date().toISOString();
}

function createSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      price_from TEXT NOT NULL,
      image_url TEXT NOT NULL,
      seo_title TEXT NOT NULL,
      seo_description TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pricing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price_from TEXT NOT NULL,
      comment TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      text TEXT NOT NULL,
      rating INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      car_brand TEXT NOT NULL,
      car_model TEXT NOT NULL,
      car_year INTEGER NOT NULL,
      start_type TEXT NOT NULL DEFAULT '',
      is_under_warranty INTEGER NOT NULL DEFAULT 0,
      features_json TEXT NOT NULL DEFAULT '[]',
      needs_old_demount INTEGER NOT NULL DEFAULT 0,
      selection_stage TEXT NOT NULL DEFAULT '',
      desired_slot TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'new',
      service_id INTEGER,
      service_name TEXT NOT NULL,
      comment TEXT NOT NULL,
      needs_autostart INTEGER NOT NULL,
      consent INTEGER NOT NULL,
      ip TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      center_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      request_email TEXT NOT NULL,
      whatsapp_url TEXT NOT NULL DEFAULT '',
      telegram_url TEXT NOT NULL DEFAULT '',
      telegram_bot_token TEXT NOT NULL DEFAULT '',
      telegram_chat_id TEXT NOT NULL DEFAULT '',
      metrika_id TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL,
      work_hours TEXT NOT NULL,
      map_iframe TEXT NOT NULL,
      default_seo_title TEXT NOT NULL,
      default_seo_description TEXT NOT NULL,
      smtp_host TEXT NOT NULL,
      smtp_port INTEGER NOT NULL,
      smtp_secure INTEGER NOT NULL,
      smtp_user TEXT NOT NULL,
      smtp_password TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS page_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      hero_title TEXT NOT NULL,
      hero_subtitle TEXT NOT NULL,
      hero_button_text TEXT NOT NULL,
      advantages_json TEXT NOT NULL,
      faq_json TEXT NOT NULL DEFAULT '[]',
      about_text TEXT NOT NULL,
      home_seo_title TEXT NOT NULL,
      home_seo_description TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

function hasColumn(table: "site_settings" | "page_content" | "contact_requests", column: string): boolean {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return columns.some((item) => item.name === column);
}

function addColumnIfMissing(
  table: "site_settings" | "page_content" | "contact_requests",
  column: string,
  sql: string
): void {
  if (hasColumn(table, column)) {
    return;
  }

  try {
    db.exec(sql);
  } catch (error) {
    const sqliteError = error as { code?: string; message?: string };
    const isDuplicateColumn = sqliteError.code === "SQLITE_ERROR" && sqliteError.message?.toLowerCase().includes("duplicate column");

    if (!isDuplicateColumn) {
      throw error;
    }
  }
}

function ensureSchemaColumns(): void {
  addColumnIfMissing("site_settings", "whatsapp_url", "ALTER TABLE site_settings ADD COLUMN whatsapp_url TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing("site_settings", "telegram_url", "ALTER TABLE site_settings ADD COLUMN telegram_url TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(
    "site_settings",
    "telegram_bot_token",
    "ALTER TABLE site_settings ADD COLUMN telegram_bot_token TEXT NOT NULL DEFAULT ''"
  );
  addColumnIfMissing(
    "site_settings",
    "telegram_chat_id",
    "ALTER TABLE site_settings ADD COLUMN telegram_chat_id TEXT NOT NULL DEFAULT ''"
  );
  addColumnIfMissing("site_settings", "metrika_id", "ALTER TABLE site_settings ADD COLUMN metrika_id TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing("page_content", "faq_json", "ALTER TABLE page_content ADD COLUMN faq_json TEXT NOT NULL DEFAULT '[]'");
  addColumnIfMissing("contact_requests", "start_type", "ALTER TABLE contact_requests ADD COLUMN start_type TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(
    "contact_requests",
    "is_under_warranty",
    "ALTER TABLE contact_requests ADD COLUMN is_under_warranty INTEGER NOT NULL DEFAULT 0"
  );
  addColumnIfMissing(
    "contact_requests",
    "features_json",
    "ALTER TABLE contact_requests ADD COLUMN features_json TEXT NOT NULL DEFAULT '[]'"
  );
  addColumnIfMissing(
    "contact_requests",
    "needs_old_demount",
    "ALTER TABLE contact_requests ADD COLUMN needs_old_demount INTEGER NOT NULL DEFAULT 0"
  );
  addColumnIfMissing(
    "contact_requests",
    "selection_stage",
    "ALTER TABLE contact_requests ADD COLUMN selection_stage TEXT NOT NULL DEFAULT ''"
  );
  addColumnIfMissing(
    "contact_requests",
    "desired_slot",
    "ALTER TABLE contact_requests ADD COLUMN desired_slot TEXT NOT NULL DEFAULT ''"
  );
  addColumnIfMissing("contact_requests", "status", "ALTER TABLE contact_requests ADD COLUMN status TEXT NOT NULL DEFAULT 'new'");
}

function isLegacySeedData(): boolean {
  const settings = db.prepare("SELECT center_name FROM site_settings WHERE id = 1").get() as
    | {
        center_name: string;
      }
    | undefined;

  const legacyServices = db
    .prepare("SELECT COUNT(*) as count FROM services WHERE slug IN ('ustanovka-avtosignalizaciy', 'ustanovka-avtozapuska')")
    .get() as { count: number };

  return settings?.center_name === "АвтоЩит 69" || legacyServices.count > 0;
}

function seedSettings(forceUpdate: boolean): void {
  const timestamp = now();

  db.prepare(
    `
    INSERT OR IGNORE INTO site_settings (
      id, center_name, phone, email, request_email, whatsapp_url, telegram_url,
      telegram_bot_token, telegram_chat_id, metrika_id, address, work_hours, map_iframe,
      default_seo_title, default_seo_description, smtp_host, smtp_port, smtp_secure,
      smtp_user, smtp_password, updated_at
    ) VALUES (
      1, @center_name, @phone, @email, @request_email, @whatsapp_url, @telegram_url,
      @telegram_bot_token, @telegram_chat_id, @metrika_id, @address, @work_hours, @map_iframe,
      @default_seo_title, @default_seo_description, @smtp_host, @smtp_port, @smtp_secure,
      @smtp_user, @smtp_password, @updated_at
    )
    `
  ).run({ ...DEFAULT_SETTINGS, updated_at: timestamp });

  if (forceUpdate) {
    db.prepare(
      `
      UPDATE site_settings SET
        center_name = @center_name,
        phone = @phone,
        email = @email,
        request_email = @request_email,
        whatsapp_url = @whatsapp_url,
        telegram_url = @telegram_url,
        telegram_bot_token = @telegram_bot_token,
        telegram_chat_id = @telegram_chat_id,
        metrika_id = @metrika_id,
        address = @address,
        work_hours = @work_hours,
        map_iframe = @map_iframe,
        default_seo_title = @default_seo_title,
        default_seo_description = @default_seo_description,
        updated_at = @updated_at
      WHERE id = 1
      `
    ).run({ ...DEFAULT_SETTINGS, updated_at: timestamp });
  }
}

function seedPageContent(forceUpdate: boolean): void {
  const timestamp = now();

  db.prepare(
    `
    INSERT OR IGNORE INTO page_content (
      id, hero_title, hero_subtitle, hero_button_text, advantages_json, faq_json,
      about_text, home_seo_title, home_seo_description, updated_at
    ) VALUES (
      1, @hero_title, @hero_subtitle, @hero_button_text, @advantages_json, @faq_json,
      @about_text, @home_seo_title, @home_seo_description, @updated_at
    )
    `
  ).run({ ...DEFAULT_CONTENT, updated_at: timestamp });

  db.prepare(
    `
    UPDATE page_content
    SET faq_json = @faq_json, updated_at = @updated_at
    WHERE id = 1 AND (faq_json IS NULL OR TRIM(faq_json) = '' OR TRIM(faq_json) = '[]')
    `
  ).run({ faq_json: DEFAULT_CONTENT.faq_json, updated_at: timestamp });

  if (forceUpdate) {
    db.prepare(
      `
      UPDATE page_content SET
        hero_title = @hero_title,
        hero_subtitle = @hero_subtitle,
        hero_button_text = @hero_button_text,
        advantages_json = @advantages_json,
        faq_json = @faq_json,
        about_text = @about_text,
        home_seo_title = @home_seo_title,
        home_seo_description = @home_seo_description,
        updated_at = @updated_at
      WHERE id = 1
      `
    ).run({ ...DEFAULT_CONTENT, updated_at: timestamp });
  }
}

function scrubCopiedContacts(): void {
  const row = db
    .prepare("SELECT phone, email, request_email, address FROM site_settings WHERE id = 1")
    .get() as
    | {
        phone: string;
        email: string;
        request_email: string;
        address: string;
      }
    | undefined;

  if (!row) {
    return;
  }

  const hasCopiedContacts =
    row.phone === COPIED_CONTACT_DEFAULTS.phone &&
    row.email === COPIED_CONTACT_DEFAULTS.email &&
    row.request_email === COPIED_CONTACT_DEFAULTS.request_email &&
    row.address === COPIED_CONTACT_DEFAULTS.address;

  if (!hasCopiedContacts) {
    return;
  }

  db.prepare(
    `
    UPDATE site_settings SET
      phone = @phone,
      email = @email,
      request_email = @request_email,
      address = @address,
      updated_at = @updated_at
    WHERE id = 1
    `
  ).run({
    phone: DEFAULT_SETTINGS.phone,
    email: DEFAULT_SETTINGS.email,
    request_email: DEFAULT_SETTINGS.request_email,
    address: DEFAULT_SETTINGS.address,
    updated_at: now()
  });
}

function seedAdmin(): void {
  const login = process.env.ADMIN_LOGIN || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin12345";
  const passwordHash = bcrypt.hashSync(password, 10);

  db.prepare(
    `
    INSERT INTO admin (login, password_hash, created_at)
    SELECT @login, @password_hash, @created_at
    WHERE NOT EXISTS (SELECT 1 FROM admin LIMIT 1)
    `
  ).run({
    login,
    password_hash: passwordHash,
    created_at: now()
  });
}

function seedServices(forceReplace: boolean): void {
  const count = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };
  if (count.count > 0 && !forceReplace) {
    return;
  }

  if (forceReplace) {
    db.prepare("DELETE FROM services").run();
  }

  const timestamp = now();
  const insertService = db.prepare(
    `
    INSERT INTO services (
      title, short_description, description, price_from, image_url,
      seo_title, seo_description, slug, created_at, updated_at
    ) VALUES (
      @title, @short_description, @description, @price_from, @image_url,
      @seo_title, @seo_description, @slug, @created_at, @updated_at
    )
    `
  );

  for (const service of STARLINE_SERVICE_SEEDS) {
    insertService.run({
      ...service,
      created_at: timestamp,
      updated_at: timestamp
    });
  }
}

function seedPricing(forceReplace: boolean): void {
  const count = db.prepare("SELECT COUNT(*) as count FROM pricing").get() as { count: number };
  if (count.count > 0 && !forceReplace) {
    return;
  }

  if (forceReplace) {
    db.prepare("DELETE FROM pricing").run();
  }

  const timestamp = now();
  const insertPricing = db.prepare(
    "INSERT INTO pricing (title, price_from, comment, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  );

  STARLINE_PRICING_BASE.forEach((item, index) => {
    insertPricing.run(item.title, item.price_from, item.comment, (index + 1) * 10, timestamp, timestamp);
  });
}

function seedReviews(forceReplace: boolean): void {
  const count = db.prepare("SELECT COUNT(*) as count FROM reviews").get() as { count: number };
  if (count.count > 0 && !forceReplace) {
    return;
  }

  if (forceReplace) {
    db.prepare("DELETE FROM reviews").run();
  }

  const timestamp = now();
  const insertReview = db.prepare("INSERT INTO reviews (author, text, rating, created_at, updated_at) VALUES (?, ?, ?, ?, ?)");

  for (const review of STARLINE_REVIEW_SEEDS) {
    insertReview.run(review.author, review.text, review.rating, timestamp, timestamp);
  }
}

function initDatabase(): void {
  createSchema();
  ensureSchemaColumns();

  const legacySeedData = isLegacySeedData();

  seedSettings(legacySeedData);
  scrubCopiedContacts();
  seedPageContent(legacySeedData);
  seedAdmin();
  seedServices(legacySeedData);
  seedPricing(legacySeedData);
  seedReviews(legacySeedData);
}

withBusyRetry(() => db.pragma("journal_mode = WAL"));
withBusyRetry(() => initDatabase());

export { db, now };
