import "server-only";
import type { LessonDetail, LessonSummary } from "@/types/lessons";

// Foundational set
import { lesson as beamBending } from "./content/beam-bending-and-deflection";
import { lesson as columnBuckling } from "./content/column-buckling-and-stability";
import { lesson as rcCircuits } from "./content/rc-circuits-and-transients";
import { lesson as reynoldsFlow } from "./content/reynolds-number-and-internal-flow";
import { lesson as feaFundamentals } from "./content/fea-fundamentals-and-mesh-convergence";
import { lesson as wingAero } from "./content/wing-aerodynamics-lift-and-drag";
// Expanded library
import { lesson as statics } from "./content/statics-and-free-body-diagrams";
import { lesson as thermo } from "./content/thermodynamics-laws-and-cycles";
import { lesson as heatTransfer } from "./content/heat-transfer-modes";
import { lesson as materials } from "./content/stress-strain-and-material-properties";
import { lesson as opAmps } from "./content/op-amps-and-analog";
import { lesson as soil } from "./content/soil-mechanics-and-geotechnics";
import { lesson as rocket } from "./content/rocket-propulsion-and-the-rocket-equation";
import { lesson as digitalLogic } from "./content/digital-logic-and-boolean-algebra";
import { lesson as bigO } from "./content/algorithms-and-big-o";
import { lesson as cpuArch } from "./content/computer-architecture-cpu-and-cache";
import { lesson as pid } from "./content/control-systems-and-pid";
import { lesson as robotics } from "./content/robotics-forward-kinematics";
import { lesson as balances } from "./content/mass-and-energy-balances";
import { lesson as opsResearch } from "./content/operations-research-and-littles-law";
import { lesson as biomech } from "./content/biomechanics-and-joint-forces";
import { lesson as water } from "./content/water-and-wastewater-treatment";
// Interview-core subjects per discipline
import { lesson as vibrations } from "./content/dynamics-and-vibrations";
import { lesson as orbital } from "./content/orbital-mechanics";
import { lesson as flightStab } from "./content/flight-dynamics-and-stability";
import { lesson as signals } from "./content/signals-and-systems";
import { lesson as acPower } from "./content/ac-circuits-and-power";
import { lesson as semis } from "./content/semiconductor-devices";
import { lesson as os } from "./content/operating-systems";
import { lesson as networking } from "./content/computer-networking";
import { lesson as rcDesign } from "./content/reinforced-concrete-design";
import { lesson as hydraulics } from "./content/hydraulics-and-water-resources";
import { lesson as reaction } from "./content/reaction-engineering-and-kinetics";
import { lesson as massTransfer } from "./content/mass-transfer-and-separations";
import { lesson as processCtrl } from "./content/process-control";
import { lesson as embedded } from "./content/embedded-systems-and-microcontrollers";
import { lesson as sensors } from "./content/sensors-and-actuators";
import { lesson as probStats } from "./content/probability-and-statistics";
import { lesson as sixSigma } from "./content/quality-and-six-sigma";
import { lesson as supplyChain } from "./content/supply-chain-and-inventory";
import { lesson as biomaterials } from "./content/biomaterials";
import { lesson as biosignals } from "./content/biosignals-and-instrumentation";
import { lesson as biofluid } from "./content/biofluid-mechanics";
import { lesson as waterChem } from "./content/water-chemistry";
import { lesson as airQuality } from "./content/air-quality";
import { lesson as hydrology } from "./content/hydrology-and-hydraulics";

// ---------------------------------------------------------------------------
//  Lesson library — one content module per lesson so it scales. Swap for Prisma
//  reads (Lesson + ordered LessonSection rows → LessonBlock[]) when DB is live.
// ---------------------------------------------------------------------------

const LESSONS: LessonDetail[] = [
  beamBending, columnBuckling, rcCircuits, reynoldsFlow, feaFundamentals, wingAero,
  statics, thermo, heatTransfer, materials, opAmps, soil, rocket,
  digitalLogic, bigO, cpuArch, pid, robotics, balances, opsResearch, biomech, water,
  vibrations, orbital, flightStab, signals, acPower, semis, os, networking,
  rcDesign, hydraulics, reaction, massTransfer, processCtrl, embedded, sensors,
  probStats, sixSigma, supplyChain, biomaterials, biosignals, biofluid,
  waterChem, airQuality, hydrology,
];

/** Block kinds that award XP / count toward lesson completion + resume. */
export const INTERACTIVE_KINDS: readonly string[] = [
  "VIDEO",
  "PREDICT",
  "CHECK",
  "SANDBOX",
  "WORKED_EXAMPLE",
];

/** Ordered ids of a lesson's interactive blocks (for resume targeting). */
export function interactiveBlockIds(lesson: LessonDetail): string[] {
  return lesson.blocks.filter((b) => INTERACTIVE_KINDS.includes(b.kind)).map((b) => b.id);
}

const toSummary = ({
  blocks,
  objectives: _objectives,
  keyTakeaways: _keyTakeaways,
  interviewAngle: _interviewAngle,
  prerequisites: _prerequisites,
  ...summary
}: LessonDetail): LessonSummary => ({
  ...summary,
  interactiveCount: blocks.filter((b) => INTERACTIVE_KINDS.includes(b.kind)).length,
});

export async function getLessons(): Promise<LessonSummary[]> {
  return LESSONS.map(toSummary);
}

export async function getLessonBySlug(slug: string): Promise<LessonDetail | null> {
  return LESSONS.find((l) => l.slug === slug) ?? null;
}

export async function getLessonSlugs(): Promise<string[]> {
  return LESSONS.map((l) => l.slug);
}
