import { defineConfig } from '@playwright/test';
import { baseConfig } from './base.config';

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: BASE_URL,
    video: 'off', // No video locally for speed
  },
  webServer: {
    command: `PORT=${PORT} npm run dev`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});