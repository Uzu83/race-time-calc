import Link from "next/link";
import EquivalentTimes from "@/components/EquivalentTimes";
import GearAffiliate from "@/components/GearAffiliate";
import HeatAdjuster from "@/components/HeatAdjuster";
import PaceChart from "@/components/PaceChart";
import PopularLandings from "@/components/PopularLandings";
import RacePlan from "@/components/RacePlan";
import ShareButtons from "@/components/ShareButtons";
import TrainingPaces from "@/components/TrainingPaces";
import { metersOf, paceSecondsPerKmToString } from "@/lib/distance";
import type { RaceInput } from "@/lib/encoding";
import { equivalentTimes } from "@/lib/equivalents";
import { getDict, interpolate } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import { consensusSeconds, nextSubTargetGap, predictAll, vdotFromRace } from "@/lib/predict";
import { KOFI_URL } from "@/lib/site";
import { formatSignedDelta, formatTime, formatTimeJa } from "@/lib/time";
import { planForFullSeconds } from "@/lib/training";
import { trainingPaces } from "@/lib/training-paces";

interface Props {
  input: RaceInput;
  locale: Locale;
  /** absolute or relative URL of the current page (used for share + back link) */
  pageUrl: string;
  /** when true, show the "← Try another input" link back to home */
  showBackLink?: boolean;
}

/**
 * Shared result render used by both `/result/[hash]` (share-friendly) and
 * `/predict/[slug]` (SEO landings). Pure view + data composition; metadata and
 * structured data live in the route file that imports this.
 */
export default function ResultView({ input, locale, pageUrl, showBackLink = true }: Props) {
  const t = getDict(locale);
  const fromMeters = metersOf(input.fromKey);
  const toMeters = metersOf(input.toKey);
  const preds = predictAll(fromMeters, input.fromTimeSec, toMeters);
  const consensus = consensusSeconds(preds);
  const avgPaceSec = consensus / (toMeters / 1000);
  const sub = nextSubTargetGap(consensus, toMeters);
  const fullSec =
    Math.abs(toMeters - 42195) < 1
      ? consensus
      : (predictAll(fromMeters, input.fromTimeSec, 42195)[0]?.seconds ?? consensus);
  const planMeta = planForFullSeconds(fullSec);
  const tierText = t.trainingTier[planMeta.key];

  const vdot = vdotFromRace(fromMeters, input.fromTimeSec);
  const paces = trainingPaces(vdot);
  const equivalents = equivalentTimes(input.fromKey, input.fromTimeSec);

  const shareText = `${t.distances[input.fromKey]} ${formatTime(input.fromTimeSec, { forceHours: true })} → ${t.distances[input.toKey]} ${formatTime(consensus, { forceHours: true })}`;

  const fastest = preds.reduce((a, b) => (a.seconds < b.seconds ? a : b));
  const slowest = preds.reduce((a, b) => (a.seconds > b.seconds ? a : b));

  const subTargetDelta = sub
    ? sub.achieved
      ? formatSignedDelta(sub.gapSec)
      : formatSignedDelta(sub.gapSec).replace(/^\+/, "")
    : null;
  const subTargetText = sub
    ? interpolate(sub.achieved ? t.subTargets.inReach : t.subTargets.awayBy, {
        delta: subTargetDelta ?? "",
      })
    : null;
  const subTargetLabel = sub ? t.subTargets[sub.target.key as keyof typeof t.subTargets] : null;

  const isRaceDistance = input.toKey === "full" || input.toKey === "half" || input.toKey === "30k";

  return (
    <div className="space-y-6">
      <section className="fade-up rounded-3xl border border-(--color-accent)/40 bg-gradient-to-br from-(--color-accent)/15 via-(--color-accent)/5 to-(--color-rune)/5 p-6 md:p-8">
        <div className="text-xs text-(--color-text-muted)">
          {t.distances[input.fromKey]}{" "}
          <span className="font-mono">{formatTime(input.fromTimeSec, { forceHours: true })}</span> →{" "}
          {t.distances[input.toKey]}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:gap-4">
          <div>
            <div className="text-[10px] font-semibold tracking-wide text-emerald-400/90 sm:text-xs">
              {t.result.optimistic}
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-emerald-300/90 sm:text-xl md:text-2xl">
              {formatTime(fastest.seconds, { forceHours: true })}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold tracking-wide text-(--color-victory)/90 sm:text-xs">
              {t.result.median}
            </div>
            <h1 className="glow-pulse mt-1 bg-gradient-to-r from-(--color-accent) to-(--color-victory) bg-clip-text font-mono text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl md:text-6xl">
              {formatTime(consensus, { forceHours: true })}
            </h1>
          </div>
          <div>
            <div className="text-[10px] font-semibold tracking-wide text-rose-400/90 sm:text-xs">
              {t.result.conservative}
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-rose-300/90 sm:text-xl md:text-2xl">
              {formatTime(slowest.seconds, { forceHours: true })}
            </div>
          </div>
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

      <EquivalentTimes rows={equivalents} highlightKey={input.toKey} />

      <TrainingPaces vdot={vdot} paces={paces} />

      {/* Env-gated: renders null until NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG is set. */}
      <GearAffiliate
        locale={locale}
        tier={planMeta.key}
        tierLabel={tierText.tier}
        placement="training"
      />

      {isRaceDistance && <RacePlan totalKm={toMeters / 1000} totalSec={consensus} />}

      <section className="rounded-2xl border border-white/10 bg-(--color-card) p-5">
        <h2 className="mb-3 text-sm font-bold text-(--color-accent-soft)">
          {t.result.paceLapTitle} ({t.distances[input.toKey]})
        </h2>
        <PaceChart totalKm={toMeters / 1000} avgPaceSec={avgPaceSec} />
      </section>

      {isRaceDistance && <HeatAdjuster baselineSec={consensus} distanceMeters={toMeters} />}

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

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-(--color-accent-soft)">{t.result.shareTitle}</h2>
        <ShareButtons url={pageUrl} text={shareText} />
        {showBackLink && (
          <div className="pt-2 text-xs">
            <Link href="/" className="text-(--color-rune) underline-offset-2 hover:underline">
              {t.result.backCta}
            </Link>
          </div>
        )}
      </section>

      {/* Soft tip after share — intent is highest post-prediction. */}
      <section className="rounded-2xl border border-white/10 bg-black/15 p-4">
        <h2 className="text-sm font-bold text-(--color-accent-soft)">{t.support.title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-(--color-text-muted)">{t.support.body}</p>
        <a
          href={KOFI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex text-sm font-semibold text-(--color-rune) underline-offset-2 hover:underline"
        >
          {t.support.cta}
        </a>
      </section>

      <PopularLandings
        locale={locale}
        limit={6}
        title={t.home.relatedHeading}
        filter={(p) =>
          (p.fromKey === input.fromKey || p.toKey === input.toKey) &&
          !(
            p.fromKey === input.fromKey &&
            p.toKey === input.toKey &&
            p.fromTimeSec === input.fromTimeSec
          )
        }
      />
    </div>
  );
}
