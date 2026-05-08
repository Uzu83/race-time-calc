"use client";

import { createContext, useContext, useMemo } from "react";
import { getDict } from "./dictionary";
import type { Locale } from "./locales";

interface I18nContextValue {
  locale: Locale;
  t: ReturnType<typeof getDict>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const value = useMemo(() => ({ locale, t: getDict(locale) }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
