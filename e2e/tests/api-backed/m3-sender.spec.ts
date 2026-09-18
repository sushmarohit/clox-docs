import { test, expect } from '@playwright/test';
import { apiJson, loginAs, registerSender, SEED } from '../../helpers/api';

test.describe.configure({ mode: 'serial' });

test.describe('API-backed — M3 sender onboarding & booking gate', () => {
  test('M3-1 duplicate register → 409', async () => {
    const email = await registerSender({ name: 'Dup One', email: `m3.dup.${Date.now()}@yopmail.com` });
    const second = await apiJson('/sender/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Dup Two', email, acceptedTerms: true }),
    });
    expect(second.status).toBe(409);
  });

  test('M3-2 terms required → 400', async () => {
    const { status } = await apiJson('/sender/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'No Terms',
        email: `m3.terms.${Date.now()}@yopmail.com`,
        acceptedTerms: false,
      }),
    });
    expect(status).toBe(400);
  });

  test('M3-6 non-sender cannot read onboarding → 403', async () => {
    const carrier = await loginAs(SEED.carrier);
    const { status } = await apiJson('/sender/onboarding', { token: carrier.accessToken });
    expect(status).toBe(403);
  });

  test('M3-18 payment setup before Ops approve → 400', async () => {
    const email = await registerSender({
      name: 'Pay Early',
      email: `m3.pay.${Date.now()}@yopmail.com`,
    });
    const tokens = await loginAs(email);
    const { status, body } = await apiJson<{ detail?: string }>('/sender/payment/setup', {
      method: 'POST',
      token: tokens.accessToken,
      body: '{}',
    });
    expect(status).toBe(400);
    expect(String(body.detail ?? '')).toMatch(/ops approve|payment setup/i);
  });

  test('M3-28 job create blocked when not booking-ready', async () => {
    const email = await registerSender({
      name: 'Job Block',
      email: `m3.job.${Date.now()}@yopmail.com`,
    });
    const tokens = await loginAs(email);
    const { status, body } = await apiJson<{ detail?: string; code?: string }>('/jobs', {
      method: 'POST',
      token: tokens.accessToken,
      body: JSON.stringify({ title: 'blocked' }),
    });
    expect(status).toBe(403);
    const blob = JSON.stringify(body);
    expect(blob).toMatch(/cannot create jobs|not booking|SENDER_NOT_BOOKING_READY/i);
  });

  test('M3-29 seed sender canBook path returns JOBS_M6_PENDING', async () => {
    const sender = await loginAs(SEED.sender);
    const elig = await apiJson<{ canBook: boolean }>('/sender/booking-eligibility', {
      token: sender.accessToken,
    });
    expect(elig.status).toBe(200);
    expect(elig.body.canBook).toBe(true);

    const job = await apiJson<{ code?: string; success?: boolean }>('/jobs', {
      method: 'POST',
      token: sender.accessToken,
      body: JSON.stringify({ title: 'eligible stub' }),
    });
    expect([200, 201]).toContain(job.status);
    expect(job.body.code).toBe('JOBS_M6_PENDING');
  });

  test('M3-21 mock stripe flagged on onboarding', async () => {
    const sender = await loginAs(SEED.sender);
    const { status, body } = await apiJson<{
      stripeMock: boolean;
      step: string;
      goNoGo: { canBook: boolean };
    }>('/sender/onboarding', { token: sender.accessToken });
    expect(status).toBe(200);
    expect(body.stripeMock).toBe(true);
    expect(body.step).toBe('complete');
    expect(body.goNoGo.canBook).toBe(true);
  });

  test('M3 happy path: register → profile → (docs deferred) onboarding step advances', async () => {
    const email = await registerSender({
      name: 'Happy Path Pty',
      email: `m3.happy.${Date.now()}@yopmail.com`,
    });
    const tokens = await loginAs(email);
    const before = await apiJson<{ step: string }>('/sender/onboarding', {
      token: tokens.accessToken,
    });
    expect(before.body.step).toBe('account_type');

    const profile = await apiJson<{ step: string }>('/sender/profile', {
      method: 'PUT',
      token: tokens.accessToken,
      body: JSON.stringify({
        accountType: 'BUSINESS',
        legalName: 'Happy Path Pty',
        abn: '51824753556',
        homeRegionCode: 'VIC',
        invoiceLegalName: 'Happy Path Pty',
        invoiceAddressLine1: '1 Test St',
        invoiceSuburb: 'Melbourne',
        invoiceState: 'VIC',
        invoicePostcode: '3000',
        gstRegistered: true,
      }),
    });
    expect([200, 201]).toContain(profile.status);
    expect(profile.body.step).toBe('documents');
  });
});
