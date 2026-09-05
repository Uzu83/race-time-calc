"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  FEEDBACK_KINDS,
  isFeedbackUiAllowed,
  type RaceFeedbackKind,
  submitFeedback,
} from "@/lib/feedback/client";
import { useI18n } from "@/lib/i18n/Provider";

/**
 * Minimal feedback modal (kind + message). No email — CONNECT wantsReply:false.
 * Renders nothing when Firebase env is unset (fail-closed).
 *
 * Native <dialog showModal()> so the panel lives on the top layer, not inside
 * the sticky + backdrop-blur header (that containing block trapped the old
 * fixed overlay and made Esc / backdrop / close miss the viewport).
 */
export default function FeedbackEntry() {
  const { t } = useI18n();
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<RaceFeedbackKind>("bug");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const resetAndClose = useCallback(() => {
    setKind("bug");
    setMessage("");
    setBusy(false);
    setError(null);
    setSent(false);
    setOpen(false);
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
      const focusable = el.querySelector<HTMLElement>("select, textarea, button:not([aria-label])");
      focusable?.focus();
    } else if (el.open) {
      el.close();
      openerRef.current?.focus();
    }
  }, [open]);

  // Modal <dialog> does not light-dismiss on ::backdrop click by default.
  // Issue #7 expects backdrop dismiss; detect pointer outside the dialog box.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = dialogRef.current;
      if (!el?.open) return;
      const r = el.getBoundingClientRect();
      const { clientX: x, clientY: y } = e;
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) {
        resetAndClose();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, resetAndClose]);

  // Hooks MUST run before this gate — isFeedbackUiAllowed is not a hook, and
  // returning early above would skip useEffect on the next render if env flips.
  if (!isFeedbackUiAllowed()) return null;

  const kindLabel = (k: RaceFeedbackKind): string => {
    switch (k) {
      case "bug":
        return t.feedback.kindBug;
      case "feature":
        return t.feedback.kindFeature;
      case "ux":
        return t.feedback.kindUx;
      case "other":
        return t.feedback.kindOther;
      default: {
        const _exhaustive: never = k;
        return _exhaustive;
      }
    }
  };

  const onSubmit = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await submitFeedback({ kind, message });
      if (result.ok) {
        setSent(true);
        return;
      }
      if (result.error === "empty") {
        setError(t.feedback.errorEmpty);
      } else {
        setError(t.feedback.error);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md px-2 py-1.5 text-sm text-(--color-text-muted) transition-colors hover:bg-white/5 hover:text-(--color-text)"
      >
        {t.feedback.open}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="fixed inset-0 z-50 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-xl border border-white/15 bg-(--color-card) p-5 shadow-xl open:flex open:flex-col backdrop:bg-black/50"
        onClose={resetAndClose}
        onCancel={() => {
          // Let the UA close the dialog; onClose → resetAndClose syncs React state.
          // Do not preventDefault — that blocked Esc from actually dismissing.
          resetAndClose();
        }}
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <h2 id={titleId} className="text-base font-semibold text-(--color-text)">
            {t.feedback.title}
          </h2>
          <button
            type="button"
            onClick={resetAndClose}
            className="text-sm text-(--color-text-muted) hover:text-(--color-text)"
          >
            {t.feedback.close}
          </button>
        </div>

        {sent ? (
          <p className="text-sm text-(--color-accent-soft)">{t.feedback.thanks}</p>
        ) : (
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-(--color-text-muted)">
                {t.feedback.kindLabel}
              </span>
              <select
                value={kind}
                disabled={busy}
                onChange={(e) => setKind(e.target.value as RaceFeedbackKind)}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-(--color-text)"
              >
                {FEEDBACK_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {kindLabel(k)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-(--color-text-muted)">
                {t.feedback.messageLabel}
              </span>
              <textarea
                value={message}
                disabled={busy}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={2000}
                placeholder={t.feedback.messagePlaceholder}
                className="w-full resize-y rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
              />
            </label>

            {error ? <p className="text-xs text-rose-400">{error}</p> : null}

            <button
              type="button"
              disabled={busy || message.trim().length === 0}
              onClick={() => void onSubmit()}
              className="w-full rounded-xl bg-(--color-accent) px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
            >
              {busy ? t.feedback.sending : t.feedback.submit}
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
