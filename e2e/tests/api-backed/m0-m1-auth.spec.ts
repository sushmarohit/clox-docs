import { test, expect } from '@playwright/test';
import { API_BASE, apiJson, loginAs, SEED } from '../../helpers/api';

// OTP throttle is 5/min — keep this file serial
test.describe.configure({ mode: 'serial' });

test.describe('API-backed — M0 foundation', () => {
  test('M0-1/M0-7/M0-8 health + correlation + security headers', async () => {
    const res = await fetch(`${API_BASE}/health`, {
      headers: { 'x-correlation-id': 'e2e-corr-m0' },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('x-correlation-id')).toBe('e2e-corr-m0');
    expect(res.headers.get('x-content-type-options')?.toLowerCase()).toBe('nosniff');
    expect(res.headers.get('x-frame-options')?.toUpperCase()).toBe('DENY');
    const body = (await res.json()) as { status: string; database: string; service: string };
    expect(body.service).toBe('clox-api');
    expect(['ok', 'degraded']).toContain(body.status);
    expect(['up', 'down']).toContain(body.database);
  });

  test('M0-9 module status stubs ready', async () => {
    for (const path of ['/jobs/_status', '/compliance/_status', '/ops/_status', '/payments/_status']) {
      const { status, body } = await apiJson<{ status: string }>(path);
      expect(status).toBe(200);
      expect(body.status).toBe('ready');
    }
  });
});

test.describe('API-backed — M1 auth & RBAC', () => {
  test('M1-1 unknown email OTP request is generic success', async () => {
    const { status, body } = await apiJson<{ ok: boolean; message: string; debugCode?: string }>(
      '/auth/otp/request',
      { method: 'POST', body: JSON.stringify({ email: 'nobody.edge@yopmail.com' }) },
    );
    expect(status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.message).toMatch(/if this account is registered/i);
    expect(body.debugCode).toBeUndefined();
  });

  test('M1-2 neither email nor phone → 400', async () => {
    const { status, body } = await apiJson<{ title?: string; detail?: string }>('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    expect(status).toBe(400);
    expect(String(body.detail ?? body.title ?? '')).toMatch(/validation|email or phone/i);
  });

  test('M1-7/M1-11 wrong OTP then success with debugCode', async () => {
    const tokens = await loginAs(SEED.super, { fresh: true });
    expect(tokens.accessToken).toBeTruthy();

    const bad = await apiJson('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email: SEED.super, code: '000000' }),
    });
    expect([401, 403]).toContain(bad.status);
  });

  test('M1-13 invalid OTP format → 400', async () => {
    const { status } = await apiJson('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email: SEED.super, code: 'abc' }),
    });
    expect(status).toBe(400);
  });

  test('M1-18 missing Bearer → 401', async () => {
    const { status } = await apiJson('/identity/me');
    expect(status).toBe(401);
  });

  test('M1-17 refresh as access → 401', async () => {
    const tokens = await loginAs(SEED.super);
    const { status } = await apiJson('/identity/me', { token: tokens.refreshToken });
    expect(status).toBe(401);
  });

  test('M1-26 non-Super denied admin leads', async () => {
    const state = await loginAs(SEED.state);
    const { status } = await apiJson('/admin/leads', { token: state.accessToken });
    expect(status).toBe(403);
  });

  test('M1-22 sender cannot request step-up', async () => {
    const sender = await loginAs(SEED.sender);
    const { status, body } = await apiJson<{ detail?: string }>('/auth/otp/step-up/request', {
      method: 'POST',
      token: sender.accessToken,
      body: '{}',
    });
    expect(status).toBe(403);
    expect(String(body.detail ?? '')).toMatch(/step-up|admin/i);
  });

  test('M1-35 identity/me for six seed roles', async () => {
    for (const email of [SEED.super, SEED.state, SEED.local, SEED.sender, SEED.carrier, SEED.driver]) {
      const tokens = await loginAs(email);
      const { status, body } = await apiJson<{
        email?: string;
        principal?: { email: string };
        user?: { email: string };
        admin?: { email: string };
      }>('/identity/me', { token: tokens.accessToken });
      expect(status, email).toBe(200);
      const got =
        body.email ?? body.principal?.email ?? body.user?.email ?? body.admin?.email ?? tokens.principal?.email;
      expect(String(got).toLowerCase()).toBe(email.toLowerCase());
    }
  });
});
