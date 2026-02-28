import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, verifyJwt } from "@/lib/jwt";

export async function getAuthPayload() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return verifyJwt(token, process.env.JWT_SECRET || "");
}

export async function requireAdminPage() {
  const payload = await getAuthPayload();
  if (!payload) {
    redirect("/admin/login");
  }
  return payload;
}

export async function isAuthorizedRequest(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE}=`))
    ?.split("=")[1];

  if (!token) {
    return false;
  }

  const payload = await verifyJwt(token, process.env.JWT_SECRET || "");
  return Boolean(payload);
}
