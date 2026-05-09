import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ResultView from "@/components/ResultView";
import { metersOf } from "@/lib/distance";
import { decodeInput } from "@/lib/encoding";
import { getServerDict } from "@/lib/i18n/server";
import { consensusSeconds, predictAll } from "@/lib/predict";
import { breadcrumbLd, resultLd } from "@/lib/seo-jsonld";
import { SITE_URL } from "@/lib/site";
import { formatTime } from "@/lib/time";

interface PageProps {
  params: Promise<{ hash: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { hash } = await params;
  const decoded = decodeInput(hash);
  const { locale, t } = await getServerDict();
  if (!decoded) return { title: t.meta.siteName, robots: { index: false } };
  const preds = predictAll(metersOf(decoded.fromKey), decoded.fromTimeSec, metersOf(decoded.toKey));
  const consensus = consensusSeconds(preds);
  const fromShort = t.distances[decoded.fromKey];
  const toShort = t.distances[decoded.toKey];
  const fromTime = formatTime(decoded.fromTimeSec, { forceHours: true });
  const consTime = formatTime(consensus, { forceHours: true });
  const title = `${fromShort} ${fromTime} → ${toShort} ${consTime}`;
  const description = t.meta.siteDescription;
  const path = `/result/${hash}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      images: [`${SITE_URL}/api/og?hash=${hash}&lang=${locale}`],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ResultPage({ params }: PageProps) {
  const { hash } = await params;
  const decoded = decodeInput(hash);
  if (!decoded) notFound();

  const { locale, t } = await getServerDict();
  const preds = predictAll(metersOf(decoded.fromKey), decoded.fromTimeSec, metersOf(decoded.toKey));
  const consensus = consensusSeconds(preds);
  const path = `/result/${hash}`;

  return (
    <>
      <JsonLd
        data={resultLd({
          fromKey: decoded.fromKey,
          toKey: decoded.toKey,
          fromTimeSec: decoded.fromTimeSec,
          consensusSec: consensus,
          predictions: preds,
          url: path,
          copy: t.meta,
          fromLabel: t.distances[decoded.fromKey],
          toLabel: t.distances[decoded.toKey],
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
          { name: `${t.distances[decoded.fromKey]} → ${t.distances[decoded.toKey]}`, path },
        ])}
      />
      <ResultView input={decoded} locale={locale} pageUrl={path} />
    </>
  );
}
