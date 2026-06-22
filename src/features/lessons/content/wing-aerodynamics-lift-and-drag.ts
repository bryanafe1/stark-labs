import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_wing",
  slug: "wing-aerodynamics-lift-and-drag",
  title: "Wing Aerodynamics: How Wings Cheat Gravity (and Pay For It)",
  summary:
    "Stick your hand out a car window, tilt it, and feel your arm get shoved skyward — congratulations, you just built a wing. This lesson turns that gut feeling into real physics: how lift is actually made (no, not the myth they taught you), the lift equation L = ½·ρ·V²·S·C_L, the sneaky drag that comes free with every gram of lift, and the slender-wing trade-off that decides whether you fly like a sailplane or a fighter jet. Two playgrounds to mess with along the way.",
  discipline: "AEROSPACE",
  difficulty: "HARD",
  estMinutes: 32,
  tags: [
    "aerodynamics",
    "lift",
    "drag",
    "induced-drag",
    "aspect-ratio",
    "drag-polar",
    "L/D",
    "wing-design",
    "interview-favorite",
  ],
  practiceSlug: "high-aspect-ratio-wing",
  objectives: [
    "Write L = ½·ρ·V²·S·C_L from memory and explain what each term is physically doing.",
    "Explain how lift is really made — turning air down, pressure difference, circulation — and call out the equal-transit-time myth before an interviewer can spring it on you.",
    "Tell parasitic drag and induced drag apart, and trace induced drag back to wingtip vortices and downwash.",
    "Use C_Di = C_L²/(π·e·AR) and the drag polar C_D = C_D0 + C_L²/(π·e·AR) to put real numbers on drag.",
    "Argue both sides of \"why not just make the wings really long and skinny?\"",
    "Compute L/D and explain why this one number quietly rules range, endurance, and glide.",
  ],
  prerequisites: [
    "Basic fluid statics and dynamics (Bernoulli, dynamic pressure)",
    "Free-body diagrams and force balance",
    "Algebra and unit analysis (SI units)",
  ],
  interviewAngle:
    "Wing aero is an interviewer's favorite trap because one little equation lets them find out, in about ninety seconds, whether you understand the physics or just memorized a formula. Expect to be asked how lift is really made (and to be gently baited into the equal-transit-time myth), to break drag apart from first principles, and to defend a design trade-off out loud: \"Why not just make the wings really long and skinny?\" Strong candidates glide between the equation, the flow physics, and the structural and control consequences — and they always sanity-check numbers with units.",
  blocks: [
    {
      id: "b_hook",
      kind: "PROSE",
      title: "The car-window experiment 🚗",
      markdown:
        "You've already done the experiment. Next time you're a passenger on the highway, roll the window down and stick your flat hand out into the wind. Held level, the wind just rushes past. But tilt the leading edge up a few degrees and *whomp* — your whole arm gets shoved upward, hard enough to fight you.\n\nThat shove is **lift**, and your hand is a (terrible, fleshy) wing. You also felt the other force: that backward drag trying to peel your arm off down the road. Tilt your hand more and the lift grows... until suddenly it doesn't, the airflow goes ragged, and your hand just buffets and stalls. You felt the entire lesson in three seconds.\n\nA wing has exactly one trick: it deflects air **downward**, and by Newton's third law the air shoves the wing **up**. Everything else — every equation, every curve, every design fight in this lesson — is just bookkeeping on how *efficiently* it pulls off that trick.\n\nTwo forces, both measured relative to the oncoming flow (the *relative wind*):\n\n- **Lift (L)** — perpendicular to the wind. The good stuff. Holds you up.\n- **Drag (D)** — parallel to the wind, opposing motion. The tax. Your engine pays it.\n\nHere's the cruel part, the thing that makes wing design genuinely *hard*: you cannot get lift for free. The very act of making lift conjures up its own special flavor of drag out of thin air. Understanding that link is the whole game. Let's play.",
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "E3i_XHlVCeU",
      title: "Watch: Understanding Aerodynamic Lift",
      channel: "The Efficient Engineer",
    },
    {
      id: "b_lift_really_prose",
      kind: "PROSE",
      title: "How lift is REALLY made (and the lie you were told)",
      markdown:
        "Time to bury a corpse that refuses to stay buried. You've probably heard the **equal-transit-time** story: \"the top of the wing is longer, so the air going over the top has to speed up to meet its buddy at the trailing edge, and faster air means lower pressure, so the wing gets sucked up.\"\n\nIt's a great story. It is also **wrong**, and an aerodynamicist will hear you say it the way a chef hears \"I microwaved the steak.\" There is no law of physics that forces those two air parcels to arrive at the back at the same time. They don't even try. Run the experiment and the air over the top arrives at the trailing edge *early* — it doesn't \"catch up,\" it laps the field. The premise is fiction, so the conclusion is luck.\n\nSo what's actually happening? Three views of the same truth:\n\n- **Turning the flow (lead with this one).** The wing grabs the streamlines and bends them downward — a torrent of air gets flung down behind the wing (*downwash*). Newton does the rest: throw air down, get pushed up. Lift literally *is* the rate at which the wing hands downward momentum to the air. This picture never lies to you.\n- **Pressure difference.** Where the air crowds and speeds up over the top, its static pressure drops (yes, Bernoulli — perfectly valid *here*, relating speed to pressure). Lower pressure on top, higher on the bottom, integrated over the wing — that's the lift force you'd measure. Bernoulli is fine. It was only the equal-transit *reason* for the speedup that was bogus.\n- **Circulation.** The precise math is the Kutta–Joukowski theorem: lift per unit span `L' = ρ·V·Γ`, where `Γ` (capital gamma) is the *circulation* swirling around the airfoil. The sharp trailing edge pins where the flow has to leave (the Kutta condition), which sets `Γ`, which sets the lift. Crank up angle of attack or camber and you crank up `Γ`.\n\nThese aren't competing theories — they're the same physics wearing three hats. Lead with downwash, support with pressure, flex with circulation. Drop \"Kutta condition\" in an interview and watch them sit up.",
    },
    {
      id: "b_predict_myth",
      kind: "PREDICT",
      question:
        "The classic \"equal-transit-time\" explanation of lift — air over the longer top surface speeds up to rejoin the bottom air at the trailing edge — is:",
      options: [
        { id: "p1", label: "Correct — it's the standard textbook explanation, so it must be right" },
        { id: "p2", label: "A myth — the premise is false; lead with downwash and circulation instead" },
        { id: "p3", label: "Correct, but only for thin airfoils at low speed" },
      ],
      answerId: "p2",
      reveal:
        "It's a **myth**, and a famous one. Nothing forces the top and bottom air to meet again at the trailing edge — high-speed photography shows the upper-surface air actually arrives *earlier*. The shape of the story is right (faster air over the top, lower pressure) but the *mechanism* it invents is fiction. The honest account: the wing turns air downward (Newton), the pressure field is consistent with that turning (Bernoulli), and circulation (Kutta–Joukowski) ties a precise bow on it. If you only remember one thing from this whole lesson, remember to never explain lift with \"the air has to catch up.\"",
    },
    {
      id: "b_callout_myth",
      kind: "CALLOUT",
      variant: "warning",
      title: "Career-saving warning ⚠️",
      markdown:
        "Say the words \"the air on top has to catch up with the air on the bottom\" in an aero interview and you can watch your credibility drain out in real time. The parcels don't need to meet, and they don't — the top air arrives *early*. Lead with momentum (downwash) and circulation. Bring in Bernoulli only to connect speed and pressure, **never** as a transit-time race.",
    },
    {
      id: "b_lift_eq_prose",
      kind: "PROSE",
      title: "The lift equation, decoded",
      markdown:
        "Now the workhorse. Every aircraft that has ever flown obeys this:\n\n`L = ½·ρ·V²·S·C_L`\n\nFour terms, and every one earns its place:\n\n- **½·ρ·V²** is the *dynamic pressure*, `q` — the kinetic energy packed into each cubic meter of oncoming air. Stare at that **V²**. Speed isn't just important here; it's *squared*. Double your airspeed and this term goes up by **four**. Hold that thought, because we're about to bet on it. Meanwhile `ρ` (air density) thins out with altitude, which is why airliners up at 35,000 ft have to haul along fast to stay up.\n- **S** is the *reference wing area* (the flat planform area, not the wrapped-around surface area). It's a chosen yardstick, so C_L is defined to be consistent with it.\n- **C_L** is the *lift coefficient* — a dimensionless dial that bundles up the wing's shape and its angle of attack. This is where the aerodynamics actually lives. Everything else is just the flow and the size of the wing.\n\nThe one-sentence mental model: `½·ρ·V²·S` sets the **size of the prize** — the total aerodynamic force on offer — and C_L is the **fraction of that prize** the wing actually grabs as lift. A pilot mostly flies by trading C_L (angle of attack) against V (airspeed) to keep lift equal to weight.",
    },
    {
      id: "b_predict_v2",
      kind: "PREDICT",
      question:
        "A wing makes a certain amount of lift at 50 m/s. You now fly the SAME wing, same air, same angle of attack, but at 100 m/s — double the speed. How much lift do you get now?",
      options: [
        { id: "p1", label: "About 2× the lift — twice the speed, twice the lift" },
        { id: "p2", label: "About 4× the lift" },
        { id: "p3", label: "About √2 ≈ 1.4× the lift" },
        { id: "p4", label: "The same lift — angle of attack didn't change" },
      ],
      answerId: "p2",
      reveal:
        "**4×.** This is the V² term flexing. Since L ∝ V², doubling V multiplies lift by 2² = **4**. This single fact explains a shocking amount of aviation: a wing that's hopelessly mushy and barely flying at low speed becomes a rock-solid lifting machine the moment you add airspeed — and conversely, bleed off speed on final approach and lift collapses *fast*, which is exactly why stalls feel like the floor dropping out. It's also why \"a 10% speed increase\" buys you roughly 21% more lift (1.1² ≈ 1.21), not 10%. Speed is the most powerful lever in the equation. Go prove it yourself in the next block.",
    },
    {
      id: "b_lift_formula",
      kind: "FORMULA",
      title: "Lift equation",
      display: "L = ½ · ρ · V² · S · C_L",
      latex: "L = \\tfrac{1}{2}\\,\\rho V^2 S\\, C_L",
      variables: [
        { symbol: "L", name: "Lift force", unit: "N" },
        { symbol: "ρ", name: "Air density", unit: "kg/m³" },
        { symbol: "V", name: "True airspeed (relative wind)", unit: "m/s" },
        { symbol: "S", name: "Reference wing (planform) area", unit: "m²" },
        { symbol: "C_L", name: "Lift coefficient", unit: "–" },
      ],
      note:
        "The bundle ½·ρ·V² is the dynamic pressure q. Lift scales linearly with q and S and with C_L — but C_L is itself a function of angle of attack, which is where the nonlinearity (and stall) hides. And remember: linear in q means quadratic in V.",
    },
    {
      id: "b_sandbox_lift",
      kind: "SANDBOX",
      title: "Playground #1 — drive the lift equation 🎛️",
      description:
        "Four sliders, one wing. Slide the airspeed V up and watch lift explode — that's the V² term you just bet on. Then nudge C_L by the same percentage and feel how much weaker that lever is. (Pro move: leave everything at the defaults and you'll read 12,250 N — memorize that number, you'll meet it again in the worked example.)",
      variables: [
        { key: "rho", label: "Air density ρ", unit: "kg/m³", min: 0.2, max: 1.4, step: 0.05, default: 1.225 },
        { key: "V", label: "Airspeed V", unit: "m/s", min: 10, max: 120, step: 1, default: 50 },
        { key: "S", label: "Wing area S", unit: "m²", min: 5, max: 60, step: 1, default: 16 },
        { key: "CL", label: "Lift coefficient C_L", unit: "–", min: 0.1, max: 1.6, step: 0.05, default: 0.5 },
      ],
      expression: "0.5 * rho * V^2 * S * CL",
      outputLabel: "Lift force L",
      outputUnit: "N",
      precision: 0,
    },
    {
      id: "b_cl_alpha_prose",
      kind: "PROSE",
      title: "The lift curve: where stall lives",
      markdown:
        "Back to that car-window moment when tilting your hand *more* suddenly stopped helping. That's C_L misbehaving. C_L isn't a fixed property of the wing — it depends mostly on the **angle of attack** (α), the angle between the chord line and the relative wind.\n\nPlot C_L against α and you get a story in three acts:\n\n1. **The honest stretch (linear region).** For small-to-moderate α, C_L climbs almost in a straight line. The slope is the *lift-curve slope*, `a = dC_L/dα`. Thin-airfoil theory says `a ≈ 2π` per radian (about 0.11 per degree) for a 2-D airfoil. A real, finite wing has a *gentler* slope because the wingtips leak lift.\n2. **The betrayal (C_Lmax and stall).** Push α too far and the airflow can't hug the curved top surface anymore — it *separates*, peeling away into turbulent chaos. C_L peaks at `C_Lmax` and then *falls off a cliff*. That's **stall**, and here's the part people get wrong: stall is about **angle**, not speed. You can stall at 300 knots if you yank α high enough (an accelerated stall). Your hand stalled on the highway not because the car slowed down but because you tilted too far.\n3. **The freebie (zero-lift angle).** A cambered (curved) wing makes a little lift even at α = 0, so the curve crosses C_L = 0 at a small *negative* angle, the zero-lift angle `α_L0`.\n\nThe punchline pilots live by: at fixed weight, flying slower demands higher C_L, which demands higher α. The **stall speed** is just the speed where the C_L you need finally equals C_Lmax. Slower than that and the wing physically cannot make enough lift to hold you up. The ground gets involved.",
    },
    {
      id: "b_check_lift",
      kind: "CHECK",
      question:
        "An aircraft in steady level flight climbs to an altitude where air density has dropped 20% (to 0.8ρ). To hold the same lift with angle of attack (so C_L) and wing area unchanged, by what factor must true airspeed change?",
      choices: [
        { id: "c1", label: "Increase by a factor of about 1.12 (1/√0.8)" },
        { id: "c2", label: "Increase by a factor of 1.25 (1/0.8)" },
        { id: "c3", label: "Decrease by a factor of 0.8" },
        { id: "c4", label: "No change — density does not affect lift" },
      ],
      answerId: "c1",
      explanation:
        "L = ½·ρ·V²·S·C_L. To keep L fixed with C_L and S fixed, the product ρ·V² must stay constant. If ρ drops to 0.8ρ, then V² must rise to V²/0.8, so V rises by 1/√0.8 ≈ 1.118. That sneaky square root is the V² term again: a 20% density loss costs you only ~12% more airspeed, not the 25% your gut probably guessed.",
    },
    {
      id: "b_drag_breakdown_prose",
      kind: "PROSE",
      title: "Drag, the bill that always comes due",
      markdown:
        "Lift gets the glory; drag pays the bills. Total drag splits into two physically different families, and they have a beautiful, frustrating rivalry.\n\n**1. Parasitic / profile drag** — the drag any body pays just for shoving through air, even an idealized infinite wing:\n\n- *Skin-friction drag* — the air literally rubbing against the surface (viscous shear in the boundary layer). Grows with wetted area; depends on whether that boundary layer is smooth (laminar) or churning (turbulent).\n- *Pressure (form) drag* — when the boundary layer thickens or separates, it leaves a low-pressure wake sucking backward on the tail of the body. (Picture the swirling mess behind a brick.)\n\nWe bottle all of this into the zero-lift drag coefficient `C_D0`. Because it rides on dynamic pressure, parasitic drag **grows with V²** — it's the bully at high speed.\n\n**2. Induced drag** — the price tag stapled to every bit of lift on a *finite* wing. Real wings have tips, and the high pressure under the wing comes barreling around the tip to the low pressure on top, rolling up into spinning **wingtip vortices** — the same swirls that toss small planes around behind a jumbo jet. Those vortices wash a downward velocity (*downwash*) over the wing, which tilts the local lift vector slightly **backward**. That rearward lean of the lift vector? That *is* induced drag. And here's the twist that makes it the perfect rival to parasitic drag: induced drag scales with C_L², and you only need a big C_L when you're slow — so induced drag is the bully at **low speed**.\n\nOne grows with speed, one shrinks with speed. Add them up and you get a U-shaped total-drag curve, with a sweet spot right where the two are equal. We'll build that curve next — but first, meet the formula that runs the whole induced-drag show.",
    },
    {
      id: "b_induced_formula",
      kind: "FORMULA",
      title: "Induced drag coefficient and aspect ratio",
      display: "C_Di = C_L² / (π · e · AR),   AR = b² / S",
      latex: "C_{Di} = \\dfrac{C_L^2}{\\pi\\, e\\, \\text{AR}}, \\qquad \\text{AR} = \\dfrac{b^2}{S}",
      variables: [
        { symbol: "C_Di", name: "Induced drag coefficient", unit: "–" },
        { symbol: "C_L", name: "Lift coefficient", unit: "–" },
        { symbol: "e", name: "Oswald (span) efficiency factor", unit: "–" },
        { symbol: "AR", name: "Aspect ratio", unit: "–" },
        { symbol: "b", name: "Wingspan", unit: "m" },
        { symbol: "S", name: "Wing (planform) area", unit: "m²" },
      ],
      note:
        "Induced drag rises with the SQUARE of C_L and falls inversely with aspect ratio. The Oswald efficiency factor e (typically 0.7–0.9) grades how close your spanwise lift distribution is to the perfect elliptical one; e = 1 is the theoretical dream. AR = b²/S is just how long-and-skinny the wing is.",
    },
    {
      id: "b_sandbox_induced",
      kind: "SANDBOX",
      title: "Playground #2 — the cost of lift 🎛️",
      description:
        "Crank up C_L and watch induced drag climb quadratically — lift is never free, and the bill grows fast. Then stretch the aspect ratio AR and watch the drag melt away. This one little relationship is the entire engine behind the long-skinny-wing trade-off in the practice problem. (At the defaults you should read about 0.0179 — a useful gut-check.)",
      variables: [
        { key: "CL", label: "Lift coefficient C_L", unit: "–", min: 0.1, max: 1.6, step: 0.05, default: 0.6 },
        { key: "e", label: "Oswald efficiency e", unit: "–", min: 0.6, max: 1, step: 0.05, default: 0.8 },
        { key: "AR", label: "Aspect ratio AR", unit: "–", min: 4, max: 20, step: 1, default: 8 },
      ],
      expression: "CL^2 / (pi * e * AR)",
      outputLabel: "Induced drag coefficient C_Di",
      outputUnit: "",
      precision: 4,
    },
    {
      id: "b_drag_polar_prose",
      kind: "PROSE",
      title: "The drag polar: one equation to rule them",
      markdown:
        "Add the two drag families together and you get the **drag polar** — the single most useful one-line summary of how aerodynamically slippery an aircraft is:\n\n`C_D = C_D0 + C_L²/(π·e·AR)`\n\nRead it slowly:\n\n- `C_D0` is the **floor** — the drag you pay even when you're making zero lift. Roughly constant with C_L (it cares about shape and Reynolds number, not how hard you're lifting).\n- The second term is **induced drag**, climbing with `C_L²`. The clump `1/(π·e·AR)` gets nicknamed `k`, so people just write `C_D = C_D0 + k·C_L²`.\n\nThat parabola in C_L is *why* the total-drag-versus-speed curve is U-shaped. Fly slow → big C_L needed → induced drag dominates. Fly fast → tiny C_L but huge `½·ρ·V²·S` → parasitic drag dominates. And the bottom of the U — the most efficient speed there is — sits exactly where the two drags are equal. Like a skipping stone: throw it too slow and it plows into the water, throw it flat and fast and it slices through with minimum fuss. There's a Goldilocks speed in the middle.",
    },
    {
      id: "b_formula_ld_note",
      kind: "CALLOUT",
      variant: "insight",
      title: "Where maximum L/D hides 💡",
      markdown:
        "Take the derivative of the drag polar and a clean result pops out: L/D is maxed exactly when **induced drag equals parasitic drag** — `C_D0 = k·C_L²`, i.e. at `C_L = √(C_D0/k)`. There, `(L/D)_max = ½·√(1/(k·C_D0)) = ½·√(π·e·AR/C_D0)`. Look at what's under that square root: **AR**. Peak efficiency grows with √AR. That's the whole reason sailplanes and high-altitude endurance drones wear those impossibly long, slender wings — they're chasing that √AR.",
    },
    {
      id: "b_walkthrough_ar",
      kind: "WALKTHROUGH",
      title: "Why not just make the wings really long and skinny?",
      steps: [
        {
          title: "The seductive part: long wings barely drag",
          markdown:
            "Start with `C_Di = C_L²/(π·e·AR)`. AR sits in the *denominator*, so at a fixed C_L (fixed lift requirement), **doubling AR halves induced drag**. Physically: a longer span pushes the tip vortices farther apart, so their downwash over the wing weakens, so less of your lift vector tips backward into drag. Free efficiency. Tempting.",
        },
        {
          title: "And it gets better — efficiency scales with √AR",
          markdown:
            "Lower induced drag means lower total drag right at the low-speed / high-C_L conditions that rule climb, loiter, and cruise. And since `(L/D)_max ∝ √(AR)`, stretching the wing directly raises *peak* efficiency — more range, more endurance. At this point you're wondering why every aircraft isn't a 30:1 sliver. Here comes the catch.",
        },
        {
          title: "The catch: the wing has to not snap off",
          markdown:
            "Lift is spread along the span, but all of it has to be carried back to the fuselage at the root — like holding a long broomstick out horizontally versus a short one. Longer span = bigger *moment arm* = **root bending moment** grows roughly with span. A long thin wing also bends more easily. To keep it from over-stressing or flexing into a banana, you bolt on more structure — heavier spars, thicker skins — which adds **weight**. More weight means more required lift, which means higher C_L, which means... more induced drag. The aerodynamic gain starts eating itself.",
        },
        {
          title: "The other catch: it has to fly nicely too",
          markdown:
            "A long, slender wing has a huge roll moment of inertia and ailerons way out at the tips — so it rolls slowly and sluggishly. Terrible for a dogfight, which is exactly why **fighters use *low* aspect ratio**. High-AR wings also flex more (hello, flutter and aeroelastic divergence), and the span might literally not fit the airport gate — the A380's span is gate-limited, and the 777X grew *folding wingtips* just to keep high span while still parking.",
        },
        {
          title: "The verdict",
          markdown:
            "There's no universal best AR — there's a best AR *for your mission*. Want to stay aloft forever and sip fuel (sailplanes, the U-2, solar HALE drones, airliners)? Push AR high and eat the weight penalty. Want to flick into a barrel roll (fighters, aerobatic planes)? Keep AR low. This is the exact optimization waiting for you in the linked practice problem: pick the AR that wins, with a weight model that punishes you for getting greedy on span.",
        },
      ],
    },
    {
      id: "b_worked_ld",
      kind: "WORKED_EXAMPLE",
      title: "Putting numbers on a real cruise",
      problem:
        "A light aircraft cruises in steady level flight. Given: ρ = 1.225 kg/m³, V = 50 m/s, S = 16 m², C_L = 0.5, zero-lift drag coefficient C_D0 = 0.025, Oswald efficiency e = 0.8, aspect ratio AR = 8. Find (a) the lift force, (b) the total drag coefficient, (c) the drag force, (d) the lift-to-drag ratio — and then tell me what the airplane weighs.",
      steps: [
        {
          label: "Step 1 — Dynamic pressure q",
          markdown:
            "`q = ½·ρ·V² = 0.5 × 1.225 × 50² = 0.5 × 1.225 × 2500 = 1531.25 Pa`. (That 50² is the V² term doing its thing.)",
        },
        {
          label: "Step 2 — (a) Lift force",
          markdown:
            "`L = q·S·C_L = 1531.25 × 16 × 0.5 = 12250 N`. Recognize that number? It's exactly what Playground #1 reads at its defaults. Free unit check.",
        },
        {
          label: "Step 3 — Induced drag coefficient",
          markdown:
            "`C_Di = C_L²/(π·e·AR) = 0.5²/(π × 0.8 × 8) = 0.25/20.106 ≈ 0.01244`.",
        },
        {
          label: "Step 4 — (b) Total drag coefficient",
          markdown:
            "`C_D = C_D0 + C_Di = 0.025 + 0.01244 = 0.03744`.",
        },
        {
          label: "Step 5 — (c) Drag force",
          markdown:
            "`D = q·S·C_D = 1531.25 × 16 × 0.03744 ≈ 917.3 N`.",
        },
        {
          label: "Step 6 — (d) Lift-to-drag ratio (and the weight)",
          markdown:
            "`L/D = C_L/C_D = 0.5/0.03744 ≈ 13.4` (cross-check: 12250/917.3 ≈ 13.4 ✓). And since steady level flight means lift = weight, the airplane weighs about **12250 N** (≈ 1249 kg) — a little over a tonne.",
        },
      ],
      answer:
        "L ≈ 12250 N; C_D ≈ 0.0374; D ≈ 917 N; L/D ≈ 13.4; weight ≈ 12250 N (≈ 1.25 tonnes). Notice induced drag (C_Di ≈ 0.0124) is already about a third of the total here at a modest C_L — and it would absolutely take over at lower speed / higher C_L.",
    },
    {
      id: "b_ld_prose",
      kind: "PROSE",
      title: "L/D: the one number that runs everything",
      markdown:
        "If you only carry one scalar out of this lesson, make it `L/D = C_L/C_D` — how much weight you haul per unit of thrust you burn. It is the master efficiency metric, and it quietly governs the whole mission:\n\n- **Range.** A jet chasing maximum distance flies near `(L/D)_max` (the Breguet range equation makes this precise). More distance per kilogram of fuel — that's L/D times engine efficiency.\n- **Endurance.** Max time aloft for a jet lives near minimum drag (also close to max L/D). For propeller aircraft the optimum shifts a touch because you're minimizing *power*, not thrust — but L/D is still the star.\n- **Gliding.** A glider's *glide ratio* literally **equals** its L/D. An L/D of 40 means 40 meters forward for every 1 meter of altitude lost. Cut the engine on a modern sailplane and it'll travel the length of forty football fields per football field of descent. That's not magic; that's a big number under that √AR.\n\nThis is why every paragraph of the drag discussion paid off. Pushing `C_D0` down (clean shapes, laminar flow) and pushing induced drag down (high AR, near-elliptical lift, winglets) both lift `(L/D)_max` — and *that* is the airframe designer's real lever on fuel burn and reach.",
    },
    {
      id: "b_re_mach_prose",
      kind: "PROSE",
      title: "Two numbers that set the rules of the game",
      markdown:
        "Quick but important: everything above lives inside a regime defined by two dimensionless numbers, and a sharp interviewer will ask you to place them.\n\n- **Reynolds number** `Re = ρ·V·c/μ` (chord c, viscosity μ) — the tug-of-war between inertia and viscosity. It runs the boundary layer: low Re leans laminar (slippery, but separates early, lower C_Lmax); high Re leans turbulent (more skin friction, but stays attached longer, higher C_Lmax). So C_D0 and C_Lmax both depend on Re — which is why wind-tunnel data has to be matched to the real flight Re or it'll lie to you.\n- **Mach number** `M = V/a` (a = speed of sound) — the compressibility meter. Below about M ≈ 0.3, air shrugs off density changes and our constant-density lift equation is golden. Push toward transonic and the flow over the wing can locally go supersonic, slamming up shock waves and a whole new drag family — *wave drag* — that isn't in our tidy low-speed polar. Swept wings and supercritical airfoils are the counterpunch, but that's a different lesson.\n\nKeep yourself honest: `C_D = C_D0 + C_L²/(π·e·AR)` is a low-speed, incompressible, subsonic model. Say so out loud when you wield it — interviewers love a candidate who states their assumptions before they get caught not having any.",
    },
    {
      id: "b_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "In the interview 🎯",
      markdown:
        "The four prompts that show up over and over, and the move that scores each one:\n\n- **\"How does a wing generate lift?\"** Lead with momentum/downwash and circulation; use Bernoulli only for the speed–pressure link; *explicitly* reject equal-transit-time before they can bait you. Naming the Kutta condition signals real depth.\n- **\"Break down the drag on a wing.\"** Parasitic (skin friction + pressure/form, grows with V²) plus induced (tip vortices/downwash, scales as C_L²/(π·e·AR), rules at low speed). Then sketch the U-shaped curve in the air with your hand. They'll love it.\n- **\"Why not make wings very long and skinny?\"** Induced drag falls and (L/D)_max ∝ √AR — *but* root bending moment and weight grow with span, roll gets sluggish, and flutter and gate limits bite. \"It's a constrained optimum per mission.\"\n- **\"What sets stall?\"** Angle of attack, not speed directly. C_Lmax and flow separation. Stall speed is just where required C_L = C_Lmax.\n\nThe pattern that wins every time: connect the **equation** → the **flow physics** → the **design consequence**, and sanity-check with units.",
    },
    {
      id: "b_check_drag",
      kind: "CHECK",
      question:
        "Two otherwise identical wings differ only in aspect ratio: wing B has twice the aspect ratio of wing A. Both fly at the same C_L and the same Oswald efficiency e. How does wing B's induced drag coefficient compare to wing A's?",
      choices: [
        { id: "c1", label: "It is half as large" },
        { id: "c2", label: "It is twice as large" },
        { id: "c3", label: "It is one quarter as large" },
        { id: "c4", label: "It is unchanged — induced drag depends only on C_L" },
      ],
      answerId: "c1",
      explanation:
        "C_Di = C_L²/(π·e·AR). AR is in the denominator while C_L and e are held fixed, so doubling AR **halves** C_Di. (The C_L² up top would matter if C_L changed — but here only AR moved.) This clean inverse-AR dependence is precisely why long skinny wings are so efficient, and precisely why their fight against structural weight is worth a whole practice problem.",
    },
    {
      id: "b_outro",
      kind: "PROSE",
      title: "The whole chain, in one breath",
      markdown:
        "Remember the hand out the car window? You've now got the full physics behind that shove. Lift comes from turning air downward — `L = ½·ρ·V²·S·C_L`, with C_L set by angle of attack right up to the cliff edge of stall. Making that lift on a real, finite wing unavoidably spins up tip vortices and downwash, billing you induced drag `C_Di = C_L²/(π·e·AR)`, which stacks onto parasitic drag to give the drag polar `C_D = C_D0 + C_L²/(π·e·AR)`. Out of that pops L/D — the number that decides how far you fly and how long you stay up — and the hunger to raise it drags aspect ratio upward, straight into a wall of structural weight and clumsy roll.\n\nThat tension is the engineering decision waiting for you in the linked practice problem. Go pick the aspect ratio that wins the mission. You've earned it.",
    },
  ],
  keyTakeaways: [
    "Lift = ½·ρ·V²·S·C_L: dynamic pressure (½·ρ·V²) and area set the size of the prize; the dimensionless C_L — driven by angle of attack — sets the fraction you actually grab. Linear in q, but QUADRATIC in V.",
    "Lift is air turned downward (momentum/downwash) and described by circulation (Kutta–Joukowski). Bernoulli links speed and pressure; equal-transit-time is a myth — never use it.",
    "Double the airspeed → 4× the lift (L ∝ V²). It's the most powerful lever in the equation and the reason stalls feel like the floor dropping out.",
    "C_L rises nearly linearly with angle of attack (slope ~2π/rad for thin airfoils) until the flow separates at C_Lmax — stall is an ANGLE limit, not a fixed speed.",
    "Drag = parasitic (skin friction + pressure/form, grows with V²) + induced (tip vortices/downwash, C_Di = C_L²/(π·e·AR), rules at low speed). One bully per speed regime.",
    "The drag polar C_D = C_D0 + C_L²/(π·e·AR) gives a U-shaped drag curve; max L/D sits where induced drag equals parasitic drag, and (L/D)_max ∝ √(AR).",
    "High aspect ratio cuts induced drag and raises L/D — but grows root bending moment, weight, roll inertia, and flutter/gate limits. That's the core wing-design trade-off, and the whole point of the practice problem.",
  ],
};
