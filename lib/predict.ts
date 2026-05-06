/**
 * Race time prediction models.
 *
 * Inputs are in SI: meters and seconds. All models return seconds for the target distance.
 *
 * - Riegel (1981): T2 = T1 · (D2/D1)^k. k=1.06 (elite/well-trained), k=1.14 (general runner).
 * - VDOT (Daniels): velocity (m/min) → VO2 → VDOT via %VO2max-by-time, then invert for D2.
 * - Cameron (1998): empirical relation, solved iteratively.
 *
 * The general-runner k=1.14 is the spec-mandated default ("一般ランナー向け補正係数").
 */

export type ModelKey = "riegel" | "vdot" | "riegelElite";

export const MODEL_LABEL_JA: Record<ModelKey, string> = {
  riegel: "Riegel (k=1.14)",
  vdot: "VDOT (Daniels)",
  riegelElite: "Riegel (k=1.06)",
};

export const MODEL_DESC_JA: Record<ModelKey, string> = {
  riegel:
    "Peter Riegel (1981) の経験式。一般ランナー向け補正係数 k=1.14 を採用。距離が伸びるほどペース低下を強めに見積もる、保守的な予測。",
  vdot: "Jack Daniels の VDOT 理論。最大酸素摂取量と持続時間の関係から導出。トレーニング指標としても使われる定番。",
  riegelElite:
    "Riegel オリジナルの k=1.06。鍛錬されたランナー (週60km 以上を継続) 向けの楽観値。一般ランナーには甘く出やすいが、目標設定の上限値として機能する。",
};

/** Riegel's formula, with general-runner correction by default. */
export function predictRiegel(
  fromDistanceM: number,
  fromTimeSec: number,
  toDistanceM: number,
  k = 1.14,
): number {
  if (fromDistanceM <= 0 || fromTimeSec <= 0 || toDistanceM <= 0) return 0;
  return fromTimeSec * (toDistanceM / fromDistanceM) ** k;
}

/* -----------------------------------------------------------------
 * Daniels VDOT
 * --------------------------------------------------------------- */

/** Velocity v in m/min → estimated VO2 (ml/kg/min). */
function vo2FromVelocity(vMpm: number): number {
  return -4.6 + 0.182258 * vMpm + 0.000104 * vMpm * vMpm;
}

/** Race duration t (min) → fraction of VO2max sustainable for that duration. */
function pctVo2maxFromTime(tMin: number): number {
  return 0.8 + 0.1894393 * Math.exp(-0.012778 * tMin) + 0.2989558 * Math.exp(-0.1932605 * tMin);
}

export function vdotFromRace(distanceM: number, timeSec: number): number {
  const tMin = timeSec / 60;
  const vMpm = distanceM / tMin;
  return vo2FromVelocity(vMpm) / pctVo2maxFromTime(tMin);
}

/**
 * Given a VDOT, find the time (sec) for distanceM.
 * Solved by bisection on time. Robust over realistic race durations.
 */
export function timeForVdot(distanceM: number, vdot: number): number {
  if (distanceM <= 0 || !Number.isFinite(vdot) || vdot <= 0) return 0;
  // Search range: 30s ... 12h
  let lo = 30;
  let hi = 12 * 3600;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const tMin = mid / 60;
    const vMpm = distanceM / tMin;
    const candidate = vo2FromVelocity(vMpm) / pctVo2maxFromTime(tMin);
    // candidate decreases monotonically as time grows (slower pace → lower VDOT-equivalent).
    if (candidate > vdot) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function predictVdot(
  fromDistanceM: number,
  fromTimeSec: number,
  toDistanceM: number,
): number {
  const v = vdotFromRace(fromDistanceM, fromTimeSec);
  return timeForVdot(toDistanceM, v);
}

/* -----------------------------------------------------------------
 * Combined prediction
 * --------------------------------------------------------------- */

export interface PredictionResult {
  model: ModelKey;
  seconds: number;
}

export function predictAll(
  fromDistanceM: number,
  fromTimeSec: number,
  toDistanceM: number,
): PredictionResult[] {
  return [
    { model: "riegel", seconds: predictRiegel(fromDistanceM, fromTimeSec, toDistanceM, 1.14) },
    { model: "vdot", seconds: predictVdot(fromDistanceM, fromTimeSec, toDistanceM) },
    {
      model: "riegelElite",
      seconds: predictRiegel(fromDistanceM, fromTimeSec, toDistanceM, 1.06),
    },
  ];
}

/** Mean of the 3 models — used as the "代表値" on the result card. */
export function consensusSeconds(predictions: PredictionResult[]): number {
  if (predictions.length === 0) return 0;
  const sum = predictions.reduce((a, p) => a + p.seconds, 0);
  return sum / predictions.length;
}

/* -----------------------------------------------------------------
 * Sub-target gap
 * --------------------------------------------------------------- */

export interface SubTarget {
  key: string;
  labelJa: string;
  /** target time in seconds */
  seconds: number;
  /** which canonical race distance (meters) the target is for */
  distanceMeters: number;
}

export const FULL_SUB_TARGETS: SubTarget[] = [
  { key: "sub5", labelJa: "サブ5", seconds: 5 * 3600, distanceMeters: 42195 },
  { key: "sub4", labelJa: "サブ4", seconds: 4 * 3600, distanceMeters: 42195 },
  { key: "sub3.5", labelJa: "サブ3.5", seconds: 3.5 * 3600, distanceMeters: 42195 },
  { key: "sub3", labelJa: "サブ3", seconds: 3 * 3600, distanceMeters: 42195 },
  { key: "sub2.5", labelJa: "サブ2.5", seconds: 2.5 * 3600, distanceMeters: 42195 },
];

export const HALF_SUB_TARGETS: SubTarget[] = [
  { key: "halfSub2", labelJa: "ハーフ サブ2", seconds: 2 * 3600, distanceMeters: 21097.5 },
  {
    key: "halfSub1.75",
    labelJa: "ハーフ サブ1:45",
    seconds: 1.75 * 3600,
    distanceMeters: 21097.5,
  },
  { key: "halfSub1.5", labelJa: "ハーフ サブ1:30", seconds: 1.5 * 3600, distanceMeters: 21097.5 },
];

export function nextSubTargetGap(
  predictedSec: number,
  targetDistanceM: number,
): { target: SubTarget; gapSec: number; achieved: boolean } | null {
  const isFull = Math.abs(targetDistanceM - 42195) < 1;
  const isHalf = Math.abs(targetDistanceM - 21097.5) < 1;
  const list = isFull ? FULL_SUB_TARGETS : isHalf ? HALF_SUB_TARGETS : null;
  if (!list) return null;
  // Find the next sub target the runner has NOT yet achieved (i.e. the smallest target > predicted).
  // Predicted < target means already achieved.
  const sorted = [...list].sort((a, b) => b.seconds - a.seconds);
  for (const t of sorted) {
    if (predictedSec > t.seconds) {
      return { target: t, gapSec: predictedSec - t.seconds, achieved: false };
    }
  }
  // Already faster than the fastest tier — show it as achieved.
  const fastest = sorted[sorted.length - 1];
  if (!fastest) return null;
  return { target: fastest, gapSec: predictedSec - fastest.seconds, achieved: true };
}
