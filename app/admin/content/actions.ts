"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/auth";
import { updatePageContent } from "@/lib/repository";
import { contentSchema } from "@/lib/validators";
import { logApiError } from "@/lib/logger";

export async function updateContentAction(formData: FormData) {
  await requireAdminPage();
  const rawData = Object.fromEntries(formData.entries());

  const parsed = contentSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    redirect(`/admin/content?error=${encodeURIComponent(errorMsg)}`);
  }

  try {
    updatePageContent(parsed.data);
    revalidatePath("/", "layout");
    revalidatePath("/admin/content");
  } catch (error) {
    logApiError("admin:content:update", error);
    redirect(
      `/admin/content?error=${encodeURIComponent("Internal Error saving content")}`,
    );
  }

  redirect("/admin/content?saved=1");
}
