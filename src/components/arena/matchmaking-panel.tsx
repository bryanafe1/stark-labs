"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Radar, Swords, TrendingUp, TrendingDown, Percent } from "lucide-react";
import type { Difficulty, Discipline } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DISCIPLINE_LIST, DIFFICULTIES, tierForElo } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { findMatch } from "@/server/actions/arena";
import { INITIAL_FIND_MATCH, type FindMatchState } from "@/types/arena";
import type { DisciplineElo } from "@/features/arena/get-arena";

const DIFFICULTY_ORDER: Difficulty[] = ["EASY", "MEDIUM", "HARD", "EXPERT"];

export function MatchmakingPanel({ disciplines }: { disciplines: DisciplineElo[] }) {
  const [discipline, setDiscipline] = useState<Discipline>("MECHANICAL");
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [state, formAction] = useFormState<FindMatchState, FormData>(
    findMatch,
    INITIAL_FIND_MATCH,
  );

  const userElo =
    disciplines.find((d) => d.discipline === discipline)?.elo ?? 1200;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radar className="size-5 text-primary" />
          Ranked Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="discipline" value={discipline} />
          <input type="hidden" name="difficulty" value={difficulty} />
          <input type="hidden" name="userElo" value={userElo} />

          {/* Discipline selector */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Discipline</p>
            <div className="flex flex-wrap gap-2">
              {DISCIPLINE_LIST.map((d) => {
                const active = d.key === discipline;
                const Icon = d.icon;
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setDiscipline(d.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty selector */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_ORDER.map((key) => {
                const meta = DIFFICULTIES[key];
                const active = key === difficulty;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDifficulty(key)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Your {DISCIPLINE_LIST.find((d) => d.key === discipline)?.label} Elo</span>
            <span className="font-bold tabular-nums">{userElo}</span>
          </div>

          <FindMatchButton />
        </form>

        <AnimatePresence mode="wait">
          {state.ok && (
            <motion.div
              key={`${state.opponent.name}-${state.opponent.elo}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <MatchPreviewCard state={state} />
            </motion.div>
          )}
          {!state.ok && state.error && (
            <p className="text-sm text-amber-400">{state.error}</p>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function FindMatchButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Swords className="size-4" />}
      {pending ? "Searching for opponent…" : "Find Match"}
    </Button>
  );
}

function MatchPreviewCard({ state }: { state: Extract<FindMatchState, { ok: true }> }) {
  const tier = tierForElo(state.opponent.elo);
  const href =
    `/arena/sprint?d=${state.discipline}&diff=${state.difficulty}` +
    `&opp=${state.opponent.elo}&before=${state.userElo}`;

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-4">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
          Match found
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Percent className="size-3.5" />
          {state.winChancePct}% win chance
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">@{state.opponent.name}</p>
          <p className={cn("text-xs font-medium", tier.textClass)}>
            {tier.label} · {state.opponent.elo} Elo
          </p>
        </div>
        <div className="text-right text-xs">
          <p className="flex items-center justify-end gap-1 text-emerald-400">
            <TrendingUp className="size-3.5" /> +{state.winDelta} on win
          </p>
          <p className="flex items-center justify-end gap-1 text-rose-400">
            <TrendingDown className="size-3.5" /> {state.lossDelta} on loss
          </p>
        </div>
      </div>

      <Button asChild className="mt-4 w-full">
        <Link href={href}>Enter Ranked Sprint</Link>
      </Button>
    </div>
  );
}
