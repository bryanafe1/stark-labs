import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "fluid_mechanics_nozzle_bernoulli_continuity",
    slug: "concept-fluid-mechanics-nozzle-pressure-drop",
    title: "Pressure Drop Across a Garden Nozzle",
    prompt: "Water flows steadily through a horizontal hose and exits through a nozzle whose outlet area is one quarter of the hose area. You measure a higher static pressure inside the hose than at the nozzle exit.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["fluid-mechanics", "conceptual"],
    skillAreas: ["fluid-mechanics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why the static pressure is lower at the nozzle exit than inside the hose, even though the same mass of water flows through both. Walk through how continuity and Bernoulli together explain the speed and pressure change.",
        rubric: "Excellent answer invokes continuity (Q = A*V constant for incompressible steady flow), so quartering the area quadruples the exit velocity. It then applies Bernoulli along a streamline (p + 0.5*rho*V^2 + rho*g*z = constant) on a horizontal line so the elevation term drops out; the large rise in dynamic pressure 0.5*rho*V^2 must come from a drop in static pressure p. Should note Bernoulli assumes inviscid, incompressible, steady flow along a streamline. Key insight: continuity sets the velocity from geometry, and Bernoulli then converts that kinetic energy gain into a static pressure deficit.",
      },
      {
        prompt: "Part 2: Now suppose the nozzle is partially clogged with mineral scale so the flow through it becomes highly viscous and dominated by friction. Does Bernoulli still predict the pressure relationship correctly, and how does your reasoning change?",
        rubric: "Excellent answer recognizes Bernoulli neglects viscous dissipation, so it overpredicts the exit pressure (or underpredicts the required upstream pressure) when friction is significant. The correct tool is the extended energy equation with a head loss term h_L, i.e. p1/rho/g + V1^2/2/g + z1 = p2/rho/g + V2^2/2/g + z2 + h_L. Mechanical energy is no longer conserved; it is irreversibly converted to heat. Should note the pressure drop is now larger than Bernoulli alone predicts and depends on flow regime and geometry. Key insight: Bernoulli is an energy-conservation statement valid only when viscous losses are negligible; once friction dominates you must add head loss.",
      },
    ],
  },
  {
    id: "fluid_mechanics_reynolds_transition_pipe",
    slug: "concept-fluid-mechanics-laminar-turbulent-transition",
    title: "Predicting Flow Regime in a Pipe",
    prompt: "A chemical plant pumps two different fluids through the same straight pipe at the same volumetric flow rate: light oil and water. The engineer wants to know whether each flow is laminar or turbulent.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["fluid-mechanics", "conceptual"],
    skillAreas: ["fluid-mechanics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain physically what the Reynolds number represents and why the same flow rate can be laminar for one fluid and turbulent for the other. Identify which fluid is more likely to be turbulent.",
        rubric: "Excellent answer defines Re = rho*V*D/mu (or V*D/nu) as the ratio of inertial to viscous forces. High Re means inertia dominates and disturbances grow into turbulence; low Re means viscosity damps disturbances and keeps flow laminar. With equal flow rate (hence equal V and D), the fluid with lower kinematic viscosity nu = mu/rho has higher Re. Water has much lower kinematic viscosity than light oil, so water is more likely turbulent and the oil more likely laminar. Should mention the rough pipe transition band around Re 2300 to 4000. Key insight: regime is set by the ratio of inertial to viscous forces, not by speed alone, so viscosity decides the outcome at fixed flow rate.",
      },
      {
        prompt: "Part 2: Now the engineer heats the oil substantially before pumping it. What happens to its flow regime and to the friction pressure drop, and why is the direction of the friction change not obvious?",
        rubric: "Excellent answer notes heating sharply lowers oil viscosity, raising Re and pushing the flow toward (or into) turbulence. The friction trend is non-obvious because two effects compete: in laminar flow the friction factor f = 64/Re falls as Re rises (lower viscosity reduces drag), but if the flow transitions to turbulent the friction factor stops dropping as fast and dissipation depends on roughness, so wall friction can rise relative to the laminar extrapolation. Should connect to head loss h_L = f*(L/D)*V^2/2/g and note pressure drop depends on both f and regime. Key insight: lowering viscosity reduces laminar friction but can trigger transition to turbulence, so the net effect on pressure drop depends on which regime you land in.",
      },
    ],
  },
  {
    id: "fluid_mechanics_boundary_layer_separation_drag",
    slug: "concept-fluid-mechanics-boundary-layer-separation",
    title: "Boundary Layer Separation on a Bluff Body",
    prompt: "Two spheres of identical diameter move through air at the same speed: one smooth like a ball bearing and one dimpled like a golf ball. Counterintuitively, the dimpled sphere can have lower total drag.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["fluid-mechanics", "conceptual"],
    skillAreas: ["fluid-mechanics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain how boundary layer separation produces pressure (form) drag on a sphere, and why making the boundary layer turbulent with dimples can reduce total drag despite increasing skin friction.",
        rubric: "Excellent answer explains the boundary layer is the thin near-wall region where velocity rises from zero at the wall to the freestream. On the rear of the sphere the flow moves into an adverse pressure gradient (pressure rising in the flow direction); the low-momentum near-wall fluid is decelerated, reverses, and the boundary layer separates, forming a low-pressure wake. The fore-aft pressure imbalance is form/pressure drag, which dominates for a bluff body. A turbulent boundary layer has more momentum near the wall (better mixing), so it resists the adverse gradient longer, separates farther back, narrows the wake, and cuts pressure drag. This reduction outweighs the increase in skin friction drag. Key insight: for bluff bodies pressure drag from separation dominates, and a turbulent boundary layer delays separation to shrink the wake.",
      },
      {
        prompt: "Part 2: Now consider a long, streamlined airfoil shape instead of a sphere, operating at low angle of attack. Would adding dimples or tripping the boundary layer turbulent help or hurt drag, and why does the answer flip?",
        rubric: "Excellent answer recognizes a slender streamlined body has little or no separation at low angle of attack, so form/pressure drag is already small and skin friction drag dominates. A turbulent boundary layer has higher wall shear stress than a laminar one, so forcing transition increases skin friction and therefore total drag. Keeping the boundary layer laminar as long as possible (laminar-flow airfoils) is preferred. The answer flips because the dominant drag mechanism changed from pressure drag (bluff body) to skin friction (streamlined body). Should note the tradeoff and the risk that a laminar boundary layer separates more easily if the gradient becomes adverse (e.g., at high angle of attack). Key insight: tripping turbulence helps only when separation-driven pressure drag dominates; for friction-dominated streamlined bodies it hurts.",
      },
    ],
  },
  {
    id: "fluid_mechanics_pump_cavitation_npsh",
    slug: "concept-fluid-mechanics-pump-cavitation-npsh",
    title: "Cavitation in a Centrifugal Pump",
    prompt: "A centrifugal pump draws water from a tank below it through a long suction line. On a hot afternoon the operator hears a sound like gravel rattling through the pump and notices the flow dropping and the impeller eroding over time.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["fluid-mechanics", "conceptual"],
    skillAreas: ["fluid-mechanics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain what cavitation is, why it is occurring at the pump suction, and how the concept of Net Positive Suction Head (NPSH available vs required) frames whether cavitation will happen.",
        rubric: "Excellent answer explains cavitation is the local formation of vapor bubbles when the static pressure of the liquid drops to its vapor pressure; the bubbles then collapse violently in higher-pressure regions, causing the gravel noise and impeller erosion. At the pump suction the pressure is lowest (elevation lift, friction losses in the suction line, and acceleration into the impeller eye all reduce it). NPSH available is the margin of total suction head above vapor pressure: roughly NPSHa = (p_atm - p_vapor)/rho/g - z_lift - h_L_suction. NPSH required is set by the pump design. Cavitation occurs when NPSHa falls below NPSHr. Key insight: cavitation happens when local pressure reaches vapor pressure, and you avoid it by keeping NPSH available above NPSH required.",
      },
      {
        prompt: "Part 2: Now identify why this is worse on a hot afternoon, and give two distinct changes to the installation (not the pump itself) that would raise NPSH available. Justify each from the NPSH equation.",
        rubric: "Excellent answer notes higher temperature raises the water vapor pressure p_vapor, which directly lowers NPSHa (the term (p_atm - p_vapor) shrinks), explaining the afternoon failure. Two valid installation fixes, each tied to the equation: (1) raise the source level or lower the pump to reduce the static suction lift z_lift (or flood the suction with a positive head); (2) reduce suction-line head loss h_L by using a larger-diameter, shorter, straighter pipe, fewer fittings, or removing a clogged strainer, since lower h_L raises NPSHa. Also acceptable: cooling the liquid to lower p_vapor, or pressurizing the supply tank to raise p_atm term. Should reject merely throttling the discharge as a fix. Key insight: every fix works by increasing one favorable term or decreasing a loss term in the NPSHa expression to restore margin above NPSHr.",
      },
    ],
  },
  {
    id: "fluid_mechanics_head_loss_pipe_sizing",
    slug: "concept-fluid-mechanics-head-loss-pipe-sizing",
    title: "Head Loss and Pipe Diameter Selection",
    prompt: "A facilities engineer must move a fixed water flow rate across a building. A junior engineer suggests using a smaller, cheaper pipe to save on material cost, arguing the same flow gets there either way.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["fluid-mechanics", "conceptual"],
    skillAreas: ["fluid-mechanics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why a smaller pipe at the same flow rate dramatically increases frictional head loss and pumping cost. Use the Darcy-Weisbach relationship to show how strongly head loss depends on diameter.",
        rubric: "Excellent answer states Darcy-Weisbach: h_L = f*(L/D)*V^2/2/g. For fixed Q, velocity V = Q/A scales as 1/D^2, so V^2 scales as 1/D^4; combined with the explicit L/D factor, head loss scales roughly as 1/D^5 (in turbulent flow where f is weakly varying). So a modest diameter reduction causes a large head loss increase. Higher h_L means more pump head and more energy cost over the equipment life, plus possible noise and erosion. The cheaper pipe shifts cost to operating expense. Key insight: head loss is extremely sensitive to diameter (about 1/D^5 at fixed flow), so small pipe savings are dwarfed by lifetime pumping energy.",
      },
      {
        prompt: "Part 2: Now the same line must instead carry a fixed flow of a very viscous fluid in the laminar regime. Does the strong diameter sensitivity still hold, and how does the friction physics differ from the turbulent water case?",
        rubric: "Excellent answer recognizes that in laminar flow f = 64/Re and Re = rho*V*D/mu, so substituting into Darcy-Weisbach reproduces the Hagen-Poiseuille result: pressure drop scales as mu*L*Q/D^4 for fixed Q (head loss strongly diameter dependent, about 1/D^4, and friction depends on viscosity, not roughness). The diameter sensitivity is still very strong but slightly weaker exponent than the turbulent ~1/D^5 estimate, and the loss is linear in flow rate (not quadratic) and proportional to viscosity. Roughness is essentially irrelevant in laminar flow. Key insight: diameter still dominates cost in laminar flow via Hagen-Poiseuille (~1/D^4), but the loss now scales linearly with flow and with viscosity rather than with roughness and velocity squared.",
      },
    ],
  },
  {
    id: "fluid_mechanics_lift_circulation_stall",
    slug: "concept-fluid-mechanics-lift-circulation-stall",
    title: "How a Wing Generates Lift, and Loses It",
    prompt: "An interviewer is skeptical of the popular explanation that air travels faster over the top of a wing simply because it has farther to go and must meet up with the air below at the trailing edge.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["fluid-mechanics", "conceptual"],
    skillAreas: ["fluid-mechanics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Give a physically correct explanation of how an airfoil generates lift, addressing why the equal-transit-time argument is wrong and how circulation, the Kutta condition, and the pressure field relate to the lift force.",
        rubric: "Excellent answer rejects equal-transit-time (the upper and lower flows do NOT have to arrive together, and they do not; upper flow actually moves faster than that argument predicts). Correct picture: the airfoil shape and angle of attack turn the flow, establishing a circulation (net swirl) around the wing fixed by the Kutta condition (flow leaves the sharp trailing edge smoothly). Higher velocity over the top corresponds to lower static pressure (Bernoulli), lower velocity and higher pressure underneath; the integrated pressure difference is lift. Equivalent view: the wing deflects momentum downward and reaction is upward (Newton). Can cite Kutta-Joukowski L per span = rho*V*Gamma. Key insight: lift comes from circulation set by the Kutta condition, producing a top-bottom pressure difference, not from equal transit times.",
      },
      {
        prompt: "Part 2: Now the pilot keeps increasing the angle of attack past a critical value and the wing suddenly stalls, losing lift. Explain in boundary-layer terms what changed, and why lift can drop even though the angle of attack is larger.",
        rubric: "Excellent answer connects stall to boundary-layer separation: as angle of attack rises, the adverse pressure gradient on the suction (upper) surface steepens until the boundary layer can no longer stay attached and separates near the leading edge or spreads forward. The flow over the top breaks down, the smooth circulation that the Kutta condition supported collapses, the low-pressure region over the top is lost, and lift falls sharply while pressure drag rises. So beyond the critical angle, increasing angle of attack hurts rather than helps. Should note lift coefficient rises with angle up to the stall angle, then drops. Key insight: stall is boundary-layer separation destroying the upper-surface low-pressure region, so past the critical angle more angle gives less lift.",
      },
    ],
  },
];
