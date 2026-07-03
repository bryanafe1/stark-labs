"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  Swords,
  Mic,
  GraduationCap,
  CheckCircle2,
  Timer,
  Trophy,
  TrendingUp,
  Bot,
  User,
  type LucideIcon,
} from "lucide-react";
import { Latex } from "@/components/latex";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
//  Dynamic hero demo — an auto-cycling, animated preview of every mode. Shows
//  (not tells) the "full interview simulator" story: Practice → Arena → Voice
//  → Learn. This is the thing a static screenshot can't do.
// ---------------------------------------------------------------------------

interface Mode {
  key: string;
  label: string;
  icon: LucideIcon;
  tagline: string;
  Preview: () => JSX.Element;
  dwellMs?: number; // how long this tab stays before auto-advancing
}

const CYCLE_MS = 5600;

// Staggered entrance helper — each block fades/slides in on tab switch.
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// Typewriter — reveals a scripted conversation char-by-char, one message at a
// time, for a live "it's happening now" feel. Restarts whenever it re-mounts
// (i.e. each time the Voice tab becomes active).
type VMsg = { role: "bot" | "you"; text: string };

function useTypedConversation(script: VMsg[], charMs = 20, gapMs = 420) {
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const done = step >= script.length;

  useEffect(() => {
    if (done) return;
    const full = script[step]!.text;
    if (count < full.length) {
      const id = setTimeout(() => setCount((c) => c + 1), charMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setStep((s) => s + 1);
      setCount(0);
    }, gapMs);
    return () => clearTimeout(id);
  }, [step, count, done, script, charMs, gapMs]);

  const shown = script
    .map((m, i) => {
      if (done || i < step) return { ...m, text: m.text, typing: false, show: true };
      if (i === step) return { ...m, text: m.text.slice(0, count), typing: true, show: true };
      return { ...m, text: "", typing: false, show: false };
    })
    .filter((m) => m.show);

  return { shown, done };
}

function Caret() {
  return <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-[1px] animate-pulse bg-primary" />;
}

/* ---------------------------------- Practice ---------------------------- */
function PracticePreview() {
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <motion.div {...rise(0)} className="flex items-center gap-2">
        <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-primary">
          Thermodynamics
        </span>
        <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-500">
          Easy
        </span>
      </motion.div>
      <motion.p {...rise(0.08)} className="text-sm font-medium text-foreground">
        Why does your tire pressure drop on a cold morning but rise after a long drive?
      </motion.p>
      <motion.div
        {...rise(0.16)}
        className="rounded-lg border border-border bg-background p-3 text-xs italic leading-relaxed text-muted-foreground"
      >
        &ldquo;Pressure scales with absolute temperature at fixed volume (Gay-Lussac). Cold morning →
        lower T → lower P; driving heats the tire → higher T → higher P…&rdquo;
      </motion.div>
      <motion.div {...rise(0.3)} className="mt-auto space-y-2 rounded-lg border border-border bg-card/70 p-3">
        <p className="flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="size-3.5 text-emerald-500" /> AI score
          <span className="font-mono text-emerald-500">88/100</span>
        </p>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-500">
            What you did well
          </p>
          <p className="text-xs text-muted-foreground">
            Tied pressure to <span className="text-foreground">absolute</span> temperature and named
            Gay-Lussac&apos;s law.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-500">
            What you can improve on
          </p>
          <p className="text-xs text-muted-foreground">
            Note the volume isn&apos;t perfectly constant — the tire flexes slightly under load.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ----------------------------------- Arena ------------------------------ */
function ArenaPreview() {
  return (
    <div className="flex h-full flex-col p-5">
      <motion.div {...rise(0)} className="flex items-center justify-between">
        <Fighter name="You" elo={1240} you />
        <div className="text-center">
          <p className="flex items-center gap-1 font-mono text-lg font-bold tabular-nums">
            <Timer className="size-4 text-primary" />
            0:12
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Ranked sprint</p>
        </div>
        <Fighter name="kerbal_v" elo={1305} />
      </motion.div>

      <motion.div
        {...rise(0.18)}
        className="mt-5 flex items-center justify-center gap-4 rounded-lg border border-border bg-background py-3 font-mono text-sm"
      >
        <span className="font-bold text-primary">You 92%</span>
        <span className="text-muted-foreground">vs</span>
        <span className="font-bold text-foreground">74% kerbal_v</span>
      </motion.div>

      <motion.div
        {...rise(0.42)}
        className="mt-auto flex items-center justify-center gap-3 rounded-lg border border-primary/40 bg-primary/10 py-3 font-mono font-bold text-primary"
      >
        <Trophy className="size-5" />
        VICTORY
        <span className="flex items-center gap-1 text-sm">
          <TrendingUp className="size-4" /> +18 Elo
        </span>
      </motion.div>
    </div>
  );
}

function Fighter({ name, elo, you }: { name: string; elo: number; you?: boolean }) {
  return (
    <div className={cn("flex flex-col items-center gap-1", you && "order-first")}>
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          you ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground",
        )}
      >
        <User className="size-4" />
      </span>
      <span className="font-mono text-xs font-medium">{name}</span>
      <span className="font-mono text-[10px] text-muted-foreground">{elo} Elo</span>
    </div>
  );
}

