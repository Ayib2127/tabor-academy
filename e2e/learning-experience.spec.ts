import { test, expect } from '@playwright/test';

test.describe('Learning Experience', () => {
  test('should track course progress', async ({ page }) => {
    await page.goto('/courses/1/lesson/1');
    
    // Watch video
    await page.click('.video-player');
    await page.waitForTimeout(5000); // Wait for video progress
    
    // Complete quiz
    await page.click('text=Take Quiz');
    await page.click('text=Option A');
    await page.click('text=Submit');
    
    // Check progress update
    await expect(page.locator('.progress-bar')).toHaveAttribute('aria-valuenow', '25');
  });

  test('should allow note taking', async ({ page }) => {
    await page.goto('/courses/1/lesson/1');
    
    await page.fill('.note-input', 'Test note');
    await page.click('text=Save Note');
    
    await expect(page.locator('.notes-list')).toContainText('Test note');
  });

  test('should support offline access', async ({ page }) => {
    await page.goto('/courses/1/lesson/1');
    
    await page.click('text=Download for Offline');
    
    // Simulate offline mode
    await page.context().setOffline(true);
    
    // Should still be able to access content
    await expect(page.locator('.video-player')).toBeVisible();
    await expect(page.locator('.lesson-content')).toBeVisible();
  });
});