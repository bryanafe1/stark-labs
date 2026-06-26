import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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

  let debrief: Record<string, unknown> | null = null;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey && transcript.trim()) {
    try {
      const client = new Anthropic({ apiKey });
      const model = process.env.INTERVIEW_MODEL ?? "claude-sonnet-4-6";
      const system = [
        "You are an interview coach writing a concise debrief after a mock technical interview.",
        'Return STRICT JSON only: {"verdict":"<one-line readiness verdict>","strengths":["..."],"gaps":["..."],"communication":"<2-3 sentences on speaking style, referencing the metrics>","focus":["<2-3 topics to review next>"]}.',
        "No markdown, no text outside the JSON. Address the candidate as 'you'.",
      ].join("\n");
      const user = [
        `DISCIPLINE: ${session.discipline}`,
        `TOPIC: ${session.topic}`,
        `LEVEL: ${session.difficulty}`,
        `SPEECH: ~${speech.avgWordsPerMinute ?? "?"} wpm, ${speech.totalFillerWords} filler words across ${speech.answeredTurns} answers.`,
        "",
        "TRANSCRIPT:",
        transcript.slice(0, 12000),
        "",
        "Write the debrief JSON now.",
      ].join("\n");
      const msg = await client.messages.create({
        model,
        max_tokens: 800,
        system,
        messages: [{ role: "user", content: user }],
      });
      const text = msg.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("");
      const a = text.indexOf("{");
      const b = text.lastIndexOf("}");
      debrief = JSON.parse(a >= 0 && b > a ? text.slice(a, b + 1) : text);
    } catch {
      debrief = null;
    }
  }

  if (!debrief) {
    debrief = { verdict: "Debrief unavailable for this session.", strengths: [], gaps: [], communication: "", focus: [] };
  }
  debrief.speech = speech;

  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: { debrief: debrief as Prisma.InputJsonValue },
  });
}
