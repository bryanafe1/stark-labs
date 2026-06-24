import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "control_systems_open_vs_closed_oven",
    slug: "concept-control-systems-open-vs-closed-oven",
    title: "Open vs Closed Loop on a Reflow Oven",
    prompt: "You are tuning the heater on a solder reflow oven. Today it runs open loop: a fixed power level is applied to the heating element for a fixed time, with no temperature sensor in the control path. The team complains that some boards come out under-reflowed and others scorched.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["control-systems", "conceptual"],
    skillAreas: ["control-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why an open-loop heater produces inconsistent results board to board, and what fundamentally changes if you close the loop with a thermocouple feeding back to the controller.",
        rubric: "Open loop applies a fixed command and cannot observe the actual output, so it cannot correct for disturbances or plant variation: line voltage drift, ambient temperature, board thermal mass, element aging. The relationship command-to-temperature is assumed fixed but is not, so error accumulates uncorrected. Closing the loop measures actual temperature and drives the heater on the error (setpoint minus measured), so the controller continuously corrects toward the target regardless of disturbances or model error; it trades blind accuracy for measured accuracy. Should note feedback also adds the possibility of instability and needs a sensor. Key insight: open loop is only as accurate as its model of the plant, while closed loop rejects disturbances and plant uncertainty by acting on measured error rather than assumption.",
      },
      {
        prompt: "Part 2: Now suppose the thermocouple has a slow response and reads the true board temperature with a 20-second lag. What problems does that sensor lag introduce in the closed loop, and how should it change the way you tune or design the controller?",
        rubric: "Sensor lag is a delay/phase loss inside the loop: the controller acts on stale information, so it keeps heating after the board has actually reached temperature, causing overshoot, and it reacts late to disturbances. Added phase lag erodes phase margin and pushes the system toward oscillation/instability, so the same aggressive gains that were fine become unstable. Remedies: reduce loop gain / detune for stability, use a faster sensor or better thermal coupling, add a model-based predictor (Smith predictor) or feedforward from the known heater dynamics, or slow the setpoint trajectory. Key insight: measurement delay behaves like dead time in the loop, costing phase margin and forcing a tradeoff of slower, gentler control unless you predict around the lag.",
      },
    ],
  },
  {
    id: "control_systems_pid_term_roles_drone",
    slug: "concept-control-systems-pid-term-roles-drone",
    title: "Roles of the PID Terms on a Drone Altitude Hold",
    prompt: "A quadcopter holds altitude with a PID controller on the vertical axis: error is desired altitude minus measured altitude, and the output is a throttle adjustment. The drone currently settles slowly and ends up hovering a few centimeters below the commanded height.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["control-systems", "conceptual"],
    skillAreas: ["control-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Describe the distinct role each PID term plays on this altitude loop, and explain specifically which term is responsible for eliminating the steady few-centimeter offset below the commanded height.",
        rubric: "Proportional acts on present error, providing immediate corrective throttle proportional to how far off altitude is; alone it leaves a steady-state offset because to hold altitude against gravity a nonzero throttle is needed, but P only produces output when error is nonzero. Integral accumulates error over time and keeps adding throttle until the offset is driven to zero, so integral is what removes the steady centimeter offset (and supplies the constant bias to fight gravity). Derivative acts on the rate of change of error, adding damping that reduces overshoot and oscillation and improves settling. The constant droop here is the classic signature of insufficient/absent integral action. Key insight: P responds to present error and leaves a residual offset against a constant load, I integrates that residual to zero, and D damps the transient.",
      },
      {
        prompt: "Part 2: Now the drone must hold altitude in gusty wind that pushes it down and then suddenly stops. With integral gain raised to kill the offset, the drone overshoots badly when the gust ends. Explain what is happening and how you would address it.",
        rubric: "During the sustained gust the integrator winds up, accumulating a large stored value to fight the disturbance; when the gust ends the accumulated integral term is still commanding high throttle and must unwind, so the drone overshoots upward (integral windup). Fixes: anti-windup such as clamping/back-calculation that limits integrator growth when the actuator saturates, conditional integration (stop integrating during saturation), lowering integral gain and leaning more on proportional/derivative or feedforward, or adding derivative/D action to anticipate the rapid error change. Could mention rate limiting and actuator saturation as the trigger. Key insight: a large integral term that eliminated steady error becomes a liability after a transient disturbance because the stored history lags reality, so anti-windup is needed to keep integral action from causing overshoot.",
      },
    ],
  },
  {
    id: "control_systems_too_much_gain_oscillates",
    slug: "concept-control-systems-too-much-gain-oscillates",
    title: "Why Cranking Up the Gain Makes It Oscillate",
    prompt: "An engineer tuning a position servo on a robotic arm joint keeps increasing the proportional gain to make the arm track its target faster. At low gain it is sluggish; as the gain rises the arm gets snappier, then begins to ring after each move, and at a high enough gain it buzzes in a sustained oscillation and never settles.",
    discipline: "ELECTRICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["control-systems", "conceptual"],
    skillAreas: ["control-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain in terms of feedback, phase lag, and stability margins why increasing the loop gain first speeds the response and then drives the system into sustained oscillation.",
        rubric: "The loop has inherent phase lag from its dynamics (mechanical inertia, actuator and sensor dynamics, any delay). Higher gain raises the frequency at which the open-loop magnitude crosses unity (the gain crossover), and at higher frequencies the system has accumulated more phase lag. Sustained oscillation occurs when, at some frequency, the loop gain is one and the total phase reaches 180 degrees: the negative feedback effectively becomes positive at that frequency and the error reinforces itself. Raising gain shrinks the gain margin and phase margin toward zero; speed improves because higher gain means faster correction, but margins erode until the system sits on the stability boundary and rings at its natural/crossover frequency. Key insight: a real loop always has phase lag, and at the frequency where that lag hits 180 degrees, gain at or above unity turns negative feedback into self-sustaining oscillation, so increasing gain trades stability margin for speed.",
      },
      {
        prompt: "Part 2: Now you must keep the fast response the high gain gives you but stop the ringing. Without simply lowering the proportional gain, what could you add or change in the controller to restore stability margin, and why does it work?",
        rubric: "Add phase lead near the crossover frequency: derivative action or a lead compensator injects phase that counteracts the lag at crossover, raising phase margin so the loop tolerates the high gain without oscillating; derivative responds to error rate and damps the ringing. Other valid moves: notch filter to cancel a lightly damped mechanical resonance that is driving the buzz, reduce loop delay/improve sensor bandwidth, stiffen or better-damp the mechanics, or shape the loop so gain rolls off before the phase reaches 180 degrees. Should tie the chosen fix to increasing phase margin at the gain crossover. Key insight: stability is about phase margin at crossover, so adding phase lead (derivative/lead/notch) lets you keep high gain and speed while pulling the phase away from 180 degrees where it counts.",
      },
    ],
  },
  {
    id: "control_systems_disturbance_rejection_cruise",
    slug: "concept-control-systems-disturbance-rejection-cruise",
    title: "Disturbance Rejection in Cruise Control",
    prompt: "A car's cruise control holds a set speed by commanding throttle based on the error between target speed and measured speed. On flat ground it holds speed perfectly; the question is how it behaves on hills and against headwinds.",
    discipline: "ELECTRICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["control-systems", "conceptual"],
    skillAreas: ["control-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the mechanism by which closed-loop cruise control rejects a disturbance like a sustained uphill grade, and why a purely open-loop fixed-throttle approach would fail on the same hill.",
        rubric: "A grade is a load disturbance: it slows the car, which creates a speed error (target minus measured). The feedback controller sees that error and increases throttle to push speed back toward target; it keeps correcting as long as error persists, so the closed loop automatically compensates for the hill without knowing the hill exists. With integral action the steady error is driven to zero on the constant grade. An open-loop fixed throttle cannot sense the slowdown and would simply lose speed on the climb (and overspeed on a descent) because it never observes or reacts to the disturbance. Key insight: feedback rejects disturbances by acting on the error they produce, so the loop corrects for the hill without ever modeling it, which open-loop control fundamentally cannot do.",
      },
      {
        prompt: "Part 2: Now imagine the car also has a forward-looking sensor and a map that tells it a steep grade is coming in 100 meters. How would adding feedforward from that grade information change the control, and what are its benefits and risks compared with relying on feedback alone?",
        rubric: "Feedforward uses the known/measured disturbance (the upcoming grade) to pre-command extra throttle before the speed error appears, so the car begins compensating proactively rather than waiting for the error feedback reacts to. Benefit: much smaller speed dip and faster, smoother response because correction happens before the disturbance takes effect; feedback then only cleans up residual error. Risks: feedforward is only as good as the model/measurement, an inaccurate grade estimate or timing error injects its own disturbance; it cannot correct what it does not know about, so feedback must remain to handle model error and unmodeled disturbances. Best practice is feedforward plus feedback combined. Key insight: feedforward cancels a measured disturbance before it causes error but depends on an accurate model, so it complements rather than replaces feedback, which still handles uncertainty.",
      },
    ],
  },
  {
    id: "control_systems_poles_response_shape",
    slug: "concept-control-systems-poles-response-shape",
    title: "Reading System Behavior From Pole Locations",
    prompt: "Two motor-drive systems are characterized by the locations of their closed-loop poles in the complex plane. System A has a pair of poles close to the imaginary axis with a large imaginary part; System B has poles far to the left on the real axis. A colleague asks you to predict how each will respond to a step command without simulating.",
    discipline: "ELECTRICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["control-systems", "conceptual"],
    skillAreas: ["control-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain how the location of the closed-loop poles maps to the step-response behavior, and contrast the expected response of System A versus System B.",
        rubric: "Pole real part sets decay rate (how fast transients die out, the time constant); poles farther left decay faster and give a quicker, more damped settle. Imaginary part sets oscillation frequency; complex poles produce ringing while purely real poles give non-oscillatory (overdamped) response. Distance from the imaginary axis relative to the imaginary part is damping: the angle from the negative real axis indicates damping ratio. System A, near the imaginary axis with large imaginary part, is lightly damped: oscillatory, large overshoot, slow to settle, possibly almost marginally stable. System B, far left on the real axis, is fast and well damped with little or no overshoot. Stability requires all poles in the left half plane. Key insight: the real part of a pole governs how fast its mode decays and the imaginary part governs how fast it oscillates, so poles near the imaginary axis ring and settle slowly while far-left real poles give fast, smooth response.",
      },
      {
        prompt: "Part 2: Now a design change adds a slow pole to System B, located much closer to the imaginary axis than its existing poles. Explain the concept of dominant poles and how this new slow pole changes the response and your view of the system order.",
        rubric: "The dominant poles are those closest to the imaginary axis; they decay slowest and therefore dominate the long-term transient response, while far-left poles decay quickly and contribute fast, short-lived modes. Adding a slow pole near the imaginary axis makes it the new dominant pole, so the response becomes slower (longer settling time, sluggish) and is now governed mainly by that pole; the previously fast far-left poles become negligible to the overall shape. This lets you approximate a high-order system by the reduced-order dynamics of its dominant pole(s). Should note a nearby zero can partially cancel a pole and mitigate the effect. Key insight: the slowest (closest to the imaginary axis) poles dominate the response, so adding one near the axis slows the system and lets it be approximated by that dominant pole regardless of how many faster poles exist.",
      },
    ],
  },
  {
    id: "control_systems_steady_state_error_type",
    slug: "concept-control-systems-steady-state-error-type",
    title: "Steady-State Error and System Type on a Tracking Stage",
    prompt: "A precision linear stage uses a feedback controller to track a commanded position. With a proportional-only controller it holds a fixed target with a small constant position error, and when commanded to follow a constant-velocity ramp it lags behind by a growing amount.",
    discipline: "ELECTRICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["control-systems", "conceptual"],
    skillAreas: ["control-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why a proportional-only controller leaves a constant error on a step target and a growing error on a ramp, and how adding integral action changes the steady-state error to each input.",
        rubric: "Proportional output is gain times error, so to hold any nonzero output (to overcome friction, load, or to keep moving) the error must be nonzero; with no integration there is no pole at the origin (a Type 0 system) so a step leaves a finite steady-state error inversely related to loop gain, and a ramp leaves an unbounded/growing error because P cannot keep up with a continuously changing reference. Adding integral introduces a pole at the origin (raises system type to Type 1): the integrator accumulates error until it is zero, so steady-state error to a step becomes zero, and the ramp now has a finite constant following error (set by the velocity error constant) instead of a growing one. Key insight: steady-state error depends on the number of integrators (system type) versus the input order, so each added integrator removes the error to one higher class of input, turning the step error to zero and the ramp error from growing to finite.",
      },
      {
        prompt: "Part 2: Now the stage must track that constant-velocity ramp with zero following error, but adding more integrators is hurting stability. What approach lets you drive the ramp error to zero without stacking integrators, and what is the tradeoff you are managing?",
        rubric: "Use feedforward: feed the known reference velocity (and acceleration) directly to the actuator command so the controller does not rely on error to generate the tracking command; a velocity feedforward term supplies the steady drive a ramp needs, driving following error to zero without adding a loop integrator. Alternatively shape the loop or use a two-degree-of-freedom design. The tradeoff: each integrator added to the feedback path raises system type and kills steady-state error but adds phase lag, eroding phase margin and threatening stability; feedforward improves tracking outside the feedback loop so it does not cost stability margin, but it depends on an accurate plant model and a known reference. Key insight: integrators buy zero steady-state error at the cost of phase margin and stability, so feedforward of the reference achieves zero ramp-following error without that stability penalty, trading model accuracy for stability.",
      },
    ],
  },
];
