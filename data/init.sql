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
