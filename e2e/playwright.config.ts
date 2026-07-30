import { defineConfig, devices } from '@playwright/test';

const WEB_URL = process.env.WEB_URL ?? 'http://127.0.0.1:5173';
const ADMIN_URL = process.env.ADMIN_URL ?? 'http://127.0.0.1:5174';
const API_URL = process.env.API_URL ?? 'http://127.0.0.1:3000/v1';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'web',
      use: { ...devices['Desktop Chrome'], baseURL: WEB_URL },
      testMatch: /public|lead-submit|seo-pwa-chat/,
    },
    {
      name: 'admin',
      use: { ...devices['Desktop Chrome'], baseURL: ADMIN_URL },
      testMatch: /admin/,
    },
  ],
  webServer: [
    {
      command: 'npm --prefix ../web run dev',
      url: WEB_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
    {
      command: 'npm --prefix ../admin run dev -- --host 127.0.0.1 --port 5174',
      url: ADMIN_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  metadata: {
    apiUrl: API_URL,
  },
});
