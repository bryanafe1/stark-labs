import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION:
  // Steady level flight requires lift = weight: L = W = m·g = 850·9.81 = 8338.5 N.
  // The lift equation L = q·S·C_L lets us back out the dynamic pressure needed:
  // q = W / (S·C_L) = 8338.5 / (14.5·0.9) = 8338.5 / 13.05 = 638.97 Pa.
  // (Sanity: this corresponds to V = sqrt(2q/ρ) = sqrt(2·639/1.225) ≈ 32.3 m/s.)
  {
    id: "ae_dynamic_pressure",
    slug: "aero-dynamic-pressure-sea-level",
    title: "Dynamic Pressure to Hold a Light Aircraft Aloft",
    prompt:
      "A light aircraft of mass 850 kg flies straight and level at sea level\n" +
      "(air density 1.225 kg/m^3). Its wing planform area is 14.5 m^2 and at the\n" +
      "chosen cruise attitude the wing operates at a lift coefficient of 0.9.\n\n" +
      "Determine the dynamic pressure the wing must see to sustain steady level\n" +
      "flight.\n\n" +
      "Report the dynamic pressure in Pa (N/m^2), rounded to the nearest whole\n" +
      "number.",
    discipline: "AEROSPACE",
    difficulty: "EASY",
    eloWeight: 15,
    tags: ["dynamic-pressure", "lift", "aerodynamics"],
    skillAreas: ["aerodynamics", "fluid-mechanics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 639,
    tolerance: 7,
    unit: "Pa",
    hints: [
      "In steady level flight there is no vertical acceleration: write the vertical force balance to relate lift to weight before touching the lift equation.",
      "Lift can be written L = q*S*C_L, where q is the dynamic pressure you are solving for. Set this equal to the weight you found.",
      "Rearrange to q = W / (S*C_L). Do not multiply by 1/2 again or convert to a velocity; the answer is already a pressure in Pa.",
    ],
    solution:
      "**Governing principle — vertical force balance in steady level flight.** Straight-and-level cruise means no vertical acceleration, so the net vertical force is zero: lift must exactly balance weight. The lift equation $L = qSC_L$ then ties that required lift to the dynamic pressure $q$ the wing sees.\n\n" +
      "**Step 1 — Find the weight (required lift):**\n" +
      "$$W = mg = 850\\ \\text{kg} \\times 9.81\\ \\text{m/s}^2 = 8338.5\\ \\text{N}.$$\n" +
      "In level flight $L = W = 8338.5\\ \\text{N}$.\n\n" +
      "**Step 2 — Write lift in terms of dynamic pressure:**\n" +
      "$$L = q\\,S\\,C_L \\quad\\Rightarrow\\quad q = \\frac{L}{S\\,C_L} = \\frac{W}{S\\,C_L}.$$\n\n" +
      "**Step 3 — Substitute with units:**\n" +
      "$$q = \\frac{8338.5\\ \\text{N}}{14.5\\ \\text{m}^2 \\times 0.9} = \\frac{8338.5}{13.05}\\ \\text{N/m}^2 = 638.97\\ \\text{Pa}.$$\n\n" +
      "**Key insight / trap:** $q = \\tfrac{1}{2}\\rho V^2$ is already the full dynamic pressure — do NOT multiply by another $\\tfrac{1}{2}$, and do not convert to a velocity. (As a sanity check, $V = \\sqrt{2q/\\rho} = \\sqrt{2 \\cdot 639 / 1.225} \\approx 32.3\\ \\text{m/s}$, a reasonable light-aircraft speed.)\n\n" +
      "**Final answer: $q \\approx 639\\ \\text{Pa}$.**\n",
  },
  // SOLUTION:
  // In a steady straight climb at flight-path angle γ, the lift balances only the
  // component of weight perpendicular to the flight path (thrust carries the rest):
  // L = W·cos(γ) = m·g·cos(γ) = 1500·9.81·cos(12°) = 14715·0.97815 = 14393 N.
  // Common trap is using L = W (level-flight result); the climb angle reduces L.
  {
    id: "ae_lift_force",
    slug: "aero-lift-force-from-coefficient",
    title: "Required Lift in a Steady Climb",
    prompt:
      "A 1500 kg aircraft is established in a steady, straight climb along a\n" +
      "flight path inclined 12 degrees above the horizontal, holding constant\n" +
      "airspeed. The engine thrust is aligned with the flight path.\n\n" +
      "Determine the lift the wing must produce in this climb.\n\n" +
      "Report the lift in newtons (N), rounded to the nearest 10 N.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["lift", "climb", "flight-mechanics"],
    skillAreas: ["aerodynamics", "dynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 14393,
    tolerance: 150,
    unit: "N",
    hints: [
      "Draw the free body in flight-path axes: weight acts straight down, while lift is perpendicular to the flight path, not perpendicular to the ground.",
      "Resolve weight into components parallel and perpendicular to the climb path. Lift only has to balance the perpendicular component; thrust handles the rest.",
      "L = W*cos(gamma). Using L = W (the level-flight result) is the trap here and overstates the required lift.",
    ],
    solution:
      "**Governing principle — force balance in flight-path (wind) axes.** In a steady, constant-speed climb there is no acceleration, so forces balance along and perpendicular to the flight path. Lift acts perpendicular to the flight path, while weight acts vertically down; thrust (aligned with the path) handles the along-path component of weight. Only the component of weight perpendicular to the path must be carried by lift.\n\n" +
      "**Step 1 — Weight:**\n" +
      "$$W = mg = 1500\\ \\text{kg} \\times 9.81\\ \\text{m/s}^2 = 14715\\ \\text{N}.$$\n\n" +
      "**Step 2 — Resolve weight onto the flight-path axes.** With climb angle $\\gamma = 12^\\circ$, the component perpendicular to the flight path is $W\\cos\\gamma$ and the component along it (opposing motion) is $W\\sin\\gamma$. Lift balances the perpendicular component:\n" +
      "$$L = W\\cos\\gamma.$$\n\n" +
      "**Step 3 — Substitute and compute:**\n" +
      "$$L = 14715\\ \\text{N} \\times \\cos 12^\\circ = 14715 \\times 0.97815 = 14393\\ \\text{N}.$$\n\n" +
      "**Key insight / trap:** The wing carries *less* than the full weight in a climb because thrust supports part of it. Using the level-flight result $L = W = 14715\\ \\text{N}$ overstates the lift by ~320 N. The faster the climb angle, the smaller the required lift ($L \\to 0$ in a vertical climb).\n\n" +
      "**Final answer: $L \\approx 14{,}390\\ \\text{N}$.**\n",
  },
  // SOLUTION:
  // The aspect ratio is AR = b^2 / S, but S is not given directly — it must be
  // built from the tapered planform. For a straight-tapered wing the area is the
  // span times the mean of root and tip chords:
  // S = b·(c_root + c_tip)/2 = 11.0·(1.8 + 0.9)/2 = 11.0·1.35 = 14.85 m^2.
  // AR = b^2 / S = 11.0^2 / 14.85 = 121 / 14.85 = 8.148 ≈ 8.1.
  {
    id: "ae_aspect_ratio",
    slug: "aero-wing-aspect-ratio",
    title: "Aspect Ratio of a Tapered Wing",
    prompt:
      "A straight-tapered wing has a span of 11.0 m, a root chord of 1.8 m, and a\n" +
      "tip chord of 0.9 m. The leading and trailing edges are straight.\n\n" +
      "Determine the wing's aspect ratio.\n\n" +
      "Report the dimensionless aspect ratio rounded to 1 decimal place.",
    discipline: "AEROSPACE",
    difficulty: "EASY",
    eloWeight: 16,
    tags: ["aspect-ratio", "wing-geometry"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 8.1,
    tolerance: 0.15,
    unit: "dimensionless",
    hints: [
      "Aspect ratio is AR = b^2 / S, but the planform area S is not given directly; you must build it from the tapered geometry first.",
      "For a straight-tapered wing the area is span times the average chord: S = b*(c_root + c_tip)/2.",
      "Compute S, then divide b^2 by it. Note AR = b/c only works for a rectangular (untapered) wing, so do not use the root or tip chord alone.",
    ],
    solution:
      "**Governing principle — aspect ratio is a geometric ratio of span to area.** By definition $AR = b^2/S$. The catch is that the planform area $S$ is not handed to you; for a straight-tapered wing with straight edges, the planform is a trapezoid whose area is the span times the average (mean) chord.\n\n" +
      "**Step 1 — Build the planform area from the taper:**\n" +
      "$$S = b \\cdot \\frac{c_{root} + c_{tip}}{2} = 11.0\\ \\text{m} \\times \\frac{1.8 + 0.9}{2}\\ \\text{m} = 11.0 \\times 1.35 = 14.85\\ \\text{m}^2.$$\n\n" +
      "**Step 2 — Apply the aspect-ratio definition:**\n" +
      "$$AR = \\frac{b^2}{S} = \\frac{(11.0\\ \\text{m})^2}{14.85\\ \\text{m}^2} = \\frac{121}{14.85} = 8.148.$$\n\n" +
      "**Key insight / trap:** The shortcut $AR = b/c$ is valid *only* for a rectangular (untapered) wing. Plugging in the root chord ($11.0/1.8 = 6.1$) or tip chord ($11.0/0.9 = 12.2$) alone gives wildly wrong answers — you must use the trapezoidal area.\n\n" +
      "**Final answer: $AR \\approx 8.1$ (dimensionless).**\n",
  },
  // SOLUTION:
  // Three chained steps. (1) Lift = weight in cruise gives the operating C_L:
  //   C_L = 2·m·g / (ρ·V^2·S) = 2·1100·9.81 / (1.225·46^2·16.2)
  //       = 21582 / (1.225·2116·16.2) = 21582 / 41992 = 0.5140.
  // (2) Induced drag coefficient: C_Di = C_L^2 / (π·e·AR)
  //   = 0.5140^2 / (π·0.82·8.5) = 0.2642 / 21.90 = 0.012063.
  // (3) Induced drag FORCE: D_i = ½·ρ·V^2·S·C_Di
  //   = 0.5·1.225·2116·16.2·0.012063 = 20996·16.2·... = 253.3 N.
  {
    id: "ae_induced_drag_coeff",
    slug: "aero-induced-drag-coefficient",
    title: "Induced Drag of a Cruising Aircraft",
    prompt:
      "A 1100 kg aircraft cruises straight and level at 46 m/s through air of\n" +
      "density 1.225 kg/m^3. Its wing has a planform area of 16.2 m^2, an aspect\n" +
      "ratio of 8.5, and an Oswald span efficiency factor of 0.82.\n\n" +
      "Determine the induced (lift-dependent) drag force on the aircraft in this\n" +
      "cruise condition.\n\n" +
      "Report the induced drag in newtons (N), rounded to the nearest 1 N.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["induced-drag", "lift", "aerodynamics"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 253,
    tolerance: 4,
    unit: "N",
    hints: [
      "Induced drag depends on the operating lift coefficient, which is not given. First find C_L from the level-flight condition L = W = (1/2)*rho*V^2*S*C_L.",
      "Then C_Di = C_L^2 / (pi*e*AR). Watch that this is a drag COEFFICIENT, not yet a force.",
      "Convert to a force with D_i = (1/2)*rho*V^2*S*C_Di. Reuse the same dynamic pressure you used to find C_L.",
    ],
    solution:
      "**Governing principle — induced drag is set by how hard the wing is working (its $C_L$).** Lift-dependent drag scales as $C_{D_i} = C_L^2/(\\pi e\\,AR)$, so we must first find the operating $C_L$ from the cruise condition (lift = weight), then convert the drag coefficient into a force. Three chained steps.\n\n" +
      "**Step 1 — Operating lift coefficient from $L = W$:**\n" +
      "$$C_L = \\frac{2mg}{\\rho V^2 S} = \\frac{2 \\times 1100 \\times 9.81}{1.225 \\times 46^2 \\times 16.2} = \\frac{21582}{1.225 \\times 2116 \\times 16.2} = \\frac{21582}{41992} = 0.5140.$$\n\n" +
      "**Step 2 — Induced drag coefficient:**\n" +
      "$$C_{D_i} = \\frac{C_L^2}{\\pi e\\,AR} = \\frac{0.5140^2}{\\pi \\times 0.82 \\times 8.5} = \\frac{0.2642}{21.90} = 0.012063.$$\n\n" +
      "**Step 3 — Convert coefficient to a force** (reusing $q = \\tfrac12\\rho V^2$, so $\\tfrac12\\rho V^2 S = 0.5 \\times 1.225 \\times 2116 \\times 16.2 = 20996\\ \\text{N}$):\n" +
      "$$D_i = \\tfrac{1}{2}\\rho V^2 S\\,C_{D_i} = 20996 \\times 0.012063 = 253.3\\ \\text{N}.$$\n\n" +
      "**Key insight / trap:** $C_{D_i}$ is a *coefficient*, not a force — you must multiply by the dynamic pressure and area to get newtons. Also note the $C_L^2$ dependence: induced drag grows fast as the wing is pushed to higher lift (slower flight, heavier load).\n\n" +
      "**Final answer: $D_i \\approx 253\\ \\text{N}$.**\n",
  },
  // SOLUTION:
  // The local speed of sound is not given and must be computed from the ambient
  // temperature: a = sqrt(γ·R·T) = sqrt(1.4·287·219) = sqrt(87985) = 296.6 m/s.
  // Then M = V / a = 265 / 296.6 = 0.8933 ≈ 0.89.
  // (This is in the transonic regime — local supersonic pockets/shocks expected.)
  {
    id: "ae_mach_number",
    slug: "aero-mach-number-at-altitude",
    title: "Cruise Mach Number from Ambient Temperature",
    prompt:
      "A transport aircraft cruises at a true airspeed of 265 m/s at an altitude\n" +
      "where the ambient static air temperature is 219 K. Treat air as a perfect\n" +
      "gas with ratio of specific heats 1.4 and specific gas constant\n" +
      "287 J/(kg·K).\n\n" +
      "Determine the cruise Mach number.\n\n" +
      "Report the dimensionless Mach number rounded to 2 decimal places.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 23,
    tags: ["mach-number", "compressible-flow", "speed-of-sound"],
    skillAreas: ["aerodynamics", "fluid-mechanics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.89,
    tolerance: 0.02,
    unit: "dimensionless",
    hints: [
      "Mach number is M = V / a, but the local speed of sound a is not given; the speed of sound depends only on temperature for a perfect gas.",
      "For a perfect gas, a = sqrt(gamma*R*T). Use the static temperature, not a sea-level value.",
      "Divide true airspeed by a. The result lands in the transonic range, so a value near 0.9 (not 1.x) is expected.",
    ],
    solution:
      "**Governing principle — Mach number compares flight speed to the local speed of sound.** $M = V/a$. For a perfect gas the speed of sound depends only on temperature, $a = \\sqrt{\\gamma R T}$, so the (unstated) value of $a$ must be computed from the ambient static temperature.\n\n" +
      "**Step 1 — Local speed of sound from the static temperature:**\n" +
      "$$a = \\sqrt{\\gamma R T} = \\sqrt{1.4 \\times 287\\ \\tfrac{\\text{J}}{\\text{kg·K}} \\times 219\\ \\text{K}} = \\sqrt{87985} = 296.6\\ \\text{m/s}.$$\n\n" +
      "**Step 2 — Form the Mach number:**\n" +
      "$$M = \\frac{V}{a} = \\frac{265\\ \\text{m/s}}{296.6\\ \\text{m/s}} = 0.8933.$$\n\n" +
      "**Key insight / trap:** Use the *static* temperature at altitude (219 K), not a sea-level value (~288 K) — the cold high-altitude air lowers $a$ and pushes $M$ up. The result $M \\approx 0.89$ sits in the transonic regime, where local supersonic pockets and shocks form on the wing even though the aircraft itself is subsonic.\n\n" +
      "**Final answer: $M \\approx 0.89$ (dimensionless).**\n",
  },
  // SOLUTION:
  // Two-stage Δv budget is the SUM of each stage's ideal Δv (Tsiolkovsky).
  // Stage 1 carries the full stack (300,000 kg). It burns 180,000 kg propellant:
  //   m0 = 300,000 kg; mf = 300,000 − 180,000 = 120,000 kg.
  //   Δv1 = Isp1·g0·ln(m0/mf) = 290·9.81·ln(300000/120000)
  //       = 2844.9·ln(2.5) = 2844.9·0.91629 = 2606.8 m/s.
  // Stage 2 starts after stage-1 jettison at 100,000 kg, burns 75,000 kg:
  //   m0 = 100,000 kg; mf = 25,000 kg.
  //   Δv2 = Isp2·g0·ln(100000/25000) = 340·9.81·ln(4)
  //       = 3335.4·1.38629 = 4623.8 m/s.
  // Total Δv = 2606.8 + 4623.8 = 7230.6 m/s.
  {
    id: "ae_rocket_equation_dv",
    slug: "aero-rocket-equation-delta-v",
    title: "Total Delta-v of a Two-Stage Rocket",
    prompt:
      "A two-stage launch vehicle has a total liftoff mass of 300,000 kg.\n\n" +
      "Stage 1 (specific impulse 290 s) burns 180,000 kg of propellant while\n" +
      "lifting the entire stack. After stage 1 is jettisoned, the remaining\n" +
      "second stage plus payload has a mass of 100,000 kg; stage 2 (specific\n" +
      "impulse 340 s) then burns 75,000 kg of propellant. Use g0 = 9.81 m/s^2.\n\n" +
      "Determine the total ideal velocity change the vehicle can deliver.\n\n" +
      "Report the total delta-v in m/s, rounded to the nearest 10 m/s.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 32,
    tags: ["rocket-equation", "staging", "delta-v", "propulsion"],
    skillAreas: ["propulsion"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 7230,
    tolerance: 70,
    unit: "m/s",
    hints: [
      "Total delta-v for a staged vehicle is the SUM of each stage's ideal delta-v; apply Tsiolkovsky's equation stage by stage.",
      "For each stage, m0 is the mass at ignition and mf = m0 minus that stage's propellant. Stage 1's m0 is the full stack; stage 2's m0 is the post-jettison mass given.",
      "Use exhaust velocity Ve = Isp*g0 for each stage and dv = Ve*ln(m0/mf). Do not carry stage-1 structure into stage 2's mass ratio.",
    ],
    solution:
      "**Governing principle — Tsiolkovsky rocket equation, applied stage by stage.** Each stage delivers $\\Delta v = I_{sp}\\,g_0 \\ln(m_0/m_f)$, where $m_0$ is the mass at that stage's ignition and $m_f$ is its mass at burnout. For a staged vehicle the *total* $\\Delta v$ is the sum of the stages' individual $\\Delta v$, because each stage starts fresh after the previous one is jettisoned.\n\n" +
      "**Step 1 — Stage 1.** It lifts the entire stack, so $m_0 = 300{,}000$ kg, and it burns 180,000 kg, so $m_f = 300{,}000 - 180{,}000 = 120{,}000$ kg. With $V_e = I_{sp}g_0 = 290 \\times 9.81 = 2844.9\\ \\text{m/s}$:\n" +
      "$$\\Delta v_1 = 2844.9 \\times \\ln\\!\\left(\\frac{300000}{120000}\\right) = 2844.9 \\times \\ln(2.5) = 2844.9 \\times 0.91629 = 2606.8\\ \\text{m/s}.$$\n\n" +
      "**Step 2 — Stage 2.** After stage-1 jettison the vehicle is 100,000 kg, which is $m_0$ for stage 2; it burns 75,000 kg, so $m_f = 100{,}000 - 75{,}000 = 25{,}000$ kg. With $V_e = 340 \\times 9.81 = 3335.4\\ \\text{m/s}$:\n" +
      "$$\\Delta v_2 = 3335.4 \\times \\ln\\!\\left(\\frac{100000}{25000}\\right) = 3335.4 \\times \\ln(4) = 3335.4 \\times 1.38629 = 4623.8\\ \\text{m/s}.$$\n\n" +
      "**Step 3 — Sum the stages:**\n" +
      "$$\\Delta v_{total} = 2606.8 + 4623.8 = 7230.6\\ \\text{m/s}.$$\n\n" +
      "**Key insight / trap:** Do not carry the discarded stage-1 structure into stage 2's mass ratio — that is the whole point of staging. The mass ratios are computed independently for each stage, and the $\\Delta v$ values add (not the mass ratios).\n\n" +
      "**Final answer: $\\Delta v_{total} \\approx 7230\\ \\text{m/s}$.**\n",
  },
  // SOLUTION:
  // Orbital radius r = R_E + h = 6.371e6 + 780e3 = 7.151e6 m.
  // The period requires Kepler's third law, not the speed:
  //   T = 2π·sqrt(r^3 / µ) = 2π·sqrt((7.151e6)^3 / 3.986e14)
  //     = 2π·sqrt(3.657e20 / 3.986e14) = 2π·sqrt(9.174e5)
  //     = 2π·957.8 = 6018 s = 100.3 min.
  {
    id: "ae_orbital_velocity",
    slug: "aero-circular-orbital-velocity-leo",
    title: "Orbital Period of a Sun-Synchronous-Type Orbit",
    prompt:
      "A remote-sensing satellite flies a circular orbit 780 km above Earth's\n" +
      "surface. Use Earth's gravitational parameter 3.986e14 m^3/s^2 and mean\n" +
      "radius 6.371e6 m.\n\n" +
      "Determine the orbital period.\n\n" +
      "Report the period in minutes, rounded to 1 decimal place.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["orbital-mechanics", "orbital-period", "keplers-laws"],
    skillAreas: ["orbital-mechanics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 100.3,
    tolerance: 1.0,
    unit: "min",
    hints: [
      "Work in orbital radius, not altitude: r = R_Earth + h. The given altitude is above the surface.",
      "Period follows from Kepler's third law for a circular orbit: T = 2*pi*sqrt(r^3 / mu). You do not need to find the orbital speed.",
      "T comes out in seconds; divide by 60 for minutes. A value near 100 min is typical for low Earth orbit.",
    ],
    solution:
      "**Governing principle — Kepler's third law for a circular orbit.** The period of a circular orbit depends only on its radius and the gravitational parameter: $T = 2\\pi\\sqrt{r^3/\\mu}$. You do not need the orbital speed at all. Crucially, $r$ is measured from Earth's *center*, so altitude must be added to Earth's radius.\n\n" +
      "**Step 1 — Orbital radius:**\n" +
      "$$r = R_E + h = 6.371\\times10^6 + 780\\times10^3 = 7.151\\times10^6\\ \\text{m}.$$\n\n" +
      "**Step 2 — Apply Kepler's third law.** First $r^3 = (7.151\\times10^6)^3 = 3.657\\times10^{20}\\ \\text{m}^3$, then\n" +
      "$$\\frac{r^3}{\\mu} = \\frac{3.657\\times10^{20}}{3.986\\times10^{14}} = 9.174\\times10^{5}\\ \\text{s}^2, \\qquad \\sqrt{\\cdot} = 957.8\\ \\text{s}.$$\n" +
      "$$T = 2\\pi \\times 957.8 = 6018\\ \\text{s}.$$\n\n" +
      "**Step 3 — Convert to minutes:**\n" +
      "$$T = \\frac{6018\\ \\text{s}}{60} = 100.3\\ \\text{min}.$$\n\n" +
      "**Key insight / trap:** Forgetting to add Earth's radius (using $r = 780$ km) underestimates the period by orders of magnitude. A period near 100 min is the hallmark of low Earth orbit.\n\n" +
      "**Final answer: $T \\approx 100.3\\ \\text{min}$.**\n",
  },
  // SOLUTION:
  // Hohmann transfer between two circular, coplanar orbits requires two prograde
  // burns; total Δv = |v_perigee − v1| + |v2 − v_apogee|.
  // r1 = 6.371e6 + 300e3 = 6.671e6 m;  r2 = 6.371e6 + 1200e3 = 7.571e6 m.
  // Circular speeds: v1 = sqrt(µ/r1) = sqrt(3.986e14/6.671e6) = 7730.0 m/s;
  //                  v2 = sqrt(µ/r2) = sqrt(3.986e14/7.571e6) = 7256.7 m/s.
  // Transfer semi-major axis a = (r1+r2)/2 = 7.121e6 m.
  // Vis-viva at perigee: v_p = sqrt(µ·(2/r1 − 1/a)) = 7970.4 m/s → Δv1 = 240.5 m/s.
  // Vis-viva at apogee:  v_a = sqrt(µ·(2/r2 − 1/a)) = 7022.9 m/s → Δv2 = 233.0 m/s.
  // Total Δv = 240.5 + 233.0 = 473.5 m/s.
  {
    id: "ae_hohmann_transfer_dv",
    slug: "aero-hohmann-transfer-delta-v",
    title: "Hohmann Transfer Between Two Circular Orbits",
    prompt:
      "A spacecraft is to be raised from a circular orbit 300 km above Earth's\n" +
      "surface to a circular orbit 1200 km above the surface, using a\n" +
      "two-impulse Hohmann transfer in the same plane. Use Earth's gravitational\n" +
      "parameter 3.986e14 m^3/s^2 and mean radius 6.371e6 m.\n\n" +
      "Determine the total delta-v required (sum of both burns).\n\n" +
      "Report the total delta-v in m/s, rounded to the nearest 1 m/s.",
    discipline: "AEROSPACE",
    difficulty: "EXPERT",
    eloWeight: 36,
    tags: ["orbital-mechanics", "hohmann-transfer", "delta-v", "vis-viva"],
    skillAreas: ["orbital-mechanics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 474,
    tolerance: 6,
    unit: "m/s",
    hints: [
      "A Hohmann transfer is an ellipse tangent to both circular orbits, requiring two prograde burns; total delta-v is the magnitude of each speed change summed.",
      "Find the two circular speeds with v = sqrt(mu/r), and the transfer-ellipse speeds at perigee and apogee with vis-viva: v = sqrt(mu*(2/r - 1/a)), where a = (r1 + r2)/2.",
      "Burn 1 raises perigee speed to the ellipse: dv1 = v_perigee - v1. Burn 2 circularizes at apogee: dv2 = v2 - v_apogee. Both are positive; add them.",
    ],
    solution:
      "**Governing principle — Hohmann transfer via vis-viva.** The most fuel-efficient two-impulse transfer between coplanar circular orbits is an ellipse tangent to both: its perigee touches the inner orbit, its apogee the outer. Two prograde burns are needed — one to enter the ellipse, one to circularize — and the total cost is the sum of the two speed *changes*. The speed anywhere on an orbit comes from vis-viva, $v = \\sqrt{\\mu(2/r - 1/a)}$.\n\n" +
      "**Step 1 — Radii (add Earth's radius):**\n" +
      "$$r_1 = 6.371\\times10^6 + 300\\times10^3 = 6.671\\times10^6\\ \\text{m}, \\quad r_2 = 6.371\\times10^6 + 1200\\times10^3 = 7.571\\times10^6\\ \\text{m}.$$\n\n" +
      "**Step 2 — Circular speeds of the two parking orbits** ($v = \\sqrt{\\mu/r}$):\n" +
      "$$v_1 = \\sqrt{\\tfrac{3.986\\times10^{14}}{6.671\\times10^6}} = 7730.0\\ \\text{m/s}, \\quad v_2 = \\sqrt{\\tfrac{3.986\\times10^{14}}{7.571\\times10^6}} = 7256.7\\ \\text{m/s}.$$\n\n" +
      "**Step 3 — Transfer-ellipse semi-major axis:**\n" +
      "$$a = \\frac{r_1 + r_2}{2} = \\frac{6.671\\times10^6 + 7.571\\times10^6}{2} = 7.121\\times10^6\\ \\text{m}.$$\n\n" +
      "**Step 4 — Vis-viva speeds on the ellipse at perigee and apogee:**\n" +
      "$$v_p = \\sqrt{\\mu\\!\\left(\\tfrac{2}{r_1} - \\tfrac{1}{a}\\right)} = 7970.4\\ \\text{m/s}, \\qquad v_a = \\sqrt{\\mu\\!\\left(\\tfrac{2}{r_2} - \\tfrac{1}{a}\\right)} = 7022.9\\ \\text{m/s}.$$\n\n" +
      "**Step 5 — The two burns and the total.** Burn 1 speeds up from the inner circular orbit onto the ellipse; burn 2 speeds up from the ellipse's apogee to the outer circular orbit:\n" +
      "$$\\Delta v_1 = v_p - v_1 = 7970.4 - 7730.0 = 240.5\\ \\text{m/s},$$\n" +
      "$$\\Delta v_2 = v_2 - v_a = 7256.7 - 7022.9 = 233.0\\ \\text{m/s},$$\n" +
      "$$\\Delta v_{total} = 240.5 + 233.0 = 473.5\\ \\text{m/s}.$$\n\n" +
      "**Key insight / trap:** Both burns are *prograde* (speed increases) even though the second one ends on a slower circular orbit — at apogee the ellipse is moving slower than the target circle, so you must add speed to circularize. Add the magnitudes; never subtract them. Always work from orbital radii, not altitudes.\n\n" +
      "**Final answer: $\\Delta v_{total} \\approx 474\\ \\text{m/s}$.**\n",
  },
  // SOLUTION:
  // Maximum lift-to-drag occurs where parasite drag equals induced drag, i.e.
  // C_L = sqrt(C_D0 / k) with k = 1/(π·e·AR).
  //   k = 1/(π·0.80·8) = 1/20.106 = 0.049736.
  //   (L/D)_max = 1 / (2·sqrt(k·C_D0)) = 1/(2·sqrt(0.049736·0.020))
  //             = 1/(2·sqrt(9.947e-4)) = 1/(2·0.031540) = 15.85.
  // Trap: using the current cruise C_L instead of the optimum gives a lower value;
  // the question asks for the MAXIMUM achievable L/D.
  {
    id: "ae_ld_max_value",
    slug: "aero-maximum-lift-to-drag-ratio",
    title: "Best Glide: Maximum Lift-to-Drag Ratio",
    prompt:
      "An aircraft has a drag polar of the form C_D = C_D0 + k·C_L^2, with a\n" +
      "zero-lift drag coefficient C_D0 = 0.020. Its wing has an aspect ratio of 8\n" +
      "and an Oswald span efficiency factor of 0.80, so k = 1/(pi·e·AR).\n\n" +
      "Determine the maximum lift-to-drag ratio this airframe can achieve.\n\n" +
      "Report the dimensionless maximum L/D rounded to 1 decimal place.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 31,
    tags: ["lift-to-drag", "drag-polar", "aerodynamic-efficiency"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 15.9,
    tolerance: 0.3,
    unit: "dimensionless",
    hints: [
      "Maximum L/D occurs at the C_L where the two parts of the drag polar balance: parasite drag (C_D0) equals induced drag (k*C_L^2).",
      "First compute k = 1/(pi*e*AR). The optimum is C_L = sqrt(C_D0/k), but you can also use the closed form directly.",
      "(L/D)_max = 1 / (2*sqrt(k*C_D0)). The answer must not depend on any particular cruise speed or weight, only on the polar.",
    ],
    solution:
      "**Governing principle — best L/D occurs where parasite and induced drag are equal.** With the polar $C_D = C_{D0} + kC_L^2$, the ratio $L/D = C_L/C_D$ is maximized by setting $d(C_D/C_L)/dC_L = 0$. The result is the classic condition that the lift-independent (parasite) drag equals the lift-dependent (induced) drag, i.e. $C_{D0} = kC_L^2$, giving the optimum $C_L = \\sqrt{C_{D0}/k}$ and the closed-form $(L/D)_{max} = 1/(2\\sqrt{kC_{D0}})$.\n\n" +
      "**Step 1 — Compute the induced-drag factor $k$:**\n" +
      "$$k = \\frac{1}{\\pi e\\,AR} = \\frac{1}{\\pi \\times 0.80 \\times 8} = \\frac{1}{20.106} = 0.049736.$$\n\n" +
      "**Step 2 — Apply the closed-form maximum.** First the product inside the root:\n" +
      "$$k\\,C_{D0} = 0.049736 \\times 0.020 = 9.947\\times10^{-4}, \\qquad \\sqrt{k\\,C_{D0}} = 0.031540.$$\n" +
      "$$\\left(\\frac{L}{D}\\right)_{max} = \\frac{1}{2\\sqrt{k\\,C_{D0}}} = \\frac{1}{2 \\times 0.031540} = \\frac{1}{0.063080} = 15.85.$$\n\n" +
      "**Key insight / trap:** $(L/D)_{max}$ is a property of the *drag polar alone* — it depends only on $C_{D0}$, $e$, and $AR$, not on weight, speed, or altitude. Plugging in some arbitrary cruise $C_L$ (rather than the optimum) gives a lower value and answers a different question; the problem asks for the maximum achievable ratio.\n\n" +
      "**Final answer: $(L/D)_{max} \\approx 15.9$ (dimensionless).**\n",
  },
  // SOLUTION:
  // Net thrust = (exit momentum flux) − (inlet momentum flux). The exit stream
  // carries BOTH the ingested air and the burned fuel, so its mass flow is
  // mdot_exit = mdot_air·(1 + f), while only air enters the inlet:
  //   T = mdot_air·(1 + f)·V_exit − mdot_air·V_inlet
  //     = 45·(1 + 0.020)·580 − 45·200
  //     = 45·1.020·580 − 9000
  //     = 45.9·580 − 9000 = 26622 − 9000 = 17622 N ≈ 17620 N.
  // Trap: ignoring fuel gives 45·(580−200) = 17100 N; the fuel-air ratio adds
  // ~520 N here. Pressure-matched nozzle means no pressure-thrust term.
  {
    id: "ae_thrust_momentum",
    slug: "aero-thrust-from-momentum",
    title: "Net Thrust of an Air-Breathing Engine",
    prompt:
      "A turbojet ingests air at a mass flow rate of 45 kg/s while flying at\n" +
      "200 m/s. Fuel is injected and burned at a fuel-to-air mass ratio of 0.020,\n" +
      "and the combined exhaust leaves the nozzle at 580 m/s. The nozzle is\n" +
      "pressure-matched to ambient.\n\n" +
      "Determine the net thrust produced, accounting for the mass added by the\n" +
      "fuel.\n\n" +
      "Report the thrust in newtons (N), rounded to the nearest 10 N.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 23,
    tags: ["thrust", "momentum", "propulsion"],
    skillAreas: ["propulsion"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 17620,
    tolerance: 180,
    unit: "N",
    hints: [
      "Thrust is the net momentum flux: what leaves the nozzle per second minus what enters the inlet per second. With a pressure-matched nozzle there is no pressure term.",
      "Only air enters the inlet (mdot_air at flight speed), but the exhaust carries air PLUS fuel, so mdot_exit = mdot_air*(1 + f).",
      "T = mdot_air*(1+f)*V_exit - mdot_air*V_inlet. Neglecting the fuel mass would slightly underestimate the thrust.",
    ],
    solution:
      "**Governing principle — thrust is the net rate of momentum addition.** Applying the momentum theorem to a control volume around the engine, the net thrust equals the momentum flux leaving the nozzle minus the momentum flux entering the inlet (plus a pressure term, which vanishes here because the nozzle is pressure-matched to ambient). The subtlety: the exhaust mass flow includes the injected fuel, while only air enters the inlet.\n\n" +
      "**Step 1 — Account for the mass flows.** Air in: $\\dot m_{air} = 45\\ \\text{kg/s}$. Exhaust out carries air plus fuel: $\\dot m_{exit} = \\dot m_{air}(1+f) = 45 \\times (1 + 0.020) = 45.9\\ \\text{kg/s}$.\n\n" +
      "**Step 2 — Net momentum flux (pressure term = 0):**\n" +
      "$$T = \\dot m_{exit}\\,V_{exit} - \\dot m_{air}\\,V_{inlet} = \\dot m_{air}(1+f)V_{exit} - \\dot m_{air}V_{inlet}.$$\n\n" +
      "**Step 3 — Substitute with units:**\n" +
      "$$T = 45.9\\ \\tfrac{\\text{kg}}{\\text{s}} \\times 580\\ \\tfrac{\\text{m}}{\\text{s}} - 45\\ \\tfrac{\\text{kg}}{\\text{s}} \\times 200\\ \\tfrac{\\text{m}}{\\text{s}} = 26622 - 9000 = 17622\\ \\text{N}.$$\n\n" +
      "**Key insight / trap:** Forgetting the fuel mass and writing $T = \\dot m_{air}(V_{exit} - V_{inlet}) = 45 \\times (580-200) = 17{,}100\\ \\text{N}$ undercounts by ~520 N. The pressure-matched (ideal-expansion) nozzle is what lets us drop the $(p_e - p_\\infty)A_e$ pressure-thrust term.\n\n" +
      "**Final answer: $T \\approx 17{,}620\\ \\text{N}$.**\n",
  },
  // SOLUTION:
  // Two steps: stagnation (total) temperature requires the Mach number, which
  // requires the speed of sound.
  //   a = sqrt(γ·R·T) = sqrt(1.4·287·219) = 296.6 m/s;  M = 265/296.6 = 0.8933.
  //   T0 = T·(1 + (γ−1)/2·M^2) = 219·(1 + 0.2·0.8933^2)
  //      = 219·(1 + 0.2·0.79798) = 219·1.15960 = 253.95 K ≈ 254.0 K.
  // This is the adiabatic recovery (stagnation) temperature seen at a leading edge.
  {
    id: "ae_stagnation_temperature",
    slug: "aero-stagnation-temperature-transonic",
    title: "Stagnation Temperature at a Transonic Leading Edge",
    prompt:
      "A transport aircraft cruises at a true airspeed of 265 m/s where the\n" +
      "ambient static air temperature is 219 K. Treat air as a perfect gas with\n" +
      "ratio of specific heats 1.4 and specific gas constant 287 J/(kg·K), and\n" +
      "assume an adiabatic, isentropic stagnation process.\n\n" +
      "Determine the stagnation (total) temperature the air reaches when brought\n" +
      "to rest at a leading-edge stagnation point.\n\n" +
      "Report the stagnation temperature in K, rounded to 1 decimal place.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 29,
    tags: ["compressible-flow", "stagnation-temperature", "transonic"],
    skillAreas: ["aerodynamics", "thermodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 254.0,
    tolerance: 2.0,
    unit: "K",
    hints: [
      "Stagnation temperature is the static temperature plus the recovery of the flow's kinetic energy when brought to rest; for compressible flow use the Mach-based relation.",
      "You need the Mach number first: M = V / sqrt(gamma*R*T). Then T0 = T*(1 + (gamma-1)/2 * M^2).",
      "The rise above static is only ~35 K here because M < 1. Make sure you square the Mach number inside the bracket.",
    ],
    solution:
      "**Governing principle — adiabatic stagnation raises temperature by converting kinetic energy to enthalpy.** When a steady, adiabatic flow is brought to rest, its kinetic energy becomes thermal energy. For a perfect gas the compressible relation is $T_0/T = 1 + \\tfrac{\\gamma-1}{2}M^2$. So we need the Mach number first, which needs the speed of sound.\n\n" +
      "**Step 1 — Speed of sound and Mach number:**\n" +
      "$$a = \\sqrt{\\gamma R T} = \\sqrt{1.4 \\times 287 \\times 219} = 296.6\\ \\text{m/s}, \\qquad M = \\frac{V}{a} = \\frac{265}{296.6} = 0.8933.$$\n\n" +
      "**Step 2 — Apply the stagnation-temperature relation:**\n" +
      "$$T_0 = T\\left(1 + \\frac{\\gamma-1}{2}M^2\\right) = 219\\left(1 + 0.2 \\times 0.8933^2\\right).$$\n\n" +
      "**Step 3 — Evaluate the bracket and multiply.** With $M^2 = 0.79798$:\n" +
      "$$T_0 = 219 \\times (1 + 0.2 \\times 0.79798) = 219 \\times (1 + 0.15960) = 219 \\times 1.15960 = 253.95\\ \\text{K}.$$\n\n" +
      "**Key insight / trap:** The temperature *rises* (here by ~35 K) even though the gas was cold, because stagnation dumps the flow's kinetic energy into internal energy — this is the adiabatic recovery temperature felt at a leading-edge stagnation point. Be sure to square the Mach number inside the bracket; using $M$ instead of $M^2$ overestimates the rise.\n\n" +
      "**Final answer: $T_0 \\approx 254.0\\ \\text{K}$.**\n",
  },
  // SOLUTION:
  // In steady cruise the required thrust equals drag, T = D = W/(L/D), NOT the
  // engine's max thrust. So size the cruise thrust from the airframe first:
  //   W = m·g = 62000·9.81 = 608220 N.
  //   T = D = W/(L/D) = 608220/17 = 35777.6 N (per the whole aircraft).
  // With two engines, each engine produces T_eng = 35777.6/2 = 17888.8 N.
  // Apply TSFC per engine, then total, then convert s → h:
  //   mdot_fuel,total = TSFC · T_total = 1.7e-5 · 35777.6 = 0.608219 kg/s.
  //   Per hour: 0.608219 · 3600 = 2189.6 kg/h ≈ 2190 kg/h.
  // (Number of engines cancels for total fuel flow; the trap is using a quoted
  // max/static thrust instead of the cruise thrust = drag.)
  {
    id: "ae_tsfc_fuel_flow",
    slug: "aero-tsfc-fuel-burn-rate",
    title: "Cruise Fuel Burn from TSFC and L/D",
    prompt:
      "A 62,000 kg twin-engine jet cruises in steady, level flight at a\n" +
      "lift-to-drag ratio of 17. Each engine's thrust-specific fuel consumption\n" +
      "(fuel mass flow per unit thrust) is 1.7e-5 kg/(N·s). Use g = 9.81 m/s^2.\n\n" +
      "Determine the aircraft's total fuel burn rate in this cruise condition.\n\n" +
      "Report the fuel burn in kg per hour, rounded to the nearest 10 kg/h.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["tsfc", "fuel-burn", "lift-to-drag", "propulsion"],
    skillAreas: ["propulsion", "aerodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 2190,
    tolerance: 25,
    unit: "kg/h",
    hints: [
      "The required cruise thrust is not a quoted max thrust; in steady level flight thrust equals drag, and drag = weight / (L/D).",
      "Total fuel flow = TSFC * total thrust. Because TSFC is per unit thrust, the number of engines cancels once you use the total cruise thrust.",
      "TSFC is given per second, so multiply the per-second fuel flow by 3600 to get kg/h.",
    ],
    solution:
      "**Governing principle — fuel flow follows the *required* cruise thrust, which equals drag.** Fuel burn is $\\dot m_{fuel} = \\text{TSFC} \\times T$, where $T$ is the thrust actually being produced in cruise. In steady level flight thrust equals drag, and drag relates to weight through the lift-to-drag ratio: $T = D = W/(L/D)$. Do not use a quoted max thrust.\n\n" +
      "**Step 1 — Weight:**\n" +
      "$$W = mg = 62000 \\times 9.81 = 608220\\ \\text{N}.$$\n\n" +
      "**Step 2 — Required total cruise thrust (= drag):**\n" +
      "$$T = D = \\frac{W}{L/D} = \\frac{608220}{17} = 35777.6\\ \\text{N}.$$\n\n" +
      "**Step 3 — Total fuel flow.** Because TSFC is per unit thrust, the number of engines cancels — apply it to the total thrust:\n" +
      "$$\\dot m_{fuel} = \\text{TSFC} \\times T = 1.7\\times10^{-5}\\ \\tfrac{\\text{kg}}{\\text{N·s}} \\times 35777.6\\ \\text{N} = 0.60822\\ \\text{kg/s}.$$\n\n" +
      "**Step 4 — Convert to per hour:**\n" +
      "$$\\dot m_{fuel} = 0.60822\\ \\tfrac{\\text{kg}}{\\text{s}} \\times 3600\\ \\tfrac{\\text{s}}{\\text{h}} = 2189.6\\ \\text{kg/h}.$$\n\n" +
      "**Key insight / trap:** The 'twin-engine' detail is a distractor — splitting the thrust between two engines and reapplying TSFC per engine gives the same total, since fuel flow is proportional to total thrust. The real trap is sizing thrust from anything other than drag = $W/(L/D)$.\n\n" +
      "**Final answer: $\\dot m_{fuel} \\approx 2190\\ \\text{kg/h}$.**\n",
  },
  // SOLUTION:
  // Static margin SM = (x_np − x_cg)/c; positive stability requires the CG ahead
  // of the neutral point. The required minimum static margin sets the most-aft
  // allowable CG:  x_cg,limit/c = x_np/c − SM_min = 0.42 − 0.12 = 0.30 (30% MAC).
  // As loaded the CG sits at 36% MAC, which is AFT of the 30% limit, so ballast
  // must shift the CG forward. The required forward shift, in % MAC, is the
  // difference between the loaded CG and the aft limit:
  //   Δx/c = 36% − 30% = 6.0% MAC.
  // (Trap: stopping at the 30% limit, or computing the loaded static margin of
  // 42−36 = 6% and confusing it with the required shift — here they coincide
  // numerically but answer the question actually asked: the forward shift.)
  {
    id: "ae_static_margin_cg",
    slug: "aero-cg-for-target-static-margin",
    title: "CG Shift to Meet a Static-Margin Requirement",
    prompt:
      "An aircraft's stick-fixed neutral point is at 42% of the mean aerodynamic\n" +
      "chord (MAC), and the design requires a minimum static margin of 12% MAC for\n" +
      "acceptable handling. As currently loaded, the center of gravity sits at 36%\n" +
      "MAC.\n\n" +
      "Determine how far forward (in percent of MAC) the center of gravity must be\n" +
      "moved by adding ballast to just satisfy the static-margin requirement.\n\n" +
      "Report the required forward CG shift in percent of MAC, rounded to 1\n" +
      "decimal place.",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 25,
    tags: ["static-stability", "neutral-point", "static-margin"],
    skillAreas: ["aerodynamics", "control-systems"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 6.0,
    tolerance: 0.3,
    unit: "percent MAC",
    hints: [
      "Static margin SM = (x_np - x_cg)/c, and stability needs the CG ahead of the neutral point. First find the most-aft CG allowed by the minimum static margin.",
      "Aft CG limit = x_np - SM_min = 42% - 12% MAC. Compare the loaded CG to this limit to see how much it must move.",
      "The answer is the forward shift = loaded CG minus the aft limit, not the limit itself.",
    ],
    solution:
      "**Governing principle — static margin measures longitudinal stability.** $SM = (x_{np} - x_{cg})/c$, the non-dimensional distance the CG sits *ahead* of the neutral point. Positive (stable) handling requires the CG forward of the neutral point; the design floor $SM_{min}$ fixes the *most-aft* CG that is still acceptable.\n\n" +
      "**Step 1 — Find the aft CG limit set by the minimum static margin.** Working in % MAC,\n" +
      "$$x_{cg,limit} = x_{np} - SM_{min} = 42\\% - 12\\% = 30\\%\\ \\text{MAC}.$$\n\n" +
      "**Step 2 — Compare the loaded CG to the limit.** As loaded, the CG is at 36% MAC, which is *aft* of the 30% limit (only 30% would give exactly the required margin). It is therefore too far aft and must be moved forward with ballast.\n\n" +
      "**Step 3 — Required forward shift:**\n" +
      "$$\\Delta x = x_{cg,loaded} - x_{cg,limit} = 36\\% - 30\\% = 6.0\\%\\ \\text{MAC}.$$\n\n" +
      "**Key insight / trap:** The question asks for the *shift*, not the limit. Don't stop at 30% MAC. Also, the loaded static margin happens to be $42\\% - 36\\% = 6\\%$ — numerically equal to the required shift here, but that is a coincidence of these numbers, not the same quantity; answer the question actually asked (the forward movement).\n\n" +
      "**Final answer: $\\Delta x \\approx 6.0\\%$ MAC.**\n",
  },
  // SOLUTION (concept): For a fixed effective exhaust velocity, the rocket
  // equation Δv = Ve·ln(m0/mf) shows Δv grows only with the LOG of the mass
  // ratio, while the structural/dry mass sits in mf. The correct judgment is that
  // doubling propellant does NOT double Δv (diminishing returns), and that
  // staging beats a single stage by shedding dead mass mid-flight so later stages
  // need not accelerate it. Distractors invert the log relationship or claim Δv
  // scales linearly with propellant.
  {
    id: "ae_rocket_equation_judgment",
    slug: "aero-rocket-equation-judgment",
    title: "Reasoning About the Rocket Equation",
    prompt:
      "A team is sizing a chemical rocket and considering whether to add\n" +
      "propellant to one stage or instead split the vehicle into two stages.\n\n" +
      "Using the ideal rocket equation, which statement is the most correct\n" +
      "engineering judgment?\n\n" +
      "Select the single best answer (a, b, c, or d).",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 28,
    tags: ["rocket-equation", "staging", "propulsion"],
    skillAreas: ["propulsion", "orbital-mechanics"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Because delta-v depends on the natural log of the mass ratio, adding propellant gives diminishing returns; staging helps by discarding spent tank and engine mass so later stages need not accelerate it.",
        correct: true,
      },
      {
        id: "b",
        label:
          "Delta-v is proportional to the propellant mass, so doubling the propellant in one stage simply doubles delta-v and is always preferable to staging.",
      },
      {
        id: "c",
        label:
          "Staging only adds complexity and dead mass; for the same exhaust velocity a single stage always achieves more delta-v than a multi-stage vehicle of equal liftoff mass.",
      },
      {
        id: "d",
        label:
          "Delta-v depends on the mass ratio raised to the exhaust velocity, so the dry/structural mass has no meaningful effect on the achievable delta-v.",
      },
    ],
    hints: [
      "Write down the ideal rocket equation and notice exactly where the mass ratio appears and which function wraps it.",
      "Because delta-v scales with the natural log of the mass ratio, equal increments of propellant give progressively smaller delta-v gains.",
      "Ask what staging physically removes mid-flight, and whether later stages still have to accelerate that mass.",
    ],
    solution:
      "**Governing principle — the ideal rocket equation, $\\Delta v = V_e \\ln(m_0/m_f)$.** Two structural facts drive the right judgment: (1) $\\Delta v$ grows with the *natural log* of the mass ratio, so returns diminish; and (2) the dry/structural mass sits in $m_f$, capping the achievable mass ratio. Staging beats a single stage by discarding that dead mass mid-flight.\n\n" +
      "**Why (a) is correct:** Since $\\Delta v \\propto \\ln(m_0/m_f)$, each additional kilogram of propellant raises $m_0/m_f$ by an ever-smaller *fraction*, so $\\Delta v$ gains shrink — diminishing returns. Staging sidesteps this: once a tank/engine is empty it is jettisoned, so the remaining stages no longer have to accelerate that spent structure, which raises the effective mass ratio of the later (high-$\\Delta v$) phase. This is precisely the standard rationale for multistage launchers.\n\n" +
      "**Why the distractors fail:**\n" +
      "- **(b)** claims $\\Delta v \\propto$ propellant mass (linear). False — the dependence is logarithmic, so doubling propellant adds far less than double the $\\Delta v$, and it ignores the structural mass needed to hold the extra propellant.\n" +
      "- **(c)** claims a single stage always beats staging. False — for the same exhaust velocity, shedding dead mass lets a staged vehicle reach a higher total $\\Delta v$ than a single stage of equal liftoff mass; that is why orbital launchers stage.\n" +
      "- **(d)** claims $\\Delta v$ depends on (mass ratio)$^{V_e}$ and that dry mass is irrelevant. False — it misreads the equation entirely; $V_e$ multiplies the log, and dry mass directly limits $m_f$ and therefore $\\Delta v$.\n\n" +
      "**Final answer: (a).**\n",
  },
  // SOLUTION (concept): At fixed altitude (fixed ρ) and fixed weight, the drag
  // polar D(V) = ½ρV²S·C_D0 + 2(W)²·k/(ρV²S) is U-shaped: parasite drag rises
  // with V² while induced drag falls as 1/V². The minimum total drag (hence
  // max range for a jet's L/D-driven case, and the speed for best L/D) occurs
  // where the two are equal. Below that speed you are on the "back side" of the
  // drag curve where flying slower needs MORE thrust. Correct answer captures
  // the U-shape and the equal-drag minimum; distractors claim monotonic behavior
  // or that minimum drag is at stall speed.
  {
    id: "ae_drag_curve_judgment",
    slug: "aero-drag-versus-speed-judgment",
    title: "Shape of the Thrust-Required Curve",
    prompt:
      "An aircraft holds a constant altitude and weight while its airspeed is\n" +
      "varied across its level-flight envelope.\n\n" +
      "Which statement best describes how the total drag (and thus thrust\n" +
      "required) varies with airspeed?\n\n" +
      "Select the single best answer (a, b, c, or d).",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 23,
    tags: ["drag", "thrust-required", "flight-mechanics"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Total drag is U-shaped in airspeed: induced drag dominates and falls at low speed while parasite drag rises at high speed, with minimum total drag where the two are equal.",
        correct: true,
      },
      {
        id: "b",
        label:
          "Total drag increases monotonically with airspeed because drag always grows with dynamic pressure.",
      },
      {
        id: "c",
        label:
          "Total drag decreases monotonically as airspeed increases, so the highest speed always needs the least thrust.",
      },
      {
        id: "d",
        label:
          "Minimum total drag occurs exactly at the stall speed, where the lift coefficient is largest.",
      },
    ],
    hints: [
      "Split total drag into two pieces and ask how each depends on airspeed at fixed altitude and weight.",
      "Parasite drag grows with dynamic pressure (roughly V^2), while induced drag falls as 1/V^2 because less C_L is needed at higher speed.",
      "Adding a rising curve and a falling curve gives a U shape; the minimum is where the two contributions are equal, well above stall speed.",
    ],
    solution:
      "**Governing principle — total drag is the sum of two competing terms.** At fixed altitude ($\\rho$) and weight, write $D(V) = \\underbrace{\\tfrac12\\rho V^2 S\\,C_{D0}}_{\\text{parasite}} + \\underbrace{\\dfrac{2W^2 k}{\\rho V^2 S}}_{\\text{induced}}$. Parasite drag grows as $V^2$; induced drag falls as $1/V^2$ (because at higher speed less $C_L$ is needed to hold weight). One rises, one falls.\n\n" +
      "**Why (a) is correct:** Summing a rising $V^2$ term and a falling $1/V^2$ term produces a U-shaped (bucket) curve. At low speed the induced term dominates and the curve is high; at high speed parasite dominates and it rises again. The minimum total drag — equivalently the minimum thrust required, and the speed for best $L/D$ — occurs exactly where the two contributions are equal, well above stall speed. Below the minimum-drag speed the aircraft is on the 'back side' of the drag curve, where flying *slower* paradoxically needs *more* thrust.\n\n" +
      "**Why the distractors fail:**\n" +
      "- **(b)** 'monotonically increasing' ignores induced drag, which dominates and *falls* at low speed; drag does not simply track dynamic pressure.\n" +
      "- **(c)** 'monotonically decreasing' is the opposite error — it ignores parasite drag rising at high speed, and would imply top speed needs the least thrust, which is false.\n" +
      "- **(d)** places minimum drag at stall speed. False — at stall $C_L$ (hence induced drag) is *maximal*, so drag is high there; the minimum sits at a higher speed where parasite and induced drag balance.\n\n" +
      "**Final answer: (a).**\n",
  },
  // SOLUTION (concept): Beyond the critical angle of attack the boundary layer
  // separates from the upper surface, C_L falls from C_Lmax, and lift drops —
  // this is stall, an angle-of-attack phenomenon, not a fixed-speed one. Stall
  // speed merely corresponds to reaching C_Lmax in 1-g level flight; an aircraft
  // can stall at any airspeed (e.g., in a high-g maneuver) by exceeding the
  // critical AoA. Correct answer ties stall to critical AoA and flow separation.
  {
    id: "ae_stall_concept",
    slug: "aero-stall-angle-of-attack-concept",
    title: "What Actually Defines Aerodynamic Stall",
    prompt:
      "A wing is pitched to progressively higher angles of attack while a pilot\n" +
      "observes lift behavior in various maneuvers.\n\n" +
      "Which statement correctly characterizes aerodynamic stall?\n\n" +
      "Select the single best answer (a, b, c, or d).",
    discipline: "AEROSPACE",
    difficulty: "MEDIUM",
    eloWeight: 20,
    tags: ["stall", "angle-of-attack", "aerodynamics"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Stall is fundamentally an angle-of-attack phenomenon: beyond the critical AoA the flow separates from the upper surface and C_L drops from C_Lmax, so a wing can stall at any airspeed.",
        correct: true,
      },
      {
        id: "b",
        label:
          "Stall occurs only when airspeed drops below one fixed number, independent of angle of attack or load factor.",
      },
      {
        id: "c",
        label:
          "Past the critical angle of attack the lift coefficient continues to rise without limit, which is what makes recovery difficult.",
      },
      {
        id: "d",
        label:
          "Stall is caused by the wing locally exceeding the speed of sound and forming a shock wave.",
      },
    ],
    hints: [
      "Ask what physical variable the lift coefficient depends on at low Mach: airspeed, or angle of attack?",
      "Beyond a critical angle of attack the boundary layer separates from the upper surface and C_L drops from its peak (C_Lmax).",
      "Stall speed is just the 1-g speed at which C_Lmax is reached; in a high-g maneuver the wing can reach the critical AoA, and stall, at a higher airspeed.",
    ],
    solution:
      "**Governing principle — stall is governed by angle of attack, not airspeed.** At low Mach the lift coefficient is essentially a function of angle of attack: $C_L$ rises with AoA up to a peak $C_{Lmax}$ at the critical angle of attack. Beyond that angle the boundary layer separates from the upper surface, $C_L$ drops, and lift falls — that is stall.\n\n" +
      "**Why (a) is correct:** Stall is fundamentally an AoA phenomenon. Past the critical AoA the upper-surface flow separates and $C_L$ drops from $C_{Lmax}$, regardless of how fast the aircraft is going. So a wing can stall at *any* airspeed — most famously in an accelerated (high-g) turn, where the high required $C_L$ pushes the wing past the critical AoA even though the airspeed is well above the 1-g stall speed.\n\n" +
      "**Why the distractors fail:**\n" +
      "- **(b)** ties stall to one fixed airspeed independent of AoA/load factor. False — the published stall *speed* is only the 1-g condition; raise the load factor and the wing stalls at a higher speed.\n" +
      "- **(c)** says $C_L$ keeps rising past the critical AoA. False — that contradicts the definition of stall; $C_L$ *drops* after $C_{Lmax}$ as the flow separates.\n" +
      "- **(d)** attributes stall to local supersonic flow and a shock. That describes shock-induced separation / 'shock stall' at high Mach, not the low-speed aerodynamic stall this question is about.\n\n" +
      "**Final answer: (a).**\n",
  },
  // SOLUTION:
  // The design must stall no faster than a target approach reference, so size the
  // wing from the 1-g stall condition: V_stall = sqrt(2·W / (ρ·S·C_Lmax)).
  // Solving for area: S = 2·m·g / (ρ·V_stall²·C_Lmax).
  //   S = 2·950·9.81 / (1.225·28² ·1.6) = 18639 / (1.225·784·1.6)
  //     = 18639 / 1536.6 = 12.13 m^2.
  {
    id: "ae_stall_speed_wing_area",
    slug: "aero-wing-area-from-stall-speed",
    title: "Sizing Wing Area to a Stall-Speed Target",
    prompt:
      "A 950 kg aircraft is being sized so that its 1-g stall speed at sea level\n" +
      "(air density 1.225 kg/m^3) does not exceed 28 m/s. The high-lift system\n" +
      "delivers a maximum lift coefficient of 1.6.\n\n" +
      "Determine the minimum wing planform area required to meet this\n" +
      "stall-speed limit.\n\n" +
      "Report the wing area in m^2, rounded to 1 decimal place.",
    discipline: "AEROSPACE",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["stall-speed", "wing-sizing", "high-lift"],
    skillAreas: ["aerodynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 12.1,
    tolerance: 0.2,
    unit: "m^2",
    hints: [
      "At the 1-g stall, lift equals weight while the wing is at C_Lmax: W = (1/2)*rho*V_stall^2*S*C_Lmax.",
      "The unknown is the area, so solve the lift equation for S = 2*m*g / (rho*V_stall^2*C_Lmax).",
      "A faster allowable stall speed would need a smaller wing, so a larger required V_stall lowers S; here the limit gives the MINIMUM acceptable area.",
    ],
    solution:
      "**Governing principle — the 1-g stall condition sizes the wing.** At the stall, the wing is at its maximum lift coefficient $C_{Lmax}$, and in 1-g level flight lift equals weight: $W = \\tfrac12\\rho V_{stall}^2 S\\,C_{Lmax}$. To stall no faster than the target $V_{stall}$, solve this for the area.\n\n" +
      "**Step 1 — Solve the stall lift equation for area:**\n" +
      "$$S = \\frac{2mg}{\\rho\\,V_{stall}^2\\,C_{Lmax}}.$$\n\n" +
      "**Step 2 — Substitute with units:**\n" +
      "$$S = \\frac{2 \\times 950 \\times 9.81}{1.225 \\times 28^2 \\times 1.6} = \\frac{18639}{1.225 \\times 784 \\times 1.6}.$$\n\n" +
      "**Step 3 — Arithmetic.** Denominator: $1.225 \\times 784 \\times 1.6 = 1536.6$.\n" +
      "$$S = \\frac{18639}{1536.6} = 12.13\\ \\text{m}^2.$$\n\n" +
      "**Key insight / trap:** A larger wing stalls *slower* (more area at fixed $C_{Lmax}$ lowers $V_{stall}$). So the stall-speed *ceiling* sets the *minimum* allowable area — any smaller and the stall speed exceeds 28 m/s. Use $C_{Lmax}$ (flaps deployed), not a cruise $C_L$.\n\n" +
      "**Final answer: $S \\approx 12.1\\ \\text{m}^2$.**\n",
  },
  // SOLUTION:
  // Single-burn Δv with a given mass ratio: Δv = Isp·g0·ln(m0/mf).
  // To reach a target Δv we need the mass ratio m0/mf = exp(Δv/(Isp·g0)).
  //   Ve = Isp·g0 = 320·9.81 = 3139.2 m/s.
  //   m0/mf = exp(9300 / 3139.2) = exp(2.9625) = 19.35.
  // So nearly 95% of liftoff mass must be propellant — illustrates why a single
  // stage struggles to reach orbital Δv.
  {
    id: "ae_mass_ratio_for_dv",
    slug: "aero-mass-ratio-for-orbital-dv",
    title: "Mass Ratio Needed for Orbital Delta-v",
    prompt:
      "A single rocket stage with a specific impulse of 320 s must deliver an\n" +
      "ideal velocity change of 9300 m/s (a representative orbital delta-v budget\n" +
      "including losses). Use g0 = 9.81 m/s^2.\n\n" +
      "Determine the required mass ratio (initial wet mass divided by final dry\n" +
      "mass) for a single stage to achieve this delta-v.\n\n" +
      "Report the dimensionless mass ratio rounded to 1 decimal place.",
    discipline: "AEROSPACE",
    difficulty: "EXPERT",
    eloWeight: 35,
    tags: ["rocket-equation", "mass-ratio", "ssto", "propulsion"],
    skillAreas: ["propulsion"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 19.3,
    tolerance: 0.3,
    unit: "dimensionless",
    hints: [
      "Start from dv = Ve*ln(m0/mf), with effective exhaust velocity Ve = Isp*g0, and solve for the mass ratio m0/mf.",
      "Invert the log: m0/mf = exp(dv / (Isp*g0)). Compute Ve first, then the exponent.",
      "The result implies ~95% of liftoff mass is propellant, which is why a single stage to orbit is so hard. Keep the mass ratio dimensionless.",
    ],
    solution:
      "**Governing principle — invert the Tsiolkovsky rocket equation.** $\\Delta v = V_e \\ln(m_0/m_f)$ with effective exhaust velocity $V_e = I_{sp}\\,g_0$. To find the mass ratio that achieves a target $\\Delta v$, solve for $m_0/m_f$ by exponentiating.\n\n" +
      "**Step 1 — Effective exhaust velocity:**\n" +
      "$$V_e = I_{sp}\\,g_0 = 320\\ \\text{s} \\times 9.81\\ \\text{m/s}^2 = 3139.2\\ \\text{m/s}.$$\n\n" +
      "**Step 2 — Rearrange and exponentiate:**\n" +
      "$$\\frac{m_0}{m_f} = \\exp\\!\\left(\\frac{\\Delta v}{V_e}\\right) = \\exp\\!\\left(\\frac{9300}{3139.2}\\right) = \\exp(2.9625).$$\n\n" +
      "**Step 3 — Evaluate:**\n" +
      "$$\\frac{m_0}{m_f} = e^{2.9625} = 19.35.$$\n\n" +
      "**Key insight / trap:** A mass ratio of ~19.3 means the dry mass (structure + payload) is only $1/19.35 \\approx 5\\%$ of liftoff mass — i.e. ~95% must be propellant. No realistic structure achieves this for chemical rockets, which is exactly why single-stage-to-orbit is so hard and why launchers stage. Keep the ratio dimensionless ($g_0$ cancels the $I_{sp}$ time units inside the exponent).\n\n" +
      "**Final answer: $m_0/m_f \\approx 19.3$ (dimensionless).**\n",
  },
];
