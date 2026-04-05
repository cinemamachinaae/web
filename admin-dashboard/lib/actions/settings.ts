"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateSiteSettings(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const tagline = formData.get("tagline") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const vimeoUrl = formData.get("vimeoUrl") as string;
    const primaryBronze = formData.get("primaryBronze") as string;

    if (!title || !contactEmail) {
      return { error: "Title and Email are required." };
    }

    await prisma.siteSettings.update({
      where: { id: 1 },
      data: {
        title,
        tagline,
        contactEmail,
        phoneNumber,
        vimeoUrl,
        primaryBronze,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/"); // Update overview too
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { error: "An unexpected error occurred while saving settings." };
  }
}
