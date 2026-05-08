"use client";

import { useEffect, useMemo, useState } from "react";
import { DISTANCES, type DistanceKey } from "@/lib/distance";
import { useI18n } from "@/lib/i18n/Provider";
import { formatTime, parseTimeString } from "@/lib/time";

type Mode = "distTime" | "paceDist" | "pacetime";

const PRESET_KEYS: DistanceKey[] = ["3k", "5k", "10k", "15k", "half", "30k", "full"];

const M_PER_MILE = 1609.344;

function paceParse(input: string): number | null {
  // accept "5:30" or "5:30.5" → seconds per unit
  const m = input.match(/^(\d{1,2}):(\d{1,2})(?:\.(\d{1,2}))?$/);
  if (!m) return null;
  const min = Number(m[1]);
  const sec = Number(m[2]);
  const dec = m[3] ? Number(`0.${m[3]}`) : 0;
  if (sec >= 60) return null;
  return min * 60 + sec + dec;
}

function fmtPace(secPerUnit: number): string {
  if (!Number.isFinite(secPerUnit) || secPerUnit <= 0) return "—";
  const m = Math.floor(secPerUnit / 60);
  const s = secPerUnit - m * 60;
  const ss = s.toFixed(0).padStart(2, "0");
  return `${m}:${ss === "60" ? "00" : ss}`;
}

