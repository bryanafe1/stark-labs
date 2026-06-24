import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "water_treatment_coag_floc_settling",
    slug: "concept-water-treatment-coagulation-settling",
    title: "Why Coagulate Before You Settle",
    prompt: "A surface-water plant draws from a river carrying fine clay turbidity. Operators notice that when they send raw water straight to the sedimentation basin the turbidity barely drops, but the same basin clears the water well once chemical dosing upstream is running.",
    discipline: "ENVIRONMENTAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["water-treatment", "conceptual"],
    skillAreas: ["water-treatment"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain why fine clay particles refuse to settle on their own, and walk through what coagulation and flocculation each do physically to fix that. Be specific about the role of rapid mix versus slow mix.",
        rubric: "Fine clay is colloidal: particles are small (microns or sub-micron) with very low settling velocity by Stokes law (v proportional to d squared), and they carry a net negative surface charge so the electrostatic double layer keeps them mutually repelled and stable in suspension. Coagulation: add a metal salt (alum or ferric) that hydrolyzes to positively charged species; this neutralizes/compresses the double layer (and provides sweep-floc hydroxide precipitate) so particles can approach. Rapid mix (high velocity gradient G, seconds) disperses coagulant instantly so destabilization is uniform before hydrolysis finishes. Flocculation: gentle slow mix (low G, minutes) promotes particle collisions so destabilized particles aggregate into larger, denser, faster-settling flocs without shearing them apart. The bigger floc then settles by gravity in the basin (Stokes again, now large d). Key insight: settling is governed by particle size, so you must first destabilize the charge (coagulation) and then grow large flocs (flocculation) before sedimentation can work.",
      },
      {
        prompt: "Now the constraints change. The plant must keep the same sedimentation basin but the incoming flow rate doubles permanently. Why might settled-water quality degrade, and what levers (chemical and physical) restore it without enlarging the basin?",
        rubric: "Doubling flow halves the detention time and, more importantly, doubles the surface overflow rate (SOR = Q/A), which is the controlling parameter for an ideal settling basin: any floc with settling velocity below the new SOR is now carried over. Floc that settled fine before now escapes. Levers: chemical, grow heavier/faster-settling floc by optimizing coagulant dose and pH, adding a coagulant aid/polymer, or using weighting agents (ballasted flocculation) to raise floc density and settling velocity; physical, add plate or tube settlers to multiply effective settling area A and cut the effective SOR without a bigger footprint, improve flocculation energy/time, or shift load by adding a parallel process (DAF for low-density floc). Note simply relying on longer detention is wrong, SOR not detention time governs ideal removal. Key insight: settling capacity is set by surface overflow rate, so you either make floc settle faster or add effective settling area (plates/tubes), not chase detention time.",
      },
    ],
  },
  {
    id: "water_treatment_activated_sludge_aeration",
    slug: "concept-water-treatment-activated-sludge-aeration",
    title: "Keeping the Bugs Alive and Settling",
    prompt: "A municipal activated sludge plant runs an aeration tank followed by a secondary clarifier, with sludge returned from the clarifier to the head of the aeration tank. Effluent BOD has crept up and the clarifier blanket is rising.",
    discipline: "ENVIRONMENTAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["water-treatment", "conceptual"],
    skillAreas: ["water-treatment"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the purpose of aeration and of return activated sludge in this system, and how solids retention time (sludge age) sets the microbial community. Why does the process depend on the biomass settling well in the clarifier?",
        rubric: "Aeration supplies dissolved oxygen for aerobic heterotrophs to oxidize soluble/colloidal BOD into CO2, water, and new cell mass, and it keeps the mixed liquor suspended (mixing). Microbes convert dissolved organics into settleable biological floc. Return activated sludge (RAS) recycles settled biomass to maintain a high MLSS concentration in the aeration tank, sustaining the food-to-microorganism balance; wasting (WAS) controls the population. Solids retention time / sludge age (SRT = mass of solids in system / mass wasted per day) is the master control: long SRT selects slow growers (nitrifiers, well-flocculating organisms) and gives low F/M and low effluent BOD; short SRT washes them out. The process is a two-step trick, biological conversion in aeration and gravity separation in the clarifier; if floc does not settle, biomass leaves in the effluent (solids carryover raises BOD/TSS) and SRT collapses. Key insight: activated sludge only works if you both grow the right biomass (set by SRT/aeration) and successfully separate it by settling and return it; the clarifier is half the process.",
      },
      {
        prompt: "Now the constraints change. Microscopy shows filamentous bacteria dominating and the sludge volume index has spiked (bulking sludge). Why does a rising blanket and effluent solids loss follow, and how would you diagnose and correct the cause rather than just wasting more sludge?",
        rubric: "Filamentous bulking: filaments bridge between flocs and keep them from compacting, so SVI rises (sludge occupies large settled volume), the floc settles slowly, the clarifier blanket climbs, and solids wash over the weir raising effluent TSS and BOD. Wasting more just removes good and bad biomass and can drop SRT below nitrifiers; it does not fix the selection pressure. Diagnose the driver: low dissolved oxygen in aeration, low F/M (over-aeration/starvation), nutrient deficiency (low N or P relative to BOD), septic/low-DO conditions or high readily-biodegradable substrate, or specific filament types pointing to specific causes. Corrections: raise DO setpoint, add a selector zone (anoxic/anaerobic or high-F/M contact zone) to favor floc-formers over filaments, correct nutrient balance, adjust RAS/SRT, and only as a stopgap chlorinate RAS or add coagulant/polymer to weight the floc. Key insight: bulking is a settleability (SVI) problem from a selection imbalance, so you fix the growth conditions (DO, F/M, nutrients, selector) rather than treating it as too much biomass.",
      },
    ],
  },
  {
    id: "water_treatment_disinfection_cl_vs_uv",
    slug: "concept-water-treatment-disinfection-chlorine-vs-uv",
    title: "Chlorine Versus UV at the Tail End",
    prompt: "A drinking-water utility is choosing a primary disinfection approach for treated, filtered water before it enters a distribution network that spans many miles to scattered customers.",
    discipline: "ENVIRONMENTAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["water-treatment", "conceptual"],
    skillAreas: ["water-treatment"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Compare chlorine and UV as disinfectants for this system. Cover mechanism, what the CT concept means, the disinfection byproduct concern, and crucially why distribution distance matters to the choice.",
        rubric: "Chlorine: chemical oxidant, inactivates pathogens by damaging cell membranes/enzymes; effectiveness scales with CT (concentration times contact time), so you trade dose against contact time in a basin/clearwell. Key advantage: it leaves a persistent residual that protects water against regrowth/recontamination throughout a long distribution system. Drawback: forms disinfection byproducts (trihalomethanes, haloacetic acids) by reacting with natural organic matter, and is less effective against chlorine-resistant organisms like Cryptosporidium. UV: physical, damages microbial DNA/RNA (dimerization) so organisms cannot reproduce; excellent against Crypto/Giardia, no chemical byproducts, fast (no large contact basin). But UV leaves NO residual, so it gives no protection downstream and is dose-limited by water transmittance/turbidity and fouling of sleeves. For a long, spread-out network the residual issue dominates: UV alone cannot protect miles of pipe. Key insight: chlorine provides a lasting residual but makes byproducts; UV is residual-free and byproduct-free but cannot protect a long distribution system, so distance pushes toward chlorine (or UV plus a chlorine residual).",
      },
      {
        prompt: "Now the constraints change. Source monitoring shows recurring Cryptosporidium and the byproduct (THM/HAA) limits are being approached because of high natural organic matter. How should the disinfection strategy change, and why is a single disinfectant likely the wrong answer now?",
        rubric: "Cryptosporidium is highly chlorine-resistant (needs impractical CT) but UV inactivates it efficiently at modest dose, so UV (or ozone) becomes necessary for the Crypto barrier. Meanwhile chlorine demand and high NOM are driving THM/HAA formation, so simply boosting chlorine worsens byproducts. The right move is a multi-barrier strategy: use UV (or ozone) as the primary disinfectant for the resistant pathogen, and reduce NOM precursors upstream (enhanced coagulation, GAC, or membranes) so that a smaller chlorine dose can still maintain a distribution residual without exceeding DBP limits. Possibly switch secondary residual to chloramine, which forms far fewer regulated THM/HAA, to hold a residual across the system. This balances the CT/DBP tradeoff against the Crypto requirement. Key insight: when one organism resists chlorine and chlorine itself drives byproducts, no single disinfectant wins; you combine UV/ozone for the resistant pathogen with precursor removal and a low-DBP residual (chloramine) for distribution protection.",
      },
    ],
  },
  {
    id: "water_treatment_membrane_fouling",
    slug: "concept-water-treatment-membrane-fouling",
    title: "When the Membrane Stops Letting Water Through",
    prompt: "A reverse osmosis train treating brackish groundwater shows a steady rise in feed pressure needed to hold the same permeate flow, and the salt passage is slowly increasing. The operator suspects fouling or scaling.",
    discipline: "ENVIRONMENTAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["water-treatment", "conceptual"],
    skillAreas: ["water-treatment"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the physical mechanisms that make a membrane foul or scale, the role of concentration polarization, and how these show up as rising transmembrane pressure and changing salt passage. Distinguish the main fouling types.",
        rubric: "RO drives water through a semipermeable membrane against osmotic pressure; rejected solutes accumulate at the membrane surface faster than they diffuse back, raising local concentration above the bulk (concentration polarization), which increases local osmotic pressure (less net driving force) and the tendency to precipitate/deposit. Fouling types: scaling (inorganic precipitation of sparingly soluble salts, CaCO3, CaSO4, silica, when their solubility limit is exceeded in the concentrate), particulate/colloidal fouling (suspended matter, clay, iron), organic fouling (NOM adsorption), and biofouling (biofilm growth). A fouling/cake layer adds hydraulic resistance, so to hold constant permeate flux you must raise transmembrane pressure (TMP rises). Salt passage rises because the polarized/fouled boundary layer increases solute concentration at the surface and can damage or bypass-channel the membrane, lowering rejection. Key insight: concentration polarization concentrates rejected solutes at the surface, and the resulting deposit/scale adds resistance, so the tell-tale signature is rising feed/transmembrane pressure for the same flux plus creeping salt passage.",
      },
      {
        prompt: "Now the constraints change. The utility wants to push the system to a much higher recovery ratio (more permeate per unit feed) to cut brine disposal cost. Why does higher recovery sharply increase fouling/scaling risk, and what design and operating measures keep it under control?",
        rubric: "Higher recovery means a larger fraction of feed becomes permeate, so the rejected solutes are concentrated into a smaller reject stream, the concentration factor rises (CF = 1/(1-recovery)); concentrate-side salts approach and exceed solubility limits, dramatically raising scaling risk, and the higher osmotic pressure of the concentrate demands more pressure. Crossflow velocity in the tail elements drops as flow is removed, worsening concentration polarization and deposition. Measures: add antiscalants/threshold inhibitors and adjust pH (acid) to keep sparingly soluble salts below precipitation; pretreatment to remove particulates/silica/iron and reduce biofouling (microfiltration, softening, dechlorination control); stage the array (tapered/multi-stage with concentrate recycle) to maintain crossflow velocity; limit flux in lead elements; monitor LSI/scaling indices; and schedule cleaning (CIP). There is an economic limit, beyond a point the antiscalant/energy/cleaning cost and risk outweigh brine savings. Key insight: recovery and concentration factor are linked by CF = 1/(1-recovery), so pushing recovery concentrates scalants and shrinks crossflow, and you manage it with antiscalant/pH, pretreatment, staging, and flux limits rather than brute pressure.",
      },
    ],
  },
  {
    id: "water_treatment_residence_time_distribution",
    slug: "concept-water-treatment-residence-time-distribution",
    title: "Short-Circuiting in the Contact Tank",
    prompt: "A chlorine contact basin is sized on paper to give 30 minutes of contact time at design flow, but a tracer test shows disinfection-credit contact time is far less than the nominal hydraulic detention time.",
    discipline: "ENVIRONMENTAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["water-treatment", "conceptual"],
    skillAreas: ["water-treatment"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain why the actual contact time differs from the theoretical detention time (volume/flow), what short-circuiting and dead zones are, and why disinfection credit uses a value like t10 rather than the mean detention time. Contrast plug flow and completely mixed behavior.",
        rubric: "Theoretical detention time is V/Q assuming ideal plug flow where every fluid parcel stays exactly tau. Real basins deviate: short-circuiting (some water finds a fast path from inlet to outlet, e.g. density currents, thermal/wind currents, poor baffling) so part of the flow gets far less than tau, while dead zones (stagnant corners/recirculation) hold water longer but remove it from useful contact, reducing effective volume. The residence time distribution (RTD) from a tracer test captures this spread. For disinfection you must protect against the fastest-moving water that gets the least contact, so credit uses t10 (the time at which 10 percent of tracer has passed, i.e. 90 percent has been exposed at least that long), not the mean. Plug flow: narrow RTD, t10 approaches tau, high baffling factor (t10/tau near 1). Completely mixed (CSTR): broad exponential RTD, much of the flow exits quickly, low t10/tau (around 0.1-0.3). Key insight: disinfection depends on the least-exposed water, so credit is based on t10 from the RTD, and real tanks fall short of V/Q because of short-circuiting and dead zones.",
      },
      {
        prompt: "Now the constraints change. You cannot build a larger basin, but you must raise the baffling factor (t10/tau) to earn more CT credit. What physical modifications move the basin toward plug flow, and what are the tradeoffs of each?",
        rubric: "Goal: narrow the RTD and push t10/tau upward toward plug flow. Moves: add intra-basin baffles/serpentine walls to lengthen the flow path and raise the length-to-width ratio (most direct, but adds headloss and cost and can collect solids); improve inlet/outlet design with diffuser walls or perforated baffles to spread flow uniformly and kill jetting/short-circuiting; eliminate dead zones with fillets or improved geometry; manage density/thermal currents (covers, inlet placement) that drive short-circuiting; or convert toward several CSTRs in series (tanks-in-series approaches plug flow as N increases). Tradeoffs: baffling increases headloss (pumping energy), can trap sludge requiring cleaning, and costs capital; raising chlorine dose instead would buy CT but increases DBPs and chemical cost, so improving hydraulics is preferred. Note baffling factor improvements directly multiply CT credit without more chemical. Key insight: you earn CT credit by making the flow more plug-like (longer path, baffles, good inlet distribution, tanks-in-series), trading some headloss/maintenance for a higher t10/tau instead of dosing more disinfectant.",
      },
    ],
  },
  {
    id: "water_treatment_unit_process_train",
    slug: "concept-water-treatment-unit-process-train",
    title: "Why Each Step Is in the Train",
    prompt: "A conventional surface-water treatment plant runs the classic sequence: screening, coagulation/flocculation, sedimentation, filtration, then disinfection. A new junior engineer asks why the order cannot be rearranged or steps skipped.",
    discipline: "ENVIRONMENTAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["water-treatment", "conceptual"],
    skillAreas: ["water-treatment"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the job each unit process does and why the order is what it is. In particular, why must coagulation/sedimentation precede filtration, and why is disinfection placed last?",
        rubric: "Each step targets a particular contaminant size/class and prepares water for the next, working coarse-to-fine. Screening removes large debris to protect downstream equipment. Coagulation/flocculation destabilizes and aggregates colloidal turbidity/NOM into settleable floc. Sedimentation removes the bulk of that floc by gravity, taking most of the solids load off the filters. Filtration polishes the remaining fine particles (and floc carryover) to low turbidity, which is essential because turbidity shields pathogens from disinfectant. Disinfection is last so it acts on already-clarified, low-turbidity water, maximizing CT effectiveness and minimizing demand and DBP formation; disinfecting dirty water wastes oxidant, shields organisms, and creates more byproducts. Order matters: filters would blind almost instantly if fed unsettled raw water (sedimentation is the bulk solids barrier protecting them); coagulation must precede both because settling/filtration of colloids is impossible without it. Multiple-barrier principle: each step is partial, and removing one breaks the redundancy that ensures safety. Key insight: the train is a coarse-to-fine multi-barrier sequence where each step reduces the load on the next, and disinfection comes last because it only works well on clarified, low-turbidity water.",
      },
      {
        prompt: "Now the constraints change. The raw source becomes consistently low in turbidity but high in dissolved natural organic matter (color and DBP precursors). Why might the conventional train underperform, and how would you adapt the process selection?",
        rubric: "Conventional coagulation/sedimentation/filtration mainly removes particulate/colloidal turbidity; dissolved NOM (color, DBP precursors) is largely not removed by plain settling and filtration, so finished water still carries precursors that form THM/HAA on disinfection, and the low particle load gives little floc to settle. Adaptations: enhanced coagulation (higher coagulant dose and depressed pH to maximize NOM removal by adsorption onto hydroxide floc), add granular activated carbon (GAC adsorption) or PAC for dissolved organics, consider ozone/biofiltration to break down and biodegrade NOM, or membranes (nanofiltration) that reject dissolved organics. Because turbidity is low, dissolved-organic removal not solids settling is the controlling design goal, possibly making conventional sedimentation less central (DAF or direct filtration may suit low-turbidity water better). Also shift residual strategy (chloramine) to limit DBPs. Key insight: low-turbidity, high-NOM water shifts the design target from particle removal to dissolved-organic/precursor removal, so you add enhanced coagulation, adsorption (GAC), oxidation, or membranes rather than relying on the particle-focused conventional train.",
      },
    ],
  },
];
