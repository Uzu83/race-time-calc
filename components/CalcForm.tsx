"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DISTANCES, type DistanceKey, paceSecondsPerKmToString } from "@/lib/distance";
import { encodeInput } from "@/lib/encoding";
import { useI18n } from "@/lib/i18n/Provider";
import { consensusSeconds, predictAll } from "@/lib/predict";
import { useCalcStore } from "@/lib/store";
import { formatTime, parseTimeString, secondsToHMS } from "@/lib/time";

const FROM_KEYS: DistanceKey[] = ["3k", "5k", "10k", "15k", "half", "30k"];
const TO_KEYS: DistanceKey[] = ["5k", "10k", "half", "30k", "full"];

export default function CalcForm() {
  const router = useRouter();
  const { t } = useI18n();
  const { fromKey, fromTimeSec, toKey, setFromKey, setFromTimeSec, setToKey } = useCalcStore();
  const [timeInput, setTimeInput] = useState<string>(() =>
    formatTime(fromTimeSec, { forceHours: true }),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTimeInput(formatTime(fromTimeSec, { forceHours: true }));
  }, [fromTimeSec]);

  const parsedInputSec = parseTimeString(timeInput);
  const readoutSec =
    parsedInputSec !== null && parsedInputSec > 0 && parsedInputSec <= 24 * 3600
      ? parsedInputSec
      : null;

  const inferredPace = useMemo(() => {
    const meters = DISTANCES[fromKey];
    if (!meters || readoutSec === null) return null;
    return paceSecondsPerKmToString(readoutSec / (meters / 1000));
  }, [fromKey, readoutSec]);

  const livePreview = useMemo(() => {
    if (fromKey === toKey || fromTimeSec <= 0) return null;
    const preds = predictAll(DISTANCES[fromKey], fromTimeSec, DISTANCES[toKey]);
    return consensusSeconds(preds);
  }, [fromKey, fromTimeSec, toKey]);

  function applyTimeInput(raw: string) {
    setTimeInput(raw);
    const sec = parseTimeString(raw);
    if (sec === null) {
      setError(t.form.invalidTime);
      return;
    }
    if (sec <= 0 || sec > 24 * 3600) {
      setError(t.form.unrealistic);
      return;
    }
    setError(null);
    setFromTimeSec(sec);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sec = parseTimeString(timeInput);
    if (sec === null || sec <= 0 || sec > 24 * 3600) {
      setError(t.form.invalidTime);
      return;
    }
    if (fromKey === toKey) {
      setError(t.form.sameDistance);
      return;
    }
    const hash = encodeInput({ fromKey, fromTimeSec: sec, toKey });
    router.push(`/result/${hash}`);
  }

  const readout = readoutSec === null ? null : secondsToHMS(readoutSec);

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-(--color-accent)/30 bg-gradient-to-br from-(--color-accent)/8 to-(--color-rune)/5 p-5 md:p-7"
    >
      <fieldset className="space-y-2">
        <legend className="block text-sm font-semibold text-(--color-accent-soft)">
          {t.form.currentDistance}
        </legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {FROM_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFromKey(k)}
              aria-pressed={fromKey === k}
              className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                fromKey === k
                  ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-accent)"
                  : "border-white/10 bg-white/5 text-(--color-text-muted) hover:border-white/30"
              }`}
            >
              {t.distances[k]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-(--color-accent-soft)" htmlFor="time">
          {t.form.currentTime}
        </label>
        <input
          id="time"
          inputMode="numeric"
          autoComplete="off"
          value={timeInput}
          onChange={(e) => applyTimeInput(e.target.value)}
          placeholder={t.form.timePlaceholder}
          className="w-full rounded-lg border border-white/15 bg-(--color-bg-soft) px-4 py-3 font-mono text-2xl tracking-wider text-(--color-text) outline-none focus:border-(--color-accent)"
        />
        {readout && (
          <div className="flex items-center justify-between text-xs text-(--color-text-muted)">
            <span>
              {readout.h}h {readout.m}m {readout.s.toString().padStart(2, "0")}s
            </span>
            {inferredPace && (
              <span>
                {t.form.pace} {inferredPace}
              </span>
            )}
          </div>
        )}
        {error && (
          <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
      </div>

      <fieldset className="space-y-2">
        <legend className="block text-sm font-semibold text-(--color-accent-soft)">
          {t.form.targetDistance}
        </legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {TO_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setToKey(k)}
              disabled={k === fromKey}
              aria-pressed={toKey === k}
              className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                toKey === k
                  ? "border-(--color-rune) bg-(--color-rune)/15 text-(--color-rune)"
                  : "border-white/10 bg-white/5 text-(--color-text-muted) hover:border-white/30"
              }`}
            >
              {t.distances[k]}
            </button>
          ))}
        </div>
      </fieldset>

      {livePreview && !error && (
        <div className="flex items-baseline justify-between rounded-lg border border-white/10 bg-black/20 px-4 py-3">
          <span className="text-xs text-(--color-text-muted)">→ {t.distances[toKey]}</span>
          <span className="font-mono text-2xl font-bold text-(--color-accent)">
            {formatTime(livePreview, { forceHours: livePreview >= 3600 })}
          </span>
        </div>
      )}

      <button
        type="submit"
        className="pulse-ring w-full rounded-xl bg-(--color-accent) px-6 py-4 text-base font-bold text-black transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        🏃 {t.form.submit}
      </button>
    </form>
  );
}
