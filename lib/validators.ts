import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .max(500)
  .default("")
  .refine((value) => !value || /^https?:\/\/.+/i.test(value), "Укажите корректный URL с http:// или https://");

export const loginSchema = z.object({
  login: z.string().min(3).max(64),
  password: z.string().min(6).max(128)
});

export const serviceSchema = z.object({
  title: z.string().min(3).max(180),
  short_description: z.string().min(10).max(400),
  description: z.string().min(20).max(5000),
  price_from: z.string().min(1).max(80),
  image_url: z.string().url().max(500),
  seo_title: z.string().min(10).max(180),
  seo_description: z.string().min(30).max(300),
  slug: z.string().max(180).optional().default("")
});

export const pricingSchema = z.object({
  title: z.string().min(2).max(180),
  price_from: z.string().min(1).max(80),
  comment: z.string().max(500).default(""),
  sort_order: z.coerce.number().int().min(0).max(10000)
});

export const reviewSchema = z.object({
  author: z.string().min(2).max(120),
  text: z.string().min(10).max(1200),
  rating: z.coerce.number().int().min(1).max(5)
});

export const settingsSchema = z.object({
  center_name: z.string().min(2).max(180),
  phone: z.string().min(5).max(64),
  email: z.string().email().max(180),
  request_email: z.string().email().max(180),
  whatsapp_url: optionalUrlSchema,
  telegram_url: optionalUrlSchema,
  telegram_bot_token: z.string().max(180).default(""),
  telegram_chat_id: z.string().max(180).default(""),
  metrika_id: z.string().max(30).default(""),
  address: z.string().min(4).max(220),
  work_hours: z.string().min(4).max(180),
  map_iframe: z.string().max(3000).default(""),
  default_seo_title: z.string().min(10).max(180),
  default_seo_description: z.string().min(20).max(300),
  smtp_host: z.string().min(3).max(120),
  smtp_port: z.coerce.number().int().min(1).max(65535),
  smtp_secure: z.coerce.number().int().min(0).max(1),
  smtp_user: z.string().max(180).default(""),
  smtp_password: z.string().max(180).default("")
});

export const contentSchema = z.object({
  hero_title: z.string().min(10).max(220),
  hero_subtitle: z.string().min(20).max(500),
  hero_button_text: z.string().min(2).max(50),
  advantages_json: z
    .string()
    .min(2)
    .max(3000)
    .refine((value) => {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) && parsed.every((item) => typeof item === "string");
      } catch {
        return false;
      }
    }, "advantages_json должен быть JSON-массивом строк"),
  faq_json: z
    .string()
    .min(2)
    .max(6000)
    .refine((value) => {
      try {
        const parsed = JSON.parse(value);
        return (
          Array.isArray(parsed) &&
          parsed.every(
            (item) =>
              item &&
              typeof item === "object" &&
              typeof item.question === "string" &&
              typeof item.answer === "string" &&
              item.question.trim().length > 0 &&
              item.answer.trim().length > 0
          )
        );
      } catch {
        return false;
      }
    }, "faq_json должен быть JSON-массивом объектов {question, answer}"),
  about_text: z.string().min(20).max(3000),
  home_seo_title: z.string().min(10).max(180),
  home_seo_description: z.string().min(20).max(300)
});

export const contactRequestSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(40),
  car_brand: z.string().min(1).max(80),
  car_model: z.string().min(1).max(80),
  car_year: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1),
  start_type: z.enum(["button", "key"]),
  is_under_warranty: z.enum(["yes", "no"]),
  features: z.array(z.enum(["autostart", "remote", "phone", "gsm", "gps", "unsure"])).min(1).max(6),
  needs_old_demount: z.enum(["yes", "no"]),
  selection_stage: z.enum(["chosen", "consultation"]),
  desired_slot: z.enum(["today", "tomorrow", "week", "call"]).default("call"),
  consent: z.literal(true),
  honeypot: z.string().max(0).default("")
});
