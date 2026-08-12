/**
 * Amazon Associates (JP) — env-gated shoe CTA for result pages.
 *
 * WHY env gate:
 *   Associates tag が無い状態でリンクを出すと、未承認トラッキング／景表法開示だけの
 *   「アフィっぽい死リンク」になる。`NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG` がセットされた
 *   ときだけ UI を出す（コードは先に置き、人間がタグを入れるだけで ON）。
 *
 * Portfolio: docs/monetization/PORTFOLIO-STRATEGY-v3.md — race-time「アフィリ1本だけON」。
 */

import type { TrainingTierKey } from "@/lib/training";

/** Amazon JP associate tag from env (empty = affiliate UI off). */
export function amazonAssociateTag(): string {
  return (process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? "").trim();
}

export function isAmazonAffiliateEnabled(): boolean {
  // Tag rules: typically 〜-22 etc. Keep loose; empty is the only hard OFF.
  return amazonAssociateTag().length > 0;
}

/**
 * Search query keyed by training tier — one contextual merch surface, not a mall.
 * Faster tiers → racing flats; finishing tiers → cushioned daily trainers.
 */
const SHOE_QUERY_BY_TIER: Record<TrainingTierKey, string> = {
  sub3: "レーシングシューズ マラソン",
  sub35: "レーシングシューズ マラソン",
  sub4: "ランニングシューズ サブ4",
  sub45: "ランニングシューズ",
  sub5: "ランニングシューズ 初心者",
  finish: "ランニングシューズ クッション",
};

export function shoeSearchQuery(tier: TrainingTierKey): string {
  return SHOE_QUERY_BY_TIER[tier];
}

/** Amazon JP search URL with associate tag. Returns null when affiliate is OFF. */
export function amazonShoeSearchUrl(tier: TrainingTierKey): string | null {
  const tag = amazonAssociateTag();
  if (!tag) return null;
  const q = shoeSearchQuery(tier);
  const params = new URLSearchParams({
    k: q,
    tag,
  });
  return `https://www.amazon.co.jp/s?${params.toString()}`;
}
