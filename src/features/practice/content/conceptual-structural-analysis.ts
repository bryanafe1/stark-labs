import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "structural_analysis_load_path_canopy",
    slug: "concept-structural-analysis-load-path-canopy",
    title: "Tracing the Load Path of a Cantilever Canopy",
    prompt: "A flat steel canopy projects 4 meters out from the face of a building, supported only along its back edge where it bolts to the building's columns. Snow piles up on the outer tip.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["structural-analysis", "conceptual"],
    skillAreas: ["structural-analysis"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Trace the load path of the snow weight from the tip of the canopy all the way into the ground, and identify which internal force dominates at the back edge connection.",
        rubric: "Should trace gravity load on the snow into the canopy deck, through beams/the deck spanning back to the supported edge, into the back-edge connection, then into the building columns and down to the foundation and soil. Should identify the canopy as a cantilever, so the back edge sees a large bending moment (M = load times lever arm) plus shear, not just a vertical reaction. Should note the connection must resist that moment, often as a tension-compression couple (top of connection in tension, bottom in compression, or vice versa) plus the vertical shear. Key insight: every load must have a continuous path to the foundation, and for a cantilever the governing demand at the support is the bending moment produced by the load times its distance from the support, not merely the vertical force.",
      },
      {
        prompt: "Part 2: Now the constraints change -- the architect adds a single diagonal tie rod from the canopy tip up to a higher point on the building face. How does the load path and the governing force at the original back connection change?",
        rubric: "Should recognize the tie rod creates a second, shorter and stiffer load path, turning the canopy into a propped/tied cantilever rather than a pure cantilever. The tie carries tension and pulls much of the tip load directly up to the building, dramatically reducing the bending moment at the back connection. Should note the structure becomes statically indeterminate (more reactions/members than equilibrium equations), so internal forces now depend on relative stiffness of the rod versus the canopy beam. Should mention the rod introduces a horizontal component that must be resisted at both ends. Key insight: adding a member creates an alternate, stiffer load path that attracts load in proportion to its stiffness, relieving the original path and converting a determinate cantilever into an indeterminate system.",
      },
    ],
  },
  {
    id: "structural_analysis_determinacy_beam",
    slug: "concept-structural-analysis-determinacy-beam",
    title: "Determinate vs Indeterminate Beam Behavior",
    prompt: "A single steel beam spans a 10 meter gap. In design A it sits on a pin at one end and a roller at the other (a simple span). In design B the same beam is rigidly fixed into heavy concrete walls at both ends.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["structural-analysis", "conceptual"],
    skillAreas: ["structural-analysis"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Classify each design as statically determinate or indeterminate, and explain how that classification changes the way you would solve for the internal forces.",
        rubric: "Should count reactions versus equilibrium equations: the simple span (pin + roller) has 3 reaction components and 3 equilibrium equations, so it is statically determinate and solvable by statics alone. The fixed-fixed beam has 6 reaction components (vertical, horizontal, and moment at each end) versus 3 equations, so it is indeterminate to the 3rd degree and statics alone is insufficient. Should explain the indeterminate case requires compatibility/deflection conditions (slope and deflection are zero at fixed ends) and material stiffness (EI) to solve, via methods like slope-deflection, moment distribution, or stiffness matrix. Key insight: determinacy is set by comparing unknown reactions plus internal releases against available equilibrium equations -- determinate structures yield to statics alone, indeterminate ones demand compatibility and stiffness.",
      },
      {
        prompt: "Part 2: Now the constraints change -- a support settles slightly (one end drops 10 mm) and separately the beam is heated uniformly. For each design, does this induce internal stresses, and why?",
        rubric: "Should explain that in the determinate simple span, support settlement and free thermal expansion induce essentially no internal stress: the beam can rotate/translate to accommodate the movement because the roller allows the length change and the geometry is not over-constrained. In the indeterminate fixed-fixed beam, the same settlement forces curvature and the heating is restrained, so large self-equilibrated internal forces (moments, axial thrust) develop even with no applied load. Should connect this to redundancy: extra restraints make the structure sensitive to imposed deformations. Key insight: indeterminate structures resist imposed deformations (settlement, temperature, shrinkage) by developing internal stresses, while determinate structures relieve those deformations by free movement -- redundancy buys robustness but costs sensitivity to imposed displacement.",
      },
    ],
  },
  {
    id: "structural_analysis_redundancy_truss",
    slug: "concept-structural-analysis-redundancy-truss",
    title: "Redundancy and Progressive Collapse in a Truss",
    prompt: "A long-span roof is carried by a parallel-chord steel truss over a crowded public lobby. A junior engineer proposes removing several diagonal web members to save cost, arguing the remaining members are barely stressed.",
    discipline: "CIVIL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["structural-analysis", "conceptual"],
    skillAreas: ["structural-analysis"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the structural role of redundancy here and why low stress in members under normal loads is a weak argument for removing them.",
        rubric: "Should define redundancy as the presence of alternate load paths beyond the minimum needed for stability, so that if one member fails the load redistributes rather than triggering collapse. Should explain that a member being lightly stressed under service load does not mean it is unimportant: it may be a critical alternate path that activates only after another member yields, buckles, or is damaged (fire, impact, fatigue). Should warn that removing members reduces the degree of indeterminacy toward a statically determinate (and potentially mechanism-prone) state, raising progressive-collapse risk -- especially over an occupied public space. Key insight: redundancy is insurance against the unexpected; a member's low service stress measures its current duty, not its value as a backup load path after damage.",
      },
      {
        prompt: "Part 2: Now the constraints change -- suppose the truss is left fully intact but is statically determinate by design (no redundant members). What is the consequence if a single diagonal buckles, and how does that differ from an indeterminate version of the same truss?",
        rubric: "Should explain that in a determinate truss every member is essential: losing one member removes a needed equilibrium path, turning the structure into a mechanism (unstable), so a single member failure can cause total collapse with no warning or redistribution. In an indeterminate (redundant) truss, the lost diagonal sheds its force to alternate members, which may overload but can prevent immediate collapse and give visible warning (deflection, yielding). Should note determinate structures are easier to analyze and insensitive to settlement/temperature, but they have zero margin against member loss. Key insight: a determinate truss has no fault tolerance -- any member failure is a collapse mechanism -- so for life-safety-critical spans the loss of efficiency from redundancy is a deliberate trade for resilience.",
      },
    ],
  },
  {
    id: "structural_analysis_frame_failure_sway",
    slug: "concept-structural-analysis-frame-failure-sway",
    title: "Where a Portal Frame Fails Under Lateral Load",
    prompt: "A single-bay, single-story portal frame (two columns and a beam, with rigid moment connections at the beam-column joints and pinned bases) carries gravity load and is then hit by a strong lateral wind/seismic push from one side.",
    discipline: "CIVIL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["structural-analysis", "conceptual"],
    skillAreas: ["structural-analysis"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Under the lateral load, where do the largest moments concentrate and where would you expect plastic hinges to form, ultimately defining the frame's failure mechanism?",
        rubric: "Should explain lateral load makes the frame sway, putting the rigid beam-column joints into high moment; with pinned bases the column moments are zero at the base and peak at the top (at the joints). Should identify plastic hinges forming at the beam ends near the joints (and at column tops), and that the sway/beam mechanism forms when enough hinges create a kinematic mechanism. Should mention the windward column may go into net tension/uplift while the leeward column compresses, and that P-delta (gravity load acting through sway displacement) amplifies the moments. Key insight: in a moment frame the joints and member ends attract the peak moments under sway, and failure is a plastic-hinge mechanism formed at those high-moment locations, not a uniform overstress.",
      },
      {
        prompt: "Part 2: Now the constraints change -- the column bases are made fully fixed instead of pinned. How does this shift the moment distribution, the likely hinge locations, and the frame's stiffness and ductility?",
        rubric: "Should explain fixing the bases adds moment restraint, so column moment no longer goes to zero at the base; moment is now shared between the joint tops and the bases, roughly halving the peak joint moment for a given drift and greatly increasing lateral stiffness (less sway). Should note plastic hinges can now also form at the column bases, so a full sway mechanism requires more hinges (typically hinges at beam ends plus column bases), generally raising the lateral load capacity. Should add that fixed bases attract larger foundation moments (costlier footings) and that distributing demand to more hinge locations can improve energy dissipation/ductility if detailed properly. Key insight: fixing the bases stiffens the frame and redistributes moment from the joints down to the bases, changing the collapse mechanism to require more plastic hinges and trading larger foundation demands for higher strength and reduced drift.",
      },
    ],
  },
  {
    id: "structural_analysis_moment_distribution_stiffness",
    slug: "concept-structural-analysis-moment-distribution-stiffness",
    title: "Moment Distribution Intuition at a Joint",
    prompt: "Three beams of different lengths and sizes all frame rigidly into one common interior column joint of a building. A heavy load is applied to only one of those beams, inducing an unbalanced moment at the joint.",
    discipline: "CIVIL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["structural-analysis", "conceptual"],
    skillAreas: ["structural-analysis"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Using moment distribution intuition, explain qualitatively how the unbalanced moment at the joint gets shared among the members and what physical principle governs the split.",
        rubric: "Should explain that the rigid joint must rotate as a unit until moment is balanced, and the unbalanced moment is distributed to each connected member in proportion to its rotational stiffness, captured by distribution factors DF = k_member / sum(k). Member stiffness k is proportional to EI/L (roughly 4EI/L for a far-fixed end, 3EI/L for a far-pinned end), so stiffer members (large EI, short L) take a larger share. Should mention a fraction of the distributed moment carries over to the far end (carry-over factor about one half for fixed far ends). Key insight: a rigid joint shares moment in proportion to member stiffness (EI/L) -- stiff, short members attract the most moment -- which is exactly what distribution factors quantify.",
      },
      {
        prompt: "Part 2: Now the constraints change -- one of the three beams has its far end changed from rigidly fixed to a simple (pinned) support. How does that change the distribution at the joint and the carry-over behavior?",
        rubric: "Should explain releasing the far end to a pin reduces that member's effective rotational stiffness from about 4EI/L to 3EI/L (a modified stiffness for a pinned far end), so its distribution factor drops and it now attracts a smaller share of the unbalanced moment. The other members pick up the difference because distribution factors must still sum to one. Should note the carry-over to that pinned far end is zero (a pin cannot sustain moment), unlike the one-half carry-over to a fixed far end. Key insight: the boundary condition at a member's far end changes its stiffness, which reshuffles the distribution factors and the carry-over -- pinning a far end makes that member softer, so it sheds moment to its stiffer neighbors and carries nothing over.",
      },
    ],
  },
  {
    id: "structural_analysis_triangles_deflection",
    slug: "concept-structural-analysis-triangles-deflection",
    title: "Why Trusses Use Triangles and What Controls Deflection",
    prompt: "A designer sketches a rectangular (four-bar) frame of pin-connected bars and a triangular (three-bar) frame of pin-connected bars, and asks why bridges and roof trusses are always built from triangles rather than rectangles.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["structural-analysis", "conceptual"],
    skillAreas: ["structural-analysis"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why the triangle is stable and rigid while the pin-connected rectangle is not, and connect this to how truss members carry load.",
        rubric: "Should explain that with frictionless pins the rectangle is a mechanism: it can shear/collapse into a parallelogram without changing any bar length, because the geometry is not fixed by the bar lengths alone. The triangle is uniquely determined by its three side lengths (it cannot change shape without changing a member length), so it is geometrically stable. Should connect this to truss action: in an ideal pin-jointed triangulated truss, members carry only axial force (tension or compression), which is the most material-efficient way to resist load (no bending). Should note the rectangle would need a diagonal or rigid (moment) joints to be stable. Key insight: triangulation makes geometry determinate and stable so members work purely in axial tension/compression, the efficient load-carrying mode, whereas a pinned rectangle is an unstable mechanism.",
      },
      {
        prompt: "Part 2: Now the constraints change -- two truss designs span the same gap with the same total amount of steel: design A is a shallow (short-depth) truss and design B is a deep (tall) truss. Which deflects less under the same load and why?",
        rubric: "Should explain the deep truss deflects far less and is stronger in bending: a truss resists overall bending as a couple between the top (compression) and bottom (tension) chords, and increasing depth d increases the lever arm so chord forces F (about M/d) drop for the same applied moment. Greater depth increases the effective moment of inertia (roughly area times depth squared), and beam-type deflection scales strongly with depth, so the deep truss is dramatically stiffer for the same material. Should note practical limits: very deep trusses raise web member lengths, buckling concerns, and architectural/clearance constraints. Key insight: a truss carries global bending as a chord force couple, so depth is the most powerful lever on both strength and deflection -- doubling depth roughly halves chord forces and sharply cuts deflection for the same steel.",
      },
    ],
  },
];
