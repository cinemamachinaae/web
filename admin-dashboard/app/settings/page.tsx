import React from "react";
import prisma from "@/lib/db";
import SettingsForm from "@/components/SettingsForm";
import { redirect } from "next/navigation";

async function getSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 1 }
  });
  
  if (!settings) {
    // This should not happen if seeded correctly
    redirect("/overview");
  }

  return settings;
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">System Settings</h2>
        <p className="text-sm text-foreground/50">Configure core identity, global contact channels, and branding.</p>
      </div>
      
      <SettingsForm initialData={settings} />
    </div>
  );
}
