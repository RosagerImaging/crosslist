import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  // IMPORTANT: Sentry withSentryConfig wrapper removed to prevent __dirname errors
  // The wrapper injects code that uses __dirname which is incompatible with Edge Runtime
  //
  // Sentry is still active:
  // - Client-side: via instrumentation-client.ts and sentry.client.config.ts
  // - Server-side: via instrumentation.ts -> sentry.server.config.ts
  // - Edge Runtime: Intentionally disabled (middleware runs without Sentry)
  //
  // Trade-offs:
  // - ✓ No __dirname errors in middleware
  // - ✗ No automatic source map uploads (can be added via CLI/CI)
  // - ✗ No tunnelRoute for ad-blocker bypass (can add manual rewrite if needed)
};

export default nextConfig;
