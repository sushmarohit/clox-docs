import { expect, test } from '@playwright/test';

test.describe('SEO / PWA / chat', () => {
  test('exposes metadata and structured data on home', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/CLOX/i);

    const description = await page.evaluate(() => {
      const el = document.querySelector('meta[name="description"]');
      return el?.getAttribute('content') ?? '';
    });
    expect(description.length).toBeGreaterThan(10);

    const raw = await page.evaluate(() => {
      const el = document.querySelector('script[type="application/ld+json"]');
      return el?.textContent ?? '';
    });
    expect(raw).toContain('Organization');
  });

  test('serves robots, sitemap, manifest, and llms.txt', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain('sitemap');

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain('/en/registry');

    const manifest = await request.get('/manifest.webmanifest');
    expect(manifest.ok()).toBeTruthy();
    const body = await manifest.json();
    expect(body.short_name).toMatch(/CLOX/i);

    const llms = await request.get('/llms.txt');
    expect(llms.ok()).toBeTruthy();
    expect(await llms.text()).toContain('CLOX');

    const llmsFull = await request.get('/llms-full.txt');
    expect(llmsFull.ok()).toBeTruthy();
    expect(await llmsFull.text()).toContain('Approved knowledge passages');
  });

  test('offline fallback page loads', async ({ page }) => {
    await page.goto('/offline');
    await expect(page.getByRole('heading', { name: /offline/i })).toBeVisible();
  });

  test('site guide answers with mock provider', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: /ask clox/i }).click();
    await page.getByLabel(/ask about registry/i).fill('How do I join as a carrier?');
    await page.getByRole('button', { name: /^send$/i }).click();
    await expect(page.getByText(/approved CLOX content|registry/i).first()).toBeVisible({
      timeout: 20_000,
    });
  });
});
