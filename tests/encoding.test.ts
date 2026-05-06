import { describe, expect, it } from "vitest";
import { decodeInput, encodeInput } from "@/lib/encoding";

describe("encoding", () => {
  it("round trips", () => {
    const input = { fromKey: "10k", fromTimeSec: 2700, toKey: "full" } as const;
    const hash = encodeInput(input);
    expect(hash).toBe("10k-2700-full");
    expect(decodeInput(hash)).toEqual(input);
  });

  it("rejects unknown distance keys", () => {
    expect(decodeInput("foo-3000-full")).toBeNull();
    expect(decodeInput("10k-3000-bar")).toBeNull();
  });

  it("rejects non-integer / non-positive time", () => {
    expect(decodeInput("10k-abc-full")).toBeNull();
    expect(decodeInput("10k-0-full")).toBeNull();
    expect(decodeInput("10k--500-full")).toBeNull();
  });

  it("rejects unrealistic times", () => {
    expect(decodeInput(`10k-${24 * 3600 + 1}-full`)).toBeNull();
  });

  it("rejects malformed shapes", () => {
    expect(decodeInput("10k-2700")).toBeNull();
    expect(decodeInput("10k-2700-full-extra")).toBeNull();
    expect(decodeInput("")).toBeNull();
  });
});
