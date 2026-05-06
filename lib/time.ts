export interface HMS {
  h: number;
  m: number;
  s: number;
}

export function secondsToHMS(total: number): HMS {
  if (!Number.isFinite(total) || total < 0) return { h: 0, m: 0, s: 0 };
  const t = Math.round(total);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t - h * 3600) / 60);
  const s = t - h * 3600 - m * 60;
  return { h, m, s };
}

export function hmsToSeconds({ h, m, s }: HMS): number {
  return h * 3600 + m * 60 + s;
}

/**
 * "4:23:15" / "1:30:45" / "45:30" / "5:00" → seconds.
 * Returns null on parse failure.
 */
export function parseTimeString(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(":").map((p) => p.trim());
  if (parts.length < 2 || parts.length > 3) return null;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isFinite(n) || n < 0)) return null;
  if (parts.length === 3) {
    const [h, m, s] = nums as [number, number, number];
    if (m >= 60 || s >= 60) return null;
    return h * 3600 + m * 60 + s;
  }
  const [m, s] = nums as [number, number];
  if (s >= 60) return null;
  return m * 60 + s;
}

/** "4:23:15" or "45:30" depending on magnitude. */
export function formatTime(totalSec: number, opts: { forceHours?: boolean } = {}): string {
  const { h, m, s } = secondsToHMS(totalSec);
  const ss = s.toString().padStart(2, "0");
  if (h > 0 || opts.forceHours) {
    const mm = m.toString().padStart(2, "0");
    return `${h}:${mm}:${ss}`;
  }
  return `${m}:${ss}`;
}

/** "4時間23分15秒" — Japanese readable format, omits zero leading parts. */
export function formatTimeJa(totalSec: number): string {
  const { h, m, s } = secondsToHMS(totalSec);
  const out: string[] = [];
  if (h > 0) out.push(`${h}時間`);
  if (m > 0 || h > 0) out.push(`${m}分`);
  out.push(`${s}秒`);
  return out.join("");
}

export function formatSignedDelta(seconds: number): string {
  const sign = seconds >= 0 ? "+" : "−";
  const abs = Math.abs(Math.round(seconds));
  const { h, m, s } = secondsToHMS(abs);
  if (h > 0)
    return `${sign}${h}h${m.toString().padStart(2, "0")}m${s.toString().padStart(2, "0")}s`;
  if (m > 0) return `${sign}${m}分${s.toString().padStart(2, "0")}秒`;
  return `${sign}${s}秒`;
}
