import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_reaction",
  slug: "reaction-engineering-and-kinetics",
  title: "Reaction Engineering and Kinetics",
  summary:
    "A reaction that's thermodynamically allowed but achingly slow is, commercially, a reaction that doesn't happen. Reaction engineering is the art of asking two questions the rest of chemistry ignores: how FAST does this go, and what SHAPE of vessel makes it go fastest? You'll meet rate laws and reaction order, watch the rate constant explode with temperature via Arrhenius, time a first-order reaction with its half-life, and then pit the three ideal reactors — batch, CSTR, and PFR — against each other to discover why a long skinny pipe almost always beats a big stirred pot. This is the part of chemical engineering where the molecules finally start racing.",
  discipline: "CHEMICAL",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["reaction-engineering", "kinetics", "reactors"],
  objectives: [
    "Write a rate law and read off the reaction order, distinguishing it cleanly from the stoichiometric coefficients.",
    "Explain why the rate constant k skyrockets with temperature through the Arrhenius equation, and what activation energy really measures.",
    "Compute the half-life of a first-order reaction and explain why it's gloriously independent of starting concentration.",
    "Describe the three ideal reactors — batch, CSTR, PFR — and write down each one's design equation conceptually.",
    "Define conversion and use it to size a reactor or compare two of them.",
    "Argue convincingly why, for a normal positive-order reaction, a PFR out-performs a CSTR of the same volume.",
  ],
  prerequisites: [
    "Basic algebra and the natural log / exponential functions",
    "Comfort with concentration (mol/L) and molar flow rates (mol/s)",
    "The idea of a chemical reaction having reactants and products",
  ],
  interviewAngle:
    "Reaction engineering is where interviewers find out whether you actually understand chemical engineering or just memorized formulas. The classic openers are deceptively small: \"What's the order of this reaction?\", \"What happens to the rate if I double the temperature?\", and the killer \"For the same volume, would you use a CSTR or a PFR — and why?\". The strong candidate (1) never confuses reaction order with stoichiometry — order is empirical, from the rate law, not from the balanced equation; (2) reaches for Arrhenius the instant temperature comes up and can explain that the exponential dependence means a ~10 °C rise often roughly doubles the rate; (3) knows the first-order half-life ln(2)/k is independent of starting concentration and can use it as a quick sanity check; and (4) can reason from the design equations that a CSTR runs the whole reaction at the LOW exit concentration while a PFR enjoys high concentration along most of its length, so the PFR needs less volume for the same conversion. Bonus points for naming when a CSTR actually wins (autocatalytic or strongly exothermic runaway-prone reactions). Calm reasoning from the rate law beats a memorized table every time.",
  blocks: [
    {
      id: "rk_intro",
      kind: "PROSE",
      title: "Thermodynamics says yes; kinetics says... eventually ⏳",
      markdown:
        "Here's a fact that should unsettle you: a lump of diamond on your desk is, thermodynamically, *desperate* to turn into graphite. The reaction is downhill — it releases energy. So why isn't your jewelry quietly crumbling into pencil lead? Because it would take longer than the age of the universe. Thermodynamics tells you whether a reaction *can* happen and how far it *wants* to go. It says nothing — *nothing* — about how fast.\n\nThat \"how fast\" is the entire kingdom of **kinetics**, and the business of building vessels to exploit it is **reaction engineering**. This is the discipline that separates a clever lab demo from a billion-dollar plant. Ammonia synthesis, the reaction that feeds half the planet, is thermodynamically favorable at room temperature — yet without a catalyst and brutal conditions it crawls so slowly it's useless. Reaction engineers are the people who make favorable-but-slow into fast-and-profitable.\n\nTwo questions drive everything in this lesson:\n\n1. **How fast does the reaction go**, and what knobs (concentration, temperature, catalyst) speed it up? That's kinetics.\n2. **What shape of vessel** turns that rate into the most product for the least money and volume? That's reactor design.\n\nGet these two right and you can build a plant. Get them wrong and you've built a very expensive, very slow paperweight.",
    },
    {
      id: "rk_video",
      kind: "VIDEO",
      youtubeId: "O9KEvNovFxY",
      title: "Watch: Batch vs CSTR vs PFR Reactors",
      caption:
        "Before we get into rate laws, watch this tour of the three reactors you'll spend the rest of the lesson comparing. Seeing the pot-vs-tank-vs-pipe distinction once makes the design-equation section feel obvious instead of abstract.",
    },
    {
      id: "rk_ratelaw_prose",
      kind: "PROSE",
      title: "The rate law: speed as a function of crowdedness",
      markdown:
        "The fundamental object in kinetics is the **rate law** — an equation that tells you how fast a reaction runs given the current concentrations. For a reaction consuming a species A, it usually looks like:\n\n```\nrate = k · [A]^n\n```\n\nTwo characters to meet:\n\n- **`k`, the rate constant** — the intrinsic speed setting. It bundles up everything *except* concentration: the temperature, the catalyst, the geometry of the molecules. Crank `k` and the whole reaction speeds up.\n- **`n`, the reaction order** — how sensitively the rate responds to concentration. If `n = 1` (first order), doubling `[A]` doubles the rate. If `n = 2` (second order), doubling `[A]` *quadruples* it. If `n = 0` (zero order), concentration doesn't matter at all — the rate is flat (common when a catalyst surface is saturated).\n\nNow the trap that catches everyone, and that interviewers *love*: **reaction order is NOT the stoichiometric coefficient.** The balanced equation `2 A → B` does *not* tell you the order is 2. Order is an *empirical* quantity — you measure it in the lab by watching how rate changes with concentration. Sometimes it matches the stoichiometry; often it doesn't (especially with multi-step mechanisms). The balanced equation tells you the *ratios* of stuff consumed and made; the rate law tells you the *speed*. Different questions, different answers. Conflating them is the single most common kinetics mistake.\n\nThe intuition for order: it's about how much the reaction *cares* that molecules are crowded together. High order = very sensitive to concentration. Zero order = couldn't care less.",
    },
    {
      id: "rk_arrhenius_prose",
      kind: "PROSE",
      title: "Arrhenius: why heat is the universal accelerator 🔥",
      markdown:
        "So what controls `k`? Overwhelmingly: **temperature**. And the relationship isn't gentle — it's explosive. The **Arrhenius equation** captures it:\n\n```\nk = A · exp(−Eₐ / (R·T))\n```\n\nLook at the structure. There's an exponential with temperature `T` buried in the denominator, which means `k` climbs *steeply* as you heat things up. The pieces:\n\n- **`Eₐ`, the activation energy** — the energy hill molecules must climb to react. Think of it as the cover charge: every reacting pair has to pay `Eₐ` to get in the door. A tall hill means few molecules have enough energy at any moment, so the reaction is slow.\n- **`T`, absolute temperature** — heating gives molecules more energy, so a *much* larger fraction can clear the hill. Because the dependence is exponential, the effect is dramatic: as a rule of thumb, **a ~10 °C rise roughly doubles many reaction rates.**\n- **`A`, the pre-exponential factor** — how often molecules collide with the right orientation. The ceiling speed if there were no energy barrier at all.\n\nThis is why food spoils fast in summer and slow in the fridge, why we refrigerate medicines, why a fever speeds up your metabolism, and why industrial reactors so often run hot. It's also why activation energy is the prize a **catalyst** captures: a catalyst doesn't change where the reaction *wants* to end up (thermodynamics is untouched) — it just digs a tunnel through the hill, lowering `Eₐ`, so `k` shoots up and the reaction that took geological time now finishes before lunch. The diamond on your desk is safe only because nobody's invented a catalyst patient enough to bother.",
    },
    {
      id: "rk_halflife_formula",
      kind: "FORMULA",
      title: "First-order half-life",
      display: "t₁/₂ = ln(2) / k",
      latex: "t_{1/2} = \\dfrac{\\ln(2)}{k}",
      variables: [
        { symbol: "t₁/₂", name: "Half-life — time for the concentration to fall to half its value", unit: "s" },
        { symbol: "ln(2)", name: "Natural log of 2, a fixed constant ≈ 0.693", unit: "—" },
        { symbol: "k", name: "First-order rate constant", unit: "1/s" },
      ],
      note:
        "This is the half-life for a FIRST-ORDER reaction only, and its magic is what's MISSING: there is no starting-concentration term. The time to halve is the same whether you start at 1 mol/L or 1000 mol/L. That constant-halving signature (the same as radioactive decay) is how you spot first-order behavior in data. Note k has units of 1/s for first order — the units of k actually change with reaction order.",
    },
    {
      id: "rk_halflife_prose",
      kind: "PROSE",
      title: "The strange beauty of a constant half-life",
      markdown:
        "First-order reactions have a property so clean it feels like a magic trick: the **half-life is independent of how much you start with.** Start with a beaker brimming with reactant or just a whiff of it — the time for half of it to disappear is *identical*, `ln(2)/k`. Wait another half-life and half of what's *left* disappears, and so on: 100% → 50% → 25% → 12.5%, each step taking exactly the same time.\n\nIf that pattern rings a bell, it should — it's *exactly* radioactive decay, which is the canonical first-order process. Carbon-14 dating works precisely because the half-life doesn't care about the sample size. The same math governs drug clearance in your bloodstream (why doses are timed in half-lives), capacitor discharge, and a cooling cup of coffee's approach to room temperature.\n\nWhy does it happen? Because in first order, `rate = k·[A]` — the rate is always proportional to what's present. Twice as much reactant means twice the rate, so it burns through twice as fast and arrives at the halfway mark at the same clock time. The proportionality is self-correcting. (Contrast second order, where the half-life *does* depend on concentration — it gets *longer* as the reaction proceeds and molecules become too dilute to find each other.)\n\nPractically, the constant-halving fingerprint is a free diagnostic: plot your data, and if successive halvings take equal time, you've got a first-order reaction and `k = ln(2)/t₁/₂` falls right out.",
    },
    {
      id: "rk_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the half-life dial 🎛️",
      description:
        "Drag the rate constant `k` and watch the first-order half-life respond. Notice the relationship is inverse: a bigger `k` (faster reaction) means a *shorter* time to halve. The default k = 0.0231 1/s lands on a half-life of 30.0 s — that's the kind of `k` you'd get from `k = ln(2)/30`. Slide `k` up toward 1 and the half-life collapses to under a second; slide it down toward 0.001 and it stretches past ten minutes. Remember the headline: nowhere in this calculation does the starting concentration appear.",
      variables: [
        { key: "k", label: "Rate constant k", unit: "1/s", min: 0.001, max: 1, step: 0.001, default: 0.0231 },
      ],
      expression: "ln(2) / k",
      outputLabel: "Half-life",
      outputUnit: "s",
      precision: 1,
    },
    {
      id: "rk_predict_order",
      kind: "PREDICT",
      question:
        "A reaction has the rate law rate = k·[A]². You double the concentration of A. What happens to the reaction rate?",
      options: [
        { id: "a", label: "It doubles — rate is proportional to concentration" },
        { id: "b", label: "It quadruples — the concentration is squared" },
        { id: "c", label: "It stays the same — order doesn't affect rate" },
        { id: "d", label: "It halves — higher concentration slows things down" },
      ],
      answerId: "b",
      reveal:
        "It **quadruples**. The rate depends on `[A]²`, so doubling `[A]` multiplies the rate by `2² = 4`. That's the whole meaning of reaction order: it's the exponent that tells you how *sensitively* the rate responds to concentration.\n\nContrast the orders so the pattern sticks. Zero order (`[A]⁰ = 1`): doubling concentration does *nothing*, rate is flat. First order (`[A]¹`): doubling concentration doubles the rate. Second order (`[A]²`): doubling concentration quadruples the rate. Higher order = more dramatic response to crowding.\n\nAnd the eternal reminder: that exponent of 2 is the *measured* order, not something you read off a balanced equation. Even if the stoichiometry happened to be `A → products`, the order could still be 2 if that's what the lab data show. Order lives in the rate law, never in the stoichiometry.",
    },
    {
      id: "rk_predict_temp",
      kind: "PREDICT",
      question:
        "Your reaction is running too slowly. Per the Arrhenius equation, which single change would speed up the rate constant k the MOST dramatically?",
      options: [
        { id: "a", label: "Doubling the concentration of reactant" },
        { id: "b", label: "Raising the temperature substantially" },
        { id: "c", label: "Using a bigger reactor vessel" },
        { id: "d", label: "Stirring the mixture faster" },
      ],
      answerId: "b",
      reveal:
        "**Raising the temperature.** Among these, temperature is the only knob that touches `k` itself, and it does so *exponentially* via Arrhenius (`k = A·exp(−Eₐ/RT)`). Because `T` sits inside an exponential, a modest heat-up produces an outsized jump in `k` — the rule of thumb that ~10 °C can roughly double the rate.\n\nWhy the others miss: doubling **concentration** speeds the *rate* (through the rate law) but doesn't change `k`, the intrinsic speed setting — and it does nothing exponential. A **bigger vessel** changes how much you make, not how fast each molecule reacts. **Stirring** helps only if the reaction was limited by mixing or mass transfer, not by chemistry. To attack `k` at its root, you heat it up — or, even better, add a catalyst to lower `Eₐ`, which also shows up exponentially. Temperature and catalysts are the two great levers on `k`; everything else is a sideshow.",
    },
    {
      id: "rk_reactors_prose",
      kind: "PROSE",
      title: "Three vessels, three philosophies 🏭",
      markdown:
        "Now the engineering. Once you know the rate law, you have to pick a *vessel* to run the reaction in, and reaction engineering idealizes everything down to three archetypes. Memorize their personalities — every real reactor is a blend or distortion of these:\n\n- **Batch reactor — the soup pot.** You dump everything in, seal it, let it react for a set time, then empty it. No flow in or out during the reaction; concentration falls and conversion climbs *as time passes*. Great for small volumes, expensive specialty products, and flexibility (today you make drug X, tomorrow drug Y in the same pot). The downside: filling, reacting, emptying, and cleaning is dead time — it's not making product 24/7.\n\n- **CSTR (Continuous Stirred-Tank Reactor) — the perfectly mixed tank.** Streams flow in and out continuously, and a vigorous stirrer keeps the inside *perfectly uniform*. Here's the defining, slightly shocking feature: because it's perfectly mixed, the *entire tank sits at the exit concentration* — the low, mostly-reacted concentration. Fresh feed is instantly diluted into the already-converted soup. Cheap, simple, great for liquids, and excellent at dumping heat — but, as we'll see, that low operating concentration is a kinetic handicap.\n\n- **PFR (Plug Flow Reactor) — the long pipe.** Fluid marches through a tube like a column of soldiers (\"plugs\"), with no mixing along the direction of flow. Concentration is *high* at the inlet and drops steadily to the exit — so each slice of fluid experiences the full range of concentrations as it travels. It behaves like a batch reactor where *distance down the pipe* plays the role of *time*. Compact, efficient, ideal for high throughput and gas-phase reactions.\n\nThe CSTR-vs-PFR distinction — uniform-low-concentration tank vs. high-to-low-concentration pipe — is the single most important comparison in the whole subject, and it's coming up after we meet conversion.",
    },
    {
      id: "rk_design_prose",
      kind: "PROSE",
      title: "Conversion and the design equations",
      markdown:
        "Before comparing reactors we need one more idea: **conversion**, written `X`. It's simply the fraction of the reactant that got used up:\n\n```\nX = (moles A in − moles A out) / moles A in\n```\n\nSo `X = 0` means nothing reacted; `X = 0.9` means 90% of the feed was consumed. Conversion is the currency of reactor design — \"size me a reactor for 95% conversion\" is the everyday request.\n\nEach reactor type has a **design equation** linking its size to the conversion it achieves, and you can read all three off the same balance: *(rate of change of reactant) = (flow terms) − (rate consumed by reaction)*. Conceptually:\n\n- **Batch:** the reaction time to reach conversion `X` is the integral of `dX/(−rate)` — you wait until enough has reacted. Bigger `k`, shorter wait.\n- **CSTR:** the required volume is `V = (feed flow · X) / (−rate at exit conditions)`. The sting is in those last four words: the rate is evaluated at the *exit* (low) concentration, because that's the concentration everywhere in a perfectly mixed tank. Low concentration → low rate → you need a *big* tank.\n- **PFR:** the required volume is the *integral* `V = ∫ (feed flow) dX / (−rate)` from 0 to `X`. Because concentration starts high and falls, the rate is high over much of the pipe, so the integral — the volume — stays small.\n\nYou don't need to evaluate these integrals by hand here. The crucial takeaway is *where each reactor evaluates the rate*: the CSTR is stuck at the worst-case (lowest) concentration, while the PFR gets to enjoy high concentrations along most of its length. Hold that thought.",
    },
    {
      id: "rk_pfrvscstr_prose",
      kind: "PROSE",
      title: "Why the skinny pipe usually wins 🏆",
      markdown:
        "Now the showdown interviewers adore: **same conversion, which reactor needs less volume — CSTR or PFR?** For a normal reaction (positive order, rate rises with concentration), the answer is the **PFR**, and here's the picture that proves it without any calculus.\n\nImagine the reaction rate plotted against conversion. As conversion climbs, reactant gets used up, concentration falls, and the rate *drops*. Now:\n\n- The **CSTR** runs the *entire* reaction at the *final*, lowest rate — the value at the exit conversion. It's like driving the whole trip at your slowest speed. Its required volume is a big rectangle: the whole conversion times that single, sluggish exit rate.\n- The **PFR** runs through *every* rate from the fast inlet down to the slow exit. Its volume is the *area under the curve* — and because the rate is high for most of the journey, that area is smaller. It's like driving fast at the start and only slowing near the end.\n\nSo the PFR exploits the high concentrations the CSTR throws away by instant dilution. For the same conversion, the PFR is **more compact** — sometimes dramatically so at high conversions, where the CSTR's exit rate is crawling and its required volume balloons. This is why pipelines, crackers, and most high-throughput continuous processes are tubular.\n\nThe honest caveat (and a great interview flex): the CSTR isn't always the loser. For **autocatalytic** reactions (where a product speeds the reaction, so rate is *low* at the start) the CSTR can win by jumping straight to a high-rate state. And the CSTR's perfect mixing makes it superb at controlling temperature for **strongly exothermic, runaway-prone** reactions — sometimes safety beats compactness. Knowing *when the rule breaks* is what separates a memorizer from an engineer.",
    },
    {
      id: "rk_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: time a first-order reaction, then read its conversion ⏱️",
      problem:
        "A liquid-phase reaction A → products is first order with rate constant k = 0.0231 1/s. (a) What is its half-life? (b) In a batch reactor, what fraction of A has been converted after exactly two half-lives? (c) If instead you want 90% conversion (X = 0.90), roughly how long must the batch run? Use ln for the first-order time relation, ln([A]₀/[A]) = k·t.",
      steps: [
        {
          label: "(a) Half-life from the rate constant",
          markdown:
            "Straight from the formula:\n\n```\nt₁/₂ = ln(2) / k = 0.693 / 0.0231 ≈ 30 s\n```\n\nSo every 30 seconds, half of whatever A remains disappears. (This matches the sandbox default exactly.)",
        },
        {
          label: "(b) Conversion after two half-lives",
          markdown:
            "Half-lives chain by repeated halving, independent of the starting amount:\n\n```\nAfter 1 half-life:  100% → 50% remains\nAfter 2 half-lives: 50%  → 25% remains\n```\n\nIf 25% of A remains, then **75% has been converted** → `X = 0.75`. Notice we never needed the actual concentration — the constant-halving structure handed us the answer. Two half-lives is 2 × 30 = 60 s.",
        },
        {
          label: "(c) Time to reach 90% conversion",
          markdown:
            "At `X = 0.90`, the fraction remaining is `[A]/[A]₀ = 1 − 0.90 = 0.10`. Use the first-order time relation:\n\n```\nln([A]₀ / [A]) = k · t\nln(1 / 0.10)   = k · t\nln(10) = 2.303 = 0.0231 · t\nt = 2.303 / 0.0231 ≈ 100 s\n```\n\nQuick sanity check via half-lives: 90% conversion means ~10% remaining, which is a bit past three half-lives (3 × 30 = 90 s gets you to 12.5% remaining). 100 s sits just beyond that — perfectly consistent. ✅",
        },
      ],
      answer:
        "(a) t₁/₂ = ln(2)/k ≈ 30 s. (b) After two half-lives, 25% remains, so X = 0.75 (achieved in 60 s) — and we never needed the starting concentration. (c) For 90% conversion, t = ln(10)/k ≈ 100 s, consistent with being just past three half-lives. First-order kinetics is all logs and halvings.",
    },
    {
      id: "rk_check_order",
      kind: "CHECK",
      question:
        "The balanced equation for a reaction is 2 NO + O₂ → 2 NO₂. What can you conclude about the reaction order with respect to NO?",
      choices: [
        { id: "c1", label: "It must be 2, because the coefficient of NO is 2" },
        { id: "c2", label: "It must be 1, because order is always 1 for gases" },
        { id: "c3", label: "You cannot tell from the balanced equation — order is determined experimentally from the rate law" },
        { id: "c4", label: "It must be 3, the sum of all the coefficients" },
      ],
      answerId: "c3",
      explanation:
        "You can't read order off a balanced equation. Reaction order is an *empirical* quantity, measured by observing how the rate changes when you vary concentrations in the lab. The stoichiometric coefficients (the 2, 1, 2 here) tell you the *ratios* in which species are consumed and produced — a mass-balance fact — not the *speed* dependence. Sometimes order happens to match a coefficient; very often it doesn't, because real reactions proceed through multi-step mechanisms whose slowest step sets the rate law. Treating the coefficient as the order is the most common kinetics blunder, and interviewers probe for it on purpose. (As it happens, this particular reaction *is* experimentally second order in NO — but you'd only know that from data, not from the equation.)",
    },
    {
      id: "rk_check_reactor",
      kind: "CHECK",
      question:
        "For a typical first-order liquid reaction, you need 95% conversion at a fixed feed rate. Comparing a single CSTR and a single PFR, which needs the smaller volume, and why?",
      choices: [
        { id: "r1", label: "The CSTR, because perfect mixing makes it more efficient" },
        { id: "r2", label: "The PFR, because it operates at high concentration over most of its length while the CSTR is stuck at the low exit concentration" },
        { id: "r3", label: "They need identical volumes — conversion alone fixes the size" },
        { id: "r4", label: "The CSTR, because pipes have too much friction" },
      ],
      answerId: "r2",
      explanation:
        "The PFR wins, and the reason is *where the rate gets evaluated*. A CSTR is perfectly mixed, so the entire tank sits at the exit (lowest) concentration — the reaction runs everywhere at its slowest rate, demanding a big volume. A PFR has a concentration gradient: high at the inlet, falling to the exit, so the rate is high over most of the pipe and the required volume (the area under the 1/rate curve) is smaller. The gap *widens* at high conversion like 95%, where the CSTR's exit rate is crawling and its volume balloons. This is exactly why high-throughput continuous processes are tubular. The honest exception, worth naming in an interview: autocatalytic reactions or runaway-prone exothermic ones can favor a CSTR.",
    },
    {
      id: "rk_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Reaction-engineering questions are designed to expose shallow memorization. The prompts and the answers that signal \"hire this person\":\n\n- **\"What's the order of this reaction?\"** Never read it off the stoichiometry. Say: \"Order is empirical — I'd determine it from rate-vs-concentration data\" (e.g., the method of initial rates). Refusing to confuse order with coefficients is an instant green flag.\n- **\"What happens if I raise the temperature 10 °C?\"** \"The rate constant rises exponentially via Arrhenius — roughly a doubling for many reactions, because T sits inside exp(−Eₐ/RT).\" Mention catalysts as the other way to attack k (by lowering Eₐ).\n- **\"How would you find k from data?\"** For first order, plot ln[A] vs. time — a straight line of slope −k — or just read a half-life and use k = ln(2)/t₁/₂.\n- **\"CSTR or PFR for the same volume?\"** PFR for a normal positive-order reaction, because the CSTR runs entirely at the low exit concentration. Then *immediately* name the exceptions (autocatalytic, exothermic/safety) — showing you know the rule's limits is the real differentiator.\n- **\"Batch vs. continuous?\"** Batch for low-volume, high-value, flexible production (pharma); continuous for high-throughput commodities. Mention batch's dead time (fill/clean) as the trade-off.",
    },
    {
      id: "rk_callout_pitfalls",
      kind: "CALLOUT",
      variant: "warning",
      title: "The traps that sink kinetics problems",
      markdown:
        "- **Order ≠ stoichiometry.** This is the big one. The coefficients in the balanced equation are mass-balance ratios, not rate exponents. Always get order from the *rate law* (measured), never from the equation.\n- **The units of k change with order.** First order: 1/s. Second order: L/(mol·s). Zero order: mol/(L·s). If someone hands you a `k` with no units, the order is ambiguous — and a half-life formula `ln(2)/k` only applies to *first* order. Check before you plug in.\n- **Use absolute temperature in Arrhenius.** `T` in `exp(−Eₐ/RT)` must be in kelvin, not Celsius. Plugging in °C (or worse, a temperature *difference*) silently wrecks the exponential.\n- **A catalyst changes kinetics, not thermodynamics.** It lowers Eₐ and speeds *both* forward and reverse rates equally, so it reaches equilibrium faster but never shifts *where* equilibrium lies. Don't claim a catalyst increases yield at equilibrium — it doesn't.\n- **\"Half-life independent of concentration\" is a first-order privilege only.** For second order, half-life depends on [A]₀ and lengthens as the reaction proceeds. Don't export the first-order intuition blindly.",
    },
    {
      id: "rk_callout_insight",
      kind: "CALLOUT",
      variant: "insight",
      title: "The same math runs your bloodstream and the cosmos",
      markdown:
        "First-order kinetics is one of nature's favorite patterns, so the `t₁/₂ = ln(2)/k` you just learned shows up *everywhere* outside chemistry. Radioactive decay is first order — that's the entire basis of carbon-14 and uranium-lead dating, reading the age of bones and rocks straight off a half-life. Most drugs clear your body first-order, which is why dosing schedules are quoted in half-lives (caffeine's is ~5 hours — do the math on that late-afternoon coffee). A discharging capacitor, a cooling object approaching room temperature (Newton's law of cooling), light absorbed through a medium (Beer's law), even the decay of a struck bell's loudness — all exponential, all governed by the same `exp(−kt)` skeleton. When you internalize first-order decay, you're not learning a chemistry formula; you're learning the shape of how *anything proportional to itself* fades away. The universe reuses good ideas.",
    },
    {
      id: "rk_wrap",
      kind: "PROSE",
      title: "From rate law to reactor, in one breath",
      markdown:
        "Here's the whole arc of reaction engineering compressed into a path you can walk in your sleep:\n\n1. **Find the rate law.** `rate = k·[A]ⁿ`. Get the order `n` from data, never from stoichiometry.\n2. **Understand k.** It's the temperature-and-catalyst knob, exploding exponentially with `T` via Arrhenius (`k = A·exp(−Eₐ/RT)`). A catalyst lowers `Eₐ` and speeds things up without touching equilibrium.\n3. **Time it.** For first order, the half-life `ln(2)/k` is independent of starting concentration — the radioactive-decay fingerprint — and `ln([A]₀/[A]) = kt` gets you any conversion.\n4. **Pick a vessel.** Batch (flexible pot), CSTR (cheap mixed tank, stuck at exit concentration), PFR (compact pipe, high-to-low concentration).\n5. **Size it via conversion.** The design equations all flow from a balance; the punchline is *where the rate is evaluated*, which is why the PFR usually beats the CSTR for the same volume — except for autocatalytic or runaway-prone reactions, where you flex by naming the exception.\n\nKinetics tells you how fast; reactor design turns that speed into product. Master both and you've got the engine room of every chemical plant on Earth. Now go make some molecules race. ⚗️",
    },
  ],
  keyTakeaways: [
    "The rate law rate = k·[A]ⁿ has two characters: k (the intrinsic speed, set by temperature and catalyst) and n (the order, measuring how sensitively rate responds to concentration).",
    "Reaction order is EMPIRICAL — measured from rate-vs-concentration data — and is NOT the stoichiometric coefficient. Confusing the two is the classic kinetics mistake.",
    "The Arrhenius equation k = A·exp(−Eₐ/RT) makes k climb exponentially with temperature (~10 °C often doubles the rate); a catalyst speeds things up by lowering Eₐ without changing equilibrium.",
    "A first-order half-life is t₁/₂ = ln(2)/k — gloriously independent of starting concentration, the same constant-halving fingerprint as radioactive decay.",
    "The three ideal reactors: batch (flexible pot, has dead time), CSTR (perfectly mixed, the whole tank sits at the low exit concentration), and PFR (a pipe with high-to-low concentration, like batch with distance playing the role of time).",
    "For a normal positive-order reaction at the same volume, a PFR beats a CSTR for conversion, because the CSTR is stuck running at the slow exit rate while the PFR enjoys high concentrations along most of its length.",
    "The CSTR isn't always the loser: it can win for autocatalytic reactions and for strongly exothermic, runaway-prone ones where its mixing gives superior temperature control.",
  ],
};
