import { defineConfig, devices } from '@playwright/test';

const adminBaseURL = process.env.ADMIN_BASE_URL ?? 'http://localhost:5174';
const apiBaseURL = process.env.API_BASE_URL ?? 'http://localhost:3001/v1';

/**
 * Local default: system Chrome (Playwright Chromium zip often fails to download on Windows).
 * CI installs bundled Chromium — leave PW_CHANNEL unset in CI, or set PW_CHANNEL=chromium.
 */
const browserChannel =
  process.env.PW_CHANNEL === 'chromium'
    ? undefined
    : process.env.PW_CHANNEL ?? (process.env.CI ? undefined : 'chrome');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // API OTP is throttled (5/min) — keep API-backed serial via --workers=1
  workers: process.env.PW_WORKERS ? Number(process.env.PW_WORKERS) : process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 120_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: adminBaseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(browserChannel ? { channel: browserChannel as 'chrome' | 'msedge' } : {}),
      },
    },
  ],
  metadata: {
    apiBaseURL,
    adminBaseURL,
    browserChannel: browserChannel ?? 'bundled-chromium',
  },
});
