"use client";

import { useState } from "react";
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
 */
export default function FeedbackEntry() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<RaceFeedbackKind>("bug");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

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

  const resetAndClose = () => {
    setKind("bug");
    setMessage("");
    setBusy(false);
    setError(null);
    setSent(false);
    setOpen(false);
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
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md px-2 py-1.5 text-sm text-(--color-text-muted) transition-colors hover:bg-white/5 hover:text-(--color-text)"
      >
        {t.feedback.open}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={t.feedback.close}
            className="absolute inset-0 bg-black/50"
            onClick={resetAndClose}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-dialog-title"
            className="relative z-10 max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-xl border border-white/15 bg-(--color-card) p-5 shadow-xl"
          >
            <div className="mb-4 flex items-start justify-between gap-2">
              <h2
                id="feedback-dialog-title"
                className="text-base font-semibold text-(--color-text)"
              >
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
          </div>
        </div>
      ) : null}
    </>
  );
}
