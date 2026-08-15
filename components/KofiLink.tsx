"use client";

import { track } from "@vercel/analytics";

export type KofiSurface = "result" | "footer";

interface Props {
  href: string;
  label: string;
  surface: KofiSurface;
  className?: string;
}

/** Outbound Ko-fi link with conversion tracking. */
export default function KofiLink({ href, label, surface, className }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        track("kofi_click", { surface });
      }}
    >
      {label}
    </a>
  );
}
