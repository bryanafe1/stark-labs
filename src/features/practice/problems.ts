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
