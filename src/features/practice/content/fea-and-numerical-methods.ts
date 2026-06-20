import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION:
  // Two bar elements in PARALLEL between the same two nodes; each element
  // stiffness is k = A*E/L, and parallel elements between the same node
  // pair add directly: k_eq = k1 + k2. With node 1 fixed and force F at
  // node 2, u2 = F / k_eq. The trap is series thinking (1/k = 1/k1+1/k2).
  // Bar 1 (steel):    k1 = A1*E1/L1 = 200e-6 * 200e9 / 0.8 = 50e6 N/m.
  // Bar 2 (aluminum): k2 = A2*E2/L2 = 150e-6 *  72e9 / 0.6 = 18e6 N/m.
  // k_eq = 68e6 N/m. F = 27.2 kN.
  // u2 = 27.2e3 / 68e6 = 4.0e-4 m = 0.40 mm.
  {
    id: "fe_bar_element_stiffness",
    slug: "fea-axial-bar-element-stiffness",
    title: "Two Bars Sharing a Node: Tip Displacement",
    prompt:
      "A loaded point (node 2) is connected to a single fixed support\n" +
      "(node 1) by TWO axial bar elements running side by side along the\n" +
      "load direction (both span the same two nodes):\n" +
      "  Bar 1 (steel):    A1 = 200 mm², E1 = 200 GPa, L1 = 0.8 m\n" +
      "  Bar 2 (aluminum): A2 = 150 mm², E2 =  72 GPa, L2 = 0.6 m\n\n" +
      "A tensile force F = 27.2 kN is applied at node 2 (node 1 is fully\n" +
      "fixed). Form each element's axial stiffness from its geometry and\n" +
      "material, assemble the reduced system for the single free DOF, and\n" +
      "solve for the displacement of node 2.\n\n" +
      "Report u2 in mm, rounded to 2 decimal places.",
    discipline: "MECHANICAL",
    difficulty: "EASY",
    eloWeight: 16,
    tags: ["assembly", "parallel-springs", "displacement"],
    skillAreas: ["fea", "mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.4,
    tolerance: 0.01,
    unit: "mm",
    hints: [
      "Each axial bar element behaves as a spring with stiffness k = A·E/L. Compute k1 and k2 separately, watching units (mm² → m², GPa → Pa).",
      "Both bars connect the SAME fixed node to the SAME loaded node, so they share the one free DOF. Elements sharing a node pair this way combine like springs in parallel, not in series.",
      "Add the two element stiffnesses to get the single reduced stiffness, then divide the applied force by it. Convert the resulting displacement from metres to mm.",
    ],
    solution:
      "**Governing principle — direct stiffness method.** Each axial bar element acts as a linear spring with stiffness $k = AE/L$. The key topological fact is that BOTH bars connect the SAME fixed node (1) to the SAME loaded node (2). When two elements share the same node pair, their stiffnesses add directly at the shared DOF — they are in *parallel*, not series. The trap is to treat the differing lengths/areas as a clue for series behaviour and add compliances $1/k$.\n\n" +
      "**Step 1 — Element 1 (steel) stiffness.** Convert units: $A_1 = 200\\,\\text{mm}^2 = 200\\times10^{-6}\\,\\text{m}^2$, $E_1 = 200\\,\\text{GPa} = 200\\times10^{9}\\,\\text{Pa}$.\n" +
      "$$k_1 = \\frac{A_1 E_1}{L_1} = \\frac{200\\times10^{-6}\\cdot 200\\times10^{9}}{0.8} = 50\\times10^{6}\\ \\text{N/m}.$$\n\n" +
      "**Step 2 — Element 2 (aluminum) stiffness.** $A_2 = 150\\times10^{-6}\\,\\text{m}^2$, $E_2 = 72\\times10^{9}\\,\\text{Pa}$.\n" +
      "$$k_2 = \\frac{A_2 E_2}{L_2} = \\frac{150\\times10^{-6}\\cdot 72\\times10^{9}}{0.6} = 18\\times10^{6}\\ \\text{N/m}.$$\n\n" +
      "**Step 3 — Assemble the single free DOF.** With node 1 fixed, the only equation is $K_{22}\\,u_2 = F$ where $K_{22} = k_1 + k_2 = 50\\times10^{6} + 18\\times10^{6} = 68\\times10^{6}\\ \\text{N/m}$ (parallel combination).\n\n" +
      "**Step 4 — Solve.** $u_2 = F/K_{22} = \\dfrac{27.2\\times10^{3}}{68\\times10^{6}} = 4.0\\times10^{-4}\\ \\text{m} = 0.40\\ \\text{mm}.$\n\n" +
      "**Key insight:** Elements between an identical node pair combine like parallel springs; series compliance addition would wrongly give $u_2 \\approx 1.51$ mm.\n\n" +
      "**Final answer: $u_2 = 0.40$ mm.**",
  },
  // SOLUTION:
  // Three nodes, two bar elements in series, BOTH ends fixed
  // (u1 = u3 = 0), load applied at the interior node 2.
  // Only one free DOF (u2). The two springs now act in PARALLEL on
  // node 2 (each connects node 2 to a fixed wall), so the reduced
  // stiffness is K22 = k1 + k2.
  // k1 = A*E/L1 = 300e-6 * 200e9 / 0.5 = 120e6 N/m.
  // k2 = A*E/L2 = 300e-6 * 200e9 / 0.3 = 200e6 N/m.
  // K22 = 320e6 N/m. F = 80 kN at node 2.
  // u2 = 80e3 / 320e6 = 2.5e-4 m = 0.25 mm.
  {
    id: "fe_bar_nodal_displacement",
    slug: "fea-bar-nodal-displacement",
    title: "Interior-Node Displacement, Both Ends Fixed",
    prompt:
      "A straight axial member (E = 200 GPa, uniform area A = 300 mm²) is\n" +
      "modeled with two bar elements and three collinear nodes:\n" +
      "  Element 1: nodes 1-2, length L1 = 0.5 m\n" +
      "  Element 2: nodes 2-3, length L2 = 0.3 m\n\n" +
      "BOTH outer nodes are fully fixed (u1 = u3 = 0). An axial force\n" +
      "F = 80 kN is applied at the interior node 2.\n\n" +
      "Assemble the global stiffness matrix, apply the boundary\n" +
      "conditions, and solve the resulting reduced system for u2.\n\n" +
      "Report u2 in mm, rounded to 3 decimal places.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["assembly", "boundary-conditions", "displacement"],
    skillAreas: ["fea", "mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.25,
    tolerance: 0.004,
    unit: "mm",
    hints: [
      "Each element is a spring of stiffness k = A·E/L. Compute k1 and k2 from the two lengths (the area and E are the same for both).",
      "With BOTH outer nodes fixed, node 2 is the only free DOF, and each element ties node 2 to a fixed wall. From node 2's viewpoint the two springs act in parallel.",
      "The reduced stiffness for the single equation is K22 = k1 + k2. Solve K22·u2 = F, then convert metres to mm.",
    ],
    solution:
      "**Governing principle — assembly then boundary conditions.** The global system is $\\mathbf{K}\\mathbf{u} = \\mathbf{F}$ for three nodes. After fixing the two outer nodes ($u_1 = u_3 = 0$), only node 2 remains free. Each element ties node 2 to a fixed wall, so from node 2's viewpoint the two springs act in *parallel*: the reduced stiffness is the sum. The trap is series thinking — here the springs do not share the load end-to-end; each independently resists $u_2$ against ground.\n\n" +
      "**Step 1 — Element stiffnesses** ($A = 300\\times10^{-6}\\,\\text{m}^2$, $E = 200\\times10^{9}\\,\\text{Pa}$, same for both):\n" +
      "$$k_1 = \\frac{AE}{L_1} = \\frac{300\\times10^{-6}\\cdot 200\\times10^{9}}{0.5} = 120\\times10^{6}\\ \\text{N/m},$$\n" +
      "$$k_2 = \\frac{AE}{L_2} = \\frac{300\\times10^{-6}\\cdot 200\\times10^{9}}{0.3} = 200\\times10^{6}\\ \\text{N/m}.$$\n\n" +
      "**Step 2 — Reduced stiffness.** Striking rows/columns 1 and 3 from the assembled $3\\times3$ matrix leaves the single diagonal term $K_{22} = k_1 + k_2 = 120\\times10^{6} + 200\\times10^{6} = 320\\times10^{6}\\ \\text{N/m}.$\n\n" +
      "**Step 3 — Solve** $K_{22}\\,u_2 = F$ with $F = 80\\,\\text{kN}$:\n" +
      "$$u_2 = \\frac{80\\times10^{3}}{320\\times10^{6}} = 2.5\\times10^{-4}\\ \\text{m} = 0.250\\ \\text{mm}.$$\n\n" +
      "**Key insight:** Both elements anchor to ground, so they share the free node, not the force — hence stiffnesses add.\n\n" +
      "**Final answer: $u_2 = 0.250$ mm.**",
  },
  // SOLUTION:
  // Conceptual: a sharp reentrant (concave) corner in a linear-elastic
  // model produces a theoretical stress SINGULARITY -> the FEA peak
  // stress keeps rising as the mesh is refined and never converges.
  // The correct engineering response is NOT to trust/refine the peak,
  // but to recognize the geometry is non-physical (real parts have a
  // fillet) and either add a fillet or use a non-local criterion.
  // Distractors are common wrong reactions.
  {
    id: "fe_element_axial_stress",
    slug: "fea-element-axial-stress",
    title: "Diverging Peak Stress at a Sharp Corner",
    prompt:
      "You run a linear-elastic 2D model of a bracket with a sharp, square\n" +
      "(zero-radius) reentrant corner. You refine the mesh three times near\n" +
      "the corner; each time the peak von Mises stress at the corner rises\n" +
      "instead of settling toward a value, while stresses elsewhere\n" +
      "converge nicely.\n\n" +
      "What is the correct interpretation and action?",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["stress-singularity", "reentrant-corner", "convergence"],
    skillAreas: ["fea", "mechanics-of-materials"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "It is a stress singularity from the zero-radius corner; the peak is mesh-dependent and meaningless. Model a realistic fillet (or use a non-local/notch criterion) instead of trusting the corner value.",
        correct: true,
      },
      {
        id: "b",
        label:
          "The mesh is simply not fine enough yet; keep refining until the corner stress finally converges, then report that converged peak.",
      },
      {
        id: "c",
        label:
          "The material model is wrong; switching to an elastic-plastic model will make the corner stress converge with elastic refinement.",
      },
      {
        id: "d",
        label:
          "It is a solver round-off problem; tightening the linear-solver tolerance will stabilize the peak stress at the corner.",
      },
    ],
    hints: [
      "Ask what the exact (theoretical) elasticity solution does at a zero-radius reentrant corner, not just what the FEA mesh does.",
      "Notice that stresses converge everywhere EXCEPT the corner. A quantity that keeps climbing without bound as you refine is the signature of a singularity, not of an unconverged-but-finite value.",
      "Decide whether the right move is to keep chasing the number or to fix the model. Real parts have fillets; consider what changes the physics versus what only changes the discretization.",
    ],
    solution:
      "**Governing concept — stress singularities in linear elasticity.** At a sharp, zero-radius reentrant (concave) corner, the exact theory-of-elasticity solution predicts stress that grows without bound: $\\sigma \\sim r^{\\lambda-1}$ as $r\\to 0$ with $\\lambda < 1$, so $\\sigma \\to \\infty$. This is a *singularity*. Because the true value is infinite, no finite mesh can converge to it — each refinement simply samples closer to the spike and reports a higher peak. That stresses converge *everywhere else* but climb only at the corner is the diagnostic fingerprint of a singularity, not of an unconverged-but-finite field.\n\n" +
      "**Why (a) is correct.** The corner value is mesh-dependent and physically meaningless. The engineering fix is to restore the real geometry — add a fillet (giving a finite, convergent stress concentration) — or apply a non-local / notch-stress / fracture-mechanics criterion that does not depend on the pointwise peak.\n\n" +
      "**Why the distractors are misconceptions.**\n" +
      "- **(b)** 'Keep refining until it converges' — it never will; the limit is infinite. This is the central trap.\n" +
      "- **(c)** Switching to elastic-plastic changes the constitutive model but the geometric singularity remains; plasticity caps stress only by smearing strain, and the question concerns the elastic peak — it does not make the elastic field converge.\n" +
      "- **(d)** This is not a solver/round-off artifact; the linear solve is well-posed and tightening tolerances does nothing to a genuine continuum singularity.\n\n" +
      "**Key insight:** Distinguish discretization error (curable by refinement) from a modeling/geometry singularity (curable only by fixing the model).\n\n" +
      "**Final answer: Option (a)** — it is a geometric stress singularity; the corner value is meaningless, so model a realistic fillet or use a non-local criterion.",
  },
  // SOLUTION:
  // Stepped bar in SERIES, fixed at node 1, force F at tip node 3.
  // u3 = F*(1/k1 + 1/k2), k1 = A1*E/L1, k2 = A2*E/L2, E = 70 GPa.
  // k1 = 400e-6 * 70e9 / 0.4 = 70e6 N/m.
  // k2 = 200e-6 * 70e9 / 0.3 = 46.667e6 N/m.
  // u3 = 50e3 * (1/70e6 + 1/46.667e6)
  //    = 50e3 * (1.42857e-8 + 2.14286e-8)
  //    = 50e3 * 3.57143e-8 = 1.7857e-3 m = 1.79 mm.
  {
    id: "fe_stepped_bar_assembly",
    slug: "fea-stepped-bar-two-element-assembly",
    title: "Two-Element Stepped Bar Tip Displacement",
    prompt:
      "A stepped axial bar (aluminum, E = 70 GPa) is fixed at node 1 and\n" +
      "modeled with two bar elements in series:\n" +
      "  Element 1 (nodes 1-2): A1 = 400 mm², L1 = 0.4 m\n" +
      "  Element 2 (nodes 2-3): A2 = 200 mm², L2 = 0.3 m\n\n" +
      "A single axial tensile force F = 50 kN is applied at the tip,\n" +
      "node 3. Build the 3x3 global stiffness, impose u1 = 0, and solve\n" +
      "the reduced system for the tip displacement.\n\n" +
      "Report u3 in mm, rounded to 2 decimal places.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["assembly", "stepped-bar", "series"],
    skillAreas: ["fea", "mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 1.79,
    tolerance: 0.03,
    unit: "mm",
    hints: [
      "Build each element stiffness k = A·E/L. The two segments have different areas AND lengths, so k1 ≠ k2.",
      "The load is at the free tip and node 1 is fixed, so both elements carry the full force in turn — they are in series along the load path.",
      "For springs in series the compliances (1/k) add: u3 = F·(1/k1 + 1/k2). Compute, then convert metres to mm.",
    ],
    solution:
      "**Governing principle — series load path.** Here the bar is fixed at node 1 and loaded only at the free tip (node 3), with node 2 carrying no external load. The same axial force flows through both segments in turn, so the elements are in *series*: their compliances $1/k$ add and the tip displacement is the sum of both segment stretches. (Equivalently, assemble the $3\\times3$ matrix, strike row/column 1, and solve the $2\\times2$ system.)\n\n" +
      "**Step 1 — Segment stiffnesses** ($E = 70\\times10^{9}\\,\\text{Pa}$):\n" +
      "$$k_1 = \\frac{A_1 E}{L_1} = \\frac{400\\times10^{-6}\\cdot 70\\times10^{9}}{0.4} = 70\\times10^{6}\\ \\text{N/m},$$\n" +
      "$$k_2 = \\frac{A_2 E}{L_2} = \\frac{200\\times10^{-6}\\cdot 70\\times10^{9}}{0.3} = 46.667\\times10^{6}\\ \\text{N/m}.$$\n\n" +
      "**Step 2 — Add compliances** (series):\n" +
      "$$\\frac{1}{k_1} + \\frac{1}{k_2} = 1.4286\\times10^{-8} + 2.1429\\times10^{-8} = 3.5714\\times10^{-8}\\ \\text{m/N}.$$\n\n" +
      "**Step 3 — Tip displacement** with $F = 50\\,\\text{kN}$:\n" +
      "$$u_3 = F\\left(\\frac{1}{k_1}+\\frac{1}{k_2}\\right) = 50\\times10^{3}\\cdot 3.5714\\times10^{-8} = 1.7857\\times10^{-3}\\ \\text{m} = 1.79\\ \\text{mm}.$$\n\n" +
      "**Key insight:** Because the load is at the free end, both segments transmit the full force and stretch sequentially — compliances add, unlike the parallel (both-ends-anchored) case.\n\n" +
      "**Final answer: $u_3 = 1.79$ mm.**",
  },
  // SOLUTION:
  // Free DOF count after BC. 3D frame of 8-node second-order brick
  // (HEX20) solid elements -> SOLID continuum elements carry only 3
  // translational DOF per node (no rotational DOF). 40 nodes.
  // Total DOF = 40 * 3 = 120. One face of 6 nodes is fully fixed
  // (encastre) -> remove 6 * 3 = 18 DOF.
  // Free DOF = 120 - 18 = 102.
  // Traps: using 6 DOF/node (that's shells/beams), or forgetting to
  // subtract constraints.
  {
    id: "fe_dof_count_truss",
    slug: "fea-truss-total-dof-count",
    title: "Free DOF of a Constrained Solid Mesh",
    prompt:
      "A 3D component is meshed with second-order (20-node) hexahedral\n" +
      "SOLID continuum elements. The mesh has 40 nodes in total.\n\n" +
      "One face of the part, comprising 6 of those nodes, is fully\n" +
      "encastred (all of its degrees of freedom are fixed). No other\n" +
      "constraints are applied.\n\n" +
      "How many UNCONSTRAINED (free) degrees of freedom remain in the\n" +
      "global system that the solver must actually solve for?\n\n" +
      "Report a whole number.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["degrees-of-freedom", "solid-elements", "boundary-conditions"],
    skillAreas: ["fea", "structural-analysis"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 102,
    tolerance: 0.5,
    unit: "DOF",
    hints: [
      "First fix how many DOF each node carries. Solid (continuum) elements have only translational DOF per node — unlike shells/beams which also carry rotations.",
      "Total DOF = (DOF per node) × (number of nodes). The 20-node-per-element detail is a distractor; the count that matters is the total node count.",
      "A fully encastred node has ALL of its DOF removed. Subtract (fixed nodes × DOF per node) from the total to get the free DOF.",
    ],
    solution:
      "**Governing principle — DOF bookkeeping by element type.** The size of the solver's reduced system is (DOF per node × number of nodes) minus the constrained DOF. The decisive fact is the *element family*: solid (continuum) elements carry only the 3 translational DOF per node ($u_x, u_y, u_z$); they have NO rotational DOF. Rotations belong to shell and beam elements. The '20-node' second-order detail is a distractor — it affects accuracy, not the DOF-per-node count.\n\n" +
      "**Step 1 — DOF per node.** Solid continuum element ⇒ 3 translational DOF/node.\n\n" +
      "**Step 2 — Total DOF.** $40\\ \\text{nodes} \\times 3 = 120$ DOF.\n\n" +
      "**Step 3 — Remove constraints.** One encastred face fixes all DOF on its 6 nodes: $6 \\times 3 = 18$ DOF removed.\n\n" +
      "**Step 4 — Free DOF.** $120 - 18 = 102.$\n\n" +
      "**Key insight / trap:** Using 6 DOF/node (correct for shells/beams) would wrongly give $240 - 36 = 204$; forgetting to subtract the constraints would give 120. Solids = 3 DOF/node, and encastre removes every DOF on each fixed node.\n\n" +
      "**Final answer: 102 free DOF.**",
  },
  // SOLUTION:
  // Element-selection judgment. For a thin, bending-dominated plate you
  // want either shell elements or, if solid, second-order elements with
  // enough through-thickness elements. A SINGLE layer of first-order
  // (linear, fully integrated) hexes through the thickness suffers SHEAR
  // LOCKING -> grossly over-stiff in bending. Correct best practice
  // among the options: use shell elements (or 2nd-order solids), not one
  // layer of linear hexes; reduced integration alone risks hourglassing.
  {
    id: "fe_shape_function_partition_unity",
    slug: "fea-shape-function-partition-of-unity",
    title: "Choosing Elements for a Thin Bending Plate",
    prompt:
      "You must mesh a thin, flat steel plate (thickness ≈ 2 mm, in-plane\n" +
      "dimensions ≈ 300 mm) that is loaded primarily in bending. You want\n" +
      "accurate displacement and bending stress without an enormous model.\n\n" +
      "Which meshing choice is the soundest engineering practice?",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 28,
    tags: ["element-selection", "shell-elements", "shear-locking"],
    skillAreas: ["fea", "mechanics-of-materials"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Use shell elements (or, if solid, second-order elements with several through-thickness layers); they capture bending efficiently and avoid the shear locking of thin linear solids.",
        correct: true,
      },
      {
        id: "b",
        label:
          "Use a single layer of fully integrated first-order (linear) hexahedra through the thickness; one good layer is enough for bending.",
      },
      {
        id: "c",
        label:
          "Use a single layer of first-order tetrahedra; tets mesh complex geometry easily so accuracy is guaranteed.",
      },
      {
        id: "d",
        label:
          "Use linear hexes with reduced integration and no hourglass control to remove all locking at minimum cost.",
      },
    ],
    hints: [
      "Think about what fails when you bend a thin part modeled with too few/low-order elements through the thickness: fully integrated linear solids exhibit shear locking and read far too stiff.",
      "Weigh efficiency too: a thin plate resolved with enough solid elements to bend properly is expensive. What element formulation is purpose-built for thin bending?",
      "Be wary of 'fixes' that introduce new problems — reduced integration without hourglass control invites zero-energy (hourglass) modes.",
    ],
    solution:
      "**Governing concept — element selection for thin bending.** A thin, bending-dominated plate is the textbook case for *shell* elements: they enforce the through-thickness kinematics (Kirchhoff/Mindlin) analytically, capturing bending with one element through the thickness and minimal DOF. If you insist on solids, you need second-order elements with several layers through the thickness to represent the linear-through-thickness bending strain.\n\n" +
      "**Why (a) is correct.** Shells (or 2nd-order solids with multiple through-thickness layers) bend accurately and efficiently, and they avoid the shear locking that plagues thin, low-order fully integrated solids.\n\n" +
      "**Why the distractors are misconceptions.**\n" +
      "- **(b)** A single layer of fully integrated linear hexes through the thickness exhibits *shear locking*: spurious shear strain makes the element read far too stiff in bending — displacements and stresses come out grossly low. One layer is never enough for bending.\n" +
      "- **(c)** Linear tetrahedra (constant strain) are the worst choice for bending — overly stiff and inaccurate; easy meshing does not guarantee accuracy.\n" +
      "- **(d)** Reduced integration *without* hourglass control removes locking but introduces zero-energy (hourglass) modes that can pollute or wreck the solution; this trades one defect for a worse one.\n\n" +
      "**Key insight:** Match element formulation to the deformation mode — thin bending wants shells (or richer solids), and beware 'fixes' (reduced integration) that spawn hourglassing.\n\n" +
      "**Final answer: Option (a)** — use shell elements (or second-order solids with several through-thickness layers).",
  },
  // SOLUTION:
  // Mesh-convergence judgment: WHEN do you trust an h-refinement study?
  // Trustworthy when the quantity of interest changes negligibly between
  // successive refinements AND is converging monotonically toward an
  // asymptote in a smooth-stress region (away from singularities), i.e.
  // the discretization error is small. NOT when the peak is at a
  // singularity (never converges), not when only one mesh was run, not
  // when finer mesh merely runs faster.
  {
    id: "fe_linear_tet_bending",
    slug: "fea-linear-tetrahedron-bending-stiffness",
    title: "When Is a Convergence Study Trustworthy?",
    prompt:
      "An analyst presents an h-refinement (mesh-convergence) study for the\n" +
      "maximum stress in a filleted shaft and claims the result is\n" +
      "\"converged and trustworthy.\"\n\n" +
      "Which observation BEST justifies trusting the reported value?",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["convergence", "h-refinement", "mesh-quality"],
    skillAreas: ["fea", "structural-analysis"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "The quantity of interest lies in a smooth-stress region and changes by less than ~1-2% between the last two successive mesh refinements, approaching an asymptote.",
        correct: true,
      },
      {
        id: "b",
        label:
          "The finest mesh has the largest number of elements, so by definition it is the most accurate and can be reported directly.",
      },
      {
        id: "c",
        label:
          "The peak stress increases steadily with every refinement, showing the mesh is responsive to the load.",
      },
      {
        id: "d",
        label:
          "The single mesh used has elements with aspect ratios near 1, so no further refinement study is needed.",
      },
    ],
    hints: [
      "A convergence study needs MORE than one mesh — trust comes from comparing successive refinements, not from a single 'nice-looking' mesh.",
      "Convergence means the quantity of interest stops changing as the mesh is refined (settles toward an asymptote). A value that keeps climbing with every refinement is diverging, not converging.",
      "Also check WHERE the quantity lives: peak stress at a sharp feature may never converge. A small change between the last two meshes in a smooth-stress region is the trustworthy signal.",
    ],
    solution:
      "**Governing concept — what 'converged' actually means.** An h-refinement study is trustworthy when the quantity of interest (QOI) (1) is computed in a *smooth-stress region* (away from singularities), and (2) changes negligibly between *successive* refinements while approaching an asymptote. That combination signals that discretization error is small and the value is mesh-independent. A filleted shaft has a finite, real stress concentration, so the peak there *can* converge — provided you verify it actually does across meshes.\n\n" +
      "**Why (a) is correct.** A <~1–2% change between the last two meshes in a smooth region, trending to an asymptote, is the textbook signature of convergence and bounds the discretization error.\n\n" +
      "**Why the distractors are misconceptions.**\n" +
      "- **(b)** 'Most elements ⇒ most accurate' confuses element count with demonstrated convergence; a single dense mesh proves nothing without comparison to coarser meshes.\n" +
      "- **(c)** A peak that *increases steadily with every refinement* is diverging — the hallmark of a singularity, the opposite of convergence.\n" +
      "- **(d)** Good aspect ratio on ONE mesh is a quality check, not a convergence study; element shape alone does not establish mesh-independence.\n\n" +
      "**Key insight:** Convergence is a *trend across meshes* in a *smooth region*, not a property of any single mesh or of raw element count.\n\n" +
      "**Final answer: Option (a)** — the QOI is in a smooth region and changes by ~1–2% between the last two refinements, approaching an asymptote.",
  },
  // SOLUTION:
  // One Newton-Raphson step on f(x) = x^3 - 2x - 5 = 0, x0 = 2.
  // f(2) = 8 - 4 - 5 = -1.
  // f'(x) = 3x^2 - 2 ; f'(2) = 12 - 2 = 10.
  // x1 = x0 - f(x0)/f'(x0) = 2 - (-1)/10 = 2 + 0.1 = 2.1.
  // Report x1 = 2.100.
  {
    id: "fe_h_vs_p_refinement",
    slug: "fea-h-versus-p-refinement",
    title: "One Newton-Raphson Iteration",
    prompt:
      "A nonlinear FEA solver drives its residual to zero with the\n" +
      "Newton-Raphson method. As a scalar stand-in for one global\n" +
      "iteration, consider the equation\n\n" +
      "    f(x) = x³ − 2x − 5 = 0,\n\n" +
      "starting from the initial guess x0 = 2.\n\n" +
      "Perform exactly ONE Newton-Raphson update and report the resulting\n" +
      "estimate x1.\n\n" +
      "Report x1 rounded to 3 decimal places.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["newton-raphson", "nonlinear", "iteration"],
    skillAreas: ["fea", "matlab"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 2.1,
    tolerance: 0.01,
    hints: [
      "The Newton-Raphson update is x1 = x0 − f(x0)/f'(x0). You need both the function value and its derivative at the starting point.",
      "Differentiate f(x) = x³ − 2x − 5 to get f'(x) = 3x² − 2, then evaluate f and f' at x0 = 2.",
      "Watch the sign: f(2) is negative, so the correction −f/f' is positive and the estimate moves up from 2.",
    ],
    solution:
      "**Governing principle — Newton-Raphson iteration.** Newton's method linearizes the residual at the current estimate and steps to where that tangent line crosses zero:\n" +
      "$$x_{1} = x_0 - \\frac{f(x_0)}{f'(x_0)}.$$\n" +
      "In nonlinear FEA this is exactly the global iteration with $f'$ playing the role of the tangent stiffness and $f$ the residual.\n\n" +
      "**Step 1 — Evaluate the function** at $x_0 = 2$:\n" +
      "$$f(2) = 2^3 - 2(2) - 5 = 8 - 4 - 5 = -1.$$\n\n" +
      "**Step 2 — Evaluate the derivative.** $f'(x) = 3x^2 - 2$, so\n" +
      "$$f'(2) = 3(4) - 2 = 12 - 2 = 10.$$\n\n" +
      "**Step 3 — Apply the update:**\n" +
      "$$x_1 = 2 - \\frac{-1}{10} = 2 + 0.1 = 2.100.$$\n\n" +
      "**Key insight / trap:** Mind the sign — since $f(2)<0$, the correction $-f/f'$ is positive, nudging the estimate *up* toward the true root ($\\approx 2.0946$). Dropping the negative sign would push it the wrong way to 1.9.\n\n" +
      "**Final answer: $x_1 = 2.100$.**",
  },
  // SOLUTION:
  // EXPERT conceptual: conditioning, convergence order, truncation vs
  // round-off. Newton-Raphson has QUADRATIC convergence near a simple
  // root (error squares each step) -> fastest given option. The other
  // statements are classic misconceptions: ill-conditioning amplifies
  // errors regardless of solver; smaller step h reduces truncation error
  // but eventually round-off dominates (so error does NOT go to zero);
  // higher-order quadrature is not always more accurate for non-smooth
  // integrands. Correct = quadratic-convergence statement.
  {
    id: "fe_singular_stiffness_rbm",
    slug: "fea-singular-stiffness-rigid-body-modes",
    title: "Convergence, Conditioning, and Error Sources",
    prompt:
      "A senior engineer quizzes you on the numerical foundations behind an\n" +
      "implicit nonlinear FEA solve (Newton iterations, an ill-conditioned\n" +
      "stiffness matrix, and Gauss quadrature for the element integrals).\n\n" +
      "Exactly ONE of the following statements is correct. Which is it?",
    discipline: "MECHANICAL",
    difficulty: "EXPERT",
    eloWeight: 38,
    tags: ["convergence-order", "conditioning", "numerical-error"],
    skillAreas: ["fea", "matlab"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Near a simple root, Newton-Raphson converges quadratically: the error is roughly squared each iteration, so the number of correct digits roughly doubles per step.",
        correct: true,
      },
      {
        id: "b",
        label:
          "Continually shrinking the finite-difference step h drives the total error to zero, because truncation error keeps decreasing without limit.",
      },
      {
        id: "c",
        label:
          "A high condition number of the stiffness matrix only slows convergence; it cannot amplify input or round-off errors in the computed displacements.",
      },
      {
        id: "d",
        label:
          "A higher-order Gauss quadrature rule always yields a more accurate integral, even for integrands with kinks or discontinuities inside the element.",
      },
    ],
    hints: [
      "Recall the convergence order of Newton's method near a simple root, and contrast it with how the other three statements describe error behavior.",
      "Two classic traps: shrinking the finite-difference step h does NOT drive total error to zero (round-off eventually dominates), and a high condition number DOES amplify errors, not merely slow things down.",
      "Gauss quadrature is exact only for smooth (polynomial-like) integrands; kinks or discontinuities break that guarantee regardless of order. The remaining statement, about doubling correct digits per step, is the true one.",
    ],
    solution:
      "**Governing concept — numerical foundations of an implicit nonlinear solve.** The question tests three pillars: convergence order, matrix conditioning, and the truncation-vs-round-off trade-off. Exactly one statement respects all the theory.\n\n" +
      "**Why (a) is correct.** Near a *simple* root, Newton-Raphson is quadratically convergent: $|e_{k+1}| \\approx C|e_k|^2$. Squaring the error each step means the number of correct significant digits roughly *doubles* per iteration — the fastest behaviour among the options and the reason Newton dominates implicit FEA when the tangent is good.\n\n" +
      "**Why the distractors are misconceptions.**\n" +
      "- **(b)** Shrinking the finite-difference step $h$ reduces *truncation* error ($\\sim h$) but inflates *round-off* error ($\\sim \\varepsilon_{mach}/h$). Total error has a minimum at some $h^\\*$ and then *grows* as $h\\to 0$ — it does NOT go to zero.\n" +
      "- **(c)** A high condition number $\\kappa(\\mathbf{K})$ *amplifies* the effect of input and round-off errors on the solution (relative error scales like $\\kappa$ times the data perturbation) — it is far more than a speed issue.\n" +
      "- **(d)** $n$-point Gauss quadrature is exact only up to degree $2n-1$ *polynomials*; for integrands with kinks or discontinuities inside the element, raising the order does not guarantee more accuracy — the smoothness assumption is violated.\n\n" +
      "**Key insight:** Each wrong option ignores a limit — round-off floors finite-difference accuracy, conditioning amplifies (not just slows) error, and quadrature accuracy hinges on smoothness, not order alone.\n\n" +
      "**Final answer: Option (a)** — near a simple root Newton-Raphson converges quadratically, roughly doubling correct digits each step.",
  },
];
