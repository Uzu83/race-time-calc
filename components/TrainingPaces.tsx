"use client";

import { useI18n } from "@/lib/i18n/Provider";
import { formatPaceRange, type ZoneKey, type ZonePaces } from "@/lib/training-paces";

interface Props {
  vdot: number;
  paces: ZonePaces[];
}

const ZONE_BG: Record<ZoneKey, string> = {
  easy: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  marathon: "from-(--color-rune)/20 to-(--color-rune)/5 border-(--color-rune)/30",
  threshold: "from-(--color-victory)/20 to-(--color-victory)/5 border-(--color-victory)/30",
  interval: "from-orange-500/20 to-orange-500/5 border-orange-500/30",
  repetition: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
};

export default function TrainingPaces({ vdot, paces }: Props) {
  const { t } = useI18n();
  const zoneText = (z: ZoneKey) => {
    switch (z) {
      case "easy":
        return { label: t.zones.easy, desc: t.zones.easyDesc };
      case "marathon":
        return { label: t.zones.marathon, desc: t.zones.marathonDesc };
      case "threshold":
        return { label: t.zones.threshold, desc: t.zones.thresholdDesc };
      case "interval":
        return { label: t.zones.interval, desc: t.zones.intervalDesc };
      case "repetition":
        return { label: t.zones.repetition, desc: t.zones.repetitionDesc };
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-(--color-card) p-5">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold text-(--color-accent-soft)">
          {t.result.trainingPacesTitle}
        </h2>
        <span className="font-mono text-xs text-(--color-text-muted)">VDOT {vdot.toFixed(1)}</span>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-(--color-text-muted)">
        {t.result.trainingPacesSub}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {paces.map((p) => {
          const { label, desc } = zoneText(p.zone);
          return (
            <div
              key={p.zone}
              className={`rounded-xl border bg-gradient-to-br p-3 ${ZONE_BG[p.zone]}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-xs font-bold tracking-wide">{label}</h3>
                <span className="font-mono text-sm font-bold">
                  {formatPaceRange(p.fastSecPerKm, p.slowSecPerKm)}/km
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-(--color-text-muted)">{desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
