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

  {
    id: "concept_stress_concentration_hole",
    slug: "concept-stress-concentration-hole",
    title: "A Hole in a Plate Under Tension",
    prompt:
      "A wide, thin steel plate is pulled in tension along its length. A small\n" +
      "circular hole is drilled through the middle of it.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["stress-concentration", "fatigue", "conceptual"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "How does the hole change the stress in the plate — roughly where is the worst stress and how severe is it? Reason about how the force has to flow around the hole.",
        rubric:
          "The hole forces the load (think of force 'flow lines') to divert around it, crowding at the sides of the hole on the axis perpendicular to the load. This creates a STRESS CONCENTRATION: the local stress at the hole edge is much higher than the nominal/average stress. For a small circular hole in a wide plate the theoretical stress-concentration factor is about Kt ≈ 3, i.e. peak ≈ 3× nominal. The peak occurs at the two points on the hole boundary 90° from the load direction (the 'equator'). The nominal stress also rises a bit because the net cross-section is reduced. Key insight: discontinuities concentrate stress locally; Kt ≈ 3 for a circular hole, peaking at the sides of the hole.",
      },
      {
        prompt:
          "Now compare a sharp-edged notch/corner to a smooth, generously rounded one (e.g. adding a fillet). Why does increasing the radius reduce the danger, and what is the tradeoff?",
        rubric:
          "Stress-concentration severity depends on how abruptly the geometry changes: smaller radius of curvature → higher Kt. Sharp notches/corners are worst, and a crack is the limit (Kt → ∞). Increasing the radius (rounded hole, generous fillet) lowers Kt, reducing the peak stress and dramatically improving fatigue life (cracks initiate at sharp concentrations). Tradeoff: a larger radius/hole removes more material (raising nominal stress on the net section) and may conflict with packaging/function. Key insight: peak stress is driven by sharpness, so round out notches and fillets — sharp re-entrant corners are prime fatigue-initiation sites.",
      },
    ],
  },

  {
    id: "concept_parallel_series_rods",
    slug: "concept-load-sharing-parallel-series",
    title: "Two Rods Sharing a Load",
    prompt:
      "A rigid block is supported by two vertical rods standing side by side; it\n" +
      "presses straight down so both rods shorten by the same amount. The rods\n" +
      "have equal length and cross-section but are different materials (different\n" +
      "stiffness).",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["stiffness", "load-sharing", "statically-indeterminate", "conceptual"],
    skillAreas: ["mechanics-of-materials", "statics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "How is the load shared between the two rods? Which carries more, and why?",
        rubric:
          "The rods are in PARALLEL: they share the same deflection (and the same strain, since equal length). Force in each = stiffness × deflection, where axial stiffness k = AE/L. With equal A and L, the rod with the higher Young's modulus E carries MORE of the load, in direct proportion to its E (and it also sees higher stress, σ = Eε). The load does NOT split evenly — it distributes by relative stiffness. Key insight: parallel members share displacement; load divides in proportion to stiffness (AE/L). This is a statically indeterminate problem solved by compatibility.",
      },
      {
        prompt:
          "Now the two rods are instead stacked end-to-end (in series) carrying the same load. How do the force in each and the deformations compare now?",
        rubric:
          "In SERIES the two rods carry the SAME force (equilibrium — the load passes through both). Their stresses differ only if the areas differ (σ = F/A). The deformations ADD (total = δ1 + δ2), and each δ = FL/AE, so the less-stiff (lower-E) rod deforms more. Key insight: series members share force and their displacements sum, with the more compliant member moving most — the opposite sharing rule from parallel members (which share displacement and split load by stiffness).",
      },
    ],
  },

  {
    id: "concept_column_buckling",
    slug: "concept-slender-column-buckling",
    title: "A Slender Column in Compression",
    prompt:
      "A long, slender steel rod is loaded in pure axial compression, pushed\n" +
      "straight down along its length.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["buckling", "stability", "columns", "conceptual"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "As you slowly increase the load, how does this slender rod fail — and is it really about the material's strength? Explain.",
        rubric:
          "It fails by BUCKLING — an elastic instability where it suddenly bows sideways — typically well BEFORE the material reaches its compressive yield strength. The critical load is Euler's: Pcr = π²EI/Le². It depends on the elastic modulus E, the cross-section's second moment of area I (about the weak axis), and the effective length Le — NOT on yield strength. Slender columns are stiffness/geometry-limited, not strength-limited; buckling happens about the axis with the smallest I. Key insight: slender compression members fail by buckling at Pcr = π²EI/Le², independent of yield strength.",
      },
      {
        prompt:
          "Compare two fixes: (a) clamping/fixing both ends instead of pinning them, and (b) halving the length. How does each change the buckling load, and which helps more?",
        rubric:
          "Buckling load scales as 1/Le². (a) Fixing both ends (vs pinned-pinned) drops the effective-length factor from K=1 to K≈0.5, halving Le → Pcr rises ~4×. (b) Halving the actual length also halves Le → Pcr rises ~4×. Both roughly quadruple capacity (similar effect). Increasing the weak-axis I (e.g. a tube/closed section) also raises Pcr. Key insight: capacity ∝ 1/Le², so both stiffer end conditions and shorter length help dramatically (as the square) — geometry and boundary conditions dominate, not material strength.",
      },
    ],
  },

  {
    id: "concept_fatigue_keyway_shaft",
    slug: "concept-fatigue-keyway-shaft",
    title: "Why a Shaft Cracks Below Yield",
    prompt:
      "A rotating steel shaft transmits power. It has a keyway (a sharp-cornered\n" +
      "slot) cut into it and carries a bending load while it spins, so its surface\n" +
      "sees fully-reversed cyclic stress every revolution.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["fatigue", "stress-concentration", "machine-design", "conceptual"],
    skillAreas: ["machine-design", "mechanics-of-materials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Even though the peak stress stays well below the material's yield strength, the shaft eventually cracks at the keyway. Why does it fail at all, and why there?",
        rubric:
          "This is FATIGUE: repeated cyclic stressing nucleates and grows a crack over many cycles even when stresses never exceed yield. It localizes at the keyway because the sharp corner is a STRESS CONCENTRATION (high Kt) — the local cyclic stress amplitude there is far above nominal, so a crack initiates at the corner and propagates a little each cycle until final fracture. A rotating shaft in bending sees fully-reversed stress every revolution, so cycles accumulate quickly. Key insight: fatigue is driven by cyclic stress AMPLITUDE and initiates at stress concentrations/surface flaws — not by exceeding static yield.",
      },
      {
        prompt:
          "What design or process changes would most extend its fatigue life, and why?",
        rubric:
          "Cut the stress concentration: round the keyway corners (larger fillet radius) or redesign/relocate it. Improve SURFACE condition: polish (fatigue cracks start at the surface) and induce compressive residual stress via shot peening or cold rolling — this strongly delays crack initiation. Lower the stress amplitude (larger diameter / stiffer shaft), avoid corrosion, and choose a cleaner/higher-endurance material. Key insight: fatigue life is dominated by surface finish and stress concentrations — generous fillets, smooth/peened surfaces, and lower amplitude are the biggest levers (often more than raw material strength).",
      },
    ],
  },

  {
    id: "concept_section_modulus_orientation",
    slug: "concept-beam-orientation-section-modulus",
    title: "Tall or Flat: Orienting a Beam",
    prompt:
      "A long rectangular wooden beam (cross-section taller than it is wide) spans\n" +
      "between two supports with a load in the middle. You can install it standing\n" +
      "tall (long side vertical) or lying flat (long side horizontal).",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["bending", "section-modulus", "moment-of-inertia", "conceptual"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Which orientation is stiffer and stronger in bending, and why? Be quantitative if you can.",
        rubric:
          "Standing TALL (the long dimension vertical, in line with the load) is far stiffer and stronger. Bending resistance comes from the second moment of area I = b·h³/12 about the bending axis: material far from the neutral axis matters as the CUBE of the height h. Deflection ∝ 1/I, and bending stress σ = Mc/I, with section modulus S = I/c = b·h²/6 governing strength (∝ h²). For a 2:1 rectangle, tall vs flat changes I by ~4× and S by ~2×. Key insight: depth in the load direction dominates (I ∝ h³, S ∝ h²) — orient the tall dimension vertically.",
      },
      {
        prompt:
          "Extending this, why is an I-beam such an efficient shape for bending — and where is it weak?",
        rubric:
          "An I-beam concentrates material in the flanges, far from the neutral axis, maximizing I and S for a given weight. This is efficient because bending stress is greatest at the extreme fibers and ~zero at the neutral axis, so material near the center carries little bending — the thin web mainly carries SHEAR. Weaknesses: the slender web/flanges can buckle locally (web crippling, flange or lateral-torsional buckling), and the open thin-walled section is weak about the WEAK axis and in torsion. Key insight: efficiency comes from putting area at large c; the price is susceptibility to local/lateral buckling and poor torsional/weak-axis behavior.",
      },
    ],
  },

  {
    id: "concept_torsion_solid_hollow",
    slug: "concept-torsion-solid-vs-hollow-shaft",
    title: "Solid vs Hollow Drive Shaft",
    prompt:
      "Two drive shafts use the same mass of the same steel and the same length.\n" +
      "One is a solid round shaft; the other is a hollow tube of larger outer\n" +
      "diameter but identical weight.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 28,
    tags: ["torsion", "machine-design", "conceptual"],
    skillAreas: ["machine-design", "mechanics-of-materials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Which shaft transmits more torque before the material yields, and why?",
        rubric:
          "The HOLLOW tube carries more torque for the same weight. Torsional stress is τ = T·r/J, and the polar moment of area J grows strongly with radius (J ∝ r⁴ for the outer radius). In a solid shaft the material near the center sits at small r where torsional stress and lever arm are tiny — it's nearly 'dead weight.' Moving that mass to a larger radius (a tube) places it where it resists torque most effectively, giving a much larger J per unit mass and thus higher torque capacity (and stiffness). Key insight: torque is resisted by material at large radius (τ = Tr/J, J ∝ r⁴), so a hollow shaft is more material-efficient than a solid one.",
      },
      {
        prompt:
          "What's the practical limit — can you keep making the wall thinner and the diameter larger to gain ever more capacity?",
        rubric:
          "No. As the wall becomes very thin, the tube becomes prone to local BUCKLING — the wall wrinkles/collapses under the torsional (and any compressive) stress before the material reaches its shear strength, so capacity becomes stability/geometry-limited rather than strength-limited. There are also stiffness, manufacturing, and packaging limits, plus a sensible diameter-to-thickness ratio. So an optimum wall thickness exists. Key insight: thin-walled efficiency is capped by buckling/instability — past a point, thinner walls fail by collapse, not yield.",
      },
    ],
  },

  {
    id: "concept_pressure_vessel_hoop",
    slug: "concept-pressure-vessel-hoop-stress",
    title: "Where a Pressure Vessel Splits",
    prompt:
      "A long, thin-walled cylindrical tank (like a propane cylinder) is\n" +
      "pressurized internally.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["pressure-vessel", "hoop-stress", "conceptual"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "There are two main wall stresses — name them, say which is larger and why, and predict where the tank tends to split.",
        rubric:
          "Hoop (circumferential) stress σ_hoop = p·r/t and longitudinal (axial) stress σ_long = p·r/2t. The hoop stress is TWICE the longitudinal stress. Reason: a longitudinal cut is held by two wall thicknesses resisting pressure over the projected diameter (→ pr/t), while an axial section resists the end-cap pressure spread over the whole circumference (→ pr/2t). Because hoop stress dominates, the tank tends to split ALONG its length (a longitudinal crack), since the hoop stress pulls the wall apart circumferentially. Key insight: σ_hoop = 2·σ_long → longitudinal split is the expected failure.",
      },
      {
        prompt:
          "If you must add a weld seam, should it run lengthwise or around the circumference, and why? What end-cap shape is best?",
        rubric:
          "Place a seam where stress is lower: a CIRCUMFERENTIAL (girth) weld sees only the longitudinal stress (pr/2t), half the hoop stress, so it's preferred over a longitudinal seam (which carries the full hoop stress pr/t). If a longitudinal seam is unavoidable it must be the strongest/most-scrutinized weld. End caps: HEMISPHERICAL heads are best — a sphere carries pr/2t everywhere (half a cylinder's hoop), so hemispherical ends are stronger and lighter than flat heads, which suffer high bending stresses. Key insight: orient seams to avoid the dominant hoop stress, and use hemispherical heads to minimize cap stress.",
      },
    ],
  },

  {
    id: "concept_ductile_vs_brittle",
    slug: "concept-ductile-vs-brittle-failure",
    title: "Same Load, Different Material",
    prompt:
      "Two parts have identical geometry and carry the identical load, producing\n" +
      "the same complex (multiaxial) stress state. One is mild steel (ductile);\n" +
      "the other is grey cast iron (brittle).",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["failure-theories", "materials", "conceptual"],
    skillAreas: ["materials", "mechanics-of-materials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "How will each part fail, what will the failure look like, and why are they different?",
        rubric:
          "Ductile (mild steel) fails by SHEAR/yielding: it deforms plastically (necks down) and fails on planes of maximum shear (~45° to a uniaxial tensile load); failure is governed by distortion (von Mises / Tresca) and is preceded by visible yielding (warning). Brittle (cast iron) fails by sudden FRACTURE with little/no plastic deformation, on the plane of maximum NORMAL (tensile) stress (perpendicular to the largest principal tension), and it is much weaker in tension than compression. Key insight: ductile → shear/distortion-driven yield (von Mises); brittle → maximum-tensile-stress fracture — different failure planes and very different warning.",
      },
      {
        prompt:
          "Which failure criterion would you size each part with, and which material is riskier if the part has a sharp notch?",
        rubric:
          "Ductile: use a distortion-energy (von Mises) or max-shear (Tresca) criterion against the yield strength, with a factor of safety. Brittle: use a maximum-normal-stress (Rankine) criterion against the ultimate tensile strength (and exploit the much higher compressive strength). The BRITTLE part is far riskier with a sharp notch: it cannot yield locally to redistribute the stress concentration, so the peak drives straight to fracture (notch-sensitive). The ductile part yields locally at the notch, blunting the peak and tolerating it. Key insight: match the criterion to the failure mode; brittle materials are notch-sensitive because they can't relieve concentrations by yielding.",
      },
    ],
  },
];
