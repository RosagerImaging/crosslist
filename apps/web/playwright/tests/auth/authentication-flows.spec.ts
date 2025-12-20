import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test("User can sign up with valid email/password", async ({ page }) => {
    // Mock Supabase signup and login API responses
    await page.route("**/auth/v1/signup", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: { id: "mock-user-id", email: "test@example.com" },
          session: null,
          message: "Confirmation email sent",
        }),
      });
    });

    await page.route("**/auth/v1/token", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "mock-access-token",
          expires_in: 3600,
          refresh_token: "mock-refresh-token",
          token_type: "bearer",
          user: { id: "mock-user-id", email: "test@example.com" },
        }),
      });
    });

    // Navigate to signup page
    await page.goto("/signup");

    // Expect valid SEO structure (AC-2.1.1/PRD)
    await expect(page).toHaveTitle(/Sign Up/i);
    await expect(
      page.getByRole("heading", { name: /create an account/i }),
    ).toBeVisible();

    // Fill form
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password", { exact: true }).fill("Test@1234");
    await page.getByLabel("Confirm Password").fill("Test@1234");

    // Submit
    await page.getByRole("button", { name: /sign up with email/i }).click();

    // Expect success state (mocking might be needed for real auth, but checking for loading/redirect or success message)
    // Since we don't have a real backend running in this context, we might expect network request or error if supabase is not reachable.
    // However, for the purpose of this test structure, we assume we want to verify the interaction.
    // If we mock supabase response, we can assert success message.
    // The UI shows "Check your email" on success.
    await expect(page.getByText("Check your email")).toBeVisible();
  });

  test("User can log in with valid credentials", async ({ page }) => {
    // Mock Supabase token (login) API responses
    await page.route("**/auth/v1/token", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "mock-access-token-login",
          expires_in: 3600,
          refresh_token: "mock-refresh-token-login",
          token_type: "bearer",
          user: { id: "mock-user-id-login", email: "test@example.com" },
        }),
      });
    });
    await page.goto("/login");
    await expect(page).toHaveTitle(/Log In/i);

    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("Test@1234");

    await page.getByRole("button", { name: /sign in with email/i }).click();
    await expect(page).toHaveURL(/.*\/inventory/); // Expect redirection to a protected route
  });

  test("Client-side validation blocks invalid inputs", async ({ page }) => {
    await page.goto("/signup");

    // Invalid Password
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password", { exact: true }).fill("weak");
    await page.getByLabel("Confirm Password").fill("weak");

    await page.getByRole("button", { name: /sign up with email/i }).click();

    // Expect error message
    await expect(
      page.getByText(/password must be at least 8 characters/i),
    ).toBeVisible();
  });

  test("Protected route redirects to login", async ({ page }) => {
    await page.goto("/inventory"); // Assuming this is protected
    await expect(page).toHaveURL(/.*\/login/);
  });
});
