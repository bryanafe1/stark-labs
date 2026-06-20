import type { Bot, MatchPlan } from "./types";

// ---------------------------------------------------------------------------
//  Mock bot "database" + matchmaking logic.
//  All client-side; opponents are fabricated near the user's local Elo.
// ---------------------------------------------------------------------------

/** 50+ believable engineering handles. */
export const BOT_USERNAMES: string[] = [
  "TurboFan_99", "Navier_Stokes_Fan", "CircuitBreakerME", "HVAC_God",
  "BernoulliBandit", "FluxCapacitor", "TorqueWrench", "vortex_shedder",
  "ThermoThanos", "MeshMaster3000", "LaminarLarry", "StressTensor",
  "CarnotCarl", "ohmsLawEnforcer", "ReynoldsWrap", "FEA_or_die",
  "EntropyEnjoyer", "MomentOfInertia", "DampedHarmonic", "PSI_Ops",
  "BoundaryLayerBob", "yield_strength", "ServoSensei", "kelvin_kid",
  "ShearLocked", "FourierTransformer", "drag_coefficient", "PIDcontroller",
  "GearRatioGuru", "BoltPreload", "CFD_cowboy", "TheBigPSI",
  "AmpereAce", "vonMisesVixen", "BucklingBaron", "HeatSinkHero",
  "FractureMechanic", "Watt_a_Legend", "RankineRebel", "FilletKing",
  "specific_impulse", "PoissonRatio", "GaugePressure", "MachOne",
  "WeldNeck", "TheGradient", "CapacitorKid", "RotorDynamo",
  "viscous_dissipation", "SolidWorksSlayer", "PascalsTriangle", "TheFlowRate",
  "AeroAnnie", "QFactorQueen", "ColdStartCharlie", "RootLocus",
];

/** A reasonable human solve time for these sprints. The bot is tuned around it. */
const HUMAN_AVERAGE_MS = 45_000;
/** Fraction of matches where the bot plays perfectly (authentic losses). */
const PERFECT_BOT_RATE = 0.2;

function randInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

/** Fabricate an opponent within ±90 Elo of the player (clamped). */
export function generateOpponent(userElo: number): Bot {
  const username =
    BOT_USERNAMES[Math.floor(Math.random() * BOT_USERNAMES.length)] ?? "Rival_AI";
  const elo = Math.max(100, userElo + randInt(-90, 90));
  return { id: `bot_${Date.now()}_${randInt(1000, 9999)}`, username, elo };
}

/**
 * The "Dopamine Rule". Decides how fast the bot will be:
 *  - 80% of matches: bot finishes SLOWER than a human average, so a player who
 *    submits a valid answer in reasonable time wins.
 *  - 20% of matches: bot is genuinely fast/perfect, keeping the ladder honest.
 */
export function computeBotPlan(): Pick<MatchPlan, "botFinishMs" | "perfectBot"> {
  const perfectBot = Math.random() < PERFECT_BOT_RATE;
  if (perfectBot) {
    // Fast: hard (but not impossible) to beat.
    return { perfectBot: true, botFinishMs: randInt(16_000, 28_000) };
  }
  // Beatable: 1.15×–1.45× the human average.
  const factor = 1.15 + Math.random() * 0.3;
  return { perfectBot: false, botFinishMs: Math.round(HUMAN_AVERAGE_MS * factor) };
}

// Opponent progress narration as the sprint runs.
export const BOT_STAGES = [
  "Reading the brief",
  "Analyzing problem",
  "Setting up equations",
  "Calculating",
  "Drafting solution",
  "Submitting…",
] as const;

/** Map a 0–1 progress fraction to a bot stage label. */
export function botStage(progress: number): { index: number; label: string } {
  const clamped = Math.min(0.999, Math.max(0, progress));
  const index = Math.floor(clamped * BOT_STAGES.length);
  return { index, label: BOT_STAGES[index] ?? BOT_STAGES[BOT_STAGES.length - 1]! };
}
