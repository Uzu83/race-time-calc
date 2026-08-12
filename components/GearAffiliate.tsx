import { amazonShoeSearchUrl } from "@/lib/affiliate";
import { getDict } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import type { TrainingTierKey } from "@/lib/training";

interface Props {
  locale: Locale;
  tier: TrainingTierKey;
}

/**
 * Single contextual Amazon CTA under the training plan.
 * Renders nothing when `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG` is unset (fail-closed).
 *
 * Disclosure is BEFORE the CTA at normal contrast (Amazon "clear and prominent" + 景表法).
 */
export default function GearAffiliate({ locale, tier }: Props) {
  const href = amazonShoeSearchUrl(tier);
  if (!href) return null;

  const t = getDict(locale);
  return (
    <section
      className="rounded-2xl border border-(--color-rune)/40 bg-black/25 p-4"
      aria-label={t.gear.title}
    >
      <p className="text-xs font-semibold leading-relaxed text-(--color-accent-soft)">
        {t.gear.disclosure}
      </p>
      <h2 className="mt-3 text-sm font-bold text-(--color-accent-soft)">{t.gear.title}</h2>
      <p className="mt-1 text-xs leading-relaxed text-(--color-text-muted)">{t.gear.body}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="mt-3 inline-flex items-center justify-center rounded-xl bg-(--color-accent) px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
      >
        {t.gear.cta}
      </a>
    </section>
  );
}
