"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOCALE_FLAGS, LOCALE_NAMES, LOCALES, type Locale } from "@/lib/i18n/locales";
import { useI18n } from "@/lib/i18n/Provider";

const COOKIE = "race-time-calc:locale";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);

  function pick(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    // biome-ignore lint/suspicious/noDocumentCookie: simple, sync, broadly supported. Cookie Store API is still partial.
    document.cookie = `${COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-black/30 px-2.5 py-1.5 text-xs hover:border-white/40"
      >
        <span aria-hidden>{LOCALE_FLAGS[locale]}</span>
        <span>{LOCALE_NAMES[locale]}</span>
        <span aria-hidden className="opacity-60">
          ▾
        </span>
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="close"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] overflow-hidden rounded-md border border-white/15 bg-(--color-bg-soft) shadow-xl">
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => pick(l)}
                aria-current={l === locale ? "true" : undefined}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                  l === locale ? "bg-(--color-accent)/15 text-(--color-accent)" : "hover:bg-white/5"
                }`}
              >
                <span aria-hidden>{LOCALE_FLAGS[l]}</span>
                <span>{LOCALE_NAMES[l]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
