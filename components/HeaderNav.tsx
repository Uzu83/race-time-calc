"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/Provider";
import LanguageSwitcher from "./LanguageSwitcher";

export default function HeaderNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const items = [
    { href: "/", label: t.nav.home, match: (p: string) => p === "/" || p.startsWith("/result") },
    { href: "/pace", label: t.nav.pace, match: (p: string) => p.startsWith("/pace") },
    { href: "/about", label: t.nav.about, match: (p: string) => p.startsWith("/about") },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-(--color-bg)/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 text-lg font-bold tracking-tight text-(--color-accent)"
        >
          <span aria-hidden className="text-xl">
            🏃
          </span>
          <span className="hidden sm:inline">{t.meta.siteName}</span>
        </Link>
        <nav className="flex flex-1 items-center justify-center gap-1 text-sm">
          {items.map((it) => {
            const active = it.match(pathname ?? "");
            return (
              <Link
                key={it.href}
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-(--color-accent)/15 text-(--color-accent)"
                    : "text-(--color-text-muted) hover:bg-white/5 hover:text-(--color-text)"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
