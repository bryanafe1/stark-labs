"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Swords } from "lucide-react";
import { applyElo } from "@/lib/elo";
import { recordSprintResult } from "@/server/actions/arena";
import { gradeConceptualSprint } from "@/server/actions/conceptual";
import { generateOpponent, computeBotPlan, simulateBotConceptualScore } from "./bots";
import { pickSprintProblem } from "./sprint-problems";
import { QueuePanel } from "./QueuePanel";
import { SprintArena } from "./SprintArena";
import { ResultModal } from "./ResultModal";
import { RankLadder } from "./rank-ladder";
import type {
  Bot,
  ConceptualSprintProblem,
  MatchPlan,
  Outcome,
  RankedPhase,
  ResultState,
} from "./types";

const ELO_K = 32;

/**
 * The ranked matchmaking state container. Drives the whole flow with local
 * state + timers: idle → queueing → matchFound → sprinting → result. Opponents
 * and timing are simulated, but the Elo is the user's real account rating:
 * seeded from the DB and persisted after each match.
 */
export function Matchmaker({
  initialElo,
  conceptualPool,
}: {
  initialElo: number;
  conceptualPool: ConceptualSprintProblem[];
}) {
  const [elo, setElo] = useState(initialElo);
  const [phase, setPhase] = useState<RankedPhase>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [opponent, setOpponent] = useState<Bot | null>(null);
  const [plan, setPlan] = useState<MatchPlan | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);

  const enterQueue = useCallback(() => {
    setOpponent(null);
    setPlan(null);
    setResult(null);
    setElapsedMs(0);
    setPhase("queueing");
  }, []);

  const leave = useCallback(() => {
    setPhase("idle");
    setOpponent(null);
    setPlan(null);
    setResult(null);
  }, []);

  // QUEUEING: tick up, then find a match in a random 3–7s.
  useEffect(() => {
    if (phase !== "queueing") return;
    const start = Date.now();
    const target = 3000 + Math.random() * 4000;
    const iv = setInterval(() => {
      const e = Date.now() - start;
      setElapsedMs(e);
      if (e >= target) {
        clearInterval(iv);
        setOpponent(generateOpponent(elo));
        setPhase("matchFound");
      }
    }, 100);
    return () => clearInterval(iv);
  }, [phase, elo]);

  // MATCH FOUND: brief snap, then build the (fixed) match plan and start.
  useEffect(() => {
    if (phase !== "matchFound" || !opponent) return;
    const t = setTimeout(() => {
      const botPlan = computeBotPlan();
      // Conceptual is the focus — favor it heavily when available (Pro only).
      const useConcept = conceptualPool.length > 0 && Math.random() < 0.7;
      const problem = useConcept
        ? conceptualPool[Math.floor(Math.random() * conceptualPool.length)]!
        : pickSprintProblem();
      setPlan({ opponent, problem, startedAt: Date.now(), ...botPlan });
      setPhase("sprinting");
    }, 1400);
    return () => clearTimeout(t);
  }, [phase, opponent, conceptualPool]);

  const handleResult = useCallback(
    (outcome: Outcome) => {
      if (!plan) return;
      const before = elo;
      const upd = applyElo(before, plan.opponent.elo, outcome === "WIN" ? 1 : 0, ELO_K);
      setElo(upd.elo); // optimistic
      setResult({
        outcome,
        opponent: plan.opponent,
        eloBefore: before,
        eloAfter: upd.elo,
        delta: upd.delta,
      });
      setPhase("result");
      // Persist to the account (server recomputes authoritatively).
      void recordSprintResult({ opponentElo: plan.opponent.elo, outcome }).then((r) => {
        if (r && "eloAfter" in r) setElo(r.eloAfter);
      });
    },
    [plan, elo],
  );

  // Conceptual match: AI grades the answer 0–100, the (simulated) opponent gets
  // a calibrated score, higher % wins, and both get feedback.
  const handleConceptualSubmit = useCallback(
    async (answerText: string) => {
      if (!plan || plan.problem.kind !== "conceptual") return;
      const r = await gradeConceptualSprint({ id: plan.problem.id, answer: answerText });
      const userScore = r.ok ? (r.score ?? 0) : 0;
      const oppScore = simulateBotConceptualScore(plan.opponent.elo, plan.perfectBot);
      const outcome: Outcome = userScore >= oppScore ? "WIN" : "LOSS";
      const before = elo;
      const upd = applyElo(before, plan.opponent.elo, outcome === "WIN" ? 1 : 0, ELO_K);
      setElo(upd.elo);
      setResult({
        outcome,
        opponent: plan.opponent,
        eloBefore: before,
        eloAfter: upd.elo,
        delta: upd.delta,
        conceptual: true,
        userScore,
        oppScore,
        question: plan.problem.question,
        concepts: r.ok ? r.concepts : undefined,
        modelAnswer: r.ok ? r.modelAnswer : undefined,
        gradeError: r.ok ? undefined : r.error,
      });
      setPhase("result");
      void recordSprintResult({ opponentElo: plan.opponent.elo, outcome }).then((res) => {
        if (res && "eloAfter" in res) setElo(res.eloAfter);
      });
    },
    [plan, elo],
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center gap-2">
        <Swords className="size-5 text-terminal" />
        <h1 className="text-2xl font-bold tracking-tight">Ranked Arena</h1>
      </div>

      {phase === "sprinting" && plan ? (
        <SprintArena plan={plan} onResult={handleResult} onSubmitConceptual={handleConceptualSubmit} />
      ) : (
        <QueuePanel
          queueing={phase === "queueing"}
          elapsedMs={elapsedMs}
          elo={elo}
          onJoin={enterQueue}
          onCancel={leave}
        />
      )}

      {phase !== "sprinting" && (
        <div className="mt-6">
          <RankLadder elo={elo} />
        </div>
      )}

      {/* MATCH FOUND snap */}
      <AnimatePresence>
        {phase === "matchFound" && opponent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="text-center"
            >
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-terminal">
                Match Found
              </p>
              <div className="mt-4 flex items-center justify-center gap-4 font-mono">
                <span className="text-lg font-bold">you</span>
                <span className="text-2xl font-black text-terminal">VS</span>
                <span className="max-w-[40vw] truncate text-lg font-bold">{opponent.username}</span>
              </div>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {opponent.elo} Elo · entering sprint…
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESULT */}
      <AnimatePresence>
        {phase === "result" && result && (
          <ResultModal result={result} onQueueAgain={enterQueue} onLeave={leave} />
        )}
      </AnimatePresence>
    </div>
  );
}
