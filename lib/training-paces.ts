/**
 * Daniels VDOT-based training paces.
 *
 * Each zone is defined as a fraction of VO2max. We compute the velocity (m/min) at
 * which `vo2(v) = pct·VDOT`, then convert to sec/km.
 *
 * Reference percentages from Daniels' Running Formula:
 *   E (Easy):       59–74% (use 65% for the central anchor)
 *   M (Marathon):   75–84% (use 82%)
 *   T (Threshold):  83–88% (use 88%)
 *   I (Interval):   95–100% (use 98%)
 *   R (Repetition): ~105% effective (use 105% as Daniels' working number)
 */

export type ZoneKey = "easy" | "marathon" | "threshold" | "interval" | "repetition";

export const ZONE_ORDER: ZoneKey[] = ["easy", "marathon", "threshold", "interval", "repetition"];

const ZONE_PCT: Record<ZoneKey, { lo: number; hi: number; mid: number }> = {
  easy: { lo: 0.59, hi: 0.74, mid: 0.66 },
  marathon: { lo: 0.78, hi: 0.85, mid: 0.82 },
  threshold: { lo: 0.86, hi: 0.9, mid: 0.88 },
  interval: { lo: 0.95, hi: 1.0, mid: 0.98 },
  repetition: { lo: 1.03, hi: 1.08, mid: 1.05 },
};

/** vo2 = -4.6 + 0.182258·v + 0.000104·v² → solve for v given target vo2. */
function velocityForVo2(targetVo2: number): number {
  // Quadratic: 0.000104·v² + 0.182258·v + (-4.6 - target) = 0
  const a = 0.000104;
  const b = 0.182258;
  const c = -4.6 - targetVo2;
  const disc = b * b - 4 * a * c;
  const v = (-b + Math.sqrt(Math.max(disc, 0))) / (2 * a);
  return v; // m/min
}

/** Returns sec/km for a given pct of VDOT. */
export function paceSecPerKmAtPct(vdot: number, pct: number): number {
  const targetVo2 = vdot * pct;
  const vMpm = velocityForVo2(targetVo2);
  if (vMpm <= 0) return 0;
  return 60_000 / vMpm; // sec per km
}

export interface ZonePaces {
  zone: ZoneKey;
  fastSecPerKm: number;
  slowSecPerKm: number;
  midSecPerKm: number;
}

export function trainingPaces(vdot: number): ZonePaces[] {
  return ZONE_ORDER.map((zone) => {
    const { lo, hi, mid } = ZONE_PCT[zone];
    return {
      zone,
      fastSecPerKm: paceSecPerKmAtPct(vdot, hi), // higher % = faster
      slowSecPerKm: paceSecPerKmAtPct(vdot, lo),
      midSecPerKm: paceSecPerKmAtPct(vdot, mid),
    };
  });
}

export function formatPaceRange(fastSec: number, slowSec: number): string {
  if (!Number.isFinite(fastSec) || !Number.isFinite(slowSec)) return "—";
  return `${fmt(fastSec)}–${fmt(slowSec)}`;
}

function fmt(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm - m * 60);
  if (s === 60) return `${m + 1}'00"`;
  return `${m}'${s.toString().padStart(2, "0")}"`;
}
