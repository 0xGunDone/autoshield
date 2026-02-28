import fs from "node:fs";
import path from "node:path";

type LogMeta = Record<string, unknown>;

function serializeError(error: unknown): { name: string; message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  return {
    name: "UnknownError",
    message: typeof error === "string" ? error : JSON.stringify(error)
  };
}

export function logApiError(scope: string, error: unknown, meta: LogMeta = {}): void {
  const payload = {
    time: new Date().toISOString(),
    scope,
    error: serializeError(error),
    meta
  };

  console.error("[api-error]", JSON.stringify(payload));

  try {
    const logPath = process.env.ERROR_LOG_PATH || path.join(process.cwd(), "data", "api-errors.log");
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, `${JSON.stringify(payload)}\n`, "utf8");
  } catch {
    // ignore file logging failures
  }
}
