import * as Sentry from "@sentry/nextjs";

export function testSentryIntegration() {
  try {
    // Test Sentry by capturing a test message
    Sentry.addBreadcrumb({
      message: "Sentry integration test",
      level: "info",
    });

    Sentry.captureMessage("Sentry is working correctly!", "info");

    console.log("Sentry test message sent successfully!");
    return true;
  } catch (error) {
    console.error("Sentry test failed:", error);
    return false;
  }
}

export function testSentryError() {
  try {
    throw new Error("This is a test error for Sentry");
  } catch (error) {
    Sentry.captureException(error);
    console.log("Sentry test error sent successfully!");
  }
}
