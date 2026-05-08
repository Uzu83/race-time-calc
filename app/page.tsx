import CalcForm from "@/components/CalcForm";
import QuickPresets from "@/components/QuickPresets";
import { getServerDict } from "@/lib/i18n/server";

export default async function Home() {
  const { t } = await getServerDict();
  return (
    <div className="space-y-10">
      <section className="fade-up space-y-4 text-center">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          {t.home.titleA}
          <br />
          <span className="bg-gradient-to-r from-(--color-accent) to-(--color-victory) bg-clip-text text-transparent">
            {t.home.titleHighlight}
          </span>
          {t.home.titleB}
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-(--color-text-muted) md:text-base">
          {t.home.tagline}
        </p>
      </section>

      <CalcForm />

      <QuickPresets />

      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-2 text-sm font-semibold text-(--color-accent-soft)">
          {t.home.featuresHeading}
        </h2>
        <ul className="space-y-1.5 text-xs leading-relaxed text-(--color-text-muted)">
          <li>◯ {t.home.feat1}</li>
          <li>◯ {t.home.feat2}</li>
          <li>◯ {t.home.feat3}</li>
          <li>◯ {t.home.feat4}</li>
        </ul>
      </section>
    </div>
  );
}
