import { afterEach, describe, expect, it, vi } from "vitest";
import {
  amazonAssociateTag,
  amazonShoeSearchUrl,
  isAmazonAffiliateEnabled,
  shoeSearchQuery,
} from "@/lib/affiliate";

describe("affiliate", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is OFF when tag env is empty", () => {
    vi.stubEnv("NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG", "");
    expect(isAmazonAffiliateEnabled()).toBe(false);
    expect(amazonAssociateTag()).toBe("");
    expect(amazonShoeSearchUrl("sub4")).toBeNull();
  });

  it("builds JP search URL with tag and tier query", () => {
    vi.stubEnv("NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG", "tosagiken-22");
    expect(isAmazonAffiliateEnabled()).toBe(true);
    const url = amazonShoeSearchUrl("sub4");
    expect(url).toMatch(/^https:\/\/www\.amazon\.co\.jp\/s\?/);
    expect(url).toContain("tag=tosagiken-22");
    // URLSearchParams encodes space as `+` (not %20)
    const parsed = new URL(url!);
    expect(parsed.searchParams.get("k")).toBe(shoeSearchQuery("sub4"));
  });

  it("uses racing flats query for sub3", () => {
    expect(shoeSearchQuery("sub3")).toContain("レーシング");
  });
});
