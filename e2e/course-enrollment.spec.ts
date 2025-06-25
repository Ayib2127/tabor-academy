import { test, expect } from '@playwright/test';

test.describe('Course Enrollment', () => {
  test('should allow enrollment in free course', async ({ page }) => {
    await page.goto('/courses/1');
    
    await page.click('text=Enroll Now');
    
    await expect(page.locator('text=Successfully enrolled')).toBeVisible();
    await expect(page.locator('text=Start Learning')).toBeVisible();
  });

  test('should handle paid course enrollment', async ({ page }) => {
    await page.goto('/courses/2');
    
    await page.click('text=Enroll Now');
    
    // Should redirect to payment page
    await expect(page).toHaveURL(/.*payment/);
    
    // Fill payment details
    await page.fill('input[name="cardNumber"]', '4242424242424242');
    await page.fill('input[name="expiry"]', '12/25');
    await page.fill('input[name="cvc"]', '123');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Payment successful')).toBeVisible();
    await expect(page.locator('text=Start Learning')).toBeVisible();
  });
});