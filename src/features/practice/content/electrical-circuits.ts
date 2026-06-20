import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION: Loaded source. Total loop R = r + R_load = 1.2 + 47 = 48.2 Ω.
  // I = V / R_total = 9 / 48.2 = 0.18672 A = 186.7 mA.
  {
    id: "ec_ohms_law_current",
    slug: "circuits-ohms-law-current",
    title: "Bench Supply Under Load",
    prompt:
      "You connect a 9 V battery directly across a 47 Ω power resistor. The battery is not ideal: it has an internal resistance of 1.2 Ω that you must not ignore.\n\nDetermine the actual current that flows through the 47 Ω resistor.\n\nReport the current in milliamps (mA), rounded to one decimal place.",
    discipline: "ELECTRICAL",
    difficulty: "INTRODUCTORY",
    eloWeight: 12,
    tags: ["ohms-law", "internal-resistance", "dc"],
    skillAreas: ["circuits"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 186.7,
    tolerance: 1.9,
    unit: "mA",
    hints: [
      "The internal resistance is in series with the load, so the current is set by the total of both resistances, not by the 47 Ω alone.",
      "Apply Ohm's law to the whole loop: I = V / (r + R_load).",
      "Convert to milliamps (×1000) and round to one decimal place before answering.",
    ],
    solution:
      "**Governing principle — Ohm's law around a single series loop.** The battery's internal resistance $r$ is in series with the load, so the same current flows through both. The current is set by the *total* loop resistance, not by the load alone. Ignoring $r$ is the classic trap here.\n\n" +
      "**Step 1 — Identify the loop elements:** A non-ideal source is an ideal EMF in series with $r = 1.2\\ \\Omega$, feeding $R_{load} = 47\\ \\Omega$. Both carry the same current.\n\n" +
      "**Step 2 — Total resistance:**\n$$R_{total} = r + R_{load} = 1.2 + 47 = 48.2\\ \\Omega$$\n\n" +
      "**Step 3 — Apply Ohm's law to the full loop:**\n$$I = \\frac{V}{R_{total}} = \\frac{9\\ \\text{V}}{48.2\\ \\Omega} = 0.18672\\ \\text{A}$$\n\n" +
      "**Step 4 — Convert to milliamps:**\n$$I = 0.18672 \\times 1000 = 186.7\\ \\text{mA}$$\n\n" +
      "**Key insight:** Had you used only the $47\\ \\Omega$ load you'd get $191.5$ mA — about $2.5\\%$ high. The $1.2\\ \\Omega$ internal resistance is small but not negligible, which is exactly why the problem says you must not ignore it.\n\n" +
      "**Final answer: $I \\approx 186.7\\ \\text{mA}$**",
  },
  // SOLUTION: From node A: branch1 = R2 = 300 Ω; branch2 = R3 + R4 = 200 + 200 = 400 Ω.
  // Parallel: (300*400)/(300+400) = 171.43 Ω. Add series R1 = 100 → 271.4 Ω. Closest = 271 Ω.
  {
    id: "ec_series_parallel_resistance",
    slug: "circuits-series-parallel-resistance",
    title: "Resistive Ladder Reduction",
    prompt:
      "A source feeds a network through a 100 Ω resistor (R1) into node A. From node A there are two parallel paths to ground: a single 300 Ω resistor (R2), and a branch consisting of a 200 Ω resistor (R3) in series with another 200 Ω resistor (R4).\n\nWork out the equivalent resistance the source sees looking into R1.\n\nSelect the closest value.",
    discipline: "ELECTRICAL",
    difficulty: "EASY",
    eloWeight: 16,
    tags: ["series-parallel", "network-reduction", "dc"],
    skillAreas: ["circuits"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      { id: "a", label: "171 Ω" },
      { id: "b", label: "271 Ω", correct: true },
      { id: "c", label: "300 Ω" },
      { id: "d", label: "700 Ω" },
    ],
    hints: [
      "Resolve the network from the far end back toward the source: first combine resistors that are plainly in series, then handle what is in parallel.",
      "R3 and R4 add to form one branch; that branch is in parallel with R2 between node A and ground.",
      "Two parallel resistances combine as the product over the sum; only then add R1, which is in series with the whole parallel section.",
    ],
    solution:
      "**Governing principle — network reduction by successive series/parallel collapse.** Resistors carrying the same current add (series); resistors sharing the same two nodes combine by the reciprocal/product-over-sum rule (parallel). Work from the far end (ground) back toward the source.\n\n" +
      "**Step 1 — Collapse the obvious series pair.** $R_3$ and $R_4$ carry the same current in their branch, so they add:\n$$R_{34} = R_3 + R_4 = 200 + 200 = 400\\ \\Omega$$\n\n" +
      "**Step 2 — Identify the parallel section.** Between node A and ground there are now two paths: $R_2 = 300\\ \\Omega$ and the $R_{34} = 400\\ \\Omega$ branch. They share both end nodes, so they are in parallel:\n$$R_{A} = \\frac{R_2 \\, R_{34}}{R_2 + R_{34}} = \\frac{300 \\times 400}{300 + 400} = \\frac{120000}{700} = 171.43\\ \\Omega$$\n\n" +
      "**Step 3 — Add the series feed resistor.** $R_1 = 100\\ \\Omega$ carries the entire source current before node A, so it is in series with the parallel block:\n$$R_{eq} = R_1 + R_A = 100 + 171.43 = 271.4\\ \\Omega$$\n\n" +
      "**Why the distractors fail:** $171\\ \\Omega$ (a) forgets to add $R_1$. $300\\ \\Omega$ (c) ignores the parallel branch entirely. $700\\ \\Omega$ (d) wrongly *adds* everything in series ($100+300+200+200$) instead of recognizing the parallel paths.\n\n" +
      "**Key insight:** Always reduce from the terminals farthest from the source first, and never add a parallel pair directly — the combination is always smaller than the smaller resistor.\n\n" +
      "**Final answer: 271 Ω (choice b).**",
  },
  // SOLUTION: Thevenin at load node: Vth = 24*(R2/(R1+R2)) = 24*200/300 = 16 V.
  // Rth = R1||R2 = (100*200)/300 = 66.67 Ω. With RL=300: I = 16/(66.67+300) = 0.043636 A.
  // P_RL = I^2 * RL = 0.043636^2 * 300 = 0.571 W.
  {
    id: "ec_power_dissipation",
    slug: "circuits-power-dissipation",
    title: "Power Delivered to a Load Resistor",
    prompt:
      "A 24 V DC source connects through a 100 Ω resistor (R1) to node A. A 200 Ω resistor (R2) runs from node A to ground. A 300 Ω load resistor (RL) is then connected from node A to ground.\n\nDetermine the power actually dissipated in the 300 Ω load.\n\nReport the power in watts (W), rounded to three decimal places.",
    discipline: "ELECTRICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["thevenin", "load-power", "dc"],
    skillAreas: ["circuits", "power-systems"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.571,
    tolerance: 0.012,
    unit: "W",
    hints: [
      "Attaching RL changes the voltage at node A, so you cannot use the open-circuit node voltage directly — reduce the source side seen by RL first.",
      "Find the Thevenin equivalent at node A (with RL removed): Vth is the divider of R1 and R2; Rth is R1 in parallel with R2.",
      "Compute the current through RL from Vth/(Rth + RL), then power in RL is I^2 * RL.",
    ],
    solution:
      "**Governing principle — Thevenin equivalent then load power.** Connecting $R_L$ at node A draws current and pulls the node voltage down, so the open-circuit (unloaded) node voltage is *not* the loaded voltage. Reduce everything the load sees to a Thevenin source ($V_{th}, R_{th}$), then solve the simple series loop.\n\n" +
      "**Step 1 — Remove $R_L$ and find $V_{th}$ (open-circuit voltage at node A).** With $R_L$ off, $R_1$ and $R_2$ form a divider from the 24 V source:\n$$V_{th} = V_s \\frac{R_2}{R_1 + R_2} = 24 \\cdot \\frac{200}{100 + 200} = 24 \\cdot \\frac{200}{300} = 16\\ \\text{V}$$\n\n" +
      "**Step 2 — Find $R_{th}$ (kill the source → short it).** Looking back into node A, $R_1$ and $R_2$ are in parallel:\n$$R_{th} = R_1 \\| R_2 = \\frac{100 \\times 200}{100 + 200} = \\frac{20000}{300} = 66.67\\ \\Omega$$\n\n" +
      "**Step 3 — Reattach $R_L = 300\\ \\Omega$ and find the load current:**\n$$I = \\frac{V_{th}}{R_{th} + R_L} = \\frac{16}{66.67 + 300} = \\frac{16}{366.67} = 0.043636\\ \\text{A}$$\n\n" +
      "**Step 4 — Power dissipated in the load:**\n$$P_{R_L} = I^2 R_L = (0.043636)^2 \\times 300 = 0.0019041 \\times 300 = 0.571\\ \\text{W}$$\n\n" +
      "**Key insight / trap:** Using the unloaded node voltage (16 V) directly across $R_L$ would give $16^2/300 = 0.853$ W — far too high. The Thevenin resistance is what limits the delivered power; you must include $R_{th}$ in the loop.\n\n" +
      "**Final answer: $P_{R_L} \\approx 0.571\\ \\text{W}$**",
  },
  // SOLUTION: tau = R*C = 10000 * 100e-6 = 1.0 s. v(t) = 24*(1 - e^(-t/tau)).
  // At t = 1.5 s: v = 24*(1 - e^-1.5) = 24*0.77687 = 18.645 V.
  // E = 0.5*C*v^2 = 0.5*100e-6*18.645^2 = 0.017382 J = 17.4 mJ.
  {
    id: "ec_capacitor_energy",
    slug: "circuits-capacitor-energy",
    title: "Stored Energy During RC Charging",
    prompt:
      "An initially uncharged 100 µF capacitor charges through a 10 kΩ resistor from a 24 V DC supply, switched on at t = 0.\n\nDetermine the energy stored in the capacitor exactly 1.5 seconds after the switch closes.\n\nReport the energy in millijoules (mJ), rounded to one decimal place.",
    discipline: "ELECTRICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["rc-transient", "energy", "time-constant"],
    skillAreas: ["circuits"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 17.4,
    tolerance: 0.3,
    unit: "mJ",
    hints: [
      "This is a two-stage problem: first find the capacitor voltage at the given instant, then convert that voltage into stored energy.",
      "For charging from zero, v(t) = V_supply * (1 - e^(-t/RC)); evaluate the time constant RC first and note 1.5 s is past it.",
      "Stored energy is E = (1/2) C v(t)^2; express the result in millijoules (×1000) and round to one decimal.",
    ],
    solution:
      "**Governing principle — first-order RC charging transient, then capacitor energy storage.** A capacitor charging through a resistor follows an exponential approach to the supply voltage with time constant $\\tau = RC$. Energy depends on the *square* of the instantaneous voltage, so this is a two-stage problem: get $v(t)$, then convert to energy.\n\n" +
      "**Step 1 — Time constant:**\n$$\\tau = RC = (10{,}000\\ \\Omega)(100 \\times 10^{-6}\\ \\text{F}) = 1.0\\ \\text{s}$$\nSo $t = 1.5$ s is $1.5\\tau$ — past one time constant but not yet fully charged.\n\n" +
      "**Step 2 — Capacitor voltage at $t = 1.5$ s.** Charging from zero:\n$$v(t) = V_s\\left(1 - e^{-t/\\tau}\\right) = 24\\left(1 - e^{-1.5}\\right)$$\nWith $e^{-1.5} = 0.22313$:\n$$v = 24(1 - 0.22313) = 24 \\times 0.77687 = 18.645\\ \\text{V}$$\n\n" +
      "**Step 3 — Stored energy:**\n$$E = \\tfrac{1}{2} C v^2 = \\tfrac{1}{2}(100 \\times 10^{-6})(18.645)^2 = 0.5 \\times 100\\times10^{-6} \\times 347.6 = 0.017382\\ \\text{J}$$\n\n" +
      "**Step 4 — Convert to millijoules:**\n$$E = 0.017382 \\times 1000 = 17.4\\ \\text{mJ}$$\n\n" +
      "**Key insight / trap:** Don't equate stored energy with the source energy or use $V_s = 24$ V — at $1.5\\tau$ the capacitor has only reached 18.6 V, and because energy scales as $v^2$, using 24 V would overstate the result by about $66\\%$ ($0.0288$ J).\n\n" +
      "**Final answer: $E \\approx 17.4\\ \\text{mJ}$**",
  },
  // SOLUTION: tau = L/R = 0.5/250 = 0.002 s = 2 ms. I_final = V/R = 50/250 = 0.2 A.
  // i(t) = I_final*(1 - e^(-t/tau)); at t = 1.5 ms: i = 0.2*(1 - e^(-0.75)) = 0.2*0.52763 = 0.10553 A = 105.5 mA.
  {
    id: "ec_rl_time_constant",
    slug: "circuits-rl-time-constant",
    title: "Inductor Current During Turn-On",
    prompt:
      "A relay coil modeled as a series RL circuit (L = 0.5 H, R = 250 Ω) is connected to a 50 V DC source at t = 0.\n\nFind the current flowing in the coil 1.5 ms after the source is applied.\n\nReport the current in milliamps (mA), rounded to one decimal place.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["rl-transient", "current", "time-constant"],
    skillAreas: ["circuits"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 105.5,
    tolerance: 1.1,
    unit: "mA",
    hints: [
      "An energizing inductor rises toward a final current, not a final voltage; identify both the final (steady-state) current and the time constant.",
      "For an RL circuit the time constant is L/R (not R/C) and the final current is V/R; watch that 1.5 ms is below one time constant here.",
      "Use i(t) = (V/R)(1 - e^(-t/tau)) with t and tau in the same units, then convert to milliamps.",
    ],
    solution:
      "**Governing principle — first-order RL energizing transient.** An inductor opposes change in current, so when a DC source is applied the current rises *exponentially toward* a steady-state value, with time constant $\\tau = L/R$. The dual of RC: here current (not voltage) is the state variable.\n\n" +
      "**Step 1 — Time constant:**\n$$\\tau = \\frac{L}{R} = \\frac{0.5\\ \\text{H}}{250\\ \\Omega} = 0.002\\ \\text{s} = 2\\ \\text{ms}$$\n\n" +
      "**Step 2 — Final (steady-state) current.** At $t \\to \\infty$ the inductor looks like a short, so the current is set by $R$ alone:\n$$I_\\infty = \\frac{V}{R} = \\frac{50}{250} = 0.2\\ \\text{A}$$\n\n" +
      "**Step 3 — Current at $t = 1.5$ ms.** Keep $t$ and $\\tau$ in the same units; $t/\\tau = 1.5/2 = 0.75$:\n$$i(t) = I_\\infty\\left(1 - e^{-t/\\tau}\\right) = 0.2\\left(1 - e^{-0.75}\\right)$$\nWith $e^{-0.75} = 0.47237$:\n$$i = 0.2(1 - 0.47237) = 0.2 \\times 0.52763 = 0.10553\\ \\text{A}$$\n\n" +
      "**Step 4 — Convert to milliamps:**\n$$i = 0.10553 \\times 1000 = 105.5\\ \\text{mA}$$\n\n" +
      "**Key insight / trap:** Use $\\tau = L/R$, not $RC$ or $R/L$. Also, $t = 1.5$ ms is *below* one time constant ($2$ ms), so the current has reached only about $53\\%$ of its final $200$ mA — it is still climbing.\n\n" +
      "**Final answer: $i \\approx 105.5\\ \\text{mA}$**",
  },
  // SOLUTION: Xc = 1/(2*pi*f*C) = 1/(2*pi*60*4.7e-6) = 564.38 Ω.
  // |Z| = sqrt(R^2 + Xc^2) = sqrt(220^2 + 564.38^2) = sqrt(48400 + 318525) = 605.7 Ω.
  // I_rms = V_rms / |Z| = 120 / 605.7 = 0.19812 A = 198.1 mA.
  {
    id: "ec_capacitive_reactance",
    slug: "circuits-capacitive-reactance",
    title: "Series RC Branch Current at Line Frequency",
    prompt:
      "A 220 Ω resistor is wired in series with a 4.7 µF capacitor across a 120 V rms, 60 Hz line. A junior engineer estimates the current as 120 V / 220 Ω, treating the capacitor as a short.\n\nWorking the problem correctly, determine the actual rms current that flows in this series branch.\n\nReport the current in milliamps (mA), rounded to one decimal place.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 25,
    tags: ["ac", "impedance", "phasors"],
    skillAreas: ["circuits", "signals-systems"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 198.1,
    tolerance: 2,
    unit: "mA",
    hints: [
      "The junior's shortcut fails because at 60 Hz the capacitor is far from a short; its reactance is sizable and must be combined with R.",
      "Find the capacitive reactance Xc = 1/(2*pi*f*C), then the series impedance magnitude is sqrt(R^2 + Xc^2) (R and Xc add in quadrature, not directly).",
      "Current magnitude is V_rms / |Z|; convert to milliamps and round to one decimal place.",
    ],
    solution:
      "**Governing principle — AC steady-state with phasor impedance.** In a series RC branch the resistor and capacitor impedances add as *complex* numbers. Because the capacitor's voltage lags its current by $90°$, $R$ and $X_c$ combine in quadrature (Pythagorean sum), not arithmetically. The junior's $V/R$ assumes $X_c = 0$, which is only true at very high frequency.\n\n" +
      "**Step 1 — Capacitive reactance at 60 Hz:**\n$$X_c = \\frac{1}{2\\pi f C} = \\frac{1}{2\\pi (60)(4.7 \\times 10^{-6})} = \\frac{1}{0.0017719} = 564.4\\ \\Omega$$\nThis is far from a short — it actually dominates the $220\\ \\Omega$ resistor.\n\n" +
      "**Step 2 — Series impedance magnitude (quadrature sum):**\n$$|Z| = \\sqrt{R^2 + X_c^2} = \\sqrt{220^2 + 564.4^2} = \\sqrt{48400 + 318525} = \\sqrt{366925} = 605.7\\ \\Omega$$\n\n" +
      "**Step 3 — RMS current:**\n$$I_{rms} = \\frac{V_{rms}}{|Z|} = \\frac{120}{605.7} = 0.19812\\ \\text{A}$$\n\n" +
      "**Step 4 — Convert to milliamps:**\n$$I_{rms} = 0.19812 \\times 1000 = 198.1\\ \\text{mA}$$\n\n" +
      "**Key insight / trap:** The junior's $120/220 = 545$ mA is nearly $3\\times$ too high because it ignores the dominant $564\\ \\Omega$ reactance. Never add $R$ and $X_c$ directly ($220 + 564 = 784\\ \\Omega$ is also wrong); they are $90°$ apart and add in quadrature.\n\n" +
      "**Final answer: $I_{rms} \\approx 198.1\\ \\text{mA}$**",
  },
  // SOLUTION: Series RLC. f0 = 1/(2*pi*sqrt(L*C)) = 5033 Hz (set by L, C only — unchanged by R).
  // Q = (1/R)*sqrt(L/C). Doubling R from 50 to 100 Ω halves Q (6.32 -> 3.16), so BW = f0/Q DOUBLES
  // (796 -> 1592 Hz). Resonant frequency stays the same. Correct statement: f0 unchanged, BW doubles.
  {
    id: "ec_rlc_resonance",
    slug: "circuits-rlc-resonance",
    title: "Effect of Series Resistance on a Resonant Filter",
    prompt:
      "A series RLC bandpass filter uses L = 10 mH, C = 100 nF, and R = 50 Ω. During a redesign the total series resistance is doubled to 100 Ω (worse coil, added trace resistance), while L and C are unchanged.\n\nHow do the resonant frequency f0 and the -3 dB bandwidth respond to doubling R?",
    discipline: "ELECTRICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["rlc", "resonance", "bandwidth", "quality-factor"],
    skillAreas: ["circuits", "signals-systems"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      { id: "a", label: "f0 unchanged; bandwidth doubles (Q is halved)", correct: true },
      { id: "b", label: "f0 doubles; bandwidth unchanged" },
      { id: "c", label: "f0 unchanged; bandwidth is halved (Q doubles)" },
      { id: "d", label: "Both f0 and bandwidth are halved" },
    ],
    hints: [
      "Write down which circuit elements set each quantity: resonant frequency depends only on L and C, while bandwidth depends on how lossy the circuit is.",
      "For a series RLC, f0 = 1/(2*pi*sqrt(LC)) (no R), and the quality factor Q = (1/R)*sqrt(L/C) falls as R rises.",
      "Bandwidth = f0/Q, so track what halving Q does to BW while f0 holds fixed.",
    ],
    solution:
      "**Governing principle — resonance is set by energy storage (L, C); selectivity is set by loss (R).** For a series RLC, the resonant frequency depends only on L and C, while the quality factor — and hence the bandwidth — depends on the resistance. Separating *what sets what* immediately answers the question.\n\n" +
      "**Step 1 — Resonant frequency depends only on L and C:**\n$$f_0 = \\frac{1}{2\\pi\\sqrt{LC}} = \\frac{1}{2\\pi\\sqrt{(10\\times10^{-3})(100\\times10^{-9})}} = \\frac{1}{2\\pi\\sqrt{10^{-9}}} \\approx 5033\\ \\text{Hz}$$\nThere is no $R$ in this expression, so doubling $R$ leaves $f_0$ **unchanged**.\n\n" +
      "**Step 2 — Quality factor depends on R:**\n$$Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}}$$\nWith $\\sqrt{L/C} = \\sqrt{10^{-2}/10^{-7}} = \\sqrt{10^5} = 316.2\\ \\Omega$:\n- At $R = 50\\ \\Omega$: $Q = 316.2/50 = 6.32$\n- At $R = 100\\ \\Omega$: $Q = 316.2/100 = 3.16$\n\nDoubling $R$ **halves** $Q$.\n\n" +
      "**Step 3 — Bandwidth.** Since $BW = f_0/Q$ and $f_0$ is fixed, halving $Q$ **doubles** the bandwidth:\n$$BW_{50} = \\frac{5033}{6.32} \\approx 796\\ \\text{Hz} \\quad\\to\\quad BW_{100} = \\frac{5033}{3.16} \\approx 1592\\ \\text{Hz}$$\n\n" +
      "**Why the distractors fail:** (b) wrongly ties $f_0$ to $R$ — but $R$ never appears in $f_0$. (c) inverts the trend: more resistance means *more* loss, so $Q$ falls and BW widens, it does not narrow. (d) halves $f_0$, which again falsely couples resonance to resistance.\n\n" +
      "**Key insight:** A lossier (higher-R) resonant circuit is *less* selective — a broader, flatter peak — even though it still peaks at the same frequency.\n\n" +
      "**Final answer: f0 unchanged; bandwidth doubles because Q is halved (choice a).**",
  },
  // SOLUTION: Loaded divider. R2 in parallel with RL = (10k*22k)/(32k) = 6875 Ω.
  // Vout = Vin * Rb/(R1+Rb) = 12 * 6875/(4700+6875) = 12 * 0.59412 = 7.13 V.
  {
    id: "ec_voltage_divider",
    slug: "circuits-voltage-divider",
    title: "Voltage Divider Under Load",
    prompt:
      "A 12 V rail is divided by R1 = 4.7 kΩ (top) and R2 = 10 kΩ (bottom), with the tap taken across R2 to bias a downstream stage. That stage presents a 22 kΩ input resistance connected from the tap to ground.\n\nDetermine the actual voltage at the tap once the 22 kΩ load is connected.\n\nReport the voltage in volts (V), rounded to two decimal places.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["voltage-divider", "loading", "dc"],
    skillAreas: ["circuits"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 7.13,
    tolerance: 0.08,
    unit: "V",
    hints: [
      "The 22 kΩ load sits across the same nodes as R2, so the unloaded divider formula will overstate the tap voltage.",
      "Replace R2 and the load with their parallel combination first, then apply the divider between R1 and that combined bottom resistance.",
      "Vtap = Vin * R_bottom/(R1 + R_bottom); keep two decimals.",
    ],
    solution:
      "**Governing principle — a real load loads the divider.** The downstream stage's input resistance sits directly across $R_2$ (same two nodes: tap and ground), so it is in parallel with $R_2$. This lowers the effective bottom resistance, which lowers the tap voltage. The unloaded divider formula always overstates the loaded tap.\n\n" +
      "**Step 1 — Combine $R_2$ with the load (parallel).** $R_2 = 10\\ \\text{k}\\Omega$ and $R_{load} = 22\\ \\text{k}\\Omega$ share both nodes:\n$$R_{bottom} = R_2 \\| R_{load} = \\frac{10 \\times 22}{10 + 22}\\ \\text{k}\\Omega = \\frac{220}{32}\\ \\text{k}\\Omega = 6.875\\ \\text{k}\\Omega$$\n\n" +
      "**Step 2 — Apply the voltage divider with the new bottom resistance.** Top resistor is $R_1 = 4.7\\ \\text{k}\\Omega$:\n$$V_{tap} = V_{in}\\frac{R_{bottom}}{R_1 + R_{bottom}} = 12 \\cdot \\frac{6.875}{4.7 + 6.875} = 12 \\cdot \\frac{6.875}{11.575}$$\n\n" +
      "**Step 3 — Arithmetic:**\n$$V_{tap} = 12 \\times 0.59412 = 7.13\\ \\text{V}$$\n\n" +
      "**Key insight / trap:** The *unloaded* tap would be $12 \\cdot 10/(4.7+10) = 8.16$ V. Connecting the $22\\ \\text{k}\\Omega$ load pulls it down to $7.13$ V — a real $\\approx 1$ V droop. This is exactly why divider biasing must account for the next stage's input resistance.\n\n" +
      "**Final answer: $V_{tap} \\approx 7.13\\ \\text{V}$**",
  },
  // SOLUTION: Thevenin at load: Vth = 20*(R2/(R1+R2)) = 20*120/180 = 13.333 V.
  // Rth = R1||R2 = (60*120)/180 = 40 Ω. Max power transfer at RL = Rth = 40 Ω.
  // Pmax = Vth^2/(4*Rth) = 13.333^2/160 = 177.78/160 = 1.1111 W = 1111 mW.
  {
    id: "ec_max_power_transfer_concept",
    slug: "circuits-max-power-transfer-concept",
    title: "Maximum Extractable Load Power",
    prompt:
      "A 20 V DC source connects through a 60 Ω resistor (R1) to node A, with a 120 Ω resistor (R2) from node A to ground. You are free to choose any load resistance RL to place from node A to ground.\n\nChoosing RL to extract the greatest possible power, determine that maximum power delivered to the load.\n\nReport the maximum load power in milliwatts (mW), rounded to the nearest whole milliwatt.",
    discipline: "ELECTRICAL",
    difficulty: "EXPERT",
    eloWeight: 36,
    tags: ["max-power-transfer", "thevenin", "optimization"],
    skillAreas: ["circuits", "power-systems"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 1111,
    tolerance: 12,
    unit: "mW",
    hints: [
      "Maximum power transfer occurs when the load is matched to the source's internal resistance — so first reduce everything left of node A to its Thevenin equivalent.",
      "Vth is the open-circuit voltage at node A (the R1-R2 divider), and Rth is R1 in parallel with R2; the optimal RL equals Rth.",
      "At the match, the load power is Vth^2/(4*Rth); convert watts to milliwatts.",
    ],
    solution:
      "**Governing principle — Maximum Power Transfer Theorem.** A source delivers the most power to a load when the load resistance equals the source's Thevenin resistance, $R_L = R_{th}$. So first reduce everything left of node A to a Thevenin equivalent, then apply the match condition.\n\n" +
      "**Step 1 — Thevenin voltage (open-circuit at node A).** With no load, $R_1$ and $R_2$ form a divider:\n$$V_{th} = V_s\\frac{R_2}{R_1 + R_2} = 20 \\cdot \\frac{120}{60 + 120} = 20 \\cdot \\frac{120}{180} = 13.333\\ \\text{V}$$\n\n" +
      "**Step 2 — Thevenin resistance (source shorted).** Looking into node A, $R_1 \\| R_2$:\n$$R_{th} = \\frac{R_1 R_2}{R_1 + R_2} = \\frac{60 \\times 120}{180} = \\frac{7200}{180} = 40\\ \\Omega$$\n\n" +
      "**Step 3 — Apply the match condition.** Maximum power occurs at $R_L = R_{th} = 40\\ \\Omega$. At the match, exactly half the source voltage drops across the load, and the maximum power is:\n$$P_{max} = \\frac{V_{th}^2}{4 R_{th}} = \\frac{(13.333)^2}{4 \\times 40} = \\frac{177.78}{160} = 1.1111\\ \\text{W}$$\n\n" +
      "**Step 4 — Convert to milliwatts:**\n$$P_{max} = 1.1111 \\times 1000 = 1111\\ \\text{mW}$$\n\n" +
      "**Key insight / trap:** The optimal $R_L$ is $R_{th} = 40\\ \\Omega$ — *not* $R_2 = 120\\ \\Omega$ or $R_1$. The $V_{th}^2/(4R_{th})$ shortcut already bakes in the matched condition, so you don't need to recompute the loop current. Note efficiency at the match is only $50\\%$ (equal power lost in $R_{th}$), but power *delivered* is maximized, which is what was asked.\n\n" +
      "**Final answer: $P_{max} \\approx 1111\\ \\text{mW}$**",
  },
];
