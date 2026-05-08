import type { Metadata } from "next";
import PaceCalculator from "@/components/PaceCalculator";
import { getServerDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerDict();
  return {
    title: t.pace.title,
    description: t.pace.tagline,
  };
}

export default async function PacePage() {
  const { t } = await getServerDict();
  return (
    <div className="space-y-6">
      <section className="space-y-2 text-center">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">{t.pace.title}</h1>
        <p className="mx-auto max-w-xl text-sm text-(--color-text-muted)">{t.pace.tagline}</p>
      </section>
      <PaceCalculator />
    </div>
  );
}
