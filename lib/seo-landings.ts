/**
 * SEO landing pages — programmatic routes at /predict/[slug] for popular
 * race-time queries (e.g. "10K 45:00 から フルマラソン予測").
 *
 * Slug format: `{fromKey}-{time}-{toKey}`, where time is "MM-SS" or "H-MM-SS".
 * Distance keys never contain "-", so the slug is unambiguous when split by "-".
 *   10k-45-00-full      → 10K 45:00 → marathon
 *   half-1-45-00-full   → half 1:45:00 → marathon
 *   5k-22-30-half       → 5K 22:30 → half
 */
import { type DistanceKey, isDistanceKey } from "./distance";
import type { RaceInput } from "./encoding";
import { formatTime } from "./time";

export interface LandingPreset {
  fromKey: DistanceKey;
  fromTimeSec: number;
  toKey: DistanceKey;
}

/**
 * Curated list of common search queries — chosen for strong long-tail SEO
 * fits ("サブ4 ペース", "10K 45分 フル予測", etc.). Keep ~30 to stay focused.
 */
const PRESETS: readonly LandingPreset[] = [
  // 10K → full
  { fromKey: "10k", fromTimeSec: 60 * 60, toKey: "full" },
  { fromKey: "10k", fromTimeSec: 55 * 60, toKey: "full" },
  { fromKey: "10k", fromTimeSec: 50 * 60, toKey: "full" },
  { fromKey: "10k", fromTimeSec: 45 * 60, toKey: "full" },
  { fromKey: "10k", fromTimeSec: 40 * 60, toKey: "full" },
  { fromKey: "10k", fromTimeSec: 38 * 60, toKey: "full" },
  { fromKey: "10k", fromTimeSec: 35 * 60, toKey: "full" },
  // 5K → full
  { fromKey: "5k", fromTimeSec: 30 * 60, toKey: "full" },
  { fromKey: "5k", fromTimeSec: 25 * 60, toKey: "full" },
  { fromKey: "5k", fromTimeSec: 22 * 60, toKey: "full" },
  { fromKey: "5k", fromTimeSec: 20 * 60, toKey: "full" },
  { fromKey: "5k", fromTimeSec: 18 * 60, toKey: "full" },
  // half → full
  { fromKey: "half", fromTimeSec: 2 * 3600, toKey: "full" },
  { fromKey: "half", fromTimeSec: 1 * 3600 + 50 * 60, toKey: "full" },
  { fromKey: "half", fromTimeSec: 1 * 3600 + 40 * 60, toKey: "full" },
  { fromKey: "half", fromTimeSec: 1 * 3600 + 30 * 60, toKey: "full" },
  { fromKey: "half", fromTimeSec: 1 * 3600 + 20 * 60, toKey: "full" },
  // 5K → half / 10K
  { fromKey: "5k", fromTimeSec: 25 * 60, toKey: "half" },
  { fromKey: "5k", fromTimeSec: 22 * 60, toKey: "half" },
  { fromKey: "5k", fromTimeSec: 20 * 60, toKey: "10k" },
  { fromKey: "5k", fromTimeSec: 22 * 60, toKey: "10k" },
  // 10K → half
  { fromKey: "10k", fromTimeSec: 50 * 60, toKey: "half" },
  { fromKey: "10k", fromTimeSec: 45 * 60, toKey: "half" },
  { fromKey: "10k", fromTimeSec: 40 * 60, toKey: "half" },
  // 30K → full (a popular reality-check route in Japan)
  { fromKey: "30k", fromTimeSec: 3 * 3600, toKey: "full" },
  { fromKey: "30k", fromTimeSec: 2 * 3600 + 30 * 60, toKey: "full" },
  { fromKey: "30k", fromTimeSec: 2 * 3600 + 15 * 60, toKey: "full" },
];

function timePart(sec: number): string {
  // formatTime returns "MM:SS" or "H:MM:SS"; we swap colons for hyphens for the URL.
  return formatTime(sec, { forceHours: false }).replace(/:/g, "-");
}

export function landingSlug(p: LandingPreset): string {
  return `${p.fromKey}-${timePart(p.fromTimeSec)}-${p.toKey}`;
}

export const POPULAR_PREDICT_SLUGS: readonly string[] = PRESETS.map(landingSlug);

export function allPresets(): readonly LandingPreset[] {
  return PRESETS;
}

/**
 * Parse a landing slug back into a RaceInput.
 * Returns null on any parse failure (used to 404 unknown slugs).
 */
export function parseLandingSlug(slug: string): RaceInput | null {
  const parts = slug.split("-").filter((p) => p.length > 0);
  if (parts.length < 4) return null;
  const fromKey = parts[0]!;
  const toKey = parts[parts.length - 1]!;
  if (!isDistanceKey(fromKey) || !isDistanceKey(toKey)) return null;
  const middle = parts.slice(1, -1);
  if (middle.length < 2 || middle.length > 3) return null;
  const nums = middle.map((p) => Number(p));
  if (nums.some((n) => !Number.isFinite(n) || n < 0 || !Number.isInteger(n))) return null;
  let totalSec: number;
  if (nums.length === 2) {
    const [m, s] = nums as [number, number];
    if (m >= 60 || s >= 60) return null;
    totalSec = m * 60 + s;
  } else {
    const [h, m, s] = nums as [number, number, number];
    if (m >= 60 || s >= 60) return null;
    totalSec = h * 3600 + m * 60 + s;
  }
  if (totalSec <= 0 || totalSec > 24 * 3600) return null;
  return { fromKey, fromTimeSec: totalSec, toKey };
}

/** A small cluster of "you might also try" links for internal-linking SEO. */
export function relatedPresets(current: RaceInput, limit = 6): LandingPreset[] {
  const same = PRESETS.filter((p) => !sameInput(p, current));
  // Prefer same fromKey, then same toKey, then everything else.
  const sameFrom = same.filter((p) => p.fromKey === current.fromKey);
  const sameTo = same.filter((p) => p.toKey === current.toKey && p.fromKey !== current.fromKey);
  const rest = same.filter((p) => p.fromKey !== current.fromKey && p.toKey !== current.toKey);
  return [...sameFrom, ...sameTo, ...rest].slice(0, limit);
}

function sameInput(a: LandingPreset, b: RaceInput): boolean {
  return a.fromKey === b.fromKey && a.toKey === b.toKey && a.fromTimeSec === b.fromTimeSec;
}
