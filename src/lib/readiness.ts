import "server-only";
import { prisma } from "@/lib/prisma";
import { getUserProgress } from "@/lib/user-stats";

// ---------------------------------------------------------------------------
//  Interview Readiness Score — one outcome number (0–100) that answers "how
//  ready am I for a real interview?", built from real activity. Every point is
//  earnable, and the weakest component is always surfaced as the next action.
// ---------------------------------------------------------------------------

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const TARGET_SOLVED = 30; // problems solved that reads as "interview-deep"
const TARGET_REPS = 6; // mock/voice interviews rehearsed
const TARGET_STREAK = 7; // days of consistent practice

export interface ReadinessComponent {
  key: string;
  label: string;
  value: number; // 0–100
  summary: string; // e.g. "12 solved"
  hint: string; // how to raise it
  href: string;
}

export interface Readiness {
  score: number; // 0–100
  level: { label: string; blurb: string };
  components: ReadinessComponent[];
  topAction: { label: string; message: string; href: string };
}

function levelFor(score: number): { label: string; blurb: string } {
  if (score >= 85) return { label: "Sharp", blurb: "You're interview-sharp. Go get the offer." };
  if (score >= 70)
    return { label: "Interview-ready", blurb: "You'd hold your own on a real panel — keep the edge." };
  if (score >= 50)
    return { label: "Getting ready", blurb: "The fundamentals are landing. Push your reps and accuracy." };
  if (score >= 25)
    return { label: "Building up", blurb: "Good momentum. Cover more topics and rehearse out loud." };
  return { label: "Just getting started", blurb: "Every rep moves the needle. Start with a few problems." };
}

export async function getReadiness(userId: string): Promise<Readiness> {
  const [prog, voiceReps, gradedReps] = await Promise.all([
    getUserProgress(userId),
    prisma.interviewSession.count({ where: { userId, refunded: false } }),
    prisma.submission.count({ where: { userId, llmModel: { not: null } } }),
  ]);

  const reps = voiceReps + gradedReps;
  const depth = clamp01(prog.totalSolved / TARGET_SOLVED) * 100;
  // Accuracy only counts once there's enough volume to be meaningful.
  const accuracy =
    prog.totalAttempts >= 10 ? prog.accuracyPct : Math.round(prog.accuracyPct * (prog.totalAttempts / 10));
  const repsScore = clamp01(reps / TARGET_REPS) * 100;
  const consistency = clamp01(prog.streakDays / TARGET_STREAK) * 100;

  const components: ReadinessComponent[] = [
    {
      key: "reps",
      label: "Interview reps",
      value: Math.round(repsScore),
      summary: reps ? `${reps} mock & voice session${reps === 1 ? "" : "s"}` : "No interviews yet",
      hint: "Rehearse with the AI interviewer and voice sim — the closest thing to the real panel.",
      href: "/interview",
    },
    {
      key: "depth",
      label: "Problems solved",
      value: Math.round(depth),
      summary: `${prog.totalSolved} solved`,
      hint: "Work through interview-grade problems across topics.",
      href: "/practice",
    },
    {
      key: "accuracy",
      label: "Accuracy",
      value: Math.round(accuracy),
      summary: prog.totalAttempts ? `${prog.accuracyPct}% correct` : "No attempts yet",
      hint: "Get more answers right on the first try — that's what interviewers watch.",
      href: "/practice",
    },
    {
      key: "consistency",
      label: "Consistency",
      value: Math.round(consistency),
      summary: prog.streakDays ? `${prog.streakDays}-day streak` : "No streak yet",
      hint: "Practice a little every day — sharpness compounds.",
      href: "/practice",
    },
  ];

  const score = Math.round(repsScore * 0.3 + depth * 0.3 + accuracy * 0.25 + consistency * 0.15);
  const weakest = [...components].sort((a, b) => a.value - b.value)[0]!;

  return {
    score,
    level: levelFor(score),
    components,
    topAction: { label: weakest.label, message: weakest.hint, href: weakest.href },
  };
}
