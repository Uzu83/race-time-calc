import Link from "next/link";
import { getServerDict } from "@/lib/i18n/server";

export default async function ResultNotFound() {
  const { t } = await getServerDict();
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-2xl font-bold">{t.meta.siteName}</h1>
      <p className="text-sm text-(--color-text-muted)">404</p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-(--color-accent) px-5 py-2 text-sm font-semibold text-black"
      >
        ← {t.nav.home}
      </Link>
    </div>
  );
}
