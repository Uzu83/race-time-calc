"use client";

import { useMemo } from "react";

interface Props {
  /** total target distance in km */
  totalKm: number;
  /** average pace in sec/km */
  avgPaceSec: number;
}

/**
 * Simple SVG pace chart — assumes negative-split-friendly even pacing
 * with a small +5s/km drift after 30km to reflect real fatigue.
 * No external charting library: keeps the bundle tiny.
 */
export default function PaceChart({ totalKm, avgPaceSec }: Props) {
  const lapPlan = useMemo(() => {
    const km = Math.floor(totalKm);
    const out: { km: number; paceSec: number }[] = [];
    for (let i = 1; i <= km; i++) {
      // pace drift: stay flat 1..30km, +0.5s/km/km after 30
      const drift = i <= 30 ? 0 : (i - 30) * 0.5;
      out.push({ km: i, paceSec: avgPaceSec + drift });
    }
    return out;
  }, [totalKm, avgPaceSec]);

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
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-lg bg-black/30"
        role="img"
        aria-label="設定ペースラップチャート"
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
      <p className="text-[10px] text-(--color-text-muted)">
        30km 以降は +0.5秒/km/km
        の自然な減速を含む推奨ラップ。前半を抑えて後半をこの形に近づけると失速しにくい。
      </p>
    </div>
  );
}
