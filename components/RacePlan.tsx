"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/Provider";
import { formatSegmentTime, planSplits, type SplitStrategy } from "@/lib/splits";
import { formatTime } from "@/lib/time";

interface Props {
  totalKm: number;
  totalSec: number;
}

export default function RacePlan({ totalKm, totalSec }: Props) {
  const { t } = useI18n();
  const [strategy, setStrategy] = useState<SplitStrategy>("even");
  const rows = useMemo(
    () => planSplits(totalKm, totalSec, strategy),
    [totalKm, totalSec, strategy],
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-(--color-card) p-5">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-bold text-(--color-accent-soft)">{t.result.racePlanTitle}</h2>
        <div
          className="inline-flex rounded-md border border-white/10 bg-black/20 p-0.5 text-xs"
          role="tablist"
          aria-label="strategy"
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
      </div>
      <p className="mb-3 text-xs text-(--color-text-muted)">{t.result.racePlanSub}</p>
      <div className="overflow-hidden rounded-lg border border-white/5">
        <table className="w-full text-sm">
          <thead className="bg-black/30 text-[11px] uppercase tracking-wider text-(--color-text-muted)">
            <tr>
              <th className="px-3 py-2 text-left font-medium">{t.result.splitKm}</th>
              <th className="px-3 py-2 text-right font-medium">{t.result.splitTime}</th>
              <th className="px-3 py-2 text-right font-medium">{t.result.splitCum}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-3 py-2 font-mono text-xs">{r.label}</td>
                <td className="px-3 py-2 text-right font-mono">
                  {formatSegmentTime(r.segmentSec)}
                </td>
                <td className="px-3 py-2 text-right font-mono text-(--color-text-muted)">
                  {formatTime(r.cumulativeSec, { forceHours: r.cumulativeSec >= 3600 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
