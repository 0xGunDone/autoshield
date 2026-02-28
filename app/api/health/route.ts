import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const row = db.prepare("SELECT 1 as is_alive").get() as {
      is_alive: number;
    };
    if (row?.is_alive === 1) {
      return NextResponse.json({
        status: "ok",
        db_status: "connected",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    }
    throw new Error("DB Error");
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 },
    );
  }
}
