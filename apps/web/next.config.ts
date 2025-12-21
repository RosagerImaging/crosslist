import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Minimal configuration - Sentry is configured via withSentryConfig wrapper
};

// Wrap Next.js config with Sentry configuration
// This enables automatic source map upload and request tunneling
export default withSentryConfig(nextConfig, {
  // Sentry SDK and Webpack Plugin Options
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Organization and project for source map uploads (optional)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Suppress logging during build
  silent: true,

  // Route browser requests to Sentry through a Next.js rewrite
  // Helps avoid ad-blockers blocking Sentry requests
  tunnelRoute: "/monitoring",

  // Webpack-specific options (new API in v10+)
  webpack: {
    // Remove debug logging in production builds
    treeshake: {
      removeDebugLogging: true,
    },

    // Disables automatic instrumentation of Vercel Cron Monitors
    automaticVercelMonitors: false,
  },

  // Source map configuration
  sourcemaps: {
    // Hide source maps from public access
    disable: false,

    // Enable wider client file upload for better error tracking
    assets: ["**/*.js", "**/*.map"],
  },
});
