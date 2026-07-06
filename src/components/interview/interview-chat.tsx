"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, MessageSquare, RotateCcw, Flag, Bot, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import { INTERVIEW_KICKOFF } from "@/lib/interview";
import {
  InterviewSetupFields,
  DEFAULT_INTERVIEW_SETUP,
  toInterviewConfig,
  type InterviewSetup,
} from "@/components/interview/interview-setup-fields";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
  hidden?: boolean;
}

let counter = 0;
const uid = () => `m${Date.now()}_${counter++}`;

export function InterviewChat({
  freeTrial = false,
}: {
  freeTrial?: boolean;
}) {
  const [phase, setPhase] = useState<"setup" | "live">("setup");
  const [limitReached, setLimitReached] = useState(false);
  const [setup, setSetup] = useState<InterviewSetup>(DEFAULT_INTERVIEW_SETUP);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = (p: Partial<InterviewSetup>) => setSetup((s) => ({ ...s, ...p }));
  const config = toInterviewConfig(setup);
  const jd = config.jobDescription;

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function streamTurn(history: Msg[]) {
    setStreaming(true);
    setError(null);
    const assistantId = uid();
    setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          config,
        }),
      });
      if (res.status === 402) {
        // Free mock interview used up → show the upgrade wall, not an error.
        setLimitReached(true);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        return;
      }
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
    streamTurn([{ id: uid(), role: "user", content: INTERVIEW_KICKOFF, hidden: true }]);
  }

  function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    streamTurn([...messages, { id: uid(), role: "user", content: text }]);
  }

  function endInterview() {
    if (streaming) return;
    streamTurn([
      ...messages,
      { id: uid(), role: "user", content: "Let's wrap up. Please give me my feedback now." },
    ]);
  }

  function reset() {
    setMessages([]);
    setInput("");
    setError(null);
    setPhase("setup");
  }

  // ---- Setup screen -------------------------------------------------------
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-2">
          <MessageSquare className="size-5 text-terminal" />
          <h1 className="text-2xl font-bold tracking-tight">Typed Interview</h1>
        </div>

        <div className="elevated rounded-xl border border-border bg-card p-6">
          <InterviewSetupFields value={setup} onChange={patch} />

          {freeTrial && (
            <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                FREE
              </span>
              Your free mock interview — no card needed. Upgrade anytime for unlimited.
            </p>
          )}
          <Button className="mt-6 w-full sm:w-auto" onClick={start}>
            Start interview
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ---- Live chat ----------------------------------------------------------
  const visible = messages.filter((m) => !m.hidden);

  return (
    <div className="mx-auto flex h-[calc(100dvh-8rem)] max-w-3xl flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 gap-y-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 text-terminal" />
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">Typed Interview</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {config.disciplineLabel} · {jd ? "Tailored to your role" : setup.focus} · {setup.level}
              {freeTrial ? " · Free preview" : ""}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={endInterview}
            disabled={streaming}
            aria-label="End interview and get feedback"
          >
            <Flag className="size-4" />
            <span className="hidden sm:inline">End &amp; get feedback</span>
            <span className="sm:hidden">End</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="size-4" /> New
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-5 overflow-y-auto py-5">
        {visible.map((m) => (
          <div
            key={m.id}
            className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
          >
            {m.role === "assistant" && (
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-terminal/10 text-terminal">
                <Bot className="size-4" />
              </span>
            )}
            <div
              className={cn(
                "min-w-0 max-w-[90%] rounded-lg px-4 py-2.5 text-sm sm:max-w-[80%]",
                m.role === "user"
                  ? "bg-primary/15 text-foreground"
                  : "border border-border bg-card",
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

      {/* Composer — or the upgrade wall once a free interview is used up */}
      <div className="border-t border-border pt-3">
        {limitReached ? (
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 text-center">
            <p className="text-sm font-semibold text-foreground">
              You&apos;re in the flow — that was your free interview.
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Upgrade to keep going, run unlimited mock interviews, and unlock your full skill debrief.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link href="/pricing">
                  See plans <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/pricing">Start Standard · $20/mo</Link>
              </Button>
            </div>
          </div>
        ) : (
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
              placeholder="Type your answer…  (Enter to send, Shift+Enter for a new line)"
              className="max-h-40 min-h-11 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/60"
            />
            <Button onClick={send} disabled={streaming || !input.trim()} className="h-11 shrink-0">
              {streaming ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
