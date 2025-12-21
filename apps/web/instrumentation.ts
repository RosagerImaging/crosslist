// Instrumentation file for Sentry initialization
// This file is automatically called by Next.js during server startup
// See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  // eslint-disable-next-line no-undef -- process.env is available in Next.js runtime
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server-side (Node.js runtime)
    await import("./sentry.server.config");
  }

  // IMPORTANT: Skip Sentry initialization in Edge Runtime
  // Edge Runtime doesn't support Node.js APIs like __dirname which Sentry may use internally
  // Middleware will run without Sentry until we verify Edge Runtime compatibility
  // See: https://github.com/getsentry/sentry-javascript/issues/5478

  // Client-side initialization happens in instrumentation-client.ts
  // which is automatically loaded by Next.js for browser bundles
}
