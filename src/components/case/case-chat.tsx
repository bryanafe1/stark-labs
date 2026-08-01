"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, Briefcase, RotateCcw, Flag, Bot, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import {
  CASE_KICKOFF,
  CASE_TYPES,
  CASE_FIRMS,
  CASE_LEVELS,
  type CaseConfig,
} from "@/lib/case-interview";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
  hidden?: boolean;
}

let counter = 0;
const uid = () => `c${Date.now()}_${counter++}`;

const selectCls =
  "w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-9 text-sm outline-none ring-ring transition focus-visible:ring-2";

export function CaseChat() {
  const [phase, setPhase] = useState<"setup" | "live">("setup");
  const [config, setConfig] = useState<CaseConfig>({
    caseType: "mixed",
    firm: "MBB (general)",
    level: "MBA",
  });
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const patch = (p: Partial<CaseConfig>) => setConfig((c) => ({ ...c, ...p }));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function streamTurn(history: Msg[]) {
    setStreaming(true);
    setError(null);
    const assistantId = uid();
    setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/case-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })), config }),
      });
      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `Request failed (${res.status}).`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.content.length > 0));
    } finally {
      setStreaming(false);
    }
  }

  function start() {
    setPhase("live");
    streamTurn([{ id: uid(), role: "user", content: CASE_KICKOFF, hidden: true }]);
  }
  function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    streamTurn([...messages, { id: uid(), role: "user", content: text }]);
  }
  function endCase() {
    if (streaming) return;
    streamTurn([
      ...messages,
      { id: uid(), role: "user", content: "Let's wrap up. Please give me my scored debrief now." },
    ]);
  }
  function reset() {
    setMessages([]);
    setInput("");
    setError(null);
    setPhase("setup");
  }

  // ---- Setup ----
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="elevated rounded-xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Case type">
              <Select value={config.caseType} onChange={(v) => patch({ caseType: v as CaseConfig["caseType"] })}>
                {CASE_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Firm style">
              <Select value={config.firm} onChange={(v) => patch({ firm: v as CaseConfig["firm"] })}>
                {CASE_FIRMS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Level">
              <Select value={config.level} onChange={(v) => patch({ level: v as CaseConfig["level"] })}>
                {CASE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Button className="mt-6 w-full sm:w-auto" onClick={start}>
            Start the case <Send className="size-4" />
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            You&apos;ll get a live case prompt. Structure your approach, ask for data, do the math, and give a
            recommendation — then end for a scored debrief.
          </p>
        </div>
      </div>
    );
  }

  // ---- Live ----
  const visible = messages.filter((m) => !m.hidden);
  return (
    <div className="mx-auto flex h-[calc(100dvh-10rem)] max-w-3xl flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 gap-y-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Briefcase className="size-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">Case Interview</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {config.firm} · {config.level}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" size="sm" onClick={endCase} disabled={streaming} aria-label="End and get debrief">
            <Flag className="size-4" />
            <span className="hidden sm:inline">End &amp; get debrief</span>
            <span className="sm:hidden">End</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="size-4" /> New
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto py-5">
        {visible.map((m) => (
          <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bot className="size-4" />
              </span>
            )}
            <div
              className={cn(
                "min-w-0 max-w-[90%] rounded-lg px-4 py-2.5 text-sm sm:max-w-[80%]",
                m.role === "user" ? "bg-primary/15 text-foreground" : "border border-border bg-card",
              )}
            >
              {m.role === "assistant" ? (
                m.content ? (
                  <Markdown content={m.content} className="space-y-3" />
                ) : (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" /> thinking…
                  </span>
                )
              ) : (
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
              )}
            </div>
            {m.role === "user" && (
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                <User className="size-4" />
              </span>
            )}
          </div>
        ))}
        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
            {error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Think out loud — structure, ask for data, show your math…"
            className="max-h-40 min-h-11 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/60"
          />
          <Button onClick={send} disabled={streaming || !input.trim()} className="h-11 shrink-0">
            {streaming ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
