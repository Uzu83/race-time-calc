import { describe, expect, it } from "vitest";
import { targetAfterFromChange } from "../lib/distance";

describe("targetAfterFromChange", () => {
  it("現在距離を 5K にしても目標が 5K のまま残らない（#10）", () => {
    expect(targetAfterFromChange("5k", "5k")).toBe("full");
  });

  it("すでに違う目標ならそのまま", () => {
    expect(targetAfterFromChange("5k", "half")).toBe("half");
    expect(targetAfterFromChange("10k", "full")).toBe("full");
  });

  it("10K・ハーフ・30K が目標と重なったときもフルへずらす", () => {
    expect(targetAfterFromChange("10k", "10k")).toBe("full");
    expect(targetAfterFromChange("half", "half")).toBe("full");
    expect(targetAfterFromChange("30k", "30k")).toBe("full");
  });
});
