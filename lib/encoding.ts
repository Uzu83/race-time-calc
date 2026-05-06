/**
 * URL-encoded race input. Format:
 *   {fromKey}-{fromTimeSec}-{toKey}
 *   e.g. "10k-2700-full"  → 10km in 45:00 → predict full
 *
 * The hash IS the data. No backend, no DB. Same hash → same prediction, always.
 */
import { type DistanceKey, isDistanceKey } from "./distance";

export interface RaceInput {
  fromKey: DistanceKey;
  fromTimeSec: number;
  toKey: DistanceKey;
}

const SEP = "-";

export function encodeInput(input: RaceInput): string {
  const t = Math.max(0, Math.round(input.fromTimeSec));
  return `${input.fromKey}${SEP}${t}${SEP}${input.toKey}`;
}

export function decodeInput(hash: string): RaceInput | null {
  const parts = hash.split(SEP);
  if (parts.length !== 3) return null;
  const [fromKey, tStr, toKey] = parts as [string, string, string];
  if (!isDistanceKey(fromKey) || !isDistanceKey(toKey)) return null;
  const fromTimeSec = Number(tStr);
  if (!Number.isInteger(fromTimeSec) || fromTimeSec <= 0 || fromTimeSec > 24 * 3600) return null;
  return { fromKey, fromTimeSec, toKey };
}
