/**
 * JSON-LD structured-data builders.
 *
 * Strings are accepted via a minimal Dict shape so callers can pass either the
 * server (`getServerDict`) or a hand-curated dict — keeps the dependency
 * one-way (seo → i18n strings, not the reverse).
 */
import type { DistanceKey } from "./distance";
import type { Locale } from "./i18n/locales";
import type { PredictionResult } from "./predict";
import { absoluteUrl, SITE_URL } from "./site";
import { formatTime } from "./time";

interface SiteCopy {
  siteName: string;
  siteDescription: string;
}

export function webApplicationLd(copy: SiteCopy, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: copy.siteName,
    description: copy.siteDescription,
    url: SITE_URL,
    applicationCategory: "HealthApplication",
    inLanguage: locale,
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    isAccessibleForFree: true,
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faqLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

interface ResultLdInput {
  fromKey: DistanceKey;
  toKey: DistanceKey;
  fromTimeSec: number;
  consensusSec: number;
  predictions: PredictionResult[];
  url: string;
  copy: SiteCopy;
  fromLabel: string;
  toLabel: string;
  modelLabel: Record<PredictionResult["model"], string>;
}

/**
 * Result-page JSON-LD. We use Dataset because the tool produces a derived
 * computed value over the input — it's the closest schema.org shape.
 */
export function resultLd(input: ResultLdInput) {
  const datasetName = `${input.fromLabel} ${formatTime(input.fromTimeSec, { forceHours: true })} → ${input.toLabel} ${formatTime(input.consensusSec, { forceHours: true })}`;
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: datasetName,
    description: input.copy.siteDescription,
    url: absoluteUrl(input.url),
    creator: { "@type": "Organization", name: input.copy.siteName },
    measurementTechnique: input.predictions
      .map((p) => `${input.modelLabel[p.model]}: ${formatTime(p.seconds, { forceHours: true })}`)
      .join(", "),
    isAccessibleForFree: true,
  };
}
