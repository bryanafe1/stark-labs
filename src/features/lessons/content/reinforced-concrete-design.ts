import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_rcdesign",
  slug: "reinforced-concrete-design",
  title: "Reinforced Concrete: Why We Glue Steel Inside Rock",
  summary:
    "Concrete is a champion at being squeezed and a coward at being pulled. Steel is the opposite — and absurdly, they expand at almost the same rate when heated. We'll exploit that marriage to build a beam that bends without snapping: the tension-compression couple, the internal moment arm, why codes practically FORCE your beam to fail in slow motion, and the difference between f'c, fy, and a beam that lands you the offer.",
  discipline: "CIVIL",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["reinforced-concrete", "structural-design", "beams"],
  objectives: [
    "Explain why plain concrete cracks under bending and exactly where the steel has to go to save it.",
    "Picture a reinforced-concrete beam as an internal couple — a compression block up top, a steel tension force down low, separated by a lever arm.",
    "Tell an under-reinforced (ductile) beam apart from an over-reinforced (brittle) one, and say why codes hate the brittle one.",
    "Use the right material number at the right time: f'c for concrete in compression, fy for steel in tension.",
    "Reason about development length and why rebar can't just stop wherever it feels like it.",
    "Apply factored loads and the strength-reduction idea to estimate tension-steel capacity and required steel.",
  ],
  prerequisites: [
    "Bending stress in beams and the idea of an internal moment (M = force × arm)",
    "Stress and strain basics (σ = P/A, yield)",
    "Statics: drawing a free body and summing forces and moments",
  ],
  interviewAngle:
    "Reinforced concrete is a beloved interview probe because it instantly reveals whether you understand a material or just memorized its strength number. The classic opener is deceptively simple: \"Concrete is strong — why does it need steel at all?\" The weak answer mumbles \"for support.\" The strong answer nails it: concrete is excellent in compression but pathetic in tension (roughly a tenth of its compressive strength), so it cracks on the bottom of a sagging beam, and we drop steel exactly where the tension lives to carry it. Expect follow-ups on the internal couple (where's the concrete pushing, where's the steel pulling, and what's the lever arm between them), on ductile-versus-brittle failure (why we deliberately design the steel to yield FIRST so the beam sags and warns you, instead of the concrete crushing without notice), and on why the two materials team up so well thermally and by bond. Sharp candidates volunteer the role of load factors and the strength-reduction factor φ — the deliberate, asymmetric safety margins baked into ultimate-strength design. Being able to sketch the strain diagram, mark the neutral axis, and explain why an over-reinforced beam is banned is a flat-out signal of structural maturity.",
  blocks: [
    {
      id: "b_hook_prose",
      kind: "PROSE",
      title: "A material that's a hero and a coward at once 🦸",
      markdown:
        "Squeeze a concrete cylinder and it shrugs off a small car — tens of megapascals of compressive strength, cheap, fireproof, basically liquid rock you pour into any shape. Now try to *pull* that same concrete apart. It gives up almost instantly, at maybe a tenth of its crushing strength. Concrete is a hero in compression and an outright coward in tension.\n\nThat's a disaster for a beam. Bend a beam and one face gets squeezed while the opposite face gets stretched. Stretch the bottom of a plain concrete beam and it cracks — fast, brittle, no warning, the whole thing snaps like a cracker.\n\nThe fix is one of the great hacks in engineering: bury **steel** — a material that's fantastic in tension — exactly where the concrete is about to be pulled apart. Now the concrete does what it loves (compression) and the steel does what *it* loves (tension), and together they form a beam that's strong, cheap, and — if you design it right — fails in graceful slow motion instead of exploding.\n\nBy the end of this lesson you'll see a beam as an internal tug-of-war, know precisely where to bury the steel and how much, and understand why the building code practically forces your beam to warn you before it dies. First, watch one get designed.",
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "skunTj-gP1k",
      title: "Watch: How to Design a Reinforced Concrete Beam",
    },
    {
      id: "b_intuition_prose",
      kind: "PROSE",
      title: "Where does the crack want to form?",
      markdown:
        "Picture a simply supported beam with a load pressing down in the middle — it sags into a smile. Look at what that does through the depth:\n\n- The **top** fibers get shorter — they're in **compression**. Concrete: \"this is my jam.\"\n- The **bottom** fibers get longer — they're in **tension**. Concrete: \"absolutely not.\"\n- Somewhere in between sits the **neutral axis**, where the fiber is neither stretched nor squeezed.\n\nSo the bottom of a sagging beam is where the crack wants to open. That's exactly where we lay the steel — near the bottom face, running along the beam. We even tie it off with concrete cover so it doesn't rust, but its *job* is purely to grab the tension the concrete refuses to carry.\n\nHere's the subtle, beautiful part. We don't fight the cracks — we *let the concrete crack* in the tension zone and assume it carries no tension at all. Once it cracks, the steel takes the entire pull, and the uncracked concrete up top takes the entire push. Two materials, two jobs, one beam. Flip the beam over a support (a cantilever or a continuous beam over a column) and the tension moves to the *top* — so the steel moves up there too. The rule never changes: **steel follows the tension.**",
    },
    {
      id: "b_predict_steel",
      kind: "PREDICT",
      question:
        "You're designing a simply supported beam — load in the middle, sagging into a smile. Where should the main tension steel go?",
      options: [
        { id: "p1", label: "Near the top face, where it's squeezed" },
        { id: "p2", label: "Near the bottom face, where it's stretched" },
        { id: "p3", label: "Exactly on the neutral axis, dead center" },
        { id: "p4", label: "Doesn't matter — steel works anywhere" },
      ],
      answerId: "p2",
      reveal:
        "**Near the bottom.** A sagging beam stretches its bottom fibers, and tension is exactly what concrete can't handle — so that's where the crack wants to open and where the steel must be to catch the pull. Put steel on the neutral axis and it's nearly useless (zero strain there, so it carries almost no force). Put it on top and you've reinforced the one zone that didn't need help. Steel follows the tension — and on a sagging span, tension lives down low.",
    },
    {
      id: "b_couple_prose",
      kind: "PROSE",
      title: "The beam is an internal couple (a tiny tug-of-war)",
      markdown:
        "Here's the model that makes everything click. After the bottom cracks, a reinforced-concrete beam resists bending as an **internal couple** — two equal-and-opposite horizontal forces separated by a lever arm:\n\n- Up top, the uncracked concrete forms a **compression block** pushing in with a total force `C`.\n- Down low, the steel pulls back with a total tension force `T`.\n\nBecause there's no net axial load on the beam, horizontal equilibrium demands `C = T`. These two forces don't share a line of action — they're offset by a vertical distance `jd`, the **internal moment arm** (think of it as roughly the distance from the steel up to the *center* of the compression block). Two offset, opposite forces are the textbook definition of a couple, and a couple produces a moment:\n\n```\nMn = T · jd = C · jd\n```\n\nThat `Mn` is the beam's **nominal moment capacity** — how much bending it can take. Read what that one equation is telling you: to make a beam stronger you can either crank up the force (`T`, i.e. more or stronger steel) *or* stretch the lever arm (`jd`, i.e. a deeper beam). This is why deep beams are so efficient — a bigger arm multiplies every newton of steel force into more capacity, for free. It's the same reason a long wrench loosens a stubborn bolt: leverage beats brute force.",
    },
    {
      id: "b_formula",
      kind: "FORMULA",
      title: "Tension-steel force (the T in the couple)",
      display: "T = As · fy",
      variables: [
        { symbol: "T", name: "Total tension force the steel can develop", unit: "N" },
        { symbol: "As", name: "Total cross-sectional area of tension steel", unit: "mm²" },
        { symbol: "fy", name: "Yield strength of the reinforcing steel", unit: "MPa" },
      ],
      note:
        "When the beam reaches its capacity, the steel has yielded — so it's carrying its full yield-stress force, T = As·fy. (One newton equals one MPa acting on one mm², so As in mm² times fy in MPa lands directly in newtons — divide by 1000 for kN.) Notice f'c, the concrete strength, isn't in here at all: this T is purely the steel's tension. The concrete's job is to supply an equal compression C and to set the lever arm; the steel sets the pull.",
    },
    {
      id: "b_sandbox",
      kind: "SANDBOX",
      title: "Play: the tension-steel capacity explorer",
      description:
        "Drag the steel area and yield strength and watch the tension force the beam can muster. Add more bars (push As up) or specify higher-grade steel (push fy up) and T climbs in a straight line — both are linear knobs. Defaults model a common beam: As = 1500 mm² (roughly three 25 mm bars) of Grade 420 steel.",
      variables: [
        {
          key: "As",
          label: "Steel area As",
          unit: "mm²",
          min: 200,
          max: 5000,
          step: 50,
          default: 1500,
        },
        {
          key: "fy",
          label: "Steel yield fy",
          unit: "MPa",
          min: 250,
          max: 550,
          step: 10,
          default: 420,
        },
      ],
      expression: "As * fy / 1000",
      outputLabel: "Steel tension capacity",
      outputUnit: "kN",
      precision: 0,
    },
    {
      id: "b_predict_depth",
      kind: "PREDICT",
      question:
        "Two beams use the SAME amount and grade of tension steel (same T). Beam B is built twice as deep as beam A, so its internal lever arm jd is about double. Roughly how much more bending can beam B resist?",
      options: [
        { id: "q1", label: "About the same — only steel area sets capacity" },
        { id: "q2", label: "About 1.4× more" },
        { id: "q3", label: "About twice as much (2×)" },
        { id: "q4", label: "About four times as much (4×)" },
      ],
      answerId: "q3",
      reveal:
        "**About twice.** Capacity is `Mn = T · jd`. The steel force `T` is unchanged, but doubling the depth roughly doubles the lever arm `jd`, so the moment capacity roughly doubles — for the same steel. This is the single biggest reason structural beams are tall and narrow rather than short and wide: depth buys you leverage, and leverage is the cheapest strength there is. (In reality the compression block shifts a little, so it's not *exactly* 2×, but the leverage intuition is dead on.)",
    },
    {
      id: "b_ductile_prose",
      kind: "PROSE",
      title: "Two ways to fail — and why codes pick the polite one 🚦",
      markdown:
        "A reinforced-concrete beam can lose its couple in two very different ways, depending on how much steel you packed in:\n\n**Under-reinforced (the good one).** Not too much steel. As the load rises, the **steel yields first** — it stretches a lot while still holding its force. The beam visibly sags, cracks widen, deflections grow, everyone in the building has time to notice and run. Only later does the concrete finally crush. This is **ductile** failure: slow, loud, forgiving.\n\n**Over-reinforced (the dangerous one).** Too much steel. Now the **concrete crushes before the steel ever yields**. Concrete in compression has almost no give — it goes from fine to exploded with little warning. This is **brittle** failure: sudden, catastrophic, no second chances.\n\nSo here's the design philosophy that surprises newcomers: **codes deliberately force beams to be under-reinforced.** They cap the steel ratio (and require a minimum steel-strain at failure) precisely so the steel is *guaranteed* to yield first. The whole point is to engineer a failure mode that **warns you** — a beam that groans and droops before it ever lets go. We don't just design for strength; we design for *how the thing dies.* A ductile beam is a beam that gives you a chance.\n\nThe dividing line is the **balanced** condition — the exact steel amount where concrete crushing and steel yielding happen at the same instant. Design below that (less steel) and you're safely ductile; above it, you've drifted into brittle territory the code won't let you build.",
    },
    {
      id: "b_materials_callout",
      kind: "CALLOUT",
      variant: "tip",
      title: "Don't mix up f'c and fy — they're two different jobs",
      markdown:
        "Two strength numbers run this whole show, and confusing them is a classic rookie slip:\n\n- **f'c — concrete's compressive strength** (e.g. 28 MPa). It governs the *compression block* up top and sets the size and force of `C`. Concrete is rated by how hard you can *squeeze* it; we ignore its tension entirely.\n- **fy — steel's yield strength** (e.g. 420 MPa). It governs the *tension force* `T = As·fy` down low. Steel is rated by where it starts to *yield* in a pull.\n\nNotice the scale gap: steel's fy (420) dwarfs concrete's f'c (28) by an order of magnitude. That's the entire reason a relatively *thin* sliver of steel can balance a *fat* block of concrete — and why putting the strong material exactly where the tension lives is such an elegant trick. One material for the push, one for the pull, each rated by the test that matches its job.",
    },
    {
      id: "b_bond_prose",
      kind: "PROSE",
      title: "Why the marriage actually works: bond, ribs, and a thermal coincidence",
      markdown:
        "Burying steel in concrete only works if the two genuinely act as one. Three things make that happen:\n\n**Bond and development length.** The steel can only deliver its `As·fy` force if the concrete grips it tightly enough to *transfer* that force — through chemical adhesion, friction, and mostly the ribs (deformations) rolled onto modern rebar that key into the concrete like a screw thread. The length of bar needed to build up its full yield force is the **development length**, `ld`. This is why rebar can't just stop the instant the math says the force hit zero — it needs a running start of embedded length (or a hook) on either side to anchor itself. Stop a bar short and it pulls out like a tooth, force undelivered.\n\n**The thermal coincidence.** Steel and concrete expand at almost the *same* rate when heated (their coefficients of thermal expansion are nearly identical, around 10–12 × 10⁻⁶ per °C). Pure luck of materials science — but without it, a hot summer day would shear the bond apart as one material grew faster than the other. They get to be lifelong partners because they breathe together.\n\n**Protection.** The concrete also shields the steel: alkaline cement keeps the steel from rusting, and a minimum **cover** of concrete guards it from fire and corrosion. Each material covers the other's weakness — concrete's brittleness in tension, steel's vulnerability to rust and heat.",
    },
    {
      id: "b_loadfactors_callout",
      kind: "CALLOUT",
      variant: "insight",
      title: "Ultimate-strength design: load factors and the φ factor",
      markdown:
        "Modern codes (like ACI) don't size beams for the loads you expect — they size them for *amplified* loads against *de-rated* strength. This is **ultimate-strength** (LRFD-style) design, and it has two asymmetric safety knobs:\n\n- **Load factors (bump the demand UP).** You don't design for the raw service load. You inflate it: a factored load like `1.2·D + 1.6·L` (dead load × 1.2, live load × 1.6) anticipates that real loads can exceed estimates — and live loads, being less predictable, get the bigger multiplier.\n- **Strength-reduction factor φ (knock the capacity DOWN).** The beam's nominal capacity `Mn` is multiplied by `φ` (around 0.9 for a nicely ductile beam in bending) to account for material variability, construction tolerances, and the consequences of failure.\n\nThe design rule is then simply: **φ·Mn ≥ Mu** — the reduced capacity must beat the factored demand. Both margins lean the same way (safer), and they're *bigger* where uncertainty or danger is greater. That's also why ductile (under-reinforced) beams earn a higher φ than brittle ones: the code rewards the failure mode that warns you.",
    },
    {
      id: "b_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Sizing the steel: capacity, then how much rebar a moment needs",
      problem:
        "A rectangular beam has tension steel area As = 1500 mm² of Grade 420 steel (fy = 420 MPa) and an internal lever arm jd ≈ 400 mm. (a) Find the steel tension force T. (b) Estimate the nominal moment capacity Mn = T·jd. (c) Now flip the problem: a different beam must resist a nominal moment of Mn = 250 kN·m with the same fy = 420 MPa and jd ≈ 450 mm — roughly how much tension steel As does it need?",
      steps: [
        {
          label: "Step (a) — Tension force the steel develops",
          markdown:
            "At capacity the steel has yielded, so T = As·fy = 1500 mm² × 420 MPa = 630,000 N = **630 kN**. (Matches the sandbox at its defaults — same numbers.) The concrete supplies an equal compression C = 630 kN up top to balance it.",
        },
        {
          label: "Step (b) — Nominal moment capacity",
          markdown:
            "The couple's moment is Mn = T·jd = 630,000 N × 0.400 m = 252,000 N·m ≈ **252 kN·m**. That's how much bending this beam can resist before its steel-and-concrete couple gives way.",
        },
        {
          label: "Step (c) — Reverse it: required steel for a target moment",
          markdown:
            "Rearrange the couple. We need T = Mn / jd = 250,000 N·m / 0.450 m ≈ 555,600 N. Then As = T / fy = 555,600 N / 420 MPa ≈ **1323 mm²**. In practice you'd round UP to a real bar combination — say three 25 mm bars (≈ 1473 mm²) — so the supplied steel comfortably clears the requirement.",
        },
        {
          label: "Step (d) — Sanity & safety check",
          markdown:
            "Confirm the beam is under-reinforced (steel ratio below the code limit, so the steel yields first → ductile). Then apply real-code factors: the *design* check is φ·Mn ≥ Mu, with φ ≈ 0.9 for a ductile beam and Mu the *factored* load moment (e.g. from 1.2D + 1.6L). Our `Mn` is the un-factored nominal value — the starting point, not the final allowable.",
        },
      ],
      answer:
        "(a) T = As·fy = **630 kN**. (b) Mn = T·jd ≈ **252 kN·m**. (c) For a 250 kN·m demand with jd ≈ 450 mm, you need As ≈ T/fy = (250 kN·m / 0.45 m) / 420 MPa ≈ **1323 mm²** — round up to a real bar set. **The whole game is the couple: T = As·fy, and Mn = T·jd. Bigger force or bigger lever arm, bigger beam.** Then wrap it in load factors and φ before you build it.",
    },
    {
      id: "b_check_tension",
      kind: "CHECK",
      question:
        "Why does plain (unreinforced) concrete perform so poorly as a bending beam?",
      choices: [
        { id: "c1", label: "It's too heavy to span any useful distance." },
        { id: "c2", label: "It's weak in tension, so it cracks on the stretched face." },
        { id: "c3", label: "It's weak in compression, so the top crushes immediately." },
        { id: "c4", label: "It conducts heat too well and loses strength." },
      ],
      answerId: "c2",
      explanation:
        "Bending stretches one face and squeezes the other. Concrete handles compression beautifully but is feeble in tension — only about a tenth of its compressive strength — so the stretched face cracks first, brittle and without warning. Reinforcing steel is dropped into exactly that tension zone to carry the pull the concrete can't.",
    },
    {
      id: "b_check_ductile",
      kind: "CHECK",
      question:
        "Why do codes deliberately require beams to be under-reinforced (steel yields before the concrete crushes)?",
      choices: [
        { id: "d1", label: "It uses less steel, so it's always cheaper." },
        { id: "d2", label: "It makes the beam stronger than an over-reinforced one." },
        {
          id: "d3",
          label:
            "It produces a ductile failure — visible sagging and cracking that warns before collapse.",
        },
        { id: "d4", label: "It prevents the steel from ever rusting." },
      ],
      answerId: "d3",
      explanation:
        "An under-reinforced beam yields its steel first, so it deflects and cracks dramatically — a slow, visible, ductile failure that warns occupants before the concrete finally crushes. An over-reinforced beam crushes its concrete suddenly with no warning (brittle). Codes cap the steel ratio precisely to guarantee the polite, ductile mode — designing not just for strength but for HOW the beam fails.",
    },
    {
      id: "b_interview_callout",
      kind: "CALLOUT",
      variant: "interview",
      title: "In the interview: \"Concrete is strong — so why add steel?\"",
      markdown:
        "This question separates the memorizers from the engineers. Don't say \"for support.\" Build the answer in layers:\n\n1. **Lead with the asymmetry:** \"Concrete is great in compression but weak in tension — only about a tenth as strong. Bend a beam and the bottom goes into tension, so plain concrete cracks there, brittle and without warning.\"\n2. **Place the steel:** \"So we put steel — strong in tension — exactly in the tension zone. Concrete takes the compression, steel takes the tension.\" (Sketch the sagging beam, mark the neutral axis.)\n3. **Name the couple:** \"It resists bending as an internal couple — compression block C up top, steel tension T = As·fy down low, separated by a lever arm jd, so Mn = T·jd.\"\n4. **Volunteer the failure mode:** \"We design it under-reinforced so the steel yields first — a ductile failure that warns you — instead of the concrete crushing suddenly. Codes cap the steel ratio to force that.\"\n5. **Show you know the safety machinery:** mention factored loads (1.2D + 1.6L) and the φ factor, with φ·Mn ≥ Mu.\n\nIf you also drop in the thermal-expansion coincidence and bond/development length, you've shown you understand *why the partnership physically works* — not just that it does.",
    },
  ],
  keyTakeaways: [
    "Concrete is strong in compression but weak in tension (about a tenth as strong), so plain concrete beams crack on the stretched face — steel is added exactly where the tension lives.",
    "A reinforced-concrete beam resists bending as an internal couple: a concrete compression block C up top, a steel tension force T = As·fy down low, with C = T and a lever arm jd, giving Mn = T·jd.",
    "Capacity grows with steel force (As, fy) OR with depth (jd) — which is why deep beams are efficient: leverage is cheap strength.",
    "Codes force beams to be under-reinforced so the steel yields FIRST: a ductile, warning failure rather than the sudden brittle crushing of an over-reinforced beam.",
    "Keep the two strength numbers straight: f'c rates concrete in compression (the C block), fy rates steel in tension (the T force); steel's fy dwarfs concrete's f'c.",
    "Bond, ribbed rebar, and development length let the steel actually deliver its force; a near-identical thermal expansion coefficient lets steel and concrete act as one.",
    "Ultimate-strength design amplifies loads (e.g. 1.2D + 1.6L) and reduces capacity (φ), requiring φ·Mn ≥ Mu — bigger margins where uncertainty and danger are greater.",
  ],
};
