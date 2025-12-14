import { test, expect } from '@playwright/test';

test.describe('Marketplace Connection Flow', () => {
  test('should show connected status after connecting', async ({ page }) => {
    // Navigate to settings (assumes auth bypass or mock)
    // For now, we just visit page if possible, but actually we need to mock auth state.
    // Playwright has patterns for this.
    // We'll focus on the interaction assuming logged in.
    
    // Mock the API responses
    await page.route('/api/marketplace/status', async route => {
      await route.fulfill({ json: { success: true, status: { ebay: false, poshmark: false } } });
    });
    
    await page.route('/api/marketplace/connect', async route => {
      await route.fulfill({ json: { success: true, connected: true } });
    });

    await page.goto('/settings');

    // Check initial state
    await expect(page.getByText('ebay', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Connect' }).first()).toBeVisible();

    // Trigger connect
    // IMPORTANT: Since we can't easily install the extension in this specific test run without extra setup,
    // we simulate the window.postMessage that the extension would send.
    
    // Evaluate in page context: send message as if from extension
    await page.evaluate(() => {
        window.postMessage({
            type: 'CREDENTIAL_CAPTURED',
            payload: { marketplace: 'ebay', credentials: 'mock-encrypted-data' }
        }, '*');
    });

    // Verify UI updates
    // The button should change to 'Disconnect' because setIsConnected(true) happens on successful API call
    // BUT our code waits for the postMessage event.
    // The postMessage event (simulated above) triggers handleConnect -> fetch('/connect') -> setIsConnected(true).
    
    await expect(page.getByRole('button', { name: 'Disconnect' }).first()).toBeVisible();
    await expect(page.getByText('Connected', { exact: true }).first()).toBeVisible();
  });
});
