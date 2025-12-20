export async function register() {
  if (
    typeof globalThis !== "undefined" &&
    globalThis.process?.env.NEXT_RUNTIME === "nodejs"
  ) {
    const Sentry = await import("@sentry/nextjs");

    Sentry.init({
      dsn: globalThis.process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      debug: false,
    });
  }

  if (
    typeof globalThis !== "undefined" &&
    globalThis.process?.env.NEXT_RUNTIME === "edge"
  ) {
    const Sentry = await import("@sentry/nextjs");

    Sentry.init({
      dsn: globalThis.process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      debug: false,
    });
  }
}
