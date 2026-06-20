import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION: Tension in a connected two-body system. Hanging mass m2=4 kg drives
  // a cart m1=6 kg on a frictionless table over a massless pulley.
  // System accel a = m2·g/(m1+m2) = 4·9.81/10 = 3.924 m/s².
  // Cord tension on the cart: T = m1·a = 6·3.924 = 23.5 N.
  // (Check via hanging body: T = m2(g−a) = 4(9.81−3.924)=23.5 N. ✓)
  {
    id: "md_001",
    slug: "dynamics-newton-second-law-acceleration",
    title: "Cord Tension in a Pulley-Connected System",
    prompt:
      "On a test rig, a 6 kg cart rests on a frictionless horizontal table. A light, inextensible cord runs from the cart, over a frictionless massless pulley at the table edge, down to a hanging 4 kg mass. The hanging mass is released from rest.\n\nDetermine the tension carried by the cord. Use g = 9.81 m/s².\n\nReport the tension in newtons (N), rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "EASY",
    eloWeight: 16,
    tags: ["kinematics", "newton", "dynamics", "free-body"],
    skillAreas: ["dynamics", "statics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 23.5,
    tolerance: 0.3,
    unit: "N",
    hints: [
      "Draw a separate free-body diagram for each mass. The cord tension is the same throughout because the cord and pulley are massless and frictionless.",
      "Both masses share the same magnitude of acceleration (the cord is inextensible). The hanging weight is what drives the motion; the only horizontal force on the cart is the tension.",
      "Find the system acceleration first by treating both masses together, then apply Newton's second law to just one body to back out the tension. Note the tension is less than the hanging weight.",
    ],
    solution:
      "**Governing principle — Newton's second law on each body.** The cord couples two masses, so the system has one common acceleration. The cord is massless and runs over a frictionless massless pulley, so the tension $T$ is the same on both ends. We use $\\sum F = ma$ on each body.\n\n" +
      "**Step 1 — Free-body diagrams.** Cart (mass $m_1 = 6$ kg) on a frictionless table: the only horizontal force is the cord tension $T$, so $T = m_1 a$. Hanging mass ($m_2 = 4$ kg): its weight pulls down and the tension pulls up, so $m_2 g - T = m_2 a$.\n\n" +
      "**Step 2 — Find the system acceleration.** Add the two equations to eliminate $T$:\n$$a = \\frac{m_2 g}{m_1 + m_2} = \\frac{(4)(9.81)}{6 + 4} = \\frac{39.24}{10} = 3.924\\ \\text{m/s}^2.$$\n\n" +
      "**Step 3 — Back out the tension.** Apply Newton's law to the cart alone:\n$$T = m_1 a = (6)(3.924) = 23.54\\ \\text{N}.$$\n\n" +
      "**Step 4 — Check via the hanging body.** $T = m_2(g - a) = 4(9.81 - 3.924) = 4(5.886) = 23.5$ N. ✓\n\n" +
      "**Key insight / trap.** The tension is *not* equal to the hanging weight $m_2 g = 39.2$ N. If the cord held the full weight there would be no net force to accelerate $m_2$. Because the system accelerates, $T < m_2 g$.\n\n" +
      "**Final answer: $T \\approx 23.5\\ \\text{N}$.**",
  },
  // SOLUTION: Angular deceleration of a flywheel under friction torque.
  // I = 0.4 kg·m², initial speed N0 = 1200 rpm → ω0 = 1200·2π/60 = 125.66 rad/s.
  // Constant friction torque τ = 8 N·m → α = τ/I = 8/0.4 = 20 rad/s² (deceleration).
  // Time to stop t = ω0/α = 125.66/20 = 6.283 s ≈ 6.3 s.
  {
    id: "md_002",
    slug: "dynamics-angular-acceleration-torque",
    title: "Coast-Down Time of a Flywheel",
    prompt:
      "A flywheel (mass moment of inertia 0.4 kg·m² about its axis) is spinning freely at 1200 rpm when its drive is disconnected. A constant bearing-friction torque of 8 N·m then acts to slow it.\n\nHow long does the flywheel take to come to a complete stop?\n\nReport the time in seconds (s), rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["rotational", "torque", "inertia", "kinematics"],
    skillAreas: ["dynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 6.3,
    tolerance: 0.1,
    unit: "s",
    hints: [
      "This is the rotational analog of a constant-force deceleration. The friction torque produces a constant angular deceleration.",
      "Relate torque and inertia to get angular deceleration, then use the rotational version of v = v0 - a·t to find when speed reaches zero.",
      "Convert the initial speed from rpm to rad/s before combining it with the angular deceleration, or your time will be off by the 2π/60 factor.",
    ],
    solution:
      "**Governing principle — rotational form of Newton's second law, $\\tau = I\\alpha$.** A constant friction torque produces a constant angular deceleration, so this is the rotational analog of uniform-deceleration kinematics.\n\n" +
      "**Step 1 — Convert the initial speed to rad/s.** A torque in N·m and an inertia in kg·m² produce $\\alpha$ in rad/s², so the speed must be in rad/s:\n$$\\omega_0 = 1200\\ \\text{rpm} \\times \\frac{2\\pi}{60} = 125.66\\ \\text{rad/s}.$$\n\n" +
      "**Step 2 — Find the angular deceleration.** With $I = 0.4$ kg·m² and friction torque $\\tau = 8$ N·m opposing the motion:\n$$\\alpha = \\frac{\\tau}{I} = \\frac{8}{0.4} = 20\\ \\text{rad/s}^2.$$\n\n" +
      "**Step 3 — Time to stop.** Using $\\omega = \\omega_0 - \\alpha t$ with final $\\omega = 0$:\n$$t = \\frac{\\omega_0}{\\alpha} = \\frac{125.66}{20} = 6.283\\ \\text{s}.$$\n\n" +
      "**Key insight / trap.** The classic error is to plug 1200 rpm straight in. Forgetting the $2\\pi/60$ conversion gives a nonsensical time. Everything else is the rotational mirror of linear motion.\n\n" +
      "**Final answer: $t \\approx 6.3\\ \\text{s}$.**",
  },
  // SOLUTION: Motor selection by required power, then judgment on rating.
  // A conveyor needs torque T = 50 N·m at N = 1500 rpm.
  // ω = 2π·N/60 = 2π·1500/60 = 157.08 rad/s.
  // Required mechanical power P = T·ω = 50·157.08 = 7854 W ≈ 7.85 kW.
  // Drive efficiency 0.90 → motor electrical input ≈ 7.85/0.90 = 8.73 kW,
  // but question asks SHAFT power required at the load = 7.9 kW.
  {
    id: "md_003",
    slug: "dynamics-shaft-power-from-torque-speed",
    title: "Shaft Power to Drive a Conveyor",
    prompt:
      "A conveyor drive shaft must supply a steady 50 N·m of torque while turning at 1500 rpm.\n\nDetermine the mechanical shaft power that must be delivered to the load.\n\nReport the power in kilowatts (kW), rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["power", "torque", "rotational", "unit-conversion"],
    skillAreas: ["dynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 7.9,
    tolerance: 0.1,
    unit: "kW",
    hints: [
      "Mechanical power on a rotating shaft depends on both how hard it twists (torque) and how fast it turns (angular speed).",
      "The speed must be in radians per second, not rpm, before it can be multiplied by a torque in N·m to give watts.",
      "After finding the power in watts, divide by 1000 for kilowatts.",
    ],
    solution:
      "**Governing principle — rotational power, $P = T\\omega$.** Mechanical power delivered by a rotating shaft is the product of the torque it carries and its angular speed in rad/s.\n\n" +
      "**Step 1 — Convert speed to rad/s.** $P = T\\omega$ requires $\\omega$ in rad/s for the answer to come out in watts:\n$$\\omega = \\frac{2\\pi N}{60} = \\frac{2\\pi (1500)}{60} = 157.08\\ \\text{rad/s}.$$\n\n" +
      "**Step 2 — Compute the power.** With $T = 50$ N·m:\n$$P = T\\omega = (50)(157.08) = 7854\\ \\text{W}.$$\n\n" +
      "**Step 3 — Convert to kW.**\n$$P = \\frac{7854}{1000} = 7.854\\ \\text{kW}.$$\n\n" +
      "**Key insight / trap.** This asks for the *shaft (load) power*, so no efficiency factor is applied — efficiency would only matter to size the upstream motor. A useful shortcut is $P\\,[\\text{kW}] = \\dfrac{T\\,[\\text{N·m}]\\times N\\,[\\text{rpm}]}{9549}$, which gives $\\dfrac{50\\times1500}{9549}=7.85$ kW.\n\n" +
      "**Final answer: $P \\approx 7.9\\ \\text{kW}$.**",
  },
  // SOLUTION: Static deflection method — common interview shortcut, no k or m given.
  // A machine mounted on isolators settles 5 mm (0.005 m) under its own weight.
  // For a linear mount, k·δ = m·g, so k/m = g/δ.
  // fn = (1/2π)·√(k/m) = (1/2π)·√(g/δ) = (1/2π)·√(9.81/0.005)
  //    = (1/2π)·√1962 = (1/2π)·44.29 = 7.05 Hz.
  {
    id: "md_004",
    slug: "dynamics-natural-frequency-spring-mass",
    title: "Natural Frequency from Static Deflection",
    prompt:
      "An air compressor is bolted to four identical rubber isolation mounts. When the unit is set in place, the mounts compress a total of 5.0 mm under the machine's static weight.\n\nWithout knowing the machine mass or the individual mount stiffness, estimate the vertical natural frequency of the isolated machine. Use g = 9.81 m/s².\n\nReport the natural frequency in hertz (Hz), rounded to two decimal places.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["vibrations", "natural-frequency", "static-deflection"],
    skillAreas: ["vibrations"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 7.05,
    tolerance: 0.08,
    unit: "Hz",
    hints: [
      "You are not given mass or stiffness separately, but natural frequency depends only on their ratio. Find a way to express that ratio from the information you do have.",
      "At rest, the static weight is balanced by the spring force in the mounts. Writing that equilibrium lets the unknown mass and stiffness cancel, leaving only the deflection and gravity.",
      "Be careful with units: convert the deflection to meters before combining it with g, and remember the final answer is a frequency in Hz, not an angular frequency in rad/s.",
    ],
    solution:
      "**Governing principle — natural frequency depends only on the stiffness-to-mass ratio.** $f_n = \\frac{1}{2\\pi}\\sqrt{k/m}$. We are given neither $k$ nor $m$, but static equilibrium lets us replace $k/m$ entirely.\n\n" +
      "**Step 1 — Use static equilibrium to eliminate the unknowns.** At rest the weight is balanced by the spring force: $k\\,\\delta_{st} = m g$. Therefore\n$$\\frac{k}{m} = \\frac{g}{\\delta_{st}}.$$\n\n" +
      "**Step 2 — Substitute into the natural-frequency formula.**\n$$f_n = \\frac{1}{2\\pi}\\sqrt{\\frac{g}{\\delta_{st}}}.$$\n\n" +
      "**Step 3 — Substitute numbers with units.** Convert deflection: $\\delta_{st} = 5.0\\ \\text{mm} = 0.005\\ \\text{m}$.\n$$f_n = \\frac{1}{2\\pi}\\sqrt{\\frac{9.81}{0.005}} = \\frac{1}{2\\pi}\\sqrt{1962} = \\frac{44.29}{6.2832} = 7.05\\ \\text{Hz}.$$\n\n" +
      "**Key insight / trap.** The four mounts share the load, but because they act in parallel the *combined* deflection of 5 mm under the *full* weight already encodes the effective $k/m$ — you do not need the count of mounts or any individual stiffness. Also keep the answer in Hz: $\\omega_n = \\sqrt{g/\\delta}=44.3$ rad/s would be a factor of $2\\pi$ too large.\n\n" +
      "**Final answer: $f_n \\approx 7.05\\ \\text{Hz}$.**",
  },
  // SOLUTION: Damping ratio from logarithmic decrement (multi-step).
  // Free-vibration trace: amplitude decays from 10.0 mm to 4.0 mm over 5 cycles.
  // Log decrement δ = (1/n)·ln(x0/xn) = (1/5)·ln(10/4) = (1/5)·0.9163 = 0.18326.
  // ζ = δ/√(4π² + δ²) = 0.18326/√(39.478 + 0.0336) = 0.18326/6.286 = 0.02915.
  // → ζ ≈ 0.029.
  {
    id: "md_005",
    slug: "dynamics-damped-natural-frequency",
    title: "Damping Ratio from a Decay Record",
    prompt:
      "An engineer plucks a cantilevered sensor bracket and records its free vibration. Successive peak amplitudes decay from 10.0 mm down to 4.0 mm over exactly 5 complete cycles of oscillation.\n\nDetermine the system's viscous damping ratio.\n\nReport the damping ratio as a dimensionless number, rounded to three decimal places.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 32,
    tags: ["vibrations", "damping", "logarithmic-decrement"],
    skillAreas: ["vibrations"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.029,
    tolerance: 0.002,
    hints: [
      "The amplitude of a lightly damped free vibration decays geometrically cycle to cycle. The ratio of any two peaks reflects the damping.",
      "Use the logarithmic decrement: take the natural log of the amplitude ratio, but divide by the number of cycles between the two peaks, not just one.",
      "Convert the logarithmic decrement to the damping ratio. For small damping the approximation ζ ≈ δ/(2π) is close, but use the full relation for the third decimal place.",
    ],
    solution:
      "**Governing principle — logarithmic decrement.** In an underdamped free vibration the peak amplitudes decay geometrically, and the per-cycle decay is set by the damping ratio $\\zeta$ through the logarithmic decrement $\\delta$.\n\n" +
      "**Step 1 — Compute the logarithmic decrement.** With $x_0 = 10.0$ mm decaying to $x_n = 4.0$ mm over $n = 5$ cycles:\n$$\\delta = \\frac{1}{n}\\ln\\!\\frac{x_0}{x_n} = \\frac{1}{5}\\ln\\!\\frac{10.0}{4.0} = \\frac{1}{5}(0.9163) = 0.18326.$$\n\n" +
      "**Step 2 — Convert decrement to damping ratio.** Using the exact relation\n$$\\zeta = \\frac{\\delta}{\\sqrt{4\\pi^2 + \\delta^2}} = \\frac{0.18326}{\\sqrt{39.478 + 0.0336}} = \\frac{0.18326}{6.286} = 0.02915.$$\n\n" +
      "**Step 3 — Round.** $\\zeta \\approx 0.029$.\n\n" +
      "**Key insight / trap.** Two traps. (1) Divide by the *number of cycles* $n=5$; using a single-cycle ratio would overstate $\\zeta$ fivefold. (2) The small-damping shortcut $\\zeta \\approx \\delta/(2\\pi) = 0.0292$ happens to agree to three places here because damping is tiny, but the full $\\sqrt{4\\pi^2+\\delta^2}$ form is the safe choice.\n\n" +
      "**Final answer: $\\zeta \\approx 0.029$.**",
  },
  // SOLUTION: Bearing selection by required L10 life (reverse of catalog problem).
  // Required life: 8000 h at 1800 rpm.
  // L10 in revolutions = 8000 h · 60 min/h · 1800 rev/min = 8.64e8 rev = 864 Mrev.
  // Ball bearing: L10 (Mrev) = (C/P)³ → C = P·(L10)^(1/3).
  // P = 6 kN, (864)^(1/3) = 9.524.
  // C = 6·9.524 = 57.1 kN.
  {
    id: "md_006",
    slug: "dynamics-bearing-l10-life",
    title: "Sizing a Ball Bearing for Service Life",
    prompt:
      "A ball bearing carries a steady equivalent radial load of 6 kN and runs continuously at 1800 rpm. The design specification calls for an L10 rating life of 8000 operating hours.\n\nDetermine the minimum basic dynamic load rating C the selected bearing must have.\n\nReport C in kilonewtons (kN), rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 32,
    tags: ["bearing", "machine-design", "fatigue", "life"],
    skillAreas: ["materials", "dynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 57.1,
    tolerance: 0.8,
    unit: "kN",
    hints: [
      "Bearing rating life is defined in millions of revolutions, not hours. Convert the required service life to revolutions first.",
      "For ball bearings, the load–life relationship uses an exponent of 3 (it would be 10/3 for roller bearings). The dynamic capacity C and the equivalent load P relate through that power and the life.",
      "Rearrange to solve for C, so you raise the life-in-millions to the 1/3 power and multiply by the applied load. The answer should be several times larger than the 6 kN load.",
    ],
    solution:
      "**Governing principle — the bearing load–life equation.** For a ball bearing the rated life in millions of revolutions is $L_{10} = (C/P)^3$, where $C$ is the basic dynamic load rating and $P$ the equivalent load. We invert it to size $C$.\n\n" +
      "**Step 1 — Convert required life to revolutions.** $L_{10}$ must be in millions of revolutions, not hours:\n$$L_{10} = 8000\\ \\text{h} \\times 60\\ \\tfrac{\\text{min}}{\\text{h}} \\times 1800\\ \\tfrac{\\text{rev}}{\\text{min}} = 8.64\\times 10^{8}\\ \\text{rev} = 864\\ \\text{Mrev}.$$\n\n" +
      "**Step 2 — Solve the load–life relation for $C$.** From $L_{10} = (C/P)^3$:\n$$C = P\\,(L_{10})^{1/3}.$$\n\n" +
      "**Step 3 — Substitute.** With $P = 6$ kN and $(864)^{1/3} = 9.524$:\n$$C = 6 \\times 9.524 = 57.1\\ \\text{kN}.$$\n\n" +
      "**Key insight / trap.** The exponent is **3 for ball bearings** (it would be $10/3$ for roller bearings). Also do not forget to convert hours to millions of revolutions — leaving life in hours throws the cube-root term off by orders of magnitude. The required $C$ being ~9.5× the load is expected.\n\n" +
      "**Final answer: $C \\approx 57.1\\ \\text{kN}$.**",
  },
  // SOLUTION: Two-stage compound gear train, output torque with efficiency.
  // Stage 1 ratio 4:1, stage 2 ratio 3:1 → overall ratio i = 12:1 (speed reduction).
  // Input torque 10 N·m. Ideal output = 10·12 = 120 N·m.
  // Each mesh efficiency 0.97 → overall η = 0.97² = 0.9409.
  // Actual output torque = 120·0.9409 = 112.9 N·m.
  // Distractor 120 = ignoring losses; 113 correct; 40 = single stage; 30 = wrong dir.
  {
    id: "md_007",
    slug: "dynamics-gear-ratio-output-torque",
    title: "Output Torque of a Compound Gearbox",
    prompt:
      "A compound (two-stage) reduction gearbox takes 10 N·m at its input shaft. The first stage reduces speed 4:1 and the second stage reduces 3:1. Each gear mesh is 97% efficient.\n\nWhich value is closest to the torque available at the output shaft?",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["gears", "torque", "machine-design", "efficiency"],
    skillAreas: ["dynamics"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      { id: "a", label: "30 N·m" },
      { id: "b", label: "40 N·m" },
      { id: "c", label: "113 N·m", correct: true },
      { id: "d", label: "120 N·m" },
    ],
    hints: [
      "In a speed reducer, torque is multiplied by the same factor that speed is divided by. First find the overall (combined) reduction ratio of the two stages.",
      "The two stage ratios multiply to give the overall ratio; they do not add. Apply that overall ratio to the input torque for the ideal output.",
      "Each mesh loses a little power, so multiply by the efficiency once per stage (efficiency to the power of the number of meshes). The real output is slightly below the ideal value.",
    ],
    solution:
      "**Governing principle — torque is multiplied by the gear ratio, reduced by mesh efficiency.** In a speed reducer, output torque scales with the overall reduction ratio; each mesh then skims off a fraction of the power.\n\n" +
      "**Step 1 — Overall ratio.** Stage ratios multiply, they do not add:\n$$i = 4 \\times 3 = 12.$$\n\n" +
      "**Step 2 — Ideal output torque.**\n$$T_{out,ideal} = i\\,T_{in} = 12 \\times 10 = 120\\ \\text{N·m}.$$\n\n" +
      "**Step 3 — Apply efficiency once per mesh.** Two meshes at 0.97 each:\n$$\\eta = 0.97^2 = 0.9409, \\qquad T_{out} = 120 \\times 0.9409 = 112.9\\ \\text{N·m}.$$\n\n" +
      "**Why the right answer and not the distractors.**\n- **(c) 113 N·m — correct:** overall ratio 12 with two-mesh efficiency $0.97^2$.\n- **(d) 120 N·m:** ignores the meshing losses (ideal value).\n- **(b) 40 N·m:** used only a single stage (ratio 4 instead of 12) or otherwise dropped a stage.\n- **(a) 30 N·m:** treated the gearbox as a speed *increaser* / divided by a ratio, reversing the direction of torque change.\n\n" +
      "**Key insight / trap.** Reduction multiplies torque; the ratios compound multiplicatively, and efficiency is applied per mesh ($\\eta^{\\text{(number of meshes)}}$), making the real output slightly below the ideal 120 N·m.\n\n" +
      "**Final answer: 113 N·m (choice c).**",
  },
  // SOLUTION: Vibration isolation judgment — transmissibility regime.
  // A machine runs at forcing frequency f. To ISOLATE (transmit less than the
  // applied force, T<1), the frequency ratio r = f/fn must exceed √2 ≈ 1.414.
  // So the mount must be SOFT enough that fn < f/√2. Below √2 (and especially
  // near r=1) the mount AMPLIFIES the force. Correct judgment: choose a mount
  // whose natural frequency is well below the operating frequency (r > √2),
  // accepting that the machine must pass through resonance during run-up.
  {
    id: "md_008",
    slug: "dynamics-resonance-concept",
    title: "Selecting an Isolation Mount Regime",
    prompt:
      "A pump runs at a fixed operating speed and transmits unwanted force into the floor. You must specify spring isolators so the floor sees LESS force than the pump generates (force transmissibility below 1).\n\nWhich design choice correctly achieves isolation?",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["vibrations", "transmissibility", "isolation", "concept"],
    skillAreas: ["vibrations"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Soft mounts so the system natural frequency is well below the operating speed (frequency ratio above √2)",
        correct: true,
      },
      {
        id: "b",
        label:
          "Stiff mounts so the natural frequency is well above the operating speed",
      },
      {
        id: "c",
        label:
          "Mounts tuned so the natural frequency equals the operating speed for maximum response",
      },
      {
        id: "d",
        label:
          "Any mount works because isolation depends only on added damping, not on the frequency ratio",
      },
    ],
    hints: [
      "Think about the transmissibility curve as a function of the frequency ratio (operating frequency divided by natural frequency).",
      "Transmissibility is greater than 1 (amplification) near resonance and only drops below 1 once the ratio passes a specific threshold.",
      "Isolation requires the operating frequency to sit well above the natural frequency. Recall the exact frequency ratio above which transmissibility falls below 1, and consider whether stiff or soft mounts get you there.",
    ],
    solution:
      "**Governing principle — the transmissibility curve versus frequency ratio.** Force transmissibility $TR$ depends on the ratio $r = f/f_n$ (operating frequency over natural frequency). Isolation means $TR < 1$.\n\n" +
      "**Step 1 — Recall where $TR$ crosses 1.** For an undamped (or lightly damped) mount, $TR = \\left|\\dfrac{1}{1-r^2}\\right|$. Setting $TR = 1$ gives $|1 - r^2| = 1$, so $r^2 = 2$, i.e. $r = \\sqrt{2} \\approx 1.414$.\n\n" +
      "**Step 2 — Identify the isolation regime.** For $r < \\sqrt 2$ (especially near $r = 1$, resonance) the mount *amplifies* the force. Only for $r > \\sqrt 2$ does $TR < 1$ and true isolation occur.\n\n" +
      "**Step 3 — Translate to a stiffness choice.** A large $r = f/f_n$ requires a *low* natural frequency $f_n = \\frac{1}{2\\pi}\\sqrt{k/m}$, which means **soft** (low-$k$) mounts.\n\n" +
      "**Why the right answer and not the distractors.**\n- **(a) — correct:** soft mounts push $f_n$ well below the operating speed so $r > \\sqrt 2$ and the floor sees less force.\n- **(b):** stiff mounts raise $f_n$ above the operating speed ($r < 1$), giving $TR > 1$ — amplification, the opposite of isolation.\n- **(c):** tuning $f_n$ to the operating speed ($r = 1$) is resonance — the worst possible case, maximizing transmitted force.\n- **(d):** damping alone cannot give isolation; below $r = \\sqrt 2$ no amount of damping pushes $TR$ under 1, and above $\\sqrt 2$ extra damping actually *worsens* isolation.\n\n" +
      "**Key insight / trap.** The cost of soft mounts is that the machine must pass through resonance during run-up and coast-down, so some startup damping is desirable — but at the operating point isolation needs $r > \\sqrt 2$.\n\n" +
      "**Final answer: choice (a) — soft mounts giving a frequency ratio above $\\sqrt 2$.**",
  },
  // SOLUTION: Critical (whirling) speed of a shaft with central disk.
  // Shaft: steel, E = 200 GPa, simply supported span L = 0.6 m, diameter d = 25 mm.
  // I = π·d⁴/64 = π·(0.025)⁴/64 = π·3.9063e-7/64 = 1.9175e-8 m⁴.
  // Central load (disk weight) static deflection coefficient: a central mass on a
  // simply-supported shaft gives k = 48·E·I/L³.
  // k = 48·200e9·1.9175e-8 / (0.6)³ = 48·200e9·1.9175e-8 / 0.216
  //   = (184080) / 0.216 ... compute numerator: 200e9·1.9175e-8 = 3835; ·48 = 184080 N/m?
  //   184080/0.216 = 852,222 N/m.
  // Disk mass m = 8 kg. ωn = √(k/m) = √(852222/8) = √106527.8 = 326.4 rad/s.
  // Critical speed Nc = ωn·60/(2π) = 326.4·9.5493 = 3117 rpm ≈ 3120 rpm.
  {
    id: "md_009",
    slug: "dynamics-resonance-mitigation-essay",
    title: "Critical Speed of a Disk-Loaded Shaft",
    prompt:
      "A steel shaft (E = 200 GPa) of 25 mm diameter is simply supported on bearings 0.6 m apart. A 8 kg rotor disk is mounted at midspan; the shaft's own mass is negligible.\n\nDetermine the shaft's first critical (whirling) speed. Treat the disk as a point mass on a massless beam, and model the lateral stiffness from the standard simply-supported, midspan-load deflection.\n\nReport the critical speed in rpm, rounded to the nearest 10 rpm.",
    discipline: "MECHANICAL",
    difficulty: "EXPERT",
    eloWeight: 38,
    tags: ["vibrations", "critical-speed", "shaft", "machine-design"],
    skillAreas: ["vibrations", "mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 3120,
    tolerance: 40,
    unit: "rpm",
    hints: [
      "The critical speed coincides with the lateral natural frequency of the disk bouncing on the shaft acting as a spring. You need the shaft's lateral stiffness and the disk mass.",
      "Get the stiffness from the beam: a midspan point load on a simply-supported span deflects by PL³/(48EI), so the effective spring constant is 48EI/L³. Compute the area moment of inertia from the diameter first.",
      "Find the natural angular frequency from stiffness and mass, then convert rad/s to rpm with the 60/(2π) factor. Keep diameter and length in meters throughout.",
    ],
    solution:
      "**Governing principle — critical speed equals the lateral natural frequency.** The disk bounces on the shaft, which acts as a lateral spring. The whirl becomes critical when shaft speed coincides with $\\omega_n = \\sqrt{k/m}$.\n\n" +
      "**Step 1 — Area moment of inertia of the round shaft.** With $d = 25$ mm $= 0.025$ m:\n$$I = \\frac{\\pi d^4}{64} = \\frac{\\pi (0.025)^4}{64} = 1.9175\\times 10^{-8}\\ \\text{m}^4.$$\n\n" +
      "**Step 2 — Lateral stiffness from the beam deflection.** A midspan point load on a simply-supported span deflects $\\delta = PL^3/(48EI)$, so $k = 48EI/L^3$. With $E = 200$ GPa $= 200\\times10^9$ Pa and $L = 0.6$ m:\n$$k = \\frac{48(200\\times10^9)(1.9175\\times10^{-8})}{(0.6)^3} = \\frac{184080}{0.216} = 8.522\\times10^{5}\\ \\text{N/m}.$$\n\n" +
      "**Step 3 — Natural angular frequency.** Disk mass $m = 8$ kg:\n$$\\omega_n = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{8.522\\times10^5}{8}} = \\sqrt{106528} = 326.4\\ \\text{rad/s}.$$\n\n" +
      "**Step 4 — Convert to rpm.**\n$$N_c = \\omega_n \\times \\frac{60}{2\\pi} = 326.4 \\times 9.5493 = 3117\\ \\text{rpm} \\approx 3120\\ \\text{rpm}.$$\n\n" +
      "**Key insight / trap.** Keep $d$ and $L$ in meters so $I$, $k$, and $\\omega_n$ stay consistent — a millimeter slip in $d$ scales $I$ by $10^{12}$. The shaft's own mass is neglected, so all the inertia is the disk. Use $48EI/L^3$ (midspan point load), not the $384EI/(5L^3)$ distributed-load stiffness.\n\n" +
      "**Final answer: $N_c \\approx 3120\\ \\text{rpm}$.**",
  },
  // SOLUTION: Work–energy theorem with friction (multi-step, no formula given).
  // A 1500 kg car brakes from 25 m/s to rest; find stopping distance on a level
  // road with kinetic friction coefficient μ = 0.7 (locked wheels).
  // Friction force F = μ·m·g = 0.7·1500·9.81 = 10300.5 N (deceleration a = μg = 6.867 m/s²).
  // Work–energy: ½·m·v² = F·d → d = v²/(2·μ·g) = 25²/(2·0.7·9.81)
  //   = 625/13.734 = 45.5 m.
  {
    id: "md_010",
    slug: "dynamics-work-energy-braking-distance",
    title: "Emergency Braking Distance",
    prompt:
      "A 1500 kg sedan travelling at 25 m/s on level, dry pavement performs a panic stop with all four wheels locked. The tire–road kinetic friction coefficient is 0.7.\n\nDetermine the distance the car slides before coming to rest. Use g = 9.81 m/s².\n\nReport the stopping distance in meters (m), rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["work-energy", "friction", "dynamics", "automotive"],
    skillAreas: ["dynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 45.5,
    tolerance: 0.6,
    unit: "m",
    hints: [
      "The kinetic energy at the start must all be dissipated by friction work over the sliding distance — or equivalently, friction sets a constant deceleration.",
      "The friction force equals the friction coefficient times the normal force, which on level ground is the full weight. Notice the mass will cancel out of the final result.",
      "Set initial kinetic energy equal to friction force times distance and solve for distance; the answer depends only on speed, the coefficient, and g.",
    ],
    solution:
      "**Governing principle — the work–energy theorem.** All the car's kinetic energy is dissipated by the friction force acting over the sliding distance: $\\tfrac12 m v^2 = F_f\\, d$.\n\n" +
      "**Step 1 — Friction force on level ground.** The normal force equals the full weight, so\n$$F_f = \\mu m g.$$\n\n" +
      "**Step 2 — Set energy equal to friction work.**\n$$\\tfrac12 m v^2 = \\mu m g\\, d.$$\n\n" +
      "**Step 3 — Solve for distance (mass cancels).**\n$$d = \\frac{v^2}{2\\mu g} = \\frac{(25)^2}{2(0.7)(9.81)} = \\frac{625}{13.734} = 45.5\\ \\text{m}.$$\n\n" +
      "**Key insight / trap.** The mass cancels completely — stopping distance is independent of how heavy the car is, depending only on speed, $\\mu$, and $g$. Equivalently the deceleration is $a = \\mu g = 6.87$ m/s² and $d = v^2/(2a)$. Note distance scales with $v^2$: doubling speed quadruples the stopping distance.\n\n" +
      "**Final answer: $d \\approx 45.5\\ \\text{m}$.**",
  },
  // SOLUTION: Impulse–momentum / inelastic collision then energy loss judgment.
  // Railcar A (20,000 kg, 3 m/s) couples to stationary railcar B (15,000 kg).
  // Conservation of momentum: v = mA·vA/(mA+mB) = 20000·3/35000 = 1.7143 m/s.
  // KE before = ½·20000·3² = 90,000 J. KE after = ½·35000·1.7143² = 51,429 J.
  // Energy dissipated = 90000 − 51429 = 38,571 J ≈ 38.6 kJ.
  {
    id: "md_011",
    slug: "dynamics-inelastic-collision-energy-loss",
    title: "Energy Lost in Railcar Coupling",
    prompt:
      "A 20,000 kg loaded railcar rolling at 3.0 m/s strikes and automatically couples to a stationary 15,000 kg railcar. The two then move together.\n\nDetermine the kinetic energy dissipated during the coupling (in the coupler, deformation, and sound).\n\nReport the energy lost in kilojoules (kJ), rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["impulse-momentum", "collision", "energy", "dynamics"],
    skillAreas: ["dynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 38.6,
    tolerance: 0.5,
    unit: "kJ",
    hints: [
      "Coupling is a perfectly inelastic collision: the cars move together afterward. Momentum is conserved through the impact, but kinetic energy is not.",
      "Use conservation of momentum to find the common velocity right after coupling, remembering car B starts at rest.",
      "Compute total kinetic energy before and after, then take the difference. The lost energy is what shows up as deformation, heat, and sound.",
    ],
    solution:
      "**Governing principle — momentum is conserved, kinetic energy is not, in a perfectly inelastic collision.** Coupling locks the cars together, so use conservation of momentum to find the common velocity, then compare kinetic energies.\n\n" +
      "**Step 1 — Conservation of momentum.** Car A ($m_A = 20{,}000$ kg, $v_A = 3.0$ m/s) couples to stationary car B ($m_B = 15{,}000$ kg):\n$$v = \\frac{m_A v_A}{m_A + m_B} = \\frac{(20{,}000)(3.0)}{35{,}000} = 1.7143\\ \\text{m/s}.$$\n\n" +
      "**Step 2 — Kinetic energy before.**\n$$KE_i = \\tfrac12 m_A v_A^2 = \\tfrac12 (20{,}000)(3.0)^2 = 90{,}000\\ \\text{J}.$$\n\n" +
      "**Step 3 — Kinetic energy after.**\n$$KE_f = \\tfrac12 (m_A + m_B) v^2 = \\tfrac12 (35{,}000)(1.7143)^2 = 51{,}429\\ \\text{J}.$$\n\n" +
      "**Step 4 — Energy dissipated.**\n$$\\Delta KE = 90{,}000 - 51{,}429 = 38{,}571\\ \\text{J} = 38.6\\ \\text{kJ}.$$\n\n" +
      "**Key insight / trap.** Do not use energy conservation to find the final speed — energy is *lost* in the coupling. Only momentum carries through the impact. The lost ~43% of the initial KE becomes deformation, heat, and sound.\n\n" +
      "**Final answer: $\\Delta KE \\approx 38.6\\ \\text{kJ}$.**",
  },
  // SOLUTION: Shaft diameter from torsion stress (machine design, choose method).
  // Solid shaft transmits P = 15 kW at N = 600 rpm; allowable shear stress τ = 40 MPa.
  // ω = 2π·600/60 = 62.832 rad/s. Torque T = P/ω = 15000/62.832 = 238.73 N·m.
  // Torsion: τ = 16·T/(π·d³) → d³ = 16·T/(π·τ) = 16·238.73/(π·40e6)
  //   = 3819.7/(1.2566e8) = 3.0397e-5 m³.
  // d = (3.0397e-5)^(1/3) = 0.03124 m = 31.2 mm.
  {
    id: "md_012",
    slug: "dynamics-shaft-diameter-torsion",
    title: "Minimum Shaft Diameter for Torque",
    prompt:
      "A solid circular steel shaft must transmit 15 kW at 600 rpm. The design limits the maximum torsional shear stress to 40 MPa.\n\nDetermine the minimum required shaft diameter.\n\nReport the diameter in millimeters (mm), rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 32,
    tags: ["shaft", "torsion", "machine-design", "power-transmission"],
    skillAreas: ["mechanics-of-materials", "dynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 31.2,
    tolerance: 0.5,
    unit: "mm",
    hints: [
      "Two concepts chain together: power and speed give the transmitted torque, then torque and an allowable shear stress give the required diameter.",
      "Convert speed to rad/s to get torque from power. For a solid circular shaft, the maximum surface shear stress relates to torque through the polar section modulus.",
      "The torsion relation reduces to τ = 16T/(πd³) for a solid shaft. Solve for d, then convert meters to millimeters.",
    ],
    solution:
      "**Governing principle — two relations chained: power→torque, then torsion stress→diameter.** First get the torque from the transmitted power and speed, then size the shaft so the surface shear stress stays within the allowable.\n\n" +
      "**Step 1 — Torque from power.** Convert speed: $\\omega = \\frac{2\\pi(600)}{60} = 62.832$ rad/s. Then\n$$T = \\frac{P}{\\omega} = \\frac{15{,}000}{62.832} = 238.73\\ \\text{N·m}.$$\n\n" +
      "**Step 2 — Torsion relation for a solid shaft.** Maximum surface shear stress is $\\tau = \\dfrac{16T}{\\pi d^3}$. Solve for $d^3$:\n$$d^3 = \\frac{16T}{\\pi \\tau} = \\frac{16(238.73)}{\\pi (40\\times10^6)} = \\frac{3819.7}{1.2566\\times10^8} = 3.0397\\times10^{-5}\\ \\text{m}^3.$$\n\n" +
      "**Step 3 — Take the cube root and convert.**\n$$d = (3.0397\\times10^{-5})^{1/3} = 0.03124\\ \\text{m} = 31.2\\ \\text{mm}.$$\n\n" +
      "**Key insight / trap.** Use the allowable stress in pascals ($40\\ \\text{MPa} = 40\\times10^6$ Pa) and keep $d$ in meters until the end. The factor 16 (from $\\tau = T r / J$ with $J = \\pi d^4/32$ and $r = d/2$) is specific to a *solid* round shaft.\n\n" +
      "**Final answer: $d \\approx 31.2\\ \\text{mm}$.**",
  },
  // SOLUTION: Fatigue safety factor via the Goodman line (expert, choose criterion).
  // Component: fully reversed?? No — fluctuating axial stress: σmax = 180 MPa,
  // σmin = 40 MPa. σm = (180+40)/2 = 110 MPa; σa = (180−40)/2 = 70 MPa.
  // Material: Su = 600 MPa, corrected endurance limit Se = 200 MPa.
  // Goodman: 1/n = σa/Se + σm/Su = 70/200 + 110/600 = 0.35 + 0.18333 = 0.53333.
  // n = 1/0.53333 = 1.875 ≈ 1.88.
  {
    id: "md_013",
    slug: "dynamics-goodman-fatigue-safety-factor",
    title: "Fatigue Factor of Safety (Goodman)",
    prompt:
      "A machine link sees a fluctuating axial stress cycling between 40 MPa and 180 MPa. The steel has an ultimate tensile strength of 600 MPa and a corrected endurance limit of 200 MPa.\n\nUsing the modified Goodman criterion for infinite life, determine the factor of safety against fatigue failure.\n\nReport the factor of safety as a dimensionless number, rounded to two decimal places.",
    discipline: "MECHANICAL",
    difficulty: "EXPERT",
    eloWeight: 38,
    tags: ["fatigue", "goodman", "machine-design", "safety-factor"],
    skillAreas: ["mechanics-of-materials", "materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 1.88,
    tolerance: 0.05,
    hints: [
      "A fluctuating stress has both a steady (mean) part and an alternating (amplitude) part. Decompose the max and min stresses into these two components first.",
      "The mean stress is the average of max and min; the alternating stress is half their difference. The Goodman line weighs the alternating part against the endurance limit and the mean part against the ultimate strength.",
      "Combine the two stress ratios as the Goodman criterion prescribes to get the reciprocal of the factor of safety, then invert. The result should be a bit below 2.",
    ],
    solution:
      "**Governing principle — the modified Goodman line.** Fatigue under fluctuating stress combines an alternating component (judged against the endurance limit $S_e$) and a mean component (judged against the ultimate strength $S_u$). The Goodman criterion sums these as $\\frac{\\sigma_a}{S_e} + \\frac{\\sigma_m}{S_u} = \\frac{1}{n}$.\n\n" +
      "**Step 1 — Decompose the stress into mean and alternating parts.** With $\\sigma_{max} = 180$ MPa and $\\sigma_{min} = 40$ MPa:\n$$\\sigma_m = \\frac{\\sigma_{max}+\\sigma_{min}}{2} = \\frac{180+40}{2} = 110\\ \\text{MPa},$$\n$$\\sigma_a = \\frac{\\sigma_{max}-\\sigma_{min}}{2} = \\frac{180-40}{2} = 70\\ \\text{MPa}.$$\n\n" +
      "**Step 2 — Apply the Goodman line.** With $S_e = 200$ MPa and $S_u = 600$ MPa:\n$$\\frac{1}{n} = \\frac{\\sigma_a}{S_e} + \\frac{\\sigma_m}{S_u} = \\frac{70}{200} + \\frac{110}{600} = 0.3500 + 0.18333 = 0.53333.$$\n\n" +
      "**Step 3 — Invert for the factor of safety.**\n$$n = \\frac{1}{0.53333} = 1.875.$$\n\n" +
      "**Key insight / trap.** The mean stress goes against $S_u$, not $S_e$ — pairing both components with the endurance limit (treating it as fully reversed) would wrongly give $n = S_e/\\sigma_a = 2.86$ and miss the damaging effect of the tensile mean stress. Both MPa values share units, so they cancel cleanly.\n\n" +
      "**Final answer: $n \\approx 1.88$.**",
  },
  // SOLUTION: Force transmissibility of an isolated machine at a given ratio.
  // Machine runs at 1800 rpm; isolators give fn = 6 Hz; damping ratio ζ = 0.05.
  // Forcing freq f = 1800/60 = 30 Hz. Frequency ratio r = f/fn = 30/6 = 5.
  // Transmissibility TR = √[1+(2ζr)²] / √[(1−r²)² + (2ζr)²].
  // 2ζr = 2·0.05·5 = 0.5; (2ζr)² = 0.25.
  // Numerator √(1+0.25) = √1.25 = 1.1180.
  // (1−r²) = 1−25 = −24; squared = 576; +0.25 = 576.25; √ = 24.005.
  // TR = 1.1180/24.005 = 0.04657 ≈ 0.047.
  {
    id: "md_014",
    slug: "dynamics-force-transmissibility",
    title: "Force Transmissibility Through Isolators",
    prompt:
      "A machine operating at 1800 rpm is mounted on isolators that give the installation a natural frequency of 6 Hz and a damping ratio of 0.05.\n\nDetermine the fraction of the machine's harmonic disturbing force that is transmitted to the foundation at the operating speed (the force transmissibility).\n\nReport the transmissibility as a dimensionless number, rounded to three decimal places.",
    discipline: "MECHANICAL",
    difficulty: "EXPERT",
    eloWeight: 36,
    tags: ["vibrations", "transmissibility", "isolation", "forced-vibration"],
    skillAreas: ["vibrations"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.047,
    tolerance: 0.004,
    hints: [
      "Transmissibility depends on the frequency ratio (forcing frequency over natural frequency) and the damping ratio. Get both frequencies into the same units first.",
      "Convert the 1800 rpm operating speed to Hz so it can be compared with the 6 Hz natural frequency; the ratio is well above resonance, so expect strong isolation (a small fraction).",
      "Use the damped force-transmissibility formula, which includes the 2ζr damping terms in both numerator and denominator. A small leftover answer near a few percent is expected.",
    ],
    solution:
      "**Governing principle — damped force transmissibility.** The fraction of harmonic force passed to the foundation is $TR = \\dfrac{\\sqrt{1+(2\\zeta r)^2}}{\\sqrt{(1-r^2)^2 + (2\\zeta r)^2}}$, a function of the frequency ratio $r$ and damping ratio $\\zeta$.\n\n" +
      "**Step 1 — Frequency ratio (same units).** Operating speed in Hz: $f = 1800/60 = 30$ Hz. With $f_n = 6$ Hz:\n$$r = \\frac{f}{f_n} = \\frac{30}{6} = 5.$$\n\n" +
      "**Step 2 — Damping term.** $2\\zeta r = 2(0.05)(5) = 0.5$, so $(2\\zeta r)^2 = 0.25$.\n\n" +
      "**Step 3 — Numerator.**\n$$\\sqrt{1 + (2\\zeta r)^2} = \\sqrt{1 + 0.25} = \\sqrt{1.25} = 1.1180.$$\n\n" +
      "**Step 4 — Denominator.** $(1 - r^2) = 1 - 25 = -24$, so $(1-r^2)^2 = 576$; add $0.25$:\n$$\\sqrt{576 + 0.25} = \\sqrt{576.25} = 24.005.$$\n\n" +
      "**Step 5 — Transmissibility.**\n$$TR = \\frac{1.1180}{24.005} = 0.04657 \\approx 0.047.$$\n\n" +
      "**Key insight / trap.** Convert 1800 rpm to 30 Hz before forming the ratio. Because $r = 5 \\gg \\sqrt 2$, the system isolates strongly ($TR \\approx 4.7\\%$). At high $r$, *more* damping slightly raises $TR$ via the numerator term, so do not drop the $(2\\zeta r)^2$ in the numerator.\n\n" +
      "**Final answer: $TR \\approx 0.047$.**",
  },
  // SOLUTION: Bolt preload / proof-load judgment for a joint.
  // M16 Class 8.8 bolt: tensile stress area At = 157 mm², proof strength Sp = 600 MPa.
  // Proof load Fp = Sp·At = 600·157 = 94,200 N = 94.2 kN.
  // Recommended preload for a reusable joint Fi = 0.75·Fp = 0.75·94.2 = 70.65 kN ≈ 70.7 kN.
  // Distractors: 94.2 (full proof load, no fraction); 84.8 (0.90·Fp, the PERMANENT-joint
  // fraction misapplied to a reusable joint); 47.1 (0.50·Fp, too low).
  {
    id: "md_015",
    slug: "dynamics-bolt-preload-selection",
    title: "Recommended Preload for a Bolted Joint",
    prompt:
      "An M16 Class 8.8 bolt (tensile stress area 157 mm², proof strength 600 MPa) clamps a connection that will be taken apart and reassembled during maintenance.\n\nApplying standard machine-design practice for the recommended preload of such a joint, which value is closest to the target preload?",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["bolted-joint", "preload", "machine-design", "fasteners"],
    skillAreas: ["mechanics-of-materials", "materials"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      { id: "a", label: "47.1 kN" },
      { id: "b", label: "70.7 kN", correct: true },
      { id: "c", label: "84.8 kN" },
      { id: "d", label: "94.2 kN" },
    ],
    hints: [
      "Preload is recommended as a fraction of the bolt's proof load, and that fraction differs for connections that are reused versus those that are permanent.",
      "First compute the proof load itself from the proof strength acting over the tensile stress area; that is the upper anchor for the recommendation.",
      "For a reusable (non-permanent) joint, the recommended preload is the lower of the two standard fractions of proof load — distinctly below the proof load, not equal to it.",
    ],
    solution:
      "**Governing principle — preload is set as a fraction of the bolt's proof load.** Standard machine-design practice (e.g., Shigley) recommends $F_i = 0.75\\,F_p$ for *reusable* joints and $F_i = 0.90\\,F_p$ for *permanent* joints, where the proof load $F_p = S_p A_t$.\n\n" +
      "**Step 1 — Proof load.** With proof strength $S_p = 600$ MPa over tensile stress area $A_t = 157$ mm²:\n$$F_p = S_p A_t = (600\\ \\text{MPa})(157\\ \\text{mm}^2) = 94{,}200\\ \\text{N} = 94.2\\ \\text{kN}.$$\n\n" +
      "**Step 2 — Pick the right fraction.** The joint is taken apart and reassembled, so it is *reusable* → use 0.75:\n$$F_i = 0.75\\,F_p = 0.75 \\times 94.2 = 70.65\\ \\text{kN}.$$\n\n" +
      "**Why the right answer and not the distractors.**\n- **(b) 70.7 kN — correct:** $0.75 F_p$, the reusable-joint recommendation.\n- **(c) 84.8 kN:** $0.90 F_p$ — the *permanent*-joint fraction, misapplied to a maintainable connection.\n- **(d) 94.2 kN:** the full proof load with no fraction — leaves no margin and risks yielding.\n- **(a) 47.1 kN:** $0.50 F_p$ — too low, sacrificing clamp force and fatigue resistance.\n\n" +
      "**Key insight / trap.** Note $S_p A_t$ in (MPa)(mm²) gives newtons directly, since 1 MPa = 1 N/mm². The deciding clue is the word *reusable*, which selects 0.75 over 0.90.\n\n" +
      "**Final answer: 70.7 kN (choice b).**",
  },
];
