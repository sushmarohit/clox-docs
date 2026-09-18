import { test, expect } from '@playwright/test';
import en from '../../../admin/src/locales/en/common.json';
import hi from '../../../admin/src/locales/hi/common.json';

function languageButton(page: import('@playwright/test').Page) {
  return page.getByRole('button', { name: new RegExp(`${en.language}|${hi.language}`, 'i') });
}

test.describe('Smoke — login content & a11y', () => {
  test('login page shows brand, Sign in, QA hints, register link', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText(en.brand).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByText('QA seed emails')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toHaveAttribute(
      'href',
      '/register/sender',
    );
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send code' })).toBeVisible();
    await expect(languageButton(page)).toBeVisible();
  });

  test('unauthenticated / redirects to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('sender register form validation — terms required', async ({ page }) => {
    await page.goto('/register/sender');
    await expect(page.getByRole('heading', { name: 'Sender register' })).toBeVisible();
    const submit = page.getByRole('button', { name: /Create sender account/i });
    await expect(submit).toBeDisabled();
    await page.locator('form input').nth(0).fill('Test Sender');
    await page.locator('form input[type="email"]').fill('edge.ui@yopmail.com');
    await page.getByText(/I accept Terms/).click();
    await expect(submit).toBeEnabled();
  });
});

test.describe('Smoke — multi-lingual (EN / HI)', () => {
  test('locale files have matching keys (content parity)', () => {
    function keys(obj: unknown, prefix = ''): string[] {
      if (obj === null || typeof obj !== 'object') return [prefix];
      return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
        keys(v, prefix ? `${prefix}.${k}` : k),
      );
    }
    const enKeys = keys(en).sort();
    const hiKeys = keys(hi).sort();
    expect(hiKeys).toEqual(enKeys);
  });

  test('switching to Hindi updates language control + brand still CLOX', async ({ page }) => {
    await page.goto('/login');
    await languageButton(page).click();
    await page.getByRole('option', { name: /हिन्दी/ }).click();
    await expect(languageButton(page)).toContainText('HI');
    await expect(page.getByText(hi.brand).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send code' })).toBeVisible();
  });

  test('switching back to English restores EN badge', async ({ page }) => {
    await page.goto('/login');
    await languageButton(page).click();
    await page.getByRole('option', { name: /हिन्दी/ }).click();
    await expect(languageButton(page)).toContainText('HI');
    await languageButton(page).click();
    await page.getByRole('option', { name: /English/ }).click();
    await expect(languageButton(page)).toContainText('EN');
  });

  test('Hindi strings differ from English for translated fields', () => {
    expect(hi.tagline).not.toEqual(en.tagline);
    expect(hi.signOut).not.toEqual(en.signOut);
    expect(hi.nav.leads).not.toEqual(en.nav.leads);
    expect(hi.admin.loginTitle).not.toEqual(en.admin.loginTitle);
  });
});
