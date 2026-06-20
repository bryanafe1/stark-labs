import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_opamp",
  slug: "op-amps-and-analog",
  title: "Op-Amps: How Two Lazy Rules Tame the Analog World",
  summary:
    "An op-amp has gain so absurd it is basically infinite — and yet you almost never use that gain directly. The trick is negative feedback, which converts an ungovernable beast into a precise, predictable amplifier you can design with two embarrassingly simple rules. You will learn the golden rules, the virtual short, why inverting and non-inverting amps look so different but think alike, and how to size two resistors to build any gain you want. Drag the sliders, predict before you peek, and walk away able to read almost any op-amp circuit on sight.",
  discipline: "ELECTRICAL",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["op-amp", "analog", "amplifier", "negative feedback", "virtual ground", "gain"],
  objectives: [
    "State the two golden rules (no input current; V+ = V− under negative feedback) and explain why they hold.",
    "Use the virtual-short / virtual-ground idea to analyze an op-amp circuit without touching a differential equation.",
    "Derive and contrast inverting gain (−Rf/Rin) and non-inverting gain (1 + Rf/Rin), including the unity-gain buffer.",
    "Predict when an op-amp leaves its linear region and slams into the supply rails (saturation).",
    "Size feedback and input resistors to hit a target gain, and reason about why ratios — not absolute values — set it.",
    "Recognize op-amps in the wild: sensor front-ends, active filters, summing/difference amps, and buffers.",
  ],
  prerequisites: [
    "Ohm's law and Kirchhoff's voltage/current laws",
    "Voltage dividers and series/parallel resistor reduction",
    "Comfort reading a basic schematic",
  ],
  interviewAngle:
    "Op-amp circuits are a staple of analog and embedded hardware interviews precisely because they reward physical intuition over brute algebra. Interviewers rarely want the full transfer function of a real op-amp; they want to see that you reach instantly for the two golden rules, that you spot the virtual short the moment you see negative feedback, and that you can write down the gain of an inverting or non-inverting stage by inspection. Strong candidates label V+ and V−, declare \"no current flows into the inputs, and the inputs are equal,\" then read the gain straight off the resistor ratio. They also know the limits cold: that the magic only works with feedback to the inverting input, that real outputs saturate at the rails, and that a follower has gain exactly 1 for a reason. Weak candidates either memorize two formulas with no idea where they come from or drown in node equations they did not need.",
  blocks: [
    {
      id: "oa-hook",
      kind: "PROSE",
      title: "The chip that is too good at its job",
      markdown:
        "Here is a component with a personality problem: the operational amplifier amplifies the *difference* between its two inputs by a gain so enormous — often 100,000 or more — that it is effectively infinite. Sounds great, right? Except it is *useless* on its own. Put a single millivolt of difference between its inputs and the output instantly slams against a power-supply rail and stays pinned there, like a microphone cranked into screaming feedback. Raw, the op-amp is an on/off lurch, not an amplifier.\n\nSo why is this thing the workhorse of analog electronics, hiding inside your headphone amp, your thermostat, your ECG machine, and every precision sensor you have ever touched? Because of one beautiful judo move: **negative feedback**. You feed a slice of the output *back* to the inverting input, and that obscene gain stops being a liability and becomes a guarantee. The op-amp will do *whatever it takes* to keep its two inputs equal — and \"whatever it takes\" turns out to be exactly the precise, repeatable amplifier you wanted.\n\nThe whole subject collapses to three beats:\n\n1. Two **golden rules** that are almost insultingly simple.\n2. A **virtual short** between the inputs that those rules create.\n3. Two **resistors** whose *ratio* sets the gain — and that is the entire design.",
    },
    {
      id: "oa-video",
      kind: "VIDEO",
      youtubeId: "idJEMYhrIfs",
      title: "Watch: Inverting & Non-Inverting Op-Amps",
      channel: "The Organic Chemistry Tutor",
    },
    {
      id: "oa-golden-rules",
      kind: "PROSE",
      title: "The two golden rules",
      markdown:
        "An ideal op-amp obeys two rules that, taken together, let you solve nearly any feedback circuit in your head:\n\n**Rule 1 — No current flows into the inputs.** The inputs have (ideally) infinite resistance, so they sip exactly zero current. The op-amp *senses* the input voltages without *loading* them, the way a good thermometer reads temperature without cooling the soup.\n\n**Rule 2 — The op-amp drives its two inputs to the same voltage:** `V+ = V−`. This one is not free — it only holds when there is **negative feedback**, a path from the output back to the *inverting* (`−`) input. Here is the logic: the output is gain × (`V+ − V−`). If that difference is even slightly positive, the huge gain shoves the output up; the feedback carries that rise back to `V−`, raising it until the difference shrinks to essentially zero. The op-amp settles at the only place it can — the point where `V+` and `V−` match. It is a thermostat for its own input difference.\n\nThat is it. \"No input current\" plus \"inputs equal.\" Tattoo those on your brain and most op-amp circuits become two lines of arithmetic.",
    },
    {
      id: "oa-virtual-short",
      kind: "PROSE",
      title: "The virtual short (and the virtual ground)",
      markdown:
        "Rule 2 has a slick nickname: the **virtual short**. The two input terminals end up at the *same* voltage, as if a wire connected them — yet *no current* crosses (Rule 1), so it is not a real wire. Voltage tied together, current blocked. Virtual.\n\nThere is an even more famous special case. Suppose you ground the non-inverting input, `V+ = 0`. Then negative feedback forces `V− = 0` too — but `V−` is not actually wired to ground. It just *sits* at 0 V because the op-amp insists. We call that node a **virtual ground**: it behaves like ground for voltage bookkeeping, while drawing no current of its own.\n\nWhy do you care? Because the virtual ground is the secret to the inverting amplifier. Once you know a node is pinned at 0 V, you can compute the current through the input resistor in one step, send that exact current through the feedback resistor (Rule 1 says it has nowhere else to go), and read the output voltage right off Ohm's law. No node equations, no algebra swamp — just two resistors and a current that has only one path to take.",
    },
    {
      id: "oa-formula",
      kind: "FORMULA",
      title: "The two gains that run analog design",
      display:
        "Non-inverting:  Vout = Vin·(1 + Rf/Rin)        Inverting:  Vout = −Vin·(Rf/Rin)        Buffer:  Vout = Vin",
      variables: [
        { symbol: "Vout", name: "Output voltage", unit: "V" },
        { symbol: "Vin", name: "Input (signal) voltage", unit: "V" },
        { symbol: "Rf", name: "Feedback resistor (output → V−)", unit: "Ω" },
        { symbol: "Rin", name: "Input resistor", unit: "Ω" },
      ],
      note:
        "Both gains are set by the RATIO Rf/Rin, never the absolute resistor values — a deep, useful fact: gain comes from matching, which integrated circuits do beautifully. The non-inverting gain can never go below 1 (the '1 +' is unavoidable); the inverting gain can be less than 1 and flips the sign. A buffer is just the non-inverting amp with Rf = 0 and Rin = ∞, giving exactly unity gain.",
    },
    {
      id: "oa-derive",
      kind: "WALKTHROUGH",
      title: "Deriving both gains with the golden rules",
      steps: [
        {
          title: "1. Non-inverting: set up the node",
          markdown:
            "The signal `Vin` drives the `+` input directly. `Rf` runs from the output back to the `−` input, and `Rin` runs from the `−` input to ground. By Rule 2, `V− = V+ = Vin`. So the `−` node is held at `Vin`.",
        },
        {
          title: "2. Non-inverting: it's just a voltage divider",
          markdown:
            "`Rf` and `Rin` form a divider from `Vout` down to ground, and the tap between them is the `−` node sitting at `Vin`. The divider says `V− = Vout·Rin/(Rin + Rf)`. Set that equal to `Vin`: `Vin = Vout·Rin/(Rin + Rf)`.",
        },
        {
          title: "3. Non-inverting: solve for Vout",
          markdown:
            "Flip it: `Vout = Vin·(Rin + Rf)/Rin = Vin·(1 + Rf/Rin)`. The gain is `1 + Rf/Rin` — always at least 1, never negative, always in phase. (No current flows into the `−` input by Rule 1, which is why the divider current is clean.)",
        },
        {
          title: "4. Inverting: ground the + input",
          markdown:
            "Now `Vin` drives the `−` input through `Rin`, `Rf` goes from output to the `−` input, and the `+` input is grounded. Rule 2 makes `V− = V+ = 0` — a **virtual ground**.",
        },
        {
          title: "5. Inverting: follow the current",
          markdown:
            "Current through the input resistor: `iin = (Vin − 0)/Rin = Vin/Rin`. Rule 1 says none of it enters the op-amp, so *all* of it continues through `Rf` to the output. The drop across `Rf` is `iin·Rf`, and since the `−` end is at 0 V, `Vout = 0 − iin·Rf = −(Vin/Rin)·Rf`.",
        },
        {
          title: "6. Inverting: read off the gain",
          markdown:
            "`Vout = −Vin·(Rf/Rin)`. The minus sign means the output is inverted (180° out of phase). Same two resistors as before, but the gain is `−Rf/Rin` — and it can be smaller than 1 if you want attenuation. Two rules, two circuits, total control.",
        },
      ],
    },
    {
      id: "oa-predict-buffer",
      kind: "PREDICT",
      question:
        "Take the non-inverting amp and short the output straight to the − input (so Rf = 0, and remove Rin entirely so Rin → ∞). What is the gain now?",
      options: [
        { id: "a", label: "Zero — you shorted out the signal." },
        { id: "b", label: "Exactly 1 — it's a unity-gain buffer (voltage follower)." },
        { id: "c", label: "Infinite — no feedback resistor means full open-loop gain." },
        { id: "d", label: "Negative — shorting the output inverts it." },
      ],
      answerId: "b",
      reveal:
        "**Exactly 1.** Plug into the non-inverting formula: gain `= 1 + Rf/Rin = 1 + 0/∞ = 1`. The output simply *copies* the input voltage, so `Vout = Vin`. This is the **voltage follower** (or buffer), and it is wildly useful even though it 'does nothing' to the voltage: it presents a near-infinite input resistance (draws no current from your fragile source) and a near-zero output resistance (can drive a heavy load). It is the impedance-matching glue of analog design — read a delicate sensor on one side, drive a stiff load on the other, no signal sag.",
    },
    {
      id: "oa-predict-double",
      kind: "PREDICT",
      question:
        "A non-inverting amp has Rf = 90 kΩ and Rin = 10 kΩ. You DOUBLE both resistors to Rf = 180 kΩ and Rin = 20 kΩ. What happens to the gain?",
      options: [
        { id: "a", label: "It doubles." },
        { id: "b", label: "It quadruples." },
        { id: "c", label: "It stays exactly the same." },
        { id: "d", label: "It halves." },
      ],
      answerId: "c",
      reveal:
        "**It stays the same.** Gain is `1 + Rf/Rin`, and the *ratio* `Rf/Rin = 90/10 = 9` becomes `180/20 = 9` — unchanged. Gain stays at `1 + 9 = 10`. This is the quiet superpower of op-amp design: gain depends on the **ratio**, not the absolute values. Chip designers exploit it ruthlessly, because two resistors fabricated side by side *match* far better than either one hits an absolute target. (What *did* change: bigger resistors draw less feedback current and dissipate less power — a real design lever, just not a gain lever.)",
    },
    {
      id: "oa-sandbox",
      kind: "SANDBOX",
      title: "Play: design a non-inverting amplifier",
      description:
        "This is the non-inverting gain in action: Vout = Vin·(1 + Rf/Rin). With the defaults Vin = 0.5 V, Rf = 90 kΩ, Rin = 10 kΩ, the ratio is 9, the gain is 1 + 9 = 10, and the output lands at 5.00 V. Try holding the Rf/Rin ratio fixed (e.g. 90k/10k vs 180k/20k if your steps allow) and confirm the output never budges. Then crank Vin up and watch how quickly a real ±15 V supply would force this into saturation.",
      variables: [
        { key: "Vin", label: "Input Vin", unit: "V", min: 0.1, max: 5, step: 0.1, default: 0.5 },
        { key: "Rf", label: "Feedback Rf", unit: "Ω", min: 1000, max: 200000, step: 1000, default: 90000 },
        { key: "Rin", label: "Input Rin", unit: "Ω", min: 1000, max: 100000, step: 1000, default: 10000 },
      ],
      expression: "Vin * (1 + Rf / Rin)",
      outputLabel: "Output Vout",
      outputUnit: "V",
      precision: 2,
    },
    {
      id: "oa-check-virtualground",
      kind: "CHECK",
      question:
        "In an inverting amplifier with the + input grounded, Vin = 2 V, Rin = 10 kΩ, and Rf = 50 kΩ, what is the current flowing through Rf, and what is Vout?",
      choices: [
        { id: "a", label: "i = 0.2 mA through Rf, Vout = −10 V." },
        { id: "b", label: "i = 0.2 mA through Rf, Vout = +10 V." },
        { id: "c", label: "i = 0 mA (no input current), Vout = 0 V." },
        { id: "d", label: "i = 0.04 mA through Rf, Vout = −2 V." },
      ],
      answerId: "a",
      explanation:
        "The − input is a virtual ground (0 V). Input current: i = (Vin − 0)/Rin = 2 V / 10 kΩ = 0.2 mA. By Rule 1, that entire 0.2 mA flows through Rf (none enters the op-amp). Vout = −i·Rf = −(0.2 mA)(50 kΩ) = −10 V. The sign is negative because it's an inverting amp; equivalently, gain = −Rf/Rin = −5, so Vout = −5 × 2 V = −10 V. Option (c) confuses 'no current into the input *terminal*' (true) with 'no current through Rin' (false).",
    },
    {
      id: "oa-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "The two-sentence routine interviewers want to hear",
      markdown:
        "When an op-amp circuit hits the whiteboard, do not start writing node equations. Say this out loud first:\n\n1. **\"No current flows into the inputs.\"** (Rule 1)\n2. **\"There's negative feedback, so V+ = V−.\"** (Rule 2)\n\nThen *use* them: find `V+` (usually trivial — it is wired to something), declare `V− = V+`, and follow the current through the resistors. For inverting, spot the **virtual ground** and let the input current run straight through `Rf`. For non-inverting, recognize the feedback resistors as a **divider** and read off `1 + Rf/Rin`.\n\nThe tells interviewers love: you check that feedback goes to the **inverting** input (positive feedback would latch, not regulate), you state gain as a **ratio**, and you remember the output **saturates at the rails** — the ideal math only holds while `Vout` stays between the supplies. Naming the limit unprompted is what separates 'memorized the formula' from 'understands the part.'",
    },
    {
      id: "oa-saturation",
      kind: "PROSE",
      title: "Where the magic stops: rails and saturation",
      markdown:
        "The golden rules quietly assume the op-amp *can* do whatever it takes to balance its inputs. But the output cannot exceed its power supply. If you run it from ±15 V, `Vout` physically cannot go past roughly +15 V or −15 V (often a volt or two short of that for cheaper parts). Push for more and the output **saturates** — it pins to the rail and stops obeying `Vout = gain × Vin`.\n\nThis is the boundary of the **linear region**. Inside it, feedback holds, `V+ = V−`, and your tidy formulas are gospel. Outside it, feedback can no longer keep the inputs equal because the output has run out of room, so `V+ ≠ V−` and the part behaves like a comparator: slammed high or slammed low.\n\nQuick reality check with the sandbox numbers: a gain of 10 with `Vin = 0.5 V` gives `Vout = 5 V` — comfortably inside ±15 V, all good. But feed `Vin = 2 V` into that same gain-of-10 stage and the math demands 20 V, which the supply cannot deliver. The output clips at ~15 V. Lesson: always sanity-check that `gain × Vin` fits between your rails *before* trusting the formula. A correctly computed answer that exceeds the supply is just clipping in disguise.",
    },
    {
      id: "oa-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: design a gain-of-10 non-inverting amp",
      problem:
        "You have a sensor that outputs a 0–0.5 V signal, and your ADC wants 0–5 V for best resolution. Design a non-inverting amplifier with a voltage gain of exactly 10. (a) Pick Rf and Rin. (b) Verify the output for a 0.3 V input. (c) The op-amp runs on a single +12 V supply — does a full-scale 0.5 V input stay in the linear region? (d) Why choose the non-inverting topology here rather than inverting?",
      steps: [
        {
          label: "(a) Choose the resistors",
          markdown:
            "Non-inverting gain is `1 + Rf/Rin = 10`, so we need `Rf/Rin = 9`. Pick convenient values that hit that ratio: `Rin = 10 kΩ` and `Rf = 90 kΩ` (or 9 kΩ / 1 kΩ, etc.). Mid-range values like 10 kΩ keep currents small and noise reasonable. Check: `1 + 90/10 = 1 + 9 = 10`. ✓",
        },
        {
          label: "(b) Verify with Vin = 0.3 V",
          markdown:
            "`Vout = Vin·(1 + Rf/Rin) = 0.3 V × 10 = 3.0 V`. A 0.3 V sensor reading maps to 3.0 V at the ADC — right in the target band.",
        },
        {
          label: "(c) Check the rail at full scale",
          markdown:
            "Max input is 0.5 V, so `Vout = 0.5 V × 10 = 5.0 V`. The supply is +12 V, and 5.0 V sits comfortably below it (with room to spare for the op-amp's output swing limit). The stage stays linear across the whole 0–0.5 V range — no clipping. ✓",
        },
        {
          label: "(d) Why non-inverting?",
          markdown:
            "Two reasons. First, it keeps the signal **in phase** (a 0–0.5 V input becomes a clean 0–5 V output, same polarity — exactly what a single-supply ADC wants). Second, the non-inverting input presents a **very high input resistance**, so it barely loads the delicate sensor. An inverting amp would flip the sign *and* load the source with `Rin`, both unhelpful here.",
        },
      ],
      answer:
        "Use Rin = 10 kΩ and Rf = 90 kΩ for a gain of 1 + 90/10 = 10. A 0.3 V input gives 3.0 V; full-scale 0.5 V gives 5.0 V, well within the +12 V rail. Non-inverting is chosen for in-phase output and high input impedance to avoid loading the sensor.",
    },
    {
      id: "oa-check-feedback",
      kind: "CHECK",
      question:
        "An op-amp circuit has its feedback resistor connected from the output to the NON-inverting (+) input instead of the inverting (−) input. What happens?",
      choices: [
        { id: "a", label: "Nothing changes — feedback is feedback." },
        { id: "b", label: "Gain doubles, since both inputs now get feedback." },
        { id: "c", label: "It becomes positive feedback and the output latches to a rail instead of regulating." },
        { id: "d", label: "The op-amp draws huge input current to compensate." },
      ],
      answerId: "c",
      explanation:
        "Routing feedback to the + input makes it POSITIVE feedback: a rise in output pushes V+ up, which (gain × (V+ − V−)) drives the output even higher — a runaway loop instead of a self-correcting one. The output slams to a rail and stays there. That is exactly how comparators and Schmitt triggers are built on purpose, but it destroys the linear-amplifier behavior. The golden rule V+ = V− ONLY holds with NEGATIVE feedback (to the − input). This is the single most common 'gotcha' in op-amp questions.",
    },
    {
      id: "oa-uses",
      kind: "PROSE",
      title: "Where op-amps hide in real gear",
      markdown:
        "Once you can read these two topologies, you can read most of analog electronics, because nearly everything is a remix:\n\n- **Sensor front-ends.** Thermocouples, photodiodes, strain gauges, and microphones all put out tiny, fragile signals. A high-input-impedance non-inverting stage (or a follower) reads them without loading, then amplifies to a usable level.\n- **Active filters.** Drop a capacitor into the feedback path and the gain becomes frequency-dependent — instant low-pass, high-pass, or band-pass. The same `Rf/Rin` thinking, now with impedance instead of plain resistance.\n- **Summing amplifier.** Tie several input resistors to one virtual ground and the output becomes a weighted *sum* of the inputs — the heart of an audio mixer and a simple digital-to-analog converter.\n- **Difference / instrumentation amps.** Amplify the *difference* between two signals while rejecting noise common to both — the backbone of ECG and other precision measurement.\n- **Buffers everywhere.** Any time one stage's output must drive the next without sagging, a unity-gain follower stands guard.\n\nEvery one of these is just the golden rules plus a different resistor (or capacitor) arrangement. Learn the two rules, and the catalog opens up.",
    },
    {
      id: "oa-callout-warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Traps that quietly cost you points",
      markdown:
        "- **Feedback must reach the − input.** To the + input it is positive feedback and latches. Always confirm the path.\n- **'No input current' ≠ 'no current through Rin.'** Current absolutely flows through the external resistors; it just does not enter the op-amp's input terminals.\n- **The formulas assume linear operation.** If `gain × Vin` exceeds the supply, the output clips. A number bigger than the rail is wrong on its face.\n- **Non-inverting gain can never be below 1.** The '1 +' is structural. If you need attenuation with sign preserved, you need a different circuit.\n- **Gain is a ratio.** Scaling both resistors changes power and noise, not gain. Do not 'solve' for absolute values when only the ratio matters.\n- **Real op-amps aren't ideal.** Finite gain, input offset voltage, bias currents, and limited bandwidth all nibble at the ideal answer — fine for intuition, but mention them when precision matters.",
    },
    {
      id: "oa-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "Two rules, one picture",
      markdown:
        "Burn in the two golden rules — **no input current** and **inputs equal (with negative feedback)** — and the rest is bookkeeping. Spot the virtual ground in an inverting amp and let the current run straight through `Rf` for gain `−Rf/Rin`. Spot the divider in a non-inverting amp for gain `1 + Rf/Rin`. Remember the buffer is unity gain, the ratio sets everything, and the rails set the limit. That is the whole language of analog gain stages, written in two sentences and two resistors.",
    },
  ],
  keyTakeaways: [
    "The two golden rules — no current into the inputs, and V+ = V− under negative feedback — let you solve most op-amp circuits by inspection.",
    "Negative feedback (to the inverting input) is what tames the op-amp's near-infinite open-loop gain into a precise, predictable amplifier.",
    "Inverting gain is −Rf/Rin (sign flipped, can be <1); non-inverting gain is 1 + Rf/Rin (in phase, always ≥1); a follower is unity gain.",
    "The virtual short ties the two inputs to the same voltage with no current crossing; grounding V+ creates a virtual ground that makes inverting amps trivial.",
    "Gain is set by the resistor RATIO Rf/Rin, not absolute values — which is why matched on-chip resistors give accurate, stable gain.",
    "The ideal formulas only hold in the linear region; when gain × Vin exceeds the supply, the output saturates (clips) at the rail.",
    "The same two topologies, remixed with extra resistors or capacitors, build buffers, summing amps, difference/instrumentation amps, and active filters.",
  ],
};
