import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "dynamics_method_selection_collision",
    slug: "concept-dynamics-method-selection-collision",
    title: "Choosing Newton vs Energy vs Momentum",
    prompt: "A loaded freight cart rolling at constant speed on a level track strikes and latches onto a second, heavier stationary cart, and the pair then continues down the track and compresses a spring bumper at the end.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["dynamics", "conceptual"],
    skillAreas: ["dynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "To find the velocity of the latched pair immediately after impact, which method do you reach for, and why are the other two methods poor choices for that specific step?",
        rubric: "Should pick conservation of linear momentum for the impact: during the brief collision the external (friction) impulse is negligible and internal latch forces cancel, so m1*v1 = (m1+m2)*v2. Should explain energy is NOT conserved because the latching is a perfectly inelastic collision that dissipates energy, so an energy balance would be wrong unless you treat the loss as unknown. Should explain Newton's second law is impractical because the impact force vs time is unknown and very short, so integrating F=ma is intractable. Key insight: pick the method by what is conserved or known during the phase of interest -- momentum survives short collisions because external impulse is negligible, while energy does not because inelastic latching destroys it.",
      },
      {
        prompt: "Now the constraints change -- instead of latching, the carts collide through an elastic spring bumper between them (no latch, they may separate), and you want the maximum bumper compression. Which method now, and what changes in your reasoning?",
        rubric: "Should recognize at maximum compression both carts move at a common velocity (relative velocity is zero), so momentum still gives that common velocity. Then energy IS conserved up to max compression (elastic spring, no permanent deformation), so set initial KE = KE at common velocity + spring PE to solve for compression. Should contrast with Part 1: here you use BOTH momentum and energy together because the elastic bumper stores rather than dissipates energy. Should note that after full rebound the collision is elastic so relative speed is preserved. Key insight: the elastic case lets you couple momentum (for the common-velocity instant) with energy conservation (for stored spring PE), whereas the inelastic latch case forbids the energy step.",
      },
    ],
  },
  {
    id: "dynamics_rolling_vs_sliding_ramp",
    slug: "concept-dynamics-rolling-vs-sliding-ramp",
    title: "Rolling Race and the Role of Friction",
    prompt: "A solid cylinder and a thin-walled hoop of equal mass and equal radius are released from rest at the top of an incline. One observer claims they tie; another bets on the cylinder.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["dynamics", "conceptual"],
    skillAreas: ["dynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Assuming both roll without slipping, which reaches the bottom first and why? Address the common misconception that mass or radius decides it.",
        rubric: "Should state the solid cylinder wins. Reasoning: energy splits between translation and rotation; the fraction going to rotation depends on the dimensionless I/(m*r^2), which is 0.5 for a solid cylinder and 1.0 for a hoop. The hoop puts more energy into spinning, leaving less for translation, so it accelerates more slowly. Should show a = g*sin(theta)/(1 + I/(m*r^2)) and note mass and radius cancel out -- only the mass distribution (shape) matters. Key insight: for rolling without slipping the linear acceleration depends only on the geometry factor I/(m*r^2), so the body with mass concentrated near the axis (solid cylinder) wins regardless of mass or radius.",
      },
      {
        prompt: "Now the constraints change -- the incline is coated with ice so friction is essentially zero. What happens to each body, and how does the race change?",
        rubric: "Should recognize that without friction there is no torque about the center, so neither body angularly accelerates -- they slide without rolling. Both then have a = g*sin(theta) identical to a frictionless block, independent of shape. So the race is now a TIE, and both arrive faster than either did while rolling (no energy diverted to rotation). Should note friction in the rolling case does no net work (contact point is instantaneously at rest) yet is essential to cause rolling. Key insight: removing friction removes the rolling constraint entirely, collapsing the shape dependence -- both objects become sliding blocks that tie and beat their own rolling times.",
      },
    ],
  },
  {
    id: "dynamics_gyroscopic_precession_design",
    slug: "concept-dynamics-gyroscopic-precession-design",
    title: "Gyroscopic Reactions in Rotating Machinery",
    prompt: "A high-speed turbine rotor is mounted on a vehicle. Engineers notice that when the vehicle turns or pitches, the rotor bearings see unexpected loads that are not present when the vehicle drives straight.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["dynamics", "conceptual"],
    skillAreas: ["dynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain physically why turning the vehicle produces a moment on the rotor bearings, and in which plane that reaction moment acts. Use the relationship between applied torque, spin, and precession.",
        rubric: "Should identify gyroscopic reaction: the spinning rotor has angular momentum L = I*omega_spin along its axis. Forcing a precession (the vehicle turn rotates the spin axis at rate Omega) requires a torque equal to the rate of change of L, magnitude tau = I*omega_spin*Omega, directed perpendicular to BOTH the spin axis and the precession axis (cross product Omega x L). Should explain this torque must be supplied by the bearings, so they carry a couple in a plane 90 degrees out from where intuition expects. Should mention the right-hand rule / cross-product nature and that the effect grows with spin speed and turn rate. Key insight: changing the direction of a large angular momentum vector demands a torque perpendicular to both the spin and the turn (tau = I*omega*Omega), and the bearings are what supply -- and feel -- that gyroscopic couple.",
      },
      {
        prompt: "Now the constraints change -- you may add a second identical rotor to reduce these gyroscopic bearing loads. How should you configure it, and what is the trade-off?",
        rubric: "Should propose counter-rotating the second rotor (equal spin speed, opposite direction) so the two angular-momentum vectors are equal and opposite and cancel; then the net gyroscopic torque under any maneuver cancels and bearing couples vanish. Could mention coaxial counter-rotating pair or a symmetric layout. Trade-off: added mass, cost, complexity, and the rotors must stay matched in speed -- if speeds drift apart the cancellation is imperfect; also net angular momentum is zero so any desired gyroscopic stabilizing benefit is also lost. Should note synchronization/coupling is required. Key insight: gyroscopic reactions scale with net angular momentum, so a counter-rotating twin nulls the net L and cancels the bearing couples -- at the cost of mass, complexity, and the need to keep the pair speed-matched.",
      },
    ],
  },
  {
    id: "dynamics_impulse_momentum_landing",
    slug: "concept-dynamics-impulse-momentum-landing",
    title: "Impulse, Peak Force, and Crashworthiness",
    prompt: "Two identical packages are dropped from the same height onto a loading dock. One lands on bare concrete; the other lands on a thick foam pad. Both come fully to rest.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["dynamics", "conceptual"],
    skillAreas: ["dynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Using the impulse-momentum theorem, explain why the foam dramatically reduces the peak force on the package even though the change in momentum is identical in both cases.",
        rubric: "Should state both packages arrive with the same momentum and must lose all of it, so the impulse (integral of F dt = change in momentum) is identical. The foam extends the stopping time dt; since impulse is fixed, a larger dt means a smaller average and peak force (F_avg = delta_p / dt). Concrete stops it almost instantly, giving a huge spike. Should reference J = F*dt = m*delta_v. Key insight: the momentum change is fixed by the drop, so the only lever on peak force is the stopping time -- stretching the deceleration over a longer dt is what the foam buys you.",
      },
      {
        prompt: "Now the constraints change -- a colleague suggests a stiff steel spring instead of foam, sized so the package just barely comes to rest at full compression. Does the spring protect the contents as well as the foam? Discuss force-time profile and rebound.",
        rubric: "Should note a linear spring gives a force that rises with deflection, peaking at maximum compression (F = k*x), and then it REBOUNDS, throwing the package back up -- it stores energy elastically rather than dissipating it, so the contents experience a second loading and the package does not stay put. Foam is largely dissipative (hysteresis), absorbing energy as heat so little rebound. For a given stroke a constant-force crush (ideal foam/crush can) gives the lowest possible peak force, whereas the spring's peak is higher for the same stroke and adds rebound. Should mention damping or energy absorption as the key distinction. Key insight: protection depends not just on lengthening dt but on DISSIPATING energy -- a spring stores and returns it (high peak plus rebound) while foam absorbs it, so the dissipative element wins for the same stroke.",
      },
    ],
  },
  {
    id: "dynamics_vibration_free_design",
    slug: "concept-dynamics-vibration-free-design",
    title: "Designing a Machine to Run Smoothly",
    prompt: "A reciprocating compressor bolted to a mezzanine floor shakes the whole structure badly at its operating speed. Management wants it quieted without buying a new compressor.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["dynamics", "conceptual"],
    skillAreas: ["dynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Diagnose the likely cause and explain the resonance/transmissibility reasoning. How does the ratio of operating frequency to the mount natural frequency govern how much force reaches the floor?",
        rubric: "Should identify the unbalanced reciprocating inertia forces as the excitation, and that the floor mounting has a natural frequency fn = (1/2pi)*sqrt(k/m). Force transmissibility depends on the frequency ratio r = f_operating/fn: near r = 1 you get resonance and large amplification; isolation (transmissibility below 1) only occurs when r is greater than sqrt(2). Should warn that simply stiffening the mounts raises fn and can move it TOWARD the operating speed, making things worse. Should mention damping reduces the resonant peak but slightly worsens isolation far above resonance. Key insight: vibration isolation is governed by the frequency ratio r = f/fn -- you must push the mount natural frequency well below the operating speed (r greater than sqrt(2)) using SOFT mounts, not stiff ones, to get transmissibility below 1.",
      },
      {
        prompt: "Now the constraints change -- the compressor must run over a WIDE range of speeds, including passing slowly through the mount natural frequency on startup, so a single soft mount cannot avoid resonance at all speeds. What design strategies address this?",
        rubric: "Should recognize that a variable-speed machine will sweep through resonance, so you cannot just place fn below the operating point. Strategies: add damping so the unavoidable resonant peak is bounded (accepting slightly worse high-speed isolation); pass through resonance QUICKLY on startup/shutdown so amplitude never builds; use a tuned mass damper or dynamic absorber tuned to the problem frequency; improve the source by adding balance masses or a counter-rotating balancer to cancel the reciprocating inertia forces at the source; or use active/semi-active mounts. Should weigh trade-offs (damping vs isolation, added mass/cost). Key insight: when the excitation frequency varies you cannot dodge resonance with soft mounts alone -- you manage it by adding damping, sweeping through quickly, balancing the source, or adding a tuned absorber.",
      },
    ],
  },
  {
    id: "dynamics_angular_momentum_skater",
    slug: "concept-dynamics-angular-momentum-skater",
    title: "Conservation of Angular Momentum and Energy Bookkeeping",
    prompt: "A robotic arm on a free-floating space platform (no external torques) carries a heavy payload at the end of an extended boom while the whole assembly slowly spins. The operator retracts the boom, pulling the payload toward the rotation axis.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["dynamics", "conceptual"],
    skillAreas: ["dynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "What happens to the spin rate as the boom retracts, and is energy conserved in this process? Reconcile angular momentum conservation with the change in rotational kinetic energy.",
        rubric: "Should state angular momentum L = I*omega is conserved (no external torque), so as I decreases (payload moves inward) omega increases -- it spins faster. Rotational KE = 0.5*I*omega^2 = L^2/(2I) INCREASES as I drops, so energy is NOT conserved in the sense of being constant; the extra energy comes from the motor/actuator doing positive work pulling the payload inward against the centripetal requirement. Should explicitly resolve the apparent paradox: L conserved but KE rises because work is added. Key insight: with no external torque L stays fixed so reducing I speeds up the spin, and the rotational KE rises precisely because the actuator does work pulling the mass inward -- angular momentum and energy obey different bookkeeping.",
      },
      {
        prompt: "Now the constraints change -- instead of an internal motor retracting the boom, a small thruster on the payload fires to push it inward. Does angular momentum still stay constant, and how does your energy accounting change?",
        rubric: "Should analyze whether the thruster exerts an EXTERNAL torque about the platform's center: a purely radial thrust (aimed straight at the axis) exerts no torque, so L is still conserved and the spin-up behavior is the same; but any tangential component of thrust DOES apply a torque and changes L. Energy now comes from the propellant/thruster rather than an internal actuator, and reaction mass is expelled so the system is no longer closed in mass. Should note the subtlety that 'internal vs external' hinges on the line of action relative to the axis. Key insight: angular momentum is conserved only if the thrust line passes through the spin axis (no torque arm) -- a radial thruster preserves L like the motor did, but any tangential component injects external torque and breaks the conservation argument.",
      },
    ],
  },
];
