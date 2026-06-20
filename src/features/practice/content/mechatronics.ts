import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION: T = Kt*I, I = T/Kt = 0.40/0.05 = 8 A. Back-EMF e = V - I*Ra = 24 - 8*1.2 = 14.4 V.
  // Ke = Kt = 0.05 (SI), so omega = e/Ke = 14.4/0.05 = 288 rad/s.
  // N = 288 * 60/(2*pi) = 2750.2 rpm.
  {
    id: "mt_dc_motor_torque",
    slug: "mechatronics-dc-motor-torque",
    title: "Loaded DC Motor Operating Speed",
    prompt:
      "A brushed DC servo motor runs from a 24 V supply and has armature resistance Ra = 1.2 Ω. Its torque constant is 0.05 N·m/A and, in consistent SI units, its back-EMF constant has the same numerical value.\n\nDownstream of the motor a load demands a steady shaft torque of 0.40 N·m. Once the motor reaches steady state at this load, what is its rotational speed?\n\nGive the answer in rpm, rounded to the nearest 10 rpm.",
    discipline: "MECHATRONICS",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["dc-motor", "torque-speed", "back-emf"],
    skillAreas: ["sensors-actuators", "circuits"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 2750,
    tolerance: 30,
    unit: "rpm",
    hints: [
      "At steady state the motor must develop exactly the load torque. Use the torque constant to back out the armature current the motor draws.",
      "The terminal voltage splits between the IRa resistive drop and the back-EMF. The back-EMF is what is left after subtracting the drop, and it is what sets the speed.",
      "With Ke numerically equal to Kt in SI, omega = back-EMF / Ke gives rad/s. Convert to rpm with the factor 60/(2*pi) before rounding to the nearest 10.",
    ],
    solution:
      "**Governing principle — steady-state DC motor model.** A brushed DC motor is described by two coupling equations: the magnetic torque it produces, $T = K_t I$, and the speed-dependent back-EMF it generates, $e = K_e \\omega$. The electrical loop ties them together through Kirchhoff's voltage law: $V = I R_a + e$. These apply because at steady state there is no acceleration and no inductive transient, so torque, current, and speed are all constant.\n\n" +
      "**Step 1 — Current from the load torque.** The motor must develop exactly the demanded shaft torque, so invert $T = K_t I$:\n$$I = \\frac{T}{K_t} = \\frac{0.40\\ \\text{N·m}}{0.05\\ \\text{N·m/A}} = 8\\ \\text{A}.$$\n\n" +
      "**Step 2 — Back-EMF from KVL.** The supply splits between the resistive drop and the back-EMF:\n$$e = V - I R_a = 24\\ \\text{V} - (8\\ \\text{A})(1.2\\ \\Omega) = 24 - 9.6 = 14.4\\ \\text{V}.$$\n\n" +
      "**Step 3 — Speed from the back-EMF.** With $K_e = K_t = 0.05$ V·s/rad in SI,\n$$\\omega = \\frac{e}{K_e} = \\frac{14.4\\ \\text{V}}{0.05} = 288\\ \\text{rad/s}.$$\n\n" +
      "**Step 4 — Convert to rpm.**\n$$N = 288 \\times \\frac{60}{2\\pi} = 2750.2\\ \\text{rpm}.$$\n\n" +
      "**Key insight / trap.** The load sets the *current* (via torque), not the speed directly. Forgetting the $IR_a$ drop and using $\\omega = V/K_e = 480$ rad/s (≈4584 rpm) is the classic error — the resistive drop steals 9.6 V before any speed is generated.\n\n" +
      "**Final answer: ≈ 2750 rpm.**",
  },
  // SOLUTION: Total reduction = 4 * 5 = 20:1. Output speed = 3000/20 = 150 rpm = 150*2*pi/60 = 15.708 rad/s.
  // Output power = 200 W * 0.90 = 180 W. T_out = P/omega = 180/15.708 = 11.46 N·m.
  {
    id: "mt_gear_ratio_speed",
    slug: "mechatronics-gear-ratio-speed",
    title: "Two-Stage Gearbox Output Torque",
    prompt:
      "A motor turning at 3000 rpm and delivering 200 W of mechanical power drives a two-stage reduction gearbox. The first stage reduces speed 4:1 and the second stage reduces it a further 5:1. The gearbox is 90% efficient overall.\n\nWhat steady torque is available at the output shaft?\n\nGive the answer in N·m, rounded to two decimal places.",
    discipline: "MECHATRONICS",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["gears", "gear-train", "torque", "power"],
    skillAreas: ["dynamics", "robotics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 11.46,
    tolerance: 0.15,
    unit: "N·m",
    hints: [
      "Stage ratios multiply: the overall speed reduction is the product of the two stages. Find the output shaft speed first.",
      "Efficiency reduces transmitted power, not input speed. Apply the 90% to the power, and keep the output speed as the geometric reduction value.",
      "Torque = power / angular speed, so convert the output speed to rad/s (rpm * 2*pi/60) before dividing the reduced output power by it.",
    ],
    solution:
      "**Governing principle — conservation of power with losses, plus kinematic gear ratios.** Speed scales by the geometric reduction ratio (a pure kinematic constraint set by tooth counts), while power is reduced by efficiency (losses are heat). Torque then follows from $P = T\\omega$. The trap is to apply efficiency to the wrong quantity.\n\n" +
      "**Step 1 — Overall reduction ratio.** Stage ratios multiply:\n$$N_{tot} = 4 \\times 5 = 20{:}1.$$\n\n" +
      "**Step 2 — Output speed (kinematic, no efficiency here).**\n$$n_{out} = \\frac{3000\\ \\text{rpm}}{20} = 150\\ \\text{rpm}.$$\nConvert to rad/s:\n$$\\omega_{out} = 150 \\times \\frac{2\\pi}{60} = 15.708\\ \\text{rad/s}.$$\n\n" +
      "**Step 3 — Output power (efficiency applies here).**\n$$P_{out} = \\eta\\, P_{in} = 0.90 \\times 200\\ \\text{W} = 180\\ \\text{W}.$$\n\n" +
      "**Step 4 — Output torque.**\n$$T_{out} = \\frac{P_{out}}{\\omega_{out}} = \\frac{180\\ \\text{W}}{15.708\\ \\text{rad/s}} = 11.46\\ \\text{N·m}.$$\n\n" +
      "**Key insight / trap.** Efficiency degrades *power*, never the kinematic speed — the output shaft still turns at exactly 150 rpm regardless of losses. If you wrongly applied the 90% to speed (or ignored it entirely, giving $200/15.708 = 12.73$ N·m), you'd get the wrong torque.\n\n" +
      "**Final answer: ≈ 11.46 N·m.**",
  },
  // SOLUTION: 4x quadrature -> 500*4 = 2000 counts/rev. Leadscrew advances 5 mm/rev.
  // Linear resolution = 5 mm / 2000 = 0.0025 mm = 2.5 um.
  {
    id: "mt_encoder_resolution",
    slug: "mechatronics-encoder-resolution",
    title: "Linear Stage Positioning Resolution",
    prompt:
      "A motorized linear stage is driven by a leadscrew with a lead of 5 mm per revolution. The motor carries a 500-line incremental rotary encoder, and the controller reads it with 4× quadrature decoding.\n\nWhat is the finest linear position increment the stage can resolve?\n\nGive the answer in micrometers (µm), rounded to one decimal place.",
    discipline: "MECHATRONICS",
    difficulty: "MEDIUM",
    eloWeight: 25,
    tags: ["encoder", "quadrature", "leadscrew", "resolution"],
    skillAreas: ["sensors-actuators", "robotics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 2.5,
    tolerance: 0.05,
    unit: "µm",
    hints: [
      "First find the angular resolution: how many distinct counts the controller sees in one motor revolution. The decoding factor multiplies the line count.",
      "The leadscrew converts one full revolution into a fixed linear advance equal to the lead. One encoder count therefore corresponds to a fraction of that lead.",
      "Linear resolution = lead / counts-per-rev. Carry units carefully: 5 mm divided by the count total, then express in micrometers.",
    ],
    solution:
      "**Governing principle — cascade of resolutions.** Each transmission element subdivides motion. The encoder discretizes one revolution into counts; the leadscrew maps one revolution to a fixed linear advance (the lead). The finest linear step is therefore the lead spread evenly across all counts in a revolution.\n\n" +
      "**Step 1 — Counts per revolution.** A quadrature encoder's two channels (A and B in phase quadrature) let the controller detect 4 edges per line. With 4× decoding:\n$$\\text{counts/rev} = 500\\ \\text{lines} \\times 4 = 2000\\ \\text{counts/rev}.$$\n\n" +
      "**Step 2 — Map one revolution to linear travel.** The leadscrew advances by its lead, 5 mm, for each full motor revolution.\n\n" +
      "**Step 3 — Linear resolution per count.**\n$$\\Delta x = \\frac{\\text{lead}}{\\text{counts/rev}} = \\frac{5\\ \\text{mm}}{2000} = 0.0025\\ \\text{mm}.$$\n\n" +
      "**Step 4 — Express in micrometers.**\n$$0.0025\\ \\text{mm} \\times 1000\\ \\frac{\\mu\\text{m}}{\\text{mm}} = 2.5\\ \\mu\\text{m}.$$\n\n" +
      "**Key insight / trap.** Don't confuse *lines* with *counts*. Using 500 counts (forgetting the 4× quadrature) gives 10 µm — four times too coarse. The 4× factor is the whole reason quadrature decoding is worth doing.\n\n" +
      "**Final answer: 2.5 µm.**",
  },
  // SOLUTION: LSB = Vref/2^n = 3.3/1024 = 3.2227 mV. Sensor sensitivity = 10 mV/degC.
  // Smallest resolvable temperature change = 3.2227 mV / 10 mV/degC = 0.322 degC.
  {
    id: "mt_adc_resolution",
    slug: "mechatronics-adc-resolution",
    title: "Temperature Sensing Quantization Limit",
    prompt:
      "A linear temperature sensor outputs 10 mV per °C and feeds directly into a 10-bit ADC with a 3.3 V reference, with no extra amplification.\n\nIgnoring noise, what is the smallest temperature change the system can distinguish (one ADC code step)?\n\nGive the answer in °C, rounded to two decimal places.",
    discipline: "MECHATRONICS",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["adc", "quantization", "sensors", "signal-conditioning"],
    skillAreas: ["sensors-actuators", "circuits"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.32,
    tolerance: 0.02,
    unit: "°C",
    hints: [
      "The ADC divides its reference span into a number of equal codes set by its bit count. Find the voltage represented by one code step (one LSB).",
      "The sensor maps temperature to voltage at a fixed slope. The smallest distinguishable temperature is the one that produces a voltage change of exactly one LSB.",
      "Divide one LSB (in volts) by the sensor sensitivity (in volts per degree). Watch the millivolt units: 3.3 V / 1024 is in volts, sensitivity is 10 mV per degree.",
    ],
    solution:
      "**Governing principle — ADC quantization referred to the input.** An $n$-bit ADC splits its reference span into $2^n$ equal codes; the voltage of one code is the LSB. To find the *temperature* resolution, refer that voltage step back through the sensor's transfer function (its sensitivity in V/°C). Resolution is limited by the coarsest link in the chain.\n\n" +
      "**Step 1 — Voltage per code (one LSB).**\n$$V_{LSB} = \\frac{V_{ref}}{2^n} = \\frac{3.3\\ \\text{V}}{2^{10}} = \\frac{3.3}{1024} = 3.2227\\ \\text{mV}.$$\n\n" +
      "**Step 2 — Refer to temperature via sensitivity.** The sensor gives 10 mV per °C, so the temperature change that produces exactly one LSB of voltage change is:\n$$\\Delta T = \\frac{V_{LSB}}{S} = \\frac{3.2227\\ \\text{mV}}{10\\ \\text{mV/°C}} = 0.3223\\ \\text{°C}.$$\n\n" +
      "**Step 3 — Round.** $0.3223 \\to 0.32\\ \\text{°C}$.\n\n" +
      "**Key insight / trap.** Use $2^n = 1024$ steps, not $2^n - 1 = 1023$ — and keep millivolts consistent on both sides of the division. With no amplification the sensor wastes most of the ADC range (full scale 3.3 V corresponds to 330 °C), which is exactly why a gain stage would improve resolution.\n\n" +
      "**Final answer: ≈ 0.32 °C.**",
  },
  // SOLUTION: Bridge full scale 20 mV; ADC wants 4 V full scale on a single 5 V rail.
  // Required gain = 4/0.020 = 200. Non-inverting A = 1 + Rf/Rin -> Rf/Rin = 199.
  // The derivative-action distractor and rail-clipping are wrong; with A=200 and a 5 V rail,
  // 20 mV -> 4 V sits safely below the rail, so option about gain selection is correct.
  {
    id: "mt_opamp_noninverting_gain",
    slug: "mechatronics-opamp-noninverting-gain",
    title: "Conditioning a Bridge Signal",
    prompt:
      "A strain-gauge bridge produces a full-scale output of 20 mV. You must condition it with a single non-inverting op-amp (single 5 V supply) so that full scale maps to 4.0 V at the ADC input, leaving headroom below the rail.\n\nWhich design statement is correct?",
    discipline: "MECHATRONICS",
    difficulty: "HARD",
    eloWeight: 28,
    tags: ["op-amp", "signal-conditioning", "gain", "judgment"],
    skillAreas: ["circuits", "sensors-actuators"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label: "Set Rf/Rin = 199 so the gain is 200; 20 mV then maps to 4.0 V, within the 5 V rail.",
        correct: true,
      },
      { id: "b", label: "Set Rf/Rin = 200 so the gain is 200; any smaller ratio cannot reach 4.0 V." },
      { id: "c", label: "Use a gain of 250 so 20 mV gives 5.0 V and uses the full rail." },
      { id: "d", label: "A gain of 200 drives 20 mV past the 5 V rail, so the output clips." },
    ],
    hints: [
      "Required gain is the ratio of desired output full scale to input full scale. Compute it before judging any of the statements.",
      "For a non-inverting op-amp the closed-loop gain is 1 + Rf/Rin, not Rf/Rin. The resistor ratio is one less than the gain.",
      "Check the rail: does the full-scale output land below 5 V? An output that stays under the supply does not clip.",
    ],
    solution:
      "**Governing principle — non-inverting amplifier gain and rail headroom.** A non-inverting op-amp has closed-loop gain $A = 1 + R_f/R_{in}$ (note the leading 1). Two checks decide the design: (1) does the gain map input full scale to the desired output, and (2) does that output stay below the supply rail so the op-amp doesn't saturate.\n\n" +
      "**Step 1 — Required gain.**\n$$A = \\frac{V_{out,FS}}{V_{in,FS}} = \\frac{4.0\\ \\text{V}}{0.020\\ \\text{V}} = 200.$$\n\n" +
      "**Step 2 — Resistor ratio.** From $A = 1 + R_f/R_{in}$:\n$$\\frac{R_f}{R_{in}} = A - 1 = 200 - 1 = 199.$$\n\n" +
      "**Step 3 — Rail check.** Full-scale output is 4.0 V on a 5 V single supply, leaving ~1 V of headroom, so the output does **not** clip. This confirms option (a).\n\n" +
      "**Why the distractors fail.**\n- **(b)** sets $R_f/R_{in} = 200$, which gives $A = 1 + 200 = 201$, not 200 — it forgets the leading 1, and its claim that no smaller ratio reaches 4.0 V is false.\n- **(c)** gain 250 pushes 20 mV to 5.0 V, hitting the rail with zero headroom — it saturates and violates the headroom requirement.\n- **(d)** wrongly claims gain 200 clips; $200 \\times 20\\ \\text{mV} = 4.0\\ \\text{V} < 5\\ \\text{V}$, so there is no clipping.\n\n" +
      "**Key insight / trap.** The classic error is writing $A = R_f/R_{in}$ (the *inverting* formula). For non-inverting topology the gain is always at least 1, so the ratio is one less than the gain.\n\n" +
      "**Final answer: (a) — set $R_f/R_{in} = 199$ for a gain of 200; 20 mV maps to 4.0 V, safely within the 5 V rail.**",
  },
  // SOLUTION: s^2 + 6s + 25 => wn = sqrt(25) = 5 rad/s; 2*zeta*wn = 6 => zeta = 6/10 = 0.6.
  // %OS = 100*exp(-zeta*pi/sqrt(1-zeta^2)) = 100*exp(-0.6*pi/0.8) = 100*exp(-2.356) = 9.48%.
  {
    id: "mt_second_order_response",
    slug: "mechatronics-second-order-response",
    title: "Closed-Loop Step Overshoot",
    prompt:
      "A closed-loop position servo has the closed-loop denominator polynomial s² + 6s + 25.\n\nFor a unit step command, what percent overshoot do you expect in the response?\n\nGive the answer as a percentage, rounded to one decimal place.",
    discipline: "MECHATRONICS",
    difficulty: "EXPERT",
    eloWeight: 36,
    tags: ["control-systems", "second-order", "overshoot", "damping"],
    skillAreas: ["control-systems", "dynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 9.5,
    tolerance: 0.3,
    unit: "%",
    hints: [
      "Match the denominator to the standard form s^2 + 2*zeta*wn*s + wn^2. The constant term gives wn, and the s coefficient gives the product 2*zeta*wn.",
      "Solve for the damping ratio from those two: zeta = (s coefficient) / (2*wn). A value between 0 and 1 means an underdamped, overshooting response.",
      "Percent overshoot = 100 * exp(-zeta*pi / sqrt(1 - zeta^2)). Make sure the exponent is negative and use radians implicitly (pi is just the constant).",
    ],
    solution:
      "**Governing principle — standard second-order form.** Any second-order denominator can be matched to $s^2 + 2\\zeta\\omega_n s + \\omega_n^2$. Once $\\zeta$ (damping ratio) and $\\omega_n$ (natural frequency) are known, the step-response overshoot depends *only* on $\\zeta$. This works because overshoot is governed by how close the complex poles sit to the imaginary axis.\n\n" +
      "**Step 1 — Natural frequency from the constant term.**\n$$\\omega_n^2 = 25 \\;\\Rightarrow\\; \\omega_n = 5\\ \\text{rad/s}.$$\n\n" +
      "**Step 2 — Damping ratio from the $s$ coefficient.**\n$$2\\zeta\\omega_n = 6 \\;\\Rightarrow\\; \\zeta = \\frac{6}{2 \\times 5} = 0.6.$$\nSince $0 < \\zeta < 1$, the system is underdamped and will overshoot.\n\n" +
      "**Step 3 — Percent overshoot formula.**\n$$\\%OS = 100\\,e^{-\\zeta\\pi/\\sqrt{1-\\zeta^2}}.$$\n\n" +
      "**Step 4 — Substitute.**\n$$\\sqrt{1-\\zeta^2} = \\sqrt{1-0.36} = \\sqrt{0.64} = 0.8,$$\n$$\\text{exponent} = -\\frac{0.6\\pi}{0.8} = -\\frac{1.885}{0.8} = -2.356,$$\n$$\\%OS = 100\\,e^{-2.356} = 100 \\times 0.0948 = 9.48\\%.$$\n\n" +
      "**Key insight / trap.** Overshoot is set by $\\zeta$ alone — $\\omega_n$ affects speed/settling time but not the overshoot percentage. A common slip is forgetting the $\\sqrt{1-\\zeta^2}$ in the denominator or dropping the minus sign, which inflates the answer.\n\n" +
      "**Final answer: ≈ 9.5%.**",
  },
  // SOLUTION: Char. poly s^3 + 2s^2 + s + K. Routh: s^3:[1,1], s^2:[2,K], s^1:[(2-K)/2], s^0:[K].
  // No sign change requires K>0 and (2-K)/2>0 => K<2. Stable for 0 < K < 2.
  {
    id: "mt_pid_intuition",
    slug: "mechatronics-pid-intuition",
    title: "Gain Range for Stability",
    prompt:
      "Tuning a motion controller produces the closed-loop characteristic polynomial s³ + 2s² + s + K, where K is the loop gain (K > 0).\n\nOver what range of K is the closed-loop system stable?",
    discipline: "MECHATRONICS",
    difficulty: "HARD",
    eloWeight: 31,
    tags: ["control-systems", "stability", "routh", "judgment"],
    skillAreas: ["control-systems"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      { id: "a", label: "0 < K < 2", correct: true },
      { id: "b", label: "K > 2" },
      { id: "c", label: "0 < K < 1" },
      { id: "d", label: "Stable for every K > 0" },
    ],
    hints: [
      "Stability of a third-order polynomial is not guaranteed just because all coefficients are positive. Build the Routh array from the coefficients [1, 2, 1, K].",
      "The only nontrivial Routh entry comes from the s^1 row: it is (2*1 - 1*K)/2. Both this entry and the s^0 entry (K itself) must be positive.",
      "Combine the two conditions: K > 0 from the last row and (2 - K) > 0 from the s^1 row. The overlap is the stable range.",
    ],
    solution:
      "**Governing principle — Routh-Hurwitz stability criterion.** A system is stable only if all closed-loop poles lie in the left half plane. For polynomials above second order, positive coefficients are *necessary but not sufficient*; the Routh array's first column must have no sign changes. That is why we can't just say 'all coefficients positive, so stable for all K.'\n\n" +
      "**Step 1 — Identify coefficients.** For $s^3 + 2s^2 + 1\\cdot s + K$: coefficients are $[1,\\ 2,\\ 1,\\ K]$.\n\n" +
      "**Step 2 — Build the Routh array.**\n$$\\begin{array}{c|cc} s^3 & 1 & 1 \\\\ s^2 & 2 & K \\\\ s^1 & \\dfrac{2\\cdot1 - 1\\cdot K}{2} & 0 \\\\ s^0 & K & \\end{array}$$\nThe $s^1$ entry is $\\dfrac{2 - K}{2}$.\n\n" +
      "**Step 3 — No sign changes in the first column.** All of $1,\\ 2,\\ \\dfrac{2-K}{2},\\ K$ must be positive:\n- $\\dfrac{2-K}{2} > 0 \\;\\Rightarrow\\; K < 2.$\n- $K > 0$ (from the $s^0$ row).\n\n" +
      "**Step 4 — Combine.** The overlap is $0 < K < 2$, which is option (a).\n\n" +
      "**Why the distractors fail.**\n- **(b)** $K > 2$ makes the $s^1$ entry negative → two sign changes → two RHP poles (unstable).\n- **(c)** $0 < K < 1$ is too conservative; the system is still stable up to $K = 2$.\n- **(d)** 'stable for every $K > 0$' ignores that large $K$ destabilizes — the marginal point is exactly $K = 2$.\n\n" +
      "**Key insight / trap.** Increasing loop gain eventually destabilizes a third-order system. The Routh $s^1$ row is the binding constraint, not the obvious 'coefficients positive' check.\n\n" +
      "**Final answer: (a) $0 < K < 2$.**",
  },
  // SOLUTION: x = L1*cos(t1) + L2*cos(t1+t2) = 0.4*cos30 + 0.3*cos75 = 0.34641 + 0.07765 = 0.42406 m.
  // y = L1*sin(t1) + L2*sin(t1+t2) = 0.4*sin30 + 0.3*sin75 = 0.2 + 0.28978 = 0.48978 m.
  // Distance from base r = sqrt(x^2 + y^2) = sqrt(0.17983 + 0.23988) = sqrt(0.41971) = 0.6479 m.
  {
    id: "mt_arm_kinematics",
    slug: "mechatronics-arm-kinematics",
    title: "2-Link Arm End-Effector Reach",
    prompt:
      "A planar 2-link robot arm has link lengths L1 = 0.4 m (shoulder) and L2 = 0.3 m (elbow). The shoulder joint angle is θ1 = 30° measured from the horizontal, and the elbow joint angle is θ2 = 45° measured relative to the first link.\n\nHow far is the end effector from the base (shoulder) origin?\n\nGive the straight-line distance in meters (m), rounded to three decimal places.",
    discipline: "MECHATRONICS",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["kinematics", "robotics", "forward-kinematics", "2-link"],
    skillAreas: ["robotics", "dynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.648,
    tolerance: 0.006,
    unit: "m",
    hints: [
      "The elbow angle is relative to the first link, so the second link points at an absolute angle of theta1 + theta2 from the horizontal, not just theta2.",
      "Sum the x-projections of both links and, separately, the y-projections, using each link's absolute angle. This gives the end-effector coordinates.",
      "The distance from the base is the magnitude sqrt(x^2 + y^2) of that coordinate. It is not simply L1 + L2 unless the arm is straight.",
    ],
    solution:
      "**Governing principle — forward kinematics by vector summation.** The end-effector position is the tip-to-tail sum of each link's vector. Each link's vector uses its *absolute* orientation measured from the global horizontal. Because the elbow angle is given *relative to link 1*, link 2's absolute angle is $\\theta_1 + \\theta_2$.\n\n" +
      "**Step 1 — Absolute link angles.** Link 1 is at $\\theta_1 = 30°$. Link 2 is at $\\theta_1 + \\theta_2 = 30° + 45° = 75°$.\n\n" +
      "**Step 2 — x-coordinate (sum of horizontal projections).**\n$$x = L_1\\cos\\theta_1 + L_2\\cos(\\theta_1+\\theta_2) = 0.4\\cos30° + 0.3\\cos75°.$$\n$$x = 0.4(0.86603) + 0.3(0.25882) = 0.34641 + 0.07765 = 0.42406\\ \\text{m}.$$\n\n" +
      "**Step 3 — y-coordinate (sum of vertical projections).**\n$$y = L_1\\sin\\theta_1 + L_2\\sin(\\theta_1+\\theta_2) = 0.4\\sin30° + 0.3\\sin75°.$$\n$$y = 0.4(0.5) + 0.3(0.96593) = 0.2 + 0.28978 = 0.48978\\ \\text{m}.$$\n\n" +
      "**Step 4 — Distance from base.**\n$$r = \\sqrt{x^2 + y^2} = \\sqrt{0.42406^2 + 0.48978^2} = \\sqrt{0.17983 + 0.23988} = \\sqrt{0.41971} = 0.6479\\ \\text{m}.$$\n\n" +
      "**Key insight / trap.** The elbow angle is *relative*, so you must add $\\theta_1 + \\theta_2$ for link 2 — using just $\\theta_2 = 45°$ gives the wrong geometry. Also, the reach is **not** $L_1 + L_2 = 0.7$ m; that maximum occurs only when the arm is fully extended (straight). The 45° bend folds the arm in, shortening the reach to 0.648 m.\n\n" +
      "**Final answer: ≈ 0.648 m.**",
  },
];
