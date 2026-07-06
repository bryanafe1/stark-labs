import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { scoreInterview } from "@/lib/interview-grader";

/** True if the request carries the shared relay secret (relay-only endpoints). */
export function relaySecretOk(req: Request): boolean {
  const s = req.headers.get("x-relay-secret");
  return !!process.env.RELAY_SECRET && s === process.env.RELAY_SECRET;
}

/**
 * Build the post-session debrief from the transcript + aggregated speech metrics
 * and store it on the session. Best-effort: never throws into the relay path.
 */
export async function generateDebrief(sessionId: string): Promise<void> {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: { messages: { orderBy: { sequence: "asc" } }, speechData: true },
  });
  if (!session) return;

  const transcript =
    session.transcript ||
    session.messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");

  // Aggregate speech metrics across the candidate's turns.
  const sd = session.speechData;
  const wpm = sd.map((s) => s.wordsPerMinute).filter((x): x is number => x != null);
  const speech = {
    avgWordsPerMinute: wpm.length ? Math.round(wpm.reduce((a, b) => a + b, 0) / wpm.length) : null,
    totalFillerWords: sd.reduce((a, s) => a + (s.fillerWordCount ?? 0), 0),
    answeredTurns: sd.length,
  };

  const graded = await scoreInterview({
    discipline: session.discipline,
    topic: session.topic,
    level: session.difficulty,
    transcript,
    speechLine: `~${speech.avgWordsPerMinute ?? "?"} wpm, ${speech.totalFillerWords} filler words across ${speech.answeredTurns} answers.`,
  });

  const debrief: Record<string, unknown> = {
    ...(graded ?? {
      score: null,
      verdict: "Debrief unavailable for this session.",
      strengths: [],
      gaps: [],
      communication: "",
      focus: [],
    }),
    speech,
  };

  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      debrief: debrief as Prisma.InputJsonValue,
      performanceScore: graded?.score ?? null,
    },
  });
}
