import "server-only";
import type { Discipline } from "@prisma/client";
import { DISCIPLINE_LIST, skillAreasForDiscipline, type SkillKind } from "@/lib/constants";
import { getCurrentUserId } from "@/lib/auth";
import { getUserProgress, type UserProgress } from "@/lib/user-stats";

// ---------------------------------------------------------------------------
//  Skill-tree view-model — real per-user mastery derived from saved attempts.
//  One track per discipline; nodes are that discipline's skill areas. A new
//  user (no attempts) sees every node AVAILABLE at 0%.
// ---------------------------------------------------------------------------

export type SkillStatus = "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "MASTERED";

export interface SkillNode {
  id: string;
  slug: string;
  title: string;
  discipline: Discipline;
  kind: SkillKind;
  status: SkillStatus;
  /** 0–100 mastery for this node (fraction of its problems solved). */
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

function buildTrack(discipline: Discipline, prog: UserProgress | null): SkillTrack {
  const areas = skillAreasForDiscipline(discipline);
  const nodes: SkillNode[] = areas.map((area) => {
    const st = prog?.byArea[area.slug];
    const masteryPct = st?.masteryPct ?? 0;
    const attempts = st?.attempts ?? 0;
    const solved = st?.solved ?? 0;
    const status: SkillStatus =
      masteryPct >= 80 ? "MASTERED" : attempts > 0 ? "IN_PROGRESS" : "AVAILABLE";
    return {
      id: `${discipline}-${area.slug}`,
      slug: area.slug,
      title: area.label,
      discipline,
      kind: area.kind,
      status,
      masteryPct,
      xp: solved * 50,
    };
  });
  return { discipline, nodes };
}

export async function getSkillTree(): Promise<SkillTreeViewModel> {
  const userId = await getCurrentUserId();
  const prog = userId ? await getUserProgress(userId) : null;

  const tracks = DISCIPLINE_LIST.map((d) => buildTrack(d.key, prog));

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
