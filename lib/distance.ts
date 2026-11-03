export const DISTANCES = {
  "3k": 3000,
  "5k": 5000,
  "10k": 10000,
  "15k": 15000,
  half: 21097.5,
  "30k": 30000,
  full: 42195,
} as const;

export type DistanceKey = keyof typeof DISTANCES;

export const DISTANCE_LABEL_JA: Record<DistanceKey, string> = {
  "3k": "3km",
  "5k": "5km",
  "10k": "10km",
  "15k": "15km",
  half: "ハーフ (21.0975km)",
  "30k": "30km",
  full: "フル (42.195km)",
};

export const DISTANCE_SHORT_JA: Record<DistanceKey, string> = {
  "3k": "3K",
  "5k": "5K",
  "10k": "10K",
  "15k": "15K",
  half: "ハーフ",
  "30k": "30K",
  full: "フル",
};

export function isDistanceKey(value: string): value is DistanceKey {
  return value in DISTANCES;
}

export function metersOf(key: DistanceKey): number {
  return DISTANCES[key];
}

/** 現在距離と目標が同じになったとき、予測できる目標へずらす。初回の 5K はフル（#10）。 */
export function targetAfterFromChange(from: DistanceKey, to: DistanceKey): DistanceKey {
  if (from !== to) return to;
  if (from !== "full") return "full";
  return "half";
}

export function paceSecondsPerKm(distanceMeters: number, totalSeconds: number): number {
  if (distanceMeters <= 0 || totalSeconds <= 0) return 0;
  return totalSeconds / (distanceMeters / 1000);
}

export function paceSecondsPerKmToString(secPerKm: number): string {
  if (!Number.isFinite(secPerKm) || secPerKm <= 0) return "—";
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm - m * 60);
  // handle 60s rollover
  if (s === 60) return `${m + 1}'00"/km`;
  return `${m}'${s.toString().padStart(2, "0")}"/km`;
}
