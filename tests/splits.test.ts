import { describe, expect, it } from "vitest";
import { planSplits } from "@/lib/splits";

describe("planSplits", () => {
  it("even strategy: 8 segments of 5km + 1 remainder for marathon", () => {
    const rows = planSplits(42.195, 4 * 3600, "even");
    expect(rows).toHaveLength(9);
    // total cumulative ≈ 4h
    expect(Math.round(rows[rows.length - 1]!.cumulativeSec)).toBe(4 * 3600);
  });

  it("even strategy keeps each 5km segment equal", () => {
    const rows = planSplits(42.195, 4 * 3600, "even");
    const fullSegments = rows.filter((r) => Math.abs(r.segmentKm - 5) < 1e-6);
    const first = fullSegments[0]!.segmentSec;
    for (const r of fullSegments) {
      expect(Math.abs(r.segmentSec - first)).toBeLessThan(0.001);
    }
  });

  it("negative strategy: back half is faster than front half", () => {
    const rows = planSplits(42.195, 4 * 3600, "negative");
    const fullSegments = rows.filter((r) => Math.abs(r.segmentKm - 5) < 1e-6);
    const half = Math.floor(fullSegments.length / 2);
    const front = fullSegments.slice(0, half).reduce((a, r) => a + r.segmentSec, 0);
    const back = fullSegments.slice(-half).reduce((a, r) => a + r.segmentSec, 0);
    expect(back).toBeLessThan(front);
  });

  it("returns [] for invalid input", () => {
    expect(planSplits(0, 1000, "even")).toEqual([]);
    expect(planSplits(10, 0, "even")).toEqual([]);
  });

  it("total time equals input time exactly", () => {
    const rows = planSplits(21.0975, 1.5 * 3600, "negative");
    const total = rows[rows.length - 1]!.cumulativeSec;
    expect(Math.abs(total - 1.5 * 3600)).toBeLessThan(0.01);
  });
});
