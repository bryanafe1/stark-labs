/**
 * Practice problem validation gate.  Run:  npm run validate:problems
 *
 * Structurally validates every problem AND cross-checks each answer through the
 * real `gradeAnswer` engine, so a problem whose stated answer doesn't grade as
 * CORRECT fails the build. Also verifies every skillAreas slug is real.
 */
import { gradeAnswer } from "../src/lib/grading";
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

const FILES: Record<string, PracticeProblem[]> = {
  seed,
  "mechanical-statics-and-stress": mechStatics,
  "mechanical-dynamics-and-machine-design": mechDynamics,
  "thermodynamics-and-heat-transfer": thermo,
  "electrical-circuits": electrical,
  "civil-structures-and-materials": civil,
  "fluid-mechanics": fluids,
  "aerospace-aerodynamics-and-flight": aero,
  "fea-and-numerical-methods": fea,
  "computer-engineering": computer,
  mechatronics,
  "chemical-engineering": chemical,
  "industrial-engineering": industrial,
  "biomedical-engineering": biomedical,
  "environmental-engineering": environmental,
};

const DISCIPLINES = [
  "MECHANICAL", "AEROSPACE", "ELECTRICAL", "COMPUTER", "CIVIL",
  "CHEMICAL", "MECHATRONICS", "INDUSTRIAL", "BIOMEDICAL", "ENVIRONMENTAL",
];
const DIFFICULTIES = ["INTRODUCTORY", "EASY", "MEDIUM", "HARD", "EXPERT"];
// Mirror of SKILL_AREAS slugs in src/lib/constants.ts.
const SKILL_AREAS = new Set([
  "statics", "dynamics", "mechanics-of-materials", "thermodynamics", "fluid-mechanics",
  "heat-transfer", "materials", "vibrations", "control-systems", "circuits",
  "signals-systems", "electromagnetics", "power-systems", "digital-logic",
  "computer-architecture", "algorithms", "operating-systems", "structural-analysis",
  "geotechnical", "transportation", "hydraulics", "reaction-engineering",
  "transport-phenomena", "process-control", "aerodynamics", "propulsion",
  "orbital-mechanics", "robotics", "sensors-actuators", "biomechanics", "biomaterials",
  "operations-research", "manufacturing", "quality-systems", "environmental-chemistry",
  "water-treatment", "air-quality",
  "fea", "cfd", "cad", "gdt", "matlab", "programming", "pcb-design",
  "embedded-firmware", "plc", "spice", "process-simulation", "gis",
]);

const errors: string[] = [];
const seenIds = new Set<string>();
const seenSlugs = new Set<string>();
const byDiscipline: Record<string, number> = {};
const byMode: Record<string, number> = {};
let total = 0;

for (const [file, problems] of Object.entries(FILES)) {
  problems.forEach((p, i) => {
    total++;
    const where = `${file}[${i}] ${p.slug ?? p.id ?? "?"}`;
    const fail = (msg: string) => errors.push(`${where}: ${msg}`);

    for (const f of ["id", "slug", "title", "prompt"] as const) {
      if (!p[f] || typeof p[f] !== "string") fail(`missing/invalid ${f}`);
    }
    if (seenIds.has(p.id)) fail(`duplicate id "${p.id}"`);
    seenIds.add(p.id);
    if (seenSlugs.has(p.slug)) fail(`duplicate slug "${p.slug}"`);
    seenSlugs.add(p.slug);
    if (!DISCIPLINES.includes(p.discipline)) fail(`bad discipline "${p.discipline}"`);
    if (!DIFFICULTIES.includes(p.difficulty)) fail(`bad difficulty "${p.difficulty}"`);
    if (!Number.isFinite(p.eloWeight)) fail("eloWeight not a number");
    if (!Array.isArray(p.tags) || p.tags.length === 0) fail("tags empty");

    // Skill-area tagging
    if (!Array.isArray(p.skillAreas) || p.skillAreas.length === 0) {
      fail("missing skillAreas");
    } else {
      for (const s of p.skillAreas) if (!SKILL_AREAS.has(s)) fail(`unknown skillArea "${s}"`);
    }

    // Progressive hints — every problem must offer help when a candidate is stuck.
    if (!Array.isArray(p.hints) || p.hints.length < 1) {
      fail("missing hints (need ≥1 progressive hint)");
    }

    // Full worked solution — shown when the candidate gives up.
    if (!p.solution || typeof p.solution !== "string" || p.solution.trim().length < 20) {
      fail("missing solution (full worked solution required)");
    }

    byDiscipline[p.discipline] = (byDiscipline[p.discipline] ?? 0) + 1;
    byMode[p.evaluationMode] = (byMode[p.evaluationMode] ?? 0) + 1;

    switch (p.evaluationMode) {
      case "NUMERIC_TOLERANCE": {
        if (!Number.isFinite(p.expectedValue as number)) { fail("expectedValue not a number"); break; }
        if (!Number.isFinite(p.tolerance as number) || (p.tolerance as number) < 0) { fail("tolerance invalid"); break; }
        // `unit` is optional — many answers are dimensionless (hex value, pH, ratio).
        const r = gradeAnswer(p, { numericAnswer: p.expectedValue });
        if (r.status !== "CORRECT") fail(`expectedValue does not grade CORRECT (${r.status})`);
        break;
      }
      case "MULTIPLE_CHOICE": {
        const choices = p.choices ?? [];
        if (choices.length < 2) { fail("needs ≥2 choices"); break; }
        if (new Set(choices.map((c) => c.id)).size !== choices.length) fail("duplicate choice ids");
        const correct = choices.filter((c) => c.correct === true);
        if (correct.length !== 1) { fail(`must have exactly 1 correct choice (has ${correct.length})`); break; }
        const r = gradeAnswer(p, { choiceId: correct[0]!.id });
        if (r.status !== "CORRECT") fail(`correct choice does not grade CORRECT (${r.status})`);
        break;
      }
      case "EXACT_MATCH": {
        if (!p.expectedText) { fail("missing expectedText"); break; }
        const r = gradeAnswer(p, { textAnswer: p.expectedText });
        if (r.status !== "CORRECT") fail(`expectedText does not grade CORRECT (${r.status})`);
        break;
      }
      case "LLM_GRADED": {
        if (!p.rubric) fail("LLM_GRADED should include a rubric");
        if (p.expectedValue != null) fail("LLM_GRADED should not set expectedValue");
        break;
      }
      default:
        fail(`unknown evaluationMode "${(p as PracticeProblem).evaluationMode}"`);
    }
  });
}

console.log(`\nPractice problem bank: ${total} problems across ${Object.keys(FILES).length} files`);
console.log("By discipline:", byDiscipline);
console.log("By mode:", byMode);

if (errors.length) {
  console.error(`\n❌ ${errors.length} validation error(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("\n✅ All problems valid (structure + answer keys + skill tags).\n");
