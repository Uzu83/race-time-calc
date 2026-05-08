/**
 * Heat adjustment for marathon pace.
 *
 * Daniels' rule of thumb: every +5°C above ~10°C costs about 1.6% in marathon pace.
 * For shorter races the effect is milder; we scale by distance fraction of marathon.
 *
 * Above 20°C the relation steepens — empirically pace falls more like 2% per 5°C.
 */

const BASELINE_TEMP_C = 10;

export function paceMultiplierForTemp(tempC: number, distanceMeters: number): number {
  const delta = tempC - BASELINE_TEMP_C;
  if (delta <= 0) return 1; // cool conditions: assume baseline
  const stepsCool = Math.min(delta / 5, (20 - BASELINE_TEMP_C) / 5); // up to 20°C
  const stepsHot = Math.max(0, (tempC - 20) / 5);

  // Distance scaling: marathon = 1.0, 5K ≈ 0.4
  const marathonFraction = Math.min(1, Math.max(0.35, distanceMeters / 42195));

  const slowdown = (stepsCool * 0.016 + stepsHot * 0.02) * marathonFraction;
  return 1 + slowdown;
}

export function adjustedTime(baselineSec: number, tempC: number, distanceMeters: number): number {
  return baselineSec * paceMultiplierForTemp(tempC, distanceMeters);
}