/* -------------------------------- Voice Sim ----------------------------- */
const VOICE_SCRIPT: VMsg[] = [
  { role: "bot", text: "“Walk me through sizing a heat exchanger for an industrial cooling loop.”" },
  { role: "you", text: "“Start from the thermal duty, Q = ṁ·c·ΔT, then pick an LMTD approach…”" },
  { role: "bot", text: "“Good. What if fouling doubles over the first year?”" },
];

function VoicePreview() {
  const { shown, done } = useTypedConversation(VOICE_SCRIPT, 20, 420);

  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-center justify-center py-1">
        <span className="relative flex size-14 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/25" />
          <motion.span
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground"
          >
            <Mic className="size-5" />
          </motion.span>
        </span>
      </div>

      {shown.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={cn("flex items-start gap-2", m.role === "you" && "justify-end")}
        >
          {m.role === "bot" && (
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
              <Bot className="size-3" />
            </span>
          )}
          <p
            className={cn(
              "max-w-[85%] rounded-lg px-3 py-2 text-xs text-foreground",
              m.role === "bot" ? "border border-border bg-secondary/40" : "bg-primary/10",
            )}
          >
            {m.text}
            {m.typing && <Caret />}
          </p>
        </motion.div>
      ))}

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-auto flex items-center justify-center gap-3 rounded-lg border border-border bg-background py-2 font-mono text-[11px] text-muted-foreground"
          >
            <span>
              <span className="text-foreground">142</span> WPM
            </span>
            <span className="text-border">·</span>
            <span>
              <span className="text-foreground">1</span> filler
            </span>
            <span className="text-border">·</span>
            <span className="text-emerald-500">confident delivery</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------------- Learn ------------------------------ */
