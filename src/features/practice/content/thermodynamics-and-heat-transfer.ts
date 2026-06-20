import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION: Closed-system 1st law, ΔU = Q − W. Piston pushed UP, so work is done BY the gas (W > 0).
  // W = F·d = m·g·d = (50 kg)(9.81 m/s²)(0.30 m) = 147.15 J (boundary work against the piston weight).
  // Q added = 500 J. ΔU = 500 − 147.15 = 352.85 ≈ 353 J.
  {
    id: "th_first_law_du",
    slug: "thermo-first-law-internal-energy",
    title: "Piston-Cylinder Energy Balance",
    prompt:
      "A vertical piston-cylinder holds a gas. A frictionless 50 kg piston sits on top of the gas. You add 500 J of heat to the gas, and in response the piston rises slowly by 30 cm at constant velocity while the system pressure stays constant.\n\nTake g = 9.81 m/s².\n\nWhat is the change in internal energy of the gas? Give your answer in joules (J), rounded to the nearest whole number (a positive value means internal energy increased).",
    discipline: "MECHANICAL",
    difficulty: "EASY",
    eloWeight: 14,
    tags: ["first-law", "internal-energy", "boundary-work", "closed-system"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 353,
    tolerance: 4,
    unit: "J",
    hints: [
      "Write the closed-system first law for the gas: the heat added either raises internal energy or does boundary work as the gas expands.",
      "Because the piston moves at constant velocity (no acceleration) and pressure is constant, the boundary work the gas does equals the work needed to lift the piston: W = (piston weight) × (rise distance).",
      "Compute W = m·g·d, then solve ΔU = Q − W. Keep everything in joules; do not forget that Q is positive (added) and W is positive (done by the gas).",
    ],
    solution:
      "**Governing principle — first law for a closed system:** The gas is a fixed mass (closed system), so energy in as heat either raises its internal energy or leaves as boundary work: $\\Delta U = Q - W$. We apply it because no mass crosses the boundary and the only energy interactions are heat in and work done pushing the piston.\n\n" +
      "**Step 1 — Identify the work done BY the gas.** The piston rises at *constant velocity* (zero acceleration), so the gas force exactly balances the piston's weight. The boundary work is therefore the work needed to lift the piston:\n" +
      "$$W = F \\cdot d = m g d = (50\\ \\text{kg})(9.81\\ \\text{m/s}^2)(0.30\\ \\text{m})$$\n" +
      "$$W = 147.15\\ \\text{J}$$\n" +
      "Because the piston goes UP, the gas expands and does positive work ($W > 0$).\n\n" +
      "**Step 2 — Apply the first law.** Heat is *added*, so $Q = +500\\ \\text{J}$:\n" +
      "$$\\Delta U = Q - W = 500 - 147.15 = 352.85\\ \\text{J}$$\n\n" +
      "**Key insight / trap:** Constant velocity is the clue that lets you skip pressure–volume details — the boundary work equals the piston-lifting work $mgd$. Don't drop the sign convention: $Q$ is positive in, $W$ is positive out (done by the gas).\n\n" +
      "**Final answer: $\\Delta U \\approx \\mathbf{353\\ J}$ (internal energy increases).**",
  },
  // SOLUTION: Energy balance to mix two streams to a final temp; find required hot-water flow.
  // Want 2.0 kg final at 50 °C from cold tap at 12 °C and a 70 °C tank, no losses. Same fluid → c cancels.
  // m_h·(70−50) = m_c·(50−12); m_h + m_c = 2.0. So m_h·20 = (2.0−m_h)·38 → 20 m_h = 76 − 38 m_h
  // → 58 m_h = 76 → m_h = 1.310 kg. Hot water needed ≈ 1.31 kg.
  {
    id: "th_specific_heat_water",
    slug: "thermo-specific-heat-water",
    title: "Tempering Valve Mass Balance",
    prompt:
      "A tempering valve blends water from a 70 °C storage tank with 12 °C cold-tap water to deliver exactly 2.0 kg of 50 °C water for a fixture. Assume perfect mixing and no heat loss to the valve or surroundings.\n\nHow many kilograms of the 70 °C tank water are required to produce this 2.0 kg blend? Give your answer in kilograms (kg), rounded to two decimal places.",
    discipline: "MECHANICAL",
    difficulty: "EASY",
    eloWeight: 15,
    tags: ["energy-balance", "mixing", "calorimetry"],
    skillAreas: ["thermodynamics", "heat-transfer"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 1.31,
    tolerance: 0.03,
    unit: "kg",
    hints: [
      "Write two equations: a mass balance (hot + cold = total) and an energy balance on the adiabatic mixing.",
      "Since both streams are water, the specific heat cancels everywhere — the energy balance reduces to a temperature-weighted mass balance.",
      "A clean form is m_h·(T_hot − T_mix) = m_c·(T_mix − T_cold). Substitute m_c = total − m_h and solve for m_h.",
    ],
    solution:
      "**Governing principle — energy balance on adiabatic mixing.** With no heat loss, the energy given up by the hot stream equals the energy gained by the cold stream as they reach a common temperature. We combine this with a mass balance because two unknown flow amounts must satisfy both 'total mass' and 'final temperature' constraints.\n\n" +
      "**Step 1 — Write the two balances.**\n" +
      "Mass: $m_h + m_c = 2.0\\ \\text{kg}$.\n" +
      "Energy (both streams are water, so the specific heat $c$ appears on every term and cancels):\n" +
      "$$m_h\\, c\\,(T_{hot} - T_{mix}) = m_c\\, c\\,(T_{mix} - T_{cold})$$\n" +
      "$$m_h(70 - 50) = m_c(50 - 12)$$\n\n" +
      "**Step 2 — Substitute $m_c = 2.0 - m_h$.**\n" +
      "$$m_h(20) = (2.0 - m_h)(38)$$\n" +
      "$$20\\,m_h = 76 - 38\\,m_h$$\n" +
      "$$58\\,m_h = 76 \\;\\Rightarrow\\; m_h = 1.310\\ \\text{kg}$$\n\n" +
      "**Key insight / trap:** Because both streams are the *same fluid*, $c$ cancels — you never need a numerical specific heat, and temperatures can stay in °C since only differences appear. The trap is reaching for $c = 4180$ when it isn't required.\n\n" +
      "**Final answer: $m_h \\approx \\mathbf{1.31\\ kg}$ of tank water.**",
  },
  // SOLUTION: Carnot ceiling → required heat input.
  // Reservoirs 600 °C = 873.15 K, 20 °C = 293.15 K. η_Carnot = 1 − 293.15/873.15 = 0.6643.
  // Engine runs at 60% of Carnot → η_actual = 0.60 × 0.6643 = 0.3986.
  // Net power 250 kW → Q_in = W/η = 250 / 0.3986 = 627.2 kW ≈ 627 kW.
  {
    id: "th_carnot_efficiency",
    slug: "thermo-carnot-efficiency",
    title: "Heat Input from a Second-Law Limit",
    prompt:
      "A power plant rejects heat to cooling water at 20 °C and receives heat from a source at 600 °C. The plant's designers claim it achieves 60% of the maximum efficiency theoretically possible between these two temperatures, and it must deliver 250 kW of net power.\n\nDetermine the rate of heat input the plant requires. Give your answer in kilowatts (kW), rounded to the nearest whole kW.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["carnot", "efficiency", "second-law", "power-plant"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 627,
    tolerance: 7,
    unit: "kW",
    hints: [
      "The 'maximum efficiency theoretically possible' between two reservoirs is the Carnot efficiency — and it requires absolute temperatures.",
      "Convert both reservoir temperatures to kelvin, then η_Carnot = 1 − T_cold/T_hot. The actual efficiency is 60% of that value.",
      "Heat input rate follows from the definition of efficiency: Q_in = W_net / η_actual. Watch that you scaled Carnot by 0.60 before dividing.",
    ],
    solution:
      "**Governing principle — Carnot limit (second law).** The maximum efficiency any engine can reach between two reservoirs is the Carnot efficiency, which depends only on the *absolute* reservoir temperatures. The real plant runs at a stated fraction of that ceiling, and efficiency relates net power to heat input.\n\n" +
      "**Step 1 — Convert temperatures to kelvin.** (Carnot demands absolute T — this is the classic trap.)\n" +
      "$$T_{hot} = 600 + 273.15 = 873.15\\ \\text{K}, \\quad T_{cold} = 20 + 273.15 = 293.15\\ \\text{K}$$\n\n" +
      "**Step 2 — Carnot efficiency.**\n" +
      "$$\\eta_{Carnot} = 1 - \\frac{T_{cold}}{T_{hot}} = 1 - \\frac{293.15}{873.15} = 1 - 0.3357 = 0.6643$$\n\n" +
      "**Step 3 — Actual efficiency (60% of Carnot).**\n" +
      "$$\\eta_{actual} = 0.60 \\times 0.6643 = 0.3986$$\n\n" +
      "**Step 4 — Heat input from the efficiency definition** $\\eta = W_{net}/Q_{in}$:\n" +
      "$$Q_{in} = \\frac{W_{net}}{\\eta_{actual}} = \\frac{250\\ \\text{kW}}{0.3986} = 627.2\\ \\text{kW}$$\n\n" +
      "**Key insight / trap:** Using °C instead of K wrecks the answer; and you must scale Carnot by 0.60 *before* dividing into the power. Forgetting the factor would give the impossibly optimistic $250/0.6643 = 376$ kW.\n\n" +
      "**Final answer: $Q_{in} \\approx \\mathbf{627\\ kW}$.**",
  },
  // SOLUTION: Composite plane wall with two surface convection films + slab conduction → heat flux → inner surface temp.
  // Per unit area: R_conv,i = 1/h_i = 1/10 = 0.1; R_cond = L/k = 0.05/0.04 = 1.25; R_conv,o = 1/h_o = 1/25 = 0.04.
  // R_total = 1.39 m²K/W. ΔT = 22 − (−5) = 27 K. q'' = 27/1.39 = 19.42 W/m².
  // Inner surface temp: T_si = T_air,i − q''·R_conv,i = 22 − 19.42×0.1 = 22 − 1.942 = 20.06 °C ≈ 20.1 °C.
  {
    id: "th_conduction_fourier",
    slug: "thermo-conduction-fourier-wall",
    title: "Inner Surface Temperature of an Insulated Wall",
    prompt:
      "An insulating wall separates a 22 °C room from −5 °C outside air. The wall is a single slab 5 cm thick with conductivity 0.04 W/(m·K). The inside-air convection coefficient is 10 W/(m²·K) and the outside-air coefficient is 25 W/(m²·K).\n\nUnder steady conditions, what is the temperature of the room-side (inner) wall surface? Give your answer in degrees Celsius (°C), rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 28,
    tags: ["conduction", "convection", "thermal-resistance", "surface-temperature"],
    skillAreas: ["heat-transfer"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 20.1,
    tolerance: 0.3,
    unit: "°C",
    hints: [
      "Model the wall as three thermal resistances in series (per unit area): inside convection film, slab conduction, outside convection film.",
      "Find the steady heat flux first: q'' = (T_in − T_out) / (R_conv,i + R_cond + R_conv,o), where R_conv = 1/h and R_cond = L/k.",
      "The inner surface sits one resistance in from the room air: T_surface = T_air,in − q''·R_conv,i. Keep heat flux in W/m² and resistances in m²·K/W.",
    ],
    solution:
      "**Governing principle — series thermal resistances at steady state.** Heat flows from warm room air, through the inside convection film, through the slab by conduction, and out through the outside film. In series, the resistances add, and the *same* heat flux passes through each. We use this because steady state guarantees one common $q''$.\n\n" +
      "**Step 1 — Per-unit-area resistances** ($R_{conv} = 1/h$, $R_{cond} = L/k$):\n" +
      "$$R_{conv,i} = \\frac{1}{10} = 0.10,\\quad R_{cond} = \\frac{0.05}{0.04} = 1.25,\\quad R_{conv,o} = \\frac{1}{25} = 0.04 \\ \\ \\tfrac{\\text{m}^2\\text{K}}{\\text{W}}$$\n" +
      "$$R_{total} = 0.10 + 1.25 + 0.04 = 1.39\\ \\tfrac{\\text{m}^2\\text{K}}{\\text{W}}$$\n\n" +
      "**Step 2 — Steady heat flux.** $\\Delta T = 22 - (-5) = 27\\ \\text{K}$ (a difference, so K and °C agree):\n" +
      "$$q'' = \\frac{\\Delta T}{R_{total}} = \\frac{27}{1.39} = 19.42\\ \\text{W/m}^2$$\n\n" +
      "**Step 3 — Inner surface temperature.** The room-side surface is one resistance ($R_{conv,i}$) in from the room air:\n" +
      "$$T_{si} = T_{air,i} - q'' R_{conv,i} = 22 - (19.42)(0.10) = 22 - 1.94 = 20.06\\ ^\\circ\\text{C}$$\n\n" +
      "**Key insight / trap:** Watch the sign of the −5 °C outdoor temperature — the driving ΔT is 27 K, not 17. And the inner surface is warmer than the air drop only across the inside film, so you subtract just $q''R_{conv,i}$, not the whole thing.\n\n" +
      "**Final answer: $T_{si} \\approx \\mathbf{20.1\\ ^\\circ C}$.**",
  },
  // SOLUTION: Net radiation exchange + steady energy balance to find equilibrium plate temp.
  // A 2 m² plate, ε = 0.9, in vacuum, absorbs 1500 W of electrical heating, radiates to walls at 300 K.
  // Steady: P = ε σ A (T⁴ − T_surr⁴). 1500 = 0.9·5.67e-8·2·(T⁴ − 300⁴).
  // 0.9·5.67e-8·2 = 1.0206e-7. T⁴ = 1500/1.0206e-7 + 300⁴ = 1.4697e10 + 8.1e9 = 2.2797e10.
  // T = (2.2797e10)^0.25 = 388.6 K ≈ 389 K.
  {
    id: "th_radiation_stefan_boltzmann",
    slug: "thermo-radiation-stefan-boltzmann",
    title: "Equilibrium Temperature of a Radiating Plate",
    prompt:
      "Inside a vacuum chamber, a thin 2.0 m² plate (emissivity 0.9, both faces effectively at one temperature) dissipates 1500 W of electrical power and can lose heat only by radiation to the chamber walls, which are held at 300 K. Use σ = 5.67×10⁻⁸ W/(m²·K⁴).\n\nAt steady state, what is the plate's temperature? Give your answer in kelvin (K), rounded to the nearest whole kelvin.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 27,
    tags: ["radiation", "stefan-boltzmann", "energy-balance", "equilibrium"],
    skillAreas: ["heat-transfer"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 389,
    tolerance: 3,
    unit: "K",
    hints: [
      "At steady state, all the electrical power must leave by radiation, so set the dissipated power equal to the net radiation exchange with the walls.",
      "Net radiation from the plate: P = ε·σ·A·(T⁴ − T_surr⁴). Solve algebraically for T⁴, do not drop the T_surr⁴ term.",
      "Isolate T⁴ = P/(ε·σ·A) + T_surr⁴, then take the fourth root. Temperatures must be in kelvin throughout.",
    ],
    solution:
      "**Governing principle — steady-state energy balance with radiation.** In a vacuum there is no conduction or convection, so the only way the plate sheds its electrical heating is by net radiation to the walls. At steady state, power in = net radiation out, governed by the Stefan–Boltzmann law.\n\n" +
      "**Step 1 — Set up the balance.** Net radiation exchange with surroundings:\n" +
      "$$P = \\varepsilon \\sigma A (T^4 - T_{surr}^4)$$\n" +
      "$$1500 = (0.9)(5.67\\times10^{-8})(2.0)(T^4 - 300^4)$$\n\n" +
      "**Step 2 — Evaluate the coefficient.**\n" +
      "$$\\varepsilon \\sigma A = (0.9)(5.67\\times10^{-8})(2.0) = 1.0206\\times10^{-7}\\ \\text{W/K}^4$$\n\n" +
      "**Step 3 — Solve for $T^4$.** With $300^4 = 8.10\\times10^{9}$:\n" +
      "$$T^4 = \\frac{1500}{1.0206\\times10^{-7}} + 8.10\\times10^{9} = 1.4697\\times10^{10} + 0.81\\times10^{10} = 2.2797\\times10^{10}$$\n\n" +
      "**Step 4 — Fourth root.**\n" +
      "$$T = (2.2797\\times10^{10})^{1/4} = 388.6\\ \\text{K}$$\n\n" +
      "**Key insight / trap:** Do NOT drop the $T_{surr}^4$ term — the walls radiate back. Ignoring it gives $T = (1.4697\\times10^{10})^{1/4} = 348$ K, which is wrong. All temperatures must be absolute (K).\n\n" +
      "**Final answer: $T \\approx \\mathbf{389\\ K}$.**",
  },
  // SOLUTION: Critical radius of insulation reasoning (cylindrical). For a bare wire/pipe, adding insulation can
  // INCREASE heat loss until the outer radius reaches r_cr = k_ins/h. Here k_ins = 0.15, h = 5 → r_cr = 0.03 m = 30 mm.
  // Pipe outer radius = 10 mm < r_cr, so adding a thin layer raises loss. The first thickness that returns loss to the
  // bare value is at the radius r where ln(r/r_o)... but the asked simple quantity: critical OUTER radius = k/h = 0.03 m.
  // Thickness from 10 mm to 30 mm = 20 mm. Critical insulation thickness = 20 mm.
  {
    id: "th_series_thermal_resistance",
    slug: "thermo-series-thermal-resistance",
    title: "Critical Insulation Thickness on a Small Pipe",
    prompt:
      "A small tube of 10 mm outer radius carries a hot fluid and loses heat to surroundings through an outer convection coefficient of 5 W/(m²·K). An engineer plans to wrap it with insulation of conductivity 0.15 W/(m·K), expecting heat loss to drop immediately.\n\nFor this geometry there is a radius at which heat loss per unit length is maximized. Determine the insulation THICKNESS (added on top of the existing 10 mm radius) that brings the outer surface exactly to that critical radius. Give your answer in millimeters (mm), rounded to the nearest whole mm.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 29,
    tags: ["conduction", "critical-radius", "cylinder", "convection"],
    skillAreas: ["heat-transfer"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 20,
    tolerance: 1,
    unit: "mm",
    hints: [
      "On a cylinder, adding insulation increases conduction resistance but also increases the outer surface area for convection — these compete, so loss can rise before it falls.",
      "Heat loss per length is maximized at the critical radius, where the conduction and convection effects balance: r_critical = k_insulation / h.",
      "Compute r_critical, then subtract the existing outer radius to get the added thickness. Watch units: k/h gives meters; convert to mm.",
    ],
    solution:
      "**Governing principle — critical radius of insulation (cylinder).** On a cylinder, wrapping insulation does two competing things: it *adds* conduction resistance (good, reduces loss) but it *enlarges* the outer surface, lowering convection resistance (bad, increases loss). Heat loss per unit length peaks where these effects balance — the critical radius.\n\n" +
      "**Step 1 — Critical radius.** Maximizing loss with respect to outer radius gives the standard result:\n" +
      "$$r_{cr} = \\frac{k_{ins}}{h} = \\frac{0.15\\ \\text{W/(m·K)}}{5\\ \\text{W/(m}^2\\text{·K)}} = 0.03\\ \\text{m} = 30\\ \\text{mm}$$\n\n" +
      "**Step 2 — Confirm the bare pipe is below it.** The tube's outer radius is $10\\ \\text{mm} < 30\\ \\text{mm}$, so it sits on the *rising* side of the curve — adding a thin layer actually increases loss until the surface reaches $r_{cr}$.\n\n" +
      "**Step 3 — Added thickness to reach $r_{cr}$.**\n" +
      "$$t = r_{cr} - r_o = 30 - 10 = 20\\ \\text{mm}$$\n\n" +
      "**Key insight / trap:** $r_{cr} = k/h$ is an *outer radius*, not a thickness — you must subtract the existing 10 mm radius. And mind the units: $k/h = 0.15/5 = 0.03$ m, easily mis-read as 0.3 m if you slip a decimal.\n\n" +
      "**Final answer: critical insulation thickness $= \\mathbf{20\\ mm}$.**",
  },
  // SOLUTION: Brayton cycle net work and back-work judgment via the multiple-choice on cycle behavior.
  // Cold-air-standard Brayton, pressure ratio rp = 10, γ = 1.4. Isentropic temp ratio = rp^((γ−1)/γ) = 10^0.2857 = 1.9307.
  // η = 1 − 1/1.9307 = 0.4820 ≈ 48.2%. (Independent of turbine inlet temp for ideal cold-air-standard.)
  {
    id: "th_otto_isentropic_concept",
    slug: "thermo-otto-isentropic-concept",
    title: "Ideal Brayton Cycle Thermal Efficiency",
    prompt:
      "A stationary gas turbine runs on the ideal (cold-air-standard) Brayton cycle with a compressor pressure ratio of 10. Treat the working fluid as air with γ = 1.4 and constant specific heats. The turbine-inlet temperature is 1300 K and the compressor inlet is 300 K.\n\nDetermine the cycle's thermal efficiency. Give your answer as a percent, rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 23,
    tags: ["brayton-cycle", "isentropic", "efficiency", "gas-turbine"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 48.2,
    tolerance: 0.6,
    unit: "%",
    hints: [
      "For the ideal cold-air-standard Brayton cycle, thermal efficiency depends only on the pressure ratio and γ — the inlet and turbine temperatures are not needed.",
      "Use η = 1 − 1/r_p^((γ−1)/γ). The temperature data in the prompt are distractors to test whether you know this.",
      "Evaluate r_p^((γ−1)/γ) = 10^(0.4/1.4) first, then subtract its reciprocal from 1 and convert to a percent.",
    ],
    solution:
      "**Governing principle — ideal Brayton (cold-air-standard) efficiency.** For the ideal Brayton cycle with constant specific heats, both compressor and turbine are isentropic, so the temperature ratio across each is set entirely by the pressure ratio. The result: thermal efficiency depends ONLY on pressure ratio and $\\gamma$.\n\n" +
      "**Step 1 — Isentropic temperature/pressure relation.**\n" +
      "$$\\frac{T_2}{T_1} = r_p^{(\\gamma-1)/\\gamma} = 10^{(0.4/1.4)} = 10^{0.2857}$$\n" +
      "$$10^{0.2857} = 1.9307$$\n\n" +
      "**Step 2 — Apply the Brayton efficiency formula.**\n" +
      "$$\\eta = 1 - \\frac{1}{r_p^{(\\gamma-1)/\\gamma}} = 1 - \\frac{1}{1.9307} = 1 - 0.5180 = 0.4820$$\n\n" +
      "**Step 3 — Convert to percent:** $0.4820 \\times 100 = 48.2\\%$.\n\n" +
      "**Key insight / trap:** The turbine-inlet temperature (1300 K) and compressor-inlet temperature (300 K) are *distractors*. They would matter for net work or specific work, but the ideal Brayton thermal efficiency is independent of them — it's purely $1 - r_p^{-(\\gamma-1)/\\gamma}$.\n\n" +
      "**Final answer: $\\eta \\approx \\mathbf{48.2\\%}$.**",
  },
  // SOLUTION: Refrigeration COP judgment. A fridge moves Q_L from cold space using work W: COP_R = Q_L/W.
  // Carnot ceiling COP_R = Tc/(Th−Tc). Tc = −18°C = 255.15 K, Th = 25°C = 298.15 K, Th−Tc = 43 K.
  // COP_R,max = 255.15/43 = 5.93. The vendor's claimed COP of 8.0 EXCEEDS this ceiling → impossible.
  // Also note: as the cold-space temp drops (larger Th−Tc gap), the max (Carnot) COP_R DECREASES.
  // Correct option states the Carnot COP is ~5.9 (i.e., < 8), so the claim is impossible.
  {
    id: "th_second_law_entropy_concept",
    slug: "thermo-second-law-entropy-concept",
    title: "Refrigerator COP and the Second Law",
    prompt:
      "A vendor markets a household refrigerator and claims a coefficient of performance (COP) of 8.0 while maintaining a −18 °C freezer in a 25 °C kitchen.\n\nWhich statement is correct?",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 21,
    tags: ["refrigeration", "cop", "second-law", "carnot"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "The claim is impossible: the reversible (Carnot) COP between these temperatures is only about 5.9, so no real unit can exceed it",
        correct: true,
      },
      { id: "b", label: "The claim is fine because COP for refrigerators has no upper bound" },
      { id: "c", label: "The Carnot COP here is below 1.0, so any COP above 1 violates the first law" },
      { id: "d", label: "Lowering the freezer temperature would raise the maximum achievable COP" },
    ],
    hints: [
      "The second law caps a refrigerator's COP at the reversible (Carnot) value for the given reservoir temperatures.",
      "Compute the ceiling with absolute temperatures: COP_R,Carnot = T_cold/(T_hot − T_cold), using kelvin.",
      "Compare the resulting ceiling to the claimed 8.0, and recall that lowering T_cold widens the gap and lowers the maximum COP.",
    ],
    solution:
      "**Governing principle — second-law ceiling on refrigerator COP.** No refrigerator can beat the reversible (Carnot) COP set by the two reservoir temperatures. For a refrigerator, $COP_R = Q_L/W$, and the Carnot maximum is $COP_{R,Carnot} = T_{cold}/(T_{hot} - T_{cold})$ using *absolute* temperatures.\n\n" +
      "**Step 1 — Convert to kelvin.**\n" +
      "$$T_{cold} = -18 + 273.15 = 255.15\\ \\text{K}, \\quad T_{hot} = 25 + 273.15 = 298.15\\ \\text{K}$$\n\n" +
      "**Step 2 — Carnot COP ceiling.**\n" +
      "$$COP_{R,Carnot} = \\frac{T_{cold}}{T_{hot} - T_{cold}} = \\frac{255.15}{298.15 - 255.15} = \\frac{255.15}{43.0} = 5.93$$\n\n" +
      "**Step 3 — Compare with the claim.** The vendor's claimed $COP = 8.0$ exceeds the reversible ceiling of $\\approx 5.9$, so it is thermodynamically impossible. **Option (a) is correct.**\n\n" +
      "**Why the distractors fail:**\n" +
      "- **(b)** Wrong — the second law absolutely caps $COP_R$ at the Carnot value; it is not unbounded.\n" +
      "- **(c)** Wrong — the Carnot COP here is 5.93, far above 1.0; and refrigerator COP routinely exceeds 1, which does not violate the first law (work isn't the only energy moved).\n" +
      "- **(d)** Wrong — lowering $T_{cold}$ *widens* the gap $(T_{hot}-T_{cold})$ and *lowers* the maximum COP; it does not raise it.\n\n" +
      "**Key insight / trap:** Use kelvin, and remember the denominator is the temperature *difference*, not $T_{hot}$. A refrigerator's COP can well exceed 1 — high COP isn't itself a violation; exceeding the Carnot value is.\n\n" +
      "**Final answer: (a) — the Carnot COP is only ~5.9, so a claimed COP of 8.0 is impossible.**",
  },
  // SOLUTION: LMTD heat exchanger sizing. Counterflow. Hot oil: 120 → 70 °C. Cold water: 20 → 55 °C. U = 320 W/m²K.
  // Duty from water side: ṁ_w c_w ΔT_w = 0.5·4180·(55−20) = 73,150 W = 73.15 kW.
  // ΔT1 = 120−55 = 65; ΔT2 = 70−20 = 50. LMTD = (65−50)/ln(65/50) = 15/ln(1.30) = 15/0.26236 = 57.17 K.
  // A = Q/(U·LMTD) = 73150/(320·57.17) = 73150/18294 = 3.998 ≈ 4.0 m².
  {
    id: "th_carnot_max_efficiency_reasoning",
    slug: "thermo-carnot-max-efficiency-reasoning",
    title: "Counterflow Heat-Exchanger Area (LMTD)",
    prompt:
      "A counterflow heat exchanger cools hot oil from 120 °C to 70 °C using cooling water that enters at 20 °C and leaves at 55 °C, flowing at 0.5 kg/s. Take the water specific heat as 4180 J/(kg·K) and the overall heat-transfer coefficient as 320 W/(m²·K).\n\nSize the exchanger: what heat-transfer surface area is required? Give your answer in square meters (m²), rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "EXPERT",
    eloWeight: 34,
    tags: ["lmtd", "heat-exchanger", "counterflow", "sizing"],
    skillAreas: ["heat-transfer", "thermodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 4.0,
    tolerance: 0.15,
    unit: "m²",
    hints: [
      "First get the duty Q from the side with complete data — the water stream: Q = ṁ·c·ΔT. (The oil flow is not needed.)",
      "For a counterflow exchanger, pair the ends correctly: ΔT1 = T_hot,in − T_cold,out and ΔT2 = T_hot,out − T_cold,in.",
      "Use the log-mean temperature difference, LMTD = (ΔT1 − ΔT2)/ln(ΔT1/ΔT2), then A = Q/(U·LMTD). Keep Q in watts to match U.",
    ],
    solution:
      "**Governing principle — LMTD method for heat-exchanger sizing.** The exchanger transfers a duty $Q$ across area $A$ with $Q = U A \\,\\Delta T_{lm}$, where the log-mean temperature difference accounts for the temperature profile varying along the length. We use the LMTD form because both inlet and outlet temperatures of both streams are known.\n\n" +
      "**Step 1 — Heat duty from the fully-specified (water) side.**\n" +
      "$$\\dot Q = \\dot m_w c_w \\Delta T_w = (0.5\\ \\text{kg/s})(4180\\ \\text{J/kg·K})(55 - 20)\\ \\text{K}$$\n" +
      "$$\\dot Q = 0.5 \\times 4180 \\times 35 = 73{,}150\\ \\text{W} = 73.15\\ \\text{kW}$$\n" +
      "(The oil flow isn't needed — energy conservation fixes the duty from the water side alone.)\n\n" +
      "**Step 2 — End temperature differences (counterflow).** Pair opposite ends:\n" +
      "$$\\Delta T_1 = T_{h,in} - T_{c,out} = 120 - 55 = 65\\ \\text{K}$$\n" +
      "$$\\Delta T_2 = T_{h,out} - T_{c,in} = 70 - 20 = 50\\ \\text{K}$$\n\n" +
      "**Step 3 — Log-mean temperature difference.**\n" +
      "$$\\Delta T_{lm} = \\frac{\\Delta T_1 - \\Delta T_2}{\\ln(\\Delta T_1/\\Delta T_2)} = \\frac{65 - 50}{\\ln(65/50)} = \\frac{15}{\\ln(1.30)} = \\frac{15}{0.26236} = 57.17\\ \\text{K}$$\n\n" +
      "**Step 4 — Required area.**\n" +
      "$$A = \\frac{\\dot Q}{U\\, \\Delta T_{lm}} = \\frac{73{,}150}{(320)(57.17)} = \\frac{73{,}150}{18{,}294} = 4.00\\ \\text{m}^2$$\n\n" +
      "**Key insight / trap:** For counterflow, you must cross-pair the ends ($T_{h,in}$ with $T_{c,out}$); using the parallel-flow pairing would give the wrong LMTD. Keep $Q$ in watts to match $U$ in W/(m²·K), or the area is off by 1000×.\n\n" +
      "**Final answer: $A \\approx \\mathbf{4.0\\ m^2}$.**",
  },
  // SOLUTION: Open-system (control volume) SFEE on an adiabatic steam turbine, plus isentropic-vs-actual judgment.
  // Steam in: 3 MPa, 350 °C → h1 ≈ 3115.3 kJ/kg, s1 ≈ 6.7428 kJ/kg·K. Exit 10 kPa.
  // At 10 kPa: sf = 0.6493, sfg = 7.5009; x_s = (6.7428−0.6493)/7.5009 = 0.8124.
  // h2s = hf + x·hfg = 191.83 + 0.8124·2392.8 = 191.83 + 1943.9 = 2135.7 kJ/kg.
  // w_isentropic = 3115.3 − 2135.7 = 979.6 kJ/kg. Actual w = η_t·w_s = 0.85·979.6 = 832.7 kJ/kg.
  // Power = ṁ·w = 12 kg/s · 832.7 = 9992 kW ≈ 9990 kW (~10.0 MW).
  {
    id: "th_steam_turbine_sfee_power",
    slug: "thermo-steam-turbine-sfee-power",
    title: "Adiabatic Steam Turbine Power Output",
    prompt:
      "Steam enters an adiabatic turbine at 3 MPa and 350 °C (h ≈ 3115.3 kJ/kg, s ≈ 6.743 kJ/(kg·K)) and exhausts to a condenser at 10 kPa. At 10 kPa, hf = 191.83 kJ/kg, hfg = 2392.8 kJ/kg, sf = 0.6493 kJ/(kg·K), sfg = 7.5009 kJ/(kg·K). The turbine has an isentropic efficiency of 85% and the steam flow rate is 12 kg/s. Neglect kinetic and potential energy changes.\n\nDetermine the actual power produced by the turbine. Give your answer in kilowatts (kW), rounded to the nearest 10 kW.",
    discipline: "MECHANICAL",
    difficulty: "EXPERT",
    eloWeight: 36,
    tags: ["first-law", "control-volume", "turbine", "isentropic-efficiency", "steam"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 9990,
    tolerance: 120,
    unit: "kW",
    hints: [
      "Find the ideal (isentropic) exit state first: at the exit pressure, s2s = s1, so back out the exit quality from x = (s1 − sf)/sfg.",
      "Get h2s = hf + x·hfg, then the isentropic work w_s = h1 − h2s. Apply the isentropic efficiency to get actual work: w_actual = η·w_s.",
      "Power is ṁ·w_actual. Watch units: enthalpies are kJ/kg and flow is kg/s, so the product is already in kW.",
    ],
    solution:
      "**Governing principle — steady-flow energy equation (SFEE) on an adiabatic turbine, with isentropic efficiency.** For an adiabatic, steady control volume neglecting KE/PE, the specific work is $w = h_1 - h_2$. The *ideal* exit state is found isentropically ($s_{2s} = s_1$); the real machine produces only a fraction $\\eta_t$ of that ideal work.\n\n" +
      "**Step 1 — Inlet state.** Given: $h_1 = 3115.3\\ \\text{kJ/kg}$, $s_1 = 6.7428\\ \\text{kJ/(kg·K)}$.\n\n" +
      "**Step 2 — Isentropic exit quality at 10 kPa** ($s_{2s} = s_1$):\n" +
      "$$x_s = \\frac{s_1 - s_f}{s_{fg}} = \\frac{6.7428 - 0.6493}{7.5009} = \\frac{6.0935}{7.5009} = 0.8124$$\n\n" +
      "**Step 3 — Isentropic exit enthalpy.**\n" +
      "$$h_{2s} = h_f + x_s h_{fg} = 191.83 + (0.8124)(2392.8) = 191.83 + 1943.9 = 2135.7\\ \\text{kJ/kg}$$\n\n" +
      "**Step 4 — Isentropic, then actual specific work.**\n" +
      "$$w_s = h_1 - h_{2s} = 3115.3 - 2135.7 = 979.6\\ \\text{kJ/kg}$$\n" +
      "$$w_{actual} = \\eta_t\\, w_s = 0.85 \\times 979.6 = 832.7\\ \\text{kJ/kg}$$\n\n" +
      "**Step 5 — Power.**\n" +
      "$$\\dot W = \\dot m\\, w_{actual} = (12\\ \\text{kg/s})(832.7\\ \\text{kJ/kg}) = 9992\\ \\text{kW}$$\n\n" +
      "**Key insight / trap:** Isentropic efficiency for a *turbine* multiplies the ideal work ($w_{actual} = \\eta w_s$) — don't divide (that's for compressors/pumps). The kJ/kg × kg/s product lands directly in kW, no extra conversion.\n\n" +
      "**Final answer: $\\dot W \\approx \\mathbf{9990\\ kW}$ (≈ 10.0 MW).**",
  },
  // SOLUTION: Polytropic compression of ideal gas, work and final temp.
  // Air compressed from 100 kPa, 300 K to 800 kPa, polytropic n = 1.30. R = 0.287 kJ/kg·K.
  // T2 = T1·(P2/P1)^((n−1)/n) = 300·(8)^(0.30/1.30) = 300·8^0.23077.
  // 8^0.23077 = e^(0.23077·ln8) = e^(0.23077·2.07944) = e^0.47988 = 1.6159. T2 = 484.8 K.
  // Polytropic work per kg (closed) w = R(T2−T1)/(1−n) ... boundary work; but compressor (open) w = nR(T2−T1)/(1−n).
  // Asked: final temperature only → T2 ≈ 484.8 K ≈ 485 K.
  {
    id: "th_polytropic_compression_temp",
    slug: "thermo-polytropic-compression-temp",
    title: "Polytropic Air Compression Outlet Temperature",
    prompt:
      "An air compressor takes in air at 100 kPa and 300 K and compresses it to 800 kPa following a polytropic process with exponent n = 1.30. Model air as an ideal gas with R = 0.287 kJ/(kg·K).\n\nWhat is the air temperature at the compressor outlet? Give your answer in kelvin (K), rounded to the nearest whole kelvin.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["polytropic", "ideal-gas", "compression", "process"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 485,
    tolerance: 4,
    unit: "K",
    hints: [
      "A polytropic process obeys P·v^n = constant, which for an ideal gas links temperatures and pressures.",
      "Use the relation T2/T1 = (P2/P1)^((n−1)/n). The specific gas constant R is a distractor for this part — it is only needed if you were asked for work.",
      "Evaluate the pressure ratio (800/100 = 8) raised to (n−1)/n = 0.30/1.30, then multiply by T1 in kelvin.",
    ],
    solution:
      "**Governing principle — polytropic process for an ideal gas.** A polytropic process follows $P v^n = \\text{const}$. Combined with the ideal-gas law, this links the end-state temperatures and pressures by $T_2/T_1 = (P_2/P_1)^{(n-1)/n}$.\n\n" +
      "**Step 1 — Pressure ratio and exponent.**\n" +
      "$$\\frac{P_2}{P_1} = \\frac{800}{100} = 8, \\qquad \\frac{n-1}{n} = \\frac{0.30}{1.30} = 0.23077$$\n\n" +
      "**Step 2 — Apply the polytropic T–P relation.**\n" +
      "$$T_2 = T_1\\left(\\frac{P_2}{P_1}\\right)^{(n-1)/n} = 300 \\times 8^{0.23077}$$\n\n" +
      "**Step 3 — Evaluate the power.** Using $8^{0.23077} = e^{0.23077\\,\\ln 8} = e^{0.23077\\times 2.07944} = e^{0.4799} = 1.6159$:\n" +
      "$$T_2 = 300 \\times 1.6159 = 484.8\\ \\text{K}$$\n\n" +
      "**Key insight / trap:** $T_1$ must be absolute (300 K already is). The gas constant $R = 0.287$ kJ/(kg·K) is a *distractor* here — it's only needed for work or specific volume, not for the outlet temperature.\n\n" +
      "**Final answer: $T_2 \\approx \\mathbf{485\\ K}$.**",
  },
  // SOLUTION: Annular fin / pin-fin heat rate with adiabatic-tip approximation, multi-step.
  // Aluminum pin fin, k = 180 W/m·K, D = 5 mm, L = 50 mm, base 100 °C, air 25 °C, h = 40 W/m²K.
  // P = πD = π·0.005 = 0.015708 m; Ac = πD²/4 = π·2.5e-5/4 = 1.9635e-5 m².
  // m = sqrt(hP/(kAc)) = sqrt(40·0.015708/(180·1.9635e-5)) = sqrt(0.62832/0.0035343) = sqrt(177.78) = 13.33 1/m.
  // mL = 13.33·0.05 = 0.6666. tanh(0.6666) = 0.5829.
  // q = sqrt(h P k Ac)·θb·tanh(mL). sqrt(h P k Ac) = sqrt(40·0.015708·180·1.9635e-5) = sqrt(0.0022206) = 0.047123.
  // θb = 75 K. q = 0.047123·75·0.5829 = 2.060 W ≈ 2.06 W.
  {
    id: "th_pin_fin_heat_rate",
    slug: "thermo-pin-fin-heat-rate",
    title: "Heat Dissipated by a Pin Fin",
    prompt:
      "An aluminum pin fin (k = 180 W/(m·K)) of 5 mm diameter and 50 mm length protrudes from a surface held at 100 °C into 25 °C air with a convection coefficient of 40 W/(m²·K). Treat the fin tip as adiabatic.\n\nHow much heat does this single fin dissipate? Give your answer in watts (W), rounded to two decimal places.",
    discipline: "MECHANICAL",
    difficulty: "EXPERT",
    eloWeight: 33,
    tags: ["fins", "conduction", "convection", "extended-surface"],
    skillAreas: ["heat-transfer"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 2.06,
    tolerance: 0.08,
    unit: "W",
    hints: [
      "Set up the fin parameters: perimeter P = πD and cross-sectional area Ac = πD²/4 for the circular pin.",
      "Compute the fin parameter m = sqrt(hP/(kAc)) and the base excess temperature θ_b = T_base − T_air.",
      "For an adiabatic tip, q_fin = sqrt(h·P·k·Ac)·θ_b·tanh(mL). Keep all lengths in meters so m has units of 1/m.",
    ],
    solution:
      "**Governing principle — extended surface (fin) heat transfer, adiabatic tip.** Heat conducts along the fin and convects off its sides. For a uniform cross-section fin with an insulated tip, the base heat rate is $q = \\sqrt{hPkA_c}\\,\\theta_b \\tanh(mL)$, where $m = \\sqrt{hP/(kA_c)}$.\n\n" +
      "**Step 1 — Geometry (work in meters).** For the circular pin, $D = 0.005\\ \\text{m}$:\n" +
      "$$P = \\pi D = \\pi(0.005) = 0.015708\\ \\text{m}$$\n" +
      "$$A_c = \\frac{\\pi D^2}{4} = \\frac{\\pi(0.005)^2}{4} = 1.9635\\times10^{-5}\\ \\text{m}^2$$\n\n" +
      "**Step 2 — Fin parameter $m$.**\n" +
      "$$m = \\sqrt{\\frac{hP}{kA_c}} = \\sqrt{\\frac{(40)(0.015708)}{(180)(1.9635\\times10^{-5})}} = \\sqrt{\\frac{0.62832}{0.0035343}} = \\sqrt{177.78} = 13.33\\ \\text{m}^{-1}$$\n\n" +
      "**Step 3 — $mL$ and its hyperbolic tangent.** With $L = 0.050\\ \\text{m}$:\n" +
      "$$mL = 13.33 \\times 0.050 = 0.6666, \\qquad \\tanh(0.6666) = 0.5829$$\n\n" +
      "**Step 4 — Base excess temperature and the prefactor.**\n" +
      "$$\\theta_b = T_{base} - T_\\infty = 100 - 25 = 75\\ \\text{K}$$\n" +
      "$$\\sqrt{hPkA_c} = \\sqrt{(40)(0.015708)(180)(1.9635\\times10^{-5})} = \\sqrt{0.0022206} = 0.047123\\ \\text{W/K}$$\n\n" +
      "**Step 5 — Fin heat rate.**\n" +
      "$$q = \\sqrt{hPkA_c}\\,\\theta_b \\tanh(mL) = (0.047123)(75)(0.5829) = 2.06\\ \\text{W}$$\n\n" +
      "**Key insight / trap:** Convert mm to m *before* computing $A_c$ and $P$ — a single missed conversion throws $m$ off by orders of magnitude. The temperature difference (75 K) is the same in K or °C since only a difference appears.\n\n" +
      "**Final answer: $q \\approx \\mathbf{2.06\\ W}$.**",
  },
  // SOLUTION: Heat-pump COP judgment + first-law check. Heat pump delivers Q_H to a house; COP_HP = Q_H/W = COP_R + 1.
  // House needs 12 kW heating, outdoor 2 °C (275.15 K), indoor 21 °C (294.15 K).
  // Carnot COP_HP = Th/(Th−Tc) = 294.15/19 = 15.48 (ideal ceiling). Real units ~ 3–4.
  // MC tests: with W input, Q_H always exceeds W (delivers more heat than electric resistance for same W). Correct option.
  {
    id: "th_heat_pump_cop_concept",
    slug: "thermo-heat-pump-cop-concept",
    title: "Heat Pump vs. Resistance Heating",
    prompt:
      "A homeowner compares an electric-resistance heater (which converts essentially all electrical input directly to heat) against an air-source heat pump for the same heating duty on a 2 °C day with a 21 °C indoor target.\n\nWhich statement correctly describes the thermodynamics?",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 20,
    tags: ["heat-pump", "cop", "first-law", "second-law"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "The heat pump delivers more heat than the electrical work it consumes because it also pumps heat from the outdoor air, so its COP exceeds 1",
        correct: true,
      },
      {
        id: "b",
        label: "Both devices have COP exactly 1 because energy is conserved, so there is no efficiency advantage",
      },
      {
        id: "c",
        label: "The heat pump violates the first law since delivered heat exceeds electrical input",
      },
      {
        id: "d",
        label: "Resistance heating is always superior because heat pumps cannot operate below freezing",
      },
    ],
    hints: [
      "Resistance heating turns work entirely into heat, so its 'COP' is 1. A heat pump also moves heat from the outdoor air into the house.",
      "Write the heat-pump energy balance: Q_delivered = W_input + Q_absorbed from outdoors, which forces COP_HP = Q_delivered/W > 1.",
      "Delivering more heat than the work consumed does not break the first law — the extra energy comes from the outdoor air, not from nothing.",
    ],
    solution:
      "**Governing principle — heat-pump energy balance (first + second laws).** A heat pump uses work $W$ to *move* heat $Q_L$ from the cold outdoors and delivers $Q_H$ to the house. The first law gives $Q_H = W + Q_L$, so its heating COP is $COP_{HP} = Q_H/W = 1 + Q_L/W > 1$. Resistance heating only converts $W$ to heat, giving a 'COP' of exactly 1.\n\n" +
      "**Step 1 — Resistance heater.** All electrical work becomes heat: $Q_H = W$, so its effective COP is 1. No bonus.\n\n" +
      "**Step 2 — Heat pump.** Energy balance: $Q_H = W + Q_{absorbed,outdoors}$. Since $Q_{absorbed} > 0$, the delivered heat exceeds the work, so $COP_{HP} > 1$. **Option (a) is correct.**\n\n" +
      "**Step 3 — Sanity check the ceiling.** The Carnot heating COP between $T_{cold} = 275.15\\ \\text{K}$ and $T_{hot} = 294.15\\ \\text{K}$ is\n" +
      "$$COP_{HP,Carnot} = \\frac{T_{hot}}{T_{hot} - T_{cold}} = \\frac{294.15}{19} \\approx 15.5,$$\n" +
      "well above 1, so real values of 3–4 are entirely consistent with delivering more heat than the work consumed.\n\n" +
      "**Why the distractors fail:**\n" +
      "- **(b)** Wrong — resistance heating has COP 1, but a heat pump's COP exceeds 1, so there *is* an advantage.\n" +
      "- **(c)** Wrong — delivering $Q_H > W$ does NOT violate the first law; the surplus is heat pumped from outdoor air ($Q_H = W + Q_L$), not energy created.\n" +
      "- **(d)** Wrong — heat pumps do operate below freezing (COP drops but stays > 1); resistance heating is not 'always superior'.\n\n" +
      "**Key insight / trap:** 'COP > 1' looks like it beats energy conservation, but the extra energy comes from the outdoor reservoir — the heat pump moves heat, it doesn't manufacture it.\n\n" +
      "**Final answer: (a) — the heat pump delivers more heat than the work it consumes (COP > 1) by also extracting heat from the outdoor air.**",
  },
  // SOLUTION: Transient lumped-capacitance cooling; verify Bi first, then time to reach a temperature.
  // Steel ball D = 20 mm, ρ = 7850, c = 480 J/kgK, k = 50 W/mK. Quenched from 500 °C in 30 °C oil, h = 600 W/m²K.
  // Lc = V/As = (D/6) = 0.02/6 = 0.003333 m. Bi = hLc/k = 600·0.003333/50 = 0.04 < 0.1 → lumped OK.
  // τ = ρ V c/(h As) = ρ c Lc/h = 7850·480·0.003333/600 = 12560/600 = 20.93 s.
  // θ/θi = (T−T∞)/(Ti−T∞) = (100−30)/(500−30) = 70/470 = 0.14894.
  // t = −τ ln(0.14894) = −20.93·(−1.9043) = 39.86 s ≈ 39.9 s.
  {
    id: "th_lumped_capacitance_quench",
    slug: "thermo-lumped-capacitance-quench",
    title: "Quench Time of a Steel Ball",
    prompt:
      "A 20 mm diameter steel ball (ρ = 7850 kg/m³, c = 480 J/(kg·K), k = 50 W/(m·K)) is heated to 500 °C and quenched in an oil bath at 30 °C with a convection coefficient of 600 W/(m²·K). First justify any simplifying assumption, then find the time required for the ball's temperature to fall to 100 °C.\n\nGive your answer in seconds (s), rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["transient", "lumped-capacitance", "biot-number", "convection"],
    skillAreas: ["heat-transfer"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 39.9,
    tolerance: 0.6,
    unit: "s",
    hints: [
      "Before using a simple model, check the Biot number Bi = h·Lc/k with Lc = V/A_s = D/6 for a sphere; if Bi < 0.1, lumped capacitance applies.",
      "The lumped model gives exponential decay: (T − T∞)/(Ti − T∞) = exp(−t/τ), with time constant τ = ρ·c·Lc/h.",
      "Solve for t = −τ·ln[(T − T∞)/(Ti − T∞)]. Temperature differences can stay in °C since only ratios appear.",
    ],
    solution:
      "**Governing principle — transient lumped-capacitance cooling.** If internal conduction is fast compared with surface convection (Biot number small), the body cools uniformly and its temperature decays exponentially: $\\dfrac{T - T_\\infty}{T_i - T_\\infty} = e^{-t/\\tau}$. We must first justify the lumped model with the Biot number.\n\n" +
      "**Step 1 — Characteristic length and Biot number.** For a sphere, $L_c = V/A_s = D/6$:\n" +
      "$$L_c = \\frac{0.020}{6} = 0.003333\\ \\text{m}$$\n" +
      "$$Bi = \\frac{hL_c}{k} = \\frac{(600)(0.003333)}{50} = 0.04 < 0.1$$\n" +
      "Since $Bi < 0.1$, the lumped-capacitance model is valid.\n\n" +
      "**Step 2 — Time constant.** $\\tau = \\dfrac{\\rho V c}{h A_s} = \\dfrac{\\rho c L_c}{h}$:\n" +
      "$$\\tau = \\frac{(7850)(480)(0.003333)}{600} = \\frac{12{,}560}{600} = 20.93\\ \\text{s}$$\n\n" +
      "**Step 3 — Temperature ratio at the target.**\n" +
      "$$\\frac{T - T_\\infty}{T_i - T_\\infty} = \\frac{100 - 30}{500 - 30} = \\frac{70}{470} = 0.14894$$\n\n" +
      "**Step 4 — Solve for time.**\n" +
      "$$t = -\\tau \\ln(0.14894) = -(20.93)(-1.9043) = 39.86\\ \\text{s}$$\n\n" +
      "**Key insight / trap:** Always check $Bi$ before assuming lumped behavior. Temperatures may stay in °C here because only a *ratio of differences* appears — but the convection time constant uses absolute properties, so keep $L_c$ in meters.\n\n" +
      "**Final answer: $t \\approx \\mathbf{39.9\\ s}$.**",
  },
  // SOLUTION: Rankine cycle pump+turbine+boiler → net work and thermal efficiency, multi-step.
  // States: condenser 10 kPa, boiler 4 MPa, turbine inlet 4 MPa/400 °C. Pump on saturated liquid at 10 kPa.
  // hf@10kPa = 191.83, vf = 0.001010 m³/kg. wp = vf·(P2−P1) = 0.001010·(4000−10) kPa = 0.001010·3990 = 4.03 kJ/kg.
  // h2 = 191.83 + 4.03 = 195.86 kJ/kg. Boiler: h3@4MPa,400°C ≈ 3213.6 kJ/kg, s3 ≈ 6.7690 kJ/kg·K.
  // Turbine exit 10 kPa, s4 = s3: x4 = (6.7690−0.6493)/7.5009 = 0.8158. h4 = 191.83 + 0.8158·2392.8 = 2143.9 kJ/kg.
  // wt = h3−h4 = 3213.6 − 2143.9 = 1069.7 kJ/kg. w_net = 1069.7 − 4.03 = 1065.7 kJ/kg.
  // q_in = h3 − h2 = 3213.6 − 195.86 = 3017.7 kJ/kg. η = 1065.7/3017.7 = 0.3531 ≈ 35.3%.
  {
    id: "th_rankine_cycle_efficiency",
    slug: "thermo-rankine-cycle-efficiency",
    title: "Ideal Rankine Cycle Thermal Efficiency",
    prompt:
      "An ideal Rankine cycle operates between a condenser at 10 kPa and a boiler at 4 MPa, with steam entering the turbine at 400 °C. Useful property data: at 10 kPa, hf = 191.83 kJ/kg, hfg = 2392.8 kJ/kg, sf = 0.6493 kJ/(kg·K), sfg = 7.5009 kJ/(kg·K), vf = 0.001010 m³/kg; at the turbine inlet (4 MPa, 400 °C) h = 3213.6 kJ/kg and s = 6.769 kJ/(kg·K). Assume an ideal (isentropic) pump and turbine.\n\nDetermine the cycle's thermal efficiency. Give your answer as a percent, rounded to one decimal place.",
    discipline: "MECHANICAL",
    difficulty: "EXPERT",
    eloWeight: 37,
    tags: ["rankine-cycle", "efficiency", "pump-work", "steam", "power-plant"],
    skillAreas: ["thermodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 35.3,
    tolerance: 0.6,
    unit: "%",
    hints: [
      "Work around the four states. Start at the pump: the small pump work on liquid is w_p = vf·(P_boiler − P_condenser), and h after pump = hf + w_p.",
      "For the isentropic turbine, set s_exit = s_inlet to find the exit quality x = (s_inlet − sf)/sfg, then h_exit = hf + x·hfg.",
      "Efficiency is net work over heat added: η = (w_turbine − w_pump)/(h_inlet − h_after-pump). Keep pressures in kPa so vf·ΔP comes out in kJ/kg.",
    ],
    solution:
      "**Governing principle — ideal Rankine cycle.** Trace the working fluid through four ideal components: pump (1→2, isentropic), boiler (2→3, constant pressure heat addition), turbine (3→4, isentropic), condenser (4→1). Thermal efficiency is net work over heat added: $\\eta = w_{net}/q_{in}$.\n\n" +
      "**Step 1 — Pump (state 1→2).** State 1 is saturated liquid at 10 kPa ($h_1 = h_f = 191.83\\ \\text{kJ/kg}$). The pump work on the nearly incompressible liquid is\n" +
      "$$w_p = v_f(P_2 - P_1) = (0.001010)(4000 - 10) = (0.001010)(3990) = 4.03\\ \\text{kJ/kg}$$\n" +
      "$$h_2 = h_1 + w_p = 191.83 + 4.03 = 195.86\\ \\text{kJ/kg}$$\n" +
      "(Pressures in kPa with $v_f$ in m³/kg give kJ/kg directly.)\n\n" +
      "**Step 2 — Turbine inlet (state 3).** At 4 MPa, 400 °C: $h_3 = 3213.6\\ \\text{kJ/kg}$, $s_3 = 6.7690\\ \\text{kJ/(kg·K)}$.\n\n" +
      "**Step 3 — Isentropic turbine exit (state 4, 10 kPa, $s_4 = s_3$).**\n" +
      "$$x_4 = \\frac{s_3 - s_f}{s_{fg}} = \\frac{6.7690 - 0.6493}{7.5009} = \\frac{6.1197}{7.5009} = 0.8158$$\n" +
      "$$h_4 = h_f + x_4 h_{fg} = 191.83 + (0.8158)(2392.8) = 191.83 + 1952.1 = 2143.9\\ \\text{kJ/kg}$$\n\n" +
      "**Step 4 — Works and heat input.**\n" +
      "$$w_t = h_3 - h_4 = 3213.6 - 2143.9 = 1069.7\\ \\text{kJ/kg}$$\n" +
      "$$w_{net} = w_t - w_p = 1069.7 - 4.03 = 1065.7\\ \\text{kJ/kg}$$\n" +
      "$$q_{in} = h_3 - h_2 = 3213.6 - 195.86 = 3017.7\\ \\text{kJ/kg}$$\n\n" +
      "**Step 5 — Thermal efficiency.**\n" +
      "$$\\eta = \\frac{w_{net}}{q_{in}} = \\frac{1065.7}{3017.7} = 0.3531 = 35.3\\%$$\n\n" +
      "**Key insight / trap:** Don't neglect pump work entirely, but also don't forget it's tiny (4 kJ/kg vs 1070 kJ/kg of turbine work). The bigger trap is $q_{in} = h_3 - h_2$ (use the post-pump enthalpy $h_2$, not $h_1$). Keep pressures in kPa for $v_f \\Delta P$.\n\n" +
      "**Final answer: $\\eta \\approx \\mathbf{35.3\\%}$.**",
  },
];
