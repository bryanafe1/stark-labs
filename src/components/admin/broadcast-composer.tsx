"use client";

import { useState, useTransition } from "react";
import { Send, Loader2, FlaskConical, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendBroadcast, type Audience, type BroadcastResult } from "@/server/actions/broadcast";

const AUDIENCES: { key: Audience; label: string }[] = [
  { key: "all", label: "All users" },
  { key: "inactive", label: "Inactive — signed up, did nothing" },
  { key: "free", label: "Free users" },
  { key: "paid", label: "Paid users" },
];

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/50";

export function BroadcastComposer({ counts }: { counts: Record<Audience, number> }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [audience, setAudience] = useState<Audience>("all");
  const [testTo, setTestTo] = useState("");
  const [result, setResult] = useState<BroadcastResult | null>(null);
  const [pending, startTransition] = useTransition();

  const count = counts[audience] ?? 0;

  const run = (testMode: boolean) => {
    setResult(null);
    if (!subject.trim() || !body.trim()) {
      setResult({ ok: false, error: "Subject and body are required." });
      return;
    }
    if (testMode && !testTo.trim()) {
      setResult({ ok: false, error: "Enter a test email address first." });
      return;
    }
    if (
      !testMode &&
      !window.confirm(
        `Send this email to ${count} ${audience} user${count === 1 ? "" : "s"}? This can't be undone.`,
      )
    )
      return;
    startTransition(async () => {
      const r = await sendBroadcast({
        subject,
        body,
        ctaLabel: ctaLabel.trim() || undefined,
        ctaUrl: ctaUrl.trim() || undefined,
        audience,
        testTo: testMode ? testTo.trim() : undefined,
      });
      setResult(r);
    });
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Subject
        </label>
        <input
          className={inputCls}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="You've got a free mock interview waiting"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Body
        </label>
        <textarea
          className={`${inputCls} min-h-[10rem] leading-relaxed`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={"Write your message. Plain text — line breaks are preserved.\n\nIt's wrapped in the Overclocker branded template automatically."}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Button label <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <input
            className={inputCls}
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            placeholder="Start my free mock interview"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Button link <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <input
            className={inputCls}
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            placeholder="https://overclocker.dev/interview"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Audience
        </label>
        <div className="flex flex-wrap gap-2">
          {AUDIENCES.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => setAudience(a.key)}
              className={
                "rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring " +
                (audience === a.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input text-muted-foreground hover:border-foreground/30 hover:text-foreground")
              }
            >
              {a.label}{" "}
              <span className="font-mono text-xs opacity-70">({counts[a.key] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Test send */}
      <div className="rounded-xl border border-border bg-card/40 p-4">
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Send a test to yourself first
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            className={`${inputCls} flex-1`}
            type="email"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            placeholder="you@example.com"
          />
          <Button variant="secondary" onClick={() => run(true)} disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <FlaskConical className="size-4" />}
            Send test
          </Button>
        </div>
      </div>

      {result && (
        <div
          className={
            "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm " +
            (result.ok
              ? "border-success/40 bg-success/10 text-success"
              : "border-destructive/40 bg-destructive/10 text-destructive")
          }
        >
          {result.ok ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          ) : (
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          )}
          <span>
            {result.ok
              ? `Sent ${result.sent ?? 0}${result.failed ? ` · ${result.failed} failed` : ""}.`
              : result.error}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          Ready to send to <span className="font-semibold text-foreground">{count}</span>{" "}
          {audience} user{count === 1 ? "" : "s"}.
        </p>
        <Button onClick={() => run(false)} disabled={pending || count === 0}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Send to {count}
        </Button>
      </div>
    </div>
  );
}
