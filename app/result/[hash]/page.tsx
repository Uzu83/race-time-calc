import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PaceChart from "@/components/PaceChart";
import ShareButtons from "@/components/ShareButtons";
import { DISTANCE_LABEL_JA, DISTANCE_SHORT_JA, metersOf } from "@/lib/distance";
import { decodeInput } from "@/lib/encoding";
import {
  consensusSeconds,
  MODEL_DESC_JA,
  MODEL_LABEL_JA,
  nextSubTargetGap,
  predictAll,
} from "@/lib/predict";
import { formatSignedDelta, formatTime, formatTimeJa } from "@/lib/time";
import { planForFullSeconds } from "@/lib/training";

interface PageProps {
  params: Promise<{ hash: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://race-time-calc.example.com";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { hash } = await params;
  const decoded = decodeInput(hash);
  if (!decoded) return { title: "予測結果", robots: { index: false } };
  const preds = predictAll(metersOf(decoded.fromKey), decoded.fromTimeSec, metersOf(decoded.toKey));
  const consensus = consensusSeconds(preds);
  const fromShort = DISTANCE_SHORT_JA[decoded.fromKey];
  const toShort = DISTANCE_SHORT_JA[decoded.toKey];
  const title = `${fromShort} ${formatTime(decoded.fromTimeSec, { forceHours: true })} → ${toShort} 予測 ${formatTime(consensus, { forceHours: true })}`;
  const description = `${fromShort}を${formatTime(decoded.fromTimeSec, { forceHours: true })}で走るあなたの${toShort}予測タイムは${formatTime(consensus, { forceHours: true })}。Riegel(一般)・VDOT・Riegel(エリート) 3モデル並列表示。`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`${SITE_URL}/api/og?hash=${hash}`],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ResultPage({ params }: PageProps) {
  const { hash } = await params;
  const decoded = decodeInput(hash);
  if (!decoded) notFound();

  const fromMeters = metersOf(decoded.fromKey);
  const toMeters = metersOf(decoded.toKey);
  const preds = predictAll(fromMeters, decoded.fromTimeSec, toMeters);
  const consensus = consensusSeconds(preds);
  const avgPaceSec = consensus / (toMeters / 1000);
  const sub = nextSubTargetGap(consensus, toMeters);
  const fullSec =
    Math.abs(toMeters - 42195) < 1
      ? consensus
      : preds.find((p) => p.model === "riegel")
        ? (predictAll(fromMeters, decoded.fromTimeSec, 42195)[0]?.seconds ?? consensus)
        : consensus;
  const plan = planForFullSeconds(fullSec);

  const shareText = `${DISTANCE_SHORT_JA[decoded.fromKey]} ${formatTime(decoded.fromTimeSec, { forceHours: true })} → ${DISTANCE_SHORT_JA[decoded.toKey]} 予測 ${formatTime(consensus, { forceHours: true })}`;

  const fastest = preds.reduce((a, b) => (a.seconds < b.seconds ? a : b));
  const slowest = preds.reduce((a, b) => (a.seconds > b.seconds ? a : b));

  return (
    <div className="space-y-8">
      {/* Hero result card */}
      <section className="rounded-2xl border border-(--color-accent)/40 bg-gradient-to-br from-(--color-accent)/15 to-(--color-rune)/5 p-6 md:p-8">
        <div className="text-xs text-(--color-text-muted)">
          {DISTANCE_LABEL_JA[decoded.fromKey]}{" "}
          <span className="font-mono">{formatTime(decoded.fromTimeSec, { forceHours: true })}</span>{" "}
          → {DISTANCE_LABEL_JA[decoded.toKey]}
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <h1 className="text-5xl font-bold text-(--color-accent) md:text-6xl">
            {formatTime(consensus, { forceHours: true })}
          </h1>
          <span className="text-sm text-(--color-text-muted)">3モデル平均</span>
        </div>
        <div className="mt-1 text-sm text-(--color-text-muted)">
          {formatTimeJa(consensus)} / 推奨1kmペース ≈ {Math.floor(avgPaceSec / 60)}'
          {Math.round(avgPaceSec % 60)
            .toString()
            .padStart(2, "0")}
          "/km
        </div>

        {sub && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-(--color-victory)/40 bg-(--color-victory)/10 px-4 py-2 text-sm text-(--color-victory)">
            {sub.achieved ? (
              <>
                🏆 {sub.target.labelJa} を {formatSignedDelta(sub.gapSec)} で射程内
              </>
            ) : (
              <>
                🎯 {sub.target.labelJa} まであと{" "}
                <strong className="font-bold">{formatSignedDelta(sub.gapSec)}</strong>
              </>
            )}
          </div>
        )}
      </section>

      {/* 3 model comparison */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-(--color-accent-soft)">3モデル並列表示</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {preds.map((p) => {
            const isFast = p.model === fastest.model;
            const isSlow = p.model === slowest.model;
            const dotClass = isFast
              ? "bg-emerald-400"
              : isSlow
                ? "bg-rose-400"
                : "bg-(--color-rune)";
            return (
              <article
                key={p.model}
                className="rounded-xl border border-white/10 bg-(--color-card) p-4"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden />
                  <h3 className="text-xs font-semibold text-(--color-text-muted)">
                    {MODEL_LABEL_JA[p.model]}
                  </h3>
                </div>
                <div className="font-mono text-2xl font-bold">
                  {formatTime(p.seconds, { forceHours: true })}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-(--color-text-muted)">
                  {MODEL_DESC_JA[p.model]}
                </p>
              </article>
            );
          })}
        </div>
        <p className="text-[11px] text-(--color-text-muted)">
          幅: {formatTime(slowest.seconds, { forceHours: true })} −{" "}
          {formatTime(fastest.seconds, { forceHours: true })} (
          {formatSignedDelta(slowest.seconds - fastest.seconds).replace(/^[+−]/, "")})
        </p>
      </section>

      {/* Pace chart */}
      <section className="rounded-2xl border border-white/10 bg-(--color-card) p-5">
        <h2 className="mb-3 text-sm font-bold text-(--color-accent-soft)">
          推奨1kmラップ ({DISTANCE_LABEL_JA[decoded.toKey]})
        </h2>
        <PaceChart totalKm={toMeters / 1000} avgPaceSec={avgPaceSec} />
      </section>

      {/* Training plan */}
      <section className="rounded-2xl border border-white/10 bg-(--color-card) p-5">
        <h2 className="mb-1 text-sm font-bold text-(--color-accent-soft)">
          想定トレーニング ({plan.tier})
        </h2>
        <p className="mb-3 text-xs leading-relaxed text-(--color-text-muted)">
          フル予測 {formatTime(fullSec, { forceHours: true })} 相当の脚を作るための目安。
        </p>
        <dl className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-black/30 p-2">
            <dt className="text-[10px] text-(--color-text-muted)">月間</dt>
            <dd className="font-mono text-base font-bold">
              {plan.monthlyKm[0]}–{plan.monthlyKm[1]}km
            </dd>
          </div>
          <div className="rounded-lg bg-black/30 p-2">
            <dt className="text-[10px] text-(--color-text-muted)">週間</dt>
            <dd className="font-mono text-base font-bold">
              {plan.weeklyKm[0]}–{plan.weeklyKm[1]}km
            </dd>
          </div>
          <div className="rounded-lg bg-black/30 p-2">
            <dt className="text-[10px] text-(--color-text-muted)">ロング</dt>
            <dd className="font-mono text-base font-bold">
              {plan.longRunKm[0]}–{plan.longRunKm[1]}km
            </dd>
          </div>
        </dl>
        <ul className="mb-3 space-y-1.5 text-xs leading-relaxed">
          {plan.workouts.map((w) => (
            <li key={w} className="flex gap-2">
              <span className="text-(--color-accent)">▸</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] leading-relaxed text-(--color-text-muted)">{plan.comment}</p>
      </section>

      {/* Share + back */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-(--color-accent-soft)">この予測をシェア</h2>
        <ShareButtons url={`/result/${hash}`} text={shareText} />
        <div className="pt-2 text-xs">
          <Link href="/" className="text-(--color-rune) underline-offset-2 hover:underline">
            ← 別の条件で予測する
          </Link>
        </div>
      </section>
    </div>
  );
}
