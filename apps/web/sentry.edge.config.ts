import * as Sentry from "@sentry/nextjs";

// Edge Runtime configuration for Sentry
// This runs in Vercel Edge Runtime which has limited Node.js API access
// Use NEXT_PUBLIC_ environment variables which are statically replaced at build time

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  defaultIntegrations: false,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Disable debug in production
  debug: false,

  // Only send events in production
  beforeSend(event) {
    if (process.env.NODE_ENV !== "production") {
      // Log to console in development instead of sending to Sentry
      console.log("Sentry event (Edge, dev mode):", event);
      return null;
    }
    return event;
  },

  // Reduce data sent to minimize Edge Runtime overhead
  beforeBreadcrumb(breadcrumb) {
    // Optionally filter breadcrumbs to reduce data
    return breadcrumb;
  },
});
