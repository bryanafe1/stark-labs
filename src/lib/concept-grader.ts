import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
//  AI grader for open-ended conceptual answers. Returns a 0–100 accuracy score
//  + short interviewer feedback, grading the candidate's reasoning against the
//  question's rubric. Used by both Practice (feedback) and Arena (% scoring).
// ---------------------------------------------------------------------------

export interface ConceptGrade {
  score: number; // 0–100
  strengths: string; // what the candidate did well
  improvements: string; // what to improve on
  concepts: string[]; // key concepts the question tests
}

function extractJson(text: string): string {
  const a = text.indexOf("{");
  const b = text.lastIndexOf("}");
  return a >= 0 && b > a ? text.slice(a, b + 1) : text;
}

export async function gradeConcept(opts: {
  scenario: string; // shared problem context
  question: string; // the specific part being answered
  rubric: string; // key points an ideal answer hits
  priorContext?: string; // earlier parts + answers, for continuity
  answer: string;
}): Promise<ConceptGrade> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { score: 0, strengths: "", improvements: "AI grading isn't configured yet.", concepts: [] };

  const client = new Anthropic({ apiKey });
  const model = process.env.CONCEPT_MODEL ?? process.env.INTERVIEW_MODEL ?? "claude-sonnet-4-6";

  const system = [
    "You are a senior engineering interviewer grading a candidate's open-ended conceptual answer.",
    "Grade ONLY on engineering correctness and quality of reasoning against the rubric — ignore grammar, spelling, and length.",
    "Be fair but rigorous, like a real technical interviewer. Give partial credit for partially-correct reasoning, and full marks only when the core insight is clearly demonstrated.",
    "Respond with STRICT JSON and nothing else, in this exact shape:",
    '{"score": <integer 0-100>, "strengths": "<1-2 sentences on what the candidate did well; empty string if the answer was blank or entirely wrong>", "improvements": "<1-2 sentences on what was missing or wrong and the key insight needed to fix it>", "concepts": ["<2-4 short key concepts this question tests, e.g. \'thermal expansion\', \'stress concentration\'>"]}',
    "Address the candidate as 'you'. No markdown, no text outside the JSON.",
  ].join("\n");

  const user = [
    `SCENARIO:\n${opts.scenario}`,
    opts.priorContext ? `\nEARLIER IN THIS QUESTION:\n${opts.priorContext}` : "",
    `\nQUESTION:\n${opts.question}`,
    `\nGRADING RUBRIC (the ideal answer hits these points):\n${opts.rubric}`,
    `\nCANDIDATE'S ANSWER:\n${opts.answer}`,
    "\nGrade it now. Return only the JSON.",
  ].join("\n");

  try {
    const msg = await client.messages.create({
      model,
      max_tokens: 700,
      system,
      messages: [{ role: "user", content: user }],
    });
    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    const parsed = JSON.parse(extractJson(text)) as {
      score?: unknown;
      strengths?: unknown;
      improvements?: unknown;
      concepts?: unknown;
    };
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
    const strengths = String(parsed.strengths ?? "").trim().slice(0, 1200);
    const improvements =
      String(parsed.improvements ?? "").trim().slice(0, 1200) || "No feedback returned.";
    const concepts = Array.isArray(parsed.concepts)
      ? parsed.concepts.map((c) => String(c).trim()).filter(Boolean).slice(0, 6)
      : [];
    return { score, strengths, improvements, concepts };
  } catch (err) {
    console.error("[concept-grader] grading failed", err);
    return { score: 0, strengths: "", improvements: "Grading failed — please try again.", concepts: [] };
  }
}
