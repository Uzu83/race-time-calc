import { describe, expect, it } from "vitest";
import {
  allPresets,
  landingSlug,
  POPULAR_PREDICT_SLUGS,
  parseLandingSlug,
  relatedPresets,
} from "@/lib/seo-landings";

describe("landingSlug", () => {
  it("encodes MM-SS for sub-hour times", () => {
    expect(landingSlug({ fromKey: "10k", fromTimeSec: 45 * 60, toKey: "full" })).toBe(
      "10k-45-00-full",
    );
  });

  it("encodes H-MM-SS for over-hour times", () => {
    expect(landingSlug({ fromKey: "half", fromTimeSec: 1 * 3600 + 45 * 60, toKey: "full" })).toBe(
      "half-1-45-00-full",
    );
  });
});

describe("parseLandingSlug", () => {
  it("round-trips every preset", () => {
    for (const p of allPresets()) {
      const slug = landingSlug(p);
      const parsed = parseLandingSlug(slug);
      expect(parsed).toEqual({
        fromKey: p.fromKey,
        fromTimeSec: p.fromTimeSec,
        toKey: p.toKey,
      });
    }
  });

  it("rejects unknown distance keys", () => {
    expect(parseLandingSlug("foo-45-00-full")).toBeNull();
    expect(parseLandingSlug("10k-45-00-bar")).toBeNull();
  });

  it("rejects malformed times", () => {
    expect(parseLandingSlug("10k-45-99-full")).toBeNull(); // seconds >= 60
    expect(parseLandingSlug("10k-60-00-full")).toBeNull(); // minutes >= 60 (no h)
    expect(parseLandingSlug("10k-1-60-00-full")).toBeNull(); // minutes >= 60 (with h)
    expect(parseLandingSlug("10k-full")).toBeNull();
    expect(parseLandingSlug("")).toBeNull();
  });

  it("rejects unrealistic times", () => {
    expect(parseLandingSlug("10k-25-00-00-full")).toBeNull(); // > 24h
  });
});

describe("POPULAR_PREDICT_SLUGS", () => {
  it("is non-empty and unique", () => {
    expect(POPULAR_PREDICT_SLUGS.length).toBeGreaterThan(10);
    expect(new Set(POPULAR_PREDICT_SLUGS).size).toBe(POPULAR_PREDICT_SLUGS.length);
  });

  it("every slug parses back", () => {
    for (const slug of POPULAR_PREDICT_SLUGS) {
      expect(parseLandingSlug(slug)).not.toBeNull();
    }
  });
});

describe("relatedPresets", () => {
  it("excludes the current input itself", () => {
    const current = { fromKey: "10k", fromTimeSec: 45 * 60, toKey: "full" } as const;
    const related = relatedPresets(current);
    expect(
      related.find(
        (p) =>
          p.fromKey === current.fromKey &&
          p.toKey === current.toKey &&
          p.fromTimeSec === current.fromTimeSec,
      ),
    ).toBeUndefined();
  });

  it("respects the limit", () => {
    const current = { fromKey: "10k", fromTimeSec: 45 * 60, toKey: "full" } as const;
    expect(relatedPresets(current, 4)).toHaveLength(4);
  });

  it("prioritizes same fromKey", () => {
    const current = { fromKey: "10k", fromTimeSec: 45 * 60, toKey: "full" } as const;
    const related = relatedPresets(current, 3);
    expect(related.every((p) => p.fromKey === "10k")).toBe(true);
  });
});
