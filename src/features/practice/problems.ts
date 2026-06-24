import "server-only";
import type { Difficulty, Discipline } from "@prisma/client";
import type { PracticeProblem } from "./types";

import { problems as seed } from "./content/seed";
import { problems as mechStatics } from "./content/mechanical-statics-and-stress";
import { problems as mechDynamics } from "./content/mechanical-dynamics-and-machine-design";
import { problems as thermo } from "./content/thermodynamics-and-heat-transfer";
import { problems as electrical } from "./content/electrical-circuits";
import { problems as civil } from "./content/civil-structures-and-materials";
import { problems as fluids } from "./content/fluid-mechanics";
import { problems as aero } from "./content/aerospace-aerodynamics-and-flight";
import { problems as fea } from "./content/fea-and-numerical-methods";
import { problems as computer } from "./content/computer-engineering";
import { problems as mechatronics } from "./content/mechatronics";
import { problems as chemical } from "./content/chemical-engineering";
import { problems as industrial } from "./content/industrial-engineering";
import { problems as biomedical } from "./content/biomedical-engineering";
import { problems as environmental } from "./content/environmental-engineering";
import { problems as conceptualMech } from "./content/conceptual-mechanical";
import { problems as conceptualThermal } from "./content/conceptual-thermal";
import { problems as c_aerodynamics } from "./content/conceptual-aerodynamics";
import { problems as c_algorithms } from "./content/conceptual-algorithms";
import { problems as c_biomaterials } from "./content/conceptual-biomaterials";
import { problems as c_biomechanics } from "./content/conceptual-biomechanics";
import { problems as c_circuits } from "./content/conceptual-circuits";
import { problems as c_computerArchitecture } from "./content/conceptual-computer-architecture";
import { problems as c_controlSystems } from "./content/conceptual-control-systems";
import { problems as c_digitalLogic } from "./content/conceptual-digital-logic";
import { problems as c_dynamics } from "./content/conceptual-dynamics";
import { problems as c_electromagnetics } from "./content/conceptual-electromagnetics";
import { problems as c_environmentalChemistry } from "./content/conceptual-environmental-chemistry";
import { problems as c_fluidMechanics } from "./content/conceptual-fluid-mechanics";
import { problems as c_geotechnical } from "./content/conceptual-geotechnical";
import { problems as c_hydraulics } from "./content/conceptual-hydraulics";
import { problems as c_manufacturing } from "./content/conceptual-manufacturing";
import { problems as c_materials } from "./content/conceptual-materials";
import { problems as c_operatingSystems } from "./content/conceptual-operating-systems";
import { problems as c_operationsResearch } from "./content/conceptual-operations-research";
import { problems as c_orbitalMechanics } from "./content/conceptual-orbital-mechanics";
import { problems as c_powerSystems } from "./content/conceptual-power-systems";
import { problems as c_processControl } from "./content/conceptual-process-control";
import { problems as c_propulsion } from "./content/conceptual-propulsion";
import { problems as c_qualitySystems } from "./content/conceptual-quality-systems";
import { problems as c_reactionEngineering } from "./content/conceptual-reaction-engineering";
import { problems as c_robotics } from "./content/conceptual-robotics";
import { problems as c_sensorsActuators } from "./content/conceptual-sensors-actuators";
import { problems as c_signalsSystems } from "./content/conceptual-signals-systems";
import { problems as c_structuralAnalysis } from "./content/conceptual-structural-analysis";
import { problems as c_transportPhenomena } from "./content/conceptual-transport-phenomena";
import { problems as c_vibrations } from "./content/conceptual-vibrations";
import { problems as c_waterTreatment } from "./content/conceptual-water-treatment";

// Re-export the type so existing importers (`@/features/practice/problems`) keep working.
export type { PracticeProblem } from "./types";

// ---------------------------------------------------------------------------
//  Practice problem catalog, aggregated from per-topic content modules so the
//  bank scales without one giant file. Swap for Prisma reads when DB is live.
// ---------------------------------------------------------------------------

const CATALOG: PracticeProblem[] = [
  ...seed,
  ...mechStatics,
  ...mechDynamics,
  ...thermo,
  ...electrical,
  ...civil,
  ...fluids,
  ...aero,
  ...fea,
  ...computer,
  ...mechatronics,
  ...chemical,
  ...industrial,
  ...biomedical,
  ...environmental,
  ...conceptualMech,
  ...conceptualThermal,
  ...c_aerodynamics,
  ...c_algorithms,
  ...c_biomaterials,
  ...c_biomechanics,
  ...c_circuits,
  ...c_computerArchitecture,
  ...c_controlSystems,
  ...c_digitalLogic,
  ...c_dynamics,
  ...c_electromagnetics,
  ...c_environmentalChemistry,
  ...c_fluidMechanics,
  ...c_geotechnical,
  ...c_hydraulics,
  ...c_manufacturing,
  ...c_materials,
  ...c_operatingSystems,
  ...c_operationsResearch,
  ...c_orbitalMechanics,
  ...c_powerSystems,
  ...c_processControl,
  ...c_propulsion,
  ...c_qualitySystems,
  ...c_reactionEngineering,
  ...c_robotics,
  ...c_sensorsActuators,
  ...c_signalsSystems,
  ...c_structuralAnalysis,
  ...c_transportPhenomena,
  ...c_vibrations,
  ...c_waterTreatment,
];

export async function getProblems(filter?: {
  discipline?: Discipline;
  difficulty?: Difficulty;
  skillArea?: string;
}): Promise<PracticeProblem[]> {
  let out = CATALOG;
  if (filter?.discipline) out = out.filter((p) => p.discipline === filter.discipline);
  if (filter?.difficulty) out = out.filter((p) => p.difficulty === filter.difficulty);
  if (filter?.skillArea) out = out.filter((p) => p.skillAreas?.includes(filter.skillArea!));
  return out;
}

export async function getProblemBySlug(
  slug: string,
): Promise<PracticeProblem | null> {
  return CATALOG.find((p) => p.slug === slug) ?? null;
}
