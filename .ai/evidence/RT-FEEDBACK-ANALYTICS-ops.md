# Evidence: RT growth + feedback ops (2026-08-15)

## Web Analytics
- `vercel project web-analytics --format json` → `enabled: true` (`prj_0mdDQZQDXk68BH8HxhR6dW1s8GQj`).
- `vercel metrics vercel.analytics_pageview.count --since 7d` → **summary sum = 6** pageviews.
- MCP `get_web_analytics` still 404; CLI metrics works.
- Custom events need a deploy of this branch before they appear.

## Env
- Pre-existing: `NEXT_PUBLIC_SITE_URL` (Preview+Production), `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG` (Preview+Production).
- Added: `NEXT_PUBLIC_SITE_URL` Development.
- Added: all six `NEXT_PUBLIC_FEEDBACK_FIREBASE_*` for **Production** and **Development**.
- Preview: agent CLI requires an explicit git-branch; production branch cannot be used for Preview vars; feature branch must exist on remote first. **After push**, run:
  `vercel env add NEXT_PUBLIC_FEEDBACK_FIREBASE_* preview auto/feat-feedback-analytics-2026-08-15 --value … --yes --force` ×6
- `NEXT_PUBLIC_FEEDBACK_TARGET=prod` **not** set (attached plan out of scope).

## GSC
- Verification meta present in `app/layout.tsx`.
- Owner if needed: submit `https://race-time-calc.vercel.app/sitemap.xml`.

## Feedback smoke (feedback_dev)
- Local `.env.local` from feedback-platform web config (gitignored).
- Smoke → **ok** `feedback_dev/3a0adde9-ac54-4a94-b7dd-e3e16d4ab114` (`product: race-time-calc`, `wantsReply: false`).
- Firestore MCP confirmed the doc. Prod collection `feedback` query for this product returned empty (no accidental prod write from smoke).

## Local quality
- `pnpm test` 65 passed / `typecheck` / `check` / `build` OK.
