export const LOCALES = ["ja", "en", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ja";

export const LOCALE_NAMES: Record<Locale, string> = {
  ja: "日本語",
  en: "English",
  ko: "한국어",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  ja: "🇯🇵",
  en: "🇺🇸",
  ko: "🇰🇷",
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  ja: "ja",
  en: "en",
  ko: "ko",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function pickLocaleFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  // very simple parser: ja, ja-JP, en-US, ko, ...
  const tags = header.split(",").map((s) => s.trim().split(";")[0]?.toLowerCase() ?? "");
  for (const tag of tags) {
    if (!tag) continue;
    if (tag.startsWith("ja")) return "ja";
    if (tag.startsWith("ko")) return "ko";
    if (tag.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}
