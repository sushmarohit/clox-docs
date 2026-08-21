import { expect, test } from '@playwright/test';

test.describe('Public smoke', () => {
  test('home shows three funnels', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(
      page.getByRole('heading', { name: /digital full-load/i }),
    ).toBeVisible();
    await expect(page.getByText(/coming soon/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /send freight/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /join as carrier/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /join pre-launch/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /partner eoi/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /investor/i })).toHaveCount(0);
  });

  test('hero carousel and globe language dropdown work', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('header')).toHaveCSS('position', 'fixed');
    await expect(
      page.getByRole('heading', { name: /digital full-load/i }),
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
    await page.getByRole('option', { name: /hindi/i }).click();
    await expect(page).toHaveURL(/\/hi\/?$/);
    await expect(
      page.getByRole('heading', { name: /डिजिटल फुल-लोड/i }),
    ).toBeVisible();
  });

  test('hindi locale home loads', async ({ page }) => {
    await page.goto('/hi');
    await expect(
      page.getByRole('heading', { name: /डिजिटल फुल-लोड/i }),
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

  test('investor portal is not public', async ({ page }) => {
    const response = await page.goto('/en/investors');
    expect(response?.status()).toBe(404);
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/en/privacy');
    await expect(page.getByRole('heading', { name: /privacy/i }).first()).toBeVisible();
  });
});
