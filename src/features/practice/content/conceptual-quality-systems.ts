import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "quality_systems_common_special_cause",
    slug: "concept-quality-systems-common-vs-special-cause",
    title: "Reading a Shift on the Line",
    prompt: "You run an injection-molding line whose part weight has been stable on an X-bar and R chart for months. This morning the operator calls you over: the last point on the X-bar chart is sitting just above the upper control limit, and the three points before it were all on the high side of the center line.",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["quality-systems", "conceptual"],
    skillAreas: ["quality-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Is this common cause or special cause variation, and how do you decide? Walk through what you would actually do at the line before changing anything about the process.",
        rubric: "Should identify a point beyond the UCL plus a run on one side of the center line as signals of special (assignable) cause, not the inherent noise of common cause. Should explain that control limits come from the voice of the process (typically center +/- 3 sigma of the subgroup statistic), not from the spec. Should resist the temptation to tamper or re-center the machine before investigating; should go find the assignable cause (material lot, mold temperature, operator change, measurement drift) and document it. Should note common cause means leave the process alone and improve the whole system, while special cause means hunt the specific event. Key insight: control charts separate signal from noise so you act only on real change and avoid tampering, which would only add variation to a stable common-cause process.",
      },
      {
        prompt: "Now the constraints change. Suppose every individual point stays inside the control limits, but for the last 9 points in a row the chart hugs the high side of the center line. The operator says nothing is out of control, leave it. Do you agree? What does this pattern tell you that a single out-of-limit point does not?",
        rubric: "Should recognize that staying within limits does not mean in control: a run of 9 points on one side is a classic Western Electric / Nelson rule signaling a sustained shift in the mean. Should explain that runs rules detect small persistent shifts a single 3-sigma point would miss, trading a little more false-alarm risk for sensitivity. Should treat this as special cause and investigate a process drift, tool wear, or a new material lot. Should distinguish a shift in mean from a change in spread (R chart) and check both. Key insight: in-control means the absence of nonrandom patterns, not merely points inside the limits, so runs and trends are genuine special-cause signals even when no point breaches a limit.",
      },
    ],
  },
  {
    id: "quality_systems_cp_cpk",
    slug: "concept-quality-systems-cp-vs-cpk",
    title: "Capable on Paper, Failing in Practice",
    prompt: "A supplier sends a capability report for a shaft diameter with spec 10.00 +/- 0.10 mm. They proudly report Cp = 1.67, claiming a comfortably capable process. Your incoming inspection, however, keeps finding parts above the upper spec limit.",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["quality-systems", "conceptual"],
    skillAreas: ["quality-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "How can Cp look excellent while real parts fall out of spec? Explain the difference between Cp and Cpk and which one the supplier should have been reporting.",
        rubric: "Should define Cp = (USL - LSL) / (6 sigma), a measure of potential capability that only compares spread to tolerance width and ignores where the process is centered. Should define Cpk = min[(USL - mean)/(3 sigma), (mean - LSL)/(3 sigma)], which accounts for centering. Should explain that a tight (low sigma) but off-center process can have high Cp yet low Cpk, producing parts beyond one spec limit. Should conclude Cpk, or the pair Cp and Cpk together, is what matters for actual conformance, and that Cp much greater than Cpk reveals a centering problem rather than a spread problem. Key insight: Cp is the best the process could do if perfectly centered, while Cpk is what it actually does, so a large gap between them flags that the mean is shifted toward a spec limit.",
      },
      {
        prompt: "Now the constraints change. The supplier re-centers the process so the mean sits exactly at 10.00 mm and Cp now equals Cpk. Marketing wants to advertise this as a six sigma process. Before you accept that claim, what assumptions behind Cp and Cpk would you challenge, and why might a snapshot capability study still mislead you over a full production run?",
        rubric: "Should challenge the assumptions: capability indices assume the process is in statistical control and the data are approximately normal, and a short-term study captures only short-term (within-subgroup) variation. Should distinguish short-term capability (Cp, Cpk) from long-term performance (Pp, Ppk) and note the typical 1.5 sigma long-term mean shift assumed in six sigma accounting, so a momentary Cpk does not guarantee sustained low defect rates. Should note non-normal distributions make the implied ppm wrong, and that a centered snapshot can drift once tool wear, lot changes, or shifts resume. Should ask for a control chart over time, not a one-time sample. Key insight: a capability number is only meaningful if the process is stable and normal over time, so a single in-the-moment Cpk can overstate real long-run quality.",
      },
    ],
  },
  {
    id: "quality_systems_inspect_quality_in",
    slug: "concept-quality-systems-cannot-inspect-quality-in",
    title: "Adding Inspectors to Stop Escapes",
    prompt: "A plant ships a product with a stubborn defect rate. Management's response is to add a second and then a third end-of-line inspection station, reasoning that more eyes will catch more defects before they reach the customer. Months later the customer escape rate has barely improved and costs are up.",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["quality-systems", "conceptual"],
    skillAreas: ["quality-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the principle that you cannot inspect quality into a product. Why did adding inspection stations fail to fix the escape rate, and what does this say about where quality is actually created?",
        rubric: "Should explain that inspection is a downstream filter that detects defects after they are made but does not change the process that produces them, so the defect rate at the source is unchanged. Should note human (and even automated) inspection is imperfect, with typical detection effectiveness well below 100 percent, so escapes persist and adding stations gives diminishing returns. Should emphasize that quality is built in by controlling the process (prevention, robust design, mistake-proofing, capable processes) rather than sorted in at the end, and that appraisal cost rises without reducing internal/external failure root causes. Key insight: inspection sorts good from bad but never improves the underlying process, so real quality gains come from prevention at the source, not more end-of-line screening.",
      },
      {
        prompt: "Now the constraints change. The defect is safety-critical and a customer escape could be catastrophic, so you cannot simply remove the inspections tomorrow while you fix the root cause. How do you reconcile the cannot-inspect-quality-in principle with the short-term need for containment, and what is your sequence of moves?",
        rubric: "Should reconcile the two: inspection is a legitimate temporary containment to protect the customer while the real fix is developed, not a permanent solution. Should lay out a sequence: contain now (100 percent inspection or error-proofing of the escape) to protect the customer, then drive root cause analysis and process correction, then verify capability, then relax inspection as prevention proves out. Should mention shifting from detection to prevention, moving controls upstream, poka-yoke / mistake-proofing, and using cost of quality to justify investing in prevention over perpetual appraisal. Should treat the inspection as a stopgap with an exit plan, not the strategy. Key insight: containment buys time and protects customers, but the goal is to make inspection unnecessary by fixing the process, so inspection should be a temporary safety net with a defined exit, not the permanent answer.",
      },
    ],
  },
  {
    id: "quality_systems_root_cause",
    slug: "concept-quality-systems-root-cause-analysis",
    title: "The Recurring Field Failure",
    prompt: "A pump keeps failing in the field. The maintenance log shows a clear immediate cause every time: a bearing seizes. The team has been replacing bearings on a faster schedule, yet the failures keep recurring across multiple units.",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["quality-systems", "conceptual"],
    skillAreas: ["quality-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "The team treats the seized bearing as the root cause. Explain why that is likely a symptom rather than the root cause, and how a structured method such as 5 Whys or a fishbone analysis would push the investigation deeper.",
        rubric: "Should distinguish the immediate or symptomatic cause (bearing seizes) from the root cause (the underlying condition that, if removed, prevents recurrence). Should explain 5 Whys as iterative questioning to move from symptom toward systemic cause (for example: bearing seized because it overheated, because lubrication failed, because the seal leaked, because the wrong seal spec was used, because the BOM was not updated), and the fishbone (Ishikawa) categories such as man, machine, method, material, measurement, environment to broaden the search. Should warn that replacing bearings faster only treats the symptom, raising cost without stopping recurrence. Should mention verifying the cause with data rather than stopping at the first plausible answer. Key insight: a fix that does not prevent recurrence was aimed at a symptom, so root cause analysis must continue until removing the cause would actually stop the failure.",
      },
      {
        prompt: "Now the constraints change. The investigation finds that the seal supplier silently changed a material, but it also finds the failure only appears in hot climates and only on units installed by one contractor. With multiple contributing factors, how do you avoid stopping at one convenient root cause, and how do you confirm which causes actually matter before committing to corrective action?",
        rubric: "Should recognize that real failures often have multiple interacting causes and that a single root cause framing can be a trap. Should propose confirming causation with data rather than correlation: stratify failures by climate, contractor, and seal lot; look for interaction effects; use Pareto to prioritize the vital few; and where feasible run a designed experiment or controlled replication to verify which factors drive the failure. Should distinguish necessary versus sufficient causes and address each verified contributor with its own corrective and preventive action (supplier change control, installation procedure, environmental rating). Should emphasize verifying the fix by checking that the failure rate actually drops. Key insight: when several factors coincide you must test which ones actually cause the failure before acting, because chasing one convenient cause leaves the others free to keep producing failures.",
      },
    ],
  },
  {
    id: "quality_systems_sample_size_confidence",
    slug: "concept-quality-systems-sample-size-vs-confidence",
    title: "How Many Parts Do We Need to Pull",
    prompt: "Before releasing a new lot, your team wants to estimate the defect rate by sampling. One engineer says pulling 30 parts is plenty; another insists you need far more to make any real claim about the lot. The lot is large and the true defect rate is believed to be low.",
    discipline: "INDUSTRIAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["quality-systems", "conceptual"],
    skillAreas: ["quality-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the relationship between sample size, confidence, and the precision of the estimate. Why does a low expected defect rate make small samples especially weak, and what does finding zero defects in 30 parts actually let you conclude?",
        rubric: "Should explain that larger samples narrow the confidence interval (more precision) at a given confidence level, and that confidence and precision trade off against sample size; the margin of error shrinks roughly with one over the square root of n. Should explain that detecting rare defects requires large n because expected defects in the sample equals n times p, so a low p means small samples often contain zero defects by chance. Should correctly interpret zero defects in 30: it does not prove the lot is defect-free; using the rule of three, the upper 95 percent confidence bound on the defect rate is about 3/n, so roughly up to a 10 percent defect rate is still plausible with n = 30. Key insight: a sample tells you about the lot only within a confidence interval, and zero defects in a small sample bounds the rate loosely rather than proving zero, so detecting rare defects demands large samples.",
      },
      {
        prompt: "Now the constraints change. The defect being screened is safety-critical, destructive testing is expensive, and you also care about not rejecting good lots. Frame this as the trade-off between producer's risk and consumer's risk. How would you reason about choosing a sampling plan, and when does sampling stop being the right tool at all?",
        rubric: "Should frame acceptance sampling in terms of consumer's risk (beta, accepting a bad lot) versus producer's risk (alpha, rejecting a good lot), tied to the operating characteristic curve, the AQL, and the RQL/LTPD. Should explain that tightening consumer's risk for a rare safety-critical defect drives sample size up sharply, and that cost of destructive testing pushes back, so the plan is a deliberate balance set by how costly each error is. Should note that for a truly catastrophic, low-rate defect, sampling may be inadequate (you cannot sample your way to confidence in rare events) and the right answer shifts to 100 percent inspection or, better, prevention and process control so the defect is not produced. Should mention that sampling assumes a stable process and a homogeneous lot. Key insight: a sampling plan is a chosen balance between producer's and consumer's risk, but when the defect is rare and catastrophic the math forces you toward prevention and process control rather than sampling.",
      },
    ],
  },
  {
    id: "quality_systems_tolerance_stackup",
    slug: "concept-quality-systems-tolerance-stack-up",
    title: "Parts In Spec, Assembly Out of Spec",
    prompt: "An assembly stacks five machined plates together, and the overall stack height must hit a target with a tight tolerance. Every individual plate measures within its own drawing tolerance, yet a noticeable fraction of finished assemblies are out of spec on total height.",
    discipline: "INDUSTRIAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["quality-systems", "conceptual"],
    skillAreas: ["quality-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "How can every part be in spec while the assembly is out of spec? Explain tolerance stack-up, and contrast worst-case stacking with a statistical (RSS) approach to how the individual tolerances combine.",
        rubric: "Should explain that individual tolerances accumulate across the stack, so even conforming parts can sum to an out-of-spec assembly if the assembly tolerance is tighter than the combined part tolerances. Should describe worst-case stack-up as the arithmetic sum of the individual tolerances (T_total = sum of t_i), which is conservative and assumes all parts hit their extremes simultaneously. Should describe the statistical RSS approach (T_total = sqrt(sum of t_i squared)), which is realistic when part dimensions are independent and roughly normal because extreme combinations are unlikely, giving a tighter predicted spread than worst-case. Should note the assembly spec must be designed against the chosen stacking model and that part centering and variation matter. Key insight: tolerances add up across an assembly, so conforming parts can still fail at the assembly level, and worst-case versus RSS is a deliberate choice between guaranteed fit and realistic, less conservative stacking.",
      },
      {
        prompt: "Now the constraints change. You cannot loosen the assembly tolerance and tightening all five plate tolerances is too expensive. Using your understanding of how variation combines, where would you spend tightening effort, and what design or process options besides tighter tolerances could solve the stack-up?",
        rubric: "Should use the RSS insight that the largest-variance contributors dominate the root-sum-square, so tightening the few plates with the biggest tolerance or variation buys the most reduction per dollar (a Pareto allocation), rather than tightening everything equally. Should consider centering the part means and reducing variation (better Cpk on key plates) instead of only narrowing the spec. Should propose non-tolerance solutions: selective assembly or matched grading, a shim or adjustable/spacer feature, redesign to reduce the number of parts in the stack, designing the assembly tolerance with the RSS model, or geometric controls. Should weigh cost versus the variance contribution of each part. Key insight: because variation combines as a root-sum-square, effort should target the dominant contributors and use centering, selective assembly, or design changes, not uniform across-the-board tolerance tightening.",
      },
    ],
  },
];
