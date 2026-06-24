import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "propulsion_thrust_mdot_dv",
    slug: "concept-propulsion-thrust-momentum-tradeoff",
    title: "How a Jet Engine Actually Makes Thrust",
    prompt: "A junior engineer claims that to double the thrust of a jet engine you should always just double the exhaust velocity. The engine they are looking at is a high-bypass turbofan on a commercial airliner cruising at altitude.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["propulsion", "conceptual"],
    skillAreas: ["propulsion"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Using the momentum picture of thrust, explain where thrust comes from and why the engineer's claim is an oversimplification. Be specific about the two levers available to a designer.",
        rubric: "An excellent answer derives thrust from momentum: thrust F is roughly mdot times the change in velocity, F = mdot*(Ve - V0), where mdot is mass flow rate, Ve is exhaust velocity, and V0 is flight (inlet) speed. It identifies the two levers: increase mass flow rate mdot (move a lot of air a little faster) or increase the velocity increment (Ve - V0). It notes that doubling Ve does not double thrust because the relevant quantity is the velocity DIFFERENCE (Ve - V0), not Ve alone, and at cruise V0 is large. It should mention that increasing mass flow rate is the high-bypass strategy. Key insight: thrust is the rate of change of momentum imparted to the working fluid, so it scales with mass flow times the velocity increment, not with exhaust velocity by itself.",
      },
      {
        prompt: "Part 2: Now the constraints change. The mission is reweighted so that propulsive efficiency and fuel burn at high subsonic cruise speed dominate the design, not raw thrust. Which lever should the designer favor now, and why does that push toward a high-bypass turbofan rather than a turbojet?",
        rubric: "An excellent answer explains that propulsive efficiency improves as exhaust velocity Ve approaches flight speed V0; the kinetic energy wasted in the exhaust scales with (Ve - V0) squared, so a large velocity excess is inefficient. To get a needed thrust at high efficiency you want LARGE mdot with a SMALL velocity increment, i.e. accelerate a large mass of air gently. That is exactly the high-bypass turbofan: a big fan moves a large bypass mass flow at modest velocity, giving good thrust with low exhaust velocity and high propulsive efficiency. A turbojet accelerates less air to much higher velocity, wasting energy as residual jet kinetic energy. Propulsive efficiency roughly equals 2/(1 + Ve/V0). Key insight: for efficient cruise you trade exhaust velocity for mass flow, because wasted exhaust kinetic energy grows with the square of the velocity excess while thrust grows only linearly.",
      },
    ],
  },
  {
    id: "propulsion_specific_impulse",
    slug: "concept-propulsion-specific-impulse-meaning",
    title: "What Specific Impulse Really Measures",
    prompt: "Two rocket engines are being compared on a spec sheet. Engine A has a higher thrust but a lower specific impulse (Isp); Engine B has lower thrust but a higher Isp. A program manager asks which engine is better.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["propulsion", "conceptual"],
    skillAreas: ["propulsion"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain physically what specific impulse measures and why thrust and Isp are not the same thing. Why can one engine win on thrust while the other wins on Isp?",
        rubric: "An excellent answer defines Isp as the thrust produced per unit weight flow rate of propellant, Isp = F/(mdot*g0), with units of seconds, and notes it is essentially effective exhaust velocity divided by g0 (Ve = Isp*g0). It explains Isp is a measure of propellant efficiency or fuel economy, i.e. how much impulse you get per kilogram of propellant, while thrust is the instantaneous force. Higher Isp means you get more delta-v per unit propellant mass. Thrust depends on mdot times Ve, so a high-mdot engine can have large thrust but mediocre Ve (low Isp), whereas a high-Ve engine can have high Isp but modest thrust if mdot is small. Key insight: thrust is how hard the engine pushes right now; specific impulse is how efficiently it uses propellant, and the two can be traded against each other.",
      },
      {
        prompt: "Part 2: Now the constraints change. Consider two mission segments: (a) lifting a heavy vehicle off the launch pad against gravity, and (b) a long deep-space transfer where total propellant mass is the binding constraint. For each segment, which engine matters more and why? Tie it to the rocket equation.",
        rubric: "An excellent answer says that for liftoff (a) thrust dominates: thrust must exceed weight (thrust-to-weight greater than 1) or the vehicle never leaves the pad, so Engine A (high thrust) is preferred even at lower Isp; gravity losses also reward getting off the pad quickly. For the deep-space transfer (b) Isp dominates because the rocket equation delta-v = Isp*g0*ln(m_initial/m_final) shows delta-v depends exponentially on the mass ratio and linearly on Isp; high Isp drastically cuts propellant for a given delta-v, so Engine B wins. It should note thrust is less critical in space where there is no gravity to fight continuously and burns can be long. Key insight: near a planet you are fighting weight so thrust-to-weight rules, but for propellant-limited maneuvers the rocket equation makes Isp the dominant driver of how much delta-v you can buy.",
      },
    ],
  },
  {
    id: "propulsion_cd_nozzle",
    slug: "concept-propulsion-converging-diverging-nozzle",
    title: "Why a Converging-Diverging Nozzle",
    prompt: "A new engineer designs a rocket nozzle as a simple converging cone, reasoning that squeezing the flow always speeds it up. The combustion chamber sits at very high pressure and the engine must operate in near-vacuum.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["propulsion", "conceptual"],
    skillAreas: ["propulsion"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why a purely converging nozzle cannot accelerate the exhaust past the speed of sound, and why a diverging section is required to reach supersonic exit velocity. Reference what happens at the throat.",
        rubric: "An excellent answer uses compressible-flow area-velocity reasoning: for subsonic flow (Mach less than 1) a decreasing area accelerates the flow, but for supersonic flow (Mach greater than 1) an INCREASING area accelerates it. This sign flip comes from the area-Mach relation dA/A = (M^2 - 1)*dV/V. The flow can only reach Mach 1 at the minimum area, the throat (it chokes there). To go supersonic you must then let the area increase, hence the diverging section. A purely converging nozzle can at best reach Mach 1 (choked) at its exit and no faster. Key insight: because the effect of area change reverses sign at Mach 1, you must converge to reach sonic conditions at the throat and then diverge to keep accelerating into the supersonic regime.",
      },
      {
        prompt: "Part 2: Now the constraints change. The same engine is fired at sea level instead of vacuum, and the nozzle was sized (very large area ratio) for the vacuum case. Explain what over-expansion means, what flow separation or shocks do to performance, and the design tradeoff between a sea-level nozzle and a vacuum nozzle.",
        rubric: "An excellent answer explains that ideal performance occurs when the nozzle exit pressure equals ambient pressure (perfectly expanded). A large vacuum-optimized nozzle expands the flow to a very low exit pressure; at sea level ambient pressure is much higher, so the nozzle is OVER-expanded (exit pressure below ambient). This causes the higher ambient pressure to push back, can drive oblique shocks into the nozzle and flow separation off the walls, causing thrust loss, side loads, and instability. The tradeoff: a short, low-area-ratio nozzle is better near sea level (avoids over-expansion), while a long, high-area-ratio nozzle gives more thrust in vacuum (more complete expansion); you cannot optimize both, which motivates altitude-compensating designs or staged nozzles. Under-expansion is the opposite case (exit pressure above ambient, flow keeps expanding outside). Key insight: a fixed nozzle is only ideal at one ambient pressure, so a vacuum-sized nozzle over-expands at sea level, inviting shocks and separation that cost thrust.",
      },
    ],
  },
  {
    id: "propulsion_choked_flow",
    slug: "concept-propulsion-choked-flow-throttle",
    title: "Choked Flow and the Limit on Mass Flow",
    prompt: "An engineer is sizing the throat of a gas feed system and notices that beyond a certain point, lowering the downstream pressure does nothing to increase the flow rate through the orifice. Upstream conditions are held fixed.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["propulsion", "conceptual"],
    skillAreas: ["propulsion"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the phenomenon of choked flow. Why does the mass flow rate stop increasing once the flow chokes, even as downstream pressure keeps dropping?",
        rubric: "An excellent answer explains that as downstream pressure drops, the flow at the minimum area (throat) accelerates until it reaches Mach 1 (sonic). Once sonic, the throat is choked: downstream pressure disturbances travel at the speed of sound and therefore cannot propagate upstream past the sonic throat to inform the upstream flow. So further lowering downstream pressure cannot increase velocity or mass flow at the throat. The mass flow rate becomes fixed by upstream stagnation conditions (P0, T0) and throat area: mdot_max scales with P0*A_throat/sqrt(T0) times a constant set by gamma. This occurs once the pressure ratio exceeds the critical value (about 1.89 for air, gamma 1.4). Key insight: at Mach 1 the throat is acoustically isolated from downstream, so the maximum mass flow is set by upstream stagnation conditions and throat area, not by how low you pull the back pressure.",
      },
      {
        prompt: "Part 2: Now the constraints change. To get more mass flow through a choked throat, a colleague proposes simply opening a downstream valve wider. Explain why that fails, and describe what you would actually change (upstream conditions or geometry) and how each affects mdot.",
        rubric: "An excellent answer states that opening a downstream valve only lowers back pressure, which does nothing once choked, so it fails. To raise choked mass flow you must change upstream stagnation conditions or throat geometry: increase upstream stagnation pressure P0 (mdot scales linearly with P0), increase throat area A_throat (mdot scales with area), or decrease upstream stagnation temperature T0 (mdot scales with 1/sqrt(T0), so colder, denser gas flows more for the same pressure). It may note the gas properties (gamma, molecular weight) also matter. It should reiterate that mdot_choked is proportional to P0*A/sqrt(T0). Key insight: because choked mass flow is governed by upstream stagnation state and throat area, you increase it by raising upstream pressure, enlarging the throat, or cooling the gas, never by lowering the back pressure.",
      },
    ],
  },
  {
    id: "propulsion_rocket_vs_airbreathing",
    slug: "concept-propulsion-rocket-vs-airbreathing",
    title: "Rocket Versus Airbreathing Propulsion",
    prompt: "A team is choosing a propulsion concept for a vehicle that must accelerate within the atmosphere and then continue into space. Someone proposes using a pure rocket for the entire trajectory; someone else argues for an airbreathing engine for the atmospheric phase.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["propulsion", "conceptual"],
    skillAreas: ["propulsion"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the fundamental difference between a rocket and an airbreathing engine in terms of what they carry and where they get their working fluid and oxidizer. Why does an airbreather typically achieve much higher Isp in the atmosphere?",
        rubric: "An excellent answer explains that a rocket carries BOTH fuel and oxidizer onboard and expels only its own stored propellant, so it is independent of the atmosphere and works in vacuum. An airbreathing engine (turbojet, turbofan, ramjet) carries only fuel and ingests atmospheric air as both oxidizer AND the bulk of its working mass. Because it does not carry oxidizer (which is most of the propellant mass in a rocket) and uses freestream air as reaction mass, an airbreather gets far more thrust per unit of fuel burned, hence much higher Isp (thousands of seconds versus a few hundred for chemical rockets). Key insight: a rocket is self-contained because it carries its oxidizer, while an airbreather leverages free atmospheric air as both oxidizer and reaction mass, which is why it is dramatically more fuel-efficient where air is available.",
      },
      {
        prompt: "Part 2: Now the constraints change. The vehicle must keep accelerating to very high Mach number and eventually leave the atmosphere entirely. Explain why the airbreathing advantage disappears at high altitude and high speed, and why a rocket becomes necessary, touching on air density, ram drag, and the need for a self-contained oxidizer.",
        rubric: "An excellent answer explains that airbreathing engines depend on atmospheric air, so as altitude increases the air density falls, mass flow and thrust drop, and above the sensible atmosphere there is no air to breathe at all, making airbreathing impossible. At very high Mach the engine must decelerate/process high-speed incoming air, ram drag and inlet/heating losses grow, and conventional turbomachinery cannot cope (motivating ramjets, then scramjets, each with limited speed ranges). A rocket carries its own oxidizer and reaction mass so it is unaffected by altitude or speed and is the only option in vacuum or for orbital acceleration. Hence combined-cycle or staged approaches: airbreathe low and slow for efficiency, switch to rocket high and fast. Key insight: airbreathing efficiency is only available where there is dense enough air at usable speeds; once you outrun or climb out of the atmosphere, only a self-contained rocket can keep accelerating.",
      },
    ],
  },
  {
    id: "propulsion_propulsive_efficiency_turbofan",
    slug: "concept-propulsion-turbofan-bypass-tradeoff",
    title: "Why Airliners Use High-Bypass Turbofans",
    prompt: "A clean-sheet airliner program must pick an engine architecture for long-haul subsonic cruise. The chief engineer asks why modern airliners use high-bypass turbofans instead of the turbojets used on early jets or military fighters.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["propulsion", "conceptual"],
    skillAreas: ["propulsion"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain how a turbofan works at a high level (core versus bypass flow) and why high bypass ratio improves fuel efficiency at subsonic cruise. Connect your reasoning to propulsive efficiency.",
        rubric: "An excellent answer describes a turbofan: a gas-generator core (compressor, combustor, turbine) drives a large front fan; some air goes through the core (hot, combusted) and most bypasses around the core (cold bypass flow). High bypass ratio means a large mass of air is accelerated to a relatively LOW velocity. Propulsive efficiency rises as exhaust velocity approaches flight speed (eta_prop is about 2/(1 + Ve/V0)), so moving a large mass of air gently (low Ve - V0) is more efficient than a turbojet moving less air very fast. The fan does the bulk of the work efficiently; the core just provides power. Lower jet velocity also means less wasted kinetic energy and quieter operation. Key insight: high bypass accelerates a large air mass to a modest velocity, keeping exhaust velocity close to flight speed and thus maximizing propulsive efficiency for subsonic cruise.",
      },
      {
        prompt: "Part 2: Now the constraints change. The same logic is applied to a supersonic fighter that must dash at high Mach and prize thrust-to-weight and frontal area over cruise fuel economy. Explain why a high-bypass turbofan is the wrong choice there and what architecture is favored instead.",
        rubric: "An excellent answer explains that at supersonic speeds flight speed V0 is very high, so a low exhaust velocity fan flow can no longer beat the freestream effectively, and propulsive efficiency benefits of high bypass evaporate; you need high exhaust velocity to produce thrust at high V0. A large fan also creates large frontal area and drag, bad for supersonic flight, and large nacelles add weight. Fighters favor low-bypass turbofans or turbojets, often with afterburners for high specific thrust and thrust-to-weight during dash/combat, accepting poor fuel economy. The priority shifts from fuel efficiency to specific thrust, compactness, and high-speed capability. Key insight: high bypass optimizes propulsive efficiency at subsonic speeds but its low exhaust velocity and large frontal area are liabilities supersonically, so fighters use low-bypass or turbojet architectures tuned for high specific thrust.",
      },
    ],
  },
];
