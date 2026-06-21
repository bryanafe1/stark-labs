import type { Difficulty, Discipline } from "@prisma/client";

// ---------------------------------------------------------------------------
//  Lesson content model.
//
//  A lesson is an ordered list of typed blocks. Each block maps to the
//  LessonSection.kind enum in the schema; the `content` Json column stores the
//  block's payload (everything here except `kind`/`id`). All payloads are
//  plain serializable data — sandboxes carry an expression STRING (evaluated
//  client-side via lib/expr) rather than a function, so blocks cross the
//  server/client boundary cleanly.
// ---------------------------------------------------------------------------

export interface ProseBlock {
  id: string;
  kind: "PROSE";
  title?: string;
  markdown: string;
}

export interface FormulaVariable {
  symbol: string;
  name: string;
  unit?: string;
}

export interface FormulaBlock {
  id: string;
  kind: "FORMULA";
  title?: string;
  /** Human-readable rendering, e.g. "δ = P·L³ / (3·E·I)". */
  display: string;
  variables: FormulaVariable[];
  note?: string;
}

export interface SandboxVariable {
  key: string; // identifier used in `expression`
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface SandboxBlock {
  id: string;
  kind: "SANDBOX";
  title?: string;
  description?: string;
  variables: SandboxVariable[];
  /** Arithmetic expression over the variable keys; see lib/expr. */
  expression: string;
  outputLabel: string;
  outputUnit?: string;
  precision?: number;
}

export interface WalkthroughStep {
  title: string;
  markdown: string;
}

export interface WalkthroughBlock {
  id: string;
  kind: "WALKTHROUGH";
  title?: string;
  steps: WalkthroughStep[];
}

export interface CheckBlock {
  id: string;
  kind: "CHECK";
  question: string;
  choices: { id: string; label: string }[];
  answerId: string;
  explanation: string;
}

/** Highlighted aside. "interview" = what interviewers actually probe for. */
export type CalloutVariant = "tip" | "warning" | "insight" | "interview";

export interface CalloutBlock {
  id: string;
  kind: "CALLOUT";
  variant: CalloutVariant;
  title?: string;
  markdown: string;
}

export interface WorkedExampleBlock {
  id: string;
  kind: "WORKED_EXAMPLE";
  title?: string;
  /** The problem statement (markdown). */
  problem: string;
  /** Solution steps, revealed together when the learner opts in. */
  steps: { label: string; markdown: string }[];
  /** Final boxed answer (markdown). */
  answer: string;
}

/** Embedded YouTube video (lazy click-to-play facade). */
export interface VideoBlock {
  id: string;
  kind: "VIDEO";
  youtubeId: string;
  title?: string;
  channel?: string;
  caption?: string;
}

/** Predict-then-reveal — the engagement hook: guess first, then find out. */
export interface PredictBlock {
  id: string;
  kind: "PREDICT";
  question: string;
  options: { id: string; label: string }[];
  answerId: string;
  /** Shown after the learner commits a guess (markdown). */
  reveal: string;
}

export type LessonBlock =
  | ProseBlock
  | FormulaBlock
  | SandboxBlock
  | WalkthroughBlock
  | CheckBlock
  | CalloutBlock
  | WorkedExampleBlock
  | VideoBlock
  | PredictBlock;

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  discipline: Discipline;
  difficulty: Difficulty;
  estMinutes: number;
  tags: string[];
  /** Slug of a related practice problem, for the lesson → practice loop. */
  practiceSlug?: string;
  /**
   * Number of interactive blocks — the denominator for progress/resume.
   * Always populated by `toSummary`; optional so `LessonDetail` content
   * modules (which extend this) don't each have to declare it.
   */
  interactiveCount?: number;
}

export interface LessonDetail extends LessonSummary {
  /** What the learner will be able to do after the lesson (4–6 items). */
  objectives: string[];
  /** Assumed background, by topic name (optional). */
  prerequisites?: string[];
  /** One-paragraph framing of how this topic shows up in interviews. */
  interviewAngle?: string;
  blocks: LessonBlock[];
  /** Crisp summary points (5–7 items). */
  keyTakeaways: string[];
}
