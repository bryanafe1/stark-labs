import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_flightstab",
  slug: "flight-dynamics-and-stability",
  title: "Flight Dynamics & Stability: Why Planes Want to Fly Straight (and Fighters Don't)",
  summary:
    "Toss a paper dart and it flies true; toss a crumpled ball and it tumbles. The difference is one idea — stability — and it's the same idea that decides whether an airliner shrugs off a gust or a fighter jet flips into a knife-edge turn before you blink. This lesson turns \"the plane feels solid\" into hard engineering: static vs dynamic stability, the tug-of-war between your center of gravity and the wing-tail combo's neutral point, the one number (static margin) that grades it, and why modern fighters are deliberately built to be *unstable*. One playground, two predictions, and a worked example that lands the plane.",
  discipline: "AEROSPACE",
  difficulty: "HARD",
  estMinutes: 24,
  tags: ["flight-dynamics", "stability", "static-margin"],
  objectives: [
    "Tell static stability and dynamic stability apart, and explain why an aircraft can have one without the other.",
    "Explain the roles of the center of gravity (CG) and the neutral point (NP), and why CG ahead of NP is the recipe for pitch stability.",
    "Compute static margin SM = (x_np − x_cg)/c and read off whether a configuration is stable, neutral, or unstable.",
    "Distinguish the three axes of stability — longitudinal (pitch), lateral (roll), and directional (yaw) — and name the control surface that commands each.",
    "Argue the central trade-off between stability and maneuverability, and explain why relaxed-stability fighters need fly-by-wire.",
  ],
  prerequisites: [
    "Free-body diagrams, moments, and torque balance",
    "Basic aerodynamics (lift, angle of attack)",
    "Algebra and unit analysis (SI units)",
  ],
  interviewAngle:
    "Stability is a favorite interview probe because it's deceptively simple to state and brutal to fake. One sketch of CG-versus-neutral-point reveals in under a minute whether you actually understand restoring moments or just memorized \"CG forward equals stable.\" Expect to define static versus dynamic stability cleanly, place the CG relative to the neutral point, compute a static margin from a couple of numbers, and then defend the spicy claim that fighter jets are intentionally unstable. Strong candidates move fluidly between the moment balance, the physical picture of a disturbance, and the design consequence — and they always state which axis they're talking about.",
  blocks: [
    {
      id: "b_hook",
      kind: "PROSE",
      title: "The paper airplane test ✈️",
      markdown:
        "Grab two pieces of paper. Fold one into a sleek dart; crumple the other into a ball. Throw both. The dart slices forward, nose steady, self-correcting through little wobbles. The ball tumbles end over end and face-plants. Same paper, same arm — wildly different *stability*.\n\nHere's the thing you felt without naming it: the dart, when bumped off course, **fights to return** to flying straight. The ball, when bumped, just keeps tumbling. That fight-to-return instinct is the entire subject of this lesson, and it's worth real money — it's the difference between an airliner that rides out turbulence hands-off and one that needs a computer wrestling the controls a hundred times a second to stay airborne.\n\nWe'll answer four questions that interviewers love to chain together:\n\n- When a plane gets nudged, does it come *back* (static stability) — and does it come back *nicely* or oscillate forever (dynamic stability)?\n- What physical thing decides that? (Spoiler: a tug-of-war between two points along the fuselage.)\n- How do we put a single number on it? (The **static margin**.)\n- And the curveball: why would anyone *design a plane to be unstable on purpose*?\n\nLet's make the dart's instinct into physics.",
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "6y40LL6i9BI",
      title: "Watch: Neutral Point & Static Margin",
    },
    {
      id: "b_static_dynamic_prose",
      kind: "PROSE",
      title: "Two flavors of stable: static vs dynamic",
      markdown:
        "\"Stable\" isn't one thing — it's two, and confusing them is a classic interview stumble. Picture a marble.\n\n- **Static stability** answers: *the instant after a disturbance, which way does it want to go?* Put a marble in a bowl, poke it, and it immediately tries to roll back to the bottom — that's **statically stable** (a restoring force points it home). Put a marble on top of an upside-down bowl and a poke sends it rolling *away* — **statically unstable**. Set it on a flat table and it just sits wherever you left it — **neutrally stable**. Static stability is only about the *initial tendency*: does the system generate a restoring moment, yes or no?\n- **Dynamic stability** answers the follow-up: *over time, does the motion actually settle down?* A statically stable system can still misbehave dynamically. Imagine the marble in the bowl with no friction — it rolls back toward the bottom (good, statically stable) but overshoots, climbs the far side, rolls back, overshoots again... oscillating forever. That's statically stable but **dynamically neutral**. Add friction (damping) and the oscillations shrink each cycle until it stops — now it's **dynamically stable**.\n\nThe crucial logic an interviewer wants: **static stability is necessary but not sufficient for dynamic stability.** You can't damp your way back to a point you're not even being pulled toward — so no static stability means no hope of dynamic stability. But having a restoring tendency doesn't guarantee the oscillations die out; that needs damping too. Real aircraft have named oscillation modes (the slow *phugoid* trade of speed and altitude, the quick *short-period* pitch bobble, the *Dutch roll* yaw-roll waltz), and aircraft designers tune damping so each one settles instead of growing.",
    },
    {
      id: "b_predict_marble",
      kind: "PREDICT",
      question:
        "A frictionless marble sits at the bottom of a smooth bowl. You poke it sideways. What does it do, and how would you classify it?",
      options: [
        { id: "p1", label: "Rolls back and stops immediately — statically AND dynamically stable" },
        { id: "p2", label: "Oscillates back and forth forever — statically stable but dynamically neutral" },
        { id: "p3", label: "Rolls away and never returns — statically unstable" },
        { id: "p4", label: "Stays exactly where you poked it — neutrally stable" },
      ],
      answerId: "p2",
      reveal:
        "**Oscillates forever — statically stable, dynamically neutral.** The bowl shape provides a restoring force (the marble is always pulled back toward the bottom), so it's *statically* stable. But with zero friction there's nothing to bleed off the energy, so it overshoots and swings back and forth indefinitely — the oscillation neither grows nor dies, which is *dynamic* neutrality. This is the exact distinction that trips people up: a restoring tendency (static) and the damping that makes motion actually settle (dynamic) are two separate properties. Add friction and you'd finally get a marble that returns *and* stops — fully dynamically stable.",
    },
    {
      id: "b_cg_np_prose",
      kind: "PROSE",
      title: "The tug-of-war: center of gravity vs neutral point",
      markdown:
        "For pitch — the plane nodding its nose up and down, the *longitudinal* axis — static stability comes down to two special points along the fuselage and which one sits in front.\n\n- The **center of gravity (CG)** is where the aircraft's weight effectively acts — its balance point. The plane rotates *about* its CG.\n- The **neutral point (NP)** is the trickier one: it's the effective point where the *change* in total aerodynamic lift acts when the angle of attack changes. Think of it as the CG location at which the aircraft would be exactly neutrally stable — the break-even point. It depends on the whole airframe, but the horizontal tail drags it well aft (a bigger or farther-back tail pushes the NP rearward), which is exactly why tails exist.\n\nNow the punchline, and it's pure torque. Suppose a gust pitches the nose **up**, increasing the angle of attack. Extra lift appears, and the *extra* lift acts at the neutral point.\n\n- **If the CG is ahead of the NP:** that extra lift is *behind* the pivot (the CG), so it creates a **nose-down** moment — it pushes the nose back down, undoing the disturbance. Restoring moment! **Statically stable.** This is the dart.\n- **If the CG is behind the NP:** the extra lift is now *in front of* the pivot, so it pitches the nose **even further up** — the disturbance amplifies. **Statically unstable.** This is the crumpled ball.\n- **If CG sits exactly on the NP:** no restoring moment either way. **Neutral.**\n\nThat's the whole secret: **CG ahead of the neutral point = pitch-stable.** Everything else in static longitudinal stability is bookkeeping on *how far* ahead.",
    },
    {
      id: "b_callout_cg_load",
      kind: "CALLOUT",
      variant: "tip",
      title: "Why loading matters 💡",
      markdown:
        "The neutral point is basically fixed by the airframe's shape, but the **CG moves** every flight — where you stash cargo, how full the tanks are, where passengers sit. Load an aircraft too far aft and you can slide the CG *behind* the NP, turning a stable plane unstable and squirrelly. Too far forward and it gets sluggish and nose-heavy, sometimes unable to flare for landing. That's why every aircraft has a published CG envelope and why a weight-and-balance check isn't bureaucratic box-ticking — it's keeping the CG on the stable side of the neutral point.",
    },
    {
      id: "b_sm_formula",
      kind: "FORMULA",
      title: "Static margin",
      display: "SM = (x_np − x_cg) / c × 100%",
      latex: "SM = \\dfrac{x_{np} - x_{cg}}{c} \\times 100\\%",
      variables: [
        { symbol: "SM", name: "Static margin (% of MAC)", unit: "%" },
        { symbol: "x_np", name: "Neutral point location (aft of a reference)", unit: "m" },
        { symbol: "x_cg", name: "Center of gravity location (aft of same reference)", unit: "m" },
        { symbol: "c", name: "Mean aerodynamic chord (MAC)", unit: "m" },
      ],
      note:
        "Both positions are measured aft from the same reference (often the wing leading edge), and the gap is normalized by the mean aerodynamic chord so the number is dimensionless (expressed as a percent of MAC). SM > 0 means the CG is ahead of the NP → statically stable. SM = 0 is neutral. SM < 0 means CG behind NP → unstable. Bigger positive SM = stiffer, more reluctant to maneuver; typical stable GA aircraft sit around 5–15% MAC.",
    },
    {
      id: "b_predict_sm",
      kind: "PREDICT",
      question:
        "You're loading an aircraft and the cargo shifts the CG aft until it lands exactly on the neutral point (x_cg = x_np). What is the static margin, and what does the plane do when a gust pitches the nose up?",
      options: [
        { id: "p1", label: "SM is large and positive — strongly self-corrects back to level" },
        { id: "p2", label: "SM = 0 — neutrally stable; no restoring moment, it holds the new attitude" },
        { id: "p3", label: "SM is negative — it pitches up even harder and diverges" },
        { id: "p4", label: "SM is undefined — you can't fly at all" },
      ],
      answerId: "p2",
      reveal:
        "**SM = 0 — neutrally stable.** Plug in: SM = (x_np − x_cg)/c × 100 = (x_np − x_np)/c × 100 = **0%**. With the CG sitting right on the neutral point, the extra lift from the gust acts *at the pivot*, producing no restoring or diverging moment — the aircraft simply holds whatever new attitude the gust handed it, like a marble on a flat table. One more cargo box farther aft and SM goes *negative*: now the CG is behind the NP, the gust's extra lift pitches the nose up even more, and you've built yourself an unstable airplane. This is exactly why aft CG limits exist.",
    },
    {
      id: "b_sandbox_sm",
      kind: "SANDBOX",
      title: "Playground — find your static margin 🎛️",
      description:
        "Slide the neutral point and the CG and watch the static margin swing from comfortably positive (stable, like a dart) through zero (neutral) to negative (unstable, like a crumpled ball). Try dragging the CG aft past the neutral point and watch SM go negative — that's the moment a docile trainer becomes a fly-by-wire-only fighter. Leave everything at the defaults and you'll read 10.0% MAC — a healthy, stable airplane.",
      variables: [
        { key: "xnp", label: "Neutral point x_np", unit: "m", min: 0, max: 2, step: 0.01, default: 0.4 },
        { key: "xcg", label: "CG location x_cg", unit: "m", min: 0, max: 2, step: 0.01, default: 0.3 },
        { key: "c", label: "Mean aero chord c", unit: "m", min: 0.5, max: 5, step: 0.1, default: 1 },
      ],
      expression: "(xnp - xcg) / c * 100",
      outputLabel: "Static margin",
      outputUnit: "% MAC",
      precision: 1,
    },
    {
      id: "b_three_axes_prose",
      kind: "PROSE",
      title: "Three axes, three control surfaces",
      markdown:
        "Pitch is only one third of the story. An aircraft can rotate about three axes, and each gets its own stability question and its own control surface.\n\n- **Longitudinal stability (pitch — nose up/down about the lateral axis).** This is the CG-vs-NP game above. The **horizontal tail** provides the restoring moment, and the pilot commands pitch with the **elevator** (the hinged trailing part of the horizontal tail). Pull back, elevator deflects up, tail gets pushed down, nose pitches up.\n- **Directional stability (yaw — nose left/right about the vertical axis).** Like a weathervane: the **vertical tail (fin)** way back behind the CG catches any sideslip and swings the nose back into the wind. The pilot commands yaw with the **rudder** on that fin. A plane with strong directional stability points into the relative wind like an arrow's fletching.\n- **Lateral stability (roll — wings tipping about the longitudinal axis).** This one's subtler. Roll stability comes largely from **dihedral** (wings angled up in a shallow V): if a gust drops one wing, that lower wing meets the airflow at a slightly higher effective angle and makes more lift, rolling the plane back level. The pilot commands roll with the **ailerons** (opposite-moving surfaces near each wingtip — one up, one down).\n\nA tidy mnemonic: **e**levator–pitch, **a**ileron–roll, **r**udder–yaw. Roll and yaw are also *coupled* — banking the wings makes the plane turn and yaw, which is why coordinated turns use aileron and rudder together, and why the **Dutch roll** mode (a yaw-roll oscillation) is a thing dynamic stability engineers must tame.",
    },
    {
      id: "b_check_axes",
      kind: "CHECK",
      question:
        "A small aircraft tends to swing its nose back into the relative wind whenever a gust pushes it into a sideslip. Which property is this, and which surface primarily provides it?",
      choices: [
        { id: "c1", label: "Longitudinal stability, provided by the elevator" },
        { id: "c2", label: "Directional (yaw) stability, provided by the vertical tail/fin" },
        { id: "c3", label: "Lateral (roll) stability, provided by wing dihedral" },
        { id: "c4", label: "Dynamic stability, provided by the ailerons" },
      ],
      answerId: "c2",
      explanation:
        "Swinging the nose back into the relative wind after a sideslip is **directional (yaw) stability** — the weathervane effect. It comes mainly from the **vertical tail (fin)** mounted well aft of the CG: a sideslip creates a sideways force on that fin, and because the fin is behind the CG, that force yaws the nose back into alignment. The rudder is the *control* surface on the fin, but the *stability* comes from the fin's area and its long moment arm behind the CG. Dihedral handles roll; the elevator/tail handles pitch.",
    },
    {
      id: "b_tradeoff_prose",
      kind: "PROSE",
      title: "Stable vs nimble: you can't max both",
      markdown:
        "Here's the trade-off that makes this whole subject an engineering decision instead of a checkbox. A *big* positive static margin makes a plane wonderfully stable — it shrugs off gusts, flies hands-off, forgives a clumsy pilot. But that same stiffness means it **resists being maneuvered**. Every time you want to pitch, the airframe is fighting you, trying to return to where it was. A heavily stable plane is a barge: safe, steady, sluggish.\n\nDial the static margin *down* toward zero and the plane gets light and responsive — small control inputs produce big, quick changes in attitude. Push the CG *behind* the neutral point and you get a **statically unstable** aircraft: it will diverge on its own, but it's also breathtakingly agile, because there's no restoring moment resisting the pilot's commands. The catch, of course, is that a human can't fly an unstable airframe — it diverges faster than you can react.\n\nWhich is exactly what modern fighter jets do on purpose. The F-16 and many successors are **relaxed-stability** (or outright unstable) designs: the CG is placed at or behind the neutral point to maximize agility. To keep them flyable, a **fly-by-wire** flight computer senses the divergence and makes tiny corrective control deflections dozens of times per second — flying the unstable airplane so the pilot doesn't have to. The instability that would doom a human-flown aircraft becomes a feature: instant pitch authority, tighter turns, faster pointing. Airliners go the opposite way: comfortably stable static margins so they're docile, predictable, and safe even with the autopilot off.\n\nThe one-sentence version every interviewer wants: **stability and maneuverability are opposite ends of one dial, set by where the CG sits relative to the neutral point — and fly-by-wire is what lets fighters cheat toward the unstable, ultra-agile end.**",
    },
    {
      id: "b_callout_relaxed",
      kind: "CALLOUT",
      variant: "insight",
      title: "Relaxed stability isn't a bug 💡",
      markdown:
        "It feels backwards that you'd *want* an unstable airplane, so frame it the way engineers do. A statically stable jet spends part of its tail's lift continuously pushing *down* just to hold the nose up — that's *trim drag*, and it's pure waste. Move the CG aft toward (or past) the neutral point and the tail does less fighting, cutting trim drag and freeing up agility. The instability is then handled by a computer that never gets tired. So relaxed stability buys you **both** lower drag and sharper maneuvering — the price is total dependence on the flight-control system. No computer, no flight.",
    },
    {
      id: "b_worked",
      kind: "WORKED_EXAMPLE",
      title: "Is this airplane stable? Put a number on it.",
      problem:
        "A wing-tail configuration has its neutral point at x_np = 0.95 m aft of the wing leading edge and a mean aerodynamic chord c = 1.5 m. The aircraft is loaded so its center of gravity sits at x_cg = 0.80 m aft of the same leading edge. (a) Compute the static margin. (b) Is the aircraft statically stable, neutral, or unstable? (c) A passenger then moves to the rear, shifting the CG aft to x_cg = 1.10 m. Recompute the static margin and the verdict.",
      steps: [
        {
          label: "Step 1 — Set up the formula",
          markdown:
            "Static margin as a percent of MAC: `SM = (x_np − x_cg)/c × 100%`. Both positions are measured aft from the same reference (the wing leading edge), so we can subtract them directly.",
        },
        {
          label: "Step 2 — (a) Plug in the original loading",
          markdown:
            "`SM = (0.95 − 0.80)/1.5 × 100% = 0.15/1.5 × 100% = 0.10 × 100% = 10.0% MAC`. The CG is 0.15 m ahead of the neutral point, which is 10% of the chord.",
        },
        {
          label: "Step 3 — (b) Verdict for the original loading",
          markdown:
            "`SM = +10.0% > 0`, so the **CG is ahead of the neutral point → statically stable.** A nose-up gust would generate extra lift at the NP (behind the CG), producing a nose-down restoring moment. 10% MAC is a comfortable, conventional stable margin. This is also exactly the playground's default reading.",
        },
        {
          label: "Step 4 — (c) Recompute after the CG shifts aft",
          markdown:
            "Now x_cg = 1.10 m, which is *behind* the neutral point at 0.95 m. `SM = (0.95 − 1.10)/1.5 × 100% = (−0.15)/1.5 × 100% = −10.0% MAC`. Negative.",
        },
        {
          label: "Step 5 — The consequence",
          markdown:
            "`SM = −10.0% < 0`: the **CG is now behind the neutral point → statically unstable.** A nose-up gust now produces extra lift *ahead* of the CG, pitching the nose up *even more* — the disturbance diverges. One passenger walking aft flipped a docile airplane into one a human couldn't safely hand-fly. This is the entire reason aft CG limits exist, and why weight-and-balance is a pre-flight ritual.",
        },
      ],
      answer:
        "(a) SM = +10.0% MAC. (b) Statically stable — CG ahead of the neutral point. (c) After the aft CG shift, SM = −10.0% MAC → statically unstable. Same airframe, same neutral point; only the CG moved — and that's all it takes to cross from stable to unstable.",
    },
    {
      id: "b_check_sm",
      kind: "CHECK",
      question:
        "Two aircraft are identical except for loading: aircraft A has a static margin of +20% MAC, aircraft B has +4% MAC. Which statement is correct?",
      choices: [
        { id: "c1", label: "B is unstable, because 4% is too small to provide a restoring moment" },
        { id: "c2", label: "Both are statically stable, but A is stiffer/more sluggish and B is more maneuverable" },
        { id: "c3", label: "A is unstable, because too much static margin causes divergence" },
        { id: "c4", label: "They behave identically — any positive static margin gives identical handling" },
      ],
      answerId: "c2",
      explanation:
        "Both static margins are **positive**, so both aircraft have their CG ahead of the neutral point and are statically stable — the gust-induced extra lift produces a restoring nose-down moment in each case. The *size* of the margin sets the *character*: A's large +20% makes it very stiff — strongly self-correcting but reluctant to maneuver (more control force needed, sluggish response). B's small +4% makes it lighter and more responsive, trading some of that rock-solid stability for agility. More positive margin is not 'more correct' — it's a point on the stability-vs-maneuverability dial, chosen for the mission.",
    },
    {
      id: "b_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "In the interview 🎯",
      markdown:
        "The questions that recur, and the move that scores each:\n\n- **\"Difference between static and dynamic stability?\"** Static = initial *tendency* to return after a disturbance (restoring moment, yes/no). Dynamic = whether the resulting *motion settles over time* (needs damping). State the logic: static stability is necessary but not sufficient for dynamic stability.\n- **\"What makes an aircraft pitch-stable?\"** CG ahead of the neutral point. Walk the moment argument out loud: nose-up gust → extra lift at the NP → behind the CG → nose-down restoring moment. Then quantify with `SM = (x_np − x_cg)/c`.\n- **\"Name the three axes and their controls.\"** Pitch/elevator (longitudinal), roll/aileron (lateral, dihedral provides stability), yaw/rudder (directional, vertical fin provides stability). Mention Dutch roll if you want to show depth.\n- **\"Why are fighters unstable on purpose?\"** Relaxed/negative static margin → maximum agility and less trim drag, made flyable by fly-by-wire. Airliners go the other way for docility.\n\nThe winning pattern: **moment balance → physical picture of the disturbance → design consequence**, and always say *which axis* you mean.",
    },
    {
      id: "b_outro",
      kind: "PROSE",
      title: "The whole chain, in one breath",
      markdown:
        "Remember the dart and the crumpled ball? You've now got the physics behind that difference. Static stability is the *instinct* to return after a bump; dynamic stability is whether that return actually *settles* instead of oscillating forever. In pitch, that instinct comes from a tug-of-war: with the **CG ahead of the neutral point**, a gust's extra lift makes a restoring nose-down moment, and the gap between those two points — graded as **static margin `SM = (x_np − x_cg)/c`** — tells you exactly how strong the instinct is. Roll, pitch, and yaw each get their own stability source and control surface (dihedral/aileron, tail/elevator, fin/rudder). And the static margin is really a dial: crank it up for a docile airliner, or push it to zero — or *negative* — for a fighter that trades self-correction for blistering agility, leaning on fly-by-wire to fly the unflyable.\n\nNext time a plane rides smoothly through a bump, you'll know it's the neutral point quietly winning a tug-of-war with the CG. That's not luck. That's where the engineer put the balance point.",
    },
  ],
  keyTakeaways: [
    "Static stability is the initial tendency to return after a disturbance (a restoring moment); dynamic stability is whether the resulting motion actually damps out over time. Static stability is necessary but not sufficient for dynamic stability.",
    "Pitch (longitudinal) stability hinges on CG vs neutral point: CG ahead of the NP → a nose-up gust makes extra lift behind the pivot → nose-down restoring moment → stable. CG behind the NP → unstable.",
    "Static margin SM = (x_np − x_cg)/c × 100% grades it: positive = stable, zero = neutral, negative = unstable; larger positive = stiffer and more sluggish. The NP is roughly fixed by the airframe, but the CG moves with loading.",
    "Three axes, three controls: pitch/elevator (horizontal tail), roll/aileron (dihedral gives roll stability), yaw/rudder (vertical fin gives directional 'weathervane' stability).",
    "Stability and maneuverability are opposite ends of one dial set by CG-vs-NP placement: more positive static margin = steadier but less agile; near-zero or negative = nimble but harder (or impossible) to hand-fly.",
    "Fighters are deliberately relaxed-stability or unstable for maximum agility and lower trim drag, made flyable by fly-by-wire computers; airliners keep comfortably positive static margins for docile, safe handling.",
    "Loading matters: shifting the CG aft past the neutral point turns a stable aircraft unstable, which is exactly why aircraft have published CG envelopes and why weight-and-balance is a pre-flight ritual.",
  ],
};
