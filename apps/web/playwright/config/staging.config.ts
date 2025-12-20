import { defineConfig } from "@playwright/test";
import { baseConfig } from "./base.config";

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: process.env.STAGING_URL || "https://staging.crosslist.com", // Replace with actual staging URL
    ignoreHTTPSErrors: true, // Allow self-signed certs in staging
  },
});
