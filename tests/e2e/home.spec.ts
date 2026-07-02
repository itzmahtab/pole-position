import { test, expect } from '@playwright/test';

test.describe('Pole Position Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Grand Prix|Race|Formula/i);
    await expect(page.locator('[data-testid="countdown"]')).toBeVisible();
  });

  test('should open settings drawer', async ({ page }) => {
    await page.click('[aria-label="Settings"]');
    await expect(page.locator('text=Settings')).toBeVisible();
    await expect(page.locator('text=Theme')).toBeVisible();
  });

  test('should open search modal', async ({ page }) => {
    await page.click('[aria-label="Search"]');
    await expect(page.locator('text=Start typing to search')).toBeVisible();

    await page.fill('input[type="text"]', 'Verstappen');
    await expect(page.locator('text=Max Verstappen')).toBeVisible();
  });

  test('should navigate to sections', async ({ page }) => {
    await page.click('text=Timeline');
    await expect(page.url()).toContain('#timeline');
  });

  test('should be accessible', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
  });
});
