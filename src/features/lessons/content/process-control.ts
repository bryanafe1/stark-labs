import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_processctrl",
  slug: "process-control",
  title: "Process Control: Taming Tanks, Time Constants, and the Tyranny of Dead Time",
  summary:
    "A chemical plant is a slow-motion balancing act: heat a reactor too fast and you get a runaway, too slow and you waste a fortune. Almost every loop on the plant floor behaves like a single, well-mannered creature — the first-order system — with one number, the time constant τ, that tells you everything about how fast it responds. You will learn the 63% rule, why it takes about 5τ to truly settle, why dead time is the silent killer of good control, and how P, PI, and PID feedback keep a stirred tank locked on its setpoint.",
  discipline: "CHEMICAL",
  difficulty: "MEDIUM",
  estMinutes: 23,
  tags: ["process-control", "first-order", "dynamics"],
  objectives: [
    "Explain what process dynamics are and why a stirred tank, a heat exchanger, and an RC circuit all behave as first-order systems.",
    "Define the time constant τ and use the 63% rule and the 5τ settling guideline to sketch a first-order step response.",
    "Compute the time constant of a stirred tank as τ = V/Q and predict how it changes with volume and flow rate.",
    "Distinguish process gain, time constant, and dead time, and explain why dead time makes feedback control so much harder.",
    "Trace a feedback loop (sensor → controller → valve → process) and describe what P, PI, and PID controllers each add in a plant context.",
    "Estimate how long a tank takes to approach a new setpoint after a step change in its input.",
  ],
  prerequisites: [
    "Comfort with exponential functions and the idea of an exponential approach to a limit",
    "Basic mass balance intuition (what flows in must accumulate or flow out)",
    "Familiarity with a simple feedback loop or block diagram",
  ],
  interviewAngle:
    "Process-control interviews in chemical and process engineering almost always start with first-order dynamics because they reveal whether you think in terms of physical time scales or just memorized PID. Interviewers want to hear that the time constant τ is the single number that sets how fast a process responds, that the response is 63% complete after one τ and essentially done after about five, and that τ for a well-mixed tank is just residence time V/Q. The killer follow-up is dead time: strong candidates explain that a transport or measurement delay means the controller is always acting on stale information, which forces you to detune the loop or reach for something like a Smith predictor. Weak candidates conflate dead time with the time constant, or recite \"PID\" without being able to say why integral action is what kills the steady-state offset on a real column or reactor.",
  blocks: [
    {
      id: "pc-hook",
      kind: "PROSE",
      title: "Why a chemical plant is a giant exercise in patience",
      markdown:
        "Picture a stirred tank the size of a hot tub, fed by a pipe of warm liquid, with a stream draining out the bottom. You suddenly turn up the temperature of the incoming feed. Does the tank instantly jump to the new temperature?\n\nOf course not. The tank is full of liquid that is still at the *old* temperature, and the fresh warm feed has to gradually mix in and flush the old stuff out. The temperature climbs — fast at first, then slower and slower — easing toward the new value like a car coasting up to a stoplight. It is **lazy**, in a completely predictable way.\n\nThat laziness has a name: **process dynamics**, and it is the heartbeat of chemical engineering. Reactors, distillation columns, heat exchangers, mixing tanks — none of them respond instantly, and a process control engineer's entire job is to understand *how* they lag and then build feedback that keeps them on target anyway. The beautiful part: a huge fraction of these processes behave like the simplest dynamic creature there is — a **first-order system** — described by a single magic number. Learn that number and you can reason about half the plant on sight.",
    },
    {
      id: "pc-video",
      kind: "VIDEO",
      youtubeId: "irAhcT3CKoM",
      title: "Watch: Step Response of a First-Order System",
    },
    {
      id: "pc-firstorder",
      kind: "PROSE",
      title: "The first-order system: one lag to rule them all",
      markdown:
        "A **first-order system** is any process whose rate of change is proportional to *how far it still has to go*. The further from the target, the faster it moves; as it closes in, it slows down. That single rule produces the familiar smooth exponential approach — no overshoot, no oscillation, just a graceful coast to the finish.\n\nIf you have ever charged a capacitor through a resistor, you have already met this curve. An **RC circuit** charges quickly at first and then crawls toward the supply voltage, governed by τ = R·C. A stirred tank flushing in warm feed does *exactly the same thing*, just with liquid instead of charge. So does a thermometer warming up when you dunk it in hot coffee, and a room heating up after you turn on a space heater. Same math, wildly different physics — that universality is why first-order dynamics is the first thing every controls course teaches.\n\nMathematically, the output `y` chasing an input step responds as `y(t) = y∞·(1 − e^(−t/τ))`, where `y∞` is the final value it is heading toward. The whole shape of that curve is set by one parameter: the time constant **τ**.",
    },
    {
      id: "pc-tau-intuition",
      kind: "PROSE",
      title: "The time constant τ: the 63% rule and the 5τ rule",
      markdown:
        "The **time constant τ** is the natural time scale of the process — *roughly* how long it takes to respond. But it has two precise, interview-ready meanings worth burning into memory:\n\n- **The 63% rule.** After exactly one time constant (`t = τ`), a first-order system has covered **63.2%** of the total distance to its final value. (Why 63.2%? Because `1 − e^(−1) = 0.632`.) After two time constants you are at 86.5%, after three at 95%.\n- **The 5τ rule.** The exponential never *mathematically* reaches the target, but after about **5τ** it is within 0.7% — close enough that engineers call the process \"settled.\" So if someone tells you τ = 4 minutes, you immediately know the process is essentially done responding after ~20 minutes.\n\nA short τ means a snappy, responsive process; a long τ means a sluggish one that takes forever to react (and forever to recover from a mistake). When you size a control loop, τ tells you how fast you can realistically expect to push the process around. A controller can not make a genuinely slow tank respond like a fast one — physics sets the floor.\n\nThe other number that matters is the **process gain** `K`: how *much* the output ultimately moves for a given change in input. Time constant answers \"how fast?\"; gain answers \"how far?\" Together, gain and time constant describe most of what a first-order process will do.",
    },
    {
      id: "pc-formula-tau",
      kind: "FORMULA",
      title: "First-order step response and the stirred-tank time constant",
      display: "y(t) = K·Δu·(1 − e^(−t/τ)),    τ = V / Q",
      latex: "y(t) = K\\,\\Delta u\\left(1 - e^{-t/\\tau}\\right), \\quad \\tau = \\dfrac{V}{Q}",
      variables: [
        { symbol: "y(t)", name: "Process output as a function of time" },
        { symbol: "K", name: "Process (steady-state) gain — how far the output moves per unit input" },
        { symbol: "Δu", name: "Size of the step change applied to the input" },
        { symbol: "τ", name: "Time constant (residence time for a well-mixed tank)", unit: "min" },
        { symbol: "t", name: "Time since the step", unit: "min" },
        { symbol: "V", name: "Tank (liquid) volume", unit: "m³" },
        { symbol: "Q", name: "Volumetric flow rate through the tank", unit: "m³/min" },
      ],
      note:
        "For a well-mixed (CSTR-style) tank, the time constant equals the residence time τ = V/Q — the average time a parcel of fluid spends inside. Big tank or trickle flow → long τ → sluggish. Small tank or torrent of flow → short τ → snappy. At t = τ the output has covered 63.2% of K·Δu; after ~5τ it is effectively done.",
    },
    {
      id: "pc-sandbox-tau",
      kind: "SANDBOX",
      title: "Play: feel the residence time of a stirred tank",
      description:
        "Drag the tank volume V and the flow rate Q to watch the time constant τ = V/Q. With the defaults (V = 10 m³, Q = 2 m³/min) you get τ = 10/2 = 5.0 min — so the tank is ~63% of the way to a new value after 5 minutes and basically settled after ~25 (that's 5τ). Pump faster (raise Q) or shrink the tank (lower V) and τ drops: the process gets snappier. Fill a bigger tank or starve the flow and τ balloons into a sluggish, slow-to-correct process.",
      variables: [
        { key: "V", label: "Tank volume V", unit: "m³", min: 1, max: 100, step: 1, default: 10 },
        { key: "Q", label: "Flow rate Q", unit: "m³/min", min: 0.5, max: 50, step: 0.5, default: 2 },
      ],
      expression: "V / Q",
      outputLabel: "Time constant τ",
      outputUnit: "min",
      precision: 1,
    },
    {
      id: "pc-predict-flow",
      kind: "PREDICT",
      question:
        "A stirred tank has a time constant of 5 minutes. Without changing the tank, you double the flow rate Q through it. What happens to the time constant?",
      options: [
        { id: "a", label: "It doubles to 10 minutes — more flow means more to process." },
        { id: "b", label: "It stays 5 minutes — flow rate doesn't affect dynamics." },
        { id: "c", label: "It halves to 2.5 minutes — the tank flushes twice as fast." },
        { id: "d", label: "It drops to zero — the tank responds instantly." },
      ],
      answerId: "c",
      reveal:
        "**It halves to 2.5 minutes.** Since τ = V/Q, doubling Q with V fixed cuts τ in half. Physically, you are flushing the tank's contents out twice as fast, so the old liquid clears and the new conditions take over in half the time — the process becomes twice as snappy. This is exactly why faster recirculation or smaller hold-up volumes are a classic way to speed up a sluggish loop: you are shrinking the residence time. It does not go to zero, though — there is always *some* mixing lag as long as the tank holds liquid.",
    },
    {
      id: "pc-predict-settle",
      kind: "PREDICT",
      question:
        "A heat exchanger behaves as a first-order system with τ = 3 minutes. You make a step change to its inlet. Roughly how long until the outlet temperature has essentially reached its new steady value?",
      options: [
        { id: "a", label: "About 3 minutes — one time constant and it's done." },
        { id: "b", label: "About 15 minutes — roughly five time constants." },
        { id: "c", label: "About 1.9 minutes — 63% of 3 minutes." },
        { id: "d", label: "It never settles; the temperature rises forever." },
      ],
      answerId: "b",
      reveal:
        "**About 15 minutes — roughly 5τ.** After one time constant (3 min) the outlet has only covered 63% of the change; it needs about *five* time constants to get within ~0.7% of the final value, which engineers treat as \"settled.\" So 5 × 3 = 15 minutes. Option (a) confuses 63%-complete with fully-done, and (c) is just the 63% milestone time, not the settling time. The response does converge (it's a stable first-order system), it just does so asymptotically — fast at first, then crawling the last little bit.",
    },
    {
      id: "pc-deadtime",
      kind: "PROSE",
      title: "Dead time: the silent killer of good control",
      markdown:
        "Here is where process control gets genuinely hard. Real plants do not just *lag* — they often have **dead time** (also called transport delay or time delay): a pure, flat period where you make a change and *nothing happens at all* before the response even begins.\n\nWhere does it come from? Mostly geometry and physics:\n\n- **Transport delay.** You add reagent at one end of a long pipe, but the sensor is 50 meters downstream. At a given flow velocity it might take 30 seconds for the changed fluid to physically *travel* to the sensor. For that 30 seconds, the controller is blind.\n- **Measurement delay.** Analyzers, sampling systems, and even thermowells take time to register a change.\n\nDead time is poison for feedback, and the reason is brutally intuitive: **the controller is always acting on stale information.** Imagine steering a car where the windshield shows you the road as it looked 5 seconds ago. You crank the wheel to correct a drift, but the drift you are seeing already happened — and your correction will not show up for another 5 seconds. You overcorrect, then overcorrect the other way, and the car weaves. A feedback loop with significant dead time does exactly this: push the gains up to respond quickly and the loop goes unstable and oscillates.\n\nThe practical consequences: with lots of dead time you are forced to *detune* the controller (lower the gains, accept a slower, gentler loop), or reach for cleverer schemes — feedforward control, or a **Smith predictor** that models the delay and lets the controller act on a *prediction* of where the process is heading rather than the stale measurement. The ratio of dead time to time constant (θ/τ) is the single best predictor of how painful a loop will be to control: small ratio is easy, large ratio is a nightmare.",
    },
    {
      id: "pc-feedback",
      kind: "PROSE",
      title: "Closing the loop: sensor, controller, valve, and P/PI/PID",
      markdown:
        "Knowing the dynamics is half the battle; the other half is the **feedback loop** that holds the process on target despite disturbances (a cold day, a fouling exchanger, a change in feed composition). The classic plant loop has four players going around in a circle:\n\n1. **Sensor / transmitter** measures the process variable (temperature, level, pressure, flow) → call it `y`.\n2. **Controller** compares `y` to the **setpoint** `r`, forms the **error** `e = r − y`, and computes a command.\n3. **Final control element** — almost always a **control valve** (or a pump, heater, or VFD) — moves to execute the command, adjusting how much steam, coolant, or feed enters.\n4. **Process** (the tank, column, reactor) responds with its first-order lag (plus any dead time), the sensor re-measures, and around we go.\n\nThe controller's brains are usually some flavor of **PID**, and in a chemical plant the choices map cleanly to the dynamics:\n\n- **P (proportional)** — command proportional to the current error. Fast and simple, but on a self-regulating process it leaves a stubborn **steady-state offset**: to hold the steam valve open against a constant heat loss, P needs a leftover error to generate that command. Useful where a small offset is acceptable (e.g., some level loops).\n- **PI (proportional + integral)** — the **workhorse of the process industry**. The integral term accumulates the leftover error over time and keeps nudging the valve until the offset is driven to *exactly zero*. The vast majority of real plant loops — flow, level, pressure, many temperatures — are PI, precisely because they need that offset-free control and most processes are too noisy to benefit from derivative.\n- **PID (adding derivative)** — derivative anticipates fast changes and adds damping, helpful on slow, sluggish loops with large time constants (like big temperature loops). But derivative amplifies measurement noise, so on the typically noisy signals of a plant it is used sparingly and often heavily filtered. Many process engineers run PI 90% of the time and only add D where a loop is slow enough to need it.",
    },
    {
      id: "pc-formula-loop",
      kind: "FORMULA",
      title: "The feedback control law on the plant floor",
      display: "u(t) = Kc·e(t) + (Kc/τI)·∫₀ᵗ e dt + Kc·τD·(de/dt),    e(t) = r(t) − y(t)",
      latex: "u(t) = K_c\\,e(t) + \\dfrac{K_c}{\\tau_I}\\int_0^{t} e\\,dt + K_c\\,\\tau_D\\,\\dfrac{de}{dt}, \\quad e(t) = r(t) - y(t)",
      variables: [
        { symbol: "u(t)", name: "Controller output (signal to the valve)" },
        { symbol: "e(t)", name: "Error = setpoint − measured process variable" },
        { symbol: "r(t)", name: "Setpoint (desired value)" },
        { symbol: "y(t)", name: "Measured process variable" },
        { symbol: "Kc", name: "Controller gain (proportional)" },
        { symbol: "τI", name: "Integral (reset) time — smaller means stronger integral action", unit: "min" },
        { symbol: "τD", name: "Derivative time — larger means more anticipation", unit: "min" },
      ],
      note:
        "Process-industry PID is usually written with a reset time τI and a derivative time τD instead of separate Ki, Kd gains. Set τD = 0 (drop the last term) and you have the ubiquitous PI controller. Integral action is what drives the steady-state offset of a P-only loop to exactly zero — the reason PI dominates real plants.",
    },
    {
      id: "pc-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: a stirred tank's time constant and its run to setpoint",
      problem:
        "A well-mixed (CSTR-style) blending tank holds V = 10 m³ of liquid and is fed at Q = 2 m³/min, with the same rate draining out (constant level). The inlet concentration is stepped up, and the tank's outlet concentration must rise from 0 to a new steady value of 5 g/L. (a) Find the tank's time constant. (b) What fraction of the change is complete, and roughly what concentration is reached, after one time constant? (c) Estimate how long until the outlet is essentially at the new setpoint. (d) If the controller manipulates the inlet via a valve at the end of a long feed pipe that adds 1 minute of transport (dead) time, what changes qualitatively?",
      steps: [
        {
          label: "(a) Time constant from residence time",
          markdown:
            "For a well-mixed tank, τ equals the residence time: τ = V / Q = 10 / 2 = **5 minutes**. That is the average time a parcel of fluid spends in the tank, and it sets the whole pace of the response.",
        },
        {
          label: "(b) Apply the 63% rule",
          markdown:
            "After one time constant (t = τ = 5 min), a first-order system is 63.2% of the way to its final value. Final value is 5 g/L, so the outlet is at 0.632 × 5 ≈ **3.16 g/L** after 5 minutes. (Check: `y(τ) = 5·(1 − e^(−1)) = 5 × 0.632 = 3.16 g/L`.)",
        },
        {
          label: "(c) Apply the 5τ settling rule",
          markdown:
            "\"Essentially settled\" means within ~0.7% of the target, which takes about 5 time constants: 5 × τ = 5 × 5 = **25 minutes**. After that the outlet is within ~0.04 g/L of 5 g/L — close enough that operators call it done. (At 3τ = 15 min it is already at 95%, or ~4.75 g/L, if you need a faster rough estimate.)",
        },
        {
          label: "(d) Add dead time",
          markdown:
            "Now there is a pure 1-minute delay: a change at the valve does not even *begin* to show at the outlet until 1 minute later. The response shape is the same first-order curve, just shifted right by 1 minute. The ratio θ/τ = 1/5 = 0.2 is modest, so the loop is still controllable — but the controller must be detuned somewhat (lower gain) compared to a no-delay tank, because for that first minute after any correction it is flying blind and risks overcorrecting if pushed too hard.",
        },
      ],
      answer:
        "(a) τ = V/Q = 10/2 = 5 min. (b) 63.2% complete after 5 min → ~3.16 g/L. (c) Essentially settled after ~5τ = 25 min. (d) The 1-min dead time shifts the response later (θ/τ = 0.2) and forces a more conservative controller, since corrections act on 1-minute-stale information.",
    },
    {
      id: "pc-check-tau",
      kind: "CHECK",
      question:
        "Two stirred tanks process the same fluid. Tank A is 20 m³ at 4 m³/min; Tank B is 6 m³ at 3 m³/min. Which responds faster to a step change, and why?",
      choices: [
        { id: "a", label: "Tank A — it has more volume, so it has more capacity to respond." },
        { id: "b", label: "Tank B — its time constant τ = 2 min is smaller than Tank A's τ = 5 min." },
        { id: "c", label: "They respond identically — both are first-order systems." },
        { id: "d", label: "Tank A — higher flow rate always means faster response." },
      ],
      answerId: "b",
      explanation:
        "Compute the time constants: Tank A is τ = V/Q = 20/4 = 5 min; Tank B is τ = 6/3 = 2 min. The smaller time constant wins, so **Tank B responds faster** — it flushes its smaller hold-up at a healthy flow, so new conditions take over quickly. Volume alone (a) and flow alone (d) are both incomplete: it is the *ratio* V/Q that sets the speed. And while both are indeed first-order (c), being first-order does not make them identical — they have different τ.",
    },
    {
      id: "pc-check-deadtime",
      kind: "CHECK",
      question:
        "An operator complains that a temperature loop oscillates whenever they turn up the controller gain to make it respond faster. The process has a significant transport delay between the heater and the temperature sensor. What is the most likely culprit?",
      choices: [
        { id: "a", label: "The time constant is too small; enlarge the tank to slow it down." },
        { id: "b", label: "Dead time: the controller acts on stale measurements, so high gain causes overcorrection and oscillation." },
        { id: "c", label: "The process gain is negative; reverse the valve action." },
        { id: "d", label: "Integral windup; remove the integral term entirely." },
      ],
      answerId: "b",
      explanation:
        "The transport delay between heater and sensor is **dead time**, and that is exactly what makes a loop go unstable when you push the gain. The controller is correcting based on what the temperature *was* moments ago, not what it is now, so an aggressive (high-gain) correction overshoots, then overshoots back the other way — oscillation. The fix is to *detune* (lower the gain), or use a dead-time-compensating scheme like a Smith predictor. It is not the time constant being too small (a), and removing integral entirely (d) would reintroduce steady-state offset without curing the delay-driven instability.",
    },
    {
      id: "pc-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What process-control interviewers are really probing",
      markdown:
        "Process-dynamics questions are designed to see whether you think in *time scales* and *physical mechanisms*, not just acronyms. To stand out:\n\n- **Lead with τ as the time scale.** \"The time constant tells me how fast the process responds — 63% done in one τ, essentially settled in about five.\" Knowing both numbers cold signals fluency.\n- **Tie τ to physics.** For a well-mixed tank, τ = V/Q is the *residence time*. Being able to derive a time constant from geometry and flow (not just quote it) is a strong signal.\n- **Distinguish gain, time constant, and dead time.** Gain = how far, time constant = how fast, dead time = how long before anything happens at all. Mixing these up is the most common red flag.\n- **Respect dead time.** Explain that delay forces detuning because the controller acts on stale data, and name a remedy (feedforward, Smith predictor). The ratio θ/τ as a difficulty gauge is a sophisticated touch.\n- **Default to PI, justify D.** Say that PI is the plant workhorse because integral kills steady-state offset, and that derivative is used sparingly because it amplifies the noise that real process measurements are full of.",
    },
    {
      id: "pc-callout-tip",
      kind: "CALLOUT",
      variant: "tip",
      title: "Back-of-the-envelope rules that survive any process problem",
      markdown:
        "When you meet a first-order process, you can answer most questions with three reflexes:\n\n- **τ = V/Q** for a well-mixed tank — residence time *is* the time constant. Big/slow flow → sluggish; small/fast flow → snappy.\n- **63 / 86 / 95 / 99.3%** at 1τ / 2τ / 3τ / 5τ. Memorize 63% (one τ) and 5τ (settled) at minimum.\n- **Speed up a loop?** Shrink the residence time (smaller hold-up or higher flow), reduce dead time (move the sensor closer), or accept that physics caps how fast you can go.\n\nAnd diagnose loop trouble by symptom: a stubborn offset means you need integral action; oscillation when you raise the gain usually means dead time is biting and you must detune.",
    },
    {
      id: "pc-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "One picture to carry away",
      markdown:
        "Most of a chemical plant is a collection of lazy first-order creatures, each with a time constant τ that says *how fast* and a gain K that says *how far*. For a well-mixed tank that time constant is simply residence time, V/Q. Layer on dead time — the cruel delay where nothing happens yet — and you have the whole drama of process control: feedback that must hold a slow, delayed process on target without acting so aggressively on stale information that it shakes itself apart. PI control, tuned with respect for τ and dead time, is how the plant stays on setpoint day after day.",
    },
  ],
  keyTakeaways: [
    "A first-order system responds to a step with a smooth exponential approach — no overshoot — and its entire pace is set by a single number, the time constant τ.",
    "The 63% rule: after one time constant a first-order process has covered 63.2% of the change; the 5τ rule: after about five time constants it is within ~0.7% and considered settled.",
    "For a well-mixed (CSTR-style) tank, the time constant equals the residence time τ = V/Q — large volume or low flow gives a sluggish process, small volume or high flow gives a snappy one.",
    "Three numbers describe a process: gain K (how far the output moves), time constant τ (how fast it responds), and dead time θ (the pure delay before any response begins).",
    "Dead time is the killer of good control because the controller acts on stale measurements; high gains then cause overcorrection and oscillation, forcing you to detune or use schemes like a Smith predictor.",
    "A feedback loop is sensor → controller → valve → process: the controller forms error e = setpoint − measurement and drives a final control element to hold the process variable at setpoint.",
    "P leaves a steady-state offset, PI (the process-industry workhorse) adds integral action to drive that offset to zero, and PID adds derivative for damping on slow loops — used sparingly because it amplifies measurement noise.",
  ],
};
