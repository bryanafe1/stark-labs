"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  Loader2,
  MessageSquare,
  RotateCcw,
  Flag,
  Bot,
  User,
  Mic,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import {
  INTERVIEW_KICKOFF,
  type InterviewConfig,
  type InterviewLevel,
  type InterviewMode,
} from "@/lib/interview";
import { DISCIPLINE_LIST, DISCIPLINES, SUBJECTS } from "@/lib/constants";
import type { Discipline } from "@prisma/client";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
  hidden?: boolean;
}

let counter = 0;
const uid = () => `m${Date.now()}_${counter++}`;

const GENERAL_FOCUS = "General fundamentals";
const LEVELS: InterviewLevel[] = ["Intern", "New grad", "Experienced"];

export function InterviewChat({
  freeTrial = false,
}: {
  freeTrial?: boolean;
}) {
  const [phase, setPhase] = useState<"setup" | "live">("setup");
  const [limitReached, setLimitReached] = useState(false);
  const [focus, setFocus] = useState("General fundamentals");
  const [level, setLevel] = useState<InterviewLevel>("New grad");
  const [jobDescription, setJobDescription] = useState("");
  const [interviewMode, setInterviewMode] = useState<InterviewMode>("technical");
  const [projectContext, setProjectContext] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disciplineKey, setDisciplineKey] = useState<Discipline>("MECHANICAL");

  const disciplineLabel = DISCIPLINES[disciplineKey].label;
  // Focus options adapt to the chosen discipline's subjects.
  const focusOptions = useMemo(
    () => [
      GENERAL_FOCUS,
      ...SUBJECTS.filter((s) => s.disciplines.includes(disciplineKey)).map((s) => s.label),
    ],
    [disciplineKey],
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const jd = jobDescription.trim();
  const config: InterviewConfig = {
    disciplineLabel,
    focus,
    level,
    jobDescription: jd || undefined,
    interviewMode,
    projectContext: interviewMode !== "technical" ? projectContext.trim() || undefined : undefined,
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Mock Interview</h1>
        </div>

        <div className="elevated rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Sit a realistic technical screen with an AI interviewer. It asks one
            question at a time, probes your reasoning, and ends with structured
            feedback on your interview readiness.
          </p>

          <Link
            href="/simulation"
            className="mt-4 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm outline-none transition-colors hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          >
            <Mic className="size-4 shrink-0 text-primary" />
            <span className="flex-1">
              <span className="font-medium text-foreground">Prefer to speak? Try the Voice Interview</span>
              <span className="text-muted-foreground"> — a real-time spoken interview you answer out loud, like the real room.</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-primary" />
          </Link>

          <div className="mt-6 space-y-5">
            {/* Discipline — compact chips */}
            <Field label="Discipline">
              <div className="flex flex-wrap gap-1.5">
                {DISCIPLINE_LIST.map((d) => (
                  <Pill
                    key={d.key}
                    active={disciplineKey === d.key}
                    onClick={() => {
                      setDisciplineKey(d.key);
                      setFocus(GENERAL_FOCUS);
                    }}
                  >
                    {d.label}
                  </Pill>
                ))}
              </div>
            </Field>

            {/* Interview type — the real differentiator */}
            <Field label="Interview type">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <ModeCard
                  active={interviewMode === "technical"}
                  onClick={() => setInterviewMode("technical")}
                  title="Technical"
                  desc="Fundamentals & problems under pressure."
                />
                <ModeCard
                  active={interviewMode === "project"}
                  onClick={() => setInterviewMode("project")}
                  title="Project deep-dive"
                  desc="Defend your own design decisions."
                />
                <ModeCard
                  active={interviewMode === "full"}
                  onClick={() => setInterviewMode("full")}
                  title="Full simulation"
                  desc="Intro → project → technical → close."
                />
              </div>
            </Field>

            {(interviewMode === "project" || interviewMode === "full") && (
              <Field label="Your project (2–3 sentences)">
                <textarea
                  value={projectContext}
                  onChange={(e) => setProjectContext(e.target.value)}
                  rows={4}
                  placeholder="A capstone, work project, or personal build — what it was, what you designed, the key decisions. The interviewer will grill your reasoning: “why that bearing and not a bushing?”"
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm leading-relaxed outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/50"
                />
              </Field>
            )}

            {/* Focus (dropdown) + Level, side by side */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Focus">
                <div className="relative">
                  <select
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-9 text-sm outline-none ring-ring transition focus-visible:ring-2"
                  >
                    {focusOptions.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>

              <Field label="Level">
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((l) => (
                    <Pill key={l} active={level === l} onClick={() => setLevel(l)}>
                      {l}
                    </Pill>
                  ))}
                </div>
              </Field>
            </div>

            {/* Job description — optional, collapsed */}
            <details className="group rounded-lg border border-border bg-background/40 px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Tailor to a specific job posting
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
              </summary>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                placeholder="Paste a job posting and the interviewer tailors its questions to the fundamentals this role needs."
                className="mt-3 w-full rounded-lg border border-input bg-background p-3 text-sm leading-relaxed outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/50"
              />
              {jd && (
                <p className="mt-1.5 text-xs text-primary">
                  This interview will be tailored to the pasted role (Focus is ignored).
                </p>
              )}
            </details>
          </div>

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
            <h1 className="text-lg font-bold leading-none tracking-tight">Mock Interview</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {disciplineLabel} · {jd ? "Tailored to your role" : focus} · {level}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        active ? "border-primary/60 bg-primary/10" : "border-border hover:border-primary/40",
      )}
    >
      <p className={cn("text-sm font-semibold", active ? "text-primary" : "text-foreground")}>
        {title}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
    </button>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-2 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-input text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
