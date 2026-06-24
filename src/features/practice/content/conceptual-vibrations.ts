import type { PracticeProblem } from "../types";

// ---------------------------------------------------------------------------
//  CONCEPTUAL (open-ended, interview-style) vibrations questions.
//  evaluationMode = "LLM_GRADED"; the candidate writes a free-form answer to
//  each `part`, and later parts change the constraints — exactly how a real
//  interviewer probes deeper. Each part carries a `rubric` the AI grades against.
// ---------------------------------------------------------------------------

export const problems: PracticeProblem[] = [
  {
    id: "vibrations_fan_resonance",
    slug: "concept-vibrations-fan-resonance",
    title: "Cooling Fan That Shakes at One Speed",
    prompt:
      "A large industrial cooling fan runs smoothly across most of its speed range, but at one specific RPM the whole frame shakes violently. Above and below that RPM the shaking dies down.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["vibrations", "conceptual"],
    skillAreas: ["vibrations"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Part 1: Explain physically why the fan shakes hard only near one RPM, and what determines that RPM. What is the source of the periodic force?",
        rubric:
          "Excellent answers identify resonance: the rotating unbalance produces a harmonic force whose frequency equals the shaft rotation frequency (1x RPM). When that forcing frequency coincides with the structure's natural frequency wn = sqrt(k/m), the response amplitude peaks. Should explain that away from resonance the dynamic amplification factor is near 1 (or small), but near r = w/wn = 1 the amplification is large and limited only by damping. Should name rotating unbalance (a mass eccentricity producing force m*e*w^2) as the periodic source, and note the force grows with w^2 even though the big amplitude is a resonance effect, not just bigger force. Key insight: the violent shaking is resonance — the once-per-rev unbalance force is sweeping through the structure's natural frequency at that one RPM.",
      },
      {
        prompt:
          "Part 2: Now the customer says the fan must keep running at exactly that troublesome RPM. You cannot change the operating speed. What are your options to kill the vibration, and what are the trade-offs of each?",
        rubric:
          "Strong answers separate the levers in the equation of motion. Options: (1) Shift the natural frequency away from the forcing frequency by changing stiffness k or mass m (stiffen the frame to raise wn, or add mass to lower it) so r is no longer near 1 — trade-off is added weight or cost and the risk of hitting a different mode. (2) Add damping to limit the peak amplitude at resonance — trade-off is damping only helps strongly near resonance and adds heat/cost. (3) Reduce the forcing itself by balancing the rotor (precision balancing to cut the eccentricity e) — usually the best first move. (4) Add a tuned mass damper / vibration absorber tuned to that frequency. Should note that simply isolating the fan from the floor does not fix a resonance internal to the fan structure. Key insight: when you cannot move the forcing frequency, you must either move the natural frequency, add damping, kill the unbalance at the source, or add an absorber.",
      },
    ],
  },
  {
    id: "vibrations_damping_ratio_decay",
    slug: "concept-vibrations-damping-ratio-decay",
    title: "Reading Damping From a Ring-Down Test",
    prompt:
      "An engineer plucks a cantilevered bracket and records its free vibration. The trace shows a clean sinusoid whose peaks shrink steadily, and it takes many cycles to die out.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["vibrations", "conceptual"],
    skillAreas: ["vibrations"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Part 1: From this ring-down trace, what can you infer about the damping ratio zeta, and how would you actually extract a number for it? Explain the reasoning.",
        rubric:
          "Excellent answers recognize this is an underdamped system (zeta < 1) because it oscillates and decays. Because it rings for many cycles with slowly shrinking peaks, zeta is small (lightly damped, typically a few percent). Method: use the logarithmic decrement delta = (1/n)*ln(x0/xn) measured from successive peak amplitudes, then zeta = delta / sqrt((2*pi)^2 + delta^2), which for small damping reduces to zeta approximately delta/(2*pi). Should note the damped frequency wd = wn*sqrt(1 - zeta^2) is very close to wn when zeta is small. Key insight: the rate of peak decay (log decrement) maps directly to zeta, and slow decay over many cycles means light damping.",
      },
      {
        prompt:
          "Part 2: Now suppose the same bracket is submerged in oil and re-tested. The trace no longer oscillates at all — it just creeps back to zero without crossing. What changed, and what does that tell you about the system now?",
        rubric:
          "Strong answers identify the system is now critically damped or overdamped (zeta >= 1): no oscillation, no overshoot, a monotonic return to equilibrium. The oil greatly increased the viscous damping coefficient c, raising zeta past 1 (or to exactly 1 at critical damping, c_critical = 2*sqrt(k*m)). Should note you can no longer use log decrement (no peaks) and that an overdamped system actually returns more slowly than a critically damped one — critical damping gives the fastest non-oscillatory return. Should connect to the natural frequency being unchanged (k and m are the same; only c changed), so wn is the same but the response character is completely different. Key insight: crossing zeta = 1 changes the qualitative behavior from oscillatory decay to a non-oscillatory creep, driven entirely by the damping term, not by stiffness or mass.",
      },
    ],
  },
  {
    id: "vibrations_isolation_vs_absorption",
    slug: "concept-vibrations-isolation-vs-absorption",
    title: "Quieting a Pump on a Mezzanine Floor",
    prompt:
      "A reciprocating pump bolted to a steel mezzanine floor is transmitting an annoying hum to the offices below. The pump runs at a fixed, known speed.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["vibrations", "conceptual"],
    skillAreas: ["vibrations"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Part 1: You decide to put the pump on soft spring mounts (vibration isolation). Explain how isolation reduces transmitted force, and what design rule governs the choice of mount stiffness relative to the pump speed.",
        rubric:
          "Excellent answers explain force transmissibility: isolators work by making the isolated natural frequency wn much lower than the forcing frequency w, so the frequency ratio r = w/wn is large. Transmissibility drops below 1 only when r > sqrt(2); for good isolation you want r of about 3 or more, which means SOFT mounts (low k, hence low wn). Should warn that during start-up/coast-down the machine passes through r near 1 (resonance) where transmissibility is high, so some damping is needed to survive that passage — but too much damping raises transmissibility at high r, so it is a trade-off. Should distinguish that isolation reduces the force PATH to the floor rather than the pump's own motion. Key insight: isolation requires the mount to be soft enough that the forcing frequency sits well above resonance (r > sqrt(2)), and damping helps at start-up but hurts isolation at speed.",
      },
      {
        prompt:
          "Part 2: A colleague instead proposes bolting a tuned mass damper (dynamic absorber) onto the floor near the pump rather than isolating the pump. Contrast how an absorber works versus isolation, and say when you would prefer the absorber.",
        rubric:
          "Strong answers explain a tuned vibration absorber is a secondary mass-spring tuned so its natural frequency equals the forcing frequency; at that tuning the absorber's motion creates a force that cancels (drives to near zero) the motion of the primary structure at that single frequency. Key contrasts: isolation works over a broad band above r = sqrt(2) and reduces transmitted force by softening the connection; an absorber works at one narrow frequency and requires a constant, known forcing frequency (which fits this fixed-speed pump). An undamped absorber creates two new resonant peaks straddling the original frequency, so it is sensitive to detuning if the speed drifts; adding damping to the absorber broadens it but no longer drives response to exactly zero. Prefer the absorber when the disturbance is a single fixed frequency and you cannot or do not want to soften the mounting (e.g., the floor itself is resonating, or alignment requires a stiff mount). Key insight: isolation is broadband and softens the path, while a tuned absorber is a narrowband counter-force best suited to a single constant forcing frequency.",
      },
    ],
  },
  {
    id: "vibrations_shaft_critical_speed",
    slug: "concept-vibrations-shaft-critical-speed",
    title: "Whirling Shaft Near a Critical Speed",
    prompt:
      "A long slender shaft carrying a disk runs up smoothly until, at a certain speed, it begins to bow out and whirl with large lateral motion. Operators are told never to dwell at that speed.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["vibrations", "conceptual"],
    skillAreas: ["vibrations"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Part 1: Explain what a critical speed is and why the shaft whirls violently there. Why is it dangerous to dwell at that speed, but acceptable to run above it?",
        rubric:
          "Excellent answers explain that the critical speed is the rotational speed at which the rotation frequency equals a lateral bending natural frequency of the rotor-shaft system (wn = sqrt(k/m), k being the shaft's lateral bending stiffness). The unavoidable mass eccentricity produces a synchronous lateral force at 1x speed; when that equals the bending natural frequency, you get resonance and the deflection grows large (whirl), limited only by damping. Dwelling is dangerous because the amplitude builds and can cause rub, fatigue, or failure. Above the critical speed the shaft 'self-centers': the heavy spot moves to the inside and the geometric center spins about the mass center, so deflection actually decreases — this is why supercritical operation is acceptable, provided you pass through the critical quickly. Key insight: critical speed is bending resonance of the rotor; you must transit it quickly, but beyond it the rotor self-centers and runs quieter.",
      },
      {
        prompt:
          "Part 2: The redesign moves the disk from the mid-span toward one bearing, and the bearings are changed from rigid to flexible (compliant) supports. How do these two changes affect the critical speed(s), and what new behavior might appear?",
        rubric:
          "Strong answers reason about how stiffness and mass distribution set wn = sqrt(k/m). Moving the disk toward a bearing typically stiffens the effective lateral support seen by the mass and changes the mode shape, generally raising that critical speed compared with a mid-span disk (mid-span gives the lowest stiffness, hence lowest critical). Making the bearings flexible REDUCES the effective system stiffness (springs in series: shaft bending plus support flexibility), which LOWERS critical speeds. New behavior: flexible/anisotropic supports can split a single critical into separate forward and backward whirl criticals or into two criticals for the two support stiffness directions, and can introduce additional rigid-body (bouncing/rocking) modes at lower speeds. Should note net effect depends on which change dominates. Key insight: critical speed scales with sqrt(effective stiffness / mass); compliant supports add series flexibility that lowers it and can split one critical into several, while relocating the mass reshapes the modes and shifts the criticals.",
      },
    ],
  },
  {
    id: "vibrations_forced_response_phase",
    slug: "concept-vibrations-forced-response-phase",
    title: "Phase Lag in a Shaken Instrument Mount",
    prompt:
      "A sensitive instrument sits on a spring-and-damper mount that is shaken by a sinusoidal base motion. An engineer notices the instrument's motion lags the shaker, and the lag grows as the shaker speeds up.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["vibrations", "conceptual"],
    skillAreas: ["vibrations"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Part 1: Explain how the steady-state response amplitude AND the phase lag of a forced single-degree-of-freedom system vary as the forcing frequency goes from well below, through, and well above the natural frequency. Why does the phase pass through 90 degrees at resonance?",
        rubric:
          "Excellent answers describe the frequency-response (transfer function) behavior. Amplitude: well below wn (r << 1) the mass follows the input nearly statically (amplification near 1); near r = 1 the amplitude peaks (dynamic amplification, height set by 1/(2*zeta) for light damping); well above wn (r >> 1) the response rolls off and the mass barely moves (inertia dominates). Phase: at low r the response is nearly in phase (lag near 0), at r = 1 the lag is exactly 90 degrees regardless of damping, and at high r the lag approaches 180 degrees (response opposes the force). Should explain the 90-degree point physically: at resonance the applied force is balanced against damping (the spring and inertia forces cancel each other), so velocity is in phase with force and displacement lags by 90 degrees — and this is where damping alone limits amplitude. Key insight: amplitude peaks at resonance while phase sweeps monotonically from 0 to 180 degrees, passing through exactly 90 degrees at wn where inertia and stiffness cancel and damping rules.",
      },
      {
        prompt:
          "Part 2: Now define transmissibility for this base-excited mount (how much of the base motion reaches the instrument). The engineer wants to add damping to protect the instrument. Is more damping always better? Reason about the full frequency range.",
        rubric:
          "Strong answers define transmissibility as the ratio of transmitted (instrument) motion to base motion as a function of frequency ratio r and damping zeta. Key facts: transmissibility is near 1 at low r, peaks near r = 1 (the peak is reduced by damping), equals exactly 1 at r = sqrt(2) for ALL damping values, and is below 1 only for r > sqrt(2) where you get isolation. The catch: adding damping LOWERS the resonant peak (good for surviving resonance and start-up) but RAISES transmissibility in the isolation region r > sqrt(2) (bad — less attenuation at high frequency). So more damping is not always better; it is a trade-off between taming the resonance peak and preserving high-frequency isolation. Best practice is enough damping to limit the peak without spoiling isolation. Key insight: all transmissibility curves cross at r = sqrt(2); below it damping helps, above it damping hurts, so damping is a compromise, not a free win.",
      },
    ],
  },
  {
    id: "vibrations_modes_mdof",
    slug: "concept-vibrations-modes-mdof",
    title: "Mode Shapes of a Two-Story Frame",
    prompt:
      "A two-story building frame is modeled as two lumped floor masses connected by columns acting as springs. A shake-table test reveals it responds strongly at two distinct frequencies.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["vibrations", "conceptual"],
    skillAreas: ["vibrations"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt:
          "Part 1: Why does a two-mass system have two natural frequencies, and what does the mode shape at each frequency look like? Describe how the two floors move relative to each other in each mode.",
        rubric:
          "Excellent answers explain that a system with N degrees of freedom has N natural frequencies, each with its own mode shape (eigenvector). For two floors: the first (lower) mode has both floors moving IN PHASE (same direction), with the top floor moving more — a gentle sway. The second (higher) mode has the floors moving OUT OF PHASE (opposite directions), with a node-like point between them where motion is small. Should explain a mode shape is the fixed pattern of relative amplitudes the structure takes when vibrating purely at that frequency, found from the eigenvalue problem of the mass and stiffness matrices. Should note higher modes have more sign changes (more nodes) and higher frequency. Key insight: two masses give two modes — a low-frequency in-phase sway and a higher-frequency out-of-phase mode — each a distinct deflection pattern.",
      },
      {
        prompt:
          "Part 2: An earthquake's energy is concentrated at a low frequency that happens to match the first mode. The engineer wants to protect the building by adding stiff diagonal bracing. Could this backfire, and how would you decide where to add stiffness or mass?",
        rubric:
          "Strong answers recognize that adding stiffness raises the natural frequencies (wn scales with sqrt(k/m)), which could move the first mode AWAY from the earthquake's low frequency — helpful. But it can backfire: stiffening shifts ALL modes, possibly moving the second (or first) mode INTO a frequency band where the ground motion still has strong energy, or making the structure attract more acceleration (stiffer structures often see higher accelerations even with less displacement). Should mention using the mode shapes to place changes intelligently: add stiffness where a mode has large inter-story drift (high modal participation) to be effective; adding mass lowers frequencies and may be the wrong direction here. Should mention alternatives like base isolation (lowering frequency below the earthquake band) or a tuned mass damper at the top where the first-mode amplitude is largest. Key insight: changing stiffness moves every mode, so you must check the whole spectrum and use the mode shapes (and the earthquake's frequency content) to decide where changes help rather than just shifting the problem to another mode.",
      },
    ],
  },
];
