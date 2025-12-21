import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // eslint-disable-next-line no-undef -- process.env is available in Next.js runtime
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
    // eslint-disable-next-line no-undef -- process.env is available in Next.js runtime
    if (process.env.NODE_ENV !== "production") {
      console.log("Sentry event (dev mode):", event);
      return null;
    }
    return event;
  },
});
