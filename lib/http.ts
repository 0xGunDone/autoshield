import { z } from "zod";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function parseJsonBody<S extends z.ZodTypeAny>(
  request: Request,
  schema: S,
  maxBytes = 120_000
): Promise<z.output<S>> {
  ensureBodySize(request, maxBytes);

  const raw = await request.text();
  if (raw.length > maxBytes) {
    throw new HttpError(413, "Payload too large");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw || "{}");
  } catch {
    throw new HttpError(400, "Invalid JSON");
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new HttpError(400, result.error.issues[0]?.message || "Validation error");
  }

  return result.data;
}

export async function parseFormBody<S extends z.ZodTypeAny>(
  request: Request,
  schema: S,
  maxBytes = 120_000
): Promise<z.output<S>> {
  ensureBodySize(request, maxBytes);

  const formData = await request.formData();
  const payload: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    payload[key] = typeof value === "string" ? value : value.name;
  }

  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new HttpError(400, result.error.issues[0]?.message || "Validation error");
  }

  return result.data;
}

export function ensureBodySize(request: Request, maxBytes = 120_000): void {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > maxBytes) {
    throw new HttpError(413, "Payload too large");
  }
}

export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}
