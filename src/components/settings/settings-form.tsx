"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SettingsInitial {
  displayName: string;
  username: string;
  bio: string;
  image: string;
}

const inputCls =
  "h-10 w-full rounded-lg border border-input bg-card/60 px-3 text-sm outline-none ring-ring focus:ring-2";

export function SettingsForm({ initial }: { initial: SettingsInitial }) {
  const [form, setForm] = useState<SettingsInitial>(initial);
  const [prefs, setPrefs] = useState({
    matchAlerts: true,
    commentReplies: true,
    weeklyDigest: false,
    publicProfile: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SettingsInitial>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    // Frontend-only: simulate a save. Wire to a server action + DB later.
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>How you appear across Stark.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Display name">
            <input className={inputCls} value={form.displayName} onChange={(e) => set("displayName", e.target.value)} maxLength={60} />
          </Field>
          <Field label="Username">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">@</span>
              <input className={inputCls} value={form.username} onChange={(e) => set("username", e.target.value)} maxLength={30} />
            </div>
          </Field>
          <Field label="Avatar image URL">
            <input className={inputCls} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Bio">
            <textarea
              className="w-full rounded-lg border border-input bg-card/60 p-3 text-sm leading-relaxed outline-none ring-ring focus:ring-2"
              rows={3}
              maxLength={280}
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what Stark pings you about.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <Toggle label="Ranked match alerts" desc="When a match is found in the Arena." checked={prefs.matchAlerts} onChange={(v) => { setPrefs((p) => ({ ...p, matchAlerts: v })); setSaved(false); }} />
          <Toggle label="Comment replies" desc="When someone replies to your threads." checked={prefs.commentReplies} onChange={(v) => { setPrefs((p) => ({ ...p, commentReplies: v })); setSaved(false); }} />
          <Toggle label="Weekly digest" desc="A summary of your progress each week." checked={prefs.weeklyDigest} onChange={(v) => { setPrefs((p) => ({ ...p, weeklyDigest: v })); setSaved(false); }} />
          <Toggle label="Public profile" desc="Let others view your profile and stats." checked={prefs.publicProfile} onChange={(v) => { setPrefs((p) => ({ ...p, publicProfile: v })); setSaved(false); }} />
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-sm text-emerald-400"
            >
              <Check className="size-4" /> Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label, desc, checked, onChange,
}: {
  label: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-input",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
