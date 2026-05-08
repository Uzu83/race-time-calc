import { describe, expect, it } from "vitest";
import { paceSecPerKmAtPct, trainingPaces, ZONE_ORDER } from "@/lib/training-paces";

describe("trainingPaces", () => {
  it("returns 5 zones in canonical order", () => {
    const ps = trainingPaces(50);
    expect(ps.map((p) => p.zone)).toEqual(ZONE_ORDER);
  });

  it("zones get faster from easy to repetition", () => {
    const ps = trainingPaces(50);
    const order = ps.map((p) => p.midSecPerKm);
    for (let i = 1; i < order.length; i++) {
      expect(order[i]!).toBeLessThan(order[i - 1]!);
    }
  });

  it("higher VDOT → faster paces across the board", () => {
    const a = trainingPaces(40);
    const b = trainingPaces(60);
    for (let i = 0; i < a.length; i++) {
      expect(b[i]!.midSecPerKm).toBeLessThan(a[i]!.midSecPerKm);
    }
  });

  it("paceSecPerKmAtPct: VDOT 50 marathon zone (~82%) ≈ 4:30/km", () => {
    const sec = paceSecPerKmAtPct(50, 0.82);
    expect(sec).toBeGreaterThan(4 * 60);
    expect(sec).toBeLessThan(5 * 60);
  });
});
