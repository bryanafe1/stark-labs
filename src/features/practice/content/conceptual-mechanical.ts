import type { PracticeProblem } from "../types";

// ---------------------------------------------------------------------------
//  CONCEPTUAL (open-ended, interview-style) mechanical questions.
//  evaluationMode = "LLM_GRADED"; the candidate writes a free-form answer to
//  each `part`, and later parts change the constraints — exactly how a real
//  interviewer probes deeper. Each part carries a `rubric` the AI grades against.
// ---------------------------------------------------------------------------

export const problems: PracticeProblem[] = [
  {
    id: "concept_plate_on_feet",
    slug: "concept-plate-on-feet-drill-press",
    title: "Plate on Four Feet Under a Central Load",
    prompt:
      "A flat, square steel plate rests on four short cylindrical feet — one\n" +
      "near each corner. A drill press pushes straight down with a steady force\n" +
      "at the exact center of the plate.\n\n" +
      "This is a reasoning question. Think out loud about how the load travels\n" +
      "through the plate to the feet.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["bending", "boundary-conditions", "stress", "conceptual"],
    skillAreas: ["statics", "mechanics-of-materials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Which region of the plate experiences the highest bending stress, and why? Reason about how the central load is carried out to the four feet.",
        rubric:
          "The plate behaves like a flat plate (or crossing beams) supported near the four corners with a concentrated load at the center. The bending moment — and therefore the bending stress σ = Mc/I — is greatest at the CENTER, on the top and bottom surfaces (outer fibers). The bottom face is in tension and the top face in compression directly under the load. Strong answers also mention: a local contact/stress concentration right under the drill tip, and secondary stress concentrations where the feet support the plate. Key insight: for a center-loaded, corner-supported plate the moment peaks at mid-span (the center), so that's where bending stress is highest.",
      },
      {
        prompt:
          "Now the plate is rigidly WELDED to the tops of the feet instead of just resting on them. How does the stress distribution change, and where would you now expect the highest stress?",
        rubric:
          "Welding changes the boundary condition from simply-supported (free to rotate at the feet) to fixed/clamped (rotation restrained). This introduces negative (hogging) bending moments at the supports. Consequences: the plate is stiffer, center deflection and center moment DECREASE, but significant bending moment now appears AT the feet/weld locations. The peak stress can shift toward the welded supports/corners; the welds also add stress concentrations and residual stress, so failure may initiate at a weld. Key insight: changing supports from pinned to fixed redistributes moment from mid-span toward the supports — less stress at the center, new high-stress zones at the welds.",
      },
    ],
  },

  {
    id: "concept_cantilever_to_propped",
    slug: "concept-cantilever-add-support",
    title: "Cantilever Beam, Then a Prop",
    prompt:
      "A uniform steel beam is rigidly fixed into a wall at one end and free at\n" +
      "the other (a cantilever). A downward load hangs from the free end.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["bending-moment", "beams", "indeterminate", "conceptual"],
    skillAreas: ["statics", "mechanics-of-materials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Where does this beam experience the maximum bending stress, and where would it fail first as you increase the load? Justify it with the bending-moment distribution.",
        rubric:
          "Bending moment is maximum at the FIXED (wall) end, M = P·L, and zero at the free end where the load is applied; it grows linearly toward the support. Maximum bending stress σ = Mc/I therefore occurs at the fixed end, on the top and bottom outer fibers (top fiber in tension, bottom in compression for a downward end load). Yielding/cracking initiates at the surface of the fixed end (the 'root'). Key insight: a cantilever's moment is largest at the support, so the root is critical — not the loaded free end.",
      },
      {
        prompt:
          "Now you add a simple support (a prop) directly under the free end, making it a propped cantilever. How do the magnitude and location of the peak bending stress change?",
        rubric:
          "Adding the prop makes the beam statically indeterminate (a propped cantilever) and forces the free-end deflection to ~zero. A reaction develops at the prop; a sagging moment appears within the span; and the peak (hogging) moment at the fixed end is REDUCED relative to the pure cantilever. Peak moment is still usually at the fixed end but smaller in magnitude (e.g., for a UDL it drops from wL²/2 to wL²/8), so peak bending stress drops and load capacity rises. Key insight: an added support reduces and redistributes the bending moment — redundancy lowers peak stress.",
      },
    ],
  },

  {
    id: "concept_thermal_constrained_bar",
    slug: "concept-thermal-stress-constrained-bar",
    title: "Heated Bar Between Two Walls",
    prompt:
      "A straight metal bar is held between two immovable, rigid walls with no\n" +
      "initial stress. The entire bar is then heated uniformly by a temperature\n" +
      "rise ΔT.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["thermal-stress", "constraints", "statics", "conceptual"],
    skillAreas: ["mechanics-of-materials", "thermodynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "What stress develops in the bar, is it tensile or compressive, and does it depend on the bar's length? Explain the physics.",
        rubric:
          "The bar wants to expand by ΔL = α·L·ΔT but the rigid walls prevent it, so a COMPRESSIVE stress develops. Magnitude σ = E·α·ΔT. Critically, it is INDEPENDENT of length: the prevented strain is α·ΔT regardless of L, so the stress depends only on E, α, and ΔT. (A long slender bar may BUCKLE before reaching that stress, but the axial stress value itself is length-independent.) Key insight: fully constrained uniform thermal expansion gives σ = EαΔT, compressive, length-independent.",
      },
      {
        prompt:
          "Now one rigid wall is replaced by a stiff spring of finite stiffness k. How does the bar's stress change, and what are the two limiting cases for k?",
        rubric:
          "With a finite spring the bar can expand partially — the spring deflects, so the restraint is only partial and the compressive stress is LESS than EαΔT. Set it up by compatibility/force balance: the free thermal expansion (αLΔT) is shared between the bar's elastic compression (PL/AE) and the spring deflection (P/k); solve for P (and σ = P/A). Limiting cases: k → ∞ recovers the rigid wall, σ → EαΔT; k → 0 (very soft spring) lets the bar expand freely, σ → 0. Key insight: thermal stress scales with how stiff the restraint is relative to the bar's own axial stiffness AE/L.",
      },
    ],
  },
];
