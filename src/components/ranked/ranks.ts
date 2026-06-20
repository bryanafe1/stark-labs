// ---------------------------------------------------------------------------
//  Engineering rank ladder (job-title themed), driven by local Elo.
// ---------------------------------------------------------------------------

export interface EngRank {
  key: string;
  label: string;
  minElo: number;
}

export const ENG_RANKS: EngRank[] = [
  { key: "INTERN", label: "Intern", minElo: 0 },
  { key: "JUNIOR", label: "Junior Engineer", minElo: 1000 },
  { key: "ENGINEER", label: "Engineer", minElo: 1300 },
  { key: "SENIOR", label: "Senior Engineer", minElo: 1600 },
  { key: "STAFF", label: "Staff Engineer", minElo: 1900 },
  { key: "LEAD", label: "Lead Engineer", minElo: 2200 },
  { key: "PRINCIPAL", label: "Principal Engineer", minElo: 2500 },
  { key: "DISTINGUISHED", label: "Distinguished Engineer", minElo: 2800 },
];

export const STARTING_ELO = 1200;

export function rankForElo(elo: number): EngRank {
  let current = ENG_RANKS[0]!;
  for (const r of ENG_RANKS) if (elo >= r.minElo) current = r;
  return current;
}

export function nextRank(elo: number): EngRank | null {
  const idx = ENG_RANKS.findIndex((r) => r.key === rankForElo(elo).key);
  return ENG_RANKS[idx + 1] ?? null;
}

/** Progress (0–1) from the current tier floor toward the next tier. */
export function rankProgress(elo: number): number {
  const floor = rankForElo(elo).minElo;
  const next = nextRank(elo);
  if (!next) return 1;
  return Math.min(1, Math.max(0, (elo - floor) / (next.minElo - floor)));
}
