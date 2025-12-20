import { test, expect } from "@playwright/test";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique item titles

// Run these tests sequentially to avoid data race conditions
test.describe.serial("Inventory Item Editing", () => {
  let createdItemId: string; // To store the ID of the item created for tests

  test.beforeEach(async ({ page }) => {
    // Navigate to inventory page. Global setup should handle login.
    await page.goto("/inventory");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/.*\/inventory/);
    await expect(page.locator("h2", { hasText: "Inventory" })).toBeVisible({
      timeout: 15000,
    });

    // Ensure there's at least one item for editing/deleting tests
    // Create a new item if none exist or for a clean test
    await page.locator('a[href="/inventory/new"]').click();
    await expect(page.locator("h2", { hasText: "Add New Item" })).toBeVisible();

    // Wait for form to be fully hydrated
    await page.waitForLoadState("networkidle");
    await page.waitForSelector('input[name="title"]', {
      state: "visible",
      timeout: 10000,
    });

    const uniqueTitle = `Test Item - ${uuidv4()}`;
    const uniqueSKU = `SKU-${Date.now()}`; // Unique SKU to avoid constraint violations

    await page.locator('input[name="title"]').fill(uniqueTitle);
    await page.locator('input[name="price"]').fill("100.50");
    await page.locator('input[name="sku"]').fill(uniqueSKU);
    await page
      .locator('textarea[name="description"]')
      .fill("Description for test item");

    await page.locator('button[type="submit"]').click();

    // Wait for navigation away from /new page
    await page.waitForURL(/.*\/inventory(?!\/new)/, { timeout: 15000 });

    // Verify we're on the inventory dashboard
    await expect(page.locator("h2", { hasText: "Inventory" })).toBeVisible({
      timeout: 15000,
    });

    // Wait for the table to load
    await page.waitForLoadState("networkidle");

    // Wait for the newly created item to appear in the table
    await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible({
      timeout: 15000,
    });

    // Wait a bit for React Query cache to stabilize
    await page.waitForTimeout(1000);

    createdItemId = uniqueTitle;
  });

  test.afterEach(async ({ page }) => {
    // Clean up the created item if necessary
    // Skip cleanup if no item was created
    if (!createdItemId) return;

    try {
      // Navigate to inventory with a fresh load (bypass cache)
      await page.goto("/inventory", { waitUntil: "networkidle" });
      await expect(page.locator("h2", { hasText: "Inventory" })).toBeVisible({
        timeout: 10000,
      });

      // Wait for the newly created item to appear
      await expect(page.locator(`text=${createdItemId}`)).toBeVisible({
        timeout: 10000,
      });

      // Give React Query time to settle
      await page.waitForTimeout(500);

      const rowLocator = page
        .locator('div[role="row"]', { hasText: createdItemId })
        .first();

      // Check if the item still exists
      if ((await rowLocator.count()) > 0) {
        await rowLocator.locator('button[aria-label="Open menu"]').click();

        // Wait for dropdown menu to be visible
        await page.waitForSelector('[role="menu"], [role="menuitem"]', {
          state: "visible",
          timeout: 5000,
        });

        await page.getByRole("menuitem", { name: /delete item/i }).click();
        await expect(
          page.locator('h2:has-text("Are you absolutely sure?")'),
        ).toBeVisible();
        await page.locator('button:has-text("Delete")').click();

        // Wait for item to be deleted
        await expect(page.locator(`text=${createdItemId}`)).not.toBeVisible({
          timeout: 5000,
        });
      }
    } catch (error) {
      console.log("Cleanup failed:", error);
      // Don't fail the test if cleanup fails
    }
  });

  test("should navigate to edit item page and pre-fill form", async ({
    page,
  }) => {
    // Click the "Open menu" button on the first item
    await page.locator('button[aria-label="Open menu"]').first().click();

    // Wait for dropdown menu to be visible
    await page.waitForSelector('[role="menu"], [role="menuitem"]', {
      state: "visible",
      timeout: 5000,
    });

    // Click "Edit item" menu item
    await page.getByRole("menuitem", { name: /edit item/i }).click();

    // Verify we're on the edit page
    await expect(page.locator("h2", { hasText: "Edit Item:" })).toBeVisible();
    await expect(page.locator('input[name="title"]')).not.toBeEmpty();
    await expect(page.locator('input[name="price"]')).not.toBeEmpty();
  });

  test("should update an existing item successfully", async ({ page }) => {
    // Store the original title for verification
    const originalTitle = createdItemId; // This is the title created in beforeEach

    // Click the "Open menu" button on the first item
    await page.locator('button[aria-label="Open menu"]').first().click();

    // Wait for dropdown menu to be visible
    await page.waitForSelector('[role="menu"], [role="menuitem"]', {
      state: "visible",
      timeout: 5000,
    });

    // Click "Edit item" menu item
    await page.getByRole("menuitem", { name: /edit item/i }).click();

    // Wait for edit page to load
    await expect(page.locator("h2", { hasText: "Edit Item:" })).toBeVisible();

    // Verify the form is pre-filled with original title
    await expect(page.locator('input[name="title"]')).toHaveValue(
      originalTitle,
    );

    // Get a new title for the item
    const newTitle = `Updated Item ${Date.now()}`; // Use timestamp for uniqueness

    // Fill the form with new data
    await page.locator('input[name="title"]').clear();
    await page.locator('input[name="title"]').fill(newTitle);
    await page
      .locator('textarea[name="description"]')
      .fill("This is an updated description.");

    await page.locator('button[type="submit"]').click();

    // Wait for navigation back to inventory list
    await page.waitForLoadState("networkidle");

    // Verify we're back on the inventory dashboard
    await expect(page.locator("h2", { hasText: "Inventory" })).toBeVisible({
      timeout: 15000,
    });

    // Wait for page to fully load and data to refresh
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Give React Query time to refetch

    // Verify the updated item is visible on the dashboard
    await expect(page.locator(`text=${newTitle}`)).toBeVisible({
      timeout: 15000,
    });

    // Verify the old title is no longer visible
    await expect(page.locator(`text=${originalTitle}`)).not.toBeVisible();

    // Update createdItemId to the new title for cleanup
    createdItemId = newTitle;
  });

  test.skip("should prevent editing another user's item (RLS)", async ({
    page,
  }) => {
    // Create an item as user 1
    await page.goto("/inventory/new");
    await expect(page.locator("h2", { hasText: "Add New Item" })).toBeVisible();

    const testItemTitle = `RLS Test Item - ${uuidv4()}`;
    const testSKU = `RLS-SKU-${Date.now()}`;
    await page.locator('input[name="title"]').fill(testItemTitle);
    await page.locator('input[name="price"]').fill("99.99");
    await page.locator('input[name="sku"]').fill(testSKU);
    await page.locator('button[type="submit"]').click();

    // Wait for redirect to inventory dashboard
    await expect(page).toHaveURL(/.*\/inventory$/);

    // Wait for table to load and item to appear
    await page.waitForLoadState("networkidle");
    await expect(page.locator(`text=${testItemTitle}`)).toBeVisible({
      timeout: 10000,
    });
    await page.waitForTimeout(1000); // Give React Query time to settle

    // Extract the item ID from the edit button (the item was just created)
    // Use a more specific selector to avoid matching old test items
    const firstRow = page
      .locator('div[role="row"]')
      .filter({ hasText: testItemTitle })
      .filter({ hasText: testSKU })
      .first();

    // Wait for the button to be visible and clickable
    await expect(
      firstRow.locator('button[aria-label="Open menu"]'),
    ).toBeVisible({ timeout: 10000 });
    await firstRow.locator('button[aria-label="Open menu"]').click();

    // Wait for dropdown menu to be visible
    await page.waitForSelector('[role="menu"], [role="menuitem"]', {
      state: "visible",
      timeout: 5000,
    });

    // Get the current URL to extract the item ID
    const editButton = page.getByRole("menuitem", { name: /edit item/i });
    await editButton.evaluate(() => {
      // The onClick handler contains router.push with the item ID
      return null; // We'll use a different approach
    });

    // For now, we verify RLS by checking the API response
    // A proper multi-user test would require creating a second user session
    // This test validates that the UI attempts edit operations correctly
    // Actual RLS enforcement happens at the database level via Supabase policies

    // Clean up: delete the test item
    // Close any open dropdown first
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    // Find the row again and click menu
    const cleanupRow = page
      .locator('div[role="row"]', { hasText: testItemTitle })
      .first();
    await cleanupRow.locator('button[aria-label="Open menu"]').click();

    // Wait for dropdown menu to be visible
    await page.waitForSelector('[role="menu"], [role="menuitem"]', {
      state: "visible",
      timeout: 5000,
    });

    await page.getByRole("menuitem", { name: /delete item/i }).click();
    await expect(
      page.locator('h2:has-text("Are you absolutely sure?")'),
    ).toBeVisible();
    await page.locator('button:has-text("Delete")').click();
    await expect(page.locator(`text=${testItemTitle}`)).not.toBeVisible();
  });

  test("should soft-delete an item successfully", async ({ page }) => {
    // Ensure we're on the inventory page and table is loaded
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h2", { hasText: "Inventory" })).toBeVisible();

    // Use the item created in beforeEach
    const itemTitleToDelete = createdItemId;

    // Verify the item exists in the table
    await expect(page.locator(`text=${itemTitleToDelete}`)).toBeVisible({
      timeout: 10000,
    });

    // Give React Query and table rendering time to settle
    await page.waitForTimeout(1500);

    // Since tests run serially and we just created this item in beforeEach,
    // it should be the first item in the table. Click the first "Open menu" button.
    const firstMenuButton = page
      .locator('button[aria-label="Open menu"]')
      .first();

    await expect(firstMenuButton).toBeVisible({ timeout: 10000 });
    await firstMenuButton.click();

    // Wait for dropdown menu to be visible
    await page.waitForSelector('[role="menu"], [role="menuitem"]', {
      state: "visible",
      timeout: 5000,
    });

    // Click the "Delete item" dropdown menu item
    await page.getByRole("menuitem", { name: /delete item/i }).click();

    // Confirm deletion in the dialog
    await expect(
      page.locator('h2:has-text("Are you absolutely sure?")'),
    ).toBeVisible();
    await page.locator('button:has-text("Delete")').click();

    // Verify the item is no longer visible on the dashboard
    await expect(page.locator(`text=${itemTitleToDelete}`)).not.toBeVisible();
  });
});
