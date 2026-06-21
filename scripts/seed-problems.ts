/**
 * Seeds the live Problem table from the authored content catalog.
 * Imports content files directly (the aggregator pulls in `server-only`, which
 * can't load outside Next). Run:
 *   node --env-file=.env --import tsx scripts/seed-problems.ts
 */
import { PrismaClient } from "@prisma/client";
import type { PracticeProblem } from "../src/features/practice/types";

import { problems as seed } from "../src/features/practice/content/seed";
import { problems as mechStatics } from "../src/features/practice/content/mechanical-statics-and-stress";
import { problems as mechDynamics } from "../src/features/practice/content/mechanical-dynamics-and-machine-design";
import { problems as thermo } from "../src/features/practice/content/thermodynamics-and-heat-transfer";
import { problems as electrical } from "../src/features/practice/content/electrical-circuits";
import { problems as civil } from "../src/features/practice/content/civil-structures-and-materials";
import { problems as fluids } from "../src/features/practice/content/fluid-mechanics";
import { problems as aero } from "../src/features/practice/content/aerospace-aerodynamics-and-flight";
import { problems as fea } from "../src/features/practice/content/fea-and-numerical-methods";
import { problems as computer } from "../src/features/practice/content/computer-engineering";
import { problems as mechatronics } from "../src/features/practice/content/mechatronics";
import { problems as chemical } from "../src/features/practice/content/chemical-engineering";
import { problems as industrial } from "../src/features/practice/content/industrial-engineering";
import { problems as biomedical } from "../src/features/practice/content/biomedical-engineering";
import { problems as environmental } from "../src/features/practice/content/environmental-engineering";

const ALL: PracticeProblem[] = [
  ...seed, ...mechStatics, ...mechDynamics, ...thermo, ...electrical, ...civil,
  ...fluids, ...aero, ...fea, ...computer, ...mechatronics, ...chemical,
  ...industrial, ...biomedical, ...environmental,
];

const prisma = new PrismaClient();

async function main() {
  let n = 0;
  for (const p of ALL) {
    const data = {
      title: p.title,
      prompt: p.prompt,
      discipline: p.discipline,
      difficulty: p.difficulty,
      evaluationMode: p.evaluationMode,
      expectedValue: p.expectedValue ?? null,
      tolerance: p.tolerance ?? null,
      unit: p.unit ?? null,
      choices: (p.choices ?? undefined) as never,
      expectedText: p.expectedText ?? null,
      rubric: p.rubric ?? null,
      eloWeight: p.eloWeight,
      skillAreas: p.skillAreas ?? [],
      hints: p.hints ?? [],
      solution: p.solution ?? null,
      published: true,
    };
    await prisma.problem.upsert({
      where: { slug: p.slug },
      update: data,
      create: { id: p.id, slug: p.slug, ...data },
    });
    n++;
  }
  console.log(`Seeded ${n} problems`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
