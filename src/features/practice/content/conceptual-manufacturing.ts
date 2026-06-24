import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "manufacturing_bracket_cast_forge_machine",
    slug: "concept-manufacturing-bracket-process-choice",
    title: "Choosing a Process for a Structural Bracket",
    prompt: "Your team needs a steel suspension bracket that carries high cyclic loads. Marketing forecasts 500 units in year one, but design changes are still likely. You must recommend a primary manufacturing process.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["manufacturing", "conceptual"],
    skillAreas: ["manufacturing"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Compare casting, forging, and machining-from-billet for this bracket. Given the load profile (high cyclic / fatigue) and the modest, uncertain volume, which would you pick and why? Address tooling cost, lead time, and mechanical properties.",
        rubric: "An excellent answer notes forging gives the best fatigue performance because grain flow follows the part contour and there is no internal porosity, but it requires expensive dies and long lead time that do not amortize over 500 uncertain units. Casting has low per-part cost at volume but risks porosity and shrinkage defects that act as fatigue crack initiation sites, and also needs tooling. Machining from billet has near-zero tooling cost, fast turnaround, tolerates design changes, and yields good (wrought) properties, at high per-part cost and material waste. For 500 uncertain, fatigue-critical units, machining from billet (or wrought stock) is the pragmatic choice; reserve forging for high volume once the design is frozen. Key insight: process selection is driven jointly by load criticality (which favors wrought grain structure) and by volume/maturity (which determines whether tooling cost can be amortized).",
      },
      {
        prompt: "Now the constraints change. The program is greenlit for 50,000 units per year and the design is frozen. Does your recommendation change, and what new design or process steps would you add to maximize fatigue life at this volume?",
        rubric: "At 50,000 units with a frozen design, forging becomes the clear winner: die cost amortizes over high volume and the low per-part cost and superior fatigue properties dominate. The candidate should add steps such as designing for forging (draft angles, generous radii, parting line placement to keep grain flow continuous), a finish-machining operation on critical mating surfaces, and post-process treatments like shot peening to induce compressive residual stress and heat treatment to set the desired microstructure. They may mention closed-die over open-die for net-shape and reduced machining. Key insight: high volume plus a frozen design flips the economics so tooling-intensive forging wins, and fatigue life is then maximized by combining grain-flow-aware geometry with compressive surface treatments.",
      },
    ],
  },
  {
    id: "manufacturing_weld_frame_distortion",
    slug: "concept-manufacturing-weld-residual-stress",
    title: "Distortion in a Welded Frame",
    prompt: "A welded steel machine base comes off the line bowed and out of flatness, and one corner cracked weeks after assembly even though it never saw service load. The welds themselves passed visual inspection.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["manufacturing", "conceptual"],
    skillAreas: ["manufacturing"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the root cause of both the bowing and the delayed cracking in terms of welding thermal cycles. Why does residual stress arise, and how can locked-in stress cause a crack with no external load?",
        rubric: "An excellent answer explains that the weld and heat-affected zone are heated locally and expand, but are constrained by the cold surrounding metal; on cooling the weld metal contracts and is prevented from shrinking freely, leaving tensile residual stress in and near the weld balanced by compression elsewhere. Non-uniform contraction across the section produces a bending moment, causing bowing/distortion. Delayed cracking can occur because the locked-in tensile residual stress can approach yield and, combined with a brittle/hardened HAZ microstructure and absorbed hydrogen, drive hydrogen-induced (cold) cracking hours to days later without any external load. Stress concentrations and triaxial constraint accelerate this. Key insight: welding creates a self-equilibrating residual stress field from constrained thermal contraction, and that stored stress alone, plus a susceptible microstructure and hydrogen, can both distort the part and crack it without service loading.",
      },
      {
        prompt: "Now the constraints change. You cannot redesign the joint geometry and the alloy is fixed, but you control welding sequence, fixturing, preheat, and post-processing. What practical measures reduce distortion and prevent the delayed cracking, and what is the tradeoff of each?",
        rubric: "Strong measures include: balanced/symmetric weld sequence and back-step or skip welding to even out shrinkage (reduces distortion but slows the operation); fixturing or clamping to restrain motion (controls distortion but can raise residual stress and cracking risk); preheat and controlled interpass temperature plus slower cooling to avoid a brittle HAZ and let hydrogen diffuse out (reduces cracking but adds time/energy and can coarsen grain); low-hydrogen consumables and dry storage to cut diffusible hydrogen; post-weld heat treatment (stress relief) to relax residual stress (effective but costly and can affect base-metal properties); reduced heat input or smaller multi-pass beads. The candidate should weigh distortion control against residual stress, since over-restraint trades one problem for the other. Key insight: distortion and cracking are managed by controlling the thermal history and hydrogen, and there is an inherent tension because restraining distortion tends to increase locked-in stress, so the fix is balancing sequence, preheat, and stress relief rather than clamping harder.",
      },
    ],
  },
  {
    id: "manufacturing_tolerance_cost_shaft",
    slug: "concept-manufacturing-tolerance-cost-tradeoff",
    title: "Tolerances Versus Cost on a Shaft",
    prompt: "A drawing for a rotating shaft specifies a 0.005 mm diameter tolerance and a very fine surface finish on the entire length. Manufacturing pushes back that the part is far more expensive than the function seems to require.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["manufacturing", "conceptual"],
    skillAreas: ["manufacturing"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain why tightening tolerance and surface finish drives cost up so sharply (roughly exponentially), referencing the process chain. When is a tight tolerance genuinely justified versus over-specified?",
        rubric: "An excellent answer explains that achieving tighter tolerance requires moving from turning to grinding to lapping/honing, each step adding machine time, fixturing, slower feeds, more inspection, and higher scrap, so cost rises non-linearly (often described as exponential) as tolerance shrinks. Finer surface finish similarly demands extra finishing passes and tighter process control. Tight tolerance is justified where it controls a real function: bearing/seal fits, alignment, dynamic balance, fatigue (where surface finish governs crack initiation). It is over-specified when applied uniformly to non-functional features that only need to clear or look acceptable. Key insight: cost grows steeply as you approach process capability limits, so tolerances should be allocated only to features whose function demands them, not blanketed across the whole part.",
      },
      {
        prompt: "Now the constraints change. Only the two bearing journals actually need precision; the rest of the shaft just needs to clear surrounding parts. How would you re-specify the drawing, and how does tolerance stack-up and datum/GD&T strategy factor into hitting the assembly fit?",
        rubric: "A strong answer relaxes the general tolerance and fine finish to the non-functional regions and applies the tight diameter tolerance and fine finish only to the bearing journals, allowing the shaft to be rough-turned overall and ground only at the journals. It establishes the journals (or a common axis) as datums and uses GD&T such as runout/concentricity referenced to those datums so the fit and alignment are controlled relative to what matters, rather than chasing absolute size everywhere. The candidate should discuss tolerance stack-up: looser tolerances elsewhere must still sum within the assembly clearance, and choosing datums that mirror the functional interfaces minimizes accumulated error. Key insight: applying precision selectively to functional features and anchoring GD&T to functional datums delivers the required fit at far lower cost than uniformly tight tolerancing.",
      },
    ],
  },
  {
    id: "manufacturing_additive_vs_subtractive_manifold",
    slug: "concept-manufacturing-additive-vs-subtractive",
    title: "Additive Versus Subtractive for a Manifold",
    prompt: "An engineer wants to make a hydraulic manifold with internal conformal cooling-style passages that curve through the block. The question is whether to 3D print it in metal or machine it conventionally.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["manufacturing", "conceptual"],
    skillAreas: ["manufacturing"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Compare metal additive (e.g., powder-bed fusion) against subtractive machining for this manifold. What does additive enable here that machining cannot, and what are additive's real drawbacks regarding properties, surface finish, and cost?",
        rubric: "An excellent answer notes additive enables internal curved/conformal passages and consolidated geometry that machining or drilling cannot produce (machined passages must be straight drilled holes with plugged cross-drillings and added joints/leak paths). Additive also avoids per-part tooling and suits low volume and complex geometry. Drawbacks: as-built surface finish is rough (especially on internal passages and down-facing surfaces), anisotropic and sometimes porous microstructure, residual stress and warping, build-orientation dependence, slow build rate and high machine/powder cost, and the need for support removal and post-machining of sealing faces. Key insight: additive wins when geometric complexity (internal organic passages) creates value machining cannot match, but it trades that for inferior as-built finish/properties and higher per-part cost, so it is not a default substitute for machining.",
      },
      {
        prompt: "Now the constraints change. The internal passages have a hard cleanliness and surface-roughness requirement, and the sealing faces must be flat and precise. What hybrid workflow and design-for-AM choices let you keep the additive benefit while meeting these requirements?",
        rubric: "A strong answer proposes a hybrid approach: print the complex passage geometry, then post-process with stress relief / HIP to reduce porosity and residual stress, finish-machine the sealing faces and bores to tolerance, and treat internal passages with abrasive flow machining, chemical/electro-polishing, or similar to meet roughness and cleanliness, followed by thorough cleaning to remove trapped powder. Design-for-AM choices: orient the build and design self-supporting passage angles (avoid shallow overhangs that trap powder and worsen finish), add machining stock on sealing faces, design powder-evacuation/drain paths and access for internal finishing, and keep wall thickness manufacturable. Key insight: additive and subtractive are complementary, so the right workflow prints the geometry that only AM can make, then uses post-processing and targeted machining to deliver the finish, flatness, and cleanliness that AM alone cannot.",
      },
    ],
  },
  {
    id: "manufacturing_injection_molding_dfm",
    slug: "concept-manufacturing-molding-dfm-draft",
    title: "DFM for an Injection-Molded Housing",
    prompt: "A plastic enclosure design comes to you with thick solid bosses, sharp internal corners, walls that vary from 1 mm to 5 mm, and zero draft on the side walls. It is to be injection molded at high volume.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["manufacturing", "conceptual"],
    skillAreas: ["manufacturing"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Walk through the design-for-manufacturing problems with this part. Why are draft angles, uniform wall thickness, and avoiding thick sections so important in injection molding? Tie each issue to a specific defect.",
        rubric: "An excellent answer covers: zero draft prevents ejection and causes drag marks/scuffing and scrap, so a few degrees of draft on walls is needed for release from the mold. Non-uniform/thick walls cause uneven cooling, leading to sink marks and voids in thick regions, internal residual stress, and warpage; thick bosses behave the same way. Solid thick sections also lengthen cycle time (cooling dominates) and waste material, so they should be cored out and replaced with ribbed/coring to keep nominal wall roughly uniform (rule of thumb: ribs ~60 percent of wall). Sharp internal corners create stress concentrations and impede flow, so fillets are needed. Each defect ties to a cause: draft to ejection, wall uniformity to sink/warp, radii to stress and flow. Key insight: injection-molding DFM centers on uniform wall thickness and adequate draft because the dominant physics is differential cooling and ejection, and violating those rules directly produces sink marks, warpage, and ejection damage.",
      },
      {
        prompt: "Now the constraints change. The customer insists on a visibly thick, solid-looking grip region and a Class-A cosmetic surface on the show face with no sink marks. How do you achieve the apparent bulk and the cosmetic finish without the defects, and how do gate location and the mold surface factor in?",
        rubric: "A strong answer keeps the actual wall thickness uniform by coring out the thick grip from the back so it only looks solid, using ribs/gussets for stiffness, and possibly gas-assist injection to hollow a thick section while keeping a smooth outer skin. To protect the Class-A face: locate the gate so sink/weld lines and gate vestige fall away from the show surface and so flow fills evenly (avoid hesitation and weld lines on the cosmetic face), polish the mold (high mold surface finish transfers to the part), control packing pressure and cooling to avoid sink opposite ribs/bosses, and consider material/colorant choice. They may mention putting ejector marks and gate on the non-show side. Key insight: you fake bulk by coring or gas-assist while preserving uniform walls, and you protect the cosmetic face by steering gate location, flow, and packing so that sinks, weld lines, and gate marks land anywhere but the show surface.",
      },
    ],
  },
  {
    id: "manufacturing_sheet_metal_to_machined",
    slug: "concept-manufacturing-process-selection-volume",
    title: "Why the Process Changes With Volume",
    prompt: "A startup prototypes an aluminum chassis panel using CNC machining and laser-cut/bent sheet metal. Now they are scaling to mass production and an advisor says the process and even the part geometry should change.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["manufacturing", "conceptual"],
    skillAreas: ["manufacturing"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain why a process that is ideal for prototypes (CNC machining, laser cutting, manual bending) is usually the wrong choice for mass production. Frame it in terms of fixed (tooling) cost versus variable (per-part) cost and the resulting break-even logic.",
        rubric: "An excellent answer frames total cost as fixed cost plus per-part cost times volume. Prototype processes (CNC, laser, manual bending) have near-zero tooling cost but high per-part cost (machine time, labor), making them economical at low volume. Mass-production processes (stamping/progressive dies, die casting, extrusion) carry high tooling cost but very low per-part cost and fast cycle times, so they win above a break-even volume where the amortized tooling per part falls below the prototype per-part cost. The candidate should articulate the break-even crossover and that scaling shifts the optimum toward tooling-intensive, high-rate processes; they may also note repeatability and quality consistency improve with dedicated tooling. Key insight: process choice follows a break-even between amortized fixed tooling cost and per-part cost, so volume, not just geometry, determines which process is economically correct.",
      },
      {
        prompt: "Now the constraints change. The team commits to stamping for the high-volume panel. What geometry and design-for-manufacturing changes must the part undergo to suit stamping rather than machining, and what new failure modes must they design against?",
        rubric: "A strong answer explains that a machined-style geometry must be redesigned for sheet forming: maintain roughly uniform thickness (no thick solid bosses or pockets that machining allowed), add generous bend radii (sharp bends crack/thin the material), respect minimum flange lengths and hole-to-edge/hole-to-bend distances, account for springback by over-bending, add relief notches at bend intersections, and design features formable by stamping (lances, embosses, beads for stiffness) instead of machined ribs. New failure modes to design against: tearing/necking and thinning in deep draws, wrinkling in compressive regions, springback causing dimensional error, and edge cracking from work-hardened sheared edges. They should consider grain direction and material formability (n and r values). Key insight: stamping replaces removing material with forming sheet, so the part must be reconceived around uniform thickness, bend radii, and formability limits, and the dominant risks shift to tearing, wrinkling, and springback rather than tool wear or chip control.",
      },
    ],
  },
];
