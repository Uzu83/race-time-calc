"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type DistanceKey, targetAfterFromChange } from "./distance";

interface CalcState {
  fromKey: DistanceKey;
  fromTimeSec: number;
  toKey: DistanceKey;
  setFromKey: (k: DistanceKey) => void;
  setFromTimeSec: (s: number) => void;
  setToKey: (k: DistanceKey) => void;
}

export const useCalcStore = create<CalcState>()(
  persist(
    (set) => ({
      fromKey: "10k",
      fromTimeSec: 50 * 60,
      toKey: "full",
      setFromKey: (k) => set((s) => ({ fromKey: k, toKey: targetAfterFromChange(k, s.toKey) })),
      setFromTimeSec: (s) => set({ fromTimeSec: s }),
      setToKey: (k) => set({ toKey: k }),
    }),
    {
      name: "race-time-calc:input",
      storage: typeof window === "undefined" ? undefined : createJSONStorage(() => sessionStorage),
    },
  ),
);
