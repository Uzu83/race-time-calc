import { describe, expect, it } from "vitest";
import {
  formatSignedDelta,
  formatTime,
  formatTimeJa,
  parseTimeString,
  secondsToHMS,
} from "@/lib/time";

describe("parseTimeString", () => {
  it("parses h:mm:ss", () => {
    expect(parseTimeString("4:23:15")).toBe(4 * 3600 + 23 * 60 + 15);
  });
  it("parses mm:ss", () => {
    expect(parseTimeString("45:30")).toBe(45 * 60 + 30);
  });
  it("rejects malformed input", () => {
    expect(parseTimeString("hello")).toBeNull();
    expect(parseTimeString("4:60:00")).toBeNull();
    expect(parseTimeString("1")).toBeNull();
    expect(parseTimeString("")).toBeNull();
  });
});

describe("formatTime", () => {
  it("formats sub-hour without forceHours", () => {
    expect(formatTime(2730)).toBe("45:30");
  });
  it("formats with hours when forced", () => {
    expect(formatTime(2730, { forceHours: true })).toBe("0:45:30");
  });
  it("formats h:mm:ss for >1h", () => {
    expect(formatTime(4 * 3600 + 23 * 60 + 15)).toBe("4:23:15");
  });
});

describe("formatTimeJa", () => {
  it("formats Japanese readable", () => {
    expect(formatTimeJa(4 * 3600 + 23 * 60 + 15)).toBe("4時間23分15秒");
  });
  it("omits zero hours when none", () => {
    expect(formatTimeJa(45 * 60 + 30)).toBe("45分30秒");
  });
});

describe("formatSignedDelta", () => {
  it("formats positive minutes:seconds", () => {
    expect(formatSignedDelta(23 * 60 + 5)).toBe("+23分05秒");
  });
  it("formats negative", () => {
    expect(formatSignedDelta(-(60 + 30))).toBe("−1分30秒");
  });
});

describe("secondsToHMS", () => {
  it("decomposes correctly", () => {
    expect(secondsToHMS(3725)).toEqual({ h: 1, m: 2, s: 5 });
  });
});
