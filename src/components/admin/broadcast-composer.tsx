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

const CUSTOM = "__custom__";

// Common button destinations, so you don't hand-type URLs. `cta` pre-fills the
// button label when the label is still empty.
const DESTINATIONS: { label: string; url: string; cta?: string }[] = [
  { label: "No button", url: "" },
  { label: "Free mock interview", url: "https://overclocker.dev/interview", cta: "Start my free mock interview" },
  { label: "Practice problems", url: "https://overclocker.dev/practice", cta: "Try a practice question" },
  { label: "Voice interview", url: "https://overclocker.dev/simulation", cta: "Try the voice interview" },
  { label: "Lessons", url: "https://overclocker.dev/learn", cta: "Start learning" },
  { label: "Arena", url: "https://overclocker.dev/arena", cta: "Enter the Arena" },
  { label: "Pricing / upgrade", url: "https://overclocker.dev/pricing", cta: "See plans" },
  { label: "Dashboard", url: "https://overclocker.dev/dashboard", cta: "Open my dashboard" },
  { label: "Custom URL…", url: CUSTOM },
];

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/50";

export function BroadcastComposer({ counts }: { counts: Record<Audience, number> }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [labelAutofilled, setLabelAutofilled] = useState(false); // false once the user types their own label
  const [linkChoice, setLinkChoice] = useState(""); // "" = no button, CUSTOM = custom URL, else a preset URL
  const [customUrl, setCustomUrl] = useState("");
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
    const ctaUrl = (linkChoice === CUSTOM ? customUrl.trim() : linkChoice) || undefined;
    startTransition(async () => {
      const r = await sendBroadcast({
        subject,
        body,
        ctaLabel: ctaLabel.trim() || undefined,
        ctaUrl,
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
            onChange={(e) => {
              setCtaLabel(e.target.value);
              setLabelAutofilled(false); // user took over the label
            }}
            placeholder="Start my free mock interview"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Button link <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <select
            className={inputCls}
            value={linkChoice}
            onChange={(e) => {
              const v = e.target.value;
              setLinkChoice(v);
              const d = DESTINATIONS.find((x) => x.url === v);
              // Keep the label in sync with the destination until the user types their own.
              if (d?.cta && (labelAutofilled || !ctaLabel.trim())) {
                setCtaLabel(d.cta);
                setLabelAutofilled(true);
              }
            }}
          >
            {DESTINATIONS.map((d) => (
              <option key={d.label} value={d.url}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {linkChoice === CUSTOM && (
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Custom URL
          </label>
          <input
            className={inputCls}
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://overclocker.dev/..."
          />
        </div>
      )}

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
