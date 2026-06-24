import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "environmental_chemistry_bod_river_discharge",
    slug: "concept-environmental-chemistry-bod-river-discharge",
    title: "BOD, COD, and the Dissolved Oxygen Sag",
    prompt: "A food-processing plant discharges treated wastewater into a slow-moving river. Downstream monitoring shows dissolved oxygen (DO) dropping to a minimum a few kilometers below the outfall, then slowly recovering. The plant reports a low COD but the lab measures a high BOD5 on the same effluent.",
    discipline: "ENVIRONMENTAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["environmental-chemistry", "conceptual"],
    skillAreas: ["environmental-chemistry"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain what BOD and COD each measure, why BOD5 can be high while COD is low for the same sample, and physically why the DO sag forms downstream rather than right at the outfall.",
        rubric: "BOD measures oxygen consumed by microbes degrading biodegradable organics (a biological demand, here 5-day at 20C); COD measures oxygen equivalent of all chemically oxidizable matter via a strong oxidant. Normally COD >= BOD because COD captures non-biodegradable material too; a high BOD with low COD is unusual and points to either an interference or an effluent rich in readily biodegradable, low-molecular-weight organics (e.g., sugars/starches from food processing) plus possible nitrogenous demand (NBOD) if nitrification occurs in the bottle. The DO sag (Streeter-Phelps behavior) forms downstream because deoxygenation from microbial respiration initially outpaces reaeration; the minimum (critical point) occurs where deoxygenation rate equals reaeration rate, then reaeration dominates and DO recovers. Travel time plus reaction kinetics shift the minimum downstream of the outfall. Key insight: BOD is a kinetic, biologically realized demand exerted over time and distance, which is why the worst DO depletion appears downstream where reaeration has not yet caught up with oxygen consumption.",
      },
      {
        prompt: "Part 2: Now the constraints change. The river flow drops sharply during a summer drought and water temperature rises by 10 C. Qualitatively, how do these two changes move the DO sag and its minimum value, and why?",
        rubric: "Lower flow means greater dilution-limited concentration of waste (higher in-stream BOD), less turbulence and shallower depth changing reaeration, and longer travel time so reactions proceed further per km. Higher temperature increases microbial reaction rates (faster deoxygenation, Arrhenius/theta correction) AND lowers the dissolved oxygen saturation concentration, so the deficit grows from a lower ceiling. Reaeration rate coefficient also rises with temperature but saturation drops, so the achievable DO is reduced. Net effect: the critical DO minimum gets deeper (lower DO) and typically the sag becomes more severe; the location of the minimum may move because both kinetics and velocity change, but the dominant concern is a deeper, more dangerous oxygen deficit. Key insight: warming and low flow act together to worsen the sag because faster oxygen demand collides with a lower oxygen saturation ceiling, which is exactly why fish kills cluster in hot, low-flow summer conditions.",
      },
    ],
  },
  {
    id: "environmental_chemistry_eutrophication_limiting_nutrient",
    slug: "concept-environmental-chemistry-eutrophication-limiting-nutrient",
    title: "Eutrophication and the Limiting Nutrient",
    prompt: "A shallow freshwater lake bordered by farms develops thick algal blooms each summer, followed by fish kills in late summer. Water chemistry shows abundant nitrate but very low dissolved phosphate during the bloom.",
    discipline: "ENVIRONMENTAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["environmental-chemistry", "conceptual"],
    skillAreas: ["environmental-chemistry"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the eutrophication mechanism that links nutrient loading to the late-summer fish kills, identify the likely limiting nutrient here and why, and explain why phosphate is so low during the bloom.",
        rubric: "Nutrient (N and P) loading stimulates excess primary production (algae/cyanobacteria); the bloom is the visible surface biomass. Late-summer fish kills arise because dead algal biomass sinks and is decomposed by aerobic bacteria, which consume DO especially in bottom waters; thermal stratification isolates the hypolimnion so it cannot reaerate, driving hypoxia/anoxia and killing fish. The limiting nutrient is most likely phosphorus: phosphate is drawn down to very low levels during the bloom (consumed and incorporated into biomass) while nitrate remains abundant, the classic signature of P limitation; the Redfield-type stoichiometry and high N:P ratio support this. Low phosphate during the bloom reflects rapid biological uptake and sorption to particles/sediment rather than absence of loading. Key insight: in most freshwater lakes phosphorus is the limiting nutrient, so the near-zero phosphate during a bloom is evidence of P control, and the kills come not from the algae directly but from oxygen demand during their decay under stratification.",
      },
      {
        prompt: "Part 2: Now the constraints change. The lake bottom goes anoxic and stays anoxic for weeks. Explain how anoxia at the sediment-water interface can release stored phosphorus back into the water (internal loading) and why this makes the lake resistant to recovery even after external farm runoff is reduced.",
        rubric: "Under oxic conditions phosphate is bound in sediments largely sorbed to ferric iron oxyhydroxides (Fe(III)). When the hypolimnion goes anoxic, microbial/redox processes reduce Fe(III) to soluble Fe(II), dissolving the iron-phosphate complexes and releasing phosphate back into the water column (internal/legacy P loading). This recycled phosphorus fuels further blooms, decay, and more anoxia, a self-reinforcing positive feedback. Because the sediment acts as a large internal reservoir, cutting external runoff alone may not stop blooms for years; the lake is buffered against recovery (hysteresis). Mitigation requires breaking the loop: reoxygenation/aeration, binding P with alum or iron, dredging, or sustained external load reduction. Key insight: redox control of iron governs phosphorus release, so anoxia converts the sediment from a P sink into a P source, locking the lake into a degraded state even after upstream inputs are reduced.",
      },
    ],
  },
  {
    id: "environmental_chemistry_alkalinity_buffering",
    slug: "concept-environmental-chemistry-alkalinity-buffering",
    title: "Why pH and Alkalinity Matter",
    prompt: "Two lakes receive the same amount of acid deposition from rainfall. One lake sits on a granite (silicate) watershed and acidifies sharply; the other sits on a limestone (carbonate) watershed and barely changes pH.",
    discipline: "ENVIRONMENTAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["environmental-chemistry", "conceptual"],
    skillAreas: ["environmental-chemistry"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Define alkalinity, explain the role of the carbonate system (CO2/H2CO3, HCO3-, CO3 2-) in buffering pH, and explain why the limestone lake resists acidification while the granite lake does not.",
        rubric: "Alkalinity is the acid-neutralizing capacity of water, dominated in natural waters by bicarbonate and carbonate (and hydroxide), i.e., roughly [HCO3-] + 2[CO3 2-] + [OH-] - [H+]. The carbonate system buffers pH because added H+ is consumed by converting CO3 2- to HCO3- and HCO3- to H2CO3/CO2, resisting pH change; the buffering is strongest near the relevant pKa values (pKa1 ~6.3, pKa2 ~10.3). The limestone lake dissolves CaCO3, continually supplying bicarbonate alkalinity that neutralizes incoming acid, so pH stays near-neutral. The granite/silicate watershed weathers very slowly and supplies little alkalinity, so the lake has low buffering capacity and pH falls sharply once its small reserve is consumed. Key insight: it is alkalinity (the bicarbonate reservoir from carbonate mineral weathering), not water volume or pH alone, that determines a lake's resistance to acidification.",
      },
      {
        prompt: "Part 2: Now the constraints change. Suppose the granite lake also becomes acidic enough to mobilize aluminum from soils and sediments. Explain why low pH releases aluminum, why this is especially harmful to fish, and how it compounds the acidification problem.",
        rubric: "At low pH, hydrogen ions promote dissolution of aluminum-bearing minerals and displace Al from soil exchange sites, raising dissolved inorganic aluminum (notably Al3+ and hydroxo species). Aluminum solubility is strongly pH-dependent (minimum near neutral, rising sharply as pH drops below ~5.5). Mobilized aluminum is toxic to fish: it precipitates and coats/clogs gills, disrupts ion (Na/Cl) regulation and osmotic balance, and causes suffocation and mortality even at low ppm levels, often more lethal than the acidity itself. This compounds acidification because the low-alkalinity lake offers no buffer to keep pH up, so both H+ stress and Al toxicity act simultaneously, and Al speciation/toxicity shifts with small pH changes. Key insight: acidification is doubly damaging in poorly buffered systems because low pH not only stresses organisms directly but unlocks toxic aluminum, turning a pH problem into a metal-toxicity problem.",
      },
    ],
  },
  {
    id: "environmental_chemistry_partitioning_koc_kow",
    slug: "concept-environmental-chemistry-partitioning-koc-kow",
    title: "Partitioning and Contaminant Fate",
    prompt: "An industrial spill releases two organic contaminants into a river: compound A is highly hydrophobic with a large octanol-water partition coefficient (high Kow), and compound B is relatively water-soluble with a low Kow. Both are released in equal mass.",
    discipline: "ENVIRONMENTAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["environmental-chemistry", "conceptual"],
    skillAreas: ["environmental-chemistry"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain what Kow and Koc represent and how they relate, then predict where each compound ends up (water column, sediment, biota) and how each spreads downstream. Explain why the high-Kow compound bioaccumulates.",
        rubric: "Kow (octanol-water partition coefficient) measures a chemical's tendency to partition into organic/lipid phases versus water; high Kow means hydrophobic/lipophilic. Koc (organic-carbon-normalized soil/sediment-water partition coefficient) measures sorption to natural organic carbon and correlates strongly with Kow (roughly log Koc proportional to log Kow). Compound A (high Kow) sorbs strongly to organic-rich sediments and suspended particles, so it deposits and persists in sediment and in fatty tissues; it travels downstream slowly (retarded), mostly attached to particles. Compound B (low Kow) stays dissolved in the water column, moves with the flow (advection/dispersion), spreads quickly and is diluted/transported far downstream. The high-Kow compound bioaccumulates because it partitions into lipids and is poorly excreted (slow depuration); concentrations rise up the food chain (biomagnification). Key insight: partitioning coefficients (Kow/Koc) predict fate by phase preference, so hydrophobic compounds concentrate in sediment and biota while hydrophilic ones move and dilute in water.",
      },
      {
        prompt: "Part 2: Now the constraints change. A flood scours and resuspends the contaminated bottom sediments years later, and the river water is unusually warm and rich in dissolved organic matter (DOM). Explain how these changes can remobilize compound A and alter its bioavailability and transport.",
        rubric: "Resuspension lifts buried sediment-bound compound A back into the water column, re-exposing it to the biota and reopening a desorption pathway; this is a delayed secondary release from the sediment reservoir. Sorption/desorption is partly reversible and temperature-dependent, so warmer water can shift partitioning and increase desorption rates. Dissolved organic matter binds hydrophobic compounds, increasing the apparent dissolved-phase concentration and facilitating downstream transport (DOM acts as a mobile carrier), but DOM-bound contaminant is often less directly bioavailable for uptake across gills/membranes than the freely dissolved form, so bioavailability effects can cut both ways. Net effect: a flood can convert a long-buried sink into an active source, spreading compound A farther and re-exposing organisms. Key insight: sediment is a reversible, long-term reservoir, so physical disturbance plus DOM and warmth can remobilize hydrophobic contaminants long after the original spill, with DOM both enhancing transport and modulating bioavailability.",
      },
    ],
  },
  {
    id: "environmental_chemistry_lake_mass_balance",
    slug: "concept-environmental-chemistry-lake-mass-balance",
    title: "Mass Balance on a Well-Mixed Lake",
    prompt: "A factory discharges a conservative (non-reactive) tracer pollutant at a steady rate into a small lake that is well-mixed and has a constant inflow and outflow. Engineers treat the lake as a continuously stirred tank reactor (CSTR) to predict the steady-state concentration.",
    discipline: "ENVIRONMENTAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["environmental-chemistry", "conceptual"],
    skillAreas: ["environmental-chemistry"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Set up the mass-balance reasoning for a well-mixed lake (in words and a plain-text equation), define the hydraulic residence time, and explain conceptually what determines the steady-state concentration of a conservative pollutant and how fast the lake approaches it.",
        rubric: "Mass balance: accumulation = inputs - outputs (+/- reaction). For a CSTR: V*dC/dt = Q*Cin + W - Q*C - k*V*C, where V is volume, Q is flow, Cin inflow concentration, W the mass loading rate, and k a first-order decay constant. For a conservative pollutant k = 0. Hydraulic residence time tau = V/Q (mean time water spends in the lake). At steady state dC/dt = 0, so for a conservative pollutant Css = (Q*Cin + W)/Q = Cin + W/Q; the steady-state concentration is set by the loading divided by the flushing flow, independent of volume for a conservative species. The approach to steady state is exponential with time constant equal to the residence time tau (about 3 to 5 residence times to effectively reach steady state). Key insight: for a well-mixed lake, the flushing rate (Q, equivalently tau) sets both the steady-state concentration of a conservative pollutant and the timescale over which it is reached.",
      },
      {
        prompt: "Part 2: Now the constraints change. The pollutant is reactive (first-order decay, rate constant k) AND a long drought halves the lake's inflow/outflow. Explain how reactivity and the reduced flow each change the steady-state concentration and the residence time, and why these can push in opposite directions.",
        rubric: "With first-order decay the steady-state balance becomes Css = (Q*Cin + W)/(Q + k*V), so reaction provides an additional loss term that lowers the steady-state concentration relative to a conservative tracer; the longer the water stays in the lake, the more decay occurs. Halving Q doubles the residence time tau = V/Q. For a conservative pollutant, halving Q (with fixed mass loading W) roughly doubles Css = Cin + W/Q because there is less flushing. But for a reactive pollutant, a longer residence time gives the decay reaction more time to remove mass, which lowers concentration; so the two effects oppose: reduced flushing raises concentration via less dilution but the resulting longer residence time enhances reactive removal. The net outcome depends on the relative size of k*V versus Q (Damkohler-type comparison): if reaction is fast relative to flushing, the longer residence time dominates and concentration may not rise much or could fall; if reaction is slow, the dilution loss dominates and concentration rises. Key insight: residence time is the lever that couples dilution and reaction, so cutting flow simultaneously concentrates a conservative pollutant and helps destroy a reactive one, and the balance is decided by how reaction rate compares to flushing rate.",
      },
    ],
  },
  {
    id: "environmental_chemistry_groundwater_fate_transport",
    slug: "concept-environmental-chemistry-groundwater-fate-transport",
    title: "Contaminant Fate and Transport in Groundwater",
    prompt: "A leaking underground storage tank releases a soluble fuel additive into a sandy aquifer. A monitoring well downgradient detects the plume, but it arrives later and at lower concentration than a simple groundwater-velocity calculation predicted, and the leading edge is smeared rather than sharp.",
    discipline: "ENVIRONMENTAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["environmental-chemistry", "conceptual"],
    skillAreas: ["environmental-chemistry"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the main processes governing contaminant transport in the aquifer (advection, dispersion, sorption/retardation, and degradation) and use them to explain why the plume arrives later, more dilute, and with a smeared front than pure advection predicts.",
        rubric: "Advection is transport at the average groundwater seepage velocity (driven by hydraulic gradient and conductivity, Darcy flux divided by porosity). Dispersion (mechanical dispersion plus molecular diffusion) spreads the plume longitudinally and transversely, smearing the sharp front into a gradual concentration gradient and lowering peak concentration. Sorption to aquifer solids retards the contaminant: the retardation factor R = 1 + (rho_b*Kd/porosity) means the solute moves slower than water by a factor R, so it arrives later. Degradation (biotic/abiotic) and dilution further reduce concentration. Together these explain the observations: retardation delays arrival, dispersion plus dilution lowers concentration and smears the leading edge, and any degradation reduces total mass. Key insight: real plumes lag and spread because sorption retards the solute relative to water and dispersion plus degradation attenuates and smears it, so advective velocity alone overpredicts arrival time and concentration.",
      },
      {
        prompt: "Part 2: Now the constraints change. The aquifer becomes anaerobic and the additive is biodegradable under anaerobic conditions, while a second co-released compound is a dense non-aqueous phase liquid (DNAPL) that pools at the bottom of the aquifer. Explain how the redox condition changes the additive's fate and why the DNAPL behaves as a long-term source that defeats simple pump-and-treat.",
        rubric: "Redox conditions control which microbial degradation pathways operate: many compounds degrade readily under aerobic conditions but slowly (or via different pathways) when anaerobic, while some (e.g., certain chlorinated solvents) preferentially degrade anaerobically via reductive dechlorination. So becoming anaerobic can either slow or accelerate the additive's natural attenuation depending on the compound; degradation rate, daughter products, and electron-acceptor sequence (O2, NO3-, Mn/Fe, SO4, methanogenesis) all shift. A DNAPL is denser than water and sinks, pooling at the aquifer base and trapped as residual ganglia in pores; it dissolves only slowly into passing groundwater (mass-transfer limited), continuously resupplying the dissolved plume for years to decades. Pump-and-treat removes dissolved-phase contaminant but cannot efficiently extract the trapped DNAPL source, so concentrations rebound when pumping stops (tailing and rebound), defeating simple remediation. Key insight: redox state governs whether and how the dissolved contaminant degrades, while a DNAPL acts as a persistent, slowly dissolving source that makes the dissolved plume self-renewing and resistant to pump-and-treat unless the source itself is addressed.",
      },
    ],
  },
];
