import * as Sentry from "@sentry/nextjs";

// Only initialize in browser context
// Note: This file may not be used since we're using SentryProvider
// But keeping it browser-safe in case it's loaded by Next.js
if (typeof window !== "undefined") {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    debug: false,

    beforeSend(event) {
      // Only send errors in production
      if (process.env.NODE_ENV !== "production") {
        console.log("Sentry event (dev mode):", event);
        return null;
      }
      return event;
    },
  });
}
