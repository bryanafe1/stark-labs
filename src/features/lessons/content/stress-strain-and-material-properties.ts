import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_materials",
  slug: "stress-strain-and-material-properties",
  title: "Stress, Strain & Material Properties",
  summary:
    "Why does a paperclip bend and stay bent, a rubber band snap back, and a glass rod shatter without warning? It all lives on one curve. In this lesson you'll read the stress–strain diagram like a story — proportional limit, yield, ultimate, necking, fracture — learn the difference between strong and stiff (they're not the same!), compute σ = F/A, ε = ΔL/L, and δ = FL/AE, and finally understand what a 'factor of safety' really buys you.",
  discipline: "MECHANICAL",
  difficulty: "EASY",
  estMinutes: 22,
  tags: [
    "materials",
    "stress-strain",
    "yield-strength",
    "Hooke's law",
    "Young's modulus",
    "elasticity",
    "factor of safety",
    "interview-favorite",
  ],
  objectives: [
    "Compute stress σ = F/A and strain ε = ΔL/L for any axially loaded member, and state their units cold.",
    "Read every landmark on the stress–strain curve: proportional limit, yield, ultimate strength, necking, and fracture.",
    "Tell the difference between strong and stiff — yield strength vs. Young's modulus — and never confuse them again.",
    "Distinguish elastic from plastic behavior and ductile from brittle materials, with a real example of each.",
    "Use Hooke's law σ = E·ε to predict elongation δ = F·L/(A·E) before anything is built.",
    "Apply a factor of safety to size a member so it never approaches yield in service.",
  ],
  prerequisites: [
    "Basic algebra and unit handling (SI units)",
    "Force, area, and length as physical quantities",
    "The idea that materials deform when you push or pull on them",
  ],
  interviewAngle:
    "Stress–strain is the bedrock of every mechanical and structural interview because the whole conversation hangs off one diagram. Interviewers can tell in a minute whether you actually understand materials or just memorized definitions. The strong candidate does four things fast: (1) writes σ = F/A and ε = ΔL/L and states units (Pa = N/m², strain dimensionless) without hesitating; (2) sketches the stress–strain curve and labels the landmarks — the linear elastic region with slope E, the proportional limit, yield, ultimate strength at the peak, then necking down to fracture; (3) crisply separates STRONG from STIFF — yield/ultimate strength is about resisting failure, Young's modulus E is about resisting deflection, and a material can be one without the other (rubber is flexible but tough, glass is stiff but brittle); and (4) reasons about ductile vs. brittle and what a factor of safety actually protects against. Expect the classic curveball: 'steel and aluminum — which is stronger, which is stiffer?' (steel is both stiffer, ~3× E, and typically stronger) or 'will a stiffer material always be stronger?' (no — they're independent properties). Talk the curve fluently and you sound like an engineer.",
  blocks: [
    {
      id: "m_intro",
      kind: "PROSE",
      title: "The tale of three objects 🧷",
      markdown:
        "Pick up a paperclip and bend it. It bends — and *stays* bent. Now stretch a rubber band and let go: it snaps right back to where it started. Finally, imagine flexing a thin glass rod: nothing, nothing, nothing... *snap*, it shatters with no warning at all.\n\nThree materials, three completely different personalities. The paperclip *remembers* the abuse (permanent deformation). The rubber band *forgets* it instantly (elastic). The glass refuses to compromise right up until it explosively fails (brittle). What on earth makes them behave so differently?\n\nThe astonishing answer: **every one of these stories is told by a single graph** — the **stress–strain curve**. Pull on a sample, measure how hard you're pulling versus how much it stretches, plot it, and you get a fingerprint that reveals *everything* about how that material behaves: how stiff it is, how strong it is, whether it'll bend gracefully or snap suddenly, and exactly how much load it can take before disaster.\n\nThis one curve is the foundation under every bridge, bolt, bone, and beam ever engineered. By the end of this lesson you'll read it like a story — and you'll be able to compute, before anything is even built, exactly how far a part will stretch and whether it'll survive. Let's learn to read the fingerprint."
    },
    {
      id: "m_video",
      kind: "VIDEO",
      youtubeId: "0qGrbZPeQew",
      title: "Watch: The Stress–Strain Curve",
      channel: "structurefree",
      caption:
        "A clear, friendly walk through the entire curve and what each region means. Watch it now — once you've seen a real sample stretch and the curve trace itself out, every formula and landmark below will lock into place."
    },
    {
      id: "m_stress_strain_intuition",
      kind: "PROSE",
      title: "Stress and strain: the great normalizers",
      markdown:
        "Here's a puzzle. A thick steel cable and a thin steel wire are made of the *exact same material*. The cable can hold a truck; the wire snaps under your hands. Same material — so why such different strength? Obviously it's the size. But that's annoying: it means \"how much force can it take\" depends on the part's dimensions, not just what it's made of.\n\nEngineers fix this with two brilliant moves that strip away size and leave behind pure *material behavior*.\n\n**Stress (`σ`)** = force spread over the area carrying it:\n\n```\nσ = F / A\n```\n\nUnits: N/m² = **pascals (Pa)**. It's pressure, basically — how hard the *material itself* is being squeezed or stretched at every point. The fat cable has way more area `A`, so the same force gives it far less stress. Now the comparison is fair.\n\n**Strain (`ε`)** = how much it stretched, relative to how long it started:\n\n```\nε = ΔL / L\n```\n\nStrain is a *ratio* — length over length — so it's **dimensionless** (often quoted as a percent or in 'microstrain'). A 2 m bar stretching 2 mm has the same strain as a 1 m bar stretching 1 mm: both 0.001, or 0.1%.\n\nThe payoff is huge: plot **stress vs. strain** instead of force vs. stretch, and the size of the sample *cancels out*. What's left is a curve that belongs to the **material**, not the part. A pinky-wire and a bridge cable of the same steel trace the *same* stress–strain curve. That's why this one graph is so powerful — it's universal."
    },
    {
      id: "m_curve",
      kind: "PROSE",
      title: "Reading the curve: a five-act story 📈",
      markdown:
        "Clamp a metal test bar in a machine, pull steadily, and record stress versus strain. For a typical ductile metal like mild steel, the curve unfolds in five acts:\n\n1. **The elastic line (Act I).** At first the curve is a straight line rising steeply. Stress is proportional to strain, and — crucially — if you let go *anywhere* in this region, the bar springs all the way back to its original length. No damage. The slope of this line is **Young's modulus `E`** — the material's stiffness. Steeper line = stiffer material.\n\n2. **The proportional limit & elastic limit.** The straight line can't last. At the **proportional limit** the curve starts to bend — stress and strain stop being proportional. Just past it is the **elastic limit**, the last point from which the material still fully recovers. Cross it and you've done permanent damage.\n\n3. **Yield (Act II — the point of no return).** At the **yield strength `σ_y`** the material gives up resisting and starts to flow plastically. Let go now and it *stays* deformed — like the bent paperclip. Many steels even show a brief flat plateau here where they stretch with no extra load. **Yield is the number engineers design against**: cross it and your part is permanently bent. Game over for precision.\n\n4. **Ultimate strength & necking (Act III–IV).** Past yield the curve climbs again (the metal *strain-hardens*, getting tougher as it deforms) up to a peak: the **ultimate tensile strength `σ_u`**, the most stress the material can carry. After the peak the bar develops a local thin spot — **necking** — and the curve actually *drops* as all the action concentrates there.\n\n5. **Fracture (Act V).** Finally the neck pinches down and the bar **snaps**. The strain at fracture tells you how *ductile* it was — how much it stretched before letting go.\n\nFive landmarks, one story. Stiffness (the slope), yield (don't-cross-this), ultimate (absolute max), and fracture (the end). Learn to point to each and you can read any material's soul."
    },
    {
      id: "m_hooke_formula",
      kind: "FORMULA",
      title: "Hooke's law (the elastic region)",
      display: "σ = E·ε",
      variables: [
        { symbol: "σ", name: "Stress (force per unit area)", unit: "Pa" },
        { symbol: "E", name: "Young's modulus (stiffness, slope of the elastic line)", unit: "Pa" },
        { symbol: "ε", name: "Strain (dimensionless: ΔL/L)", unit: "—" }
      ],
      note:
        "This straight-line law holds ONLY in the elastic region, below the proportional limit. E is the slope of that line — steel ≈ 200 GPa, aluminum ≈ 70 GPa, rubber ≈ 0.01–0.1 GPa. Because strain is dimensionless, E carries the same units as stress (Pa). Combine σ = F/A, ε = ΔL/L, and σ = Eε and you can solve for elongation directly: δ = ΔL = F·L/(A·E). That's the sandbox below."
    },
    {
      id: "m_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the elongation machine 🎛️",
      description:
        "Stop reading, start dragging. This computes how far an axially loaded bar stretches: δ = F·L/(A·E), shown in millimetres. Crank the force F, lengthen the bar L, fatten its cross-section A, or swap stiffness E (steel ≈ 200 GPa vs. aluminum ≈ 70 GPa) and watch the stretch react. The defaults (F = 10 000 N, L = 2 m, A = 1×10⁻⁴ m², E = 200 GPa) land exactly on 1.000 mm. Notice: more area or stiffer material shrinks the stretch, while more force or length grows it — and that's purely elastic, assuming you stay below yield.",
      variables: [
        { key: "F", label: "Force F", unit: "N", min: 1000, max: 50000, step: 1000, default: 10000 },
        { key: "L", label: "Length L", unit: "m", min: 0.5, max: 5, step: 0.1, default: 2 },
        { key: "A", label: "Area A", unit: "m²", min: 1e-5, max: 1e-3, step: 1e-5, default: 1e-4 },
        { key: "E", label: "Young's modulus E", unit: "Pa", min: 50e9, max: 250e9, step: 10e9, default: 200e9 }
      ],
      expression: "F * L / (A * E) * 1000",
      outputLabel: "Elongation δ",
      outputUnit: "mm",
      precision: 3
    },
    {
      id: "m_predict_modulus",
      kind: "PREDICT",
      question:
        "In the sandbox: keep F, L, and A fixed, but swap the bar from steel (E ≈ 200 GPa) to aluminum (E ≈ 70 GPa). What happens to the elongation δ?",
      options: [
        { id: "a", label: "It barely changes — both are metals" },
        { id: "b", label: "It gets smaller — aluminum is lighter" },
        { id: "c", label: "It gets about 3× LARGER — aluminum is much less stiff" },
        { id: "d", label: "It doubles" }
      ],
      answerId: "c",
      reveal:
        "About **3× more stretch**. Elongation `δ = FL/(AE)` is inversely proportional to `E`, and aluminum's `E ≈ 70 GPa` is roughly a third of steel's `≈ 200 GPa`. Same force, same shape, third the stiffness → triple the stretch. Drag the slider and watch it happen.\n\nHere's the trap this exposes: people assume aluminum is \"weaker,\" but stiffness (`E`) and strength (yield) are *different properties*. Aluminum is much less **stiff** (it stretches more), yet some aluminum alloys are quite **strong** (high yield). When a part deflects too much, the fix is `E` or geometry — material *strength* won't help at all. Strong ≠ stiff. Burn that in."
    },
    {
      id: "m_strong_vs_stiff",
      kind: "PROSE",
      title: "Strong vs. stiff: the distinction that trips everyone",
      markdown:
        "This is the single most important idea in the lesson, and the one interviewers love to probe because so many people fumble it. **Strength and stiffness are different things.**\n\n- **Stiffness** = resistance to *deflection*. Governed by **Young's modulus `E`** — the *slope* of the elastic line. A stiff material barely stretches under load. It says nothing about when the material breaks.\n- **Strength** = resistance to *failure*. Governed by **yield strength `σ_y`** (when it permanently deforms) and **ultimate strength `σ_u`** (when it ruptures) — *heights* on the curve. It says nothing about how much it stretched to get there.\n\nThey're independent axes — slope versus height — so all four combinations exist:\n\n- **Stiff and strong:** structural steel — high `E`, high yield. The workhorse.\n- **Stiff but weak/brittle:** glass and ceramics — steep elastic line, but they shatter at low strain with no warning. Stiff, yet fragile.\n- **Flexible but strong/tough:** rubber, nylon, spider silk — low `E` (stretches like crazy) yet absorbs enormous energy before failing.\n- **Flexible and weak:** a wet noodle. Nobody builds with these on purpose.\n\nTwo more properties round out the personality, both *areas* under the curve (energy per unit volume):\n\n- **Resilience** — energy absorbed *elastically*, up to yield. The springiness you can use over and over (think springs and trampolines).\n- **Toughness** — total energy absorbed *all the way to fracture*. A tough material soaks up huge energy before breaking. Crucially, **tough is not the same as strong**: a strong-but-brittle glass has *low* toughness because it fractures with almost no stretch, while a more modest, very ductile metal can be far tougher. This is why brittle materials fail catastrophically and ductile ones give you warning."
    },
    {
      id: "m_ductile_brittle",
      kind: "PROSE",
      title: "Ductile vs. brittle: with warning, or without",
      markdown:
        "Materials fail in two fundamentally different ways, and which one you're dealing with changes *everything* about how you design.\n\n**Ductile materials** (mild steel, copper, aluminum, gold) stretch a *lot* before breaking — large plastic region, visible necking, a long runway between yield and fracture. The huge advantage: **they warn you.** A ductile part sags, bends, and groans long before it fails, giving you time to notice and react. A bent (not broken) beam saved someone's day.\n\n**Brittle materials** (glass, cast iron, ceramics, concrete in tension, chalk) have almost no plastic region. They follow the elastic line nearly to the end and then **fracture suddenly**, with little or no warning and little energy absorbed. Their stress–strain curve is short and steep, ending in an abrupt cliff. That's why a dropped mug *shatters* — and why brittle failure is so feared in engineering: no warning, no mercy.\n\nA tidy way to see it on the curve: ductile materials have a *long* horizontal run (high strain at fracture, large area underneath = high toughness); brittle materials have a *short* one (low strain at fracture, small area = low toughness). Same axes, opposite stories. When a structure absolutely must not fail without warning — bridges, pressure vessels, aircraft — engineers reach for ductile materials precisely *because* they bend before they break."
    },
    {
      id: "m_predict_unload",
      kind: "PREDICT",
      question:
        "You pull a steel bar PAST its yield point, then completely release the load. What does the bar do?",
      options: [
        { id: "a", label: "Springs back to exactly its original length — steel is elastic" },
        { id: "b", label: "Stays permanently stretched (a bit shorter than max, but longer than original)" },
        { id: "c", label: "Snaps immediately the moment you let go" },
        { id: "d", label: "Keeps getting longer on its own after release" }
      ],
      answerId: "b",
      reveal:
        "It stays **permanently stretched** — like the bent paperclip from the intro.\n\nOnce you cross yield into the plastic region, you've done permanent damage. On release, the bar recovers only the *elastic* part of the stretch (it relaxes back along a line parallel to the original elastic slope), but a permanent **plastic strain** remains. So it ends up longer than it started, though it springs back a little from its maximum.\n\nThis is *exactly* why engineers design to stay **below yield** in normal service: cross it and your part is permanently deformed — bolts loosen, frames sag, tolerances are blown. (It's also how metal is usefully shaped: bending, stamping, and forging all deliberately push metal past yield to make the deformation stick.) Stay elastic for parts that must hold their shape; go plastic on purpose only when you *want* permanence."
    },
    {
      id: "m_check_units",
      kind: "CHECK",
      question:
        "A force of 5000 N pulls on a rod with cross-sectional area 2×10⁻⁴ m². What is the stress, and what are its units?",
      choices: [
        { id: "u1", label: "10 000 N — stress is just force" },
        { id: "u2", label: "25 MPa (= 25×10⁶ Pa)" },
        { id: "u3", label: "2.5 MPa" },
        { id: "u4", label: "1.0 N/m, since strain is dimensionless" }
      ],
      answerId: "u2",
      explanation:
        "σ = F/A = 5000 / (2×10⁻⁴) = 2.5×10⁷ Pa = 25 MPa. Stress is force per unit area, with units of pascals (N/m²). Don't confuse it with strain (which is dimensionless, ΔL/L) or with raw force. Quick gut check: a small area concentrates the force into high stress — which is exactly why thin wires and sharp notches are where things break first."
    },
    {
      id: "m_check_strong_stiff",
      kind: "CHECK",
      question:
        "A beam in your design deflects too much under load, but it's nowhere near yielding. Which material property should you increase to reduce the deflection?",
      choices: [
        { id: "s1", label: "Yield strength σ_y — make it stronger" },
        { id: "s2", label: "Ultimate tensile strength σ_u" },
        { id: "s3", label: "Young's modulus E — make it stiffer" },
        { id: "s4", label: "Toughness — make it absorb more energy" }
      ],
      answerId: "s3",
      explanation:
        "Deflection is a STIFFNESS problem, governed by Young's modulus E (and geometry), not a strength problem. Since the part isn't yielding, more yield or ultimate strength buys you nothing — it'll still flex just as much. To reduce deflection you need a higher E (a stiffer material) or a smarter, larger cross-section. This is the strong-vs-stiff distinction in action, and it's the classic interview gotcha: strength stops failure, stiffness stops deflection, and they are independent."
    },
    {
      id: "m_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: checking a steel tie-rod 🔧",
      problem:
        "A steel tie-rod carries a tensile load F = 20 000 N. It's L = 3 m long with a circular cross-section of diameter d = 16 mm. Steel: E = 200 GPa, yield strength σ_y = 250 MPa. (a) Find the cross-sectional area. (b) Find the stress and the strain. (c) Find the elongation δ. (d) Find the factor of safety against yield — is it acceptable?",
      steps: [
        {
          label: "(a) Cross-sectional area",
          markdown:
            "The rod is a circle of diameter d = 16 mm = 0.016 m, so radius r = 0.008 m.\n\n```\nA = π·r² = π × (0.008)² = π × 6.4×10⁻⁵ ≈ 2.011×10⁻⁴ m²\n```"
        },
        {
          label: "(b) Stress and strain",
          markdown:
            "**Stress:**\n\n```\nσ = F/A = 20 000 / 2.011×10⁻⁴ ≈ 9.95×10⁷ Pa ≈ 99.5 MPa\n```\n\nThat's below yield (250 MPa), so we're in the elastic region — Hooke's law applies. **Strain:**\n\n```\nε = σ/E = 99.5×10⁶ / 200×10⁹ = 4.97×10⁻⁴\n```\n\nThat's about 0.05% — tiny, as elastic strains in metals always are."
        },
        {
          label: "(c) Elongation",
          markdown:
            "Stretch the strain over the full length: δ = ε·L (equivalently δ = F·L/(A·E)).\n\n```\nδ = ε·L = 4.97×10⁻⁴ × 3 = 1.49×10⁻³ m ≈ 1.49 mm\n```\n\nSo the 3 m rod stretches about 1.5 mm under load — small, but real, and easily enough to matter in a precision assembly."
        },
        {
          label: "(d) Factor of safety against yield",
          markdown:
            "Factor of safety compares the material's yield strength to the actual working stress:\n\n```\nFoS = σ_y / σ_working = 250 MPa / 99.5 MPa ≈ 2.5\n```\n\nA factor of safety of **2.5** means the rod could carry about 2.5× the design load before yielding — a healthy, typical margin for structural steel. It absorbs the unknowns: load spikes, material variation, corrosion, fatigue, and plain human error. A FoS near 1.0 would be reckless; 2.5 is comfortable for this application."
        }
      ],
      answer:
        "A ≈ 2.01×10⁻⁴ m²; σ ≈ 99.5 MPa; ε ≈ 4.97×10⁻⁴ (~0.05%); δ ≈ 1.49 mm. Factor of safety against yield ≈ 2.5 — acceptable. The rod stays elastic, stretches about 1.5 mm, and has a healthy 2.5× margin before it would permanently deform."
    },
    {
      id: "m_callout_yield",
      kind: "CALLOUT",
      variant: "warning",
      title: "Two traps that bite real engineers",
      markdown:
        "- **Design to YIELD, not ultimate.** Beginners size parts against ultimate tensile strength because it's the biggest number. Don't. Once a part crosses *yield* it's permanently deformed — bent, sagging, out of tolerance — even though it hasn't broken. For anything that must hold its shape, yield strength (with a factor of safety on top) is your real ceiling.\n- **Strain is dimensionless — don't smuggle in units.** ε = ΔL/L is length over length, so it has *no units* (sometimes written as % or microstrain). If your strain comes out in metres, you divided wrong. And because strain is unitless, Young's modulus E always carries the same units as stress (Pa) — a handy sanity check on any Hooke's-law calculation."
    },
    {
      id: "m_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Expect a spoken version of this whole lesson, anchored to the curve. The prompts and the answers that scream \"hire this person\":\n\n- **\"Define stress and strain, with units.\"** σ = F/A in pascals (N/m²); ε = ΔL/L, dimensionless. Don't fumble the units — it's the fastest tell.\n- **\"Sketch and label the stress–strain curve.\"** Linear elastic region (slope = E) → proportional limit → yield (σ_y) → strain hardening up to ultimate strength (σ_u) → necking → fracture. Point to each landmark.\n- **\"Strong vs. stiff — what's the difference?\"** Stiff = resists deflection, set by Young's modulus E (the slope). Strong = resists failure, set by yield/ultimate strength (the heights). They're independent — glass is stiff but brittle; rubber is flexible but tough.\n- **\"Steel vs. aluminum — which is stiffer?\"** Steel, by about 3× (E ≈ 200 vs. 70 GPa), so an aluminum part of the same shape stretches ~3× as much under the same load.\n- **\"Ductile vs. brittle — why does it matter?\"** Ductile materials deform and *warn* you before failing (big plastic region, high toughness); brittle ones fracture suddenly with no warning. Safety-critical structures favor ductile materials for exactly this reason.\n- **\"What does a factor of safety protect against?\"** The unknowns — load spikes, material scatter, corrosion, fatigue, human error. It's the gap between working stress and yield, and bigger isn't always better (it costs weight and money)."
    },
    {
      id: "m_wrap",
      kind: "PROSE",
      title: "One curve to read them all",
      markdown:
        "Every material question you'll ever face traces back to the same picture. Here's the whole lesson in one mental model:\n\n1. **Normalize first.** Force and stretch depend on size; convert to **stress** `σ = F/A` and **strain** `ε = ΔL/L` and you get the material's own fingerprint, independent of the part.\n2. **Read the curve.** Elastic line (slope `E`) → proportional limit → **yield** `σ_y` (point of no return) → **ultimate** `σ_u` (the peak) → necking → **fracture**. Each landmark is a design number.\n3. **Separate strong from stiff.** `E` (slope) is stiffness — resists *deflection*. Yield/ultimate (heights) is strength — resists *failure*. Independent axes. Never confuse them.\n4. **Predict and protect.** Use Hooke's law `σ = Eε` and `δ = FL/(AE)` to compute deflection before building, stay below yield with a sensible **factor of safety**, and pick ductile materials where failure must come with warning.\n\nThat's the entire foundation of mechanics of materials, and it all lives on one graph. Go run the elongation sandbox one more time — now every slider should move exactly the way your intuition predicts. Read the fingerprint, respect the yield, and you'll never look at a paperclip, a rubber band, or a glass rod the same way again. 💪"
    }
  ],
  keyTakeaways: [
    "Stress σ = F/A (in pascals) and strain ε = ΔL/L (dimensionless) normalize away the part's size, leaving a curve that belongs to the MATERIAL, not the specimen.",
    "The stress–strain curve has five landmarks: a linear elastic region (slope = Young's modulus E), the proportional limit, yield strength σ_y, ultimate strength σ_u at the peak, then necking to fracture.",
    "Strong ≠ stiff. Stiffness is Young's modulus E (the slope, resisting deflection); strength is yield/ultimate (the heights, resisting failure). They are independent properties.",
    "Hooke's law σ = E·ε holds only in the elastic region; combined with the definitions it gives elongation δ = F·L/(A·E) — your tool for predicting deflection before building.",
    "Below yield, deformation is elastic and fully recoverable; cross yield and the part is PERMANENTLY deformed, which is why engineers design against yield strength.",
    "Ductile materials (steel, aluminum) stretch and warn you before failing; brittle materials (glass, cast iron) fracture suddenly with no warning — toughness is the energy absorbed to fracture, and strong is not the same as tough.",
    "A factor of safety (yield strength ÷ working stress) absorbs the unknowns — load spikes, material scatter, corrosion, fatigue, human error — and a value around 2–3 is typical for structural steel."
  ]
};
