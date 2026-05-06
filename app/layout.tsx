import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://race-time-calc.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "マラソンタイム予測 — Race Time Calculator",
    template: "%s | マラソンタイム予測",
  },
  description:
    "5K・10K・ハーフの記録から、3つの予測モデル (Riegel・VDOT・Cameron) でフルマラソンタイムを予測。サブ4・サブ3.5・サブ3達成までの差を可視化。SNSシェア用の結果カードも生成できます。",
  keywords: [
    "マラソン",
    "タイム予測",
    "フルマラソン",
    "ハーフマラソン",
    "サブ4",
    "サブ3",
    "VDOT",
    "Riegel",
    "Cameron",
    "ペース計算",
    "ランニング",
  ],
  openGraph: {
    title: "マラソンタイム予測",
    description:
      "5K・10K・ハーフの記録からフルマラソンタイムを予測。3モデル並列表示・推奨ペース・サブ目標までの差をグラフィカルに。",
    type: "website",
    locale: "ja_JP",
    siteName: "マラソンタイム予測",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="border-b border-white/10 bg-black/20 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold tracking-wide text-(--color-accent)"
            >
              <span aria-hidden>🏃</span>
              マラソンタイム予測
            </Link>
            <nav className="flex items-center gap-3 text-xs text-(--color-text-muted)">
              <Link href="/about" className="hover:text-(--color-text)">
                このツールについて
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 pb-24 pt-8">{children}</main>
        <footer className="border-t border-white/10 py-6 text-xs text-(--color-text-muted)">
          <div className="mx-auto max-w-3xl space-y-2 px-4 text-center leading-relaxed">
            <p>
              予測値はあくまで目安です。気象・コース・体調・トレーニング状態により実際のタイムは変動します。
            </p>
            <p className="text-[10px] opacity-60">
              モデル: Peter Riegel (1981) / Jack Daniels VDOT / Eddie Cameron (1998)
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