export default function PaceCalculator() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("distTime");

  // distance state
  const [distKey, setDistKey] = useState<DistanceKey | "custom">("10k");
  const [customMeters, setCustomMeters] = useState<string>("10000");
  const distanceMeters =
    distKey === "custom" ? Math.max(0, Number(customMeters) || 0) : DISTANCES[distKey];

  // time state
  const [timeStr, setTimeStr] = useState("0:45:30");
  const timeSec = parseTimeString(timeStr) ?? 0;

  // pace state (min/km)
  const [paceStr, setPaceStr] = useState("4:30");
  const paceSecPerKm = paceParse(paceStr) ?? 0;

  // compute outputs based on mode
  const out = useMemo(() => {
    if (mode === "distTime" && distanceMeters > 0 && timeSec > 0) {
      const sPerKm = timeSec / (distanceMeters / 1000);
      const sPerMi = sPerKm * (M_PER_MILE / 1000);
      const kmh = distanceMeters / 1000 / (timeSec / 3600);
      const mph = kmh / (M_PER_MILE / 1000);
      return { paceKm: sPerKm, paceMi: sPerMi, kmh, mph, time: timeSec, dist: distanceMeters };
    }
    if (mode === "paceDist" && distanceMeters > 0 && paceSecPerKm > 0) {
      const time = paceSecPerKm * (distanceMeters / 1000);
      const sPerMi = paceSecPerKm * (M_PER_MILE / 1000);
      const kmh = 3600 / paceSecPerKm;
      const mph = kmh / (M_PER_MILE / 1000);
      return { paceKm: paceSecPerKm, paceMi: sPerMi, kmh, mph, time, dist: distanceMeters };
    }
    if (mode === "pacetime" && timeSec > 0 && paceSecPerKm > 0) {
      const distKm = timeSec / paceSecPerKm;
      const sPerMi = paceSecPerKm * (M_PER_MILE / 1000);
      const kmh = 3600 / paceSecPerKm;
      const mph = kmh / (M_PER_MILE / 1000);
      return {
        paceKm: paceSecPerKm,
        paceMi: sPerMi,
        kmh,
        mph,
        time: timeSec,
        dist: distKm * 1000,
      };
    }
    return null;
  }, [mode, distanceMeters, timeSec, paceSecPerKm]);

  // Sync custom meters input when picking a preset
  useEffect(() => {
    if (distKey !== "custom") setCustomMeters(String(DISTANCES[distKey]));
  }, [distKey]);

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div
        className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-black/20 p-1"
        role="tablist"
        aria-label="mode"
      >
        {(
          [
            ["distTime", t.pace.modeDistTime],
            ["paceDist", t.pace.modeTimeDistPace],
            ["pacetime", t.pace.modePaceDist],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              mode === m
                ? "bg-(--color-accent) text-black"
                : "text-(--color-text-muted) hover:bg-white/5 hover:text-(--color-text)"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="space-y-5 rounded-2xl border border-white/10 bg-(--color-card) p-5">
        {/* Distance — shown unless we're computing distance */}
        {mode !== "pacetime" && (
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-(--color-accent-soft)">
              {t.pace.distance}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setDistKey(k)}
                  aria-pressed={distKey === k}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    distKey === k
                      ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-accent)"
                      : "border-white/10 bg-white/5 text-(--color-text-muted) hover:border-white/30"
                  }`}
                >
                  {t.distances[k]}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDistKey("custom")}
                aria-pressed={distKey === "custom"}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  distKey === "custom"
                    ? "border-(--color-accent) bg-(--color-accent)/15 text-(--color-accent)"
                    : "border-white/10 bg-white/5 text-(--color-text-muted) hover:border-white/30"
                }`}
              >
                {t.pace.custom}
              </button>
            </div>
            {distKey === "custom" && (
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={customMeters}
                onChange={(e) => setCustomMeters(e.target.value)}
                placeholder={t.pace.customMeters}
                className="w-full rounded-lg border border-white/15 bg-(--color-bg-soft) px-3 py-2 font-mono text-sm outline-none focus:border-(--color-accent)"
              />
            )}
          </fieldset>
        )}

        {/* Time — shown unless we're computing time */}
        {mode !== "paceDist" && (
          <div className="space-y-2">
            <label
              htmlFor="pace-time"
              className="block text-sm font-semibold text-(--color-accent-soft)"
            >
              {t.pace.time}
            </label>
            <input
              id="pace-time"
              inputMode="numeric"
              autoComplete="off"
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              placeholder="0:45:30"
              className="w-full rounded-lg border border-white/15 bg-(--color-bg-soft) px-4 py-3 font-mono text-xl outline-none focus:border-(--color-accent)"
            />
          </div>
        )}

        {/* Pace — shown unless we're computing pace */}
        {mode !== "distTime" && (
          <div className="space-y-2">
            <label
              htmlFor="pace-pace"
              className="block text-sm font-semibold text-(--color-accent-soft)"
            >
              {t.pace.paceLabel} ({t.pace.perKm})
            </label>
            <input
              id="pace-pace"
              inputMode="numeric"
              autoComplete="off"
              value={paceStr}
              onChange={(e) => setPaceStr(e.target.value)}
              placeholder="4:30"
              className="w-full rounded-lg border border-white/15 bg-(--color-bg-soft) px-4 py-3 font-mono text-xl outline-none focus:border-(--color-accent)"
            />
          </div>
        )}
      </div>

      {/* Output */}
      {out ? (
        <div className="space-y-3 rounded-2xl border border-(--color-accent)/30 bg-gradient-to-br from-(--color-accent)/10 to-(--color-rune)/5 p-5">
          {mode === "distTime" && (
            <div>
              <div className="text-xs text-(--color-text-muted)">
                {t.pace.paceLabel} ({t.pace.perKm})
              </div>
              <div className="font-mono text-4xl font-bold text-(--color-accent)">
                {fmtPace(out.paceKm)}
                <span className="ml-1 text-base text-(--color-text-muted)">{t.pace.perKm}</span>
              </div>
            </div>
          )}
          {mode === "paceDist" && (
            <div>
              <div className="text-xs text-(--color-text-muted)">{t.pace.time}</div>
              <div className="font-mono text-4xl font-bold text-(--color-accent)">
                {formatTime(out.time, { forceHours: out.time >= 3600 })}
              </div>
            </div>
          )}
          {mode === "pacetime" && (
            <div>
              <div className="text-xs text-(--color-text-muted)">{t.pace.distance}</div>
              <div className="font-mono text-4xl font-bold text-(--color-accent)">
                {(out.dist / 1000).toFixed(2)}
                <span className="ml-1 text-base text-(--color-text-muted)">km</span>
              </div>
            </div>
          )}

          <hr className="border-white/10" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <UnitCell label={t.pace.perKm} value={`${fmtPace(out.paceKm)}`} />
            <UnitCell label={t.pace.perMi} value={`${fmtPace(out.paceMi)}`} />
            <UnitCell label={t.pace.kmh} value={out.kmh.toFixed(2)} />
            <UnitCell label={t.pace.mph} value={out.mph.toFixed(2)} />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 p-5 text-center text-xs text-(--color-text-muted)">
          {t.form.inputPaceHint}
        </div>
      )}
    </div>
  );
}

function UnitCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-center">
      <div className="text-[10px] text-(--color-text-muted)">{label}</div>
      <div className="font-mono text-base font-bold">{value}</div>
    </div>
  );
}
