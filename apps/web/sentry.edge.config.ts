import * as Sentry from "@sentry/nextjs";

// Edge Runtime has limited process API - use NEXT_PUBLIC_ vars
// which are statically replaced at build time
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,

  // Only send in production
  beforeSend(event) {
    if (process.env.NODE_ENV !== "production") {
      return null;
    }
    return event;
  },
});
