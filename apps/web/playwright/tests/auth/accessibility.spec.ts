import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Auth Accessibility', () => {
  test('login page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for form to load
    await page.waitForSelector('form');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('signup page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/signup');
    
    // Wait for form to load
    await page.waitForSelector('form');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('forgot password page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/reset-password'); // Assuming this is the route based on file structure
    
    // Wait for form to load
    await page.waitForSelector('form');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
