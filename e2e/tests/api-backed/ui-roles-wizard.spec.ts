import { test, expect } from '@playwright/test';
import { loginAs, SEED } from '../../helpers/api';

test.describe.configure({ mode: 'serial' });

async function injectAuth(page: import('@playwright/test').Page, tokens: Awaited<ReturnType<typeof loginAs>>) {
  const principal = tokens.principal ?? tokens.admin;
  if (!principal) throw new Error('No principal on tokens');
  const kind = 'kind' in principal && principal.kind ? principal.kind : 'admin';
  await page.goto('/login');
  await page.evaluate(
    ({ accessToken, refreshToken, principal, kind }) => {
      localStorage.setItem(
        'clox-admin-auth',
        JSON.stringify({
          state: {
            accessToken,
            refreshToken,
            sessionId: null,
            email: principal.email,
            principalId: principal.id,
            displayName: null,
            role: principal.role,
            kind,
          },
          version: 0,
        }),
      );
    },
    {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      principal: { email: principal.email, role: principal.role, id: principal.id },
      kind,
    },
  );
}

test.describe('API-backed — admin UI roles & sender wizard', () => {
  test('Super sees Leads + Audit + Compliance; marketplace QA hidden', async ({ page }) => {
    const tokens = await loginAs(SEED.super);
    await injectAuth(page, tokens);
    await page.goto('/');
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Leads', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Audit', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Compliance queue', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'QA: upload & submit', exact: true })).toHaveCount(0);
  });

  test('Sender sees onboarding + QA upload; not Leads', async ({ page }) => {
    const tokens = await loginAs(SEED.sender);
    await injectAuth(page, tokens);
    await page.goto('/');
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Sender onboarding', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'QA: upload & submit', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Leads', exact: true })).toHaveCount(0);
    await page.goto('/sender/onboarding');
    await expect(page.getByRole('heading', { name: 'Sender onboarding' })).toBeVisible();
    await expect(page.getByText(/canBook=/i)).toContainText('true');
    await expect(page.getByText(/Sender active|Done/i).first()).toBeVisible();
  });

  test('Local BDE compliance queue visible; Leads hidden', async ({ page }) => {
    const tokens = await loginAs(SEED.local);
    await injectAuth(page, tokens);
    await page.goto('/');
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Compliance queue', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Leads', exact: true })).toHaveCount(0);
  });

  test('OTP login UI shows Dev OTP then lands sender on onboarding', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(SEED.sender);
    await page.getByRole('button', { name: 'Send code' }).click();
    await expect(page.getByText('Dev OTP')).toBeVisible();
    const code = (await page.locator('p.font-mono.text-2xl').innerText()).replace(/\s/g, '');
    const otpInput = page.locator('input[inputmode="numeric"]');
    await otpInput.fill('');
    await otpInput.fill(code);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page).toHaveURL(/\/sender\/onboarding/, { timeout: 20_000 });
    await expect(page.getByRole('heading', { name: 'Sender onboarding' })).toBeVisible();
  });

  test('Sign out clears session and returns to login', async ({ page }) => {
    const tokens = await loginAs(SEED.super);
    await injectAuth(page, tokens);
    await page.goto('/');
    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });
});
