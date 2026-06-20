import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION:
  // Two immiscible layers stacked above the gauge point. Gauge pressure at the bottom is the
  // sum of each layer's contribution (lighter fluid sits on top): P = Σ ρ_i·g·h_i.
  // Oil layer: ρ=880, h=2.0 m → 880·9.81·2.0 = 17,265.6 Pa
  // Water layer: ρ=1000, h=6.0 m → 1000·9.81·6.0 = 58,860 Pa
  // P_gauge = 17,265.6 + 58,860 = 76,125.6 Pa = 76.1 kPa.
  {
    id: "fm_hydrostatic_pressure",
    slug: "fluids-hydrostatic-pressure-tank",
    title: "Stratified storage tank: pressure at the floor",
    prompt:
      "During commissioning of a chemical storage tank, a 2.0 m layer of process oil (relative density 0.88) is found floating on top of a 6.0 m column of water that drains to the tank floor. The tank is vented to atmosphere.\n\nA pressure transmitter mounted flush with the tank floor reads gauge pressure. Determine what it should indicate.\n\nUse g = 9.81 m/s² and ρ_water = 1000 kg/m³. Report the gauge pressure in kPa to the nearest 0.1 kPa.",
    discipline: "MECHANICAL",
    difficulty: "EASY",
    eloWeight: 14,
    tags: ["hydrostatics", "pressure", "layered-fluids"],
    skillAreas: ["fluid-mechanics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 76.1,
    tolerance: 0.8,
    unit: "kPa",
    hints: [
      "Gauge pressure ignores the atmosphere on the free surface, so start the count from the top liquid surface (P = 0 gauge there) and accumulate downward.",
      "With two stacked immiscible layers, the floor pressure is the sum of each layer's own ρ·g·h — the layers do not mix, so use each layer's density over its own depth.",
      "Convert the oil's relative density to a density (0.88 × 1000 kg/m³) before applying ρ·g·h, then add the water contribution.",
      "Add the two contributions in Pa and divide by 1000 to report kPa.",
    ],
    solution:
      "**Governing principle — hydrostatics.** In a static fluid, gauge pressure increases linearly with depth as $P = \\rho g h$. With two immiscible layers stacked (lighter oil floating on water), the pressure contributions simply add as you descend: $P = \\sum_i \\rho_i g h_i$. We start from the vented free surface where $P = 0$ gauge.\n\n" +
      "**Step 1 — Convert the oil's relative density to a density:**\n" +
      "$$\\rho_{oil} = 0.88 \\times 1000 = 880 \\text{ kg/m}^3$$\n\n" +
      "**Step 2 — Pressure added by the oil layer** ($h = 2.0$ m):\n" +
      "$$P_{oil} = \\rho_{oil}\\, g\\, h_{oil} = 880 \\times 9.81 \\times 2.0 = 17{,}265.6 \\text{ Pa}$$\n\n" +
      "**Step 3 — Pressure added by the water layer** ($h = 6.0$ m):\n" +
      "$$P_{water} = 1000 \\times 9.81 \\times 6.0 = 58{,}860 \\text{ Pa}$$\n\n" +
      "**Step 4 — Sum at the floor:**\n" +
      "$$P_{gauge} = 17{,}265.6 + 58{,}860 = 76{,}125.6 \\text{ Pa} = 76.1 \\text{ kPa}$$\n\n" +
      "**Key insight / trap:** Because the layers are immiscible, each contributes $\\rho g h$ over *its own* depth — do not blend densities. And because the transmitter reads *gauge* pressure with a vented tank, atmospheric pressure cancels (it acts on the free surface and on the transmitter reference), so you never add $P_{atm}$.\n\n" +
      "**Final answer: $P_{gauge} \\approx 76.1$ kPa.**",
  },
  // SOLUTION:
  // Floating-body equilibrium: weight = buoyancy in BOTH fluids, so the displaced fluid mass
  // equals the body mass in each case. From flotation in water: ρ_body = f_water·ρ_water,
  // with f_water = 0.80 → ρ_body = 0.80·1000 = 800 kg/m³ (g and total volume cancel).
  // In oil: f_oil = ρ_body/ρ_oil = 800/850 = 0.9412 → 94.1% submerged.
  {
    id: "fm_buoyancy_cube",
    slug: "fluids-buoyancy-submerged-cube",
    title: "Re-floating a block in a different liquid",
    prompt:
      "A solid polymer block floats at rest in fresh water (ρ = 1000 kg/m³) with exactly 80% of its volume below the surface. The same block is then transferred and allowed to float freely in a tank of light crude oil (ρ = 850 kg/m³).\n\nDetermine the percentage of the block's volume that is submerged once it reaches equilibrium in the oil.\n\nReport the answer as a percentage to the nearest 0.1%.",
    discipline: "MECHANICAL",
    difficulty: "EXPERT",
    eloWeight: 34,
    tags: ["buoyancy", "flotation", "archimedes"],
    skillAreas: ["fluid-mechanics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 94.1,
    tolerance: 0.8,
    unit: "%",
    hints: [
      "For free flotation, weight equals buoyant force in BOTH liquids — the block's mass never changes, so the displaced fluid mass is the same in each case.",
      "Use the water case to back out the block's density: the submerged fraction equals the ratio of body density to fluid density (g and total volume cancel).",
      "Once you have ρ_body, the submerged fraction in oil is ρ_body / ρ_oil — denser fluid means less submerged, lighter fluid means more.",
      "A block of density 800 floating in oil of density 850 should sit deeper than in water (over 80% submerged); express the fraction as a percentage.",
    ],
    solution:
      "**Governing principle — Archimedes / floating-body equilibrium.** A freely floating body is in equilibrium when its weight equals the buoyant force: $W = F_B$. Since $W = \\rho_{body} g V_{total}$ and $F_B = \\rho_{fluid} g V_{sub}$, the submerged *fraction* is\n" +
      "$$\\frac{V_{sub}}{V_{total}} = \\frac{\\rho_{body}}{\\rho_{fluid}}.$$\n" +
      "Crucially, $g$ and $V_{total}$ cancel, and the body's mass never changes between fluids.\n\n" +
      "**Step 1 — Back out the body density from the water case.** Given 80% submerged in water:\n" +
      "$$0.80 = \\frac{\\rho_{body}}{\\rho_{water}} \\;\\Rightarrow\\; \\rho_{body} = 0.80 \\times 1000 = 800 \\text{ kg/m}^3$$\n\n" +
      "**Step 2 — Apply the same relation in oil** ($\\rho_{oil} = 850$ kg/m³):\n" +
      "$$\\frac{V_{sub}}{V_{total}} = \\frac{\\rho_{body}}{\\rho_{oil}} = \\frac{800}{850} = 0.9412$$\n\n" +
      "**Step 3 — Express as a percentage:** $0.9412 \\times 100 = 94.1\\%$.\n\n" +
      "**Key insight / trap:** The submerged fraction depends only on the density *ratio*. Oil ($850$) is less dense than water ($1000$), so the block must displace a larger *volume* to generate the same buoyant force — it sits deeper. A common mistake is to expect *less* submergence in oil; the physics goes the other way for a less-dense fluid.\n\n" +
      "**Final answer: $\\approx 94.1\\%$ submerged.**",
  },
  // SOLUTION:
  // Conservation of mass on a tee with one inlet and two outlets (incompressible): Q1 = Q2 + Q3.
  // Q = (π/4)·D²·V.
  // Inlet: Q1 = (π/4)(0.20²)(3.0) = (π/4)(0.04)(3.0) = 0.094248 m³/s
  // Branch 2: Q2 = (π/4)(0.10²)(4.0) = (π/4)(0.01)(4.0) = 0.031416 m³/s
  // Branch 3: Q3 = Q1 − Q2 = 0.062832 m³/s
  // A3 = (π/4)(0.08²) = 0.0050265 m² → V3 = 0.062832 / 0.0050265 = 12.50 m/s.
  {
    id: "fm_continuity_nozzle",
    slug: "fluids-continuity-nozzle-velocity",
    title: "Mass balance across a branching manifold",
    prompt:
      "Cooling water enters a tee manifold through a 200 mm diameter header at 3.0 m/s. The flow splits into two delivery lines. One line is 100 mm in diameter and carries water at 4.0 m/s; the other line is 80 mm in diameter.\n\nTreating the water as incompressible and steady, determine the average velocity in the 80 mm line.\n\nReport the answer in m/s to the nearest 0.1 m/s.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 21,
    tags: ["continuity", "mass-conservation", "manifold"],
    skillAreas: ["fluid-mechanics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 12.5,
    tolerance: 0.2,
    unit: "m/s",
    hints: [
      "Incompressible steady flow conserves volumetric flow: what enters the header must leave through the two branches (Q_in = Q_1 + Q_2).",
      "Each Q = A·V with A = (π/4)·D², so convert all three velocities/diameters into flow rates before balancing.",
      "Solve for the unknown branch flow Q_3 = Q_header − Q_known, then divide by the 80 mm area to recover its velocity.",
      "Watch the diameter-squared dependence: the smaller bore must run faster to pass the leftover flow.",
    ],
    solution:
      "**Governing principle — conservation of mass (continuity).** For steady, incompressible flow through a tee with one inlet and two outlets, volumetric flow is conserved: $Q_1 = Q_2 + Q_3$, with $Q = A V = \\frac{\\pi}{4} D^2 V$.\n\n" +
      "**Step 1 — Inlet flow** ($D_1 = 0.20$ m, $V_1 = 3.0$ m/s):\n" +
      "$$Q_1 = \\frac{\\pi}{4}(0.20)^2(3.0) = \\frac{\\pi}{4}(0.04)(3.0) = 0.094248 \\text{ m}^3/\\text{s}$$\n\n" +
      "**Step 2 — Known branch flow** ($D_2 = 0.10$ m, $V_2 = 4.0$ m/s):\n" +
      "$$Q_2 = \\frac{\\pi}{4}(0.10)^2(4.0) = \\frac{\\pi}{4}(0.01)(4.0) = 0.031416 \\text{ m}^3/\\text{s}$$\n\n" +
      "**Step 3 — Solve continuity for the unknown branch:**\n" +
      "$$Q_3 = Q_1 - Q_2 = 0.094248 - 0.031416 = 0.062832 \\text{ m}^3/\\text{s}$$\n\n" +
      "**Step 4 — Recover the velocity** using the 80 mm area, $A_3 = \\frac{\\pi}{4}(0.08)^2 = 5.0265\\times10^{-3}$ m²:\n" +
      "$$V_3 = \\frac{Q_3}{A_3} = \\frac{0.062832}{5.0265\\times10^{-3}} = 12.50 \\text{ m/s}$$\n\n" +
      "**Key insight / trap:** Velocities do *not* add — flows ($Q = AV$) do. Because area scales with $D^2$, the smaller 80 mm bore must run much faster than the inlet to carry the leftover flow.\n\n" +
      "**Final answer: $V_3 \\approx 12.5$ m/s.**",
  },
  // SOLUTION:
  // Decide the flow regime, which requires computing Re first and comparing to the transition
  // band (laminar Re < ~2300, transitional ~2300–4000, turbulent > ~4000).
  // Re = ρVD/µ = (900·0.8·0.04)/0.40 = 28.8/0.40 = 72.
  // Re = 72 ≪ 2300 → deep laminar regime; for design, f = 64/Re (Hagen–Poiseuille), NOT a Moody/turbulent correlation.
  {
    id: "fm_reynolds_oil",
    slug: "fluids-reynolds-number-oil-pipe",
    title: "Lubrication line: which flow regime governs?",
    prompt:
      "A lubrication gallery carries heavy oil (ρ = 900 kg/m³, dynamic viscosity µ = 0.40 Pa·s) at a mean velocity of 0.80 m/s through a 40 mm bore.\n\nA junior engineer wants to estimate the friction factor and is unsure whether to read a turbulent value off the Moody chart or use a laminar formula. Based on the flow physics, which statement is correct?",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["reynolds", "laminar-turbulent", "regime"],
    skillAreas: ["fluid-mechanics"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label: "Re ≈ 72, so the flow is laminar and f = 64/Re ≈ 0.89 should be used.",
        correct: true,
      },
      {
        id: "b",
        label: "Re ≈ 1800, so the flow is laminar and f = 64/Re ≈ 0.036 should be used.",
      },
      {
        id: "c",
        label: "Re ≈ 7.2 × 10⁴, so the flow is turbulent and the Moody chart applies.",
      },
      {
        id: "d",
        label: "Re ≈ 2900, so the flow is transitional and the friction factor is undefined.",
      },
    ],
    hints: [
      "The regime is set by the Reynolds number Re = ρVD/µ — compute it before deciding which friction-factor tool applies.",
      "Heavy oil has a very high viscosity, so expect a small Re; compare your value against the laminar threshold (~2300) and the turbulent threshold (~4000).",
      "If Re falls well below 2300, the Moody chart is unnecessary — the laminar law f = 64/Re applies exactly. Plug in your Re to see how large f becomes.",
    ],
    solution:
      "**Governing principle — the Reynolds number sets the regime.** Whether you use a turbulent (Moody/Colebrook) friction factor or the laminar law $f = 64/Re$ depends entirely on $Re = \\dfrac{\\rho V D}{\\mu}$. Thresholds: laminar for $Re < \\sim2300$, transitional $\\sim2300$–$4000$, turbulent above $\\sim4000$.\n\n" +
      "**Step 1 — Compute the Reynolds number** ($\\rho = 900$, $V = 0.80$, $D = 0.040$, $\\mu = 0.40$ Pa·s):\n" +
      "$$Re = \\frac{\\rho V D}{\\mu} = \\frac{900 \\times 0.80 \\times 0.040}{0.40} = \\frac{28.8}{0.40} = 72$$\n\n" +
      "**Step 2 — Classify the regime.** $Re = 72 \\ll 2300$, so the flow is deeply laminar. The Moody chart is unnecessary.\n\n" +
      "**Step 3 — Pick the friction factor.** For laminar pipe flow the friction factor is exact:\n" +
      "$$f = \\frac{64}{Re} = \\frac{64}{72} = 0.89$$\n\n" +
      "**Why the distractors fail:**\n" +
      "- **(b)** $Re \\approx 1800$: misplaces a factor (e.g., wrong $\\mu$ exponent); $f = 64/1800 = 0.036$ is the friction of a *much* less viscous flow.\n" +
      "- **(c)** $Re \\approx 7.2\\times10^4$: this is the value if you forgot the viscosity is $0.40$ Pa·s (using water-like $\\mu \\approx 10^{-3}$). Heavy oil is ~400× more viscous, killing $Re$.\n" +
      "- **(d)** $Re \\approx 2900$: wrong magnitude entirely, and the friction factor is never truly 'undefined' — even transitional flow has usable correlations.\n\n" +
      "**Key insight / trap:** Always compute $Re$ *before* reaching for a chart. A high viscosity drives $Re$ down dramatically, forcing the laminar branch where $f$ can be far larger than typical turbulent values.\n\n" +
      "**Final answer: (a) — $Re \\approx 72$, laminar, $f = 64/Re \\approx 0.89$.**",
  },
  // SOLUTION:
  // Highly viscous, low-speed flow → suspect laminar, so use Hagen–Poiseuille:
  // Q = π·ΔP·D⁴ / (128·µ·L).
  // D⁴ = (0.020)⁴ = 1.6e-7 m⁴; ΔP = 300,000 Pa.
  // Numerator = π·300000·1.6e-7 = 0.150796
  // Denominator = 128·1.5·10 = 1920
  // Q = 0.150796 / 1920 = 7.854e-5 m³/s.
  // Check regime: V = Q/A = 7.854e-5 / [(π/4)(0.02²)=3.1416e-4] = 0.250 m/s;
  // Re = ρVD/µ = 1260·0.250·0.020/1.5 = 4.2 ≪ 2300 → laminar assumption valid.
  {
    id: "fm_laminar_friction_factor",
    slug: "fluids-laminar-friction-factor",
    title: "Glycerin metering line flow rate",
    prompt:
      "Glycerin (ρ = 1260 kg/m³, dynamic viscosity µ = 1.5 Pa·s) is pushed through a straight 20 mm diameter, 10 m long horizontal capillary line. The measured pressure drop end-to-end is 300 kPa.\n\nDetermine the volumetric flow rate the line delivers. Choose your analysis method based on the expected flow regime, and confirm the regime is consistent with that choice.\n\nReport the flow rate in m³/s, using scientific notation to 3 significant figures.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["hagen-poiseuille", "laminar", "viscous-flow"],
    skillAreas: ["fluid-mechanics", "hydraulics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 7.85e-5,
    tolerance: 1.5e-6,
    unit: "m³/s",
    hints: [
      "A thick fluid moving slowly through a small bore strongly suggests laminar flow; that choice unlocks an exact closed-form law instead of the Darcy/Moody route.",
      "For fully developed laminar pipe flow, Hagen–Poiseuille gives Q = π·ΔP·D⁴ / (128·µ·L) — note the fourth-power dependence on diameter.",
      "After computing Q, verify the assumption: back out V = Q/A and check Re = ρVD/µ is well below 2300, otherwise the laminar law is invalid.",
      "Keep ΔP in pascals (300 kPa = 300,000 Pa) and report Q in scientific notation to 3 sig figs.",
    ],
    solution:
      "**Governing principle — Hagen–Poiseuille (fully developed laminar flow).** A thick fluid creeping through a small bore signals laminar flow, for which the flow rate has an exact closed form:\n" +
      "$$Q = \\frac{\\pi\\, \\Delta P\\, D^4}{128\\, \\mu\\, L}.$$\n" +
      "Note the powerful $D^4$ dependence. We will assume laminar, solve, then *verify*.\n\n" +
      "**Step 1 — Gather quantities in SI:** $\\Delta P = 300$ kPa $= 300{,}000$ Pa, $D = 0.020$ m, $L = 10$ m, $\\mu = 1.5$ Pa·s.\n\n" +
      "**Step 2 — Evaluate $D^4$:** $(0.020)^4 = 1.6\\times10^{-7}$ m⁴.\n\n" +
      "**Step 3 — Numerator and denominator:**\n" +
      "$$\\text{num} = \\pi \\times 300{,}000 \\times 1.6\\times10^{-7} = 0.150796$$\n" +
      "$$\\text{den} = 128 \\times 1.5 \\times 10 = 1920$$\n\n" +
      "**Step 4 — Flow rate:**\n" +
      "$$Q = \\frac{0.150796}{1920} = 7.854\\times10^{-5} \\text{ m}^3/\\text{s}$$\n\n" +
      "**Step 5 — Verify the laminar assumption.** Velocity $V = Q/A$ with $A = \\frac{\\pi}{4}(0.020)^2 = 3.1416\\times10^{-4}$ m²:\n" +
      "$$V = \\frac{7.854\\times10^{-5}}{3.1416\\times10^{-4}} = 0.250 \\text{ m/s}$$\n" +
      "$$Re = \\frac{\\rho V D}{\\mu} = \\frac{1260 \\times 0.250 \\times 0.020}{1.5} = 4.2 \\ll 2300 \\;\\checkmark$$\n" +
      "Deeply laminar, so Hagen–Poiseuille was the right tool.\n\n" +
      "**Key insight / trap:** Do *not* default to Darcy–Weisbach with a Moody $f$ here — that route is for turbulent/general flow and is unnecessary work when an exact laminar law applies. Always confirm $Re$ afterward; if it had exceeded 2300 the answer would be invalid.\n\n" +
      "**Final answer: $Q \\approx 7.85\\times10^{-5}$ m³/s.**",
  },
  // SOLUTION:
  // Full chain: properties → Re → regime → friction factor → Darcy–Weisbach head loss.
  // Water at ~20°C: ρ = 998 kg/m³, µ = 1.0e-3 Pa·s. Smooth drawn tubing.
  // Re = ρVD/µ = 998·2.0·0.05 / 1.0e-3 = 99,800 → turbulent (>4000).
  // Smooth pipe → Blasius: f = 0.316/Re^0.25 = 0.316 / (99800^0.25 = 17.77) = 0.01778.
  // hL = f·(L/D)·V²/(2g) = 0.01778·(100/0.05)·(2.0²)/(2·9.81)
  //    = 0.01778·2000·(4/19.62) = 0.01778·2000·0.20387 = 7.25 m.
  // (Colebrook/Moody for a smooth pipe gives f ≈ 0.0180 → hL ≈ 7.3 m; within tolerance.)
  {
    id: "fm_darcy_head_loss",
    slug: "fluids-darcy-weisbach-head-loss",
    title: "Friction head loss in a transfer line",
    prompt:
      "Water at 20 °C flows at 2.0 m/s through 100 m of smooth, straight drawn-copper tubing of 50 mm internal diameter. Take ρ = 998 kg/m³ and µ = 1.0 × 10⁻³ Pa·s.\n\nDetermine the frictional head loss over this run. You must first establish the flow regime and select an appropriate friction-factor relation before applying the head-loss equation; neglect minor losses.\n\nReport the head loss in meters of water to the nearest 0.1 m.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 32,
    tags: ["darcy-weisbach", "friction-factor", "turbulent", "head-loss"],
    skillAreas: ["fluid-mechanics", "hydraulics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 7.25,
    tolerance: 0.45,
    unit: "m",
    hints: [
      "Start with the regime: compute Re = ρVD/µ and confirm it exceeds ~4000 so a turbulent friction correlation is appropriate.",
      "Because the tubing is smooth (negligible roughness), a smooth-pipe correlation such as Blasius f = 0.316/Re^0.25 is suitable; a full Colebrook/Moody read for a smooth pipe gives a very similar f.",
      "Apply Darcy–Weisbach: h_L = f·(L/D)·V²/(2g). Keep L and D in consistent units (the L/D ratio is dimensionless).",
      "Evaluate V²/(2g) once and reuse it; the answer should come out a few meters of water.",
    ],
    solution:
      "**Governing principle — Darcy–Weisbach with a regime-appropriate friction factor.** Frictional head loss is $h_L = f\\,\\dfrac{L}{D}\\,\\dfrac{V^2}{2g}$, but $f$ depends on the flow regime, which we set with the Reynolds number first.\n\n" +
      "**Step 1 — Reynolds number** ($\\rho = 998$, $V = 2.0$, $D = 0.05$, $\\mu = 1.0\\times10^{-3}$):\n" +
      "$$Re = \\frac{\\rho V D}{\\mu} = \\frac{998 \\times 2.0 \\times 0.05}{1.0\\times10^{-3}} = 99{,}800$$\n" +
      "$Re \\approx 1.0\\times10^5 > 4000$, so the flow is **turbulent**.\n\n" +
      "**Step 2 — Choose a friction factor for smooth tubing (Blasius):**\n" +
      "$$f = \\frac{0.316}{Re^{0.25}} = \\frac{0.316}{(99{,}800)^{0.25}} = \\frac{0.316}{17.77} = 0.01778$$\n" +
      "(A smooth-pipe Colebrook/Moody read gives $f \\approx 0.018$, essentially the same.)\n\n" +
      "**Step 3 — Velocity head:**\n" +
      "$$\\frac{V^2}{2g} = \\frac{(2.0)^2}{2 \\times 9.81} = \\frac{4}{19.62} = 0.20387 \\text{ m}$$\n\n" +
      "**Step 4 — Darcy–Weisbach** ($L/D = 100/0.05 = 2000$):\n" +
      "$$h_L = f\\,\\frac{L}{D}\\,\\frac{V^2}{2g} = 0.01778 \\times 2000 \\times 0.20387 = 7.25 \\text{ m}$$\n\n" +
      "**Key insight / trap:** Don't blindly use $f = 64/Re$ here — that laminar law applies only below $Re \\approx 2300$, and at $Re \\approx 10^5$ it would massively overstate friction. Because the tubing is smooth, Blasius is valid; for rough pipe you'd need the full Colebrook equation with relative roughness.\n\n" +
      "**Final answer: $h_L \\approx 7.25$ m of water.**",
  },
  // SOLUTION:
  // Energy equation gives total head the pump must supply: H = static lift + friction head.
  // H = 18 + 6 = 24 m.
  // Useful (hydraulic) power = ρgQH = 1000·9.81·0.04·24 = 9417.6 W.
  // Shaft/input power accounts for pump efficiency: P_shaft = ρgQH / η = 9417.6 / 0.70
  //   = 13,453.7 W ≈ 13.45 kW.
  {
    id: "fm_pump_power",
    slug: "fluids-pump-hydraulic-power",
    title: "Sizing the motor for a transfer pump",
    prompt:
      "A centrifugal pump must move water (ρ = 1000 kg/m³) at 0.040 m³/s from a lower reservoir to a tank whose free surface is 18 m above the pump. Both reservoirs are open to atmosphere. At this flow rate the piping system imposes a total friction head loss of 6.0 m.\n\nThe pump has an overall efficiency of 70%. Determine the shaft power that must be delivered to the pump to sustain this duty.\n\nUse g = 9.81 m/s². Report the power in kW to the nearest 0.1 kW.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 31,
    tags: ["pump", "energy-equation", "efficiency", "power"],
    skillAreas: ["fluid-mechanics", "hydraulics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 13.45,
    tolerance: 0.2,
    unit: "kW",
    hints: [
      "The pump must supply the total dynamic head: the static elevation lift PLUS the friction head loss the system imposes at this flow.",
      "Hydraulic (useful) power delivered to the fluid is P_hyd = ρ·g·Q·H — this is the power before accounting for pump losses.",
      "Efficiency relates output to input: shaft power = hydraulic power / η, so the motor must deliver MORE than the hydraulic power.",
      "Both reservoirs are open to atmosphere and velocities are negligible, so pressure and kinetic terms drop out — only elevation and friction head remain. Report in kW.",
    ],
    solution:
      "**Governing principle — the extended (mechanical-energy) equation.** Between two open, quiescent reservoir surfaces, pressure and kinetic terms cancel, so the pump head must supply the static lift plus the friction losses: $H = \\Delta z + h_L$.\n\n" +
      "**Step 1 — Total dynamic head:**\n" +
      "$$H = \\Delta z + h_L = 18 + 6.0 = 24 \\text{ m}$$\n\n" +
      "**Step 2 — Hydraulic (useful) power delivered to the fluid:**\n" +
      "$$P_{hyd} = \\rho g Q H = 1000 \\times 9.81 \\times 0.040 \\times 24 = 9417.6 \\text{ W}$$\n\n" +
      "**Step 3 — Account for pump efficiency to get shaft power:**\n" +
      "$$P_{shaft} = \\frac{P_{hyd}}{\\eta} = \\frac{9417.6}{0.70} = 13{,}453.7 \\text{ W} \\approx 13.45 \\text{ kW}$$\n\n" +
      "**Key insight / trap:** Two traps. (1) The pump must overcome friction *in addition* to the elevation — using $\\Delta z$ alone ($H = 18$ m) underestimates the duty. (2) Efficiency *divides* the hydraulic power: the shaft (input) power is always *larger* than the useful (output) power, never smaller. Multiplying by $\\eta$ instead would give the wrong direction.\n\n" +
      "**Final answer: $P_{shaft} \\approx 13.45$ kW.**",
  },
  // SOLUTION:
  // Venturi flow measurement combines continuity + Bernoulli, corrected by a discharge coefficient.
  // Mercury manometer deflection gives the pressure difference between throat and inlet taps:
  // ΔP = (ρ_Hg − ρ_w)·g·h = (13600 − 1000)·9.81·0.20 = 12600·9.81·0.20 = 24,721 Pa.
  // β = D2/D1 = 0.05/0.10 = 0.5 → β⁴ = 0.0625; A2 = (π/4)(0.05²) = 1.9635e-3 m².
  // Q = Cd·A2·√[ 2ΔP / (ρ_w·(1 − β⁴)) ]
  //   = 0.98·1.9635e-3·√[ 2·24721 / (1000·0.9375) ]
  //   = 0.98·1.9635e-3·√(52.74) = 0.98·1.9635e-3·7.262 = 0.01397 m³/s.
  {
    id: "fm_mach_compressibility",
    slug: "fluids-mach-compressibility-threshold",
    title: "Reading flow from a venturi meter",
    prompt:
      "A horizontal venturi meter (inlet 100 mm, throat 50 mm) is installed in a water line (ρ = 1000 kg/m³). A mercury (ρ = 13 600 kg/m³) differential manometer connected across the inlet and throat taps shows a steady deflection of 200 mm.\n\nThe meter's discharge coefficient is 0.98. Determine the volumetric flow rate through the line.\n\nUse g = 9.81 m/s². Report the flow rate in m³/s to 3 significant figures.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 33,
    tags: ["venturi", "flow-measurement", "bernoulli", "manometer"],
    skillAreas: ["fluid-mechanics", "hydraulics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.014,
    tolerance: 0.0004,
    unit: "m³/s",
    hints: [
      "First convert the manometer reading into a pressure difference: with a heavier manometer fluid over a lighter flowing fluid, ΔP = (ρ_Hg − ρ_water)·g·h.",
      "Combine continuity and Bernoulli for the converging section; the result is Q = Cd·A_throat·√[ 2ΔP / (ρ·(1 − β⁴)) ], where β is the throat-to-inlet diameter ratio.",
      "Compute β = D_throat/D_inlet and the (1 − β⁴) correction — neglecting it would overstate the flow. Use the THROAT area in the formula.",
      "Subtract the water density (not just use mercury) when forming ΔP, then report Q to 3 sig figs.",
    ],
    solution:
      "**Governing principle — venturi metering (continuity + Bernoulli + a discharge coefficient).** A converging throat accelerates the flow, dropping the pressure; combining continuity and Bernoulli with a correction $C_d$ for real losses gives\n" +
      "$$Q = C_d\\, A_2 \\sqrt{\\frac{2\\,\\Delta P}{\\rho\\,(1 - \\beta^4)}},\\qquad \\beta = \\frac{D_2}{D_1}.$$\n\n" +
      "**Step 1 — Convert manometer deflection to $\\Delta P$.** With heavy mercury displaced by the lighter flowing water, the *net* driving density is $(\\rho_{Hg} - \\rho_w)$:\n" +
      "$$\\Delta P = (\\rho_{Hg} - \\rho_w)\\,g\\,h = (13600 - 1000)(9.81)(0.20) = 12600 \\times 9.81 \\times 0.20 = 24{,}721 \\text{ Pa}$$\n\n" +
      "**Step 2 — Geometry.** $\\beta = D_2/D_1 = 0.05/0.10 = 0.5 \\Rightarrow \\beta^4 = 0.0625$, so $1 - \\beta^4 = 0.9375$. Throat area $A_2 = \\frac{\\pi}{4}(0.05)^2 = 1.9635\\times10^{-3}$ m².\n\n" +
      "**Step 3 — Evaluate the radical:**\n" +
      "$$\\frac{2\\Delta P}{\\rho(1-\\beta^4)} = \\frac{2 \\times 24{,}721}{1000 \\times 0.9375} = \\frac{49{,}442}{937.5} = 52.74 \\Rightarrow \\sqrt{52.74} = 7.262 \\text{ m/s}$$\n\n" +
      "**Step 4 — Flow rate:**\n" +
      "$$Q = 0.98 \\times 1.9635\\times10^{-3} \\times 7.262 = 0.01397 \\text{ m}^3/\\text{s}$$\n\n" +
      "**Key insight / trap:** Two classic errors. (1) Use the *difference* $(\\rho_{Hg} - \\rho_w)$ in the manometer equation, not mercury's density alone — the water in the leads buoys the mercury. (2) The $(1 - \\beta^4)$ term and the *throat* area $A_2$ (not the inlet) are essential; dropping the correction overstates $Q$.\n\n" +
      "**Final answer: $Q \\approx 0.0140$ m³/s ($1.40\\times10^{-2}$ m³/s).**",
  },
  // SOLUTION:
  // Bernoulli is an energy statement valid only for steady, incompressible, inviscid flow along a
  // streamline WITH NO shaft work added or removed. Across a pump, shaft work is added to the fluid,
  // so the Bernoulli "constant" jumps up; in viscous/turbulent regions, mechanical energy is
  // irreversibly dissipated to heat, so it decreases downstream. The correct tool is the extended
  // energy equation: it adds a pump head term (h_p) and a head-loss term (h_L) to Bernoulli.
  // Option (a) captures both the energy-addition and the dissipation corrections — correct.
  // (b) is wrong: Bernoulli is not "exact" across a pump. (c) is wrong: viscosity/turbulence
  // dissipate energy, they do not conserve the Bernoulli constant. (d) is wrong: a pump ADDS energy.
  {
    id: "fm_bernoulli_pump_limits",
    slug: "fluids-bernoulli-pump-limitations",
    title: "Extending Bernoulli for a real piping loop",
    prompt:
      "An engineer wants to relate the conditions at a reservoir surface to the conditions at a downstream nozzle in a pumped piping loop that contains long runs of pipe and a centrifugal pump. Applying Bernoulli's equation directly between the two points gives a physically wrong result.\n\nWhich modification correctly extends Bernoulli's equation so it can be applied between these two points?",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 20,
    tags: ["bernoulli", "energy-equation", "head-loss", "pump-head"],
    skillAreas: ["fluid-mechanics"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Add a pump-head term on the upstream side (energy added) and subtract a head-loss term for friction/minor losses (energy dissipated).",
        correct: true,
      },
      {
        id: "b",
        label:
          "No modification is needed; Bernoulli is exact across a pump as long as the fluid is incompressible.",
      },
      {
        id: "c",
        label:
          "Add a head-loss term only; the pump does not change the total head because viscous flow conserves the Bernoulli constant.",
      },
      {
        id: "d",
        label:
          "Subtract a pump-head term because a pump removes mechanical energy from the fluid, and ignore friction losses.",
      },
    ],
    hints: [
      "Bernoulli assumes steady, incompressible, inviscid flow along a streamline with NO shaft work — check which of those assumptions the pumped loop violates.",
      "Two things happen between the points: a pump ADDS mechanical energy to the fluid, and friction in the long pipe runs DISSIPATES it irreversibly.",
      "The extended (mechanical-energy) equation restores validity by inserting a pump-head term and a head-loss term — match each to the correct sign (added vs. removed).",
    ],
    solution:
      "**Governing principle — Bernoulli is a *restricted* energy statement.** Bernoulli's equation $\\frac{P}{\\rho g} + \\frac{V^2}{2g} + z = \\text{const}$ holds only for steady, incompressible, inviscid flow along a streamline with **no shaft work**. The pumped loop violates two assumptions: a pump adds shaft work, and long viscous pipe runs dissipate mechanical energy to heat.\n\n" +
      "**Step 1 — Identify what changes between the points.** A pump *adds* mechanical energy (raises total head); friction and minor losses *irreversibly remove* it. Neither is captured by plain Bernoulli, which is why a direct application gives a physically wrong result.\n\n" +
      "**Step 2 — Write the extended (mechanical-energy) equation:**\n" +
      "$$\\frac{P_1}{\\rho g} + \\frac{V_1^2}{2g} + z_1 + h_p = \\frac{P_2}{\\rho g} + \\frac{V_2^2}{2g} + z_2 + h_L$$\n" +
      "with $h_p$ the pump head **added** on the upstream side and $h_L$ the head loss **subtracted** (dissipation between the points).\n\n" +
      "**Step 3 — Match the signs (option a).** Add $h_p$ (energy in), subtract $h_L$ (energy lost). That is exactly option (a).\n\n" +
      "**Why the distractors fail:**\n" +
      "- **(b)** Bernoulli is *not* exact across a pump — incompressibility alone doesn't license ignoring shaft work.\n" +
      "- **(c)** Viscosity/turbulence *dissipate* energy; they do not 'conserve the Bernoulli constant,' and the pump does change total head.\n" +
      "- **(d)** A pump *adds* energy to the fluid (head increases), so its term is positive, not negative — and friction can never be ignored in long runs.\n\n" +
      "**Key insight / trap:** Sign convention is everything: pump head is a *source* ($+h_p$), losses are a *sink* ($-h_L$). A turbine would instead *extract* head.\n\n" +
      "**Final answer: (a) — add a pump-head term (energy added) and subtract a head-loss term (energy dissipated).**",
  },
];
