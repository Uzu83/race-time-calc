"use client";

import { DISTANCES, type DistanceKey, paceSecondsPerKmToString } from "@/lib/distance";
import type { EquivalentRow } from "@/lib/equivalents";
import { useI18n } from "@/lib/i18n/Provider";
import { formatTime } from "@/lib/time";

interface Props {
  rows: EquivalentRow[];
  highlightKey?: DistanceKey;
}

export default function EquivalentTimes({ rows, highlightKey }: Props) {
  const { t } = useI18n();
  return (
    <section className="rounded-2xl border border-white/10 bg-(--color-card) p-5">
      <h2 className="mb-1 text-sm font-bold text-(--color-accent-soft)">
        {t.result.equivalentTitle}
      </h2>
      <p className="mb-3 text-xs text-(--color-text-muted)">{t.result.equivalentSub}</p>
      <div className="overflow-hidden rounded-lg border border-white/5">
        <table className="w-full text-sm">
          <thead className="bg-black/30 text-[11px] uppercase tracking-wider text-(--color-text-muted)">
            <tr>
              <th className="px-3 py-2 text-left font-medium">{t.form.targetDistance}</th>
              <th className="px-3 py-2 text-right font-medium">{t.form.currentTime}</th>
              <th className="px-3 py-2 text-right font-medium">{t.form.pace}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isHi = r.key === highlightKey;
              const meters = DISTANCES[r.key];
              const sec = r.seconds;
              const pace = sec / (meters / 1000);
              return (
                <tr
                  key={r.key}
                  className={`border-t border-white/5 ${
                    isHi ? "bg-(--color-accent)/10" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="px-3 py-2">
                    {isHi && <span className="mr-1 text-(--color-accent)">▶</span>}
                    {t.distances[r.key]}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {formatTime(sec, { forceHours: sec >= 3600 })}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-(--color-text-muted)">
                    {paceSecondsPerKmToString(pace)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
