import CalcForm from "@/components/CalcForm";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4 text-center">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          5K・10K・ハーフから
          <br />
          <span className="text-(--color-accent)">フルマラソンタイム</span>
          を予測
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-(--color-text-muted) md:text-base">
          Riegel ・ VDOT ・ Cameron の3モデルで並列予測。
          <br className="hidden sm:inline" />
          サブ4・サブ3.5・サブ3 達成までの差を可視化し、推奨ペースと月間走行距離も提示します。
        </p>
      </section>

      <CalcForm />

      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-2 text-sm font-semibold text-(--color-accent-soft)">このツールの特徴</h2>
        <ul className="space-y-1.5 text-xs leading-relaxed text-(--color-text-muted)">
          <li>
            ◯ 一般ランナー向け補正係数 <code className="text-(--color-rune)">k=1.14</code> を Riegel
            に採用
          </li>
          <li>◯ 3モデル比較で過大／過小予測の偏りを相殺</li>
          <li>◯ 結果は URL に埋め込み — シェアしても同じ予測が再現</li>
          <li>◯ 推奨1kmペース・月間走行距離・週次ワークアウト例を提示</li>
        </ul>
      </section>
    </div>
  );
}
