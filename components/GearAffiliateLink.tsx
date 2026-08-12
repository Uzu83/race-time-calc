"use client";

import { track } from "@vercel/analytics";

interface Props {
  href: string;
  label: string;
  tier: string;
}

/** Client wrapper so we can fire Vercel Analytics on affiliate outbound clicks. */
export default function GearAffiliateLink({ href, label, tier }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => {
        track("affiliate_click", { partner: "amazon", surface: "shoes", tier });
      }}
      className="mt-3 inline-flex items-center justify-center rounded-xl bg-(--color-accent) px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
    >
      {label}
    </a>
  );
}
