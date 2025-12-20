/* eslint-disable no-unused-vars */

import { chromium, FullConfig } from "@playwright/test";
import path from "path";
import { config as dotenvConfig } from "dotenv"; // Import dotenvConfig
// import { signUpWithEmail } from "../../lib/supabase/auth"; // Temporarily disable signup for debugging login
// import { createClient } from "../../lib/supabase/client"; // Temporarily disable createClient for debugging login

// Load environment variables from the project root .env file
dotenvConfig({ path: path.resolve(__dirname, "../../../.env") });

async function globalSetup(_config: FullConfig) {
  // Resolve auth file path
  const authFile = path.resolve(__dirname, "../.auth/user.json");

  // Launch a browser to perform login
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Add a console listener to capture messages from the browser
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      console.log(`Browser ${message.type().toUpperCase()}: ${message.text()}`);
    }
  });

  console.log(
    `Navigating to login page: ${process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000/login"}`,
  );
  await page.goto(
    process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000/login",
  );

  console.log("Waiting for email input selector...");
  await page.waitForSelector("input#email", { timeout: 10000 }); // Shorten timeout for faster feedback

  const username = process.env.PLAYWRIGHT_TEST_USERNAME || "test@example.com";
  const password = process.env.PLAYWRIGHT_TEST_PASSWORD || "password123";

  console.log(
    `Attempting to log in with: Username - ${username}, Password - ${password}`,
  );

  await page.fill("input#email", username);
  await page.fill("input#password", password);
  await page.click('button:has-text("Sign In with Email")');

  console.log("After login click, current URL:", page.url());
  await page.screenshot({ path: "playwright-login-after-click.png" });

  // Wait for network activity to settle or specific navigation
  await page.waitForLoadState("networkidle", { timeout: 10000 }); // Wait for network to be idle after click
  console.log("After networkidle, current URL:", page.url());

  // Check if still on login page
  if (page.url().includes("login")) {
    console.error("Login seems to have failed. Still on the login page.");
    await page.screenshot({
      path: "playwright-login-failed-still-on-login.png",
    });
    throw new Error("Login failed in global setup: Still on login page.");
  }

  // Wait for authentication to complete and redirect to inventory
  console.log("Waiting for navigation to inventory...");
  await page.waitForURL("**/inventory", { timeout: 30000 }); // Adjust URL and timeout as needed
  console.log("Successfully navigated to inventory page.");

  // Save authentication state for reuse in other tests
  await page.context().storageState({ path: authFile });
  console.log(`Authentication state saved to: ${authFile}`);

  await browser.close();
}

export default globalSetup;
