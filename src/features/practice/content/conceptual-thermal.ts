import type { PracticeProblem } from "../types";

// ---------------------------------------------------------------------------
//  CONCEPTUAL thermal questions — thermodynamics + heat transfer, the reasoning
//  a THERMAL ENGINEERING interview probes. Open-ended (LLM_GRADED), multi-part
//  with constraint changes. No calculator required — these test understanding.
// ---------------------------------------------------------------------------

export const problems: PracticeProblem[] = [
  {
    id: "concept_thermal_fins",
    slug: "concept-heat-sink-fins",
    title: "Why a Heat Sink Has Fins",
    prompt:
      "An electronic component runs too hot. An engineer bolts a finned aluminum\n" +
      "heat sink onto it, exposed to the surrounding air.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["thermal", "heat-transfer", "fins", "convection", "conceptual"],
    skillAreas: ["heat-transfer"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "How do the fins help cool the component? Reason about what's limiting the heat flow before and after.",
        rubric:
          "Heat leaves a surface by convection at Q = h·A·ΔT. The bottleneck is usually the small surface AREA and the modest convection coefficient h to air (a large 1/hA resistance). Fins greatly increase the effective surface area exposed to the air, so more heat is convected for the same ΔT — they attack the dominant surface-to-air convective resistance. A good fin uses a high-conductivity material (aluminum) so it stays near the base temperature along its length (high fin efficiency). Key insight: fins lower the convective resistance by adding area; they help most when convection (1/hA) is the limiting resistance.",
      },
      {
        prompt:
          "To cool it further, is it better to add MORE fins or make the existing fins LONGER? And when could adding fins actually make things WORSE?",
        rubric:
          "More fins (more area) usually beats longer fins: a long fin has diminishing returns because its tip approaches ambient (little ΔT there), so fin efficiency falls with length (~tanh(mL)/mL). Extra short fins add area where ΔT is still high. Fins can HURT when: (a) packed too densely, choking the airflow and dropping h between them; (b) made of low-conductivity or too-thin/long material (low efficiency — the fin can even act like insulation, effectiveness < 1); or (c) used where convection isn't the limiting resistance. Key insight: add area where ΔT is high (more fins) and keep fin efficiency up; over-long or over-dense fins give diminishing or negative returns.",
      },
    ],
  },

  {
    id: "concept_thermal_critical_radius",
    slug: "concept-critical-radius-insulation",
    title: "When Insulation Makes Things Hotter",
    prompt:
      "A thin electrical wire (or a small-diameter pipe) carries current and runs\n" +
      "warm. To reduce heat loss, a technician wraps a layer of insulation around\n" +
      "it.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["thermal", "heat-transfer", "insulation", "conceptual"],
    skillAreas: ["heat-transfer"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Counterintuitively, adding the first bit of insulation can make the wire lose MORE heat (run cooler), not less. How is that possible?",
        rubric:
          "Two competing effects when insulating a cylinder: (1) conduction resistance through the insulation INCREASES with thickness (reduces loss), but (2) the OUTER surface area grows with radius, which DECREASES the convective resistance 1/hA (more area to convect from). For a small starting radius the second effect dominates at first, so total resistance drops and heat loss INCREASES. This defines the CRITICAL RADIUS r_cr = k_ins/h: below it, adding insulation increases loss; above it, insulation finally reduces loss. Key insight: on small cylinders, added insulation grows the outer area faster than it adds conduction resistance until r = k/h.",
      },
      {
        prompt:
          "So when does insulation reliably reduce heat loss — and how does this differ for a large pipe versus a thin wire, or for a flat wall?",
        rubric:
          "Insulation reliably reduces loss once the outer radius exceeds r_cr = k_ins/h (and for all further additions). A large pipe usually already has radius > r_cr, so insulation always helps it. A thin wire can sit below r_cr, so a thin wrap can increase loss (sometimes used deliberately to cool current-carrying wires). A FLAT wall has no area-growth effect (constant area), so adding insulation always increases resistance and always reduces loss — the critical-radius effect is purely a cylindrical/spherical (curved-geometry) phenomenon. Key insight: the paradox exists only for small-radius curved geometries; flat walls and large pipes always benefit from insulation.",
      },
    ],
  },

  {
    id: "concept_thermal_counterflow",
    slug: "concept-counterflow-vs-parallel-hx",
    title: "Counterflow vs Parallel-Flow Heat Exchanger",
    prompt:
      "A heat exchanger moves heat from a hot fluid stream to a cold one. You can\n" +
      "plumb the streams to flow in the SAME direction (parallel flow) or in\n" +
      "OPPOSITE directions (counterflow).",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 28,
    tags: ["thermal", "heat-transfer", "heat-exchanger", "conceptual"],
    skillAreas: ["heat-transfer", "thermodynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Which arrangement transfers heat more effectively for the same size and flow rates, and why? Think about the temperature difference along the length.",
        rubric:
          "COUNTERFLOW is more effective. In parallel flow both streams enter together: ΔT (the driving force) is huge at the inlet but collapses toward a common temperature, and the cold outlet can never exceed the hot outlet. In counterflow the opposing streams keep a more UNIFORM, larger average ΔT along the whole length, and the cold fluid can even leave hotter than the hot stream's outlet. A more uniform ΔT gives a higher log-mean temperature difference (LMTD), so Q = U·A·ΔT_lm is larger for the same area — higher effectiveness. Key insight: counterflow maintains a larger, more even ΔT along the unit, transferring more heat and reaching higher outlet temperatures.",
      },
      {
        prompt:
          "What ultimately limits how much heat you can transfer, even with an infinitely long counterflow exchanger? If you can't add length, how do you increase capacity?",
        rubric:
          "Even an infinite counterflow exchanger is bounded: Q_max = C_min·(T_hot,in − T_cold,in), where C_min is the smaller heat-capacity rate (ṁ·cp). Effectiveness → 1 means the C_min stream reaches the other stream's inlet temperature — you can't beat that ΔT (an energy/second-law limit), and added length gives diminishing returns as ΔT shrinks. To raise capacity without length: increase U (turbulence, better surfaces, remove fouling), increase area A (more/finned tubes), raise the C_min flow rate, or increase the inlet temperature difference. Key insight: capacity is capped by C_min·ΔT_max; beyond that, boost U, A, or flow — not length.",
      },
    ],
  },

  {
    id: "concept_thermal_resistance_wall",
    slug: "concept-composite-wall-resistance",
    title: "Heat Through a Layered Wall",
    prompt:
      "A furnace wall is built from two stacked material layers (a structural\n" +
      "layer and an insulating layer), with hot gas on one side and room air on\n" +
      "the other.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["thermal", "heat-transfer", "thermal-resistance", "conceptual"],
    skillAreas: ["heat-transfer"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "How do you reason about the heat flow through this multi-layer wall, and which layer controls the heat loss?",
        rubric:
          "Model it as thermal RESISTANCES in SERIES: inside convection (1/h_in·A), conduction through each layer (L/kA), then outside convection (1/h_out·A). Heat flow Q = ΔT_total / ΣR, and the temperature drop across each element is proportional to its resistance. The layer that CONTROLS heat loss is the one with the LARGEST resistance — usually the insulating layer (low k → large L/kA). Improving a small-resistance layer barely changes Q; the biggest lever is the dominant resistance. Key insight: series resistances add; the largest resistance dominates and takes the biggest temperature drop — improve that one.",
      },
      {
        prompt:
          "In practice the layers are just pressed together, not perfectly bonded. Why does that interface add resistance, and how would you reduce it?",
        rubric:
          "Real surfaces touch only at scattered micro-asperities; the gaps between are filled with air (a poor conductor), so heat funnels through tiny contact points or must cross the air gap. This THERMAL CONTACT RESISTANCE adds a series resistance and causes a temperature JUMP at the interface. Reduce it by raising contact pressure (flattening asperities → more true contact area), using smoother/flatter surfaces, a softer interface material, or filling the gaps with a high-conductivity thermal interface material (paste/grease, solder) to displace the insulating air. Key insight: contact resistance comes from air-filled micro-gaps — increase pressure, improve flatness, or add a conductive filler.",
      },
    ],
  },

  {
    id: "concept_thermal_biot_quench",
    slug: "concept-biot-number-quench",
    title: "Quenching: Uniform or Cracked",
    prompt:
      "Two solid steel balls — one small, one large — are heated red-hot and then\n" +
      "dropped into a tank of cool water to quench them.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["thermal", "heat-transfer", "transient", "biot", "conceptual"],
    skillAreas: ["heat-transfer", "materials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "When can you treat a quenched part as having one uniform temperature as it cools, and when must you worry about internal gradients? What governs it?",
        rubric:
          "The BIOT number Bi = h·L_c/k (L_c = volume/surface area) governs it — it compares internal conduction resistance to surface convection resistance. If Bi << 1 (~<0.1) — small size, high conductivity, modest h — internal conduction keeps the part nearly UNIFORM in temperature (lumped-capacitance: it cools exponentially). If Bi is large — big part, low conductivity, or aggressive convection — the surface cools far faster than the interior can follow, creating steep internal GRADIENTS (hot core, cold surface). Key insight: Bi = hL/k decides it: small Bi → uniform (lumped); large Bi → significant internal gradients.",
      },
      {
        prompt:
          "The large ball cracks during the quench while the small one doesn't. Connect this to the gradients, and how would you prevent it?",
        rubric:
          "The large ball has a high Biot number: its surface cools and contracts rapidly while the hot interior is still expanded, producing large THERMAL GRADIENTS and thus thermal stresses (tensile at the cooling surface) — plus, in steel, phase-change (martensite) volume changes. When these exceed the material's strength it quench-cracks. The small ball stays nearly uniform (low Bi), so little gradient/stress. Prevent it by quenching more gently (lower h — oil or air instead of water, lowering Bi), slower/interrupted cooling, tempering, a tougher material, avoiding sharp corners, or smaller sections. Key insight: high-Bi cooling builds surface-vs-core gradients → thermal stress → cracking; reduce the gradient (slower quench / lower h) or the section size.",
      },
    ],
  },

  {
    id: "concept_thermal_radiation_shield",
    slug: "concept-radiation-shield",
    title: "Radiation Across a Vacuum",
    prompt:
      "Two surfaces at different temperatures face each other across a vacuum gap\n" +
      "(no air), so they exchange heat only by thermal radiation.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["thermal", "heat-transfer", "radiation", "conceptual"],
    skillAreas: ["heat-transfer"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "What controls how much heat radiates between them, and why does surface finish (shiny vs matte black) matter so much?",
        rubric:
          "Radiative exchange scales with the difference of ABSOLUTE temperatures to the FOURTH power: Q ∝ ε·σ·A·(T1⁴ − T2⁴), times the emissivity ε (0–1) and view factor. A matte black surface has high ε (~1) and radiates/absorbs strongly; a shiny/polished surface has low ε (high reflectivity) and radiates/absorbs little — so a black surface exchanges far more radiant heat than a shiny one at the same temperature. The T⁴ dependence makes radiation dominant at high temperatures and large temperature differences. Key insight: Q ∝ εσA(T1⁴−T2⁴) — emissivity (finish) and absolute temperature (4th power) dominate.",
      },
      {
        prompt:
          "To REDUCE the radiant transfer (insulating a cryogenic tank or a satellite), what would you do — and why does a thin reflective shield in the gap help so much?",
        rubric:
          "Lower the surface emissivities (polished/aluminized low-ε coatings) and/or insert RADIATION SHIELDS — thin low-ε sheets in the gap. A shield adds radiative resistances in series: each surface now exchanges with the low-ε shield (which floats at an intermediate temperature) instead of directly, cutting net transfer. N shields reduce radiant transfer by roughly 1/(N+1) for equal emissivities, and far more with low ε — this is how multilayer insulation (MLI) on spacecraft and cryogenic dewars work. Key insight: low-emissivity surfaces plus reflective radiation shields add radiative resistance and dramatically cut Q; many thin shields (MLI) are extremely effective in vacuum.",
      },
    ],
  },

  {
    id: "concept_thermal_convection_fan",
    slug: "concept-natural-vs-forced-convection",
    title: "Why a Fan Cools Faster",
    prompt:
      "A hot flat plate sits in still room air and cools slowly. Someone then aims\n" +
      "a fan at it.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["thermal", "heat-transfer", "convection", "boundary-layer", "conceptual"],
    skillAreas: ["heat-transfer", "fluid-mechanics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Why does the fan cool the plate so much faster? Explain via the convection mechanism, not just 'more air.'",
        rubric:
          "Convection is Q = h·A·ΔT; the fan raises the convection coefficient h. In still air (NATURAL convection) only weak buoyancy drives a slow, thick thermal boundary layer → low h. Forcing air across the plate (FORCED convection) thins that boundary layer and sweeps heated air away, steepening the temperature gradient at the surface and raising h substantially (often many times). Higher velocity → thinner boundary layer → higher h → more heat removed for the same ΔT. Key insight: the fan raises h by thinning the boundary layer and replacing buoyancy-driven flow with faster forced flow — convection is limited by h, and forced convection gives a much larger h than natural.",
      },
      {
        prompt:
          "Past a certain fan speed, going faster barely helps. Why do the returns diminish, and what becomes the limiting resistance then?",
        rubric:
          "h rises sub-linearly with velocity (roughly h ∝ V^0.5–0.8 for laminar/turbulent flow), so each extra bit of speed adds less h — diminishing returns. More importantly, once the surface convective resistance 1/hA becomes small, OTHER series resistances dominate: conduction within the plate/component to its surface, spreading resistance, or contact resistance — none of which change with airflow. So the bottleneck moves inside the solid and faster air can't help. Key insight: h has diminishing returns with velocity, and once 1/hA is no longer the largest resistance, internal conduction/contact resistance limits cooling — chase the new dominant resistance.",
      },
    ],
  },

  {
    id: "concept_thermal_carnot",
    slug: "concept-carnot-engine-efficiency",
    title: "The Ceiling on Engine Efficiency",
    prompt:
      "A heat engine takes in heat from a hot source and rejects heat to a cold\n" +
      "sink, producing work. An inventor claims a design with very high efficiency.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["thermal", "thermodynamics", "second-law", "carnot", "conceptual"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "What sets the absolute maximum efficiency of any heat engine between two temperatures, and why can't you reach 100%?",
        rubric:
          "The ceiling is the CARNOT efficiency η_max = 1 − T_cold/T_hot (absolute temperatures); no engine between two reservoirs can beat it (second law). 100% is impossible because it would require T_cold = 0 K or rejecting zero heat — but a cycle MUST dump some heat to the cold sink to complete and not decrease total entropy; heat cannot be fully converted to work in a cycle. Real engines fall further below Carnot due to irreversibilities (friction, finite-ΔT heat transfer). Key insight: η_max = 1 − T_c/T_h; 100% is forbidden by the second law because a cycle must reject heat (entropy).",
      },
      {
        prompt:
          "To improve efficiency, is it better to raise the hot-source temperature or lower the cold-sink temperature? Why, and what limits each in practice?",
        rubric:
          "From η = 1 − T_c/T_h, both help. Raising T_hot is usually the practical lever (power plants chase higher turbine-inlet temperatures) and tends to give strong gains; lowering T_c also helps, but the cold sink is usually pinned near the ambient environment (~300 K air/water), so you can't lower it much. Limits: T_hot is bounded by MATERIALS (creep, melting, oxidation), combustion, and cost; T_cold is bounded by the available heat-rejection environment. Key insight: both raising T_h and lowering T_c raise η, but T_h is the usual lever (material-limited) while T_c is fixed near ambient.",
      },
    ],
  },

  {
    id: "concept_thermal_cop",
    slug: "concept-refrigerator-cop",
    title: "How a Fridge Beats 100%",
    prompt:
      "A refrigerator uses electrical work to move heat from its cold interior out\n" +
      "to the warmer room. Its coefficient of performance (COP) is often greater\n" +
      "than 1.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["thermal", "thermodynamics", "refrigeration", "cop", "conceptual"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "How can a fridge move MORE heat than the work it consumes (COP > 1) without violating energy conservation?",
        rubric:
          "No violation — a fridge PUMPS heat, it doesn't create energy. COP = Q_cold removed / W_input, and the heat dumped to the room is Q_hot = Q_cold + W (first law). Because it only has to MOVE heat (not generate it), the heat moved can exceed the work, so COP > 1 is normal. The ideal limit is COP_cooling = T_cold/(T_hot − T_cold). Key insight: COP > 1 because work pumps heat rather than creating it; Q_hot = Q_cold + W conserves energy, and a small temperature lift lets a little work move a lot of heat.",
      },
      {
        prompt:
          "What happens to the COP as the temperature difference between the cold space and the hot surroundings GROWS (a freezer, or a hot day), and why?",
        rubric:
          "COP DROPS as the temperature lift (T_hot − T_cold) grows. From COP_Carnot = T_c/(T_h − T_c), a bigger denominator means lower COP — you must do more work per unit heat moved because you're pumping heat against a larger gradient. So a freezer (very low T_c) or operation on a hot day (high T_h) is less efficient and draws more power; heat pumps similarly lose efficiency in very cold weather (large lift to indoor temperature). Minimizing the required lift (good insulation, larger/lower-ΔT heat exchangers) improves COP. Key insight: COP falls as the temperature lift increases (COP ∝ T_c/(T_h−T_c)); smaller lifts are far more efficient.",
      },
    ],
  },

  {
    id: "concept_thermal_adiabatic_compression",
    slug: "concept-adiabatic-compression-heating",
    title: "Why Compressing Gas Heats It",
    prompt:
      "You quickly push the plunger of a sealed pump (or compress gas in a\n" +
      "cylinder) so fast that essentially no heat escapes during the squeeze.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["thermal", "thermodynamics", "first-law", "adiabatic", "conceptual"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Why does the gas get HOTTER when you compress it quickly, even though you added no heat? Use the first law.",
        rubric:
          "First law: ΔU = Q + W_on_gas. 'Quickly, no heat escapes' = ADIABATIC, so Q ≈ 0. You do WORK on the gas by compressing it, and with Q = 0 that work goes entirely into internal energy: ΔU > 0. For a gas, internal energy rises with temperature (ΔU = m·cv·ΔT), so T increases. Microscopically, molecules bounce off the inward-moving piston and speed up. (Adiabatic relation TV^(γ−1) = const → compression raises T.) Key insight: adiabatic compression (Q=0) puts all the compression work into internal energy, so temperature rises with no heat added.",
      },
      {
        prompt:
          "Now compress the same gas to the same final volume very SLOWLY instead. How does the final temperature compare, and what's the tradeoff?",
        rubric:
          "Slow compression lets heat leak out during the process (approaching ISOTHERMAL), so the gas ends up COOLER than the fast (adiabatic) case at the same final volume — the rejected heat carried away energy that would have raised T. Tradeoff: isothermal (slow) compression requires LESS work input for the same volume change (its P–V curve lies below the adiabat), which is why real compressors are INTERCOOLED to save energy — but it's slower and needs good heat removal. Fast/adiabatic is quicker but heats the gas and costs more work. Key insight: slow (isothermal) compression rejects heat → lower final T and less work; fast (adiabatic) traps work as heat → higher T and more work. Real compressors intercool to approach the cheaper isothermal limit.",
      },
    ],
  },
];
