import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_pid",
  slug: "control-systems-and-pid",
  title: "PID Control: Three Knobs That Steer Almost Everything",
  summary:
    "Cruise control, the thermostat keeping your room comfy, the drone holding altitude in a gust — almost all of them lean on the same humble three-term controller. You will meet the error signal, learn why P alone always lands a little short, watch I quietly erase that leftover droop, and see D peer into the future to tame the wobble. Then you will play with a second-order system's natural frequency and walk away able to reason about overshoot, oscillation, and settling on sight.",
  discipline: "MECHATRONICS",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["control-systems", "pid", "feedback"],
  objectives: [
    "Distinguish open-loop from closed-loop control and explain why feedback is what makes a system robust to disturbances.",
    "Define the error signal e(t) = setpoint − measurement and trace how it drives every term of a PID controller.",
    "Explain what each term does: P reacts to the present error, I erases accumulated past error, D anticipates and damps future error.",
    "Reason about tuning trade-offs — overshoot, oscillation, and settling time — when you turn up Kp, Ki, or Kd.",
    "Connect a second-order response to its natural frequency ωn and damping ratio ζ, and read underdamped vs overdamped behavior.",
    "Explain why a pure-proportional controller leaves a stubborn steady-state error and how integral action kills it.",
  ],
  prerequisites: [
    "Basic differential calculus (derivatives and integrals as rates and accumulations)",
    "Comfort reading a simple block diagram or feedback loop",
    "Newton's second law and the idea of a spring-mass system",
  ],
  interviewAngle:
    "PID is the single most common controls question in mechatronics, robotics, and embedded interviews because it rewards physical intuition over transfer-function algebra. Interviewers rarely want you to grind through a Routh array; they want to hear that error drives the loop, that P is the present, I is the accumulated past, and D is the anticipated future — and that you know each knob's failure mode. Strong candidates explain why pure P leaves a steady-state offset, describe overshoot and ringing in terms of damping ratio ζ, and can talk through tuning a real loop (start with P, add I to remove droop, add a little D to calm overshoot, beware noise on D). They reach for the second-order picture — ωn sets speed, ζ sets the shape — instead of memorized formulas. Weak candidates recite \"proportional-integral-derivative\" and stall the moment you ask what actually goes wrong when Ki is too high.",
  blocks: [
    {
      id: "pid-hook",
      kind: "PROSE",
      title: "The controller hiding inside everything you use",
      markdown:
        "Set the cruise control to 70 mph and take your foot off the gas. The road tilts uphill, the car starts to sag to 67 — and then, without any drama, it eases back to 70 and holds it there. Hit a downhill and it backs off before you overshoot. Nobody is steering the throttle but the car is *correcting itself*, second by second.\n\nThat quiet self-correction is **feedback control**, and the workhorse behind it is almost embarrassingly simple: the **PID controller**. Three terms, three knobs, and somewhere north of 90% of the control loops running in industry today — your thermostat, the drone fighting a crosswind, the 3D printer hot-end, the disk drive head, the chemical reactor's temperature — lean on some flavor of it.\n\nThe entire idea fits in one sentence: *measure how wrong you are, and push back in proportion to the present mistake, the accumulated mistake, and the predicted mistake.* That is P, I, and D. Learn how those three react and you can reason about an astonishing range of machines — and you will see why \"just turn the gain up\" is the rookie move that makes everything shake.",
    },
    {
      id: "pid-video",
      kind: "VIDEO",
      youtubeId: "Ok9Nw3EWeEQ",
      title: "Watch: PID Control Explained Clearly",
      channel: "ELECTRICAL LAD",
    },
    {
      id: "pid-openloop",
      kind: "PROSE",
      title: "Open loop vs closed loop: why feedback wins",
      markdown:
        "Imagine running a shower with no temperature feedback. **Open-loop control** is like setting the hot and cold taps to a position you *memorized* last week and then stepping in with your eyes closed. If nothing changed — same water pressure, same incoming temperature — it might be fine. But the instant a neighbor flushes a toilet and the cold pressure drops, you get scalded. Open loop trusts a model of the world and never checks reality.\n\n**Closed-loop control** is what you actually do: feel the water (the *measurement*), compare it to the temperature you want (the *setpoint*), and nudge the tap based on the difference. That difference is the **error**, and acting on it is the whole game. Now a pressure change just shows up as a temperature error, and you correct it automatically. You never needed a perfect model of the plumbing — feedback handles the surprises.\n\nThe canonical loop:\n\n1. **Setpoint** `r` — what you want (70 mph, 21 °C).\n2. **Sensor** measures the actual output `y`.\n3. **Error** `e = r − y` — how wrong you are right now.\n4. **Controller** turns `e` into a command `u` (more throttle, more heat).\n5. **Plant** (the car, the room) responds, the sensor re-measures, and around we go.\n\nFeedback is what buys you *robustness*: it fights disturbances and model errors you never explicitly planned for. The controller's only job is deciding how to turn that error `e` into a command `u`. PID is one very good answer.",
    },
    {
      id: "pid-three-terms",
      kind: "PROSE",
      title: "Past, present, and future: the three terms",
      markdown:
        "Here is the trick that makes PID click: each term lives in a *different tense* of the error.\n\n- **P — the present (proportional).** Output `Kp·e`. The bigger the error right now, the harder you push. Simple and fast, like steering harder the further you have drifted from your lane. But P only ever reacts to what *is*.\n- **I — the past (integral).** Output `Ki·∫e dt`. It keeps a running tally of every bit of error you have ever had and refuses to let go. Even a tiny stubborn error, given time, accumulates into a big enough push to finally squash it. Integral is the grudge-holder that erases steady-state droop.\n- **D — the future (derivative).** Output `Kd·(de/dt)`. It watches how fast the error is changing and pushes back against rapid change, like easing off the throttle *before* you hit the target so you do not blow past it. Derivative anticipates and **damps**; it is the brakes on overshoot.\n\nStack all three and the command is:\n\n`u(t) = Kp·e(t) + Ki·∫e(t) dt + Kd·(de/dt)`.\n\nThink of it as a committee voting on the throttle: one member shouts about the current mistake, one nurses every past mistake, and one frets about where things are heading. Their weighted argument is your control signal.",
    },
    {
      id: "pid-formula-pid",
      kind: "FORMULA",
      title: "The PID control law",
      display: "u(t) = Kp·e(t) + Ki·∫₀ᵗ e(τ) dτ + Kd·(de/dt),    e(t) = r(t) − y(t)",
      variables: [
        { symbol: "u(t)", name: "Controller output (command to the plant)" },
        { symbol: "e(t)", name: "Error = setpoint − measurement" },
        { symbol: "r(t)", name: "Setpoint (reference / desired value)" },
        { symbol: "y(t)", name: "Measured output of the plant" },
        { symbol: "Kp", name: "Proportional gain (present)" },
        { symbol: "Ki", name: "Integral gain (past)" },
        { symbol: "Kd", name: "Derivative gain (future)" },
      ],
      note:
        "Same three weighted ingredients every time: react to the present error, accumulate the past, and anticipate the future. Set Ki = Kd = 0 and you have a pure-P controller; set Kd = 0 and you have the workhorse PI. Tuning is just choosing the three weights.",
    },
    {
      id: "pid-pure-p",
      kind: "PROSE",
      title: "Why pure P always lands a little short",
      markdown:
        "Here is the gotcha that trips up half of new controls engineers. Run a *proportional-only* controller and, for many real systems, it settles at the wrong place — a permanent gap called **steady-state error** (or \"droop\" / \"offset\").\n\nWhy? Because P only produces a command *when there is an error*. Picture cruise control climbing a steady hill. To hold 70 mph against gravity you need *some* constant throttle. But the P controller's command is `Kp·e` — if the error went to zero, the throttle would go to zero, and the car would slow down. The only way P can deliver the constant throttle the hill demands is to *keep a leftover error alive*. The system parks itself at exactly the offset where `Kp·e` equals the throttle needed to balance the disturbance.\n\nYou can shrink that gap by cranking `Kp` higher — but turn it up too far and the system starts to overshoot and oscillate, because a hot-tempered P controller slams the command around. So pure P forces an ugly compromise: small offset *or* calm behavior, pick one.\n\nEnter **integral action**. The I term integrates that leftover error over time. As long as *any* error persists, the integral keeps growing, keeps adding throttle, and does not stop until the error is driven to *exactly zero*. I is what lets the car hold precisely 70 on the hill. The price: integral can be sluggish and, if overdone, introduces its own overshoot and a hazard called integral windup. But for killing steady-state error, nothing beats it.",
    },
    {
      id: "pid-predict-p-offset",
      kind: "PREDICT",
      question:
        "A cruise-control system uses a proportional-only controller. You set it to 70 mph and the car climbs a long, steady hill. Where does the speed settle?",
      options: [
        { id: "a", label: "Exactly 70 mph — that's the whole point of feedback." },
        { id: "b", label: "A bit below 70 mph, and it stays there as long as the hill lasts." },
        { id: "c", label: "It keeps slowing down forever until it stalls." },
        { id: "d", label: "It oscillates above and below 70 mph and never settles." },
      ],
      answerId: "b",
      reveal:
        "**A bit below 70, and it parks there** — the classic steady-state error of pure P. The controller can only command throttle in proportion to error (`u = Kp·e`), but holding speed on a hill *requires* a nonzero throttle. So the loop settles at exactly the speed where `Kp·e` happens to equal the throttle gravity is stealing. It does not keep slowing (that nonzero error props it up) and it does not oscillate (P alone, well-tuned, is stable). Add an **integral** term and that residual error gets accumulated and squeezed to zero — the car finally holds a true 70.",
    },
    {
      id: "pid-second-order",
      kind: "PROSE",
      title: "The shape of the response: ωn and ζ",
      markdown:
        "When a controlled system gets nudged — you bump the setpoint, or a gust hits the drone — *how* it gets back to target is the story of a **second-order system**. Most real closed loops behave like a mass on a spring with a damper: a position pulled toward a target (the spring), with inertia (the mass) and friction (the damper) shaping the journey.\n\nTwo numbers describe that journey completely:\n\n- **Natural frequency ωn** — *how fast* the system wants to wiggle, set by stiffness vs inertia: `ωn = √(k/m)`. Stiffer spring or lighter mass → faster, snappier response.\n- **Damping ratio ζ (zeta)** — *the shape* of the approach, the dimensionless tug-of-war between damping and the spring-mass energy.\n\nζ is the personality dial:\n\n- **ζ = 0** (undamped): rings forever at ωn — a bell with no friction.\n- **0 < ζ < 1** (underdamped): overshoots the target, then oscillates with decaying bounces before settling. Most aggressive loops live here.\n- **ζ = 1** (critically damped): the fastest possible approach with *no* overshoot — the holy grail for many designs.\n- **ζ > 1** (overdamped): no overshoot but sluggish, creeping in like a door with a heavy closer.\n\nHere is why a controls engineer cares: **the PID gains reshape your system's effective ωn and ζ.** Cranking `Kp` is like stiffening the spring — it raises ωn (faster) but tends to *lower* ζ (more overshoot, more ringing). Adding `Kd` adds damping — it raises ζ and calms the overshoot, which is exactly the \"future-anticipating brakes\" intuition from before. Tuning PID is, at heart, steering ωn and ζ to where you want them.",
    },
    {
      id: "pid-formula-omega",
      kind: "FORMULA",
      title: "Second-order: natural frequency and damping",
      display: "ωn = √(k/m)        ζ = c / (2·√(k·m))        m·ẍ + c·ẋ + k·x = F",
      variables: [
        { symbol: "ωn", name: "Undamped natural frequency", unit: "rad/s" },
        { symbol: "ζ", name: "Damping ratio (dimensionless)" },
        { symbol: "k", name: "Stiffness (spring constant)", unit: "N/m" },
        { symbol: "m", name: "Mass", unit: "kg" },
        { symbol: "c", name: "Damping coefficient", unit: "N·s/m" },
        { symbol: "x", name: "Displacement (the controlled variable)", unit: "m" },
      ],
      note:
        "ωn sets the speed of the response; ζ sets its shape (overshoot vs sluggishness). The settling time and overshoot of nearly every well-behaved closed loop can be read off these two numbers — which is why interviewers love them.",
    },
    {
      id: "pid-sandbox-omega",
      kind: "SANDBOX",
      title: "Play: feel the natural frequency",
      description:
        "Drag stiffness k and mass m to watch the undamped natural frequency ωn = √(k/m). With the defaults (k = 400 N/m, m = 4 kg) you get ωn = √100 = 10.00 rad/s. Stiffen the spring (raise k) or lighten the mass (lower m) and the system gets faster and twitchier. Heavier mass or softer spring → lower ωn → a slower, more lumbering response.",
      variables: [
        { key: "k", label: "Stiffness k", unit: "N/m", min: 50, max: 5000, step: 50, default: 400 },
        { key: "m", label: "Mass m", unit: "kg", min: 0.5, max: 20, step: 0.5, default: 4 },
      ],
      expression: "sqrt(k / m)",
      outputLabel: "Natural frequency ωn",
      outputUnit: "rad/s",
      precision: 2,
    },
    {
      id: "pid-predict-kp",
      kind: "PREDICT",
      question:
        "Your robot arm tracks its target but settles a touch slowly. You crank Kp way up to speed it along. What's the most likely result?",
      options: [
        { id: "a", label: "It reaches the target faster and stops cleanly, no downside." },
        { id: "b", label: "It speeds up but starts overshooting and oscillating around the target." },
        { id: "c", label: "Nothing changes — Kp only affects steady-state error." },
        { id: "d", label: "It slows down, because higher gain means more damping." },
      ],
      answerId: "b",
      reveal:
        "**Faster, but now it overshoots and rings.** Turning up `Kp` is like stiffening the spring: it raises the effective natural frequency ωn (snappier) but *lowers* the damping ratio ζ, pushing the loop into underdamped territory where it blows past the target and bounces before settling. Push too far and it can go unstable entirely. The classic fix is to add a little **derivative** action: D senses the rapid approach and brakes early, raising ζ back up and calming the overshoot — speed from P, composure from D.",
    },
    {
      id: "pid-tuning",
      kind: "PROSE",
      title: "Tuning: the three-way tug of war",
      markdown:
        "Tuning a PID loop is balancing three competing wants: **speed** (get there fast), **stability** (don't oscillate or blow up), and **accuracy** (no leftover error). Each knob helps some and hurts others.\n\n| Knob | Turn it up and you get... | ...but watch out for |\n|------|---------------------------|----------------------|\n| **Kp** | faster response, smaller steady-state error | more overshoot, oscillation, eventual instability |\n| **Ki** | steady-state error driven to zero | sluggishness, more overshoot, *integral windup* |\n| **Kd** | damping — less overshoot, calmer settling | amplified sensor noise, jittery output |\n\nA sane manual recipe (one of several): start with I and D at zero and raise **Kp** until the response is brisk but just begins to overshoot. Add **Ki** to erase any steady-state offset, backing off if it gets oscillatory. Finally sprinkle in **Kd** to tame whatever overshoot remains — but keep it modest, because D differentiates the error and *differentiation amplifies noise* (a noisy sensor turns D into a buzzing mess).\n\nTwo hazards worth naming out loud:\n\n- **Integral windup:** if the actuator saturates (throttle floored, valve fully open) while error persists, the integral keeps piling up to a huge value. When the system finally catches up, that bloated integral causes a giant overshoot. Real controllers clamp or \"anti-windup\" the integrator to prevent it.\n- **Derivative kick / noise:** because D reacts to the *rate* of error, a sudden setpoint step or a noisy measurement makes it spike. Practical loops often filter D or take the derivative of the measurement instead of the error.",
    },
    {
      id: "pid-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: a thermostat, and the second-order numbers behind it",
      problem:
        "(a) Walk through how a PID thermostat regulates a room set to 21 °C when the current temperature is 18 °C. (b) Separately, a positioning stage behaves like a mass-spring system with stiffness k = 400 N/m and mass m = 4 kg. Find its undamped natural frequency ωn. (c) A damper gives it a damping coefficient c = 24 N·s/m. Find the damping ratio ζ and classify the response.",
      steps: [
        {
          label: "(a) Form the error",
          markdown:
            "The thermostat reads `y = 18 °C` and the setpoint is `r = 21 °C`, so the error is `e = r − y = 21 − 18 = 3 °C`. Positive error means \"too cold — add heat.\"",
        },
        {
          label: "(a) The three terms get to work",
          markdown:
            "**P** commands heat proportional to the present 3 °C gap — a strong initial blast. **I** starts accumulating: every second spent below 21 °C adds to the integral, guaranteeing the room is driven to *exactly* 21 and not parked a degree low. **D** watches the temperature climbing; as the room nears 21 it sees the rapid rise and eases the heat *early*, so the room glides to target instead of overshooting to a stuffy 23.",
        },
        {
          label: "(a) Closing the loop",
          markdown:
            "As `y → 21`, the error `e → 0`, P backs off, the integral stops growing (its job done), and D goes quiet. The combined command `u = Kp·e + Ki·∫e + Kd·(de/dt)` settles to whatever steady heat output exactly balances the room's heat loss — held in place by the integral term. That is closed-loop control: measure, compare, correct, repeat.",
        },
        {
          label: "(b) Natural frequency",
          markdown:
            "ωn = √(k/m) = √(400 / 4) = √100 = **10 rad/s**. (To convert to Hz: f = ωn / 2π ≈ 1.59 Hz — that is how fast it would ring if undamped.)",
        },
        {
          label: "(c) Damping ratio",
          markdown:
            "ζ = c / (2·√(k·m)) = 24 / (2·√(400 × 4)) = 24 / (2·√1600) = 24 / (2 × 40) = 24 / 80 = **0.3**.",
        },
        {
          label: "(c) Classify it",
          markdown:
            "Since 0 < ζ = 0.3 < 1, the stage is **underdamped**: it will overshoot the target and oscillate with decaying bounces at roughly ωn before settling. If we wanted no overshoot we would raise damping toward ζ = 1 (critically damped) — in a controlled loop, exactly the job of the Kd term.",
        },
      ],
      answer:
        "(a) Error e = 3 °C drives P (present blast), I (erases offset → exactly 21 °C), and D (eases off early to avoid overshoot). (b) ωn = √(400/4) = 10 rad/s. (c) ζ = 24/80 = 0.3 → underdamped, so it overshoots and rings before settling.",
    },
    {
      id: "pid-check-integral",
      kind: "CHECK",
      question:
        "A motor speed controller using only P settles at 1180 rpm when commanded to 1200 rpm — a stubborn 20 rpm short. Which change most directly drives that error to zero?",
      choices: [
        { id: "a", label: "Add derivative (Kd) action — D removes steady-state error." },
        { id: "b", label: "Add integral (Ki) action — it accumulates the leftover error until the command is enough to close it." },
        { id: "c", label: "Lower Kp so the system is gentler and more accurate." },
        { id: "d", label: "Nothing can fix it; 20 rpm offset is a hardware limit." },
      ],
      answerId: "b",
      explanation:
        "Steady-state error is integral's specialty. As long as the 20 rpm gap persists, the I term keeps accumulating and adding to the command, and it physically cannot stop growing until the error reaches *exactly* zero — at which point the integral holds the extra command steady. D (option a) responds to the *rate* of error, so once the speed is constant D contributes nothing to a static offset. Cranking Kp can *shrink* the offset but never eliminates it and risks oscillation. The offset is a controller-structure issue, not a hardware wall (d).",
    },
    {
      id: "pid-check-damping",
      kind: "CHECK",
      question:
        "A drone altitude loop responds to a setpoint step by shooting past the target and bouncing above and below it a few times before settling. What does this tell you about its damping ratio ζ, and which gain would most directly calm it?",
      choices: [
        { id: "a", label: "ζ > 1 (overdamped); lower Kd to speed it up." },
        { id: "b", label: "ζ = 1 (critically damped); it's already optimal, change nothing." },
        { id: "c", label: "0 < ζ < 1 (underdamped); add Kd (derivative) to increase damping and reduce overshoot." },
        { id: "d", label: "ζ = 0 (undamped); add more Ki to settle it." },
      ],
      answerId: "c",
      explanation:
        "Overshoot followed by decaying oscillation is the signature of an **underdamped** system, 0 < ζ < 1. The most direct fix is **derivative** action: D reacts to how fast the error is changing and pushes back against the rapid approach, effectively adding damping (raising ζ) and trimming the overshoot. Adding Ki (option d) would tend to *worsen* overshoot, not cure it, and ζ = 0 would mean undecaying oscillation, not the bouncing-then-settling described.",
    },
    {
      id: "pid-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What interviewers actually want to hear",
      markdown:
        "Almost nobody wants you to derive a transfer function on the whiteboard. They want the *story*, told fast and correctly:\n\n- **Frame it by tense.** \"P is the present error, I is the accumulated past, D is the predicted future.\" Saying this first signals you understand the mechanism, not just the acronym.\n- **Nail the pure-P offset.** Be ready to explain *why* P alone leaves steady-state error (the command vanishes as error vanishes, but the system needs a nonzero command to fight the disturbance) and that **integral action removes it**.\n- **Talk failure modes per knob.** Too much Kp → overshoot/instability. Too much Ki → sluggishness and windup. Too much Kd → noise amplification. Naming the *downside* of each term is what separates people who have tuned a real loop from people who memorized a definition.\n- **Reach for ωn and ζ.** Describe overshoot and settling in terms of damping ratio. \"It's underdamped, ζ around 0.3, so it overshoots — I'd add derivative to push ζ toward critical.\"\n- **Mention windup and noise unprompted.** Bringing up integral anti-windup and filtering the derivative is the kind of detail that makes an interviewer relax.",
    },
    {
      id: "pid-callout-tip",
      kind: "CALLOUT",
      variant: "tip",
      title: "A mental model that survives every PID problem",
      markdown:
        "When a loop misbehaves, diagnose by symptom, not by formula:\n\n- **Settles in the wrong place (steady offset)?** → not enough integral. Add/raise **Ki**.\n- **Overshoots and rings?** → too little damping. Add **Kd** (or back off **Kp**).\n- **Too slow / lazy?** → raise **Kp** (and maybe **Ki**), then re-check for new overshoot.\n- **Jittery, buzzing output?** → too much **Kd** amplifying noise; filter it or reduce it.\n- **Huge overshoot only after the actuator was maxed out?** → integral windup; clamp the integrator.\n\nMemorize the *symptom → knob* map and you can tune almost anything by feel, without ever opening a controls textbook.",
    },
    {
      id: "pid-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "One sentence to carry away",
      markdown:
        "PID is just *react to the present error, erase the accumulated past error, and brake against the predicted future error* — three weighted votes that you tune by watching ωn (how fast) and ζ (how shaky). Get those two pictures — the three tenses of error, and the speed-vs-shape of a second-order response — and you can reason about a startling fraction of every machine that holds a value steady.",
    },
  ],
  keyTakeaways: [
    "Closed-loop (feedback) control measures the output, forms the error e = setpoint − measurement, and acts on it — which is what makes it robust to disturbances an open-loop system would never notice.",
    "PID weights the error in three tenses: P reacts to the present (Kp·e), I accumulates the past (Ki·∫e dt) to erase steady-state error, and D anticipates the future (Kd·de/dt) to damp overshoot.",
    "A proportional-only controller leaves a permanent steady-state offset because its command vanishes as the error vanishes, yet the system needs a nonzero command to fight a disturbance; integral action drives that error to exactly zero.",
    "Tuning is a tug of war between speed, stability, and accuracy: raising Kp speeds things up but invites overshoot and instability, Ki kills offset but risks sluggishness and windup, Kd adds damping but amplifies noise.",
    "Most closed loops behave like a second-order system whose natural frequency ωn = √(k/m) sets how fast it responds and whose damping ratio ζ sets the shape — underdamped (ζ<1) overshoots and rings, critically damped (ζ=1) is fastest with no overshoot, overdamped (ζ>1) is sluggish.",
    "PID gains reshape effective ωn and ζ: more Kp stiffens the response (higher ωn, lower ζ), more Kd adds damping (higher ζ), so tuning is really steering those two numbers.",
    "Diagnose loops by symptom: wrong settling point → more I, overshoot/ringing → more D or less P, too slow → more P, jittery output → less D, giant overshoot after saturation → integral windup.",
  ],
};
