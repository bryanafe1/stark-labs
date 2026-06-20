import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION:
  // Simply supported timber beam, span L = 4 m, service UDL w = 6 kN/m.
  // Max moment M = wL^2/8 = 6 * 4^2 / 8 = 12 kN·m.
  // Section modulus of rectangle S = b*h^2/6 = 0.15 * 0.30^2 / 6
  //   = 0.15 * 0.09 / 6 = 0.00225 m^3.
  // Max bending stress sigma = M/S = 12,000 N·m / 0.00225 m^3
  //   = 5.333e6 Pa = 5.33 MPa.
  // (Allowable 12 MPa => beam is adequate; final answer is the demand stress.)
  {
    id: "cv_rect_inertia",
    slug: "civil-rectangle-moment-of-inertia",
    title: "Sawn-Timber Joist: Flexural Demand Check",
    prompt:
      "You are checking a sawn-timber floor joist on a residential renovation. It spans 4.0 m simply supported and carries a uniformly distributed service load of 6 kN/m over its full length. The rectangular section is 150 mm wide by 300 mm deep (oriented so the 300 mm dimension is vertical). The lumber's allowable bending stress is 12 MPa.\n\nWork out the maximum bending stress actually developed in the joist under this load.\n\nReport the bending stress in MPa, rounded to two decimal places.",
    discipline: "CIVIL",
    difficulty: "EASY",
    eloWeight: 14,
    tags: ["beam", "bending-stress", "section-modulus", "timber"],
    skillAreas: ["mechanics-of-materials", "structural-analysis"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 5.33,
    tolerance: 0.06,
    unit: "MPa",
    hints: [
      "For a simply supported beam under a full-length uniform load, the maximum bending moment is at midspan; you will need that moment plus a section property of the rectangle.",
      "Peak moment is M = wL^2/8, and bending stress is sigma = M/S where S = b*h^2/6 with h the dimension in the plane of bending (here the 300 mm depth).",
      "Keep units consistent: convert M to N*m and S to m^3 (so 150 mm and 300 mm become 0.15 m and 0.30 m), then divide and express the result in MPa. The 12 MPa allowable is only for the adequacy comparison, not part of the demand calculation.",
    ],
    solution:
      "**Governing principle — elastic flexure formula.** A beam in bending develops a stress that is largest at the extreme fibre, $\\sigma = M/S$, where $M$ is the bending moment and $S$ is the elastic section modulus. We apply it because the joist is a slender member loaded transversely, so flexure (not shear or axial) controls. The job is to find the *demand* stress and compare it to the 12 MPa allowable.\n" +
      "\n" +
      "**Step 1 — Maximum moment.** For a simply supported span under a full-length uniform load, the moment peaks at midspan:\n" +
      "$$M = \\frac{wL^2}{8} = \\frac{6 \\times 4.0^2}{8} = \\frac{6 \\times 16}{8} = 12\\ \\text{kN·m} = 12{,}000\\ \\text{N·m}.$$\n" +
      "\n" +
      "**Step 2 — Section modulus of the rectangle.** Bending is about the strong axis (the 300 mm depth is in the plane of bending), so $h = 0.30$ m and $b = 0.15$ m:\n" +
      "$$S = \\frac{b\\,h^2}{6} = \\frac{0.15 \\times 0.30^2}{6} = \\frac{0.15 \\times 0.09}{6} = 0.00225\\ \\text{m}^3.$$\n" +
      "\n" +
      "**Step 3 — Bending stress.**\n" +
      "$$\\sigma = \\frac{M}{S} = \\frac{12{,}000}{0.00225} = 5.33 \\times 10^6\\ \\text{Pa} = 5.33\\ \\text{MPa}.$$\n" +
      "\n" +
      "**Key insight / trap.** The 12 MPa allowable is bait — it is only used afterward to judge adequacy ($5.33 < 12$, so the joist is fine), never inside the demand calculation. Also watch the orientation: putting the 150 mm dimension vertical would slash $S$ and roughly double the stress.\n" +
      "\n" +
      "**Final answer: $\\sigma \\approx 5.33$ MPa.**",
  },
  // SOLUTION:
  // Simply supported beam, span L = 6 m, full-length UDL w = 20 kN/m PLUS a
  // central concentrated load P = 30 kN. Both produce their peak moment at
  // midspan, so they superpose there.
  // M_udl  = wL^2/8 = 20 * 6^2 / 8 = 90 kN·m.
  // M_point = PL/4   = 30 * 6 / 4   = 45 kN·m.
  // M_max = 90 + 45 = 135 kN·m (at midspan).
  // Distractors: 90 (forgets the point load), 45 (forgets the UDL),
  //   105 (uses PL/8 incorrectly: 90 + 15).
  {
    id: "cv_udl_moment",
    slug: "civil-simply-supported-udl-max-moment",
    title: "Superposed Loading: Locating the Peak Moment",
    prompt:
      "A 6 m simply supported steel beam carries a uniformly distributed load of 20 kN/m across its entire span and, in addition, a single 30 kN concentrated load at midspan.\n\nWhat is the maximum bending moment in the beam, and where does it occur?",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 20,
    tags: ["beam", "bending-moment", "superposition"],
    skillAreas: ["structural-analysis"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      { id: "a", label: "90 kN·m at midspan" },
      { id: "b", label: "135 kN·m at midspan", correct: true },
      { id: "c", label: "45 kN·m at midspan" },
      { id: "d", label: "135 kN·m at the supports" },
    ],
    hints: [
      "The two load types act independently; use superposition, computing each one's peak moment separately and then deciding whether they add at the same location.",
      "A full-length UDL on a simple span peaks at midspan (wL^2/8), and a central point load also peaks at midspan (PL/4) - so the two maxima coincide and superpose.",
      "Add the two midspan contributions; a simply supported beam has zero moment at its end supports, so any choice placing the peak there is wrong.",
    ],
    solution:
      "**Governing principle — superposition of elastic responses.** For a linear-elastic beam, the moment from several loads is the algebraic sum of the moments from each load acting alone. We apply it because we have two separate load cases (a UDL and a point load) on the same span, and both happen to peak at the same section.\n" +
      "\n" +
      "**Step 1 — Moment from the uniform load.** A full-length UDL on a simple span peaks at midspan:\n" +
      "$$M_{w} = \\frac{wL^2}{8} = \\frac{20 \\times 6^2}{8} = \\frac{20 \\times 36}{8} = 90\\ \\text{kN·m}.$$\n" +
      "\n" +
      "**Step 2 — Moment from the central point load.** A central concentrated load also peaks at midspan:\n" +
      "$$M_{P} = \\frac{PL}{4} = \\frac{30 \\times 6}{4} = 45\\ \\text{kN·m}.$$\n" +
      "\n" +
      "**Step 3 — Superpose at the common peak.** Both maxima occur at midspan, so they add directly:\n" +
      "$$M_{max} = 90 + 45 = 135\\ \\text{kN·m at midspan}.$$\n" +
      "\n" +
      "**Why the distractors fail.** *90 kN·m* drops the point load; *45 kN·m* drops the UDL; *135 kN·m at the supports* is right in magnitude but wrong in location — a simply supported beam has zero moment at its end supports. The peak of any single beam segment lives where shear crosses zero, which here is midspan.\n" +
      "\n" +
      "**Final answer: 135 kN·m at midspan (option b).**",
  },
  // SOLUTION:
  // Simply supported beam, span L = 8 m, single point load P = 50 kN located
  // a = 3 m from the left support (so b = 5 m from the right support).
  // Reaction at left support: R_L = P*b/L = 50 * 5 / 8 = 31.25 kN.
  // The maximum moment occurs under the load: M = R_L * a = 31.25 * 3
  //   = 93.75 kN·m.
  // (Check via R_R = P*a/L = 50*3/8 = 18.75 kN; M = R_R*b = 18.75*5 = 93.75. OK)
  {
    id: "cv_point_moment",
    slug: "civil-simply-supported-point-load-moment",
    title: "Off-Center Point Load: Reactions and Peak Moment",
    prompt:
      "On an interview whiteboard you are handed an 8.0 m simply supported beam carrying a single 50 kN concentrated load located 3.0 m from the left support. You must first find the support reactions, then the bending moment under the load.\n\nDetermine the maximum bending moment in the beam.\n\nGive your answer in kN·m, rounded to two decimal places.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 21,
    tags: ["beam", "bending-moment", "reactions"],
    skillAreas: ["structural-analysis"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 93.75,
    tolerance: 0.5,
    unit: "kN·m",
    hints: [
      "For a single point load, the bending-moment diagram is two straight lines that peak directly under the load, so first you need the support reactions from equilibrium.",
      "Take moments about one support to get the reactions: R_left = P*b/L where b is the distance from the load to the far (right) support.",
      "The maximum moment equals the left reaction times its distance to the load (R_left * a). Cross-check with R_right * b - they must match.",
    ],
    solution:
      "**Governing principle — static equilibrium then moment diagram.** A simply supported beam is statically determinate, so the reactions come from $\\sum F = 0$ and $\\sum M = 0$. For a single point load the bending-moment diagram is two straight lines meeting at a peak directly under the load, so once we know a reaction the peak moment follows by statics.\n" +
      "\n" +
      "Geometry: $P = 50$ kN at $a = 3.0$ m from the left support; far distance $b = L - a = 8.0 - 3.0 = 5.0$ m.\n" +
      "\n" +
      "**Step 1 — Left reaction.** Take moments about the right support (so $R_L$ has the full span as its lever arm):\n" +
      "$$R_L = \\frac{P\\,b}{L} = \\frac{50 \\times 5.0}{8.0} = 31.25\\ \\text{kN}.$$\n" +
      "\n" +
      "**Step 2 — Maximum moment (under the load).** Cut just under the load and sum moments of the left portion:\n" +
      "$$M_{max} = R_L \\cdot a = 31.25 \\times 3.0 = 93.75\\ \\text{kN·m}.$$\n" +
      "\n" +
      "**Step 3 — Cross-check from the other side.** $R_R = P\\,a/L = 50 \\times 3/8 = 18.75$ kN, and $R_R \\cdot b = 18.75 \\times 5.0 = 93.75$ kN·m. The two agree, confirming the result.\n" +
      "\n" +
      "**Key insight / trap.** The peak is under the load, *not* at midspan, and the reactions are unequal because the load is off-center — the support closer to the load (left, here) carries more. Using $PL/4 = 100$ kN·m (the centered-load formula) would be wrong.\n" +
      "\n" +
      "**Final answer: $M_{max} \\approx 93.75$ kN·m.**",
  },
  // SOLUTION:
  // Singly reinforced concrete beam, ACI-style design (USD).
  // b = 300 mm, d = 450 mm, f'c = 28 MPa, fy = 420 MPa, Mu = 200 kN·m.
  // phi = 0.90 (tension-controlled). Required: As.
  // Mu = phi*As*fy*(d - a/2),  a = As*fy/(0.85*f'c*b).
  // Convert Mu = 200e6 N·mm.
  // Iterate. First guess jd ~ 0.9d:
  //   As = Mu/(phi*fy*0.9d) = 200e6/(0.9*420*0.9*450) = 200e6/153090 = 1306 mm^2.
  //   a = 1306*420/(0.85*28*300) = 548520/7140 = 76.8 mm.
  //   As = 200e6/(0.9*420*(450-38.4)) = 200e6/(0.9*420*411.6) = 200e6/155585 = 1285.6.
  //   a = 1285.6*420/7140 = 75.6 mm; d-a/2 = 412.2.
  //   As = 200e6/(0.9*420*412.2) = 200e6/155811 = 1283.6 mm^2.
  // Converged As ~= 1284 mm^2.
  // (Check rho = 1284/(300*450)=0.0095, well below rho_max ~0.0207 => tension-
  //  controlled, phi=0.9 valid.)
  {
    id: "cv_bending_stress",
    slug: "civil-bending-stress-section-modulus",
    title: "Required Flexural Steel for an RC Beam",
    prompt:
      "Design the tension reinforcement for a singly reinforced rectangular concrete beam in a parking-structure framing job. The beam is 300 mm wide with an effective depth d = 450 mm. Concrete strength f'c = 28 MPa, reinforcing yield fy = 420 MPa, and the factored design moment is Mu = 200 kN·m. Use a strength-reduction factor phi = 0.90 and the standard equivalent rectangular (Whitney) stress block.\n\nDetermine the required area of tension steel.\n\nGive your answer in mm^2, rounded to the nearest whole number.",
    discipline: "CIVIL",
    difficulty: "EXPERT",
    eloWeight: 38,
    tags: ["reinforced-concrete", "flexure", "required-steel", "USD"],
    skillAreas: ["structural-analysis", "mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 1284,
    tolerance: 18,
    unit: "mm^2",
    hints: [
      "The nominal flexural strength is Mn = As*fy*(d - a/2) with the Whitney block depth a = As*fy/(0.85*f'c*b); since both Mn and a depend on As, solve iteratively (or via the quadratic).",
      "Set Mu = phi*Mn and start from an assumed internal lever arm of about 0.9d to get a first As estimate; then recompute a, update the lever arm (d - a/2), and re-solve for As.",
      "Repeat until As stabilizes (it converges in two or three passes). Work in N and mm (Mu = 200e6 N*mm) and report As in mm^2; verify the reinforcement ratio is low enough that phi = 0.90 is justified.",
    ],
    solution:
      "**Governing principle — strength design (USD) with the Whitney stress block.** At ultimate, the concrete compression is idealized as a uniform $0.85 f'_c$ block of depth $a$, and the steel yields at $f_y$. Internal couple: $M_n = A_s f_y (d - a/2)$ with $a = A_s f_y / (0.85 f'_c b)$. We require $M_u \\le \\phi M_n$. Both $M_n$ and $a$ depend on the unknown $A_s$, so we iterate (or solve the quadratic). Work in N and mm: $M_u = 200 \\times 10^6$ N·mm.\n" +
      "\n" +
      "**Step 1 — First estimate using lever arm $\\approx 0.9d$.**\n" +
      "$$A_s \\approx \\frac{M_u}{\\phi f_y (0.9d)} = \\frac{200\\times10^6}{0.9 \\times 420 \\times (0.9 \\times 450)} = \\frac{200\\times10^6}{153{,}090} = 1306\\ \\text{mm}^2.$$\n" +
      "\n" +
      "**Step 2 — Compute block depth and update lever arm.**\n" +
      "$$a = \\frac{A_s f_y}{0.85 f'_c b} = \\frac{1306 \\times 420}{0.85 \\times 28 \\times 300} = \\frac{548{,}520}{7140} = 76.8\\ \\text{mm}, \\quad d - \\tfrac{a}{2} = 450 - 38.4 = 411.6\\ \\text{mm}.$$\n" +
      "$$A_s = \\frac{200\\times10^6}{0.9 \\times 420 \\times 411.6} = \\frac{200\\times10^6}{155{,}585} = 1285.6\\ \\text{mm}^2.$$\n" +
      "\n" +
      "**Step 3 — One more pass (converges).** $a = 1285.6 \\times 420 / 7140 = 75.6$ mm, so $d - a/2 = 412.2$ mm:\n" +
      "$$A_s = \\frac{200\\times10^6}{0.9 \\times 420 \\times 412.2} = 1283.6\\ \\text{mm}^2 \\approx 1284\\ \\text{mm}^2.$$\n" +
      "\n" +
      "**Step 4 — Confirm $\\phi = 0.90$ is valid.** $\\rho = A_s/(bd) = 1284/(300 \\times 450) = 0.0095$, well below $\\rho_{max} \\approx 0.0207$ for these materials, so the section is tension-controlled and $\\phi = 0.90$ holds.\n" +
      "\n" +
      "**Key insight / trap.** The lever arm $(d - a/2)$ is *not* fixed — assuming $0.9d$ once and stopping overestimates $A_s$ by ~2%. Iterating (or the closed-form quadratic) is what pins the answer.\n" +
      "\n" +
      "**Final answer: $A_s \\approx 1284$ mm$^2$.**",
  },
  // SOLUTION:
  // Effective vertical stress with a water table. Profile from ground surface:
  //   0 to 2 m: moist sand, gamma = 18 kN/m^3 (above water table at 2 m).
  //   2 to 5 m: saturated sand, gamma_sat = 20 kN/m^3 (below water table).
  // Total vertical stress at 5 m: sigma = 18*2 + 20*3 = 36 + 60 = 96 kPa.
  // Pore pressure at 5 m: u = gamma_w * (5 - 2) = 9.81 * 3 = 29.43 kPa.
  // Effective vertical stress: sigma' = sigma - u = 96 - 29.43 = 66.57 kPa.
  {
    id: "cv_soil_bearing",
    slug: "civil-soil-bearing-pressure",
    title: "Effective Vertical Stress Below the Water Table",
    prompt:
      "A geotechnical borehole shows the following profile from the ground surface: 0 to 2.0 m of moist sand with unit weight 18 kN/m^3, then saturated sand with unit weight 20 kN/m^3 below that. The groundwater table sits at 2.0 m depth. Use the unit weight of water as 9.81 kN/m^3.\n\nFor a settlement calculation you need the effective vertical stress acting at a depth of 5.0 m below the ground surface.\n\nReport the effective vertical stress in kPa, rounded to one decimal place.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["geotechnical", "effective-stress", "water-table"],
    skillAreas: ["geotechnical"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 66.57,
    tolerance: 0.8,
    unit: "kPa",
    hints: [
      "Effective stress is total vertical stress minus pore water pressure: sigma' = sigma - u; build each up by layer from the surface down to 5 m.",
      "Total stress accumulates the unit weight times thickness of each layer (use moist gamma above the water table and saturated gamma below it); pore pressure is gamma_w times the depth of water below the table.",
      "Only the 3 m of soil below the 2 m water table generates pore pressure. Keep everything in kPa and subtract to get sigma' at 5 m.",
    ],
    solution:
      "**Governing principle — Terzaghi's effective stress.** The stress carried by the soil skeleton is the total vertical stress minus the pore water pressure: $\\sigma' = \\sigma - u$. It governs because soil strength and compressibility depend on the *grain-to-grain* (effective) stress, not the total. Build $\\sigma$ layer by layer from the surface, and $u$ hydrostatically below the water table.\n" +
      "\n" +
      "**Step 1 — Total vertical stress at 5 m.** Sum unit weight × thickness for each layer (moist above the water table, saturated below):\n" +
      "$$\\sigma = \\gamma_{moist}(2.0) + \\gamma_{sat}(3.0) = 18 \\times 2.0 + 20 \\times 3.0 = 36 + 60 = 96\\ \\text{kPa}.$$\n" +
      "\n" +
      "**Step 2 — Pore water pressure at 5 m.** Water table is at 2.0 m, so the depth of water above point of interest is $5.0 - 2.0 = 3.0$ m:\n" +
      "$$u = \\gamma_w \\,(3.0) = 9.81 \\times 3.0 = 29.43\\ \\text{kPa}.$$\n" +
      "\n" +
      "**Step 3 — Effective vertical stress.**\n" +
      "$$\\sigma' = \\sigma - u = 96 - 29.43 = 66.57\\ \\text{kPa}.$$\n" +
      "\n" +
      "**Key insight / trap.** Pore pressure starts at the water table (depth 2 m), not the ground surface — only the lower 3 m contributes $u$. Also use the moist unit weight above the table and the saturated value below; mixing them up shifts the total stress.\n" +
      "\n" +
      "**Final answer: $\\sigma' \\approx 66.57$ kPa.**",
  },
  // SOLUTION:
  // Primary consolidation settlement of a normally consolidated clay layer.
  // H = 4.0 m, Cc = 0.25, e0 = 0.90, sigma'0 = 80 kPa, delta_sigma = 60 kPa.
  // Sc = (Cc*H/(1+e0)) * log10((sigma'0 + delta_sigma)/sigma'0)
  //    = (0.25*4/(1+0.90)) * log10((80+60)/80)
  //    = (1.0/1.90) * log10(140/80)
  //    = 0.52632 * log10(1.75)
  //    = 0.52632 * 0.243038
  //    = 0.12792 m = 127.9 mm ~= 128 mm.
  {
    id: "cv_hydrostatic_force",
    slug: "civil-hydrostatic-force-on-wall",
    title: "Primary Consolidation Settlement of a Clay Layer",
    prompt:
      "A new warehouse fill places a wide, roughly uniform surcharge over a site. Beneath the fill lies a 4.0 m thick normally consolidated clay layer with compression index Cc = 0.25 and initial void ratio e0 = 0.90. At the mid-height of the clay the existing effective overburden stress is 80 kPa, and the fill increases the vertical effective stress there by 60 kPa.\n\nEstimate the ultimate primary consolidation settlement of the clay layer.\n\nReport the settlement in mm, rounded to the nearest mm.",
    discipline: "CIVIL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["geotechnical", "consolidation", "settlement"],
    skillAreas: ["geotechnical"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 128,
    tolerance: 2,
    unit: "mm",
    hints: [
      "Because the clay is normally consolidated, use the virgin-compression settlement form with the compression index Cc and a base-10 log of the stress ratio.",
      "Sc = (Cc*H/(1+e0)) * log10((sigma'0 + delta_sigma)/sigma'0); the surcharge delta_sigma is added to the existing effective overburden inside the log.",
      "Use log base 10 (not natural log) and the full layer thickness H = 4 m, then convert the result from metres to mm.",
    ],
    solution:
      "**Governing principle — virgin (primary) consolidation of NC clay.** For a normally consolidated clay, the void-ratio change follows the virgin compression line, giving the settlement\n" +
      "$$S_c = \\frac{C_c\\,H}{1 + e_0}\\,\\log_{10}\\!\\left(\\frac{\\sigma'_0 + \\Delta\\sigma}{\\sigma'_0}\\right).$$\n" +
      "We use this (rather than the recompression form) because the clay is NC, so the loading moves it straight down the virgin line with slope $C_c$.\n" +
      "\n" +
      "**Step 1 — Strain-magnitude coefficient.**\n" +
      "$$\\frac{C_c\\,H}{1 + e_0} = \\frac{0.25 \\times 4.0}{1 + 0.90} = \\frac{1.0}{1.90} = 0.52632\\ \\text{m}.$$\n" +
      "\n" +
      "**Step 2 — Stress ratio and its log.**\n" +
      "$$\\frac{\\sigma'_0 + \\Delta\\sigma}{\\sigma'_0} = \\frac{80 + 60}{80} = \\frac{140}{80} = 1.75, \\qquad \\log_{10}(1.75) = 0.24304.$$\n" +
      "\n" +
      "**Step 3 — Settlement.**\n" +
      "$$S_c = 0.52632 \\times 0.24304 = 0.1279\\ \\text{m} = 127.9\\ \\text{mm} \\approx 128\\ \\text{mm}.$$\n" +
      "\n" +
      "**Key insight / trap.** Use $\\log_{10}$, not the natural log — $\\ln(1.75) = 0.560$ would inflate the answer by a factor of 2.3. Add the surcharge $\\Delta\\sigma$ *inside* the log to the existing overburden; the stresses outside the log only set the ratio.\n" +
      "\n" +
      "**Final answer: $S_c \\approx 128$ mm.**",
  },
  // SOLUTION:
  // Euler elastic critical buckling load of a steel column.
  // K = 1.0, L = 3.5 m, E = 200 GPa = 200e9 Pa, I = 8.0e-6 m^4.
  // Pcr = pi^2 * E * I / (K*L)^2
  //     = (9.8696) * (200e9) * (8.0e-6) / (1.0*3.5)^2
  //     = 9.8696 * 1.6e6 / 12.25
  //     = 1.57914e7 / 12.25
  //     = 1.2891e6 N = 1289 kN.
  // (Area is a distractor; Euler buckling does not use A directly.)
  {
    id: "cv_slenderness_ratio",
    slug: "civil-column-slenderness-ratio",
    title: "Euler Buckling Capacity of a Steel Column",
    prompt:
      "A pin-ended structural-steel column has effective length factor K = 1.0 and unbraced length L = 3.5 m. Its weak-axis moment of inertia is I = 8.0 x 10^-6 m^4, its cross-sectional area is A = 5.0 x 10^-3 m^2, and the steel's elastic modulus is E = 200 GPa.\n\nAssuming the member remains elastic, determine the theoretical critical axial load at which the column buckles.\n\nReport the critical buckling load in kN, rounded to the nearest whole number.",
    discipline: "CIVIL",
    difficulty: "HARD",
    eloWeight: 31,
    tags: ["column", "buckling", "euler", "steel"],
    skillAreas: ["structural-analysis", "mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 1289,
    tolerance: 13,
    unit: "kN",
    hints: [
      "Elastic flexural (Euler) buckling depends on flexural stiffness EI and effective length KL - not on the cross-sectional area, which is a distractor here.",
      "Pcr = pi^2 * E * I / (K*L)^2; buckling occurs about the weak axis, so use the smaller (given) moment of inertia.",
      "Convert E to Pa (200e9) and keep I in m^4 and L in m so Pcr comes out in newtons; then express the answer in kN.",
    ],
    solution:
      "**Governing principle — Euler elastic buckling.** A slender, perfectly straight, axially loaded column becomes laterally unstable at the critical load\n" +
      "$$P_{cr} = \\frac{\\pi^2 E I}{(K L)^2}.$$\n" +
      "Stability depends on flexural stiffness $EI$ and the effective length $KL$ — the cross-sectional area $A$ does *not* enter directly, so it is a distractor.\n" +
      "\n" +
      "**Step 1 — Effective length.** Pin-ended, so $K = 1.0$ and $KL = 1.0 \\times 3.5 = 3.5$ m; $(KL)^2 = 12.25\\ \\text{m}^2$.\n" +
      "\n" +
      "**Step 2 — Stiffness term.** Buckling occurs about the weak axis, so use the given $I = 8.0\\times10^{-6}\\ \\text{m}^4$ and $E = 200\\ \\text{GPa} = 200\\times10^9\\ \\text{Pa}$:\n" +
      "$$E I = 200\\times10^9 \\times 8.0\\times10^{-6} = 1.6\\times10^{6}\\ \\text{N·m}^2.$$\n" +
      "\n" +
      "**Step 3 — Critical load.**\n" +
      "$$P_{cr} = \\frac{\\pi^2 \\times 1.6\\times10^{6}}{12.25} = \\frac{9.8696 \\times 1.6\\times10^{6}}{12.25} = \\frac{1.5791\\times10^{7}}{12.25} = 1.289\\times10^{6}\\ \\text{N} \\approx 1289\\ \\text{kN}.$$\n" +
      "\n" +
      "**Key insight / trap.** Don't reach for the area — Euler buckling is a stiffness problem, not a stress problem (area only matters once you convert $P_{cr}$ to a critical *stress*). Always buckle about the weak (smaller $I$) axis unless that axis is braced.\n" +
      "\n" +
      "**Final answer: $P_{cr} \\approx 1289$ kN.**",
  },
  // SOLUTION:
  // LRFD load combinations: which one governs (largest factored load)?
  // Service loads: dead D = 30 kN/m, live L = 20 kN/m.
  //   1.4D            = 1.4*30 = 42 kN/m.
  //   1.2D + 1.6L     = 1.2*30 + 1.6*20 = 36 + 32 = 68 kN/m.  <-- governs.
  //   service D+L     = 30 + 20 = 50 kN/m (not a strength combo; distractor).
  //   1.2D + 1.0L     = 36 + 20 = 56 kN/m (e.g. with companion factor; smaller).
  // Governing factored load = 68 kN/m via 1.2D + 1.6L.
  {
    id: "cv_steel_fos",
    slug: "civil-steel-factor-of-safety",
    title: "Which LRFD Load Combination Governs?",
    prompt:
      "A floor beam carries a dead load of 30 kN/m and a live load of 20 kN/m (both as service-level distributed loads). You are sizing it by LRFD and must identify the governing strength load combination before computing the required capacity.\n\nUsing the basic combinations 1.4D and 1.2D + 1.6L, which combination governs and what is the factored design load?",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["steel", "load-combinations", "LRFD", "design-decision"],
    skillAreas: ["structural-analysis"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      { id: "a", label: "1.4D governs, 42 kN/m" },
      { id: "b", label: "1.2D + 1.6L governs, 68 kN/m", correct: true },
      { id: "c", label: "Service D + L governs, 50 kN/m" },
      { id: "d", label: "1.2D + 1.6L governs, 56 kN/m" },
    ],
    hints: [
      "Evaluate each strength (factored) combination numerically; the governing one produces the largest factored load.",
      "Compute 1.4D and 1.2D + 1.6L with D = 30 and L = 20 kN/m, and remember that an unfactored service sum D + L is not a strength combination.",
      "Compare the factored results and pick the larger; check that the load value quoted in the option actually matches the combination it names.",
    ],
    solution:
      "**Governing principle — LRFD strength combinations.** In LRFD, members are designed for the largest *factored* load drawn from a set of combinations, each applying load factors that reflect the variability of dead vs. live load. We simply evaluate the candidate combinations numerically and take the maximum. Service loads: $D = 30$ kN/m, $L = 20$ kN/m.\n" +
      "\n" +
      "**Step 1 — Combination 1 ($1.4D$).** Governs when dead load dominates:\n" +
      "$$1.4D = 1.4 \\times 30 = 42\\ \\text{kN/m}.$$\n" +
      "\n" +
      "**Step 2 — Combination 2 ($1.2D + 1.6L$).** The usual governing combo when live load is significant:\n" +
      "$$1.2D + 1.6L = 1.2 \\times 30 + 1.6 \\times 20 = 36 + 32 = 68\\ \\text{kN/m}.$$\n" +
      "\n" +
      "**Step 3 — Compare and select.** $68 > 42$, so $1.2D + 1.6L$ governs at **68 kN/m**.\n" +
      "\n" +
      "**Why the distractors fail.** *1.4D = 42 kN/m* is real but smaller, so it does not govern here. *Service D + L = 50 kN/m* is unfactored — it is not a strength combination at all (it would be used for serviceability/deflection). *1.2D + 1.6L = 56 kN/m* names the right combination but mis-arithmetics it (that figure is actually $1.2D + 1.0L = 56$), so the value contradicts the label.\n" +
      "\n" +
      "**Final answer: $1.2D + 1.6L$ governs at 68 kN/m (option b).**",
  },
  // SOLUTION:
  // Conceptual design-decision: classify checks as ULS (strength/safety) vs
  // SLS (in-service performance under unfactored loads).
  //   - An L/360 deflection limit is a SERVICEABILITY (SLS) check.
  //   - Flexural strength (Mu <= phi*Mn), shear strength, and column buckling
  //     are ULS (strength) checks performed under factored loads.
  // So the only serviceability check among the options is the L/360 live-load
  // deflection limit. The others are all strength/stability (ULS) checks.
  {
    id: "cv_limit_states",
    slug: "civil-serviceability-vs-ultimate-limit-states",
    title: "Classifying a Serviceability Limit-State Check",
    prompt:
      "During a design review a junior engineer asks you which of the following four checks is a Serviceability Limit State (SLS) check, as opposed to an Ultimate Limit State (ULS) strength check.\n\nWhich one is the serviceability check?",
    discipline: "CIVIL",
    difficulty: "EASY",
    eloWeight: 16,
    tags: ["limit-states", "serviceability", "design-decision"],
    skillAreas: ["structural-analysis"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      { id: "a", label: "Limiting live-load deflection to span/360", correct: true },
      { id: "b", label: "Confirming the factored moment Mu does not exceed phi*Mn" },
      { id: "c", label: "Checking the column against Euler/inelastic buckling under factored axial load" },
      { id: "d", label: "Verifying the factored shear Vu does not exceed phi*Vn" },
    ],
    hints: [
      "Distinguish the purpose: ULS checks guard against collapse/strength failure under factored loads, while SLS checks govern in-service performance under unfactored (service) loads.",
      "Strength checks compare a factored demand to phi times a nominal capacity (moment, shear, axial/buckling); a deflection limit is about comfort and function, not safety.",
      "Identify the single option that limits in-service deformation rather than verifying a capacity - that is the serviceability check.",
    ],
    solution:
      "**Governing principle — limit-state classification.** Design checks split into two families. *Ultimate Limit States (ULS)* guard against collapse — strength and stability under *factored* loads, always cast as demand $\\le \\phi \\times$ (nominal capacity). *Serviceability Limit States (SLS)* govern in-service performance — deflection, vibration, cracking — evaluated under *unfactored* service loads. The task is to spot which check is about performance, not safety.\n" +
      "\n" +
      "**Step 1 — Classify each option.**\n" +
      "- (a) Limiting live-load deflection to $L/360$: controls comfort/function under service load → **SLS**.\n" +
      "- (b) $M_u \\le \\phi M_n$: factored flexural strength → ULS.\n" +
      "- (c) Column buckling under factored axial load: stability/strength → ULS.\n" +
      "- (d) $V_u \\le \\phi V_n$: factored shear strength → ULS.\n" +
      "\n" +
      "**Step 2 — Select.** Only (a) limits in-service deformation rather than verifying a capacity, so it is the serviceability check.\n" +
      "\n" +
      "**Key insight / trap.** The tell-tale of a ULS check is the form \"factored demand $\\le \\phi \\times$ nominal capacity\" — options b, c, and d all match it. A deflection limit expressed as a fraction of span ($L/360$, $L/240$) is the classic serviceability criterion and never carries load factors or a $\\phi$.\n" +
      "\n" +
      "**Final answer: Limiting live-load deflection to span/360 (option a).**",
  },
];
