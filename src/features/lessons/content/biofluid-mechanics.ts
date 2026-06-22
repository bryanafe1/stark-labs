import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_biofluid",
  slug: "biofluid-mechanics",
  title: "Biofluid Mechanics: Why Your Arteries Obey r⁴ (and Your Pump Doesn't)",
  summary:
    "Your heart is a 0.3-horsepower pump that runs for a century without a service interval, and the plumbing it feeds is the most beautiful fluids problem in your body. This lesson treats blood as what it really is — a weird, living fluid — and builds the Poiseuille equation from intuition until the r⁴ term jumps off the page. You'll play with a live calculator, feel why constricting a vessel by a hair can crater the flow, and connect it all to the Ohm's-law analogy that runs through every cardiovascular interview.",
  discipline: "BIOMEDICAL",
  difficulty: "HARD",
  estMinutes: 24,
  tags: ["biofluids", "hemodynamics", "poiseuille"],
  objectives: [
    "Describe blood as a real fluid — its viscosity, its cells, and why it stops behaving like water at low shear (non-Newtonian).",
    "Build the Poiseuille equation Q = π·ΔP·r⁴/(8·µ·L) from intuition and read every term as a physical knob.",
    "Explain the r⁴ dependence and predict the dramatic flow change from a small radius change (vasoconstriction / stenosis).",
    "Use the Ohm's-law analogy ΔP = Q·R to reason about vascular resistance in series and parallel.",
    "Place pulsatile flow and the Womersley number conceptually, and estimate the Reynolds number in a large artery to argue blood is mostly laminar.",
  ],
  prerequisites: [
    "Fluid properties (density, viscosity)",
    "Laminar vs. turbulent flow and the Reynolds number",
    "Basic circuit ideas (Ohm's law, series/parallel resistance)",
  ],
  interviewAngle:
    "Biofluids and hemodynamics questions show up constantly in biomedical, cardiovascular-device, and physiology-flavored interviews. Expect to write Poiseuille's law from memory, explain *why* the radius is raised to the fourth power, and connect it to the Ohm's-law analogy ΔP = Q·R. Strong candidates immediately flag that blood is non-Newtonian, that Poiseuille assumes steady laminar Newtonian flow (so it's an approximation in pulsatile arteries), and that the r⁴ term is exactly why the body tunes blood pressure through tiny changes in arteriole radius. Bonus points for naming the Womersley number and estimating an arterial Reynolds number.",
  blocks: [
    {
      id: "b_hook",
      kind: "PROSE",
      title: "The pump that never clocks out 🫀",
      markdown:
        "Right now, without any thought from you, a fist-sized muscle is pushing about 5 liters of fluid through roughly 100,000 km of plumbing — enough vessel to wrap the planet twice. It will do this around 100,000 times today, and it has never once asked for a day off.\n\nBut here's the part that should hook you: the body almost never controls flow by changing the pump. Your heart rate barely doubles between a nap and a sprint. Instead, the body controls flow by changing the *pipes* — squeezing some vessels a little narrower, opening others a little wider. And because of one ferocious term in one famous equation, a *tiny* change in pipe radius produces a *huge* change in flow.\n\nThat equation is **Poiseuille's law**, and the term is **r⁴**. By the end of this lesson you'll understand why a 19% narrowing of an arteriole can cut its flow in half — and why that single fact is the secret behind blood-pressure regulation, drug-coated stents, and the murmur a doctor hears through a stethoscope. Let's earn it.",
    },
    {
      id: "v_intro",
      kind: "VIDEO",
      youtubeId: "Ok8AJAkkiw8",
      title: "Watch: Blood Flow & the Poiseuille Equation",
    },
    {
      id: "b_blood",
      kind: "PROSE",
      title: "Blood is not water (and it knows it) 🩸",
      markdown:
        "Before we touch an equation, respect the fluid. Blood is about 55% **plasma** (mostly water, with proteins and ions) and about 45% **cells** — overwhelmingly red blood cells. That cell fraction has a name, the **hematocrit**, and it's the single biggest driver of blood's viscosity.\n\nWhole blood is roughly **3 to 4 times more viscous than water** (µ ≈ 0.003–0.004 Pa·s vs. water's ≈ 0.001 Pa·s). Crank the hematocrit up — say, an endurance athlete or someone at altitude — and viscosity climbs, making the heart work harder. Dilute it (anemia) and viscosity drops.\n\nNow the twist that makes biofluids genuinely hard: **blood is non-Newtonian.** A Newtonian fluid (water, air) has *one* viscosity, period. Blood's apparent viscosity *changes with how fast it's sheared*:\n\n- **At low shear rate** (slow, sluggish flow), red cells clump into stacks called **rouleaux**, and viscosity shoots *up*. Blood behaves like a shear-thinning fluid that almost wants a little yield stress to get going.\n- **At high shear rate** (fast flow in big arteries), cells line up, deform, and slip past each other — apparent viscosity *drops* toward a stable plateau.\n\nThere's even a geometric quirk in tiny vessels: the **Fåhræus–Lindqvist effect**, where in capillaries under ~300 µm the apparent viscosity *falls* because cells migrate to the center, leaving a slick cell-free plasma layer lubricating the wall.\n\nThe practical upshot for this lesson: in the **large arteries**, where shear is high, blood is *close enough* to Newtonian that we can use a constant µ — which is exactly what Poiseuille's law assumes. Keep that caveat in your back pocket; an interviewer will reward you for raising it before they have to.",
    },
    {
      id: "p_hematocrit",
      kind: "PREDICT",
      question:
        "A cyclist blood-dopes, pushing their hematocrit way up. Holding everything else fixed (same pressure, same vessels), what happens to blood flow Q?",
      options: [
        { id: "a", label: "Flow goes up — more red cells means more oxygen-carrying capacity, so more flow." },
        { id: "b", label: "Flow goes down — higher hematocrit means higher viscosity µ, and Q ∝ 1/µ." },
        { id: "c", label: "Flow is unchanged — viscosity doesn't appear in the flow equation." },
      ],
      answerId: "b",
      reveal:
        "More red cells does raise oxygen-carrying capacity, but it also thickens the blood. In Poiseuille's law Q ∝ 1/µ, so a higher hematocrit raises µ and *reduces* flow for the same driving pressure — meaning the heart must push harder and the blood is stickier and slower. That's the dark side of blood doping: thickened blood plus dehydration is a recipe for clots. The body's oxygen win is partly paid for in pump work and clotting risk.",
    },
    {
      id: "b_intuition",
      kind: "PROSE",
      title: "Building Poiseuille from a parabola 🧠",
      markdown:
        "Here's the mental picture. Push a viscous fluid steadily down a straight round tube, slowly enough that it stays **laminar** (no eddies). The fluid sticks to the wall — that's the **no-slip condition**, velocity exactly zero at the wall — and moves fastest at the center. The velocity profile is a perfect **parabola**: the centerline screams along at twice the average speed while the edges crawl.\n\nWhy does this give an r⁴ flow? Two effects *multiply*:\n\n1. **A wider pipe carries more cross-section.** Area scales with r², so just from \"more room\" you'd expect Q ∝ r².\n2. **A wider pipe lets the center go faster.** The peak velocity in Poiseuille flow itself scales with r² (the parabola gets both taller and wider), because the fluid in the middle is farther from the drag of the walls.\n\nMultiply those two r² effects together and you get **r⁴**. That's the whole secret. Flow doesn't just scale with how much room there is; it scales with room *times* how fast that room moves — and both grow with radius.\n\nThe other terms are friendlier: more pressure drop ΔP pushes harder, so Q ∝ ΔP. A longer pipe L means more wall to fight, so Q ∝ 1/L. And thicker fluid resists more, so Q ∝ 1/µ. Stitch it all together with the geometric constant π/8 and you have Poiseuille's law.",
    },
    {
      id: "f_poiseuille",
      kind: "FORMULA",
      title: "The Hagen–Poiseuille equation",
      display: "Q = π·ΔP·r⁴ / (8·µ·L)",
      latex: "Q = \\dfrac{\\pi \\cdot \\Delta P \\cdot r^{4}}{8 \\cdot \\mu \\cdot L}",
      variables: [
        { symbol: "Q", name: "volumetric flow rate", unit: "m³/s" },
        { symbol: "ΔP", name: "pressure drop across the vessel", unit: "Pa" },
        { symbol: "r", name: "vessel inner radius", unit: "m" },
        { symbol: "µ", name: "dynamic (apparent) blood viscosity", unit: "Pa·s" },
        { symbol: "L", name: "vessel length", unit: "m" },
      ],
      note:
        "Valid only for steady, fully developed, laminar, Newtonian flow in a rigid straight tube. Real arteries break every one of those assumptions a little (pulsatile, elastic, curved, non-Newtonian), so treat it as a powerful first-order model — not gospel. Note it's radius to the fourth; if a problem hands you diameter D, then Q = π·ΔP·D⁴/(128·µ·L), because r⁴ = (D/2)⁴ = D⁴/16 and 8 × 16 = 128. Mixing up r⁴ and D⁴ is the classic 16× blunder.",
    },
    {
      id: "b_resistance",
      kind: "PROSE",
      title: "The Ohm's-law trick that physiologists live by ⚡",
      markdown:
        "Rearrange Poiseuille's law and something magical pops out. Group everything that isn't flow or pressure into a single lump called **resistance**:\n\n> R = 8·µ·L / (π·r⁴)\n\nThen the whole law becomes\n\n> ΔP = Q · R\n\nThat is **Ohm's law for fluids**. Pressure drop plays the role of voltage, flow rate plays the role of current, and R is the hydraulic resistance. This analogy is so good that cardiovascular physiologists reason about the entire circulation as a circuit — they even talk about *total peripheral resistance* (TPR) the way an EE talks about a load.\n\nThe analogy carries the circuit rules with it:\n\n- **Resistances in series add:** R_total = R₁ + R₂ + … (think aorta → artery → arteriole, one after another).\n- **Resistances in parallel combine reciprocally:** 1/R_total = 1/R₁ + 1/R₂ + … (think the thousands of capillary beds fed in parallel — which is why the capillary network, despite each vessel being tiny and high-resistance, has a modest *combined* resistance).\n\nAnd because R ∝ 1/r⁴, the body has an absurdly sensitive control knob. The **arterioles** — the \"stopcocks\" of the circulation — are wrapped in smooth muscle. Contract that muscle a little (**vasoconstriction**), shrink r slightly, and R skyrockets. Relax it (**vasodilation**) and R collapses. This is how your body shunts blood to your legs when you run and away from your gut, and it's the dominant lever on your blood pressure: ΔP = Q · R, so jacking up R raises pressure for the same cardiac output.",
    },
    {
      id: "s_poiseuille",
      kind: "SANDBOX",
      title: "Play: feel the r⁴ cliff 🎛️",
      description:
        "This is the fun part. With the defaults (ΔP = 1000 Pa, r = 2 mm, µ = 0.0035 Pa·s, L = 0.1 m) you'll see Q ≈ 1.8×10⁻⁵ m³/s. Now go to war with the radius slider. Drag r from 2 mm down to 1 mm — half the radius — and watch Q crater to roughly one-sixteenth. Then try doubling the pressure or the length and notice how *boring* those are by comparison. Radius is the dictator here.",
      variables: [
        { key: "dP", label: "Pressure drop ΔP", unit: "Pa", min: 100, max: 5000, step: 100, default: 1000 },
        { key: "r", label: "Vessel radius r", unit: "m", min: 0.0005, max: 0.01, step: 0.0005, default: 0.002 },
        { key: "mu", label: "Blood viscosity µ", unit: "Pa·s", min: 0.001, max: 0.01, step: 0.0005, default: 0.0035 },
        { key: "L", label: "Vessel length L", unit: "m", min: 0.01, max: 0.5, step: 0.01, default: 0.1 },
      ],
      expression: "pi * dP * r ^ 4 / (8 * mu * L)",
      outputLabel: "Blood flow Q",
      outputUnit: "m³/s",
      precision: 6,
    },
    {
      id: "c_default",
      kind: "CALLOUT",
      variant: "insight",
      title: "Where that default number comes from",
      markdown:
        "Q = π·ΔP·r⁴/(8·µ·L) = π × 1000 × (0.002)⁴ / (8 × 0.0035 × 0.1).\n\nNumerator: π × 1000 × 1.6×10⁻¹¹ ≈ 5.03×10⁻⁸. Denominator: 8 × 0.0035 × 0.1 = 2.8×10⁻³.\n\nQ ≈ 5.03×10⁻⁸ / 2.8×10⁻³ ≈ **1.8×10⁻⁵ m³/s** (about 18 mL/s). Now the punchline: that (0.002)⁴ in the numerator is *fragile*. Halve r to 0.001 and r⁴ drops by a factor of 16 — flow falls to ≈ 1.1×10⁻⁶ m³/s. One slider, sixteen-fold swing.",
    },
    {
      id: "p_constrict",
      kind: "PREDICT",
      question:
        "An arteriole constricts so its radius shrinks by just 16% (r → 0.84·r), with pressure, length, and viscosity unchanged. Roughly what happens to flow Q?",
      options: [
        { id: "a", label: "Flow drops about 16% — flow tracks radius proportionally." },
        { id: "b", label: "Flow drops to about half — because Q ∝ r⁴ and 0.84⁴ ≈ 0.5." },
        { id: "c", label: "Flow is barely affected — 16% is a tiny, negligible change." },
      ],
      answerId: "b",
      reveal:
        "Because Q ∝ r⁴, the new flow is 0.84⁴ ≈ 0.498 of the old — almost exactly **half**. A radius change you could barely see on an image halves the flow. This is the entire reason arterioles, not the heart, are the body's primary flow-control valves: a sliver of smooth-muscle contraction produces an enormous hemodynamic effect. The same math is why a partially blocked (stenosed) coronary artery is so dangerous — modest narrowing, dramatic flow loss.",
    },
    {
      id: "b_pulsatile",
      kind: "PROSE",
      title: "But blood pulses — enter Womersley 🌊",
      markdown:
        "Poiseuille assumes **steady** flow: turn on a constant pressure, wait, and the parabolic profile settles in forever. Your circulation does no such thing. The heart fires in beats, so arterial flow is **pulsatile** — pressure and velocity oscillate with every heartbeat (roughly 1 Hz at rest).\n\nWhen flow oscillates, a new question appears: *does the parabolic profile even have time to form before the flow reverses?* The answer is captured by a dimensionless number — the **Womersley number**:\n\n> α = r·√(ω·ρ/µ)\n\nwhere ω is the angular frequency of the heartbeat (ω = 2πf) and ρ is blood density. Read it as a tug-of-war between **unsteady (transient) inertia** and **viscous forces**:\n\n- **Low α (≲ 1)** — small vessels like arterioles and capillaries. Viscosity dominates, the flow re-equilibrates almost instantly each instant, and the profile stays essentially parabolic. Poiseuille is a fine approximation moment-to-moment.\n- **High α (≳ 10)** — big vessels like the aorta (α ≈ 13–20). Inertia dominates; the flow profile becomes blunt and *plug-like* in the core, and crucially the flow **lags the pressure** in phase — the fluid's inertia means it can't keep up with the rapidly changing push. Here Poiseuille's tidy in-phase picture breaks down and you need the full unsteady (Womersley) solution.\n\nYou don't need to solve the Womersley equations in an interview. You need to *name* the number, say it's the pulsatile analog of asking whether the velocity profile keeps up with the oscillation, and note that it's why Poiseuille is great for the microcirculation but only a rough cartoon for the aorta.",
    },
    {
      id: "b_reynolds",
      kind: "PROSE",
      title: "Is blood flow laminar? Mostly. 🧮",
      markdown:
        "Poiseuille also assumes **laminar** flow, so it's fair to ask: is blood actually laminar? Reach for the **Reynolds number**, Re = ρVD/µ — the ratio of inertial to viscous forces. For a pipe, the rough rule is laminar below ~2300.\n\nTake the **aorta** at rest: ρ ≈ 1060 kg/m³, mean V ≈ 0.4 m/s (peak ≈ 1 m/s), D ≈ 0.025 m, µ ≈ 0.0035 Pa·s.\n\n> Re = 1060 × 0.4 × 0.025 / 0.0035 ≈ 3000 (mean), climbing to ≈ 7600 at peak systole.\n\nSo the aorta hovers right around the transition and only briefly pokes into turbulence at the velocity peak — and because the high-velocity phase is *short*, full turbulence never has time to develop. Net result: even your largest vessel is **mostly laminar**, with at worst transient, disturbed flow at peak.\n\nNow walk down the tree. In smaller arteries, arterioles, and capillaries, V and D both plummet, so Re drops to *far* below 1 — these flows are deeply, serenely laminar (viscosity utterly dominates). Turbulence in the body is the exception, and when it does show up — across a narrowed (stenotic) valve or vessel — the chaotic eddies create vibration you can literally hear: a **bruit** or **murmur** through a stethoscope. Hearing turbulence is, quite literally, a diagnostic tool.",
    },
    {
      id: "we_halving",
      kind: "WORKED_EXAMPLE",
      title: "The full move: vasoconstriction and the r⁴ hammer",
      problem:
        "A small artery carries blood with viscosity µ = 0.0035 Pa·s. It has radius r = 2.0 mm, length L = 0.10 m, and a pressure drop of ΔP = 1000 Pa across it. (a) Find the baseline flow Q and the vascular resistance R. (b) The vessel constricts so its radius drops to r = 1.0 mm, with ΔP held fixed. Find the new flow and the new resistance, and state the factor change. This is the canonical hemodynamics interview problem.",
      steps: [
        {
          label: "Baseline flow",
          markdown:
            "Q = π·ΔP·r⁴/(8·µ·L) = π × 1000 × (0.002)⁴ / (8 × 0.0035 × 0.10).\n\nWith (0.002)⁴ = 1.6×10⁻¹¹: numerator ≈ 5.03×10⁻⁸, denominator = 2.8×10⁻³.\n\nQ ≈ **1.8×10⁻⁵ m³/s** (≈ 18 mL/s).",
        },
        {
          label: "Baseline resistance",
          markdown:
            "R = 8·µ·L/(π·r⁴) = (8 × 0.0035 × 0.10)/(π × 1.6×10⁻¹¹) = 2.8×10⁻³ / 5.03×10⁻¹¹ ≈ **5.6×10⁷ Pa·s/m³**. Sanity check: ΔP = Q·R = 1.8×10⁻⁵ × 5.6×10⁷ ≈ 1000 Pa. ✓",
        },
        {
          label: "Halve the radius",
          markdown:
            "Now r = 1.0 mm = 0.001 m, so (0.001)⁴ = 1.0×10⁻¹². That's exactly **1/16** of (0.002)⁴ = 1.6×10⁻¹¹.",
        },
        {
          label: "New flow",
          markdown:
            "Since Q ∝ r⁴ and r⁴ fell by 16×, the flow falls by 16×:\n\nQ_new = 1.8×10⁻⁵ / 16 ≈ **1.1×10⁻⁶ m³/s** (≈ 1.1 mL/s). The vessel went from a firehose to a trickle.",
        },
        {
          label: "New resistance",
          markdown:
            "R ∝ 1/r⁴, so resistance rises 16×: R_new ≈ 16 × 5.6×10⁷ ≈ **9.0×10⁸ Pa·s/m³**. To restore the original 18 mL/s flow through this constricted vessel, the body would need 16× the pressure drop — which is exactly how vasoconstriction raises systemic blood pressure.",
        },
      ],
      answer:
        "Baseline: Q ≈ 1.8×10⁻⁵ m³/s, R ≈ 5.6×10⁷ Pa·s/m³. After halving the radius: Q ≈ 1.1×10⁻⁶ m³/s (16× less) and R ≈ 9.0×10⁸ Pa·s/m³ (16× more). A 2× change in radius is a 16× change in everything that matters.",
    },
    {
      id: "c_tip",
      kind: "CALLOUT",
      variant: "tip",
      title: "r⁴ vs. D⁴: don't drop the 16 🎯",
      markdown:
        "Poiseuille comes in two outfits and people fumble the wardrobe constantly:\n\n- **Radius form:** Q = π·ΔP·**r⁴** / (8·µ·L)\n- **Diameter form:** Q = π·ΔP·**D⁴** / (128·µ·L)\n\nThey are the *same equation*. Because r = D/2, r⁴ = D⁴/16, and 8 × 16 = 128. If you write r⁴ but quietly plug in the diameter, your answer is off by 16×. Before you compute, say out loud whether your number is a radius or a diameter — then pick the matching constant (8 or 128).",
    },
    {
      id: "c_warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "When Poiseuille lies to you ⚠️",
      markdown:
        "Poiseuille's law is a beautiful first model, but it quietly assumes a lot. Watch for cases where it breaks:\n\n- **Pulsatile flow** in large arteries — flow lags pressure; use the Womersley picture (high α), not steady Poiseuille.\n- **Non-Newtonian behavior** at low shear (small vessels, sluggish flow) — µ isn't constant; whole blood thickens via rouleaux, and the Fåhræus–Lindqvist effect *thins* it in tiny capillaries.\n- **Elastic, tapering, branching, curved vessels** — real arteries store energy in their walls (the Windkessel effect) and have entrance/branch losses Poiseuille ignores.\n- **Turbulence across a stenosis or valve** — once Re crosses transition the parabolic profile and the linear ΔP–Q relation both die.\n\nThe move in an interview: use Poiseuille confidently, *then* name the assumption you'd worry about for the specific vessel in question. That's the difference between memorizing a formula and understanding it.",
    },
    {
      id: "c_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "In the interview: what they're really fishing for 🎯",
      markdown:
        "When they ask \"how does blood flow depend on vessel size?\" they want a layered answer, fast and confident:\n\n1. **The formula** — Q = π·ΔP·r⁴/(8·µ·L). Write it without flinching, and say it's the steady-laminar-Newtonian limit.\n2. **The r⁴ insight** — flow scales with the *fourth* power of radius because area (r²) and core velocity (r²) both grow with radius. A small radius change is a huge flow change; this is why arterioles, not the heart, regulate flow and pressure.\n3. **The analogy** — ΔP = Q·R with R = 8µL/(πr⁴); resistances add in series, combine reciprocally in parallel. Translate hemodynamics into a circuit.\n4. **The caveats** — blood is non-Newtonian; arterial flow is pulsatile (name the Womersley number); aortic flow is borderline-laminar (estimate Re ≈ 3000–7600), so turbulence is the audible exception (bruits/murmurs).\n\nNail those four layers and you've demonstrated you understand biofluids, not just recall them.",
    },
    {
      id: "ck_radius",
      kind: "CHECK",
      question:
        "A vessel's radius increases by 19% (vasodilation, r → 1.19·r) with everything else fixed. Roughly what happens to flow Q? (Note 1.19⁴ ≈ 2.0.)",
      choices: [
        { id: "a", label: "Flow increases about 19%." },
        { id: "b", label: "Flow roughly doubles." },
        { id: "c", label: "Flow roughly quadruples." },
        { id: "d", label: "Flow is unchanged because pressure didn't change." },
      ],
      answerId: "b",
      explanation:
        "Q ∝ r⁴, so the flow ratio is 1.19⁴ ≈ 2.0 — flow roughly *doubles* from a 19% radius increase. This is the dilation side of the same coin as the constriction example: tiny radius changes, enormous flow changes. It's exactly how vasodilation floods active muscle with blood during exercise.",
    },
    {
      id: "ck_resistance",
      kind: "CHECK",
      question:
        "Using the fluid Ohm's-law analogy ΔP = Q·R, which statement about the systemic circulation is correct?",
      choices: [
        { id: "a", label: "The thousands of capillaries are in series, so their resistances add to a huge total." },
        { id: "b", label: "Capillary beds are in parallel, so 1/R_total = Σ(1/Rᵢ) keeps the combined resistance modest." },
        { id: "c", label: "Vessel radius does not affect resistance, only length and viscosity do." },
        { id: "d", label: "Resistance plays the role of current, and flow plays the role of voltage." },
      ],
      answerId: "b",
      explanation:
        "Capillary beds run in *parallel*, and parallel resistances combine reciprocally: 1/R_total = Σ(1/Rᵢ). So even though each capillary is tiny and individually high-resistance, the millions running side-by-side give a modest combined resistance. (Resistance R ∝ 1/r⁴ very much depends on radius; and in the analogy ΔP is voltage while Q is current — choices a, c, d are all wrong.)",
    },
  ],
  keyTakeaways: [
    "Poiseuille's law Q = π·ΔP·r⁴/(8·µ·L) governs steady, laminar, Newtonian flow in a straight tube — the workhorse model of hemodynamics.",
    "Flow scales with the fourth power of radius because cross-sectional area (r²) and core velocity (r²) both grow with radius; halving r cuts flow 16×. This is why arterioles, not the heart, regulate flow and pressure.",
    "Rearranged, Poiseuille becomes the fluid Ohm's law ΔP = Q·R with R = 8µL/(πr⁴); resistances add in series and combine reciprocally in parallel (capillary beds run in parallel).",
    "Blood is non-Newtonian: viscosity rises at low shear (rouleaux), falls at high shear, and the Fåhræus–Lindqvist effect thins it in tiny capillaries. It's ~3–4× more viscous than water, driven mostly by hematocrit.",
    "Arterial flow is pulsatile; the Womersley number α = r·√(ωρ/µ) says whether the parabolic profile keeps up with the heartbeat. Low α (small vessels) stays parabolic; high α (aorta) goes plug-like and lags pressure.",
    "Reynolds number in the aorta is ≈ 3000 mean and ≈ 7600 at peak, so even the largest vessel is mostly laminar; turbulence is the exception and is audible as a bruit or murmur across a stenosis.",
    "The default sandbox case (ΔP = 1000 Pa, r = 2 mm, µ = 0.0035 Pa·s, L = 0.1 m) gives Q ≈ 1.8×10⁻⁵ m³/s — and dropping r to 1 mm slashes it to ≈ 1.1×10⁻⁶ m³/s, a live demo of the r⁴ cliff.",
  ],
};
