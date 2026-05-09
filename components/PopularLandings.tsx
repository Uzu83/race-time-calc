import Link from "next/link";
import { DISTANCES } from "@/lib/distance";
import { getDict } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import { allPresets, type LandingPreset, landingSlug } from "@/lib/seo-landings";
import { formatTime } from "@/lib/time";

interface Props {
  locale: Locale;
  /** Optional limit (default: all presets) */
  limit?: number;
  /** Optional preset filter to scope what's shown (e.g. only 10K → full) */
  filter?: (p: LandingPreset) => boolean;
  /** Optional title override */
  title?: string;
}

/**
 * Server component — shown on the home page and as internal "you might also try"
 * footer on result pages. Pure SEO + UX hub.
 */
export default function PopularLandings({ locale, limit, filter, title }: Props) {
  const t = getDict(locale);
  const presets = allPresets().filter(filter ?? (() => true));
  const sliced = limit ? presets.slice(0, limit) : presets;
  if (sliced.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-(--color-accent-soft)">
        {title ?? t.home.popularHeading}
      </h2>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {sliced.map((p) => {
          const slug = landingSlug(p);
          const fromPace = p.fromTimeSec / (DISTANCES[p.fromKey] / 1000);
          return (
            <li key={slug}>
              <Link
                href={`/predict/${slug}`}
                className="flex items-baseline justify-between gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-xs hover:border-(--color-accent)/40 hover:bg-(--color-accent)/5"
              >
                <span className="font-mono">
                  {t.distances[p.fromKey]} {formatTime(p.fromTimeSec)}
                </span>
                <span className="text-(--color-text-muted)">→ {t.distances[p.toKey]}</span>
                <span className="ml-auto text-[10px] text-(--color-text-muted)/70">
                  {fmtPace(fromPace)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function fmtPace(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm - m * 60);
  return `${m}'${s.toString().padStart(2, "0")}"/km`;
}
