"use client";

import { track } from "@vercel/analytics";

export type GearAffiliatePlacement = "hero" | "training";

interface Props {
  href: string;
  label: string;
  tier: string;
  placement: GearAffiliatePlacement;
}

/** Client wrapper so we can fire Vercel Analytics on affiliate outbound clicks. */
export default function GearAffiliateLink({ href, label, tier, placement }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => {
        track("affiliate_click", { partner: "amazon", surface: "shoes", tier, placement });
      }}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-accent) px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-(--color-accent)/20 transition hover:opacity-90"
    >
      <span>{label}</span>
      <span aria-hidden className="text-base leading-none">
        ↗
      </span>
    </a>
  );
}
