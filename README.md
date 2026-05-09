# race-time-calc

マラソンタイム予測ツール — `5K / 10K / Half` の自己ベストから、フルマラソンを **3 モデル並列 (Riegel / VDOT / Riegel-Elite)** で予測する stateless Next.js アプリ。

姉妹プロジェクト (`pen-light-color`, `league-of-legends-champion`) と同じ「URL がデータ」「バックエンドなし」「SNS シェア前提」の DNA を引き継いでいる。詳細仕様・運用ルールは [`CLAUDE.md`](./CLAUDE.md)、Notion 戦略ハブの [🏃 RaceTime Calculator](https://www.notion.so/35a1ef8488d58123955cd4e5eae666ef) を参照。

## 主な機能

- **3 モデル並列予測**: Riegel (k=1.14, 一般ランナー) / Daniels VDOT / Riegel-Elite (k=1.06)。3 モデル平均を「代表値」、上下幅を予測レンジとして提示。
- **サブ目標差分**: フル (サブ5/4/3.5/3/2.5) とハーフ (サブ2/1:45/1:30) について「あと何分何秒で射程内か」を表示。
- **VDOT トレーニングペース**: E / M / T / I / R の 5 ゾーンを sec/km レンジで提示。
- **5km スプリットプラン**: イーブン / ネガティブの 2 戦略で 5km 区切りラップ表を生成。
- **気温補正**: Daniels の経験則 (+5°C で 1.6% 落ちる) で当日予報からタイム補正。
- **設定ペースチャート**: SVG 軽量実装。30km 以降の自然減速を反映した even / negative split 切替。
- **シェア用 OGP**: `next/og` で 1200×630 を Edge ランタイム生成。
- **i18n**: `ja` / `en` / `ko` を Cookie + Accept-Language で切替。
- **SEO**: `/predict/[slug]` で人気タイム×距離の組み合わせを静的生成、JSON-LD (WebApplication / FAQPage / BreadcrumbList / Dataset) を各ページに付与。
- **計測**: `@vercel/analytics` + `@vercel/speed-insights` を `app/layout.tsx` に組み込み済み。

## ルート

| ルート | 内容 |
|---|---|
| `/` | 入力フォーム + Quick Presets + 人気予測ランディング |
| `/result/[hash]` | 共有用結果ページ。hash は `{from}-{seconds}-{to}` |
| `/predict` | プログラマティック SEO ランディング一覧 |
| `/predict/[slug]` | 人気組み合わせの静的ランディング (例: `10k-45-00-full`) |
| `/pace` | 距離 / タイム / ペース 三項計算機 |
| `/about` | モデル説明 + FAQ |
| `/api/og` | OGP 画像 (Edge runtime) |
| `/sitemap.xml` `/robots.txt` | SEO 制御 |

## 開発

```bash
mise install                # Node 24 + pnpm 10
pnpm install
pnpm dev                    # 開発サーバ
pnpm build && pnpm start    # 本番ビルド
pnpm test                   # vitest run (57 tests)
pnpm typecheck              # tsc --noEmit
pnpm check                  # biome lint + format
pnpm fmt                    # biome format --write .
```

### 環境変数

| 変数 | 必須 | 用途 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **本番必須** | canonical / OGP / sitemap.xml / JSON-LD で使う絶対 URL。例: `https://race-time-calc.vercel.app` |

> ⚠️ **本番では必ずセット**。未設定だと `lib/site.ts` のフォールバック `https://race-time-calc.example.com` が使われ、sitemap.xml / canonical / OGP のすべてが存在しないドメインを指すため SEO 系が全滅する。Search Console 提出前に Vercel Settings → Environment Variables に追加 → Redeploy。

## アーキテクチャ要点

- **stateless**: 入力は全て URL に格納。バックエンド・DB なし。
- **`lib/site.ts`**: `NEXT_PUBLIC_SITE_URL` を一元読込。canonical / OGP / sitemap / JSON-LD すべてここ経由。
- **`lib/predict.ts`**: 3 モデルの数式実装。VDOT は 80 step 二分法で逆算。
- **`lib/seo-landings.ts`**: `/predict/[slug]` の静的パラメータ・スラッグ ⇄ RaceInput パースを集約。
- **`components/ResultView.tsx`**: `/result/[hash]` と `/predict/[slug]` で共有する結果レンダラ。
- **i18n**: 全文字列は `lib/i18n/dictionary.ts` の `Dict` 型に集約。3 ロケールで欠落をコンパイラが検出。

## デプロイ

Vercel に main へ push で自動デプロイ。

### 初回セットアップチェックリスト
1. Vercel ダッシュボードで Production ドメインを確認 (例: `race-time-calc.vercel.app`)
2. Settings → Environment Variables → `NEXT_PUBLIC_SITE_URL` を **Production + Preview** にセット
3. Redeploy (もしくは次の `git push` で自動反映)
4. `https://<your-domain>/sitemap.xml` を開いて URL が正しく出ているか確認
5. `<head>` の `<meta name="google-site-verification" ...>` で Search Console の所有権確認
6. Search Console で `sitemap.xml` を送信
7. PageSpeed Insights / Rich Results Test で構造化データ・Core Web Vitals を検証

詳細手順は Notion の [⚡ Next.js 初期セットアップテンプレ](https://www.notion.so/35a1ef8488d5815290bcd07ac5937e4f) と [📊 Vercel Analytics 設定テンプレ](https://www.notion.so/35a1ef8488d5814ba4fef7372dc88c38) を参照。
