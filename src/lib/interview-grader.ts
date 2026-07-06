import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
//  One honest interview grader, shared by the typed and voice flows, so the
//  readiness score reflects how a candidate actually PERFORMED — not just that
//  they showed up. Returns a 0–100 performance score plus the qualitative
//  debrief. Best-effort: returns null on any failure (callers degrade gracefully).
// ---------------------------------------------------------------------------

export interface InterviewDebrief {
  score: number; // 0–100 honest interview performance
  verdict: string;
  strengths: string[];
  gaps: string[];
  communication: string;
  focus: string[];
}

const asStrings = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean).slice(0, 6) : [];

export async function scoreInterview(input: {
  discipline: string;
  topic: string;
  level: string;
  transcript: string;
  /** Optional voice speech-metric summary, e.g. "~140 wpm, 12 filler words across 5 answers." */
  speechLine?: string;
}): Promise<InterviewDebrief | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !input.transcript.trim()) return null;

  try {
    const client = new Anthropic({ apiKey });
    const model = process.env.INTERVIEW_MODEL ?? "claude-sonnet-4-6";
    const system = [
      "You are a senior engineer grading a mock technical interview you just observed.",
      "Score how the CANDIDATE performed: the correctness and depth of their technical reasoning, how they handled follow-ups and pressure, whether they justified decisions and caught their own errors" +
        (input.speechLine ? ", and their spoken delivery" : "") +
        ". Grade honestly against a real hiring bar for the stated level — most real candidates land 40–70; reserve 85+ for genuinely strong, hire-worthy performances and be willing to score low when answers are thin, wrong, or evasive. Do NOT inflate.",
      'Return STRICT JSON only: {"score":<integer 0-100>,"verdict":"<one-line readiness verdict>","strengths":["..."],"gaps":["..."],"communication":"<2-3 sentences on communication/delivery>","focus":["<2-3 topics to review next>"]}.',
      "No markdown, no prose outside the JSON. Address the candidate as 'you'.",
    ].join("\n");
    const user = [
      `DISCIPLINE: ${input.discipline}`,
      `TOPIC: ${input.topic}`,
      `LEVEL: ${input.level}`,
      input.speechLine ? `SPEECH: ${input.speechLine}` : "",
      "",
      "TRANSCRIPT:",
      input.transcript.slice(0, 12000),
      "",
      "Grade the interview and return the debrief JSON now.",
    ]
      .filter(Boolean)
      .join("\n");

    const msg = await client.messages.create({
      model,
      max_tokens: 900,
      system,
      messages: [{ role: "user", content: user }],
    });
    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    const a = text.indexOf("{");
    const b = text.lastIndexOf("}");
    const parsed = JSON.parse(a >= 0 && b > a ? text.slice(a, b + 1) : text) as Record<string, unknown>;

    return {
      score: Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0))),
      verdict: String(parsed.verdict ?? ""),
      strengths: asStrings(parsed.strengths),
      gaps: asStrings(parsed.gaps),
      communication: String(parsed.communication ?? ""),
      focus: asStrings(parsed.focus),
    };
  } catch {
    return null;
  }
}
