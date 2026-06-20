import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_probstats",
  slug: "probability-and-statistics",
  title: "Probability and Statistics: Taming Uncertainty with the Bell Curve",
  summary:
    "Test scores, manufacturing tolerances, A/B test results, the height of everyone in a room — astonishingly often they pile up into the same humped shape: the normal distribution. You will learn why averages of almost anything turn out bell-shaped (the central limit theorem), how the 68-95-99.7 rule lets you eyeball probabilities, and how a single number — the z-score — tells you how unusual any value is. Then you will translate that into the language of percentiles, p-values, and hypothesis tests so you can say not just what happened, but how surprised you should be.",
  discipline: "INDUSTRIAL",
  difficulty: "MEDIUM",
  estMinutes: 23,
  tags: ["probability", "statistics", "normal-distribution"],
  objectives: [
    "Define probability and random variables, and distinguish a population from a sample.",
    "Describe the normal distribution and apply the 68-95-99.7 rule to estimate probabilities.",
    "Compute and interpret the mean, variance, and standard deviation as center and spread.",
    "Calculate a z-score with z = (x − μ)/σ and explain what standardization accomplishes.",
    "Explain the central limit theorem and why averages tend to be normally distributed.",
    "Interpret hypothesis tests and p-values conceptually as a measure of surprise under a null hypothesis.",
  ],
  prerequisites: [
    "Basic algebra and substituting numbers into a formula",
    "Comfort with fractions, decimals, and percentages",
    "Familiarity with the arithmetic mean (average)",
  ],
  interviewAngle:
    "Probability and statistics show up in industrial-engineering, data, quality, and quantitative interviews because they test whether you can reason about variation and surprise rather than just crunch a formula. Interviewers love to ask you to interpret a z-score, eyeball a probability with the 68-95-99.7 rule, or explain what a p-value really means (and what it does *not* mean). Strong candidates connect the standard deviation to spread, translate a z-score into a percentile, invoke the central limit theorem to explain why a sample average is approximately normal, and state a hypothesis test cleanly — null vs alternative, the p-value as the probability of data this extreme *if the null were true*, and rejecting at a chosen significance level. Weak candidates recite definitions but stumble when asked \"is this value unusual?\" or fall into the classic trap of calling the p-value \"the probability the null is true.\" The whole topic rewards intuition about uncertainty.",
  blocks: [
    {
      id: "ps-hook",
      kind: "PROSE",
      title: "Why the same curve keeps showing up everywhere",
      markdown:
        "Line up the heights of a thousand random adults and plot them. Most cluster near the middle, with fewer and fewer people as you head toward very short or very tall. Now do the same for SAT scores, the weights of cereal boxes off a production line, measurement errors in a lab, or the daily number of customers at a café. You keep drawing the *same shape*: a symmetric hump that tapers off on both sides. The famous **bell curve** — the normal distribution.\n\nThis is almost spooky. Why should test scores and cereal boxes and lab errors all agree on one curve? The answer is one of the most beautiful results in all of math, the **central limit theorem**, and we will get there. But first, the payoff: once you know something is bell-shaped, you can answer questions like \"how unusual is *this* value?\" or \"what fraction of cases fall above 90?\" with a single, portable number.\n\nThat number is the **z-score**, and it is the workhorse of this whole lesson. It strips away the units — degrees, dollars, points, whatever — and answers one clean question: *how many standard deviations from the average is this?* Master that question and you can compare an SAT score to a blood-pressure reading to a factory defect rate on the same scale. Let's build the intuition from the ground up.",
    },
    {
      id: "ps-video",
      kind: "VIDEO",
      youtubeId: "Tpwi4nHP5u4",
      title: "Watch: What Is a Z-Score?",
    },
    {
      id: "ps-basics",
      kind: "PROSE",
      title: "Probability, random variables, and the language of chance",
      markdown:
        "**Probability** is just a number between 0 and 1 measuring how likely something is: 0 means impossible, 1 means certain, 0.5 is a coin flip. It is the math of uncertainty — a way to be precise about things we cannot predict exactly.\n\nA **random variable** is a quantity whose value is left to chance — the roll of a die, tomorrow's temperature, the weight of the next cereal box. We do not know any single outcome in advance, but we *can* describe the pattern of outcomes over many trials. That pattern is a **distribution**: it tells you which values are common and which are rare.\n\nTwo more words you must keep straight, because interviewers prod at them:\n\n- A **population** is the entire group you care about — *every* adult in a country, *every* box the factory will ever make. Its true average is written **μ** (mu) and its true spread **σ** (sigma).\n- A **sample** is the smaller batch you actually measure — 500 adults, 30 boxes. From it you compute *estimates* of μ and σ.\n\nWe almost never get to measure a whole population, so statistics is largely the art of inferring population truths (μ, σ) from a limited sample — and honestly reporting how uncertain that inference is. Keep the Greek letters (population) versus their sample estimates separate and you will avoid half the confusion in the field.",
    },
    {
      id: "ps-center-spread",
      kind: "PROSE",
      title: "Center and spread: mean, variance, standard deviation",
      markdown:
        "Any distribution can be summarized by two ideas: where it sits and how wide it is.\n\n**Center — the mean (μ).** The familiar average: add up the values and divide by how many there are. It marks the balance point of the distribution. For a symmetric bell curve, it sits right under the peak.\n\n**Spread — variance and standard deviation.** Two distributions can share a mean but look totally different: scores tightly clustered around 70 versus scores scattered from 30 to 100. **Variance (σ²)** captures that scatter — it is the *average of the squared distances from the mean*. We square the distances so that values above and below do not cancel out, and so big deviations count extra.\n\nThe squaring leaves variance in awkward *squared* units (points², kg²), so we take the square root to get the **standard deviation (σ)** — back in the original units, and the single most useful measure of spread there is. A small σ means values huddle near the mean; a large σ means they sprawl.\n\nWhy does σ matter so much? Because for a normal distribution, σ is the natural *ruler*. \"This value is 12 points above average\" means nothing until you know whether σ is 4 (so 12 is a huge, rare gap) or 40 (so 12 is barely a nudge). Standard deviation gives you the yardstick — and the z-score, coming next, is literally how many of those yardsticks away you are.",
    },
    {
      id: "ps-normal",
      kind: "PROSE",
      title: "The normal distribution and the 68-95-99.7 rule",
      markdown:
        "The **normal distribution** is the symmetric bell curve, fully described by just two numbers: its mean μ (where the peak sits) and its standard deviation σ (how wide it is). Change μ and the whole curve slides left or right; change σ and it gets taller-and-narrower or shorter-and-wider, but the shape stays the same.\n\nThe magic is that the *area* under the curve always splits up the same way, no matter the μ and σ. This is the **68-95-99.7 rule** (the \"empirical rule\"):\n\n- About **68%** of all values fall within **±1σ** of the mean.\n- About **95%** fall within **±2σ**.\n- About **99.7%** fall within **±3σ**.\n\nSo if adult IQ is normal with μ = 100 and σ = 15, then about 68% of people score between 85 and 115, about 95% between 70 and 130, and a whopping 99.7% between 55 and 145. A score beyond 3σ (above 145 or below 55) happens to only about 0.3% of people — genuinely rare.\n\nThis rule is your back-of-the-envelope superpower. You can estimate probabilities *in your head* without ever opening a table: a value 2σ above the mean sits at about the 97.5th percentile (since 95% are in the middle ±2σ, half of the remaining 5% — that's 2.5% — is above it). Internalize the three numbers 68, 95, 99.7 and you can sanity-check almost any normal-distribution claim on sight.",
    },
    {
      id: "ps-formula-z",
      kind: "FORMULA",
      title: "The z-score: standardizing any value",
      display: "z = (x − μ) / σ",
      variables: [
        { symbol: "z", name: "Z-score (number of standard deviations from the mean)", unit: "σ" },
        { symbol: "x", name: "The raw value you are evaluating" },
        { symbol: "μ", name: "Population mean (the center)" },
        { symbol: "σ", name: "Population standard deviation (the spread)" },
      ],
      note:
        "Subtracting μ recenters the value so the mean becomes 0; dividing by σ rescales it so one standard deviation becomes 1 unit. The result is unit-free: z = 2 always means \"two standard deviations above average,\" whether x was a height, a price, or a test score. Negative z means below the mean. This single number lets you compare apples to oranges and look up probabilities in one universal table.",
    },
    {
      id: "ps-sandbox-z",
      kind: "SANDBOX",
      title: "Play: how unusual is this value?",
      description:
        "Pick a raw value x, a mean μ, and a standard deviation σ, and watch the z-score z = (x − μ)/σ. With the defaults (x = 85, μ = 70, σ = 10) you get z = 15/10 = 1.50 — the value sits one and a half standard deviations above average. Slide x past μ and z flips negative. Crucially, shrink σ and the *same* x suddenly looks far more extreme: a tight distribution makes every gap more surprising.",
      variables: [
        { key: "x", label: "Value x", unit: "", min: 0, max: 200, step: 1, default: 85 },
        { key: "mu", label: "Mean μ", unit: "", min: 0, max: 200, step: 1, default: 70 },
        { key: "sigma", label: "Std dev σ", unit: "", min: 1, max: 50, step: 1, default: 10 },
      ],
      expression: "(x - mu) / sigma",
      outputLabel: "Z-score",
      outputUnit: "σ",
      precision: 2,
    },
    {
      id: "ps-predict-sigma",
      kind: "PREDICT",
      question:
        "Two factories both aim for a mean bolt length of 50 mm. A bolt comes out at 52 mm. Factory A has σ = 0.5 mm; Factory B has σ = 2 mm. Where is that 52 mm bolt more alarming?",
      options: [
        { id: "a", label: "More alarming at Factory A — its tighter spread makes 52 mm a 4σ outlier." },
        { id: "b", label: "More alarming at Factory B — bigger σ always means bigger problems." },
        { id: "c", label: "Equally alarming — it's 2 mm off the target either way." },
        { id: "d", label: "Not alarming anywhere — 52 mm is close to 50 mm." },
      ],
      answerId: "a",
      reveal:
        "**Far more alarming at Factory A.** The raw deviation is the same 2 mm, but \"how unusual\" depends on σ. At Factory A, z = (52 − 50)/0.5 = **4** — beyond 3σ, this bolt is a genuine red flag (only ~0.006% of bolts should ever be that far out). At Factory B, z = (52 − 50)/2 = **1**, totally ordinary — about a third of bolts are at least that far from target. This is the whole point of the z-score: the same absolute gap means wildly different things depending on the spread. A tight process makes every deviation loud.",
    },
    {
      id: "ps-clt",
      kind: "PROSE",
      title: "The central limit theorem: why averages go normal",
      markdown:
        "Now the payoff promised at the start. The **central limit theorem (CLT)** says: if you take samples and compute their *averages*, those averages pile up into a normal distribution — *even if the thing you are sampling is not normal at all*.\n\nRoll a single fair die and the outcomes are flat: 1 through 6 are all equally likely, no bell curve in sight. But roll *ten* dice and average them, then do that thousands of times, and the histogram of those averages is a gorgeous bell. The lumps and skews of the original distribution wash out when you average; the extremes are rare and tend to cancel.\n\nTwo precise consequences, for samples of size *n* drawn from a population with mean μ and standard deviation σ:\n\n- The sample averages center on the same μ.\n- They spread *less* than individuals do — their standard deviation is **σ/√n**, the **standard error**. Quadruple your sample size and the spread of your average halves (because √4 = 2).\n\nThis is *why* the bell curve is everywhere: real-world quantities are often the sum or average of many small independent effects (height = many genes plus nutrition plus...; measurement error = many tiny disturbances). Sum or average enough little random pieces and the CLT delivers a normal distribution. It is also the foundation of inference: it lets us treat a sample average as approximately normal, attach a z-score to it, and reason about how far our estimate might be from the truth.",
    },
    {
      id: "ps-predict-clt",
      kind: "PREDICT",
      question:
        "You quadruple your sample size from n = 25 to n = 100 when estimating an average. What happens to the standard error (the spread of your sample-average estimate)?",
      options: [
        { id: "a", label: "It is cut to one quarter, matching the 4× increase in n." },
        { id: "b", label: "It is cut in half." },
        { id: "c", label: "It stays the same — sample size doesn't affect spread." },
        { id: "d", label: "It doubles, because more data means more variation." },
      ],
      answerId: "b",
      reveal:
        "**It is cut in half.** The standard error is σ/√n, so it shrinks with the *square root* of n, not n itself. Going from n = 25 to n = 100 multiplies n by 4, and √4 = 2, so the spread drops by a factor of 2. This square-root law is famous (and a little frustrating) in practice: to *halve* your uncertainty you need *four times* the data, and to cut it to a tenth you need a hundredfold. It is exactly why precise estimates get expensive — diminishing returns are baked into the math.",
    },
    {
      id: "ps-hypothesis",
      kind: "PROSE",
      title: "Hypothesis testing and p-values: measuring surprise",
      markdown:
        "Statistics earns its keep when it turns \"that looks weird\" into a defensible decision. The framework is **hypothesis testing**.\n\nYou start with a **null hypothesis (H₀)** — the boring default, \"nothing is going on\" (the new drug has no effect; the coin is fair; the process is on target). The **alternative hypothesis (H₁)** is the interesting claim (the drug works; the coin is biased). You then ask: *if the null were true, how surprising would my data be?*\n\nThat surprise is the **p-value**: the probability of observing data at least as extreme as what you got, *assuming H₀ is true*. A small p-value means \"this data would be very unlikely if nothing were going on,\" which is evidence against the null. By convention, if p falls below a chosen **significance level** (often α = 0.05), you **reject the null** and call the result *statistically significant*.\n\nNow the trap that snares almost everyone — and that interviewers adore: **the p-value is NOT the probability that the null hypothesis is true.** It is the probability of the *data* given the null, not the probability of the *null* given the data. A p-value of 0.03 does not mean \"3% chance there's no effect\"; it means \"if there really were no effect, data this extreme would happen only 3% of the time.\" Two more honest caveats: statistical significance is not the same as *practical importance* (a tiny, useless effect can be significant with enough data), and failing to reject H₀ is *not* proof it is true — absence of evidence is not evidence of absence. Used carefully, though, the p-value is a clean, quantified measure of how much your data should surprise a skeptic.",
    },
    {
      id: "ps-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: a z-score, a percentile, and a quick test",
      problem:
        "Adult resting heart rate is approximately normal with mean μ = 70 bpm and standard deviation σ = 10 bpm. (a) Your reading is 85 bpm — compute its z-score. (b) Roughly what percentile is that, and how unusual is it? (c) A wellness program claims it lowers resting heart rate. In a large sample, members average 67 bpm and a test yields p = 0.01. State what that means and the conclusion.",
      steps: [
        {
          label: "(a) Standardize the value",
          markdown:
            "Apply z = (x − μ)/σ with x = 85, μ = 70, σ = 10: `z = (85 − 70)/10 = 15/10 = 1.5`. Your heart rate is **1.5 standard deviations above average**.",
        },
        {
          label: "(b) Translate z into a percentile",
          markdown:
            "Use the 68-95-99.7 rule as a guide. At z = +1, you're at about the 84th percentile; at z = +2, about the 97.5th. So z = 1.5 lands in between — roughly the **93rd percentile** (the exact normal-table value is ~93.3%). Interpretation: about 93% of adults have a *lower* resting heart rate than you, so 85 bpm is on the high side but not alarmingly rare — it's within the everyday range, not a 3σ outlier.",
        },
        {
          label: "(c) Set up the hypothesis test",
          markdown:
            "**H₀:** the program has no effect (true mean stays 70 bpm). **H₁:** the program lowers it (mean < 70). The members' average of 67 bpm is the observed effect, and the test returns **p = 0.01**.",
        },
        {
          label: "(c) Interpret the p-value and conclude",
          markdown:
            "p = 0.01 means: *if the program truly did nothing*, we'd see a sample average this far below 70 only about 1% of the time. Since 0.01 < the usual α = 0.05, we **reject H₀** and call the drop statistically significant. Careful wording: this is *not* a 99% chance the program works, and a 3-bpm drop may or may not matter *medically* — significance is about surprise, not importance.",
        },
      ],
      answer:
        "(a) z = (85 − 70)/10 = 1.5. (b) About the 93rd percentile — higher than most, but not rare. (c) p = 0.01 means data this extreme would occur only 1% of the time if the program had no effect; since 0.01 < 0.05 we reject the null and call the reduction statistically significant (which is not the same as a 99% chance it works, nor a guarantee it matters in practice).",
    },
    {
      id: "ps-check-zscore",
      kind: "CHECK",
      question:
        "On an exam with mean μ = 75 and standard deviation σ = 8, Maria scores 91. What is her z-score, and roughly how does she stand?",
      choices: [
        { id: "a", label: "z = 2.0 — about the 97.5th percentile, clearly above most students." },
        { id: "b", label: "z = 16 — she scored 16 points above average." },
        { id: "c", label: "z = 0.5 — just slightly above average." },
        { id: "d", label: "z = −2.0 — she scored below average." },
      ],
      answerId: "a",
      explanation:
        "z = (x − μ)/σ = (91 − 75)/8 = 16/8 = **2.0**. By the 68-95-99.7 rule, 95% of scores lie within ±2σ, so only 5% lie outside; half of that (2.5%) is above +2σ, putting Maria at roughly the **97.5th percentile** — better than about 97-98% of test-takers. Option b confuses the raw 16-point gap with the standardized z, c miscomputes the division, and d gets the sign wrong (she scored *above* the mean, so z is positive).",
    },
    {
      id: "ps-check-pvalue",
      kind: "CHECK",
      question:
        "A study reports p = 0.03 for a new teaching method versus the standard one. Which interpretation is correct?",
      choices: [
        { id: "a", label: "There is a 3% probability that the new method has no real effect." },
        { id: "b", label: "If the methods truly performed equally, data this extreme would occur only about 3% of the time." },
        { id: "c", label: "The new method is 97% better than the standard one." },
        { id: "d", label: "There is a 97% chance the result will replicate next time." },
      ],
      answerId: "b",
      explanation:
        "A p-value is the probability of data at least this extreme *assuming the null hypothesis is true* — here, assuming the two methods are really equal. So p = 0.03 means such data would arise only ~3% of the time if there were no true difference, which is evidence against the null. Option a is the single most common misreading: the p-value is *not* the probability the null is true (it conditions on the null, not on the data). Option c confuses p with an effect size, and d invents a replication probability the p-value never claims.",
    },
    {
      id: "ps-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What interviewers actually want to hear",
      markdown:
        "Stats interviews reward *interpretation* over computation. Hit these and you stand out:\n\n- **Read a z-score out loud.** \"z = 2 means two standard deviations above the mean, about the 97.5th percentile.\" Translating to a percentile shows you understand the bell, not just the formula.\n- **Wield the 68-95-99.7 rule.** Estimate probabilities in your head when asked \"is this unusual?\" — it signals real fluency.\n- **Nail the p-value definition.** Say it precisely: \"the probability of data this extreme *if the null were true*.\" Then volunteer the trap — it is **not** the probability the null is true. Naming the misconception unprompted is a strong signal.\n- **Invoke the CLT correctly.** \"Sample averages are approximately normal regardless of the population shape, with standard error σ/√n.\" Mention the square-root law (4× data to halve uncertainty).\n- **Separate significance from importance.** A statistically significant effect can be practically trivial with enough data — saying this shows maturity.\n- **Keep population vs sample, μ/σ vs their estimates straight.** Sloppiness here is an easy red flag to avoid.",
    },
    {
      id: "ps-callout-warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "The traps that catch almost everyone",
      markdown:
        "Watch for these classic errors — they show up in interviews and in real analyses:\n\n- **The p-value is not P(null is true).** It is P(data this extreme | null true). Flipping the conditioning is the cardinal sin of statistics.\n- **Significant ≠ important.** With a huge sample, a meaningless effect can cross p < 0.05. Always ask about the *size* of the effect, not just its significance.\n- **Failing to reject ≠ proving the null.** Not finding evidence of an effect is not evidence there is none — you may just lack data.\n- **The empirical rule needs normality.** 68-95-99.7 applies to the *normal* distribution. For a heavily skewed distribution, those percentages are wrong (though the CLT may rescue you once you average).\n- **Standard error is not standard deviation.** σ describes spread of *individuals*; σ/√n describes spread of the *average*. Mixing them up over- or under-states your certainty dramatically.",
    },
    {
      id: "ps-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "One sentence to carry away",
      markdown:
        "The normal distribution shows up everywhere because averaging many small random effects forces a bell shape (the central limit theorem); once you have that bell, the z-score z = (x − μ)/σ tells you how many standard deviations — how *surprising* — any value is, the 68-95-99.7 rule turns that into a percentile in your head, and a p-value extends the same idea of surprise into deciding whether an effect is real. It is all one story: measure the spread, then measure how far out you are.",
    },
  ],
  keyTakeaways: [
    "Probability quantifies uncertainty from 0 to 1, a random variable is a chance-driven quantity, and statistics infers population truths (μ, σ) from a limited sample — keep population and sample distinct.",
    "The mean (μ) marks the center and the standard deviation (σ), the square root of variance, measures spread in the original units — σ is the natural ruler for how far a value sits from average.",
    "The normal distribution is fully described by μ and σ, and the 68-95-99.7 rule says about 68%, 95%, and 99.7% of values fall within ±1σ, ±2σ, and ±3σ — a fast way to estimate probabilities by hand.",
    "The z-score z = (x − μ)/σ standardizes any value into how many standard deviations it is from the mean, making it unit-free and comparable across different quantities and convertible to a percentile.",
    "The central limit theorem says averages of samples are approximately normal regardless of the underlying distribution, centered on μ with standard error σ/√n — which is why bell curves appear everywhere and why halving uncertainty needs 4× the data.",
    "Hypothesis testing compares a null (no effect) to an alternative; the p-value is the probability of data at least this extreme assuming the null is true, and you reject the null when p falls below the significance level α.",
    "A p-value is NOT the probability the null is true, statistical significance is not the same as practical importance, and failing to reject the null does not prove it — the common traps that careful reasoners avoid.",
  ],
};
