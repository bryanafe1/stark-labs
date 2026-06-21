import { describe, it, expect } from "vitest";
import { gradeAnswer, type GradableProblem } from "./grading";

const num = (expectedValue: number, tolerance: number): GradableProblem => ({
  evaluationMode: "NUMERIC_TOLERANCE",
  expectedValue,
  tolerance,
  unit: "",
});

describe("gradeAnswer — numeric relative-tolerance floor", () => {
  it("accepts rounding / g=9.8-vs-9.81 even when the absolute band is tight", () => {
    // 500 with a tight 0.2% absolute band; a ~0.6% deviation from rounding
    // should still pass thanks to the 1% relative floor (±5).
    const p = num(500, 1);
    expect(gradeAnswer(p, { numericAnswer: 503 }).status).toBe("CORRECT");
    expect(gradeAnswer(p, { numericAnswer: 497 }).status).toBe("CORRECT");
  });

  it("still rejects answers outside the 1% floor", () => {
    const p = num(500, 1);
    expect(gradeAnswer(p, { numericAnswer: 510 }).status).toBe("INCORRECT"); // 2% off
  });

  it("keeps the problem's absolute tolerance when it is larger than the floor", () => {
    const p = num(100, 5); // explicit ±5 (5%) > 1% floor
    expect(gradeAnswer(p, { numericAnswer: 104 }).status).toBe("CORRECT");
    expect(gradeAnswer(p, { numericAnswer: 106 }).status).toBe("INCORRECT");
  });

  it("g-sensitive example: incline acceleration computed with 9.8 vs 9.81", () => {
    // a = g(sin30 − 0.25·cos30): 9.81→2.781, 9.8→2.778; tight ±0.02 band still ok.
    const p = num(2.781, 0.02);
    expect(gradeAnswer(p, { numericAnswer: 2.778 }).status).toBe("CORRECT");
  });
});
