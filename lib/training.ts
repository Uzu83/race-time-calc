/**
 * Weekly / monthly training volume recommendations, keyed off the predicted full-marathon time.
 * Numbers are rough community-consensus benchmarks (Daniels / Hansons / Pfitzinger ranges).
 */

export interface TrainingPlan {
  tier: string;
  monthlyKm: [number, number];
  weeklyKm: [number, number];
  longRunKm: [number, number];
  workouts: string[];
  comment: string;
}

const TIERS: { maxFullSec: number; plan: TrainingPlan }[] = [
  {
    maxFullSec: 3 * 3600,
    plan: {
      tier: "サブ3 を狙う層",
      monthlyKm: [350, 500],
      weeklyKm: [80, 120],
      longRunKm: [30, 35],
      workouts: [
        "週1: 1km×5本 インターバル (M ペース −20〜30秒/km)",
        "週1: 16〜20km テンポ走 (M ペース)",
        "週1: 30〜35km ロング走 (M ペース +20〜30秒/km)",
      ],
      comment:
        "速筋＋遅筋のミックスを高水準で要求される領域。距離・強度どちらも妥協せず、回復日も同じ重要度で扱うこと。",
    },
  },
  {
    maxFullSec: 3.5 * 3600,
    plan: {
      tier: "サブ3.5 を狙う層",
      monthlyKm: [250, 350],
      weeklyKm: [55, 85],
      longRunKm: [25, 32],
      workouts: [
        "週1: 1km×3〜5本 インターバル",
        "週1: 12〜16km テンポ走",
        "週1: 25〜30km ロング走 (後半 M ペース上げ)",
      ],
      comment:
        "走力の伸びしろがまだ大きい層。月間距離を 300km 前後で安定させ、テンポ走で閾値を引き上げる時期。",
    },
  },
  {
    maxFullSec: 4 * 3600,
    plan: {
      tier: "サブ4 を狙う層",
      monthlyKm: [180, 260],
      weeklyKm: [40, 60],
      longRunKm: [22, 28],
      workouts: [
        "週1: 1km×3本 ペース走 (M ペース −10秒/km)",
        "週1: 8〜12km テンポ走",
        "週1: 22〜28km ロング走 (LSD)",
      ],
      comment:
        "週3〜4回の練習で十分到達可能。ロング走で脚を作り、テンポ走で閾値を意識する。怪我リスクが上がる距離帯なので段階的に増やす。",
    },
  },
  {
    maxFullSec: 4.5 * 3600,
    plan: {
      tier: "サブ4.5 を狙う層",
      monthlyKm: [140, 200],
      weeklyKm: [30, 45],
      longRunKm: [20, 25],
      workouts: [
        "週1: 5km ビルドアップ走",
        "週1: ジョグ 8〜10km (会話できるペース)",
        "週1: 20〜25km ロング走",
      ],
      comment:
        "「20km の壁」を越えられるかが勝負。ロング走で 30km 走を1〜2回経験しておくと当日の不安が大きく減る。",
    },
  },
  {
    maxFullSec: 5 * 3600,
    plan: {
      tier: "サブ5・完走を狙う層",
      monthlyKm: [100, 160],
      weeklyKm: [25, 35],
      longRunKm: [18, 25],
      workouts: [
        "週1: ジョグ 5〜8km",
        "週1: ビルドアップまたは坂道走",
        "週1: 18〜22km ロング走 (歩きを混ぜてOK)",
      ],
      comment:
        "ここはとにかく距離を踏むフェーズ。週3回の練習で月100km前後を目標にし、フォームと補給を体に覚え込ませる。",
    },
  },
  {
    maxFullSec: Number.POSITIVE_INFINITY,
    plan: {
      tier: "完走を狙う層",
      monthlyKm: [80, 130],
      weeklyKm: [20, 30],
      longRunKm: [15, 22],
      workouts: [
        "週1: ウォーク&ラン 5km",
        "週1: ゆっくりジョグ 6〜8km",
        "週1: 15〜22km ロング走 (歩きOK・補給練習)",
      ],
      comment:
        "完走が最大目標。距離に体を慣らすことが最優先で、ペースは「会話できる」を厳守。怪我ゼロで本番を迎える戦略。",
    },
  },
];

export function planForFullSeconds(fullSec: number): TrainingPlan {
  for (const t of TIERS) {
    if (fullSec <= t.maxFullSec) return t.plan;
  }
  // safety: last tier is +Infinity, so this should be unreachable
  const last = TIERS[TIERS.length - 1];
  return last ? last.plan : TIERS[0]!.plan;
}
