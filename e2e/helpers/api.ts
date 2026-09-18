/** Shared API helpers for API-backed Playwright tests (M0–M3). */

export const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3001/v1';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
  principal?: { role: string; kind: string; email: string; id: string; name?: string | null };
  admin?: { role: string; email: string; id: string; name?: string | null };
};

const tokenCache = new Map<string, AuthTokens>();

export async function apiJson<T = unknown>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<{ status: number; body: T; headers: Headers }> {
  const { token, headers, ...rest } = init;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });
  const text = await res.text();
  let body: T;
  try {
    body = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    body = { raw: text } as T;
  }
  return { status: res.status, body, headers: res.headers };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function requestOtp(email: string) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await apiJson<{ ok: boolean; message: string; debugCode?: string }>(
      '/auth/otp/request',
      { method: 'POST', body: JSON.stringify({ email }) },
    );
    if (res.status !== 429) return res;
    // Default OTP throttle window is 60s @ 5 req
    await sleep(20_000 * (attempt + 1));
  }
  return apiJson<{ ok: boolean; message: string; debugCode?: string }>('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtp(email: string, code: string) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await apiJson<AuthTokens>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
    if (res.status !== 429) return res;
    await sleep(15_000 * (attempt + 1));
  }
  return apiJson<AuthTokens>('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export async function loginAs(email: string, opts?: { fresh?: boolean }): Promise<AuthTokens> {
  const key = email.toLowerCase();
  if (!opts?.fresh && tokenCache.has(key)) {
    return tokenCache.get(key)!;
  }
  const req = await requestOtp(email);
  if (req.status !== 200 && req.status !== 201) {
    throw new Error(`OTP request failed ${req.status}: ${JSON.stringify(req.body)}`);
  }
  const code = req.body.debugCode;
  if (!code) {
    throw new Error(
      `debugCode missing for ${email} (unknown account or EXPOSE_OTP_IN_RESPONSE=false). Body=${JSON.stringify(req.body)}`,
    );
  }
  const verified = await verifyOtp(email, code);
  if (verified.status !== 200 && verified.status !== 201) {
    throw new Error(`OTP verify failed ${verified.status}: ${JSON.stringify(verified.body)}`);
  }
  tokenCache.set(key, verified.body);
  return verified.body;
}

/** Register sender with throttle retries; returns normalized email. */
export async function registerSender(input: {
  name: string;
  email: string;
  acceptedTerms?: boolean;
}) {
  const payload = {
    name: input.name,
    email: input.email.toLowerCase(),
    acceptedTerms: input.acceptedTerms ?? true,
  };
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await apiJson<{ ok?: boolean; email?: string }>('/sender/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.status === 429) {
      await sleep(20_000 * (attempt + 1));
      continue;
    }
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Register failed ${res.status}: ${JSON.stringify(res.body)}`);
    }
    return payload.email;
  }
  throw new Error(`Register throttled for ${payload.email}`);
}

export const SEED = {
  super: process.env.SEED_SUPER_ADMIN_EMAIL ?? 'cloxadmin@yopmail.com',
  state: process.env.SEED_STATE_MASTER_EMAIL ?? 'state.vic@yopmail.com',
  local: process.env.SEED_LOCAL_BDE_EMAIL ?? 'local.mel@yopmail.com',
  sender: process.env.SEED_SENDER_EMAIL ?? 'sender.qa@yopmail.com',
  carrier: process.env.SEED_CARRIER_EMAIL ?? 'carrier.qa@yopmail.com',
  driver: process.env.SEED_DRIVER_EMAIL ?? 'driver.qa@yopmail.com',
};
