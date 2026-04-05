"use client";

import React, { useActionState, useTransition } from "react";
import { updateSiteSettings } from "@/lib/actions/settings";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";

interface SettingsFormProps {
  initialData: {
    title: string;
    tagline: string | null;
    contactEmail: string;
    phoneNumber: string;
    vimeoUrl: string;
    primaryBronze: string;
  };
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [state, formAction] = useActionState(updateSiteSettings, null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form action={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Feedback Messages */}
      {state?.error && (
        <div className="p-4 rounded bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 animate-in slide-in-from-top-2">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{state.error}</p>
        </div>
      )}
      {state?.success && (
        <div className="p-4 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 animate-in slide-in-from-top-2">
          <CheckCircle2 size={18} />
          <p className="text-sm font-medium">Settings updated successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Identity */}
        <div className="admin-card space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-bronze mb-4">Core Identity</h3>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block">Site Title</label>
            <input 
              name="title"
              defaultValue={initialData.title}
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-bronze/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block">Tagline</label>
            <input 
              name="tagline"
              defaultValue={initialData.tagline || ""}
              className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-bronze/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block">Vimeo Embed URL</label>
            <input 
              name="vimeoUrl"
              defaultValue={initialData.vimeoUrl}
              className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-bronze/50 transition-colors font-mono text-xs"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="admin-card space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-bronze mb-4">Contact Detail</h3>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block">Contact Email</label>
            <input 
              name="contactEmail"
              type="email"
              defaultValue={initialData.contactEmail}
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-bronze/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block">Phone Number</label>
            <input 
              name="phoneNumber"
              defaultValue={initialData.phoneNumber}
              className="w-full bg-white/[0.03] border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-bronze/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block">Primary Bronze Hex</label>
            <div className="flex gap-2">
              <input 
                name="primaryBronze"
                defaultValue={initialData.primaryBronze}
                className="flex-1 bg-white/[0.03] border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-bronze/50 transition-colors font-mono"
              />
              <div 
                className="w-11 rounded border border-white/10"
                style={{ backgroundColor: initialData.primaryBronze }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-white/5">
        <button 
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-md bg-bronze text-black font-bold text-sm hover:bg-bronze-light disabled:opacity-50 disabled:cursor-wait transition-all shadow-[0_0_15px_rgba(226,193,155,0.2)]"
        >
          {isPending ? (
             <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
          ) : (
            <Save size={18} />
          )}
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
