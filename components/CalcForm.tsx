"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DISTANCE_LABEL_JA, DISTANCES, type DistanceKey } from "@/lib/distance";
import { encodeInput } from "@/lib/encoding";
import { useCalcStore } from "@/lib/store";
import { formatTime, parseTimeString, secondsToHMS } from "@/lib/time";

const FROM_KEYS: DistanceKey[] = ["3k", "5k", "10k", "15k", "half", "30k"];
const TO_KEYS: DistanceKey[] = ["5k", "10k", "half", "30k", "full"];

export default function CalcForm() {
  const router = useRouter();
  const { fromKey, fromTimeSec, toKey, setFromKey, setFromTimeSec, setToKey } = useCalcStore();
  const [timeInput, setTimeInput] = useState<string>(() =>
    formatTime(fromTimeSec, { forceHours: true }),
  );
  const [error, setError] = useState<string | null>(null);

  // Sync input field when store changes externally (e.g. preset click).
  useEffect(() => {
    setTimeInput(formatTime(fromTimeSec, { forceHours: true }));
  }, [fromTimeSec]);

  const inferredPace = useMemo(() => {
    const meters = DISTANCES[fromKey];
    if (!meters || fromTimeSec <= 0) return null;
    const sec = fromTimeSec / (meters / 1000);
    const m = Math.floor(sec / 60);
    const s = Math.round(sec - m * 60);
    return `${m}'${s.toString().padStart(2, "0")}"/km`;
  }, [fromKey, fromTimeSec]);

  function applyTimeInput(raw: string) {
    setTimeInput(raw);
    const sec = parseTimeString(raw);
    if (sec === null) {
      setError("時間の形式が正しくありません (例: 0:45:30 や 45:30)");
      return;
    }
    if (sec <= 0 || sec > 24 * 3600) {
      setError("現実的な範囲のタイムを入力してください");
      return;
    }
    setError(null);
    setFromTimeSec(sec);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sec = parseTimeString(timeInput);
    if (sec === null || sec <= 0 || sec > 24 * 3600) {
      setError("時間の形式が正しくありません (例: 0:45:30 や 45:30)");
      return;
    }
    if (fromKey === toKey) {
      setError("現在の距離と予測したい距離が同じです");
      return;
    }
    const hash = encodeInput({ fromKey, fromTimeSec: sec, toKey });
    router.push(`/result/${hash}`);
  }

  const { h, m, s } = secondsToHMS(fromTimeSec);

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-(--color-accent)/30 bg-gradient-to-br from-(--color-accent)/8 to-(--color-rune)/5 p-5 md:p-7"
    >
      <fieldset className="space-y-2">
        <legend className="block text-sm font-semibold text-(--color-accent-soft)">
          現在の自己ベスト距離
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
              {DISTANCE_LABEL_JA[k].replace(/ \(.*\)/, "")}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-(--color-accent-soft)" htmlFor="time">
          そのタイム (時:分:秒)
        </label>
        <input
          id="time"
          inputMode="numeric"
          autoComplete="off"
          value={timeInput}
          onChange={(e) => applyTimeInput(e.target.value)}
          placeholder="0:45:30"
          className="w-full rounded-lg border border-white/15 bg-(--color-bg-soft) px-4 py-3 font-mono text-2xl tracking-wider text-(--color-text) outline-none focus:border-(--color-accent)"
        />
        <div className="flex items-center justify-between text-xs text-(--color-text-muted)">
          <span>
            {h}時間 {m}分 {s.toString().padStart(2, "0")}秒
          </span>
          {inferredPace && <span>推定ペース {inferredPace}</span>}
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="block text-sm font-semibold text-(--color-accent-soft)">
          予測したい距離
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
              {DISTANCE_LABEL_JA[k].replace(/ \(.*\)/, "")}
            </button>
          ))}
        </div>
      </fieldset>

      {error && (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="pulse-ring w-full rounded-xl bg-(--color-accent) px-6 py-4 text-base font-bold text-black transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        🏃 予測する
      </button>
    </form>
  );
}
