import type { SprintProblem } from "./types";

// ---------------------------------------------------------------------------
//  Self-contained timed-sprint problems (numeric). Each prompt states the
//  formula so it's a *speed* race, not a memory test. Graded via lib/grading.
//  All answers verified.
// ---------------------------------------------------------------------------

export const SPRINT_PROBLEMS: SprintProblem[] = [
  {
    id: "sp_reynolds",
    title: "Pipe Reynolds Number",
    prompt:
      "Water (ρ = 1000 kg/m³, µ = 0.001 Pa·s) flows at V = 2 m/s through a D = 50 mm pipe.\n\nRe = ρ·V·D / µ. Enter Re (whole number).",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 100000,
    tolerance: 1000,
    unit: "",
  },
  {
    id: "sp_carnot",
    title: "Carnot Efficiency",
    prompt:
      "A heat engine runs between Th = 600 K and Tc = 300 K.\n\nη = 1 − Tc/Th. Enter η as a percentage (e.g. 50).",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 50,
    tolerance: 0.5,
    unit: "%",
  },
  {
    id: "sp_ohm_power",
    title: "Resistor Power",
    prompt:
      "A 12 V source drives a 6 Ω resistor.\n\nP = V²/R. Enter the power in watts.",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 24,
    tolerance: 0.5,
    unit: "W",
  },
  {
    id: "sp_conduction",
    title: "Heat Conduction",
    prompt:
      "A wall: k = 200 W/m·K, A = 0.01 m², ΔT = 50 K, L = 0.1 m.\n\nQ = k·A·ΔT / L. Enter Q in watts.",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 1000,
    tolerance: 5,
    unit: "W",
  },
  {
    id: "sp_cantilever",
    title: "Cantilever Tip Deflection",
    prompt:
      "Cantilever: P = 500 N at the free end, L = 1 m, EI = 2×10⁵ N·m².\n\nδ = P·L³ / (3·EI). Enter δ in millimetres (3 decimals).",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.833,
    tolerance: 0.02,
    unit: "mm",
  },
  {
    id: "sp_bending",
    title: "Bending Stress",
    prompt:
      "Beam: M = 1000 N·m, c = 0.05 m, I = 4×10⁻⁶ m⁴.\n\nσ = M·c / I. Enter σ in MPa.",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 12.5,
    tolerance: 0.2,
    unit: "MPa",
  },
];

export function pickSprintProblem(): SprintProblem {
  return SPRINT_PROBLEMS[Math.floor(Math.random() * SPRINT_PROBLEMS.length)]!;
}
