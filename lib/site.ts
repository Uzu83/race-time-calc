/**
 * Single source of truth for the canonical site URL + public support links.
 * Falls back to a stub for local builds; always set NEXT_PUBLIC_SITE_URL in prod.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://race-time-calc.example.com"
).replace(/\/$/, "");

/** Ko-fi tip jar (same handle as sister apps). Override via env if needed. */
export const KOFI_URL = (process.env.NEXT_PUBLIC_KOFI_URL ?? "https://ko-fi.com/uz_u83").replace(
  /\/$/,
  "",
);

export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  return path.startsWith("/") ? `${SITE_URL}${path}` : `${SITE_URL}/${path}`;
}
