import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_waterchem",
  slug: "water-chemistry",
  title: "Water Chemistry: pH, Alkalinity, and Why a Lake Won't Flinch",
  summary:
    "Spit a drop of lemon juice into a glass of water and the pH barely twitches. Spit it into a lake and absolutely nothing happens. That stubbornness has a name — buffering — and it's the difference between a thriving ecosystem and a dead one. This lesson builds pH from the logarithm up (so the 'each unit is 10×' fact finally clicks), then layers on alkalinity, the carbonate system, hardness, and dissolved oxygen until water chemistry stops feeling like memorization and starts feeling like a story.",
  discipline: "ENVIRONMENTAL",
  difficulty: "MEDIUM",
  estMinutes: 22,
  tags: ["water-chemistry", "ph", "alkalinity"],
  objectives: [
    "Compute pH from [H⁺] using pH = −log10[H⁺], and reason fluently about what a logarithmic scale means.",
    "Explain why each whole pH unit is a 10× change in hydrogen-ion concentration — and predict the effect of a 10× concentration change.",
    "Distinguish acids from bases and connect pH to the pOH and the water self-ionization constant Kw.",
    "Explain alkalinity and buffering via the carbonate system — why natural waters resist pH change.",
    "Relate hardness and dissolved oxygen to water quality, and explain why pH matters for aquatic life and treatment.",
  ],
  prerequisites: [
    "Basic chemistry (ions, concentration in mol/L)",
    "Logarithms (what log10 means)",
    "Chemical equilibrium at a conceptual level",
  ],
  interviewAngle:
    "Water chemistry is bread-and-butter for environmental and civil/water-resources interviews. Expect to compute pH from [H⁺] (and back), explain the logarithmic scale crisply (each unit = 10×), and — the question that separates candidates — explain the difference between pH and alkalinity. Strong candidates explain alkalinity as buffering *capacity* (not the same as pH), describe the carbonate system as the reason natural waters resist pH swings, and connect pH/DO/hardness to real consequences for aquatic life, corrosion, and treatment chemistry. Knowing pH + pOH = 14 and being able to reason about a 10× concentration change cold is table stakes.",
  blocks: [
    {
      id: "b_hook",
      kind: "PROSE",
      title: "The number that runs water 💧",
      markdown:
        "Try a thought experiment. You squeeze a whole lemon into a tall glass of pure water. The pH plunges — that water gets noticeably more acidic. Now you pour that same lemon juice into a healthy lake. The pH? Doesn't budge. Not a flicker.\n\nSame acid, wildly different responses. What's protecting the lake?\n\nThe answer is a single, quietly heroic property of natural water called **buffering**, and it's tied to a number you've probably memorized but maybe never *felt*: **pH**. Most people can recite \"pH 7 is neutral,\" but freeze when asked *why* the scale is logarithmic, *how much* stronger pH 4 is than pH 5, or *why a lake shrugs off acid that would wreck a glass of distilled water*.\n\nBy the end of this lesson you'll own all three. You'll build pH from the logarithm up until the math feels obvious, then layer on alkalinity, the carbonate system, hardness, and dissolved oxygen — the toolkit behind every drinking-water plant, fish tank, and pool on Earth. Let's dive in.",
    },
    {
      id: "v_intro",
      kind: "VIDEO",
      youtubeId: "k-x-PCP3gug",
      title: "Watch: pH vs. Total Alkalinity",
      channel: "Orenda",
    },
    {
      id: "b_logscale",
      kind: "PROSE",
      title: "pH is a logarithm in a trench coat 📉",
      markdown:
        "Water is sneaky: even pure water is constantly splitting itself apart, H₂O ⇌ H⁺ + OH⁻. The concentration of those hydrogen ions, written **[H⁺]** in mol/L, is what we actually care about — it's the \"acidity.\" But [H⁺] in real water ranges from about 1 mol/L (battery acid) down to 0.00000000000001 mol/L (drain cleaner). That's **fourteen orders of magnitude**. Nobody wants to write that many zeros.\n\nSo a Danish chemist named Søren Sørensen had a brilliant lazy idea in 1909: take the negative base-10 logarithm and compress that monstrous range into a tidy 0–14 scale.\n\n> pH = −log10[H⁺]\n\nThe minus sign is just there to make the numbers come out positive and friendly (since [H⁺] is a small fraction, its log is negative). That's the whole trick.\n\nHere's the consequence that *must* live in your bones: because it's a base-10 log, **every single pH unit is a factor of 10 in [H⁺].** Going from pH 7 to pH 6 means the water is **10× more acidic** — ten times more hydrogen ions. From pH 7 to pH 5 is **100×**. From pH 7 to pH 4 is **1000×**. The scale *looks* gentle and linear, but it's hiding an exponential cliff. This is why a pH drop of \"just two units\" in a stream from acid rain is an ecological emergency, not a rounding error.",
    },
    {
      id: "p_tentimes",
      kind: "PREDICT",
      question:
        "A water sample at pH 8 is contaminated and drops to pH 5. How much more concentrated are its hydrogen ions [H⁺] now?",
      options: [
        { id: "a", label: "About 3× more — the pH dropped by 3." },
        { id: "b", label: "About 30× more — 3 units times roughly 10." },
        { id: "c", label: "About 1000× more — 3 units, each a factor of 10 (10³)." },
      ],
      answerId: "c",
      reveal:
        "Each pH unit is a power of 10, so a drop of 3 units means [H⁺] rose by 10³ = **1000×**. The pH number changing by a measly 3 hides a thousand-fold surge in acidity. This is the single most counterintuitive thing about pH and the most common interview trip-wire: people instinctively treat the scale as linear. It isn't. Tattoo \"each unit = 10×\" on your brain.",
    },
    {
      id: "b_acidbase",
      kind: "PROSE",
      title: "Acids, bases, and the seesaw at 7 ⚖️",
      markdown:
        "Pure water at 25°C self-ionizes just enough that [H⁺] = [OH⁻] = 1×10⁻⁷ mol/L. Plug that in: pH = −log10(10⁻⁷) = **7**. That's why **7 is neutral** — it's not magic, it's just where hydrogen and hydroxide ions exactly balance.\n\n- **Add an acid** (it donates H⁺) → [H⁺] goes *up* → pH goes *down* (below 7). Think lemon juice (~2), vinegar (~3), acid rain (~4).\n- **Add a base** (it accepts H⁺, raising OH⁻) → [H⁺] goes *down* → pH goes *up* (above 7). Think baking soda (~8.3), ammonia (~11), lye (~13).\n\nThere's a beautiful conservation law hiding here. The product [H⁺]·[OH⁻] is *always* the same constant at a given temperature, called the **water dissociation constant**:\n\n> Kw = [H⁺]·[OH⁻] = 1.0×10⁻¹⁴  (at 25°C)\n\nTake −log10 of both sides and it collapses into the cleanest relationship in water chemistry:\n\n> pH + pOH = 14\n\nSo if you know the pH is 9, the pOH is instantly 5 — no calculator needed. (Footnote for the careful: Kw drifts with temperature, so \"neutral\" pH is slightly below 7 in hot water. Mention that and interviewers smile.)",
    },
    {
      id: "f_ph",
      kind: "FORMULA",
      title: "The pH definition",
      display: "pH = −log10[H⁺]",
      latex: "\\text{pH} = -\\log_{10}[\\text{H}^{+}]",
      variables: [
        { symbol: "pH", name: "potential of hydrogen (dimensionless)", unit: "—" },
        { symbol: "[H⁺]", name: "hydrogen-ion (hydronium) concentration", unit: "mol/L" },
      ],
      note:
        "Companions worth memorizing: pOH = −log10[OH⁻]; Kw = [H⁺]·[OH⁻] = 1.0×10⁻¹⁴ at 25°C; and therefore pH + pOH = 14. To go backwards from pH to concentration, invert: [H⁺] = 10^(−pH). So pH 6 means [H⁺] = 10⁻⁶ mol/L. The whole scale is just powers of ten dressed up as small whole numbers.",
    },
    {
      id: "s_ph",
      kind: "SANDBOX",
      title: "Play: turn concentration into pH 🎛️",
      description:
        "Drag the hydrogen-ion concentration and watch pH respond. With the default [H⁺] = 1×10⁻⁴ mol/L you'll read pH = 4.00 — acidic, roughly the territory of acid rain or a tomato. Now watch the magic of logs: push [H⁺] up by a factor of 10 (to 1×10⁻³) and pH drops by exactly *one* unit to 3.00. Multiply concentration by 10, subtract 1 from pH. Every. Single. Time. Try to *feel* how a huge multiplicative change in [H⁺] becomes a tiny additive change in pH.",
      variables: [
        { key: "H", label: "Hydrogen-ion conc [H⁺]", unit: "mol/L", min: 1e-10, max: 0.01, step: 1e-10, default: 1e-4 },
      ],
      expression: "-log10(H)",
      outputLabel: "pH",
      outputUnit: "",
      precision: 2,
    },
    {
      id: "c_default",
      kind: "CALLOUT",
      variant: "insight",
      title: "Where pH 4.00 comes from",
      markdown:
        "pH = −log10[H⁺] = −log10(1×10⁻⁴) = −(−4) = **4.00**. The exponent on the 10 *is* the negative of the pH — that's the entire shortcut for clean powers of ten. So [H⁺] = 10⁻⁴ → pH 4, [H⁺] = 10⁻⁷ → pH 7, [H⁺] = 10⁻⁹ → pH 9. And bump [H⁺] from 10⁻⁴ to 10⁻³ (10× more acidic) and pH slides from 4.00 to 3.00 — a one-unit drop for a ten-fold concentration jump. The log is doing all the heavy lifting.",
    },
    {
      id: "p_buffer",
      kind: "PREDICT",
      question:
        "You add the same small dose of strong acid to (1) a glass of distilled water and (2) a glass of hard, mineral-rich lake water. Which one's pH drops more?",
      options: [
        { id: "a", label: "The distilled water — it has no alkalinity to neutralize the acid, so its pH plunges." },
        { id: "b", label: "The lake water — minerals make it more reactive, so acid hits it harder." },
        { id: "c", label: "Both drop by the same amount — the acid dose was identical." },
      ],
      answerId: "a",
      reveal:
        "Distilled water is defenseless: it has almost no **alkalinity** (buffering capacity), so the added H⁺ goes straight into solution and the pH craters. The lake water is loaded with bicarbonate (HCO₃⁻) from dissolved minerals, which *consumes* the incoming H⁺ (HCO₃⁻ + H⁺ → H₂CO₃) and barely lets the pH move. Same acid, totally different outcome — because alkalinity, not pH, decides how much abuse the water can absorb. That's the lemon-in-the-lake mystery solved.",
    },
    {
      id: "b_alkalinity",
      kind: "PROSE",
      title: "Alkalinity: the shock absorber (and it's NOT pH) 🛡️",
      markdown:
        "Here is the distinction that wins interviews and confuses everyone else: **pH and alkalinity are not the same thing.**\n\n- **pH** tells you the *current* acidity — how many free H⁺ ions are present *right now*. It's a snapshot, an intensity.\n- **Alkalinity** tells you the water's *capacity* to neutralize acid without its pH changing much. It's the size of the shock absorber, a reserve. Two waters can sit at the exact same pH 8 while one has ten times the alkalinity — and that one will laugh off an acid dose the other can't.\n\nThe workhorse behind natural alkalinity is the **carbonate buffer system**, a three-way equilibrium driven by CO₂ from the air and from dissolved limestone:\n\n> CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ ⇌ 2H⁺ + CO₃²⁻\n\nThe genius is the middle player, **bicarbonate (HCO₃⁻)**. It's an opportunist that works both directions:\n\n- **Add acid (H⁺)?** Bicarbonate gobbles it: HCO₃⁻ + H⁺ → H₂CO₃. The free H⁺ disappears, pH holds.\n- **Add base (OH⁻)?** Bicarbonate donates an H⁺ to neutralize it: HCO₃⁻ + OH⁻ → CO₃²⁻ + H₂O. pH holds again.\n\nBecause the reservoir absorbs blows from *both* sides, a well-buffered water clings to its pH like a dog with a bone. This is why oceans (saturated with bicarbonate from eons of dissolved rock and shell) hold near pH 8.1 — and, sobering corollary, why ocean acidification from rising CO₂ is alarming despite being only a few tenths of a pH unit: it's slowly *spending down* the buffer that protects every shell-building creature in the sea.",
    },
    {
      id: "b_hardness_do",
      kind: "PROSE",
      title: "Hardness, dissolved oxygen, and why fish care 🐟",
      markdown:
        "Two more quality knobs round out the picture, and both tie back to pH.\n\n**Hardness** is the concentration of multivalent metal ions in water — mostly **calcium (Ca²⁺) and magnesium (Mg²⁺)** leached from limestone and dolomite. Hard water is the stuff that leaves white scale in your kettle and refuses to lather soap. Crucially, hardness and alkalinity often travel together (both come from dissolved carbonate rock), so hard waters tend to be well-buffered — but they're *distinct* properties: hardness counts metal cations, alkalinity counts acid-neutralizing anions like HCO₃⁻. Don't conflate them.\n\n**Dissolved oxygen (DO)** is the amount of O₂ gas dissolved in the water — the thing fish actually breathe. It's measured in mg/L, and the headline fact is that **cold water holds far more oxygen than warm water** (gas solubility falls as temperature rises). That's why a warm, stagnant summer pond can suffocate fish while a cold mountain stream teems with trout. DO also gets devoured by decomposing organic pollution — the basis of the **BOD** (biochemical oxygen demand) test — so when sewage or fertilizer runoff floods a lake, microbes bloom, strip the oxygen, and you get a fish kill or a dead zone.\n\n**Why pH ties it all together:** aquatic life is fussy. Most freshwater fish thrive in a narrow band around pH 6.5–8.5; push outside it and gills get damaged and reproduction fails. pH also flips the *toxicity* of other species — low pH dissolves aluminum out of soils into a form lethal to fish, and pH shifts the deadly ammonia (NH₃)/ammonium (NH₄⁺) balance. And in treatment plants, pH governs nearly everything: coagulation, chlorine disinfection efficiency, and corrosion control (get the pH wrong and you leach lead from old pipes — the lesson of Flint). pH is the master dial of water quality.",
    },
    {
      id: "we_ph",
      kind: "WORKED_EXAMPLE",
      title: "The full move: compute pH and reason about a 10× change",
      problem:
        "A water sample is measured to have a hydrogen-ion concentration [H⁺] = 2.5×10⁻⁶ mol/L at 25°C. (a) Find the pH and classify the water as acidic, neutral, or basic. (b) Find the pOH and [OH⁻]. (c) An upstream discharge then raises [H⁺] by a factor of 10. What is the new pH, and how should you describe the change in acidity? This is the classic environmental-chemistry warm-up.",
      steps: [
        {
          label: "Compute the pH",
          markdown:
            "pH = −log10[H⁺] = −log10(2.5×10⁻⁶).\n\nSplit it: log10(2.5×10⁻⁶) = log10(2.5) + log10(10⁻⁶) = 0.40 + (−6) = −5.60.\n\nSo pH = −(−5.60) = **5.60**.",
        },
        {
          label: "Classify it",
          markdown:
            "5.60 is below 7, so the water is **acidic** — roughly the pH of black coffee or a stressed, acid-rain-affected stream. Already borderline for sensitive fish.",
        },
        {
          label: "Find pOH and [OH⁻]",
          markdown:
            "pH + pOH = 14, so pOH = 14 − 5.60 = **8.40**. Then [OH⁻] = 10^(−pOH) = 10⁻⁸·⁴ ≈ **4.0×10⁻⁹ mol/L**. Sanity check: [H⁺]·[OH⁻] = 2.5×10⁻⁶ × 4.0×10⁻⁹ = 1.0×10⁻¹⁴ = Kw. ✓",
        },
        {
          label: "Apply the 10× jump",
          markdown:
            "Multiplying [H⁺] by 10 means adding 1 to its exponent's magnitude, which *subtracts* exactly 1 from the pH. So the new pH = 5.60 − 1 = **4.60**.",
        },
        {
          label: "Describe the change honestly",
          markdown:
            "The pH number only fell by 1 unit (5.60 → 4.60), which sounds trivial — but it means the water is now **10× more acidic** than before. That one-unit slide is a tenfold surge in free H⁺, enough to cross from \"stressful\" into \"lethal for many fish and amphibian eggs.\" Never let the small pH number fool you about the size of the chemical change.",
        },
      ],
      answer:
        "pH = 5.60 (acidic); pOH = 8.40 with [OH⁻] ≈ 4.0×10⁻⁹ mol/L. After [H⁺] rises 10×, pH = 4.60 — a one-unit drop that represents a tenfold increase in acidity.",
    },
    {
      id: "c_tip",
      kind: "CALLOUT",
      variant: "tip",
      title: "Two reflexes that make pH problems trivial 🎯",
      markdown:
        "Build these into muscle memory and most water-chem questions become arithmetic:\n\n- **Powers of ten are free.** If [H⁺] is a clean power of ten, the pH is just the exponent's magnitude: [H⁺] = 10⁻⁵ → pH 5. To go backward, [H⁺] = 10^(−pH).\n- **The split trick for messy numbers.** For [H⁺] = a×10⁻ⁿ, use pH = n − log10(a). Memorize log10(2) ≈ 0.30, log10(3) ≈ 0.48, log10(5) ≈ 0.70 and you can estimate almost any pH in your head. Example: [H⁺] = 5×10⁻⁹ → pH ≈ 9 − 0.70 = 8.30.\n\nAnd the framing reflex: a change of *n* pH units is always a 10ⁿ change in [H⁺]. State that out loud when the number moves.",
    },
    {
      id: "c_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "In the interview: what they're really fishing for 🎯",
      markdown:
        "The killer question is almost always \"what's the difference between pH and alkalinity?\" Here's the layered answer they want:\n\n1. **pH** = the *current* acidity, [H⁺] right now, on a logarithmic scale (each unit = 10×). Write pH = −log10[H⁺] without hesitating.\n2. **Alkalinity** = the *capacity* to neutralize acid without the pH moving — the buffer reserve, mostly bicarbonate. Two waters at the same pH can have wildly different alkalinity.\n3. **The mechanism** = the carbonate system (CO₂/H₂CO₃/HCO₃⁻/CO₃²⁻); bicarbonate eats added H⁺ *and* added OH⁻, which is why natural waters resist pH change. This is the lemon-in-the-lake story.\n4. **The consequence** = why it matters: aquatic life lives in a narrow pH band, treatment chemistry (coagulation, disinfection, corrosion control) is pH-driven, and ocean acidification is the slow draining of the carbonate buffer.\n\nLand those four and you've shown you understand the chemistry, not just the definitions. Bonus: mention pH + pOH = 14 and that Kw shifts with temperature.",
    },
    {
      id: "ck_logscale",
      kind: "CHECK",
      question:
        "Solution A has pH 3 and solution B has pH 6. How do their hydrogen-ion concentrations compare?",
      choices: [
        { id: "a", label: "A has twice the [H⁺] of B (6 ÷ 3 = 2)." },
        { id: "b", label: "A has 3× the [H⁺] of B (6 − 3 = 3)." },
        { id: "c", label: "A has 1000× the [H⁺] of B (3 units, each ×10, so 10³)." },
        { id: "d", label: "B has more [H⁺] than A, since 6 > 3." },
      ],
      answerId: "c",
      explanation:
        "Lower pH means *more* H⁺, and each pH unit is a factor of 10. A is 3 units below B, so [H⁺]_A = 10³ × [H⁺]_B = **1000× higher**. Quick check with the formula: [H⁺]_A = 10⁻³ and [H⁺]_B = 10⁻⁶, and 10⁻³/10⁻⁶ = 10³ = 1000. The logarithmic scale is the entire point — never treat it as linear.",
    },
    {
      id: "ck_alkalinity",
      kind: "CHECK",
      question:
        "Why does a well-buffered natural lake resist changes in pH when acid rain falls on it?",
      choices: [
        { id: "a", label: "Its pH is already so low that more acid can't change it." },
        { id: "b", label: "It has high alkalinity — bicarbonate (HCO₃⁻) neutralizes incoming H⁺, keeping pH stable." },
        { id: "c", label: "Dissolved oxygen reacts with the acid and removes it." },
        { id: "d", label: "High pH automatically means high alkalinity, so the two are the same thing." },
      ],
      answerId: "b",
      explanation:
        "Buffering comes from alkalinity, supplied mainly by bicarbonate in the carbonate system: HCO₃⁻ + H⁺ → H₂CO₃ consumes the added acid before it can free up H⁺, so pH barely moves. (DO doesn't neutralize acid, and pH and alkalinity are distinct — a low-alkalinity lake at the same pH would acidify fast, which is exactly why granite-bedrock lakes are most vulnerable to acid rain.)",
    },
  ],
  keyTakeaways: [
    "pH = −log10[H⁺] compresses a 14-order-of-magnitude range of hydrogen-ion concentration into a 0–14 scale; invert it with [H⁺] = 10^(−pH).",
    "The scale is logarithmic: each whole pH unit is a 10× change in [H⁺]. A drop of n units is a 10ⁿ-fold rise in acidity — a 'small' pH change can be enormous.",
    "Neutral pH 7 is where [H⁺] = [OH⁻] = 10⁻⁷; acids lower pH, bases raise it, and Kw = [H⁺]·[OH⁻] = 10⁻¹⁴ at 25°C gives pH + pOH = 14.",
    "pH and alkalinity are different: pH is the current acidity, alkalinity is the capacity to neutralize acid without the pH moving (the buffer reserve).",
    "The carbonate system (CO₂/H₂CO₃/HCO₃⁻/CO₃²⁻) is the buffer; bicarbonate absorbs both added acid and added base, which is why natural waters resist pH change.",
    "Hardness (Ca²⁺/Mg²⁺) and dissolved oxygen (higher in cold water, consumed by organic pollution via BOD) round out water quality; hardness often tracks alkalinity but is a distinct property.",
    "pH is the master dial for aquatic life (most fish need ~6.5–8.5), pollutant toxicity, and treatment chemistry (coagulation, disinfection, corrosion control); the default sandbox case [H⁺] = 10⁻⁴ gives pH 4.00.",
  ],
};
