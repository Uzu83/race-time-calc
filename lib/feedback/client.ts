/*
 * lib/feedback/client.ts — feedback-adcd2（Firestore）への送信
 *
 * 手順の正: ~/development/projects/feedback-platform/docs/CONNECT.md
 *
 * WHY vendor 経由か: file:../feedback-platform は Vercel CI で親ディレクトリが無く壊れる。
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

function env(name: string): string | undefined {
  const v = process.env[name];
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

/** Firebase Web config が揃っているか。 */
export function isFeedbackBackendConfigured(): boolean {
  return Boolean(
    env("NEXT_PUBLIC_FEEDBACK_FIREBASE_API_KEY") &&
      env("NEXT_PUBLIC_FEEDBACK_FIREBASE_AUTH_DOMAIN") &&
      env("NEXT_PUBLIC_FEEDBACK_FIREBASE_PROJECT_ID") &&
      env("NEXT_PUBLIC_FEEDBACK_FIREBASE_APP_ID") &&
      env("NEXT_PUBLIC_FEEDBACK_FIREBASE_MESSAGING_SENDER_ID") &&
      env("NEXT_PUBLIC_FEEDBACK_FIREBASE_STORAGE_BUCKET"),
  );
}

/** Production だけ NEXT_PUBLIC_FEEDBACK_TARGET=prod。それ以外は省略 → feedback_dev。 */
export function resolveFeedbackTarget(): FeedbackTarget | undefined {
  return env("NEXT_PUBLIC_FEEDBACK_TARGET") === "prod" ? "prod" : undefined;
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
  const { db } = initFeedbackFirestore({
    apiKey: env("NEXT_PUBLIC_FEEDBACK_FIREBASE_API_KEY")!,
    authDomain: env("NEXT_PUBLIC_FEEDBACK_FIREBASE_AUTH_DOMAIN")!,
    projectId: env("NEXT_PUBLIC_FEEDBACK_FIREBASE_PROJECT_ID")!,
    appId: env("NEXT_PUBLIC_FEEDBACK_FIREBASE_APP_ID")!,
    messagingSenderId: env("NEXT_PUBLIC_FEEDBACK_FIREBASE_MESSAGING_SENDER_ID")!,
    storageBucket: env("NEXT_PUBLIC_FEEDBACK_FIREBASE_STORAGE_BUCKET")!,
  });
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

  if (!isFeedbackBackendConfigured()) {
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
