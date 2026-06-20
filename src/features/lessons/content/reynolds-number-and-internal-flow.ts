import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_reynolds",
  slug: "reynolds-number-and-internal-flow",
  title: "Reynolds Number: The One Number That Decides Smooth vs. Chaos",
  summary:
    "Light a cigarette and watch the smoke: it rises in a perfect ribbon, then — somewhere around your nose — explodes into a swirling mess. That breakdown has a name, and it's governed by a single dimensionless number. This lesson builds Re = ρVD/µ from pure intuition (inertia vs. viscosity), lets you play with a live calculator until the flow flips, and connects it all the way to the head loss that sizes real pumps.",
  discipline: "MECHANICAL",
  difficulty: "MEDIUM",
  estMinutes: 26,
  tags: [
    "Reynolds number",
    "pipe flow",
    "laminar",
    "turbulent",
    "Darcy-Weisbach",
    "friction factor",
    "head loss",
    "dimensional analysis",
    "interview favorite",
  ],
  practiceSlug: "pipe-flow-regime",
  objectives: [
    "Read Re = ρVD/µ as a tug-of-war between inertia and viscosity — and predict which one wins.",
    "Explain *why* one number rules the whole flow, using a 30-second dimensional-analysis argument.",
    "Instantly classify any pipe flow as laminar, transitional, or turbulent — and describe what it actually looks like inside.",
    "Stop confusing dynamic viscosity µ with kinematic viscosity ν = µ/ρ (and know why air diffuses momentum faster than water).",
    "Turn a regime into a real pressure drop with Darcy–Weisbach and the right friction factor (laminar f = 64/Re vs. turbulent Moody/Colebrook).",
  ],
  prerequisites: [
    "Fluid properties (density, viscosity)",
    "Basic dimensional analysis",
    "Conservation of mass (continuity) and the energy equation",
  ],
  interviewAngle:
    "This is the most common opening question in any fluids/CFD or thermal-systems interview. Expect to be asked to write Re from memory, state the laminar/turbulent thresholds for a pipe, explain what the number physically *means* (not just plug numbers), and then connect it to a pressure-drop or pump-sizing estimate. Strong candidates explain Re as a force ratio, note that the transition value is disturbance-dependent rather than a hard constant, and immediately reach for the right friction-factor branch.",
  blocks: [
    {
      id: "b_hook",
      kind: "PROSE",
      title: "The dye that betrayed the fluid 🔬",
      markdown:
        "Picture a glass tube with water trickling through it. You inject a thin thread of dye and it glides down the center like a laser beam — straight, calm, almost smug.\n\nNow you crack the valve open a little more. Nothing happens... nothing happens... and then — *boom* — the thread shatters into a wild, mixing cloud. Same tube. Same water. Same dye. What changed?\n\nOsborne Reynolds ran this exact experiment in 1883 and discovered something that should bother you: the switch from calm to chaos is **not** about speed alone, **not** about pipe size alone, and **not** about the fluid alone. It's controlled by one sneaky combination of all three.\n\nThat combination is the **Reynolds number**, and by the end of this lesson you'll be able to look at any pipe — your garden hose, your aorta, an oil pipeline — and call the regime before you finish reading the problem. Let's earn that.",
    },
    {
      id: "v_intro",
      kind: "VIDEO",
      youtubeId: "NenlNon6ODw",
      title: "Watch: Laminar vs Turbulent in 8 Minutes",
      channel: "Less Boring Lectures",
    },
    {
      id: "b_force_ratio",
      kind: "PROSE",
      title: "It's a fight: inertia vs. viscosity 🥊",
      markdown:
        "Here's the one mental model that makes everything else fall into place. **The Reynolds number is a scorecard for a fight between two forces.**\n\nIn one corner: **inertia** — the fluid's stubborn refusal to slow down. Once a parcel is moving, it wants to keep barreling forward and carry any disturbance downstream with it. Inertia *loves* chaos.\n\nIn the other corner: **viscosity** — the fluid's internal friction. It's the peacemaker, smearing out velocity differences and quietly killing any wiggle before it can grow. Viscosity *loves* order.\n\nRe is just the ratio of who's winning:\n\n> Re ~ (inertial forces) / (viscous forces) ~ (ρV²/L) / (µV/L²) = ρVL/µ\n\nWith L = D for a pipe, that's exactly **Re = ρVD/µ**.\n\nSo the whole story collapses to a single question — *which corner wins?*\n\n- **Low Re — viscosity wins.** Every little disturbance gets damped before it can spread. The flow stays neat and layered: **laminar**.\n- **High Re — inertia wins.** Viscosity is too weak to police the flow. Tiny perturbations feed on the flow's energy, amplify, and cascade into a tangle of eddies: **turbulent**.\n\nThink of cigarette smoke again: near the tip it's slow and viscosity-dominated (smooth ribbon), but as it rises and speeds up, inertia takes over and it breaks into curls. Same fluid, different Re, different winner.",
    },
    {
      id: "p_honey",
      kind: "PREDICT",
      question:
        "You push **honey** and **water** through the *exact same pipe* at the *exact same velocity*. Which one is more likely to go turbulent?",
      options: [
        { id: "a", label: "Honey — it's thick, so it churns more." },
        { id: "b", label: "Water — honey is far too viscous to go turbulent." },
        { id: "c", label: "Both behave identically; same pipe, same speed." },
      ],
      answerId: "b",
      reveal:
        "Honey's viscosity is roughly 10,000× water's. In the inertia-vs-viscosity fight, honey hands the viscous corner a knockout — its Re is tiny, so it oozes along in perfect laminar layers no matter how hard you try. Water, with ~10,000× less viscosity at the same ρ, V, and D, has a Re ~10,000× higher and tips into turbulence easily. Thickness is the enemy of turbulence, not its friend.",
    },
    {
      id: "f_reynolds",
      kind: "FORMULA",
      title: "Reynolds number (internal flow)",
      display: "Re = ρ·V·D / µ = V·D / ν",
      variables: [
        { symbol: "Re", name: "Reynolds number (dimensionless)", unit: "—" },
        { symbol: "ρ", name: "fluid density", unit: "kg/m³" },
        { symbol: "V", name: "mean (bulk) flow velocity", unit: "m/s" },
        { symbol: "D", name: "pipe inner diameter (characteristic length)", unit: "m" },
        { symbol: "µ", name: "dynamic viscosity", unit: "Pa·s" },
        { symbol: "ν", name: "kinematic viscosity, ν = µ/ρ", unit: "m²/s" },
      ],
      note:
        "Memorize it as \"rho V D over mu\" — it'll roll off your tongue in an interview. For non-circular ducts swap D for the hydraulic diameter D_h = 4A/P (A = cross-section area, P = wetted perimeter). Handy constants: water at 20°C, ν ≈ 1.0×10⁻⁶ m²/s; air at 20°C, ν ≈ 1.5×10⁻⁵ m²/s.",
    },
    {
      id: "w_dimanalysis",
      kind: "WALKTHROUGH",
      title: "Why ONE number? A 30-second proof 🪄",
      steps: [
        {
          title: "1. List who's in the room",
          markdown:
            "The wall shear stress (equivalently, the pressure drop per length) in fully developed pipe flow depends on exactly four things: density ρ, velocity V, diameter D, and viscosity µ. That's **4 variables**.",
        },
        {
          title: "2. Count the fundamental dimensions",
          markdown:
            "All four are built from mass M, length L, and time T — **3 fundamental dimensions**:\n\n- ρ → M·L⁻³\n- V → L·T⁻¹\n- D → L\n- µ → M·L⁻¹·T⁻¹",
        },
        {
          title: "3. Let Buckingham-π do the magic",
          markdown:
            "The π-theorem: number of independent dimensionless groups = (variables) − (dimensions) = 4 − 3 = **1**. One. There is room for exactly *one* dimensionless combo of ρ, V, D, µ.",
        },
        {
          title: "4. Build it",
          markdown:
            "Hunt for π = ρ^a · V^b · D^c · µ^d that comes out dimensionless. Match the exponents of M, L, T and you get a single solution (up to a power): π = ρVD/µ. Surprise — it's Reynolds.",
        },
        {
          title: "5. The punchline",
          markdown:
            "Since Re is the *only* dimensionless group available, the dimensionless behavior of the flow (like the friction factor) **must** be a function of Re alone (plus relative roughness for real pipes). One number organizing all of internal flow isn't luck — it's mathematically forced. Drop this in an interview and watch the nod.",
        },
      ],
    },
    {
      id: "b_regimes",
      kind: "PROSE",
      title: "The three personalities of pipe flow 🌊",
      markdown:
        "For a round pipe, the classic thresholds (built on mean velocity and diameter) are:\n\n- **Laminar — Re ≲ 2300.** A calm mountain stream. Fluid moves in smooth parallel layers (laminae) sliding over each other with zero macroscopic mixing. The velocity profile is a clean **parabola** (Hagen–Poiseuille) — centerline runs at 2× the mean. Mixing is purely molecular (slow). Pressure drop grows *linearly* with velocity.\n- **Transitional — ~2300 ≲ Re ≲ 4000.** The river hits some rocks. The flow flickers — turbulent \"puffs\" and \"slugs\" pop up and decay at random. It's twitchy, unsteady, and poorly predicted by tidy formulas. Engineers treat this zone like a pothole: avoid designing in it.\n- **Turbulent — Re ≳ 4000.** Full-on whitewater rapids. Chaotic 3D eddies span a huge range of scales, ferociously mixing momentum across the pipe. The time-averaged profile goes **flat and full** (often a 1/7-power law) with a thin, steep layer hugging the wall. Pressure drop scales roughly with V¹·⁸ to V²·⁰.\n\nNow the plot twist: **2300 is not a sacred constant.** With a mirror-smooth pipe and a vibration-free, ultra-clean inlet, people have kept flow laminar past Re > 10⁵. The 2300 figure is just the robust floor below which *any* disturbance dies out. Interviewers light up when you say the threshold is disturbance- and geometry-dependent — so say it.",
    },
    {
      id: "p_aorta",
      kind: "PREDICT",
      question:
        "Blood in your aorta: roughly ρ ≈ 1060 kg/m³, peak V ≈ 1 m/s, D ≈ 25 mm, µ ≈ 3.5×10⁻³ Pa·s. Is the flow laminar or turbulent?",
      options: [
        { id: "a", label: "Laminar — Re comes out under 2300." },
        { id: "b", label: "Right on the edge — transitional, so it briefly goes turbulent at peak flow." },
        { id: "c", label: "Fully turbulent — your heart is a powerful pump." },
      ],
      answerId: "b",
      reveal:
        "Re = ρVD/µ = 1060 × 1 × 0.025 / 3.5×10⁻³ ≈ 7600 at peak systole — technically turbulent by the round-pipe threshold. But blood flow is pulsatile, so the aorta spends much of the cycle well below that and only flirts with turbulence at the velocity peak. The honest answer is \"transitional / borderline, turbulent only at peak\" — and yes, that turbulence is part of what a doctor hears as a murmur when a valve goes bad. (Pick (b): closest to the real, time-varying truth.)",
    },
    {
      id: "c_visc",
      kind: "CALLOUT",
      variant: "tip",
      title: "µ vs. ν: the viscosity that trips people up",
      markdown:
        "Two viscosities, one common mix-up. Keep them straight:\n\n- **Dynamic viscosity µ** [Pa·s] links shear stress to shear rate: τ = µ·(du/dy). It's the *force* side.\n- **Kinematic viscosity ν = µ/ρ** [m²/s] is a *momentum diffusivity* — how fast momentum spreads out. It's what shows up naturally in Navier–Stokes and in Re = VD/ν.\n\nThe gotcha that catches everyone: air has a **lower** µ than water (air ≈ 1.8×10⁻⁵ Pa·s vs water ≈ 1.0×10⁻³ Pa·s) but a **higher** ν — because air's density is ~800× smaller. Translation: momentum actually diffuses *faster* in air than in water. Counterintuitive, and a favorite trap.",
    },
    {
      id: "s_re",
      kind: "SANDBOX",
      title: "Play: flip the flow yourself 🎛️",
      description:
        "This is the fun part — go break something. With the defaults (water-like fluid, 50 mm pipe, 0.8 m/s) you'll see Re = 40000, deep in turbulent territory. Now hunt for the tipping point: drag V down, shrink D, or crank µ up until Re drops under ~2300 and the flow goes laminar. Feel how stubbornly turbulent water wants to be.",
      variables: [
        { key: "rho", label: "Density ρ", unit: "kg/m³", min: 1, max: 1200, step: 1, default: 1000 },
        { key: "V", label: "Mean velocity V", unit: "m/s", min: 0.01, max: 5, step: 0.01, default: 0.8 },
        { key: "D", label: "Diameter D", unit: "m", min: 0.005, max: 0.5, step: 0.005, default: 0.05 },
        { key: "mu", label: "Dynamic viscosity µ", unit: "Pa·s", min: 0.0001, max: 0.01, step: 0.0001, default: 0.001 },
      ],
      expression: "rho * V * D / mu",
      outputLabel: "Reynolds number Re",
      outputUnit: "",
      precision: 0,
    },
    {
      id: "c_re_check",
      kind: "CALLOUT",
      variant: "insight",
      title: "Did the default surprise you?",
      markdown:
        "Re = ρVD/µ = 1000 × 0.8 × 0.05 / 0.001 = **40000**. Since 40000 ≫ 4000, that gentle 0.8 m/s trickle is firmly **turbulent**. Halve the velocity to 0.4 m/s and you're still at Re = 20000 — still turbulent! To actually reach laminar in this 50 mm water pipe you'd have to crawl down to about V ≈ 0.046 m/s. Lesson: in ordinary water pipes, laminar flow is the rare exception, not the rule.",
    },
    {
      id: "b_headloss",
      kind: "PROSE",
      title: "So what? Turning regime into a pump bill 💸",
      markdown:
        "Classifying the regime is never the real goal — it's the gateway. What you actually want is the **head loss** (and therefore the pump or fan you have to buy) for flow through a pipe of length L. The master equation is **Darcy–Weisbach**:\n\n> h_f = f · (L/D) · V² / (2g)\n\nwhere h_f is head loss [m], f is the dimensionless **Darcy friction factor**, and g is gravity. Pressure drop follows directly: Δp = ρ·g·h_f = f·(L/D)·(ρV²/2).\n\nAll the regime drama is packed into that one little f — and how you find f depends *entirely* on Re:\n\n- **Laminar (Re < 2300):**  `f = 64 / Re`, exactly. No chart, no fuss. It falls straight out of Hagen–Poiseuille (next section), and it ignores roughness completely — the smooth laminar layer never even touches the wall texture.\n- **Turbulent (Re > 4000):**  now f depends on Re *and* relative roughness ε/D, read off the **Moody chart** or solved from the **Colebrook equation**:\n\n> 1/√f = −2·log10( (ε/D)/3.7 + 2.51/(Re·√f) )\n\nColebrook is implicit (f sits on both sides), so you iterate it — or cheat with the explicit Swamee–Jain approximation. Crank Re high enough on a rough pipe and you hit the *fully rough* regime, where f stops caring about Re entirely (the flat right side of the Moody chart).\n\nOne caveat: the **entrance length** before flow is fully developed runs roughly L_e ≈ 0.06·Re·D (laminar) or L_e ≈ 4.4·Re^(1/6)·D, tens of diameters (turbulent). A single f assumes fully developed flow, so short pipes carry extra friction up front.",
    },
    {
      id: "f_darcy",
      kind: "FORMULA",
      title: "Darcy–Weisbach head loss",
      display: "h_f = f · (L/D) · V² / (2·g)",
      variables: [
        { symbol: "h_f", name: "major (friction) head loss", unit: "m" },
        { symbol: "f", name: "Darcy friction factor (dimensionless)", unit: "—" },
        { symbol: "L", name: "pipe length", unit: "m" },
        { symbol: "D", name: "pipe inner diameter", unit: "m" },
        { symbol: "V", name: "mean velocity", unit: "m/s" },
        { symbol: "g", name: "gravitational acceleration", unit: "m/s²" },
      ],
      note:
        "Pressure drop: Δp = ρ·g·h_f. The classic landmine: the Fanning friction factor (loved by chemical engineers) is exactly 1/4 of the Darcy factor — so laminar Fanning is 16/Re, not 64/Re. Always announce which one you're using before someone gets a 4× wrong answer.",
    },
    {
      id: "b_poiseuille",
      kind: "PROSE",
      title: "Where 64/Re actually comes from 🧮",
      markdown:
        "f = 64/Re isn't pulled from a hat — it's *derived*, and it's worth being able to sketch the derivation.\n\nFor steady, fully developed *laminar* flow in a round pipe, Navier–Stokes collapses to a simple balance: pressure gradient pushes, viscous shear resists. Solve that ODE with no-slip at the wall and you get the **parabolic** profile plus the **Hagen–Poiseuille** flow rate:\n\n> Q = π·D⁴·Δp / (128·µ·L)\n\nRearrange for pressure drop and substitute V = Q/(πD²/4):\n\n> Δp = 32·µ·L·V / D²\n\nNow jam that into the Darcy–Weisbach form Δp = f·(L/D)·(ρV²/2) and solve for f:\n\n> f = (Δp · D · 2) / (L · ρV²) = (32µLV/D² · D · 2)/(L·ρV²) = 64µ/(ρVD) = **64/Re**\n\nTwo killer takeaways to drop in an interview: (1) laminar Δp ∝ V — *linear* in velocity, and (2) laminar Δp ∝ 1/D⁴ at fixed Q. That fourth-power dependence is brutal: halve the diameter and the pressure drop jumps **16×**. It's exactly why thin capillaries dominate the resistance of any network — and why a slightly clogged artery is such a big deal.",
    },
    {
      id: "s_friction",
      kind: "SANDBOX",
      title: "Play: the laminar friction factor 🎚️",
      description:
        "Slide a Reynolds number below ~2300 and watch f = 64/Re respond. Notice how steeply f climbs as Re drops toward 1 — low-Re flow is *all* friction. (Above 2300 this formula quietly lies to you; you'd switch to the Moody chart / Colebrook turbulent branch.)",
      variables: [
        { key: "Re", label: "Reynolds number Re", unit: "", min: 1, max: 2300, step: 1, default: 1500 },
      ],
      expression: "64 / Re",
      outputLabel: "Laminar Darcy friction factor f",
      outputUnit: "",
      precision: 4,
    },
    {
      id: "we_pipe",
      kind: "WORKED_EXAMPLE",
      title: "The full move: classify it, then size the pump",
      problem:
        "Water at 20°C (ρ = 998 kg/m³, µ = 1.0×10⁻³ Pa·s) flows at Q = 0.60 L/s through a commercial-steel pipe of inner diameter D = 25 mm and length L = 50 m. The pipe roughness is ε = 0.045 mm. Find the mean velocity, the Reynolds number, the flow regime, and the head loss and pressure drop over the 50 m. Use g = 9.81 m/s². This is the exact sequence an interviewer wants to see end-to-end.",
      steps: [
        {
          label: "Mean velocity from continuity",
          markdown:
            "A = π·D²/4 = π·(0.025)²/4 = 4.909×10⁻⁴ m². With Q = 0.60 L/s = 6.0×10⁻⁴ m³/s:\n\nV = Q/A = 6.0×10⁻⁴ / 4.909×10⁻⁴ ≈ **1.22 m/s**.",
        },
        {
          label: "Reynolds number",
          markdown:
            "Re = ρVD/µ = 998 × 1.22 × 0.025 / (1.0×10⁻³) ≈ **30 500**.",
        },
        {
          label: "Classify the regime",
          markdown:
            "30 500 ≫ 4000, so **turbulent**. Resist the urge to grab f = 64/Re — it doesn't apply here. We need the turbulent branch with relative roughness ε/D = 0.045/25 = **0.0018**.",
        },
        {
          label: "Friction factor (Colebrook)",
          markdown:
            "Iterating Colebrook  1/√f = −2·log10( (ε/D)/3.7 + 2.51/(Re·√f) )  with ε/D = 0.0018 and Re = 30 500 converges to **f ≈ 0.0276** (Swamee–Jain gives ≈ 0.0279 — close enough to trust).",
        },
        {
          label: "Head loss (Darcy–Weisbach)",
          markdown:
            "h_f = f·(L/D)·V²/(2g) = 0.0276 × (50/0.025) × (1.22²)/(2×9.81)\n\n= 0.0276 × 2000 × 1.4884/19.62 ≈ **4.2 m** of water.",
        },
        {
          label: "Pressure drop",
          markdown:
            "Δp = ρ·g·h_f = 998 × 9.81 × 4.2 ≈ 4.1×10⁴ Pa ≈ **41 kPa** (about 0.41 bar). That's the duty your pump has to overcome.",
        },
      ],
      answer:
        "V ≈ 1.22 m/s, Re ≈ 30 500 → turbulent; with f ≈ 0.0276, h_f ≈ 4.2 m and Δp ≈ 41 kPa over the 50 m run.",
    },
    {
      id: "c_warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Five mistakes that quietly sink interviews ⚠️",
      markdown:
        "- **Using f = 64/Re for turbulent flow.** It's laminar-only. Above Re ≈ 4000 you *must* go Moody / Colebrook with relative roughness. Plug 64/Re into a turbulent case and you'll badly underestimate the loss.\n- **Mixing up Darcy and Fanning** (factor of 4). Darcy laminar = 64/Re; Fanning laminar = 16/Re. Say which one out loud.\n- **Wrong characteristic length.** Non-circular duct? Use the hydraulic diameter D_h = 4A/P — never a side length.\n- **Adding roughness to laminar flow.** Laminar f depends on Re only; roughness does nothing (the smooth viscous layer blankets the wall).\n- **Treating 2300 as gospel.** It's a practical floor, not a constant. Transition depends on disturbances and geometry.",
    },
    {
      id: "c_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "In the interview: what they're really fishing for 🎯",
      markdown:
        "When they lob \"so, what's the Reynolds number?\" they want three layers, delivered fast and confident:\n\n1. **The formula** — Re = ρVD/µ = VD/ν, dimensionless. (Write it without flinching.)\n2. **The meaning** — ratio of inertial to viscous forces; high Re → inertia wins → turbulence; and it's the *only* dimensionless group (dimensional analysis), so it governs the friction factor.\n3. **The consequence** — pick the friction-factor branch (64/Re vs. Moody/Colebrook) and estimate head loss / pump duty.\n\nSenior-candidate bonus points: noting that transition (~2300) is disturbance-dependent, that laminar is parabolic while turbulent is fuller/flatter, and that **dynamic similarity** (matching Re) is the whole reason scale-model wind-tunnel testing works. Say that last one and you'll feel the room shift.",
    },
    {
      id: "ck_regime",
      kind: "CHECK",
      question:
        "Oil (ρ = 880 kg/m³, µ = 0.20 Pa·s) flows at V = 0.5 m/s through a D = 0.10 m pipe. What is the flow regime?",
      choices: [
        { id: "a", label: "Turbulent (Re > 4000)" },
        { id: "b", label: "Transitional (2300 < Re < 4000)" },
        { id: "c", label: "Laminar (Re < 2300)" },
        { id: "d", label: "Cannot tell without the roughness ε" },
      ],
      answerId: "c",
      explanation:
        "Re = ρVD/µ = 880 × 0.5 × 0.10 / 0.20 = 220. Since 220 ≪ 2300, it's laminar. Oil's heavy viscosity hands the viscous corner an easy win even at a respectable 0.5 m/s. And roughness? Irrelevant for classifying the regime — and irrelevant for laminar friction too.",
    },
    {
      id: "ck_friction",
      kind: "CHECK",
      question:
        "For fully developed laminar pipe flow, how does the Darcy friction factor depend on surface roughness?",
      choices: [
        { id: "a", label: "It increases with roughness, just like turbulent flow." },
        { id: "b", label: "It is independent of roughness; f = 64/Re depends only on Re." },
        { id: "c", label: "It decreases with roughness because eddies are suppressed." },
        { id: "d", label: "It depends on roughness only above ε/D = 0.001." },
      ],
      answerId: "b",
      explanation:
        "In laminar flow f = 64/Re exactly, straight from Hagen–Poiseuille, with zero roughness term. The smooth, orderly layer hugging the wall means the bulk flow never even feels the wall's texture. Roughness only enters the story once the flow goes turbulent (Moody chart / Colebrook).",
    },
  ],
  keyTakeaways: [
    "Re = ρVD/µ = VD/ν is a dimensionless scorecard for inertia vs. viscosity. High Re → inertia wins → turbulence; low Re → viscosity wins → laminar. For pipes the characteristic length is D (or D_h = 4A/P).",
    "Dimensional analysis (Buckingham-π) proves Re is the *single* dimensionless group from ρ, V, D, µ — which is *why* it alone (plus ε/D for real pipes) controls the friction factor.",
    "Three personalities: laminar (Re ≲ 2300, parabolic, calm), transitional (~2300–4000, twitchy), turbulent (≳ 4000, eddying, flat/full). The threshold is disturbance- and geometry-dependent, not a universal constant.",
    "Dynamic µ [Pa·s] sets shear stress (τ = µ du/dy); kinematic ν = µ/ρ [m²/s] is the momentum diffusivity in Re = VD/ν — and air's ν beats water's despite air's lower µ.",
    "Head loss = Darcy–Weisbach h_f = f·(L/D)·V²/(2g), with Δp = ρ·g·h_f. The friction factor f is the regime-dependent piece.",
    "Laminar f = 64/Re exactly (Hagen–Poiseuille, roughness-independent); turbulent f comes from the Moody chart / Colebrook using ε/D. Never use 64/Re for turbulent flow.",
    "The default sandbox case (water, V = 0.8 m/s, D = 50 mm) gives Re = 40000 — firmly turbulent. In real water pipes, laminar flow is the rare exception.",
  ],
};
