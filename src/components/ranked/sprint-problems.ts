import type { SprintProblem } from "./types";

// ---------------------------------------------------------------------------
//  Procedurally-generated sprint problems. Each generator randomizes its inputs
//  and COMPUTES the answer in code — every match is unique, every answer exact.
//  Problems test PROBLEM-SOLVING, not memorization: the governing equations are
//  provided on the battle screen via the Reference Sheet (`reference` below).
//  The challenge is choosing + combining them, unit work, and multi-step setup.
// ---------------------------------------------------------------------------

const G = 9.81;

const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]!;
const rid = () => Math.random().toString(36).slice(2, 8);
/** Tolerance: a small fraction of the answer, with a sensible floor. */
const tol = (value: number, frac: number, floor: number) =>
  Math.max(floor, Math.abs(value) * frac);

type Gen = () => SprintProblem;

const GENERATORS: Gen[] = [
  // 1) Euler buckling — needs I from diameter, then Euler load.
  () => {
    const E = pick([190, 200, 210]); // GPa
    const d = pick([30, 40, 50, 60]); // mm
    const L = pick([1.5, 2, 2.5, 3]); // m
    const I = (Math.PI * (d / 1000) ** 4) / 64;
    const pcr = (Math.PI ** 2 * E * 1e9 * I) / L ** 2 / 1000; // kN
    return {
      id: `sp_buckling_${rid()}`,
      title: "Column Buckling",
      prompt: `A ${L} m steel column (E = ${E} GPa) has a solid circular cross-section of diameter ${d} mm and is pinned at both ends.\n\nWhat is its critical buckling load, in kN?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(pcr * 10) / 10,
      tolerance: tol(pcr, 0.02, 1),
      unit: "kN",
      reference: [
        "Euler (pinned–pinned): P_cr = π²·E·I / L²",
        "Solid circular section: I = π·d⁴ / 64",
      ],
    };
  },

  // 2) Otto cycle — efficiency from ratio, then net work.
  () => {
    const r = pick([8, 9, 10, 11]);
    const q = pick([600, 700, 800, 900, 1000]);
    const eta = 1 - r ** -0.4; // γ = 1.4
    const w = eta * q;
    return {
      id: `sp_otto_${rid()}`,
      title: "Otto Cycle Work",
      prompt: `An ideal air-standard Otto cycle (γ = 1.4) has a compression ratio of ${r} and receives ${q} kJ/kg of heat.\n\nFind the net work output per unit mass, in kJ/kg.`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(w),
      tolerance: tol(w, 0.02, 8),
      unit: "kJ/kg",
      reference: [
        "Air-standard Otto efficiency: η = 1 − r^(1−γ)",
        "Net work per unit mass: w = η · q_in",
      ],
    };
  },

  // 3) Pipe pressure drop — velocity from flow, head loss, then Δp.
  () => {
    const Q = pick([0.004, 0.006, 0.008, 0.01]);
    const D = pick([40, 50, 60]); // mm
    const L = pick([60, 80, 100, 120]);
    const f = pick([0.018, 0.02, 0.022, 0.025]);
    const A = (Math.PI / 4) * (D / 1000) ** 2;
    const V = Q / A;
    const hf = f * (L / (D / 1000)) * (V ** 2 / (2 * G));
    const dp = (1000 * G * hf) / 1000; // kPa
    return {
      id: `sp_dp_${rid()}`,
      title: "Pipe Pressure Drop",
      prompt: `Water (ρ = 1000 kg/m³) flows at ${Q} m³/s through a ${L} m run of ${D} mm diameter pipe. The Darcy friction factor is ${f}.\n\nWhat is the pressure drop along the pipe, in kPa?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(dp),
      tolerance: tol(dp, 0.03, 4),
      unit: "kPa",
      reference: [
        "Continuity: V = Q / A,  A = π·D² / 4",
        "Darcy–Weisbach: h_f = f·(L/D)·V² / (2g)",
        "Pressure drop: Δp = ρ·g·h_f",
      ],
    };
  },

  // 4) RC charging — time constant, then invert the exponential.
  () => {
    const R = pick([10, 22, 33, 47, 68]); // kΩ
    const C = pick([1, 4.7, 10, 22]); // µF
    const Vs = pick([5, 9, 12]);
    const frac = pick([0.5, 0.6, 0.75, 0.8, 0.9]);
    const Vt = Math.round(Vs * frac * 10) / 10;
    const tau = R * 1e3 * (C * 1e-6);
    const t = tau * Math.log(Vs / (Vs - Vt)) * 1000; // ms
    return {
      id: `sp_rc_${rid()}`,
      title: "RC Charging Time",
      prompt: `A ${C} µF capacitor, initially uncharged, charges through a ${R} kΩ resistor from a ${Vs} V source.\n\nHow long until the capacitor voltage reaches ${Vt} V, in milliseconds?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(t),
      tolerance: tol(t, 0.02, 8),
      unit: "ms",
      reference: [
        "Capacitor charging: V(t) = V_s·(1 − e^(−t/τ))",
        "Time constant: τ = R·C",
      ],
    };
  },

  // 5) Block on an incline — resolve gravity + friction (mass is a distractor).
  () => {
    const m = pick([10, 20, 50, 80]);
    const deg = pick([20, 25, 30, 35, 40]);
    const mu = pick([0.1, 0.15, 0.2, 0.25, 0.3]);
    const th = (deg * Math.PI) / 180;
    const a = G * (Math.sin(th) - mu * Math.cos(th));
    return {
      id: `sp_incline_${rid()}`,
      title: "Block on an Incline",
      prompt: `A ${m} kg block is released from rest on a ${deg}° incline. The coefficient of kinetic friction is ${mu}.\n\nWhat is the block's acceleration down the slope, in m/s²?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(a * 100) / 100,
      tolerance: tol(a, 0.04, 0.1),
      unit: "m/s²",
      reference: [
        "Newton's 2nd law along the slope: ΣF = m·a",
        "Gravity component down-slope: m·g·sinθ",
        "Kinetic friction: f = μ·N,  with N = m·g·cosθ",
      ],
    };
  },

  // 6) Wall heat flux — series conduction + convection resistance.
  () => {
    const L = pick([0.1, 0.15, 0.2, 0.25]);
    const k = pick([0.5, 0.8, 1.0, 1.2]);
    const Tin = pick([20, 25, 30, 35]);
    const Tair = pick([-15, -10, -5, 0, 5]);
    const h = pick([15, 20, 25, 30]);
    const q = (Tin - Tair) / (L / k + 1 / h);
    return {
      id: `sp_wall_${rid()}`,
      title: "Wall Heat Flux",
      prompt: `A ${L} m thick wall (k = ${k} W/m·K) has its inner surface at ${Tin} °C. Outside is air at ${Tair} °C with a convective coefficient h = ${h} W/m²·K.\n\nWhat is the steady heat flux through the wall, in W/m²?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(q),
      tolerance: tol(q, 0.02, 3),
      unit: "W/m²",
      reference: [
        'Conduction resistance (per area): R" = L / k',
        'Convection resistance (per area): R" = 1 / h',
        'Resistances in series: q = ΔT / ΣR"',
      ],
    };
  },

  // 7) Beam bending — M_max from UDL, I from section, then flexure.
  () => {
    const L = pick([3, 4, 5, 6]);
    const w = pick([3, 4, 5, 6, 8]); // kN/m
    const b = pick([80, 100, 120]); // mm
    const h = pick([150, 200, 250, 300]); // mm
    const Mmax = (w * 1000 * L ** 2) / 8;
    const I = ((b / 1000) * (h / 1000) ** 3) / 12;
    const sigma = (Mmax * (h / 1000 / 2)) / I / 1e6; // MPa
    return {
      id: `sp_beam_${rid()}`,
      title: "Beam Bending Stress",
      prompt: `A simply supported beam spans ${L} m and carries a uniform load of ${w} kN/m. Its cross-section is rectangular, ${b} mm wide × ${h} mm deep.\n\nWhat is the maximum bending stress, in MPa?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(sigma * 10) / 10,
      tolerance: tol(sigma, 0.02, 0.5),
      unit: "MPa",
      reference: [
        "Simply supported, uniform load: M_max = w·L² / 8",
        "Rectangular section: I = b·h³ / 12",
        "Bending stress: σ = M·c / I,  with c = h / 2",
      ],
    };
  },

  // 8) Pump power — convert flow, sum heads, hydraulic power / efficiency.
  () => {
    const lpm = pick([600, 900, 1200, 1500, 1800]);
    const lift = pick([10, 15, 18, 20, 25]);
    const fric = pick([3, 5, 7, 10]);
    const eta = pick([0.6, 0.65, 0.7, 0.75, 0.8]);
    const Q = lpm / 60000;
    const H = lift + fric;
    const P = (1000 * G * Q * H) / eta / 1000; // kW
    return {
      id: `sp_pump_${rid()}`,
      title: "Pump Input Power",
      prompt: `A pump moves ${lpm} L/min of water, raising it ${lift} m while overcoming ${fric} m of friction head. Its efficiency is ${Math.round(eta * 100)}%.\n\nWhat shaft input power is required, in kW?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(P * 100) / 100,
      tolerance: tol(P, 0.03, 0.3),
      unit: "kW",
      reference: [
        "Hydraulic power: P_h = ρ·g·Q·H",
        "Total head: H = static lift + friction head",
        "Shaft (input) power: P = P_h / η",
        "1000 L/min = 0.0167 m³/s",
      ],
    };
  },

  // 9) Step-response overshoot — extract ζ from the characteristic equation.
  () => {
    const [zeta, wn] = pick([
      [0.3, 5], [0.4, 5], [0.5, 5], [0.6, 5], [0.7, 5],
      [0.5, 4], [0.5, 8], [0.5, 2], [0.5, 10],
      [0.3, 10], [0.4, 10], [0.6, 10], [0.7, 10],
    ] as const);
    const b = 2 * zeta * wn;
    const c = wn * wn;
    const os = 100 * Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta));
    return {
      id: `sp_os_${rid()}`,
      title: "Step Response Overshoot",
      prompt: `A unity-feedback system has the closed-loop characteristic equation s² + ${b}s + ${c} = 0.\n\nWhat is the percent overshoot of its unit step response, in %?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(os * 10) / 10,
      tolerance: tol(os, 0.05, 0.6),
      unit: "%",
      reference: [
        "Standard 2nd-order form: s² + 2ζ·ω_n·s + ω_n² = 0",
        "Percent overshoot: %OS = 100·e^(−ζπ / √(1−ζ²))",
      ],
    };
  },

  // 10) Reynolds number — velocity from flow rate, then Re.
  () => {
    const Q = pick([0.001, 0.002, 0.004, 0.006]);
    const D = pick([20, 30, 40, 50]); // mm
    const A = (Math.PI / 4) * (D / 1000) ** 2;
    const V = Q / A;
    const Re = (1000 * V * (D / 1000)) / 0.001;
    return {
      id: `sp_re_${rid()}`,
      title: "Pipe Reynolds Number",
      prompt: `Water (ρ = 1000 kg/m³, µ = 0.001 Pa·s) flows at ${Q} m³/s through a ${D} mm diameter pipe.\n\nWhat is the Reynolds number (to the nearest 100)?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(Re / 100) * 100,
      tolerance: tol(Re, 0.02, 200),
      unit: "",
      reference: [
        "Continuity: V = Q / A,  A = π·D² / 4",
        "Reynolds number: Re = ρ·V·D / μ",
      ],
    };
  },

  // 11) Projectile range — needs deg→rad and the range relation.
  () => {
    const v = pick([20, 25, 30, 40, 50]);
    const deg = pick([20, 30, 40, 45]);
    const R = (v ** 2 * Math.sin((2 * deg * Math.PI) / 180)) / G;
    return {
      id: `sp_proj_${rid()}`,
      title: "Projectile Range",
      prompt: `A projectile is launched at ${v} m/s, ${deg}° above the horizontal, over level ground (neglect drag).\n\nWhat is its horizontal range, in metres?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(R * 10) / 10,
      tolerance: tol(R, 0.02, 1),
      unit: "m",
      reference: [
        "Horizontal motion: x = v·cosθ · t",
        "Vertical motion: y = v·sinθ · t − ½·g·t²",
        "Range = x when the projectile returns to y = 0",
      ],
    };
  },

  // 12) Natural frequency — ωn from k/m, then convert to Hz.
  () => {
    const k = pick([500, 1000, 2000, 5000]); // N/m
    const m = pick([1, 2, 5, 10]); // kg
    const fn = Math.sqrt(k / m) / (2 * Math.PI);
    return {
      id: `sp_fn_${rid()}`,
      title: "Natural Frequency",
      prompt: `A ${m} kg mass hangs from a spring of stiffness ${k} N/m.\n\nWhat is the natural frequency of free vibration, in Hz?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(fn * 100) / 100,
      tolerance: tol(fn, 0.02, 0.05),
      unit: "Hz",
      reference: [
        "Angular natural frequency: ω_n = √(k / m)",
        "Frequency in Hz: f = ω_n / (2π)",
      ],
    };
  },

  // 13) Stress concentration — net-section stress, then apply Kt.
  () => {
    const P = pick([5, 10, 20]); // kN
    const wmm = pick([40, 50, 60]); // mm
    const t = pick([5, 8, 10]); // mm
    const d = pick([10, 15, 20]); // mm
    const Kt = pick([2.2, 2.5, 2.7]);
    const sigNom = (P * 1000) / (((wmm - d) / 1000) * (t / 1000));
    const sigMax = (Kt * sigNom) / 1e6; // MPa
    return {
      id: `sp_kt_${rid()}`,
      title: "Stress Concentration",
      prompt: `A ${wmm} mm wide, ${t} mm thick plate has a ${d} mm central hole and carries ${P} kN of axial tension. The stress-concentration factor is Kt = ${Kt}.\n\nWhat is the peak stress at the hole, in MPa?`,
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: Math.round(sigMax * 10) / 10,
      tolerance: tol(sigMax, 0.02, 1),
      unit: "MPa",
      reference: [
        "Net-section area (through the hole): A = (w − d)·t",
        "Nominal stress: σ_nom = P / A",
        "Peak stress at the hole: σ_max = K_t · σ_nom",
      ],
    };
  },
];

/** Generate a fresh, unique sprint problem (random template + random inputs). */
export function pickSprintProblem(): SprintProblem {
  return pick(GENERATORS)();
}
