# RT-QA-ISSUES verification

date: 2026-09-06
branch: auto/fix-qa-issues-2026-09-06
verdict: **ready_for_push**

## Acceptance criteria

| id | verdict | evidence |
|---|---|---|
| ac-7a | PASS | Native `<dialog showModal()>`. Browser: after open, `top=218.75`, `height=362.5`, in viewport (not ~-153). |
| ac-7b | PASS | Close button closes. `cancel` (Esc) → `open=false`. Outside `pointerdown` (backdrop) → `open=false`. Unit tests cover all three. |
| ac-7c | PASS | `tests/feedback-entry.test.tsx`: opener absent when `isFeedbackUiAllowed=false`. |
| ac-8a | PASS | `/result/5k-1500-full` h1 `4:14:02`: 1280/768/640 `scrollWidth<=clientWidth`. `/result/10k-3000-full` `3:59:13` at 1280 fits. |
| ac-8b | PASS | 390px: single column (`gridTemplateColumns: 308px`), h1 fits at 30px. |
| ac-r | PASS | 70 tests / typecheck / biome green. `lib/predict.ts` untouched. |

## Browser notes

- Local: `http://127.0.0.1:3000` with Feedback env present (opener visible).
- Follow-up after first verifier fail: removed `preventDefault` on cancel; added outside-pointer light-dismiss for backdrop (Issue #7 expects all three close paths).

## Quality gate

See `.ai/evidence/RT-QA-ISSUES-quality-gate.md` (re-run: 70 tests after backdrop case).
