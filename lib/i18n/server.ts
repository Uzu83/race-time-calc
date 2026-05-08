import { cookies, headers } from "next/headers";
import { getDict } from "./dictionary";
import { isLocale, type Locale, pickLocaleFromAcceptLanguage } from "./locales";

const COOKIE_NAME = "race-time-calc:locale";

/**
 * Resolve the locale on the server, in priority order:
 *  1. cookie (set by the LanguageSwitcher client component)
 *  2. Accept-Language header
 *  3. default (ja)
 */
export async function resolveLocale(): Promise<Locale> {
  const c = await cookies();
  const fromCookie = c.get(COOKIE_NAME)?.value;
  if (fromCookie && isLocale(fromCookie)) return fromCookie;
  const h = await headers();
  return pickLocaleFromAcceptLanguage(h.get("accept-language"));
}

export async function getServerDict() {
  const locale = await resolveLocale();
  return { locale, t: getDict(locale) };
}

export const LOCALE_COOKIE_NAME = COOKIE_NAME;
