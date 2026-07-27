import { expect, test } from '@playwright/test';

test.describe('Public smoke', () => {
  test('home shows three funnels', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'CLOX' })).toBeVisible();
    await expect(page.getByRole('link', { name: /registry/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /expression of interest|partner/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /investor/i })).toBeVisible();
  });

  test('registry wizard loads', async ({ page }) => {
    await page.goto('/registry');
    await expect(page.getByText(/sender|transport/i).first()).toBeVisible();
  });

  test('EOI form loads', async ({ page }) => {
    await page.goto('/partner/eoi');
    await expect(
      page.getByRole('heading', { name: /expression of interest/i }).first(),
    ).toBeVisible();
    await expect(page.getByText(/State Master/i).first()).toBeVisible();
  });

  test('investor form loads', async ({ page }) => {
    await page.goto('/investors');
    await expect(page.getByRole('heading', { name: /investor portal/i })).toBeVisible();
    await expect(page.getByText(/Sophisticated Investor/i)).toBeVisible();
  });

  test('privacy draft page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByText(/Draft — legal review pending/i)).toBeVisible();
  });
});
