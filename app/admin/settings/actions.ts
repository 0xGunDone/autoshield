"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/auth";
import { updateSiteSettings } from "@/lib/repository";
import { settingsSchema } from "@/lib/validators";
import { logApiError } from "@/lib/logger";

export async function updateSettingsAction(formData: FormData) {
  await requireAdminPage();
  const rawData = Object.fromEntries(formData.entries());

  const parsed = settingsSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    redirect(`/admin/settings?error=${encodeURIComponent(errorMsg)}`);
  }

  try {
    updateSiteSettings(parsed.data);
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
  } catch (error) {
    logApiError("admin:settings:update", error);
    redirect(
      `/admin/settings?error=${encodeURIComponent("Internal error saving settings")}`,
    );
  }

  redirect("/admin/settings?saved=1");
}
