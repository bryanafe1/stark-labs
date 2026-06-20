import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION:
  // Hip joint reaction during stair climbing ~ 2.5x body weight.
  // BW = m*g = 75 * 9.81 = 735.75 N -> F = 2.5 * 735.75 = 1839.4 N.
  // Solid circular stem cross-section, d = 12 mm = 0.012 m.
  // A = pi*d^2/4 = pi*(0.012)^2/4 = 1.1310e-4 m^2.
  // sigma = F/A = 1839.4 / 1.1310e-4 = 1.6264e7 Pa = 16.26 MPa.
  {
    id: "bm_bone_axial_stress",
    slug: "biomedical-bone-axial-compressive-stress",
    title: "Axial Stress in a Solid Hip-Stem Implant",
    prompt:
      "A solid titanium hip-stem implant has a circular cross-section of\n" +
      "diameter 12 mm at its narrowest load-bearing section. The patient has a\n" +
      "mass of 75 kg. Clinical biomechanics studies report that during stair\n" +
      "climbing the resultant hip joint reaction force reaches roughly 2.5 times\n" +
      "the patient's body weight, transmitted essentially axially down the stem.\n\n" +
      "Determine the peak compressive stress carried by the stem cross-section\n" +
      "under this worst-case stair-climbing load.\n\n" +
      "Use g = 9.81 m/s². Report the stress in MPa, rounded to 1 decimal place.",
    discipline: "BIOMEDICAL",
    difficulty: "INTRODUCTORY",
    eloWeight: 13,
    tags: ["bone", "implant", "biomechanics", "stress"],
    skillAreas: ["biomechanics", "mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 16.3,
    tolerance: 0.3,
    unit: "MPa",
    hints: [
      "Axial stress is the axial force divided by the cross-sectional area it acts on; the diameter is given, so the area is a circle.",
      "The load is not given directly: first turn the patient's mass into body weight (m*g), then scale it by the stated 2.5x stair-climbing factor.",
      "Compute A = pi*d^2/4 in SI units (d in meters) so sigma comes out in pascals, then convert to MPa by dividing by 1e6.",
    ],
    solution:
      "**Governing principle — uniaxial (axial) stress.** A load transmitted along the axis of a member produces a uniform normal stress $\\sigma = F/A$ over the cross-section. This applies because the joint reaction is stated to act essentially axially down the stem, so we treat the narrowest section as a column in simple compression.\n\n" +
      "**Step 1 — Convert mass to body weight.** The load is not handed to us directly; we must build it. Body weight is the gravitational force on the patient:\n" +
      "$$W = m\\,g = 75\\ \\text{kg} \\times 9.81\\ \\text{m/s}^2 = 735.75\\ \\text{N}.$$\n\n" +
      "**Step 2 — Apply the stair-climbing load factor.** Clinical data give a peak hip reaction of $2.5\\times$ body weight:\n" +
      "$$F = 2.5 \\times 735.75\\ \\text{N} = 1839.4\\ \\text{N}.$$\n\n" +
      "**Step 3 — Cross-sectional area of the solid circular stem.** With $d = 12\\ \\text{mm} = 0.012\\ \\text{m}$,\n" +
      "$$A = \\frac{\\pi d^2}{4} = \\frac{\\pi (0.012)^2}{4} = 1.131\\times10^{-4}\\ \\text{m}^2.$$\n\n" +
      "**Step 4 — Compute the stress.**\n" +
      "$$\\sigma = \\frac{F}{A} = \\frac{1839.4\\ \\text{N}}{1.131\\times10^{-4}\\ \\text{m}^2} = 1.626\\times10^{7}\\ \\text{Pa}.$$\n\n" +
      "**Step 5 — Convert to MPa.** $1\\ \\text{MPa} = 10^{6}\\ \\text{Pa}$, so $\\sigma = 16.26\\ \\text{MPa}$.\n\n" +
      "**Key insight / trap.** The trap is forgetting that the load must be derived in two stages (mass → weight → ×2.5) and that the diameter must be in meters before squaring — leaving it in millimeters inflates the area by $10^6$ and crushes the stress to a meaningless value. Keep everything in SI and convert only at the end.\n\n" +
      "**Final answer: $\\sigma \\approx 16.3\\ \\text{MPa}$.**",
  },
  // SOLUTION:
  // Forearm held horizontal, static. Pivot at elbow. Moment balance (CCW+):
  //   Fm*a = W*dW + Wf*dF
  // W (hand load) = 60 N at dW = 0.32 m; forearm weight Wf = 14 N at cg dF = 0.16 m;
  // biceps inserts at a = 0.045 m, pulls vertically.
  // Fm = (60*0.32 + 14*0.16)/0.045 = (19.2 + 2.24)/0.045 = 21.44/0.045 = 476.4 N.
  {
    id: "bm_elbow_moment_balance",
    slug: "biomedical-elbow-biceps-moment-balance",
    title: "Biceps Force Including Forearm Weight",
    prompt:
      "A subject holds the forearm horizontal and motionless while gripping a\n" +
      "60 N dumbbell. The elbow acts as the pivot. The dumbbell load acts at the\n" +
      "hand, 32 cm from the elbow. The forearm-plus-hand segment itself weighs\n" +
      "14 N, with its center of mass 16 cm from the elbow. The biceps tendon\n" +
      "inserts 4.5 cm from the elbow and pulls vertically upward.\n\n" +
      "Determine the tension the biceps must develop to keep the forearm in\n" +
      "static equilibrium. (Hint about method is intentionally NOT given; decide\n" +
      "what equilibrium condition isolates the muscle force.)\n\n" +
      "Report the biceps tension in N, rounded to the nearest whole number.",
    discipline: "BIOMEDICAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["biomechanics", "moment-balance", "statics", "lever"],
    skillAreas: ["biomechanics", "statics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 476,
    tolerance: 5,
    unit: "N",
    hints: [
      "Static equilibrium means the net moment about any point is zero; choosing the elbow as the pivot eliminates the unknown elbow joint reaction from the equation.",
      "Both the dumbbell and the forearm's own weight create clockwise moments about the elbow, while the biceps creates the counter-clockwise moment that balances them.",
      "Sum the two resisting moments (force x its lever arm) and divide by the biceps insertion distance to isolate the biceps tension; keep all distances in the same units.",
    ],
    solution:
      "**Governing principle — rotational static equilibrium.** For a body at rest, $\\sum M = 0$ about any point. We pick the **elbow** as the pivot because the unknown elbow joint reaction passes through that point and therefore contributes zero moment — eliminating it from the equation and isolating the biceps tension. This is the deciding insight the prompt asks you to find for yourself.\n\n" +
      "**Step 1 — Identify the moments about the elbow.** Taking counter-clockwise (lifting) as positive:\n" +
      "- Biceps tension $F_m$ acts up at $a = 4.5\\ \\text{cm} = 0.045\\ \\text{m}$ → moment $+F_m\\,a$ (lifts the forearm).\n" +
      "- Forearm weight $W_f = 14\\ \\text{N}$ acts down at $d_F = 16\\ \\text{cm} = 0.16\\ \\text{m}$ → moment $-W_f\\,d_F$.\n" +
      "- Dumbbell $W = 60\\ \\text{N}$ acts down at $d_W = 32\\ \\text{cm} = 0.32\\ \\text{m}$ → moment $-W\\,d_W$.\n\n" +
      "**Step 2 — Write the moment balance.**\n" +
      "$$F_m\\,a - W\\,d_W - W_f\\,d_F = 0 \\;\\Rightarrow\\; F_m\\,a = W\\,d_W + W_f\\,d_F.$$\n\n" +
      "**Step 3 — Substitute with units.**\n" +
      "$$F_m (0.045\\ \\text{m}) = (60\\ \\text{N})(0.32\\ \\text{m}) + (14\\ \\text{N})(0.16\\ \\text{m}).$$\n\n" +
      "**Step 4 — Arithmetic.**\n" +
      "$$F_m (0.045) = 19.2 + 2.24 = 21.44\\ \\text{N·m},$$\n" +
      "$$F_m = \\frac{21.44}{0.045} = 476.4\\ \\text{N}.$$\n\n" +
      "**Key insight / trap.** The classic error is dropping the forearm's own weight (it adds $2.24\\,/\\,0.045 \\approx 50\\ \\text{N}$ of tension) or using force balance instead of moment balance — force balance would drag in the unknown joint reaction. The short biceps moment arm (4.5 cm) versus the long load arm (32 cm) is exactly why the muscle force is far larger than the loads it resists; the human elbow is a force-disadvantaged, speed-favoring third-class lever.\n\n" +
      "**Final answer: $F_m \\approx 476\\ \\text{N}$.**",
  },
  // SOLUTION:
  // Poiseuille: Q = pi*dP*r^4/(8*mu*L). With fixed dP, mu, L, Q ∝ r^4.
  // Plaque reduces lumen radius by 20% -> r_new = 0.80 r.
  // Q_new/Q_old = (0.80)^4 = 0.4096 -> flow falls to 40.96% of original.
  // Percent reduction = (1 - 0.4096)*100 = 59.04%.
  {
    id: "bm_poiseuille_flow_rate",
    slug: "biomedical-poiseuille-arterial-flow-rate",
    title: "Flow Loss from Arterial Stenosis (r⁴ Dependence)",
    prompt:
      "An atherosclerotic plaque narrows the lumen of a coronary artery so that\n" +
      "its effective radius is reduced by 20% relative to the healthy vessel.\n" +
      "Assume steady laminar flow, a rigid tube, constant blood viscosity, and\n" +
      "that the perfusion pressure drop across the segment is held the same\n" +
      "before and after the narrowing.\n\n" +
      "Determine the percentage reduction in volumetric blood flow through the\n" +
      "stenosed segment compared with the healthy vessel.\n\n" +
      "Report the percent reduction in flow (a positive number), rounded to\n" +
      "1 decimal place.",
    discipline: "BIOMEDICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["blood-flow", "poiseuille", "stenosis", "fluid-mechanics"],
    skillAreas: ["fluid-mechanics", "biomechanics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 59.0,
    tolerance: 0.6,
    unit: "%",
    hints: [
      "Recall the Hagen-Poiseuille relation for laminar flow in a rigid tube and identify which geometric term carries the radius dependence.",
      "With pressure drop, viscosity, and length all held constant, flow scales with the fourth power of radius, so a small radius change has an outsized effect.",
      "Form the ratio Q_new/Q_old = (r_new/r_old)^4 with r_new = 0.80*r_old, then the percent reduction is (1 - that ratio) x 100.",
    ],
    solution:
      "**Governing principle — the Hagen–Poiseuille law.** For steady laminar flow of a Newtonian fluid through a rigid cylindrical tube,\n" +
      "$$Q = \\frac{\\pi\\,\\Delta P\\,r^4}{8\\,\\mu\\,L}.$$\n" +
      "All the assumptions in the prompt (steady, laminar, rigid, constant viscosity, constant pressure drop) are exactly the conditions under which this law holds — which is why it is the right tool.\n\n" +
      "**Step 1 — Isolate the radius dependence.** Holding $\\Delta P$, $\\mu$, and $L$ fixed, every factor except $r^4$ is constant, so\n" +
      "$$Q \\propto r^4.$$\n" +
      "This $r^4$ term is the heart of the problem: flow is exquisitely sensitive to lumen radius.\n\n" +
      "**Step 2 — Express the narrowed radius.** A 20% reduction gives $r_{\\text{new}} = 0.80\\,r_{\\text{old}}$.\n\n" +
      "**Step 3 — Form the flow ratio.**\n" +
      "$$\\frac{Q_{\\text{new}}}{Q_{\\text{old}}} = \\left(\\frac{r_{\\text{new}}}{r_{\\text{old}}}\\right)^4 = (0.80)^4.$$\n\n" +
      "**Step 4 — Arithmetic.**\n" +
      "$$(0.80)^4 = 0.4096,$$ so the stenosed vessel passes only 40.96% of the original flow.\n\n" +
      "**Step 5 — Convert to a percent reduction.**\n" +
      "$$\\text{reduction} = (1 - 0.4096)\\times 100 = 59.04\\%.$$\n\n" +
      "**Key insight / trap.** The trap is assuming flow drops linearly with radius (which would give only 20%). Because of the fourth-power law, a modest 20% narrowing slashes flow by nearly 60% — the clinical reason even moderate-looking stenoses can be functionally severe. Note we report the *reduction*, not the remaining 41%.\n\n" +
      "**Final answer: $\\approx 59.0\\%$ reduction in flow.**",
  },
  // SOLUTION:
  // One-compartment IV bolus: k = CL/Vd = 7 (L/h) / 35 (L) = 0.20 /h.
  // t_half = ln2 / k = 0.6931 / 0.20 = 3.466 h.
  {
    id: "bm_first_order_half_life",
    slug: "biomedical-first-order-elimination-half-life",
    title: "Half-Life from Clearance and Volume of Distribution",
    prompt:
      "A drug administered as an IV bolus obeys one-compartment, first-order\n" +
      "pharmacokinetics. Population estimates for this patient give a systemic\n" +
      "clearance of 7 L/h and an apparent volume of distribution of 35 L.\n\n" +
      "From these two parameters, determine the drug's elimination half-life.\n" +
      "You must first decide how clearance and volume of distribution relate to\n" +
      "the elimination rate constant before computing the half-life.\n\n" +
      "Use ln 2 = 0.693. Report the half-life in hours, rounded to 2 decimal\n" +
      "places.",
    discipline: "BIOMEDICAL",
    difficulty: "MEDIUM",
    eloWeight: 23,
    tags: ["pharmacokinetics", "clearance", "half-life", "one-compartment"],
    skillAreas: ["signals-systems"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 3.47,
    tolerance: 0.05,
    unit: "h",
    hints: [
      "In a one-compartment model the elimination rate constant k links clearance and volume of distribution; think about how fast the distributed amount is being cleared.",
      "The relationship is k = CL/Vd, which here has units of (L/h)/(L) = per hour.",
      "Once you have k, the half-life is ln2/k; keep an eye on units so the answer is in hours.",
    ],
    solution:
      "**Governing principle — first-order, one-compartment elimination.** When the rate of drug removal is proportional to the amount present, the concentration decays as $C(t) = C_0 e^{-kt}$. Clearance ($CL$) is the volume of blood cleared of drug per unit time, and the volume of distribution ($V_d$) relates the amount in the body to its plasma concentration. The two are linked by the elimination rate constant.\n\n" +
      "**Step 1 — Relate $k$ to $CL$ and $V_d$.** By definition, clearance equals the rate constant times the volume it acts over:\n" +
      "$$CL = k\\,V_d \\;\\Rightarrow\\; k = \\frac{CL}{V_d}.$$\n\n" +
      "**Step 2 — Substitute with units.**\n" +
      "$$k = \\frac{7\\ \\text{L/h}}{35\\ \\text{L}} = 0.20\\ \\text{h}^{-1}.$$\n" +
      "The litres cancel, correctly leaving units of per-hour.\n\n" +
      "**Step 3 — Half-life from the rate constant.** For first-order decay, setting $C = \\tfrac{1}{2}C_0$ in $e^{-kt}$ gives $t_{1/2} = \\ln 2 / k$:\n" +
      "$$t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{0.20\\ \\text{h}^{-1}}.$$\n\n" +
      "**Step 4 — Arithmetic.**\n" +
      "$$t_{1/2} = 3.466\\ \\text{h}.$$\n\n" +
      "**Key insight / trap.** The trap is trying to find a half-life from $CL$ or $V_d$ alone — neither sets the decay rate by itself; only their *ratio* does. Note the inverse relationships: a larger $V_d$ (drug hides in tissues) *lengthens* half-life, while higher clearance *shortens* it. Half-life is a derived quantity, not a primary one.\n\n" +
      "**Final answer: $t_{1/2} \\approx 3.47\\ \\text{h}$.**",
  },
  // SOLUTION:
  // Instrumentation amp: CMRR(dB) = 20*log10(Ad/Acm).
  // Given CMRR = 100 dB and differential gain Ad = 1000:
  //   Ad/Acm = 10^(100/20) = 10^5 -> Acm = 1000/1e5 = 0.01.
  // Differential ECG signal Vdiff = 1 mV -> Vout_diff = Ad*Vdiff = 1000*1e-3 = 1.0 V.
  // Common-mode mains interference Vcm = 100 mV -> Vout_cm = Acm*Vcm = 0.01*0.1 = 1e-3 V = 1 mV.
  // Output SNR (desired/interference) = Vout_diff/Vout_cm = 1.0/1e-3 = 1000.
  {
    id: "bm_fick_membrane_flux",
    slug: "biomedical-instrumentation-amp-cmrr-snr",
    title: "Output Signal-to-Interference of an ECG Amplifier",
    prompt:
      "An ECG front-end uses an instrumentation amplifier with a differential\n" +
      "gain of 1000 and a common-mode rejection ratio (CMRR) of 100 dB. The true\n" +
      "cardiac (differential) signal at the electrodes is 1 mV. Simultaneously,\n" +
      "capacitively coupled 60 Hz mains interference appears as a 100 mV\n" +
      "common-mode voltage on both inputs.\n\n" +
      "At the amplifier output, determine the ratio of the amplified desired\n" +
      "signal to the residual amplified common-mode interference. You will need\n" +
      "to convert the CMRR from decibels back to a linear gain ratio, find the\n" +
      "common-mode gain, then compare the two output contributions.\n\n" +
      "Report the dimensionless output signal-to-interference ratio, rounded to\n" +
      "the nearest whole number.",
    discipline: "BIOMEDICAL",
    difficulty: "EXPERT",
    eloWeight: 36,
    tags: ["bioinstrumentation", "cmrr", "ecg", "instrumentation-amp"],
    skillAreas: ["sensors-actuators", "signals-systems", "circuits"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 1000,
    tolerance: 10,
    hints: [
      "CMRR in dB relates the differential gain to the common-mode gain; invert the dB definition to recover the linear ratio Ad/Acm.",
      "From CMRR(dB) = 20*log10(Ad/Acm), solve for Acm, then compute each output as gain times its input voltage (differential vs common-mode).",
      "The desired output is Ad*Vdiff and the interference output is Acm*Vcm; the requested ratio is their quotient, a dimensionless number.",
    ],
    solution:
      "**Governing principle — differential vs common-mode amplification.** An instrumentation amp multiplies the *differential* input by $A_d$ and the *common-mode* input by a much smaller $A_{cm}$. The common-mode rejection ratio quantifies how strongly it favors the difference signal: $\\text{CMRR} = A_d / A_{cm}$, usually quoted in decibels. The ECG (heart) signal is differential; the 60 Hz mains pickup is common-mode, so CMRR is exactly what suppresses it.\n\n" +
      "**Step 1 — Convert CMRR from dB to a linear ratio.** By definition,\n" +
      "$$\\text{CMRR(dB)} = 20\\log_{10}\\!\\left(\\frac{A_d}{A_{cm}}\\right) \\;\\Rightarrow\\; \\frac{A_d}{A_{cm}} = 10^{\\text{CMRR}/20} = 10^{100/20} = 10^{5}.$$\n\n" +
      "**Step 2 — Find the common-mode gain.** With $A_d = 1000$,\n" +
      "$$A_{cm} = \\frac{A_d}{10^5} = \\frac{1000}{10^5} = 0.01.$$\n\n" +
      "**Step 3 — Amplify the desired (differential) signal.** $V_{\\text{diff}} = 1\\ \\text{mV} = 1\\times10^{-3}\\ \\text{V}$:\n" +
      "$$V_{\\text{out,diff}} = A_d\\,V_{\\text{diff}} = 1000 \\times 1\\times10^{-3} = 1.0\\ \\text{V}.$$\n\n" +
      "**Step 4 — Amplify the common-mode interference.** $V_{cm} = 100\\ \\text{mV} = 0.1\\ \\text{V}$:\n" +
      "$$V_{\\text{out,cm}} = A_{cm}\\,V_{cm} = 0.01 \\times 0.1 = 1\\times10^{-3}\\ \\text{V} = 1\\ \\text{mV}.$$\n\n" +
      "**Step 5 — Take the output ratio.**\n" +
      "$$\\frac{V_{\\text{out,diff}}}{V_{\\text{out,cm}}} = \\frac{1.0\\ \\text{V}}{1\\times10^{-3}\\ \\text{V}} = 1000.$$\n\n" +
      "**Key insight / trap.** The trap is conflating CMRR with the *output* signal-to-interference ratio. CMRR alone is $10^5$, but the interference starts 100× larger than the signal ($100\\ \\text{mV}$ vs $1\\ \\text{mV}$), eroding the advantage by a factor of 100: $10^5 / 100 = 10^3$. Another trap is using $10^{\\text{CMRR}/10}$ — that is for power ratios; voltage ratios use the factor of 20.\n\n" +
      "**Final answer: output signal-to-interference ratio $= 1000$ (dimensionless).**",
  },
  // SOLUTION:
  // Stress shielding worsens as the modulus mismatch (implant E >> bone E) grows.
  // Cortical bone E ~ 15-20 GPa. CoCr (~210 GPa) is far stiffer than Ti-6Al-4V
  // (~110 GPa), 316L steel (~190 GPa), and bone. The least-shielding metallic
  // choice among these is the one whose modulus is CLOSEST to bone: Ti-6Al-4V.
  // Question asks which BEST mitigates stress shielding -> Ti-6Al-4V (correct).
  {
    id: "bm_biomaterial_modulus_mc",
    slug: "biomedical-biomaterial-elastic-modulus-comparison",
    title: "Selecting a Metal to Minimize Stress Shielding",
    prompt:
      "Stress shielding occurs when a load-bearing implant is much stiffer than\n" +
      "the surrounding cortical bone (Young's modulus ≈ 15-20 GPa): the implant\n" +
      "carries most of the load, the bone is unloaded, and per Wolff's law the\n" +
      "bone resorbs over time. A designer must pick a metallic alloy for a\n" +
      "permanent femoral stem and wants to MINIMIZE stress shielding while\n" +
      "keeping adequate strength.\n\n" +
      "Which alloy is the best choice for reducing stress shielding, and for the\n" +
      "right reason?",
    discipline: "BIOMEDICAL",
    difficulty: "MEDIUM",
    eloWeight: 20,
    tags: ["biomaterials", "elastic-modulus", "stress-shielding"],
    skillAreas: ["biomaterials", "materials"],
    evaluationMode: "MULTIPLE_CHOICE",
    hints: [
      "Stress shielding is driven by the stiffness mismatch between implant and bone, not by absolute strength.",
      "A stiffer (higher-modulus) implant absorbs more of the load, leaving the bone unloaded; you want the metal whose modulus sits closest to bone's ~15-20 GPa.",
      "Compare the four moduli to bone and pick the one with the smallest gap, then check the stated reasoning matches that logic.",
    ],
    solution:
      "**Governing principle — load sharing depends on relative stiffness, and Wolff's law.** Two bonded members under a shared load split it in proportion to their axial stiffness ($\\propto E$). Bone follows Wolff's law: it remodels to the load it actually carries. So the more an implant's modulus exceeds bone's (~15–20 GPa), the more load it steals, the more the bone unloads, and the more it resorbs. **To minimize stress shielding, choose the metal whose modulus is closest to bone.**\n\n" +
      "**Step 1 — Rank the candidate moduli against bone (~15–20 GPa):**\n" +
      "- Cobalt-chromium ≈ 210 GPa (≈ 11× bone)\n" +
      "- 316L stainless steel ≈ 190 GPa (≈ 10× bone)\n" +
      "- Ti-6Al-4V ≈ 110 GPa (≈ 6× bone) ← smallest gap\n" +
      "- Tungsten ≈ 400 GPa (≈ 22× bone)\n\n" +
      "**Step 2 — Pick the smallest mismatch.** Ti-6Al-4V at 110 GPa is closest to bone, so it shares the most load back to the bone and best mitigates stress shielding while remaining strong enough for a permanent stem. **Option C is correct.**\n\n" +
      "**Why the distractors fail:**\n" +
      "- **A (Co-Cr):** Carrying load *away* from bone is the cause of stress shielding, not a cure — the reasoning is exactly backwards.\n" +
      "- **B (316L):** 'Standard and cheapest' is irrelevant to the stiffness mismatch the question is about, and at 190 GPa it shields heavily.\n" +
      "- **D (Tungsten):** Highest modulus of all (≈400 GPa); 'protecting' bone by making it carry nothing is precisely what triggers resorption.\n\n" +
      "**Key insight / trap.** Stress shielding is driven by *stiffness* ($E$), not *strength*. A common error is equating 'stronger/stiffer' with 'safer for bone' — the opposite is true here. (This is also why low-modulus β-titanium alloys are an active research direction.)\n\n" +
      "**Final answer: C — Ti-6Al-4V (≈ 110 GPa), because its lower modulus is closest to bone, reducing the stiffness mismatch.**",
    choices: [
      {
        id: "a",
        label:
          "Cobalt-chromium (≈ 210 GPa), because its very high modulus carries load away from fragile bone",
      },
      {
        id: "b",
        label:
          "316L stainless steel (≈ 190 GPa), because steel is the standard and cheapest option",
      },
      {
        id: "c",
        label:
          "Ti-6Al-4V (≈ 110 GPa), because its lower modulus is closest to bone, reducing the stiffness mismatch",
        correct: true,
      },
      {
        id: "d",
        label:
          "Tungsten (≈ 400 GPa), because a stiffer stem deflects less and protects the bone",
      },
    ],
  },
  // SOLUTION:
  // Diagnostic ECG content extends to ~150 Hz. Nyquist requires fs > 2*fmax = 300 Hz
  // to avoid aliasing. Among listed rates, 250 Hz fails (< 300); 256 Hz technically
  // exceeds 2*128 but not 2*150; 300 Hz equals (not strictly greater than) the
  // limit and leaves no anti-alias transition band; 500 Hz safely exceeds 300 Hz and
  // gives a practical guard band. Lowest rate that safely satisfies Nyquist = 500 Hz.
  {
    id: "bm_nyquist_ecg_mc",
    slug: "biomedical-nyquist-ecg-sampling-rate",
    title: "Choosing a Safe ADC Rate for Diagnostic ECG",
    prompt:
      "A diagnostic-quality ECG carries clinically meaningful frequency content\n" +
      "up to about 150 Hz. It will be digitized by an ADC fed from a real (non-\n" +
      "ideal) anti-aliasing filter that needs a finite transition band above the\n" +
      "signal bandwidth.\n\n" +
      "Considering both the Nyquist-Shannon criterion AND the need for a\n" +
      "practical anti-aliasing guard band, which listed sampling rate is the\n" +
      "lowest acceptable choice?",
    discipline: "BIOMEDICAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["bio-signal", "nyquist", "adc", "anti-aliasing"],
    skillAreas: ["signals-systems", "sensors-actuators"],
    evaluationMode: "MULTIPLE_CHOICE",
    hints: [
      "Start from the Nyquist-Shannon criterion: the sampling rate must exceed twice the highest frequency of interest.",
      "Twice the 150 Hz bandwidth is the bare minimum, but a real anti-aliasing filter needs room above that for its transition band, so sampling exactly at or just above 2x is not safe.",
      "Eliminate rates that fail to exceed 300 Hz, then pick the lowest remaining rate that still leaves a comfortable guard band.",
    ],
    solution:
      "**Governing principle — Nyquist–Shannon sampling theorem.** To reconstruct a signal without aliasing, the sampling rate must *exceed* twice the highest frequency present: $f_s > 2 f_{\\max}$. With real hardware there is a second requirement: a non-ideal anti-aliasing filter cannot cut off instantaneously, so it needs a finite transition band above the signal bandwidth — meaning $f_s$ must sit *comfortably* above $2f_{\\max}$, not merely at it.\n\n" +
      "**Step 1 — Compute the Nyquist minimum.** ECG content reaches $f_{\\max} = 150\\ \\text{Hz}$, so the theoretical floor is\n" +
      "$$f_s > 2 \\times 150\\ \\text{Hz} = 300\\ \\text{Hz}.$$\n\n" +
      "**Step 2 — Screen each option:**\n" +
      "- **250 Hz:** $< 300$ Hz — violates Nyquist outright; high-frequency content folds back as aliases. Fails.\n" +
      "- **200 Hz:** $< 300$ Hz, and 'faster than the heart rate' confuses beat *rate* (~1 Hz) with signal *bandwidth* (150 Hz). Fails.\n" +
      "- **300 Hz:** *Equals* $2f_{\\max}$, not strictly greater, and leaves zero room for a practical anti-aliasing transition band. Marginal/unsafe.\n" +
      "- **500 Hz:** $> 300$ Hz with a generous guard band (300→500 Hz) for a real filter to roll off. Safe.\n\n" +
      "**Step 3 — Pick the lowest acceptable rate.** Only 500 Hz satisfies *both* the strict-inequality Nyquist criterion and the guard-band requirement, so it is the lowest acceptable choice. **Option C is correct.**\n\n" +
      "**Key insight / trap.** Sampling exactly at $2f_{\\max}$ (300 Hz) looks like it 'meets Nyquist,' but the theorem requires a strict inequality *and* assumes a brick-wall filter that doesn't exist — so 300 Hz is the seductive wrong answer. The 200 Hz option baits you into confusing heart rate with signal bandwidth.\n\n" +
      "**Final answer: C — 500 Hz (comfortably above $2\\times150$ Hz with a usable guard band).**",
    choices: [
      { id: "a", label: "250 Hz (below twice the 150 Hz bandwidth)" },
      {
        id: "b",
        label: "300 Hz (exactly twice the bandwidth, no transition band left)",
      },
      {
        id: "c",
        label: "500 Hz (comfortably above 2×150 Hz with a usable guard band)",
        correct: true,
      },
      { id: "d", label: "200 Hz (faster than the heart rate, so adequate)" },
    ],
  },
  // SOLUTION:
  // Stress shielding via parallel load sharing (bone and implant at equal strain).
  // Solid Ti stem: d_i = 10 mm -> A_i = pi*(0.010)^2/4 = 7.854e-5 m^2, E_i = 110 GPa.
  // Surrounding cortical bone annulus: inner d = 10 mm, outer d = 16 mm ->
  //   A_b = pi*(0.016^2 - 0.010^2)/4 = pi*(2.56e-4 - 1.0e-4)/4 = 1.2252e-4 m^2, E_b = 18 GPa.
  // Equal strain -> load fraction by axial stiffness E*A:
  //   k_i = 110e9*7.854e-5 = 8.639e6 N ; k_b = 18e9*1.2252e-4 = 2.205e6 N.
  // Implant load fraction = k_i/(k_i+k_b) = 8.639e6/(8.639e6+2.205e6) = 0.7966 -> 79.7%.
  {
    id: "bm_implant_fatigue_concept",
    slug: "biomedical-implant-stress-shielding-load-fraction",
    title: "Load Fraction Carried by a Stiff Implant",
    prompt:
      "A solid titanium (E = 110 GPa) intramedullary stem of diameter 10 mm is\n" +
      "press-fit into a cortical bone (E = 18 GPa) that surrounds it as an\n" +
      "annulus with inner diameter 10 mm and outer diameter 16 mm. Model the\n" +
      "stem and the bone annulus as two parallel columns that are bonded so they\n" +
      "experience the same axial strain under a shared compressive load.\n\n" +
      "Determine the fraction of the total axial load carried by the titanium\n" +
      "implant. This is the quantity that governs how severely the bone is\n" +
      "stress-shielded. Decide for yourself how parallel members at equal strain\n" +
      "partition load before computing.\n\n" +
      "Report the implant's load fraction as a percentage, rounded to\n" +
      "1 decimal place.",
    discipline: "BIOMEDICAL",
    difficulty: "EXPERT",
    eloWeight: 37,
    tags: ["implant", "stress-shielding", "biomaterials", "load-sharing"],
    skillAreas: ["biomaterials", "mechanics-of-materials", "biomechanics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 79.7,
    tolerance: 0.8,
    unit: "%",
    hints: [
      "Two bonded members sharing a load at equal strain behave like springs in parallel; each carries load in proportion to its own axial stiffness.",
      "Axial stiffness scales with E*A, so first find each cross-sectional area: a solid circle for the stem and an annulus (outer minus inner) for the bone.",
      "The implant's load fraction is (E_i*A_i) / (E_i*A_i + E_b*A_b); keep areas in consistent units and report as a percentage.",
    ],
    solution:
      "**Governing principle — parallel members at equal strain (load sharing).** Two bonded columns that deform together share a strain $\\varepsilon$. For each, force is $P_i = E_i A_i \\varepsilon$, so axial force splits in proportion to axial stiffness $E A$ — exactly like springs in parallel ($k = EA/L$ with equal $L$ cancelling). This is why a stiff implant 'steals' load from bone (stress shielding).\n\n" +
      "**Step 1 — Stem cross-sectional area (solid circle), $d_i = 10\\ \\text{mm} = 0.010\\ \\text{m}$:**\n" +
      "$$A_i = \\frac{\\pi d_i^2}{4} = \\frac{\\pi (0.010)^2}{4} = 7.854\\times10^{-5}\\ \\text{m}^2.$$\n\n" +
      "**Step 2 — Bone area (annulus), inner $0.010\\ \\text{m}$, outer $0.016\\ \\text{m}$:**\n" +
      "$$A_b = \\frac{\\pi}{4}\\left(d_o^2 - d_i^2\\right) = \\frac{\\pi}{4}\\left(0.016^2 - 0.010^2\\right) = \\frac{\\pi}{4}(2.56\\times10^{-4} - 1.0\\times10^{-4}) = 1.225\\times10^{-4}\\ \\text{m}^2.$$\n\n" +
      "**Step 3 — Axial stiffness of each member ($\\propto E A$):**\n" +
      "$$k_i = E_i A_i = (110\\times10^9)(7.854\\times10^{-5}) = 8.639\\times10^{6}\\ \\text{N (per unit strain)},$$\n" +
      "$$k_b = E_b A_b = (18\\times10^9)(1.225\\times10^{-4}) = 2.205\\times10^{6}\\ \\text{N (per unit strain)}.$$\n\n" +
      "**Step 4 — Implant load fraction.** Because strain is shared, the implant carries\n" +
      "$$\\frac{P_i}{P_{\\text{total}}} = \\frac{E_i A_i}{E_i A_i + E_b A_b} = \\frac{8.639\\times10^{6}}{8.639\\times10^{6} + 2.205\\times10^{6}} = \\frac{8.639}{10.844} = 0.7966.$$\n\n" +
      "**Step 5 — Convert to percentage.** $0.7966 \\times 100 = 79.7\\%$.\n\n" +
      "**Key insight / trap.** The trap is splitting load by *area alone* (which gives $A_i/(A_i+A_b) \\approx 39\\%$) and forgetting the modulus weighting — yet titanium is ~6× stiffer than bone, so it dominates despite its smaller area. The other trap is computing the bone area as a full circle instead of subtracting the inner hole the stem occupies. The fact that the stem carries ~80% of the load is precisely the mechanism of stress shielding.\n\n" +
      "**Final answer: implant load fraction $\\approx 79.7\\%$.**",
  },
];
