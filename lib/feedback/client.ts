/*
 * lib/feedback/client.ts — feedback-adcd2（Firestore）への送信
 *
 * 手順の正: ~/development/projects/feedback-platform/docs/CONNECT.md
 *
 * WHY vendor 経由か: file:../feedback-platform は Vercel CI で親ディレクトリが無く壊れる。
 * WHY 静的 process.env.NEXT_PUBLIC_* か: Next.js クライアントは動的 process.env[name] を埋め込めない（GPT F001）。
 */
import type { FeedbackKind } from "@tosagiken/feedback-core";
import {
  type FeedbackTarget,
  initFeedbackFirestore,
  submitFeedback as submitFeedbackDoc,
} from "@tosagiken/feedback-web";
import type { Firestore } from "firebase/firestore";

export const FEEDBACK_KINDS = ["bug", "feature", "ux", "other"] as const;
export type RaceFeedbackKind = (typeof FEEDBACK_KINDS)[number];

const PRODUCT = "race-time-calc";
const SCREEN = "feedback-modal";

type FeedbackFirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  messagingSenderId: string;
  storageBucket: string;
};

function readPublic(value: string | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/**
 * Static NEXT_PUBLIC_* reads only — required for client bundle inlining.
 */
export function getFeedbackFirebaseConfig(): FeedbackFirebaseConfig | null {
  const apiKey = readPublic(process.env.NEXT_PUBLIC_FEEDBACK_FIREBASE_API_KEY);
  const authDomain = readPublic(process.env.NEXT_PUBLIC_FEEDBACK_FIREBASE_AUTH_DOMAIN);
  const projectId = readPublic(process.env.NEXT_PUBLIC_FEEDBACK_FIREBASE_PROJECT_ID);
  const appId = readPublic(process.env.NEXT_PUBLIC_FEEDBACK_FIREBASE_APP_ID);
  const messagingSenderId = readPublic(
    process.env.NEXT_PUBLIC_FEEDBACK_FIREBASE_MESSAGING_SENDER_ID,
  );
  const storageBucket = readPublic(process.env.NEXT_PUBLIC_FEEDBACK_FIREBASE_STORAGE_BUCKET);
  if (!apiKey || !authDomain || !projectId || !appId || !messagingSenderId || !storageBucket) {
    return null;
  }
  return { apiKey, authDomain, projectId, appId, messagingSenderId, storageBucket };
}

/** Firebase Web config が揃っているか。 */
export function isFeedbackBackendConfigured(): boolean {
  return getFeedbackFirebaseConfig() !== null;
}

/** Production だけ NEXT_PUBLIC_FEEDBACK_TARGET=prod。それ以外は省略 → feedback_dev。 */
export function resolveFeedbackTarget(): FeedbackTarget | undefined {
  return readPublic(process.env.NEXT_PUBLIC_FEEDBACK_TARGET) === "prod" ? "prod" : undefined;
}

/**
 * Vercel Production（ビルド時 VERCEL_ENV=production）では target=prod 必須。
 * 欠けると UI を出さず feedback_dev への誤送信を防ぐ（GPT F002）。
 */
export function isFeedbackUiAllowed(): boolean {
  if (!isFeedbackBackendConfigured()) return false;
  if (process.env.VERCEL_ENV === "production" && resolveFeedbackTarget() !== "prod") {
    return false;
  }
  return true;
}

export type FeedbackSubmitInput = {
  kind: RaceFeedbackKind;
  message: string;
  appVersion?: string;
};

export type FeedbackSubmitResult = { ok: true; id: string } | { ok: false; error: string };

let dbCache: Firestore | null = null;

function getDb(): Firestore {
  if (dbCache) return dbCache;
  const config = getFeedbackFirebaseConfig();
  if (!config) {
    throw new Error("feedback firebase config missing");
  }
  const { db } = initFeedbackFirestore(config);
  dbCache = db;
  return db;
}

/** テスト用に DB キャッシュを捨てる。 */
export function resetFeedbackDbCacheForTests(): void {
  dbCache = null;
}

/**
 * フィードバック送信。
 * Firestore 未設定時はエラー（UI 側で導線を隠す前提）。
 */
export async function submitFeedback(input: FeedbackSubmitInput): Promise<FeedbackSubmitResult> {
  const message = input.message.trim();
  if (!message) {
    return { ok: false, error: "empty" };
  }

  if (!isFeedbackUiAllowed()) {
    return { ok: false, error: "unavailable" };
  }

  try {
    const db = getDb();
    const target = resolveFeedbackTarget();
    const kind: FeedbackKind = input.kind;
    const result = await submitFeedbackDoc(
      db,
      {
        product: PRODUCT,
        kind,
        message,
        screen: SCREEN,
        platform: "web",
        appVersion: input.appVersion ?? "0.1.0",
        wantsReply: false,
      },
      target ? { target } : {},
    );
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    return { ok: true, id: result.id };
  } catch {
    return { ok: false, error: "network" };
  }
}
