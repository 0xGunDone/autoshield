import fs from "node:fs";
import path from "node:path";
import pino from "pino";

type LogMeta = Record<string, unknown>;

const logPath =
  process.env.ERROR_LOG_PATH ||
  path.join(process.cwd(), "data", "api-errors.log");
fs.mkdirSync(path.dirname(logPath), { recursive: true });

export const pinoLogger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    base: { env: process.env.NODE_ENV },
  },
  pino.multistream([
    { stream: process.stdout },
    { stream: fs.createWriteStream(logPath, { flags: "a" }) },
  ]),
);

function serializeError(error: unknown): {
  name: string;
  message: string;
  stack?: string;
} {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    name: "UnknownError",
    message: typeof error === "string" ? error : JSON.stringify(error),
  };
}

export function logApiError(
  scope: string,
  error: unknown,
  meta: LogMeta = {},
): void {
  pinoLogger.error(
    {
      scope,
      error: serializeError(error),
      meta,
    },
    "API Error occurred",
  );
}
