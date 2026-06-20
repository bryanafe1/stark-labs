import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION:
  // Chlorine feed is a mass-rate dosing problem. The plant flow is given in
  // gal/min, so first convert to MGD:
  //   Q = 11,100 gal/min × 1440 min/day = 15,984,000 gal/day = 15.984 MGD.
  // In US plant practice the mass rate (lb/day) = dose (mg/L) × flow (MGD) ×
  // 8.34 (the lb-per-MG-per-mg/L unit conversion factor).
  //   M = 2.2 mg/L × 15.984 MGD × 8.34 = 293.3 lb/day ≈ 293 lb/day.
  {
    id: "ev_mass_loading_rate",
    slug: "environmental-pollutant-mass-loading-rate",
    title: "Chlorine Feed Rate for a Water Plant",
    prompt:
      "A surface-water treatment plant runs its high-service pumps at a steady\n" +
      "11,100 gallons per minute. The operators must maintain a chlorine dose of\n" +
      "2.2 mg/L at the point of application to achieve disinfection.\n\n" +
      "Determine the chemical feed rate the chlorinator must deliver, and report\n" +
      "it in pounds per day (lb/day), rounded to the nearest whole pound.",
    discipline: "ENVIRONMENTAL",
    difficulty: "EASY",
    eloWeight: 15,
    tags: ["chlorine-dose", "chemical-feed", "mass-rate"],
    skillAreas: ["water-treatment", "environmental-chemistry"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 293,
    tolerance: 4,
    unit: "lb/day",
    hints: [
      "Chemical feed is a mass-per-time problem: it combines how concentrated the dose is with how much water passes per day.",
      "The classic US shortcut is lb/day = dose (mg/L) × flow (MGD) × 8.34, but the flow here is given per minute — convert it to million gallons per day first.",
      "There are 1440 minutes in a day. Compute the MGD flow, then multiply dose × MGD × 8.34.",
    ],
    solution:
      "**Governing principle — chemical feed as a mass rate.** A chlorinator must " +
      "deliver chemical at a *mass per unit time* equal to the product of the dose " +
      "(mass of chlorine per volume of water) and the volumetric throughput. This is " +
      "the standard waterworks dosing relation; it applies because the dose is a target " +
      "concentration that must be sustained against a continuous flow.\n\n" +
      "**Step 1 — Convert the flow to MGD.** The lb/day shortcut requires flow in " +
      "million gallons per day:\n" +
      "$$Q = 11{,}100\\ \\tfrac{\\text{gal}}{\\text{min}} \\times 1440\\ \\tfrac{\\text{min}}{\\text{day}} = 15{,}984{,}000\\ \\tfrac{\\text{gal}}{\\text{day}} = 15.984\\ \\text{MGD}.$$\n\n" +
      "**Step 2 — Apply the mass-rate (lb/day) relation.** In US units the unit " +
      "conversion factor that turns mg/L × MGD into lb/day is **8.34** (the weight in " +
      "pounds of one million gallons of water per mg/L):\n" +
      "$$M = \\text{dose} \\times Q \\times 8.34 = 2.2\\ \\tfrac{\\text{mg}}{\\text{L}} \\times 15.984\\ \\text{MGD} \\times 8.34.$$\n\n" +
      "**Step 3 — Arithmetic.**\n" +
      "$$M = 2.2 \\times 15.984 \\times 8.34 = 293.3\\ \\text{lb/day}.$$\n\n" +
      "**Key insight / trap:** the dose is in mg/L and the flow is in gal/min — you must " +
      "convert the flow to MGD *before* using the 8.34 factor. Forgetting the 1440 " +
      "min/day conversion (or using flow in gpm directly) is the classic error.\n\n" +
      "**Final answer: ≈ 293 lb/day.**",
  },
  // SOLUTION:
  // HRT = V / Q. First build the working volume from the basin dimensions:
  //   V = L × W × depth = 35 m × 10 m × 4.0 m = 1400 m³.
  // The flow is given in m³/s, so HRT = V/Q is in seconds; convert to hours.
  //   HRT = 1400 m³ / 0.090 m³/s = 15,555.6 s ÷ 3600 s/h = 4.32 h ≈ 4.3 h.
  {
    id: "ev_hydraulic_retention_time",
    slug: "environmental-hydraulic-retention-time",
    title: "Detention Time of a Sedimentation Basin",
    prompt:
      "A rectangular sedimentation basin is 35 m long, 10 m wide, and operates at\n" +
      "a water depth of 4.0 m. It receives a steady flow of 0.090 m³/s.\n\n" +
      "Operators want to know the average time a parcel of water resides in the\n" +
      "basin, since particle removal depends on it.\n\n" +
      "Determine that residence time and report it in hours, rounded to\n" +
      "1 decimal place.",
    discipline: "ENVIRONMENTAL",
    difficulty: "EASY",
    eloWeight: 14,
    tags: ["hydraulic-retention-time", "sedimentation", "design"],
    skillAreas: ["water-treatment", "hydraulics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 4.3,
    tolerance: 0.1,
    unit: "h",
    hints: [
      "Residence (detention) time is the basin volume divided by the volumetric flow through it.",
      "The volume is not given directly — build it from the rectangular geometry (length × width × water depth).",
      "Flow is in m³/s, so V/Q comes out in seconds; divide by 3600 to report hours.",
    ],
    solution:
      "**Governing principle — hydraulic retention time (HRT).** The average time a " +
      "parcel of water spends in a flow-through tank is the working volume divided by " +
      "the volumetric flow, $HRT = V/Q$. This holds for a steady, constant-volume " +
      "basin and is the quantity that controls how long particles have to settle.\n\n" +
      "**Step 1 — Build the working volume from geometry.** The volume isn't given, so " +
      "compute it from length × width × *water depth* (not tank height):\n" +
      "$$V = L \\times W \\times d = 35\\ \\text{m} \\times 10\\ \\text{m} \\times 4.0\\ \\text{m} = 1400\\ \\text{m}^3.$$\n\n" +
      "**Step 2 — Apply $HRT = V/Q$.** With flow in m³/s the result is in seconds:\n" +
      "$$HRT = \\frac{1400\\ \\text{m}^3}{0.090\\ \\text{m}^3/\\text{s}} = 15{,}555.6\\ \\text{s}.$$\n\n" +
      "**Step 3 — Convert to hours.**\n" +
      "$$HRT = \\frac{15{,}555.6\\ \\text{s}}{3600\\ \\text{s/h}} = 4.32\\ \\text{h}.$$\n\n" +
      "**Key insight / trap:** use the *water depth*, not any freeboard, for the volume, " +
      "and keep the time units straight — a flow in m³/s gives HRT in seconds, so the " +
      "÷3600 step is essential.\n\n" +
      "**Final answer: ≈ 4.3 h.**",
  },
  // SOLUTION:
  // Clarifier sizing is governed by the surface overflow rate (SOR = Q / A),
  // not by depth/volume. To not exceed a design SOR, required plan area
  // A = Q / SOR. Convert flow to m³/day to match the SOR units.
  // Q = 0.30 m³/s × 86,400 s/day = 25,920 m³/day.
  // A = 25,920 / 35 = 740.6 m².
  {
    id: "ev_stokes_settling_velocity",
    slug: "environmental-stokes-settling-velocity",
    title: "Sizing a Clarifier by Overflow Rate",
    prompt:
      "A circular primary clarifier must handle a steady flow of 0.30 m³/s. To\n" +
      "keep discrete particles from being swept over the weir, the design must\n" +
      "not exceed a surface overflow rate of 35 m³ per m² per day (i.e. 35 m/day).\n\n" +
      "Determine the minimum required clarifier surface (plan) area and report it\n" +
      "in m², rounded to the nearest whole m².",
    discipline: "ENVIRONMENTAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["surface-overflow-rate", "clarifier", "sedimentation"],
    skillAreas: ["water-treatment", "hydraulics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 741,
    tolerance: 8,
    unit: "m²",
    hints: [
      "Clarifier performance for discrete settling is governed by surface overflow rate (flow per unit plan area), independent of depth.",
      "Rearrange SOR = Q / A to solve for the area that keeps the rate at or below the design limit: A = Q / SOR.",
      "The SOR is per day but the flow is per second — convert Q to m³/day (× 86,400) so the units cancel to m².",
    ],
    solution:
      "**Governing principle — surface overflow rate (SOR).** Discrete-particle removal " +
      "in a clarifier is governed by the *overflow rate* $SOR = Q/A$ (flow per unit plan " +
      "area), which equals the critical settling velocity a particle must exceed to be " +
      "captured. Crucially this depends on plan area, **not** depth or volume. To stay at " +
      "or below a design SOR, the required area is $A = Q/SOR$.\n\n" +
      "**Step 1 — Match units: convert flow to m³/day.** The SOR is 35 m³/(m²·day) = " +
      "35 m/day, so flow must be in m³/day:\n" +
      "$$Q = 0.30\\ \\tfrac{\\text{m}^3}{\\text{s}} \\times 86{,}400\\ \\tfrac{\\text{s}}{\\text{day}} = 25{,}920\\ \\tfrac{\\text{m}^3}{\\text{day}}.$$\n\n" +
      "**Step 2 — Solve for the required area.**\n" +
      "$$A = \\frac{Q}{SOR} = \\frac{25{,}920\\ \\text{m}^3/\\text{day}}{35\\ \\text{m}/\\text{day}} = 740.6\\ \\text{m}^2.$$\n\n" +
      "**Key insight / trap:** clarifier capacity is set by *area*, not depth — a common " +
      "mistake is to reach for volume or detention time. Also convert the per-second flow " +
      "to per-day so the time units cancel and the answer comes out in m².\n\n" +
      "**Final answer: ≈ 741 m².**",
  },
  // SOLUTION:
  // The basicity is given via hydroxide. First pOH = -log10[OH-], then use the
  // water relation pH + pOH = 14 (at 25 °C).
  // pOH = -log10(4.0e-4) = 3.40.
  // pH = 14 - 3.40 = 10.60.
  {
    id: "ev_ph_from_proton_concentration",
    slug: "environmental-ph-from-hydrogen-ion",
    title: "pH of a Caustic-Dosed Stream",
    prompt:
      "During lime-softening, an operator measures the hydroxide-ion\n" +
      "concentration of a process stream as [OH⁻] = 4.0·10⁻⁴ mol/L at 25 °C.\n\n" +
      "Determine the pH of the stream (dimensionless), rounded to 2 decimal\n" +
      "places.",
    discipline: "ENVIRONMENTAL",
    difficulty: "MEDIUM",
    eloWeight: 21,
    tags: ["ph", "acid-base", "water-chemistry"],
    skillAreas: ["environmental-chemistry", "water-treatment"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 10.6,
    tolerance: 0.05,
    unit: "",
    hints: [
      "You are given hydroxide, not hydrogen ion, so it is easiest to work with pOH first.",
      "pOH = -log10[OH⁻]; then use the water dissociation relation that links pH and pOH at 25 °C.",
      "At 25 °C, pH + pOH = 14, so pH = 14 - pOH.",
    ],
    solution:
      "**Governing principle — water autoionization.** At 25 °C the ion product of water " +
      "fixes $[\\text{H}^+][\\text{OH}^-] = 10^{-14}$, which in log form is the relation " +
      "$pH + pOH = 14$. Because you're given hydroxide rather than hydrogen ion, the " +
      "cleanest path is to compute pOH first and convert.\n\n" +
      "**Step 1 — Compute pOH from the hydroxide concentration.**\n" +
      "$$pOH = -\\log_{10}[\\text{OH}^-] = -\\log_{10}(4.0 \\times 10^{-4}).$$\n" +
      "$$pOH = -(\\log_{10}4.0 + \\log_{10}10^{-4}) = -(0.602 - 4) = 3.40.$$\n\n" +
      "**Step 2 — Convert to pH using the water relation.**\n" +
      "$$pH = 14 - pOH = 14 - 3.40 = 10.60.$$\n\n" +
      "**Key insight / trap:** don't plug the hydroxide concentration into a pH formula " +
      "directly — that would give pOH, not pH. A value of 10.6 also passes the sanity " +
      "check: a caustic, lime-softened stream should be basic (pH > 7).\n\n" +
      "**Final answer: pH ≈ 10.60.**",
  },
  // SOLUTION:
  // Two treatment units in series. Each acts on what survives the previous one.
  // After primary (35% removal): 250 × (1 - 0.35) = 162.5 mg/L.
  // After secondary (88% removal of that): 162.5 × (1 - 0.88) = 19.5 mg/L.
  // Overall removal = (250 - 19.5)/250 × 100% = 92.2%.
  {
    id: "ev_removal_efficiency",
    slug: "environmental-treatment-removal-efficiency",
    title: "Overall Removal Across Two Stages",
    prompt:
      "A wastewater plant treats an influent with a BOD₅ of 250 mg/L. The\n" +
      "primary clarifier removes 35% of the incoming BOD, and the activated-\n" +
      "sludge stage that follows removes 88% of whatever BOD reaches it.\n\n" +
      "Determine the overall (plant-wide) BOD removal efficiency and report it\n" +
      "in percent, rounded to 1 decimal place.",
    discipline: "ENVIRONMENTAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["removal-efficiency", "bod", "series-process"],
    skillAreas: ["water-treatment", "environmental-chemistry"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 92.2,
    tolerance: 0.8,
    unit: "%",
    hints: [
      "Removals in series are not added — each stage only acts on the BOD that survives the stage before it.",
      "Track the concentration through the train: multiply the influent by (1 - efficiency) for the primary, then again by (1 - efficiency) for the secondary.",
      "Overall efficiency = (influent - final effluent) / influent × 100%. Equivalently, 1 - (0.65)(0.12).",
    ],
    solution:
      "**Governing principle — fractions surviving multiply in series.** Removal " +
      "efficiencies are *not additive*. Each unit acts only on whatever pollutant reaches " +
      "it, so the fractions that *survive* multiply. The overall surviving fraction is " +
      "$(1-\\eta_1)(1-\\eta_2)$, and overall removal is one minus that.\n\n" +
      "**Step 1 — Concentration after the primary clarifier (35% removal).**\n" +
      "$$C_1 = 250 \\times (1 - 0.35) = 250 \\times 0.65 = 162.5\\ \\text{mg/L}.$$\n\n" +
      "**Step 2 — Concentration after activated sludge (88% of what arrives).**\n" +
      "$$C_2 = 162.5 \\times (1 - 0.88) = 162.5 \\times 0.12 = 19.5\\ \\text{mg/L}.$$\n\n" +
      "**Step 3 — Overall removal efficiency.**\n" +
      "$$\\eta = \\frac{C_{in} - C_{out}}{C_{in}} \\times 100\\% = \\frac{250 - 19.5}{250} \\times 100\\% = 92.2\\%.$$\n" +
      "Equivalently, $\\eta = [1 - (0.65)(0.12)] \\times 100\\% = (1 - 0.078) \\times 100\\% = 92.2\\%.$\n\n" +
      "**Key insight / trap:** adding 35% + 88% = 123% is nonsense — efficiencies stack " +
      "multiplicatively through the surviving fractions, never by simple addition.\n\n" +
      "**Final answer: ≈ 92.2%.**",
  },
  // SOLUTION:
  // Steady well-mixed box model: C = E/(u·W·H). Doubling wind speed u halves C.
  // Reasoning judgment: stronger wind ventilates the box faster, so the
  // steady-state concentration is inversely proportional to u — it is halved.
  // Correct answer: it drops to half.
  {
    id: "ev_pipe_continuity_mc",
    slug: "environmental-pipe-continuity-velocity",
    title: "Box-Model Response to Wind Speed",
    prompt:
      "An urban airshed is treated as a well-mixed box. The steady-state\n" +
      "pollutant concentration is set by the balance between a fixed ground-level\n" +
      "emission rate and the rate at which wind ventilates the box (the box is\n" +
      "fed by a constant cross-wind area and a constant mixing height).\n\n" +
      "If a frontal passage doubles the prevailing wind speed while the emission\n" +
      "rate, mixing height, and box width are unchanged, how does the long-term\n" +
      "steady-state concentration respond?",
    discipline: "ENVIRONMENTAL",
    difficulty: "MEDIUM",
    eloWeight: 20,
    tags: ["box-model", "air-quality", "ventilation"],
    skillAreas: ["air-quality", "environmental-chemistry"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      { id: "a", label: "It is unchanged, because emissions did not change." },
      { id: "b", label: "It falls to one-half of its previous value.", correct: true },
      { id: "c", label: "It falls to one-quarter of its previous value." },
      { id: "d", label: "It doubles, because more air carries more pollutant." },
    ],
    hints: [
      "Write the steady-state mass balance for the box: emissions in must equal the rate at which moving air carries pollutant out.",
      "That balance gives C = E / (u · W · H), so concentration depends on wind speed in a simple, direct algebraic way.",
      "Hold E, W, and H fixed and ask what happens to C when only u is multiplied by two.",
    ],
    solution:
      "**Governing principle — steady-state box (well-mixed) model.** At steady state the " +
      "emission rate into the box equals the rate at which moving air carries pollutant " +
      "out. With emission rate $E$, wind speed $u$, box width $W$, and mixing height $H$, " +
      "the mass balance is\n" +
      "$$E = C \\cdot u \\cdot W \\cdot H \\quad\\Rightarrow\\quad C = \\frac{E}{u\\,W\\,H}.$$\n\n" +
      "**Step 1 — Identify the dependence on wind speed.** Holding $E$, $W$, and $H$ " +
      "fixed, $C \\propto 1/u$ — concentration is *inversely proportional* to wind speed.\n\n" +
      "**Step 2 — Apply the doubling.** Replace $u$ with $2u$:\n" +
      "$$C_{new} = \\frac{E}{(2u)\\,W\\,H} = \\tfrac{1}{2}\\cdot\\frac{E}{u\\,W\\,H} = \\tfrac{1}{2}C.$$\n\n" +
      "So the concentration falls to **one-half** — option (b).\n\n" +
      "**Why the distractors fail:**\n" +
      "- (a) *Unchanged* — wrong: ventilation rate depends on $u$, so even with fixed " +
      "emissions the steady concentration changes.\n" +
      "- (c) *One-quarter* — confuses this with an inverse-square law; the dependence is " +
      "linear in $u$, not $u^2$.\n" +
      "- (d) *Doubles* — backwards; faster wind dilutes more, it does not concentrate.\n\n" +
      "**Key insight:** stronger wind ventilates the box faster, and because $C \\propto " +
      "1/u$, doubling $u$ exactly halves the steady-state concentration.\n\n" +
      "**Final answer: It falls to one-half of its previous value.**",
  },
  // SOLUTION:
  // Rational method: Q = C·i·A. In US customary units the conversion factor is
  // 1.008 ≈ 1, so with i in in/hr and A in ACRES, Q comes out in cfs directly.
  // The drainage area is given in ft², so convert first (1 acre = 43,560 ft²):
  //   A = 522,720 ft² ÷ 43,560 = 12.0 acres.
  //   Q = 0.55 × 2.4 in/hr × 12.0 ac = 15.84 cfs ≈ 15.8 cfs.
  {
    id: "ev_settling_regime_mc",
    slug: "environmental-rational-method-peak-runoff",
    title: "Peak Runoff from a Catchment",
    prompt:
      "A commercial parcel with a drainage area of 522,720 ft² has a composite\n" +
      "runoff coefficient of 0.55. For the design storm, the rainfall intensity\n" +
      "at the catchment's time of concentration is 2.4 in/hr.\n\n" +
      "Estimate the peak runoff rate leaving the parcel and report it in cubic\n" +
      "feet per second (cfs), rounded to 1 decimal place.",
    discipline: "ENVIRONMENTAL",
    difficulty: "MEDIUM",
    eloWeight: 21,
    tags: ["rational-method", "runoff", "hydrology"],
    skillAreas: ["hydraulics", "water-treatment"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 15.8,
    tolerance: 0.3,
    unit: "cfs",
    hints: [
      "Peak runoff from a small catchment is the rational method, which combines the runoff coefficient, the design rainfall intensity, and the drainage area.",
      "The convenient form is Q (cfs) = C · i (in/hr) · A (acres), where the implicit unit factor is ≈ 1 — but it only works if the area is in acres.",
      "Convert the area first: 1 acre = 43,560 ft². Then multiply C × i × A.",
    ],
    solution:
      "**Governing principle — the rational method.** For a small, relatively uniform " +
      "catchment, peak runoff is estimated as $Q = C\\,i\\,A$, where $C$ is the runoff " +
      "coefficient, $i$ the design rainfall intensity, and $A$ the drainage area. In US " +
      "customary units the implicit unit factor is $1.008 \\approx 1$, so with $i$ in " +
      "in/hr and $A$ in **acres**, $Q$ comes out directly in cubic feet per second (cfs).\n\n" +
      "**Step 1 — Convert the area to acres.** The formula's unit magic only works in " +
      "acres, and the area is given in ft² (1 acre = 43,560 ft²):\n" +
      "$$A = \\frac{522{,}720\\ \\text{ft}^2}{43{,}560\\ \\text{ft}^2/\\text{acre}} = 12.0\\ \\text{acres}.$$\n\n" +
      "**Step 2 — Apply the rational method.**\n" +
      "$$Q = C\\,i\\,A = 0.55 \\times 2.4\\ \\tfrac{\\text{in}}{\\text{hr}} \\times 12.0\\ \\text{acres}.$$\n\n" +
      "**Step 3 — Arithmetic.**\n" +
      "$$Q = 0.55 \\times 2.4 \\times 12.0 = 15.84\\ \\text{cfs}.$$\n\n" +
      "**Key insight / trap:** the tidy $Q = CiA \\Rightarrow$ cfs identity depends on $A$ " +
      "being in acres and $i$ in in/hr. Using the area in ft² (or i in other units) breaks " +
      "the implicit 1.008 factor — convert first.\n\n" +
      "**Final answer: ≈ 15.8 cfs.**",
  },
  // SOLUTION:
  // Lake as a steady-state CSTR with first-order decay. Mass balance:
  //   0 = Q·C_in - Q·C - k·V·C  ->  C = Q·C_in / (Q + k·V).
  // Make units consistent (per day). Q = 0.5 m³/s × 86,400 = 43,200 m³/day.
  // k·V = 0.20 /day × 1.0e7 m³ = 2.0e6 m³/day.
  // C = (43,200 × 10) / (43,200 + 2,000,000) = 432,000 / 2,043,200 = 0.211 mg/L.
  {
    id: "ev_bod_do_sag_concept",
    slug: "environmental-lake-steady-state-decay",
    title: "Steady-State Concentration in a Decaying Lake",
    prompt:
      "A small lake of volume 1.0·10⁷ m³ is completely mixed. It receives a\n" +
      "stream inflow of 0.5 m³/s carrying a reactive pollutant at 10 mg/L, and\n" +
      "it discharges at the same flow rate. Within the lake the pollutant decays\n" +
      "by a first-order reaction with rate constant k = 0.20 per day.\n\n" +
      "After a long time the lake reaches steady state. Determine the long-term\n" +
      "in-lake pollutant concentration and report it in mg/L, rounded to\n" +
      "2 decimal places.",
    discipline: "ENVIRONMENTAL",
    difficulty: "HARD",
    eloWeight: 32,
    tags: ["mass-balance", "first-order-decay", "cstr"],
    skillAreas: ["environmental-chemistry", "water-treatment"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.21,
    tolerance: 0.02,
    unit: "mg/L",
    hints: [
      "Treat the completely mixed lake as a CSTR at steady state: accumulation is zero, so mass in = mass out by flow + mass destroyed by reaction.",
      "Write 0 = Q·C_in - Q·C - k·V·C and solve for C: C = Q·C_in / (Q + k·V).",
      "Watch the time units — k is per day, so convert the flow to m³/day (× 86,400) before combining with k·V.",
    ],
    solution:
      "**Governing principle — steady-state CSTR with first-order reaction.** A completely " +
      "mixed lake behaves as a CSTR. At steady state accumulation is zero, so the mass " +
      "balance is: in by flow = out by flow + destroyed by reaction:\n" +
      "$$0 = Q\\,C_{in} - Q\\,C - k\\,V\\,C \\quad\\Rightarrow\\quad C = \\frac{Q\\,C_{in}}{Q + k\\,V}.$$\n\n" +
      "**Step 1 — Make the time units consistent (per day).** $k$ is per day, so convert " +
      "the flow:\n" +
      "$$Q = 0.5\\ \\tfrac{\\text{m}^3}{\\text{s}} \\times 86{,}400\\ \\tfrac{\\text{s}}{\\text{day}} = 43{,}200\\ \\tfrac{\\text{m}^3}{\\text{day}}.$$\n\n" +
      "**Step 2 — Compute the reaction term $kV$.**\n" +
      "$$k\\,V = 0.20\\ \\text{day}^{-1} \\times 1.0 \\times 10^{7}\\ \\text{m}^3 = 2.0 \\times 10^{6}\\ \\tfrac{\\text{m}^3}{\\text{day}}.$$\n\n" +
      "**Step 3 — Substitute and solve.**\n" +
      "$$C = \\frac{(43{,}200)(10)}{43{,}200 + 2{,}000{,}000} = \\frac{432{,}000}{2{,}043{,}200} = 0.211\\ \\text{mg/L}.$$\n\n" +
      "**Key insight / trap:** the reaction term $kV$ ($2.0\\times10^6$) dwarfs the flow " +
      "term ($4.3\\times10^4$), so decay — not washout — controls the lake. Mixing time " +
      "units is the killer: $k$ is per *day*, so the flow must be in m³/day before you add " +
      "$Q + kV$.\n\n" +
      "**Final answer: ≈ 0.21 mg/L.**",
  },
  // SOLUTION:
  // Activated-sludge aeration-basin sizing from the food-to-microorganism ratio.
  //   F/M = (Q · S) / (V · X)  ->  V = (Q · S) / (F/M · X).
  // The mg/L → mass terms cancel in the ratio, so units stay consistent.
  // V = (8000 m³/day × 180 mg/L) / (0.30 /day × 2500 mg/L)
  //   = 1,440,000 / 750 = 1920 m³.
  // (Check: HRT = V/Q = 1920/8000 × 24 ≈ 5.8 h — a sensible aeration time.)
  {
    id: "ev_activated_sludge_fm_volume",
    slug: "environmental-activated-sludge-aeration-volume",
    title: "Aeration-Basin Volume from F/M Ratio",
    prompt:
      "An activated-sludge plant treats 8000 m³/day of settled wastewater whose\n" +
      "BOD₅ entering the aeration basin is 180 mg/L. The process is to be\n" +
      "operated at a mixed-liquor volatile suspended solids (MLVSS) concentration\n" +
      "of 2500 mg/L, and the design target food-to-microorganism (F/M) ratio is\n" +
      "0.30 per day.\n\n" +
      "Determine the required aeration-basin volume and report it in m³, rounded\n" +
      "to the nearest 10 m³.",
    discipline: "ENVIRONMENTAL",
    difficulty: "EXPERT",
    eloWeight: 38,
    tags: ["activated-sludge", "f-m-ratio", "aeration-basin"],
    skillAreas: ["water-treatment", "reaction-engineering"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 1920,
    tolerance: 20,
    unit: "m³",
    hints: [
      "The F/M ratio is the daily mass of BOD fed (food) divided by the mass of microorganisms (MLVSS) held in the basin.",
      "Express it as F/M = (Q · S) / (V · X), then rearrange to solve for the unknown basin volume V.",
      "The mg/L concentration terms appear in both food and biomass, so they cancel in the ratio — V = (Q · S) / (F/M · X).",
    ],
    solution:
      "**Governing principle — the food-to-microorganism (F/M) ratio.** Activated-sludge " +
      "aeration basins are sized so the daily mass of BOD applied (the *food*) matches the " +
      "mass of microorganisms (MLVSS) held in the basin at the design loading:\n" +
      "$$\\frac{F}{M} = \\frac{Q\\,S}{V\\,X},$$\n" +
      "where $Q$ is flow, $S$ the influent BOD, $V$ the basin volume, and $X$ the MLVSS. " +
      "Solving for the unknown volume:\n" +
      "$$V = \\frac{Q\\,S}{(F/M)\\,X}.$$\n\n" +
      "**Step 1 — List the knowns.** $Q = 8000$ m³/day, $S = 180$ mg/L, " +
      "$F/M = 0.30$ day⁻¹, $X = 2500$ mg/L.\n\n" +
      "**Step 2 — Substitute.** The mg/L terms ($S$ and $X$) appear in numerator and " +
      "denominator, so they cancel and units stay consistent:\n" +
      "$$V = \\frac{8000\\ \\tfrac{\\text{m}^3}{\\text{day}} \\times 180\\ \\tfrac{\\text{mg}}{\\text{L}}}{0.30\\ \\text{day}^{-1} \\times 2500\\ \\tfrac{\\text{mg}}{\\text{L}}}.$$\n\n" +
      "**Step 3 — Arithmetic.**\n" +
      "$$V = \\frac{1{,}440{,}000}{750} = 1920\\ \\text{m}^3.$$\n\n" +
      "**Step 4 — Sanity check via HRT.** $HRT = V/Q = (1920/8000)\\times 24 \\approx 5.8$ " +
      "hours — a realistic aeration time for conventional activated sludge.\n\n" +
      "**Key insight / trap:** because both $S$ and $X$ are concentrations (mg/L), their " +
      "units cancel — you do **not** need to convert them to mass. Just keep $Q$ in m³/day " +
      "and $F/M$ in day⁻¹ so the time units match.\n\n" +
      "**Final answer: ≈ 1920 m³.**",
  },
];
