import { describe, expect, it } from "vitest";
import {
  consensusSeconds,
  nextSubTargetGap,
  predictAll,
  predictRiegel,
  predictVdot,
  vdotFromRace,
} from "@/lib/predict";

describe("predictRiegel", () => {
  it("matches the textbook example: 10K 40:00 → half ≈ 1:28:11 (k=1.06)", () => {
    // Textbook elite-runner Riegel: 2400 * (21097.5/10000)^1.06 ≈ 5291s = 1:28:11
    const sec = predictRiegel(10_000, 2400, 21097.5, 1.06);
    expect(sec).toBeGreaterThan(5280);
    expect(sec).toBeLessThan(5310);
  });

  it("k=1.14 (general runner) predicts slower than k=1.06", () => {
    const elite = predictRiegel(10_000, 2400, 42195, 1.06);
    const general = predictRiegel(10_000, 2400, 42195, 1.14);
    expect(general).toBeGreaterThan(elite);
  });

  it("returns 0 for non-positive inputs", () => {
    expect(predictRiegel(0, 1000, 5000)).toBe(0);
    expect(predictRiegel(5000, 0, 5000)).toBe(0);
    expect(predictRiegel(5000, 1000, 0)).toBe(0);
  });
});

describe("predictVdot", () => {
  it("predicts a sensible full marathon from a 10K of 50:00", () => {
    const sec = predictVdot(10_000, 50 * 60, 42195);
    // 10K 50:00 ≈ sub-4 marathon for most general runners
    expect(sec).toBeGreaterThan(3.5 * 3600);
    expect(sec).toBeLessThan(4.2 * 3600);
  });

  it("VDOT round-trips: predicting the input distance returns ~the input time", () => {
    const sec = predictVdot(10_000, 45 * 60, 10_000);
    expect(Math.abs(sec - 45 * 60)).toBeLessThan(2);
  });

  it("vdotFromRace gives a reasonable VO2 for a 5K 20:00 (~ VDOT 49)", () => {
    const v = vdotFromRace(5000, 20 * 60);
    expect(v).toBeGreaterThan(48);
    expect(v).toBeLessThan(51);
  });
});

describe("predictAll + consensus", () => {
  it("returns 3 entries: Riegel-general, VDOT, Riegel-elite", () => {
    const ps = predictAll(10_000, 45 * 60, 42195);
    expect(ps).toHaveLength(3);
    expect(ps.map((p) => p.model)).toEqual(["riegel", "vdot", "riegelElite"]);
  });

  it("Riegel-general predicts slowest, Riegel-elite fastest", () => {
    const ps = predictAll(10_000, 45 * 60, 42195);
    const general = ps.find((p) => p.model === "riegel")!.seconds;
    const elite = ps.find((p) => p.model === "riegelElite")!.seconds;
    expect(general).toBeGreaterThan(elite);
  });

  it("consensus is between min and max", () => {
    const ps = predictAll(10_000, 45 * 60, 42195);
    const avg = consensusSeconds(ps);
    const min = Math.min(...ps.map((p) => p.seconds));
    const max = Math.max(...ps.map((p) => p.seconds));
    expect(avg).toBeGreaterThanOrEqual(min);
    expect(avg).toBeLessThanOrEqual(max);
  });
});

describe("nextSubTargetGap", () => {
  it("returns the next-faster unachieved tier (sub3.5 when predicted is 3:48)", () => {
    // 3.8h = 3:48 → already cleared sub4 (≤4h), but not sub3.5 (≤3.5h).
    const r = nextSubTargetGap(3.8 * 3600, 42195);
    expect(r?.target.key).toBe("sub3.5");
    expect(r?.achieved).toBe(false);
  });

  it("returns sub4 when predicted is between sub4 and sub5", () => {
    const r = nextSubTargetGap(4.5 * 3600, 42195);
    expect(r?.target.key).toBe("sub4");
    expect(r?.achieved).toBe(false);
  });

  it("flags achieved when faster than the fastest tier", () => {
    const r = nextSubTargetGap(2.4 * 3600, 42195);
    expect(r?.achieved).toBe(true);
  });

  it("returns null for non-canonical distances", () => {
    expect(nextSubTargetGap(20 * 60, 5000)).toBeNull();
  });
});
