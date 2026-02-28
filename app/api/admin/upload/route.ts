import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { ensureAdminOrReject } from "@/lib/admin-route";

export const runtime = "nodejs";

// Allow larger payloads using standard body limit in Next.js 14+ via standard server action limits or route segment config.
// Body Parser limit must be set in next.config.js experimentally or we just handle it via Next Request (which allows large chunks by default).
// Removed config { api: { bodyParser: false } } since Next.js App Router doesn't use it.

export async function POST(request: Request) {
  const authError = await ensureAdminOrReject(request, "/admin/services");
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Generate unique name
    const ext = path.extname(file.name) || ".png";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    // Create /public/uploads directory if not exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(uploadsDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadsDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
