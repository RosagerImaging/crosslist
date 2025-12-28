import * as Sentry from "@sentry/nextjs";

// Only initialize in browser context and only once
if (typeof window !== "undefined" && !window.__SENTRY_INITIALIZED__) {
  window.__SENTRY_INITIALIZED__ = true;

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    integrations: [
      // Send console.log, console.warn, and console.error calls as logs to Sentry
      Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
      // Replay integration - browser only
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Enable structured logging
    enableLogs: true,

    // Capture 100% of transactions for performance monitoring
    tracesSampleRate: 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Disable debug logs in production
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

// TypeScript declaration for the flag
declare global {
  interface Window {
    __SENTRY_INITIALIZED__?: boolean;
  }
}
