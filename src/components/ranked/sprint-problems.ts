import type { SprintProblem } from "./types";

// ---------------------------------------------------------------------------
//  Timed-sprint problems (numeric). These are NOT plug-and-play: prompts do
//  NOT hand over the formula. Each requires recognizing the right approach and
//  chaining 2–3 steps (geometry → property → result, unit conversions, etc.).
//  Aimed at practicing/working engineers. All answers hand-verified; tolerances
//  allow g = 9.8 or 9.81 and minor rounding.
// ---------------------------------------------------------------------------

export const SPRINT_PROBLEMS: SprintProblem[] = [
  {
    id: "sp_buckling",
    title: "Column Buckling",
    prompt:
      "A 2.0 m long steel column (E = 200 GPa) has a solid circular cross-section of diameter 40 mm and is pinned at both ends.\n\nWhat is its critical buckling load, in kN?",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 62,
    tolerance: 2,
    unit: "kN",
  },
  {
    id: "sp_otto_work",
    title: "Otto Cycle Work",
    prompt:
      "An ideal air-standard Otto cycle (γ = 1.4) has a compression ratio of 9 and receives 800 kJ/kg of heat.\n\nFind the net work output per unit mass, in kJ/kg.",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 468,
    tolerance: 12,
    unit: "kJ/kg",
  },
  {
    id: "sp_headloss",
    title: "Pipe Pressure Drop",
    prompt:
      "Water (ρ = 1000 kg/m³) flows at 0.006 m³/s through a 100 m run of 50 mm diameter pipe. The Darcy friction factor is 0.02.\n\nWhat is the pressure drop along the pipe, in kPa?",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 187,
    tolerance: 7,
    unit: "kPa",
  },
  {
    id: "sp_rc_charge",
    title: "RC Charging Time",
    prompt:
      "A 10 µF capacitor, initially uncharged, charges through a 47 kΩ resistor from a 12 V source.\n\nHow long until the capacitor voltage reaches 9 V, in milliseconds?",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 652,
    tolerance: 12,
    unit: "ms",
  },
  {
    id: "sp_incline_friction",
    title: "Block on an Incline",
    prompt:
      "A 50 kg block is released from rest on a 30° incline. The coefficient of kinetic friction is 0.25.\n\nWhat is the block's acceleration down the slope, in m/s²?",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 2.78,
    tolerance: 0.1,
    unit: "m/s²",
  },
  {
    id: "sp_composite_wall",
    title: "Wall Heat Flux",
    prompt:
      "A 0.2 m thick wall (k = 0.8 W/m·K) has its inner surface at 30 °C. Outside is air at −10 °C with a convective coefficient h = 25 W/m²·K.\n\nWhat is the steady heat flux through the wall, in W/m²?",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 138,
    tolerance: 4,
    unit: "W/m²",
  },
  {
    id: "sp_beam_udl",
    title: "Beam Bending Stress",
    prompt:
      "A simply supported beam spans 4 m and carries a uniform load of 5 kN/m. Its cross-section is rectangular, 100 mm wide × 200 mm deep.\n\nWhat is the maximum bending stress, in MPa?",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 15,
    tolerance: 0.4,
    unit: "MPa",
  },
  {
    id: "sp_pump_power",
    title: "Pump Input Power",
    prompt:
      "A pump moves 1200 L/min of water, raising it 18 m while overcoming 7 m of friction head. Its efficiency is 70%.\n\nWhat shaft input power is required, in kW?",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 7.0,
    tolerance: 0.3,
    unit: "kW",
  },
  {
    id: "sp_overshoot",
    title: "Step Response Overshoot",
    prompt:
      "A unity-feedback system has the closed-loop characteristic equation s² + 6s + 25 = 0.\n\nWhat is the percent overshoot of its unit step response, in %?",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 9.5,
    tolerance: 0.6,
    unit: "%",
  },
];

export function pickSprintProblem(): SprintProblem {
  return SPRINT_PROBLEMS[Math.floor(Math.random() * SPRINT_PROBLEMS.length)]!;
}
