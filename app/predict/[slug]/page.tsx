import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ResultView from "@/components/ResultView";
import { metersOf } from "@/lib/distance";
import { encodeInput } from "@/lib/encoding";
import { getDict, interpolate } from "@/lib/i18n/dictionary";
import { getServerDict } from "@/lib/i18n/server";
import { consensusSeconds, predictAll } from "@/lib/predict";
import { breadcrumbLd, resultLd, webApplicationLd } from "@/lib/seo-jsonld";
import { POPULAR_PREDICT_SLUGS, parseLandingSlug } from "@/lib/seo-landings";
import { SITE_URL } from "@/lib/site";
import { formatTime } from "@/lib/time";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POPULAR_PREDICT_SLUGS.map((slug) => ({ slug }));
}

// Cache landings for a day; the math is deterministic so they don't really need
// to revalidate, but we want crawlers to see fresh `lastmod` over time.
export const revalidate = 86400;
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = parseLandingSlug(slug);
  const { locale, t } = await getServerDict();
  if (!decoded) return { title: t.meta.siteName, robots: { index: false } };
  const dict = getDict(locale);
  const fromShort = dict.distances[decoded.fromKey];
  const toShort = dict.distances[decoded.toKey];
  const fromTime = formatTime(decoded.fromTimeSec, { forceHours: true });
  const title = interpolate(dict.predict.h1, {
    from: fromShort,
    time: fromTime,
    to: toShort,
  });
  const description = interpolate(dict.predict.description, {
    from: fromShort,
    time: fromTime,
    to: toShort,
  });
  const path = `/predict/${slug}`;
  // Reuse the share-style hash for the OG image — same data, same output.
  const ogHash = encodeInput(decoded);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      images: [`${SITE_URL}/api/og?hash=${ogHash}&lang=${locale}`],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PredictLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const decoded = parseLandingSlug(slug);
  if (!decoded) notFound();

  const { locale, t } = await getServerDict();
  const preds = predictAll(metersOf(decoded.fromKey), decoded.fromTimeSec, metersOf(decoded.toKey));
  const consensus = consensusSeconds(preds);
  const path = `/predict/${slug}`;
  const fromShort = t.distances[decoded.fromKey];
  const toShort = t.distances[decoded.toKey];
  const fromTime = formatTime(decoded.fromTimeSec, { forceHours: true });

  return (
    <>
      <JsonLd data={webApplicationLd(t.meta, locale)} />
      <JsonLd
        data={resultLd({
          fromKey: decoded.fromKey,
          toKey: decoded.toKey,
          fromTimeSec: decoded.fromTimeSec,
          consensusSec: consensus,
          predictions: preds,
          url: path,
          copy: t.meta,
          fromLabel: fromShort,
          toLabel: toShort,
          modelLabel: {
            riegel: t.models.riegel,
            vdot: t.models.vdot,
            riegelElite: t.models.riegelElite,
          },
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: t.meta.siteName, path: "/" },
          { name: t.predict.indexTitle, path: "/predict" },
          { name: `${fromShort} ${fromTime} → ${toShort}`, path },
        ])}
      />
      <ResultView input={decoded} locale={locale} pageUrl={path} />
      <div className="pt-2 text-center text-xs">
        <Link
          href={`/result/${encodeInput(decoded)}`}
          className="text-(--color-rune) underline-offset-2 hover:underline"
        >
          {t.predict.seeFullResult}
        </Link>
      </div>
    </>
  );
}
