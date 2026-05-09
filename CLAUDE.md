# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

マラソンタイム予測ツール (Race Time Calculator) — a stateless, mobile-first Next.js web app that predicts marathon times from a shorter race result, using **three models in parallel** (Riegel / VDOT / Cameron).

This is the third project in the **stateless URL-as-data viral SNS tool** family alongside:

- **サイリウムカラー診断 (`pen-light-color`)** — 64型 idol-color personality quiz.
- **LOLキャラタイプ診断 (`league-of-legends-champion`)** — LoL champion match by play-style vector.

The spec mandates inheriting that stack and DNA. Source: Notion page `マラソン予測ツール` (id `3581ef84-88d5-8180-ae4f-f4bc9a1dc004`).

## Toolchain

mise + pnpm. Versions pinned in `.mise.toml`.

```bash
mise install                # Node 24 + pnpm 10
pnpm install
pnpm dev                    # next dev
pnpm build && pnpm start    # production
pnpm test                   # vitest run
pnpm test -- tests/predict.test.ts   # single file
pnpm typecheck              # tsc --noEmit
pnpm check                  # biome lint + format
pnpm fmt                    # biome format --write .
```

## Architecture

### Data flow

1. `/` renders `<CalcForm>` (`components/CalcForm.tsx`). Distance presets + h:mm:ss text input + target distance.
2. On submit, `lib/encoding.ts` encodes `{fromKey, fromTimeSec, toKey}` → `{from}-{seconds}-{to}` (e.g. `10k-2700-full`) and routes to `/result/[hash]`.
3. `/result/[hash]/page.tsx` decodes the hash → calls `predictAll()` from `lib/predict.ts` → renders 3-model card + sub-target gap + pace chart + training plan + share buttons.
4. `/api/og?hash=…` (Edge runtime, `app/api/og/route.tsx`) generates the 1200×630 OGP image via `next/og`.

The hash *is* the data. No backend, no DB. Same hash → same result, always.

### Prediction math (`lib/predict.ts`)

Three models in parallel:

- **Riegel — general (k=1.14)** — `T2 = T1 · (D2/D1)^1.14`. The Notion-spec-mandated default for amateur runners; predicts more pace falloff than the elite constant.
- **VDOT (Daniels)** — velocity v (m/min) → VO2 = `-4.6 + 0.182258·v + 0.000104·v²` → VDOT = VO2 / `pctVO2max(t)` where `pctVO2max(t) = 0.8 + 0.1894393·exp(-0.012778·t) + 0.2989558·exp(-0.1932605·t)` (t in min). Inversion uses 80-step bisection on time.
- **Riegel — elite (k=1.06)** — Riegel's original constant for highly trained runners. Acts as the "optimistic upper bound" of the prediction range. (The Notion spec mentioned Cameron 1998 here; we tried that formula and found it produces unrealistic predictions for amateurs (~3:09 marathon from a 10K of 45:00 — mathematically the textbook constants barely curve at amateur paces). Riegel-elite is a transparent, verifiable substitute that fills the same "fast-end of the spread" role.)

The result page shows all three plus their mean ("3モデル平均" = `consensusSeconds`).

### Routes

- `/` — input form + Quick Presets + popular landings
- `/result/[hash]` — share-friendly result, decodes hash; bad hash → `not-found`
- `/predict` — index of programmatic-SEO landings
- `/predict/[slug]` — static landings for popular combos (e.g. `10k-45-00-full`). `generateStaticParams` emits `POPULAR_PREDICT_SLUGS` from `lib/seo-landings.ts`. Uses the same `<ResultView>` as `/result/[hash]`.
- `/pace` — distance / time / pace three-way calculator
- `/about` — model explanation + FAQ (drives `FAQPage` JSON-LD)
- `/api/og` — Edge runtime, `next/og` `ImageResponse` (1-day revalidate)
- `/sitemap.xml` `/robots.txt`

### SEO

- Per-route `alternates.canonical` set explicitly. `metadataBase` from `lib/site.ts`.
- JSON-LD emitted via `<JsonLd>` (server component): `WebApplication` (home + landings), `FAQPage` (about), `BreadcrumbList` + `Dataset` (results + landings).
- Internal linking via `<PopularLandings>` (home + result footer "related").
- All long-tail landings listed in `app/sitemap.ts`.

### Analytics

- `@vercel/analytics` + `@vercel/speed-insights` mounted in `app/layout.tsx`. Speed Insights surfaces Core Web Vitals in the Vercel dashboard — see Notion `📊 Vercel Analytics設定テンプレ`.

## Conventions

- **Tailwind v4** via `@tailwindcss/postcss`. Theme tokens in `app/globals.css` `@theme {}`, consumed as `text-(--color-accent)`.
- **TypeScript strict** with `noUncheckedIndexedAccess` — array/record access yields `T | undefined`. Use `arr[0]!` or `arr[i] ?? fallback`.
- **i18n is in scope** — `ja` (default) / `en` / `ko`. All user-facing copy lives in `lib/i18n/dictionary.ts` typed by `Dict`. Locale picked from cookie (`race-time-calc:locale`, see `lib/i18n/cookie.ts`) or Accept-Language. Server: `getServerDict()`. Client: `useI18n()`.
- **`SITE_URL`** is centralized in `lib/site.ts` (`NEXT_PUBLIC_SITE_URL` env, fallback to a stub). Always import from there — never read the env directly.
- **Zustand store is `"use client"`** and uses `sessionStorage` (not localStorage) — inputs don't persist across browser restarts on purpose.
- **No backend.** If a feature needs persistence, it should be encoded in the URL or dropped.

## Hard Constraints (excerpt)

- Predictions are estimates. Always include the disclaimer about weather / course / training state in the UI.
- Calculation must be pure JS — no backend, no DB, no external API calls at runtime.
- Result must be reproducible from URL alone (share works).
- 曜日表示は日曜始まり (sister-project convention).

## Approval Gates

Confirm with the user before:

- Adding a new dependency to `package.json`
- Bumping Node / Next.js / Tailwind major versions
- Changing env vars or deploy config
- Deleting files or doing a large refactor
- Adding any backend (DB, server actions that hit external services, etc.)

## Roadmap

1. **Phase 1 (MVP)** — 3-model prediction, input UI, result page, OGP, training plan ✅
2. **Phase 2 (polish)** — pace chart even/negative split toggle ✅, FAQ + JSON-LD ✅, Speed Insights ✅. Remaining: Lighthouse mobile ≥ 90 verification.
3. **Phase 3 (growth)** — `/predict/[slug]` programmatic landings (initial set of ~27 slugs) ✅. Remaining: affiliate links (シューズ・Garmin), AdSense after DAU threshold, GA4 (`@next/third-parties`) when needed.
