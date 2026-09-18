import { test, expect } from '@playwright/test';
import { apiJson, loginAs, SEED } from '../../helpers/api';
import { createHash } from 'node:crypto';

test.describe.configure({ mode: 'serial' });

const SENDER_COMPANY = '00000000-0000-4000-8000-000000000001';
const CARRIER_COMPANY = '00000000-0000-4000-8000-000000000002';

async function uploadTinyPdf(token: string, companyId: string, docType: string) {
  const bytes = Buffer.from('%PDF-1.4 edge-test');
  const intent = await apiJson<{ id: string }>('/documents/upload-intent', {
    method: 'POST',
    token,
    body: JSON.stringify({
      companyId,
      docType,
      originalFilename: 'edge.pdf',
      mimeType: 'application/pdf',
      sizeBytes: bytes.length,
    }),
  });
  expect(intent.status).toBe(201);

  const form = new FormData();
  form.append('file', new Blob([bytes], { type: 'application/pdf' }), 'edge.pdf');

  const put = await fetch(
    `${process.env.API_BASE_URL ?? 'http://localhost:3001/v1'}/documents/${intent.body.id}/content`,
    {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
      body: form,
    },
  );
  expect(put.status).toBeLessThan(300);
  const putBody = (await put.json()) as { contentHash: string };
  const hash = putBody.contentHash || createHash('sha256').update(bytes).digest('hex');

  const confirm = await apiJson(`/documents/${intent.body.id}/confirm`, {
    method: 'POST',
    token,
    body: JSON.stringify({ contentHash: hash }),
  });
  expect([200, 201]).toContain(confirm.status);
  return intent.body.id as string;
}

test.describe('API-backed — M2 documents & compliance', () => {
  test('M2-1 unsupported MIME on intent → 400', async () => {
    const carrier = await loginAs(SEED.carrier);
    const { status } = await apiJson('/documents/upload-intent', {
      method: 'POST',
      token: carrier.accessToken,
      body: JSON.stringify({
        companyId: CARRIER_COMPANY,
        docType: 'PUBLIC_LIABILITY',
        originalFilename: 'x.gif',
        mimeType: 'image/gif',
        sizeBytes: 100,
      }),
    });
    expect(status).toBe(400);
  });

  test('M2-2 sender cannot upload to carrier company → 403', async () => {
    const sender = await loginAs(SEED.sender);
    const { status } = await apiJson('/documents/upload-intent', {
      method: 'POST',
      token: sender.accessToken,
      body: JSON.stringify({
        companyId: CARRIER_COMPANY,
        docType: 'ABN_EXTRACT',
        originalFilename: 'x.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 100,
      }),
    });
    expect(status).toBe(403);
  });

  test('M2-3 unknown company → 404', async () => {
    const sender = await loginAs(SEED.sender);
    const { status } = await apiJson('/documents/upload-intent', {
      method: 'POST',
      token: sender.accessToken,
      body: JSON.stringify({
        companyId: '00000000-0000-4000-8000-999999999999',
        docType: 'ABN_EXTRACT',
        originalFilename: 'x.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 100,
      }),
    });
    expect(status).toBe(404);
  });

  test('M2-7 confirm wrong hash → 400', async () => {
    const sender = await loginAs(SEED.sender);
    const bytes = Buffer.from('%PDF-1.4 hash-mismatch');
    const intent = await apiJson<{ id: string }>('/documents/upload-intent', {
      method: 'POST',
      token: sender.accessToken,
      body: JSON.stringify({
        companyId: SENDER_COMPANY,
        docType: 'ABN_EXTRACT',
        originalFilename: 'x.pdf',
        mimeType: 'application/pdf',
        sizeBytes: bytes.length,
      }),
    });
    expect(intent.status).toBe(201);
    const form = new FormData();
    form.append('file', new Blob([bytes], { type: 'application/pdf' }), 'x.pdf');
    await fetch(
      `${process.env.API_BASE_URL ?? 'http://localhost:3001/v1'}/documents/${intent.body.id}/content`,
      {
        method: 'PUT',
        headers: { authorization: `Bearer ${sender.accessToken}` },
        body: form,
      },
    );
    const { status } = await apiJson(`/documents/${intent.body.id}/confirm`, {
      method: 'POST',
      token: sender.accessToken,
      body: JSON.stringify({ contentHash: '0'.repeat(64) }),
    });
    expect(status).toBe(400);
  });

  test('M2-12 sender cannot submit CARRIER_KYB → 400', async () => {
    const sender = await loginAs(SEED.sender);
    const docId = await uploadTinyPdf(sender.accessToken, SENDER_COMPANY, 'ABN_EXTRACT');
    const { status } = await apiJson('/compliance/submit', {
      method: 'POST',
      token: sender.accessToken,
      body: JSON.stringify({
        companyId: SENDER_COMPANY,
        caseType: 'CARRIER_KYB',
        documentIds: [docId],
      }),
    });
    expect(status).toBe(400);
  });

  test('M2-21 Local cannot approve → 403', async () => {
    const local = await loginAs(SEED.local);
    const { status } = await apiJson('/ops/compliance/cases/00000000-0000-4000-8000-000000000099/approve', {
      method: 'POST',
      token: local.accessToken,
      body: JSON.stringify({}),
    });
    expect(status).toBe(403);
  });

  test('M2-26 ABR without GUID is assist-only stub', async () => {
    const superAdmin = await loginAs(SEED.super);
    const { status, body } = await apiJson<{ configured?: boolean; active?: boolean | null }>(
      '/compliance/abr?abn=51824753556',
      { token: superAdmin.accessToken },
    );
    expect(status).toBe(200);
    expect(body.configured === false || body.active === null || body.active === undefined).toBeTruthy();
  });
});
