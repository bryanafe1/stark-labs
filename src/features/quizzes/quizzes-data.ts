import "server-only";
import type { Difficulty, Discipline, EvaluationMode } from "@prisma/client";
import type { Choice } from "@/lib/grading";

// ---------------------------------------------------------------------------
//  Quizzes — auto-gradable, multi-question assessments. Mock data only; swap
//  for Prisma reads when the DB is live:
//    getQuizzes()        -> prisma.quiz.findMany({ where:{ published:true } })
//    getQuizBySlug(slug) -> prisma.quiz.findUnique({ where:{ slug } })
//    getQuizSlugs()      -> prisma.quiz.findMany({ select:{ slug:true } })
//
//  Every question reuses the Evaluation Engine config shape (`gradeAnswer`),
//  so grading logic is identical to Practice/Arena. LLM_GRADED is intentionally
//  excluded — quizzes must grade instantly and deterministically.
// ---------------------------------------------------------------------------

/** A single auto-gradable quiz question. Mirrors `GradableProblem`. */
export interface QuizQuestion {
  id: string;
  prompt: string;
  /** Auto-gradable modes only — no LLM_GRADED in quizzes. */
  evaluationMode: Exclude<EvaluationMode, "LLM_GRADED">;
  expectedValue?: number;
  tolerance?: number;
  unit?: string;
  choices?: Choice[];
  expectedText?: string;
  /** Points awarded for a correct answer. */
  points: number;
}

export interface Quiz {
  id: string;
  slug: string;
  title: string;
  description: string;
  discipline: Discipline;
  difficulty: Difficulty;
  /** Percentage (0–100) of points required to pass. */
  passingScore: number;
  questions: QuizQuestion[];
}

