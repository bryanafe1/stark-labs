import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "hydraulics_culvert_inlet_outlet_control",
    slug: "concept-hydraulics-culvert-control",
    title: "Why a Culvert Sizes the Way It Does",
    prompt: "You are sizing a circular concrete culvert under a rural road crossing a small stream. During the design storm the headwater pool rises and you must decide whether the barrel or the entrance governs capacity.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["hydraulics", "conceptual"],
    skillAreas: ["hydraulics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the difference between inlet control and outlet control for a culvert. What physically governs the flow in each case, and how would you tell from a headwater-versus-discharge perspective which one is acting?",
        rubric: "Inlet control: the entrance geometry (shape, edge condition, area) is the bottleneck; the barrel can carry more than the inlet admits, so flow passes through critical depth near the entrance and the barrel runs partly full; headwater is set by the inlet acting like an orifice or weir and is largely independent of barrel length, slope, or roughness. Outlet control: the barrel and/or tailwater limit flow; full or nearly full barrel; headwater is governed by an energy balance including entrance loss, friction loss along the barrel (Mannings n, length), velocity head, and tailwater elevation. Good answers note you compute headwater both ways and the larger headwater governs (the controlling condition). Mention edge/inlet improvements help inlet control but not outlet control. Key insight: inlet control depends on entrance geometry and is insensitive to barrel length/roughness, while outlet control is a full-barrel energy balance dominated by friction and tailwater.",
      },
      {
        prompt: "Part 2: Now the constraints change. The downstream channel backs up so the tailwater submerges the culvert outlet, and the road profile cannot be raised. How does submergence shift which control governs, and what design moves actually buy you more capacity now?",
        rubric: "Submerged tailwater forces outlet control (or fully submerged orifice flow), so capacity is now set by the barrel energy equation and the tailwater elevation, not the inlet edge. Improving the inlet edge (beveled/grooved entrance) yields little benefit because the inlet is no longer the bottleneck. Effective moves: increase barrel area (larger diameter or multiple barrels), reduce friction (smoother barrel, lower n), shorten the hydraulically loss-heavy path, or lower the tailwater (downstream channel improvements). Since the road cannot be raised, allowable headwater is capped, so adding barrel area or reducing tailwater are the real levers. Note higher tailwater reduces the available head and thus the discharge for a given headwater. Key insight: under submergence the inlet edge stops mattering and capacity is bought by adding flow area or lowering tailwater, not by polishing the entrance.",
      },
    ],
  },
  {
    id: "hydraulics_hydraulic_jump_energy",
    slug: "concept-hydraulics-hydraulic-jump",
    title: "Hydraulic Jump Below a Spillway",
    prompt: "Water leaves the toe of a concrete spillway thin and fast, then abruptly thickens into a turbulent roller before continuing downstream. The design intent is to dissipate energy in a stilling basin.",
    discipline: "CIVIL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["hydraulics", "conceptual"],
    skillAreas: ["hydraulics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain what a hydraulic jump is in terms of flow regime and energy. Why does it form, what determines the depth before and after it, and why is it useful in a stilling basin?",
        rubric: "A hydraulic jump is the transition from supercritical (Froude number Fr greater than 1, fast, shallow) to subcritical (Fr less than 1, slow, deep) flow. It forms when supercritical flow must meet a downstream subcritical control/tailwater that demands a higher depth. The conjugate (sequent) depths are linked by momentum/specific-force conservation, not energy conservation, because the jump dissipates significant energy through turbulence (specific energy is NOT conserved across it; momentum is). The depth ratio depends on the upstream Froude number. It is useful because it converts kinetic energy into heat/turbulence, protecting the downstream channel from scour. Good answers distinguish momentum function (used to relate depths) from energy (the loss). Key insight: the jump conserves momentum but destroys energy, taking supercritical flow up to its sequent subcritical depth set by the downstream tailwater.",
      },
      {
        prompt: "Part 2: Now the constraints change. During a drought-season low flow, the tailwater drops well below the design level. What happens to the jump, why is that a problem, and how do basin designs guard against it?",
        rubric: "If tailwater drops below the required sequent depth, the jump sweeps downstream out of the basin (a swept-out or repelled jump), or moves to where the channel finally provides enough depth, exposing unprotected downstream channel to high-velocity supercritical flow and severe scour; conversely too-high tailwater drowns the jump and reduces dissipation. The jump location is sensitive to the match between sequent depth and tailwater; a tailwater rating that does not track the sequent-depth curve over the flow range causes the jump to migrate. Guards: baffle blocks, chute blocks, and end sills that force the jump to form within the basin and add momentum/drag so the jump stabilizes at lower tailwater; depressed/stepped basins to guarantee depth; designing across the full flow range, not just the design flood. Key insight: a jump only stays put when tailwater matches sequent depth, so low tailwater sweeps it out, and appurtenances (baffles, sills, depressed basins) are added to anchor it across all flows.",
      },
    ],
  },
  {
    id: "hydraulics_egl_hgl_pipe",
    slug: "concept-hydraulics-egl-hgl",
    title: "Reading the Energy and Hydraulic Grade Lines",
    prompt: "A pressurized water main runs from a reservoir, through a long pipe with a partly closed valve, to a discharge point. You are asked to sketch and interpret the energy grade line (EGL) and hydraulic grade line (HGL) along the run.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["hydraulics", "conceptual"],
    skillAreas: ["hydraulics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Define the EGL and HGL and explain how they relate to each other and to the pipe. What does the slope of the EGL tell you, and what does it mean if the HGL drops below the pipe elevation?",
        rubric: "EGL = elevation + pressure head (p/gamma) + velocity head (V^2/2g); HGL = elevation + pressure head. The HGL sits below the EGL by exactly the velocity head V^2/2g, so they are parallel where velocity is constant. The slope of the EGL represents the rate of head loss per unit length (friction slope); it always falls in the direction of flow (except where a pump adds energy, causing a jump up). A steeper EGL means more loss (higher velocity, rougher pipe, smaller diameter). If the HGL drops below the pipe centerline, the gauge pressure is negative (below atmospheric), risking air release, cavitation, or contamination intrusion. Good answers tie velocity head changes (pipe diameter changes) to the gap between the lines. Key insight: HGL is EGL minus velocity head, the EGL slope is the head-loss gradient, and HGL below the pipe means sub-atmospheric pressure.",
      },
      {
        prompt: "Part 2: Now the constraints change. You partly close the valve mid-run to throttle flow. Show how the EGL and HGL change through the valve and downstream, and explain what happens to pressure just upstream and just downstream of the valve.",
        rubric: "The valve introduces a concentrated minor loss, so the EGL drops sharply (a step down) across the valve equal to the local head loss. Throttling reduces the flow rate, which reduces friction slope elsewhere (flatter EGL/HGL on the long pipe runs because velocity is lower). Just upstream of the valve, pressure (HGL) rises relative to before throttling because flow and thus upstream friction loss decrease; just downstream of the valve, the HGL is lower (energy was just dissipated), so downstream pressure drops. Strong answers note the valve converts pressure head into localized turbulence/heat and that severe throttling can pull downstream pressure low enough to cavitate. The overall discharge is reduced and reset by the new total system curve. Key insight: a throttling valve is a deliberate concentrated head loss that steps the EGL down, raising upstream pressure and dropping downstream pressure while lowering total flow.",
      },
    ],
  },
  {
    id: "hydraulics_mannings_intuition",
    slug: "concept-hydraulics-mannings-intuition",
    title: "Mannings Equation Intuition for a Channel",
    prompt: "You are evaluating the capacity of a trapezoidal earthen drainage channel and considering whether to line it, widen it, or steepen it. You want to reason qualitatively before running numbers.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["hydraulics", "conceptual"],
    skillAreas: ["hydraulics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Using Mannings equation Q = (1/n)*A*R^(2/3)*S^(1/2), explain how each term (n, A, R, S) physically affects channel capacity, and why hydraulic radius R = A/P (area over wetted perimeter) rather than just depth or area is the right geometric measure.",
        rubric: "n is roughness: higher n (vegetation, rough earth) means slower flow and less capacity; lining (concrete) lowers n and raises Q. A is cross-sectional flow area: more area carries more flow. S is the channel/energy slope: steeper means faster flow, with Q scaling as the square root of slope. R = A/P captures the efficiency of the section: area drives conveyance while wetted perimeter drives boundary friction drag, so R reflects how much flow area you get per unit of friction-producing boundary. A section with large area but small wetted perimeter is hydraulically efficient. Depth alone or area alone misses the friction the boundary exerts. Good answers note the 2/3 power on R and 1/2 power on S. Key insight: capacity rewards area and slope but is penalized by roughness and wetted perimeter, which is why R = A/P, not depth, is the governing geometry.",
      },
      {
        prompt: "Part 2: Now the constraints change. You cannot steepen the channel (grade is fixed) and right-of-way limits how wide you can go. Between lining the channel (lower n) and deepening it, which gives more capacity per unit of effort, and what hydraulic trade-offs do you weigh?",
        rubric: "Lining lowers n; capacity scales as 1/n, so cutting n roughly in half (earth to concrete) nearly doubles Q for the same section, a large and reliable gain with no extra width. Deepening increases A and can increase R if the perimeter grows slower than area, but a narrow deep section eventually has diminishing R returns and the added depth raises velocity, which can cause scour in an unlined channel and demands more freeboard and structural depth. Trade-offs: lining raises velocity too (erosion not an issue once lined, but downstream energy and possible supercritical flow / need for energy dissipation become concerns), costs more upfront, and reduces infiltration. Deepening within tight right-of-way is geometrically efficient but constrained by excavation, groundwater, and stability. Strong answers conclude lining usually gives the biggest capacity-per-effort gain under fixed grade and width, while watching for higher velocity and downstream erosion. Key insight: since Q scales as 1/n, lowering roughness is the most leverage when slope and width are fixed, but it raises velocity and shifts the erosion/energy problem downstream.",
      },
    ],
  },
  {
    id: "hydraulics_weir_measurement",
    slug: "concept-hydraulics-weir-flow",
    title: "Choosing and Reading a Weir",
    prompt: "A small treatment plant needs to measure open-channel flow continuously over a wide range, from very low base flow to occasional high flow. You are deciding between a sharp-crested rectangular weir and a V-notch (triangular) weir.",
    discipline: "CIVIL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["hydraulics", "conceptual"],
    skillAreas: ["hydraulics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain how a weir measures flow: why discharge depends on the head over the crest, and why a rectangular weir follows roughly Q proportional to H^(3/2) while a V-notch follows Q proportional to H^(5/2). What makes one better for low flows?",
        rubric: "A weir is a calibrated obstruction; water must rise to a head H above the crest to pass, and that head is uniquely related to discharge so measuring H gives Q. The H^(3/2) for rectangular comes from integrating velocity (which scales as sqrt of head, from energy) over a flow width that is constant, giving area times velocity ~ H * H^(1/2) = H^(3/2). For a V-notch, the flow width grows with head (triangular opening), adding another power of H, giving H * H^(1/2) * H = H^(5/2). Because the V-notch exponent is higher, a small change in low flow produces a relatively large, measurable change in head, so the V-notch resolves low flows far better. Good answers mention the rectangular weir handles higher flows with less head buildup. Key insight: weir discharge maps uniquely to head, and the steeper H^(5/2) law of the V-notch makes it the precise choice at low flow while the rectangular weir suits higher flows.",
      },
      {
        prompt: "Part 2: Now the constraints change. The downstream water level rises during high-flow events and submerges the weir crest. What does submergence do to the head-discharge relationship, why does it break the measurement, and how would you redesign to keep accurate readings across the full range?",
        rubric: "A weir reading is only valid under free (modular) flow, where the downstream level is below the crest and the nappe is ventilated so discharge depends solely on upstream head. Submergence (drowned/non-modular flow) means downstream level influences the discharge: for a given upstream head, submergence reduces discharge, and the simple H-Q calibration no longer holds, so readings overstate or become ambiguous. Fixes: raise the crest elevation to keep it above the highest tailwater (restore free flow), increase the drop so the structure stays modular, switch to a structure tolerant of submergence such as a Parshall or long-throated flume (which operates accurately under higher submergence ratios and has low head loss), or apply a submergence correction if the submergence ratio is measured. Good answers note flumes are preferred where head loss and submergence are concerns and where solids/sediment would foul a weir. Key insight: weirs only read correctly under free flow, so submergence corrupts the H-Q law, and the robust remedy is to restore the drop or switch to a flume that tolerates submergence.",
      },
    ],
  },
  {
    id: "hydraulics_flood_routing_storage",
    slug: "concept-hydraulics-flood-routing",
    title: "Flood Routing Through a Detention Basin",
    prompt: "A new development must not increase peak runoff downstream, so you add a detention basin with an outlet structure. A design storm hydrograph enters the basin and a routed outflow hydrograph leaves it.",
    discipline: "CIVIL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["hydraulics", "conceptual"],
    skillAreas: ["hydraulics"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the principle of reservoir (storage) flood routing. Why is the outflow peak lower than and delayed relative to the inflow peak, and what is the significance of the point where the inflow and outflow hydrographs cross (the moment peak storage occurs)?",
        rubric: "Reservoir routing is continuity/storage accounting: dS/dt = Inflow minus Outflow, with outflow a function of storage (stage) through the outlet rating. While inflow exceeds outflow, storage and stage rise; the basin temporarily stores water, so the outflow peak is attenuated (lower) and lagged (delayed) compared to inflow. The outflow peak occurs at the moment inflow equals outflow, because that is when dS/dt = 0 and storage is at its maximum; before that, storage is filling, after that it drains. Because outflow depends on stage, and stage on stored volume, the outflow peak necessarily lies on the receding limb of the inflow hydrograph (it occurs where the falling inflow crosses the rising outflow). Good answers connect attenuation magnitude to available storage volume and outlet capacity. Key insight: storage routing trades volume for time, so the outflow peak is attenuated and delayed and occurs exactly when inflow equals outflow at maximum storage.",
      },
      {
        prompt: "Part 2: Now the constraints change. A larger, rarer storm than the design event occurs and the basin nearly fills to its emergency spillway. How does basin behavior change as it fills, why can a basin sized for a small storm fail to control a bigger one, and what design features address this?",
        rubric: "As stage rises, the outlet discharges more (outflow increases with head), reducing the remaining storage available for further attenuation; once the basin approaches full and the emergency spillway engages, outflow rises steeply and attenuation collapses, so the larger storm passes through with much less peak reduction (and the spillway itself adds outflow). A basin sized only for a frequent storm may have inadequate storage and an outlet rating that releases too fast for the rarer event, so downstream peak control is lost exactly when flows are largest. Features: multi-stage outlets (low-flow orifice plus higher weir) to control multiple return periods, sufficient freeboard and a properly sized emergency spillway to pass the extreme event safely without overtopping the embankment, and routing/checking against multiple storm frequencies, not just the design storm. Strong answers note dam-safety concern: the failure mode is embankment overtopping, and the spillway exists to prevent that, not to meet downstream peak targets. Key insight: attenuation depends on having spare storage and a stage-limited outlet, so once the basin fills and the spillway opens, control is lost, which is why multi-stage outlets, freeboard, and emergency spillways are designed across multiple storm frequencies.",
      },
    ],
  },
];
