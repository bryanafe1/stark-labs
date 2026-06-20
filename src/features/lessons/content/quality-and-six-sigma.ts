import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_sixsigma",
  slug: "quality-and-six-sigma",
  title: "Quality and Six Sigma",
  summary:
    "Two factories make the same part. One inspects every unit and tosses the duds. The other almost never inspects — and ships fewer defects, faster, and cheaper. What does the second one know? It knows that quality isn't something you catch at the end; it's something you build into the process by hammering down variation. This lesson is about the math of that idea: control charts that tell signal from noise, capability indices (Cp, Cpk) that score how well your process fits its spec, what \"six sigma\" literally means (a stingy 3.4 defects per million), and the DMAIC loop that ties it together. Master it and you'll never look at a wobbly process the same way again.",
  discipline: "INDUSTRIAL",
  difficulty: "MEDIUM",
  estMinutes: 23,
  tags: ["six-sigma", "quality", "process-capability"],
  objectives: [
    "Explain why variation — not the occasional bad unit — is the real enemy of quality, and why reducing variation beats inspecting it out.",
    "Distinguish common-cause from special-cause variation and describe how a control chart tells them apart.",
    "Compute process capability Cp = (USL − LSL)/(6σ) and Cpk, and explain why Cpk ≤ Cp whenever the process is off-center.",
    "State what \"six sigma\" means as a quality target (≈ 3.4 defects per million opportunities) and why the 1.5σ shift convention exists.",
    "Walk through the DMAIC improvement cycle (Define, Measure, Analyze, Improve, Control) and say what each phase delivers.",
    "Judge whether a process is capable from its Cp/Cpk and recommend the right fix (center it vs. tighten it).",
  ],
  prerequisites: [
    "Mean and standard deviation (σ) — what they measure, not how to derive them",
    "Basic algebra and ratios",
    "A rough feel for the bell curve (most data near the middle, tails thin out)",
  ],
  interviewAngle:
    "Quality and Six Sigma show up in operations, manufacturing, supply-chain, and even product/analytics interviews because they reveal whether a candidate thinks in distributions instead of anecdotes. The expected fluency: define Cp = (USL − LSL)/(6σ) as \"how many process-widths fit inside the spec window\" and Cpk as the same idea but penalized for being off-center — then nail the punchline that Cpk ≤ Cp always, with equality only when the process is perfectly centered. The strong candidate also (1) explains \"six sigma\" as a capability target where the spec is six standard deviations from the mean on each side, yielding ≈ 3.4 DPMO under the conventional 1.5σ long-term shift, (2) separates common-cause (the process's natural noise — leave it alone) from special-cause variation (an assignable, fixable signal) and knows that overreacting to common-cause noise (\"tampering\") makes things worse, and (3) argues that reducing variation upstream is cheaper and more reliable than inspecting defects out downstream. Expect a \"compute Cp and Cpk and tell me if this process is capable\" drill, a \"the chart looks noisy — do you act?\" judgment call, and a \"how would you actually improve it?\" follow-up where DMAIC and centering-vs-tightening reasoning win.",
  blocks: [
    {
      id: "ss_intro",
      kind: "PROSE",
      title: "The factory that stopped inspecting 🔍",
      markdown:
        "Picture two factories stamping out the same metal bracket. Factory A is proud of its quality team: every single bracket gets measured, and anything out of spec gets pulled and scrapped. Factory B barely inspects at all — and yet *its* customers get fewer bad brackets, it scraps less metal, and it ships faster and cheaper. How?\n\nFactory B figured out the single most important idea in modern quality: **you cannot inspect quality into a product.** Inspection just sorts good from bad *after* you've already spent the money making both. Real quality comes from making the process so consistent that bad parts almost never happen in the first place. And consistency has a precise mathematical meaning — *low variation.*\n\nThat's the whole game. Every customer complaint, every warranty claim, every \"why is this batch different from the last one?\" traces back to **variation**: the spread in your output. A part that's always 0.2 mm too big is annoying but predictable — you can adjust for it. A part that's randomly anywhere from 2 mm too small to 2 mm too big is a nightmare, because you can't trust *any* of them.\n\nSo the rest of this lesson is really one question asked four ways: *how much does your process vary, is that little enough to meet the spec, is the variation random noise or a fixable signal, and how do you systematically shrink it?* The tools — control charts, capability indices, the \"six sigma\" target, and the DMAIC loop — are all just ways of getting a grip on variation. Let's grab it.",
    },
    {
      id: "ss_video",
      kind: "VIDEO",
      youtubeId: "hWoQf9w4Ryc",
      title: "Watch: What Is Cp and Cpk?",
      caption:
        "A quick, visual walk through the two capability indices this lesson revolves around. Watch it now — once you can *see* the process bell curve sitting (or not sitting) inside the spec window, Cp and Cpk stop being formulas and become a picture you can read at a glance.",
    },
    {
      id: "ss_variation",
      kind: "PROSE",
      title: "Variation is the enemy 🎯",
      markdown:
        "Here's a thought experiment quality engineers love. Two archers each fire ten arrows. Archer 1's arrows are scattered all over the target — a couple bullseyes, but also wild misses. Archer 2's arrows land in a tight little cluster... three inches to the left of center. **Who's the better archer?**\n\nArcher 2, easily — and it's not close. Archer 2 has a *precise* process; the cluster is just *biased*. Fixing bias is trivial: nudge the sight three inches right and every arrow hits home. Archer 1 has the harder problem by far: there's no single adjustment that fixes random scatter. You can't aim your way out of inconsistency.\n\nThis maps directly onto manufacturing, and it splits quality into two separate dimensions:\n\n- **Accuracy (centering)** — is the process *average* on target? This is the easy one. If your bolts run consistently 0.1 mm too long, retune the machine and you're done.\n- **Precision (variation)** — how *tightly* clustered is the output around its own average? Measured by the standard deviation **σ**. This is the hard one, the one that takes real engineering to improve.\n\nThe entire Six Sigma philosophy bets on this: **a centered-but-sloppy process is worse than a slightly-off-but-tight one**, because tightness is the expensive, valuable thing. Reducing σ — shrinking the scatter — is the work. And to know whether your σ is small *enough*, you compare it to what the customer will tolerate. That comparison has a name, and it's coming up. But first, a question that trips up most managers: when your process *does* wobble, how do you know whether to leave it alone or chase the cause?",
    },
    {
      id: "ss_spc",
      kind: "PROSE",
      title: "Control charts: telling signal from noise 📉",
      markdown:
        "Every process wobbles. The million-dollar skill is knowing *which* wobbles mean something. Walter Shewhart cracked this in the 1920s with the **control chart**, the heart of **Statistical Process Control (SPC)**, by splitting variation into two fundamentally different species:\n\n- **Common-cause variation** — the natural, ever-present, random noise baked into a stable process: tiny fluctuations in temperature, material, vibration, operator. It's *predictable* in aggregate (it produces a steady bell curve) even though any single value is random. A process showing only common-cause variation is said to be **in control** — and the correct response is to **leave it alone.**\n- **Special-cause variation** — an *assignable*, unusual signal: a tool wears out, a new material lot arrives, someone changes a setting. It shows up as a point or pattern that the normal noise can't explain. This is a process **out of control**, and the correct response is to **investigate and fix the cause.**\n\nA control chart plots your measurements over time with a centerline (the process mean) and **control limits**, conventionally drawn at **±3σ** from the mean. Points inside the limits, scattered randomly? Common cause — don't touch it. A point *outside* ±3σ, or a suspicious run (say, eight points all above the centerline)? That's a special cause shouting for attention.\n\nWhy the precise rule? Because of the **two ways to be wrong**:\n\n- **Tampering** — reacting to common-cause noise as if it were a signal. You \"correct\" random wobble, which actually *injects* variation and makes the process worse. (Deming's famous funnel experiment shows adjusting after every shot doubles the spread.)\n- **Missing a real shift** — ignoring genuine special-cause variation until you're shipping scrap.\n\nThe ±3σ limits are the referee: tight enough to catch real signals, loose enough that you don't chase ghosts. **Control limits are the voice of the process; specification limits are the voice of the customer — never confuse the two.** Which brings us to capability.",
    },
    {
      id: "ss_formula",
      kind: "FORMULA",
      title: "Process capability: Cp and Cpk",
      display: "Cp = (USL − LSL) / (6σ)     Cpk = min( (USL − µ)/(3σ), (µ − LSL)/(3σ) )",
      variables: [
        { symbol: "Cp", name: "Process capability (potential) — spec width vs. process spread", unit: "" },
        { symbol: "Cpk", name: "Process capability index (actual) — Cp penalized for off-center mean", unit: "" },
        { symbol: "USL", name: "Upper specification limit (set by the customer)", unit: "" },
        { symbol: "LSL", name: "Lower specification limit (set by the customer)", unit: "" },
        { symbol: "µ", name: "Process mean (where the output is actually centered)", unit: "" },
        { symbol: "σ", name: "Process standard deviation (the spread / variation)", unit: "" },
      ],
      note:
        "Read Cp as a ratio of two widths: the spec window (USL − LSL) divided by the natural process width (6σ, since ±3σ covers ~99.73% of a normal process). Cp > 1 means the process *could* fit inside the spec; it ignores where the process sits. Cpk fixes that blind spot by measuring distance from the mean to the *nearest* spec limit in units of 3σ — so an off-center process scores lower. Crucially, Cpk ≤ Cp always, with equality only when µ sits dead-center between USL and LSL. Common bars: Cpk ≥ 1.33 is \"capable\", Cpk ≥ 1.67 is \"six-sigma-ish\".",
    },
    {
      id: "ss_intuition",
      kind: "PROSE",
      title: "The bell curve in a doorway 🚪",
      markdown:
        "Here's the picture that makes everything click. Imagine your process output as a **bell curve**, and the spec limits (LSL and USL) as the two sides of a **doorway**. Capability is just asking: *does the bell curve fit through the door — and is it walking through the middle?*\n\n- **Cp is the width test.** The natural width of a process is about **6σ** (three standard deviations on each side of the mean covers 99.73% of normal output). Cp = (spec width) / (6σ) = how many process-widths fit inside the doorway. `Cp = 1` means the curve *just barely* fits — the tails kiss the door frame, ~0.27% leak out. `Cp = 2` means the door is twice as wide as the curve — luxurious room to spare. **But Cp doesn't care where the curve is.** A process could have a fantastic Cp = 2 and still be slamming half its output into the left wall, because Cp pretends the curve is centered.\n\n- **Cpk is the reality test.** It measures the distance from the curve's actual center (µ) to the *nearest* wall, in units of 3σ. If you're shoved up against the right wall, the right gap is small, and Cpk reports *that* tight gap — the one that's actually leaking defects. That's why **Cpk ≤ Cp**: Cp scores your *potential* (if you centered it), Cpk scores your *current reality*. They're equal only when you're perfectly centered, and the gap between them is a direct measure of how *off-center* you are.\n\nThe practical upshot is a clean diagnostic: **if Cp is high but Cpk is low, your variation is fine — you're just off-center, so re-center the process (easy).** If *both* are low, the curve is too fat for the door — you must reduce σ (hard engineering work). Two numbers, and they tell you exactly which of the two problems you have.",
    },
    {
      id: "ss_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the capability machine 🎛️",
      description:
        "Drag the spec limits and the process spread and watch Cp respond. Cp = (USL − LSL) / (6σ): the spec window divided by the process's natural ±3σ width. The defaults (USL = 110, LSL = 90, σ = 2) give a spec window of 20 against a 6σ width of 12 → Cp = 1.67, a healthy, near-six-sigma-capable process. Now shrink the spec window (tighten the customer's demand) or crank σ (sloppier process) and watch Cp collapse below 1 — the bell curve no longer fits through the door. Then drop σ toward 0.5 and watch Cp soar: tighter process, tons of room to spare. This is the *width* test only — it assumes perfect centering, which is exactly Cp's blind spot.",
      variables: [
        { key: "USL", label: "Upper spec limit", unit: "", min: 50, max: 200, step: 1, default: 110 },
        { key: "LSL", label: "Lower spec limit", unit: "", min: 0, max: 150, step: 1, default: 90 },
        { key: "sigma", label: "Process std dev σ", unit: "", min: 0.5, max: 10, step: 0.1, default: 2 },
      ],
      expression: "(USL - LSL) / (6 * sigma)",
      outputLabel: "Process capability Cp",
      outputUnit: "",
      precision: 2,
    },
    {
      id: "ss_predict_offcenter",
      kind: "PREDICT",
      question:
        "A process has a beautiful Cp = 2.0 — its bell curve is half as wide as the spec window, with tons of room to spare. But the process has drifted: its mean is no longer centered, sitting right up near the upper spec limit. What happens to Cpk compared to Cp?",
      options: [
        { id: "a", label: "Cpk = Cp = 2.0 — capability depends on spread, and the spread hasn't changed" },
        { id: "b", label: "Cpk > Cp — being near a spec limit improves the index" },
        { id: "c", label: "Cpk < Cp — the off-center mean shrinks the gap to the nearest wall, dragging Cpk down" },
        { id: "d", label: "Cpk becomes undefined whenever the mean isn't centered" },
      ],
      answerId: "c",
      reveal:
        "**Cpk < Cp.** This is the entire reason Cpk exists. Cp = (USL − LSL)/(6σ) only sees the *width* of the curve versus the door — it assumes you're centered. Cpk measures the distance from your *actual* mean to the **nearest** wall, in units of 3σ. Drift the mean toward the upper limit and that upper gap shrinks; Cpk reports that small gap and plummets, even though σ (and therefore Cp) never moved.\n\nThe takeaway is a free diagnosis: **a big gap between Cp and Cpk means your process is off-center, not too variable.** That's the *good* problem to have — re-centering a machine is far cheaper than reducing its variation. If instead Cp itself were low, you'd be stuck doing the hard work of shrinking σ. Cpk ≤ Cp always, and the size of the gap is literally a centering gauge.",
    },
    {
      id: "ss_predict_inspect",
      kind: "PREDICT",
      question:
        "A plant ships too many defects. Manager A wants to hire more inspectors to catch every bad unit before it leaves. Manager B wants to spend the same money studying the process to reduce its variation (σ). A year later, which plant most likely ships fewer defects at lower cost?",
      options: [
        { id: "a", label: "Manager A — more inspection means more defects caught, so fewer escape" },
        { id: "b", label: "Manager B — reducing variation prevents defects instead of catching them, which is cheaper and more reliable" },
        { id: "c", label: "Identical — both spend the same money, so they get the same result" },
        { id: "d", label: "Manager A — variation can't really be reduced, only sorted" },
      ],
      answerId: "b",
      reveal:
        "**Manager B wins**, and it's the founding insight of the whole discipline: *you cannot inspect quality into a product.* Inspection (Manager A) is 100% rework and waste — you pay to make bad parts, then pay again to find and scrap them, and inspection is never perfect, so some defects escape anyway. Worse, you've spent real money producing scrap.\n\nManager B attacks the **source**. A lower σ means the bell curve pulls in away from both spec walls, so defects simply stop being produced — fewer leaks, less scrap, *and* you can eventually inspect less. Prevention beats detection on cost, speed, and reliability all at once. \"Build quality in, don't inspect it in\" isn't a slogan; it's the economic core of Six Sigma. Inspection is a tax on a process you haven't fixed yet.",
    },
    {
      id: "ss_sixsigma_meaning",
      kind: "PROSE",
      title: "What \"six sigma\" literally means 📏",
      markdown:
        "The name finally pays off. **\"Six sigma\" is a capability target: the spec limits sit a full six standard deviations away from the process mean on each side.** If your process is centered and σ is small enough that USL and LSL are each 6σ out, the bell curve is so skinny relative to the doorway that defects become vanishingly rare. In a perfectly centered process, ±6σ corresponds to about **2 defects per *billion*** — absurdly good.\n\nBut you've probably heard the famous figure **3.4 DPMO** (defects per million opportunities), which is way worse than 2-per-billion. Where's the discrepancy? The **1.5σ shift.** Real processes don't stay perfectly centered forever — over the long run, the mean drifts by roughly 1.5σ due to tool wear, shift changes, material lots, and the like. Six Sigma practitioners *bake this drift in* as a conservative convention: they assume the mean wanders 1.5σ off-center, which leaves the nearest spec limit only **4.5σ** away. The area beyond 4.5σ on a normal curve is about **3.4 in a million** — hence the headline number.\n\nSo the sigma levels people quote are really *defect rates with the 1.5σ shift assumed*:\n\n- **3σ** process → ~66,800 DPMO (about 93.3% good — surprisingly poor!)\n- **4σ** → ~6,210 DPMO (~99.4%)\n- **5σ** → ~233 DPMO (~99.977%)\n- **6σ** → ~3.4 DPMO (~99.99966%)\n\nThe jump from 3σ to 6σ isn't \"twice as good\" — it's roughly **20,000× fewer defects.** That gap is exactly why \"three sigma is fine\" is a dangerous trap: for a product with hundreds of components, 99.3% good per part compounds into a coin-flip chance the whole thing fails. Six Sigma chases the tiny tails precisely because they multiply.",
    },
    {
      id: "ss_dmaic",
      kind: "PROSE",
      title: "DMAIC: the improvement engine 🔧",
      markdown:
        "Knowing your Cpk is diagnosis; **DMAIC** is the treatment. It's Six Sigma's disciplined, repeatable problem-solving cycle, and it exists to stop teams from leaping to solutions before they understand the problem. Five phases:\n\n- **D — Define.** Pin down the problem, the customer requirement (the spec!), the scope, and the goal. *What does \"defect\" even mean here, and what would success look like?* A vague problem statement dooms everything downstream.\n- **M — Measure.** Quantify the current state. Collect data, validate the measurement system itself (can you even trust your gauges?), and establish the baseline — typically the current Cp/Cpk and defect rate. You can't improve what you haven't measured.\n- **A — Analyze.** Find the *root cause* of the variation. Use data — Pareto charts (the vital few causes vs. the trivial many), fishbone diagrams, hypothesis tests — to separate the real drivers from the suspects. Resist the urge to guess.\n- **I — Improve.** *Now* change something, and verify with data that the change actually moved Cpk. Pilot it, confirm it works, then roll it out.\n- **C — Control.** Lock in the gain so the process doesn't quietly slide back. This is where **control charts return**: you monitor the improved process to catch any special-cause drift and sustain the new baseline. (DMAIC ends where SPC begins — the loop closes.)\n\nThe discipline is the point. The most common failure mode in process improvement is jumping straight from a hunch to a \"fix\" — skipping Measure and Analyze, \"improving\" the wrong thing, and declaring victory with no data. DMAIC forces you to *earn* the Improve step. Notice it's also a loop: once Controlled, the next-biggest problem becomes the new Define. Continuous improvement, by construction.",
    },
    {
      id: "ss_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: is this bottling line capable? 🍾📊",
      problem:
        "A line fills bottles. The label promises 500 mL, and the customer spec is LSL = 495 mL, USL = 505 mL. A sample shows the fill process has mean µ = 502 mL and standard deviation σ = 1 mL. (a) Compute Cp. (b) Compute Cpk. (c) Is the process capable (use the common bar Cpk ≥ 1.33)? (d) What single change would most improve capability, and what would the new Cpk be?",
      steps: [
        {
          label: "(a) Compute Cp — the width test",
          markdown:
            "Cp compares the spec window to the natural 6σ process width:\n\n```\nCp = (USL − LSL) / (6σ) = (505 − 495) / (6 × 1) = 10 / 6 = 1.67\n```\n\nA Cp of **1.67** is excellent — the bell curve is only 6 mL wide (±3σ) sitting in a 10 mL spec window, with plenty of room. *If* it were centered, this would be a near-six-sigma process. But Cp doesn't know where the curve actually sits. So we're not done.",
        },
        {
          label: "(b) Compute Cpk — the reality test",
          markdown:
            "Cpk measures the distance from the actual mean (µ = 502) to the *nearest* spec wall, in units of 3σ. Compute both gaps and take the smaller:\n\n```\nUpper gap: (USL − µ) / (3σ) = (505 − 502) / (3 × 1) = 3 / 3 = 1.00\nLower gap: (µ − LSL) / (3σ) = (502 − 495) / (3 × 1) = 7 / 3 = 2.33\nCpk = min(1.00, 2.33) = 1.00\n```\n\nCpk = **1.00**. Notice Cpk (1.00) is well below Cp (1.67) — the telltale sign of an **off-center** process. The mean sits 2 mL above target, crowding the upper limit, so the upper gap is the binding one.",
        },
        {
          label: "(c) Is it capable?",
          markdown:
            "Against the standard bar **Cpk ≥ 1.33**, this process at Cpk = 1.00 is **not capable** — it's right on the edge, leaking defects out the top. A Cpk of exactly 1.00 means the nearest spec limit is only 3σ away, so roughly 0.13% of bottles overfill past 505 mL (and over the long run, with drift, worse). Despite the gorgeous Cp, the line is failing the customer.",
        },
        {
          label: "(d) The fix: center it",
          markdown:
            "Because Cp (1.67) is already great, the problem is *not* variation — it's centering. The cheapest, highest-leverage fix is to **re-center the fill to the spec midpoint**, µ = 500 mL (just dial the filler down 2 mL). With a centered mean, Cpk rises to meet Cp:\n\n```\nCentered Cpk = min((505 − 500)/3, (500 − 495)/3) = min(5/3, 5/3) = 1.67\n```\n\nA trivial adjustment — no new equipment, no variation reduction — vaults Cpk from 1.00 to **1.67**, clearing the 1.33 bar with margin. *That* is the power of reading Cp and Cpk together: they told us the fix was a knob-turn, not a re-engineering project.",
        },
      ],
      answer:
        "(a) Cp = (505 − 495)/(6×1) = 1.67. (b) Cpk = min((505−502)/3, (502−495)/3) = min(1.00, 2.33) = 1.00. (c) Not capable — Cpk = 1.00 < 1.33, and the big Cp-vs-Cpk gap flags an off-center process. (d) Re-center µ to 500 mL; with no change in σ, Cpk jumps to 1.67. Variation was fine all along — it was purely a centering problem.",
    },
    {
      id: "ss_check_cpk",
      kind: "CHECK",
      question:
        "Two processes both have Cp = 1.5. Process X has Cpk = 1.5; Process Y has Cpk = 0.8. What does this tell you about the difference between them?",
      choices: [
        { id: "c1", label: "Process Y has more variation (larger σ) than Process X" },
        { id: "c2", label: "Process X is perfectly centered; Process Y is significantly off-center" },
        { id: "c3", label: "Process Y is better, because a lower Cpk means tighter control" },
        { id: "c4", label: "Nothing — Cp and Cpk measure unrelated things" },
      ],
      answerId: "c2",
      explanation:
        "**Process X is centered; Process Y is off-center.** Equal Cp (1.5) means both have the *same spread* relative to the spec window — identical σ and identical spec limits. So variation is NOT the difference (ruling out the first choice). The difference is centering: Cpk = Cp only when the mean sits dead-center, so X (Cpk = Cp = 1.5) is perfectly centered, while Y (Cpk = 0.8 < 1.5) has drifted toward a spec limit. The Cp − Cpk gap *is* the centering gauge. Practically, Y has the easy problem: re-center it and its Cpk climbs back up to 1.5 with no variation reduction needed.",
    },
    {
      id: "ss_check_spc",
      kind: "CHECK",
      question:
        "An operator watches a control chart of a stable, in-control process. Every time a point lands a bit above the centerline, she nudges the machine down; every time one lands below, she nudges it up — chasing the natural random wobble. What happens to the process variation?",
      choices: [
        { id: "s1", label: "It decreases — actively correcting deviations tightens the output" },
        { id: "s2", label: "It stays the same — her adjustments cancel out on average" },
        { id: "s3", label: "It increases — she's tampering, reacting to common-cause noise and injecting variation" },
        { id: "s4", label: "It decreases at first, then the process stabilizes at a lower σ" },
      ],
      answerId: "s3",
      explanation:
        "Variation **increases** — this is **tampering**, the classic SPC sin (Deming's funnel experiment shows it can roughly double the spread). The points bouncing around the centerline are pure *common-cause* noise: random, expected, and signal-free. By \"correcting\" each random wobble, she adds her adjustment on top of the next random wobble, compounding the scatter instead of removing it. The whole point of control limits is to tell you when *not* to act: a stable, in-control process should be **left alone**. You only intervene on genuine special-cause signals (a point beyond ±3σ or a non-random pattern). Reacting to noise as if it were signal makes everything worse.",
    },
    {
      id: "ss_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Operations, manufacturing, and supply-chain interviews probe whether you think in distributions. The prompts and the answers that land:\n\n- **\"Compute Cp and Cpk for this process and tell me if it's capable.\"** Cp = (USL − LSL)/(6σ); Cpk = min((USL − µ)/3σ, (µ − LSL)/3σ). Compare Cpk to the bar (≥ 1.33 capable, ≥ 1.67 excellent). The pro move: when Cp ≫ Cpk, *immediately* say \"the process is off-center — re-centering is the cheap fix\" rather than reaching for variation reduction.\n- **\"What does Cpk ≤ Cp tell you?\"** Cp is potential capability (assumes centering); Cpk is actual (penalizes off-center). They're equal only when µ is dead-center, and the gap measures how off-center you are.\n- **\"What does 'six sigma' actually mean?\"** Spec limits 6σ from the mean → with the conventional 1.5σ long-term drift, ≈ 3.4 DPMO. Mention the 1.5σ shift to show depth.\n- **\"The chart looks noisy — do you adjust the machine?\"** Only if it's a *special* cause (point beyond ±3σ or a non-random run). Reacting to common-cause noise is tampering and makes it worse. Control limits = voice of the process; spec limits = voice of the customer.\n- **\"How would you improve it?\"** Walk DMAIC and stress prevention over inspection: reduce variation at the source rather than catching defects downstream.",
    },
    {
      id: "ss_callout_inspection",
      kind: "CALLOUT",
      variant: "insight",
      title: "Quality is built in, not inspected in",
      markdown:
        "The single most expensive misconception in operations is that quality comes from *catching* defects. It doesn't — inspection is pure waste: you pay to make a bad part, pay again to find it, pay a third time to scrap or rework it, and inspection still misses some. It treats the symptom while the disease (a variable process) keeps generating defects. The Six Sigma move is to shrink σ so the bell curve pulls away from both spec walls and defects stop being *produced* in the first place. Cheaper, faster, more reliable — and as capability rises you can actually inspect *less*. The same logic scales beyond factories: catching bugs in QA is inspection; writing tests and types that prevent them is building quality in. Prevention beats detection every single time.",
    },
    {
      id: "ss_wrap",
      kind: "PROSE",
      title: "The variation lens 🔬",
      markdown:
        "Strip away the jargon and Six Sigma is one idea wearing four hats: **get a grip on variation.**\n\n1. **Variation is the enemy.** A tight-but-off-center process beats a centered-but-sloppy one, because tightness (low σ) is the hard, valuable thing. Center is a knob; spread is engineering.\n2. **Control charts** separate common-cause noise (leave it alone) from special-cause signals (fix them). Don't tamper; don't miss real shifts. Control limits are the voice of the process, spec limits the voice of the customer.\n3. **Cp and Cpk** score the process against the spec. Cp is the width test (potential); Cpk adds the centering test (reality); Cpk ≤ Cp always, and the gap tells you whether to re-center (easy) or reduce σ (hard).\n4. **\"Six sigma\"** is the target — spec 6σ out, ≈ 3.4 DPMO with the 1.5σ shift — and **DMAIC** is the disciplined engine that gets you there, closing the loop back into control charts.\n\nOnce you own this lens you'll see variation everywhere: the coffee that's great on Tuesday and burnt on Friday, the commute that takes 20 minutes or 50, the feature that ships clean or buggy depending on who's on call. All of it is σ. Go find a wobbly process — and tighten it. 🎯",
    },
  ],
  keyTakeaways: [
    "Quality is about reducing variation, not catching defects: you cannot inspect quality into a product, so prevention (smaller σ) beats detection (inspection) on cost, speed, and reliability.",
    "Control charts split variation into common-cause (natural noise — leave it alone) and special-cause (an assignable signal — investigate), with ±3σ limits as the referee; reacting to noise is 'tampering' and makes variation worse.",
    "Cp = (USL − LSL)/(6σ) is the width test (potential capability, assumes centering); Cpk = min((USL − µ)/3σ, (µ − LSL)/3σ) adds the centering test (actual capability).",
    "Cpk ≤ Cp always, with equality only when the process is perfectly centered — so a large Cp − Cpk gap means the process is off-center (cheap to fix by re-centering), while a low Cp means too much variation (hard to fix).",
    "'Six sigma' means the spec limits sit 6σ from the mean; with the conventional 1.5σ long-term drift this yields ≈ 3.4 defects per million opportunities — roughly 20,000× better than a 3σ process.",
    "DMAIC (Define, Measure, Analyze, Improve, Control) is the disciplined improvement cycle that forces you to understand and measure a problem before changing it, and it loops back into control charts to lock in gains.",
    "Common capability bars: Cpk ≥ 1.33 is 'capable', Cpk ≥ 1.67 is near-six-sigma; always read Cp and Cpk together to decide whether to re-center the process or reduce its spread.",
  ],
};
