import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_buckling",
  slug: "column-buckling-and-stability",
  title: "Column Buckling: How Strong Things Fail by Folding",
  summary:
    "Press on a soda can and it holds a person — until it doesn't, and it crumples in an instant. That's buckling: a stability failure, not a strength one. We'll go from the ruler in your hands to Euler's π²EI/(KL)², watch end conditions quadruple your capacity, play in a sandbox, and find the exact line where Euler lies to you and Johnson takes over.",
  discipline: "CIVIL",
  difficulty: "MEDIUM",
  estMinutes: 28,
  tags: [
    "buckling",
    "stability",
    "Euler",
    "columns",
    "slenderness",
    "structural",
    "mechanics of materials",
    "failure modes",
  ],
  practiceSlug: "euler-buckling-load",
  objectives: [
    "Tell a stability (buckling) failure apart from a strength (yield/crush) failure — and call which one wins.",
    "Build Euler's load Pcr = π²EI/(K·L)² from scratch, and know why it's secretly an eigenvalue problem.",
    "Grab the right effective-length factor K for the four classic end conditions on sight.",
    "Compute slenderness λ = K·L/r and critical stress σcr = π²E/λ², and read what r is really telling you.",
    "Spot the exact slenderness where Euler stops being true and the Johnson parabola takes over.",
    "Explain why every real column fails BELOW the textbook Euler load — and never use Pcr as an allowable.",
  ],
  prerequisites: [
    "Axial stress and strain (σ = P/A)",
    "Second moment of area I and the parallel-axis idea",
    "Beam bending relation M = E·I·y''",
    "Basic ordinary differential equations (second-order, constant coefficient)",
  ],
  interviewAngle:
    "Buckling is a favorite screening topic because it cleanly separates candidates who memorize σ = P/A from those who actually understand failure modes. Interviewers hand you a long, slender strut and ask \"so... how does this fail?\" — and the strong answer leads with stability, not strength. Expect them to probe the scaling intuition (Pcr ∝ I and ∝ 1/L², so doubling the length quarters the capacity), the meaning of the effective-length factor K (and why clamping the ends helps so much), and the trap that Euler's formula contains no yield or strength term at all. The sharpest follow-up is \"when is Euler invalid?\" — they want short columns, the slenderness transition, the Johnson parabola, and the fact that real, imperfect columns always fail below the ideal Euler load. Being able to sketch the σcr-versus-λ curve on a whiteboard, label the Euler hyperbola and the yield cutoff, and name the tangent point is a flat-out signal of depth.",
  blocks: [
    {
      id: "b_hook_prose",
      kind: "PROSE",
      title: "The soda can that holds a person 🥤",
      markdown:
        "An empty aluminum soda can can support a fully grown adult standing on top of it. Seriously — the wall is paper-thin, yet it carries hundreds of newtons. Then someone flicks the side, the wall dimples, and the whole thing collapses to a hockey puck in a fraction of a second.\n\nNothing about the aluminum changed. It didn't get weaker. The can simply *lost its nerve* — it could no longer hold its own shape under load. That's **buckling**, and it's a completely different beast from the failures you're used to.\n\nMost failure checks you've met are *strength* checks: find a stress, compare it to a limit, done. Buckling laughs at that. A slender column can give out while the stress is a tiny fraction of yield — not because the material ran out of strength, but because the *straight* shape ran out of **stability**.\n\nBy the end of this lesson you'll predict exactly when a column folds, why fixing its ends can quadruple how much it carries, and the one number that tells you whether to trust Euler or fire him. First, watch it happen.",
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "vtDyH1J25ug",
      title: "Watch: What is (Euler) Column Buckling?",
      channel: "StructEd",
    },
    {
      id: "b_intuition_prose",
      kind: "PROSE",
      title: "Grab a ruler. This is the whole idea.",
      markdown:
        "Find a plastic ruler — or just picture one. Press straight down on both ends with your palms.\n\nGentle push: it stays dead straight and shortens by a hair. Push harder... still straight... harder still — then **snap**, it bows sideways and your hands lurch together as it folds with almost no extra force. Ease off and it springs right back, totally undamaged.\n\nThat snap is everything. Nothing yielded. Nothing broke. The ruler just decided that staying straight was no longer worth it and switched to a bent shape. The load where that happens is the **critical load**, `Pcr`, and the event is **elastic buckling**.\n\nHere's the mental flip that trips people up: buckling is governed by **stiffness and geometry** — E, I, length, how the ends are held — and *not* by how strong the material is. You can have a perfectly elastic, un-yielded member that's useless because it can't keep its shape. For struts, bracing, piston rods, lattice chords, the long columns in a building's frame? Stability is what sizes them, not strength.\n\nNow think of a spaghetti noodle versus a stubby pencil stub. Same idea, wildly different fates — and that difference has a name we'll get to: slenderness.",
    },
    {
      id: "b_predict_length",
      kind: "PREDICT",
      question:
        "You take a column and double its length — same material, same cross-section, same pinned ends. How much load can the longer one carry before it buckles?",
      options: [
        { id: "p1", label: "About the same — length barely matters" },
        { id: "p2", label: "Half as much (½×)" },
        { id: "p3", label: "A quarter as much (¼×)" },
        { id: "p4", label: "An eighth as much (⅛×)" },
      ],
      answerId: "p3",
      reveal:
        "**A quarter. ¼×.** Brutal, right? Euler's load goes as `Pcr ∝ 1/L²`, so doubling the length multiplies the denominator by 4 and the capacity craters to 25%. Length isn't a linear penalty — it's a *squared* one. This single fact is why slender things buckle and why a spaghetti noodle is hopeless in compression while a short stub of the same pasta shrugs you off. Hold onto this; we'll prove it in three minutes.",
    },
    {
      id: "b_equilibrium_prose",
      kind: "PROSE",
      title: "Bifurcation: when \"straight\" stops being the only option",
      markdown:
        "Picture the ideal column: perfectly straight, loaded dead-center, uniform material, pinned at both ends. For small loads the only equilibrium shape is *straight* — nudge it and it springs back, so straight is **stable**. As `P` climbs, the bending stiffness fighting to keep it straight starts losing ground to the axial load, which amplifies any sideways wobble.\n\nAt `P = Pcr`, something genuinely new appears: a *bent* equilibrium shape becomes possible right alongside the straight one. Suddenly \"straight\" isn't the unique answer anymore. Mathematicians call this a **bifurcation** (a branch point); engineers call it the onset of buckling. Below Pcr the column is stable; *at* Pcr it's neutrally stable (the ruler trembling on the edge); above it, straight is unstable and the member dives into the bent mode.\n\nThis is why the math becomes an **eigenvalue problem**. We're not asking \"how much does it deflect?\" — for a perfect column below Pcr the honest answer is *exactly zero*. We're asking the sneakier question: \"for which loads does a nonzero bent shape even *exist* as a valid equilibrium?\" Those special loads are the eigenvalues. The smallest one is the critical load we care about, and its shape is the first buckling mode.",
    },
    {
      id: "b_governing_walkthrough",
      kind: "WALKTHROUGH",
      title: "Cooking up Euler's load: from EI·y'' + P·y = 0 to π²EI/L²",
      steps: [
        {
          title: "1. Let the column lean, then slice it",
          markdown:
            "Take a pinned-pinned column of length `L` and let it bow sideways by some amount `y(x)`. Cut it at a distance `x` along its length. The axial force `P` now acts through the *displaced* centroid, so it swings a moment about the cut: `M = -P·y`. That moment is the troublemaker — it's the axial load using the deflection as leverage.",
        },
        {
          title: "2. Bring in beam bending",
          markdown:
            "For small deflections, moment and curvature are linked by `M = E·I·y''`. Set the two expressions for `M` equal:\n\n```\nE·I·y'' = -P·y\n```\n\nTidy it up and you've got the famous column equation: `E·I·y'' + P·y = 0`.",
        },
        {
          title: "3. Spot an old friend hiding in there",
          markdown:
            "Divide through by `E·I` and define `k² = P/(E·I)`:\n\n```\ny'' + k²·y = 0\n```\n\nThat's simple harmonic motion — but in *space* instead of time. You already know its solution: `y(x) = A·sin(k·x) + B·cos(k·x)`.",
        },
        {
          title: "4. Let the pins do the talking",
          markdown:
            "Pins can't hold the ends sideways: `y(0) = 0` and `y(L) = 0`. The first kills the cosine term (`B = 0`), leaving `y = A·sin(k·x)`. The second demands `A·sin(k·L) = 0`.",
        },
        {
          title: "5. Refuse the boring answer",
          markdown:
            "`A = 0` *technically* solves it — but that's the dead-straight column, no buckling, snooze. For a real buckled shape we need `A ≠ 0`, which forces `sin(k·L) = 0`. That happens only when `k·L = n·π` for n = 1, 2, 3, … → `k = n·π/L`. These are our eigenvalues.",
        },
        {
          title: "6. Cash it out and grab the lowest mode",
          markdown:
            "Remember `k² = P/(E·I)`, so `P = k²·E·I = (n·π/L)²·E·I = n²·π²·E·I / L²`. Each `n` is a buckling mode, but the column always gives way at the **smallest** load, `n = 1`:\n\n```\nPcr = π²·E·I / L²\n```\n\nThere it is — Euler's buckling load for a pinned-pinned column, derived from nothing but equilibrium and a sine wave. The higher modes (n ≥ 2) only show up if you brace the column to forbid the first one.",
        },
      ],
    },
    {
      id: "b_euler_formula",
      kind: "FORMULA",
      title: "Euler critical load (any end conditions)",
      display: "Pcr = π² · E · I / (K · L)²",
      latex: "P_{cr} = \\dfrac{\\pi^{2}\\,E\\,I}{(K\\,L)^{2}}",
      variables: [
        { symbol: "Pcr", name: "Critical (Euler) buckling load", unit: "N" },
        { symbol: "E", name: "Young's modulus of the material", unit: "Pa" },
        {
          symbol: "I",
          name: "Second moment of area (smallest principal axis)",
          unit: "m⁴",
        },
        { symbol: "K", name: "Effective length factor (end-condition factor)", unit: "–" },
        { symbol: "L", name: "Unbraced length of the column", unit: "m" },
      ],
      note:
        "Look at what's NOT here: no yield strength, no σy, no ultimate. Euler doesn't care how strong your steel is — only how stiff (E) and how the area is shaped (I). The product K·L is the effective length Le: the length of an equivalent pinned-pinned column with the same Pcr. And always use the SMALLEST I (the weak axis) — a column buckles about whichever way it's least stiff, unless you brace that axis separately.",
    },
    {
      id: "b_endconditions_prose",
      kind: "PROSE",
      title: "The ends change everything: the K factor",
      markdown:
        "Our derivation used pinned ends and gave `Pcr = π²EI/L²`. Change how the ends are held and the buckled shape changes — and that *entire* change gets bottled into one number, the **effective length factor** K. You just swap `L` for the *effective length* `Le = K·L`.\n\nHere's the slick way to read K: it's the distance between the inflection points (zero-moment points) of the buckled shape — equivalently, the length of the pinned-pinned column that would buckle at the same load. The four classics:\n\n- **Pinned–pinned: K = 1.** The reference. One clean half sine wave.\n- **Fixed–free (a flagpole, a cantilever column): K = 2.** Only a *quarter* sine fits, so the effective length is double the real length and Pcr drops to a quarter of pinned. The weakling of the group.\n- **Fixed–pinned: K ≈ 0.7** (exactly 0.699, from tan(kL) = kL). Roughly double the pinned capacity.\n- **Fixed–fixed: K = 0.5.** Both ends clamped against rotation; effective length halves, so Pcr *quadruples* versus pinned.\n\nThe one-line moral: **rotational restraint at the ends is your friend.** Clamp the ends and the effective length shrinks — and because Pcr scales with 1/(K·L)², a small shrink pays off huge. (In real codes the *recommended* K values get nudged up — fixed-fixed ~0.65, fixed-free ~2.1 — because no real joint is perfectly rigid. The universe charges a tax on idealization.)",
    },
    {
      id: "b_predict_fixed",
      kind: "PREDICT",
      question:
        "Same column, two builds. Build A is pinned at both ends (K = 1). Build B is clamped solid at both ends (K = 0.5). Just by welding the ends instead of pinning them, how much MORE load can Build B carry?",
      options: [
        { id: "q1", label: "Same — the ends don't change Pcr" },
        { id: "q2", label: "About 1.4× more" },
        { id: "q3", label: "Twice as much (2×)" },
        { id: "q4", label: "Four times as much (4×)" },
      ],
      answerId: "q4",
      reveal:
        "**Four times.** Just from clamping the ends. Because `Pcr ∝ 1/(K·L)²`, dropping K from 1 to 0.5 halves the effective length, and the inverse-square does the rest: `(1/0.5)² = 4`. You quadrupled the capacity without adding a gram of steel — you just held the ends tighter. This is why connection detailing is a structural engineer's superpower, and why the K factor shows up in every steel-design exam ever written.",
    },
    {
      id: "b_endcheck",
      kind: "CHECK",
      question:
        "Two identical columns differ only in their ends: column A is pinned-pinned (K = 1), column B is fixed-fixed (K = 0.5). How does B's critical load compare to A's?",
      choices: [
        { id: "c1", label: "B carries half as much (½×)." },
        { id: "c2", label: "B carries twice as much (2×)." },
        { id: "c3", label: "B carries four times as much (4×)." },
        { id: "c4", label: "They're identical; K doesn't affect Pcr." },
      ],
      answerId: "c3",
      explanation:
        "Pcr ∝ 1/(K·L)². Going from K = 1 to K = 0.5 halves the effective length, and capacity scales with the inverse square: (1/0.5)² = 4. Fixing both ends quadruples the buckling load — the cleanest illustration that end restraint is gold.",
    },
    {
      id: "b_slenderness_prose",
      kind: "PROSE",
      title: "Slenderness: the one number that decides your fate",
      markdown:
        "To compare a chunky steel post against a thin aluminum strut fairly, stop talking *load* and start talking *stress*. Divide `Pcr` by the area `A`, and use the handy identity `I = A·r²`, where **r is the radius of gyration**, `r = √(I/A)`. Think of r as a measure of how far the material sits from the bending axis — a hollow tube has a big r (material pushed outward), a solid bar a smaller one.\n\nWatch the algebra fall into place:\n\n```\nσcr = Pcr/A = π²·E·I / (A·(K·L)²) = π²·E·r² / (K·L)² = π²·E / (K·L/r)²\n```\n\nThat grouping `K·L/r` is the **slenderness ratio**, `λ = K·L/r` — one dimensionless number that swallows length, end restraint, and cross-section shape all at once. And the critical stress collapses to something almost suspiciously clean:\n\n```\nσcr = π²·E / λ²\n```\n\nRead that slowly. `σcr` depends only on the material's *stiffness* E and the *slenderness* λ. The material's **strength does not appear**. High λ (long, thin, weak-axis) → tiny buckling stress → spaghetti noodle. Low λ (short, fat) → huge buckling stress → pencil stub. That's the whole spaghetti-versus-stub mystery solved in one ratio — and it's exactly why hollow tubes, which fling area outward to crank up r, are compression all-stars.",
    },
    {
      id: "b_slenderness_formula",
      kind: "FORMULA",
      title: "Slenderness ratio, radius of gyration, and Euler stress",
      display: "λ = K·L / r,   r = √(I/A),   σcr = π²·E / λ²",
      latex: "\\lambda = \\dfrac{K\\,L}{r}, \\quad r = \\sqrt{\\dfrac{I}{A}}, \\quad \\sigma_{cr} = \\dfrac{\\pi^{2}\\,E}{\\lambda^{2}}",
      variables: [
        { symbol: "λ", name: "Slenderness ratio", unit: "–" },
        { symbol: "r", name: "Radius of gyration (smallest axis)", unit: "m" },
        { symbol: "I", name: "Second moment of area", unit: "m⁴" },
        { symbol: "A", name: "Cross-sectional area", unit: "m²" },
        { symbol: "σcr", name: "Critical (Euler) stress", unit: "Pa" },
        { symbol: "E", name: "Young's modulus", unit: "Pa" },
      ],
      note:
        "Use the minimum r (weak axis) unless that axis is braced. Notice again: σcr = π²E/λ² holds no yield strength whatsoever — which is precisely the reason it cannot be trusted for short, stocky columns. A short column buckles at a stress higher than it can physically reach without crushing.",
    },
    {
      id: "b_sandbox",
      kind: "SANDBOX",
      title: "Play: the Euler load explorer",
      description:
        "Stop reading, start dragging. Twist E, I, K, and L and feel the formula breathe. Push L up and watch the capacity nosedive (it falls with the SQUARE of K·L). Bump I and it climbs in a straight line. Flip K from 1 down to 0.5 and watch capacity leap 4×. Defaults model a steel column (E = 200 GPa, I = 4×10⁻⁶ m⁴, pinned-pinned, 3 m) — the same one in the linked practice problem.",
      variables: [
        {
          key: "E",
          label: "Young's modulus E",
          unit: "Pa",
          min: 50e9,
          max: 250e9,
          step: 10e9,
          default: 200e9,
        },
        {
          key: "I",
          label: "Second moment of area I",
          unit: "m⁴",
          min: 1e-6,
          max: 2e-5,
          step: 1e-6,
          default: 4e-6,
        },
        {
          key: "K",
          label: "Effective length factor K",
          unit: "–",
          min: 0.5,
          max: 2,
          step: 0.5,
          default: 1,
        },
        {
          key: "L",
          label: "Unbraced length L",
          unit: "m",
          min: 1,
          max: 8,
          step: 0.5,
          default: 3,
        },
      ],
      expression: "pi^2 * E * I / (K * L)^2 / 1000",
      outputLabel: "Critical buckling load Pcr",
      outputUnit: "kN",
      precision: 0,
    },
    {
      id: "b_inelastic_prose",
      kind: "PROSE",
      title: "Plot twist: where Euler straight-up lies to you 🚧",
      markdown:
        "Euler has a dirty secret. His formula assumes the material stays **linear-elastic** right up to the instant of buckling. That's fine for long, slim members — but watch what happens when you shrink λ toward zero.\n\nPlot `σcr = π²E/λ²` against λ and you get a hyperbola that rockets toward *infinity* as λ → 0. Taken literally, Euler claims a tiny stub of a column could carry **infinite** stress before buckling. Obviously nonsense — a stocky column just yields and crushes long before any of that.\n\nSo the real strength curve has two neighborhoods, split at a **transition slenderness** λc, found where Euler's stress would equal yield:\n\n```\nλc = π·√(2E/σy)   (a common choice, using σy/2 as the tangent point)\n```\n\n- **Slender side (λ > λc):** elastic buckling rules — trust Euler, `σcr = π²E/λ²`.\n- **Stocky/intermediate side (λ < λc):** the material starts yielding *before* the elastic critical load can arrive. Euler over-promises. Here engineers swap in an empirical fit — most famously the **Johnson parabola**:\n\n```\nσcr = σy − (1/E)·(σy·λ / (2π))²\n```\n\nThe Johnson parabola starts right at `σy` when λ = 0 and is built to be **tangent** to the Euler hyperbola at λc, so the two curves kiss smoothly with no kink. The full column curve, left to right: a gentle parabola (yield-dominated) for stocky columns, sliding into a falling hyperbola (stiffness-dominated) for slender ones, joined tangentially at λc. Knowing which side of λc you're standing on *is the entire game.*",
    },
    {
      id: "b_imperfection_callout",
      kind: "CALLOUT",
      variant: "warning",
      title: "Reality check: real columns fail BELOW Euler — never use Pcr as a working load",
      markdown:
        "Euler describes a *fantasy* column: dead straight, load perfectly centered, zero residual stress. Real columns are crooked from the factory, loaded slightly off-center, and carry locked-in stresses from rolling or welding. Those imperfections mean bending starts at *any* load — not just at Pcr — and deflection balloons nonlinearly as P creeps toward Pcr (the **amplification effect**: deflection scales roughly with 1/(1 − P/Pcr), which blows up near the limit).\n\nWhat this costs you, in practice:\n\n- Real columns fail **below** the ideal Euler value, worst of all in the intermediate-slenderness range.\n- Pcr is a theoretical *ceiling*, not an allowable load. Slap on a generous factor of safety — or use code column curves that already bake in the imperfection knockdowns.\n- Eccentric loads add a primary bending moment `P·e` on top of the buckling tendency — reach for the secant formula or an interaction check, not bare Euler.",
    },
    {
      id: "b_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Sizing check: does this steel strut buckle or yield?",
      problem:
        "A 3.0 m long pinned-pinned (K = 1) steel column has a square hollow section with A = 2.0×10⁻³ m² and I = 4.0×10⁻⁶ m⁴ (same about both axes). The steel has E = 200 GPa and yield strength σy = 250 MPa. Find the radius of gyration r, the slenderness ratio λ, the Euler critical stress σcr, the Euler critical load Pcr, and decide whether elastic (Euler) buckling or yielding/inelastic behavior actually governs.",
      steps: [
        {
          label: "Step 1 — Radius of gyration",
          markdown:
            "r = √(I/A) = √(4.0×10⁻⁶ / 2.0×10⁻³) = √(2.0×10⁻³) ≈ 0.0447 m (44.7 mm).",
        },
        {
          label: "Step 2 — Slenderness ratio",
          markdown:
            "λ = K·L/r = (1 × 3.0) / 0.0447 ≈ 67.1 (dimensionless). Moderate — not a noodle, not a stub. Keep an eye on it.",
        },
        {
          label: "Step 3 — Transition slenderness (which side of the line are we?)",
          markdown:
            "λc = π·√(2E/σy) = π·√(2 × 200×10⁹ / 250×10⁶) = π·√(1600) = π × 40 ≈ 125.7. Since λ = 67.1 < λc = 125.7, we're on the **stocky/intermediate** side — which means Euler is about to *overstate* the strength. Red flag raised.",
        },
        {
          label: "Step 4 — Euler critical stress (let's catch Euler lying)",
          markdown:
            "σcr,Euler = π²·E / λ² = 9.8696 × 200×10⁹ / (67.1)² = 1.974×10¹² / 4502 ≈ 4.38×10⁸ Pa ≈ 438 MPa. But hold on — that's *higher* than σy = 250 MPa. The column would yield long before it could ever reach the elastic critical stress. Euler is invalid here, exactly as λ < λc warned us.",
        },
        {
          label: "Step 5 — Euler critical load (the naive number)",
          markdown:
            "Pcr = π²·E·I / (K·L)² = 9.8696 × 200×10⁹ × 4.0×10⁻⁶ / (1 × 3.0)² = 7,895,683 / 9 ≈ 8.77×10⁵ N ≈ 877 kN. (Sanity check: σcr,Euler × A = 438 MPa × 2.0×10⁻³ m² ≈ 877 kN — matches the sandbox. The arithmetic is right; it's the *assumption* that's wrong.)",
        },
        {
          label: "Step 6 — The honest answer (Johnson parabola)",
          markdown:
            "Because λ < λc, use Johnson: σcr = σy − (1/E)·(σy·λ/(2π))² = 250×10⁶ − (1/200×10⁹)·(250×10⁶ × 67.1 / 6.283)². Inner term: 250×10⁶ × 67.1 / 6.283 ≈ 2.670×10⁹; squared ≈ 7.13×10¹⁸; divided by E ≈ 3.56×10⁷ Pa. So σcr ≈ 250 − 35.6 ≈ 214 MPa, giving P ≈ 214×10⁶ × 2.0×10⁻³ ≈ 429 kN.",
        },
      ],
      answer:
        "r ≈ 44.7 mm, λ ≈ 67.1, λc ≈ 125.7. Euler would crow about σcr ≈ 438 MPa and Pcr ≈ 877 kN — but since λ < λc the column is intermediate and inelastic buckling governs. The realistic capacity from the Johnson parabola is σcr ≈ 214 MPa → P ≈ 429 kN. **Punchline: blindly trusting Euler here would overstate the capacity by roughly 2×.** That's the difference between a column and a cautionary tale.",
    },
    {
      id: "b_scaling_check",
      kind: "CHECK",
      question:
        "A pinned-pinned column's unbraced length is doubled, with everything else (E, I, cross-section) unchanged. What happens to its Euler critical load?",
      choices: [
        { id: "d1", label: "It halves (½×)." },
        { id: "d2", label: "It is unchanged." },
        { id: "d3", label: "It drops to one-quarter (¼×)." },
        { id: "d4", label: "It doubles (2×)." },
      ],
      answerId: "d3",
      explanation:
        "Pcr = π²EI/(K·L)² ∝ 1/L². Doubling L multiplies the denominator by 4, so Pcr falls to one-quarter — exactly what you predicted at the top of the lesson. This inverse-square length dependence is the single most important scaling fact about buckling: long members shed capacity fast.",
    },
    {
      id: "b_interview_callout",
      kind: "CALLOUT",
      variant: "interview",
      title: "In the interview: \"So how does this slender strut fail?\"",
      markdown:
        "When they slide a long, thin compression member across the table, don't reach for σ = P/A. Lead with the mode, then quantify, then qualify:\n\n1. **Name the mode first:** \"For a slender member in compression I'd check buckling before strength — it's a stability failure, probably well below yield.\" (You just separated yourself from half the room.)\n2. **Write Euler and the scaling:** Pcr = π²EI/(K·L)². Volunteer the intuition unprompted: capacity ∝ I (so push area outward — tubes beat solid bars) and ∝ 1/L² (length is merciless).\n3. **Handle the ends:** state K for the actual boundary conditions (1 pinned, 0.5 fixed-fixed, 2 fixed-free) and note that clamping ends shrinks effective length and jacks up Pcr.\n4. **Show you know the edge of the map:** compute λ = K·L/r and compare σcr = π²E/λ² to σy. If σcr ≥ σy, the column is short → it yields / use Johnson, not Euler.\n5. **Land the safety reality:** real columns are imperfect and fail below ideal Pcr, so apply a factor of safety or a code column curve.\n\nThe ones who get the offer don't just recite the formula — they tell you *when it's wrong.*",
    },
  ],
  keyTakeaways: [
    "Buckling is a stability (stiffness/geometry) failure, not a strength one — slender columns fold far below yield, like a soda can.",
    "Euler's load Pcr = π²EI/(K·L)² falls out of the eigenvalue problem EI·y'' + P·y = 0; the column buckles in its lowest mode.",
    "End restraint enters only through K: pinned-pinned K = 1, fixed-free K = 2, fixed-pinned ≈ 0.7, fixed-fixed K = 0.5 — clamping ends raises capacity, hard.",
    "Capacity scales as Pcr ∝ I and ∝ 1/(K·L)², so doubling length quarters the load; always use the smallest I/r unless that axis is braced.",
    "Slenderness λ = K·L/r and σcr = π²E/λ² depend on stiffness, never strength — which is exactly why Euler breaks for short columns.",
    "When σcr would exceed σy (λ below the transition λc), Euler over-promises — switch to the Johnson parabola or a yield check.",
    "Real columns are crooked, off-center, and pre-stressed, so they fail BELOW the ideal Euler load — Pcr is a ceiling, never an allowable.",
  ],
};
