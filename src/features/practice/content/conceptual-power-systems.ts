import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "power_systems_why_ac_transmission",
    slug: "concept-power-systems-why-ac-transmission",
    title: "Why AC Won the Transmission War",
    prompt: "You are explaining to a new hire why the bulk transmission grid that carries power hundreds of miles from a remote power plant to a city runs on alternating current at very high voltage rather than the low-voltage DC that the original Edison systems used.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["power-systems", "conceptual"],
    skillAreas: ["power-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why historically AC beat DC for long-distance transmission. Tie your answer to how AC enables voltage transformation and why operating at high voltage matters for moving power over distance.",
        rubric: "An ideal answer notes that delivered power P = V*I (per phase), so for a fixed power demand, raising the transmission voltage proportionally lowers the current. Line losses are I^2*R, so cutting current by a factor of 10 cuts resistive losses by a factor of 100; high voltage therefore dramatically reduces conductor heating and allows thinner/cheaper conductors over long spans. The candidate should explain that the transformer is the enabler: a transformer only works on time-varying flux, so AC can be stepped up to hundreds of kV for transmission and stepped down for safe distribution and use, with very high efficiency and no moving parts. They should contrast this with early DC, which had no simple, efficient voltage-changing device, forcing generation near the load and limiting transmission distance. Bonus: mention insulation/clearance and corona as practical limits on how high you can go. Key insight: the transformer makes voltage cheap to change, and because losses scale with current squared while transmitted power scales with voltage times current, transmitting at high voltage (enabled only by AC) is what makes long-distance delivery efficient.",
      },
      {
        prompt: "Part 2: Now the constraints change. The modern answer is no longer 'always AC.' For a 1000 km undersea cable link or a very long point-to-point overhead interconnection, engineers increasingly choose HVDC. Why does the original AC-wins logic break down here, and what does HVDC buy you?",
        rubric: "An ideal answer explains that the high-voltage advantage (lower current, lower I^2*R loss) is available to DC too, now that power electronics (thyristor and IGBT converters) can efficiently convert AC to high-voltage DC and back, removing the historical reason DC lost. The candidate should identify why AC specifically struggles on long links: AC cables and lines have significant shunt capacitance, so charging current flows continuously and on long submarine cables this reactive charging current can consume the entire ampacity, leaving no room for real power; AC also suffers series-inductive reactance and reactive power management, plus the two ends must stay synchronized. DC has no reactive/charging current in steady state and no skin-effect penalty the same way, so cable length is not capacitance-limited. They should add that HVDC allows asynchronous interconnection of two grids running at different frequencies or phase angles, gives full controllability of power flow direction and magnitude, and is often cheaper above a break-even distance despite costly converter stations. Key insight: AC's transformer advantage is real for the general grid, but for very long or submarine links AC's distributed line capacitance and synchronization requirements dominate, and modern power-electronic converters give DC the same high-voltage loss benefit while eliminating charging current and decoupling the two grids.",
      },
    ],
  },
  {
    id: "power_systems_pf_correction",
    slug: "concept-power-systems-power-factor-correction",
    title: "The Factory With a Bad Power Factor",
    prompt: "An industrial plant runs many large induction motors. The utility bills the plant a penalty because its power factor is a lagging 0.75, and the plant manager asks you, the consulting engineer, to explain the problem and fix it.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["power-systems", "conceptual"],
    skillAreas: ["power-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the distinction between real power, reactive power, and apparent power, why induction motors create a lagging power factor, and why a low power factor costs both the utility and the plant money even though reactive power does no net work.",
        rubric: "An ideal answer defines real power P (kW, the average power that does useful work, V*I*cos(theta)), reactive power Q (kVAR, V*I*sin(theta), power that oscillates back and forth into magnetic/electric fields and nets to zero work), and apparent power S (kVA, the vector sum, S^2 = P^2 + Q^2). Power factor = P/S = cos(theta). The candidate should explain that induction motors draw magnetizing current to set up the rotating magnetic field in their inductive windings, so current lags voltage, producing lagging reactive power. They should explain the cost: for a given real-power demand, a low power factor means higher total current (I = S / (sqrt(3)*V) for three-phase), which forces the utility to size transformers, conductors, and generators for the larger kVA, and increases I^2*R losses throughout the system and causes voltage drop. Hence utilities penalize low PF to recover those costs and push the burden back to the customer. Key insight: reactive power does no net work but still requires real current-carrying capacity and causes real I^2*R losses and voltage drop, so a poor power factor inflates apparent power and current, and the utility charges for the wasted capacity it must provide.",
      },
      {
        prompt: "Part 2: Now the constraints change. You install a bank of fixed capacitors to correct the power factor, but the plant's motor loading varies a lot through the day, and a colleague warns about 'overcorrection' and resonance. Explain how capacitors fix the lagging power factor, what goes wrong if the bank is fixed while load varies, and what a better solution looks like.",
        rubric: "An ideal answer explains that capacitors draw leading reactive power, which cancels the lagging reactive power of the motors locally, so the reactive current is supplied near the load instead of being drawn all the way from the utility; this raises power factor toward unity and reduces line current and losses. The candidate should explain overcorrection: a fixed capacitor bank sized for full load supplies too much leading kVAR at light load, swinging the power factor leading, which can raise voltage at the bus (and may trigger a leading-PF penalty too). They should mention harmonic resonance risk: capacitors plus the system/transformer inductance form an LC circuit that can resonate near a harmonic frequency produced by drives or nonlinear loads, amplifying harmonic currents and voltages and damaging the capacitors. A better solution is automatic/switched (staged) capacitor banks that switch steps in and out to track the load, or detuned reactors in series with capacitors to shift resonance away from harmonics, or static VAR compensators / active power-factor correction for fast-varying loads. Key insight: capacitors locally supply the leading reactive power motors need, but reactive compensation must track the varying load and be detuned, because a fixed bank causes overcorrection and can resonate with system inductance at harmonic frequencies.",
      },
    ],
  },
  {
    id: "power_systems_three_phase_balance",
    slug: "concept-power-systems-three-phase-advantages",
    title: "Why Three Phases, Not One",
    prompt: "A mechanical engineer asks you why the grid and large industrial equipment use three-phase power instead of just running everything on single-phase like a household outlet.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["power-systems", "conceptual"],
    skillAreas: ["power-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the main engineering advantages of a balanced three-phase system over single-phase: constant instantaneous power delivery, the rotating magnetic field for motors, and conductor/copper efficiency. Be concrete about why these fall out of having three voltages 120 degrees apart.",
        rubric: "An ideal answer explains that three sinusoidal sources spaced 120 degrees apart deliver constant total instantaneous power (the sum of three sin^2 terms phased 120 degrees apart is constant), unlike single-phase where instantaneous power pulsates to zero twice per cycle; constant power means smoother torque, less vibration, and steadier generator loading. It should explain that three phases naturally produce a rotating magnetic field in the stator, which is what makes simple, robust, self-starting induction motors possible without commutators or extra starting circuitry. It should cover copper/conductor efficiency: a balanced three-phase system delivers far more power per kilogram of conductor than single-phase, and in a balanced system the three line currents sum to zero, so the neutral carries little or no current and can be reduced or omitted, saving conductor. Key insight: three voltages 120 degrees apart give constant total power, a self-rotating field for motors, and near-zero neutral current, so three-phase transmits more power with less conductor and runs machines more smoothly than single-phase.",
      },
      {
        prompt: "Part 2: Now the constraints change. The plant develops a badly unbalanced load (one phase loaded far more than the others) and someone removes the neutral connection on a four-wire system. Explain what goes wrong electrically and why balance matters so much, contrasting it with the ideal balanced case.",
        rubric: "An ideal answer explains that the clean advantages of three-phase rely on balance. With an unbalanced load the three line currents no longer sum to zero, so a return (neutral) current appears; in a four-wire wye system the neutral carries that unbalance current. If the neutral is removed (or broken) on an unbalanced wye load, the system neutral point shifts (floating neutral): the phase voltages across the loads redistribute, lightly loaded phases see overvoltage and heavily loaded phases see undervoltage, which can damage equipment. The candidate should note other consequences of unbalance: negative-sequence currents that cause extra heating and pulsating/braking torque in motors, increased losses, and stress on generators. They should contrast with the balanced ideal where neutral current is zero and total power is constant. Mitigations: keep loads balanced across phases, retain a properly sized neutral, and monitor for negative-sequence/unbalance. Key insight: three-phase benefits depend on balance, so an unbalanced load creates neutral current and negative-sequence effects, and losing the neutral lets the neutral point float and skews phase voltages, overvolting some loads and undervolting others.",
      },
    ],
  },
  {
    id: "power_systems_transformer_operation",
    slug: "concept-power-systems-transformer-operation",
    title: "How a Transformer Actually Works",
    prompt: "A junior engineer can recite that a transformer steps voltage up or down by its turns ratio but cannot explain the physics. You sit down to walk through what is really happening inside a substation transformer.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["power-systems", "conceptual"],
    skillAreas: ["power-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the operating principle of an ideal transformer: how a changing primary current produces flux in the core, how Faraday's law gives the voltage ratio from the turns ratio, why the current ratio is inverted, and why apparent power is conserved. State why a transformer cannot operate on steady DC.",
        rubric: "An ideal answer explains that AC primary current creates a time-varying magnetic flux that is channeled by the ferromagnetic core to link both windings. By Faraday's law, the induced voltage in each winding is proportional to the number of turns times the rate of change of flux (V = N*dPhi/dt), and since both windings share the same core flux, V_primary/V_secondary = N_primary/N_secondary (the turns ratio). For an ideal lossless transformer, power in equals power out, so V_p*I_p = V_s*I_s, which means the current ratio is the inverse of the voltage ratio (step up voltage, step down current). The candidate should state clearly that the device depends on dPhi/dt: with steady DC the flux is constant, dPhi/dt is zero, so no voltage is induced in the secondary, and the primary would behave like a near-short and overheat. Key insight: a transformer works by mutual induction through a shared changing core flux, Faraday's law makes voltage scale with turns while power conservation makes current scale inversely, and because it needs dPhi/dt it cannot transform steady DC.",
      },
      {
        prompt: "Part 2: Now the constraints change to a real transformer under heavy, sudden load. Explain the main departures from the ideal model (winding resistance and leakage reactance, core hysteresis and eddy-current losses, magnetizing current, and saturation) and how they show up as voltage regulation, efficiency, and heating in service.",
        rubric: "An ideal answer identifies the real-world non-idealities and their effects. Copper losses: winding resistance causes I^2*R heating that grows with load. Leakage reactance: not all flux links both windings, producing a series reactance that, with winding resistance, causes the secondary voltage to drop under load (voltage regulation) and is what limits fault/short-circuit current (transformer impedance, often quoted as percent impedance). Core (iron) losses: hysteresis loss from cycling the core material and eddy-current loss in the core (mitigated by laminations and silicon steel) are roughly constant with load and present whenever energized. Magnetizing current: a small lagging current is needed to establish the core flux even at no load. Saturation: if voltage/flux is pushed too high (or DC offset/inrush occurs), the core saturates, magnetizing current spikes sharply and waveforms distort (inrush on energization). The candidate should connect these to service behavior: efficiency is high but falls at very light or very heavy load, voltage sags under heavy load and must be managed with taps, and losses become heat that the cooling system (oil, radiators, fans) must remove. Key insight: real transformers add copper and leakage-reactance effects that cause load-dependent voltage drop and heating, plus roughly constant core losses and magnetizing current, and saturation/inrush at high flux, all of which set the transformer's regulation, efficiency curve, and thermal limits.",
      },
    ],
  },
  {
    id: "power_systems_grid_stability_frequency",
    slug: "concept-power-systems-grid-frequency-stability",
    title: "Keeping the Grid at 60 Hz",
    prompt: "A large generator suddenly trips offline at peak demand. As the control-room engineer you must explain to a trainee why this immediately threatens grid frequency and how the system keeps frequency stable second by second.",
    discipline: "ELECTRICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["power-systems", "conceptual"],
    skillAreas: ["power-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why grid frequency is a direct indicator of the real-power balance between generation and load, what happens to frequency the instant a large generator trips, and the role of rotational inertia, governor (primary) response, and automatic generation control (secondary response) in arresting and restoring frequency.",
        rubric: "An ideal answer explains that frequency reflects the rotational speed of the synchronized generators, and it stays constant only when total mechanical power input equals total electrical load plus losses. The instant a generator trips, generation is less than load, so the deficit is drawn from the kinetic energy stored in the spinning masses of the remaining generators, which decelerate; frequency falls, and the initial rate of fall (rate of change of frequency, ROCOF) is set by the system inertia (more inertia means a slower, gentler decline that buys time). Primary response: governors on remaining units sense the speed drop and open valves to admit more energy within seconds, arresting the decline and settling at a slightly lower steady frequency (droop control shares the pickup among units). Secondary response: automatic generation control (AGC) then adjusts setpoints over tens of seconds to minutes to return frequency exactly to nominal and restore interchange/reserves. The candidate may mention spinning reserve and under-frequency load shedding as a last resort. Key insight: frequency is the real-time signal of generation-load balance, inertia from spinning masses cushions the initial frequency drop after a trip, governors provide fast droop-based primary response to arrest it, and AGC provides slower secondary response to restore frequency to nominal.",
      },
      {
        prompt: "Part 2: Now the constraints change. The same grid is being decarbonized: many synchronous plants are replaced by inverter-based wind and solar that contribute little or no rotational inertia. Explain why low system inertia makes frequency stability harder after a disturbance, and what techniques (synthetic/virtual inertia, fast frequency response, grid-forming inverters) can compensate.",
        rubric: "An ideal answer explains that conventional inverter-based resources connected with grid-following inverters supply power electronically and do not inherently couple stored kinetic energy to the grid, so they provide little physical inertia. With less inertia, the same generation loss produces a much steeper rate of change of frequency (high ROCOF) and a lower frequency nadir, giving governors less time to respond and increasing the risk of triggering under-frequency load shedding or cascading trips; ROCOF relays may also misoperate. Compensation techniques: synthetic or virtual inertia, where inverters are controlled to inject power proportional to df/dt, emulating an inertial response (often drawing on wind turbine rotor kinetic energy, batteries, or supercapacitors); fast frequency response from batteries that inject power within milliseconds to seconds, much faster than thermal governors; and grid-forming inverters that actively set voltage and frequency (acting as a voltage source behind an impedance) rather than following the grid, providing inherent inertial-like and stabilizing behavior. The candidate may add the value of storage, retaining some synchronous condensers/generators for inertia and short-circuit strength, and reserves. Key insight: replacing spinning machines with inverter-based generation lowers inertia, so disturbances cause faster, deeper frequency excursions, and stability must be restored with electronically provided fast frequency response, synthetic inertia, storage, and grid-forming inverters that mimic or replace the stabilizing role of rotating mass.",
      },
    ],
  },
  {
    id: "power_systems_voltage_drop_distribution",
    slug: "concept-power-systems-voltage-drop-reactive-support",
    title: "The Feeder That Sags at the End",
    prompt: "Customers at the far end of a long distribution feeder complain that their voltage drops too low during heavy-load afternoons. You are sent to diagnose and fix the voltage problem.",
    discipline: "ELECTRICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["power-systems", "conceptual"],
    skillAreas: ["power-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain physically why voltage drops along a loaded feeder, why both the resistance and the reactance of the line matter, and why the problem is worst at the far end during heavy load and for loads with poor (lagging) power factor.",
        rubric: "An ideal answer explains that a feeder has series impedance Z = R + jX, and load current flowing through that impedance produces a voltage drop, so the receiving-end voltage is lower than the sending-end voltage. The approximate voltage drop is roughly I*(R*cos(theta) + X*sin(theta)), or equivalently driven by both real and reactive power flow: P*R + Q*X dominates the drop. The candidate should explain that the drop accumulates with distance (more impedance) and grows with current, so the far end at peak load is worst. They should explain why power factor matters: a lagging load draws extra reactive current, and reactive power flowing through the line reactance X causes a large additional voltage drop (the Q*X term), so poor PF makes the sag much worse even at the same real power. Key insight: load current through the feeder's series R and X causes voltage drop that scales with distance and current and is strongly worsened by reactive (lagging) flow through the line reactance, so the far end sags most under heavy, low-power-factor load.",
      },
      {
        prompt: "Part 2: Now the constraints change. Across town, a feeder hosts heavy rooftop solar, and at midday the far-end voltage rises ABOVE limits instead of sagging. Explain why distributed generation can push voltage up (reverse the usual drop), why this is harder for traditional voltage-regulation equipment to handle, and what mitigations help in both the high-load and high-PV cases.",
        rubric: "An ideal answer explains that voltage drop direction follows power flow: when distributed solar generation exceeds local load, real power flows backward from the customer end toward the substation, so the P*R term reverses sign and the far end rises above the substation voltage (a voltage rise rather than a drop). The candidate should explain why this challenges legacy equipment: traditional load tap changers, line voltage regulators, and switched capacitors were designed assuming voltage falls monotonically with distance and load; bidirectional and rapidly varying PV (clouds) cause fast swings, can cause regulators and capacitor controls to hunt, and a tap setting that fixes the evening sag can worsen the midday rise. Mitigations should address both cases: for sag, reconductoring/larger conductor, voltage regulators and capacitor banks, raising substation voltage, and reactive support near the load; for PV rise, smart inverters with volt-VAR control (inverters absorb reactive power to pull voltage down) and volt-watt curtailment, distributed storage to absorb midday surplus, conservation voltage reduction schemes, and coordinated/communicating regulator and capacitor controls aware of bidirectional flow. Key insight: voltage tracks the direction and magnitude of power flow, so back-feeding solar raises far-end voltage by reversing the P*R drop, which legacy unidirectional regulation handles poorly, and the fix is bidirectional-aware control plus reactive support from smart inverters, storage, and coordinated regulation for both sag and rise.",
      },
    ],
  },
];
