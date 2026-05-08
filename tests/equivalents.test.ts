import { describe, expect, it } from "vitest";
import { equivalentTimes } from "@/lib/equivalents";

describe("equivalentTimes", () => {
  it("returns the canonical 7 distances in order", () => {
    const rows = equivalentTimes("10k", 45 * 60);
    expect(rows.map((r) => r.key)).toEqual(["3k", "5k", "10k", "15k", "half", "30k", "full"]);
  });

  it("preserves the input row exactly", () => {
    const rows = equivalentTimes("10k", 45 * 60);
    const ten = rows.find((r) => r.key === "10k");
    expect(ten?.seconds).toBe(45 * 60);
  });

  it("times grow monotonically with distance", () => {
    const rows = equivalentTimes("10k", 45 * 60);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.seconds).toBeGreaterThan(rows[i - 1]!.seconds);
    }
  });
});
