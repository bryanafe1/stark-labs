import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_acpower",
  slug: "ac-circuits-and-power",
  title: "AC Power: Why the Grid Spins in Threes",
  summary:
    "Plug something in and the wall hands you a voltage that swings 60 times a second — yet the lights don't flicker and the motor spins like glass. That magic trick is AC power, and the punchline is three-phase. You'll learn why we quote RMS instead of peak, why power has a sneaky imaginary cousin nobody pays for but everybody dreads, and why the grid bundles three sine waves 120° apart to deliver power that never even blinks. Drag the sliders, predict before you peek, and walk out able to size a three-phase load on sight.",
  discipline: "ELECTRICAL",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["ac-circuits", "power", "three-phase"],
  objectives: [
    "Explain why AC is described by RMS values and convert with Vrms = Vpeak/√2.",
    "Use phasors and impedance Z = R + jX to relate voltage, current, and phase angle in AC circuits.",
    "Distinguish real (P), reactive (Q), and apparent (S) power and tie them together through the power factor.",
    "Compute single-phase power P = V·I·pf and three-phase power P = √3·V_L·I_L·pf.",
    "Justify why utilities use three-phase: constant instantaneous power and cheaper transmission.",
    "Tell wye from delta and reason about the √3 relationship between line and phase quantities.",
  ],
  prerequisites: [
    "Ohm's law and Kirchhoff's voltage/current laws",
    "Sinusoids: amplitude, frequency, and phase",
    "Basic complex numbers (rectangular and polar form)",
  ],
  interviewAngle:
    "AC power is a favorite screening topic for electrical, power, and even controls roles because it instantly separates people who memorized formulas from people who understand them. Interviewers probe whether you know that wall voltage is quoted as RMS (and why the √2 shows up), whether you can keep real, reactive, and apparent power straight without flailing, and whether you grasp the power triangle and power factor well enough to recommend correction. The three-phase questions reward intuition: a strong candidate explains the √3 line-to-phase relationship, why instantaneous three-phase power is constant, and the wye-vs-delta tradeoff, instead of reciting P = √3·V·I·pf as a magic spell. Sketch the power triangle, say 'cos of the angle between voltage and current,' and reason about why a low power factor costs the utility extra current, and you signal real fluency.",
  blocks: [
    {
      id: "ac-hook",
      kind: "PROSE",
      title: "The voltage that won't sit still",
      markdown:
        "Stick a voltmeter on a wall outlet and it reads a calm, confident `120 V`. But that number is a lie of omission. The actual voltage is *sprinting* — sweeping from about +170 V to −170 V and back, sixty round trips every second. So where does \"120\" come from, and why does anything plugged in behave so smoothly while the source underneath it is thrashing around?\n\nWelcome to AC power, the quiet genius behind every grid on Earth. It is full of these little paradoxes:\n\n- We describe a swinging voltage with a *single* steady number (RMS).\n- Some of the power you draw does real work, and some of it just sloshes back and forth doing nothing — yet that useless sloshing still costs the utility money.\n- And the grid's masterstroke: it sends power down *three* wires, each carrying a sine wave shoved 120° out of step with its neighbors, so the total power delivered is rock-steady and never dips to zero.\n\nBy the end of this you'll read `P = √3·V_L·I_L·pf` not as a spell but as an obvious sentence. Let's build it.",
    },
    {
      id: "ac-video",
      kind: "VIDEO",
      youtubeId: "iMn7dq7B1oo",
      title: "Watch: Three-Phase Power Explained",
      channel: "The Engineering Mindset",
    },
    {
      id: "ac-rms-prose",
      kind: "PROSE",
      title: "RMS: turning a swing into one honest number",
      markdown:
        "An AC voltage looks like `v(t) = Vpeak·sin(2π·f·t)`. Its average over a full cycle is zero — it spends as much time positive as negative — so \"average voltage\" is useless for describing how much *work* it does. We need a number that captures heating power, because a 120 V AC heater should warm a room exactly like a 120 V DC one.\n\nEnter **RMS** — root-mean-square. The recipe is right there in the name, read backwards: **square** the waveform (now it's always positive, and power ∝ V²), take its **mean** over a cycle, then take the square **root** to get back to volts. RMS is the *equivalent DC value that delivers the same average power* into a resistor.\n\nFor a pure sine wave the math collapses to one tidy constant:\n\n`Vrms = Vpeak / √2 ≈ 0.707 · Vpeak`.\n\nSo the wall's ±170 V peak gives `170 / √2 ≈ 120 V` RMS. Mystery solved. From here on, every voltage and current we quote in AC power is RMS unless we scream otherwise — and crucially, **power formulas only work with RMS values.** Plug peaks into `P = V·I` and you'll be off by a factor of two.",
    },
    {
      id: "ac-formula-rms",
      kind: "FORMULA",
      title: "RMS of a sinusoid",
      display: "Vrms = Vpeak / √2        Irms = Ipeak / √2        v(t) = Vpeak·sin(2π·f·t)",
      latex: "V_{\\text{rms}} = \\dfrac{V_{\\text{peak}}}{\\sqrt{2}} \\qquad I_{\\text{rms}} = \\dfrac{I_{\\text{peak}}}{\\sqrt{2}} \\qquad v(t) = V_{\\text{peak}}\\sin(2\\pi f t)",
      variables: [
        { symbol: "Vrms", name: "RMS (effective) voltage", unit: "V" },
        { symbol: "Vpeak", name: "Peak (amplitude) voltage", unit: "V" },
        { symbol: "Irms", name: "RMS current", unit: "A" },
        { symbol: "f", name: "Frequency", unit: "Hz" },
        { symbol: "t", name: "Time", unit: "s" },
      ],
      note: "The √2 is special to sine waves. A square wave has Vrms = Vpeak; a triangle wave has Vpeak/√3. If someone quotes an AC value with no qualifier, assume RMS — that's the engineering default.",
    },
    {
      id: "ac-phasor-prose",
      kind: "PROSE",
      title: "Phasors and impedance: trig with the boring parts removed",
      markdown:
        "Doing AC circuit analysis with raw `sin` and `cos` is a nightmare of trig identities. So we cheat — elegantly. Because every voltage and current in a linear circuit wiggles at the *same* frequency, the only things that actually distinguish them are **amplitude** and **phase**. A **phasor** packs exactly those two facts into a single complex number and quietly forgets about time.\n\nOnce signals are phasors, components get a complex resistance called **impedance**, `Z`, measured in ohms:\n\n- A resistor is just `Z_R = R` — current and voltage stay in step.\n- A capacitor is `Z_C = 1/(jωC)`, i.e. a reactance `X_C = 1/(ωC)` that makes current *lead* voltage by 90°.\n- An inductor is `Z_L = jωL`, a reactance `X_L = ωL` that makes current *lag* voltage by 90°.\n\nHere `ω = 2π·f` and `j = √(−1)`. General impedance is `Z = R + jX`, and Ohm's law comes back to life as `V = I·Z` — same shape as DC, now with complex numbers. The angle of `Z` *is* the phase angle `θ` between voltage and current, and that angle is the whole reason AC power is more interesting than DC power. Hold onto θ; it's about to run the show.",
    },
    {
      id: "ac-power-prose",
      kind: "PROSE",
      title: "Real, reactive, apparent: power has three faces",
      markdown:
        "In DC, power is boringly `P = V·I`. In AC, the phase angle `θ` between voltage and current splits power into three flavors, and confusing them is the #1 way to fumble an interview.\n\n- **Real power P** (watts, W) — the part that does actual work: heat, light, torque. `P = V·I·cos θ`.\n- **Reactive power Q** (volt-amperes reactive, VAR) — energy that sloshes into capacitors and inductors and right back out, doing zero net work. `Q = V·I·sin θ`. It builds magnetic fields in motors and charges capacitors, but you never \"consume\" it.\n- **Apparent power S** (volt-amperes, VA) — the raw product the wires actually carry: `S = V·I`.\n\nThey form a right triangle — the **power triangle** — with P along the bottom, Q up the side, and S as the hypotenuse: `S² = P² + Q²`. The angle of that triangle is the very same θ from the impedance.\n\nThe ratio that ties it together is the **power factor**:\n\n`pf = cos θ = P / S`.\n\nA power factor of 1 means voltage and current march in lockstep and every volt-ampere does work. A power factor of 0.7 means you must push a *lot* more current to deliver the same watts — and the utility has to build wires fat enough to carry that wasted current. Hold this thought; it's why power-factor correction exists.",
    },
    {
      id: "ac-formula-power",
      kind: "FORMULA",
      title: "The power triangle",
      display: "P = V·I·cos θ        Q = V·I·sin θ        S = V·I        S² = P² + Q²        pf = cos θ = P / S",
      latex: "P = V I \\cos\\theta \\qquad Q = V I \\sin\\theta \\qquad S = V I \\qquad S^2 = P^2 + Q^2 \\qquad \\text{pf} = \\cos\\theta = \\dfrac{P}{S}",
      variables: [
        { symbol: "P", name: "Real (active) power", unit: "W" },
        { symbol: "Q", name: "Reactive power", unit: "VAR" },
        { symbol: "S", name: "Apparent power", unit: "VA" },
        { symbol: "V", name: "RMS voltage", unit: "V" },
        { symbol: "I", name: "RMS current", unit: "A" },
        { symbol: "θ", name: "Phase angle between V and I", unit: "°" },
      ],
      note: "All voltages and currents here are RMS. cos θ is the power factor; θ > 0 (current lagging) is inductive — the common case for motors. Same triangle, three different questions: P is what you use, S is what you pay to carry, Q is the gap between them.",
    },
    {
      id: "ac-predict-pf",
      kind: "PREDICT",
      question:
        "A factory motor draws power at a power factor of 0.5 (badly lagging). To deliver the SAME real power (watts) as a perfect pf = 1.0 load, how much line current does it need?",
      options: [
        { id: "a", label: "Half as much current." },
        { id: "b", label: "The same current — watts are watts." },
        { id: "c", label: "Twice as much current." },
        { id: "d", label: "Four times as much current." },
      ],
      answerId: "c",
      reveal:
        "**Twice the current.** Real power is `P = V·I·pf`. For fixed P and fixed V, current scales as `I = P / (V·pf)`, so halving the power factor *doubles* the current. That extra current still flows through every wire and transformer, heating them up (losses go as `I²·R`) without delivering a single extra watt. That is exactly why utilities penalize low power factor and why factories bolt on capacitor banks to correct it — capacitors supply the reactive VARs locally so the grid doesn't have to ship them.",
    },
    {
      id: "ac-why-three-prose",
      kind: "PROSE",
      title: "Why three? The trick that makes power never blink",
      markdown:
        "Single-phase AC power has an embarrassing secret: it *pulses*. Instantaneous power is `p(t) = v(t)·i(t)`, and since both are sinusoids, their product bounces up and down at twice the line frequency — twice per cycle it actually drops to zero. A single-phase motor is being shoved, released, shoved, released. That makes for rough torque and a buzzy ride.\n\nNow run **three** separate sine waves down three wires, each delayed 120° from the last (0°, 120°, 240°). Add up their instantaneous powers and something beautiful happens: the pulsing terms cancel exactly, and the total is a **constant**, ripple-free number. Three phases hand a motor perfectly smooth torque — no dead spots.\n\nThree-phase wins on two fronts at once:\n\n- **Constant power:** smooth torque, no vibration, smaller and cheaper motors for the same output.\n- **Cheaper transmission:** three-phase delivers more power per kilogram of copper than single-phase, because the return currents partly cancel. In a balanced system the neutral carries essentially nothing, so you can shrink or skip it.\n\nThat's why every generator, every transmission line, and every serious industrial motor on the planet runs in threes. Your house just taps one phase off the bundle.",
    },
    {
      id: "ac-wye-delta-prose",
      kind: "PROSE",
      title: "Wye vs delta, and where √3 comes from",
      markdown:
        "Three-phase devices wire up in one of two shapes, and you should be able to spot both.\n\n- **Wye (Y, or 'star')** ties one end of all three windings to a common neutral point. Here the **line current equals the phase current**, but the **line-to-line voltage is √3 times the phase voltage** (`V_L = √3·V_phase`). This is why a 120 V phase voltage gives `120·√3 ≈ 208 V` between lines.\n- **Delta (Δ)** loops the three windings into a triangle with no neutral. Now it flips: **line voltage equals phase voltage**, but **line current is √3 times the phase current** (`I_L = √3·I_phase`).\n\nThat pesky `√3 ≈ 1.732` is just the geometry of adding two sinusoids 120° apart — it falls straight out of the vector sum, no magic. And it's exactly why the total three-phase power formula carries a √3 out front:\n\n`P = √3 · V_L · I_L · cos θ`,\n\nwhere `V_L` and `I_L` are the **line** voltage and **line** current you'd actually measure with a meter on the wires. Memorize that the √3 lives there *because* we use line quantities, and the formula stops being mysterious.",
    },
    {
      id: "ac-formula-threephase",
      kind: "FORMULA",
      title: "Three-phase power (balanced)",
      display: "P = √3·V_L·I_L·cos θ        Single-phase: P = V·I·cos θ",
      latex: "P = \\sqrt{3}\\,V_L I_L \\cos\\theta \\qquad \\text{Single-phase: } P = V I \\cos\\theta",
      variables: [
        { symbol: "P", name: "Total three-phase real power", unit: "W" },
        { symbol: "V_L", name: "Line-to-line RMS voltage", unit: "V" },
        { symbol: "I_L", name: "Line RMS current", unit: "A" },
        { symbol: "θ", name: "Phase angle between phase voltage and current", unit: "°" },
      ],
      note: "cos θ is the power factor (pf). The √3 appears because V_L and I_L are line quantities; written in phase quantities it's just P = 3·V_phase·I_phase·cos θ. Reactive and apparent three-phase power follow the same pattern: Q = √3·V_L·I_L·sin θ and S = √3·V_L·I_L.",
    },
    {
      id: "ac-sandbox",
      kind: "SANDBOX",
      title: "Play: size a three-phase load",
      description:
        "Drag line voltage, line current, and power factor and watch the total real power respond. With the defaults — 480 V line, 10 A line, pf = 0.8 — you get P = √3·480·10·0.8 ≈ 6651 W (about 6.65 kW). Now slide the power factor up toward 1.0 and watch the real power climb even though the current never moved: better pf squeezes more useful watts out of the exact same line current.",
      variables: [
        { key: "VL", label: "Line voltage V_L", unit: "V", min: 120, max: 600, step: 10, default: 480 },
        { key: "IL", label: "Line current I_L", unit: "A", min: 1, max: 100, step: 1, default: 10 },
        { key: "pf", label: "Power factor", unit: "", min: 0.1, max: 1, step: 0.05, default: 0.8 },
      ],
      expression: "sqrt(3) * VL * IL * pf",
      outputLabel: "Three-phase real power",
      outputUnit: "W",
      precision: 0,
    },
    {
      id: "ac-predict-rms",
      kind: "PREDICT",
      question:
        "An oscilloscope shows a sine wave swinging between +340 V and −340 V. Your multimeter, measuring the same signal, will read approximately what?",
      options: [
        { id: "a", label: "About 340 V — it reads the peak." },
        { id: "b", label: "About 240 V — it reads RMS = peak/√2." },
        { id: "c", label: "About 680 V — it reads peak-to-peak." },
        { id: "d", label: "About 0 V — the average of a sine is zero." },
      ],
      answerId: "b",
      reveal:
        "**About 240 V.** A multimeter reports the RMS value, so `Vrms = Vpeak/√2 = 340/1.414 ≈ 240 V` — which is exactly mains voltage in much of the world. Option (a) confuses peak with RMS; (c) is the peak-to-peak swing (a scope readout, not a meter's); (d) is the true *average*, which really is zero, but that's the trap — average is useless for AC power, which is the whole reason RMS exists. When in doubt: meters speak RMS.",
    },
    {
      id: "ac-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: a balanced three-phase motor",
      problem:
        "A balanced three-phase induction motor runs from a 480 V (line-to-line) supply and draws 40 A of line current at a lagging power factor of 0.75. (a) Find the apparent power S. (b) Find the real power P. (c) Find the reactive power Q. (d) If you add capacitors to correct the power factor to 0.95 while keeping real power the same, what is the new line current?",
      steps: [
        {
          label: "(a) Apparent power",
          markdown:
            "S = √3·V_L·I_L = 1.732 × 480 V × 40 A ≈ 33 254 VA ≈ 33.3 kVA. This is the raw VA the wires must carry, power factor or not.",
        },
        {
          label: "(b) Real power",
          markdown:
            "P = √3·V_L·I_L·pf = S × pf = 33 254 × 0.75 ≈ 24 941 W ≈ 24.9 kW. This is the useful power doing actual work — turning the shaft.",
        },
        {
          label: "(c) Reactive power",
          markdown:
            "Use the power triangle: Q = √(S² − P²) = √(33254² − 24941²) ≈ √(1.106×10⁹ − 6.221×10⁸) ≈ √(4.84×10⁸) ≈ 22 000 VAR ≈ 22.0 kVAR. (Cross-check: Q = S·sin θ, with θ = arccos(0.75) ≈ 41.4°, sin θ ≈ 0.661, so Q ≈ 33254 × 0.661 ≈ 22.0 kVAR. ✓)",
        },
        {
          label: "(d) Current after correction",
          markdown:
            "Real power is unchanged (capacitors don't do work), so P ≈ 24 941 W stays put. Solve the three-phase formula for current: I_L = P / (√3·V_L·pf) = 24 941 / (1.732 × 480 × 0.95) ≈ 24 941 / 789.6 ≈ 31.6 A. The current drops from 40 A to about 31.6 A — a ~21% cut — for the exact same useful output.",
        },
      ],
      answer:
        "(a) S ≈ 33.3 kVA; (b) P ≈ 24.9 kW; (c) Q ≈ 22.0 kVAR; (d) line current falls from 40 A to ≈ 31.6 A after correcting pf to 0.95. The capacitors supply the reactive VARs locally, so the supply ships less current and the wires run cooler.",
    },
    {
      id: "ac-check-power",
      kind: "CHECK",
      question:
        "A balanced three-phase load draws 230 V line voltage and 15 A line current at a power factor of 0.9. What is its total real power, to the nearest 100 W?",
      choices: [
        { id: "a", label: "About 3 100 W" },
        { id: "b", label: "About 5 400 W" },
        { id: "c", label: "About 3 450 W" },
        { id: "d", label: "About 9 300 W" },
      ],
      answerId: "b",
      explanation:
        "P = √3·V_L·I_L·pf = 1.732 × 230 × 15 × 0.9 ≈ 5 376 W ≈ 5 400 W. Option (a) forgets the √3 (that's single-phase thinking: 230×15×0.9 ≈ 3105). Option (c) drops the power factor. Option (d) accidentally uses 3 instead of √3 somewhere. The √3 and the pf both belong in the formula — leave either out and you're off by a recognizable amount.",
    },
    {
      id: "ac-check-pf",
      kind: "CHECK",
      question:
        "A load has real power P = 8 kW and apparent power S = 10 kVA. What is its power factor and its reactive power Q?",
      choices: [
        { id: "a", label: "pf = 0.8, Q = 6 kVAR" },
        { id: "b", label: "pf = 0.8, Q = 2 kVAR" },
        { id: "c", label: "pf = 1.25, Q = 6 kVAR" },
        { id: "d", label: "pf = 0.6, Q = 8 kVAR" },
      ],
      answerId: "a",
      explanation:
        "Power factor is P/S = 8/10 = 0.8. Reactive power comes from the power triangle: Q = √(S² − P²) = √(10² − 8²) = √(100 − 64) = √36 = 6 kVAR. That's the classic 3-4-5 right triangle scaled by 2: P = 8, Q = 6, S = 10. Option (c) inverts the ratio (pf can never exceed 1); option (b) and (d) botch the triangle.",
    },
    {
      id: "ac-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What interviewers are really listening for",
      markdown:
        "When AC power comes up, the interviewer is checking three reflexes:\n\n1. **\"Is that peak or RMS?\"** Say RMS by default and mention `Vpeak/√2`. Quoting peaks into a power formula is an instant red flag.\n2. **Draw the power triangle.** P along the bottom, Q vertical, S the hypotenuse, `pf = cos θ = P/S`. If you can sketch it and say \"cosine of the angle between voltage and current,\" you've shown you understand power factor instead of memorizing it.\n3. **Explain the √3.** \"It's there because we use line quantities; in phase terms it's just 3·V_phase·I_phase·cos θ.\" Then add the why-three story: constant instantaneous power and copper savings.\n\nBonus points for connecting low power factor to higher line current and `I²R` losses, and for naming capacitor banks as the fix. Reasoning out loud — initial value, what's conserved, what the angle does — beats a correct-but-silent number every time.",
    },
    {
      id: "ac-callout-warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Traps that quietly cost you points",
      markdown:
        "- **Peak vs RMS.** Power formulas eat RMS only. Feed them peak values and your power is off by a factor of two.\n- **Don't add power flavors arithmetically.** S ≠ P + Q. They add as a *right triangle*: `S² = P² + Q²`. Watts and VARs are at right angles, not on the same line.\n- **The √3 belongs in line-quantity formulas.** `P = √3·V_L·I_L·pf` for line values; `P = 3·V_phase·I_phase·pf` for phase values. Mix them and you'll be off by √3.\n- **Reactive power isn't free even though it does no work.** It still demands extra current, so it heats wires and forces bigger transformers — that's why utilities bill for poor power factor.\n- **'208 V' and '120 V' describe the same wye system** — line-to-line vs line-to-neutral, related by √3. Know which one a problem is quoting.",
    },
    {
      id: "ac-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "One picture to carry out the door",
      markdown:
        "Draw the power triangle: P along the base, Q rising, S as the hypotenuse, angle θ between them. That single sketch encodes RMS-based power, the power factor `cos θ = P/S`, the `S² = P² + Q²` relationship, and the meaning of power-factor correction (shrink Q to swing S down onto P). Bolt on two sentences — \"meters read RMS, peak is √2 bigger\" and \"three-phase puts a √3 out front and keeps power constant\" — and you can reconstruct almost any AC power answer on demand.",
    },
  ],
  keyTakeaways: [
    "AC voltages and currents are quoted as RMS, the DC-equivalent heating value; for a sine wave Vrms = Vpeak/√2 ≈ 0.707·Vpeak, and power formulas require RMS.",
    "Phasors plus impedance Z = R + jX turn AC analysis into Ohm's law with complex numbers; the angle of Z is the phase angle θ between voltage and current.",
    "Power splits into real P = V·I·cos θ (does work), reactive Q = V·I·sin θ (sloshes, no net work), and apparent S = V·I, forming the power triangle S² = P² + Q².",
    "Power factor pf = cos θ = P/S; a low pf forces extra current for the same watts, raising I²R losses, which is why capacitor banks correct it.",
    "Single-phase power is P = V·I·pf; balanced three-phase real power is P = √3·V_L·I_L·pf, with the √3 appearing because V_L and I_L are line quantities.",
    "Three-phase wins because the three 120°-shifted waves sum to constant instantaneous power (smooth torque) and transmit more power per unit of copper.",
    "Wye gives V_L = √3·V_phase with line = phase current; delta gives I_L = √3·I_phase with line = phase voltage — the √3 is just the geometry of summing signals 120° apart.",
  ],
};
