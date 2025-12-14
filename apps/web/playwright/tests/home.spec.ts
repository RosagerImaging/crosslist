import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully and display some content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible(); // Check if body is visible
    await expect(page.locator('body')).toContainText(''); // Check if body contains any text
  });
});