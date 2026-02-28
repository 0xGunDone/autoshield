import type { MetadataRoute } from "next";
import { buildServiceModelPages } from "@/lib/model-pages";
import { listServices } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL || "http://localhost:3000";
  const now = new Date();
  const services = listServices();
  const modelPages = buildServiceModelPages(services);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/models`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contacts`, lastModified: now, changeFrequency: "monthly", priority: 0.8 }
  ];

  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  const modelRoutes = modelPages.map((model) => ({
    url: `${baseUrl}/models/${model.slug}`,
    lastModified: new Date(model.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.72
  }));

  return [...staticRoutes, ...serviceRoutes, ...modelRoutes];
}
