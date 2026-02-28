"use server";

import { revalidatePath } from "next/cache";
import { requireAdminPage } from "@/lib/auth";
import { deleteContactRequest } from "@/lib/repository";

export async function deleteRequestAction(formData: FormData) {
  await requireAdminPage();

  const id = Number(formData.get("id"));
  if (id) {
    deleteContactRequest(id);
    revalidatePath("/admin/requests");
  }
}
