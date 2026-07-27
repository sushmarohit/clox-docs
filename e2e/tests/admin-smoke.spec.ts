import { expect, test } from '@playwright/test';

test.describe('Admin smoke', () => {
  test('login page shows OTP flow', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /super admin/i })).toBeVisible();
    await expect(page.getByPlaceholder('abc@example.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /send login code/i })).toBeVisible();
  });

  test('protected routes redirect to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/leads');
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/audit');
    await expect(page).toHaveURL(/\/login/);
  });
});
