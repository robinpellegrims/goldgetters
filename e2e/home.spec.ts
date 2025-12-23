import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // Note: The actual title depends on the app, checking generic expectation or just that page loads
  await expect(page).toHaveTitle(/Goldgetters|ZVC/);
});
