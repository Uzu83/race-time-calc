"use client";

import { useState } from "react";
import { adjustedTime, paceMultiplierForTemp } from "@/lib/heat";
import { useI18n } from "@/lib/i18n/Provider";
import { formatTime } from "@/lib/time";

interface Props {
  baselineSec: number;
  distanceMeters: number;
}

export default function HeatAdjuster({ baselineSec, distanceMeters }: Props) {
  const { t } = useI18n();
  const [temp, setTemp] = useState(15);
  const adj = adjustedTime(baselineSec, temp, distanceMeters);
  const slowdownPct = (paceMultiplierForTemp(temp, distanceMeters) - 1) * 100;
  const isHot = temp >= 20;

  return (
    <section className="rounded-2xl border border-white/10 bg-(--color-card) p-5">
      <h2 className="mb-1 text-sm font-bold text-(--color-accent-soft)">{t.result.heatTitle}</h2>
      <p className="mb-4 text-xs leading-relaxed text-(--color-text-muted)">{t.result.heatSub}</p>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor="temp" className="text-xs font-medium">
            {t.result.heatTemp}
          </label>
          <span
            className={`font-mono text-lg font-bold ${
              isHot ? "text-orange-300" : "text-(--color-rune)"
            }`}
          >
            {temp}°C
          </span>
        </div>
        <input
          id="temp"
          type="range"
          min={-5}
          max={35}
          step={1}
          value={temp}
          onChange={(e) => setTemp(Number(e.target.value))}
          className="w-full accent-(--color-accent)"
        />
        <div className="flex justify-between text-[10px] text-(--color-text-muted)">
          <span>−5°C</span>
          <span>10°C</span>
          <span>20°C</span>
          <span>35°C</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <div className="text-[10px] text-(--color-text-muted)">{t.result.heatAdjusted}</div>
          <div
            className={`font-mono text-2xl font-bold ${
              isHot ? "text-orange-300" : "text-(--color-text)"
            }`}
          >
            {formatTime(adj, { forceHours: adj >= 3600 })}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/30 p-3">
          <div className="text-[10px] text-(--color-text-muted)">Δ</div>
          <div className="font-mono text-2xl font-bold">+{slowdownPct.toFixed(1)}%</div>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-(--color-text-muted)">
        {t.result.heatNote}
      </p>
    </section>
  );
}
