/**
 * One-shot: write anonymous feedback to feedback_dev for product race-time-calc.
 * Loads .env.local; never targets prod. Safe to delete after verify.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");
if (!existsSync(envPath)) {
  console.error("missing .env.local");
  process.exit(1);
}
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#") || !t.includes("=")) continue;
  const i = t.indexOf("=");
  const k = t.slice(0, i).trim();
  const v = t.slice(i + 1).trim();
  if (!(k in process.env)) process.env[k] = v;
}

const { submitFeedback, isFeedbackBackendConfigured, resolveFeedbackTarget } = await import(
  "../lib/feedback/client.ts"
);

if (!isFeedbackBackendConfigured()) {
  console.error("feedback backend not configured");
  process.exit(1);
}
if (resolveFeedbackTarget() === "prod") {
  console.error("refusing: FEEDBACK_TARGET is prod");
  process.exit(1);
}

const result = await submitFeedback({
  kind: "other",
  message: "race-time-calc smoke: anonymous test write (safe to ignore)",
  appVersion: "0.1.0-smoke",
});

if (!result.ok) {
  console.error("fail:", result.error);
  process.exit(1);
}
console.log("ok feedback_dev id=", result.id);
