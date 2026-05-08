import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EquivalentTimes from "@/components/EquivalentTimes";
import HeatAdjuster from "@/components/HeatAdjuster";
import PaceChart from "@/components/PaceChart";
import RacePlan from "@/components/RacePlan";
import ShareButtons from "@/components/ShareButtons";
import TrainingPaces from "@/components/TrainingPaces";
import { type DistanceKey, metersOf, paceSecondsPerKmToString } from "@/lib/distance";
import { decodeInput } from "@/lib/encoding";
import { equivalentTimes } from "@/lib/equivalents";
import { interpolate } from "@/lib/i18n/dictionary";
import { getServerDict } from "@/lib/i18n/server";
import { consensusSeconds, nextSubTargetGap, predictAll, vdotFromRace } from "@/lib/predict";
import { formatSignedDelta, formatTime, formatTimeJa } from "@/lib/time";
import { planForFullSeconds } from "@/lib/training";
import { trainingPaces } from "@/lib/training-paces";

interface PageProps {
  params: Promise<{ hash: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://race-time-calc.example.com";

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
  const arrow = locale === "en" ? "→" : "→";
  const title = `${fromShort} ${fromTime} ${arrow} ${toShort} ${consTime}`;
  const description = t.meta.siteDescription;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
  const fromMeters = metersOf(decoded.fromKey);
  const toMeters = metersOf(decoded.toKey);
  const preds = predictAll(fromMeters, decoded.fromTimeSec, toMeters);
  const consensus = consensusSeconds(preds);
  const avgPaceSec = consensus / (toMeters / 1000);
  const sub = nextSubTargetGap(consensus, toMeters);
  const fullSec =
    Math.abs(toMeters - 42195) < 1
      ? consensus
      : (predictAll(fromMeters, decoded.fromTimeSec, 42195)[0]?.seconds ?? consensus);
  const planMeta = planForFullSeconds(fullSec);
  const tierText = t.trainingTier[planMeta.key];

  const vdot = vdotFromRace(fromMeters, decoded.fromTimeSec);
  const paces = trainingPaces(vdot);
  const equivalents = equivalentTimes(decoded.fromKey, decoded.fromTimeSec);

  const shareText = `${t.distances[decoded.fromKey]} ${formatTime(decoded.fromTimeSec, { forceHours: true })} → ${t.distances[decoded.toKey]} ${formatTime(consensus, { forceHours: true })}`;

  const fastest = preds.reduce((a, b) => (a.seconds < b.seconds ? a : b));
  const slowest = preds.reduce((a, b) => (a.seconds > b.seconds ? a : b));

  const subTargetText = sub
    ? interpolate(sub.achieved ? t.subTargets.inReach : t.subTargets.awayBy, {
        delta: formatSignedDelta(sub.gapSec),
      })
    : null;
  const subTargetLabel = sub ? t.subTargets[sub.target.key as keyof typeof t.subTargets] : null;

  // Whether to show race plan / heat adjuster — only for half/full where it's meaningful
  const isRaceDistance =
    decoded.toKey === "full" || decoded.toKey === "half" || decoded.toKey === "30k";

  return (
    <div className="space-y-6">
      {/* Hero result card */}
      <section className="fade-up rounded-3xl border border-(--color-accent)/40 bg-gradient-to-br from-(--color-accent)/15 via-(--color-accent)/5 to-(--color-rune)/5 p-6 md:p-8">
        <div className="text-xs text-(--color-text-muted)">
          {t.distances[decoded.fromKey]}{" "}
          <span className="font-mono">{formatTime(decoded.fromTimeSec, { forceHours: true })}</span>{" "}
          → {t.distances[decoded.toKey]}
        </div>
        <div className="mt-2 flex items-baseline gap-3 flex-wrap">
          <h1 className="glow-pulse bg-gradient-to-r from-(--color-accent) to-(--color-victory) bg-clip-text font-mono text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
            {formatTime(consensus, { forceHours: true })}
          </h1>
          <span className="text-sm text-(--color-text-muted)">{t.result.threeModelAvg}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-(--color-text-muted)">
          {locale === "ja" && <span>{formatTimeJa(consensus)}</span>}
          <span>
            {t.result.pacePerKm} ≈{" "}
            <span className="font-mono text-(--color-text)">
              {paceSecondsPerKmToString(avgPaceSec)}
            </span>
          </span>
        </div>

        {sub && subTargetText && subTargetLabel && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-(--color-victory)/40 bg-(--color-victory)/10 px-4 py-2 text-sm text-(--color-victory)">
            {sub.achieved ? (
              <>
                🏆 {subTargetLabel} {subTargetText}
              </>
            ) : (
              <>
                🎯 {subTargetLabel} {subTargetText}
              </>
            )}
          </div>
        )}
      </section>

      {/* 3 model comparison */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-(--color-accent-soft)">{t.result.threeModelTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {preds.map((p) => {
            const isFast = p.model === fastest.model;
            const isSlow = p.model === slowest.model;
            const dotClass = isFast
              ? "bg-emerald-400"
              : isSlow
                ? "bg-rose-400"
                : "bg-(--color-rune)";
            const labelKey = p.model === "riegelElite" ? "riegelElite" : p.model;
            return (
              <article
                key={p.model}
                className="rounded-xl border border-white/10 bg-(--color-card) p-4"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden />
                  <h3 className="text-xs font-semibold text-(--color-text-muted)">
                    {labelKey === "riegel" && t.models.riegel}
                    {labelKey === "vdot" && t.models.vdot}
                    {labelKey === "riegelElite" && t.models.riegelElite}
                  </h3>
                </div>
                <div className="font-mono text-2xl font-bold">
                  {formatTime(p.seconds, { forceHours: true })}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-(--color-text-muted)">
                  {labelKey === "riegel" && t.models.riegelDesc}
                  {labelKey === "vdot" && t.models.vdotDesc}
                  {labelKey === "riegelElite" && t.models.riegelEliteDesc}
                </p>
              </article>
            );
          })}
        </div>
        <p className="text-[11px] text-(--color-text-muted)">
          {t.result.rangeLabel}: {formatTime(slowest.seconds, { forceHours: true })} −{" "}
          {formatTime(fastest.seconds, { forceHours: true })} (
          {formatSignedDelta(slowest.seconds - fastest.seconds).replace(/^[+−]/, "")})
        </p>
      </section>

      {/* Equivalent times */}
      <EquivalentTimes rows={equivalents} highlightKey={decoded.toKey as DistanceKey} />

      {/* VDOT training paces */}
      <TrainingPaces vdot={vdot} paces={paces} />

      {/* Race plan splits — only for race distances */}
      {isRaceDistance && <RacePlan totalKm={toMeters / 1000} totalSec={consensus} />}

      {/* Pace chart */}
      <section className="rounded-2xl border border-white/10 bg-(--color-card) p-5">
        <h2 className="mb-3 text-sm font-bold text-(--color-accent-soft)">
          {t.result.paceLapTitle} ({t.distances[decoded.toKey]})
        </h2>
        <PaceChart totalKm={toMeters / 1000} avgPaceSec={avgPaceSec} />
      </section>

      {/* Heat adjuster */}
      {isRaceDistance && <HeatAdjuster baselineSec={consensus} distanceMeters={toMeters} />}

      {/* Training plan */}
      <section className="rounded-2xl border border-white/10 bg-(--color-card) p-5">
        <h2 className="mb-1 text-sm font-bold text-(--color-accent-soft)">
          {t.result.trainingTitle} ({tierText.tier})
        </h2>
        <p className="mb-3 text-xs leading-relaxed text-(--color-text-muted)">
          {locale === "en"
            ? `${t.result.trainingNote}${formatTime(fullSec, { forceHours: true })} marathon.`
            : `${formatTime(fullSec, { forceHours: true })} ${t.result.trainingNote}`}
        </p>
        <dl className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-black/30 p-2">
            <dt className="text-[10px] text-(--color-text-muted)">{t.result.monthly}</dt>
            <dd className="font-mono text-base font-bold">
              {planMeta.monthlyKm[0]}–{planMeta.monthlyKm[1]}km
            </dd>
          </div>
          <div className="rounded-lg bg-black/30 p-2">
            <dt className="text-[10px] text-(--color-text-muted)">{t.result.weekly}</dt>
            <dd className="font-mono text-base font-bold">
              {planMeta.weeklyKm[0]}–{planMeta.weeklyKm[1]}km
            </dd>
          </div>
          <div className="rounded-lg bg-black/30 p-2">
            <dt className="text-[10px] text-(--color-text-muted)">{t.result.longRun}</dt>
            <dd className="font-mono text-base font-bold">
              {planMeta.longRunKm[0]}–{planMeta.longRunKm[1]}km
            </dd>
          </div>
        </dl>
        <ul className="mb-3 space-y-1.5 text-xs leading-relaxed">
          {[tierText.w1, tierText.w2, tierText.w3].map((w) => (
            <li key={w} className="flex gap-2">
              <span className="text-(--color-accent)">▸</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] leading-relaxed text-(--color-text-muted)">{tierText.comment}</p>
      </section>

      {/* Share + back */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-(--color-accent-soft)">{t.result.shareTitle}</h2>
        <ShareButtons url={`/result/${hash}`} text={shareText} />
        <div className="pt-2 text-xs">
          <Link href="/" className="text-(--color-rune) underline-offset-2 hover:underline">
            {t.result.backCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
