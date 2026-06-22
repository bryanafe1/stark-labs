import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_orbital",
  slug: "orbital-mechanics",
  title: "Orbital Mechanics",
  summary:
    "A satellite doesn't hover up there by magic — it's falling, constantly, and missing the Earth. In one lesson you'll go from \"orbits are circles in space\" to deriving the speed a spacecraft must hold to keep falling forever, why higher orbits move slower, and the counterintuitive truth that to catch up to something ahead of you, you fire your engine to slow down.",
  discipline: "AEROSPACE",
  difficulty: "HARD",
  estMinutes: 26,
  tags: [
    "orbital-mechanics",
    "kepler",
    "orbits",
    "orbital-velocity",
    "hohmann-transfer",
    "astrodynamics",
    "interview-favorite",
  ],
  objectives: [
    "Explain an orbit as a balance of gravity and inertia — an object perpetually 'falling around' a planet — and shut down the myth of zero-gravity in space.",
    "State and apply Kepler's three laws, including the T² ∝ a³ relationship that ties period to orbit size.",
    "Classify orbits by eccentricity — circle, ellipse, parabola, hyperbola — and read the conic-section family at a glance.",
    "Derive and use the circular orbital velocity v = √(µ/r) and explain why higher orbits are slower, not faster.",
    "Reason qualitatively about Δv and Hohmann transfers, and resolve the 'fire backward to catch up' paradox.",
    "Compute the orbital velocity and period at a given altitude on demand — a standard aerospace interview warm-up.",
  ],
  prerequisites: [
    "Newton's law of universal gravitation (F = G·M·m/r²)",
    "Centripetal acceleration and uniform circular motion (a = v²/r)",
    "Energy and momentum conservation; basic algebra with square roots",
  ],
  interviewAngle:
    "Orbital mechanics is a signature aerospace interview filter because it rewards physical intuition over memorization — and instantly exposes candidates who think space means 'no gravity.' Interviewers love to open with 'why doesn't the ISS fall down?' The strong answer: it IS falling, continuously, but moving sideways fast enough that it keeps missing the Earth — an orbit is just a permanent state of free fall. Expect 'derive the circular orbital velocity': set gravity equal to centripetal force, G·M·m/r² = m·v²/r, cancel and get v = √(GM/r) = √(µ/r). The follow-up that trips people up: 'are higher orbits faster or slower?' Slower — v ∝ 1/√r, and Kepler's third law (T² ∝ a³) means the period grows even faster. The classic gotcha is the rendezvous paradox: 'to catch a station ahead of you, do you speed up?' No — firing prograde raises your orbit and makes you LAP slower, so to catch up you actually drop to a lower, faster orbit first. Bonus territory: Δv as the true currency of spaceflight and the Hohmann transfer as the efficient two-burn way to change orbits. Candidates who reason from energy and the v = √(µ/r) scaling, rather than reciting facts, stand out immediately.",
  blocks: [
    {
      id: "b_intro",
      kind: "PROSE",
      title: "The cannonball that never lands 🛰️",
      markdown:
        "Here's a question that has tripped up smart people for centuries: why doesn't the International Space Station fall down? It's only about 400 km up — barely a fingernail's width above the planet on any honest globe — and gravity up there is still roughly **90% as strong** as it is on your couch. There's no 'zero gravity' switch in space. So why doesn't it just drop?\n\nThe answer, first sketched by Newton, is gloriously simple: **it IS falling.** It's falling all the time. It just keeps *missing the Earth.*\n\nImagine firing a cannonball horizontally off a very tall mountain. Fire it slow and it arcs down and hits the ground a mile away. Fire it faster and it lands farther. Fire it fast *enough*, and as it falls toward the Earth, the Earth's surface curves away beneath it at exactly the same rate. The cannonball keeps falling and keeps missing — forever. That's an **orbit**. Not a thing held *up*, but a thing falling *around*.\n\nSo every orbit is a tug-of-war between two characters:\n\n- **Gravity** is the leash — always pulling the spacecraft straight toward the planet's center, trying to reel it in.\n- **Inertia** is the runaway — the spacecraft's sideways momentum, which by Newton's first law wants to carry it off in a straight line, tangent to its path, ignoring the planet entirely.\n\nGravity bends that straight-line escape into a closed curve. Get the sideways speed *just right* for your altitude and the curve closes into a stable orbit. Get it wrong and you either spiral in (too slow) or fling off toward a higher, slower orbit or even escape (too fast). The entire field of orbital mechanics is just bookkeeping on that one balance — and it starts with finding the speed that makes it work."
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "Au4Ab7PBRVA",
      title: "Watch: How Orbital Mechanics Works",
      caption:
        "A superb visual build-up of exactly the picture we're chasing — Newton's cannonball, the falling-and-missing intuition, and how speed sets the shape of the orbit. Watch it now; everything below will click far harder once you've seen the curve close into a circle."
    },
    {
      id: "b_kepler",
      kind: "PROSE",
      title: "Kepler's three laws: the rules of the dance",
      markdown:
        "Before Newton explained *why* orbits work, Johannes Kepler figured out *how* they behave, by staring at decades of planetary data. His three laws still anchor everything:\n\n1. **The Law of Ellipses.** Planets orbit in *ellipses*, not perfect circles, with the central body at one **focus** of the ellipse (not the center!). A circle is just the special case where the two foci merge. The closest point of an orbit is the **periapsis** (perigee around Earth); the farthest is the **apoapsis** (apogee). This single fact kills the grade-school picture of tidy concentric circles.\n\n2. **The Law of Equal Areas.** A line from the planet to the central body sweeps out *equal areas in equal times*. Translation: an orbiting body moves **fastest at periapsis** (closest, gravity strongest, whipping around) and **slowest at apoapsis** (farthest, dawdling). It's conservation of angular momentum in disguise — pull in close and you speed up, like a skater pulling in their arms.\n\n3. **The Harmonic Law.** The square of the orbital period is proportional to the cube of the semi-major axis: `T² ∝ a³`. Bigger orbits take *disproportionately* longer — not just because the path is longer, but because the spacecraft also moves slower out there. Double the orbit size and the period grows by `2^(3/2) ≈ 2.83×`. This is the law that lets you predict a satellite's period from nothing but its altitude.\n\nNewton later showed all three fall straight out of his inverse-square law of gravity — Kepler described the choreography; Newton wrote the music. The full version of the third law is `T² = (4π²/µ)·a³`, where `µ = G·M` is the **standard gravitational parameter** of the central body. Keep that `µ` in view — it's about to become the star of the show."
    },
    {
      id: "b_conics",
      kind: "PROSE",
      title: "One family of shapes: the conic sections 📐",
      markdown:
        "Here's a piece of mathematical beauty that every aerospace engineer carries around: under an inverse-square gravity, **every possible trajectory is a conic section** — the curves you get by slicing a cone. Which one you get depends on a single number, the **eccentricity** `e`, which measures how 'stretched' the path is:\n\n- **e = 0 — a circle.** Constant radius, constant speed. The tidy ideal (and the case we'll compute).\n- **0 < e < 1 — an ellipse.** The general *closed*, bound orbit. Speeds up at periapsis, slows at apoapsis. Almost every real satellite and planet lives here.\n- **e = 1 — a parabola.** The exact knife's-edge between bound and unbound — the trajectory of something moving at precisely *escape velocity*. It coasts away and just barely never returns.\n- **e > 1 — a hyperbola.** An *unbound* flyby. The object swings past once and is gone forever — exactly how interplanetary probes slingshot past planets for a gravity assist.\n\nEccentricity is tied to **energy**. Bound orbits (circle, ellipse) have negative total energy — the object is gravitationally trapped. Escape (parabola) sits at exactly zero. Unbound paths (hyperbola) carry positive energy — enough kinetic energy to break free of gravity's leash entirely. So when an engineer talks about 'adding energy' to a spacecraft, they're literally talking about walking it up this family: nudge a circle into an ellipse, stretch the ellipse, and if you add enough, snap the leash into a hyperbola and leave. It's all one continuum, indexed by `e`."
    },
    {
      id: "b_formula_v",
      kind: "FORMULA",
      title: "Circular orbital velocity",
      display: "v = √(µ / r)",
      latex: "v = \\sqrt{\\dfrac{\\mu}{r}}",
      variables: [
        { symbol: "v", name: "Circular orbital speed", unit: "m/s" },
        { symbol: "µ", name: "Standard gravitational parameter, µ = G·M (Earth: 3.986×10¹⁴)", unit: "m³/s²" },
        { symbol: "r", name: "Orbital radius, measured from the planet's CENTER (not its surface)", unit: "m" }
      ],
      note:
        "Derived by setting gravity equal to the centripetal force needed for a circle: G·M·m/r² = m·v²/r. The mass m of the spacecraft cancels — a feather and a freight truck orbit at the same speed. Note v ∝ 1/√r: higher orbits are SLOWER. Always use r from the planet's center: r = R_Earth + altitude, with R_Earth ≈ 6.371×10⁶ m."
    },
    {
      id: "b_derive",
      kind: "WALKTHROUGH",
      title: "Deriving v = √(µ/r) in four lines 🏆",
      steps: [
        {
          title: "Set up the two forces",
          markdown:
            "A spacecraft of mass `m` flies in a circle of radius `r` around a planet of mass `M`. Two facts must agree.\n\nFirst, the force *available*: Newton's gravity pulls it toward the center with\n\n```\nF_gravity = G·M·m / r²\n```\n\nSecond, the force *required*: anything moving in a circle of radius `r` at speed `v` needs a center-pointing (centripetal) force of\n\n```\nF_centripetal = m·v² / r\n```\n\nFor a stable circular orbit, gravity must supply *exactly* the centripetal force needed — no more, no less. So set them equal."
        },
        {
          title: "Equate them",
          markdown:
            "```\nG·M·m / r² = m·v² / r\n```\n\nThe spacecraft's own mass `m` appears on both sides. Cancel it. (This is profound: orbital speed does **not** depend on how heavy the spacecraft is. A bowling ball and a bus at the same altitude orbit at the same speed.)\n\n```\nG·M / r² = v² / r\n```"
        },
        {
          title: "Solve for v²",
          markdown:
            "Multiply both sides by `r` to clear one power of radius:\n\n```\nv² = G·M / r\n```\n\nNow fold the two central-body constants into one tidy symbol — the **standard gravitational parameter** `µ = G·M`. (Engineers use µ because it's measured far more precisely than G and M separately.) For Earth, `µ = 3.986×10¹⁴ m³/s²`.\n\n```\nv² = µ / r\n```"
        },
        {
          title: "Take the root — and meet the headline",
          markdown:
            "```\nv = √(µ / r)\n```\n\nThere it is. The speed required to hold a circular orbit at radius `r`. Stare at that `1/√r`: as `r` grows, `v` *shrinks*. Higher orbits are **slower**, not faster — the single most counterintuitive fact in the whole subject, and now you've proven it from two lines of force balance. Next time an interviewer asks, you won't recite it. You'll *derive* it."
        }
      ]
    },
    {
      id: "b_predict_higher",
      kind: "PREDICT",
      question:
        "Satellite A orbits Earth at low altitude; satellite B orbits much higher up. Which one is moving FASTER through space?",
      options: [
        { id: "a", label: "B — it's higher, so it has more energy and more speed" },
        { id: "b", label: "A — the lower satellite moves faster" },
        { id: "c", label: "Same speed — they're both in orbit around the same Earth" }
      ],
      answerId: "b",
      reveal:
        "The **lower** satellite (A) is faster — and it's not close.\n\nFrom `v = √(µ/r)`, speed scales as `1/√r`: bigger radius, smaller speed. The low-orbit ISS screams along at about **7.7 km/s**, while a satellite way out at geostationary altitude loafs along at only about **3.1 km/s**.\n\nHere's the part people find genuinely weird: the higher satellite is both *slower* AND has *more orbital energy*. How? Because climbing to a higher orbit costs a huge amount of potential energy — far more than you give back in kinetic energy as you slow down. So 'higher' means 'more total energy but lower speed.' And Kepler's third law piles on: with both a longer path *and* a slower speed, the higher orbit's period is dramatically longer (T² ∝ a³). This single fact — higher is slower — is the seed of the rendezvous paradox we'll hit in a moment. Hold onto it."
    },
    {
      id: "b_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the orbital velocity machine 🎛️",
      description:
        "Stop reading, start dragging. Slide the orbital radius r (measured from Earth's center, so the minimum here is roughly Earth's surface at 6.6×10⁶ m) and watch the required circular velocity respond. Push r outward and the speed drops — that's the 1/√r law you just derived, live. The default r = 7×10⁶ m (about 629 km altitude, a typical low Earth orbit) gives ≈ 7546 m/s — the ~7.5 km/s every LEO satellite holds. Now drag r all the way out toward geostationary (~4.2×10⁷ m) and watch the speed sag toward ~3 km/s. Higher is slower, by your own hand.",
      variables: [
        { key: "r", label: "Orbit radius r (from Earth center)", unit: "m", min: 6.6e6, max: 4.3e7, step: 1e5, default: 7e6 }
      ],
      expression: "sqrt(3.986e14 / r)",
      outputLabel: "Circular orbital velocity",
      outputUnit: "m/s",
      precision: 0
    },
    {
      id: "b_leo_geo",
      kind: "PROSE",
      title: "LEO, GEO, and the cost of getting anywhere",
      markdown:
        "Those two altitudes you just slid between are the workhorses of spaceflight, and they make the speed-vs-radius tradeoff concrete:\n\n- **LEO (Low Earth Orbit)**, roughly 160–2000 km up: fast (~7.5–7.8 km/s) and short-period (~90 minutes per lap). Home to the ISS, Starlink, and most Earth-imaging satellites. Cheap to reach, but you whip around the planet so fast that any single satellite only sees a given spot for minutes at a time.\n- **GEO (Geostationary Orbit)**, at ~35,786 km altitude (r ≈ 42,164 km from center): here the orbital period is *exactly* one day, so the satellite appears to **hang motionless** over one spot on the equator. That's why your satellite dish bolts to the wall and never moves. The price: it's slow (~3.1 km/s), far away, and expensive to reach.\n\nWhich brings us to the real currency of spaceflight. It isn't fuel mass, and it isn't money — it's **delta-v (Δv)**, the total change in velocity a spacecraft can produce with its engines. Every maneuver — launch, orbit change, course correction, landing — 'costs' some Δv, and a spacecraft has a fixed Δv budget set by its fuel and engines (via the rocket equation). Want to go from LEO to GEO? That's a Δv bill. Want to fly to Mars? A bigger one. Mission designers obsess over Δv the way travelers obsess over a luggage weight limit: every gram of maneuvering has to fit in the budget. And the most efficient way to spend it on a simple orbit change has a name."
    },
    {
      id: "b_hohmann",
      kind: "PROSE",
      title: "Hohmann transfers and the great rendezvous paradox 🤯",
      markdown:
        "Say you're in a low circular orbit and you want to reach a higher one. The fuel-efficient way is a **Hohmann transfer**: a two-burn maneuver that rides an ellipse between the two circles.\n\n1. **Burn 1 (prograde, speed up).** Fire your engine in the direction you're already moving. This raises the *opposite* side of your orbit, stretching your circle into an ellipse whose far point (apoapsis) just kisses the target orbit. You then *coast* — engines off — halfway around that ellipse.\n2. **Burn 2 (prograde again).** Arriving at apoapsis, you're moving too slowly to hold the new higher circle (remember, you've climbed and bled off speed). A second prograde burn speeds you up just enough to circularize at the higher altitude. Done.\n\nElegant, minimal, two burns. But now the brain-bender that snags nearly everyone in interviews. You're chasing a space station in the *same* orbit, a little ahead of you. Intuition screams: *hit the gas to catch up!* **That's exactly wrong.**\n\nHere's why. If you fire prograde (speed up), you don't sprint forward in your lane — you raise your orbit. And a higher orbit is *slower* (v ∝ 1/√r) with a *longer* period (T² ∝ a³). So you'd actually drop *behind* and lap the station even slower. To **catch up**, you do the opposite: fire *retrograde* (slow down), which *lowers* your orbit into a faster, shorter-period one. You scoot ahead underneath, then burn back up to rejoin. In orbital mechanics, **to catch the thing ahead of you, you slow down.** Speed and position decouple from your gut entirely — because here, your speed is dictated by your altitude, and your engine's real job is to change your altitude. Internalize that and you've crossed the line from 'knows the formulas' to 'thinks in orbits.'"
    },
    {
      id: "b_predict_catchup",
      kind: "PREDICT",
      question:
        "You're in the same circular orbit as a space station, trailing slightly behind it. You want to catch up and dock. Which burn gets you there?",
      options: [
        { id: "a", label: "Fire prograde (speed up) — accelerate to close the gap, obviously" },
        { id: "b", label: "Fire retrograde (slow down) — drop to a lower, faster orbit to scoot ahead, then burn back up" },
        { id: "c", label: "Fire straight 'up,' radially away from Earth, to lob yourself toward the station" }
      ],
      answerId: "b",
      reveal:
        "Slow down. Counterintuitive, correct, and the single most famous gotcha in the field.\n\nFiring **prograde** (a) would raise your orbit — and a higher orbit is *slower* with a *longer* period, so you'd fall even further behind. The opposite of what you want. Firing **radially** (c) mostly just rotates and reshapes your orbit without efficiently changing your along-track position; it's wasteful and won't cleanly close the gap.\n\nThe right move is **retrograde** (b): slowing down drops you into a lower orbit, which is *faster* and has a *shorter period*, so you race ahead beneath the station. Time it right, then burn prograde to climb back up and rendezvous. This is genuinely how spacecraft dock — the 'phasing orbit.' The deep lesson: in orbit, your speed is set by your altitude, so your engine doesn't directly control where you are in your lane — it controls your *altitude*, which then controls your speed and timing. Master that inversion and orbital mechanics stops feeling like magic."
    },
    {
      id: "b_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: speed and period of a LEO satellite 🔧",
      problem:
        "You're operating an Earth-observation satellite in a circular orbit at altitude h = 629 km. Earth's radius is R = 6371 km, and µ = 3.986×10¹⁴ m³/s². (a) Find the orbital radius r. (b) Find the circular orbital velocity v. (c) Find the orbital period T. (d) Sanity-check against a geostationary satellite at r = 42,164 km — is it faster or slower, and by roughly how much?",
      steps: [
        {
          label: "(a) Orbital radius (from the CENTER)",
          markdown:
            "The single most common rookie mistake is using altitude as r. You must measure from Earth's center:\n\n```\nr = R + h = 6371 km + 629 km = 7000 km = 7.0×10⁶ m\n```\n\nThat's exactly the sandbox default above."
        },
        {
          label: "(b) Circular orbital velocity",
          markdown:
            "Straight from `v = √(µ/r)`:\n\n```\nv = √(3.986×10¹⁴ / 7.0×10⁶)\n  = √(5.694×10⁷)\n  ≈ 7546 m/s ≈ 7.55 km/s\n```\n\nThe ~7.5 km/s every low-Earth-orbit satellite holds — matching the sandbox to the metre."
        },
        {
          label: "(c) Orbital period",
          markdown:
            "Period is the circumference divided by the speed (or use `T = 2π·√(r³/µ)`):\n\n```\nT = 2π·r / v = 2π × 7.0×10⁶ / 7546\n  = 4.398×10⁷ / 7546\n  ≈ 5828 s ≈ 97 minutes\n```\n\nSo this satellite laps the entire planet in about an hour and a half — roughly 15 orbits a day. That's why LEO is great for repeated global imaging."
        },
        {
          label: "(d) Compare to GEO — the twist",
          markdown:
            "For the geostationary satellite at `r = 42,164 km = 4.216×10⁷ m`:\n\n```\nv_GEO = √(3.986×10¹⁴ / 4.216×10⁷) = √(9.455×10⁶) ≈ 3075 m/s ≈ 3.07 km/s\n```\n\nThe GEO satellite is **much slower** — about 3.1 km/s vs. 7.5 km/s — even though it's far higher up. Higher orbit, lower speed: `v ∝ 1/√r`, and the radius grew by ~6×, so speed dropped by ~√6 ≈ 2.45×. Meanwhile its period stretches to a full 24 hours (T² ∝ a³), which is the whole point of GEO: it turns once per day, so it hangs fixed over one spot. Same physics, opposite extremes of the speed-vs-radius tradeoff."
        }
      ],
      answer:
        "r = 7.0×10⁶ m; v ≈ 7546 m/s (~7.55 km/s); T ≈ 5828 s (~97 min, ~15 orbits/day). The GEO satellite at r = 4.216×10⁷ m is far SLOWER at ~3.07 km/s with a 24-hour period — confirming v ∝ 1/√r: higher orbits are slower."
    },
    {
      id: "b_check_velocity",
      kind: "CHECK",
      question:
        "A spacecraft is in a circular orbit. Mission control wants to move it to a new circular orbit at FOUR times the radius. How does its orbital speed change?",
      choices: [
        { id: "s1", label: "Speed quadruples (4×) — bigger orbit needs more speed" },
        { id: "s2", label: "Speed doubles (2×)" },
        { id: "s3", label: "Speed is halved (× 1/2)" },
        { id: "s4", label: "Speed is unchanged — it's the same Earth" }
      ],
      answerId: "s3",
      explanation:
        "From `v = √(µ/r)`, speed scales as `1/√r`. Quadrupling the radius multiplies v by `1/√4 = 1/2`, so the speed is *halved*. The higher orbit is slower — the recurring, counterintuitive theme. (And by Kepler's third law, T² ∝ a³, the period grows by `4^(3/2) = 8×`, so the higher satellite is both slower per metre AND takes eight times as long per lap.) Anyone who picks 'quadruples' is reasoning from everyday driving intuition; orbits run on the inverse square root."
    },
    {
      id: "b_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Expect a spoken version of this whole lesson. The prompts and the answers that scream 'hire this person':\n\n- **\"Why doesn't the ISS fall down?\"** It IS falling — continuously — but moving sideways fast enough that the Earth curves away beneath it. An orbit is permanent free fall. (Bonus: gravity at 400 km is still ~90% of surface gravity. There's no 'zero gravity' up there.)\n- **\"Derive the circular orbital velocity.\"** Set gravity = centripetal force: `G·M·m/r² = m·v²/r`, cancel m, get `v = √(µ/r)`. Mentioning that mass cancels (a feather and a truck orbit identically) shows real understanding.\n- **\"Higher orbit — faster or slower?\"** Slower: `v ∝ 1/√r`. And the period grows even faster, `T² ∝ a³` (Kepler's third). Higher = slower speed but more total energy.\n- **\"To catch a station ahead of you, do you speed up?\"** No — fire retrograde to drop to a lower, faster orbit and scoot ahead, then burn back up. In orbit, altitude controls speed, so the engine's job is to change altitude. This is the classic filter question.\n- **\"What's a Hohmann transfer / what's Δv?\"** Hohmann = two prograde burns riding a transfer ellipse between two circular orbits, the fuel-efficient way to change altitude. Δv is the true currency of spaceflight — every maneuver spends from a fixed budget."
    },
    {
      id: "b_callout_warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Two traps that bite real engineers",
      markdown:
        "- **r is measured from the planet's CENTER, never from the surface.** The number-one arithmetic error in orbital problems is plugging altitude into `v = √(µ/r)`. You must use `r = R_planet + altitude`. For a 400 km ISS orbit, r isn't 400 km — it's 6771 km. Forget the planet's radius and your answer is wildly wrong (and your interviewer will notice instantly).\n- **'Higher energy' does NOT mean 'higher speed.'** Raising an orbit *adds* total energy but *lowers* the speed, because the gain in potential energy outweighs the loss in kinetic energy. Candidates who equate 'more energy' with 'faster' get tangled in the rendezvous paradox every time. Also remember the clean `v = √(µ/r)` is for *circular* orbits; on an ellipse, speed varies along the path (fast at periapsis, slow at apoapsis), and you'd use the vis-viva equation `v² = µ(2/r − 1/a)`."
    },
    {
      id: "b_wrap",
      kind: "PROSE",
      title: "The one path every orbit problem walks",
      markdown:
        "Every orbital question you'll face — homework, interview, or a real mission plan — walks the same path. Memorize it and you'll never be lost:\n\n1. **See the balance.** An orbit is gravity (the leash) versus inertia (the runaway). Stable means gravity supplies exactly the centripetal force the curve demands. Everything starts here.\n2. **Get r right.** Measure from the planet's *center*: `r = R_planet + altitude`. This is where careless people lose the whole problem.\n3. **Find the speed.** Circular orbit? `v = √(µ/r)`. Remember `v ∝ 1/√r` — higher is slower.\n4. **Find the period.** `T = 2π·√(r³/µ)`, the precise form of Kepler's `T² ∝ a³`. Bigger orbits take disproportionately longer.\n5. **Change orbits via Δv.** To move between orbits, spend delta-v — efficiently, with a Hohmann transfer — and never forget the paradox: to catch what's ahead, you slow down and drop lower.\n\nTwo pillars hold it all up: **Newton's gravity** (the force) and **Kepler's laws** (the resulting choreography), bolted together by the single elegant result `v = √(µ/r)`. Feel the `1/√r` in your bones, always measure r from the center, and remember that in space your engine controls *altitude*, and altitude controls everything else. Now go fall around something. 🚀"
    }
  ],
  keyTakeaways: [
    "An orbit is perpetual free fall: the spacecraft keeps falling toward the planet but moves sideways fast enough to keep missing it. Gravity (the leash) balances inertia (the runaway) — there is no 'zero gravity' in low orbit.",
    "Kepler's three laws: orbits are ellipses with the central body at a focus; bodies sweep equal areas in equal times (fast at periapsis, slow at apoapsis); and T² ∝ a³ (bigger orbits take disproportionately longer).",
    "Every trajectory under inverse-square gravity is a conic section indexed by eccentricity: e=0 circle, 0<e<1 ellipse (bound), e=1 parabola (escape), e>1 hyperbola (flyby) — a continuum set by total energy.",
    "Circular orbital velocity is v = √(µ/r), derived by setting gravity equal to centripetal force; the spacecraft's mass cancels, and v ∝ 1/√r means higher orbits are SLOWER, not faster.",
    "Always measure r from the planet's CENTER (r = R_planet + altitude), and remember a higher orbit has more total energy but lower speed — raising the orbit costs more potential energy than the kinetic energy you give back.",
    "Delta-v (Δv) is the true currency of spaceflight; the Hohmann transfer (two prograde burns on a connecting ellipse) is the efficient way to change between circular orbits within a fixed Δv budget.",
    "The rendezvous paradox: to catch a target ahead of you, fire retrograde to drop into a lower, faster orbit and scoot ahead — in orbit, your engine controls altitude, and altitude controls your speed and timing."
  ]
};
