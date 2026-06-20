// ---------------------------------------------------------------------------
//  Tolerant, unit-aware numeric grading core (Iteration 2, Phase 0).
//
//  Pure and dependency-free — this is load-bearing for trust, so it is isolated
//  and unit-tested (see grade-numeric.test.ts). It is the canonical answer to
//  "is this numeric answer correct?":
//
//    correct  ⇔  |submitted − expected| ≤ max(abs_tol, rel_tol · |expected|)
//               AND the unit (if the user supplied one) matches.
//
//  - Accepts scientific notation and "a × 10^b" style input.
//  - Compares the unit separately from the magnitude.
// ---------------------------------------------------------------------------

export interface Tolerance {
  /** Relative tolerance, fraction of |expected|. Default 1e-2 (1%). */
  rel?: number;
  /** Absolute tolerance. Default 1e-9 (≈ exact for non-tiny values). */
  abs?: number;
}

export interface NumericGradeInput {
  /** Raw user answer — a number, or a string (sci-notation friendly). */
  submitted: number | string;
  expected: number;
  tolerance?: Tolerance;
  /** Canonical unit for the problem, e.g. "MPa", "m/s". Optional. */
  expectedUnit?: string | null;
  /** Unit the user supplied alongside the magnitude, if any. */
  submittedUnit?: string | null;
}

export interface NumericGradeResult {
  correct: boolean;
  reason: string;
  /** |submitted − expected| (NaN if the answer could not be parsed). */
  delta: number;
  /** The tolerance band actually applied: max(abs, rel·|expected|). */
  allowed: number;
  /** Whether the unit matched (true when the user supplied no unit). */
  unitMatch: boolean;
}

export const DEFAULT_REL_TOL = 1e-2;
export const DEFAULT_ABS_TOL = 1e-9;

/**
 * Parse a number from user input. Handles plain decimals, scientific notation
 * ("1.2e-3"), "a × 10^b" / "a x 10^b" / "a * 10^b" / "a · 10^b" forms, and
 * thousands separators ("1,234,567"). Returns null if no finite number found.
 */
export function parseNumber(raw: number | string): number | null {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  let s = raw.trim();
  if (s === "") return null;

  // Thousands separators: 1,234 or 1,234,567.89 → strip commas.
  if (/^[+-]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, "");

  // "a × 10^b" and friends → a · 10^b.
  const sci = /^([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\s*[x×*·⋅]\s*10\s*\^?\s*([+-]?\d+)$/.exec(s);
  if (sci) {
    const a = Number(sci[1]);
    const b = Number(sci[2]);
    if (Number.isFinite(a) && Number.isFinite(b)) return a * Math.pow(10, b);
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Normalise a unit string for comparison (whitespace + multiplication dots + common synonyms). */
export function normalizeUnit(u: string | null | undefined): string {
  if (!u) return "";
  let s = u.trim();
  if (s === "") return "";
  s = s.replace(/\s+/g, ""); // units are written without spaces ("N·m", "m/s")
  s = s.replace(/[*⋅]/g, "·"); // unify multiplication dot
  s = s.replace(/ohms?/gi, "Ω");
  s = s.replace(/degrees?|deg/gi, "°");
  return s;
}

/**
 * Units match when: the user supplied no unit (we graded magnitude only), OR
 * the problem defines no unit, OR both normalise to the same string.
 */
export function unitsMatch(
  expectedUnit: string | null | undefined,
  submittedUnit: string | null | undefined,
): boolean {
  const e = normalizeUnit(expectedUnit);
  const s = normalizeUnit(submittedUnit);
  if (!s || !e) return true;
  return e === s;
}

export function gradeNumeric(input: NumericGradeInput): NumericGradeResult {
  const submitted = parseNumber(input.submitted);
  if (submitted === null) {
    return {
      correct: false,
      reason: "Could not read a number from the answer.",
      delta: NaN,
      allowed: NaN,
      unitMatch: false,
    };
  }

  const rel = input.tolerance?.rel ?? DEFAULT_REL_TOL;
  const abs = input.tolerance?.abs ?? DEFAULT_ABS_TOL;
  const allowed = Math.max(abs, rel * Math.abs(input.expected));
  const delta = Math.abs(submitted - input.expected);
  const within = delta <= allowed;
  const unitMatch = unitsMatch(input.expectedUnit, input.submittedUnit);
  const correct = within && unitMatch;

  let reason: string;
  if (!within) {
    reason = `Off by ${delta.toPrecision(3)} — outside the ±${allowed.toPrecision(3)} tolerance band.`;
  } else if (!unitMatch) {
    reason = `Right magnitude, but the unit "${input.submittedUnit}" doesn't match "${input.expectedUnit}".`;
  } else {
    reason = "Within tolerance.";
  }

  return { correct, reason, delta, allowed, unitMatch };
}
