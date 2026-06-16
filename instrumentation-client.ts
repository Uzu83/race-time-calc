import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://d8cdbbf7ed711ed0af6e696cb7195318@o4511570344280064.ingest.us.sentry.io/4511570404769792",
  tracesSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
