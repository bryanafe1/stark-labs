import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_fea",
  slug: "fea-fundamentals-and-mesh-convergence",
  title: "FEA Fundamentals & Mesh Convergence",
  summary:
    "How does software know if your part survives? It chops your impossibly complex shape into millions of tiny springs, solves {K}{u}={F}, and hands you a stress plot. This lesson takes you from the axial-bar element k = AE/L all the way to the plot twist that fools even senior engineers: the stress singularity that NEVER converges.",
  discipline: "MECHANICAL",
  difficulty: "MEDIUM",
  estMinutes: 28,
  tags: [
    "FEA",
    "finite element method",
    "stiffness matrix",
    "mesh convergence",
    "h-refinement",
    "stress singularity",
    "shape functions",
    "verification",
    "interview-prep",
  ],
  practiceSlug: "fea-mesh-convergence",
  objectives: [
    "Tell the FEA origin story in one breath: chop the continuum into elements, fake the field with shape functions, enforce equilibrium, and out pops {K}{u}={F}.",
    "Derive and wield the 1D axial-bar element k = AE/L — and see why a bar element is literally just a spring.",
    "Apply boundary conditions like a pro, and explain why a floating, unconstrained K is doomed to be singular.",
    "Pick elements that won't lie to you (linear vs quadratic, tets vs hex) and tell h-refinement from p-refinement.",
    "Run a mesh-convergence study that an interviewer would actually believe.",
    "Spot the stress singularity — the trap where refining the mesh makes your answer WORSE, forever.",
  ],
  prerequisites: [
    "Linear algebra (matrix multiplication, solving Ax = b, what makes a matrix singular)",
    "Mechanics of materials (stress, strain, Hooke's law σ = Eε)",
    "Basic statics and equilibrium",
  ],
  interviewAngle:
    "FEA questions separate button-pushers from engineers. Interviewers rarely ask you to invert a matrix by hand; they ask what the matrix means, why a model blew up, and whether you actually trust your von Mises peak. The two killer questions are \"how do you know your mesh is fine enough?\" and \"why does the stress at that sharp corner keep climbing as you refine?\" A confident answer about convergence studies and stress singularities signals you understand the method's limits, not just its menus.",
  blocks: [
    {
      id: "b_hook",
      kind: "PROSE",
      title: "How does software know if your part survives? 🤔",
      markdown:
        "You design a bracket. It has fillets, holes, weird organic curves — geometry that no textbook formula will ever touch. You hit *Solve*, and ninety seconds later the screen blooms red and blue and tells you, to three decimal places, the peak stress at a corner you didn't even notice.\n\nHow? The software did something gloriously sneaky. It **gave up on your exact shape entirely** and replaced it with thousands of tiny, dumb, simple pieces it *does* know how to solve. Then it stitched them back together.\n\nThink of drawing a circle using only straight LEGO bricks. Four bricks? A sad square. Eight? A blocky octagon. A thousand tiny bricks? From across the room, a perfect circle. You never drew a curve — you just used *enough* straight edges that nobody could tell the difference.\n\nThat's the finite element method (FEM) in one sentence: **approximate the impossible-to-solve continuous thing with a huge pile of trivially-easy little things.** By the end of this lesson you'll know exactly how those little things work, how they're really tiny springs, and — the part that trips up even experienced engineers — when the whole beautiful machine quietly lies to you.",
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "GHjopp47vvQ",
      title: "Watch: Understanding the Finite Element Method",
      channel: "The Efficient Engineer",
    },
    {
      id: "b_intro",
      kind: "PROSE",
      title: "The whole game: divide, approximate, assemble, solve",
      markdown:
        "Here's the trick spelled out. A real, continuous body has *infinitely* many points, and therefore infinitely many ways to deform — infinitely many degrees of freedom. That's hopeless to solve directly. So FEM replaces the body with a **mesh** of small, simple **elements** joined at **nodes**.\n\nInside each element, we *fake* the unknown field (displacement, temperature, voltage) by smearing the nodal values across the element with **shape functions** (a.k.a. interpolation or basis functions):\n\n> u(x) ≈ Σ Nᵢ(x) · uᵢ\n\nThe shape functions Nᵢ are just known polynomials, rigged so Nᵢ = 1 at node i and 0 at every other node — each one is a little tent that's full height over its own node and collapses to zero at the neighbors. The nodal values uᵢ are the **only things we actually solve for**: the degrees of freedom (DOF).\n\nNow we demand the structure obey physics — equilibrium, via the principle of minimum potential energy or a Galerkin weighted-residual statement (don't panic; the software does the calculus). All of it collapses into one shockingly tidy linear system:\n\n> {K}{u} = {F}\n\nwhere `K` is the assembled **global stiffness matrix**, `{u}` is the vector of nodal DOFs, and `{F}` is the vector of nodal loads. Everything you care about — stress, strain, reactions — gets recovered *after* you solve for `{u}`. Build a good mesh, trust the solve, then squint hard at the results. That last part is where engineers earn their pay.",
    },
    {
      id: "b_system_formula",
      kind: "FORMULA",
      title: "The one equation to rule them all",
      display: "{K}{u} = {F}",
      latex: "[K]\\{u\\} = \\{F\\}",
      variables: [
        { symbol: "K", name: "Global stiffness matrix (assembled, n×n)", unit: "N/m" },
        { symbol: "u", name: "Vector of nodal degrees of freedom (displacements)", unit: "m" },
        { symbol: "F", name: "Vector of nodal loads (applied forces)", unit: "N" },
        { symbol: "n", name: "Total number of DOFs" },
      ],
      note:
        "It's just Hooke's law (F = kx) wearing a matrix costume. K is symmetric, positive-definite once you stop the structure from floating away, and mostly zeros (sparse — each node only talks to its neighbors). For linear-elastic statics, this single solve IS the whole problem. Nonlinear or transient runs just solve a stack of these in a loop.",
    },
    {
      id: "b_bar_prose",
      kind: "PROSE",
      title: "The axial bar: meet the humble LEGO brick of FEA",
      markdown:
        "Every empire starts somewhere small. For FEA, it's the **two-node axial bar** (a truss member) — a stick that carries load only along its length. One DOF per node (axial displacement), so its stiffness is a tiny 2×2 matrix. With area A, Young's modulus E, and length L, Hooke's law σ = Eε plus the linear shape functions N₁ = 1 − x/L and N₂ = x/L hand you:\n\n> k_el = (AE/L) · [ [ 1, −1 ], [ −1, 1 ] ]\n\nLook at that scalar out front: **k = AE/L**. That's not some new mystical FEA quantity — it's the spring constant of a rod. A bar element *is a spring*. Full stop. The matrix just bookkeeps the obvious: shove node 1 in by δ and the bar stretches and shoves back on node 2, and vice versa.\n\nHere's a detail that'll matter big-time soon: each row sums to zero. Translate both nodes the same amount → zero force. That's the bar's built-in **rigid-body mode** (it can drift through space for free), and it's *exactly* why a single unconstrained bar has a singular stiffness matrix. File that away.\n\nReal solid elements — quads, hexes, tets — are fancier (more DOF per node, stiffness from integrating B·D·B over the volume), but they're all built on this same skeleton: shape functions → strain-displacement → integrate for k_el → assemble. Master the spring, and the rest is paperwork.",
    },
    {
      id: "b_bar_formula",
      kind: "FORMULA",
      title: "k = AE/L — the stiffness of a single stick",
      display: "k = A·E / L",
      latex: "k = \\dfrac{A\\,E}{L}",
      variables: [
        { symbol: "k", name: "Axial element stiffness", unit: "N/m" },
        { symbol: "A", name: "Cross-sectional area", unit: "m²" },
        { symbol: "E", name: "Young's modulus", unit: "Pa" },
        { symbol: "L", name: "Element length", unit: "m" },
      ],
      note:
        "Stiffer material (higher E), fatter bar (higher A), or shorter span (smaller L) → harder to deform. Intuitive: a short fat steel rod barely budges; a long skinny rubber one is a noodle. The full element matrix is (AE/L)·[[1,−1],[−1,1]].",
    },
    {
      id: "b_sandbox_bar",
      kind: "SANDBOX",
      title: "Play god with a single bar",
      description:
        "Drag the sliders and feel k = AE/L breathe. Notice the asymmetry: stiffness rises in lockstep with A and E (double them, double k), but L is in the basement — double the length and you HALVE the stiffness. Longer = floppier, always.",
      variables: [
        { key: "A", label: "Cross-sectional area A", unit: "m²", min: 1e-5, max: 1e-3, step: 1e-5, default: 1e-4 },
        { key: "E", label: "Young's modulus E", unit: "Pa", min: 50e9, max: 250e9, step: 10e9, default: 200e9 },
        { key: "L", label: "Element length L", unit: "m", min: 0.1, max: 5, step: 0.1, default: 1 },
      ],
      expression: "A * E / L / 1e6",
      outputLabel: "Bar element stiffness k = AE/L",
      outputUnit: "MN/m",
      precision: 2,
    },
    {
      id: "b_assembly_prose",
      kind: "PROSE",
      title: "Assembly: snapping the springs together",
      markdown:
        "One spring is cute. A bracket needs thousands, wired together. Each element only knows its stiffness in terms of *its own* nodes — it has no idea it's part of something bigger. **Assembly** is the wiring diagram: drop each element's entries into the global rows and columns matching its **global node numbers** (the *connectivity*). Where two elements share a node, their stiffnesses just *add up* there — exactly like two springs meeting at a junction.\n\nPicture two bars in a line — node 1 → node 2 → node 3 — with stiffnesses k₁ and k₂. Element 1 owns DOFs (1,2); element 2 owns (2,3). The assembled 3×3 matrix:\n\n> K = [ [ k₁, −k₁, 0 ], [ −k₁, k₁+k₂, −k₂ ], [ 0, −k₂, k₂ ] ]\n\nThe middle node racks up **k₁ + k₂** because both elements pull on it. Notice the (1,3) entry is **zero** — nodes 1 and 3 never touch, so they can't directly affect each other. That's why K is **sparse**: in a real model with millions of DOF, the matrix is almost entirely zeros, and that emptiness is the only reason giant solves finish before the heat death of the universe.\n\nLoads assemble the same way: point forces drop straight into `{F}` at their DOF. Distributed loads (pressure, gravity, traction) get converted into *consistent nodal forces* first — the software integrates the load against the shape functions and smears it onto the nodes.",
    },
    {
      id: "b_bc_prose",
      kind: "PROSE",
      title: "Boundary conditions: bolt it down or it floats away",
      markdown:
        "Fresh out of assembly, your global K is **singular** — determinant zero, refuses to be inverted. Why? Your structure is floating in deep space. Nothing stops it from drifting or spinning as a rigid body, so there are infinitely many displacement solutions that all give the same internal forces. Each unrestrained rigid-body mode is a zero-energy eigenvector of K, just sitting there poisoning the solve.\n\nThe cure is **essential (Dirichlet) boundary conditions** — pin down some displacements, usually supports where u = 0. The solver strikes out (or penalizes) those rows and columns, leaving a reduced K that's finally **positive-definite** and invertible. In 2D you must kill three rigid-body modes (two translations + one rotation); in 3D, six.\n\nThis is the #1 rookie faceplant. A model that \"won't solve,\" screams about a singular matrix or a negative pivot, or spits back displacements like 10²⁰ meters (your bracket teleporting to another galaxy) is almost always **under-constrained**. Add supports until it can't float.\n\nAfter solving the reduced system for the free DOFs, you back-substitute to recover the **reaction forces** at the supports — and a quick global force balance (ΣF = 0) is your very first gut-check that the solve isn't garbage.",
    },
    {
      id: "b_predict_tets",
      kind: "PREDICT",
      question:
        "You mesh a beam in bending using cheap LINEAR tetrahedral (4-node tet) elements. Compared to reality, will the model come out too stiff (under-predicting deflection) or too soft (over-predicting deflection)?",
      options: [
        { id: "o1", label: "Too STIFF — it under-predicts how much the beam actually bends." },
        { id: "o2", label: "Too SOFT — it over-predicts the bending, exaggerating deflection." },
        { id: "o3", label: "Spot on — element type doesn't affect bending accuracy." },
      ],
      answerId: "o1",
      reveal:
        "Too **stiff** — and notoriously so. Linear tets have a constant strain field inside each element, so they physically *can't* curve. Bending a beam is all about curvature, and an element that refuses to curve fights the deformation like a splint — this is called **shear locking**. The result: artificially high stiffness, under-predicted deflection, and unreliable stress. It feels safe (\"my part barely moves!\") but it's lying *non-conservatively* about deflection. The fix: quadratic (10-node) tets, which can represent curvature, or hex elements where the geometry allows. Rule of thumb: never trust linear tets for stress or bending work.",
    },
    {
      id: "b_walkthrough",
      kind: "WALKTHROUGH",
      title: "The full FEA ritual, start to finish (1D two-element bar)",
      steps: [
        {
          title: "1. Discretize (chop it up)",
          markdown:
            "Trade the continuous bar for nodes and elements. Take a bar fixed to a wall on the left, sliced into two axial elements: node 1 (wall) — element 1 — node 2 — element 2 — node 3 (free end, where the load hangs). Three DOFs: the axial displacements u₁, u₂, u₃.",
        },
        {
          title: "2. Build each element's stiffness",
          markdown:
            "Compute k = AE/L for each element — each becomes (AE/L)·[[1,−1],[−1,1]] in its own local DOFs. The linear shape functions N₁ = 1 − x/L and N₂ = x/L do the interpolating inside each element.",
        },
        {
          title: "3. Assemble the global system",
          markdown:
            "Drop element entries into the 3×3 global K by connectivity. The shared node 2 collects k₁ + k₂:\n\n> K = [[k₁, −k₁, 0], [−k₁, k₁+k₂, −k₂], [0, −k₂, k₂]]\n\nBuild {F} = [R₁, 0, P]ᵀ — R₁ is the mystery wall reaction, P is the tip load.",
        },
        {
          title: "4. Apply boundary conditions",
          markdown:
            "The wall clamps u₁ = 0. Strike row/column 1 and the floating, singular system collapses into a clean, invertible 2×2 in (u₂, u₃):\n\n> [[k₁+k₂, −k₂], [−k₂, k₂]] · {u₂, u₃} = {0, P}",
        },
        {
          title: "5. Solve for the displacements",
          markdown:
            "Crack the reduced {K}{u}={F}. Because the two elements sit in series and only the tip is loaded, each one carries the full P, giving u₂ = P/k₁ and u₃ = u₂ + P/k₂. This {u} vector is the entire reason the method exists.",
        },
        {
          title: "6. Recover stress, strain, and reactions",
          markdown:
            "Post-process per element: strain ε = (u_right − u_left)/L, stress σ = Eε = P/A, internal force = σ·A. Back-substitute into the struck-out row for the reaction R₁ = −P. It MUST balance the applied load — and that's your verification check, free of charge.",
        },
      ],
    },
    {
      id: "b_worked",
      kind: "WORKED_EXAMPLE",
      title: "Stepped bar under a tip load — by hand, no software",
      problem:
        "A steel bar (E = 200 GPa) is fixed to a wall and yanked with P = 40 kN of axial tension at its free end. Two segments in series, each 0.5 m long. Segment 1 (by the wall) has area A₁ = 2×10⁻⁴ m²; segment 2 (at the tip) is thinner, A₂ = 1×10⁻⁴ m². Model each segment as one bar element. Find the nodal displacements and the axial stress in each segment.",
      steps: [
        {
          label: "Element stiffnesses k = AE/L",
          markdown:
            "k₁ = A₁E/L = (2×10⁻⁴ · 200×10⁹) / 0.5 = 8.0×10⁷ N/m = 80 MN/m\n\nk₂ = A₂E/L = (1×10⁻⁴ · 200×10⁹) / 0.5 = 4.0×10⁷ N/m = 40 MN/m\n\nThe skinny tip segment is half as stiff. Makes sense — less material to fight back.",
        },
        {
          label: "Trace the load path",
          markdown:
            "Both elements sit in series and only the tip (node 3) is pulled, so **every segment carries the full P = 40 kN**. Make a free-body cut anywhere along the bar and you expose the same 40 kN. The load doesn't get \"used up\" along the way.",
        },
        {
          label: "Solve for displacements",
          markdown:
            "u₁ = 0 (bolted to the wall).\n\nu₂ = P/k₁ = 40 000 / 8.0×10⁷ = 5.0×10⁻⁴ m = 0.50 mm.\n\nu₃ = u₂ + P/k₂ = 5.0×10⁻⁴ + 40 000/4.0×10⁷ = 5.0×10⁻⁴ + 1.0×10⁻³ = 1.5×10⁻³ m = 1.50 mm.\n\nThe tip moves three times as far as node 2 — the floppy thin segment does most of the stretching.",
        },
        {
          label: "Recover axial stress σ = P/A",
          markdown:
            "σ₁ = P/A₁ = 40 000 / 2×10⁻⁴ = 2.0×10⁸ Pa = 200 MPa.\n\nσ₂ = P/A₂ = 40 000 / 1×10⁻⁴ = 4.0×10⁸ Pa = 400 MPa.\n\nSanity check: reaction R₁ = −P = −40 kN balances the applied load. ✓ The numbers add up — you can trust it.",
        },
      ],
      answer:
        "u₂ = 0.50 mm, u₃ = 1.50 mm (tip deflection). Stresses: σ₁ = 200 MPa, σ₂ = 400 MPa. The thinner tip segment is both floppier AND more highly stressed — double trouble. And you got the whole thing from {K}{u}={F} with k = AE/L, no calculus required. That's the entire commercial FEA package, just scaled up a few million times.",
    },
    {
      id: "b_check_singular",
      kind: "CHECK",
      question:
        "Your linear-static FEA run aborts, complaining about a singular stiffness matrix (zero/negative pivot), before it computes a single stress value. What's the most likely culprit?",
      choices: [
        { id: "c1", label: "The mesh is too fine, so K got too big to invert." },
        { id: "c2", label: "The model is under-constrained — rigid-body modes were never restrained." },
        { id: "c3", label: "Young's modulus was entered too high." },
        { id: "c4", label: "The applied load exceeds the material yield strength." },
      ],
      answerId: "c2",
      explanation:
        "A singular K means it has zero-energy (rigid-body) modes — your structure can drift through space with no internal resistance, so the solver has no unique answer. The fix is enough essential boundary conditions to kill all rigid-body motion (3 in 2D, 6 in 3D). Mesh size never makes K singular; modulus and load magnitude just scale results; and yield is a post-processing comparison, not a solver input in linear-static analysis. When in doubt: did you forget to bolt it down?",
    },
    {
      id: "b_elements_prose",
      kind: "PROSE",
      title: "Picking elements that won't lie to you",
      markdown:
        "Not all elements are created equal, and the wrong one will hand you confident, beautiful, *wrong* numbers.\n\n- **Order.** *Linear* elements use first-order shape functions → constant strain inside each element (they can't curve). *Quadratic* elements add mid-side nodes → a linear strain field, so they capture curvature and bending far better for the same element count. For bending, quadratic wins, hands down.\n- **Shape.** In 2D: triangles and quads. In 3D: tetrahedra (tets) and hexahedra (hex/bricks). **Linear (4-node) tets are infamous** — they lock up in bending and shear, badly over-stating stiffness and under-stating deflection (you predicted this earlier). Avoid them for stress; reach for *quadratic* (10-node) tets, or hex elements when the geometry plays nice.\n- **Quality matters per element** (see the warning below — a single mangled element can wreck a region).\n\nTo sharpen a solution, you refine — two flavors:\n\n- **h-refinement:** keep the element order, shrink the elements (use more of them). Dead simple, easy to automate — the workhorse of convergence studies.\n- **p-refinement:** keep the mesh, crank up the polynomial order p. Can converge *exponentially* fast for smooth solutions, but it's less widely supported and chokes where the true solution is jagged.\n\nBoth chase the same prize: as the discretization gets finer, your FE answer should march toward the exact solution of the real continuum equations. Should. Usually. Read on.",
    },
    {
      id: "b_convergence_prose",
      kind: "PROSE",
      title: "Mesh convergence: refine until it stops wiggling",
      markdown:
        "One mesh gives you *a number*. It does not give you *the* number. A coarse mesh is systematically **too stiff** — it literally can't bend into the real deformed shape — so it under-predicts displacement and botches stress. **Mesh convergence** is how you prove, with evidence, that your result no longer cares about element size.\n\nThe drill:\n\n1. Pick ONE **quantity of interest (QoI)** — peak von Mises stress, tip deflection, first natural frequency. One scalar you genuinely care about.\n2. Solve on a ladder of progressively finer meshes (halve the element size each rung).\n3. Plot QoI versus DOF count (or 1/element-size).\n4. **Converged** = each refinement nudges the QoI by less than your tolerance (say < 2–5%). Well-posed problems creep toward the answer **monotonically** — displacement results usually climb up to the true value from below.\n5. Report the converged value; ship a mesh at least as fine as the converged one.\n\nConvergence is *local* — pour your elements where the gradients are steep (fillets, holes, contacts), not everywhere uniformly (that just burns compute). The real art: put the mesh where the physics is, then prove the curve has gone flat. A flat curve is a result you can defend. A still-climbing curve is... well, that's the next section, and it's the best part.",
    },
    {
      id: "b_predict_corner",
      kind: "PREDICT",
      question:
        "You refine the mesh at a perfectly sharp interior (re-entrant) corner. Each refinement, the peak stress climbs HIGHER — and shows zero sign of leveling off. Converged, almost-converged, or fundamentally broken?",
      options: [
        { id: "o1", label: "Almost there — just refine a few more times and it'll settle down." },
        { id: "o2", label: "Broken solver — stress should never keep rising like that." },
        { id: "o3", label: "Neither — the TRUE answer is infinite, so it can never converge. The model is asking an impossible question." },
      ],
      answerId: "o3",
      reveal:
        "It's option 3, and this is the plot twist that catches even experienced engineers. At a perfectly sharp re-entrant corner, **linear elasticity predicts σ → ∞**. There is no finite \"right answer\" to converge to, so the harder you refine, the higher the peak climbs — *forever*. Your mesh isn't broken. Your solver isn't broken. The **model** is broken: a perfectly sharp corner doesn't exist in the real world. This is a **stress singularity**, and refining the mesh to chase it is like zooming a microscope deeper into a mathematical abyss. The next section is the survival guide.",
    },
    {
      id: "b_singularity_prose",
      kind: "PROSE",
      title: "The plot twist: stresses that NEVER converge 💀",
      markdown:
        "This is the trap. At certain features, the *true* elasticity solution predicts **infinite stress** — so refining the mesh drives the reported peak ever upward. It **diverges** instead of converging. As you just predicted: the mesh is fine, the **question** is broken.\n\nThe usual suspects:\n\n- **Sharp re-entrant corners** (an interior corner with zero fillet radius). σ → ∞ at the tip. Always.\n- **Point loads and point supports.** A finite force on zero area = infinite stress at that node. Of course it does.\n- **Idealized crack tips** and the edges of bonded/rigid boundaries.\n\nYour survival kit:\n\n- **Recognize it.** If peak stress keeps climbing every refinement with no plateau in sight, suspect a singularity — not a meshing failure. Don't refine into the void.\n- **Fix the MODEL, not the mesh.** Add the **fillet radius** the real part actually has (no manufactured corner is perfectly sharp). Swap a point load for a **pressure over a small patch**. Use realistic contact instead of a knife-edge support. Make the model match reality, and the infinity disappears.\n- **Or change the QoI.** Stress *at* the singular point is meaningless — but a few elements away it converges just fine. Or go full fracture mechanics (stress-intensity factor K) where a crack is genuinely the whole point.\n\nThe truly sneaky part: **displacement and reaction forces usually still converge** even with a singularity lurking, because the energy in that infinitesimal region stays finite. So the model looks perfectly healthy — sensible deflection, balanced reactions — right up until you stare at the local stress peak and watch it run away from you. This exact trap is the heart of the linked practice problem.",
    },
    {
      id: "b_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What interviewers actually probe",
      markdown:
        "Expect: **\"You ran one mesh and got 350 MPa. How do you know that's right?\"** Strong answer: \"I'd run a convergence study — solve 3–4 progressively finer meshes, plot peak stress vs. DOF count, and confirm it changes less than a few percent while approaching a value monotonically. If it keeps climbing, I'd suspect a stress singularity from a sharp corner or point load, then add the real fillet radius or distribute the load before trusting any peak.\" Then the follow-up: **\"Why is your coarse mesh non-conservative for deflection, but the corner stress is non-conservative when fine?\"** — because a coarse mesh is artificially stiff (under-predicts deflection), while a singular corner over-predicts stress more and more as you refine. Naming *both* behaviors in one breath is what actually lands the offer.",
    },
    {
      id: "b_callout_warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Even a fine mesh can lie: quality, and the two V's",
      markdown:
        "A fine mesh full of mangled elements is still garbage. Watch three quality metrics:\n\n- **Aspect ratio** — long sliver elements (ideal ≈ 1; flag > ~5–10 in stress regions).\n- **Skew / distortion** — angles far from ideal (90° for quads, 60° for triangles) bleed accuracy.\n- **Jacobian** — how distorted the element is under the mapping to its reference shape; a **negative Jacobian** means an inverted, tangled element, and the solve is flat-out invalid.\n\nAnd never, ever conflate the two V's:\n\n- **Verification** = \"are we solving the equations *right*?\" (mesh convergence, correct BCs, units, no singular K). Math correctness.\n- **Validation** = \"are we solving the *right* equations?\" (does the model match reality — tests, hand calcs, known limits). Physics correctness.\n\nA gorgeous, perfectly converged result built on the wrong physics is *verified but invalid* — and it'll get someone hurt. Both V's are non-negotiable before you trust an FEA number.",
    },
    {
      id: "b_check_singularity",
      kind: "CHECK",
      question:
        "You refine the mesh near a sharp 90° interior (re-entrant) corner three times. Peak von Mises stress jumps 220 → 310 → 470 MPa with no sign of slowing, while tip deflection has parked itself at 1.20 mm. What do you conclude?",
      choices: [
        { id: "c1", label: "Mesh is still too coarse — keep refining until the stress finally converges." },
        { id: "c2", label: "It's a stress singularity — peak stress at a sharp re-entrant corner diverges and isn't a usable number; add the real fillet radius or report stress away from the corner." },
        { id: "c3", label: "The solver is broken, because deflection and stress can't possibly behave differently." },
        { id: "c4", label: "The material yielded, which is why the stress keeps rising." },
      ],
      answerId: "c2",
      explanation:
        "Diverging peak stress with refinement is the unmistakable signature of a stress singularity at a sharp re-entrant corner — linear elasticity says σ → ∞ there, so NO mesh will ever converge it. The parked deflection is totally normal: global quantities still converge because the singular region holds finite energy (that's what makes the trap so sneaky). The cure is to fix the model (add the fillet the real part has, distribute point loads) or evaluate stress a short distance away / use fracture mechanics — not to refine into infinity. And it has nothing to do with linear-elastic yielding.",
    },
  ],
  keyTakeaways: [
    "FEA chops a continuous body into simple elements, fakes the field with shape functions, and enforces equilibrium to produce one tidy linear system: {K}{u}={F} — Hooke's law in a matrix costume.",
    "A bar element is literally a spring: k = AE/L. Element stiffnesses just add up at shared nodes during assembly, building a symmetric, sparse global K.",
    "An unconstrained K is singular because the structure floats — apply enough boundary conditions (3 in 2D, 6 in 3D) to pin it down, then recover stresses and reactions after the solve.",
    "Element choice can lie to you: quadratic beats linear for bending, and linear tets lock up and over-stiffen — prefer hex or quadratic tets for stress.",
    "Mesh convergence = refine (h- or p-) until your chosen quantity of interest stops wiggling within tolerance, creeping toward the true value monotonically.",
    "The big gotcha: stress singularities at sharp re-entrant corners and point loads DIVERGE with refinement — fix the model (fillets, distributed loads), never chase a peak that can't converge.",
    "Verification (solving the equations right) and validation (solving the right equations) are both mandatory: a beautifully converged result on the wrong physics is still wrong.",
  ],
};
