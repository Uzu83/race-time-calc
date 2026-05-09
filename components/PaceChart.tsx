"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/Provider";

interface Props {
  /** total target distance in km */
  totalKm: number;
  /** average pace in sec/km */
  avgPaceSec: number;
}

type Strategy = "even" | "negative";

/**
 * Simple SVG pace chart — assumes negative-split-friendly even pacing
 * with a small +0.5s/km/km drift after 30km in "even" mode (real-world fade).
 * The "negative" mode shows the optimum target: −0.5%/km in the back half.
 * No external charting library: keeps the bundle tiny.
 */
export default function PaceChart({ totalKm, avgPaceSec }: Props) {
  const { t } = useI18n();
  const [strategy, setStrategy] = useState<Strategy>("even");

  const lapPlan = useMemo(() => {
    const km = Math.floor(totalKm);
    const out: { km: number; paceSec: number }[] = [];
    for (let i = 1; i <= km; i++) {
      let paceSec: number;
      if (strategy === "even") {
        // pace drift: stay flat 1..30km, +0.5s/km/km after 30
        const drift = i <= 30 ? 0 : (i - 30) * 0.5;
        paceSec = avgPaceSec + drift;
      } else {
        // negative split: front half +0.5%, back half −0.5%, linear
        const t = km <= 1 ? 0 : (i - 1) / (km - 1);
        const pct = 0.005 - 0.01 * t;
        paceSec = avgPaceSec * (1 + pct);
      }
      out.push({ km: i, paceSec });
    }
    return out;
  }, [totalKm, avgPaceSec, strategy]);

  if (lapPlan.length === 0) return null;

  const minPace = Math.min(...lapPlan.map((l) => l.paceSec));
  const maxPace = Math.max(...lapPlan.map((l) => l.paceSec));
  const range = Math.max(maxPace - minPace, 30); // at least 30s vertical range

  const W = 320;
  const H = 120;
  const PAD_X = 24;
  const PAD_Y = 16;

  const xFor = (km: number) =>
    PAD_X + ((km - 1) / Math.max(lapPlan.length - 1, 1)) * (W - PAD_X * 2);
  const yFor = (pace: number) => PAD_Y + ((pace - minPace) / range) * (H - PAD_Y * 2);

  const linePath = lapPlan
    .map((l, i) => `${i === 0 ? "M" : "L"} ${xFor(l.km).toFixed(1)} ${yFor(l.paceSec).toFixed(1)}`)
    .join(" ");

  const fmt = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec - m * 60);
    return `${m}'${s.toString().padStart(2, "0")}"`;
  };

  return (
    <div className="space-y-2">
      <div
        className="inline-flex rounded-md border border-white/10 bg-black/20 p-0.5 text-xs"
        role="tablist"
        aria-label="pace strategy"
      >
        {(["even", "negative"] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={strategy === s}
            onClick={() => setStrategy(s)}
            className={`rounded px-2.5 py-1 transition-colors ${
              strategy === s
                ? "bg-(--color-accent) text-black"
                : "text-(--color-text-muted) hover:text-(--color-text)"
            }`}
          >
            {s === "even" ? t.result.racePlanEven : t.result.racePlanNegative}
          </button>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-lg bg-black/30"
        role="img"
        aria-label={t.result.paceLapTitle}
      >
        <line
          x1={PAD_X}
          x2={W - PAD_X}
          y1={H / 2}
          y2={H / 2}
          stroke="rgba(255,255,255,0.07)"
          strokeDasharray="3 3"
        />
        <path d={linePath} stroke="var(--color-accent)" strokeWidth={2} fill="none" />
        {lapPlan.map((l) => (
          <circle
            key={l.km}
            cx={xFor(l.km)}
            cy={yFor(l.paceSec)}
            r={l.km % 5 === 0 ? 2.5 : 1.2}
            fill={l.km % 5 === 0 ? "var(--color-accent)" : "rgba(255,122,69,0.6)"}
          />
        ))}
        <text x={PAD_X} y={12} fontSize="9" fill="rgba(255,255,255,0.5)">
          {fmt(minPace)}/km
        </text>
        <text x={PAD_X} y={H - 4} fontSize="9" fill="rgba(255,255,255,0.5)">
          {fmt(maxPace)}/km
        </text>
        <text x={W - PAD_X - 24} y={H - 4} fontSize="9" fill="rgba(255,255,255,0.5)">
          {Math.round(totalKm)}km
        </text>
      </svg>
      <p className="text-[10px] text-(--color-text-muted)">{t.result.paceLapNote}</p>
    </div>
  );
}
