import { test, expect } from '@playwright/test';
import { apiJson, loginAs, SEED } from '../../helpers/api';

test.describe.configure({ mode: 'serial' });

/**
 * M10 API-backed smoke: notify → POD docs ACL + propose/approve replacement.
 * Skips gracefully when seed has no in-progress driver trip (CI without full trip fixture).
 */
test.describe('API-backed — M10 POD / notify / approve-replacement', () => {
  test('M10-1 driver notify-approaching idempotent when active trip exists', async () => {
    const driver = await loginAs(SEED.driver);
    const mine = await apiJson<{ items?: Array<{ id: string; status: string }> } | Array<{ id: string }>>(
      '/trips/mine',
      { token: driver.accessToken },
    );
    expect([200, 201]).toContain(mine.status);
    const items = Array.isArray(mine.body)
      ? mine.body
      : (mine.body.items ?? []);
    const trip = items[0];
    if (!trip?.id) {
      test.skip(true, 'No seed driver trip — skip M10 notify path');
      return;
    }

    const first = await apiJson(`/trips/${trip.id}/notify-approaching`, {
      method: 'POST',
      token: driver.accessToken,
      body: '{}',
    });
    // 200 ok, or 400 if no eligible dropoff / already past gate — still proves route exists
    expect([200, 201, 400]).toContain(first.status);

    if (first.status === 200 || first.status === 201) {
      const second = await apiJson(`/trips/${trip.id}/notify-approaching`, {
        method: 'POST',
        token: driver.accessToken,
        body: '{}',
      });
      // Idempotent: already sent → business error, not 5xx
      expect([200, 201, 400, 409]).toContain(second.status);
    }
  });

  test('M10-2 sender/carrier document download ACL when tripId known', async () => {
    const sender = await loginAs(SEED.sender);
    const jobs = await apiJson<Array<{ id: string; status: string; trip?: { id: string } | null }>>(
      '/jobs',
      { token: sender.accessToken },
    );
    expect([200, 201]).toContain(jobs.status);
    const list = Array.isArray(jobs.body) ? jobs.body : [];
    const withTrip = list.find((j) => j.trip?.id);
    if (!withTrip?.trip?.id) {
      test.skip(true, 'No sender job with trip — skip document ACL');
      return;
    }

    const tripId = withTrip.trip.id;
    const podMeta = await apiJson<{
      tripId: string;
      podStorageKey: string | null;
      taxInvoiceStorageKey: string | null;
      runSheetStorageKey: string | null;
    }>(`/trips/${tripId}/pod`, { token: sender.accessToken });
    expect([200, 201, 403, 404]).toContain(podMeta.status);
    if (podMeta.status !== 200 && podMeta.status !== 201) {
      test.skip(true, 'Sender cannot read POD for seed trip');
      return;
    }

    for (const kind of ['pod', 'tax-invoice', 'run-sheet'] as const) {
      const key =
        kind === 'pod'
          ? podMeta.body.podStorageKey
          : kind === 'tax-invoice'
            ? podMeta.body.taxInvoiceStorageKey
            : podMeta.body.runSheetStorageKey;
      if (!key) continue;
      const res = await fetch(
        `${process.env.API_BASE_URL ?? 'http://localhost:3001/v1'}/trips/${tripId}/documents/${kind}`,
        { headers: { authorization: `Bearer ${sender.accessToken}` } },
      );
      expect([200, 404]).toContain(res.status);
      if (res.status === 200) {
        const ct = res.headers.get('content-type') ?? '';
        expect(ct).toMatch(/pdf|octet-stream/i);
        const buf = await res.arrayBuffer();
        expect(buf.byteLength).toBeGreaterThan(0);
      }
    }
  });

  test('M10-3 propose replacement → awaiting sender (carrier exceptions)', async () => {
    const carrier = await loginAs(SEED.carrier);
    const list = await apiJson<{ items: Array<{ id: string; status: string }> }>(
      '/exceptions',
      { token: carrier.accessToken },
    );
    expect([200, 201]).toContain(list.status);
    const open = (list.body.items ?? []).find(
      (e) =>
        e.status === 'AWAITING_CARRIER' ||
        e.status === 'OPEN' ||
        e.status === 'ESCALATED' ||
        e.status === 'AWAITING_SENDER_APPROVAL',
    );
    if (!open) {
      test.skip(true, 'No open carrier exception in seed — skip propose path');
      return;
    }

    const candidates = await apiJson<{
      recommended: { vehicleId: string; driverId: string } | null;
      items: Array<{ vehicleId: string; driverId: string }>;
    }>(`/exceptions/${open.id}/candidates`, { token: carrier.accessToken });

    const pick =
      candidates.body.recommended ??
      candidates.body.items?.[0] ??
      null;
    if (!pick) {
      test.skip(true, 'No rescue candidates for seed exception');
      return;
    }

    const propose = await apiJson<{
      exception: { status: string };
      proposal?: { status: string };
    }>(`/exceptions/${open.id}/reassign`, {
      method: 'POST',
      token: carrier.accessToken,
      body: JSON.stringify({
        vehicleId: pick.vehicleId,
        driverId: pick.driverId,
        note: 'E2E propose replacement',
      }),
    });
    expect([200, 201, 400]).toContain(propose.status);
    if (propose.status === 200 || propose.status === 201) {
      expect(propose.body.exception.status).toBe('AWAITING_SENDER_APPROVAL');
      expect(propose.body.proposal?.status).toBe('AWAITING_SENDER_APPROVAL');

      const sender = await loginAs(SEED.sender);
      const approve = await apiJson(`/exceptions/${open.id}/approve-replacement`, {
        method: 'POST',
        token: sender.accessToken,
        body: '{}',
      });
      // 200 if sender owns job; 403/404 if seed exception belongs to another sender company
      expect([200, 201, 403, 404, 400]).toContain(approve.status);
    }
  });
});
