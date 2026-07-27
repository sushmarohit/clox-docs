import { expect, test } from '@playwright/test';

const API_URL = process.env.API_URL ?? 'http://127.0.0.1:3000/v1';

async function apiHealthy(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) return false;
    const body = (await response.json()) as { database?: string };
    return body.database === 'up';
  } catch {
    return false;
  }
}

function fieldInput(page: import('@playwright/test').Page, label: string) {
  return page.locator('label', { hasText: label }).locator('xpath=..').locator('input, textarea').first();
}

test.describe('Lead submit (API-backed)', () => {
  test('submits EOI when API + DB are up', async ({ page }) => {
    test.skip(!(await apiHealthy()), 'API/database unavailable — skipping submit flow');

    const stamp = Date.now();
    await page.goto('/partner/eoi');

    await page.locator('input[type="radio"][value="state_master"]').check();
    await fieldInput(page, 'Target State / Region').fill('VIC');
    await fieldInput(page, 'Target Suburbs / City').fill('Melbourne');
    await fieldInput(page, 'Full Legal Name').fill('E2E Tester');
    await fieldInput(page, 'Company Entity Name').fill(`E2E Partner ${stamp}`);
    await fieldInput(page, 'ABN').fill('51824753556');
    await fieldInput(page, 'Primary Email').fill(`e2e.partner.${stamp}@example.com`);
    await fieldInput(page, 'Contact Phone').fill('+61400000999');
    await fieldInput(page, 'Corporate Address').fill('1 Test St, Melbourne VIC');

    await page.locator('textarea').nth(0).fill(
      'Existing national logistics network across VIC and NSW corridors.',
    );
    await page.locator('textarea').nth(1).fill(
      'Focus on local shipper acquisition and carrier onboarding pipelines.',
    );

    await page.locator('input[type="checkbox"]').last().check();
    await page.getByRole('button', { name: /submit expression of interest/i }).click();

    await expect(page.getByText(/EOI submitted successfully/i)).toBeVisible({
      timeout: 45_000,
    });
  });
});
