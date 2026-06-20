import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_soil",
  slug: "soil-mechanics-and-geotechnics",
  title: "Soil Mechanics: Why the Ground Is a Liquid in Disguise",
  summary:
    "Every building, bridge, and dam ultimately rests on dirt — a chaotic mix of grains, water, and air that behaves nothing like the steel and concrete above it. The whole subject pivots on one idea Karl Terzaghi gave us a century ago: it is not the total weight pressing down that controls how strong the ground is, but the *effective* stress carried by grain-to-grain contact after you subtract the water's pressure. You will learn the three-phase nature of soil, how stress builds with depth, why the water table can quietly halve your bearing capacity, and how to compute total and effective stress at any depth. Drag the sliders, predict before you peek, and walk away thinking about the ground the way a geotechnical engineer does.",
  discipline: "CIVIL",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["geotechnical", "soil-mechanics", "stress", "effective stress", "pore pressure", "Terzaghi"],
  objectives: [
    "Describe soil as a three-phase material (solid grains, water, air) and explain why that structure makes it behave unlike a solid.",
    "Compute vertical (geostatic) total stress with depth using σ = γ·h, including layered profiles.",
    "Apply Terzaghi's effective stress principle σ' = σ − u and explain why effective stress, not total stress, governs strength and settlement.",
    "Calculate pore water pressure below a water table and combine it with total stress to get effective stress.",
    "Predict how raising or lowering the water table changes effective stress, bearing capacity, and settlement.",
    "Connect effective stress to high-level design concerns: bearing capacity of foundations and consolidation settlement.",
  ],
  prerequisites: [
    "Statics: forces, stress as force per unit area, free-body reasoning",
    "Basic unit handling (kN, m, kPa) and density/unit weight",
    "Hydrostatic pressure (p = ρ·g·h or γ_w·h)",
  ],
  interviewAngle:
    "Geotechnical and civil interviews lean hard on effective stress because it is the concept that separates people who memorized formulas from people who understand how the ground actually carries load. Interviewers want to hear σ' = σ − u stated without hesitation, applied correctly above and below the water table, and used to reason about consequences: lower the water table and effective stress rises (the ground gets stronger but may settle); raise it and effective stress drops (weaker ground, lower bearing capacity, even liquefaction risk in loose saturated sand). Strong candidates draw a stress profile with depth, track total stress and pore pressure as separate lines, subtract to get effective stress, and immediately tie the result to strength and settlement. They also know units cold (γ_w ≈ 9.81 kN/m³, stresses in kPa) and never confuse total weight pressing down with the load the grain skeleton actually feels. Weak candidates plug numbers into σ = γh and stop, forgetting that water carries a share of the load.",
  blocks: [
    {
      id: "soil-hook",
      kind: "PROSE",
      title: "The most important material no one designs",
      markdown:
        "You can specify the exact grade of every steel beam and the precise mix of every cubic meter of concrete in a skyscraper. But the material that holds the whole thing up — the soil underneath — you do not get to choose. It was deposited by some ancient river or glacier or windstorm, and your job is to *figure out what you've got* and build accordingly.\n\nAnd soil is weird. It is not a solid the way a brick is. It is a loose **skeleton of grains** with **water** and **air** crammed into the gaps between them. Push on it and the grains shuffle and reseat; squeeze the water out slowly and it shrinks for *years*. The Leaning Tower of Pisa leans because of soil. Buildings in Mexico City sink because of soil. Entire neighborhoods turn to quicksand in earthquakes because of soil.\n\nHere is the punchline that organizes the entire field, and it is gloriously counterintuitive: the strength of the ground is **not** controlled by how much total weight is pressing down on it. It is controlled by how much of that weight is carried *grain-to-grain*, after you subtract out the pressure of the water sitting in the pores. That single subtraction — Terzaghi's **effective stress** — is the most important equation in geotechnical engineering. Once you see it, you will never look at mud the same way.",
    },
    {
      id: "soil-video",
      kind: "VIDEO",
      youtubeId: "7sM80puq6Jo",
      title: "Watch: Geotechnical Engineering & Soil Mechanics Basics",
      channel: "Nirmaan Green",
    },
    {
      id: "soil-three-phase",
      kind: "PROSE",
      title: "Soil is three materials wearing a trench coat",
      markdown:
        "Scoop up a handful of soil and you are actually holding **three phases** at once:\n\n- **Solids** — the mineral grains (sand, silt, clay particles). These form the load-bearing **skeleton**.\n- **Water** — fills some or all of the gaps (the **voids**) between grains.\n- **Air** (or gas) — fills whatever void space the water doesn't.\n\nThe grains touch each other at countless tiny contact points, and that contact network is what carries structural load — like a crowd of people leaning on each other. The water and air in between are just *filling the gaps*... until they aren't.\n\nThis three-phase nature is why soil refuses to behave like a normal solid:\n\n- **Saturated soil** (voids completely full of water) behaves very differently from **dry** soil, because the water can carry pressure too.\n- Squeeze a saturated clay and the water cannot escape instantly — it carries the load *temporarily*, then slowly drains and hands the load over to the grains. That slow handover is **consolidation**, and it is why some buildings settle for decades.\n- The *amount* of void space (the **void ratio**) controls how compressible and how strong the soil is.\n\nKeep this picture in your head: a skeleton of grains, with a fluid in the gaps that can secretly take its share of the load. Everything that follows is bookkeeping on who is carrying what.",
    },
    {
      id: "soil-unit-weight",
      kind: "PROSE",
      title: "Unit weight and stress that grows with depth",
      markdown:
        "Before we can split the load, we need the *total* load. Soil has a **unit weight** `γ` (gamma) — its weight per unit volume, in kN/m³. Typical soils run roughly 16–20 kN/m³; saturated soils are heavier than dry ones because the water adds mass. (Compare water itself: `γ_w ≈ 9.81 kN/m³`.)\n\nNow imagine burying yourself in the ground and asking: how hard is the soil squeezing down on a horizontal plane at depth `h`? It is the weight of *everything stacked above that plane*, per unit area. For uniform soil that is simply:\n\n`σ = γ·h`\n\nThis is the **vertical total stress** (also called geostatic stress). Read it like the pressure at the bottom of a swimming pool, but with soil instead of water: every meter you go down, the stress climbs by `γ` kPa. At 5 m in soil with `γ = 18 kN/m³`, the total vertical stress is `18 × 5 = 90 kPa`.\n\n**Layered ground?** Just add up the contributions layer by layer: `σ = Σ γᵢ·hᵢ`. Three meters of one soil on top of two meters of another? Stress at 5 m is `γ₁·3 + γ₂·2`. The principle never changes — stress is the accumulated weight overhead. The unit `kPa` (kN/m²) is the natural currency of soil stress, so keep `γ` in kN/m³ and `h` in meters and the answer lands in kPa automatically.",
    },
    {
      id: "soil-formula-total",
      kind: "FORMULA",
      title: "Vertical total stress with depth",
      display: "σ = γ·h        (layered:  σ = Σ γᵢ·hᵢ)",
      variables: [
        { symbol: "σ", name: "Vertical total stress", unit: "kPa" },
        { symbol: "γ", name: "Soil unit weight", unit: "kN/m³" },
        { symbol: "h", name: "Depth below ground surface", unit: "m" },
      ],
      note:
        "Total stress is just the weight of all material above the plane, per unit area — like hydrostatic pressure but for soil. Use the SATURATED unit weight below the water table and the moist/dry unit weight above it. With γ in kN/m³ and h in m, σ comes out in kPa directly. This is the gross load on the plane; it does NOT yet tell you how much the grain skeleton feels.",
    },
    {
      id: "soil-sandbox",
      kind: "SANDBOX",
      title: "Play: vertical total stress at depth",
      description:
        "The geostatic total stress, σ = γ·h. With the defaults γ = 18 kN/m³ and h = 5 m, you get σ = 18 × 5 = 90.0 kPa. Push the depth slider and watch stress climb linearly — every extra meter adds exactly γ kPa. Crank γ from a light 14 up to a dense 22 kN/m³ and notice how much heavier ground builds stress faster. (Next we'll subtract the water's share to get the stress that actually matters.)",
      variables: [
        { key: "gamma", label: "Unit weight γ", unit: "kN/m³", min: 14, max: 22, step: 0.5, default: 18 },
        { key: "h", label: "Depth h", unit: "m", min: 0, max: 20, step: 0.5, default: 5 },
      ],
      expression: "gamma * h",
      outputLabel: "Vertical stress σ",
      outputUnit: "kPa",
      precision: 1,
    },
    {
      id: "soil-effective",
      kind: "PROSE",
      title: "Terzaghi's big idea: subtract the water",
      markdown:
        "Here is the move that founded modern soil mechanics. In 1925, Karl Terzaghi realized that the *total* stress you just computed is shared between two carriers:\n\n1. The **grain skeleton**, which carries load through grain-to-grain contact.\n2. The **pore water**, which (below the water table) is under pressure and pushes outward in all directions.\n\nThe water pressure — called **pore water pressure** `u` — does *not* press the grains together. It actually props them apart a little, like air in a balloon. So the load the skeleton really feels, the **effective stress** `σ'`, is the total minus the water's share:\n\n`σ' = σ − u`\n\nThis is **Terzaghi's effective stress principle**, and it is the single most important relationship in the field. Why? Because strength and deformation come from grain contact. Friction between grains, resistance to sliding, compression of the skeleton — *all* of it depends on how hard the grains are pressed together, which is exactly `σ'`. The water in the pores carries pressure but provides essentially no shear strength (you can't build on water).\n\nBelow a static water table, the pore pressure is simply hydrostatic: `u = γ_w·h_w`, where `h_w` is the depth below the water table and `γ_w ≈ 9.81 kN/m³`. Above the water table (in dry or moist soil) `u` is roughly zero, so there `σ' ≈ σ`. Subtract the water, and you get the number that actually governs everything.",
    },
    {
      id: "soil-formula-effective",
      kind: "FORMULA",
      title: "Effective stress and pore pressure",
      display: "σ' = σ − u        u = γ_w · h_w        σ' = σ − γ_w · h_w",
      variables: [
        { symbol: "σ'", name: "Vertical effective stress (grain-to-grain)", unit: "kPa" },
        { symbol: "σ", name: "Vertical total stress", unit: "kPa" },
        { symbol: "u", name: "Pore water pressure", unit: "kPa" },
        { symbol: "γ_w", name: "Unit weight of water (≈ 9.81)", unit: "kN/m³" },
        { symbol: "h_w", name: "Depth below the water table", unit: "m" },
      ],
      note:
        "Effective stress is what the soil skeleton actually feels, and it governs strength and settlement. Below a static water table, pore pressure is hydrostatic (u = γ_w·h_w). Above the water table u ≈ 0, so σ' ≈ σ. Raising the water table increases u, which DECREASES σ' even though the grains haven't moved — that is how a flood can weaken ground.",
    },
    {
      id: "soil-predict-watertable",
      kind: "PREDICT",
      question:
        "Heavy rain raises the water table closer to the surface, while the soil's grains and total weight overhead stay essentially the same. What happens to the EFFECTIVE stress (and therefore the ground's strength) at a given depth?",
      options: [
        { id: "a", label: "Effective stress increases — more water means more weight pressing down." },
        { id: "b", label: "Effective stress decreases — higher pore pressure carries more of the load." },
        { id: "c", label: "Effective stress is unchanged — the grains didn't move." },
        { id: "d", label: "Effective stress drops to zero everywhere instantly." },
      ],
      answerId: "b",
      reveal:
        "**Effective stress decreases.** A higher water table means more depth below the water table at your point, so pore pressure `u = γ_w·h_w` goes *up*. With total stress `σ` roughly the same (the grains and overburden didn't change much), `σ' = σ − u` goes *down*. The grains are pressed together less firmly, so the ground gets **weaker** — lower friction, lower bearing capacity. This is why hillsides fail after prolonged rain and why rising groundwater is a real hazard. Push it to the extreme in loose saturated sand under shaking and `σ'` can hit zero — the grains lose all contact and the ground briefly behaves like a liquid. That is **liquefaction**. (Option a confuses *total* stress with *effective* stress — the classic trap.)",
    },
    {
      id: "soil-predict-pumping",
      kind: "PREDICT",
      question:
        "An engineer pumps groundwater out to LOWER the water table during construction (dewatering). What happens to the effective stress in the soil below?",
      options: [
        { id: "a", label: "It decreases — there's less water to help carry load." },
        { id: "b", label: "It stays the same — pumping water doesn't change soil weight." },
        { id: "c", label: "It increases — less pore pressure means the grains carry more of the load, which can cause settlement." },
        { id: "d", label: "Nothing measurable happens." },
      ],
      answerId: "c",
      reveal:
        "**It increases — and that can be a problem.** Lowering the water table reduces pore pressure `u`, so `σ' = σ − u` *rises*: the grain skeleton suddenly carries more of the load. Higher effective stress means the soil is stronger (good for digging and building), but it also **compresses the skeleton**, causing settlement. Dewatering one site has sunk *neighboring* buildings whose foundations were never touched — the water table is regional. This is the flip side of the rain example: it is genuinely the same physics, `σ' = σ − u`, run in the opposite direction. Water level up → σ' down; water level down → σ' up. Master that lever and you understand half of geotechnical practice.",
    },
    {
      id: "soil-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: total and effective stress with a water table",
      problem:
        "A uniform soil deposit has a saturated unit weight γ_sat = 19 kN/m³ above and below the water table (assume moist ≈ saturated here for simplicity). The water table sits at 2 m below the ground surface. Take γ_w = 9.81 kN/m³. At a depth of 6 m below the surface, find: (a) the vertical total stress σ, (b) the pore water pressure u, and (c) the vertical effective stress σ'. (d) Briefly, why does σ' matter more than σ?",
      steps: [
        {
          label: "(a) Total stress at 6 m",
          markdown:
            "Total stress is the weight of all soil above, per unit area. With uniform γ = 19 kN/m³ over the full 6 m: σ = γ·h = 19 × 6 = **114 kPa**. (If the soil above and below the water table had different unit weights, we would split it: γ_moist·2 + γ_sat·4.)",
        },
        {
          label: "(b) Pore water pressure at 6 m",
          markdown:
            "Pore pressure is hydrostatic below the water table. The water table is at 2 m, so the depth below it at our point is h_w = 6 − 2 = 4 m. Then u = γ_w·h_w = 9.81 × 4 = **39.24 kPa**.",
        },
        {
          label: "(c) Effective stress at 6 m",
          markdown:
            "Apply Terzaghi: σ' = σ − u = 114 − 39.24 = **74.76 kPa ≈ 74.8 kPa**. So of the 114 kPa total pressing down, the water carries ~39 kPa and the grain skeleton actually feels ~75 kPa.",
        },
        {
          label: "(d) Why σ' rules",
          markdown:
            "Soil strength comes from friction and contact between grains, which depend on how hard they are squeezed together — that's σ', not σ. The 39 kPa of pore pressure provides essentially no shear strength and no resistance to settlement. If the water table rose to the surface, u would jump and σ' would fall, weakening the ground even though σ barely changed. Design (bearing capacity, settlement, slope stability) is always run on σ'.",
        },
      ],
      answer:
        "(a) σ = 114 kPa; (b) u = 9.81 × 4 = 39.24 kPa; (c) σ' = 114 − 39.24 ≈ 74.8 kPa. Effective stress governs because strength and settlement depend on grain-to-grain contact, not on the water's pressure.",
    },
    {
      id: "soil-check-effective",
      kind: "CHECK",
      question:
        "At a point 10 m deep, the vertical total stress is 190 kPa and the pore water pressure is 78 kPa. What is the vertical effective stress, and what does it physically represent?",
      choices: [
        { id: "a", label: "268 kPa — total and pore pressure add together." },
        { id: "b", label: "112 kPa — the load actually carried by grain-to-grain contact." },
        { id: "c", label: "190 kPa — pore pressure doesn't affect effective stress." },
        { id: "d", label: "78 kPa — effective stress equals the pore pressure." },
      ],
      answerId: "b",
      explanation:
        "Terzaghi: σ' = σ − u = 190 − 78 = 112 kPa. Effective stress is the portion of the total stress carried by the soil SKELETON through grain-to-grain contact — the part that actually generates strength and drives settlement. The pore water carries the remaining 78 kPa but contributes essentially no shear strength. Option (a) adds instead of subtracts (water doesn't pile on top of the grain load, it offloads it); (c) ignores pore pressure entirely.",
    },
    {
      id: "soil-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What interviewers actually probe for",
      markdown:
        "When a geotechnical question hits the table, the interviewer is listening for one reflex: do you reach for **effective** stress, or do you stop at total stress?\n\nThe routine that signals competence:\n\n1. **Compute total stress** as accumulated weight overhead: `σ = Σ γᵢ·hᵢ`, using saturated unit weight below the water table.\n2. **Compute pore pressure** as hydrostatic below the water table: `u = γ_w·h_w` (and ~0 above it).\n3. **Subtract** for effective stress: `σ' = σ − u`.\n4. **Tie it to consequences:** higher `σ'` → stronger ground but more settlement; lower `σ'` → weaker ground, lower bearing capacity, liquefaction risk in loose saturated sand.\n\nThe tells they love: you draw three separate lines with depth (σ, u, σ'), you state γ_w ≈ 9.81 kN/m³ from memory, you handle the water table correctly, and — the big one — you can *reason about change*. \"If the water table rises, what happens to bearing capacity?\" is the canonical follow-up, and the answer is always routed through `σ' = σ − u`. Candidates who only ever write `σ = γh` and stop are revealing they've memorized a formula without the principle behind it.",
    },
    {
      id: "soil-design",
      kind: "PROSE",
      title: "Why this matters: bearing capacity and settlement",
      markdown:
        "Effective stress is not an academic curiosity — it is the input to the two questions every foundation must answer:\n\n**Can the soil hold the load without failing? (Bearing capacity.)** Push too hard on the ground and the soil shears and the foundation punches in — a *strength* failure, sudden and catastrophic. Bearing capacity depends on the soil's shear strength, which depends on... effective stress. Higher `σ'` (denser, drier, deeper) generally means more friction and more capacity. A rising water table cuts `σ'` and can quietly erode the safety margin you designed for.\n\n**Will the building settle too much, or unevenly? (Settlement.)** Even if the soil never fails, it compresses under load. In sands this happens fast; in clays the water has to slowly squeeze out of the pores first, transferring load to the skeleton over months or years — that slow, σ'-driven compression is **consolidation**. Uniform settlement is survivable; *differential* settlement (one corner sinking more than another) cracks walls and tilts towers. Pisa leans because one side of its soft clay foundation consolidated more than the other.\n\nNotice the recurring engine: **load changes effective stress, effective stress changes the soil.** Add a building → `σ'` rises → grains compress → settlement. Pump out water → `σ'` rises → settlement again. Flood the site → `σ'` falls → strength drops. Every geotechnical story is a story about effective stress changing.",
    },
    {
      id: "soil-callout-warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Traps that quietly cost you points",
      markdown:
        "- **Don't stop at total stress.** `σ = γh` is only step one. Strength and settlement run on `σ' = σ − u`. Forgetting the subtraction is the #1 error.\n- **Use the right unit weight.** Below the water table use the *saturated* unit weight; above it use moist/dry. Mixing them throws off both σ and σ'.\n- **Pore pressure is hydrostatic only below the water table** (for static conditions). Above the water table u ≈ 0, so σ' ≈ σ. (Seepage and rapid loading create *excess* pore pressure — a more advanced wrinkle.)\n- **γ_w ≈ 9.81 kN/m³, not 10** (though 10 is a common quick approximation — state which you're using).\n- **Effective stress can't be negative** in normal soils — if your subtraction goes below zero, the grains have lost contact (liquefaction) and something is wrong with your assumptions or it's a genuine hazard.\n- **Keep units consistent:** γ in kN/m³ × h in m = stress in kPa. Drift into mixed units and your stresses will be off by powers of ten.",
    },
    {
      id: "soil-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "One subtraction to rule them all",
      markdown:
        "Picture three stress lines marching down with depth: total stress `σ` climbing as accumulated weight, pore pressure `u` climbing hydrostatically below the water table, and their difference `σ' = σ − u` — the load the grain skeleton actually feels. That gap is where all the engineering lives. Strength, bearing capacity, settlement, consolidation, even liquefaction — every one of them is a story about effective stress going up or down. Master the subtraction, track the water table, and you can read the ground.",
    },
  ],
  keyTakeaways: [
    "Soil is a three-phase material — grains, water, and air — and that structure makes it behave unlike a solid: the pore fluid can secretly carry part of the load.",
    "Vertical total stress grows with depth as accumulated weight overhead: σ = γ·h (or Σ γᵢ·hᵢ for layers), naturally in kPa when γ is in kN/m³ and h in m.",
    "Terzaghi's effective stress principle, σ' = σ − u, is the field's central equation: effective stress is the load carried grain-to-grain.",
    "Below a static water table pore pressure is hydrostatic, u = γ_w·h_w (γ_w ≈ 9.81 kN/m³); above the water table u ≈ 0 so σ' ≈ σ.",
    "Effective stress — not total stress — governs strength and settlement, because friction and compression depend on how hard grains are pressed together.",
    "Raising the water table increases u and lowers σ' (weaker ground, liquefaction risk); lowering it raises σ' (stronger ground but settlement).",
    "Bearing capacity and consolidation settlement are both driven by changes in effective stress, which is why load, water table, and σ' must always be tracked together.",
  ],
};
