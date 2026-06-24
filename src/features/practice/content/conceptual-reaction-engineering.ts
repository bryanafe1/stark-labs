import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "reaction_engineering_cstr_vs_pfr_order",
    slug: "concept-reaction-engineering-cstr-vs-pfr-order",
    title: "Choosing CSTR vs PFR for a Liquid-Phase Reaction",
    prompt: "You are designing a reactor for a liquid-phase reaction A -> B that follows a positive-order rate law (rate increases with concentration of A). You must hit a high single-pass conversion and want to minimize total reactor volume.",
    discipline: "CHEMICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["reaction-engineering", "conceptual"],
    skillAreas: ["reaction-engineering"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: For this positive-order reaction at high conversion, would a single CSTR or a single PFR require less volume to reach the target conversion, and why? Frame your reasoning in terms of how concentration (and therefore rate) varies inside each reactor.",
        rubric: "An excellent answer states the PFR requires less volume for a positive-order reaction. It explains that a CSTR operates entirely at the low exit concentration, so the whole volume sees the slow rate at high conversion, while a PFR has a concentration gradient from inlet (high C, high rate) to outlet (low C). Volume is the integral of 1/(-rA) versus conversion (Levenspiel area); the CSTR uses a rectangle at the worst-case rate, the PFR uses the area under the curve which is smaller. Should note CSTR has uniform, lower rate due to instant dilution to exit conditions. Key insight: because rate falls as conversion rises for positive-order kinetics, the PFR exploits the high-rate inlet region and beats the CSTR on volume, with the gap widening at high conversion.",
      },
      {
        prompt: "Part 2: Now the constraints change. The reaction is strongly autocatalytic (B catalyzes the reaction, so the rate is near zero when little B is present and peaks at intermediate conversion). Does your reactor choice change, and how might a CSTR-plus-PFR arrangement outperform either alone?",
        rubric: "An excellent answer recognizes that for autocatalytic kinetics the rate-versus-conversion curve is non-monotonic: low rate at low conversion (little product), a peak at intermediate conversion, then falling rate. A pure PFR is poor at the start because it begins at near-zero rate. A CSTR run at the conversion that maximizes rate is efficient for the early stage because it instantly jumps the feed to a high-rate, high-B condition. The optimal scheme is a CSTR first (up to roughly the rate-maximum conversion) followed by a PFR to finish to high conversion where the falling rate favors a plug-flow profile. This minimizes total volume (smallest combined Levenspiel area). Key insight: with autocatalysis the best configuration flips, a CSTR seeds the autocatalyst quickly and a downstream PFR polishes conversion, so reactor sequencing should follow the shape of the 1/(-rA) curve.",
      },
    ],
  },
  {
    id: "reaction_engineering_arrhenius_selectivity",
    slug: "concept-reaction-engineering-arrhenius-selectivity",
    title: "Raising Temperature to Boost a Slow Reaction",
    prompt: "A team runs a reactor producing a desired product D from reactant A. They notice the reaction is slow and propose simply raising the operating temperature to speed it up. There is also a competing side reaction A -> W (waste) occurring in parallel.",
    discipline: "CHEMICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["reaction-engineering", "conceptual"],
    skillAreas: ["reaction-engineering"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Using the Arrhenius relationship, explain why raising temperature speeds up a reaction, and what role the activation energy plays in how sensitive a given reaction's rate is to temperature.",
        rubric: "An excellent answer cites the Arrhenius form k = A*exp(-Ea/(R*T)) and explains that higher T increases the fraction of molecular collisions with enough energy to clear the activation barrier, so k rises exponentially. It explains that a higher Ea means the rate is MORE sensitive to temperature (steeper response), while a low Ea reaction is relatively insensitive. May note the pre-exponential factor A captures collision frequency and orientation. Key insight: temperature sensitivity is governed by Ea, the activation barrier sets both how slow a reaction is and how strongly heating accelerates it.",
      },
      {
        prompt: "Part 2: Now consider that the desired reaction has a LOWER activation energy than the competing waste reaction. If the team raises temperature to go faster, what happens to selectivity toward D, and what would you recommend instead?",
        rubric: "An excellent answer reasons about the ratio of rate constants: selectivity to D scales with k_D/k_W, and that ratio varies as exp(-(Ea_D - Ea_W)/(R*T)). Because Ea_W > Ea_D, raising temperature accelerates the waste reaction MORE than the desired one, so selectivity to D falls even though total rate rises. The recommendation is to run COOLER to favor the lower-Ea desired reaction for selectivity, accepting slower kinetics, and recover throughput by other means (larger reactor or volume, longer residence time, higher catalyst loading, or higher reactant concentration). Should note the general rule: lower temperature favors the lower-activation-energy pathway. Key insight: temperature choice trades selectivity against rate, when the desired path has the lower Ea you go colder for selectivity and buy back rate with reactor size or residence time, not heat.",
      },
    ],
  },
  {
    id: "reaction_engineering_equilibrium_vs_kinetics",
    slug: "concept-reaction-engineering-equilibrium-vs-kinetics",
    title: "Equilibrium Ceiling on an Exothermic Reversible Reaction",
    prompt: "Consider the reversible, exothermic gas-phase reaction A <-> B (similar in spirit to ammonia synthesis). Conversion is disappointingly low and an engineer suggests cranking the temperature way up to push the reaction forward.",
    discipline: "CHEMICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["reaction-engineering", "conceptual"],
    skillAreas: ["reaction-engineering"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Distinguish between what kinetics and what equilibrium each control here. Explain why raising temperature can actually LOWER the achievable conversion for this exothermic reversible reaction, and what is meant by the concept of an optimal temperature trajectory.",
        rubric: "An excellent answer separates the two limits: kinetics (rate constant k) sets how FAST equilibrium is approached and improves with temperature; equilibrium (Keq) sets the MAXIMUM attainable conversion. For an exothermic reaction Keq decreases with temperature (Le Chatelier / van't Hoff), so the equilibrium conversion ceiling drops as T rises. Thus high T gives fast rate but a low ceiling. The optimal-temperature-trajectory idea: run hot early (far from equilibrium, exploit fast kinetics) then cool progressively as you approach equilibrium so the ceiling stays high, tracing the locus of maximum rate at each conversion. Key insight: kinetics governs speed and rises with T, equilibrium governs the achievable ceiling and falls with T for an exothermic reaction, so the best design declines temperature along the reactor rather than maximizing it.",
      },
      {
        prompt: "Part 2: Now the constraints change. Suppose you cannot easily lower temperature but you CAN manipulate pressure and product removal. For this reaction where 2 moles of A form 1 mole of B (mole-reducing), what levers shift the equilibrium toward more product, and why does continuously removing B help?",
        rubric: "An excellent answer applies Le Chatelier: since the forward reaction reduces total moles, raising PRESSURE shifts equilibrium toward B (more product) and also raises concentrations to speed kinetics. Removing product B continuously (e.g., condensation, membrane, or reactive separation) keeps the system away from equilibrium so the forward rate stays high and net conversion per pass climbs; this is the basis of recycle with product knockout. May note adding excess of a co-reactant or diluent removal as related levers, and that pressure costs compression energy and equipment rating. Key insight: when you cannot use temperature, pressure (for a mole-reducing reaction) and continuous product removal both push the equilibrium and keep the driving force alive, converting an equilibrium-limited system into a higher-conversion one.",
      },
    ],
  },
  {
    id: "reaction_engineering_selectivity_series",
    slug: "concept-reaction-engineering-selectivity-series",
    title: "Maximizing Intermediate Yield in a Series Reaction",
    prompt: "You operate a reactor for the series reaction A -> R -> S, where R is the valuable intermediate product and S is an over-oxidized waste. Both steps are roughly first order. Marketing wants maximum yield of R.",
    discipline: "CHEMICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["reaction-engineering", "conceptual"],
    skillAreas: ["reaction-engineering"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the fundamental tension between conversion and selectivity for this series reaction, and why pushing conversion of A toward completion destroys the yield of R. What does this imply about residence time?",
        rubric: "An excellent answer explains that R is consumed by the second step, so as conversion of A goes high (long residence time) the R that was made gets converted to S, and yield of R passes through a maximum at an intermediate residence time then declines. Selectivity to R is highest at low conversion but absolute yield is low there; there is an optimal residence time / space time that maximizes R. Should connect this to the rate-constant ratio k1/k2 (a larger ratio gives a higher attainable R peak). Key insight: for series kinetics maximum intermediate yield occurs at an intermediate, optimized residence time, running to full conversion of A over-reacts R into waste, so you deliberately stop short.",
      },
      {
        prompt: "Part 2: Now the constraints change. Compare running this series reaction in a single CSTR versus a single PFR at the residence time that maximizes R in each. Which gives the higher peak yield of R, and why does the mixing behavior matter?",
        rubric: "An excellent answer states the PFR gives the higher maximum yield of R for series first-order kinetics. Reasoning: in a PFR all molecules experience the same, controlled residence time, so you can stop everyone near the optimal exposure before R degrades. In a CSTR the broad residence-time distribution means some molecules leave almost immediately (A unreacted) while others stay very long (R fully converted to S), so the well-mixed reactor cannot cleanly capture the R peak and yields less. Should mention that backmixing dilutes feed and exposes R to continued second-step reaction at the exit condition. Key insight: narrow residence-time distribution (PFR) protects a fragile intermediate, broad RTD (CSTR) smears exposure times and lowers peak intermediate yield, so plug flow wins for series-reaction selectivity.",
      },
    ],
  },
  {
    id: "reaction_engineering_catalyst_role",
    slug: "concept-reaction-engineering-catalyst-role",
    title: "What a Catalyst Does (and Does Not) Change",
    prompt: "A junior engineer claims that adding a catalyst will improve the equilibrium conversion of a reaction and shift it toward products. The reaction in question is a heterogeneously catalyzed gas-phase reaction over a packed bed of solid catalyst.",
    discipline: "CHEMICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["reaction-engineering", "conceptual"],
    skillAreas: ["reaction-engineering"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Is the junior engineer correct? Explain what a catalyst changes and what it leaves unchanged, in terms of activation energy, forward and reverse rates, and the equilibrium constant.",
        rubric: "An excellent answer corrects the claim: a catalyst does NOT change the equilibrium constant or the equilibrium conversion. It lowers the activation energy of the pathway, accelerating BOTH forward and reverse reactions equally, so equilibrium is reached faster but at the same position. Keq is set by thermodynamics (Gibbs free energy change), which the catalyst does not alter. A catalyst can let you reach acceptable rates at lower temperature, which for an exothermic reaction indirectly allows a higher equilibrium ceiling, but that is a temperature effect, not the catalyst moving equilibrium. Key insight: a catalyst speeds the approach to equilibrium by lowering the barrier for both directions, it never changes where equilibrium lies.",
      },
      {
        prompt: "Part 2: Now the constraints change. In this packed bed you observe that doubling the temperature barely increases the observed reaction rate, even though the intrinsic chemistry should be much faster. What regime is the reactor likely operating in, and how would you diagnose and fix it?",
        rubric: "An excellent answer recognizes this as a mass-transfer (diffusion) limited regime rather than a reaction-rate-limited one. When the observed rate is nearly insensitive to temperature, the apparent activation energy is very low, signaling that pore diffusion or external film diffusion to the catalyst surface, not the surface kinetics, controls the rate (intrinsic kinetics have high Ea, diffusion has low Ea). Diagnostics: low apparent Ea, effectiveness factor well below 1, Thiele modulus large, weak dependence on temperature but dependence on particle size and flow rate. Fixes: use smaller catalyst particles or eggshell catalyst to shorten diffusion path, increase superficial velocity to thin the external film, or redesign for less internal resistance. Key insight: a near-zero temperature sensitivity is the fingerprint of diffusion control, so you fix transport (particle size, velocity) rather than chemistry.",
      },
    ],
  },
  {
    id: "reaction_engineering_thermal_runaway",
    slug: "concept-reaction-engineering-thermal-runaway",
    title: "Preventing Thermal Runaway in an Exothermic CSTR",
    prompt: "You run a strongly exothermic liquid-phase reaction in a cooled CSTR with a jacket. During a startup the temperature suddenly spikes far above setpoint and the operators report a near-runaway event before the relief system engaged.",
    discipline: "CHEMICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["reaction-engineering", "conceptual"],
    skillAreas: ["reaction-engineering"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the mechanism of thermal runaway for an exothermic reaction in terms of how heat generation and heat removal each depend on temperature, and why this creates a positive feedback loop.",
        rubric: "An excellent answer contrasts the two curves: heat generation Qgen rises EXPONENTIALLY with temperature (because rate follows Arrhenius k = A*exp(-Ea/(R*T))), while heat removal Qrem rises only LINEARLY with temperature (Qrem = U*A*(T - Tcoolant)). When Qgen exceeds Qrem, the excess heat raises temperature, which further accelerates the reaction and heat generation, a positive feedback that escalates rapidly. Steady states occur where the curves intersect; the runaway happens when the operating point sits on an unstable intersection or when a perturbation pushes Qgen permanently above Qrem. Key insight: runaway is driven by the mismatch between exponential heat generation and linear heat removal, once generation outruns removal the loop is self-reinforcing.",
      },
      {
        prompt: "Part 2: Now the constraints change. Cooling capacity is fixed and cannot be increased. What design and operating strategies would you use to keep the reactor stable and avoid runaway, and explain why semi-batch (controlled feed addition) is often safer than charging all reactant at once?",
        rubric: "An excellent answer lists strategies that limit or control heat generation given fixed cooling: dilute the feed or run at lower concentration to cap the maximum heat-release rate; lower the operating temperature/setpoint to keep Qgen below the fixed Qrem; increase heat-transfer area or improve mixing/U where possible; and most importantly meter the limiting reactant slowly in semi-batch mode so the instantaneous reaction rate (and heat release) is controlled by the feed rate rather than by a large pre-charged inventory. Semi-batch is safer because the accumulated unreacted reactant (and thus the adiabatic temperature rise potential if cooling fails) stays low at all times, so a cooling failure cannot release the full exotherm at once. Should mention safe operating envelope, runaway/relief interlocks, and keeping the operating point on the stable intersection with margin. Key insight: when cooling is capped you control the heat-generation side, semi-batch addition limits the reactant inventory so the worst-case exotherm and adiabatic temperature rise are bounded by the feed rate, not by what is sitting in the vessel.",
      },
    ],
  },
];