// Real, interactive formula sandbox: drag L, δ = FL³/3EI recomputes live and
// the beam physically bends. Calibrated so L = 2.0 m → ~4.3 mm.
function LearnPreview() {
  const [L, setL] = useState(2);
  const delta = 0.5375 * L ** 3; // mm
  const drop = Math.min(38, delta * 2.4); // px of tip sag in the SVG
  const stroke = { stroke: "hsl(var(--primary))" };
  const border = { stroke: "hsl(var(--border))" };
  const muted = { stroke: "hsl(var(--muted-foreground))" };

  return (
    <div className="flex h-full flex-col gap-2.5 p-5">
      <motion.span
        {...rise(0)}
        className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
      >
        {"// interactive · cantilever deflection"}
      </motion.span>

      <motion.div
        {...rise(0.1)}
        className="flex items-center justify-center rounded-lg border border-border bg-background py-2 text-lg"
      >
        <Latex tex="\delta = \dfrac{F\,L^3}{3\,E\,I}" />
      </motion.div>

      {/* Bending beam — sags more as L (and therefore δ) grows. Width-capped so
          it stays short and never pushes the slider out of the frame. */}
      <motion.div
        {...rise(0.2)}
        className="mx-auto w-full max-w-[340px] rounded-lg border border-border bg-background px-3 py-2"
      >
        <svg viewBox="0 0 240 76" className="w-full">
          <rect x="6" y="6" width="8" height="42" rx="1" style={{ fill: "hsl(var(--border))" }} />
          <line x1="14" y1="24" x2="232" y2="24" style={border} strokeWidth="1" strokeDasharray="3 4" />
          <path
            d={`M14 24 C 90 24, 165 ${24 + drop * 0.45}, 232 ${24 + drop}`}
            style={stroke}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="232" cy={24 + drop} r="3.5" style={{ fill: "hsl(var(--primary))" }} />
          <line x1="232" y1={24 + drop + 4} x2="232" y2={24 + drop + 15} style={muted} strokeWidth="1.5" />
          <path
            d={`M229 ${24 + drop + 11} L232 ${24 + drop + 16} L235 ${24 + drop + 11}`}
            style={muted}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Slider + live readout */}
      <motion.div {...rise(0.3)} className="mt-auto space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-muted-foreground">
            L = <span className="text-foreground">{L.toFixed(2)} m</span>
          </span>
          <span className="text-muted-foreground">
            δ = <span className="font-semibold text-primary">{delta.toFixed(1)} mm</span>
          </span>
        </div>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.05}
          value={L}
          onChange={(e) => setL(Number(e.target.value))}
          aria-label="Beam length"
          className="w-full cursor-pointer accent-primary"
        />
        <p className="text-center text-[10px] text-muted-foreground/70">
          Drag the length — watch the physics move.
        </p>
      </motion.div>
    </div>
  );
}

const MODES: Mode[] = [
  { key: "practice", label: "Practice", icon: ClipboardCheck, tagline: "Answer, get coached", Preview: PracticePreview },
  { key: "arena", label: "Arena", icon: Swords, tagline: "Compete, ranked", Preview: ArenaPreview },
  { key: "voice", label: "Voice Sim", icon: Mic, tagline: "Rehearse out loud", Preview: VoicePreview, dwellMs: 7400 },
  { key: "learn", label: "Learn", icon: GraduationCap, tagline: "Master the concept", Preview: LearnPreview },
];

export function ModeShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [locked, setLocked] = useState(false); // stop auto-advance once they engage

  useEffect(() => {
    if (paused || locked) return;
    const dwell = MODES[active]!.dwellMs ?? CYCLE_MS;
    const t = setTimeout(() => setActive((a) => (a + 1) % MODES.length), dwell);
    return () => clearTimeout(t);
  }, [paused, locked, active]);

  const Active = MODES[active]!.Preview;

  return (
    <div
      className="relative mt-16 w-full max-w-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Soft indigo glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-12 -top-12 bottom-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(239_84%_67%/0.22),transparent_70%)] blur-2xl"
      />

      {/* Tabs */}
      <div className="mx-auto mb-3 flex max-w-md flex-wrap justify-center gap-1 rounded-full border border-border bg-card/60 p-1">
        {MODES.map((m, i) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => {
                setActive(i);
                setLocked(true);
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                i === active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Frame */}
      <div className="elevated overflow-hidden rounded-xl border border-border bg-card text-left">
        <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            OVERCLOCK_ · {MODES[active]!.label} — {MODES[active]!.tagline}
          </span>
        </div>
        <div className="relative h-[420px] sm:h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Active />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress dots */}
      <div className="mt-4 flex justify-center gap-2">
        {MODES.map((m, i) => (
          <button
            key={m.key}
            onClick={() => setActive(i)}
            aria-label={m.label}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === active ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground",
            )}
          />
        ))}
      </div>
    </div>
  );
}
