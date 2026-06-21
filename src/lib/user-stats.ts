import "server-only";
import type { Discipline } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DISCIPLINE_LIST } from "@/lib/constants";

// ---------------------------------------------------------------------------
//  Real per-user progress, derived entirely from the user's saved Submissions.
//  A brand-new user (no submissions) gets all-zero stats — exactly the new-user
//  experience. Everything else (dashboard, skill tree, profile) reads from here.
// ---------------------------------------------------------------------------

export interface AreaStat {
  attempts: number;
  solved: number; // distinct problems solved (≥1 correct submission)
  total: number;
  masteryPct: number;
}

export interface RecentItem {
  problemId: string;
  slug: string;
  title: string;
  discipline: Discipline;
  status: string;
  score: number;
  at: Date;
}

export interface UserProgress {
  totalAttempts: number;
  totalSolved: number;
  accuracyPct: number;
  xp: number;
  streakDays: number;
  byDiscipline: Record<string, AreaStat>;
  byArea: Record<string, AreaStat>;
  recent: RecentItem[];
}

function emptyStat(): AreaStat {
  return { attempts: 0, solved: 0, total: 0, masteryPct: 0 };
}

export async function getUserProgress(userId: string): Promise<UserProgress> {
  const [subs, allProblems] = await Promise.all([
    prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        problemId: true,
        status: true,
        score: true,
        createdAt: true,
        problem: {
          select: { slug: true, title: true, discipline: true, skillAreas: true, eloWeight: true },
        },
      },
    }),
    prisma.problem.findMany({ select: { discipline: true, skillAreas: true } }),
  ]);

  const ensure = <T>(m: Record<string, T>, k: string, make: () => T): T => {
    let v = m[k];
    if (v === undefined) {
      v = make();
      m[k] = v;
    }
    return v;
  };

  // ---- totals (denominators) from the whole problem bank ----
  const byDiscipline: Record<string, AreaStat> = {};
  for (const d of DISCIPLINE_LIST) byDiscipline[d.key] = emptyStat();
  const byArea: Record<string, AreaStat> = {};
  for (const p of allProblems) {
    const dd = byDiscipline[p.discipline];
    if (dd) dd.total++;
    for (const a of p.skillAreas) ensure(byArea, a, emptyStat).total++;
  }

  // ---- the user's activity ----
  const solvedProblem = new Set<string>();
  const solvedInDiscipline: Record<string, Set<string>> = {};
  const solvedInArea: Record<string, Set<string>> = {};
  const days = new Set<string>();
  let correctCount = 0;
  let xp = 0;

  for (const s of subs) {
    days.add(s.createdAt.toISOString().slice(0, 10));
    const disc = s.problem.discipline;
    const dd = byDiscipline[disc];
    if (dd) dd.attempts++;
    for (const a of s.problem.skillAreas) ensure(byArea, a, emptyStat).attempts++;

    if (s.status === "CORRECT") {
      correctCount++;
      if (!solvedProblem.has(s.problemId)) {
        solvedProblem.add(s.problemId);
        xp += s.problem.eloWeight ?? 20;
        ensure(solvedInDiscipline, disc, () => new Set<string>()).add(s.problemId);
        for (const a of s.problem.skillAreas)
          ensure(solvedInArea, a, () => new Set<string>()).add(s.problemId);
      }
    }
  }

  for (const d of DISCIPLINE_LIST) {
    const st = byDiscipline[d.key];
    if (!st) continue;
    st.solved = solvedInDiscipline[d.key]?.size ?? 0;
    st.masteryPct = st.total ? Math.round((st.solved / st.total) * 100) : 0;
  }
  for (const a of Object.keys(byArea)) {
    const st = byArea[a];
    if (!st) continue;
    st.solved = solvedInArea[a]?.size ?? 0;
    st.masteryPct = st.total ? Math.round((st.solved / st.total) * 100) : 0;
  }

  const recent: RecentItem[] = subs.slice(0, 10).map((s) => ({
    problemId: s.problemId,
    slug: s.problem.slug,
    title: s.problem.title,
    discipline: s.problem.discipline,
    status: s.status,
    score: s.score,
    at: s.createdAt,
  }));

  return {
    totalAttempts: subs.length,
    totalSolved: solvedProblem.size,
    accuracyPct: subs.length ? Math.round((correctCount / subs.length) * 100) : 0,
    xp,
    streakDays: computeStreak(days),
    byDiscipline,
    byArea,
    recent,
  };
}

/** Consecutive days (ending today or yesterday) with at least one attempt. */
function computeStreak(days: Set<string>): number {
  if (days.size === 0) return 0;
  const key = (d: Date) => d.toISOString().slice(0, 10);
  const cursor = new Date();
  if (!days.has(key(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (days.has(key(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
