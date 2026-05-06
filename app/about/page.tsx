import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "このツールについて",
  description: "マラソンタイム予測ツールの計算モデル・使い方・補正係数の根拠を説明します。",
};

export default function AboutPage() {
  return (
    <article className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold">このツールについて</h1>

      <section>
        <h2 className="text-lg font-bold text-(--color-accent-soft)">何をするツールか</h2>
        <p>
          5K・10K・ハーフなど短い距離のレース記録を入力すると、 フルマラソン (またはお好きな距離)
          のタイムを 3 つの予測モデルで並列に算出します。 結果は URL
          に埋め込まれるので、シェアしても誰が開いても同じ予測が再現されます。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-(--color-accent-soft)">使っている予測モデル</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Riegel — 一般ランナー向け (k=1.14)</strong>: T₂ = T₁ × (D₂ / D₁)
            <sup>k</sup>。最もポピュラーな経験式。 一般ランナー向け補正係数{" "}
            <code className="text-(--color-rune)">k = 1.14</code> を採用
            (距離が伸びるほどペース低下を強めに見積もる、保守的な値)。
          </li>
          <li>
            <strong>VDOT (Jack Daniels)</strong>: 最大酸素摂取量 (VO₂max) と持続時間の関係から導出。
            Daniels' Running Formula で広く使われている、生理学ベースの定番指標。
          </li>
          <li>
            <strong>Riegel — エリート向け (k=1.06)</strong>: Riegel オリジナルの式。 週 60km
            以上を継続するような鍛錬されたランナー向けで、 一般ランナーには甘めに出る。
            <strong>目標設定の上限値</strong>として使うのが推奨。
          </li>
        </ul>
        <p className="mt-3 text-xs text-(--color-text-muted)">
          3つの予測値を並列表示することで、過大／過小予測の偏りを相殺し、 自分の現実値が「保守 ↔
          楽観」のどこにあるかを把握できます。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-(--color-accent-soft)">注意点</h2>
        <ul className="list-disc space-y-1 pl-5 text-(--color-text-muted)">
          <li>予測値はあくまで「現在の走力から見た理論値」です。</li>
          <li>
            気象条件 (気温・湿度・風)、コース (高低差)、補給、当日のコンディション、 そして
            <strong>本番までのトレーニング状態</strong>により実タイムは変動します。
          </li>
          <li>
            短い距離 (3km 等) からフルへの予測は誤差が大きくなりがち。
            ハーフの記録があれば最も信頼度が高くなります。
          </li>
        </ul>
      </section>

      <section className="text-xs">
        <Link href="/" className="text-(--color-rune) hover:underline">
          ← トップへ戻る
        </Link>
      </section>
    </article>
  );
}
