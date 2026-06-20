import { PrismaClient, type Discipline } from "@prisma/client";

const prisma = new PrismaClient();

const DISCIPLINES: Discipline[] = [
  "MECHANICAL",
  "AEROSPACE",
  "ELECTRICAL",
  "COMPUTER",
  "CIVIL",
  "CHEMICAL",
  "MECHATRONICS",
  "INDUSTRIAL",
  "BIOMEDICAL",
  "ENVIRONMENTAL",
];

async function main() {
  // Demo user with per-discipline Elo ratings.
  const user = await prisma.user.upsert({
    where: { email: "tony@stark.dev" },
    update: {},
    create: {
      email: "tony@stark.dev",
      username: "tony.s",
      displayName: "Tony Stark",
      role: "ADMIN",
      overallElo: 1840,
      rankTier: "PLATINUM",
      xp: 12450,
      streakDays: 14,
      eloRatings: {
        create: DISCIPLINES.map((discipline, i) => ({
          discipline,
          elo: 1600 + i * 70,
          peakElo: 1700 + i * 70,
        })),
      },
    },
  });

  // A starter problem for the evaluation engine.
  await prisma.problem.upsert({
    where: { slug: "cantilever-tip-deflection" },
    update: {},
    create: {
      slug: "cantilever-tip-deflection",
      title: "Cantilever Tip Deflection",
      prompt:
        "A cantilever beam (L = 2 m, EI = 5e6 N·m²) carries a point load P = 1000 N at its free end. Compute the tip deflection in mm.",
      discipline: "MECHANICAL",
      difficulty: "EASY",
      evaluationMode: "NUMERIC_TOLERANCE",
      expectedValue: 0.533, // PL^3 / 3EI, in mm
      tolerance: 0.01,
      unit: "mm",
      published: true,
    },
  });

  console.log(`Seeded user ${user.username} + starter problem.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
