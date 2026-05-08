import { DISTANCES, type DistanceKey } from "./distance";
import { consensusSeconds, predictAll } from "./predict";

export interface EquivalentRow {
  key: DistanceKey;
  seconds: number;
}

/** Predict the user's time at every canonical distance, using a 3-model consensus. */
export function equivalentTimes(fromKey: DistanceKey, fromTimeSec: number): EquivalentRow[] {
  const fromMeters = DISTANCES[fromKey];
  const order: DistanceKey[] = ["3k", "5k", "10k", "15k", "half", "30k", "full"];
  return order.map((key) => {
    if (key === fromKey) return { key, seconds: fromTimeSec };
    const preds = predictAll(fromMeters, fromTimeSec, DISTANCES[key]);
    return { key, seconds: consensusSeconds(preds) };
  });
}
