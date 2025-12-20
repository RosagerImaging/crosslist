import { defineConfig } from "@playwright/test";
import path from "path";

export const baseConfig = defineConfig({
  // Global Setup to run before all tests
  globalSetup: require.resolve("../support/global-setup"),

  // Global test timeout: 60 seconds
  timeout: 60000,
  testDir: path.resolve(__dirname, "../tests"), // Assuming tests will be in apps/web/playwright/tests
  outputDir: path.resolve(__dirname, "../../test-results"), // Relative to apps/web
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined, // Run tests in parallel if not in CI

  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "test-results/results.xml" }], // Relative to outputDir
    ["list"],
  ],

  use: {
    // Action timeout: 15 seconds (click, fill, etc.)
    actionTimeout: 15000,
    // Navigation timeout: 30 seconds (page.goto, page.reload)
    navigationTimeout: 30000,
    trace: "on-first-retry", // Record trace only when retrying a test for the first time.
    screenshot: "only-on-failure", // Capture screenshot on failure
    video: "retain-on-failure", // Record video on failure

    // Base URL for the tests, overridden by environment-specific configs
    baseURL: "http://localhost:3000",

    // Use authentication state saved by globalSetup.ts
    storageState: path.resolve(__dirname, "../.auth/user.json"),
  },

  expect: {
    // Expect timeout: 10 seconds (all assertions)
    timeout: 10000,
  },
});
