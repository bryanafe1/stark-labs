import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_rocket",
  slug: "rocket-propulsion-and-the-rocket-equation",
  title: "Rocket Propulsion & the Rocket Equation: The Tyranny You Can't Negotiate With",
  summary:
    "A rocket is the only vehicle that has to throw part of itself away, violently, just to move. This lesson builds the whole idea from a single law — conservation of momentum — up to the equation that rules every launch ever flown: Δv = Isp·g0·ln(m0/mf). You'll feel why that innocent-looking `ln` is actually a tyrant, why doubling your payload barely buys you any extra speed, why specific impulse is the only engine number that matters, and why staging isn't a clever optimization — it's a desperate escape from exponential math. One playground, two gut-check predictions, and a real stage worked end to end.",
  discipline: "AEROSPACE",
  difficulty: "HARD",
  estMinutes: 24,
  tags: ["propulsion", "rocket-equation", "delta-v"],
  objectives: [
    "Derive thrust F = ṁ·Ve from conservation of momentum and explain why a rocket needs no air to push against.",
    "Write the Tsiolkovsky rocket equation Δv = Isp·g0·ln(m0/mf) from memory and explain every term physically.",
    "Define specific impulse (Isp = Ve/g0) and use it to compare engines fairly.",
    "Explain the 'tyranny of the rocket equation' — why mass ratio enters logarithmically and propellant demand grows exponentially with Δv.",
    "Argue why staging exists and how it sidesteps the exponential dry-mass penalty.",
    "Estimate a Δv budget to low Earth orbit and reason about whether a single stage can reach it.",
  ],
  prerequisites: [
    "Newton's laws and conservation of momentum",
    "Natural logarithms and exponentials",
    "Algebra and SI unit analysis",
  ],
  interviewAngle:
    "Aerospace interviewers love the rocket equation because it's a one-line litmus test: in ninety seconds they learn whether you understand propulsion physics or just memorized `Δv = Isp·g0·ln(m0/mf)`. Expect to be asked to derive thrust from momentum (and to resist the myth that rockets 'push against the air'), to explain why the mass ratio is logarithmic and why that's catastrophic, to compare two engines by Isp, and to defend staging out loud. The candidates who win move fluidly between the equation, the conservation law underneath it, and the brutal engineering consequence — and they always sanity-check Δv numbers against the ~9.4 km/s budget to orbit.",
  blocks: [
    {
      id: "b_hook",
      kind: "PROSE",
      title: "The vehicle that has to eat itself 🚀",
      markdown:
        "Every other machine that moves pushes against *something else*. A car shoves the road backward. A propeller flings air backward. A swimmer pushes water. They all borrow momentum from the world around them.\n\nA rocket has no such luxury. Out in the vacuum there is nothing to push against — no road, no air, no water. So a rocket does the only thing left: it throws **part of itself** out the back, as hard and as fast as it possibly can, and rides the recoil. A rocket is a machine that moves by *violently disassembling itself*.\n\nThat single, brutal fact has a consequence so severe that engineers gave it a name: **the tyranny of the rocket equation**. It's the reason a vehicle that's 90% propellant by mass is considered *normal*, the reason adding a little payload can wreck a whole mission, and the reason rockets are built in stages they drop into the ocean. By the end of this lesson you'll understand exactly *why* the tyrant is a tyrant — and it all comes down to one `ln`.\n\nThree quantities will run the whole show:\n\n- **Thrust (F)** — the force pushing the rocket forward, set by how fast and how much mass you fling out the back.\n- **Specific impulse (Isp)** — the engine's fuel economy. The single number that says how *good* your engine is.\n- **Delta-v (Δv)** — the total change in velocity your rocket can muster. The currency of spaceflight. Every maneuver costs Δv, and you only get to spend what your propellant bought.\n\nLet's build all three from one law you already know.",
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "I6xFMzeXXHg",
      title: "Watch: The Tsiolkovsky Rocket Equation",
      channel: "Astrobot",
    },
    {
      id: "b_thrust_prose",
      kind: "PROSE",
      title: "Thrust from first principles: throw mass, get pushed",
      markdown:
        "Forget rockets for a second and stand on a frozen, frictionless lake holding a heavy medicine ball. Throw the ball east as hard as you can. You slide west. You didn't push against the ice — you pushed against the **ball**, and the ball pushed back on you. That's the entire principle of rocketry, just done continuously and a few thousand times faster.\n\n**Conservation of momentum** is the engine of the engine. In a tiny instant `dt`, the rocket spits out a little chunk of propellant `dm` at exhaust velocity `Ve` (measured relative to the rocket). That chunk carries away momentum `Ve·dm` out the back. By Newton's third law — and by the books-must-balance rule of momentum conservation — the rocket gains exactly that much momentum forward.\n\nDivide by time and you get **thrust**:\n\n`F = ṁ · Ve`\n\nwhere `ṁ` (m-dot) is the *mass flow rate* — kilograms of propellant per second screaming out the nozzle — and `Ve` is the effective exhaust velocity. Read it plainly: thrust is *how much* mass you throw per second, times *how fast* you throw it. Want more thrust? Throw more, or throw it faster.\n\nAnd notice the myth this kills on contact: a rocket does **not** push against the air. It pushes against its own exhaust. In a vacuum — where there's no atmospheric back-pressure choking the nozzle — a rocket actually works a little *better*. Say that in an interview and you've already separated yourself from half the room.",
    },
    {
      id: "b_predict_air",
      kind: "PREDICT",
      question:
        "A rocket engine is fired in two settings: (1) at sea level in thick atmosphere, and (2) in the vacuum of space. With the same propellant and flow rate, where does the engine produce MORE thrust?",
      options: [
        { id: "p1", label: "At sea level — it has air to push against" },
        { id: "p2", label: "In a vacuum — there's no atmospheric back-pressure on the nozzle exit" },
        { id: "p3", label: "Exactly the same — thrust doesn't care about surroundings" },
        { id: "p4", label: "Neither — rockets can't fire in a vacuum at all" },
      ],
      answerId: "p2",
      reveal:
        "**In a vacuum.** A rocket pushes against its own exhaust, never against the air. In fact the atmosphere *hurts* you: ambient pressure pushes back on the nozzle exit plane, subtracting from thrust. Remove the air and that back-pressure penalty vanishes, so the same engine produces *more* thrust in space. (That's why upper-stage engines wear those enormous bell nozzles — they're optimized to expand the exhaust for vacuum, where they can fully cash in.) Rockets don't need air; air is just a tax they're glad to escape.",
    },
    {
      id: "b_isp_prose",
      kind: "PROSE",
      title: "Specific impulse: the one number that grades your engine",
      markdown:
        "If you could know only one fact about a rocket engine, you'd ask for its **specific impulse**, `Isp`. It's the engine's fuel economy — the miles-per-gallon of rocketry — and it boils down to a beautifully simple idea: how much *push you get per unit of propellant burned*.\n\nThe cleanest definition is just the exhaust velocity, rescaled:\n\n`Isp = Ve / g0`\n\nwhere `g0 = 9.81 m/s²` is standard gravity — used here purely as a fixed conversion constant (a historical accident of measuring propellant in weight rather than mass). That `g0` is why Isp comes out in **seconds**, a unit that confuses everyone the first time. Don't overthink it: a *higher* Isp means a *faster exhaust*, which means more momentum extracted from every kilogram of propellant. More Isp = a better engine, full stop.\n\nA rough feel for the ladder:\n\n- **Solid rocket boosters:** Isp ≈ 250 s. Cheap, simple, brute force.\n- **Kerosene/LOX (like the Falcon 9 first stage):** Isp ≈ 300 s at sea level.\n- **Hydrogen/LOX (the high-performance upper-stage king):** Isp ≈ 450 s. Burns the lightest, fastest exhaust chemistry can give.\n- **Ion thrusters:** Isp ≈ 3000+ s — absurdly efficient, but with thrust so feeble they'd lose a shoving match with a sheet of paper. Great for deep-space cruising, useless for liftoff.\n\nHold onto Isp as 'how fast you throw your mass.' In a moment you'll watch it sit right at the front of the master equation, multiplying everything.",
    },
    {
      id: "b_rocket_eq_prose",
      kind: "PROSE",
      title: "The rocket equation, decoded",
      markdown:
        "Here it is — the equation Konstantin Tsiolkovsky wrote down in 1903, before anyone had flown a rocket anywhere. It governs every launch in history:\n\n`Δv = Isp · g0 · ln(m0 / mf)`\n\nIt falls out of integrating `F = ṁ·Ve` while the rocket's mass shrinks as it burns. Three pieces, and you must be able to talk about each one:\n\n- **Isp · g0** is just the effective exhaust velocity `Ve` in disguise (since Isp = Ve/g0). So the front of the equation is literally *how fast you throw your propellant*. Better engine → bigger multiplier on everything. Linear, friendly, the part you can fight for.\n- **m0 / mf** is the **mass ratio**: wet mass (rocket fully fueled) over dry mass (rocket with the tanks run empty). It's always greater than 1, and the bigger it is, the more of your rocket was propellant.\n- **ln(...)** — and *this* is the tyrant. The mass ratio doesn't enter linearly. It enters through a **natural logarithm**, which grows agonizingly slowly. To squeeze out more Δv from mass ratio alone, you must grow that ratio *exponentially*. Read it the other way and it's terrifying: the propellant you need grows **exponentially** with the Δv you want.\n\nThat single `ln` is the difference between 'spaceflight is hard' and 'spaceflight is barely possible.' Let's go feel it in your hands.",
    },
    {
      id: "b_predict_double",
      kind: "PREDICT",
      question:
        "A rocket has wet mass m0 and dry mass mf, giving it some Δv. You want to DOUBLE its Δv (same engine, same Isp). Roughly what must happen to the mass ratio m0/mf?",
      options: [
        { id: "p1", label: "Double the mass ratio — twice the Δv needs twice the ratio" },
        { id: "p2", label: "The mass ratio must be SQUARED — e.g. a ratio of 5 becomes 25" },
        { id: "p3", label: "Increase the ratio by about 40% (×√2)" },
        { id: "p4", label: "Add 2 to the mass ratio" },
      ],
      answerId: "p2",
      reveal:
        "You must **square** the mass ratio. Δv ∝ ln(m0/mf), and doubling a logarithm means squaring its argument: `2·ln(R) = ln(R²)`. So a rocket with mass ratio 5 (already ~80% propellant!) would need a ratio of **25** — meaning 96% propellant, leaving just 4% for the engine, tanks, structure, *and* payload combined. That's physically absurd. This is the tyranny in one number: linear gains in Δv demand exponential gains in propellant. It's exactly why you can't just 'add more fuel' to reach Mars, and exactly why staging had to be invented. Go watch it happen in the playground.",
    },
    {
      id: "b_formula",
      kind: "FORMULA",
      title: "Tsiolkovsky rocket equation",
      display: "Δv = Isp · g0 · ln(m0 / mf)",
      variables: [
        { symbol: "Δv", name: "Delta-v (achievable velocity change)", unit: "m/s" },
        { symbol: "Isp", name: "Specific impulse", unit: "s" },
        { symbol: "g0", name: "Standard gravity (conversion constant)", unit: "m/s²" },
        { symbol: "m0", name: "Wet mass (fully fueled)", unit: "kg" },
        { symbol: "mf", name: "Dry mass (propellant burned out)", unit: "kg" },
      ],
      note:
        "Isp·g0 is the effective exhaust velocity Ve. The mass ratio m0/mf enters through a natural log, so Δv grows only logarithmically with propellant — equivalently, propellant grows EXPONENTIALLY with required Δv. g0 = 9.81 m/s² is a fixed constant here, not the local gravity the rocket is flying through.",
    },
    {
      id: "b_sandbox",
      kind: "SANDBOX",
      title: "Playground — feel the tyranny 🎛️",
      description:
        "Three sliders. First, slide the dry mass mf DOWN toward the wet mass m0 and watch Δv collapse — that's the log punishing a small mass ratio. Then slide mf the other way and notice how much propellant you have to add for each extra few hundred m/s. Finally, bump Isp and feel how that front multiplier is the friendly, linear lever. (Leave everything at the defaults and you'll read about 4736 m/s — that's Isp 300 s, mass ratio 5. Memorize it; you'll meet it in the worked example.)",
      variables: [
        { key: "Isp", label: "Specific impulse Isp", unit: "s", min: 200, max: 460, step: 10, default: 300 },
        { key: "m0", label: "Wet mass m0", unit: "kg", min: 50000, max: 1000000, step: 10000, default: 500000 },
        { key: "mf", label: "Dry mass mf", unit: "kg", min: 10000, max: 400000, step: 10000, default: 100000 },
      ],
      expression: "Isp * 9.81 * ln(m0 / mf)",
      outputLabel: "Delta-v",
      outputUnit: "m/s",
      precision: 0,
    },
    {
      id: "b_callout_g0",
      kind: "CALLOUT",
      variant: "warning",
      title: "Don't confuse the two gravities ⚠️",
      markdown:
        "The `g0` in the rocket equation is **not** the gravity your rocket is fighting as it climbs. It's `9.81 m/s²` used as a *fixed unit-conversion constant* baked into the seconds-based definition of Isp. The same rocket equation governs a probe coasting in deep space where local gravity is essentially zero — `g0` is still 9.81. Mixing up 'the g0 in the equation' with 'gravity losses during ascent' is a classic interview faceplant. Gravity losses are real, but they're a *separate* subtraction from your Δv budget, not this term.",
    },
    {
      id: "b_tyranny_prose",
      kind: "PROSE",
      title: "Why the tyranny forces staging",
      markdown:
        "Now we cash in the playground intuition. You watched Δv crawl while the mass ratio had to balloon. Here's why that math is *fatal* to a single rocket and how staging escapes it.\n\nThe villain is **dry mass**. Every kilogram of structure, every engine, every empty tank, every bolt sits in `mf` and *never goes away*. You drag it the entire burn. To get a high mass ratio you need to make the dry mass a tiny fraction of the total — but engines and tanks have a floor. You can't build a tank that's only made of fuel.\n\nNow imagine you want lots of Δv, so you build a huge rocket with huge tanks. Those big tanks are *heavy*, and once they're empty, you're hauling enormous dead weight while trying to squeeze out your last and most expensive Δv. The propellant you'd need to push *that* dead structure grows exponentially. A single-stage rocket trying to reach orbit runs straight into this wall: by the time you account for real-world tank and engine masses, there's almost nothing left over for payload.\n\n**Staging is the jailbreak.** Instead of dragging empty tanks to the finish line, you build the rocket in chunks and *throw each empty chunk away* the moment it's spent. Drop the big first-stage tanks and engines as soon as they're dry, and suddenly the upper stage has a gorgeous mass ratio because it's no longer carrying the corpse of the lower stage. Each stage gets its *own* mass ratio, and the magic is that **Δv adds across stages** while the punishing dry mass keeps getting jettisoned.\n\nThat's why every orbital rocket — from the Saturn V to the Falcon 9 — sheds pieces on the way up. Staging isn't a clever optimization. It's the only known way to beat the exponential.",
    },
    {
      id: "b_budget_prose",
      kind: "PROSE",
      title: "The Δv budget: the cost sheet of spaceflight",
      markdown:
        "Δv is money, and getting to orbit has a price tag. The *ideal* orbital velocity for low Earth orbit (LEO) is about **7.8 km/s** — that's the speed you must be moving sideways to keep falling around the Earth and missing it. But you don't get to spend only that, because the real climb has surcharges:\n\n- **Gravity losses (~1.5–2 km/s):** while your engine fights to accelerate, gravity is busy decelerating you. Every second spent climbing slowly is Δv lost to gravity's tax.\n- **Aerodynamic drag (~0.3–0.5 km/s):** punching through the thick lower atmosphere costs you.\n- **Steering and finite-burn losses:** small change, but it's there.\n\nAdd it up and the real-world **Δv budget to LEO is roughly 9.0–9.4 km/s**. That's the number every launch vehicle is engineered to hit. And it keeps going: LEO to geostationary transfer is another ~2.5 km/s, a trans-lunar injection another ~3.1 km/s, and so on. Mission planners literally keep a Δv ledger — every burn is a withdrawal, and your propellant is the bank balance the rocket equation handed you.\n\nThe punchline: ~9.4 km/s of Δv, against a single-stage mass-ratio wall that makes even 6–7 km/s painful, is *exactly* why a single stage essentially cannot reach orbit with useful payload — and why staging is mandatory, not optional.",
    },
    {
      id: "b_check_isp",
      kind: "CHECK",
      question:
        "Engine A has Isp = 300 s; engine B has Isp = 450 s. Both push the SAME rocket with the same mass ratio m0/mf. How does engine B's achievable Δv compare to engine A's?",
      choices: [
        { id: "c1", label: "1.5× larger (Δv scales linearly with Isp)" },
        { id: "c2", label: "2.25× larger (Δv scales with Isp²)" },
        { id: "c3", label: "Larger, but only by the log of the Isp ratio" },
        { id: "c4", label: "Identical — Δv depends only on mass ratio" },
      ],
      answerId: "c1",
      explanation:
        "Δv = Isp·g0·ln(m0/mf). With the mass ratio (and therefore the log term) held fixed, Δv is simply **proportional to Isp**. So 450/300 = 1.5 gives 1.5× the Δv. This is the cheerful flip side of the tyranny: while mass ratio fights you logarithmically, Isp rewards you *linearly*. That's why squeezing out higher specific impulse — hydrogen upper stages, better combustion, bigger vacuum nozzles — is such a high-leverage way to improve a rocket. The engine multiplier sits out front of everything.",
    },
    {
      id: "b_worked",
      kind: "WORKED_EXAMPLE",
      title: "A real stage, end to end",
      problem:
        "A rocket stage has wet mass m0 = 500,000 kg and dry mass mf = 100,000 kg, with an engine of Isp = 300 s (take g0 = 9.81 m/s²). Find (a) the mass ratio, (b) the propellant mass burned, (c) the Δv this stage delivers. Then (d): a customer wants to add 20,000 kg of payload, which rides as extra dry mass (so mf becomes 120,000 kg, m0 becomes 520,000 kg). How much Δv do you lose? Notice how little a 'big' payload moves the needle.",
      steps: [
        {
          label: "Step 1 — (a) Mass ratio",
          markdown:
            "`m0/mf = 500000 / 100000 = 5`. The stage is 80% propellant by mass. That's already an aggressive, real-world-grade ratio.",
        },
        {
          label: "Step 2 — (b) Propellant burned",
          markdown:
            "`m_prop = m0 − mf = 500000 − 100000 = 400000 kg`. Four hundred tonnes of propellant thrown out the back to move one hundred tonnes of structure.",
        },
        {
          label: "Step 3 — (c) Delta-v",
          markdown:
            "`Δv = Isp·g0·ln(m0/mf) = 300 × 9.81 × ln(5) = 2943 × 1.6094 ≈ 4736 m/s`. Recognize that number? It's exactly what the Playground reads at its defaults. Free sanity check. ✓",
        },
        {
          label: "Step 4 — (d) Add 20,000 kg of payload",
          markdown:
            "New masses: m0 = 520000 kg, mf = 120000 kg. New ratio = 520000/120000 ≈ 4.333. New Δv = 300 × 9.81 × ln(4.333) = 2943 × 1.4663 ≈ **4316 m/s**.",
        },
        {
          label: "Step 5 — Read the damage",
          markdown:
            "Δv dropped from 4736 to 4316 m/s — a loss of about **420 m/s**, roughly 9%, for a 20-tonne payload. Here's the cruel asymmetry: that payload was only 4% of the wet mass, yet it ate 9% of your Δv, because it sits in *both* m0 and mf and the log magnifies changes near the dry end. Worse, to *recover* that lost 420 m/s you'd have to add far more than 20 tonnes of propellant — and that propellant needs bigger tanks, which add dry mass, which... you see the spiral. The tyranny doesn't just resist you; it compounds.",
        },
      ],
      answer:
        "(a) mass ratio = 5; (b) propellant = 400,000 kg; (c) Δv ≈ 4736 m/s; (d) adding 20 t of payload cuts Δv to ≈ 4316 m/s — a ~420 m/s (~9%) loss for a payload that's only 4% of wet mass. A single such stage (~4.7 km/s) falls well short of the ~9.4 km/s needed for orbit, which is precisely why you stage.",
    },
    {
      id: "b_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "In the interview 🎯",
      markdown:
        "The prompts that come up again and again, and the move that scores each:\n\n- **\"Derive thrust for a rocket.\"** Conservation of momentum: in `dt` you expel `dm` at `Ve`, so `F = ṁ·Ve`. *Explicitly* note the rocket pushes on its exhaust, not the air — and works better in vacuum. That last line signals real understanding.\n- **\"Write and explain the rocket equation.\"** `Δv = Isp·g0·ln(m0/mf)`. Call out that Isp·g0 = Ve (the linear, friendly term) and that the mass ratio enters through a *log* — so propellant grows exponentially with Δv. Name it: 'the tyranny of the rocket equation.'\n- **\"Why do rockets stage?\"** Dry mass is dead weight you drag the whole burn; staging throws spent structure away so each stage keeps a high mass ratio, and Δv adds across stages. Frame it as the only escape from the exponential.\n- **\"Can a single stage reach orbit?\"** Budget is ~9.4 km/s to LEO (7.8 ideal + gravity + drag losses); real tank/engine masses make a single stage's mass ratio fall short with useful payload. Tie the number to the math.\n\nThe winning pattern, every time: connect the **equation** → the **conservation law** under it → the **engineering consequence**, and sanity-check Δv against the ~9.4 km/s budget.",
    },
    {
      id: "b_check_staging",
      kind: "CHECK",
      question:
        "A two-stage rocket gives 4.5 km/s on stage 1 and 5.0 km/s on stage 2. A proposed single-stage design uses the same total propellant and same engines but never drops any structure. Why does the single stage deliver LESS than the 9.5 km/s total?",
      choices: [
        { id: "c1", label: "It must carry the empty first-stage structure the whole way, lowering its overall mass ratio" },
        { id: "c2", label: "Δv never adds across burns, so the comparison is invalid" },
        { id: "c3", label: "Single stages have inherently lower Isp than multi-stage engines" },
        { id: "c4", label: "It actually delivers more — fewer parts means less mass" },
      ],
      answerId: "c1",
      explanation:
        "The whole power of staging is *jettisoning dead mass*. A single stage drags its empty tanks and structure all the way to burnout, so that dead weight sits in `mf` for the entire flight, crushing the effective mass ratio and hence the total `ln(m0/mf)`. Staging lets each stage start fresh with a small dry mass and a fat mass ratio, and the Δv contributions add. Same propellant, same engines — yet staging wins because it stops paying to accelerate empty tanks. That's the exponential being beaten the only way it can be.",
    },
    {
      id: "b_outro",
      kind: "PROSE",
      title: "The whole chain, in one breath",
      markdown:
        "Start from one law — momentum is conserved — and a rocket becomes a machine that throws part of itself backward to be pushed forward, giving thrust `F = ṁ·Ve`. Grade the engine by how fast it throws, `Isp = Ve/g0`. Integrate the burn and you get Tsiolkovsky's verdict on every flight: `Δv = Isp·g0·ln(m0/mf)`. That lone `ln` is the tyrant — Δv crawls up logarithmically with mass ratio, so propellant explodes exponentially with the Δv you crave. Dry mass is the villain that keeps the mass ratio from getting fat, and **staging** is the jailbreak: throw the empty pieces away and let Δv add stage by stage. Lay it against the ~9.4 km/s budget to orbit and you understand, in your bones, why every rocket that's ever reached space had to come apart to get there.\n\nThe tyrant never relents. But now you know exactly how engineers negotiate around it — go run the numbers yourself.",
    },
  ],
  keyTakeaways: [
    "Thrust comes from conservation of momentum: F = ṁ·Ve. A rocket pushes against its own exhaust, not the air — so it works (slightly better) in a vacuum.",
    "Specific impulse Isp = Ve/g0 is the engine's fuel economy; higher Isp means faster exhaust and more Δv per kilogram of propellant. It sits out front and helps you LINEARLY.",
    "The rocket equation Δv = Isp·g0·ln(m0/mf) governs every launch. The mass ratio enters through a natural log, so propellant grows EXPONENTIALLY with required Δv — the tyranny of the rocket equation.",
    "The g0 in the equation is a fixed conversion constant (9.81 m/s²), not the local gravity the rocket flies through; gravity losses are a separate subtraction from the Δv budget.",
    "Dry mass is dead weight dragged through the whole burn; staging escapes the exponential by jettisoning spent structure so each stage keeps a high mass ratio while Δv adds across stages.",
    "The real Δv budget to low Earth orbit is ~9.0–9.4 km/s (≈7.8 ideal orbital speed plus gravity and drag losses), which is why a single stage essentially cannot reach orbit with useful payload.",
    "Adding payload sits in both wet and dry mass and is magnified by the log, so even a small payload can cost a surprisingly large slice of Δv — and recovering it costs disproportionately more propellant.",
  ],
};
