import { expect, test } from '@playwright/test';

test.describe('Public smoke', () => {
  test('home shows three funnels', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(
      page.getByRole('heading', { name: /future of australian logistics/i }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /join pre-launch/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /partner eoi/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /investor/i }).first()).toBeVisible();
  });

  test('hero carousel and globe language dropdown work', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('header')).toHaveCSS('position', 'fixed');
    await expect(
      page.getByRole('heading', { name: /future of australian logistics/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /move your goods/i }),
    ).toBeVisible({ timeout: 7000 });

    const slideLayers = page.locator('#banner div[style*="background-image"]');
    await expect(slideLayers.first()).toHaveCSS('background-image', /\/landing\/.+\.jpg/);
    const layerStackIndex = await slideLayers
      .first()
      .evaluate((el) => getComputedStyle(el.parentElement as HTMLElement).zIndex);
    expect(Number(layerStackIndex)).toBeGreaterThanOrEqual(0);

    await page.getByRole('button', { name: /language/i }).click();
    await page.getByRole('option', { name: /russian/i }).click();
    await expect(page).toHaveURL(/\/ru\/?$/);
    await expect(
      page.getByRole('heading', { name: /будущее австралийской логистики/i }),
    ).toBeVisible();
  });

  test('russian locale home loads', async ({ page }) => {
    await page.goto('/ru');
    await expect(
      page.getByRole('heading', { name: /будущее австралийской логистики/i }),
    ).toBeVisible();
  });

  test('legacy registry redirects into locale', async ({ page }) => {
    await page.goto('/registry');
    await expect(page).toHaveURL(/\/en\/registry/);
    await expect(page.getByText(/sender|transport/i).first()).toBeVisible();
  });

  test('registry wizard loads', async ({ page }) => {
    await page.goto('/en/registry');
    await expect(page.getByText(/sender|transport/i).first()).toBeVisible();
  });

  test('EOI form loads', async ({ page }) => {
    await page.goto('/en/partner/eoi');
    await expect(
      page.getByRole('heading', { name: /expression of interest/i }).first(),
    ).toBeVisible();
    await expect(page.getByText(/State Master/i).first()).toBeVisible();
  });

  test('investor form loads', async ({ page }) => {
    await page.goto('/en/investors');
    await expect(page.getByRole('heading', { name: /investor portal/i })).toBeVisible();
    await expect(page.getByText(/Sophisticated Investor/i)).toBeVisible();
  });

  test('privacy draft page loads', async ({ page }) => {
    await page.goto('/en/privacy');
    await expect(page.getByText(/Draft — legal review pending/i)).toBeVisible();
  });
});
