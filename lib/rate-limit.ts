import { db } from "@/lib/db";

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      key TEXT PRIMARY KEY,
      count INTEGER NOT NULL,
      reset_at INTEGER NOT NULL
    );
  `);
} catch (error) {
  // Ignore table creation errors in edge cases
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();

  // Cleanup old entries (10% chance on every check) to avoid table bloat
  if (Math.random() < 0.1) {
    db.prepare("DELETE FROM rate_limits WHERE reset_at <= ?").run(now);
  }

  const existing = db
    .prepare("SELECT * FROM rate_limits WHERE key = ?")
    .get(key) as { count: number; reset_at: number } | undefined;

  if (!existing || existing.reset_at <= now) {
    db.prepare(
      "INSERT OR REPLACE INTO rate_limits (key, count, reset_at) VALUES (?, ?, ?)",
    ).run(key, 1, now + windowMs);
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  db.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").run(key);
  return true;
}
