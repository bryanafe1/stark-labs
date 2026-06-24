import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "robotics_fk_vs_ik",
    slug: "concept-robotics-fk-vs-ik",
    title: "Forward vs Inverse Kinematics on a Pick-and-Place Arm",
    prompt: "You are commissioning a 6-axis industrial arm for a pick-and-place cell. Your colleague proposes computing the tool pose by chaining the joint transforms, but the production code actually needs to drive the gripper to a target XYZ and orientation supplied by a vision system.",
    discipline: "MECHATRONICS",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["robotics", "conceptual"],
    skillAreas: ["robotics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the difference between forward and inverse kinematics for this arm, which one the vision-driven motion actually requires, and why one direction is generally much harder to solve than the other.",
        rubric: "Excellent answer defines forward kinematics as mapping known joint angles to end-effector pose (deterministic, single solution, just composing transforms). Inverse kinematics maps a desired end-effector pose back to required joint angles. The vision-driven task needs IK because the target pose is given, not the joints. Notes IK is harder because it is the inverse of a nonlinear (trigonometric) mapping: it can have multiple solutions (elbow-up vs elbow-down), no closed-form solution for general geometries, and may have no solution if the target is unreachable. FK is always unique and direct. Key insight: FK is a well-posed one-to-one forward evaluation, while IK is an inverse problem that can be multi-valued, ill-posed, or unsolvable, which is why it dominates the engineering effort.",
      },
      {
        prompt: "Now suppose the IK solver returns several valid joint configurations for the same target pose. How would you decide which configuration to actually command, and what real-world constraints make this choice matter?",
        rubric: "Strong answer recognizes IK redundancy in solution branches (elbow-up/down, wrist flips). Selection criteria: minimize joint travel from current pose (continuity, speed), avoid joint limits, avoid collisions with the workpiece/fixtures/self, stay away from singularities, respect cable wrap and reachability margin, keep within velocity/torque limits along the path. Should mention continuity across a trajectory to avoid sudden reconfiguration flips mid-motion. Key insight: among kinematically valid solutions you pick the one that is dynamically and operationally feasible and continuous with the current state, not just any geometric solution.",
      },
    ],
  },
  {
    id: "robotics_dof_redundancy",
    slug: "concept-robotics-dof-redundancy",
    title: "Counting Degrees of Freedom and Redundancy",
    prompt: "A startup is choosing between a 6-DOF arm and a 7-DOF arm for inspecting the inside of a car door frame, where the tool must reach around obstacles to touch many points.",
    discipline: "MECHATRONICS",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["robotics", "conceptual"],
    skillAreas: ["robotics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain why 6 DOF is the baseline number for positioning a rigid tool arbitrarily in space, and what a 7th joint actually buys you for this inspection task.",
        rubric: "Excellent answer explains a rigid body in 3D has 6 DOF: 3 translational (XYZ) and 3 rotational (roll/pitch/yaw), so 6 independent joints are the minimum to reach an arbitrary position AND orientation. The 7th joint makes the arm kinematically redundant: the same tool pose can be achieved by an infinite family of joint configurations, allowing the elbow to swing while the tool stays fixed. This lets the arm reach around obstacles, avoid joint limits and singularities, and self-collisions while still hitting each inspection point. Key insight: 6 DOF gives full pose control; extra DOF beyond the task gives you null-space freedom to optimize how you reach the pose, not new poses.",
      },
      {
        prompt: "Now the task only requires touching points with a symmetric, ball-shaped probe where tool roll about its own axis does not matter. How does that change the effective DOF requirement, and how would you exploit the freed-up axis?",
        rubric: "Good answer recognizes that a task with rotational symmetry about the tool axis removes one orientation constraint, so the task only needs 5 DOF (3 position + 2 orientation). With a 6-DOF arm this makes the arm functionally redundant for this task; with 7 DOF it is doubly redundant. The freed axis can be used the same way as redundancy: avoid singularities, dodge obstacles, stay inside joint limits, improve manipulability/dexterity at contact points. Should note effective DOF is task-dependent, not just a property of the robot. Key insight: required DOF is set by the task's constraint count, and symmetry in the task reduces it, converting hardware DOF into useful redundancy.",
      },
    ],
  },
  {
    id: "robotics_singularity",
    slug: "concept-robotics-singularity",
    title: "Diagnosing a Wrist Singularity",
    prompt: "During a welding pass an operator reports that the arm suddenly slowed to a crawl and one joint spun violently while the tool barely moved, even though the commanded Cartesian speed was modest. It happened as the wrist passed through a nearly straight configuration.",
    discipline: "MECHATRONICS",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["robotics", "conceptual"],
    skillAreas: ["robotics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain what a kinematic singularity is in terms of the Jacobian, and why a singularity produces exactly the symptom described (huge joint speed for small tool speed, loss of a motion direction).",
        rubric: "Excellent answer defines a singularity as a configuration where the Jacobian J (mapping joint velocities to end-effector velocities, v = J*qdot) loses rank, so its determinant goes to zero and it is non-invertible. To move the tool you invert: qdot = Jinv*v; near singularity Jinv blows up, demanding near-infinite joint velocity for a finite Cartesian velocity, which explains the violent joint spin and the controller slowing down to stay within joint speed limits. At the singularity the arm loses the ability to move instantaneously in at least one Cartesian direction (degenerate manipulability ellipsoid). Wrist singularity occurs when two wrist axes align (collinear), losing a DOF. Key insight: a singularity is rank loss of the Jacobian, where the velocity mapping becomes non-invertible, so commanded Cartesian motion maps to unbounded joint motion and a lost direction of mobility.",
      },
      {
        prompt: "Now you must run a trajectory whose straight-line path unavoidably passes through that wrist singularity. What practical strategies let you get through it without the violent joint motion, and what is the tradeoff of each?",
        rubric: "Strong answer offers options: (1) reroute/replan the path to skirt the singularity, tradeoff is the tool may not follow the exact desired straight line; (2) use damped least-squares / singularity-robust inverse (add a damping term so Jinv stays bounded), tradeoff is small tracking error near the singularity; (3) slow the Cartesian feed near the singularity so joint speeds stay within limits, tradeoff is cycle time; (4) plan in joint space through the region instead of Cartesian, tradeoff is loss of precise Cartesian path; (5) exploit redundancy (if available) or reposition the part to move the singularity out of the path. Key insight: you cannot have exact Cartesian tracking, bounded joint speed, AND pass through the singularity simultaneously, so every fix trades path accuracy, speed, or hardware change.",
      },
    ],
  },
  {
    id: "robotics_workspace_limits",
    slug: "concept-robotics-workspace-limits",
    title: "Why the Reachable Workspace Has Holes",
    prompt: "A customer complains that your robot's datasheet lists a 900 mm reach, yet there are points well within 900 mm that the arm cannot actually service with the tool pointing downward.",
    discipline: "MECHATRONICS",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["robotics", "conceptual"],
    skillAreas: ["robotics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the difference between the reachable workspace and the dexterous workspace, and why a point can be inside the reachable envelope yet still be unserviceable in a required orientation.",
        rubric: "Excellent answer distinguishes reachable workspace (set of points the tool center can reach in at least one orientation) from dexterous workspace (subset reachable in any/all orientations, or a required orientation). The datasheet reach describes the outer reachable envelope. A point can be reachable only with the tool tilted, so requiring tool-down orientation shrinks the usable region. Causes: joint limits, link geometry, wrist range, self-collision, and proximity to the inner boundary near the base. Key insight: reach is about position alone, but real tasks demand position plus orientation, and the dexterous workspace where a required orientation is achievable is always smaller than and nested inside the reachable workspace.",
      },
      {
        prompt: "Now the integrator can either tilt the part fixture by 20 degrees or add a rotary positioner (an extra external axis). Explain how each option changes the effective workspace problem and when you would prefer one over the other.",
        rubric: "Good answer: tilting the fixture re-maps the required tool orientation relative to the arm so target points fall inside the dexterous workspace for the geometry you have, cheap and passive but fixed and only helps if one tilt suits all points. Adding a rotary positioner adds a coordinated DOF so the part can be reoriented per-point, expanding the effective dexterous workspace dramatically and handling many orientations, but adds cost, control complexity (coordinated motion / extended kinematics), and calibration. Prefer the tilt for a single repetitive orientation; prefer the positioner for varied part geometry or many faces. Key insight: both fixes work by moving the task into the robot's dexterous region, one by a fixed remap and one by adding controllable DOF, trading cost and complexity for flexibility.",
      },
    ],
  },
  {
    id: "robotics_encoder_feedback",
    slug: "concept-robotics-encoder-feedback",
    title: "Encoders, Feedback, and a Drifting End-Effector",
    prompt: "After a power cycle, a robot that uses incremental encoders sometimes starts up thinking it is in the wrong position and crashes into a fixture, while an identical cell using absolute encoders never does. Separately, your team notices the tool tip position is slightly off even though every joint encoder reads exactly its commanded value.",
    discipline: "MECHATRONICS",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["robotics", "conceptual"],
    skillAreas: ["robotics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the difference between incremental and absolute encoders and why this difference produces the power-cycle behavior described.",
        rubric: "Excellent answer: an incremental encoder reports change in position (counts pulses relative to a starting point), so after power loss it has no memory of absolute angle and must be homed/referenced (drive to a known index or limit) before its position is valid; if it skips homing or miscounts, it believes a wrong position and can crash. An absolute encoder reports the actual shaft angle directly via a unique code per position (often multi-turn), so it knows true position immediately on power-up with no homing. Should mention incremental can also lose counts from noise/missed pulses. Key insight: incremental encoders measure relative motion and need a homing reference to establish absolute position, while absolute encoders retain true position through power cycles, which is exactly why one cell crashes and the other does not.",
      },
      {
        prompt: "Now consider the second symptom: joint encoders all read their commanded values yet the tool tip is off by a few millimeters. Encoders are not the problem, so what is, and how does this distinguish encoder feedback accuracy from overall positioning accuracy?",
        rubric: "Strong answer: encoders measure joint angle on the motor/joint side, not tool position. Tip error with correct joint readings points to errors outside the encoder loop: kinematic/calibration errors (wrong link lengths or DH parameters), gearbox backlash and compliance, link/joint deflection under load, thermal expansion, manufacturing tolerances, and tool-frame (TCP) calibration error. Distinguishes repeatability (encoder/servo can return to the same joint state) from accuracy (commanding a true Cartesian point), and notes feedback at the joint cannot correct errors downstream of the encoder unless you add end-effector sensing (vision, laser tracker) or better model calibration. Key insight: joint encoder feedback only closes the loop on joint angle, so absolute tool accuracy is limited by the kinematic model and structural/transmission errors that the encoders cannot see, which is why accuracy and repeatability are different specifications.",
      },
    ],
  },
  {
    id: "robotics_payload_reach_compliance",
    slug: "concept-robotics-payload-reach-compliance",
    title: "Payload, Reach, and Compliance Tradeoffs",
    prompt: "An applications engineer must select an arm to insert a sensitive electrical connector into a mating socket on a chassis that moves slightly between cycles. A bigger arm offers more reach and payload; a smaller arm is stiffer near the base but barely reaches the far corner of the chassis.",
    discipline: "MECHATRONICS",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["robotics", "conceptual"],
    skillAreas: ["robotics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the tradeoff between payload and reach in arm selection, and why the rated payload typically falls as the arm extends toward maximum reach.",
        rubric: "Excellent answer: payload and reach trade off because a longer reach means a longer moment arm, so the same end load creates larger torques at the joints (tau = F*L) and larger deflection; motors and structure are torque- and stiffness-limited, so rated payload drops at full extension and rises when the load is held close in. Larger arms add link mass that also consumes joint torque. Mentions inertia and dynamic loads during acceleration further reduce usable payload at speed. Key insight: rated payload is not a single number but a function of pose; extending the arm increases the moment arm and inertia, so capacity falls toward maximum reach, making payload-at-reach the spec that actually matters.",
      },
      {
        prompt: "Now focus on the insertion itself with the chassis shifting slightly each cycle. Would you want a stiffer or a more compliant end-effector or control scheme here, and explain the compliance-versus-stiffness tradeoff for this task.",
        rubric: "Strong answer: pure high stiffness rigidly forces the connector to commanded position, which is great for accuracy but bad when the socket is misaligned, since small position error creates large contact forces and can jam or damage the connector (F = k*x with large k). Compliance (passive, like an RCC device, or active force control / impedance control) lets the part give way and self-align to the socket, accommodating the chassis shift and limiting contact force, at the cost of lower positioning stiffness and possible slower settling or reduced precision. Best practice is stiff during free-space approach, compliant during contact/insertion, or use force feedback. Key insight: insertion under uncertainty favors compliance so the assembly accommodates misalignment with bounded force, trading raw positional stiffness for robust, low-force mating, which is why stiffness and compliance are tuned to the phase of the task.",
      },
    ],
  },
];
