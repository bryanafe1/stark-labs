import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "biomaterials_why_titanium_hip",
    slug: "concept-biomaterials-why-titanium-hip",
    title: "Why Titanium for a Hip Stem",
    prompt: "A startup is designing a cementless hip stem and the materials lead proposes Ti-6Al-4V over 316L stainless steel and CoCrMo. They want you to justify the choice on engineering grounds, not just because it is common.",
    discipline: "BIOMEDICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["biomaterials", "conceptual"],
    skillAreas: ["biomaterials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Make the case for titanium. Why is Ti-6Al-4V attractive for a load-bearing, cementless hip stem compared with 316L stainless and CoCrMo? Address the body environment specifically.",
        rubric: "An excellent answer covers: titanium forms a stable, self-healing passive TiO2 oxide layer giving excellent corrosion resistance in chloride-rich, oxygenated body fluid, far better than 316L which is prone to pitting and crevice corrosion. It notes titanium has the lowest elastic modulus of the three (around 110 GPa vs ~200 for stainless and ~210-230 for CoCr), which is closer to cortical bone (~15-20 GPa) and reduces stress shielding. It notes good specific strength, low density, and excellent osseointegration / bioinertness so bone can bond to or grow onto the surface (important for cementless fixation). It should acknowledge titanium has poor wear/galling resistance so it is a poor bearing surface choice (CoCr or ceramic preferred there). Key insight: titanium wins for the stem because its passive oxide, lower modulus, and osseointegration suit a fixed, bone-loaded component, even though it is a bad articulating surface.",
      },
      {
        prompt: "Part 2: Now the constraints change. The same alloy is proposed for the femoral head that articulates against a polyethylene cup. Should you keep Ti-6Al-4V there, and what changes your reasoning?",
        rubric: "An excellent answer reverses the recommendation for the bearing surface: Ti-6Al-4V has poor tribological behavior, low hardness, and tends to gall and generate metallic and oxide wear debris, which accelerates polyethylene wear and can cause third-body abrasion and metallosis. It recognizes the controlling requirement at an articulating interface is wear resistance and surface hardness, not modulus or osseointegration, so CoCrMo or a ceramic (alumina/zirconia-toughened) head is preferred. It may note wear debris drives osteolysis and aseptic loosening, the dominant failure mode for joint replacements. Key insight: material selection is function-specific within one device; the property that dominates shifts from corrosion/modulus on the stem to wear/hardness on the bearing surface.",
      },
    ],
  },
  {
    id: "biomaterials_stress_shielding_plate",
    slug: "concept-biomaterials-stress-shielding-plate",
    title: "Stress Shielding Under a Bone Plate",
    prompt: "A trauma fixation plate made of stiff CoCr alloy heals the fracture, but follow-up imaging shows the bone under the plate has become noticeably thinner and porous after a year.",
    discipline: "BIOMEDICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["biomaterials", "conceptual"],
    skillAreas: ["biomaterials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain mechanistically why the bone weakened, linking modulus mismatch to the biological response. Why does a stiffer plate make this worse?",
        rubric: "An excellent answer explains stress shielding: bone and implant act as parallel load paths, and load shares in proportion to stiffness, so a much stiffer plate carries most of the load and unloads the adjacent bone. It invokes Wolff's law / mechanotransduction: bone remodels to the mechanical strain it experiences, so chronically understressed bone resorbs, losing density and becoming porous (disuse atrophy). It connects this explicitly to modulus mismatch (CoCr ~210-230 GPa vs cortical bone ~15-20 GPa, more than a 10x difference) so the stiffer the plate, the larger the fraction of load diverted from bone. Key insight: bone is a living tissue that needs mechanical stimulus; a high-modulus implant starves it of strain and triggers resorption.",
      },
      {
        prompt: "Part 2: Now the constraints change. You may not change the plate geometry envelope, but you can change material and you must still provide enough initial stability to heal the fracture. What design and material strategies reduce stress shielding without compromising early healing?",
        rubric: "An excellent answer proposes lowering effective stiffness while keeping adequate strength: switch to a lower-modulus alloy (titanium ~110 GPa, or beta-titanium alloys ~55-85 GPa), or use composite/polymer materials (e.g. carbon-fiber PEEK) tuned toward bone modulus. It may suggest geometric stiffness reduction (thinner sections, slots, locking constructs that allow controlled micromotion to promote callus). It should raise the tradeoff: too compliant risks excess motion, nonunion, or fatigue failure, and discusses staged load transfer (rigid enough early, gradually loading bone), possibly bioresorbable plates that fade away to restore load to bone. It notes EI = E times I, so geometry and modulus both set construct stiffness. Key insight: the goal is to match construct stiffness to bone closely enough to keep bone loaded, balanced against enough stability for healing and against fatigue safety.",
      },
    ],
  },
  {
    id: "biomaterials_resorbable_vs_permanent",
    slug: "concept-biomaterials-resorbable-vs-permanent",
    title: "Resorbable or Permanent Fixation Screw",
    prompt: "For a pediatric ligament reattachment, a surgeon must choose between a permanent titanium interference screw and a bioresorbable PLA-based screw.",
    discipline: "BIOMEDICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["biomaterials", "conceptual"],
    skillAreas: ["biomaterials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Compare the design philosophies of a permanent versus a degradable implant for this case. What are the engineering and clinical arguments for choosing the resorbable screw, and how is the material designed to disappear safely?",
        rubric: "An excellent answer frames degradation vs permanence: a resorbable device transfers load to healing tissue over time, leaves nothing behind to remove or interfere with later surgery or imaging, and avoids long-term issues like permanent stress shielding or implant migration. It explains the degradation mechanism for PLA/PGA polyesters: hydrolysis of ester bonds in the aqueous body environment, with byproducts (lactic/glycolic acid) metabolized via natural pathways (Krebs cycle), eventually cleared as CO2 and water. It notes the critical design requirement is matching the degradation rate to the healing rate so strength is retained while tissue heals. For a child it adds the advantage of not leaving permanent hardware in growing bone. Key insight: a resorbable implant is a temporary scaffold whose central design problem is synchronizing loss of strength with gain of tissue strength.",
      },
      {
        prompt: "Part 2: Now the constraints change. Post-market data show some PLA screws cause a delayed inflammatory reaction and sterile fluid collections (cysts) months after implantation. Explain what likely went wrong with the degradation behavior and how you would re-engineer it.",
        rubric: "An excellent answer identifies acidic byproduct accumulation: bulk hydrolysis can release lactic/glycolic acid faster than tissue can buffer or clear it, dropping local pH and triggering an inflammatory foreign-body response, plus autocatalysis (acid accelerating further hydrolysis) and crystalline fragments that resist clearance and provoke chronic inflammation. It may note bulk vs surface erosion and that fast bulk degradation dumps acid in a burst. Re-engineering options: copolymer ratio tuning (e.g. PLGA blends) for steadier rates, lower molecular weight or controlled crystallinity, slower-degrading or composite materials (PLA with tricalcium phosphate or other buffering/osteoconductive filler to neutralize acid), and verifying degradation rate matches healing in vivo not just in vitro. Key insight: degradation is not just about disappearing but about the rate and chemistry of byproduct release, which must stay within what local tissue can buffer and clear.",
      },
    ],
  },
  {
    id: "biomaterials_corrosion_modular_junction",
    slug: "concept-biomaterials-corrosion-modular-junction",
    title: "Corrosion at a Modular Taper",
    prompt: "A modular hip implant with a CoCr head on a Ti-6Al-4V stem taper is generating elevated cobalt and chromium ion levels in the patient bloodstream, with corrosion debris found at the taper junction.",
    discipline: "BIOMEDICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["biomaterials", "conceptual"],
    skillAreas: ["biomaterials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the corrosion mechanisms at play. Why does a metal junction inside the body corrode even when each alloy is individually passive and corrosion-resistant, and why is a dissimilar-metal junction especially vulnerable?",
        rubric: "An excellent answer identifies fretting-corrosion (mechanically assisted crevice corrosion): cyclic micromotion at the taper repeatedly abrades the passive oxide film, exposing bare metal that re-passivates and consumes oxygen, while the tight crevice traps fluid, depletes oxygen, and lowers pH locally, driving accelerated localized attack. It identifies galvanic coupling between dissimilar metals (CoCr and Ti) with different electrochemical potentials, accelerating corrosion of the more active member. It explains the body environment as an aggressive chloride electrolyte that attacks depassivated surfaces and promotes pitting/crevice attack. It connects this to release of Co and Cr ions and debris. Key insight: the danger is not the bulk alloys but the junction, where micromotion strips the protective oxide faster than it can heal inside an oxygen-starved, low-pH, chloride-rich crevice, compounded by galvanic mismatch.",
      },
      {
        prompt: "Part 2: Now the constraints change. Marketing insists on keeping the device modular for intraoperative flexibility, so you cannot make it a single monolithic part. What material, surface, and design measures would you use to suppress the corrosion while keeping modularity?",
        rubric: "An excellent answer keeps the taper but attacks the drivers of fretting-corrosion: improve the mechanical fit and assembly to minimize micromotion (tighter taper tolerances, optimized taper angle/length, controlled assembly impaction force, cleanliness/no debris at assembly). Reduce galvanic mismatch by matching alloys (e.g. CoCr-on-CoCr or Ti-on-Ti taper) or use a ceramic head to remove the metal-metal galvanic couple entirely. Use surface engineering: harder, more corrosion-resistant coatings or surface treatments (e.g. nitriding, TiN, oxidized-zirconium) to resist oxide abrasion. Reduce stiffness mismatch and bending moment at the junction (shorter head offset, larger taper). Possibly improve passivation/electropolishing. It should weigh tradeoffs (ceramic brittleness, coating delamination). Key insight: since you cannot eliminate the junction, you minimize micromotion, eliminate the galvanic couple, and toughen the oxide so the passive film survives cyclic loading.",
      },
    ],
  },
  {
    id: "biomaterials_sterilization_uhmwpe",
    slug: "concept-biomaterials-sterilization-uhmwpe",
    title: "Sterilization Damage to a Polymer Liner",
    prompt: "A UHMWPE acetabular liner sterilized by gamma irradiation in air shows brittle cracking and excessive wear after several years, far worse than expected from the polymer itself.",
    discipline: "BIOMEDICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["biomaterials", "conceptual"],
    skillAreas: ["biomaterials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain how the sterilization method, not just the base material, caused the failure. What does gamma irradiation in air do to UHMWPE over time?",
        rubric: "An excellent answer explains that gamma irradiation breaks polymer chains and creates free radicals; in the presence of oxygen these radicals drive oxidative chain scission over months to years (shelf and in-vivo aging), reducing molecular weight, increasing crystallinity locally, and embrittling the material. This raises stiffness and lowers fracture toughness and fatigue resistance, leading to cracking, delamination, and accelerated wear. It should distinguish the dual effect of radiation: crosslinking (which can improve wear resistance) versus oxidation (which degrades properties), with air storage tilting the balance toward harmful oxidation because trapped radicals react with O2. Key insight: the sterilization process altered the polymer chemistry, so a residual-radical-plus-oxygen aging mechanism, not the virgin material, is the root cause of embrittlement.",
      },
      {
        prompt: "Part 2: Now the constraints change. You must still sterilize and you want to exploit radiation crosslinking to improve wear resistance, but eliminate the oxidative embrittlement. What process changes achieve this, and what new tradeoff do you introduce?",
        rubric: "An excellent answer proposes irradiating/packaging in an inert or vacuum environment to prevent oxidation, plus a post-irradiation thermal treatment to quench residual free radicals: remelting (heat above the melt point to eliminate radicals, at the cost of reduced crystallinity and some loss of strength/fatigue) or annealing below the melt (retains crystallinity but may leave some residual radicals). Alternatively switch to non-radiation sterilization (ethylene oxide or gas plasma) which avoids radical generation but then loses the crosslinking wear benefit, or add antioxidants such as vitamin E to scavenge radicals (highly crosslinked vitamin-E-stabilized UHMWPE). It states the tradeoff clearly: crosslinking improves wear but reduces fatigue/fracture resistance, and radical-quenching methods trade off crystallinity vs residual oxidation risk. Key insight: the fix is to control the environment and the radicals, capturing crosslinking benefits while preventing oxidation, accepting a wear-versus-toughness balance.",
      },
    ],
  },
  {
    id: "biomaterials_fatigue_heart_valve",
    slug: "concept-biomaterials-fatigue-heart-valve",
    title: "Fatigue of a Nitinol Stent in the Body",
    prompt: "A self-expanding Nitinol stent placed in a peripheral artery fractures after roughly two years, even though static bench tests showed large safety margins against yield.",
    discipline: "BIOMEDICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["biomaterials", "conceptual"],
    skillAreas: ["biomaterials"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why a static test passing does not guarantee survival in the body. What is the loading environment that drives fatigue failure of a vascular implant, and roughly how many cycles must it survive?",
        rubric: "An excellent answer distinguishes static strength from fatigue: the implant sees cyclic loading from the heartbeat (pulsatile pressure, vessel pulsation, plus limb motion/bending/crushing for peripheral vessels), so failure is driven by cyclic crack initiation and growth at stress concentrations, not by exceeding yield. It quantifies the cycle count: about 40 million cycles per year from heartbeat (~1-1.5 Hz), so a device must endure on the order of hundreds of millions to over a billion cycles for a multi-year life. It notes high-cycle fatigue, mean strain plus alternating strain, and that small defects, inclusions, or surface flaws and stress risers (struts, welds) initiate cracks. It may add corrosion-fatigue: the chloride body environment lowers fatigue resistance versus dry bench air. Key insight: in vivo failure is a high-cycle fatigue and corrosion-fatigue problem governed by cyclic strain amplitude and defects, which a single static overload test cannot reveal.",
      },
      {
        prompt: "Part 2: Now the constraints change. The vessel sits across a flexing joint (e.g. the femoropopliteal artery), adding large bending and torsion to the pulsatile load. How does this change your material/design approach, and why is Nitinol used here in particular?",
        rubric: "An excellent answer explains why Nitinol suits this site: superelasticity (stress-induced martensitic transformation) lets it recover very large strains (~8%) without plastic deformation, so it tolerates severe bending/crushing and self-expands, and it has a long fatigue life at the moderate strain amplitudes superelasticity provides. With added bending/torsion the design must reduce peak strain amplitude: flexible/helical or open-cell geometries, fewer rigid connectors, lower strut strain, and careful fatigue-strain analysis (strain-based, not stress-based, fatigue design). It stresses corrosion resistance via the TiO2/passive oxide and electropolished, defect-minimized surfaces to avoid corrosion-fatigue initiation, plus biocompatibility concern over nickel release if the oxide is compromised. It should mention validating against a strain-life (constant-life) diagram and accelerated durability testing to the required cycle count. Key insight: at a flexing site the controlling variable is cyclic strain amplitude, so you pick a superelastic, fatigue-tolerant material and a compliant geometry that keeps local strain low while resisting corrosion-fatigue.",
      },
    ],
  },
];
