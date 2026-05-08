"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/Provider";

interface Props {
  url: string;
  text: string;
}

export default function ShareButtons({ url, text }: Props) {
  const { t } = useI18n();
  const [absoluteUrl, setAbsoluteUrl] = useState(url);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setAbsoluteUrl(new URL(url, window.location.href).toString());
      } catch {
        // ignore
      }
    }
  }, [url]);

  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(absoluteUrl)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(absoluteUrl)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <a
        href={xUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="rounded-full border border-white/15 bg-black/30 px-4 py-2 hover:border-(--color-rune)"
      >
        {t.share.x}
      </a>
      <a
        href={lineUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="rounded-full border border-white/15 bg-black/30 px-4 py-2 hover:border-emerald-400"
      >
        {t.share.line}
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-full border border-white/15 bg-black/30 px-4 py-2 hover:border-(--color-accent)"
      >
        {copied ? t.share.copied : t.share.copy}
      </button>
    </div>
  );
}
