/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { chromium, FullConfig } from "@playwright/test";
import path from "path";

async function globalSetup(_config: FullConfig) {
  // Check if authentication is needed (e.g., if a specific project uses it)
  // For now, we'll assume authentication is needed for a 'authenticated' project.
  // This can be refined later based on actual project structure.

  // Resolve auth file path
  const authFile = path.resolve(__dirname, "../.auth/user.json");

  // Launch a browser to perform login
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Perform authentication
  // This will navigate to the login page and fill in credentials
  // Replace with actual login URL and selectors for your application
  await page.goto(
    process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000/login",
  );

  // Wait for login page to load
  await page.waitForSelector('[data-testid="email-input"]');

  await page.fill(
    '[data-testid="email-input"]',
    process.env.PLAYWRIGHT_TEST_USERNAME || "test@example.com",
  );
  await page.fill(
    '[data-testid="password-input"]',
    process.env.PLAYWRIGHT_TEST_PASSWORD || "password123",
  );
  await page.click('[data-testid="login-button"]');

  // Wait for authentication to complete and redirect to dashboard
  await page.waitForURL("**/dashboard", { timeout: 30000 }); // Adjust URL and timeout as needed

  // Save authentication state for reuse in other tests
  await page.context().storageState({ path: authFile });

  await browser.close();
}

export default globalSetup;
