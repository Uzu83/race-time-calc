/**
 * 5K-segment split planner.
 * - "even": every 5K segment runs at the same average pace.
 * - "negative": back half is ~1% faster than the front half (a classic marathon strategy).
 */

export type SplitStrategy = "even" | "negative";

export interface SplitRow {
  /** segment label, e.g. "0-5km", "40-42.195km" */
  label: string;
  /** segment time in seconds */
  segmentSec: number;
  /** cumulative time in seconds at end of segment */
  cumulativeSec: number;
  /** segment distance in km */
  segmentKm: number;
}

export function planSplits(
  totalDistanceKm: number,
  totalSec: number,
  strategy: SplitStrategy,
): SplitRow[] {
  if (totalDistanceKm <= 0 || totalSec <= 0) return [];
  const fullSegments = Math.floor(totalDistanceKm / 5);
  const remainder = totalDistanceKm - fullSegments * 5;
  const segments: { km: number; weight: number }[] = [];

  for (let i = 0; i < fullSegments; i++) {
    segments.push({
      km: 5,
      weight: weightFor(i, fullSegments + (remainder > 0 ? 1 : 0), strategy),
    });
  }
  if (remainder > 0) {
    segments.push({
      km: remainder,
      weight: weightFor(fullSegments, fullSegments + 1, strategy) * (remainder / 5),
    });
  }

  // total weight must equal totalSec → normalize
  const totalWeight = segments.reduce((a, s) => a + s.weight, 0);
  if (totalWeight === 0) return [];
  const sec = (w: number) => (w / totalWeight) * totalSec;

  let cum = 0;
  const rows: SplitRow[] = [];
  let runStartKm = 0;
  for (const s of segments) {
    const segSec = sec(s.weight);
    cum += segSec;
    const endKm = runStartKm + s.km;
    rows.push({
      label: `${formatKm(runStartKm)}–${formatKm(endKm)}km`,
      segmentSec: segSec,
      cumulativeSec: cum,
      segmentKm: s.km,
    });
    runStartKm = endKm;
  }
  return rows;
}

function weightFor(idx: number, total: number, strategy: SplitStrategy): number {
  if (strategy === "even") return 1;
  // Negative split: back half ~1% faster (i.e. lower weight per unit distance)
  // Linearly interpolate from +0.5% (start) to -0.5% (finish).
  const t = total <= 1 ? 0 : idx / (total - 1);
  const pct = 0.005 - 0.01 * t; // +0.5% → -0.5%
  return 1 + pct;
}

function formatKm(km: number): string {
  if (Number.isInteger(km)) return km.toString();
  return km.toFixed(km % 1 < 0.05 ? 0 : 3).replace(/\.?0+$/, "");
}

export function formatSegmentTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec - m * 60);
  if (s === 60) return `${m + 1}:00`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
