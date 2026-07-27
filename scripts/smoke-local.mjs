#!/usr/bin/env node
/**
 * Local stack smoke: health → optional OTP request.
 * Usage: node scripts/smoke-local.mjs
 */
const API = process.env.API_URL ?? 'http://127.0.0.1:3000/v1';
const EMAIL = process.env.SEED_SUPER_ADMIN_EMAIL ?? 'abc@example.com';

async function main() {
  const healthRes = await fetch(`${API}/health`);
  const health = await healthRes.json();
  console.log('health', healthRes.status, health);

  if (!healthRes.ok) {
    process.exitCode = 1;
    return;
  }

  if (health.database !== 'up') {
    console.error('Database is not up — start Docker (`npm run docker:up`) then migrate/seed.');
    process.exitCode = 1;
    return;
  }

  const otpRes = await fetch(`${API}/auth/otp/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL }),
  });
  const otpBody = await otpRes.json();
  console.log('otp/request', otpRes.status, otpBody);

  if (!otpRes.ok) {
    process.exitCode = 1;
    return;
  }

  console.log('Smoke OK — check API logs / email for OTP code, then sign in at http://localhost:5174/login');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
