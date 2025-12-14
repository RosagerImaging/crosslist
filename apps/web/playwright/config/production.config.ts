import { defineConfig } from '@playwright/test';
import { baseConfig } from './base.config';

export default defineConfig({
  ...baseConfig,
  retries: 3, // More retries in production
  use: {
    ...baseConfig.use,
    baseURL: process.env.PRODUCTION_URL || 'https://crosslist.com', // Replace with actual production URL
    video: 'on', // Always record production failures
  },
});