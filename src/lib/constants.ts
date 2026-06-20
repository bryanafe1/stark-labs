import type { Difficulty, Discipline, RankTier } from "@prisma/client";
import {
  Cog,
  Rocket,
  Zap,
  Cpu,
  Building2,
  FlaskConical,
  Bot,
  Factory,
  HeartPulse,
  Leaf,
  type LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
//  Disciplines — the 10 primary engineering fields. Single source of truth for
//  icon, label, and accent CSS token (--d-<key-lower> in globals.css).
// ---------------------------------------------------------------------------

/** Launch status — only `live` disciplines are fully populated/surfaced; the
 *  rest appear as a "Coming soon" roadmap (Iteration 2: ship one deep). */
export type DisciplineStatus = "live" | "coming_soon";

export interface DisciplineMeta {
  key: Discipline;
  label: string;
  short: string;
  icon: LucideIcon;
  /** CSS token stem; the color lives in globals.css as --d-<key-lower>. */
  accent: string;
  status: DisciplineStatus;
}

export const DISCIPLINES: Record<Discipline, DisciplineMeta> = {
  MECHANICAL: { key: "MECHANICAL", label: "Mechanical", short: "MECH", icon: Cog, accent: "--d-mechanical", status: "live" },
  AEROSPACE: { key: "AEROSPACE", label: "Aerospace", short: "AERO", icon: Rocket, accent: "--d-aerospace", status: "coming_soon" },
  ELECTRICAL: { key: "ELECTRICAL", label: "Electrical", short: "EE", icon: Zap, accent: "--d-electrical", status: "coming_soon" },
  COMPUTER: { key: "COMPUTER", label: "Computer", short: "CE", icon: Cpu, accent: "--d-computer", status: "coming_soon" },
  CIVIL: { key: "CIVIL", label: "Civil", short: "CIVIL", icon: Building2, accent: "--d-civil", status: "coming_soon" },
  CHEMICAL: { key: "CHEMICAL", label: "Chemical", short: "CHEM", icon: FlaskConical, accent: "--d-chemical", status: "coming_soon" },
  MECHATRONICS: { key: "MECHATRONICS", label: "Mechatronics", short: "MTRN", icon: Bot, accent: "--d-mechatronics", status: "coming_soon" },
  INDUSTRIAL: { key: "INDUSTRIAL", label: "Industrial", short: "IE", icon: Factory, accent: "--d-industrial", status: "coming_soon" },
  BIOMEDICAL: { key: "BIOMEDICAL", label: "Biomedical", short: "BME", icon: HeartPulse, accent: "--d-biomedical", status: "coming_soon" },
  ENVIRONMENTAL: { key: "ENVIRONMENTAL", label: "Environmental", short: "ENV", icon: Leaf, accent: "--d-environmental", status: "coming_soon" },
};

export const DISCIPLINE_LIST: DisciplineMeta[] = Object.values(DISCIPLINES);

/** The single discipline shipped deep at launch (Iteration 2). */
export const LAUNCH_DISCIPLINE: Discipline = "MECHANICAL";

export const isDisciplineLive = (key: Discipline): boolean =>
  DISCIPLINES[key].status === "live";

/** Inline-style helpers for discipline tints (used across the UI). */
export function disciplineColor(d: Discipline): string {
  return `hsl(var(${DISCIPLINES[d].accent}))`;
}
export function disciplineTint(d: Discipline, alpha = 0.14): string {
  return `hsl(var(${DISCIPLINES[d].accent}) / ${alpha})`;
}

// ---------------------------------------------------------------------------
//  Skill areas — what you actually practice. Two kinds:
//   SUBJECT   = knowledge area (thermodynamics, fluid mechanics, materials…)
//   TECHNICAL = tool / method   (FEA, CFD, CAD, MATLAB, PCB design…)
//  Each area is shared across one or more disciplines.
// ---------------------------------------------------------------------------

export type SkillKind = "SUBJECT" | "TECHNICAL";

export interface SkillArea {
  slug: string;
  label: string;
  kind: SkillKind;
  disciplines: Discipline[];
}

export const SKILL_AREAS: SkillArea[] = [
  // ---- Subjects (knowledge) ----
  { slug: "statics", label: "Statics", kind: "SUBJECT", disciplines: ["MECHANICAL", "CIVIL", "AEROSPACE", "MECHATRONICS"] },
  { slug: "dynamics", label: "Dynamics", kind: "SUBJECT", disciplines: ["MECHANICAL", "AEROSPACE", "MECHATRONICS"] },
  { slug: "mechanics-of-materials", label: "Mechanics of Materials", kind: "SUBJECT", disciplines: ["MECHANICAL", "CIVIL", "AEROSPACE", "BIOMEDICAL"] },
  { slug: "thermodynamics", label: "Thermodynamics", kind: "SUBJECT", disciplines: ["MECHANICAL", "AEROSPACE", "CHEMICAL"] },
  { slug: "fluid-mechanics", label: "Fluid Mechanics", kind: "SUBJECT", disciplines: ["MECHANICAL", "AEROSPACE", "CHEMICAL", "CIVIL", "ENVIRONMENTAL"] },
  { slug: "heat-transfer", label: "Heat Transfer", kind: "SUBJECT", disciplines: ["MECHANICAL", "CHEMICAL", "AEROSPACE"] },
  { slug: "materials", label: "Materials Science", kind: "SUBJECT", disciplines: ["MECHANICAL", "CIVIL", "AEROSPACE", "BIOMEDICAL", "CHEMICAL"] },
  { slug: "vibrations", label: "Vibrations", kind: "SUBJECT", disciplines: ["MECHANICAL", "AEROSPACE", "MECHATRONICS"] },
  { slug: "control-systems", label: "Control Systems", kind: "SUBJECT", disciplines: ["MECHATRONICS", "ELECTRICAL", "MECHANICAL", "AEROSPACE", "CHEMICAL"] },
  { slug: "circuits", label: "Circuits", kind: "SUBJECT", disciplines: ["ELECTRICAL", "COMPUTER", "MECHATRONICS"] },
  { slug: "signals-systems", label: "Signals & Systems", kind: "SUBJECT", disciplines: ["ELECTRICAL", "COMPUTER", "BIOMEDICAL"] },
  { slug: "electromagnetics", label: "Electromagnetics", kind: "SUBJECT", disciplines: ["ELECTRICAL"] },
  { slug: "power-systems", label: "Power Systems", kind: "SUBJECT", disciplines: ["ELECTRICAL"] },
  { slug: "digital-logic", label: "Digital Logic", kind: "SUBJECT", disciplines: ["COMPUTER", "ELECTRICAL", "MECHATRONICS"] },
  { slug: "computer-architecture", label: "Computer Architecture", kind: "SUBJECT", disciplines: ["COMPUTER"] },
  { slug: "algorithms", label: "Data Structures & Algorithms", kind: "SUBJECT", disciplines: ["COMPUTER"] },
  { slug: "operating-systems", label: "Operating Systems", kind: "SUBJECT", disciplines: ["COMPUTER"] },
  { slug: "structural-analysis", label: "Structural Analysis", kind: "SUBJECT", disciplines: ["CIVIL", "AEROSPACE"] },
  { slug: "geotechnical", label: "Geotechnical", kind: "SUBJECT", disciplines: ["CIVIL"] },
  { slug: "transportation", label: "Transportation", kind: "SUBJECT", disciplines: ["CIVIL"] },
  { slug: "hydraulics", label: "Hydraulics & Hydrology", kind: "SUBJECT", disciplines: ["CIVIL", "ENVIRONMENTAL"] },
  { slug: "reaction-engineering", label: "Reaction Engineering", kind: "SUBJECT", disciplines: ["CHEMICAL"] },
  { slug: "transport-phenomena", label: "Transport Phenomena", kind: "SUBJECT", disciplines: ["CHEMICAL"] },
  { slug: "process-control", label: "Process Control", kind: "SUBJECT", disciplines: ["CHEMICAL", "MECHATRONICS"] },
  { slug: "aerodynamics", label: "Aerodynamics", kind: "SUBJECT", disciplines: ["AEROSPACE"] },
  { slug: "propulsion", label: "Propulsion", kind: "SUBJECT", disciplines: ["AEROSPACE"] },
  { slug: "orbital-mechanics", label: "Orbital Mechanics", kind: "SUBJECT", disciplines: ["AEROSPACE"] },
  { slug: "robotics", label: "Robotics & Kinematics", kind: "SUBJECT", disciplines: ["MECHATRONICS"] },
  { slug: "sensors-actuators", label: "Sensors & Actuators", kind: "SUBJECT", disciplines: ["MECHATRONICS", "BIOMEDICAL", "ELECTRICAL"] },
  { slug: "biomechanics", label: "Biomechanics", kind: "SUBJECT", disciplines: ["BIOMEDICAL"] },
  { slug: "biomaterials", label: "Biomaterials", kind: "SUBJECT", disciplines: ["BIOMEDICAL"] },
  { slug: "operations-research", label: "Operations Research", kind: "SUBJECT", disciplines: ["INDUSTRIAL"] },
  { slug: "manufacturing", label: "Manufacturing Processes", kind: "SUBJECT", disciplines: ["INDUSTRIAL", "MECHANICAL"] },
  { slug: "quality-systems", label: "Quality & Six Sigma", kind: "SUBJECT", disciplines: ["INDUSTRIAL"] },
  { slug: "environmental-chemistry", label: "Environmental Chemistry", kind: "SUBJECT", disciplines: ["ENVIRONMENTAL", "CHEMICAL"] },
  { slug: "water-treatment", label: "Water & Wastewater", kind: "SUBJECT", disciplines: ["ENVIRONMENTAL", "CIVIL"] },
  { slug: "air-quality", label: "Air Quality", kind: "SUBJECT", disciplines: ["ENVIRONMENTAL"] },

  // ---- Technical skills (tools / methods) ----
  { slug: "fea", label: "FEA", kind: "TECHNICAL", disciplines: ["MECHANICAL", "CIVIL", "AEROSPACE", "BIOMEDICAL"] },
  { slug: "cfd", label: "CFD", kind: "TECHNICAL", disciplines: ["MECHANICAL", "AEROSPACE", "CHEMICAL", "ENVIRONMENTAL"] },
  { slug: "cad", label: "CAD", kind: "TECHNICAL", disciplines: ["MECHANICAL", "AEROSPACE", "CIVIL", "MECHATRONICS", "BIOMEDICAL", "INDUSTRIAL"] },
  { slug: "gdt", label: "GD&T", kind: "TECHNICAL", disciplines: ["MECHANICAL", "INDUSTRIAL"] },
  { slug: "matlab", label: "MATLAB / Simulink", kind: "TECHNICAL", disciplines: ["MECHANICAL", "ELECTRICAL", "MECHATRONICS", "AEROSPACE", "CHEMICAL", "BIOMEDICAL"] },
  { slug: "programming", label: "Programming (Python/C++)", kind: "TECHNICAL", disciplines: ["COMPUTER", "ELECTRICAL", "MECHATRONICS"] },
  { slug: "pcb-design", label: "PCB Design", kind: "TECHNICAL", disciplines: ["ELECTRICAL", "COMPUTER", "MECHATRONICS"] },
  { slug: "embedded-firmware", label: "Embedded / Firmware", kind: "TECHNICAL", disciplines: ["COMPUTER", "MECHATRONICS", "ELECTRICAL"] },
  { slug: "plc", label: "PLC Programming", kind: "TECHNICAL", disciplines: ["MECHATRONICS", "INDUSTRIAL", "ELECTRICAL"] },
  { slug: "spice", label: "SPICE Simulation", kind: "TECHNICAL", disciplines: ["ELECTRICAL", "COMPUTER"] },
  { slug: "process-simulation", label: "Process Simulation", kind: "TECHNICAL", disciplines: ["CHEMICAL"] },
  { slug: "gis", label: "GIS", kind: "TECHNICAL", disciplines: ["CIVIL", "ENVIRONMENTAL"] },
];

export const SKILL_AREA_MAP: Record<string, SkillArea> = Object.fromEntries(
  SKILL_AREAS.map((s) => [s.slug, s]),
);
export const SUBJECTS: SkillArea[] = SKILL_AREAS.filter((s) => s.kind === "SUBJECT");
export const TECHNICAL_SKILLS: SkillArea[] = SKILL_AREAS.filter((s) => s.kind === "TECHNICAL");

/** Skill areas relevant to a discipline, subjects first. */
export function skillAreasForDiscipline(d: Discipline): SkillArea[] {
  return SKILL_AREAS.filter((s) => s.disciplines.includes(d)).sort((a, b) =>
    a.kind === b.kind ? 0 : a.kind === "SUBJECT" ? -1 : 1,
  );
}

// ---------------------------------------------------------------------------
//  Difficulty — label + badge styling.
// ---------------------------------------------------------------------------

export interface DifficultyMeta {
  key: Difficulty;
  label: string;
  badgeClass: string;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyMeta> = {
  INTRODUCTORY: { key: "INTRODUCTORY", label: "Intro", badgeClass: "bg-sky-500/15 text-sky-400" },
  EASY: { key: "EASY", label: "Easy", badgeClass: "bg-emerald-500/15 text-emerald-400" },
  MEDIUM: { key: "MEDIUM", label: "Medium", badgeClass: "bg-amber-500/15 text-amber-400" },
  HARD: { key: "HARD", label: "Hard", badgeClass: "bg-orange-500/15 text-orange-400" },
  EXPERT: { key: "EXPERT", label: "Expert", badgeClass: "bg-rose-500/15 text-rose-400" },
};

// ---------------------------------------------------------------------------
//  Rank tiers — Elo thresholds + presentation.
// ---------------------------------------------------------------------------

export interface RankTierMeta {
  key: RankTier;
  label: string;
  minElo: number;
  gradient: string;
  textClass: string;
}

export const RANK_TIERS: RankTierMeta[] = [
  { key: "BRONZE", label: "Bronze", minElo: 0, gradient: "from-amber-700 to-amber-900", textClass: "text-amber-300" },
  { key: "SILVER", label: "Silver", minElo: 1200, gradient: "from-slate-300 to-slate-500", textClass: "text-slate-200" },
  { key: "GOLD", label: "Gold", minElo: 1500, gradient: "from-yellow-300 to-yellow-600", textClass: "text-yellow-200" },
  { key: "PLATINUM", label: "Platinum", minElo: 1800, gradient: "from-cyan-200 to-cyan-500", textClass: "text-cyan-100" },
  { key: "DIAMOND", label: "Diamond", minElo: 2100, gradient: "from-sky-300 to-indigo-500", textClass: "text-sky-100" },
  { key: "MASTER", label: "Master", minElo: 2400, gradient: "from-fuchsia-400 to-purple-600", textClass: "text-fuchsia-100" },
  { key: "GRANDMASTER", label: "Grandmaster", minElo: 2700, gradient: "from-rose-400 to-red-600", textClass: "text-rose-100" },
];

export const RANK_TIER_MAP: Record<RankTier, RankTierMeta> = Object.fromEntries(
  RANK_TIERS.map((t) => [t.key, t]),
) as Record<RankTier, RankTierMeta>;

export function tierForElo(elo: number): RankTierMeta {
  let current = RANK_TIERS[0]!;
  for (const t of RANK_TIERS) if (elo >= t.minElo) current = t;
  return current;
}

export function tierProgress(elo: number): number {
  const idx = RANK_TIERS.findIndex((t) => t.key === tierForElo(elo).key);
  const next = RANK_TIERS[idx + 1];
  if (!next) return 1;
  const floor = RANK_TIERS[idx]!.minElo;
  return Math.min(1, Math.max(0, (elo - floor) / (next.minElo - floor)));
}
