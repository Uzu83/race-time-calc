# RT-QA-ISSUES quality-gate

date: 2026-09-06
branch: auto/fix-qa-issues-2026-09-06

## Commands

```
pnpm test && pnpm typecheck && pnpm check
```

## Results (final)

| check | result |
|---|---|
| vitest | 11 files / 70 tests passed |
| tsc --noEmit | pass |
| biome check | 69 files, no fixes |

## Notes

- Includes `tests/feedback-entry.test.tsx` (4 cases: fail-closed, Close, Esc/cancel, backdrop).
- Prediction math untouched; existing predict tests still green.
