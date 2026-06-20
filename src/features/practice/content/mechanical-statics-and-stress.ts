import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION: Net section is the gross area minus the bolt hole at the critical plane.
  //   Gross area A_g = w·t = 50 mm · 8 mm = 400 mm². Hole removes (d_hole·t) = 11·8 = 88 mm².
  //   Net area A_net = 400 − 88 = 312 mm² = 312e-6 m².
  //   The bar must carry F at the net section without yielding: σ = F / A_net ≤ σ_y.
  //   F_max = σ_y · A_net = 250e6 Pa · 312e-6 m² = 78,000 N = 78.0 kN.
  //   Re-derive: 250 · 312 = 78,000 N → 78.0 kN. Match.
  {
    id: "ms_axial_stress_rod",
    slug: "statics-axial-stress-round-rod",
    title: "Bolted Tie Bar: Maximum Service Load",
    prompt:
      "A flat steel tie bar (width 50 mm, thickness 8 mm, yield strength\n" +
      "250 MPa) is connected at one end through a single bolt that passes\n" +
      "through an 11 mm diameter drilled hole. The bar is loaded in pure\n" +
      "tension along its axis.\n\n" +
      "You must specify the largest steady tensile load the bar can carry\n" +
      "without the material reaching yield. Consider where the bar is weakest.\n\n" +
      "Report the maximum load in kN, rounded to 1 decimal place.",
    discipline: "MECHANICAL",
    difficulty: "EASY",
    eloWeight: 14,
    tags: ["axial-stress", "net-section", "statics"],
    skillAreas: ["statics", "mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 78.0,
    tolerance: 0.8,
    unit: "kN",
    hints: [
      "Yielding will start wherever the cross-sectional area resisting the load is smallest. Ask yourself which plane through the bar carries the same force on the least material.",
      "The drilled hole removes material right where the full tension still has to pass through; that reduced 'net' cross-section, not the full bar, governs.",
      "Find the net area by subtracting the hole's footprint (hole diameter times thickness) from the gross area, then set the average stress on that area equal to the yield strength to back out the load. Watch your unit conversions (mm to m, Pa to kN).",
    ],
    solution:
      "**Governing principle — yield on the net (smallest) cross-section.** A tension member is limited by the plane that carries the full load on the least material. The bolt hole removes material exactly where the entire tension force must still pass, so the *net section at the hole* governs, not the gross bar. Average normal stress there is $\\sigma = F/A_{net}$, and yielding begins when $\\sigma = \\sigma_y$.\n\n" +
      "**Step 1 — Gross area.** $A_g = w\\,t = 50\\text{ mm} \\times 8\\text{ mm} = 400\\text{ mm}^2$.\n\n" +
      "**Step 2 — Subtract the hole.** The hole removes a strip of width $d_{hole}$ across the thickness: $A_{hole} = d_{hole}\\,t = 11\\text{ mm} \\times 8\\text{ mm} = 88\\text{ mm}^2$.\n\n" +
      "**Step 3 — Net area.** $A_{net} = 400 - 88 = 312\\text{ mm}^2 = 312\\times10^{-6}\\text{ m}^2$.\n\n" +
      "**Step 4 — Set stress to yield and solve for load.**\n" +
      "$$F_{max} = \\sigma_y\\,A_{net} = (250\\times10^6\\text{ Pa})(312\\times10^{-6}\\text{ m}^2) = 78{,}000\\text{ N}.$$\n\n" +
      "**Key trap:** using the gross 400 mm² would overstate capacity by ~28%. Always reduce for the hole on an axially loaded plate. Convert 78,000 N $\\to$ 78.0 kN.\n\n" +
      "**Final answer: $F_{max} = 78.0\\text{ kN}$.**",
  },
  // SOLUTION: Beam A (pin) at x=0, B (roller) at x=6 m. Loads: P1=12 kN down at a1=2 m,
  //   UDL w=3 kN/m over the full 6 m → resultant W = 3·6 = 18 kN at centroid x=3 m.
  //   ΣM_A = 0 (CCW +): R_B·6 − 12·2 − 18·3 = 0 → R_B·6 = 24 + 54 = 78 → R_B = 13 kN.
  //   Check ΣFy: R_A + R_B = 12 + 18 = 30 → R_A = 17 kN. Question asks R_A.
  //   Re-derive R_A via ΣM_B = 0: R_A·6 − 12·(6−2) − 18·(6−3) = 0 → R_A·6 = 48 + 54 = 102
  //   → R_A = 17.0 kN. Match.
  {
    id: "ms_ss_beam_reactions",
    slug: "statics-simply-supported-point-load-reaction",
    title: "Combined Loading: Support Reaction",
    prompt:
      "A 6 m simply-supported beam has a pin at its left end (A) and a roller\n" +
      "at its right end (B). It carries a downward 12 kN concentrated load\n" +
      "located 2 m from A, plus a uniformly distributed load of 3 kN/m acting\n" +
      "over the beam's entire length.\n\n" +
      "Determine the vertical reaction at support A.\n\n" +
      "Report the reaction in kN, rounded to 1 decimal place.",
    discipline: "MECHANICAL",
    difficulty: "EASY",
    eloWeight: 16,
    tags: ["reactions", "beam", "distributed-load", "statics"],
    skillAreas: ["statics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 17.0,
    tolerance: 0.2,
    unit: "kN",
    hints: [
      "Treat the whole beam as one rigid body in equilibrium: the two support reactions must balance every applied load.",
      "Replace the distributed load with a single equivalent resultant force acting at its centroid before writing any equilibrium equation.",
      "Take moments about the support you are NOT solving for (the roller at B) so that reaction drops out, then solve directly for the reaction at A. Keep a consistent sign convention.",
    ],
    solution:
      "**Governing principle — static equilibrium of a rigid body.** A simply-supported beam is statically determinate: the two unknown reactions are found from $\\sum M = 0$ and $\\sum F_y = 0$. The trick is to take moments about one support so its (unknown) reaction has zero lever arm and drops out.\n\n" +
      "**Step 1 — Replace the distributed load with its resultant.** The UDL $w = 3\\text{ kN/m}$ over the full $6\\text{ m}$ has resultant $W = wL = 3\\times6 = 18\\text{ kN}$, acting at the centroid, $x = 3\\text{ m}$ from A.\n\n" +
      "**Step 2 — Take moments about B to isolate $R_A$.** With A at $x=0$ and B at $x=6\\text{ m}$, lever arms are measured from B (CCW positive):\n" +
      "$$\\sum M_B = 0:\\quad R_A(6) - 12(6-2) - 18(6-3) = 0.$$\n\n" +
      "**Step 3 — Carry the arithmetic.**\n" +
      "$$R_A(6) = 12(4) + 18(3) = 48 + 54 = 102 \\;\\Rightarrow\\; R_A = \\frac{102}{6} = 17\\text{ kN}.$$\n\n" +
      "**Step 4 — Check with $\\sum F_y$.** Total downward load $= 12 + 18 = 30\\text{ kN}$, so $R_B = 30 - 17 = 13\\text{ kN}$; moments about A confirm $R_B(6) = 12(2)+18(3)=78 \\Rightarrow R_B = 13$. Consistent.\n\n" +
      "**Key insight:** lump the UDL into a point resultant *before* writing equilibrium, and moment about the far support to get one reaction in a single equation.\n\n" +
      "**Final answer: $R_A = 17.0\\text{ kN}$.**",
  },
  // SOLUTION: Overhanging cantilever fixed at wall (left), free length L=3 m with
  //   UDL w=4 kN/m, PLUS a downward tip point load P=5 kN at the free end (x=3 m).
  //   Max bending moment magnitude is at the fixed support.
  //   M_fixed = w·L²/2 + P·L = 4·(3²)/2 + 5·3 = 4·9/2 + 15 = 18 + 15 = 33 kN·m.
  //   Re-derive: UDL resultant = 4·3 = 12 kN at 1.5 m → moment 12·1.5 = 18; tip 5·3 = 15;
  //   sum = 33 kN·m. Match.
  {
    id: "ms_cantilever_udl_moment",
    slug: "statics-cantilever-udl-max-moment",
    title: "Cantilever With Tip Load: Wall Moment",
    prompt:
      "A 3 m cantilever beam is rigidly built into a wall at its left end and\n" +
      "free at the right end. It supports a uniformly distributed load of\n" +
      "4 kN/m along its full length and, in addition, a downward concentrated\n" +
      "load of 5 kN applied at the free tip.\n\n" +
      "Find the magnitude of the largest internal bending moment in the beam,\n" +
      "and state where it occurs by computing its value.\n\n" +
      "Report the maximum bending moment in kN·m, rounded to the nearest\n" +
      "whole number.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["bending-moment", "cantilever", "distributed-load"],
    skillAreas: ["statics", "mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 33,
    tolerance: 1,
    unit: "kN·m",
    hints: [
      "For a cantilever, the internal bending moment grows steadily toward the fixed end; think about where the most material 'lever arm' acts against the support.",
      "The fixed wall must react the moment of every load about that section. Both the distributed load and the tip load contribute, each with its own lever arm.",
      "Sum the moment of the distributed load (its resultant acting at its centroid) and the moment of the tip load, both taken about the built-in section, and add their magnitudes.",
    ],
    solution:
      "**Governing principle — the fixed end reacts the total moment of all loads.** On a cantilever the internal bending moment grows monotonically toward the wall, because every load to the right of a section contributes its force times an ever-increasing lever arm. So the maximum bending moment occurs *at the built-in support*, and equals the sum of the moments of all applied loads about that section.\n\n" +
      "**Step 1 — Moment from the distributed load.** The UDL $w = 4\\text{ kN/m}$ over $L = 3\\text{ m}$ has resultant $W = wL = 4\\times3 = 12\\text{ kN}$ acting at its centroid, $1.5\\text{ m}$ from the wall:\n" +
      "$$M_{UDL} = W\\times1.5 = \\frac{wL^2}{2} = \\frac{4(3)^2}{2} = 18\\text{ kN·m}.$$\n\n" +
      "**Step 2 — Moment from the tip load.** $P = 5\\text{ kN}$ acts at the free end, lever arm $L = 3\\text{ m}$:\n" +
      "$$M_P = P L = 5\\times3 = 15\\text{ kN·m}.$$\n\n" +
      "**Step 3 — Sum at the fixed end.** Both loads sag the cantilever the same way, so their magnitudes add:\n" +
      "$$M_{max} = M_{UDL} + M_P = 18 + 15 = 33\\text{ kN·m}.$$\n\n" +
      "**Key insight:** the UDL's lever arm is to its centroid ($L/2$), giving the $wL^2/2$ term — a common slip is to use the full length $L$ for the distributed load.\n\n" +
      "**Final answer: $M_{max} = 33\\text{ kN·m}$ at the fixed support.**",
  },
  // SOLUTION: Simply-supported beam, span L=4 m, central point load P=20 kN.
  //   Max moment at midspan: M = P·L/4 = 20·4/4 = 20 kN·m = 20e3 N·m.
  //   Rectangular section b=50 mm, h=100 mm (strong axis): I = b·h³/12
  //     = 0.050·(0.100)³/12 = 0.050·1e-3/12 = 5e-5/12 = 4.1667e-6 m⁴.
  //   c = h/2 = 0.050 m. σ = M·c/I = 20e3·0.050 / 4.1667e-6 = 1000 / 4.1667e-6
  //     = 2.40e8 Pa = 240 MPa.
  //   Re-derive with formula σ = 6M/(b·h²) = 6·20e3 / (0.050·0.100²) = 120e3 / (5e-4)
  //     = 2.40e8 Pa = 240 MPa. Match.
  {
    id: "ms_bending_stress_rect",
    slug: "statics-bending-stress-rectangular-section",
    title: "Flexural Stress From a Loaded Span",
    prompt:
      "A simply-supported beam spans 4 m and carries a single 20 kN load at\n" +
      "midspan (neglect self-weight). Its cross-section is a solid rectangle,\n" +
      "50 mm wide and 100 mm deep, oriented for bending about the strong\n" +
      "(horizontal) axis.\n\n" +
      "Determine the peak flexural stress in the beam. You will need to find\n" +
      "the critical bending moment before sizing the stress.\n\n" +
      "Report the maximum bending stress in MPa, rounded to the nearest whole\n" +
      "number.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["bending-stress", "section-properties", "beam"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 240,
    tolerance: 3,
    unit: "MPa",
    hints: [
      "Flexural stress depends on the internal bending moment and the section's resistance to bending, so first find where and how large the moment is.",
      "For a central point load on a simple span, the moment peaks at midspan; the section's resistance comes from its second moment of area and the distance to the extreme fiber.",
      "Compute the maximum moment, then the rectangular section's bending resistance, and combine them so the extreme-fiber stress falls out. Keep all lengths in metres for consistent Pa, then convert to MPa.",
    ],
    solution:
      "**Governing principle — the flexure formula $\\sigma = Mc/I$.** Bending stress varies linearly across the depth and is maximum at the extreme fiber (distance $c$ from the neutral axis). The peak occurs where the bending moment is largest, so we first find $M_{max}$, then the section's $I$, then combine.\n\n" +
      "**Step 1 — Maximum bending moment.** A central point load $P$ on a simple span $L$ peaks at midspan:\n" +
      "$$M_{max} = \\frac{PL}{4} = \\frac{20\\text{ kN}\\times4\\text{ m}}{4} = 20\\text{ kN·m} = 20\\times10^3\\text{ N·m}.$$\n\n" +
      "**Step 2 — Section properties (strong axis, depth $h=100$ mm).**\n" +
      "$$I = \\frac{bh^3}{12} = \\frac{0.050\\,(0.100)^3}{12} = \\frac{5\\times10^{-5}}{12} = 4.167\\times10^{-6}\\text{ m}^4,\\quad c = \\frac{h}{2} = 0.050\\text{ m}.$$\n\n" +
      "**Step 3 — Extreme-fiber stress.**\n" +
      "$$\\sigma = \\frac{Mc}{I} = \\frac{(20\\times10^3)(0.050)}{4.167\\times10^{-6}} = \\frac{1000}{4.167\\times10^{-6}} = 2.40\\times10^8\\text{ Pa} = 240\\text{ MPa}.$$\n\n" +
      "**Quick check — section modulus shortcut.** For a rectangle, $\\sigma = \\dfrac{6M}{bh^2} = \\dfrac{6(20\\times10^3)}{0.050(0.100)^2} = \\dfrac{1.2\\times10^5}{5\\times10^{-4}} = 240\\text{ MPa}$. Agrees.\n\n" +
      "**Key trap:** depth is cubed in $I$, so orienting the section the 'strong' way (large $h$) matters enormously; also keep all lengths in metres so the result lands in Pa.\n\n" +
      "**Final answer: $\\sigma_{max} = 240\\text{ MPa}$.**",
  },
  // SOLUTION: Solid shaft, power P=15 kW at N=1500 rpm → angular speed ω = 2πN/60
  //   = 2π·1500/60 = 157.08 rad/s. Torque T = P/ω = 15000/157.08 = 95.49 N·m.
  //   Diameter D=40 mm → r=0.020 m. J = π·D⁴/32 = π·(0.040)⁴/32
  //     = π·2.56e-6/32 = π·8.0e-8 = 2.5133e-7 m⁴.
  //   τ_max = T·r/J = 95.49·0.020 / 2.5133e-7 = 1.9099 / 2.5133e-7 = 7.599e6 Pa
  //     = 7.60 MPa.
  //   Re-derive via τ = 16T/(πD³) = 16·95.49 / (π·0.040³) = 1527.9 / (π·6.4e-5)
  //     = 1527.9 / 2.0106e-4 = 7.599e6 Pa = 7.6 MPa. Match.
  {
    id: "ms_torsion_solid_shaft",
    slug: "statics-torsion-solid-shaft-shear-stress",
    title: "Power Transmission Shaft: Shear Stress",
    prompt:
      "A solid circular steel shaft, 40 mm in diameter, transmits 15 kW of\n" +
      "power while rotating at 1500 rev/min.\n\n" +
      "Determine the maximum torsional shear stress developed in the shaft\n" +
      "under this steady operating condition. Begin by relating the\n" +
      "transmitted power and speed to the working torque.\n\n" +
      "Report the maximum shear stress in MPa, rounded to 1 decimal place.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["torsion", "shear-stress", "shaft", "power"],
    skillAreas: ["mechanics-of-materials", "dynamics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 7.6,
    tolerance: 0.2,
    unit: "MPa",
    hints: [
      "Power, rotational speed, and torque are linked through the shaft's angular velocity; you cannot get stress until you know the torque it actually carries.",
      "Convert rev/min to rad/s, then the torque is the power divided by that angular speed.",
      "With the torque known, relate it to the surface shear stress of a solid circular section using its polar geometry and outer radius. Keep diameter in metres and power in watts.",
    ],
    solution:
      "**Governing principle — power = torque × angular speed, then torsion formula $\\tau = Tr/J$.** A shaft transmits power as the product of the torque it carries and how fast it spins: $P = T\\omega$. You cannot find stress until you know the actual torque. Once $T$ is known, the elastic torsion formula gives the surface shear stress of a circular shaft, maximum at the outer radius.\n\n" +
      "**Step 1 — Angular speed.** Convert rev/min to rad/s:\n" +
      "$$\\omega = \\frac{2\\pi N}{60} = \\frac{2\\pi(1500)}{60} = 157.08\\text{ rad/s}.$$\n\n" +
      "**Step 2 — Working torque.** With $P = 15\\text{ kW} = 15{,}000\\text{ W}$:\n" +
      "$$T = \\frac{P}{\\omega} = \\frac{15000}{157.08} = 95.49\\text{ N·m}.$$\n\n" +
      "**Step 3 — Polar second moment ($D = 40\\text{ mm} = 0.040\\text{ m}$).**\n" +
      "$$J = \\frac{\\pi D^4}{32} = \\frac{\\pi(0.040)^4}{32} = 2.513\\times10^{-7}\\text{ m}^4,\\quad r = \\frac{D}{2} = 0.020\\text{ m}.$$\n\n" +
      "**Step 4 — Maximum shear stress.**\n" +
      "$$\\tau_{max} = \\frac{T r}{J} = \\frac{95.49(0.020)}{2.513\\times10^{-7}} = 7.60\\times10^6\\text{ Pa} = 7.6\\text{ MPa}.$$\n\n" +
      "**Quick check:** $\\tau = \\dfrac{16T}{\\pi D^3} = \\dfrac{16(95.49)}{\\pi(0.040)^3} = 7.60\\times10^6\\text{ Pa}$. Agrees.\n\n" +
      "**Key trap:** forgetting the $2\\pi/60$ conversion (using rpm directly) throws the torque off by a factor of ~9.5. Power must be in watts and length in metres.\n\n" +
      "**Final answer: $\\tau_{max} = 7.6\\text{ MPa}$.**",
  },
  // SOLUTION: Bar between rigid walls, but with a gap. If fully restrained heated by ΔT,
  //   free expansion δ_free = α·L·ΔT. A clearance gap g is provided, so only the
  //   expansion BEYOND the gap is restrained → effective restrained strain.
  //   Steel: E=200 GPa, α=12e-6/°C, L=2 m=2000 mm, ΔT=60 °C, gap g=0.5 mm.
  //   δ_free = 12e-6·2000·60 = 1.44 mm. Restrained part Δ = δ_free − g = 1.44 − 0.5
  //     = 0.94 mm. Strain ε = Δ/L = 0.94/2000 = 4.70e-4.
  //   σ = E·ε = 200e9·4.70e-4 = 9.40e7 Pa = 94.0 MPa (compressive).
  //   Re-derive: σ = E(α·ΔT − g/L) = 200e9·(12e-6·60 − 0.5/2000)
  //     = 200e9·(7.2e-4 − 2.5e-4) = 200e9·4.7e-4 = 94.0 MPa. Match.
  {
    id: "ms_thermal_stress_steel",
    slug: "statics-thermal-stress-restrained-bar",
    title: "Thermal Stress With an Expansion Gap",
    prompt:
      "A 2 m long steel bar is installed between two rigid abutments with a\n" +
      "0.5 mm clearance gap left at one end. The bar is then heated uniformly\n" +
      "by 60 °C. Steel properties: E = 200 GPa, α = 12·10⁻⁶ /°C.\n\n" +
      "Determine the magnitude of the axial stress induced in the bar after\n" +
      "heating. Think carefully about how much of the thermal growth is\n" +
      "actually prevented.\n\n" +
      "Report the stress magnitude in MPa, rounded to the nearest whole\n" +
      "number.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 27,
    tags: ["thermal-stress", "axial", "constraint"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 94,
    tolerance: 2,
    unit: "MPa",
    hints: [
      "Stress only develops once the bar is actually being prevented from expanding. Picture how far the bar wants to grow versus how far it is free to move.",
      "First compute the unrestrained thermal growth; the abutments only resist the portion of that growth that exceeds the clearance gap.",
      "Convert the restrained shortening into a strain by dividing by the bar length, then multiply by the modulus to get the stress. The gap reduces the effective strain.",
    ],
    solution:
      "**Governing principle — stress comes only from *prevented* deformation.** A free bar heated by $\\Delta T$ expands stress-free. Stress appears only to the extent the abutments stop that growth. With a clearance gap, the first $g$ of expansion is free; only the expansion *beyond* the gap is restrained, producing a compressive strain and stress $\\sigma = E\\varepsilon$.\n\n" +
      "**Step 1 — Free thermal expansion.**\n" +
      "$$\\delta_{free} = \\alpha L \\Delta T = (12\\times10^{-6})(2000\\text{ mm})(60) = 1.44\\text{ mm}.$$\n\n" +
      "**Step 2 — Restrained portion (subtract the gap).** The bar grows 1.44 mm but is allowed 0.5 mm of free travel:\n" +
      "$$\\Delta = \\delta_{free} - g = 1.44 - 0.5 = 0.94\\text{ mm}.$$\n\n" +
      "**Step 3 — Restrained strain.**\n" +
      "$$\\varepsilon = \\frac{\\Delta}{L} = \\frac{0.94}{2000} = 4.70\\times10^{-4}.$$\n\n" +
      "**Step 4 — Stress from Hooke's law.**\n" +
      "$$\\sigma = E\\varepsilon = (200\\times10^9)(4.70\\times10^{-4}) = 9.40\\times10^7\\text{ Pa} = 94\\text{ MPa (compressive)}.$$\n\n" +
      "**Compact form:** $\\sigma = E\\!\\left(\\alpha\\Delta T - \\dfrac{g}{L}\\right) = 200\\times10^9(7.2\\times10^{-4} - 2.5\\times10^{-4}) = 94\\text{ MPa}$.\n\n" +
      "**Key trap:** ignoring the gap gives $\\sigma = E\\alpha\\Delta T = 144\\text{ MPa}$ — far too high. The gap consumes part of the thermal growth and must be subtracted first.\n\n" +
      "**Final answer: $\\sigma = 94\\text{ MPa}$ (compression).**",
  },
  // SOLUTION: Plane stress σx=80, σy=20, τxy=30 MPa. Max in-plane shear stress:
  //   τ_max = √[ ((σx−σy)/2)² + τxy² ] = √[ (30)² + (30)² ] = √(900+900) = √1800
  //     = 42.43 MPa.
  //   (Note: principal stresses are σ_avg ± τ_max = 50 ± 42.43.) Question asks τ_max.
  //   Re-derive: (σx−σy)/2 = (80−20)/2 = 30; 30²+30² = 1800; √1800 = 42.426 MPa.
  //   Match → 42.4 MPa.
  {
    id: "ms_mohr_principal_stress",
    slug: "statics-mohr-principal-stress",
    title: "Maximum In-Plane Shear at a Point",
    prompt:
      "Strain-gauge analysis of a loaded bracket gives the plane-stress state\n" +
      "at a critical point as σx = 80 MPa, σy = 20 MPa, and τxy = 30 MPa.\n\n" +
      "A ductile material is being checked against shear failure, so you need\n" +
      "the maximum in-plane shear stress at this point.\n\n" +
      "Report the maximum in-plane shear stress in MPa, rounded to 1 decimal\n" +
      "place.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["mohrs-circle", "shear-stress", "plane-stress"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 42.4,
    tolerance: 0.5,
    unit: "MPa",
    hints: [
      "Visualize the stress state on Mohr's circle; the maximum in-plane shear corresponds to the circle's radius.",
      "The radius is built from how far the normal stresses are spread apart and how much shear is present — both contribute to the circle's size.",
      "Combine half the difference of the two normal stresses with the shear stress as the legs of a right triangle; the hypotenuse is the maximum in-plane shear.",
    ],
    solution:
      "**Governing principle — Mohr's circle radius equals the maximum in-plane shear.** Plotting the stress state on Mohr's circle, the center sits at the average normal stress $\\sigma_{avg}=(\\sigma_x+\\sigma_y)/2$, and the maximum in-plane shear stress is exactly the *radius* of the circle. The radius is the hypotenuse of a right triangle whose legs are $(\\sigma_x-\\sigma_y)/2$ and $\\tau_{xy}$.\n\n" +
      "**Step 1 — Half the difference of normal stresses (one leg).**\n" +
      "$$\\frac{\\sigma_x - \\sigma_y}{2} = \\frac{80 - 20}{2} = 30\\text{ MPa}.$$\n\n" +
      "**Step 2 — Shear stress is the other leg.** $\\tau_{xy} = 30\\text{ MPa}$.\n\n" +
      "**Step 3 — Maximum in-plane shear = radius.**\n" +
      "$$\\tau_{max} = \\sqrt{\\left(\\frac{\\sigma_x-\\sigma_y}{2}\\right)^2 + \\tau_{xy}^2} = \\sqrt{30^2 + 30^2} = \\sqrt{1800} = 42.43\\text{ MPa}.$$\n\n" +
      "**Context check:** the principal stresses are $\\sigma_{avg}\\pm\\tau_{max} = 50\\pm42.43$, i.e. $92.4$ and $7.6$ MPa — but the question asks for the radius, $\\tau_{max}$.\n\n" +
      "**Key trap:** do not use $(\\sigma_x-\\sigma_y)/2$ alone (that ignores the applied shear) or $|\\sigma_x-\\sigma_y|$ without the factor of one-half. Both legs must be combined as a Pythagorean sum.\n\n" +
      "**Final answer: $\\tau_{max} = 42.4\\text{ MPa}$.**",
  },
  // SOLUTION: FoS = strength/applied. Material A: 350/140 = 2.50. Material B: 250/100 = 2.50.
  //   Same FoS, so FoS alone does not distinguish. The judgment: a higher *margin*
  //   in absolute terms is not the point — both have equal proportional reserve.
  //   The interview-grade insight: with equal FoS, the choice should consider that the
  //   stronger material (A) reaches the SAME factor of safety only because it also sees
  //   higher working stress; per-FoS they are equivalent. The CORRECT statement is that
  //   both rods have the same factor of safety (2.5), so FoS does not favor either.
  //   Distractors are common errors (subtracting, picking the bigger number, confusing
  //   margin with FoS). Re-derive: 350/140 = 2.5; 250/100 = 2.5. Equal. Match.
  {
    id: "ms_factor_of_safety_mc",
    slug: "statics-factor-of-safety-concept",
    title: "Comparing Two Candidate Tie Rods",
    prompt:
      "Two tie rods are proposed for the same connection. Rod A is made of a\n" +
      "material with yield strength 350 MPa and would operate at a working\n" +
      "stress of 140 MPa. Rod B uses a 250 MPa material at a working stress of\n" +
      "100 MPa.\n\n" +
      "A reviewer claims one rod is clearly safer against yielding than the\n" +
      "other. Evaluate the rods on factor of safety and choose the correct\n" +
      "conclusion.",
    discipline: "MECHANICAL",
    difficulty: "EASY",
    eloWeight: 15,
    tags: ["factor-of-safety", "design", "judgment"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Both rods have the same factor of safety (2.5), so FoS does not favor either.",
        correct: true,
      },
      {
        id: "b",
        label: "Rod A is safer because its material is stronger (350 > 250 MPa).",
      },
      {
        id: "c",
        label:
          "Rod B is safer because its working stress is lower (100 < 140 MPa).",
      },
      {
        id: "d",
        label:
          "Rod A is safer because its stress margin is larger (210 vs 150 MPa).",
      },
    ],
    hints: [
      "Safety against yielding is judged by a ratio, not by which absolute number is bigger.",
      "Form the factor of safety for each rod as its yield strength divided by its working stress, then compare the two ratios.",
      "Beware distractors that pick the larger strength, the lower working stress, or the absolute stress margin — none of those is the factor of safety itself.",
    ],
    solution:
      "**Governing principle — factor of safety is a *ratio*, not a difference.** Safety against yielding is measured by $\\text{FoS} = \\dfrac{\\sigma_{yield}}{\\sigma_{working}}$, the proportional reserve before the material yields. Comparing absolute strengths, absolute working stresses, or stress *margins* (differences) all confuse the issue.\n\n" +
      "**Step 1 — FoS of Rod A.** $\\text{FoS}_A = \\dfrac{350}{140} = 2.5$.\n\n" +
      "**Step 2 — FoS of Rod B.** $\\text{FoS}_B = \\dfrac{250}{100} = 2.5$.\n\n" +
      "**Step 3 — Compare.** Both equal $2.5$, so on a factor-of-safety basis the rods are equally safe against yielding — FoS favors neither. This is **choice (a)**.\n\n" +
      "**Why the distractors are wrong:**\n" +
      "- **(b)** picks the stronger material (350 > 250 MPa), but A also runs at a higher working stress, so raw strength is irrelevant — only the ratio matters.\n" +
      "- **(c)** picks the lower working stress (100 < 140 MPa), but again the lower stress is paired with a lower strength; the ratio is identical.\n" +
      "- **(d)** uses the *stress margin* (difference): $350-140 = 210$ vs $250-100 = 150$. A margin is not a factor of safety; the proportional reserve is what governs yielding, and it is equal.\n\n" +
      "**Key insight:** equal ratios mean equal proportional reserve even when the absolute numbers differ.\n\n" +
      "**Final answer: (a) — both rods have the same factor of safety (2.5), so FoS does not favor either.**",
  },
  // SOLUTION: Method of sections / joints judgment problem.
  //   A Warren-type truss; a single vertical section is cut through three members:
  //   a top chord, a bottom chord, and one diagonal. To isolate a CHORD force in one
  //   move, take moments about the joint where the OTHER two cut members intersect
  //   (so their unknown forces produce no moment). That kills two unknowns and yields
  //   the third directly. The correct answer names the method-of-sections moment trick.
  //   Distractors: summing forces (couples all three unknowns), cutting four members,
  //   method-of-joints claim. Re-derive: standard method-of-sections principle. Match.
  {
    id: "ms_truss_zero_force_mc",
    slug: "statics-truss-zero-force-member",
    title: "Isolating One Chord Force in a Truss",
    prompt:
      "You must find the force in a single bottom-chord member of a large\n" +
      "Warren truss by hand, quickly. You make one vertical cut that passes\n" +
      "through the bottom chord, the top chord, and one diagonal — three\n" +
      "unknown member forces exposed.\n\n" +
      "Which single equilibrium operation lets you solve for the bottom-chord\n" +
      "force directly, without first solving for the other two members?",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 23,
    tags: ["truss", "method-of-sections", "equilibrium"],
    skillAreas: ["statics", "structural-analysis"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Sum moments about the joint where the top chord and diagonal meet, eliminating their forces.",
        correct: true,
      },
      {
        id: "b",
        label: "Sum forces in the vertical direction on the cut free body.",
      },
      {
        id: "c",
        label: "Sum forces in the horizontal direction on the cut free body.",
      },
      {
        id: "d",
        label:
          "Apply the method of joints at the nearest joint and ignore the section cut.",
      },
    ],
    hints: [
      "With three unknowns exposed on one cut, look for a single equilibrium equation that involves only the one force you want.",
      "Two of the cut members pass through a common point; taking moments about that point removes both of them at once.",
      "The bottom chord does not pass through the intersection of the top chord and diagonal, so a moment equation about that joint isolates the bottom-chord force in one step.",
    ],
    solution:
      "**Governing principle — method of sections with a smart moment center.** A section cut exposes three unknown member forces. Each scalar equilibrium equation ($\\sum F_x$, $\\sum F_y$, $\\sum M$) is one equation. To get *one* member's force directly, write a moment equation about the point where the *other two* cut members intersect: their forces pass through that point, have zero lever arm, and drop out — leaving a single equation in the one force you want.\n\n" +
      "**Step 1 — Identify the cut members.** The cut passes through the bottom chord (target), the top chord, and one diagonal.\n\n" +
      "**Step 2 — Find the common intersection of the two unwanted members.** The top chord and the diagonal meet at a single joint. Taking moments about that joint eliminates both of their forces simultaneously.\n\n" +
      "**Step 3 — The bottom chord does NOT pass through that joint,** so it has a non-zero lever arm and remains in the moment equation: $\\sum M_{joint} = 0$ solves for the bottom-chord force in one step. This is **choice (a)**.\n\n" +
      "**Why the distractors are wrong:**\n" +
      "- **(b)** $\\sum F_y$ involves all three unknowns (the diagonal and chords with vertical components) — it couples them rather than isolating one.\n" +
      "- **(c)** $\\sum F_x$ likewise contains both chords (largely horizontal) plus the diagonal's horizontal component — three unknowns again.\n" +
      "- **(d)** Method of joints starts at a joint with two unknowns and forces you to march through several joints to reach this member — slow, and it ignores the efficiency of the section cut.\n\n" +
      "**Key insight:** pick the moment center at the intersection of the two members you do *not* want, so only your target survives.\n\n" +
      "**Final answer: (a) — sum moments about the joint where the top chord and diagonal meet.**",
  },
  // SOLUTION: Stress concentration. Flat plate, width w=60 mm, central hole d=20 mm,
  //   thickness t=10 mm, axial load F=24 kN. Net section area A_net = (w−d)·t
  //     = (60−20)·10 = 400 mm² = 4.0e-4 m². Nominal net stress σ_nom = F/A_net
  //     = 24000/4.0e-4 = 6.0e7 Pa = 60 MPa.
  //   Stress concentration factor Kt given = 2.5. Peak local stress σ_peak = Kt·σ_nom
  //     = 2.5·60 = 150 MPa.
  //   Re-derive: A_net = 40·10 = 400 mm²; 24000 N / 0.0004 m² = 60 MPa; ×2.5 = 150 MPa.
  //   Match.
  {
    id: "ms_stress_concentration_term",
    slug: "statics-stress-concentration-term",
    title: "Peak Stress at a Drilled Hole",
    prompt:
      "A flat bar 60 mm wide and 10 mm thick carries a 24 kN axial tensile\n" +
      "load. A 20 mm diameter hole is drilled through the center of the bar.\n" +
      "For this geometry the stress concentration factor based on the net\n" +
      "section is 2.5.\n\n" +
      "Estimate the true peak stress at the edge of the hole. Remember the\n" +
      "concentration factor multiplies the stress on the reduced section, not\n" +
      "the full bar.\n\n" +
      "Report the peak local stress in MPa, rounded to the nearest whole\n" +
      "number.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["stress-concentration", "net-section", "axial"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 150,
    tolerance: 3,
    unit: "MPa",
    hints: [
      "A stress concentration amplifies a baseline 'nominal' stress; decide first which cross-section that nominal stress should be based on.",
      "The factor is defined on the net section, so compute the average stress over the area that remains after the hole is removed, not over the full bar.",
      "Find the nominal stress on the reduced (net) area, then multiply by the concentration factor to get the local peak at the hole edge.",
    ],
    solution:
      "**Governing principle — peak stress = stress-concentration factor × nominal net stress.** A geometric discontinuity (the hole) locally amplifies stress. The factor $K_t$ here is *defined on the net section*, so $\\sigma_{peak} = K_t\\,\\sigma_{nom}$ where $\\sigma_{nom}$ is the average stress on the reduced area remaining after the hole is removed — not on the full bar.\n\n" +
      "**Step 1 — Net section area.** Width minus hole, times thickness:\n" +
      "$$A_{net} = (w - d)\\,t = (60 - 20)(10) = 400\\text{ mm}^2 = 4.0\\times10^{-4}\\text{ m}^2.$$\n\n" +
      "**Step 2 — Nominal stress on the net section.**\n" +
      "$$\\sigma_{nom} = \\frac{F}{A_{net}} = \\frac{24{,}000\\text{ N}}{4.0\\times10^{-4}\\text{ m}^2} = 6.0\\times10^7\\text{ Pa} = 60\\text{ MPa}.$$\n\n" +
      "**Step 3 — Apply the concentration factor.**\n" +
      "$$\\sigma_{peak} = K_t\\,\\sigma_{nom} = 2.5\\times60 = 150\\text{ MPa}.$$\n\n" +
      "**Key trap:** if you based $\\sigma_{nom}$ on the *gross* area $(60\\times10 = 600\\text{ mm}^2)$ you'd get $40\\text{ MPa}$ and a peak of $100\\text{ MPa}$ — wrong, because this $K_t$ is referenced to the net section. Always match the area definition to how $K_t$ was defined.\n\n" +
      "**Final answer: $\\sigma_{peak} = 150\\text{ MPa}$.**",
  },
  // SOLUTION (EXPERT, multi-step buckling + sizing): Pinned-pinned solid round steel
  //   strut, length L=2.5 m, axial compressive service load P=60 kN, required factor
  //   of safety against Euler buckling FoS=3 → P_cr = FoS·P = 180 kN. E=200 GPa.
  //   Pinned-pinned effective length Le = L = 2.5 m. Euler: P_cr = π²·E·I / Le².
  //   I_required = P_cr·Le² / (π²·E) = 180000·(2.5²) / (π²·200e9)
  //     = 180000·6.25 / (9.8696·200e9) = 1.125e6 / 1.97392e12 = 5.6994e-7 m⁴.
  //   Solid round: I = π·d⁴/64 → d⁴ = 64·I/π = 64·5.6994e-7 / π = 3.6476e-5 / π
  //     = 1.16106e-5 m⁴. d = (1.16106e-5)^0.25.
  //   (1.16106e-5)^0.5 = 3.4074e-3; ^0.25 = √(3.4074e-3) = 0.058373 m = 58.37 mm.
  //   Re-derive: d⁴ = 1.16106e-5 → ln = -11.364; /4 = -2.8410; exp = 0.05837 m
  //     = 58.4 mm. Match. Minimum diameter ≈ 58.4 mm.
  {
    id: "ms_euler_column_sizing",
    slug: "statics-euler-column-min-diameter",
    title: "Sizing a Pinned Strut Against Buckling",
    prompt:
      "A 2.5 m long steel strut with pinned ends carries a steady axial\n" +
      "compressive load of 60 kN. Design rules require a factor of safety of\n" +
      "3 against elastic (Euler) buckling. The strut is to be a solid round\n" +
      "bar; E = 200 GPa.\n\n" +
      "Determine the minimum bar diameter that satisfies the buckling\n" +
      "requirement. Decide which buckling load the section must develop, then\n" +
      "back out the geometry.\n\n" +
      "Report the minimum diameter in mm, rounded to 1 decimal place.",
    discipline: "MECHANICAL",
    difficulty: "EXPERT",
    eloWeight: 38,
    tags: ["buckling", "euler", "column", "design", "sizing"],
    skillAreas: ["mechanics-of-materials", "statics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 58.4,
    tolerance: 0.8,
    unit: "mm",
    hints: [
      "The design must not buckle even with a safety margin, so the section has to be capable of carrying more than the service load. Decide what critical (buckling) load the column must develop.",
      "Scale the service load up by the required factor of safety to get the target critical load, and remember pinned ends give an effective length equal to the actual length.",
      "Set the Euler critical-load relation equal to that target to solve for the required second moment of area, then invert the solid-round section's geometry to get the diameter. The diameter comes out of a fourth-root, so carry precision.",
    ],
    solution:
      "**Governing principle — Euler buckling with a safety margin sets the required $I$.** A slender pinned strut fails by elastic buckling at $P_{cr} = \\dfrac{\\pi^2 E I}{L_e^2}$. The design must not buckle even with reserve, so the section must develop a critical load $\\text{FoS}$ times the service load. Solve for required $I$, then invert the solid-round geometry $I = \\pi d^4/64$ for the diameter.\n\n" +
      "**Step 1 — Target critical load.** $P_{cr} = \\text{FoS}\\times P = 3\\times60\\text{ kN} = 180\\text{ kN} = 180{,}000\\text{ N}$.\n\n" +
      "**Step 2 — Effective length.** Pinned-pinned ends $\\Rightarrow L_e = L = 2.5\\text{ m}$.\n\n" +
      "**Step 3 — Required second moment of area.** Rearrange Euler's relation:\n" +
      "$$I_{req} = \\frac{P_{cr}\\,L_e^2}{\\pi^2 E} = \\frac{180{,}000\\,(2.5)^2}{\\pi^2 (200\\times10^9)} = \\frac{1.125\\times10^6}{1.974\\times10^{12}} = 5.699\\times10^{-7}\\text{ m}^4.$$\n\n" +
      "**Step 4 — Invert the solid-round geometry.** With $I = \\dfrac{\\pi d^4}{64}$:\n" +
      "$$d^4 = \\frac{64\\,I_{req}}{\\pi} = \\frac{64(5.699\\times10^{-7})}{\\pi} = 1.161\\times10^{-5}\\text{ m}^4.$$\n\n" +
      "**Step 5 — Take the fourth root.**\n" +
      "$$d = (1.161\\times10^{-5})^{1/4} = 0.05837\\text{ m} = 58.4\\text{ mm}.$$\n\n" +
      "**Key insights/traps:** (1) scale the load *up* by FoS before sizing — applying FoS to the diameter or after the fact is wrong; (2) use $I = \\pi d^4/64$ (the rectangular/area-moment form), not the polar $J = \\pi d^4/32$; (3) the fourth root compresses errors, so carry extra digits through $I$ and $d^4$.\n\n" +
      "**Final answer: $d_{min} \\approx 58.4\\text{ mm}$.**",
  },
  // SOLUTION (HARD, combined axial + bending / eccentric load): Short rectangular post
  //   resists axial compression applied with an eccentricity. Section b=80 mm,
  //   h=120 mm, P=200 kN compression, eccentricity e=30 mm along the h-direction
  //   (toward one face). Combined stress σ = −P/A ± M·c/I, M = P·e.
  //   A = 0.080·0.120 = 9.6e-3 m². P/A = 200000/9.6e-3 = 2.0833e7 Pa = 20.83 MPa (comp).
  //   I about bending axis (depth h) = b·h³/12 = 0.080·(0.120)³/12
  //     = 0.080·1.728e-3/12 = 1.3824e-4/12 = 1.152e-5 m⁴. c = h/2 = 0.060 m.
  //   M = P·e = 200000·0.030 = 6000 N·m. M·c/I = 6000·0.060/1.152e-5
  //     = 360/1.152e-5 = 3.125e7 Pa = 31.25 MPa.
  //   Max compressive (most negative) on the loaded side: 20.83 + 31.25 = 52.08 MPa comp.
  //   Other face: 20.83 − 31.25 = −10.42 → 10.42 MPa TENSION.
  //   Largest-magnitude normal stress = 52.08 MPa (compressive).
  //   Re-derive: P/A = 20.833; via σ=P/A(1+6e/h)=20.833·(1+6·30/120)=20.833·(1+1.5)
  //     =20.833·2.5 = 52.08 MPa. Match → 52.1 MPa.
  {
    id: "ms_eccentric_axial_combined",
    slug: "statics-eccentric-axial-combined-stress",
    title: "Eccentrically Loaded Short Post",
    prompt:
      "A short rectangular structural post (cross-section 80 mm by 120 mm)\n" +
      "carries a 200 kN compressive load. Because of a misaligned bearing\n" +
      "plate, the load lands 30 mm off the centroid, offset along the 120 mm\n" +
      "dimension. Buckling is not a concern for this short member.\n\n" +
      "Find the largest-magnitude normal stress on the cross-section, combining\n" +
      "the direct and bending effects.\n\n" +
      "Report that stress magnitude in MPa, rounded to 1 decimal place.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 32,
    tags: ["combined-loading", "eccentric", "bending-stress", "axial"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 52.1,
    tolerance: 0.6,
    unit: "MPa",
    hints: [
      "An off-center axial load is equivalent to a centered load plus a bending moment; superpose the two stress effects on the section.",
      "The eccentric load creates a moment equal to the load times its offset; this bends the section about the axis along which the load is shifted.",
      "Add the uniform direct stress and the peak bending stress on the side where they reinforce each other. The largest magnitude occurs on the face closest to the load line.",
    ],
    solution:
      "**Governing principle — superpose direct axial stress and bending stress.** An eccentric axial load is statically equivalent to a centroidal axial force plus a couple $M = Pe$. The combined normal stress is $\\sigma = -\\dfrac{P}{A} \\pm \\dfrac{Mc}{I}$; the largest magnitude occurs on the face where both effects are compressive and add.\n\n" +
      "**Step 1 — Direct (uniform) compressive stress.** $A = b h = 0.080\\times0.120 = 9.6\\times10^{-3}\\text{ m}^2$.\n" +
      "$$\\frac{P}{A} = \\frac{200{,}000}{9.6\\times10^{-3}} = 2.083\\times10^7\\text{ Pa} = 20.83\\text{ MPa (comp)}.$$\n\n" +
      "**Step 2 — Bending moment from the eccentricity.** The offset is along the 120 mm ($h$) dimension, so bending is about the axis with $I = bh^3/12$:\n" +
      "$$M = P e = 200{,}000\\times0.030 = 6000\\text{ N·m}.$$\n" +
      "$$I = \\frac{bh^3}{12} = \\frac{0.080(0.120)^3}{12} = 1.152\\times10^{-5}\\text{ m}^4,\\quad c = \\frac{h}{2} = 0.060\\text{ m}.$$\n\n" +
      "**Step 3 — Peak bending stress.**\n" +
      "$$\\frac{Mc}{I} = \\frac{6000(0.060)}{1.152\\times10^{-5}} = 3.125\\times10^7\\text{ Pa} = 31.25\\text{ MPa}.$$\n\n" +
      "**Step 4 — Superpose on the loaded face (both compressive, add).**\n" +
      "$$\\sigma_{max} = \\frac{P}{A} + \\frac{Mc}{I} = 20.83 + 31.25 = 52.08\\text{ MPa (comp)}.$$\n\n" +
      "**Note on the other face:** $20.83 - 31.25 = -10.42$, i.e. $10.42\\text{ MPa tension}$ — the eccentric load is large enough to put the far face into tension, but the *largest-magnitude* stress is the compressive 52.1 MPa.\n\n" +
      "**Compact check:** $\\sigma = \\dfrac{P}{A}\\!\\left(1 + \\dfrac{6e}{h}\\right) = 20.83(1 + \\tfrac{6\\times30}{120}) = 20.83\\times2.5 = 52.08\\text{ MPa}$.\n\n" +
      "**Key trap:** bend about the axis the load is shifted along, and add (not subtract) the two stresses on the near face for the worst case.\n\n" +
      "**Final answer: $\\sigma_{max} \\approx 52.1\\text{ MPa}$ (compression).**",
  },
  // SOLUTION (HARD, thin-wall pressure vessel multi-step → sizing): Closed-end thin-wall
  //   cylinder, inner diameter Di=1.2 m → r=0.6 m, internal gauge pressure p=2.5 MPa,
  //   allowable stress σ_allow=120 MPa. Governing stress is hoop σ_hoop = p·r/t.
  //   Require σ_hoop ≤ σ_allow → t ≥ p·r/σ_allow = 2.5e6·0.6 / 120e6
  //     = 1.5e6 / 120e6 = 0.0125 m = 12.5 mm.
  //   (Longitudinal σ_long = p·r/2t is half, so hoop governs — correct choice of mode.)
  //   Re-derive: t = p·r/σ_allow = (2.5·0.6)/120 m·MPa/MPa = 1.5/120 = 0.0125 m
  //     = 12.5 mm. Match.
  {
    id: "ms_pressure_vessel_hoop_concept",
    slug: "statics-thin-wall-hoop-vs-longitudinal",
    title: "Minimum Wall Thickness for a Pressure Vessel",
    prompt:
      "A cylindrical pressure vessel with closed ends has a 1.2 m inside\n" +
      "diameter and operates at an internal gauge pressure of 2.5 MPa. The\n" +
      "wall material has an allowable stress of 120 MPa. Treat the wall as\n" +
      "thin-walled.\n\n" +
      "Determine the minimum wall thickness required. You must decide which\n" +
      "wall stress governs the design before sizing the thickness.\n\n" +
      "Report the minimum thickness in mm, rounded to 1 decimal place.",
    discipline: "MECHANICAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["pressure-vessel", "hoop-stress", "design", "sizing"],
    skillAreas: ["mechanics-of-materials", "statics"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 12.5,
    tolerance: 0.3,
    unit: "mm",
    hints: [
      "A thin cylinder under internal pressure has two different wall stresses; the larger one dictates the thickness needed.",
      "The hoop (circumferential) stress is twice the longitudinal stress, so the hoop direction governs the design.",
      "Set the hoop stress equal to the allowable stress and solve for thickness, using the inside radius (half the inside diameter). Watch the MPa-to-metre unit consistency.",
    ],
    solution:
      "**Governing principle — the hoop (circumferential) stress governs a thin cylinder.** A thin-walled cylinder under internal pressure carries two membrane stresses: hoop $\\sigma_\\theta = \\dfrac{pr}{t}$ and longitudinal $\\sigma_z = \\dfrac{pr}{2t}$. The hoop stress is *twice* the longitudinal, so design is controlled by the hoop direction. Size the wall by setting $\\sigma_\\theta = \\sigma_{allow}$.\n\n" +
      "**Step 1 — Decide the governing stress.** Since $\\sigma_\\theta = 2\\sigma_z$, the hoop stress governs.\n\n" +
      "**Step 2 — Geometry.** Inside radius $r = D_i/2 = 1.2/2 = 0.6\\text{ m}$.\n\n" +
      "**Step 3 — Set hoop stress to allowable and solve for $t$.**\n" +
      "$$\\sigma_\\theta = \\frac{pr}{t} \\le \\sigma_{allow} \\;\\Rightarrow\\; t \\ge \\frac{pr}{\\sigma_{allow}} = \\frac{(2.5\\text{ MPa})(0.6\\text{ m})}{120\\text{ MPa}}.$$\n\n" +
      "**Step 4 — Carry the arithmetic.** Pressure and allowable are both in MPa, so they cancel cleanly:\n" +
      "$$t \\ge \\frac{1.5}{120}\\text{ m} = 0.0125\\text{ m} = 12.5\\text{ mm}.$$\n\n" +
      "**Key trap:** sizing on the longitudinal stress would give half the thickness ($6.25$ mm) and an under-designed vessel. Also use the *radius*, not the diameter, in the membrane formulas.\n\n" +
      "**Final answer: $t_{min} = 12.5\\text{ mm}$.**",
  },
  // SOLUTION (MEDIUM, beam deflection sizing/decision via single number):
  //   Cantilever L=1.5 m, tip point load P=2 kN, max tip deflection limit = L/360.
  //   Required: find minimum I so δ_tip = P·L³/(3·E·I) ≤ L/360, E=70 GPa (aluminum).
  //   δ_limit = L/360 = 1.5/360 = 4.1667e-3 m.
  //   I_min = P·L³/(3·E·δ_limit) = 2000·(1.5³) / (3·70e9·4.1667e-3)
  //     = 2000·3.375 / (3·70e9·4.1667e-3) = 6750 / (8.75e8) = 7.714e-6 m⁴.
  //   Convert to mm⁴: 7.714e-6 m⁴ ·(1e12 mm⁴/m⁴)=7.714e6 mm⁴ → report in 1e6 mm⁴ = 7.71.
  //   Re-derive denominator: 3·70e9=2.1e11; ·4.1667e-3 = 8.75e8. 6750/8.75e8=7.714e-6.
  //   ×1e6 (to 10^6 mm⁴) = 7.714. Match → 7.71 (×10⁶ mm⁴).
  {
    id: "ms_beam_deflection_stiffness",
    slug: "statics-cantilever-deflection-min-inertia",
    title: "Stiffness-Limited Cantilever Bracket",
    prompt:
      "An aluminum cantilever bracket (E = 70 GPa) is 1.5 m long and supports\n" +
      "a 2 kN load at its free tip. To protect attached equipment, the tip\n" +
      "deflection must not exceed L/360.\n\n" +
      "Determine the minimum second moment of area (about the bending axis)\n" +
      "the cross-section must provide to meet the deflection limit. Recognize\n" +
      "that this is a serviceability (stiffness) requirement, not a strength\n" +
      "one.\n\n" +
      "Report the required second moment of area in units of 10⁶ mm⁴ (i.e.,\n" +
      "give I divided by 1,000,000 mm⁴), rounded to 2 decimal places.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 28,
    tags: ["deflection", "cantilever", "stiffness", "serviceability"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 7.71,
    tolerance: 0.15,
    unit: "10⁶ mm⁴",
    hints: [
      "This is a stiffness limit, not a stress limit: the controlling quantity is how much the tip deflects, which depends on the section's second moment of area.",
      "Express the deflection limit as a number (the span over 360), then write the cantilever tip-deflection relation for a tip point load.",
      "Rearrange that relation so the second moment of area is alone, plug in the deflection limit, and convert the result from m⁴ to the requested units of 10⁶ mm⁴.",
    ],
    solution:
      "**Governing principle — a serviceability (stiffness) limit, not strength.** The controlling quantity is tip deflection, which for a cantilever with a tip point load is $\\delta = \\dfrac{PL^3}{3EI}$. Stiffness lives in the product $EI$, so we solve for the minimum $I$ that keeps $\\delta$ within the allowed $L/360$.\n\n" +
      "**Step 1 — Deflection limit as a number.**\n" +
      "$$\\delta_{limit} = \\frac{L}{360} = \\frac{1.5}{360} = 4.167\\times10^{-3}\\text{ m}.$$\n\n" +
      "**Step 2 — Cantilever tip-deflection relation.** $\\delta = \\dfrac{PL^3}{3EI} \\le \\delta_{limit}$.\n\n" +
      "**Step 3 — Rearrange for required $I$.**\n" +
      "$$I_{min} = \\frac{PL^3}{3E\\,\\delta_{limit}} = \\frac{2000\\,(1.5)^3}{3(70\\times10^9)(4.167\\times10^{-3})}.$$\n\n" +
      "**Step 4 — Carry the arithmetic.** Numerator: $2000\\times3.375 = 6750$. Denominator: $3\\times70\\times10^9 = 2.1\\times10^{11}$, times $4.167\\times10^{-3} = 8.75\\times10^{8}$. So\n" +
      "$$I_{min} = \\frac{6750}{8.75\\times10^{8}} = 7.714\\times10^{-6}\\text{ m}^4.$$\n\n" +
      "**Step 5 — Convert to the requested units.** $1\\text{ m}^4 = 10^{12}\\text{ mm}^4$, so $I_{min} = 7.714\\times10^{6}\\text{ mm}^4 = 7.71\\ (\\times10^6\\text{ mm}^4)$.\n\n" +
      "**Key insight:** this is governed by deflection (stiffness/$E I$), independent of material strength — a beam can be plenty strong yet too flexible. Note $P$ in newtons, $L$ in metres, $E$ in pascals before converting the final $I$.\n\n" +
      "**Final answer: $I_{min} \\approx 7.71\\times10^{6}\\text{ mm}^4$.**",
  },
  // SOLUTION (MEDIUM, transverse shear): Simply-supported rectangular timber beam,
  //   span 4 m, UDL w=6 kN/m. Max shear force at supports V = w·L/2 = 6·4/2 = 12 kN.
  //   Rectangular section b=100 mm, h=200 mm. Max transverse shear stress (at neutral
  //   axis) τ_max = 1.5·V/A = 3V/(2·b·h).
  //   A = 0.100·0.200 = 0.020 m². τ_max = 1.5·12000/0.020 = 18000/0.020 = 9.0e5 Pa
  //     = 0.90 MPa.
  //   Re-derive: 1.5·12000 = 18000; /0.020 = 900000 Pa = 0.9 MPa. Match.
  {
    id: "ms_transverse_shear_beam",
    slug: "statics-transverse-shear-rectangular-beam",
    title: "Peak Transverse Shear in a Timber Beam",
    prompt:
      "A simply-supported rectangular timber beam spans 4 m and carries a\n" +
      "uniformly distributed load of 6 kN/m. The section is 100 mm wide and\n" +
      "200 mm deep. Timber is weak in horizontal shear, so this check often\n" +
      "governs.\n\n" +
      "Determine the maximum transverse (horizontal) shear stress in the\n" +
      "beam. Identify where along the span and over the depth it is largest.\n\n" +
      "Report the maximum shear stress in MPa, rounded to 2 decimal places.",
    discipline: "MECHANICAL",
    difficulty: "MEDIUM",
    eloWeight: 25,
    tags: ["transverse-shear", "beam", "shear-stress"],
    skillAreas: ["mechanics-of-materials"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.9,
    tolerance: 0.03,
    unit: "MPa",
    hints: [
      "Transverse shear stress scales with the internal shear force, so first locate where that shear force is greatest along the span.",
      "For a uniformly loaded simple beam the shear force is largest at the supports; for a rectangular section the shear stress peaks at the neutral axis and exceeds the average.",
      "Take the maximum shear force, then apply the rectangular-section peak factor (the maximum is 1.5 times the average shear stress over the area). Keep dimensions in metres.",
    ],
    solution:
      "**Governing principle — transverse shear stress from $\\tau = VQ/(Ib)$, peaking at the neutral axis.** Horizontal shear stress is driven by the internal shear force $V$ and varies parabolically over the depth, reaching its maximum at the neutral axis. For a rectangular section this peak works out to $\\tau_{max} = \\dfrac{3V}{2A} = 1.5\\,\\dfrac{V}{A}$, i.e. 1.5 times the average. So first find the largest $V$, then apply the rectangular peak factor.\n\n" +
      "**Step 1 — Maximum shear force.** For a simply-supported beam under a UDL, $V$ is largest at the supports and equals the reaction:\n" +
      "$$V_{max} = \\frac{wL}{2} = \\frac{6\\text{ kN/m}\\times4\\text{ m}}{2} = 12\\text{ kN} = 12{,}000\\text{ N}.$$\n\n" +
      "**Step 2 — Cross-sectional area.** $A = b h = 0.100\\times0.200 = 0.020\\text{ m}^2$.\n\n" +
      "**Step 3 — Apply the rectangular peak factor (1.5× average).**\n" +
      "$$\\tau_{max} = \\frac{3V}{2A} = \\frac{1.5\\times12{,}000}{0.020} = \\frac{18{,}000}{0.020} = 9.0\\times10^5\\text{ Pa} = 0.90\\text{ MPa}.$$\n\n" +
      "**Where it occurs:** at the supports (max $V$), on the neutral axis (mid-depth).\n\n" +
      "**Key trap:** the *average* shear stress $V/A = 0.60\\text{ MPa}$ understates the true peak — the parabolic distribution makes the neutral-axis value 1.5× higher. This horizontal shear check often governs timber, which is weak across the grain.\n\n" +
      "**Final answer: $\\tau_{max} = 0.90\\text{ MPa}$.**",
  },
];