const CATALOG: Quiz[] = [
  // -------------------------------------------------------------------------
  //  MECHANICAL — Statics & basic dynamics
  // -------------------------------------------------------------------------
  {
    id: "qz_mech_fundamentals",
    slug: "mechanical-fundamentals",
    title: "Mechanical Engineering Fundamentals",
    description:
      "Stress, kinematics, and energy basics every mechanical engineer should own cold.",
    discipline: "MECHANICAL",
    difficulty: "EASY",
    passingScore: 70,
    questions: [
      {
        id: "qz_mech_1",
        prompt:
          "A steel rod with a rectangular cross-section of 20 mm × 10 mm carries an axial tensile force of 10 kN.\n\nCompute the normal stress σ = F / A.\n\nGive your answer in MPa.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // A = 0.020 m × 0.010 m = 2.0e-4 m²; σ = 10000 / 2.0e-4 = 50e6 Pa = 50 MPa
        expectedValue: 50,
        tolerance: 0.5,
        unit: "MPa",
        points: 2,
      },
      {
        id: "qz_mech_2",
        prompt:
          "A 1500 kg vehicle travels at 20 m/s.\n\nWhat is its translational kinetic energy, KE = ½ m v²?\n\nGive your answer in kJ.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // ½ · 1500 · 20² = 0.5 · 1500 · 400 = 300000 J = 300 kJ
        expectedValue: 300,
        tolerance: 1,
        unit: "kJ",
        points: 2,
      },
      {
        id: "qz_mech_3",
        prompt:
          "Which quantity is conserved in a perfectly elastic collision but NOT in a perfectly inelastic collision?",
        evaluationMode: "MULTIPLE_CHOICE",
        choices: [
          { id: "a", label: "Linear momentum" },
          { id: "b", label: "Kinetic energy", correct: true },
          { id: "c", label: "Total mass" },
          { id: "d", label: "Total external force" },
        ],
        points: 2,
      },
      {
        id: "qz_mech_4",
        prompt:
          "An object starts from rest and accelerates uniformly at 3 m/s² for 4 s.\n\nUsing v = u + a t (u = 0), find its final velocity.\n\nGive your answer in m/s.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // v = 0 + 3 · 4 = 12 m/s
        expectedValue: 12,
        tolerance: 0.1,
        unit: "m/s",
        points: 2,
      },
      {
        id: "qz_mech_5",
        prompt:
          "What is the SI unit of mechanical work and energy? (single word, lowercase)",
        evaluationMode: "EXACT_MATCH",
        expectedText: "joule",
        points: 2,
      },
    ],
  },

  // -------------------------------------------------------------------------
  //  ELECTRICAL — DC circuits
  // -------------------------------------------------------------------------
  {
    id: "qz_elec_dc_circuits",
    slug: "electrical-dc-circuits",
    title: "DC Circuit Analysis",
    description:
      "Ohm's law, equivalent resistance, and power dissipation in resistive DC networks.",
    discipline: "ELECTRICAL",
    difficulty: "EASY",
    passingScore: 70,
    questions: [
      {
        id: "qz_elec_1",
        prompt:
          "A 9 V source drives a single 3 Ω resistor.\n\nUsing Ohm's law I = V / R, find the current.\n\nGive your answer in amperes.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // I = 9 / 3 = 3 A
        expectedValue: 3,
        tolerance: 0.05,
        unit: "A",
        points: 2,
      },
      {
        id: "qz_elec_2",
        prompt:
          "Two resistors, 6 Ω and 3 Ω, are connected in parallel.\n\nWhat is their equivalent resistance, R = (R1·R2)/(R1+R2)?",
        evaluationMode: "MULTIPLE_CHOICE",
        choices: [
          { id: "a", label: "1 Ω" },
          { id: "b", label: "2 Ω", correct: true }, // (6·3)/(6+3) = 18/9 = 2
          { id: "c", label: "4.5 Ω" },
          { id: "d", label: "9 Ω" },
        ],
        points: 2,
      },
      {
        id: "qz_elec_3",
        prompt:
          "A resistor carries 2 A while dropping 5 V across it.\n\nPower dissipated P = V · I.\n\nGive your answer in watts.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // P = 5 · 2 = 10 W
        expectedValue: 10,
        tolerance: 0.1,
        unit: "W",
        points: 2,
      },
      {
        id: "qz_elec_4",
        prompt:
          "Kirchhoff's Current Law (KCL) is a direct consequence of the conservation of what physical quantity? (single word, lowercase)",
        evaluationMode: "EXACT_MATCH",
        expectedText: "charge",
        points: 2,
      },
      {
        id: "qz_elec_5",
        prompt:
          "Three 12 Ω resistors are connected in series.\n\nWhat is the total resistance?\n\nGive your answer in ohms.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // 12 + 12 + 12 = 36 Ω
        expectedValue: 36,
        tolerance: 0.5,
        unit: "Ω",
        points: 2,
      },
    ],
  },

  // -------------------------------------------------------------------------
  //  CIVIL — Statics of structures
  // -------------------------------------------------------------------------
  {
    id: "qz_civil_structures",
    slug: "civil-structural-basics",
    title: "Structural Analysis Basics",
    description:
      "Reactions, beam loading, and material behavior for statically determinate structures.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    passingScore: 60,
    questions: [
      {
        id: "qz_civil_1",
        prompt:
          "A simply supported beam of span 10 m carries a single 40 kN point load at midspan.\n\nBy symmetry, what is the vertical reaction at each support?\n\nGive your answer in kN.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // Symmetric: each reaction = 40 / 2 = 20 kN
        expectedValue: 20,
        tolerance: 0.2,
        unit: "kN",
        points: 2,
      },
      {
        id: "qz_civil_2",
        prompt:
          "For the same simply supported beam (10 m span, 40 kN point load at midspan), the maximum bending moment occurs at midspan and equals M = P·L / 4.\n\nCompute M.\n\nGive your answer in kN·m.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // M = 40 · 10 / 4 = 100 kN·m
        expectedValue: 100,
        tolerance: 1,
        unit: "kN·m",
        points: 2,
      },
      {
        id: "qz_civil_3",
        prompt:
          "A simply supported beam carries a uniformly distributed load. Where along the span does the maximum bending moment occur?",
        evaluationMode: "MULTIPLE_CHOICE",
        choices: [
          { id: "a", label: "At the left support" },
          { id: "b", label: "At the quarter-span point" },
          { id: "c", label: "At midspan", correct: true },
          { id: "d", label: "At the right support" },
        ],
        points: 2,
      },
      {
        id: "qz_civil_4",
        prompt:
          "A 50 mm diameter circular column carries an axial compressive load of 78.54 kN.\n\nThe cross-sectional area is A = π r² = π (0.025)² ≈ 1.9635×10⁻³ m².\n\nCompute the compressive stress σ = F / A.\n\nGive your answer in MPa.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // A = π·0.025² = 1.96350e-3 m²; σ = 78540 / 1.96350e-3 = 4.0000e7 Pa = 40 MPa
        expectedValue: 40,
        tolerance: 0.5,
        unit: "MPa",
        points: 2,
      },
      {
        id: "qz_civil_5",
        prompt:
          "The ratio of stress to strain in the linear-elastic region of a material is called its modulus of ____. (single word, lowercase)",
        evaluationMode: "EXACT_MATCH",
        expectedText: "elasticity",
        points: 2,
      },
    ],
  },

  // -------------------------------------------------------------------------
  //  AEROSPACE — Aerodynamics & flight
  // -------------------------------------------------------------------------
  {
    id: "qz_aero_flight",
    slug: "aerospace-flight-basics",
    title: "Aerodynamics & Flight Fundamentals",
    description:
      "Lift, dynamic pressure, and the forces governing steady level flight.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    passingScore: 60,
    questions: [
      {
        id: "qz_aero_1",
        prompt:
          "Air of density 1.225 kg/m³ flows over a wing at a true airspeed of 100 m/s.\n\nDynamic pressure q = ½ ρ V².\n\nCompute q.\n\nGive your answer in Pa.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // q = 0.5 · 1.225 · 100² = 0.5 · 1.225 · 10000 = 6125 Pa
        expectedValue: 6125,
        tolerance: 5,
        unit: "Pa",
        points: 2,
      },
      {
        id: "qz_aero_2",
        prompt:
          "Using the dynamic pressure q = 6125 Pa from the previous question, a wing has planform area S = 20 m² and lift coefficient C_L = 0.5.\n\nLift L = q · S · C_L.\n\nCompute L.\n\nGive your answer in kN.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // L = 6125 · 20 · 0.5 = 61250 N = 61.25 kN
        expectedValue: 61.25,
        tolerance: 0.5,
        unit: "kN",
        points: 2,
      },
      {
        id: "qz_aero_3",
        prompt:
          "In steady, unaccelerated, level flight, which pair of forces must be equal in magnitude?",
        evaluationMode: "MULTIPLE_CHOICE",
        choices: [
          { id: "a", label: "Lift and drag" },
          { id: "b", label: "Thrust and lift" },
          { id: "c", label: "Lift and weight", correct: true },
          { id: "d", label: "Drag and weight" },
        ],
        points: 2,
      },
      {
        id: "qz_aero_4",
        prompt:
          "An aircraft flies at 340 m/s where the local speed of sound is 340 m/s.\n\nMach number M = V / a.\n\nWhat is its Mach number?",
        evaluationMode: "NUMERIC_TOLERANCE",
        // M = 340 / 340 = 1.0
        expectedValue: 1,
        tolerance: 0.02,
        points: 2,
      },
      {
        id: "qz_aero_5",
        prompt:
          "The dimensionless number expressing the ratio of flow speed to the local speed of sound is the ____ number. (single word, lowercase)",
        evaluationMode: "EXACT_MATCH",
        expectedText: "mach",
        points: 2,
      },
    ],
  },

  // -------------------------------------------------------------------------
  //  COMPUTER — Number systems, logic, architecture & complexity
  // -------------------------------------------------------------------------
  {
    id: "qz_comp_fundamentals",
    slug: "computer-engineering-fundamentals",
    title: "Computer Engineering Fundamentals",
    description:
      "Number systems, Boolean logic, CPU performance, caching, and algorithmic complexity.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    passingScore: 60,
    questions: [
      {
        id: "qz_comp_1",
        prompt:
          "Convert the unsigned binary number 10110 to decimal.\n\nGive your answer as a base-10 integer.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // 16 + 0 + 4 + 2 + 0 = 22
        expectedValue: 22,
        tolerance: 0.5,
        points: 2,
      },
      {
        id: "qz_comp_2",
        prompt:
          "Convert the hexadecimal number 0x2F to decimal.\n\nGive your answer as a base-10 integer.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // 0x2F = 2·16 + 15 = 32 + 15 = 47
        expectedValue: 47,
        tolerance: 0.5,
        points: 2,
      },
      {
        id: "qz_comp_3",
        prompt:
          "For any Boolean variable A, what is the value of the expression A AND (NOT A)?",
        evaluationMode: "MULTIPLE_CHOICE",
        choices: [
          { id: "a", label: "Always 1 (true)" },
          { id: "b", label: "Always 0 (false)", correct: true }, // a AND not-a is a contradiction
          { id: "c", label: "Equal to A" },
          { id: "d", label: "Equal to NOT A" },
        ],
        points: 2,
      },
      {
        id: "qz_comp_4",
        prompt:
          "A CPU runs a program of 1×10⁹ instructions with an average CPI (cycles per instruction) of 2.0 at a clock frequency of 2.0 GHz.\n\nExecution time = (instructions × CPI) / clock frequency.\n\nCompute the execution time in seconds.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // (1e9 · 2.0) / 2.0e9 = 2e9 / 2e9 = 1.0 s
        expectedValue: 1,
        tolerance: 0.02,
        unit: "s",
        points: 2,
      },
      {
        id: "qz_comp_5",
        prompt:
          "A cache services 950 hits out of 1000 total memory accesses.\n\nHit rate = hits / total accesses.\n\nExpress the hit rate as a percentage.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // 950 / 1000 = 0.95 = 95%
        expectedValue: 95,
        tolerance: 0.5,
        unit: "%",
        points: 2,
      },
      {
        id: "qz_comp_6",
        prompt:
          "What is the worst-case time complexity of binary search on a sorted array of n elements?",
        evaluationMode: "MULTIPLE_CHOICE",
        choices: [
          { id: "a", label: "O(1)" },
          { id: "b", label: "O(log n)", correct: true },
          { id: "c", label: "O(n)" },
          { id: "d", label: "O(n log n)" },
        ],
        points: 2,
      },
    ],
  },

  // -------------------------------------------------------------------------
  //  CHEMICAL — Balances, ideal gas, conversion & flow
  // -------------------------------------------------------------------------
  {
    id: "qz_chem_fundamentals",
    slug: "chemical-engineering-fundamentals",
    title: "Chemical Engineering Fundamentals",
    description:
      "Mass and energy balances, the ideal gas law, reaction conversion, and flow regime.",
    discipline: "CHEMICAL",
    difficulty: "MEDIUM",
    passingScore: 60,
    questions: [
      {
        id: "qz_chem_1",
        prompt:
          "At steady state with no reaction, a mixing tank receives a single feed of 100 kg/h and produces two outlet streams. Outlet stream A measures 30 kg/h.\n\nBy conservation of mass (in = out), what is the mass flow rate of outlet stream B?\n\nGive your answer in kg/h.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // 100 = 30 + B  ->  B = 70 kg/h
        expectedValue: 70,
        tolerance: 0.5,
        unit: "kg/h",
        points: 2,
      },
      {
        id: "qz_chem_2",
        prompt:
          "An ideal gas occupies V = 0.05 m³ at P = 100 kPa and T = 300 K.\n\nUsing PV = nRT with R = 8.314 J/(mol·K), compute the number of moles n.\n\nGive your answer in mol.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // n = PV/RT = (100000 · 0.05)/(8.314 · 300) = 5000/2494.2 = 2.005 mol
        expectedValue: 2.005,
        tolerance: 0.03,
        unit: "mol",
        points: 2,
      },
      {
        id: "qz_chem_3",
        prompt:
          "A reactor is fed 100 mol of reactant A, and 80 mol of A is consumed by reaction.\n\nFractional conversion X = (moles reacted) / (moles fed). What is the conversion?",
        evaluationMode: "MULTIPLE_CHOICE",
        choices: [
          { id: "a", label: "20%" },
          { id: "b", label: "0.8 (80%)", correct: true }, // 80/100 = 0.8
          { id: "c", label: "1.25" },
          { id: "d", label: "80 mol" },
        ],
        points: 2,
      },
      {
        id: "qz_chem_4",
        prompt:
          "A sensible-heat (energy) balance uses Q = m · cp · ΔT.\n\nHeat 2 kg of water (cp = 4.18 kJ/(kg·K)) by ΔT = 50 K.\n\nCompute the heat required Q in kJ.",
        evaluationMode: "NUMERIC_TOLERANCE",
        // Q = 2 · 4.18 · 50 = 418 kJ
        expectedValue: 418,
        tolerance: 2,
        unit: "kJ",
        points: 2,
      },
      {
        id: "qz_chem_5",
        prompt:
          "A fluid (ρ = 1000 kg/m³, μ = 0.001 Pa·s) flows at V = 2 m/s through a pipe of diameter D = 0.05 m.\n\nReynolds number Re = ρVD/μ. Compute Re (dimensionless).",
        evaluationMode: "NUMERIC_TOLERANCE",
        // Re = 1000 · 2 · 0.05 / 0.001 = 100/0.001 = 100000
        expectedValue: 100000,
        tolerance: 500,
        points: 2,
      },
    ],
  },
];

export async function getQuizzes(): Promise<Quiz[]> {
  return CATALOG;
}

export async function getQuizBySlug(slug: string): Promise<Quiz | null> {
  return CATALOG.find((q) => q.slug === slug) ?? null;
}

export async function getQuizSlugs(): Promise<string[]> {
  return CATALOG.map((q) => q.slug);
}
