import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "aerodynamics_lift_circulation",
    slug: "concept-aerodynamics-lift-circulation",
    title: "Why a Wing Actually Generates Lift",
    prompt: "A junior engineer tells you that a wing makes lift because the air on top travels a longer path and therefore must move faster to meet the air at the trailing edge, lowering pressure per Bernoulli. You suspect this 'equal transit time' story is wrong.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["aerodynamics", "conceptual"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the correct physical mechanism of lift generation. Address why the equal-transit-time argument fails, and tie your explanation to circulation and the Kutta condition.",
        rubric: "Excellent answers: state that the equal-transit-time premise is false (upper-surface air actually arrives sooner, not just on time, so parcels do not 'rejoin'). Explain lift via circulation: net circulation Gamma around the airfoil produces lift per the Kutta-Joukowski relation L' = rho*V*Gamma. Describe how the Kutta condition (smooth flow leaving the sharp trailing edge, no infinite velocity around it) sets the magnitude of circulation. Mention the starting vortex shed at startup and that bound circulation is equal and opposite to it (Kelvin's theorem, conservation of total circulation). Can note that Newton's third law / downwash and the pressure-difference view are equivalent, consistent descriptions, and that Bernoulli correctly relates the resulting speeds and pressures but does not by itself explain why the speeds differ. Key insight: lift arises because the airfoil forces the flow to leave the trailing edge smoothly, which requires a bound circulation; the velocity difference is a consequence of that circulation, not of any rule that parcels must rejoin at the same time.",
      },
      {
        prompt: "Now the constraints change. A symmetric airfoil at exactly zero angle of attack produces no lift, yet the upper and lower surfaces have identical shape and length. How does this fact support or refute the path-length story, and how does the same airfoil produce lift once you set it at a positive angle of attack?",
        rubric: "Excellent answers: note a symmetric airfoil has equal upper and lower path lengths, so the path-length story predicts zero lift at all angles, which is wrong since it lifts when pitched. At zero alpha the symmetric airfoil has zero net circulation by symmetry, hence zero lift, consistent with circulation theory. At positive alpha the Kutta condition forces the rear stagnation point to the trailing edge, which requires a nonzero bound circulation; this asymmetry in the flow (not in the geometry) generates lift. Should connect that camber or angle of attack are just two ways to create the flow asymmetry that yields circulation. Key insight: lift depends on flow asymmetry that produces circulation, which can come from angle of attack or camber, not from any difference in surface path length.",
      },
    ],
  },
  {
    id: "aerodynamics_stall_aoa",
    slug: "concept-aerodynamics-stall-aoa",
    title: "Angle of Attack, Stall, and Recovery",
    prompt: "During a flight test, a fixed-wing aircraft in a steady climb suddenly loses lift and the nose drops, even though the pilot reported airspeed was still well above the published cruise speed.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["aerodynamics", "conceptual"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain what stall is in terms of angle of attack and boundary-layer behavior, and why a wing can stall at high airspeed. Why is angle of attack, not airspeed, the true determinant of stall?",
        rubric: "Excellent answers: define stall as exceeding the critical angle of attack where the adverse pressure gradient on the upper surface causes the boundary layer to separate, destroying the suction peak and collapsing lift (Cl drops sharply past Cl_max). Explain that lift coefficient rises roughly linearly with alpha until separation, so stall is fundamentally an alpha phenomenon. Explain accelerated/high-speed stall: in a pull-up or turn the load factor n raises required Cl (since L = n*W), so the wing can reach critical alpha at high airspeed. Should mention that airspeed correlates with stall only at 1g, level, unaccelerated flight, hence the published stall speed assumption. Key insight: a wing stalls when it exceeds its critical angle of attack regardless of airspeed, because separation depends on alpha and the resulting adverse pressure gradient, not on speed directly.",
      },
      {
        prompt: "Now the constraints change. The design team wants the wing to stall at the root before the tip (so ailerons stay effective and the aircraft remains controllable in the stall). What design features achieve this, and what is the aerodynamic risk if instead the tips stall first?",
        rubric: "Excellent answers: name features that promote root-first stall: geometric washout (tips set to lower incidence so they reach critical alpha later), aerodynamic washout (different airfoil sections with higher Cl_max toward the tip), stall strips or leading-edge devices near the root to trigger early separation there, and planform/twist tailoring. Explain the controllability benefit: ailerons are near the tips, so keeping tip flow attached preserves roll control and stall warning behavior. Explain the risk of tip-first stall: loss of aileron authority, asymmetric tip stall causing a wing drop and possible spin entry, and for swept wings tip stall shifts the center of pressure forward causing a nose-up pitch (pitch-up) that deepens the stall. Key insight: forcing the root to stall first preserves roll control and benign stall behavior, whereas tip-first stall risks loss of aileron authority and departure into a spin.",
      },
    ],
  },
  {
    id: "aerodynamics_induced_parasitic_drag",
    slug: "concept-aerodynamics-induced-parasitic-drag",
    title: "Induced versus Parasitic Drag",
    prompt: "You are reviewing the drag breakdown for a new transport aircraft across its flight envelope. A colleague proposes shrinking the wingspan to reduce drag, arguing that less wing means less surface and therefore less drag.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["aerodynamics", "conceptual"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Distinguish induced drag from parasitic drag, including how each scales with airspeed and with lift. Explain why reducing wingspan is the wrong move at low-speed, high-lift conditions.",
        rubric: "Excellent answers: define parasitic drag (skin friction + form/pressure drag + interference), which grows with dynamic pressure, roughly with V squared. Define induced drag (lift-induced, the drag due to producing lift via finite-span trailing vortices and downwash), which scales as Cl squared and inversely with aspect ratio: Cdi = Cl^2 / (pi*AR*e). Note induced drag dominates at low speed/high Cl (takeoff, climb) and falls with V, while parasitic drag dominates at high speed; total drag is a U-shaped curve with a minimum near max L/D. Reducing span lowers aspect ratio, raising induced drag sharply at low speed, exactly when it already dominates, hurting climb and field performance even if wetted area falls. Key insight: parasitic drag rises with speed and induced drag falls with speed and rises with reduced span, so cutting span penalizes the low-speed regime where induced drag already governs.",
      },
      {
        prompt: "Now the constraints change. The aircraft will spend almost its entire mission cruising at high subsonic speed and high altitude, and gate-span limits cap the wingspan. Given fixed span, what aerodynamic and configuration choices reduce cruise drag, and what tradeoffs do winglets introduce?",
        rubric: "Excellent answers: at high-speed cruise parasitic and (near transonic) wave drag matter most, so emphasize reducing skin friction (smooth surfaces, laminar flow where feasible), wetted area, and interference drag, plus managing compressibility (thinner/supercritical sections, sweep) to delay wave drag. With span capped, raising effective aspect ratio via winglets or raked tips recovers some induced drag by reducing the strength/influence of tip vortices and increasing effective span without exceeding gate limits. Tradeoffs of winglets: added weight, added wetted area and its parasitic/profile drag (so net benefit depends on the lift condition), increased root bending moment requiring structural reinforcement, and benefit that is largest at high Cl/low speed and smaller at cruise; must trade against simply extending span if allowed. Key insight: with span fixed, cruise drag is cut mainly by reducing parasitic and wave drag, while winglets buy effective aspect ratio at the cost of weight, wetted area, and root bending moment.",
      },
    ],
  },
  {
    id: "aerodynamics_wing_sweep",
    slug: "concept-aerodynamics-wing-sweep",
    title: "Why High-Speed Wings Are Swept",
    prompt: "Two clean-sheet airliner concepts land on your desk: one has a straight wing, the other a wing swept back about 35 degrees. Both are meant to cruise at Mach 0.85.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["aerodynamics", "conceptual"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain why sweeping the wing benefits a transonic cruise aircraft. Use the idea of the component of the freestream normal to the wing and the critical/drag-divergence Mach number.",
        rubric: "Excellent answers: explain that what matters for compressibility on a wing is the velocity component normal to the leading edge (the spanwise component does little to set the pressures/shocks). Sweeping by angle Lambda reduces the effective normal Mach number to roughly M*cos(Lambda), so the wing reaches its critical Mach number and drag-divergence Mach number at a higher freestream Mach. This delays formation of strong upper-surface shocks and the associated wave drag rise, letting the aircraft cruise efficiently near Mach 0.85. Should mention drag divergence as the sharp rise in Cd once shocks form, and that sweep pushes that onset higher. Key insight: only the flow component normal to the wing drives compressibility, so sweep effectively reduces it by cos(Lambda), raising the drag-divergence Mach number and delaying wave drag.",
      },
      {
        prompt: "Now the constraints change. Sweep is not free. Describe the penalties swept wings introduce at low speed and structurally, including spanwise flow and tip stall, and explain why a low-speed STOL or trainer aircraft typically uses a straight wing instead.",
        rubric: "Excellent answers: list penalties of sweep: reduced lift-curve slope and lower Cl_max (need higher alpha or more complex high-lift devices, raising takeoff/landing speeds); spanwise (outboard) flow in the boundary layer that thickens it toward the tips and promotes tip stall, which on a swept wing causes a destabilizing nose-up pitch (pitch-up) as the center of pressure moves forward; structural weight from longer effective bending load path and aeroelastic effects (wash-out twist, divergence/flutter considerations). Hence low-speed STOL/trainer aircraft, which never approach transonic flow, gain nothing from sweep and instead want a straight wing for higher Cl_max, benign stall, lighter structure, and simpler handling. Key insight: sweep trades high-speed wave-drag relief for poorer low-speed lift, tip-stall/pitch-up tendencies, and structural weight, so aircraft that never go transonic use straight wings.",
      },
    ],
  },
  {
    id: "aerodynamics_supersonic_shocks",
    slug: "concept-aerodynamics-supersonic-shocks",
    title: "Shocks and Wave Drag in Supersonic Flight",
    prompt: "A supersonic vehicle is being analyzed at Mach 2. The aerodynamics team observes an oblique shock attached to the sharp nose and a separate, much stronger normal shock standing ahead of a blunt sensor housing mounted on the fuselage.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["aerodynamics", "conceptual"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the difference between the attached oblique shock at the sharp nose and the detached normal (bow) shock ahead of the blunt body. Describe what happens to Mach number, pressure, and total pressure across each, and why this matters for wave drag.",
        rubric: "Excellent answers: explain that a sharp slender body at a small deflection angle below the maximum allowable for the Mach number produces an attached oblique shock; flow turns through it, slows but can remain supersonic, with moderate rises in static pressure/temperature/density and a relatively small total (stagnation) pressure loss. A blunt body (or a deflection exceeding the max turning angle) forces a detached bow shock; near the centerline it behaves like a strong normal shock that decelerates the flow to subsonic, with large rises in static pressure and temperature and a large total-pressure loss (entropy generation). Connect total-pressure loss/entropy to wave drag: stronger shocks dissipate more energy and produce more wave drag, so the blunt housing is far more draggy per frontal area. Should note wave drag is a distinct, compressibility-only drag source absent in incompressible flow. Key insight: oblique shocks from slender sharp bodies are weak with small total-pressure loss, while detached normal/bow shocks from blunt bodies are strong with large total-pressure loss and much higher wave drag.",
      },
      {
        prompt: "Now the constraints change. To reduce its radar and drag signature the sensor housing must be made slender and pointed, but a separate requirement says the leading edge of the wing must be blunt to survive aerodynamic heating during a high-Mach dash. Explain this apparent contradiction: why is a blunt leading edge sometimes desirable despite its higher wave drag?",
        rubric: "Excellent answers: resolve the tradeoff via aerodynamic heating. A sharp leading edge concentrates heat flux: stagnation heating scales inversely with the square root of the nose/edge radius, so a vanishingly sharp edge sees extreme local heat flux and temperatures that can exceed material limits at high Mach. A blunt (larger-radius) leading edge spreads the stagnation heating over more area and stands off a detached shock, lowering peak heat flux and surface temperature, at the cost of more wave drag. So for a high-Mach dash where heating governs survival, designers accept the drag penalty of bluntness; for the sensor housing, where heating is not limiting and signature/drag dominate, slender and sharp is preferred. Should mention this is the classic blunt-body reentry insight (more drag but survivable heating). Key insight: bluntness trades higher wave drag for dramatically lower peak heating because stagnation heat flux falls as nose radius increases, so heating-limited high-Mach edges are deliberately blunt.",
      },
    ],
  },
  {
    id: "aerodynamics_boundary_layer_ld",
    slug: "concept-aerodynamics-boundary-layer-ld",
    title: "Boundary Layer Transition and L/D",
    prompt: "A glider designer is tuning an airfoil for maximum lift-to-drag ratio. Wind-tunnel data shows that when the boundary layer transitions from laminar to turbulent earlier on the upper surface, skin friction drag goes up, yet in some conditions the overall drag goes down.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["aerodynamics", "conceptual"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the difference between laminar and turbulent boundary layers in terms of skin friction and resistance to separation, and explain how this resolves the apparent paradox that earlier transition can reduce total drag. Tie this back to maximizing L/D.",
        rubric: "Excellent answers: describe laminar boundary layers as having lower wall shear (less skin friction) but being less able to withstand an adverse pressure gradient, so they separate more easily; turbulent boundary layers have higher skin friction but greater momentum mixing near the wall, resisting separation better. Resolve the paradox: if a laminar layer is about to separate (causing a large separation/pressure-drag region), tripping it turbulent keeps the flow attached, eliminating that pressure drag; the small increase in friction drag is outweighed by the larger reduction in pressure drag, so total drag falls. Tie to L/D: total drag = friction + pressure (+ induced); maximizing L/D means minimizing drag at the operating Cl, which can favor controlled transition placement. Mention laminar flow airfoils try to keep flow laminar over much of the chord (favorable pressure gradient) to cut friction when separation is not the limiting issue. Key insight: turbulent boundary layers cost more friction but resist separation, so forcing transition reduces total drag whenever it prevents a costly separation, which is the tradeoff that governs L/D.",
      },
      {
        prompt: "Now the constraints change. The same laminar-flow airfoil is moved from the clean wind tunnel to a real aircraft whose wing accumulates bugs, rain, and surface roughness near the leading edge. Explain why the carefully designed laminar airfoil may underperform in service and what this implies for robust airfoil selection.",
        rubric: "Excellent answers: explain that laminar-flow benefits depend on keeping the boundary layer laminar over a large chord fraction, which requires a very smooth surface and a sustained favorable pressure gradient. Leading-edge contamination (bugs, rain, ice, dirt, manufacturing roughness, or surface waviness) trips the boundary layer turbulent prematurely, so the designed laminar drag bucket is lost and drag rises toward or above that of a conventional airfoil; the airfoil may also be more sensitive in Cl_max and stall behavior off-design. Implication: for robustness, designers may choose airfoils with gentler sensitivity to roughness, accept a turbulent design point, or ensure performance is acceptable in the fully turbulent (tripped) condition; laminar flow is best where surfaces stay clean (sailplanes, well-maintained wings). Key insight: laminar-flow performance is fragile because real-world leading-edge roughness forces early transition, so robust selection requires acceptable performance in the contaminated/fully turbulent state, not just the clean ideal.",
      },
    ],
  },
];
