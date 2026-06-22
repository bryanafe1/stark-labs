import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_vibrations",
  slug: "dynamics-and-vibrations",
  title: "Dynamics and Vibrations",
  summary:
    "Pluck a guitar string, bounce on a diving board, watch a bridge twist itself to pieces in a gentle breeze — they're all the same physics. In one lesson you'll go from \"things wiggle\" to predicting exactly how fast a spring-mass oscillates, why damping decides whether it rings or just flops back, and the single terrifying reason engineers lose sleep over a number called the natural frequency.",
  discipline: "MECHANICAL",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: [
    "vibrations",
    "natural-frequency",
    "resonance",
    "damping",
    "harmonic-motion",
    "dynamics",
    "interview-favorite",
  ],
  objectives: [
    "Look at any spring-mass system and instantly estimate how fast it wants to oscillate — its natural frequency — without solving a single differential equation.",
    "Explain why heavier means slower and stiffer means faster, and prove it from ωn = √(k/m).",
    "Read the damping ratio ζ and call whether a system will ring, return cleanly, or sulk back to rest — under-, critically-, or over-damped.",
    "Describe resonance well enough to explain why a tiny periodic push can shake a structure apart, and name the cautionary tales (hello, Tacoma Narrows).",
    "Tell free vibration from forced vibration and know which one the natural frequency actually governs.",
    "Compute ωn, fn, and the period T for a real spring-mass system on demand — the warm-up question in half of dynamics interviews.",
  ],
  prerequisites: [
    "Newton's second law and free-body diagrams",
    "Hooke's law for springs (F = -kx)",
    "Single-variable calculus and basic trig (sine/cosine motion)",
  ],
  interviewAngle:
    "Vibrations is a favorite opener in mechanical, automotive, and aerospace interviews because it instantly reveals whether you think in systems or just plug numbers. Interviewers almost always start with the spring-mass: \"What's the natural frequency?\" The strong candidate fires back ωn = √(k/m) and immediately reasons out loud — heavier mass lowers it, stiffer spring raises it, and it does NOT depend on amplitude or gravity. Then they probe damping: \"What's the damping ratio do?\" You should map ζ < 1 (underdamped, it rings), ζ = 1 (critically damped, fastest return without overshoot — what car suspensions and door closers aim for), and ζ > 1 (overdamped, sluggish). The money question is resonance: \"Why do engineers care about the natural frequency at all?\" Because if a forcing frequency lands on ωn, response amplitude blows up — that's how soldiers break bridges by marching, how washing machines walk across the floor, and how Tacoma Narrows tore itself apart. Bonus points for distinguishing free vs. forced vibration and for noting that damping is what keeps resonance finite in the real world.",
  blocks: [
    {
      id: "b_intro",
      kind: "PROSE",
      title: "Everything wiggles 🎸",
      markdown:
        "Pull a mass hanging on a spring down and let go. It doesn't just snap back and stop — it overshoots, swings past, comes back, overshoots again. Up, down, up, down, settling a little each cycle until it finally rests. You've seen this a thousand times. Now here's the unsettling part: *the same equation* describes a guitar string, a tuning fork, a car bouncing on its suspension, a skyscraper swaying in wind, and a bridge deck flexing in a breeze. Master one little spring-and-mass and you've quietly understood half the moving world.\n\nThe heart of it is a tug-of-war between two characters:\n\n- **Stiffness** (the spring, `k`) is the restoring force. Pull the mass away from rest and the spring yanks it back, *harder* the farther it's pulled: `F = -kx`. Stiffness is impatient — it wants everything back at zero, now.\n- **Inertia** (the mass, `m`) is the overshoot. The mass has momentum, so when it reaches the middle it doesn't stop — it sails right through to the other side. Inertia is the reason oscillation happens at all instead of a boring slide back to rest.\n\nThat eternal argument — spring pulling back, mass refusing to stop — *is* vibration. And the rate at which they argue, set entirely by `k` and `m`, is the system's **natural frequency**: the one frequency it 'wants' to vibrate at when you disturb it and step away. Get a feel for that single number and resonance, damping, and most of the scary stories in this lesson fall right into place."
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "EgwjI0azNn0",
      title: "Watch: Natural Frequency & Damping",
      channel: "Mechanical Engineering Explained",
      caption:
        "A clean walk-through of exactly the picture we're chasing — how a spring-mass settles into oscillation and how damping decides whether it rings or returns quietly. Watch it now; every formula below will land harder once you've seen the mass bounce."
    },
    {
      id: "b_eom",
      kind: "PROSE",
      title: "The one equation behind it all",
      markdown:
        "Let's make it rigorous — and it's shorter than you'd fear. Take a mass `m` on a spring `k`, sliding with no friction, displacement `x` measured from rest. Only one force acts: the spring, pulling back, `F = -kx`. Newton's second law says `F = m·a = m·x''`. Set them equal:\n\n```\nm·x'' = -k·x   →   m·x'' + k·x = 0\n```\n\nThat's the **equation of motion** for free, undamped vibration. It's asking a beautifully simple question: *what function comes back as its own negative second derivative?* Sine and cosine. So the solution is\n\n```\nx(t) = A·cos(ωn·t) + B·sin(ωn·t)\n```\n\nwhere the constants `A` and `B` are set by how you started it (initial position and velocity), and the magic number out front is\n\n```\nωn = √(k/m)\n```\n\nthe **natural angular frequency**, in radians per second. Plug `x = cos(ωn·t)` back in and you'll see `m·(-ωn²) + k = 0`, which forces exactly `ωn² = k/m`. Notice what's *not* in there: no `A`, no `B`, no amplitude, no gravity. The natural frequency depends only on stiffness and mass. Pluck the string hard or soft — it sings the same note. That amplitude-independence is the deep, slightly magical fact at the center of this whole topic."
    },
    {
      id: "b_formula_omega",
      kind: "FORMULA",
      title: "Natural frequency of a spring-mass system",
      display: "ωn = √(k / m)",
      latex: "\\omega_n = \\sqrt{\\dfrac{k}{m}}",
      variables: [
        { symbol: "ωn", name: "Natural angular frequency", unit: "rad/s" },
        { symbol: "k", name: "Spring stiffness (restoring force per unit displacement)", unit: "N/m" },
        { symbol: "m", name: "Mass of the oscillating body", unit: "kg" }
      ],
      note:
        "Two cousins fall right out: the cyclic frequency fn = ωn/(2π) in hertz (oscillations per second), and the period T = 1/fn = 2π·√(m/k) in seconds (time for one full cycle). Stiffer → faster (ωn up). Heavier → slower (ωn down). Amplitude does not appear — at all."
    },
    {
      id: "b_predict_mass",
      kind: "PREDICT",
      question:
        "You've got a mass bouncing on a spring at some natural frequency. You swap in a mass that's FOUR times heavier, same spring. What happens to the natural frequency?",
      options: [
        { id: "a", label: "It drops to 1/4 — four times heavier, four times slower" },
        { id: "b", label: "It drops to 1/2 — it halves" },
        { id: "c", label: "It doesn't change — frequency is set by the spring alone" },
        { id: "d", label: "It goes up by 2× — more mass stores more energy" }
      ],
      answerId: "b",
      reveal:
        "It halves. The mass is under a **square root**: `ωn = √(k/m)`, so quadrupling `m` divides ωn by `√4 = 2`.\n\nThis is why the bass strings on a guitar are the *thick, heavy* ones — more mass per length, lower frequency, deeper note. It's why a loaded truck rides at a slower, lumbering bounce than an empty one. And it's why you can't just \"add weight\" to fix a vibration problem cheaply: to halve a frequency you have to *quadruple* the mass. The square root makes mass an expensive lever. Stiffness, as we'll see, is the same — it works through `√k`."
    },
    {
      id: "b_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the spring-mass period machine 🎛️",
      description:
        "Stop reading, start dragging. Crank the mass m and the stiffness k, and watch the period T — the time for one full bounce — respond. Push m up and the bounce slows down (more inertia to drag around). Push k up and it speeds up (a stiffer spring snaps back harder). The defaults (m = 4 kg, k = 400 N/m) land on T ≈ 0.628 s — which is exactly 2π·√(4/400) = 2π·(0.1). Try to make the period twice as long: you'll find you need 4× the mass, not 2×. That square root again.",
      variables: [
        { key: "m", label: "Mass m", unit: "kg", min: 0.5, max: 20, step: 0.5, default: 4 },
        { key: "k", label: "Stiffness k", unit: "N/m", min: 50, max: 5000, step: 50, default: 400 }
      ],
      expression: "2 * pi * sqrt(m / k)",
      outputLabel: "Period T",
      outputUnit: "s",
      precision: 3
    },
    {
      id: "b_damping",
      kind: "PROSE",
      title: "Damping: the wiggle's off-switch 🔧",
      markdown:
        "The pure spring-mass would oscillate *forever* — no friction, no air, no losses, ringing for all eternity. Real systems don't. They lose energy every cycle and eventually go quiet. The thing draining that energy is **damping**, and we model it as a force proportional to *velocity* (think of a piston pushing through oil — a dashpot): `F_damp = -c·x'`. Add it to the equation of motion and you get the full free-vibration model:\n\n```\nm·x'' + c·x' + k·x = 0\n```\n\nThat lone constant `c` (the damping coefficient) controls the *entire character* of how the system settles. But raw `c` is hard to reason about, so engineers package it into a clean, dimensionless number: the **damping ratio**\n\n```\nζ = c / (2·√(k·m))\n```\n\nThe denominator `2√(km)` is the *critical* amount of damping — the exact knife's-edge value. So ζ tells you, at a glance, where you sit relative to that edge:\n\n- **ζ < 1 — underdamped.** The system *rings*: it oscillates, but the amplitude decays a bit each cycle, fading out like a struck bell. Almost everything that visibly 'vibrates' lives here.\n- **ζ = 1 — critically damped.** The sweet spot: it returns to rest *as fast as possible without overshooting*. No ringing, no wasted time. This is the target for car suspensions, door closers, and measurement instruments that need to settle right now.\n- **ζ > 1 — overdamped.** So much damping the system crawls back to rest slowly, never overshooting — like a screen door with a too-stiff hydraulic closer that takes forever to shut. Stable, but sluggish.\n\nA damped system that *does* oscillate doesn't quite ring at ωn — it rings a touch slower, at the **damped natural frequency** `ωd = ωn·√(1 − ζ²)`. For light damping (ζ around 0.05, typical of metal structures) that correction is tiny, which is why engineers happily use ωn for most estimates. But it's why a heavily-damped thing sags back a little lazier than its undamped twin."
    },
    {
      id: "b_formula_zeta",
      kind: "FORMULA",
      title: "Damping ratio and damped frequency",
      display: "ζ = c / (2·√(k·m)),   ωd = ωn·√(1 − ζ²)",
      latex: "\\zeta = \\dfrac{c}{2\\sqrt{k\\,m}}, \\quad \\omega_d = \\omega_n\\sqrt{1 - \\zeta^{2}}",
      variables: [
        { symbol: "ζ", name: "Damping ratio (dimensionless): ζ<1 underdamped, ζ=1 critical, ζ>1 overdamped", unit: "—" },
        { symbol: "c", name: "Viscous damping coefficient (damping force per unit velocity)", unit: "N·s/m" },
        { symbol: "k", name: "Spring stiffness", unit: "N/m" },
        { symbol: "m", name: "Mass", unit: "kg" },
        { symbol: "ωd", name: "Damped natural angular frequency (the rate it actually rings at)", unit: "rad/s" },
        { symbol: "ωn", name: "Undamped natural angular frequency, √(k/m)", unit: "rad/s" }
      ],
      note:
        "Critical damping is c_crit = 2√(km), so ζ is literally 'how much damping you have, as a fraction of critical.' Note ωd < ωn always (for ζ<1): damping slows the ringing slightly. At ζ ≥ 1 the system stops oscillating entirely — ωd is no longer real."
    },
    {
      id: "b_check_damping",
      kind: "CHECK",
      question:
        "A car's shock absorbers wear out and provide far less damping — the car now bounces several times after every bump before settling. In vibration terms, what has happened, and what would the fix restore?",
      choices: [
        { id: "c1", label: "ζ has increased above 1 (overdamped); the fix lowers it back toward 1" },
        { id: "c2", label: "ζ has dropped well below 1 (underdamped/bouncy); the fix raises it back toward critical (ζ ≈ 1)" },
        { id: "c3", label: "The natural frequency ωn has changed; new shocks change k" },
        { id: "c4", label: "Nothing changed about ζ; the springs got softer" }
      ],
      answerId: "c2",
      explanation:
        "Worn shocks supply less damping force, dropping `c` and therefore `ζ = c/(2√(km))` well below 1 — the system is now underdamped and rings (bounces) several times. Fresh shocks restore `c`, pushing ζ back up toward critical damping (ζ ≈ 1) so the car returns to level after one smooth motion with no bouncing. The springs (k) and mass (m) didn't change, so ωn is essentially the same — it's the damping that the shocks control. This is exactly why suspensions aim for near-critical damping: settle fast, don't ring."
    },
    {
      id: "b_callout_critical",
      kind: "CALLOUT",
      variant: "tip",
      title: "The 5-second damping read",
      markdown:
        "Whenever someone hands you a system and asks 'how does it settle?', reach straight for `ζ = c/(2√(km))`. Below 1, it rings and decays (a bell, a bouncy car, a plucked string). Exactly 1, it returns fastest with no overshoot (the design target for suspensions, door closers, scales). Above 1, it oozes back slowly. You don't need to solve the differential equation — ζ alone tells you the whole story of the motion's *shape*."
    },
    {
      id: "b_resonance",
      kind: "PROSE",
      title: "Resonance: the reason engineers lose sleep 😱",
      markdown:
        "So far we've *disturbed* the system once and watched it ring down — that's **free vibration**. Now do something different: keep pushing it, over and over, at a steady rhythm. That's **forced vibration**, with an external driving force `F(t) = F₀·cos(ω·t)` at some forcing frequency `ω`. And here's where it gets dangerous.\n\nIf you push at a frequency *far* from the natural frequency, not much happens — the system shrugs, responding with a small, polite wiggle. But push at a frequency *near ωn*, and each shove arrives at exactly the right moment to add energy to the motion, like timing your pushes on a playground swing. Energy piles up cycle after cycle and the amplitude **grows enormously**. That runaway is **resonance**.\n\nWith no damping, theory says the amplitude at `ω = ωn` goes to *infinity*. In the real world, damping caps it — but the peak can still be ten, fifty, a hundred times the static response. That's plenty to destroy things:\n\n- **Soldiers break step crossing bridges** because a synchronized march can hit a bridge's natural frequency and pump it into resonance.\n- A **washing machine 'walks' across the floor** when the spin cycle ramps through the drum's natural frequency.\n- An opera singer can **shatter a wine glass** by holding a note at the glass's natural frequency.\n- The **Tacoma Narrows Bridge** (1940) famously tore itself apart in a moderate wind — wind-driven oscillation fed energy into a torsional mode until the deck twisted itself to pieces. (The full story involves aeroelastic flutter, but the lesson is the same: don't let a structure get energized near a mode it can't damp.)\n\nThe engineer's job is therefore brutally simple to state: **keep the natural frequencies away from the frequencies the system will actually be driven at.** You do that by tuning `k` and `m` (to move ωn), and by adding damping (to cap whatever resonance you can't avoid). Damping is your insurance policy — it's why every real resonance peak is finite instead of fatal."
    },
    {
      id: "b_predict_resonance",
      kind: "PREDICT",
      question:
        "A motor mounted on a flexible frame vibrates violently — its running speed happens to match the frame's natural frequency (resonance). Your budget allows ONE change. Which is most likely to make things worse instead of better?",
      options: [
        { id: "a", label: "Add damping (e.g., rubber isolation mounts) to cap the peak" },
        { id: "b", label: "Stiffen the frame to push its natural frequency well above the motor speed" },
        { id: "c", label: "Run the motor at a speed far from the frame's natural frequency" },
        { id: "d", label: "Slowly ramp the motor speed UP through resonance and just leave it parked closer to ωn" }
      ],
      answerId: "d",
      reveal:
        "Parking *closer* to ωn is exactly backwards — you'd be sitting nearer the resonance peak, getting the worst response, not escaping it.\n\nThe other three are all legitimate fixes, and they map perfectly onto the three levers from the lesson:\n\n- **Add damping (a)** raises ζ and caps the resonance peak — your insurance policy.\n- **Stiffen the frame (b)** raises ωn = √(k/m) so the running speed no longer matches it — moving the target.\n- **Change the run speed (c)** moves the *forcing* frequency away from ωn — same goal, other side.\n\nThe whole game of vibration control is separating forcing frequency from natural frequency, and damping whatever overlap you can't dodge. Anything that nudges them *together* — like option (d) — is how you turn a nuisance into a failure."
    },
    {
      id: "b_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: characterizing a sensor mount 🔧",
      problem:
        "You're mounting a sensitive instrument (mass m = 4 kg) on an isolation spring of stiffness k = 400 N/m. (a) Find the natural angular frequency ωn. (b) Find the cyclic natural frequency fn in Hz. (c) Find the period T. (d) The mount is fitted with a damper giving ζ = 0.10 — find the damped natural frequency ωd and say what kind of response to expect. (e) The instrument deck nearby runs machinery at 1.6 Hz. Is the mount in danger of resonance?",
      steps: [
        {
          label: "(a) Natural angular frequency",
          markdown:
            "Straight from `ωn = √(k/m)`:\n\n```\nωn = √(400 / 4) = √100 = 10 rad/s\n```"
        },
        {
          label: "(b) Cyclic frequency",
          markdown:
            "Convert rad/s to oscillations per second by dividing by 2π:\n\n```\nfn = ωn / (2π) = 10 / 6.2832 ≈ 1.59 Hz\n```\n\nSo the mount naturally wants to bob about 1.59 times per second."
        },
        {
          label: "(c) Period",
          markdown:
            "The period is just the reciprocal of fn (or 2π/ωn):\n\n```\nT = 1/fn = 1/1.59 ≈ 0.628 s\n```\n\nOne full up-and-down cycle takes about 0.63 seconds — exactly the number the sandbox above spits out for m = 4, k = 400. Nice consistency check."
        },
        {
          label: "(d) Damped frequency and response type",
          markdown:
            "With ζ = 0.10 (< 1) the system is **underdamped** — it will oscillate but decay over a few cycles. The ringing rate is\n\n```\nωd = ωn·√(1 − ζ²) = 10·√(1 − 0.01) = 10·√0.99 ≈ 9.95 rad/s\n```\n\nBarely below ωn — light damping shifts the frequency by only ~0.5%, which is why engineers cheerfully use ωn for estimates when ζ is small."
        },
        {
          label: "(e) Resonance check — the twist",
          markdown:
            "The machinery forces the deck at **1.6 Hz**. The mount's natural frequency is **fn ≈ 1.59 Hz**. Those are *almost identical* — the forcing frequency is sitting right on top of ωn. That's a textbook recipe for **resonance**: the instrument will get shaken far harder than the raw machinery vibration would suggest.\n\nThe fix is everything from the resonance section: retune the mount to move fn away from 1.6 Hz (stiffer spring raises it, more mass lowers it), and lean on damping to cap whatever peak remains. The lesson: *always* compare your natural frequency against the frequencies the world will drive it at. A 'great' mount tuned by accident onto the forcing frequency is worse than no isolation at all."
        }
      ],
      answer:
        "ωn = 10 rad/s; fn ≈ 1.59 Hz; T ≈ 0.628 s; with ζ = 0.10 it's underdamped with ωd ≈ 9.95 rad/s. DANGER: the 1.6 Hz forcing sits essentially on fn ≈ 1.59 Hz, so the mount is in resonance — retune k or m to separate them and add damping."
    },
    {
      id: "b_free_vs_forced",
      kind: "PROSE",
      title: "Free vs. forced: the two questions that matter",
      markdown:
        "Keep these two modes mentally separated and most vibration confusion evaporates:\n\n- **Free vibration** is what happens after a single disturbance — pluck it, hit it, drop it, then let go. The system rings at its natural frequency (ωn, or ωd if damped) and the amplitude decays away according to ζ. The frequency here is the system's *own* property; you can't change it by how hard you hit. This is the 'what note does it sing?' question.\n- **Forced vibration** is what happens under a *continuous* driving force at frequency ω. Now the system mostly responds at the *forcing* frequency, not its own — but how *big* the response is depends entirely on how close ω is to ωn. Far away: small. Near ωn: resonance, big. This is the 'how violently does it shake?' question.\n\nThe natural frequency is the bridge between them: it's the property a free system reveals, and the danger zone a forced system must avoid. That's why the very first thing any vibration analysis computes — every single time — is ωn. Find the natural frequency, and you know both what it'll ring at *and* what to keep your driving forces away from."
    },
    {
      id: "b_check_omega",
      kind: "CHECK",
      question:
        "A spring-mass system has natural frequency ωn. You want to DOUBLE its natural frequency. Which single change accomplishes this?",
      choices: [
        { id: "s1", label: "Double the stiffness k" },
        { id: "s2", label: "Quadruple the stiffness k (4×)" },
        { id: "s3", label: "Halve the mass m" },
        { id: "s4", label: "Double the mass m" }
      ],
      answerId: "s2",
      explanation:
        "ωn = √(k/m), so frequency scales with √k. To double ωn you need √k to double, which means k must go up by 2² = 4. (Equivalently, you could cut the mass to 1/4, since ωn ∝ 1/√m — halving m only gives √2 ≈ 1.41×, not 2×.) This square-root relationship is the recurring trap: changing frequency by a factor requires changing k or m by the *square* of that factor. It's why retuning a structure's natural frequency is expensive — you have to move stiffness or mass dramatically to shift ωn even modestly."
    },
    {
      id: "b_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Expect a spoken version of this whole lesson. The prompts and the answers that scream 'hire this person':\n\n- **\"What's the natural frequency of a spring-mass?\"** `ωn = √(k/m)`. Add 'it's amplitude-independent and doesn't depend on gravity — only stiffness and mass' and you're already ahead.\n- **\"Heavier mass — frequency up or down?\"** Down, by `1/√m`. Stiffer spring — up, by `√k`. Always mention the square root; it's the whole flavor of the topic.\n- **\"What does the damping ratio tell you?\"** ζ = c/(2√(km)). ζ<1 underdamped (rings), ζ=1 critical (fastest return, no overshoot — what suspensions target), ζ>1 overdamped (sluggish). Bonus: ωd = ωn√(1−ζ²), slightly below ωn.\n- **\"Why do you care about the natural frequency at all?\"** Resonance: if a forcing frequency lands on ωn, the response amplitude explodes. Name Tacoma Narrows, soldiers breaking step, a walking washing machine. The job is to separate forcing frequency from ωn and damp what you can't avoid.\n- **\"Free vs. forced vibration?\"** Free rings at ωn after one disturbance and decays; forced responds at the driving frequency, with amplitude peaking when that frequency nears ωn."
    },
    {
      id: "b_callout_warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Two traps that bite real engineers",
      markdown:
        "- **Amplitude does NOT change the natural frequency.** A pendulum or spring-mass rings at the same frequency whether you nudge it gently or yank it hard (within the small/linear range). Candidates who say 'it'll vibrate faster if I hit it harder' get quietly crossed off. Frequency is set by k and m; amplitude is set by how you started it.\n- **'It's well-built' does NOT mean 'it's safe from resonance.'** A perfectly strong structure can still be destroyed if its natural frequency happens to coincide with an operating or environmental forcing frequency. The Tacoma Narrows deck wasn't weak — it was *tuned*, by accident, to a frequency the wind could feed. Always run the natural-frequency vs. forcing-frequency comparison, and remember that nonlinearity, multiple modes, and aeroelastic effects can complicate the simple single-DOF picture."
    },
    {
      id: "b_wrap",
      kind: "PROSE",
      title: "The one path every vibration problem walks",
      markdown:
        "Every vibration question you'll ever face — homework, interview, or a real motor mount — follows the same short path. Memorize it and you'll never be lost:\n\n1. **Model it as mass + spring (+ damper).** Identify `m`, `k`, and (if it matters) `c`. Most real systems reduce to this single-degree-of-freedom picture for a first pass.\n2. **Compute the natural frequency.** `ωn = √(k/m)`, then `fn = ωn/2π` and `T = 1/fn`. This is always step one. Always.\n3. **Characterize the damping.** `ζ = c/(2√(km))`. Under-, critical, or over-damped? That's the *shape* of the response, and `ωd = ωn√(1−ζ²)` is the real ringing rate.\n4. **Check it against the forcing.** What frequencies will the world drive this at? If any sit near ωn, you have a resonance problem — retune `k` or `m` to move ωn, and add damping to cap the peak.\n\nTwo pillars hold it all up: the **natural frequency** `√(k/m)`, which says what a system *wants* to do, and the **damping ratio**, which says how it settles. Bolt them together with the idea of resonance — forcing frequency meeting natural frequency — and you can explain a guitar, a car suspension, and a collapsing bridge with the very same picture. Now go make something wiggle on purpose. 💪"
    }
  ],
  keyTakeaways: [
    "Every oscillation is a tug-of-war between stiffness (restoring) and inertia (overshoot); their argument rate is the natural frequency ωn = √(k/m) — independent of amplitude and gravity.",
    "Frequency rides on square roots: ωn ∝ √k and ∝ 1/√m, so to double a frequency you must quadruple k (or quarter m). The cyclic frequency is fn = ωn/2π and the period T = 2π·√(m/k).",
    "The damping ratio ζ = c/(2√(km)) sets the response shape: ζ<1 underdamped (rings and decays), ζ=1 critically damped (fastest return, no overshoot — the design target), ζ>1 overdamped (sluggish).",
    "Damped systems ring slightly slower than undamped ones, at ωd = ωn·√(1−ζ²); for light damping (small ζ) the shift is tiny, so ωn is a fine estimate.",
    "Resonance is the killer: drive a system near ωn and the amplitude explodes (infinite without damping). Tacoma Narrows, soldiers breaking step, and walking washing machines are all resonance.",
    "Free vibration rings at the system's own natural frequency after one disturbance; forced vibration responds at the driving frequency, with amplitude peaking when that frequency nears ωn.",
    "Vibration control = separate forcing frequency from natural frequency (tune k and m) and add damping to cap whatever resonance you can't avoid. Step one of every analysis is computing ωn."
  ]
};
