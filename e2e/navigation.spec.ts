import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between main pages', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Tabor Academy/);

    // Navigate to courses
    await page.click('text=Courses');
    await expect(page).toHaveURL(/.*courses/);
    await expect(page.locator('h1')).toContainText('Courses');

    // Navigate to dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome back');

    // Navigate to learning paths
    await page.click('text=Learning Paths');
    await expect(page).toHaveURL(/.*learning-paths/);
    await expect(page.locator('h1')).toContainText('Learning Paths');
  });
});