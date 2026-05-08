import type { Metadata } from "next";
import Link from "next/link";
import { getServerDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerDict();
  return { title: t.about.title, description: t.meta.siteDescription };
}

export default async function AboutPage() {
  const { t } = await getServerDict();
  return (
    <article className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold">{t.about.title}</h1>

      <section>
        <h2 className="text-lg font-bold text-(--color-accent-soft)">{t.about.whatHeading}</h2>
        <p>{t.about.whatBody}</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-(--color-accent-soft)">{t.about.modelsHeading}</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>{t.models.riegel}</strong>: {t.models.riegelDesc}
          </li>
          <li>
            <strong>{t.models.vdot}</strong>: {t.models.vdotDesc}
          </li>
          <li>
            <strong>{t.models.riegelElite}</strong>: {t.models.riegelEliteDesc}
          </li>
        </ul>
        <p className="mt-3 text-xs text-(--color-text-muted)">{t.about.modelsFooter}</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-(--color-accent-soft)">{t.about.cautionHeading}</h2>
        <ul className="list-disc space-y-1 pl-5 text-(--color-text-muted)">
          <li>{t.about.caution1}</li>
          <li>{t.about.caution2}</li>
          <li>{t.about.caution3}</li>
        </ul>
      </section>

      <section className="text-xs">
        <Link href="/" className="text-(--color-rune) hover:underline">
          ← Home
        </Link>
      </section>
    </article>
  );
}
