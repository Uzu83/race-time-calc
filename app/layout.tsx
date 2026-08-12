import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import HeaderNav from "@/components/HeaderNav";
import { isAmazonAffiliateEnabled } from "@/lib/affiliate";
import { getDict } from "@/lib/i18n/dictionary";
import { LOCALE_HTML_LANG } from "@/lib/i18n/locales";
import { I18nProvider } from "@/lib/i18n/Provider";
import { resolveLocale } from "@/lib/i18n/server";
import { KOFI_URL, SITE_URL } from "@/lib/site";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const t = getDict(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${t.meta.siteName} — ${t.meta.siteTagline}`,
      template: `%s | ${t.meta.siteName}`,
    },
    description: t.meta.siteDescription,
    keywords: [
      "marathon",
      "race time",
      "pace calculator",
      "VDOT",
      "Riegel",
      "Daniels",
      "marathon prediction",
      "マラソン",
      "タイム予測",
      "サブ4",
      "サブ3",
      "ペース計算",
      "마라톤",
      "기록 예측",
      "페이스 계산",
    ],
    openGraph: {
      title: t.meta.siteName,
      description: t.meta.siteTagline,
      type: "website",
      locale: locale === "ja" ? "ja_JP" : locale === "ko" ? "ko_KR" : "en_US",
      siteName: t.meta.siteName,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    verification: {
      google: "hHdNAnGirkxFJ9QvjPGe6o1exoJVEAYuDEUaQPRxvS8",
    },
    alternates: {
      languages: {
        ja: `${SITE_URL}/`,
        en: `${SITE_URL}/`,
        ko: `${SITE_URL}/`,
      },
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await resolveLocale();
  const t = getDict(locale);
  return (
    <html lang={LOCALE_HTML_LANG[locale]}>
      <body>
        <I18nProvider locale={locale}>
          <HeaderNav />
          <main className="mx-auto max-w-3xl px-4 pb-24 pt-8">{children}</main>
          <footer className="border-t border-white/10 py-6 text-xs text-(--color-text-muted)">
            <div className="mx-auto max-w-3xl space-y-2 px-4 text-center leading-relaxed">
              <p>{t.footer.disclaimer}</p>
              <p className="text-[10px] opacity-60">{t.footer.citation}</p>
              <p>
                <a
                  href={KOFI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--color-rune) underline-offset-2 hover:underline"
                >
                  {t.footer.supportCta}
                </a>
              </p>
              {isAmazonAffiliateEnabled() ? (
                <p className="text-xs text-(--color-text-muted)">{t.footer.affiliateDisclosure}</p>
              ) : null}
            </div>
          </footer>
        </I18nProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
