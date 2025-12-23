// Instrumentation file for Sentry initialization
// This file is automatically called by Next.js during server startup
// See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Initialize Sentry for Node.js server runtime only
    // This keeps Node.js-specific code out of Edge Runtime bundles
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Initialize Sentry for Edge Runtime (middleware, edge functions)
    await import("./sentry.edge.config");
  }
}

// Capture errors from Server Components, middleware, and Server Actions
// This export is called by Next.js when errors occur in server contexts
export const onRequestError = Sentry.captureRequestError;
