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
  Square,
  Volume2,
  VolumeX,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/components/interview/use-speech";
import {
  INTERVIEW_KICKOFF,
  type InterviewConfig,
  type InterviewLevel,
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

/** Index of the last completed-sentence terminator in a string, else -1. */
function lastSentenceEnd(s: string): number {
  let idx = -1;
  const re = /[.!?…](\s|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) idx = m.index;
  return idx;
}

const GENERAL_FOCUS = "General fundamentals";
const LEVELS: InterviewLevel[] = ["Intern", "New grad", "Experienced"];

export function InterviewChat({ pro = false }: { pro?: boolean }) {
  const [phase, setPhase] = useState<"setup" | "live">("setup");
  const [focus, setFocus] = useState("General fundamentals");
  const [level, setLevel] = useState<InterviewLevel>("New grad");
  const [jobDescription, setJobDescription] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [muted, setMuted] = useState(false);
  const [disciplineKey, setDisciplineKey] = useState<Discipline>("MECHANICAL");
  const speech = useSpeech();

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
  const messagesRef = useRef<Msg[]>([]);
  const jd = jobDescription.trim();
  const config: InterviewConfig = {
    disciplineLabel,
    focus,
    level,
    jobDescription: jd || undefined,
  };

  useEffect(() => {
    messagesRef.current = messages;
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
      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `Request failed (${res.status}).`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const voice = mode === "voice" && speech.supported && !muted;
      let full = "";
      let spokenIdx = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
        );
        // Voice mode: speak each complete sentence the moment it's ready.
        if (voice) {
          const pending = full.slice(spokenIdx);
          const end = lastSentenceEnd(pending);
          if (end >= 0) {
            const sentence = pending.slice(0, end + 1).trim();
            if (sentence) speech.speak(sentence);
            spokenIdx += end + 1;
          }
        }
      }
      // Speak any trailing text that didn't end with punctuation.
      if (voice) {
        const tail = full.slice(spokenIdx).trim();
        if (tail) speech.speak(tail);
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

  // Voice mode: capture the spoken answer, then send it as the user's message.
  function listenAndSend() {
    if (streaming) return;
    speech.listen((transcript) => {
      const text = transcript.trim();
      if (!text) return;
      streamTurn([...messagesRef.current, { id: uid(), role: "user", content: text }]);
    });
  }

  function endInterview() {
    if (streaming) return;
    streamTurn([
      ...messages,
      { id: uid(), role: "user", content: "Let's wrap up. Please give me my feedback now." },
    ]);
  }

  function reset() {
    speech.cancel();
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

        <div className="elevated rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Sit a realistic technical screen with an AI interviewer. It asks one
            question at a time, probes your reasoning, and ends with structured
            feedback on your interview readiness.
          </p>

          <Link
            href="/simulation"
            className="mt-4 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm transition-colors hover:bg-primary/10"
          >
            <Mic className="size-4 shrink-0 text-primary" />
            <span className="flex-1">
              <span className="font-medium text-foreground">New: full voice simulation</span>
              <span className="text-muted-foreground"> — a real-time spoken interview you talk to out loud.</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-primary" />
          </Link>

          <div className="mt-6 space-y-5">
            <Field label="Discipline">
              <div className="flex flex-wrap gap-2">
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
              <p className="mt-2 text-xs text-muted-foreground">
                The AI interviewer works for every discipline. Deep lessons &amp; problem banks are
                Mechanical-first, with more rolling out.
              </p>
            </Field>

            <Field label="Focus">
              <div className="flex flex-wrap gap-2">
                {focusOptions.map((f) => (
                  <Pill key={f} active={focus === f} onClick={() => setFocus(f)}>
                    {f}
                  </Pill>
                ))}
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

            <Field label="Mode">
              <div className="flex flex-wrap gap-2">
                <Pill active={mode === "text"} onClick={() => setMode("text")}>
                  Type your answers
                </Pill>
                {pro ? (
                  <Pill
                    active={mode === "voice"}
                    onClick={() => {
                      if (speech.supported) setMode("voice");
                    }}
                  >
                    Voice — talk to the interviewer
                  </Pill>
                ) : (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    <Lock className="size-3.5" /> Voice — Pro
                  </Link>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {pro ? (
                  <>
                    Voice mode reads the questions aloud and lets you answer out loud. Answering by
                    voice needs <span className="text-foreground">Chrome, Edge, or Safari</span> —
                    Opera and Brave don&apos;t support speech input. (For a seamless real-time
                    conversation, try the full voice simulation above.)
                  </>
                ) : (
                  <>
                    Answering out loud is a{" "}
                    <Link href="/pricing" className="text-primary underline-offset-2 hover:underline">
                      Pro feature
                    </Link>
                    . Standard includes the full text mock interview.
                  </>
                )}
              </p>
            </Field>

            <Field label="Job description (optional)">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                placeholder="Paste a job posting here, and the interviewer will tailor its questions to the engineering fundamentals this role needs."
                className="w-full rounded-lg border border-input bg-background p-3 text-sm leading-relaxed outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/50"
              />
              {jd && (
                <p className="mt-1.5 text-xs text-primary">
                  This interview will be tailored to the pasted role (the focus selection is ignored).
                </p>
              )}
            </Field>
          </div>

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
              {mode === "voice" ? " · Voice" : ""}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" size="sm" onClick={endInterview} disabled={streaming}>
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
                "min-w-0 max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                m.role === "user"
                  ? "bg-primary/10 text-foreground"
                  : "border border-border bg-card",
              )}
            >
              {m.role === "assistant" ? (
                m.content ? (
                  <Markdown content={m.content} className="space-y-3" />
                ) : (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin" /> thinking…
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

      {/* Composer */}
      <div className="border-t border-border pt-3">
        {mode === "voice" ? (
          <VoiceComposer
            streaming={streaming}
            speaking={speech.speaking}
            listening={speech.listening}
            interim={speech.interim}
            error={speech.error}
            muted={muted}
            onTalk={() => {
              speech.clearError();
              listenAndSend();
            }}
            onFinish={() => speech.stopListening()}
            onToggleMute={() => {
              setMuted((m) => !m);
              speech.cancel();
            }}
          />
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

function VoiceComposer({
  streaming,
  speaking,
  listening,
  interim,
  error,
  muted,
  onTalk,
  onFinish,
  onToggleMute,
}: {
  streaming: boolean;
  speaking: boolean;
  listening: boolean;
  interim: string;
  error: string | null;
  muted: boolean;
  onTalk: () => void;
  onFinish: () => void;
  onToggleMute: () => void;
}) {
  const status = streaming
    ? "Interviewer is thinking…"
    : listening
      ? interim
        ? "Listening…"
        : "Listening — start talking"
      : speaking
        ? "Interviewer is speaking…"
        : "Tap the mic to answer";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span
            className={cn(
              "relative flex size-2.5 items-center justify-center",
              listening ? "text-terminal" : "text-muted-foreground/50",
            )}
          >
            {listening && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal/60" />
            )}
            <span className="relative inline-flex size-2 rounded-full bg-current" />
          </span>
          {status}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMute}
            title={muted ? "Unmute the interviewer" : "Mute the interviewer"}
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
          {listening ? (
            <Button onClick={onFinish} className="h-11 gap-2">
              <Square className="size-4" /> Finish answer
            </Button>
          ) : (
            <Button onClick={onTalk} disabled={streaming} className="h-11 gap-2">
              <Mic className="size-4" />
              {speaking ? "Answer now" : "Tap to speak"}
            </Button>
          )}
        </div>
      </div>

      {listening && (
        <p className="min-h-[2.5rem] rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground/90">
          {interim || <span className="text-muted-foreground/60">Listening — your words will appear here…</span>}
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap items-center">{children}</div>
    </div>
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
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-input text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
