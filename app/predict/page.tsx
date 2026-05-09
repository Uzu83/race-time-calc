import type { Metadata } from "next";
import Link from "next/link";
import { DISTANCES } from "@/lib/distance";
import { getServerDict } from "@/lib/i18n/server";
import { allPresets, landingSlug } from "@/lib/seo-landings";
import { formatTime } from "@/lib/time";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerDict();
  return {
    title: t.predict.indexTitle,
    description: t.predict.indexTagline,
    alternates: { canonical: "/predict" },
  };
}

export default async function PredictIndex() {
  const { t } = await getServerDict();
  const presets = allPresets();
  return (
    <article className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">{t.predict.indexTitle}</h1>
        <p className="mx-auto max-w-xl text-sm text-(--color-text-muted)">
          {t.predict.indexTagline}
        </p>
      </header>
      <ul className="grid gap-2 sm:grid-cols-2">
        {presets.map((p) => {
          const slug = landingSlug(p);
          const paceSec = p.fromTimeSec / (DISTANCES[p.fromKey] / 1000);
          const pace =
            Math.floor(paceSec / 60) +
            "'" +
            Math.round(paceSec - Math.floor(paceSec / 60) * 60)
              .toString()
              .padStart(2, "0") +
            '"/km';
          return (
            <li key={slug}>
              <Link
                href={`/predict/${slug}`}
                className="flex items-baseline justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm hover:border-(--color-accent)/40 hover:bg-(--color-accent)/5"
              >
                <span className="font-mono">
                  {t.distances[p.fromKey]} {formatTime(p.fromTimeSec)}
                </span>
                <span className="text-(--color-text-muted)">→ {t.distances[p.toKey]}</span>
                <span className="ml-auto text-xs text-(--color-text-muted)/70">{pace}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
