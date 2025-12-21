import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "netpost",
  project: "crosslist-frontend",
  widenClientFileUpload: true,
});
