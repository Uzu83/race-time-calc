import Link from "next/link";

export default function ResultNotFound() {
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-2xl font-bold">予測URLが正しくありません</h1>
      <p className="text-sm text-(--color-text-muted)">
        URLが壊れているか、対応外の形式です。トップページから入力をやり直してください。
      </p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-(--color-accent) px-5 py-2 text-sm font-semibold text-black"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
