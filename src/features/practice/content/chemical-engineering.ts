import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION:
  // Reactor + separator + recycle loop. Reactant A is consumed only by reaction.
  // Single-pass conversion (across the reactor) = 25%. All unreacted A leaving the
  // separator is recycled (no purge on A), so at steady state the OVERALL conversion
  // of fresh feed is effectively 100% — every mole of fresh A must eventually react.
  // Fresh feed A = 100 mol/h => reactor must consume 100 mol/h of A at steady state.
  // Reactor consumes (single-pass conv)*(reactor-inlet A): 100 = 0.25 * F_in
  //   => F_in (combined reactor inlet A) = 400 mol/h.
  // Combined inlet = fresh feed + recycle:  400 = 100 + R  => R = 300 mol/h.
  {
    id: "ch_mass_balance_split",
    slug: "chemical-steady-state-mass-balance-split",
    title: "Sizing the Recycle Stream Around a Low-Conversion Reactor",
    prompt:
      "A reactant A is fed to a process where it is converted by an irreversible reaction. The reactor achieves only a 25% single-pass conversion of A. The reactor effluent goes to a separator that recovers all unreacted A and recycles it back to mix with the fresh feed; product is withdrawn essentially A-free.\n\nThe fresh feed of A to the process is 100 mol/h, and the system operates at steady state with no purge on the A stream.\n\nDetermine the molar flow rate of A in the recycle stream, in mol/h. Round to the nearest whole number.",
    discipline: "CHEMICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["mass-balance", "recycle", "conversion"],
    skillAreas: ["reaction-engineering", "transport-phenomena"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 300,
    tolerance: 3,
    unit: "mol/h",
    hints: [
      "Draw the system boundary around the whole process (reactor + separator). With no purge and the product withdrawn A-free, ask how much fresh A must ultimately react at steady state.",
      "Single-pass conversion applies to the COMBINED reactor inlet (fresh feed + recycle), not to the fresh feed. Write moles A consumed = 0.25 × (reactor-inlet A).",
      "Set reactor consumption equal to the fresh A that must disappear, solve for reactor-inlet A, then recycle = reactor-inlet A − fresh feed.",
    ],
    solution:
      "**Governing principle — steady-state species balance on a reactor-with-recycle loop.** At steady state, accumulation is zero, so for reactant $A$ the rate of generation/consumption must close against the inlet and outlet flows. The key is choosing the right control volume for each question.\n\n" +
      "**Step 1 — Overall balance (boundary around the whole process):** $A$ enters only in the fresh feed (100 mol/h) and leaves only by reacting, because the product is withdrawn essentially $A$-free and there is no purge. With no place for $A$ to accumulate or escape, every mole of fresh $A$ must eventually react:\n$$\\dot n_{A,\\text{consumed}} = \\dot n_{A,\\text{fresh}} = 100\\ \\text{mol/h}.$$\nThis means the *overall* conversion is effectively 100%, even though each pass converts only 25%.\n\n" +
      "**Step 2 — Reactor (single-pass) balance:** The 25% single-pass conversion applies to the *combined* reactor inlet $F_{\\text{in}}$ (fresh + recycle), not to the fresh feed alone. The moles consumed per pass are\n$$\\dot n_{A,\\text{consumed}} = 0.25\\,F_{\\text{in}}.$$\n\n" +
      "**Step 3 — Equate consumption to the fresh A that must disappear:**\n$$0.25\\,F_{\\text{in}} = 100 \\;\\Rightarrow\\; F_{\\text{in}} = \\frac{100}{0.25} = 400\\ \\text{mol/h}.$$\n\n" +
      "**Step 4 — Mixing-point balance to get the recycle:** The reactor inlet is the sum of fresh feed and recycle $R$:\n$$F_{\\text{in}} = \\dot n_{A,\\text{fresh}} + R \\;\\Rightarrow\\; R = 400 - 100 = 300\\ \\text{mol/h}.$$\n\n" +
      "**Key insight / trap:** Do not apply the 25% conversion to the fresh feed (that would give only 25 mol/h consumed and violate the overall balance). The single-pass conversion always references the actual reactor inlet, which the recycle inflates. The large recycle (3× the fresh feed) is exactly what lets a low single-pass conversion achieve near-complete overall conversion.\n\n" +
      "**Final answer: $R = 300\\ \\text{mol/h}$.**",
  },
  // SOLUTION:
  // For positive-order kinetics (here first order), the CSTR operates entirely at the
  // low exit concentration, so its average rate is low and it needs MORE volume than a
  // PFR for the same conversion. For first order, isothermal, constant flow Q and rate k:
  //   PFR: V = (Q/k) ln(1/(1-X)) ; CSTR: V = (Q/k) X/(1-X).
  // At X=0.9: PFR factor = ln(10) = 2.303, CSTR factor = 9, ratio CSTR/PFR ~ 3.9.
  // Correct statement: the CSTR requires a larger volume than the PFR (by ~4x here).
  // Distractors invert the comparison, claim equality, or misattribute the cause.
  {
    id: "ch_mole_fraction",
    slug: "chemical-mole-fraction-and-molar-mass",
    title: "CSTR Versus PFR for a Target Conversion",
    prompt:
      "A first-order, irreversible, isothermal liquid-phase reaction is to be run at a fixed volumetric flow rate to reach 90% conversion of the reactant. An engineer must choose between a single CSTR and a single PFR of the same rate constant.\n\nWhich statement correctly compares the required reactor volumes and the reason?",
    discipline: "CHEMICAL",
    difficulty: "HARD",
    eloWeight: 28,
    tags: ["reaction-engineering", "reactor-design", "cstr-pfr"],
    skillAreas: ["reaction-engineering"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "The CSTR needs a substantially larger volume, because it operates entirely at the low exit concentration where the rate is slowest.",
        correct: true,
      },
      {
        id: "b",
        label:
          "The PFR needs a larger volume, because plug flow gives no back-mixing to speed up the reaction.",
      },
      {
        id: "c",
        label:
          "Both require the same volume, since volume depends only on conversion and rate constant, not reactor type.",
      },
      {
        id: "d",
        label:
          "The CSTR needs a smaller volume, because perfect mixing keeps the concentration high throughout.",
      },
    ],
    hints: [
      "A CSTR runs at its EXIT condition everywhere inside it; a PFR sees a concentration that falls gradually from inlet to outlet.",
      "For a positive-order rate, lower concentration means slower rate, so the reactor operating at the lowest concentration is the least efficient per unit volume.",
      "Compare the design factors at X = 0.9: PFR uses ln(1/(1−X)) ≈ 2.3, CSTR uses X/(1−X) = 9. Which reactor is bigger, and why?",
    ],
    solution:
      "**Governing principle — reactor design equations link volume to the rate at the conditions inside the reactor.** A CSTR is perfectly mixed, so its entire volume sits at the *exit* (lowest) concentration; a PFR's concentration declines gradually from inlet to outlet. For any positive-order rate, lower concentration means slower rate, so where a reactor operates determines how much volume it needs.\n\n" +
      "**Step 1 — Write the design equations** (first-order, $-r_A = kC_A$, constant $Q$, isothermal):\n$$V_{\\text{PFR}} = \\frac{Q}{k}\\ln\\!\\frac{1}{1-X}, \\qquad V_{\\text{CSTR}} = \\frac{Q}{k}\\,\\frac{X}{1-X}.$$\nThe PFR integrates over a falling concentration; the CSTR uses the single exit concentration throughout.\n\n" +
      "**Step 2 — Evaluate the design factors at $X = 0.9$:**\n$$\\text{PFR factor} = \\ln\\frac{1}{1-0.9} = \\ln 10 = 2.303,$$\n$$\\text{CSTR factor} = \\frac{0.9}{1-0.9} = \\frac{0.9}{0.1} = 9.$$\n\n" +
      "**Step 3 — Take the ratio:**\n$$\\frac{V_{\\text{CSTR}}}{V_{\\text{PFR}}} = \\frac{9}{2.303} \\approx 3.9.$$\nThe CSTR needs roughly 4× the PFR volume for the same 90% conversion.\n\n" +
      "**Step 4 — Why each distractor fails:**\n- **(b)** Inverts the comparison: plug flow is *more* efficient, not less; back-mixing in a CSTR is what hurts it here.\n- **(c)** False — volume depends on the concentration history the rate sees, which differs by reactor type; only at $X\\to 0$ do the two converge.\n- **(d)** Wrong physically: perfect mixing pulls the *whole* vessel down to the low exit concentration, not up to a high one.\n\n" +
      "**Key insight / trap:** The CSTR's perfect mixing is a liability for a single positive-order reaction — it dilutes the feed instantly to exit conditions where the rate is slowest. The gap grows with conversion (at $X=0.99$ the CSTR is ~21× the PFR).\n\n" +
      "**Final answer: (a) — the CSTR needs a substantially larger volume because it operates entirely at the low exit concentration where the rate is slowest.**",
  },
  // SOLUTION:
  // First convert to ABSOLUTE pressure: P_abs = P_gauge + P_atm = 1 atm + 1 atm = 2 atm
  //   = 2 * 101325 = 202650 Pa.
  // Ideal gas: n = PV/(RT) = (202650 Pa * 0.05 m^3) / (8.314 * 300)
  //   = 10132.5 / 2494.2 = 4.062 mol.
  // CO2 molar mass from formula = 12.01 + 2*16.00 ~ 44 g/mol, so
  //   mass = n*M = 4.062 * 44 = 178.7 g = 0.1787 kg. Round to 2 decimals => 0.18 kg.
  {
    id: "ch_ideal_gas",
    slug: "chemical-ideal-gas-moles",
    title: "Charge of CO2 Held in a Rigid Receiver",
    prompt:
      "A rigid receiver of volume 0.05 m^3 is filled with carbon dioxide and equilibrates at a gauge pressure of 1.0 atm while the local barometer reads 1.0 atm; the contents sit at 300 K. Treat the gas as ideal and take 1 atm = 101325 Pa and R = 8.314 J/(mol·K). Use the molar mass of CO2 implied by its chemical formula.\n\nDetermine the mass of CO2 contained in the receiver, in kilograms. Round to 2 decimal places.",
    discipline: "CHEMICAL",
    difficulty: "MEDIUM",
    eloWeight: 20,
    tags: ["ideal-gas", "thermodynamics", "unit-conversion"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.18,
    tolerance: 0.01,
    unit: "kg",
    hints: [
      "The ideal-gas law needs ABSOLUTE pressure. Convert the gauge reading first: P_abs = P_gauge + P_atm.",
      "Find moles with n = PV/(RT), keeping SI units (Pa, m^3, K) so n comes out in mol.",
      "Build the molar mass of CO2 from its atoms (C ≈ 12, O ≈ 16) and multiply by n; then convert grams to kilograms.",
    ],
    solution:
      "**Governing principle — the ideal-gas law $PV = nRT$ requires ABSOLUTE pressure and consistent SI units.** Gauge pressure measures above the local atmosphere, so it must be converted before the EOS can be applied.\n\n" +
      "**Step 1 — Convert to absolute pressure:**\n$$P_{\\text{abs}} = P_{\\text{gauge}} + P_{\\text{atm}} = 1.0\\ \\text{atm} + 1.0\\ \\text{atm} = 2.0\\ \\text{atm}.$$\nIn SI: $P_{\\text{abs}} = 2.0 \\times 101325 = 202{,}650\\ \\text{Pa}.$\n\n" +
      "**Step 2 — Solve for moles with the ideal-gas law:**\n$$n = \\frac{PV}{RT} = \\frac{(202{,}650\\ \\text{Pa})(0.05\\ \\text{m}^3)}{(8.314\\ \\text{J/mol·K})(300\\ \\text{K})} = \\frac{10{,}132.5}{2494.2} = 4.062\\ \\text{mol}.$$\nUnits check: Pa·m³ = J, divided by J/mol = mol. ✓\n\n" +
      "**Step 3 — Build the molar mass of CO₂ from its formula:**\n$$M_{\\text{CO}_2} = 12.01 + 2(16.00) \\approx 44\\ \\text{g/mol}.$$\n\n" +
      "**Step 4 — Compute the mass and convert to kg:**\n$$m = nM = 4.062\\ \\text{mol} \\times 44\\ \\text{g/mol} = 178.7\\ \\text{g} = 0.1787\\ \\text{kg}.$$\n\n" +
      "**Key insight / trap:** The most common error is plugging the gauge pressure (1 atm) directly into $PV=nRT$, which halves the answer to ~0.09 kg. Always convert gauge → absolute first, and keep everything in Pa, m³, K so $n$ falls out in mol.\n\n" +
      "**Final answer: $m \\approx 0.18\\ \\text{kg}$.**",
  },
  // SOLUTION:
  // Steam generation duty on 100 kg/h of water entering at 20 C, made into saturated
  // steam at 100 C. Two contributions:
  //   Sensible: Q1 = m*cp*dT = 100 * 4.18 * (100-20) = 33,440 kJ/h.
  //   Latent:   Q2 = m*hfg = 100 * 2257 = 225,700 kJ/h.
  //   Q = Q1 + Q2 = 259,140 kJ/h. Convert to kW: 259140/3600 = 71.98 kW.
  {
    id: "ch_energy_balance",
    slug: "chemical-sensible-heat-energy-balance",
    title: "Boiler Duty to Raise Saturated Steam",
    prompt:
      "A small boiler takes in 100 kg/h of liquid water at 20 °C and discharges it as saturated steam at 100 °C. Use cp(liquid water) = 4.18 kJ/(kg·K) and a latent heat of vaporization hfg = 2257 kJ/kg at 100 °C; neglect pressure effects on the liquid enthalpy.\n\nDetermine the total heat duty the boiler must supply, expressed in kilowatts (kW). Round to 1 decimal place.",
    discipline: "CHEMICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["energy-balance", "latent-heat", "heat-duty"],
    skillAreas: ["heat-transfer", "thermodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 72.0,
    tolerance: 0.8,
    unit: "kW",
    hints: [
      "The duty has two parts: heating the liquid from 20 °C up to its boiling point (sensible), then boiling it at 100 °C (latent). Add them.",
      "Sensible term = m·cp·ΔT; latent term = m·hfg. Both use the same 100 kg/h flow.",
      "Your sum is in kJ/h. Divide by 3600 s/h to convert to kJ/s = kW before rounding.",
    ],
    solution:
      "**Governing principle — steady-flow energy balance on the boiler.** With no shaft work and negligible kinetic/potential changes, the heat duty equals the enthalpy change of the water stream: $\\dot Q = \\dot m\\,\\Delta h$. The path from subcooled liquid to saturated vapor splits naturally into a sensible-heating leg and a latent (phase-change) leg.\n\n" +
      "**Step 1 — Sensible heat (20 °C → 100 °C liquid):**\n$$\\dot Q_1 = \\dot m\\,c_p\\,\\Delta T = 100\\ \\tfrac{\\text{kg}}{\\text{h}} \\times 4.18\\ \\tfrac{\\text{kJ}}{\\text{kg·K}} \\times (100-20)\\ \\text{K} = 33{,}440\\ \\tfrac{\\text{kJ}}{\\text{h}}.$$\n\n" +
      "**Step 2 — Latent heat (boil at 100 °C):**\n$$\\dot Q_2 = \\dot m\\,h_{fg} = 100\\ \\tfrac{\\text{kg}}{\\text{h}} \\times 2257\\ \\tfrac{\\text{kJ}}{\\text{kg}} = 225{,}700\\ \\tfrac{\\text{kJ}}{\\text{h}}.$$\n\n" +
      "**Step 3 — Total duty:**\n$$\\dot Q = \\dot Q_1 + \\dot Q_2 = 33{,}440 + 225{,}700 = 259{,}140\\ \\tfrac{\\text{kJ}}{\\text{h}}.$$\n\n" +
      "**Step 4 — Convert to kilowatts** (1 kW = 1 kJ/s; divide by 3600 s/h):\n$$\\dot Q = \\frac{259{,}140\\ \\text{kJ/h}}{3600\\ \\text{s/h}} = 71.98\\ \\text{kW}.$$\n\n" +
      "**Key insight / trap:** Don't forget the latent term — it dwarfs the sensible term here (~87% of the duty), so boiling, not heating, dominates a boiler's load. Also remember to convert kJ/h to kW; leaving it in kJ/h gives a meaningless number.\n\n" +
      "**Final answer: $\\dot Q \\approx 72.0\\ \\text{kW}$.**",
  },
  // SOLUTION:
  // Ammonia synthesis N2 + 3 H2 -> 2 NH3. Feed: 100 mol N2, 240 mol H2.
  // Identify limiting reactant: stoichiometric H2 needed for 100 N2 = 300 mol, but only
  // 240 available => H2 is limiting. N2 required to consume all 240 H2 = 240/3 = 80 mol;
  // N2 fed = 100, so N2 is in excess.
  // Percent excess of N2 = (fed - stoich required by limiting reactant)/stoich required *100
  //   = (100 - 80)/80 * 100 = 25%.
  {
    id: "ch_reaction_conversion",
    slug: "chemical-reaction-conversion-limiting-reactant",
    title: "Percent Excess in an Ammonia Synthesis Feed",
    prompt:
      "Ammonia is produced by N2 + 3 H2 -> 2 NH3. A feed blend is metered at 100 mol/h of N2 and 240 mol/h of H2.\n\nIdentify which species is the limiting reactant, then determine the percent excess of the other (excess) reactant relative to the amount stoichiometrically required to fully consume the limiting reactant.\n\nReport the percent excess as a number (e.g., enter 25 for 25%). Round to the nearest whole number.",
    discipline: "CHEMICAL",
    difficulty: "HARD",
    eloWeight: 27,
    tags: ["material-balance", "limiting-reactant", "percent-excess"],
    skillAreas: ["reaction-engineering"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 25,
    tolerance: 1,
    unit: "%",
    hints: [
      "First find the limiting reactant: compare the actual feed ratio H2/N2 to the stoichiometric ratio of 3.",
      "Compute how much of the EXCESS reactant is stoichiometrically required to fully consume the limiting reactant.",
      "Percent excess = (fed − stoichiometrically required) / stoichiometrically required × 100, using the limiting reactant's demand.",
    ],
    solution:
      "**Governing principle — limiting reactant and percent excess from reaction stoichiometry.** The limiting reactant is the one that runs out first when reactants are dosed in non-stoichiometric proportions; percent excess measures how much surplus of the *other* reactant is supplied beyond what the limiting reactant could consume.\n\n" +
      "**Reaction:** $\\text{N}_2 + 3\\,\\text{H}_2 \\rightarrow 2\\,\\text{NH}_3$ (requires 3 mol H₂ per mol N₂).\n\n" +
      "**Step 1 — Compare the feed ratio to stoichiometry:** Feed is 100 mol/h N₂ and 240 mol/h H₂, so the supplied ratio is $\\tfrac{240}{100} = 2.4$ mol H₂ per mol N₂, which is **below** the required 3.0. Too little H₂ → **H₂ is the limiting reactant.**\n\n" +
      "**Step 2 — Confirm by checking each reactant's demand:**\n- H₂ needed to consume all 100 mol N₂: $100 \\times 3 = 300$ mol — but only 240 available ⇒ H₂ limits.\n- N₂ needed to consume all 240 mol H₂: $240 / 3 = 80$ mol — and 100 mol fed ⇒ N₂ is in excess. ✓\n\n" +
      "**Step 3 — Compute percent excess of N₂** (the excess reactant), referenced to the amount stoichiometrically required by the limiting reactant (80 mol):\n$$\\%\\,\\text{excess} = \\frac{\\dot n_{\\text{fed}} - \\dot n_{\\text{stoich}}}{\\dot n_{\\text{stoich}}}\\times 100 = \\frac{100 - 80}{80}\\times 100 = 25\\%.$$\n\n" +
      "**Key insight / trap:** Percent excess is referenced to the *stoichiometric requirement* (80 mol), NOT to the total fed or to the limiting reactant's feed. Dividing by 100 instead of 80 would wrongly give 20%. Always identify the limiting reactant first, then compute the excess reactant's surplus over what that limiting reactant demands.\n\n" +
      "**Final answer: H₂ is limiting; the N₂ is supplied at $25\\%$ excess.**",
  },
  // SOLUTION:
  // Given the half-life t_1/2 = 30 s, recover the rate constant: k = ln2 / t_1/2
  //   = 0.6931 / 30 = 0.02310 s^-1.
  // First-order kinetics: C/C0 = exp(-k t). Reaching 90% conversion means C/C0 = 0.10,
  //   so t = ln(C0/C)/k = ln(10)/k = 2.3026 / 0.02310 = 99.7 s ~ 100 s.
  // (Equivalently, 90% conversion takes log2(10) ~ 3.32 half-lives = 3.32*30 ~ 100 s.)
  {
    id: "ch_first_order_halflife",
    slug: "chemical-first-order-reaction-half-life",
    title: "Batch Time to 90% Conversion, First-Order Kinetics",
    prompt:
      "A reactant decomposes by first-order kinetics in an isothermal batch reactor. Its concentration is observed to fall to half of its initial value in 30 s.\n\nDetermine the reaction time required to reach 90% conversion of the reactant. Give the answer in seconds, rounded to the nearest whole number.",
    discipline: "CHEMICAL",
    difficulty: "MEDIUM",
    eloWeight: 25,
    tags: ["kinetics", "first-order", "batch-reactor"],
    skillAreas: ["reaction-engineering"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 100,
    tolerance: 2,
    unit: "s",
    hints: [
      "You aren't given k directly. For first-order decay the half-life fixes it: t_1/2 = ln2 / k.",
      "90% conversion means the concentration ratio C/C0 has dropped to 0.10, not 0.90.",
      "Use t = ln(C0/C)/k = ln(10)/k. (Sanity check: that's log2(10) ≈ 3.3 half-lives.)",
    ],
    solution:
      "**Governing principle — first-order kinetics give exponential decay.** For $-\\tfrac{dC}{dt}=kC$, integration yields $C/C_0 = e^{-kt}$. The half-life fixes the rate constant; conversion fixes the concentration ratio.\n\n" +
      "**Step 1 — Recover $k$ from the half-life.** For first-order decay, $t_{1/2} = \\ln 2 / k$, so\n$$k = \\frac{\\ln 2}{t_{1/2}} = \\frac{0.6931}{30\\ \\text{s}} = 0.02310\\ \\text{s}^{-1}.$$\n\n" +
      "**Step 2 — Translate 90% conversion to a concentration ratio.** Conversion $X=0.90$ means 90% of $A$ is gone, so the *remaining* fraction is\n$$\\frac{C}{C_0} = 1 - X = 0.10.$$\n\n" +
      "**Step 3 — Solve the integrated rate law for time:**\n$$\\frac{C}{C_0}=e^{-kt} \\;\\Rightarrow\\; t = \\frac{1}{k}\\ln\\!\\frac{C_0}{C} = \\frac{\\ln(1/0.10)}{k} = \\frac{\\ln 10}{0.02310} = \\frac{2.3026}{0.02310} = 99.7\\ \\text{s}.$$\n\n" +
      "**Step 4 — Sanity check via half-lives:** $\\log_2 10 = 3.32$ half-lives $\\times\\,30\\ \\text{s} = 99.7\\ \\text{s}$. ✓ (After 3 half-lives only 12.5% remains; a third more decay reaches 10%.)\n\n" +
      "**Key insight / trap:** 90% *conversion* means $C/C_0 = 0.10$, not $0.90$ — using 0.90 would give a tiny time (~4.6 s) and is the classic mistake. Note the result is independent of $C_0$: first-order times depend only on ratios.\n\n" +
      "**Final answer: $t \\approx 100\\ \\text{s}$.**",
  },
  // SOLUTION:
  // Pressure drop in turbulent pipe flow, three steps:
  // 1) Re = rho*v*D/mu = 1000*2.0*0.05/0.001 = 100,000 (turbulent, smooth pipe).
  // 2) Blasius (smooth, turbulent): Darcy friction factor f = 0.316*Re^-0.25
  //      = 0.316 * (1e5)^-0.25 = 0.316/17.78 = 0.01777.
  // 3) Darcy-Weisbach: dP = f*(L/D)*rho*v^2/2
  //      = 0.01777 * (100/0.05) * 1000 * 4/2 = 0.01777 * 2000 * 2000 = 71,080 Pa
  //      = 71.1 kPa.
  {
    id: "ch_reynolds_pipe",
    slug: "chemical-reynolds-number-pipe-flow",
    title: "Frictional Pressure Drop in a Process Water Line",
    prompt:
      "Water (density 1000 kg/m^3, viscosity 0.001 Pa·s) flows at a mean velocity of 2.0 m/s through 100 m of smooth, horizontal pipe with an inside diameter of 0.05 m.\n\nUsing the Blasius correlation for the Darcy friction factor in smooth-pipe turbulent flow, f = 0.316·Re^(-1/4), determine the frictional pressure drop along the pipe. Report the answer in kilopascals (kPa). Round to 1 decimal place.",
    discipline: "CHEMICAL",
    difficulty: "EXPERT",
    eloWeight: 36,
    tags: ["fluid-mechanics", "pressure-drop", "friction-factor"],
    skillAreas: ["fluid-mechanics", "transport-phenomena"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 71.1,
    tolerance: 1.5,
    unit: "kPa",
    hints: [
      "Step 1: get the Reynolds number, Re = ρvD/μ, to confirm turbulent flow and to feed the Blasius correlation.",
      "Step 2: evaluate f = 0.316·Re^(−1/4). Keep this as the DARCY friction factor (not the Fanning factor, which is 4× smaller).",
      "Step 3: apply Darcy–Weisbach, ΔP = f·(L/D)·(ρv^2/2). The result is in Pa; divide by 1000 for kPa.",
    ],
    solution:
      "**Governing principle — frictional pressure drop in pipe flow via the Darcy–Weisbach equation,** with the friction factor set by the flow regime. We confirm turbulence with the Reynolds number, get the Darcy friction factor from the Blasius smooth-pipe correlation, then apply Darcy–Weisbach.\n\n" +
      "**Step 1 — Reynolds number:**\n$$Re = \\frac{\\rho v D}{\\mu} = \\frac{(1000)(2.0)(0.05)}{0.001} = 100{,}000.$$\nSince $Re \\gg 4000$, the flow is turbulent, and at $Re=10^5$ in a smooth pipe the Blasius correlation is valid.\n\n" +
      "**Step 2 — Blasius Darcy friction factor:**\n$$f = 0.316\\,Re^{-1/4} = 0.316\\,(100{,}000)^{-0.25} = \\frac{0.316}{17.78} = 0.01777.$$\n\n" +
      "**Step 3 — Darcy–Weisbach pressure drop:**\n$$\\Delta P = f\\,\\frac{L}{D}\\,\\frac{\\rho v^2}{2} = 0.01777 \\times \\frac{100}{0.05} \\times \\frac{(1000)(2.0)^2}{2}.$$\nEvaluate piece by piece: $\\tfrac{L}{D} = 2000$, and $\\tfrac{\\rho v^2}{2} = \\tfrac{1000\\times 4}{2} = 2000\\ \\text{Pa}$. So\n$$\\Delta P = 0.01777 \\times 2000 \\times 2000 = 71{,}080\\ \\text{Pa} = 71.1\\ \\text{kPa}.$$\n\n" +
      "**Key insight / trap:** The Blasius correlation as written ($0.316\\,Re^{-1/4}$) returns the **Darcy** friction factor, which is the one Darcy–Weisbach needs. Confusing it with the Fanning factor (4× smaller) would slash the answer to ~18 kPa. Also keep $\\rho v^2/2$ together as the dynamic pressure to avoid a factor-of-2 slip.\n\n" +
      "**Final answer: $\\Delta P \\approx 71.1\\ \\text{kPa}$.**",
  },
  // SOLUTION:
  // Counterflow shell-and-tube exchanger; size the area.
  // 1) Hot-side duty: oil 10000 kg/h = 2.7778 kg/s, cp = 2200 J/(kg·K),
  //    cooled 120 -> 60 C: Q = 2.7778 * 2200 * 60 = 366,667 W = 366.7 kW.
  // 2) Counterflow end differences (water 25 -> 40 C):
  //    dT1 = 120 - 40 = 80 K (hot in vs cold out), dT2 = 60 - 25 = 35 K.
  //    LMTD = (80-35)/ln(80/35) = 45/0.8267 = 54.43 K.
  // 3) A = Q/(U*LMTD) = 366,667 / (350 * 54.43) = 366,667 / 19,051 = 19.2 m^2.
  {
    id: "ch_lmtd_concept",
    slug: "chemical-lmtd-counterflow-concept",
    title: "Heat-Transfer Area for a Counterflow Oil Cooler",
    prompt:
      "A counterflow shell-and-tube exchanger cools 10,000 kg/h of hot oil (cp = 2200 J/(kg·K)) from 120 °C to 60 °C using cooling water that enters at 25 °C and leaves at 40 °C. The overall heat-transfer coefficient is U = 350 W/(m^2·K).\n\nDetermine the required heat-transfer area, in m^2, using the log-mean temperature difference for counterflow. Round to 1 decimal place.",
    discipline: "CHEMICAL",
    difficulty: "EXPERT",
    eloWeight: 38,
    tags: ["heat-transfer", "lmtd", "heat-exchanger"],
    skillAreas: ["heat-transfer"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 19.2,
    tolerance: 0.4,
    unit: "m^2",
    hints: [
      "Get the duty Q from the hot stream: convert 10,000 kg/h to kg/s, then Q = ṁ·cp·ΔT_oil. (The water outlet temperature is given only to set the LMTD.)",
      "For counterflow, pair the ends correctly: ΔT1 = T_hot,in − T_cold,out and ΔT2 = T_hot,out − T_cold,in.",
      "LMTD = (ΔT1 − ΔT2)/ln(ΔT1/ΔT2), then A = Q/(U·LMTD). Keep Q in W so the area comes out in m^2.",
    ],
    solution:
      "**Governing principle — heat-exchanger sizing by the rate equation $Q = U A\\,\\Delta T_{lm}$,** with the duty fixed by an energy balance on one stream and the driving force expressed as the log-mean temperature difference for counterflow.\n\n" +
      "**Step 1 — Heat duty from the hot (oil) stream.** Convert the flow: $10{,}000\\ \\text{kg/h} \\div 3600 = 2.7778\\ \\text{kg/s}$. Then\n$$Q = \\dot m\\,c_p\\,\\Delta T_{\\text{oil}} = (2.7778)(2200)(120-60) = 366{,}667\\ \\text{W} = 366.7\\ \\text{kW}.$$\n(The water outlet of 40 °C is supplied only to set the LMTD ends, not the duty.)\n\n" +
      "**Step 2 — Counterflow terminal temperature differences.** In counterflow the hot inlet meets the cold outlet at one end and the hot outlet meets the cold inlet at the other:\n$$\\Delta T_1 = T_{h,\\text{in}} - T_{c,\\text{out}} = 120 - 40 = 80\\ \\text{K},$$\n$$\\Delta T_2 = T_{h,\\text{out}} - T_{c,\\text{in}} = 60 - 25 = 35\\ \\text{K}.$$\n\n" +
      "**Step 3 — Log-mean temperature difference:**\n$$\\Delta T_{lm} = \\frac{\\Delta T_1 - \\Delta T_2}{\\ln(\\Delta T_1/\\Delta T_2)} = \\frac{80 - 35}{\\ln(80/35)} = \\frac{45}{0.8267} = 54.43\\ \\text{K}.$$\n\n" +
      "**Step 4 — Solve for the area:**\n$$A = \\frac{Q}{U\\,\\Delta T_{lm}} = \\frac{366{,}667}{(350)(54.43)} = \\frac{366{,}667}{19{,}051} = 19.2\\ \\text{m}^2.$$\n\n" +
      "**Key insight / trap:** Pair the stream ends correctly for counterflow — mismatching them (e.g., $120-25$ and $60-40$, the parallel-flow pairing) gives the wrong LMTD. Keep $Q$ in watts so that with $U$ in W/(m²·K) the area emerges directly in m². The LMTD (54.4 K) is the proper average driving force; using a plain arithmetic mean would mis-size the unit.\n\n" +
      "**Final answer: $A \\approx 19.2\\ \\text{m}^2$.**",
  },
];
