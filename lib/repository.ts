import { db, now } from "@/lib/db";
import type { Admin, ContactRequest, PageContent, PricingItem, Review, Service, SiteSettings } from "@/lib/types";

export function getAdminByLogin(login: string): Admin | undefined {
  return db.prepare("SELECT * FROM admin WHERE login = ?").get(login) as Admin | undefined;
}

export function getSiteSettings(): SiteSettings {
  return db.prepare("SELECT * FROM site_settings WHERE id = 1").get() as SiteSettings;
}

export function updateSiteSettings(input: Omit<SiteSettings, "id" | "updated_at">): void {
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
      smtp_host = @smtp_host,
      smtp_port = @smtp_port,
      smtp_secure = @smtp_secure,
      smtp_user = @smtp_user,
      smtp_password = @smtp_password,
      updated_at = @updated_at
    WHERE id = 1
    `
  ).run({ ...input, updated_at: now() });
}

export function getPageContent(): PageContent {
  return db.prepare("SELECT * FROM page_content WHERE id = 1").get() as PageContent;
}

export function updatePageContent(input: Omit<PageContent, "id" | "updated_at">): void {
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
  ).run({ ...input, updated_at: now() });
}

export function listServices(): Service[] {
  return db.prepare("SELECT * FROM services ORDER BY created_at DESC").all() as Service[];
}

export function listServiceOptions(): Pick<Service, "id" | "title">[] {
  return db.prepare("SELECT id, title FROM services ORDER BY title ASC").all() as Pick<Service, "id" | "title">[];
}

export function getServiceById(id: number): Service | undefined {
  return db.prepare("SELECT * FROM services WHERE id = ?").get(id) as Service | undefined;
}

export function getServiceBySlug(slug: string): Service | undefined {
  return db.prepare("SELECT * FROM services WHERE slug = ?").get(slug) as Service | undefined;
}

export function countSlug(slug: string, excludeId?: number): number {
  if (excludeId) {
    const row = db.prepare("SELECT COUNT(*) as count FROM services WHERE slug = ? AND id != ?").get(slug, excludeId) as { count: number };
    return row.count;
  }
  const row = db.prepare("SELECT COUNT(*) as count FROM services WHERE slug = ?").get(slug) as { count: number };
  return row.count;
}

export function createService(input: Omit<Service, "id" | "created_at" | "updated_at">): number {
  const timestamp = now();
  const result = db
    .prepare(
      `
      INSERT INTO services (
        title, short_description, description, price_from, image_url,
        seo_title, seo_description, slug, created_at, updated_at
      ) VALUES (
        @title, @short_description, @description, @price_from, @image_url,
        @seo_title, @seo_description, @slug, @created_at, @updated_at
      )
      `
    )
    .run({ ...input, created_at: timestamp, updated_at: timestamp });
  return Number(result.lastInsertRowid);
}

export function updateService(id: number, input: Omit<Service, "id" | "created_at" | "updated_at">): void {
  db.prepare(
    `
    UPDATE services SET
      title = @title,
      short_description = @short_description,
      description = @description,
      price_from = @price_from,
      image_url = @image_url,
      seo_title = @seo_title,
      seo_description = @seo_description,
      slug = @slug,
      updated_at = @updated_at
    WHERE id = @id
    `
  ).run({ ...input, id, updated_at: now() });
}

export function deleteService(id: number): void {
  db.prepare("DELETE FROM services WHERE id = ?").run(id);
}

export function listPricing(): PricingItem[] {
  return db.prepare("SELECT * FROM pricing ORDER BY sort_order ASC, created_at DESC").all() as PricingItem[];
}

export function getPricingById(id: number): PricingItem | undefined {
  return db.prepare("SELECT * FROM pricing WHERE id = ?").get(id) as PricingItem | undefined;
}

export function createPricing(input: Omit<PricingItem, "id" | "created_at" | "updated_at">): number {
  const timestamp = now();
  const result = db
    .prepare(
      "INSERT INTO pricing (title, price_from, comment, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(input.title, input.price_from, input.comment, input.sort_order, timestamp, timestamp);
  return Number(result.lastInsertRowid);
}

export function updatePricing(id: number, input: Omit<PricingItem, "id" | "created_at" | "updated_at">): void {
  db.prepare(
    `
    UPDATE pricing SET
      title = @title,
      price_from = @price_from,
      comment = @comment,
      sort_order = @sort_order,
      updated_at = @updated_at
    WHERE id = @id
    `
  ).run({ ...input, id, updated_at: now() });
}

export function deletePricing(id: number): void {
  db.prepare("DELETE FROM pricing WHERE id = ?").run(id);
}

export function listReviews(): Review[] {
  return db.prepare("SELECT * FROM reviews ORDER BY created_at DESC").all() as Review[];
}

export function getReviewById(id: number): Review | undefined {
  return db.prepare("SELECT * FROM reviews WHERE id = ?").get(id) as Review | undefined;
}

export function createReview(input: Omit<Review, "id" | "created_at" | "updated_at">): number {
  const timestamp = now();
  const result = db
    .prepare("INSERT INTO reviews (author, text, rating, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
    .run(input.author, input.text, input.rating, timestamp, timestamp);
  return Number(result.lastInsertRowid);
}

export function updateReview(id: number, input: Omit<Review, "id" | "created_at" | "updated_at">): void {
  db.prepare(
    `
    UPDATE reviews SET
      author = @author,
      text = @text,
      rating = @rating,
      updated_at = @updated_at
    WHERE id = @id
    `
  ).run({ ...input, id, updated_at: now() });
}

export function deleteReview(id: number): void {
  db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
}

export function listContactRequests(): ContactRequest[] {
  return db.prepare("SELECT * FROM contact_requests ORDER BY created_at DESC").all() as ContactRequest[];
}

export function listContactRequestsFiltered(params: { status?: "all" | "new" | "in_progress" | "closed"; query?: string }): ContactRequest[] {
  const clauses: string[] = [];
  const values: unknown[] = [];

  if (params.status && params.status !== "all") {
    clauses.push("status = ?");
    values.push(params.status);
  }

  if (params.query) {
    clauses.push("(name LIKE ? OR phone LIKE ? OR car_brand LIKE ? OR car_model LIKE ?)");
    const like = `%${params.query}%`;
    values.push(like, like, like, like);
  }

  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  return db.prepare(`SELECT * FROM contact_requests ${whereClause} ORDER BY created_at DESC`).all(...values) as ContactRequest[];
}

export function getContactRequestById(id: number): ContactRequest | undefined {
  return db.prepare("SELECT * FROM contact_requests WHERE id = ?").get(id) as ContactRequest | undefined;
}

export function updateContactRequestStatus(id: number, status: "new" | "in_progress" | "closed"): void {
  db.prepare("UPDATE contact_requests SET status = ? WHERE id = ?").run(status, id);
}

export function createContactRequest(
  input: Omit<ContactRequest, "id" | "created_at"> & {
    created_at?: string;
  }
): number {
  const result = db
    .prepare(
      `
      INSERT INTO contact_requests (
        name, phone, car_brand, car_model, car_year, start_type, is_under_warranty,
        features_json, needs_old_demount, selection_stage, desired_slot, status,
        service_id, service_name, comment, needs_autostart, consent, ip, created_at
      ) VALUES (
        @name, @phone, @car_brand, @car_model, @car_year, @start_type, @is_under_warranty,
        @features_json, @needs_old_demount, @selection_stage, @desired_slot, @status,
        @service_id, @service_name, @comment, @needs_autostart, @consent, @ip, @created_at
      )
      `
    )
    .run({ ...input, created_at: input.created_at || now() });

  return Number(result.lastInsertRowid);
}
