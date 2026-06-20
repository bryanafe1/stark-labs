import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_rc",
  slug: "rc-circuits-and-transients",
  title: "RC Circuits: The 63% Rule That Runs Your Electronics",
  summary:
    "A resistor and a capacitor walk into a loop and out comes the single most useful curve in electronics. You will learn why capacitor voltage refuses to teleport, how one number — τ = RC — sets the entire pace, and why \"fully charged\" is a polite lie. Play with the curve, predict before you peek, and walk away able to answer almost any first-order question on sight.",
  discipline: "ELECTRICAL",
  difficulty: "EASY",
  estMinutes: 26,
  tags: [
    "RC circuit",
    "transients",
    "time constant",
    "capacitor",
    "first-order ODE",
    "step response",
    "the 63% rule",
  ],
  practiceSlug: "rc-time-constant",
  objectives: [
    "Use i = C·dV/dt to explain the no-teleport rule: capacitor voltage is continuous and can never jump.",
    "Turn a series R-C-source loop into one tidy first-order ODE with KVL — and recognize it on sight.",
    "Solve it for the charging curve V(t) = Vs·(1 − e^(−t/RC)) and the discharge curve V(t) = V0·e^(−t/RC).",
    "Own the time constant τ = RC, including the 63.2%-at-1τ and 99.3%-settled-at-5τ milestones.",
    "Answer ANY first-order transient by inspection with x(t) = x(∞) + (x(0) − x(∞))·e^(−t/τ), plus the RL twin τ = L/R.",
    "Estimate stored energy ½CV² and spot RC in the wild: debounce, filters, and timer chips.",
  ],
  prerequisites: [
    "Ohm's law and Kirchhoff's voltage/current laws",
    "Basic differential calculus (derivatives, the exponential function)",
    "Series and parallel circuit reduction",
  ],
  interviewAngle:
    "RC transients are the single most common \"first-order dynamics\" question in electrical and embedded interviews because they reward intuition over memorization. Interviewers rarely want you to grind through Laplace transforms; they want to see that you know the capacitor voltage is the state variable that cannot jump, that τ = RC sets the only timescale, and that almost any first-order answer can be written down by inspection as final value plus a decaying gap. Strong candidates sketch the curve, label τ and the 63%/99% points, reason about initial and final conditions before writing a single equation, and can pivot to the RL dual or to energy and power without restarting. Sloppy candidates reach for the differential equation immediately and lose the physical picture.",
  blocks: [
    {
      id: "rc-hook",
      kind: "PROSE",
      title: "The most useful curve you will ever draw",
      markdown:
        "Here is a circuit so simple it feels like a typo: one resistor, one capacitor, a battery, and a switch. Flip the switch and... nothing dramatic happens. No spark, no bang. Just a voltage that *climbs* — fast at first, then slower, then slower still, creeping toward its target like a kid stalling at bedtime but never quite refusing.\n\nThat lazy climb is the heartbeat of electronics. It smooths your power rails, debounces your buttons, sets the pitch of a 555 timer, and shapes the edges of every sensor signal you have ever read. Learn this one curve and you have quietly learned *every* first-order circuit, including its inductor twin.\n\nThe whole show comes down to three beats:\n\n1. A capacitor cares about how fast its voltage is **changing**, not what it is.\n2. KVL squeezes the loop into one humble first-order differential equation.\n3. That equation hands you an exponential governed by a single number — the time constant τ = RC. Memorize the curve, not a table.",
    },
    {
      id: "rc-video",
      kind: "VIDEO",
      youtubeId: "Mf-4sfcJixY",
      title: "Watch: The RC Time Constant",
      channel: "Prof MAD",
    },
    {
      id: "rc-cap-iv",
      kind: "PROSE",
      title: "Why capacitor voltage can't teleport",
      markdown:
        "Picture a capacitor as a tiny water tank. Charge `Q = C·V` is the water inside; voltage is the water level. To raise the level you have to pour water in, and pouring takes *current*. That intuition is exactly the capacitor's defining law:\n\n`i = dQ/dt = C·dV/dt`\n\nRead it slowly: current into a capacitor follows the **slope** of its voltage, not the voltage itself. Two facts fall straight out, and they secretly run every RC problem:\n\n- **Flat voltage means zero current.** Once the level stops changing (`dV/dt = 0`), no water flows. At DC steady state the capacitor just sits there like an *open circuit*.\n- **Voltage cannot jump.** A jump means an infinitely steep slope, which by `i = C·dV/dt` demands *infinite* current. No real source can pour water that fast. So the level is always continuous: `V(0⁺) = V(0⁻)`.\n\nThat \"no-teleport rule\" is the most valuable freebie in transient analysis. Whatever the capacitor voltage was the instant *before* you flipped the switch, it is exactly that the instant *after*. You get the initial condition for free, every single time.",
    },
    {
      id: "rc-formula-iv",
      kind: "FORMULA",
      title: "The capacitor's three constitutive laws",
      display: "Q = C·V        i = C·dV/dt        E = ½·C·V²",
      variables: [
        { symbol: "Q", name: "Stored charge", unit: "C" },
        { symbol: "C", name: "Capacitance", unit: "F" },
        { symbol: "V", name: "Voltage across capacitor", unit: "V" },
        { symbol: "i", name: "Current into capacitor", unit: "A" },
        { symbol: "E", name: "Stored energy", unit: "J" },
      ],
      note: "Current chases the time-derivative of voltage, so steady DC current into an ideal cap is zero. Energy lives in the electric field and scales with V², which is why a tiny voltage wobble costs almost nothing but a big swing costs a fortune.",
    },
    {
      id: "rc-kvl-setup",
      kind: "PROSE",
      title: "One lap with KVL builds the equation",
      markdown:
        "Time for the classic: a DC source `Vs`, a resistor `R` in series, a capacitor `C`, and a switch that snaps shut at `t = 0`. The star of the show is the capacitor voltage `V(t)` — our **state variable**, the one quantity that remembers the past.\n\nWalk Kirchhoff's voltage law once around the loop. The source must equal the resistor drop plus the capacitor drop:\n\n`Vs = i·R + V`\n\nSeries means the *same* current flows everywhere, and the capacitor law tells us what that current is: `i = C·dV/dt`. Substitute it in:\n\n`Vs = R·C·(dV/dt) + V`\n\nTidy it up:\n\n`R·C·(dV/dt) + V = Vs`\n\nAnd there it is — a **first-order, linear, constant-coefficient ODE**. \"First-order\" (highest derivative is the first), \"linear\" (`V` and its slope show up to the first power), and crucially: the *only* timescale baked into it is the product `R·C`. One equation, one knob. Let's solve it.",
    },
    {
      id: "rc-derive-walkthrough",
      kind: "WALKTHROUGH",
      title: "Cracking V(t) step by step",
      steps: [
        {
          title: "1. Start from the governing equation",
          markdown:
            "We have `R·C·(dV/dt) + V = Vs`, and the cap starts empty: `V(0) = 0`. Name the time constant `τ = R·C` so the equation slims down to `τ·(dV/dt) + V = Vs`.",
        },
        {
          title: "2. Separate the variables",
          markdown:
            "Solve for the slope: `dV/dt = (Vs − V)/τ`. Then shove all the `V` stuff to one side and all the `t` stuff to the other:\n\n`dV / (Vs − V) = dt / τ`.",
        },
        {
          title: "3. Integrate both sides",
          markdown:
            "The left integrates to `−ln(Vs − V)`; the right to `t/τ`:\n\n`−ln(Vs − V) = t/τ + K`,\n\nwith `K` the constant of integration we will pin down in a moment.",
        },
        {
          title: "4. Untangle into V(t)",
          markdown:
            "Flip the sign and exponentiate: `Vs − V = A·e^(−t/τ)`, where `A = e^(−K)` is just a fresh constant. So `V(t) = Vs − A·e^(−t/τ)`. Almost home.",
        },
        {
          title: "5. Use the initial condition",
          markdown:
            "At `t = 0` the exponential is 1, so `V(0) = Vs − A`. But we started empty, `V(0) = 0`, which forces `A = Vs`. Drop it back in:\n\n`V(t) = Vs − Vs·e^(−t/τ) = Vs·(1 − e^(−t/τ))`.",
        },
        {
          title: "6. Gut-check the endpoints",
          markdown:
            "At `t = 0`: `V = Vs·(1 − 1) = 0` (matches the no-teleport rule from an empty start). As `t → ∞`: `e^(−t/τ) → 0`, so `V → Vs` (cap fills, current quits). Steep climb, then a graceful flattening toward `Vs`. Exactly the bedtime-stalling curve from the hook.",
        },
      ],
    },
    {
      id: "rc-formula-charge",
      kind: "FORMULA",
      title: "The charging law (and its mirror current)",
      display: "V(t) = Vs·(1 − e^(−t/τ))        τ = R·C        i(t) = (Vs/R)·e^(−t/τ)",
      variables: [
        { symbol: "V(t)", name: "Capacitor voltage at time t", unit: "V" },
        { symbol: "Vs", name: "Source (final) voltage", unit: "V" },
        { symbol: "τ", name: "Time constant (= R·C)", unit: "s" },
        { symbol: "R", name: "Series resistance", unit: "Ω" },
        { symbol: "C", name: "Capacitance", unit: "F" },
        { symbol: "i(t)", name: "Loop current at time t", unit: "A" },
      ],
      note:
        "Voltage rises as a saturating exponential while current decays as its mirror image. At t = 0 the empty cap acts like a dead short, so current peaks at Vs/R; as V approaches Vs the current fades to zero. Same τ, opposite shapes.",
    },
    {
      id: "rc-predict-onetau",
      kind: "PREDICT",
      question:
        "You start charging an empty capacitor toward 10 V. After exactly ONE time constant (t = 1τ), roughly how charged is it? Lock in your guess.",
      options: [
        { id: "a", label: "About 10% — it's barely getting started." },
        { id: "b", label: "About 37% — a third of the way." },
        { id: "c", label: "About 63% — most of the way up." },
        { id: "d", label: "About 100% — one τ means done." },
      ],
      answerId: "c",
      reveal:
        "**63.2%**, and here is why it is not a random number. Plug `t = τ` into the charging law:\n\n`V(τ) = Vs·(1 − e⁻¹) = Vs·(1 − 0.36788) = 0.63212·Vs`.\n\nThat `1 − e⁻¹ ≈ 0.632` is the fingerprint of every charging exponential. So at 1τ you are at ~6.32 V on the way to 10 V. (Tempting trap: 37% is what is *left to go*, the e⁻¹ part — and 100% never literally happens.)",
    },
    {
      id: "rc-tau-meaning",
      kind: "PROSE",
      title: "What τ really measures",
      markdown:
        "The time constant `τ = R·C` is the circuit's one and only clock, and it has a crisp meaning: it is how long the response takes to close the fraction `1 − e⁻¹ ≈ 0.632` of *whatever gap is left* to the finish line.\n\nThe greatest-hits milestones:\n\n- `1τ` → 63.2% charged\n- `2τ` → 86.5%\n- `3τ` → 95.0%\n- `4τ` → 98.2%\n- `5τ` → 99.33% — close enough that engineers call it \"settled\"\n\nNotice the trick: in *every* extra τ the response eats 63.2% of the remaining gap. Constant fractional progress per τ — that is exactly what makes an exponential an exponential, and it is why the curve never technically arrives.\n\nAnd the knobs behave like intuition says: bigger `R` (harder to push current) or bigger `C` (a bigger tank to fill) both stretch τ and slow everything down. Shrink either one and the circuit gets snappy.",
    },
    {
      id: "rc-predict-doubleRC",
      kind: "PREDICT",
      question:
        "You DOUBLE the resistor AND DOUBLE the capacitor. What happens to the time constant τ?",
      options: [
        { id: "a", label: "It doubles (×2)." },
        { id: "b", label: "It quadruples (×4)." },
        { id: "c", label: "It stays the same — the changes cancel." },
        { id: "d", label: "It halves (×0.5)." },
      ],
      answerId: "b",
      reveal:
        "**It quadruples.** τ = R·C is a *product*, so doubling each factor multiplies τ by 2 × 2 = 4. A 47 ms circuit becomes a 188 ms circuit — four times more sluggish. The cancel-out instinct (option c) is the classic gotcha: that would only happen if you doubled one and *halved* the other. Products multiply; they don't take turns.",
    },
    {
      id: "rc-sandbox-charge",
      kind: "SANDBOX",
      title: "Play: drive the charging curve yourself",
      description:
        "Drag the source voltage, resistance, capacitance, and time and watch V(t) respond live. With the defaults τ = R·C = 0.047 s, so t = 0.047 s is exactly one time constant — confirm the 63% rule: the output lands near 63.2% of Vs (≈ 3.161 V at Vs = 5 V). Now crank t toward 5τ ≈ 0.235 s and watch it sneak up on Vs without ever quite touching it.",
      variables: [
        { key: "Vs", label: "Source voltage", unit: "V", min: 1, max: 24, step: 1, default: 5 },
        { key: "R", label: "Resistance", unit: "Ω", min: 1000, max: 100000, step: 1000, default: 10000 },
        { key: "C", label: "Capacitance", unit: "F", min: 1e-6, max: 1e-4, step: 1e-6, default: 4.7e-6 },
        { key: "t", label: "Time", unit: "s", min: 0, max: 1, step: 0.005, default: 0.047 },
      ],
      expression: "Vs * (1 - exp(-t / (R * C)))",
      outputLabel: "Capacitor voltage V(t)",
      outputUnit: "V",
      precision: 3,
    },
    {
      id: "rc-sandbox-tau",
      kind: "SANDBOX",
      title: "Play: spin up a time constant",
      description:
        "Just τ = R·C, in seconds. Defaults give R = 10 kΩ and C = 4.7 μF → τ = 0.047 s = 47 ms. Want to feel the doubling rule from the prediction? Bump R to 47 kΩ and C to 22 μF (set C to 2.2e-5) and watch τ balloon.",
      variables: [
        { key: "R", label: "Resistance", unit: "Ω", min: 1000, max: 100000, step: 1000, default: 10000 },
        { key: "C", label: "Capacitance", unit: "F", min: 1e-6, max: 1e-4, step: 1e-6, default: 4.7e-6 },
      ],
      expression: "R * C",
      outputLabel: "Time constant τ",
      outputUnit: "s",
      precision: 4,
    },
    {
      id: "rc-check-nojump",
      kind: "CHECK",
      question:
        "A switch connects a 12 V source through 1 kΩ to a capacitor sitting at 0 V. The instant after the switch closes (t = 0⁺), what are the capacitor voltage and the resistor current?",
      choices: [
        { id: "a", label: "V = 12 V and i = 0 A — the capacitor instantly charges." },
        { id: "b", label: "V = 0 V and i = 12 mA — voltage can't jump, so the full source appears across R." },
        { id: "c", label: "V = 6 V and i = 6 mA — source splits evenly between R and C." },
        { id: "d", label: "V = 0 V and i = 0 A — nothing has happened yet." },
      ],
      answerId: "b",
      explanation:
        "No-teleport rule: V(0⁺) = V(0⁻) = 0. With 0 V across the cap, KVL dumps all 12 V across the resistor, so current peaks at i = Vs/R = 12 V / 1 kΩ = 12 mA. The empty cap is momentarily a dead short. The current is at its *maximum*, not zero — which kills option (d).",
    },
    {
      id: "rc-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "The one-line shortcut interviewers fall in love with",
      markdown:
        "You almost never need to re-derive that ODE on a whiteboard. *Every* first-order variable obeys the same template:\n\n`x(t) = x(∞) + (x(0) − x(∞))·e^(−t/τ)`,\n\nin words, \"final value plus the decaying initial gap.\" To nail *any* RC (or RL) transient, hunt down three things by inspection:\n\n1. **x(0)** — the initial value (no-teleport rule: capacitor voltage / inductor current).\n2. **x(∞)** — the steady state (cap → open, inductor → short).\n3. **τ** — the time constant (RC, or the Thévenin resistance the cap *sees* times C).\n\nThen just write it down. Charging from 0 to Vs gives `Vs·(1 − e^(−t/τ))`; discharging from V0 to 0 gives `V0·e^(−t/τ)`. Saying this out loud *before* you touch algebra is the fastest way to signal you understand the physics, not just the formula.",
    },
    {
      id: "rc-discharge",
      kind: "PROSE",
      title: "Discharge: pulling the plug on the tank",
      markdown:
        "Now yank the source and let a capacitor charged to `V0` drain through a resistor — picture pulling the plug on a sink. KVL around the source-free loop loses its driving term:\n\n`R·C·(dV/dt) + V = 0`.\n\nThis is the **natural response**: the circuit relaxing on its own, no one pushing. The same separate-and-integrate dance gives a clean decay:\n\n`V(t) = V0·e^(−t/τ)`,    `i(t) = −(V0/R)·e^(−t/τ)`.\n\nThe minus on the current just means it now flows *out* of the cap — the sink is draining, not filling. After 1τ the voltage has fallen to 36.8% of `V0`; after 5τ it is basically empty.\n\nThis is also where two interview vocabulary words live:\n\n- **Natural (source-free) response** — the homogeneous part, fed by stored energy and τ; here `V0·e^(−t/τ)`.\n- **Forced (step) response** — the particular part that tracks the input; here the constant `Vs`.\n\nThe full charging answer `Vs·(1 − e^(−t/τ))` is literally *forced* `Vs` **plus** *natural* `−Vs·e^(−t/τ)`. Stack the two and you get the general template from the callout above. Same idea, wearing different hats.",
    },
    {
      id: "rc-formula-discharge",
      kind: "FORMULA",
      title: "The discharge (natural) law",
      display: "V(t) = V0·e^(−t/τ)        i(t) = (V0/R)·e^(−t/τ)        E = ½·C·V0²",
      variables: [
        { symbol: "V(t)", name: "Capacitor voltage at time t", unit: "V" },
        { symbol: "V0", name: "Initial capacitor voltage", unit: "V" },
        { symbol: "τ", name: "Time constant (= R·C)", unit: "s" },
        { symbol: "R", name: "Discharge resistance", unit: "Ω" },
        { symbol: "E", name: "Energy released as the cap discharges", unit: "J" },
      ],
      note:
        "Voltage and current decay with the same τ. The ½·C·V0² stored at t = 0 all ends up as heat in R — no matter what R is. A smaller R just dumps it faster (smaller τ) but at a scarier peak current.",
    },
    {
      id: "rc-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: how long to hit a target voltage?",
      problem:
        "A 2.2 μF capacitor, initially empty, charges from a 10 V source through a 47 kΩ resistor. (a) Find the time constant τ. (b) What is the capacitor voltage one time constant after the switch closes? (c) How long until the cap reaches 8 V? (d) How much energy is stored at 8 V?",
      steps: [
        {
          label: "(a) Time constant",
          markdown:
            "τ = R·C = (47 000 Ω)·(2.2 × 10⁻⁶ F) = 0.1034 s ≈ 103.4 ms. That is the only clock in the circuit — expect it essentially full by 5τ ≈ 0.52 s.",
        },
        {
          label: "(b) Voltage at t = 1τ",
          markdown:
            "Lean on the 63.2% rule — no calculator needed: V(τ) = Vs·(1 − e⁻¹) = 10 V × 0.6321 = 6.32 V.",
        },
        {
          label: "(c) Time to reach 8 V — set it up",
          markdown:
            "Charging law: 8 = 10·(1 − e^(−t/τ)). Divide by 10: 0.8 = 1 − e^(−t/τ), so e^(−t/τ) = 0.2.",
        },
        {
          label: "(c) Solve for t",
          markdown:
            "Take the natural log: −t/τ = ln(0.2) = −1.6094, so t = 1.6094·τ. With τ = 0.1034 s, t = 1.6094 × 0.1034 ≈ 0.1664 s ≈ 166 ms. (Neat form: t = τ·ln(Vs/(Vs − V)) = τ·ln(10/2) = τ·ln 5.)",
        },
        {
          label: "(d) Stored energy at 8 V",
          markdown:
            "E = ½·C·V² = ½ × 2.2 × 10⁻⁶ F × (8 V)² = ½ × 2.2 × 10⁻⁶ × 64 = 7.04 × 10⁻⁵ J ≈ 70.4 μJ.",
        },
      ],
      answer:
        "(a) τ ≈ 103 ms; (b) V(1τ) = 6.32 V; (c) t = τ·ln 5 ≈ 166 ms to reach 8 V; (d) E ≈ 70.4 μJ stored.",
    },
    {
      id: "rc-callout-warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Traps that quietly cost you points",
      markdown:
        "- **\"Settled\" is not \"done.\"** Fully charged at 5τ means 99.3%, an engineering courtesy. The exponential never mathematically reaches Vs.\n- **No-teleport applies to capacitor *voltage* only.** The resistor *current* absolutely can jump — it leaps to Vs/R at t = 0. Inductors flip this: current is continuous, voltage can jump.\n- **Use Thévenin resistance, not the nearest resistor.** If the cap stares into a network, τ uses the equivalent resistance looking back from its terminals (sources killed).\n- **Watch your units.** A 4.7 μF cap is 4.7 × 10⁻⁶ F. Handy shortcut: kΩ × μF = ms. Use it as a sanity check.\n- **Mind the discharge sign.** Current flows *out* of the cap, so it is negative relative to the charging convention.",
    },
    {
      id: "rc-rl-and-uses",
      kind: "PROSE",
      title: "The RL twin and where RC hides in real gear",
      markdown:
        "Capacitors have an inductor twin that plays by the dual law `v = L·di/dt`. A series RL circuit driven by a source gives the *exact same* first-order ODE — except now the *current* is the state variable. Its time constant flips to\n\n`τ = L/R`.\n\nMind the inversion: for RL, a *bigger* R makes the circuit *faster* (shorter τ) — the opposite of RC. Everything else transfers cleanly: `i(t) = i(∞) + (i(0) − i(∞))·e^(−t/τ)`, the 63.2%/99.3% milestones, natural vs forced. Inductor *current* is now the un-teleportable quantity, the mirror of capacitor voltage.\n\nWhere this curve earns its rent:\n\n- **Switch debounce.** An RC smears the noisy mechanical bounce so the logic threshold gets crossed exactly once. Pick τ bigger than the bounce.\n- **Filters.** A first-order RC low-pass has cutoff `fc = 1/(2π·R·C)` — same RC, now in the frequency domain. Long τ ↔ low cutoff.\n- **Timing chips.** The 555 and every one-shot set their interval by how long an RC takes to cross a threshold — literally the `t = τ·ln(...)` you just did.\n- **Power-supply smoothing and snubbers,** where the cap's ½CV² and its lazy response ride out transients.",
    },
    {
      id: "rc-check-tau",
      kind: "CHECK",
      question:
        "You want a first-order RC low-pass with a 3 dB cutoff near 1.6 kHz, and you already have a 0.01 μF capacitor lying around. Roughly what resistor gives the right τ, and what is that τ?",
      choices: [
        { id: "a", label: "≈ 100 Ω, τ ≈ 1 μs" },
        { id: "b", label: "≈ 10 kΩ, τ ≈ 100 μs" },
        { id: "c", label: "≈ 1 kΩ, τ ≈ 10 μs" },
        { id: "d", label: "≈ 1 MΩ, τ ≈ 10 ms" },
      ],
      answerId: "b",
      explanation:
        "Cutoff and τ are joined at the hip: fc = 1/(2π·τ), so τ = 1/(2π·fc) = 1/(2π × 1600 Hz) ≈ 9.95 × 10⁻⁵ s ≈ 100 μs. Then R = τ/C = (1.0 × 10⁻⁴ s)/(1.0 × 10⁻⁸ F) = 10 000 Ω = 10 kΩ. Check it forward: R·C = 10 kΩ × 0.01 μF = 100 μs, and fc = 1/(2π × 100 μs) ≈ 1.59 kHz ≈ 1.6 kHz. The kΩ × μF = ms shortcut nails the magnitude: 10 kΩ × 0.01 μF = 0.1 ms = 100 μs.",
    },
    {
      id: "rc-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "One picture to rule them all",
      markdown:
        "Sketch a curve that starts steep and flattens toward `Vs`. Mark `t = τ` at 63% of the way up, and `t = 5τ` as \"settled.\" That single doodle, plus `τ = RC` and the no-teleport rule, lets you reconstruct charging, discharging, current, energy, and the RL twin — no memorized table required. Draw it in interviews. It does the talking for you.",
    },
  ],
  keyTakeaways: [
    "i = C·dV/dt means current tracks the slope of voltage, so capacitor voltage is continuous and can't teleport; at DC steady state the cap is an open circuit.",
    "KVL on a series R-C-source loop gives the first-order ODE R·C·(dV/dt) + V = Vs, whose solution is the charging curve V(t) = Vs·(1 − e^(−t/τ)).",
    "τ = R·C is the circuit's only clock: ~63.2% of the remaining gap closes in 1τ and ~99.3% (settled) by 5τ, because 1 − e⁻¹ ≈ 0.632.",
    "Source-free discharge is the natural response V(t) = V0·e^(−t/τ); the charging answer is just forced Vs plus that decaying natural term.",
    "Any first-order transient drops out of x(t) = x(∞) + (x(0) − x(∞))·e^(−t/τ) — find initial value, final value, and τ, then read it off.",
    "Energy stored is ½·C·V²; the RL twin has τ = L/R with current (not voltage) as the un-teleportable state, so larger R makes RL faster but RC slower.",
    "The same RC sets a low-pass cutoff fc = 1/(2π·R·C) and the timing of debounce and 555-style circuits, where t = τ·ln(...) gives threshold-crossing delays.",
  ],
};
