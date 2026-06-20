import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_hydraulics",
  slug: "hydraulics-and-water-resources",
  title: "Open-Channel Flow: How Water Moves When the Sky Is the Lid",
  summary:
    "A pipe is shoved by pressure. A river is dragged by gravity, with nothing but air on top. That free surface changes everything — it lets water speed up, pile into waves, and switch personalities at the magic number Fr = 1. We'll build Manning's equation from roughness and shape, play in a sandbox, decode the hydraulic radius, and meet the Froude number that tells calm rivers from raging ones.",
  discipline: "CIVIL",
  difficulty: "MEDIUM",
  estMinutes: 23,
  tags: ["hydraulics", "open-channel", "water-resources"],
  objectives: [
    "Tell open-channel flow apart from pressurized pipe flow, and say what the free surface changes.",
    "Use Manning's equation to predict flow velocity from roughness, channel shape, and slope.",
    "Compute the hydraulic radius R = A/P and explain why it — not raw area — sets the flow.",
    "Define normal (uniform) flow and combine V with continuity Q = V·A to get discharge.",
    "Interpret the Froude number to call a flow subcritical (calm) or supercritical (fast and shallow).",
    "Sketch how the rational method turns rainfall into a peak runoff flow at a conceptual level.",
  ],
  prerequisites: [
    "Continuity: flow rate Q = velocity × area",
    "Basic geometry (area and perimeter of simple shapes)",
    "The idea of slope as rise over run, and gravity driving flow downhill",
  ],
  interviewAngle:
    "Water-resources interviews love open-channel flow because it tests whether you grasp a system governed by a free surface rather than confined pressure. The opening probe is often \"how is flow in a river different from flow in a pipe?\" — and the strong answer goes straight to the free surface: a pipe is driven by a pressure gradient and fills its whole section, while an open channel is driven by gravity along the bed slope and can adjust its own depth. Expect them to ask you to write and explain Manning's equation, defend why velocity depends on the hydraulic radius R = A/P (a shape efficiency measure) rather than raw area, and reason about how roughness n and slope S push velocity around. The Froude number is a favorite conceptual follow-up: can you distinguish subcritical (deep, calm, Fr < 1, disturbances travel upstream) from supercritical (shallow, fast, Fr > 1) flow, and explain what a hydraulic jump is? Drainage design rounds it out — sketching the rational method Q = C·i·A to size a storm sewer or culvert from a design storm shows you can connect hydrology to hydraulics. Candidates who can move fluidly from Manning to continuity to the Froude regime signal real water-resources depth.",
  blocks: [
    {
      id: "b_hook_prose",
      kind: "PROSE",
      title: "Why a river isn't just a pipe with the top cut off 🌊",
      markdown:
        "Open a faucet and water shoots out of a pipe because something *pushed* it — pressure built up behind it and squeezed it through a fully-filled tube. Now picture a creek tumbling down a hillside. Nothing is pushing it. There's no pressure cap, no pump — just **gravity** dragging it downhill, with open *air* sitting on top of the water the whole way.\n\nThat open top — the **free surface** — is the entire personality of open-channel flow. Because the surface is free, the water can do things a pipe never could: it can get deeper or shallower, speed up and thin out, pile into standing waves, even violently switch from a calm glide into a shallow rush (and slam back the other way in a churning **hydraulic jump**). A pipe under pressure can't do any of that — it's full, it's confined, and pressure does the talking.\n\nRivers, canals, storm drains running partly full, irrigation ditches, the gutter in a rainstorm — they're all open channels, all ruled by gravity and that free surface. By the end of this lesson you'll predict how fast water moves down a channel from just its roughness, shape, and slope, you'll know why a fat shallow channel can flow *slower* than a compact one, and you'll be able to call a flow calm or wild from a single number. First, watch the classic equations in action.",
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "pC5s2DeXGeM",
      title: "Watch: Open-Channel Flow — Chezy & Manning",
    },
    {
      id: "b_intuition_prose",
      kind: "PROSE",
      title: "What actually sets the speed: a tug-of-war on the bed",
      markdown:
        "In a channel flowing steadily downhill, two forces fight to a draw. Gravity, acting along the **slope** of the bed, pulls the water forward. Friction along the **wetted boundary** — the bed and the side walls the water actually touches — drags it back. When they balance, the water settles into a steady speed and a steady depth. That balanced condition is called **normal (uniform) flow**, and it's the situation Manning's equation describes.\n\nThree levers control who wins the tug-of-war:\n\n- **Slope S — steeper bed, faster water.** More gravity pull along the flow. (A near-flat canal barely moves; a mountain chute screams.)\n- **Roughness n — rougher bed, slower water.** A concrete-lined channel is slick (low n); a weedy, rocky natural stream is draggy (high n). Manning bottles all that friction into one empirical number, `n`.\n- **Hydraulic radius R — more efficient shape, faster water.** This is the sneaky one. `R = A/P` is the cross-section area divided by the *wetted perimeter*, the length of boundary in contact with water. Big area is good (more water, less affected by edges); long wetted perimeter is bad (more surface to rub against). R rewards channels that carry a lot of water while touching little boundary — deep and compact beats wide and shallow.\n\nHold the slope and roughness fixed, and a *deeper, more compact* channel flows faster than a *broad, shallow* one carrying the same water — because the shallow one drags against far more boundary per unit of flow. Shape is everything.",
    },
    {
      id: "b_formula",
      kind: "FORMULA",
      title: "Manning's equation (open-channel velocity)",
      display: "V = (1/n) · R^(2/3) · S^(1/2)",
      variables: [
        { symbol: "V", name: "Mean flow velocity", unit: "m/s" },
        { symbol: "n", name: "Manning roughness coefficient (empirical)", unit: "–" },
        { symbol: "R", name: "Hydraulic radius, R = A/P", unit: "m" },
        { symbol: "S", name: "Channel bed slope (dimensionless, rise/run)", unit: "–" },
      ],
      note:
        "This is the SI form (the leading constant is 1; in US customary units it's 1.486). Velocity rises with slope (as √S) and with hydraulic radius (as R to the two-thirds power), and falls as roughness n increases — rougher channel, slower water. Multiply V by the flow area A and you get the discharge Q = V·A, the actual volume of water per second. Manning's n is famously sensitive: a small misjudgment of roughness swings your answer noticeably, so engineers lean on published n tables for concrete, earth, gravel, vegetated channels, and the like.",
    },
    {
      id: "b_sandbox",
      kind: "SANDBOX",
      title: "Play: the Manning velocity explorer",
      description:
        "Drag roughness, hydraulic radius, and slope and watch the water speed up or bog down. Smooth out the channel (drop n) and velocity jumps. Tilt the bed steeper (raise S) and it climbs as the square root. Make the section deeper and more compact (raise R) and it climbs as the two-thirds power. Defaults model a concrete-lined channel: n = 0.013, R = 0.5 m, gentle slope S = 0.001.",
      variables: [
        {
          key: "n",
          label: "Manning roughness n",
          unit: "",
          min: 0.01,
          max: 0.05,
          step: 0.001,
          default: 0.013,
        },
        {
          key: "R",
          label: "Hydraulic radius R",
          unit: "m",
          min: 0.1,
          max: 3,
          step: 0.1,
          default: 0.5,
        },
        {
          key: "S",
          label: "Channel slope S",
          unit: "",
          min: 0.0001,
          max: 0.05,
          step: 0.0001,
          default: 0.001,
        },
      ],
      expression: "(1 / n) * R ^ (2/3) * S ^ 0.5",
      outputLabel: "Flow velocity",
      outputUnit: "m/s",
      precision: 2,
    },
    {
      id: "b_predict_slope",
      kind: "PREDICT",
      question:
        "You take a channel and make it 4 times steeper (slope S goes up 4×), keeping roughness and shape the same. Roughly how much faster does the water flow?",
      options: [
        { id: "p1", label: "About 4× faster" },
        { id: "p2", label: "About 2× faster" },
        { id: "p3", label: "About 1.6× faster" },
        { id: "p4", label: "Almost no change" },
      ],
      answerId: "p2",
      reveal:
        "**About 2× faster.** Manning has velocity going as `√S` — slope under a square root. Quadruple the slope and velocity only goes up by √4 = 2. So steepness helps, but with diminishing returns: each extra bit of slope buys less and less speed. (This is also why even very gently graded storm drains can move water adequately — you don't need a cliff, and you wouldn't get four times the benefit from one anyway.)",
    },
    {
      id: "b_predict_radius",
      kind: "PREDICT",
      question:
        "Two channels carry the same flow down the same slope with the same lining. Channel A is deep and compact; channel B is wide and very shallow — so B touches far more boundary (bigger wetted perimeter) for the same area. Which flows faster?",
      options: [
        { id: "q1", label: "Channel A — the deep, compact one" },
        { id: "q2", label: "Channel B — the wide, shallow one" },
        { id: "q3", label: "Same speed — area is equal, so velocity is equal" },
        { id: "q4", label: "Impossible to say without the exact numbers" },
      ],
      answerId: "q1",
      reveal:
        "**Channel A, the deep and compact one.** Velocity tracks the hydraulic radius `R = A/P`, not raw area. The wide, shallow channel B drags against a much longer wetted perimeter P for the same area A, so its R is smaller and friction wins more of the tug-of-war — it flows slower. Deep and compact maximizes water carried per unit of rubbing boundary. It's exactly why efficient channel designs trend toward compact sections (a half-square or trapezoid near a semicircle) rather than wide flat sheets.",
    },
    {
      id: "b_froude_prose",
      kind: "PROSE",
      title: "The Froude number: is this river calm or wild? 🚣",
      markdown:
        "Drop a pebble into a slow, deep stream and ripples spread out in *every* direction — even upstream, against the current. Drop one into a fast, shallow rapid and the ripples can't fight their way back up; every disturbance is swept downstream. That difference has a name and a number: the **Froude number**, `Fr = V / √(g·y)`, where `y` is the flow depth and `g` is gravity. It's the ratio of how fast the water moves to how fast a small surface wave can travel.\n\n- **Fr < 1 — subcritical flow.** Deep, slow, tranquil. Waves *can* travel upstream, so a downstream obstacle (a culvert, a weir) makes its presence felt back upstream. Most natural rivers in their gentle reaches live here. Control comes from downstream.\n- **Fr = 1 — critical flow.** The knife's edge. Velocity exactly matches the wave speed. Minimum energy for a given flow — and an unstable, twitchy state to design *around*, not *for*.\n- **Fr > 1 — supercritical flow.** Shallow, fast, intense — think spillway chutes and steep rapids. Waves can't propagate upstream; the flow is controlled from *upstream*. Disturbances pile up.\n\nThe drama happens when fast supercritical water has to slow down to subcritical — it can't do it smoothly, so it erupts in a **hydraulic jump**: a sudden, turbulent wall of churning water that dumps a lot of energy. Engineers actually *use* jumps on purpose, in stilling basins below dams, to kill the destructive energy of fast water before it scours everything downstream. The free surface giveth wild flow, and the hydraulic jump taketh the energy away.",
    },
    {
      id: "b_froude_callout",
      kind: "CALLOUT",
      variant: "insight",
      title: "Manning gives the speed; Froude gives the personality",
      markdown:
        "These two ideas answer different questions and you need both:\n\n- **Manning** answers *\"how fast and how much?\"* — it predicts the velocity (and via Q = V·A, the discharge) for steady normal flow, from roughness, shape, and slope.\n- **Froude** answers *\"what kind of flow is this?\"* — it classifies the regime as calm (subcritical) or wild (supercritical), which tells you where control comes from and whether to expect hydraulic jumps.\n\nA channel can carry the exact same discharge as *either* a deep tranquil subcritical flow or a shallow racing supercritical one — same Q, totally different behavior, surface profile, and erosion risk. That's why a good designer never stops at \"the velocity is X m/s.\" They immediately ask: \"and is it subcritical or supercritical?\" — because the answer changes how the channel behaves at every transition, drop, and structure.",
    },
    {
      id: "b_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "From geometry to discharge: a concrete trapezoidal channel",
      problem:
        "A concrete-lined channel (Manning n = 0.013) runs on a slope S = 0.001. At the design depth the flow cross-section has area A = 2.0 m² and wetted perimeter P = 4.0 m. (a) Find the hydraulic radius R. (b) Use Manning to find the flow velocity V. (c) Find the discharge Q. (d) Comment on whether more slope would have helped much.",
      steps: [
        {
          label: "Step (a) — Hydraulic radius",
          markdown:
            "R = A / P = 2.0 m² / 4.0 m = **0.5 m**. (This matches the sandbox default — a nicely compact section.)",
        },
        {
          label: "Step (b) — Manning velocity",
          markdown:
            "V = (1/n)·R^(2/3)·S^(1/2) = (1/0.013) × (0.5)^(2/3) × (0.001)^(1/2). Work the pieces: 1/0.013 ≈ 76.9; (0.5)^(2/3) ≈ 0.630; (0.001)^(1/2) ≈ 0.0316. Multiply: 76.9 × 0.630 × 0.0316 ≈ **1.53 m/s**. (Same as the sandbox at its defaults.)",
        },
        {
          label: "Step (c) — Discharge from continuity",
          markdown:
            "Q = V·A = 1.53 m/s × 2.0 m² ≈ **3.06 m³/s** (about 3060 liters every second). Continuity ties the speed back to the actual volume of water the channel delivers.",
        },
        {
          label: "Step (d) — Would steeper help?",
          markdown:
            "Velocity scales as √S, so to *double* this velocity you'd need to *quadruple* the slope (to S = 0.004). Slope helps with steep diminishing returns — often it's cheaper to smooth the lining (lower n) or improve the section shape (raise R) than to dig a much steeper grade. You'd also then check the Froude number to confirm the flow regime is acceptable.",
        },
      ],
      answer:
        "R = A/P = **0.5 m**; V = (1/0.013)·(0.5)^(2/3)·(0.001)^(1/2) ≈ **1.53 m/s**; Q = V·A ≈ **3.06 m³/s**. **The recipe: get R from the geometry, get V from Manning, get Q from continuity (Q = V·A) — then classify the regime with Froude.** And remember slope buys speed only as √S, so it's a tool of diminishing returns.",
    },
    {
      id: "b_rational_prose",
      kind: "PROSE",
      title: "Where does the design flow come from? The rational method ☔",
      markdown:
        "Before you can size a storm drain or a roadside ditch, you need to know *how much water will show up.* For small drainage areas, engineers reach for the classic **rational method**:\n\n```\nQ = C · i · A\n```\n\nIt's beautifully intuitive:\n\n- **A** — the drainage area collecting the rain (the catchment feeding your channel).\n- **i** — the rainfall *intensity* of the design storm (how hard it pours, picked for a chosen return period like a 10-year or 25-year event — bigger structures, rarer-and-bigger storm).\n- **C** — the **runoff coefficient**, between 0 and 1, capturing how much rain actually runs off rather than soaking in. A parking lot or roof is nearly all runoff (C close to 1); a forest or meadow drinks most of it (C small).\n\nMultiply them and you get a *peak* runoff flow Q. Then you hand that Q to the open-channel side of your brain: pick a channel or pipe and use Manning (and continuity, and a Froude check) to make sure it can carry that Q at an acceptable velocity and depth — fast enough not to silt up, slow enough not to erode. That's the full arc of water-resources design in one breath: **hydrology** (rational method → how much water) feeding **hydraulics** (Manning → can this channel handle it). The sky delivers the load; the channel has to take it.",
    },
    {
      id: "b_check_pipe_vs_channel",
      kind: "CHECK",
      question:
        "What fundamentally distinguishes open-channel flow from full pipe flow?",
      choices: [
        { id: "c1", label: "Open channels carry clean water; pipes carry dirty water." },
        {
          id: "c2",
          label:
            "Open-channel flow has a free surface and is driven by gravity along the bed slope; full pipe flow is enclosed and driven by a pressure gradient.",
        },
        { id: "c3", label: "Open channels are always faster than pipes." },
        { id: "c4", label: "Pipe flow ignores friction, but channel flow does not." },
      ],
      answerId: "c2",
      explanation:
        "The defining difference is the free surface. An open channel has air on top and is pushed by gravity along its slope, free to change depth; a full pipe is confined and driven by pressure built up within it. That free surface is what lets channels speed up, change depth, and form waves and hydraulic jumps — behavior a pressurized pipe can't show.",
    },
    {
      id: "b_check_froude",
      kind: "CHECK",
      question:
        "A flow has a Froude number Fr = 0.4. How would you describe it?",
      choices: [
        {
          id: "d1",
          label: "Supercritical — shallow and fast; disturbances can't travel upstream.",
        },
        {
          id: "d2",
          label: "Subcritical — deep and tranquil; surface waves can travel upstream.",
        },
        { id: "d3", label: "Critical — exactly at minimum energy and unstable." },
        { id: "d4", label: "Impossible — the Froude number can't be below 1." },
      ],
      answerId: "d2",
      explanation:
        "Fr < 1 means subcritical flow: relatively deep and slow, where the water moves slower than a surface wave, so disturbances can propagate upstream and the flow is controlled from downstream. Fr > 1 would be supercritical (shallow, fast, controlled from upstream), and Fr = 1 is the unstable critical point. At Fr = 0.4 the river is firmly in calm, subcritical territory.",
    },
    {
      id: "b_interview_callout",
      kind: "CALLOUT",
      variant: "interview",
      title: "In the interview: \"How is a river different from a pipe?\"",
      markdown:
        "This is the open-channel opener, and a crisp, layered answer signals real water-resources depth:\n\n1. **Lead with the free surface:** \"A full pipe is confined and driven by a pressure gradient; an open channel has a free surface and is driven by gravity along the bed slope — so it can adjust its own depth.\"\n2. **Quantify the speed with Manning:** write V = (1/n)·R^(2/3)·S^(1/2). Explain each lever — roughness n drags, slope S drives (as √S), and hydraulic radius R = A/P rewards efficient shape. Then get discharge from continuity, Q = V·A.\n3. **Defend R over A:** \"Velocity depends on the hydraulic radius, not raw area, because friction acts on the wetted perimeter — a deep compact section beats a wide shallow one.\"\n4. **Classify with Froude:** \"Then I'd check the Froude number — Fr < 1 is subcritical and calm, controlled from downstream; Fr > 1 is supercritical, fast and shallow, controlled from upstream; the transition makes a hydraulic jump.\"\n5. **Connect to design:** mention the rational method Q = C·i·A to get the design flow, then size the channel with Manning to carry it without silting or scouring.\n\nMoving smoothly from Manning to continuity to Froude — and tying hydrology to hydraulics — is what separates the strong candidate from the formula reciter.",
    },
  ],
  keyTakeaways: [
    "Open-channel flow has a free surface and is driven by gravity down the bed slope; a full pipe is confined and pressure-driven — the free surface is what lets channels change depth, form waves, and jump.",
    "Manning's equation V = (1/n)·R^(2/3)·S^(1/2) predicts velocity in steady normal flow: rougher (higher n) is slower, steeper (higher S) and more efficient shape (higher R) are faster.",
    "The hydraulic radius R = A/P — not raw area — sets the flow, because friction acts on the wetted perimeter; deep, compact channels beat wide, shallow ones.",
    "Slope helps only as √S, so velocity has steeply diminishing returns on steepness; combine V with continuity Q = V·A to get discharge.",
    "The Froude number classifies the regime: Fr < 1 subcritical (deep, calm, controlled downstream), Fr > 1 supercritical (shallow, fast, controlled upstream), and a hydraulic jump dissipates energy at the transition.",
    "Manning answers 'how fast and how much,' while Froude answers 'what kind of flow' — the same discharge can be a tranquil or a wild flow, so always check both.",
    "Water-resources design links hydrology to hydraulics: the rational method Q = C·i·A estimates peak runoff, then Manning sizes the channel to carry it at a safe velocity and depth.",
  ],
};
