import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "process_control_feedback_vs_feedforward",
    slug: "concept-process-control-feedback-vs-feedforward",
    title: "Feedback vs Feedforward on a Heat Exchanger",
    prompt: "A shell-and-tube heat exchanger heats a process stream using steam. The process inlet flow rate swings unpredictably throughout the day, and the outlet temperature is the controlled variable, with steam valve position as the manipulated variable.",
    discipline: "CHEMICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["process-control", "conceptual"],
    skillAreas: ["process-control"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "A pure feedback temperature controller already exists but reacts sluggishly to the inlet flow swings. Explain why feedback alone struggles here, and describe how adding feedforward on the measured inlet flow would improve disturbance rejection.",
        rubric: "Excellent answer notes that feedback is corrective and only acts after the disturbance has already moved the outlet temperature (it waits for an error to develop), and that the exchanger has thermal lag and dead time so the correction arrives late. It explains feedforward measures the disturbance (inlet flow) directly and pre-emptively adjusts the steam valve before the outlet temperature deviates, ideally using a model relating flow to required steam. Should note feedforward needs a good process model and cannot correct for unmeasured disturbances, so it is paired with feedback as a trim. Key insight: feedback reacts to error after the fact while feedforward acts on the disturbance before it propagates, so combining them gives fast rejection of the known disturbance plus correction of everything else.",
      },
      {
        prompt: "Now suppose the inlet flow meter is removed and you can no longer measure the disturbance, but the inlet temperature sensor is reliable. How does this change your control strategy, and what are the limits of what you can now achieve?",
        rubric: "Excellent answer recognizes feedforward on flow is no longer possible without the flow measurement, so the main flow disturbance must be handled by feedback alone (accepting slower rejection). It notes you could still build feedforward on inlet temperature since that disturbance is still measured, but that does not address the flow swings. May suggest improving feedback aggressiveness, adding a model-based or inferential estimate of flow, or cascade with steam flow to reject valve-side disturbances. Should acknowledge unmeasured disturbances fundamentally cannot be fed forward. Key insight: feedforward can only cancel disturbances you can measure, so losing the flow sensor pushes the dominant disturbance back onto feedback and caps the achievable performance.",
      },
    ],
  },
  {
    id: "process_control_dead_time_dominance",
    slug: "concept-process-control-dead-time-dominance",
    title: "Dead Time in a Long Pipeline Loop",
    prompt: "A composition analyzer sits 200 meters downstream of a blending point where a controller adjusts an additive flow. Because of transport delay plus analyzer cycle time, the controller does not see the effect of a move for nearly three minutes.",
    discipline: "CHEMICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["process-control", "conceptual"],
    skillAreas: ["process-control"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain why large dead time is so destabilizing for a feedback loop, and why simply increasing controller gain to speed up the response tends to make things worse rather than better.",
        rubric: "Excellent answer explains dead time adds phase lag without changing gain, eroding phase margin, so the loop is prone to oscillation and instability. It notes that during the dead time the controller gets no feedback, so an aggressive controller keeps pushing in the same direction (over-correcting) and only finds out it overshot three minutes later, producing slow growing oscillations or limit cycling. Higher gain shortens the period but reduces stability margin, so the classic remedy is to detune (lower gain, slower) which sacrifices speed. Key insight: dead time means the controller is always acting on stale information, so the only safe move with a plain PID is to be patient and detune, trading performance for stability.",
      },
      {
        prompt: "Management wants tighter composition control despite the delay. Describe what a Smith predictor (or dead-time compensator) does, and what conditions must hold for it to actually help instead of hurt.",
        rubric: "Excellent answer explains a Smith predictor uses an internal model of the process to predict the response and effectively removes the dead time from the feedback loop, letting the controller be tuned as if the delay were not there (predicting where the output is headed before the analyzer confirms it). It stresses the compensator is only as good as the model: errors in the estimated dead time or process gain degrade or destabilize it, and it is sensitive to model mismatch and to dead time that varies with flow rate. Should note good measurement and a reasonably accurate, stable model are prerequisites. Key insight: a Smith predictor buys back performance by substituting a model prediction for the missing real-time feedback, so it lives or dies by the accuracy of that model, especially the dead-time estimate.",
      },
    ],
  },
  {
    id: "process_control_pid_tuning_intuition",
    slug: "concept-process-control-pid-tuning-intuition",
    title: "PID Tuning Intuition and Integral Windup",
    prompt: "An operator complains that a flow control loop overshoots badly on setpoint changes and then takes a long time to settle. You pull up the trend and see the controller is a PI controller with a fairly high integral action.",
    discipline: "CHEMICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["process-control", "conceptual"],
    skillAreas: ["process-control"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the distinct roles of the proportional, integral, and derivative terms, and from the symptom described, which term is most likely mistuned and in which direction.",
        rubric: "Excellent answer describes proportional acting on present error (provides speed but leaves offset), integral acting on accumulated past error (eliminates steady-state offset but adds lag and can cause overshoot/oscillation if too strong), and derivative acting on the rate of change of error (anticipatory damping, sensitive to noise). From the symptom of overshoot plus slow settle, the most likely culprit is too much integral action (integral time too short), which should be lengthened/reduced; possibly also too much gain. Key insight: integral removes offset but at the cost of phase lag, so excessive integral is the classic cause of overshoot and sluggish settling, and the fix is to slow the integral down.",
      },
      {
        prompt: "Now suppose this same loop occasionally saturates because the valve hits fully open during large upsets. The operator reports that after such an event the loop overshoots even more wildly than usual on the way back. What phenomenon is this, and how do you prevent it?",
        rubric: "Excellent answer identifies integral (reset) windup: while the valve is saturated the error persists, so the integral term keeps accumulating even though the controller output cannot do anything more, building up a large stored value. When the process finally responds, the controller must unwind that excess integral, causing a large overshoot. Prevention is anti-windup, for example back-calculation/tracking, conditional/clamped integration that stops integrating when the output is saturated, or limiting the integral term. Key insight: when the actuator saturates the loop is effectively open, so the integrator must be stopped or back-calculated to keep it from charging up and forcing a big overshoot on recovery.",
      },
    ],
  },
  {
    id: "process_control_loop_oscillation",
    slug: "concept-process-control-loop-oscillation",
    title: "Diagnosing Why a Loop Oscillates",
    prompt: "A pressure control loop that ran fine for years has started cycling with a steady, near-constant amplitude and period. Nothing in the tuning was changed. The cycling is roughly sinusoidal and persists even when the setpoint is held constant.",
    discipline: "CHEMICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["process-control", "conceptual"],
    skillAreas: ["process-control"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "List the main candidate causes of a self-sustaining oscillation in a single loop, and explain how you would use the character of the oscillation to distinguish a tuning problem from a mechanical valve problem.",
        rubric: "Excellent answer lists causes such as overly aggressive tuning (too much gain or integral pushing the loop near its stability limit), valve stiction or backlash/deadband, an external cyclic disturbance, or interaction with another loop. It explains a tuning-induced oscillation is typically more sinusoidal and changes period/amplitude when you detune, whereas stiction produces a characteristic non-sinusoidal limit cycle (square-wave-like or sawtooth on the valve, with the controller output ramping while the valve sticks then jumps). Since tuning was not changed and the cycle is steady, stiction is a strong suspect. Key insight: a limit cycle that appears with no tuning change usually points to a nonlinearity like valve stiction, and the waveform shape (sinusoidal vs sawtooth/square) is the key diagnostic separating tuning from mechanical causes.",
      },
      {
        prompt: "You put the controller in manual and the oscillation stops completely. Then you slowly ramp the controller output by hand and notice the valve position does not move smoothly but jumps in steps. Reinterpret the root cause and explain why retuning would not fix it.",
        rubric: "Excellent answer concludes the oscillation is caused by valve stiction (the valve sticks until the controller output builds enough force, then slips/jumps past the target, then sticks again), confirmed because going to manual stops the cycle and the manual ramp shows stepped jerky motion rather than smooth travel. It explains retuning cannot fix this because the limit cycle is driven by the actuator nonlinearity, not by loop gain; detuning may slow the cycle but the stick-slip persists, and integral action actually sustains it. The real fix is mechanical: repair/replace the valve, fix the positioner or packing, or use a stiction-compensating algorithm as a stopgap. Key insight: a stuck-then-slip valve creates a limit cycle no controller tuning can eliminate, so the cure is to fix the valve hardware, not the loop parameters.",
      },
    ],
  },
  {
    id: "process_control_cascade_control",
    slug: "concept-process-control-cascade-control",
    title: "Cascade Control on a Jacketed Reactor",
    prompt: "A jacketed batch reactor must hold a precise reaction temperature. Heating is supplied by hot oil flowing through the jacket, and the hot oil supply pressure fluctuates because other units share the same header.",
    discipline: "CHEMICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["process-control", "conceptual"],
    skillAreas: ["process-control"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Describe how a cascade scheme with a reactor-temperature master and a jacket-flow (or jacket-temperature) slave would be configured, and explain specifically why cascade rejects the oil header pressure disturbance far better than a single loop.",
        rubric: "Excellent answer describes the outer/master loop controlling reactor temperature and setting the setpoint of an inner/slave loop that controls jacket flow or jacket temperature by stroking the valve. It explains the inner loop is fast and sees the header pressure disturbance almost immediately (a pressure change shifts flow, the slave corrects the valve quickly), so the disturbance is caught and rejected before it ever propagates into the slow reactor temperature. The master only has to handle the slower reaction-side dynamics. Key insight: cascade works because a fast inner loop absorbs disturbances in the manipulated path before they reach the slow primary variable, so the header pressure swings are handled locally rather than waiting for the reactor temperature to drift.",
      },
      {
        prompt: "Now imagine the slave (inner) loop is tuned slower than the master (outer) loop. Explain what goes wrong, and state the general rule for the relative speeds of the two loops and why it must hold.",
        rubric: "Excellent answer explains that if the inner loop is slower than the outer loop the cascade breaks down: the master changes the slave setpoint faster than the slave can follow, so the slave cannot track, the loops fight or interact, and you can get instability or sustained oscillation. The general rule is the inner loop must be significantly faster than the outer loop (commonly several times faster, e.g. at least 3 to 5x faster dynamics). This must hold so the master sees the slave as a fast, essentially solved sub-process and the two loops are dynamically decoupled. Key insight: cascade only helps when the inner loop is much faster than the outer loop, because the master assumes the slave settles quickly; violate that and the loops interact and can go unstable.",
      },
    ],
  },
  {
    id: "process_control_level_vs_temperature",
    slug: "concept-process-control-level-vs-temperature",
    title: "Controlling Level vs Temperature",
    prompt: "An engineer is setting up two loops on the same surge drum system: a liquid level loop on a buffer drum feeding a downstream column, and a temperature loop on a small heater. The new engineer wants to tune both loops tightly for the fastest possible response.",
    discipline: "CHEMICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["process-control", "conceptual"],
    skillAreas: ["process-control"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain why level control on a surge drum is often deliberately tuned loose (averaging level control) while a temperature loop is usually tuned for tight setpoint tracking. Address the difference in process dynamics and control objectives.",
        rubric: "Excellent answer explains a surge drum exists to smooth flow disturbances, so the control objective for level is usually NOT to hold a tight setpoint but to let the level float within a band and pass through a smooth, filtered outlet flow to protect the downstream column. Level is a pure (or near-pure) integrating process, so tight tuning amplifies and passes upstream flow swings straight downstream, defeating the surge purpose; loose/averaging tuning (low gain, slow) uses the drum capacity as a buffer. Temperature, by contrast, is a self-regulating lagged process where the objective genuinely is to hold setpoint (product quality/safety), so it warrants tighter tuning. Key insight: the right tightness depends on the objective and dynamics, so an integrating surge level should be tuned loose to absorb disturbances while a self-regulating temperature is tuned tight to hold setpoint.",
      },
      {
        prompt: "Now the drum is changed from a surge buffer to a reflux accumulator that must hold a precise level for the column to operate correctly, and tight level control becomes essential. What new tuning and design challenges does the integrating nature of level introduce compared with the self-regulating temperature loop?",
        rubric: "Excellent answer explains that because level is an integrating process it has no natural steady state and does not self-regulate, so even a small sustained imbalance ramps the level without bound; a controller (often with proportional emphasis) is needed and integral action must be used carefully because an integrating process plus integral controller is prone to slow oscillation and overshoot. It contrasts with the self-regulating temperature loop which settles to a value on its own. Should mention level measurement noise/swell or boiling/level swell, valve sizing, and that aggressive integral on an integrating process can cause cycling. Key insight: an integrating process like level has no self-correcting tendency, so tight control demands careful (often proportional-dominant, light-integral) tuning to avoid the slow oscillations that an integrating-plus-integrator combination produces, unlike a self-regulating temperature loop.",
      },
    ],
  },
];
