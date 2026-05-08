import { describe, expect, it } from "vitest";
import { adjustedTime, paceMultiplierForTemp } from "@/lib/heat";

describe("paceMultiplierForTemp", () => {
  it("no slowdown at or below baseline (10°C)", () => {
    expect(paceMultiplierForTemp(10, 42195)).toBe(1);
    expect(paceMultiplierForTemp(0, 42195)).toBe(1);
  });

  it("about +1.6% per +5°C in the cool→warm range", () => {
    const m15 = paceMultiplierForTemp(15, 42195);
    const m20 = paceMultiplierForTemp(20, 42195);
    expect(m15).toBeCloseTo(1.016, 2);
    expect(m20).toBeCloseTo(1.032, 2);
  });

  it("hotter range steepens (~+2% per +5°C above 20°C)", () => {
    const m20 = paceMultiplierForTemp(20, 42195);
    const m25 = paceMultiplierForTemp(25, 42195);
    expect(m25 - m20).toBeGreaterThan(0.018);
  });

  it("shorter races see less slowdown", () => {
    const fullSlowdown = paceMultiplierForTemp(25, 42195) - 1;
    const fiveKSlowdown = paceMultiplierForTemp(25, 5000) - 1;
    expect(fiveKSlowdown).toBeLessThan(fullSlowdown);
  });
});

describe("adjustedTime", () => {
  it("scales baseline by the multiplier", () => {
    const base = 4 * 3600;
    const adj = adjustedTime(base, 25, 42195);
    expect(adj).toBeGreaterThan(base);
  });
});
