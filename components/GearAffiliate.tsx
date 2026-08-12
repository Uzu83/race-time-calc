import GearAffiliateLink, { type GearAffiliatePlacement } from "@/components/GearAffiliateLink";
import { amazonShoeSearchUrl } from "@/lib/affiliate";
import { getDict, interpolate } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import type { TrainingTierKey } from "@/lib/training";

interface Props {
  locale: Locale;
  tier: TrainingTierKey;
  /** Localized tier label from `t.trainingTier.<key>.tier` for contextual copy. */
  tierLabel: string;
  /** Analytics + layout hint — hero sits right under the prediction headline. */
  placement?: GearAffiliatePlacement;
}

/**
 * Contextual Amazon shoe CTA on result pages.
 * Renders nothing when `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG` is unset (fail-closed).
 *
 * Disclosure is BEFORE the CTA at normal contrast (Amazon "clear and prominent" + 景表法).
 */
export default function GearAffiliate({ locale, tier, tierLabel, placement = "hero" }: Props) {
  const href = amazonShoeSearchUrl(tier);
  if (!href) return null;

  const t = getDict(locale);
  const body = interpolate(t.gear.bodyTier, { tier: tierLabel });
  const cta = interpolate(t.gear.ctaTier, { tier: tierLabel });

  return (
    <section
      className="rounded-2xl border border-(--color-accent)/35 bg-gradient-to-br from-(--color-accent)/12 via-black/20 to-(--color-rune)/8 p-4 md:p-5"
      aria-label={t.gear.title}
    >
      <p className="text-xs font-semibold leading-relaxed text-(--color-accent-soft)">
        {t.gear.disclosure}
      </p>
      <h2 className="mt-3 text-sm font-bold text-(--color-accent-soft)">{t.gear.title}</h2>
      <p className="mt-1 text-xs leading-relaxed text-(--color-text-muted)">{body}</p>
      <GearAffiliateLink href={href} label={cta} tier={tier} placement={placement} />
    </section>
  );
}
