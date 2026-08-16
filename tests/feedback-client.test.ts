import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const initFeedbackFirestore = vi.fn();
const submitFeedbackDoc = vi.fn();

vi.mock("@tosagiken/feedback-web", () => ({
  initFeedbackFirestore: (...args: unknown[]) => initFeedbackFirestore(...args),
  submitFeedback: (...args: unknown[]) => submitFeedbackDoc(...args),
}));

async function load() {
  return import("@/lib/feedback/client");
}

describe("feedback client", () => {
  beforeEach(() => {
    initFeedbackFirestore.mockReset();
    submitFeedbackDoc.mockReset();
    initFeedbackFirestore.mockReturnValue({ db: { __brand: "db" } });
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("isFeedbackBackendConfigured is false when env missing", async () => {
    const { isFeedbackBackendConfigured } = await load();
    expect(isFeedbackBackendConfigured()).toBe(false);
  });

  it("submitFeedback returns unavailable when env missing", async () => {
    const { submitFeedback, resetFeedbackDbCacheForTests } = await load();
    resetFeedbackDbCacheForTests();
    const r = await submitFeedback({ kind: "bug", message: "hello" });
    expect(r).toEqual({ ok: false, error: "unavailable" });
    expect(submitFeedbackDoc).not.toHaveBeenCalled();
  });

  it("hides UI on Vercel production without FEEDBACK_TARGET=prod", async () => {
    stubFeedbackEnv();
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "production");
    const { isFeedbackUiAllowed, submitFeedback, resetFeedbackDbCacheForTests } = await load();
    resetFeedbackDbCacheForTests();
    expect(isFeedbackUiAllowed()).toBe(false);
    const r = await submitFeedback({ kind: "bug", message: "should not send" });
    expect(r).toEqual({ ok: false, error: "unavailable" });
  });

  it("submitFeedback returns empty when message blank", async () => {
    stubFeedbackEnv();
    const { submitFeedback, resetFeedbackDbCacheForTests } = await load();
    resetFeedbackDbCacheForTests();
    const r = await submitFeedback({ kind: "ux", message: "   " });
    expect(r).toEqual({ ok: false, error: "empty" });
  });

  it("submitFeedback writes to feedback_dev by default", async () => {
    stubFeedbackEnv();
    submitFeedbackDoc.mockResolvedValue({ ok: true, id: "abc" });
    const { submitFeedback, resetFeedbackDbCacheForTests } = await load();
    resetFeedbackDbCacheForTests();
    const r = await submitFeedback({ kind: "bug", message: "ペース表示がおかしい" });
    expect(r).toEqual({ ok: true, id: "abc" });
    expect(initFeedbackFirestore).toHaveBeenCalledTimes(1);
    expect(submitFeedbackDoc).toHaveBeenCalledTimes(1);
    const [, input, opts] = submitFeedbackDoc.mock.calls[0]!;
    expect(input).toMatchObject({
      product: "race-time-calc",
      kind: "bug",
      screen: "feedback-modal",
      platform: "web",
      wantsReply: false,
    });
    expect(opts).toEqual({});
  });

  it("submitFeedback uses prod target when env is prod", async () => {
    stubFeedbackEnv();
    vi.stubEnv("NEXT_PUBLIC_FEEDBACK_TARGET", "prod");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "production");
    submitFeedbackDoc.mockResolvedValue({ ok: true, id: "prod1" });
    const { submitFeedback, isFeedbackUiAllowed, resetFeedbackDbCacheForTests } = await load();
    resetFeedbackDbCacheForTests();
    expect(isFeedbackUiAllowed()).toBe(true);
    await submitFeedback({ kind: "feature", message: "ハーフも欲しい" });
    const opts = submitFeedbackDoc.mock.calls[0]![2];
    expect(opts).toEqual({ target: "prod" });
  });
});

function stubFeedbackEnv() {
  vi.stubEnv("NEXT_PUBLIC_FEEDBACK_FIREBASE_API_KEY", "test-key");
  vi.stubEnv("NEXT_PUBLIC_FEEDBACK_FIREBASE_AUTH_DOMAIN", "feedback-adcd2.firebaseapp.com");
  vi.stubEnv("NEXT_PUBLIC_FEEDBACK_FIREBASE_PROJECT_ID", "feedback-adcd2");
  vi.stubEnv("NEXT_PUBLIC_FEEDBACK_FIREBASE_APP_ID", "1:1:web:abc");
  vi.stubEnv("NEXT_PUBLIC_FEEDBACK_FIREBASE_MESSAGING_SENDER_ID", "1");
  vi.stubEnv("NEXT_PUBLIC_FEEDBACK_FIREBASE_STORAGE_BUCKET", "feedback-adcd2.firebasestorage.app");
}
