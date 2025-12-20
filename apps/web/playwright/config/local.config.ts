import { defineConfig } from "@playwright/test";
import { baseConfig } from "./base.config";

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: BASE_URL,
    video: "off", // No video locally for speed
    ignoreHTTPSErrors: true, // Ignore HTTPS errors for local testing
  },
  webServer: {
    command: `npm run build --workspace=apps/web && PORT=${PORT} npm run start --workspace=apps/web`,
    url: BASE_URL,
    reuseExistingServer: false, // Explicitly set to false
    timeout: 300000, // 5 minutes timeout for server launch
  },
});
