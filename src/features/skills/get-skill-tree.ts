import "server-only";
import type { Discipline } from "@prisma/client";
import {
  DISCIPLINE_LIST,
  skillAreasForDiscipline,
  type SkillKind,
} from "@/lib/constants";

// ---------------------------------------------------------------------------
//  Skill-tree view-model (mock). One vertical track per discipline; a track's
//  nodes ARE that discipline's skill areas (subjects first, then technical).
//  Statuses are assigned deterministically (no randomness) so the UI is stable.
//  Swap for Prisma reads when DB + auth are live:
//    progress -> prisma.skillProgress.findMany({ where: { userId } })
// ---------------------------------------------------------------------------

export type SkillStatus = "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "MASTERED";

export interface SkillNode {
  id: string;
  slug: string;
  title: string;
  discipline: Discipline;
  kind: SkillKind;
  status: SkillStatus;
  /** 0–100 mastery for this node. */
  masteryPct: number;
  xp: number;
}

export interface SkillTrack {
  discipline: Discipline;
  nodes: SkillNode[];
}

export interface SkillTreeViewModel {
  tracks: SkillTrack[];
  totalMastered: number;
  totalNodes: number;
}

const XP_PER_NODE = 100;

/**
 * How far along each discipline is, expressed as the fraction of nodes that
 * should be MASTERED. The four "established" disciplines look more advanced;
 * the newer ones are earlier-stage.
 */
const MASTERY_FRACTION: Record<Discipline, number> = {
  MECHANICAL: 0.55,
  AEROSPACE: 0.5,
  ELECTRICAL: 0.5,
  CIVIL: 0.45,
  COMPUTER: 0.35,
  CHEMICAL: 0.3,
  MECHATRONICS: 0.25,
  INDUSTRIAL: 0.2,
  BIOMEDICAL: 0.2,
  ENVIRONMENTAL: 0.15,
};

const DEFAULT_FRACTION = 0.4;

/**
 * Build a track for a discipline. Nodes are the discipline's skill areas
 * (subjects first, then technical). Statuses follow a deterministic ramp:
 * the leading `masteredCount` nodes are MASTERED, then one IN_PROGRESS, then
 * one AVAILABLE, and the remainder LOCKED.
 */
function buildTrack(discipline: Discipline): SkillTrack {
  const areas = skillAreasForDiscipline(discipline);
  const fraction = MASTERY_FRACTION[discipline] ?? DEFAULT_FRACTION;
  const masteredCount = Math.floor(areas.length * fraction);

  const nodes: SkillNode[] = areas.map((area, i) => {
    let status: SkillStatus;
    let masteryPct: number;

    if (i < masteredCount) {
      status = "MASTERED";
      masteryPct = 100;
    } else if (i === masteredCount) {
      status = "IN_PROGRESS";
      masteryPct = 45;
    } else if (i === masteredCount + 1) {
      status = "AVAILABLE";
      masteryPct = 0;
    } else {
      status = "LOCKED";
      masteryPct = 0;
    }

    return {
      id: `${discipline}-${area.slug}`,
      slug: area.slug,
      title: area.label,
      discipline,
      kind: area.kind,
      status,
      masteryPct,
      xp: status === "LOCKED" || status === "AVAILABLE" ? 0 : XP_PER_NODE,
    };
  });

  return { discipline, nodes };
}

export async function getSkillTree(): Promise<SkillTreeViewModel> {
  const tracks = DISCIPLINE_LIST.map((d) => buildTrack(d.key));

  let totalNodes = 0;
  let totalMastered = 0;
  for (const track of tracks) {
    for (const node of track.nodes) {
      totalNodes += 1;
      if (node.status === "MASTERED") totalMastered += 1;
    }
  }

  return { tracks, totalMastered, totalNodes };
}
