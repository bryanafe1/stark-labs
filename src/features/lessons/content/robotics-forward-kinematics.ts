import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_robotics",
  slug: "robotics-forward-kinematics",
  title: "Forward Kinematics: From Joint Angles to a Point in Space",
  summary:
    "A robot arm doesn't know where its hand is — it only knows its joint angles. Forward kinematics is the bit of trigonometry that turns \"elbow at 30°, shoulder at 45°\" into \"the gripper is right *here*.\" You will build the famous two-link planar arm from scratch, drag its joints around in a live sandbox, map out the donut-shaped region it can actually reach, and meet its harder twin — inverse kinematics — plus the DH bookkeeping that scales all this up to real six-axis robots.",
  discipline: "MECHATRONICS",
  difficulty: "MEDIUM",
  estMinutes: 22,
  tags: ["robotics", "kinematics", "manipulator"],
  objectives: [
    "Define forward kinematics as the map from joint variables to end-effector position and orientation.",
    "Derive the two-link planar arm equations X = L1·cos(θ1) + L2·cos(θ1+θ2), Y = L1·sin(θ1) + L2·sin(θ1+θ2) from geometry.",
    "Explain degrees of freedom and why the second angle is measured relative to the first link.",
    "Describe a manipulator's workspace and reach, including the inner and outer radius of a two-link arm's reachable region.",
    "Contrast forward kinematics with inverse kinematics and explain why IK can have zero, one, or multiple solutions.",
    "Recognize Denavit–Hartenberg (DH) parameters as the systematic bookkeeping that scales forward kinematics to many-jointed robots.",
  ],
  prerequisites: [
    "Right-triangle trigonometry (sine and cosine) and the unit circle",
    "Angles in radians (π rad = 180°)",
    "Basic 2D coordinate geometry (x, y points and vectors)",
  ],
  interviewAngle:
    "Forward kinematics is the gateway robotics interview question because it is concrete, visual, and instantly reveals whether you can reason in space. Interviewers love the two-link planar arm: they will ask you to write X and Y from joint angles, then probe whether you understand *why* the second angle adds to the first (angles compound along the chain), what the reachable workspace looks like (an annulus between |L1−L2| and L1+L2), and how forward differs from inverse kinematics. Strong candidates sketch the arm, build the position vector link by link, mention that FK always has exactly one answer while IK may have zero, one, two, or infinitely many, and can name DH parameters as the scalable formalism without getting lost in matrices. They keep angle units straight (radians vs degrees) — a mistake that silently wrecks real code. Weak candidates memorize the formula but cannot explain the compounding angle or the donut-shaped workspace.",
  blocks: [
    {
      id: "fk-hook",
      kind: "PROSE",
      title: "The robot that has no idea where its hand is",
      markdown:
        "Close your eyes and touch your nose. You nailed it without looking, because your brain quietly tracks every joint angle — shoulder, elbow, wrist — and *computes* where your fingertip ends up. A robot arm is in the same boat, only blinder: its motors report angles like \"joint 1 at 0.6 rad, joint 2 at 1.1 rad,\" and that is *all* it knows. There is no sensor at the gripper announcing \"I am at (x, y).\" Someone has to do the math.\n\nThat someone is **forward kinematics** (FK): the recipe that takes a set of joint angles and spits out exactly where the end-effector — the hand, the gripper, the welding tip — lands in space, and which way it points.\n\nHere is the wonderful part: for a robot arm of *any* size, FK is just a chain of trigonometry. No calculus, no optimization, no guessing. Plug in the angles, turn the crank, out comes a position. It is the most dependable calculation in all of robotics — *one* set of angles always gives *exactly one* answer. We will build the whole machine starting from a single stick.",
    },
    {
      id: "fk-video",
      kind: "VIDEO",
      youtubeId: "eeebukd80UI",
      title: "Watch: Forward Kinematics (Geometric Approach)",
      channel: "Leopoldo Armesto",
    },
    {
      id: "fk-one-link",
      kind: "PROSE",
      title: "Start with one stick on a turntable",
      markdown:
        "Forget the full robot for a second. Picture a single rigid link of length `L1`, pinned at the origin, free to swivel. Call its angle from the positive x-axis `θ1`. Where is the far tip?\n\nThis is just a point on a circle of radius `L1` — pure unit-circle trig:\n\n`x = L1·cos(θ1)`,    `y = L1·sin(θ1)`.\n\nAt `θ1 = 0` the tip sits at `(L1, 0)`, straight out along x. Swing to `θ1 = π/2` (90°) and it points straight up at `(0, L1)`. That is forward kinematics for a one-joint arm — trivial, but it is the *entire* idea in miniature: **angle in, position out**.\n\nThe magic of a multi-link arm is that you just keep doing this, link by link, riding the tip of one stick to the base of the next. Each new link adds its own little circle, hinged wherever the previous link left off.",
    },
    {
      id: "fk-two-link",
      kind: "PROSE",
      title: "Add an elbow: the two-link planar arm",
      markdown:
        "Now bolt a second link of length `L2` onto the tip of the first, with its own joint angle `θ2`. This is the **two-link planar arm** — the \"hello world\" of robotics, basically a shoulder and an elbow drawing on a tabletop.\n\nThe one subtlety that trips everyone up: **angles compound along the chain.** `θ2` is measured *relative to link 1*, not relative to the ground. So link 2 actually points in the direction `θ1 + θ2` in world coordinates. (If your forearm is at 30° to your upper arm, and your upper arm is at 45° to the floor, your forearm is at 75° to the floor.)\n\nSo we build the end-effector position in two hops:\n\n1. Walk out along link 1 to the elbow: `(L1·cos θ1,  L1·sin θ1)`.\n2. From the elbow, walk out along link 2, which points at angle `θ1 + θ2`: add `(L2·cos(θ1+θ2),  L2·sin(θ1+θ2))`.\n\nAdd the two vectors tip-to-tail and you get the end-effector:\n\n`X = L1·cos(θ1) + L2·cos(θ1 + θ2)`\n`Y = L1·sin(θ1) + L2·sin(θ1 + θ2)`\n\nThat is it. That pair of equations is the workhorse of planar robotics, and it is nothing more than \"add up the links, accounting for how each one is rotated.\"",
    },
    {
      id: "fk-formula",
      kind: "FORMULA",
      title: "Two-link planar arm — forward kinematics",
      display:
        "X = L1·cos(θ1) + L2·cos(θ1 + θ2)        Y = L1·sin(θ1) + L2·sin(θ1 + θ2)",
      latex: "X = L_1 \\cos(\\theta_1) + L_2 \\cos(\\theta_1 + \\theta_2) \\qquad Y = L_1 \\sin(\\theta_1) + L_2 \\sin(\\theta_1 + \\theta_2)",
      variables: [
        { symbol: "X", name: "End-effector x-coordinate", unit: "m" },
        { symbol: "Y", name: "End-effector y-coordinate", unit: "m" },
        { symbol: "L1", name: "Length of link 1 (upper arm)", unit: "m" },
        { symbol: "L2", name: "Length of link 2 (forearm)", unit: "m" },
        { symbol: "θ1", name: "Joint 1 angle (shoulder), from x-axis", unit: "rad" },
        { symbol: "θ2", name: "Joint 2 angle (elbow), relative to link 1", unit: "rad" },
      ],
      note:
        "Notice θ2 always appears as θ1 + θ2: link 2's world orientation is the sum because angles accumulate down the chain. The end-effector orientation (which way the gripper points) is simply φ = θ1 + θ2. Keep angles in RADIANS — cos and sin here expect radians, and mixing in degrees is the classic silent bug.",
    },
    {
      id: "fk-sandbox",
      kind: "SANDBOX",
      title: "Play: drive the arm's reach yourself",
      description:
        "Drag the link lengths and the two joint angles and watch the end-effector's X-coordinate update live. All angles are in RADIANS. With the defaults (L1 = 1, L2 = 0.5, θ1 = 0, θ2 = 0) the arm is stretched straight out along the x-axis, so X = 1·cos(0) + 0.5·cos(0) = 1.5 — its maximum reach. Now swing θ1 up toward π/2 ≈ 1.57 and watch X collapse toward 0 as the arm points upward. Fold the elbow with θ2 and see how the tip pulls back in.",
      variables: [
        { key: "L1", label: "Link 1 length", unit: "m", min: 0.1, max: 2, step: 0.1, default: 1 },
        { key: "L2", label: "Link 2 length", unit: "m", min: 0.1, max: 2, step: 0.1, default: 0.5 },
        { key: "t1", label: "Joint angle θ1 (rad)", unit: "rad", min: 0, max: 3.14, step: 0.05, default: 0 },
        { key: "t2", label: "Joint angle θ2 (rad)", unit: "rad", min: 0, max: 3.14, step: 0.05, default: 0 },
      ],
      expression: "L1 * cos(t1) + L2 * cos(t1 + t2)",
      outputLabel: "End-effector X",
      outputUnit: "m",
      precision: 3,
    },
    {
      id: "fk-predict-straight",
      kind: "PREDICT",
      question:
        "A two-link arm has L1 = 1 m and L2 = 0.5 m. You set θ1 = 0 and θ2 = 0 (both links pointing straight along the x-axis). What is the end-effector's X-coordinate?",
      options: [
        { id: "a", label: "0.5 m — only the forearm counts." },
        { id: "b", label: "1.0 m — only the upper arm counts." },
        { id: "c", label: "1.5 m — both links add up, fully extended." },
        { id: "d", label: "0 m — the angles are zero, so nothing moves." },
      ],
      answerId: "c",
      reveal:
        "**1.5 m — the arm is fully stretched out.** With both angles zero, `cos(0) = 1`, so `X = L1·cos(0) + L2·cos(0+0) = 1·1 + 0.5·1 = 1.5 m`. This is the arm's *maximum reach*: `L1 + L2`. The trap in option (d) confuses \"zero angle\" with \"zero position\" — a zero angle just means the link points straight along x, where its full length shows up in X. The outer edge of what the arm can ever touch is exactly this number.",
    },
    {
      id: "fk-dof-workspace",
      kind: "PROSE",
      title: "Degrees of freedom and the donut of reachability",
      markdown:
        "Each independent joint gives the arm one **degree of freedom (DOF)** — one knob you can turn. Our two-link arm has **2 DOF** (θ1 and θ2), which lets it place its tip at points across a 2D plane. As a rule of thumb you need at least as many DOF as the dimensions of the task: 2 DOF to reach an (x, y) position on a table; 6 DOF to put a gripper at an arbitrary position *and* orientation in full 3D space (which is why industrial arms so often have exactly six joints).\n\nThe set of all points the end-effector can reach is the **workspace**. For our two-link arm, picture sweeping both joints through every angle:\n\n- **Maximum reach** is `L1 + L2` — both links stretched into a straight line.\n- **Minimum reach** is `|L1 − L2|` — the elbow folded all the way back, the forearm pulled in toward the shoulder.\n\nSo the reachable region is an **annulus** — a donut — with outer radius `L1 + L2` and inner radius `|L1 − L2|`. Anything inside the donut hole is *unreachable*: the arm physically cannot fold tightly enough to touch it. (A neat special case: if `L1 = L2`, the inner radius is zero and the donut becomes a full disk — the arm can reach its own base. That is exactly why many designs use equal-length links.)\n\nReachability is a real-world constraint, not a math curiosity. Place a part outside the donut and no clever control software will save you — the robot simply cannot get there.",
    },
    {
      id: "fk-predict-workspace",
      kind: "PREDICT",
      question:
        "An arm has L1 = 1.0 m and L2 = 0.5 m. A target part sits 0.3 m from the base (the shoulder joint). Can the arm reach it?",
      options: [
        { id: "a", label: "Yes — 0.3 m is well within the 1.5 m maximum reach." },
        { id: "b", label: "No — 0.3 m is inside the inner radius, in the unreachable donut hole." },
        { id: "c", label: "Only if you add a third link." },
        { id: "d", label: "Yes, but only if both angles are exactly zero." },
      ],
      answerId: "b",
      reveal:
        "**No — it's stuck in the donut hole.** The workspace is an annulus from inner radius `|L1 − L2| = |1.0 − 0.5| = 0.5 m` out to `L1 + L2 = 1.5 m`. A target at 0.3 m is *closer* than the 0.5 m minimum reach, so even fully folded the arm can't pull its tip in that far — there's always at least 0.5 m of forearm-minus-upper-arm geometry in the way. Option (a) is the classic mistake: people remember the *outer* limit and forget the inner hole. (If the links were equal, the hole would vanish and 0.3 m would be reachable.)",
    },
    {
      id: "fk-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: compute the end-effector position",
      problem:
        "A two-link planar arm has L1 = 1.0 m and L2 = 0.5 m. The shoulder is at θ1 = π/6 rad (30°) and the elbow at θ2 = π/3 rad (60°). Find (a) the elbow position, (b) the end-effector position (X, Y), and (c) the orientation of the end-effector. Then (d) sanity-check the result against the workspace.",
      steps: [
        {
          label: "(a) Find the elbow",
          markdown:
            "The elbow is just the tip of link 1: `(L1·cos θ1, L1·sin θ1)`. With θ1 = π/6: cos(30°) = 0.8660, sin(30°) = 0.5. So elbow = (1.0 × 0.8660, 1.0 × 0.5) = **(0.866, 0.500) m**.",
        },
        {
          label: "(b) Set up the end-effector — the compound angle",
          markdown:
            "Link 2 points at `θ1 + θ2 = π/6 + π/3 = π/2` rad (90°). That is the key step: the elbow angle adds to the shoulder angle. So we need cos(90°) = 0 and sin(90°) = 1.",
        },
        {
          label: "(b) Compute X",
          markdown:
            "X = L1·cos(θ1) + L2·cos(θ1+θ2) = 1.0·cos(30°) + 0.5·cos(90°) = 0.8660 + 0.5·0 = **0.866 m**.",
        },
        {
          label: "(b) Compute Y",
          markdown:
            "Y = L1·sin(θ1) + L2·sin(θ1+θ2) = 1.0·sin(30°) + 0.5·sin(90°) = 0.5 + 0.5·1 = **1.000 m**. So the gripper sits at **(0.866, 1.000) m**.",
        },
        {
          label: "(c) Orientation",
          markdown:
            "The end-effector's heading is simply the sum of the joint angles: φ = θ1 + θ2 = π/2 rad = **90°**. The gripper points straight up — which matches link 2 standing vertically from the elbow.",
        },
        {
          label: "(d) Sanity check against the workspace",
          markdown:
            "Distance from base to tip = √(X² + Y²) = √(0.866² + 1.000²) = √(0.75 + 1.00) = √1.75 ≈ **1.323 m**. That lies between the inner radius |L1 − L2| = 0.5 m and the outer radius L1 + L2 = 1.5 m, so the pose is comfortably inside the donut — the answer is physically reachable. ✓",
        },
      ],
      answer:
        "Elbow at (0.866, 0.500) m; end-effector at (X, Y) = (0.866, 1.000) m with orientation φ = θ1 + θ2 = 90°. Tip is 1.323 m from the base — inside the reachable annulus (0.5 m to 1.5 m), so it checks out.",
    },
    {
      id: "fk-inverse",
      kind: "PROSE",
      title: "The harder twin: inverse kinematics",
      markdown:
        "Forward kinematics answers \"given the angles, where is the hand?\" In the real world you usually want the *opposite*: \"I want the gripper *there* — what angles get me there?\" That reverse map is **inverse kinematics (IK)**, and it is dramatically nastier.\n\nWhy harder? Forward kinematics is a one-way street: plug in angles, get *exactly one* position, always. Inverse kinematics can have:\n\n- **No solution** — the target is outside the workspace (in the donut hole or beyond the reach). The arm simply can't.\n- **Exactly one solution** — the target sits right on the workspace boundary (arm fully stretched or fully folded).\n- **Two solutions** — the famous **\"elbow-up\" vs \"elbow-down\"** configurations. The same fingertip position is reachable with the elbow bent two different ways. (Touch a spot on your desk; now reach the *same* spot with your elbow raised. Same hand, two arm shapes.)\n- **Infinitely many** — for *redundant* arms with more DOF than the task needs (think a 7-DOF arm placing a 6-DOF pose), there is a continuum of solutions, and you get to pick one by some extra criterion (avoid obstacles, minimize effort).\n\nThat is why FK is a clean formula but IK often needs cleverness — geometric reasoning, trig identities, or iterative numerical solvers. FK is the bedrock you build IK *on top of*: you frequently check an IK candidate by running it forward and confirming it lands on target.",
    },
    {
      id: "fk-dh",
      kind: "PROSE",
      title: "Scaling up: DH parameters",
      markdown:
        "Our hand-rolled \"add up the links\" trick is delightful for two joints on a flat table, but a real six-axis industrial arm twists through 3D with joints pointing every which way. Deriving X, Y, Z by eyeballing geometry would be a nightmare. Robotics needs a *systematic*, crank-the-handle method — and that is **Denavit–Hartenberg (DH) parameters**.\n\nThe DH convention is a bookkeeping recipe: attach a coordinate frame to every link, then describe how to hop from one frame to the next using just **four numbers per joint**:\n\n- **θ (theta)** — joint angle (rotation about the joint axis).\n- **d** — link offset (slide along the joint axis).\n- **a** — link length (the \"reach\" between consecutive axes).\n- **α (alpha)** — link twist (how much the next axis is tilted).\n\nEach joint's four parameters fold into a 4×4 **homogeneous transformation matrix** that packs a rotation and a translation into one tidy object. To get the end-effector pose relative to the base, you simply **multiply the per-joint matrices together** in order: `T = T₁·T₂·T₃·…·Tₙ`. Forward kinematics for a 50-joint robot is the same idea as our two-link arm — chain the transforms — just expressed in a form a computer can grind through mechanically.\n\nYou do not need to master the matrices today. The takeaway: our `X = L1cosθ1 + L2cos(θ1+θ2)` is the 2D, by-hand version of exactly what DH matrices do automatically in 3D. Same chain-the-links idea, industrial strength.",
    },
    {
      id: "fk-check-compound",
      kind: "CHECK",
      question:
        "In the two-link equations, why does link 2's term use cos(θ1 + θ2) instead of just cos(θ2)?",
      choices: [
        { id: "a", label: "It's an arbitrary convention; cos(θ2) would work equally well." },
        { id: "b", label: "Because θ2 is measured relative to link 1, so link 2's orientation in world coordinates is the sum θ1 + θ2." },
        { id: "c", label: "Because cosine of a sum is always larger, giving more reach." },
        { id: "d", label: "To convert the angle from degrees to radians." },
      ],
      answerId: "b",
      explanation:
        "Angles compound along a kinematic chain. The elbow angle θ2 is defined *relative to the upper arm* (link 1), not relative to the fixed world frame. Since link 1 is already rotated by θ1, link 2's actual heading in world coordinates is θ1 + θ2 — so its x-projection is L2·cos(θ1 + θ2). This is the single most important subtlety in the whole derivation; getting it wrong puts the gripper in completely the wrong place.",
    },
    {
      id: "fk-check-ik",
      kind: "CHECK",
      question:
        "You command a 2-DOF planar arm to reach a point that lies comfortably inside its workspace (not on the boundary). How many inverse-kinematics solutions does it typically have?",
      choices: [
        { id: "a", label: "Exactly one — kinematics is deterministic." },
        { id: "b", label: "Two — the elbow-up and elbow-down configurations." },
        { id: "c", label: "None — interior points are never reachable." },
        { id: "d", label: "Infinitely many — any 2D point allows any angles." },
      ],
      answerId: "b",
      explanation:
        "For an interior target, a 2-link arm generally has **two** distinct joint solutions: elbow-up and elbow-down — the same hand position reached with the elbow bent two different ways. (Forward kinematics, by contrast, always gives exactly one answer for a given set of angles — that asymmetry is the whole reason IK is harder than FK.) A target right on the boundary collapses these into one solution; a target outside the workspace has zero. Infinitely many solutions only arise for redundant arms with more DOF than the task requires.",
    },
    {
      id: "fk-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What interviewers actually probe",
      markdown:
        "The two-link arm is a near-universal warm-up. To shine:\n\n- **Derive, don't recite.** Build X and Y link by link — \"walk out to the elbow, then walk out along link 2 at angle θ1 + θ2\" — so it's obvious you understand the geometry, not just the formula.\n- **Explain the compound angle.** If you can say *why* it's θ1 + θ2 (angles accumulate down the chain), you've already cleared the bar most candidates trip over.\n- **Know FK vs IK cold.** \"FK is one-to-one and always solvable; IK can have zero, one, two (elbow-up/down), or infinitely many solutions.\" That single sentence signals real understanding.\n- **Describe the workspace.** An annulus from |L1 − L2| to L1 + L2 — and mention the inner hole. Bonus: equal links → reachable disk.\n- **Watch your units.** State that the trig is in radians. \"Degrees vs radians\" bugs are a rite of passage in robotics code, and naming the hazard shows you've actually written some.\n- **Drop \"DH parameters\"** as the scalable formalism for 3D, even if you don't derive the matrices — it shows you know how this generalizes.",
    },
    {
      id: "fk-callout-warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Traps that quietly wreck your robot",
      markdown:
        "- **Radians, not degrees.** `cos` and `sin` in code (and in this lesson's sandbox) expect radians. Feeding 90 instead of π/2 ≈ 1.571 sends the arm somewhere bizarre — and it usually fails silently, no error thrown.\n- **The forgotten donut hole.** Maximum reach is L1 + L2, but the *minimum* reach |L1 − L2| is just as real. Targets nearer than that are unreachable no matter the angles.\n- **The compound angle.** Using cos(θ2) instead of cos(θ1 + θ2) is the #1 derivation error — the gripper lands in the wrong spot every time.\n- **Joint limits are not in the equations.** FK math happily computes poses your real motors can't achieve (joints don't spin a full 360°). Always check angles against the hardware's mechanical limits.\n- **FK gives one answer; reality may need the *other* IK branch.** When you solve backward, remember elbow-up vs elbow-down — picking the wrong branch can swing the arm into an obstacle.",
    },
    {
      id: "fk-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "One picture to carry away",
      markdown:
        "Forward kinematics is just *walking the chain*: ride out along each link, adding its rotated length to the running total, with every joint angle accumulating onto the last. For two links that's `X = L1·cos θ1 + L2·cos(θ1+θ2)`, `Y = L1·sin θ1 + L2·sin(θ1+θ2)`; for a fifty-joint robot it's the same walk dressed up as DH matrix multiplication. Angle in, position out — always exactly one answer. Going the other way (position in, angles out) is the messy, multi-solution world of inverse kinematics, and FK is the trusty formula it all stands on.",
    },
  ],
  keyTakeaways: [
    "Forward kinematics maps joint angles to the end-effector's position (and orientation), and unlike inverse kinematics it always yields exactly one answer.",
    "For a two-link planar arm: X = L1·cos(θ1) + L2·cos(θ1+θ2) and Y = L1·sin(θ1) + L2·sin(θ1+θ2), built by walking out link by link and summing the rotated lengths.",
    "Angles compound along the chain: the elbow angle θ2 is measured relative to link 1, so link 2's world orientation — and the end-effector heading — is θ1 + θ2.",
    "Each joint is one degree of freedom; you need at least as many DOF as task dimensions (2 for a planar point, 6 for a full 3D pose), which is why industrial arms often have six joints.",
    "The reachable workspace is an annulus: outer radius L1 + L2 (fully extended) and inner radius |L1 − L2| (fully folded); points inside that hole are unreachable, and equal links make it a full disk.",
    "Inverse kinematics (position → angles) can have zero, one, two (elbow-up/elbow-down), or infinitely many (redundant arms) solutions, which is why it is far harder than forward kinematics.",
    "Denavit–Hartenberg parameters (θ, d, a, α per joint) systematize forward kinematics into chained 4×4 homogeneous transforms, scaling the same link-by-link idea to many-jointed 3D robots — and angles must always be in radians.",
  ],
};
