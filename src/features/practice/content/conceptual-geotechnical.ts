import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "geotechnical_effective_stress_excavation",
    slug: "concept-geotechnical-effective-stress-excavation",
    title: "Effective Stress Under a Rising Water Table",
    prompt: "A 6 m deep saturated clay deposit sits below 2 m of sand. A nearby river floods and the water table rises from 2 m below the ground surface up to the ground surface, fully saturating the sand.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["geotechnical", "conceptual"],
    skillAreas: ["geotechnical"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain how the rising water table changes the effective stress at the bottom of the clay layer. Walk through the relationship between total stress, pore water pressure, and effective stress (sigma_prime = sigma - u).",
        rubric: "Should define effective stress as total stress minus pore pressure: sigma_prime = sigma - u. Should note total stress increases only slightly because saturating the sand replaces moist unit weight with saturated unit weight (a small gain), while pore pressure increases by the full additional head of water (gamma_w times the rise). Net effect: effective stress at depth DECREASES. Should connect lower effective stress to reduced shear strength and possible loss of stability or heave. Key insight: Raising the water table raises pore pressure more than it raises total stress, so effective stress, which governs strength and settlement, drops.",
      },
      {
        prompt: "Part 2: Now suppose instead the river is dammed and the water table is permanently lowered by pumping (dewatering) by 3 m. What happens to effective stress and what long-term ground behavior would you warn the client about?",
        rubric: "Should state lowering the water table reduces pore pressure, so effective stress INCREASES throughout the affected depth. Should warn that increased effective stress on compressible clay causes consolidation settlement over time, potentially damaging nearby structures. Should note settlement can be large and slow in clay, and may be differential. Bonus: mention drawdown affects a wide area, and that adjacent buildings on shallow foundations are at risk. Key insight: Dewatering is mechanically equivalent to surcharging the soil because removing buoyant water transfers load to the soil skeleton, driving consolidation.",
      },
    ],
  },
  {
    id: "geotechnical_consolidation_clay_fill",
    slug: "concept-geotechnical-consolidation-clay-fill",
    title: "Why Clay Settles Slowly Under Fill",
    prompt: "An embankment of compacted fill is placed over a thick, soft, saturated clay layer. The contractor is surprised the ground keeps settling for months after construction ends.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["geotechnical", "conceptual"],
    skillAreas: ["geotechnical"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the mechanism of primary consolidation. Why does settlement in saturated clay continue long after the load is applied, and what controls the rate?",
        rubric: "Should explain that the load is initially carried by excess pore water pressure (undrained response) because water cannot escape instantly from low-permeability clay. As water slowly drains, excess pore pressure dissipates and load transfers to the soil skeleton, increasing effective stress and compressing the soil. Rate is governed by the coefficient of consolidation and drainage path length; time scales with the square of drainage path (t proportional to H^2). Low permeability of clay makes it slow. Key insight: Consolidation is the time-dependent transfer of load from pore water to the soil skeleton as water drains, which is why clay settles for months while sand settles almost instantly.",
      },
      {
        prompt: "Part 2: Now the schedule demands the settlement be largely finished before paving. What design measures would you propose to speed up consolidation, and why do they work?",
        rubric: "Should propose vertical drains (wick or sand drains) to shorten the drainage path, since time scales with drainage path squared. Should propose surcharge preloading (extra temporary fill) to accelerate and pre-induce settlement, then remove before paving. May mention staged loading to maintain stability, or vacuum consolidation. Should tie each measure back to the physics: drains reduce H, surcharge raises the effective stress gradient driving flow. Key insight: You cannot change clay permeability, so you shorten the drainage path with vertical drains and increase the driving load with surcharge to compress the predicted settlement timeline into the construction schedule.",
      },
    ],
  },
  {
    id: "geotechnical_bearing_capacity_footing",
    slug: "concept-geotechnical-bearing-capacity-footing",
    title: "Bearing Capacity of a Shallow Footing",
    prompt: "A square spread footing is proposed for a column on a sandy soil. A junior engineer sizes it using only an allowable bearing pressure from a chart, with no other checks.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["geotechnical", "conceptual"],
    skillAreas: ["geotechnical"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the difference between a bearing capacity (strength) failure and a settlement (serviceability) failure for a shallow footing, and why both must be checked.",
        rubric: "Should describe bearing capacity failure as a shear failure of the soil where the footing punches in or a failure wedge forms (ultimate limit state), governed by soil shear strength, footing width, and depth. Should describe settlement as the soil compressing under service loads (serviceability limit state); excessive or differential settlement damages the structure even if it never shears. Should note allowable bearing pressure often is governed by settlement, not strength, especially on sand or for wide footings. Key insight: A footing can be safe against collapse yet still fail in service by settling too much, so strength and settlement are separate limit states that both must be satisfied.",
      },
      {
        prompt: "Part 2: Now the same column load must be supported on soft saturated clay instead of sand, and the load includes a large sustained portion. How does your analysis change, and what governs the design?",
        rubric: "Should note clay behaves undrained in the short term, so short-term bearing capacity uses undrained shear strength (su) with the cohesion term dominating; the friction term is negligible in the undrained case. Should note the critical bearing check may be the short-term undrained condition, while long-term settlement (consolidation) under the sustained load often governs the footing size. Should contrast with sand, where drained friction governs strength and settlement is immediate. May recommend deep foundations if clay is too soft. Key insight: On clay the controlling case flips between a short-term undrained strength check and a long-term consolidation settlement check, whereas on sand strength is frictional and settlement is immediate.",
      },
    ],
  },
  {
    id: "geotechnical_liquefaction_sand",
    slug: "concept-geotechnical-liquefaction-sand",
    title: "Why Saturated Sand Liquefies in an Earthquake",
    prompt: "A loose, saturated, fine sand layer underlies a planned building site in a seismic region. A geotechnical report flags liquefaction risk.",
    discipline: "CIVIL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["geotechnical", "conceptual"],
    skillAreas: ["geotechnical"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the mechanism of liquefaction in terms of effective stress and pore pressure. Why does loose saturated sand lose its strength during cyclic earthquake shaking, and why is drainage central to the problem?",
        rubric: "Should explain that cyclic shaking tends to densify loose sand, but in saturated undrained conditions the grains cannot rearrange without expelling water; the tendency to contract instead generates rising excess pore water pressure. As pore pressure rises toward the total stress, effective stress (sigma_prime = sigma - u) drops toward zero. Since frictional shear strength depends on effective stress (tau = sigma_prime times tan phi), strength vanishes and the soil behaves like a heavy liquid. Should emphasize loose state, saturation, and inability to drain fast enough are all required. Key insight: Liquefaction is the collapse of effective stress to near zero as undrained cyclic loading drives pore pressure up to the total stress, eliminating the frictional shear strength that holds the soil together.",
      },
      {
        prompt: "Part 2: Now consider the same shaking applied to a dense, dilative sand and to a saturated clay. Explain why each is far less prone to classic liquefaction, and what mitigation you would specify for the loose sand site.",
        rubric: "Should explain dense sand is dilative: under shear it tends to expand, generating negative excess pore pressure that raises effective stress and increases strength, so it resists flow liquefaction (though cyclic mobility can still cause deformation). Should explain clay has cohesion and low permeability plus plasticity, so it does not lose strength the same way; clays are generally non-liquefiable per plasticity-based screening though sensitive clays can soften. Mitigation for loose sand: densification (vibro-compaction, dynamic compaction, stone columns), drainage to relieve pore pressure, ground improvement, or deep foundations bypassing the layer. Key insight: Dilative dense sand and cohesive clay resist liquefaction because shearing does not drive pore pressure up to total stress, and the fix for loose sand is to densify it or relieve pore pressure so effective stress is preserved.",
      },
    ],
  },
  {
    id: "geotechnical_retaining_wall_pressure",
    slug: "concept-geotechnical-retaining-wall-pressure",
    title: "Earth Pressure on a Retaining Wall",
    prompt: "A cantilever retaining wall holds back a granular backfill. The designer must decide which lateral earth pressure to use and whether to add drainage.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["geotechnical", "conceptual"],
    skillAreas: ["geotechnical"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the difference between at-rest, active, and passive earth pressure. Which one acts on the back of a yielding cantilever wall, and why does wall movement determine the pressure?",
        rubric: "Should define at-rest (K0) as the pressure with no lateral strain, active (Ka) as the reduced pressure when the wall moves away from the soil allowing it to relax to its shear strength, and passive (Kp) as the increased pressure when the wall pushes into the soil. Should state Ka < K0 < Kp. Should explain a cantilever wall typically yields slightly outward, mobilizing soil shear strength, so design uses active pressure on the back; passive may be counted in front of the toe. Should connect K values to friction angle (Ka = (1 - sin phi)/(1 + sin phi) for level backfill). Key insight: Lateral earth pressure depends on wall movement because soil shear strength is only mobilized when the soil strains, so a wall that yields away sees the lower active pressure.",
      },
      {
        prompt: "Part 2: Now the drains clog and the backfill becomes saturated after heavy rain. Explain quantitatively why this is dangerous and how it changes the loading on the wall.",
        rubric: "Should explain that water adds a hydrostatic pressure component that acts in full (gamma_w times depth) on top of the effective lateral earth pressure, which is now computed on buoyant (submerged) unit weight. Should note hydrostatic pressure uses a coefficient of 1.0, far larger than Ka (often around 0.3), so the water load dominates and total lateral thrust can roughly double or more. This overturning and sliding demand often exceeds what the wall was designed for, a common failure cause. Should reinforce why weep holes and drainage are essential. Key insight: Water pressure pushes with full hydrostatic force regardless of soil strength, so a clogged drain can more than double the lateral thrust and is a leading cause of retaining wall failure.",
      },
    ],
  },
  {
    id: "geotechnical_friction_vs_cohesion",
    slug: "concept-geotechnical-friction-vs-cohesion",
    title: "Friction Versus Cohesion in Shear Strength",
    prompt: "Two slopes must be assessed: one in clean sand and one in stiff clay. A reviewer asks the engineer to justify the shear strength model used for each using the Mohr-Coulomb criterion tau = c + sigma_prime tan phi.",
    discipline: "CIVIL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["geotechnical", "conceptual"],
    skillAreas: ["geotechnical"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Using the Mohr-Coulomb model tau = c + sigma_prime tan phi, explain the physical difference between the cohesion term and the friction term, and why a clean sand is treated as purely frictional while clay can have apparent cohesion.",
        rubric: "Should identify the friction term (sigma_prime times tan phi) as strength that depends on confining effective stress and interparticle friction and interlock, dominant in granular soils. Should identify cohesion (c) as strength independent of normal stress, arising in clays from electrochemical bonding, cementation, or apparent cohesion from negative pore pressures (suction). Should state clean sand has effectively zero true cohesion (c near 0), so strength vanishes at zero effective stress, while clay can stand at a vertical cut temporarily due to cohesion. Should stress strength depends on effective, not total, stress. Key insight: Friction is stress-dependent strength from grain contact while cohesion is stress-independent bonding, which is why sand cannot stand without confinement but clay can hold a temporary vertical face.",
      },
      {
        prompt: "Part 2: Now distinguish the drained versus undrained strength of the clay slope. Why might a clay cut be stable right after excavation but fail months later, while a different clay failure happens during rapid loading?",
        rubric: "Should explain undrained (short-term) strength uses su with phi = 0 in total stress terms because excess pore pressures have not dissipated, while drained (long-term) strength uses effective stress parameters c_prime and phi_prime once pore pressures equilibrate. For an excavation (unloading), negative excess pore pressures temporarily boost strength; as they dissipate over months, effective stress drops, strength falls, and the slope can fail later (delayed failure). For rapid loading (e.g. embankment on clay), positive excess pore pressure makes the short-term undrained case critical, so failure happens during or just after loading. Should note which condition is critical depends on whether loading or unloading. Key insight: The critical strength case depends on pore pressure evolution: excavations are most dangerous in the long-term drained state while rapid loading is most dangerous in the short-term undrained state.",
      },
    ],
  },
];
