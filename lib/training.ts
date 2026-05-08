/**
 * Weekly / monthly training volume recommendations, keyed off the predicted full-marathon time.
 * Numbers are rough community-consensus benchmarks (Daniels / Hansons / Pfitzinger ranges).
 *
 * The locale-dependent text (tier name, comment, workouts) is fetched separately
 * via the i18n dictionary (`t.trainingTier.<key>`).
 */

export type TrainingTierKey = "sub3" | "sub35" | "sub4" | "sub45" | "sub5" | "finish";

export interface TrainingPlan {
  key: TrainingTierKey;
  monthlyKm: [number, number];
  weeklyKm: [number, number];
  longRunKm: [number, number];
}

const TIERS: { maxFullSec: number; plan: TrainingPlan }[] = [
  {
    maxFullSec: 3 * 3600,
    plan: { key: "sub3", monthlyKm: [350, 500], weeklyKm: [80, 120], longRunKm: [30, 35] },
  },
  {
    maxFullSec: 3.5 * 3600,
    plan: { key: "sub35", monthlyKm: [250, 350], weeklyKm: [55, 85], longRunKm: [25, 32] },
  },
  {
    maxFullSec: 4 * 3600,
    plan: { key: "sub4", monthlyKm: [180, 260], weeklyKm: [40, 60], longRunKm: [22, 28] },
  },
  {
    maxFullSec: 4.5 * 3600,
    plan: { key: "sub45", monthlyKm: [140, 200], weeklyKm: [30, 45], longRunKm: [20, 25] },
  },
  {
    maxFullSec: 5 * 3600,
    plan: { key: "sub5", monthlyKm: [100, 160], weeklyKm: [25, 35], longRunKm: [18, 25] },
  },
  {
    maxFullSec: Number.POSITIVE_INFINITY,
    plan: { key: "finish", monthlyKm: [80, 130], weeklyKm: [20, 30], longRunKm: [15, 22] },
  },
];

export function planForFullSeconds(fullSec: number): TrainingPlan {
  for (const t of TIERS) {
    if (fullSec <= t.maxFullSec) return t.plan;
  }
  const last = TIERS[TIERS.length - 1];
  return last ? last.plan : TIERS[0]!.plan;
}
