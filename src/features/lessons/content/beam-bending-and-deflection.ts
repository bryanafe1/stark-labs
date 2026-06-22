import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_beam",
  slug: "beam-bending-and-deflection",
  title: "Beam Bending and Deflection",
  summary:
    "Why does a diving board bounce, a bookshelf sag, and an I-beam refuse to budge? In one lesson you'll go from \"beams curve when you push on them\" to deriving δ = PL³/3EI from scratch — and you'll finally understand the single trick that lets engineers make a beam 8× stiffer without adding a gram of weight.",
  discipline: "MECHANICAL",
  difficulty: "MEDIUM",
  estMinutes: 26,
  tags: [
    "beams",
    "bending",
    "deflection",
    "flexure formula",
    "Euler-Bernoulli",
    "second moment of area",
    "stiffness",
    "mechanics of materials",
    "interview-favorite",
  ],
  practiceSlug: "cantilever-tip-deflection",
  objectives: [
    "Look at any loaded beam and instantly see where it's being squeezed, where it's being stretched, and where it feels nothing at all.",
    "Wield the flexure formula σ = M·y/I like a scalpel to find exactly where a beam will break.",
    "Explain — and prove — why making a beam twice as deep makes it eight times stiffer, the secret behind every I-beam ever built.",
    "Derive δ = PL³/3EI from a blank page, the one formula every mechanical interviewer expects you to produce on command.",
    "Combine load cases by superposition so you never re-derive an elastic curve again.",
    "Tell the difference between \"won't break\" and \"won't wobble\" — and know which one actually governs most real designs.",
  ],
  prerequisites: [
    "Statics: free-body diagrams, reactions, and equilibrium",
    "Stress and strain; Young's modulus and Hooke's law",
    "Single-variable calculus: differentiation and integration",
  ],
  interviewAngle:
    "Beam bending is the single most reliable source of mechanical-engineering interview questions, because it lives at the crossroads of statics, materials, and design judgment. Interviewers can tell in about ninety seconds whether you actually understand beams or just memorized a formula sheet. The strong candidate does three things fast: (1) sketches shear and moment diagrams and points to where the moment peaks (hint: where shear crosses zero), (2) reaches for the right deflection formula — δ = PL³/3EI for a cantilever tip load is the one you must know cold — and can say where it comes from, and (3) reasons out loud about stiffness: why doubling depth roughly octuples stiffness, why an I-beam shoves material into the flanges, and why real designs are often killed by deflection limits (span/360) long before anything yields. Expect them to poke at the assumptions too: what does \"plane sections remain plane\" actually buy you, when does small-deflection theory fall apart, and why is EI — not E or I alone — the real measure of a beam's stiffness?",
  blocks: [
    {
      id: "b_intro",
      kind: "PROSE",
      title: "The diving board mystery 🏊",
      markdown:
        "Picture a diving board. Someone walks to the end, it droops, they bounce, it springs back. Totally ordinary — and totally bizarre, when you think about it. That board is a solid slab of fiberglass. Why does the *end* dip while the part bolted to the platform barely moves? And why does a thin board bend like a noodle while a board only a little bit thicker feels like concrete?\n\nHere's the thing that trips everyone up: when a beam bends, the top and bottom of the *same piece of material* are doing opposite things. One face is being stretched. The other is being crushed. And somewhere in the middle is a magical layer that feels nothing at all — the **neutral surface**. Cut a cross-section and that surface shows up as a line called the **neutral axis**, which (for a normal beam of one material) runs right through the centroid.\n\nThe entire job of bending theory is to take one number — the internal **bending moment** `M(x)` at a slice — and answer two completely different questions:\n\n- **Will it break?** Answered by bending stress, `σ = M·y/I`.\n- **Will it sag too much to be usable?** Answered by curvature, `1/R = M/(EI)`, which you integrate into deflection.\n\nThose are *not* the same question, and that gap is where careers are made. A floor can be rock-solid safe against breaking and still feel like a trampoline. By the end of this lesson you'll know exactly why — and you'll be able to design your way out of it."
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "f08Y39UiC-o",
      title: "Watch: Stresses in Beams",
      channel: "The Efficient Engineer",
      caption:
        "A gorgeous 12-minute build-up of exactly the picture we're chasing: how bending turns into stress across a section. Watch it now — everything below will click harder once you've seen the fibers stretch and squeeze."
    },
    {
      id: "b_assumptions",
      kind: "PROSE",
      title: "The fine print (a.k.a. why the formula even works)",
      markdown:
        "The flexure formula `σ = M·y/I` looks suspiciously simple. The reason it works is a tidy little stack of assumptions — and knowing them is the difference between someone who *memorized* a formula and someone who *gets* it. (Guess which one the interviewer wants to hire.)\n\n1. **Plane sections remain plane.** A flat cross-section stays flat after bending — it just tilts. This one assumption is the whole game: it forces strain to vary *linearly* with distance `y` from the neutral axis, `ε(y) = -y/R`.\n\n2. **The material is linear-elastic (Hooke's law).** `σ = E·ε`. Stack this on assumption 1 and stress also goes linear in `y`: tension on one face, compression on the other, zero in the middle. A perfect seesaw of stress.\n\n3. **Small deflections.** We approximate curvature as `y''` instead of the ugly exact expression. Fine for almost every structural beam — slopes are a few degrees at most.\n\n4. **Slender beam, bending about a principal axis, no twisting.** Shear deformation is ignored (that's the \"Bernoulli\" simplification; Timoshenko theory adds it back for stubby beams).\n\nNow the payoff. Demand that the stresses produce no net axial force (that's what pins the neutral axis to the centroid) and that their moment equals the applied `M`: `M = ∫ σ·y dA = (E/R)∫ y² dA = (E/R)·I`. Plug `E/R = M/I` back in and out pops the headline result, `σ = M·y/I`. We'll retrace that move slowly in the walkthrough — for now, just notice how *little* you had to assume to get it."
    },
    {
      id: "b_flexure_formula",
      kind: "FORMULA",
      title: "The flexure (bending) formula",
      display: "σ = M·y / I",
      latex: "\\sigma = \\dfrac{M y}{I}",
      variables: [
        { symbol: "σ", name: "Bending (normal) stress at distance y from the neutral axis", unit: "Pa" },
        { symbol: "M", name: "Internal bending moment at the section", unit: "N·m" },
        { symbol: "y", name: "Distance from the neutral axis (centroid)", unit: "m" },
        { symbol: "I", name: "Second moment of area about the neutral axis", unit: "m⁴" }
      ],
      note:
        "Stress maxes out at the outermost fiber, y = c — the surface, never the middle. Pros pre-divide and define the section modulus S = I/c, so σ_max = M/S. Bigger S, lower stress for the same moment. That's the whole ballgame for strength."
    },
    {
      id: "b_predict_orientation",
      kind: "PREDICT",
      question:
        "You have a 2×4 wooden plank to bridge a gap and stand on. To make it sag the LEAST, how should you lay it down?",
      options: [
        { id: "a", label: "Flat (4-inch face up) — more surface to spread your weight" },
        { id: "b", label: "On edge (4-inch dimension vertical, tall and skinny)" },
        { id: "c", label: "Doesn't matter — it's the same plank either way" }
      ],
      answerId: "b",
      reveal:
        "On edge, every time. And it's not a small difference — it's **4× stiffer** standing tall.\n\nWhy? Stiffness comes from `I = b·h³/12`, and the *depth in the direction of the load* (`h`) is cubed. Lay the 2×4 flat and your \"height\" is the puny 2-inch dimension. Stand it on edge and the height becomes the full 4 inches.\n\nRatio: `(4³)/(2³) = 64/8 = 8` for the depth term, but you also lose width (4 → 2), so net `8 × (2/4) = 4`. Four times less sag, same plank, zero extra material. This is *exactly* why floor joists are always installed tall and skinny, never flat. Keep this `h³` instinct — we're about to make it rigorous."
    },
    {
      id: "b_second_moment",
      kind: "PROSE",
      title: "The cube that rules everything 📐",
      markdown:
        "Meet the most important quantity in this whole lesson: the **second moment of area**, `I = ∫ y² dA`. (People sloppily call it the \"moment of inertia\" of the section — ignore that, it has nothing to do with mass.) It measures how a cross-section's area is *spread out* relative to the neutral axis. And because every speck of area gets weighted by `y²`, material far from the center is wildly more valuable than material near it.\n\nLet's derive it for a rectangle of width `b` and height `h`, bending about the horizontal centroidal axis:\n\n```\nI = ∫(from -h/2 to h/2) y² · (b dy) = b · [y³/3] (from -h/2 to h/2) = b·h³/12\n```\n\nNow *stare at those exponents.* `I` is **linear in width** but scales with the **cube of depth**. Add width, get a proportional return. Add depth, get a *cubed* return — double the depth and stiffness goes up by 2³ = **eight times**. This one fact quietly explains a huge chunk of the built world:\n\n- Floor joists stand tall and skinny. Laying a 2×8 flat throws away most of its strength.\n- An **I-beam** banishes material to the top and bottom *flanges*, as far from the neutral axis as it can, with a thin *web* just to hold them apart. Almost all the bending resistance lives in the flanges — the `y²` weighting makes the middle nearly useless.\n- A hollow tube is *almost as stiff* as a solid rod of the same outer diameter, at a fraction of the weight, because the core you drilled out was the deadweight all along.\n\nAnd the **section modulus** `S = I/c` rolls `I` and geometry into the one number that sets peak stress, `σ_max = M/S`. For a rectangle, `S = b·h²/6`."
    },
    {
      id: "b_rect_formula",
      kind: "FORMULA",
      title: "Second moment of area of a rectangle",
      display: "I = b·h³ / 12",
      latex: "I = \\dfrac{b h^3}{12}",
      variables: [
        { symbol: "I", name: "Second moment of area about the centroidal (horizontal) axis", unit: "m⁴" },
        { symbol: "b", name: "Width of the rectangle (perpendicular to bending)", unit: "m" },
        { symbol: "h", name: "Height/depth of the rectangle (along the bending direction)", unit: "m" }
      ],
      note:
        "Depth enters as h³ — that's the whole story. For a solid circle of diameter d, I = π·d⁴/64. And the parallel-axis theorem, I = I_centroid + A·d², is how you Lego together composite sections like I-beams from simple rectangles."
    },
    {
      id: "b_check_shape",
      kind: "CHECK",
      question:
        "A rectangular beam bends about its horizontal axis. Keep the cross-sectional area exactly the same, but make the section twice as deep and half as wide. What happens to its bending stiffness (I)?",
      choices: [
        { id: "c1", label: "Stays the same — area is unchanged" },
        { id: "c2", label: "Doubles" },
        { id: "c3", label: "Increases by a factor of 4" },
        { id: "c4", label: "Increases by a factor of 8" }
      ],
      answerId: "c3",
      explanation:
        "I = b·h³/12. Swap b → b/2 and h → 2h: I' = (b/2)·(2h)³/12 = (b/2)·8h³/12 = 4·(b·h³/12) = 4I. Halving the width costs you a factor of 2, but doubling the depth hands back 2³ = 8. Net: ×4. Same material, four times stiffer — pure geometry, no extra cost. This is why orientation and depth aren't details; they're the design."
    },
    {
      id: "b_qvm",
      kind: "PROSE",
      title: "Load → shear → moment: the chain reaction",
      markdown:
        "To deflect a beam we need `M(x)` — and `M(x)` comes from the loading through two of the most elegant equations in all of engineering. Take a tiny slice of beam, length `dx`, carrying distributed load `w(x)` (force per length, positive downward), with shear `V` and moment `M` on its faces.\n\nVertical equilibrium gives you the rate of change of shear:\n\n```\ndV/dx = -w(x)\n```\n\nMoment equilibrium gives the rate of change of moment:\n\n```\ndM/dx = V(x)\n```\n\nTranslate those from math into instinct:\n\n- The **shear diagram is the (negative) running total of the load.** A point load makes shear jump straight off a cliff.\n- The **moment diagram is the running total of the shear.** The slope of the moment curve at any point *is* the shear there.\n- So the bending moment hits a peak **exactly where the shear crosses zero** (`dM/dx = V = 0`). This is the single most useful trick in beam problems: want the worst-case stress? Find where `V = 0`.\n\nChain them and you get `d²M/dx² = -w(x)`. And since `M = EI·y''` (coming up next), the entire beam collapses into one fourth-order equation `EI·y'''' = w(x)`. Beautiful — but for hand work you'll almost always find `M(x)` first and integrate twice, because it's easier and you stay in touch with the physics."
    },
    {
      id: "b_callout_shear_zero",
      kind: "CALLOUT",
      variant: "tip",
      title: "The 5-second moment hack",
      markdown:
        "Because `dM/dx = V`, the bending moment peaks wherever the shear diagram crosses zero. Central point load on a simple beam? Midspan. Uniform load? Also midspan. Find the zero-shear point first, compute the moment *there*, and you've found where σ is biggest and where the beam is most likely to snap. Don't grind through the whole diagram if all you need is the peak."
    },
    {
      id: "b_elastic_curve",
      kind: "PROSE",
      title: "The elastic curve: where shape comes from",
      markdown:
        "Now we connect moment to *shape* — the actual sag you can see. Curvature relates to moment by `1/R = M/(EI)`, and under the small-slope assumption curvature is just `y'' = d²y/dx²`. Put them together:\n\n```\nEI · d²y/dx² = M(x)\n```\n\nThis is the **Euler–Bernoulli (elastic-curve) equation**, and the star of the show is `EI`, the **flexural rigidity** — the beam's total resistance to bending. Crucially, it's a *product*. A stiff material (high `E` — steel is ~200 GPa) and a smart shape (high `I`) both pull their weight, and you genuinely cannot judge a beam from either one alone. A deep wooden beam (`E ≈ 10 GPa`) can stomp a thin steel strip. Steel isn't magic; *EI* is.\n\nTo get the sag, you integrate — and each integration spits out a constant that you nail down with **boundary conditions** from the supports:\n\n- **Fixed (clamped) end:** zero deflection *and* zero slope. `y = 0`, `y' = 0`.\n- **Pinned/roller support:** zero deflection, but free to rotate. `y = 0`, slope unknown.\n- **Free end:** zero moment, zero shear (nothing's holding it).\n\nIntegrate once for **slope** `y'(x)`; integrate again for **deflection** `y(x)`. Sign conventions wander between textbooks, but the *magnitudes* of the standard results are universal. Let's go derive the most famous one of all."
    },
    {
      id: "b_walkthrough",
      kind: "WALKTHROUGH",
      title: "Deriving the legend: δ = PL³/3EI 🏆",
      steps: [
        {
          title: "Set up the geometry and the internal moment",
          markdown:
            "Picture a cantilever — a beam bolted into a wall at `x = 0`, sticking out freely to `x = L`, with a downward load `P` hanging off the free tip. (Think: your diving board.) Measure `x` from the wall.\n\nTo find the internal moment at a section `x`, cut the beam there and look at the *right-hand* chunk — the part from `x` out to the tip. All it carries is the load `P`, and the lever arm from the cut to the load is `(L − x)`.\n\nSagging-positive convention gives:\n\n```\nM(x) = -P·(L - x)\n```\n\nMost negative (hogging) at the wall, `M(0) = -P·L`; zero at the free tip, `M(L) = 0`. Exactly the picture your intuition expects — the wall is doing all the work."
        },
        {
          title: "Write the Euler–Bernoulli equation",
          markdown:
            "Drop `M(x)` into `EI·y'' = M(x)`:\n\n```\nEI · y''(x) = -P·(L - x) = -P·L + P·x\n```\n\nWe'll integrate this twice. `EI` is constant along the beam (one material, constant section), so it just rides along for the trip."
        },
        {
          title: "Integrate once → the slope",
          markdown:
            "Integrate both sides with respect to `x`:\n\n```\nEI · y'(x) = -P·L·x + P·x²/2 + C₁\n```\n\nNow cash in the first boundary condition. The wall clamps the beam, so the slope there is zero: `y'(0) = 0`. Plug in `x = 0` and every term dies except `C₁`:\n\n```\nC₁ = 0\n```\n\nSo `EI · y'(x) = -P·L·x + P·x²/2`. One constant down."
        },
        {
          title: "Integrate again → the deflection",
          markdown:
            "Integrate one more time:\n\n```\nEI · y(x) = -P·L·x²/2 + P·x³/6 + C₂\n```\n\nSecond boundary condition: the wall holds the end fixed, so `y(0) = 0`. Set `x = 0`:\n\n```\nC₂ = 0\n```\n\nAnd there it is — the full shape of the bent beam:\n\n```\ny(x) = (1/EI) · ( P·x³/6 - P·L·x²/2 )\n```"
        },
        {
          title: "Evaluate at the tip — and meet a legend",
          markdown:
            "Biggest sag is at the free end, `x = L`:\n\n```\ny(L) = (1/EI) · ( P·L³/6 - P·L³/2 )\n      = (P·L³/EI) · (1/6 - 3/6)\n      = (P·L³/EI) · (-2/6)\n      = -P·L³ / (3·EI)\n```\n\nThe minus sign just says the tip drops (same direction as `P`). Take the magnitude:\n\n```\nδ = P·L³ / (3·EI)\n```\n\nThat's it. The one formula every mechanical engineer is expected to produce on demand — and you just built it from `EI·y'' = M(x)` and two boundary conditions. Next time an interviewer asks, you won't recite it. You'll *derive* it."
        }
      ]
    },
    {
      id: "b_cantilever_formula",
      kind: "FORMULA",
      title: "Cantilever tip deflection (end point load)",
      display: "δ = P·L³ / (3·E·I)",
      latex: "\\delta = \\dfrac{P L^3}{3 E I}",
      variables: [
        { symbol: "δ", name: "Deflection at the free tip", unit: "m" },
        { symbol: "P", name: "Point load at the free end", unit: "N" },
        { symbol: "L", name: "Length of the cantilever", unit: "m" },
        { symbol: "E", name: "Young's modulus of the material", unit: "Pa" },
        { symbol: "I", name: "Second moment of area of the cross-section", unit: "m⁴" }
      ],
      note:
        "δ grows with the CUBE of length — double the overhang and the tip sags eight times as much. EI in the denominator is the flexural rigidity; when a section is given as a single E·I number (N·m²), you can plug it straight in — like in the sandbox right below. Go play."
    },
    {
      id: "b_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the cantilever deflection machine 🎛️",
      description:
        "Stop reading, start dragging. Crank the tip load P, stretch the length L, and stiffen the beam with EI — then watch the tip deflection react. Pay special attention to L: nudge it and the sag explodes, because of that L³ term. The defaults (P = 1000 N, L = 2 m, EI = 5×10⁶ N·m²) land on exactly the 0.533 mm you'll compute by hand in the linked practice problem. The ×1000 just converts metres to millimetres so the number is readable.",
      variables: [
        { key: "P", label: "Tip load P", unit: "N", min: 100, max: 5000, step: 100, default: 1000 },
        { key: "L", label: "Length L", unit: "m", min: 0.5, max: 5, step: 0.1, default: 2 },
        { key: "EI", label: "Flexural rigidity EI", unit: "N·m²", min: 1e6, max: 2e7, step: 1e6, default: 5e6 }
      ],
      expression: "P * L^3 / (3 * EI) * 1000",
      outputLabel: "Tip deflection δ",
      outputUnit: "mm",
      precision: 3
    },
    {
      id: "b_predict_double_length",
      kind: "PREDICT",
      question:
        "In the sandbox you just played with: keep P and EI fixed, but DOUBLE the cantilever's length L. What happens to the tip deflection?",
      options: [
        { id: "a", label: "It doubles (2×)" },
        { id: "b", label: "It quadruples (4×)" },
        { id: "c", label: "It goes up 8× — the tip sags eight times as much" },
        { id: "d", label: "It barely changes; length isn't that important" }
      ],
      answerId: "c",
      reveal:
        "Eight times. `δ = PL³/3EI`, and length is **cubed**: double `L` → 2³ = 8× the deflection.\n\nGo back to the slider and try it — bump L from 2 m to 4 m and watch the number rocket. This is why a long, skinny shelf bracket or an over-reaching diving board feels like jelly: every extra inch of reach you give it gets *cubed* against you. Want to fix a bouncy beam? Shortening the span is dramatically more effective than beefing up the material. (And if it's a distributed load, it's even worse — that scales with L⁴.)"
    },
    {
      id: "b_standard_cases",
      kind: "PROSE",
      title: "The cheat sheet you'll actually use",
      markdown:
        "Real engineers don't re-derive the elastic curve every time — that would be madness. A handful of standard results cover almost everything, and you stitch them together with **superposition**. Because the governing equation is linear, the sag from several loads at once is just the *sum* of the sags each would cause alone (as long as you stay elastic and small-deflection). Add the rows of the table. Done.\n\n**Cantilever, point load P at the free end** (max sag at the tip):\n\n```\nδ = P·L³ / (3·EI)\n```\n\n**Simply-supported beam, point load P at midspan** (max sag at the center):\n\n```\nδ = P·L³ / (48·EI)\n```\n\n**Simply-supported beam, uniform load w** (force per length; max sag at the center):\n\n```\nδ = 5·w·L⁴ / (384·EI)\n```\n\nThings worth burning into memory:\n\n- The simply-supported center-load beam is **16× stiffer** than the cantilever for the same span and load (`PL³/48EI` vs `PL³/3EI`). *How* you hold a beam matters more than almost anything else.\n- Distributed load sag scales as `L⁴` — even hungrier for span than the `L³` of a point load.\n- **Superposition in action:** a simple beam carrying *both* a central load `P` and a uniform load `w` sags at midspan by `PL³/48EI + 5wL⁴/384EI`. Just add the entries. That's literally how a real beam — its own weight plus the load on it — gets analyzed by hand."
    },
    {
      id: "b_check_super",
      kind: "CHECK",
      question:
        "A simply-supported steel beam with a midspan point load P sags 6 mm at the center. Take that exact same load P and beam (same L, same EI) and instead hang it off the tip of a cantilever. Roughly how much does the tip sag now?",
      choices: [
        { id: "s1", label: "About 6 mm — same load, same beam" },
        { id: "s2", label: "About 0.4 mm — the cantilever is much stiffer" },
        { id: "s3", label: "About 96 mm — the cantilever is 16× floppier" },
        { id: "s4", label: "Exactly 3 mm — half as stiff" }
      ],
      answerId: "s3",
      explanation:
        "Simply-supported midspan: δ = PL³/48EI. Cantilever tip: δ = PL³/3EI. Ratio = 48/3 = 16, and the cantilever is the *floppier* one. So 6 mm × 16 = 96 mm. Same beam, same load, sixteen times the sag — purely from how it's held. End conditions are a first-order design decision, never an afterthought."
    },
    {
      id: "b_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: sizing a steel shelf bracket 🔧",
      problem:
        "You're designing a horizontal steel cantilever bracket that sticks out L = 0.6 m from a wall and must hold P = 800 N at its tip. The cross-section is a solid rectangle, b = 20 mm wide × h = 40 mm deep (bending about the strong, horizontal axis). Steel: E = 200 GPa. (a) Find I. (b) Find the max bending stress and where it lives. (c) Find the tip deflection δ. (d) The serviceability limit is span/360 — does it pass?",
      steps: [
        {
          label: "(a) Second moment of area",
          markdown:
            "Convert to metres: b = 0.020 m, h = 0.040 m.\n\n```\nI = b·h³/12 = 0.020 × (0.040)³ / 12\n  = 0.020 × 6.4×10⁻⁵ / 12\n  = 1.28×10⁻⁶ / 12\n  = 1.067×10⁻⁷ m⁴\n```"
        },
        {
          label: "(b) Maximum bending stress",
          markdown:
            "The moment is biggest at the wall: `M_max = P·L = 800 × 0.6 = 480 N·m`. The extreme fiber sits at `c = h/2 = 0.020 m`.\n\n```\nσ_max = M·c / I = 480 × 0.020 / 1.067×10⁻⁷\n      = 9.6 / 1.067×10⁻⁷\n      ≈ 9.0×10⁷ Pa = 90 MPa\n```\n\nThis lives on the top and bottom surfaces *at the wall* — top fiber in tension, bottom in compression. At 90 MPa it's comfortably under structural steel's ~250 MPa yield. Strength-wise: totally safe. (Hold that thought.)"
        },
        {
          label: "(c) Tip deflection",
          markdown:
            "First the flexural rigidity: `EI = 200×10⁹ × 1.067×10⁻⁷ = 2.133×10⁴ N·m²`.\n\n```\nδ = P·L³ / (3·EI)\n  = 800 × (0.6)³ / (3 × 2.133×10⁴)\n  = 800 × 0.216 / 6.40×10⁴\n  = 172.8 / 6.40×10⁴\n  = 2.70×10⁻³ m = 2.70 mm\n```"
        },
        {
          label: "(d) Serviceability check — the twist",
          markdown:
            "The limit is `L/360 = 600 mm / 360 = 1.67 mm`. Your bracket sags **2.70 mm**. That's over the line.\n\nSo even though the steel is nowhere near yielding (90 MPa ≪ 250 MPa), the bracket **fails** — it's just too floppy. This design is **deflection-governed**, not strength-governed, and that's incredibly common in the real world. The fix? Lean on `δ ∝ 1/h³`: bump depth from 40 mm to 48 mm and I jumps by (48/40)³ ≈ 1.73×, dropping δ to ~1.56 mm. Now it passes — and you barely added material, because depth is cubed in your favor."
        }
      ],
      answer:
        "I ≈ 1.07×10⁻⁷ m⁴; σ_max ≈ 90 MPa at the wall (safe vs. ~250 MPa yield); δ ≈ 2.70 mm. The bracket PASSES strength but FAILS the span/360 ≈ 1.67 mm stiffness limit — it's deflection-governed and needs a deeper section. Strength ≠ stiffness."
    },
    {
      id: "b_callout_warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Two traps that bite real engineers",
      markdown:
        "- **\"It won't break\" is NOT \"it's good enough.\"** Like the bracket above, a beam can be miles from yielding and still too bouncy to use. Always run *both* the `σ = M·y/I` strength check and the deflection check. A huge fraction of real designs die on serviceability (span/360, span/240), not strength.\n- **Small-deflection theory has an expiration date.** `EI·y'' = M(x)` treats `y''` as the curvature, which only holds while slopes stay small (a few degrees). For wildly flexible things — fishing rods, leaf springs, long thin cantilevers under heavy load — you need large-deflection (\"elastica\") theory, and PL³/3EI will *overstate* the sag. Also: the flexure formula is blind to stress concentrations at holes, fillets, and load points. Those bite too."
    },
    {
      id: "b_predict_material",
      kind: "PREDICT",
      question:
        "Your steel beam is strong enough but sags a hair too much. A teammate says \"easy — swap it for aluminum, it's lighter and we've got plenty in stock.\" Same shape, same dimensions. What happens to the deflection?",
      options: [
        { id: "a", label: "It improves — aluminum is a modern high-tech metal" },
        { id: "b", label: "No change — deflection only depends on the shape (I)" },
        { id: "c", label: "It gets about 3× WORSE — aluminum is much less stiff" }
      ],
      answerId: "c",
      reveal:
        "It gets dramatically *worse* — roughly **3× more sag**. Oof.\n\nDeflection depends on `EI`, and aluminum's Young's modulus (`E ≈ 70 GPa`) is about a third of steel's (`E ≈ 200 GPa`). Same `I`, but a third of the `E`, so triple the deflection. Aluminum being lighter and shinier doesn't help here at all — stiffness is about `E`, not strength or weight.\n\nThe real lesson: when a beam is too floppy, your best lever is almost never the material. It's **geometry** — go deeper (`I ∝ h³`) or shorten the span (`δ ∝ L³`). Those move the needle by factors of 8, not 3. Reach for the shape before you reach for a fancier alloy."
    },
    {
      id: "b_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Expect a spoken version of this whole lesson. The prompts and the answers that scream \"hire this person\":\n\n- **\"Tip deflection of a cantilever with an end load?\"** `δ = PL³/3EI`. Add \"derived by integrating EI·y'' = M(x) = -P(L-x) twice, with y(0)=0 and y'(0)=0\" and you're suddenly the strongest candidate of the day.\n- **\"Why is an I-beam so efficient?\"** Because `I = ∫y² dA` weights material by the *square* of its distance from the neutral axis — so the flanges (way out at the edges) do the bending and the web just carries shear and holds them apart.\n- **\"You doubled the beam's depth — what happens to stiffness and stress?\"** Stiffness (`I ∝ h³`) jumps ~8×; peak stress (`σ = M/S`, `S ∝ h²`) drops ~4× for the same moment.\n- **\"Stress is fine but it feels bouncy — now what?\"** It's deflection-governed: go deeper (`I`) or shorten the span, since `δ ∝ L³/EI`. Bonus points for noting that swapping steel for aluminum *worsens* deflection (~3× lower E).\n- **\"What does 'plane sections remain plane' actually buy you?\"** A linear strain — and therefore linear stress — distribution across the section. The entire flexure formula stands on it."
    },
    {
      id: "b_wrap",
      kind: "PROSE",
      title: "The one path every beam problem walks",
      markdown:
        "Every beam problem you'll ever face — homework, interview, or real bridge — follows the exact same four steps. Memorize the path and you'll never be lost:\n\n1. **Loads → reactions.** Statics: free-body diagram, equilibrium.\n2. **Reactions → shear & moment.** Use `dV/dx = -w` and `dM/dx = V`. The moment peaks where shear crosses zero.\n3. **Moment → stress.** Flexure formula `σ = M·y/I`, checked against allowable stress. *(Will it break?)*\n4. **Moment → deflection.** Integrate `EI·y'' = M(x)` with boundary conditions — or just quote and superpose the standard cases — and check against limits like span/360. *(Will it wobble?)*\n\nTwo pillars hold it all up: the **flexure formula** for stress and the **Euler–Bernoulli equation** for shape, bolted together by the section's `I` and the material's `E`. Nail the cantilever derivation, feel the `h³` of `I` and the `L³`/`L⁴` of deflection in your bones, and never forget a real beam has to be *both* strong and stiff. Now go run it for real on the linked practice problem — it's literally the cantilever from the sandbox above. Go bend something. 💪"
    }
  ],
  keyTakeaways: [
    "A bending beam stretches one face, crushes the other, and feels nothing at the neutral axis — and σ = M·y/I turns the moment into that linear stress, biggest at the surface.",
    "I = ∫y² dA is everything: for a rectangle I = b·h³/12, so depth is CUBED — double the depth, 8× the stiffness. That's the I-beam's entire secret.",
    "dV/dx = -w and dM/dx = V mean the bending moment peaks exactly where the shear diagram crosses zero. Find V = 0, find your worst case.",
    "EI·y'' = M(x), integrated twice with boundary conditions, gives the elastic curve — and flexural rigidity EI (never E or I alone) is what stiffness really means.",
    "Know these cold: cantilever tip δ = PL³/3EI, simple-beam center load δ = PL³/48EI, UDL δ = 5wL⁴/384EI. Superpose to combine loads — no re-deriving.",
    "Deflection scales with L³ (point load) or L⁴ (distributed) — span and support conditions crush material choice as the dominant lever.",
    "\"Won't break\" ≠ \"good enough.\" Always check strength (σ ≤ allowable) AND stiffness (δ ≤ span/360). Tons of real designs are deflection-governed."
  ]
};
