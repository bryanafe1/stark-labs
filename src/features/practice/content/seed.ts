import type { PracticeProblem } from "../types";

// Original seed problems. Slugs here are referenced by lessons via `practiceSlug`
// (see src/features/lessons/content/*) — keep them stable.
export const problems: PracticeProblem[] = [
  // SOLUTION: Rectangular section I = b·h³/12 = 0.020·(0.008)³/12 = 8.533e-10 m⁴.
  // EI = 200e9·8.533e-10 = 170.67 N·m². Tip load W = m·g = 1.5·9.81 = 14.715 N.
  // Cantilever end load: δ = W·L³/(3EI) = 14.715·(0.5)³/(3·170.67)
  //   = 1.83938/512.0 = 0.003593 m = 3.59 mm.
  {
    id: "p_cantilever",
    slug: "cantilever-tip-deflection",
    title: "Sagging Sensor Arm",
    prompt:
      "A metrology probe hangs from the free end of a horizontal cantilever arm. The arm is steel (E = 200 GPa) with a solid rectangular cross-section and projects 0.5 m from a rigid clamp. The cross-section measures 20 mm in one direction and 8 mm in the other; the arm is installed with the 8 mm dimension vertical (gravity acts vertically). The probe assembly has a mass of 1.5 kg and acts as a concentrated load at the tip; the arm's own weight is negligible.\n\nDetermine the vertical deflection at the tip, in millimetres. Round to 2 decimals.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 3.59,
    tolerance: 0.05,
    unit: "mm",
    eloWeight: 22,
    tags: ["beams", "deflection", "section-properties"],
    skillAreas: ["mechanics-of-materials"],
    hints: [
      "This is an end-loaded cantilever; the tip deflection depends on the load, span, E, and the section's second moment of area I about the bending (horizontal) axis.",
      "Bending happens about the horizontal centroidal axis, so the relevant depth is the vertical dimension: I = b·h³/12 with b = width (horizontal) and h = depth (vertical). Pick which of the two given dimensions is which carefully — getting them backwards changes I by more than an order of magnitude.",
      "Convert the tip mass to a force with W = m·g, then apply δ = W·L³/(3EI). Keep everything in SI metres, then convert the final deflection to millimetres.",
    ],
    solution:
      "**Governing principle — end-loaded cantilever beam (Euler–Bernoulli bending).** " +
      "A point load at the free tip of a clamped cantilever produces the classic tip deflection " +
      "$\\delta = \\dfrac{W L^3}{3EI}$. This applies because the arm is slender, the load is " +
      "concentrated at the tip, and the base is a rigid (fixed) support — exactly the assumptions " +
      "behind this formula. Self-weight is given as negligible, so the tip load is the only term.\n" +
      "\n" +
      "**Step 1 — Identify the bending axis and pick the right dimension for I.** This is the key trap. " +
      "Gravity is vertical, so bending occurs about the *horizontal* centroidal axis, and the depth $h$ " +
      "in $I=\\dfrac{bh^3}{12}$ must be the **vertical** dimension. The arm is installed with the 8 mm " +
      "side vertical, so $h = 8\\text{ mm} = 0.008\\text{ m}$ and $b = 20\\text{ mm} = 0.020\\text{ m}$. " +
      "Swapping them would inflate $I$ by $(20/8)^3 \\approx 15\\times$.\n" +
      "\n" +
      "**Step 2 — Second moment of area.**\n" +
      "$$I = \\frac{bh^3}{12} = \\frac{0.020\\,(0.008)^3}{12} = \\frac{0.020 \\times 5.12\\times10^{-7}}{12} = 8.533\\times10^{-10}\\ \\text{m}^4$$\n" +
      "\n" +
      "**Step 3 — Flexural rigidity.**\n" +
      "$$EI = (200\\times10^{9})(8.533\\times10^{-10}) = 170.67\\ \\text{N·m}^2$$\n" +
      "\n" +
      "**Step 4 — Convert the tip mass to a force.** $W = mg = 1.5 \\times 9.81 = 14.715\\ \\text{N}$.\n" +
      "\n" +
      "**Step 5 — Apply the deflection formula** with $L = 0.5\\text{ m}$ (so $L^3 = 0.125\\ \\text{m}^3$):\n" +
      "$$\\delta = \\frac{W L^3}{3EI} = \\frac{14.715 \\times 0.125}{3 \\times 170.67} = \\frac{1.8394}{512.0} = 0.003593\\ \\text{m}$$\n" +
      "\n" +
      "**Step 6 — Convert to millimetres:** $0.003593\\text{ m} = 3.593\\text{ mm}$.\n" +
      "\n" +
      "**Final answer: ≈ 3.59 mm**",
  },
  // SOLUTION: First-order RC charge: v(t) = V(1 - e^(-t/RC)). Reach 90% ⇒ e^(-t/RC) = 0.1
  //   ⇒ t = RC·ln(10). RC = 22e3·2.2e-6 = 0.0484 s. t = 0.0484·2.3026 = 0.1114 s ≈ 111 ms.
  {
    id: "p_rc_tau",
    slug: "rc-time-constant",
    title: "When Is the Cap 'Charged Enough'?",
    prompt:
      "A reset supervisor holds a microcontroller in reset until a node in a series RC network (R = 22 kΩ, C = 2.2 µF) rises to 90% of the rail. The capacitor starts fully discharged and the rail is a clean step.\n\nRoughly how long is the reset asserted?",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      { id: "a", label: "≈ 48 ms (one time constant)" },
      { id: "b", label: "≈ 111 ms", correct: true },
      { id: "c", label: "≈ 22 ms" },
      { id: "d", label: "≈ 230 ms" },
    ],
    eloWeight: 20,
    tags: ["circuits", "transients", "rc"],
    skillAreas: ["circuits"],
    hints: [
      "A capacitor charging through a resistor toward a step rail follows a single-exponential approach to its final value; the time constant sets the pace.",
      "Solve for the time at which the capacitor reaches a given fraction of the final voltage. Reaching 90% means the remaining gap is 10% of the rail, which fixes the exponential term.",
      "The fraction of a time constant needed is the natural log of (1 / fraction-remaining), i.e. ln(10) ≈ 2.3 time constants. Compute RC first, then scale.",
    ],
    solution:
      "**Governing principle — first-order RC charging transient.** A capacitor charging through a " +
      "series resistor toward a step rail $V$ follows $v(t) = V\\left(1 - e^{-t/RC}\\right)$. This is the " +
      "solution of the first-order linear ODE for a single energy-storage element, valid because we have one " +
      "R and one C driven by a clean step from a discharged start.\n" +
      "\n" +
      "**Step 1 — Set the target.** We need $v(t) = 0.90\\,V$, so\n" +
      "$$0.90 = 1 - e^{-t/RC} \\quad\\Rightarrow\\quad e^{-t/RC} = 0.10.$$\n" +
      "The remaining gap to the rail is 10%.\n" +
      "\n" +
      "**Step 2 — Solve for time.** Take the natural log:\n" +
      "$$-\\frac{t}{RC} = \\ln(0.10) \\quad\\Rightarrow\\quad t = RC\\,\\ln(10) = 2.3026\\,RC.$$\n" +
      "Reaching 90% always takes about **2.3 time constants** — not one.\n" +
      "\n" +
      "**Step 3 — Compute the time constant.**\n" +
      "$$RC = (22\\times10^{3})(2.2\\times10^{-6}) = 0.0484\\ \\text{s} = 48.4\\ \\text{ms}.$$\n" +
      "\n" +
      "**Step 4 — Scale.**\n" +
      "$$t = 0.0484 \\times 2.3026 = 0.1114\\ \\text{s} \\approx 111\\ \\text{ms}.$$\n" +
      "\n" +
      "**Why the distractors fail:** *48 ms* is one time constant ($\\tau$), which only reaches 63% — too " +
      "early. *22 ms* confuses $R$'s numeric value with a time and is below even one $\\tau$. *230 ms* is " +
      "$\\approx 5\\tau$ (≈99% charge), the rule of thumb for *full* charge, not the 90% threshold asked.\n" +
      "\n" +
      "**Final answer: ≈ 111 ms (option b)**",
  },
  // SOLUTION: Q = 10 L/min = 10/60000 = 1.6667e-4 m³/s. A = π/4·(0.012)² = 1.13097e-4 m².
  //   V = Q/A = 1.4737 m/s. Re = V·D/ν = 1.4737·0.012/1.0e-6 = 17684 ≈ 1.77e4 (turbulent).
  {
    id: "p_reynolds",
    slug: "pipe-flow-regime",
    title: "Will the Cooling Loop Run Turbulent?",
    prompt:
      "A liquid-cooling loop carries 10 L/min of water (kinematic viscosity 1.0×10⁻⁶ m²/s) through a smooth tube of 12 mm internal diameter. The designer wants turbulent flow for good heat transfer. Note that the pump is rated in volumetric flow, not velocity.\n\nReport the Reynolds number in the tube. Give your answer as a plain number, rounded to the nearest hundred.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 17684,
    tolerance: 180,
    eloWeight: 24,
    tags: ["reynolds", "internal-flow", "flow-rate"],
    skillAreas: ["fluid-mechanics"],
    hints: [
      "Reynolds number for pipe flow uses mean velocity, diameter, and kinematic viscosity — but you are given volumetric flow, not velocity, so a conversion step comes first.",
      "Get mean velocity from V = Q/A, where A is the circular cross-sectional area πD²/4. Convert 10 L/min to m³/s before anything else (1 L = 1×10⁻³ m³, and divide by 60 s).",
      "With kinematic viscosity given, use Re = V·D/ν directly (no need to separate density and dynamic viscosity). Round to the nearest hundred.",
    ],
    solution:
      "**Governing principle — Reynolds number for internal pipe flow.** $Re = \\dfrac{VD}{\\nu}$ is the " +
      "ratio of inertial to viscous forces and predicts the flow regime (laminar below ~2300, turbulent " +
      "above ~4000). The trap: the pump is rated in *volumetric* flow, but $Re$ needs *mean velocity*, so " +
      "a conversion comes first.\n" +
      "\n" +
      "**Step 1 — Convert volumetric flow to SI.** $1\\text{ L} = 10^{-3}\\text{ m}^3$ and per-minute → per-second:\n" +
      "$$Q = \\frac{10\\ \\text{L/min}}{60{,}000} = 1.6667\\times10^{-4}\\ \\text{m}^3/\\text{s}.$$\n" +
      "\n" +
      "**Step 2 — Cross-sectional area** of the 12 mm bore ($D = 0.012\\text{ m}$):\n" +
      "$$A = \\frac{\\pi D^2}{4} = \\frac{\\pi (0.012)^2}{4} = 1.13097\\times10^{-4}\\ \\text{m}^2.$$\n" +
      "\n" +
      "**Step 3 — Mean velocity** from continuity $V = Q/A$:\n" +
      "$$V = \\frac{1.6667\\times10^{-4}}{1.13097\\times10^{-4}} = 1.4737\\ \\text{m/s}.$$\n" +
      "\n" +
      "**Step 4 — Reynolds number.** With $\\nu = 1.0\\times10^{-6}\\ \\text{m}^2/\\text{s}$:\n" +
      "$$Re = \\frac{VD}{\\nu} = \\frac{1.4737 \\times 0.012}{1.0\\times10^{-6}} = 17{,}684.$$\n" +
      "\n" +
      "Since $Re \\approx 1.77\\times10^4 \\gg 4000$, the loop is comfortably **turbulent** — good for heat transfer.\n" +
      "\n" +
      "**Final answer: ≈ 17,684**",
  },
  // SOLUTION: m = 12 kg ⇒ W = 117.72 N. In steady cruise L = W.
  //   C_L = W/(0.5·ρ·V²·S) = 117.72/(0.5·1.225·18²·0.8) = 117.72/158.76 = 0.74162.
  //   Induced: C_Di = C_L²/(π·e·AR) = 0.55000/(π·0.85·12) = 0.55000/32.0442 = 0.017164.
  //   D_i = 0.5·ρ·V²·S·C_Di = 158.76·0.017164 = 2.725 N ≈ 2.73 N.
  {
    id: "p_wing_tradeoff",
    slug: "high-aspect-ratio-wing",
    title: "Paying for Lift: Induced Drag in Cruise",
    prompt:
      "A fixed-wing UAV with a mass of 12 kg cruises straight and level at 18 m/s at sea level (air density 1.225 kg/m³). Its wing has 0.8 m² of reference area, an aspect ratio of 12, and an Oswald span efficiency of 0.85.\n\nEstimate the induced (lift-dependent) drag force at this cruise condition, in newtons. Round to 2 decimals.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 2.73,
    tolerance: 0.05,
    unit: "N",
    eloWeight: 32,
    tags: ["aerodynamics", "induced-drag", "cruise"],
    skillAreas: ["aerodynamics"],
    hints: [
      "In steady level flight lift balances weight, which lets you back out the cruise lift coefficient from the dynamic pressure and wing area — no need for a separate angle of attack.",
      "Induced drag has its own coefficient that grows with the square of the lift coefficient: C_Di = C_L² / (π·e·AR). Higher aspect ratio and higher span efficiency both reduce it.",
      "Once you have C_Di, convert back to a force the same way you'd get any aerodynamic force: D_i = ½·ρ·V²·S·C_Di. Watch that you reuse the same dynamic-pressure × area product. Answer in newtons.",
    ],
    solution:
      "**Governing principle — induced drag from finite-wing theory.** A finite wing trades lift for a " +
      "lift-dependent (vortex-induced) drag with coefficient $C_{D_i} = \\dfrac{C_L^2}{\\pi e\\,AR}$. We can " +
      "use it here because steady level flight pins down $C_L$ exactly (lift balances weight), so no angle " +
      "of attack is needed.\n" +
      "\n" +
      "**Step 1 — Weight = required lift.** $W = mg = 12 \\times 9.81 = 117.72\\ \\text{N}$, and in steady " +
      "cruise $L = W$.\n" +
      "\n" +
      "**Step 2 — Dynamic-pressure × area product** (compute once, reuse twice):\n" +
      "$$q S = \\tfrac{1}{2}\\rho V^2 S = 0.5 \\times 1.225 \\times 18^2 \\times 0.8 = 0.5\\times1.225\\times324\\times0.8 = 158.76\\ \\text{N}.$$\n" +
      "\n" +
      "**Step 3 — Cruise lift coefficient.**\n" +
      "$$C_L = \\frac{L}{qS} = \\frac{117.72}{158.76} = 0.7416.$$\n" +
      "\n" +
      "**Step 4 — Induced drag coefficient** with $AR = 12$, $e = 0.85$:\n" +
      "$$C_{D_i} = \\frac{C_L^2}{\\pi e\\,AR} = \\frac{(0.7416)^2}{\\pi \\times 0.85 \\times 12} = \\frac{0.5500}{32.044} = 0.017164.$$\n" +
      "\n" +
      "**Step 5 — Convert back to a force**, reusing $qS = 158.76\\text{ N}$:\n" +
      "$$D_i = qS\\,C_{D_i} = 158.76 \\times 0.017164 = 2.725\\ \\text{N}.$$\n" +
      "\n" +
      "**Key insight:** high aspect ratio and high span efficiency both shrink $C_{D_i}$ — that is exactly " +
      "why efficient cruisers run long, slender wings.\n" +
      "\n" +
      "**Final answer: ≈ 2.73 N**",
  },
  // SOLUTION: Conceptual. At a sharp re-entrant corner the elasticity solution gives a
  //   stress singularity; peak stress diverges as the mesh refines and never plateaus.
  //   The correct read is that the local peak is mesh-dependent and non-physical — judge
  //   against a fillet radius or a stress-life/energy criterion, not the peak. Answer: b.
  {
    id: "p_mesh_convergence",
    slug: "fea-mesh-convergence",
    title: "The Stress That Never Converges",
    prompt:
      "You run a linear-elastic stress analysis on a bracket. As you refine the mesh by 2× three times, displacement and nominal stresses settle to stable values, but the peak von Mises stress at a sharp internal corner climbs with every refinement and shows no sign of leveling off.\n\nWhich interpretation should you defend in design review?",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      { id: "a", label: "The solution has converged on displacements, so quote the latest peak stress as the design value." },
      { id: "b", label: "It is a geometric stress singularity at the sharp corner — the peak is mesh-dependent and non-physical; model a real fillet or use a nominal-stress criterion.", correct: true },
      { id: "c", label: "The element formulation is too stiff; switch to reduced integration and the peak will plateau." },
      { id: "d", label: "Linear-elastic theory has broken down, so the part must be re-analyzed with plasticity to get the right peak." },
    ],
    eloWeight: 24,
    tags: ["mesh", "singularity", "verification"],
    skillAreas: ["fea"],
    hints: [
      "Ask which quantities are converging and which are not. Displacements and nominal stresses stabilizing is the expected, healthy behavior; the odd one out is the local peak.",
      "Think about what linear elasticity predicts at a perfectly sharp re-entrant corner with zero radius — the theoretical stress there is unbounded, so finer mesh just resolves more of a value that has no finite limit.",
      "The fix is in the geometry and the criterion, not the solver settings: a real part has a fillet, and design checks should use nominal/structural stress or fatigue methods rather than the singular peak.",
    ],
    solution:
      "**Governing principle — stress singularities in linear elasticity.** At a perfectly sharp " +
      "re-entrant (inward) corner with zero fillet radius, the elasticity solution predicts stress that " +
      "grows without bound ($\\sigma \\to \\infty$). The local field behaves like $\\sigma \\sim r^{\\lambda-1}$ " +
      "with $\\lambda < 1$, so as $r \\to 0$ the stress diverges. This is the lens through which to read the symptom.\n" +
      "\n" +
      "**Step 1 — Diagnose what is and isn't converging.** Displacements and *nominal* stresses settling " +
      "is the healthy, expected behavior of a verified mesh. The lone non-converging quantity is the local " +
      "peak at the sharp corner — that asymmetry is the tell.\n" +
      "\n" +
      "**Step 2 — Match the symptom to theory.** A quantity that climbs with every refinement and never " +
      "plateaus is the fingerprint of a singularity: finer elements simply resolve more of a value that has " +
      "no finite limit. The peak is therefore **mesh-dependent and non-physical**.\n" +
      "\n" +
      "**Step 3 — Choose the defensible action.** Real parts have a finite fillet, and design checks must " +
      "use a nominal/structural-stress or fatigue criterion (or model an actual radius), not the singular peak. " +
      "That is **option b**.\n" +
      "\n" +
      "**Why the distractors fail:**\n" +
      "- **(a)** Displacement convergence does *not* certify the peak stress; quoting the latest peak " +
      "enshrines a value that will keep rising with refinement.\n" +
      "- **(c)** Element stiffness/integration is not the cause — reduced integration will not make a true " +
      "singularity plateau; the peak still diverges.\n" +
      "- **(d)** Plasticity caps the stress numerically but does not fix the modeling error; the singularity " +
      "is geometric (zero radius), so the result stays mesh-sensitive and the real issue (missing fillet / " +
      "wrong criterion) remains.\n" +
      "\n" +
      "**Final answer: option b — a geometric stress singularity; the peak is mesh-dependent and non-physical, so model a real fillet or use a nominal-stress criterion.**",
  },
  // SOLUTION: Solid round bar: I = π·d⁴/64 = π·(0.06)⁴/64 = π·2.025e-7 = 6.3617e-7 m⁴.
  //   Fixed-free column ⇒ effective length factor K = 2.0, so Le = K·L = 2.0·2.5 = 5.0 m.
  //   Pcr = π²·E·I/Le² = π²·200e9·6.3617e-7/(5.0)² = 1.25582e6/25 = 50233 N ≈ 50 kN.
  {
    id: "p_column_buckling",
    slug: "euler-buckling-load",
    title: "Buckling of a Flagpole-Style Strut",
    prompt:
      "A vertical strut is built rigidly into a foundation at its base and is completely free at the top (a flagpole boundary condition). It is a solid round steel bar, 60 mm in diameter and 2.5 m long, with E = 200 GPa. Loading is a vertical compressive force applied axially at the free top.\n\nUsing elastic stability theory, estimate the critical load at which the strut buckles, in kilonewtons. Round to the nearest kN.",
    discipline: "CIVIL",
    difficulty: "HARD",
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 50,
    tolerance: 1,
    unit: "kN",
    eloWeight: 28,
    tags: ["buckling", "columns", "stability", "end-conditions"],
    skillAreas: ["structural-analysis", "mechanics-of-materials"],
    hints: [
      "Elastic (Euler) buckling depends on E, the section's second moment of area, and an effective length that encodes the end conditions — the raw length alone is not enough.",
      "The boundary condition is the crux here: fixed at the base, free at the top is the weakest case, with an effective-length factor K = 2 (so the effective length is twice the physical length). For a solid round bar, I = πd⁴/64.",
      "Apply Pcr = π²·E·I / (K·L)². Keep d and L in metres, then convert the force to kilonewtons. Mis-treating it as pinned-pinned (K = 1) would overestimate the capacity fourfold.",
    ],
    solution:
      "**Governing principle — Euler elastic buckling.** A slender axially-loaded column buckles at the " +
      "critical load $P_{cr} = \\dfrac{\\pi^2 EI}{(KL)^2}$, where $K$ is the effective-length factor encoding " +
      "the end conditions. We use elastic stability theory because the bar is slender and the question asks " +
      "for the elastic critical load.\n" +
      "\n" +
      "**Step 1 — Section second moment of area** for a solid round bar, $d = 0.06\\text{ m}$:\n" +
      "$$I = \\frac{\\pi d^4}{64} = \\frac{\\pi (0.06)^4}{64} = \\frac{\\pi \\times 1.296\\times10^{-5}}{64} = 6.3617\\times10^{-7}\\ \\text{m}^4.$$\n" +
      "\n" +
      "**Step 2 — Effective length from the boundary condition (the crux).** Fixed at the base, free at " +
      "the top (flagpole) is the *weakest* classic case: $K = 2.0$. So\n" +
      "$$L_e = K L = 2.0 \\times 2.5 = 5.0\\ \\text{m}.$$\n" +
      "Treating it as pinned–pinned ($K=1$) would quadruple the answer — a serious unconservative error.\n" +
      "\n" +
      "**Step 3 — Apply Euler's formula** with $E = 200\\times10^9\\ \\text{Pa}$:\n" +
      "$$P_{cr} = \\frac{\\pi^2 EI}{L_e^2} = \\frac{\\pi^2 (200\\times10^9)(6.3617\\times10^{-7})}{(5.0)^2} = \\frac{1.2558\\times10^{6}}{25} = 50{,}233\\ \\text{N}.$$\n" +
      "\n" +
      "**Step 4 — Convert to kilonewtons:** $50{,}233\\ \\text{N} \\approx 50\\ \\text{kN}.$\n" +
      "\n" +
      "**Final answer: ≈ 50 kN**",
  },
];
