export type Service = {
  id: number;
  title: string;
  short_description: string;
  description: string;
  price_from: string;
  image_url: string;
  seo_title: string;
  seo_description: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type PricingItem = {
  id: number;
  title: string;
  price_from: string;
  comment: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: number;
  author: string;
  text: string;
  rating: number;
  created_at: string;
  updated_at: string;
};

export type ContactRequest = {
  id: number;
  name: string;
  phone: string;
  car_brand: string;
  car_model: string;
  car_year: number;
  start_type: string;
  is_under_warranty: number;
  features_json: string;
  needs_old_demount: number;
  selection_stage: string;
  desired_slot: "today" | "tomorrow" | "week" | "call" | "";
  status: "new" | "in_progress" | "closed";
  service_id: number | null;
  service_name: string;
  comment: string;
  needs_autostart: number;
  consent: number;
  ip: string;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  center_name: string;
  phone: string;
  email: string;
  request_email: string;
  whatsapp_url: string;
  telegram_url: string;
  telegram_bot_token: string;
  telegram_chat_id: string;
  metrika_id: string;
  address: string;
  work_hours: string;
  map_iframe: string;
  default_seo_title: string;
  default_seo_description: string;
  smtp_host: string;
  smtp_port: number;
  smtp_secure: number;
  smtp_user: string;
  smtp_password: string;
  updated_at: string;
};

export type PageContent = {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  advantages_json: string;
  faq_json: string;
  about_text: string;
  home_seo_title: string;
  home_seo_description: string;
  updated_at: string;
};

export type Admin = {
  id: number;
  login: string;
  password_hash: string;
  created_at: string;
};
