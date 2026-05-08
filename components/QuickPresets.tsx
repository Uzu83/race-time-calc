"use client";

import Link from "next/link";
import { type DistanceKey, paceSecondsPerKmToString } from "@/lib/distance";
import { encodeInput } from "@/lib/encoding";
import { useI18n } from "@/lib/i18n/Provider";

interface Preset {
  fromKey: DistanceKey;
  fromTimeSec: number;
  toKey: DistanceKey;
  highlight?: boolean;
}

const PRESETS: Preset[] = [
  { fromKey: "10k", fromTimeSec: 50 * 60, toKey: "full", highlight: true },
  { fromKey: "10k", fromTimeSec: 45 * 60, toKey: "full" },
  { fromKey: "10k", fromTimeSec: 40 * 60, toKey: "full" },
  { fromKey: "5k", fromTimeSec: 25 * 60, toKey: "full" },
  { fromKey: "5k", fromTimeSec: 22 * 60, toKey: "full" },
  { fromKey: "half", fromTimeSec: 1 * 3600 + 50 * 60, toKey: "full" },
  { fromKey: "half", fromTimeSec: 1 * 3600 + 35 * 60, toKey: "full" },
  { fromKey: "half", fromTimeSec: 1 * 3600 + 25 * 60, toKey: "full" },
];

function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec - h * 3600) / 60);
  const s = sec - h * 3600 - m * 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QuickPresets() {
  const { t } = useI18n();
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-(--color-accent-soft)">{t.home.quickHeading}</h2>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">{t.home.quickSub}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {PRESETS.map((p) => {
          const hash = encodeInput({
            fromKey: p.fromKey,
            fromTimeSec: p.fromTimeSec,
            toKey: p.toKey,
          });
          return (
            <Link
              key={hash}
              href={`/result/${hash}`}
              className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-all hover:scale-[1.01] hover:border-(--color-accent)/60 ${
                p.highlight
                  ? "border-(--color-accent)/40 bg-(--color-accent)/8"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="text-sm">
                <div className="font-mono font-bold">
                  {t.distances[p.fromKey]} {fmtTime(p.fromTimeSec)}
                </div>
                <div className="text-[11px] text-(--color-text-muted)">
                  {paceSecondsPerKmToString(p.fromTimeSec / distanceKm(p.fromKey))}
                </div>
              </div>
              <div className="text-(--color-text-muted) transition-transform group-hover:translate-x-1">
                → {t.distances[p.toKey]}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function distanceKm(k: DistanceKey): number {
  const m: Record<DistanceKey, number> = {
    "3k": 3,
    "5k": 5,
    "10k": 10,
    "15k": 15,
    half: 21.0975,
    "30k": 30,
    full: 42.195,
  };
  return m[k];
}
