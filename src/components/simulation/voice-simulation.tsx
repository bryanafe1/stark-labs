"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, PhoneOff, Loader2, Radio, Bot, User, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MicStreamer, AudioPlayer, audioSupported } from "@/components/simulation/audio";
import {
  InterviewSetupFields,
  DEFAULT_INTERVIEW_SETUP,
  toInterviewConfig,
  type InterviewSetup,
} from "@/components/interview/interview-setup-fields";

type Phase = "setup" | "connecting" | "live" | "ending" | "debrief" | "error";
type Turn = { id: string; role: "interviewer" | "candidate"; text: string };
interface Debrief {
  verdict?: string;
  strengths?: string[];
  gaps?: string[];
  communication?: string;
  focus?: string[];
  speech?: { avgWordsPerMinute?: number | null; totalFillerWords?: number; answeredTurns?: number };
}

let tc = 0;
const tid = () => `t${Date.now()}_${tc++}`;

export function VoiceSimulation() {
  const [phase, setPhaseState] = useState<Phase>("setup");
  const [setup, setSetup] = useState<InterviewSetup>(DEFAULT_INTERVIEW_SETUP);
  const [status, setStatus] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [debrief, setDebrief] = useState<Debrief | null>(null);
  const patch = (p: Partial<InterviewSetup>) => setSetup((s) => ({ ...s, ...p }));

  const wsRef = useRef<WebSocket | null>(null);
  const micRef = useRef<MicStreamer | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);
  const sessionIdRef = useRef<string>("");
  const startRef = useRef<number>(0);
  const phaseRef = useRef<Phase>("setup");
  const endingRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const goPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, status]);

  // Live timer
  useEffect(() => {
    if (phase !== "live") return;
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 500);
    return () => clearInterval(iv);
  }, [phase]);

  const cleanup = useCallback(() => {
    try {
      micRef.current?.stop();
      playerRef.current?.close();
      wsRef.current?.close();
    } catch {
      /* ignore */
    }
    micRef.current = null;
    playerRef.current = null;
    wsRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const pollDebrief = useCallback(async (id: string) => {
    for (let i = 0; i < 30; i++) {
      try {
        const r = await fetch(`/api/simulation/${id}/result`);
        if (r.ok) {
          const d = (await r.json()) as { status?: string; debrief?: Debrief | null };
          if (d.status === "completed" && d.debrief) {
            setDebrief(d.debrief);
            return;
          }
        }
      } catch {
        /* retry */
      }
      await new Promise((res) => setTimeout(res, 2000));
    }
    setDebrief({ verdict: "Your debrief is taking longer than usual — check back shortly." });
  }, []);

  const finishToDebrief = useCallback(() => {
    if (phaseRef.current === "debrief") return;
    micRef.current?.stop();
    playerRef.current?.close();
    try {
      wsRef.current?.close();
    } catch {
      /* ignore */
    }
    goPhase("debrief");
    setStatus("");
    if (sessionIdRef.current) void pollDebrief(sessionIdRef.current);
  }, [goPhase, pollDebrief]);

  const handleMessage = useCallback(
    (raw: unknown) => {
      if (typeof raw !== "string") return;
      let msg: { type?: string; audio?: string; transcript?: string; message?: string };
      try {
        msg = JSON.parse(raw);
      } catch {
        return;
      }
      switch (msg.type) {
        case "audio_chunk":
          if (msg.audio) playerRef.current?.play(msg.audio);
          break;
        case "candidate_speaking":
          setStatus("Listening to you…");
          playerRef.current?.stopAll(); // barge-in
          break;
        case "candidate_done_speaking":
          setStatus("Thinking…");
          break;
        case "interviewer_speaking_done":
          setStatus("Your turn — just speak");
          break;
        case "interviewer_turn_complete":
          if (msg.transcript) setTurns((t) => [...t, { id: tid(), role: "interviewer", text: msg.transcript! }]);
          break;
        case "candidate_turn_complete":
          if (msg.transcript) setTurns((t) => [...t, { id: tid(), role: "candidate", text: msg.transcript! }]);
          break;
        case "time_warning":
          setNotice(msg.message ?? "5 minutes remaining.");
          break;
        case "time_limit_reached":
          setStatus(msg.message ?? "Time limit reached.");
          break;
        case "session_ended":
          finishToDebrief();
          break;
        case "error":
          setError(msg.message ?? "The interview hit an error.");
          finishToDebrief();
          break;
      }
    },
    [finishToDebrief],
  );

  const connect = useCallback(async () => {
    setError(null);
    setNotice(null);
    setTurns([]);
    endingRef.current = false;
    goPhase("connecting");
    setStatus("Setting up your session…");

    try {
      const res = await fetch("/api/simulation/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          config: { ...toInterviewConfig(setup), variantSeed: Math.floor(Math.random() * 1e9) },
        }),
      });
      if (!res.ok) {
        throw new Error((await res.text()) || "Could not start the simulation.");
      }
      const { sessionId, wsUrl } = (await res.json()) as { sessionId: string; wsUrl: string };
      sessionIdRef.current = sessionId;

      const player = new AudioPlayer();
      playerRef.current = player;
      await player.resume();

      const ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = async () => {
        startRef.current = Date.now();
        goPhase("live");
        setStatus("Connecting to your interviewer…");
        const mic = new MicStreamer();
        micRef.current = mic;
        try {
          await mic.start((buf) => {
            if (ws.readyState === WebSocket.OPEN) ws.send(buf);
          });
        } catch {
          setError("Microphone access is required. Allow it and try again.");
          cleanup();
          goPhase("error");
        }
      };
      ws.onmessage = (e) => handleMessage(e.data);
      ws.onclose = (e) => {
        if (endingRef.current || phaseRef.current === "debrief") return;
        if (e.code === 4001 || e.code === 4003 || e.code === 4004) {
          setError(e.reason || "The connection was rejected.");
          cleanup();
          goPhase("error");
        } else if (phaseRef.current === "live") {
          finishToDebrief();
        }
      };
      ws.onerror = () => {
        if (phaseRef.current === "connecting") {
          setError("Could not reach the simulation server.");
          goPhase("error");
        }
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start.");
      goPhase("error");
    }
  }, [setup, goPhase, cleanup, handleMessage, finishToDebrief]);

  const end = useCallback(() => {
    endingRef.current = true;
    micRef.current?.stop(); // stop sending audio immediately
    goPhase("ending");
    setStatus("Wrapping up…");
    try {
      wsRef.current?.send(JSON.stringify({ type: "end_session" }));
    } catch {
      /* ignore */
    }
    // Fallback in case the relay's session_ended never arrives.
    setTimeout(() => finishToDebrief(), 4000);
  }, [goPhase, finishToDebrief]);

  // ---- Render ----
  if (!audioSupported() && phase === "setup") {
    return (
      <Shell>
        <Card className="p-6 text-sm text-muted-foreground">
          The Voice Interview needs a browser with microphone + Web Audio support (Chrome, Edge, or
          Safari).
        </Card>
      </Shell>
    );
  }

  if (phase === "setup") {
    return (
      <Shell>
        <Card className="elevated p-6">
          <p className="text-sm text-muted-foreground">
            A fully spoken mock interview. A senior engineer talks to you in real time — you answer
            out loud, they probe your reasoning, and you get a debrief on both your answers and how
            you communicated.
          </p>
          <div className="mt-6">
            <InterviewSetupFields value={setup} onChange={patch} />
          </div>
          <Button className="mt-6 w-full sm:w-auto" onClick={connect}>
            <Mic className="size-4" /> Start voice interview
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Your browser will ask for microphone access. Use headphones for the best experience. Up
            to 20 minutes.
          </p>
        </Card>
      </Shell>
    );
  }

  if (phase === "connecting") {
    return (
      <Shell>
        <Card className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> {status || "Connecting…"}
        </Card>
        {error && <ErrorCard error={error} />}
      </Shell>
    );
  }

  if (phase === "error") {
    return (
      <Shell>
        <ErrorCard error={error ?? "Something went wrong."} />
        <Button variant="secondary" className="mt-4" onClick={() => goPhase("setup")}>
          Back to start
        </Button>
      </Shell>
    );
  }

  if (phase === "debrief") {
    return (
      <Shell>
        <DebriefView debrief={debrief} onRestart={() => goPhase("setup")} />
      </Shell>
    );
  }

  // live / ending
  return (
    <Shell>
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-3 items-center justify-center text-terminal">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal/50" />
            <span className="relative inline-flex size-2 rounded-full bg-terminal" />
          </span>
          <span className="text-sm font-medium">{status || "Live"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
          </span>
          <Button variant="secondary" onClick={end} disabled={phase === "ending"}>
            <PhoneOff className="size-4" /> End
          </Button>
        </div>
      </div>

      {notice && (
        <p className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {notice}
        </p>
      )}

      <div className="mt-4 flex-1 space-y-4 overflow-y-auto pb-4">
        {turns.length === 0 && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Radio className="size-4 text-terminal" /> Your interviewer will speak first — just listen,
            then answer out loud when it&apos;s your turn.
          </p>
        )}
        {turns.map((t) => (
          <div
            key={t.id}
            className={cn("flex gap-3", t.role === "candidate" ? "justify-end" : "justify-start")}
          >
            {t.role === "interviewer" && (
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-terminal/10 text-terminal">
                <Bot className="size-5" />
              </span>
            )}
            <div
              className={cn(
                "min-w-0 max-w-[90%] rounded-lg px-4 py-2.5 text-sm sm:max-w-[80%]",
                t.role === "candidate" ? "bg-primary/10" : "border border-border bg-card",
              )}
            >
              {t.text}
            </div>
            {t.role === "candidate" && (
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                <User className="size-5" />
              </span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-[calc(100dvh-8rem)] max-w-3xl flex-col">
      <div className="mb-4 flex items-center gap-2">
        <Mic className="size-5 text-terminal" />
        <h1 className="text-2xl font-bold tracking-tight">Voice Interview</h1>
      </div>
      {children}
    </div>
  );
}

function ErrorCard({ error }: { error: string }) {
  return (
    <Card className="flex items-start gap-3 border-destructive/40 p-4 text-sm">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
      <p className="text-foreground/85">{error}</p>
    </Card>
  );
}

function DebriefView({ debrief, onRestart }: { debrief: Debrief | null; onRestart: () => void }) {
  if (!debrief) {
    return (
      <Card className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Generating your debrief…
      </Card>
    );
  }
  const sp = debrief.speech;
  return (
    <div className="space-y-4 overflow-y-auto">
      <Card className="border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="size-4" /> Readiness verdict
        </p>
        <p className="mt-1 text-sm text-foreground/90">{debrief.verdict}</p>
      </Card>

      {sp && (
        <Card className="p-5">
          <p className="mb-3 text-sm font-semibold">How you communicated</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat label="words / min" value={sp.avgWordsPerMinute != null ? String(sp.avgWordsPerMinute) : "—"} />
            <Stat label="filler words" value={String(sp.totalFillerWords ?? 0)} />
            <Stat label="answers" value={String(sp.answeredTurns ?? 0)} />
          </div>
          {debrief.communication && (
            <p className="mt-3 text-sm text-foreground/85">{debrief.communication}</p>
          )}
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <DebriefList title="Strengths" items={debrief.strengths} tone="text-success" />
        <DebriefList title="Gaps" items={debrief.gaps} tone="text-destructive" />
      </div>
      <DebriefList title="Review next" items={debrief.focus} tone="text-foreground" />

      <Button onClick={onRestart}>Run another simulation</Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-3">
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </Card>
  );
}

function DebriefList({
  title,
  items,
  tone,
}: {
  title: string;
  items?: string[];
  tone: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <Card className="p-5">
      <p className={cn("mb-2 text-sm font-semibold", tone)}>{title}</p>
      <ul className="space-y-1.5 text-sm text-foreground/85">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-muted-foreground">•</span>
            {it}
          </li>
        ))}
      </ul>
    </Card>
  );
}
