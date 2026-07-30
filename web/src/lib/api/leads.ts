import type { CreateLeadResponse } from '@/shared/types';
import { http } from '@/lib/http';

export type { CreateLeadResponse };

export function submitRegistryLead(
  payload: unknown,
  options?: { signal?: AbortSignal },
) {
  return http
    .post<CreateLeadResponse>('/leads/registry', payload, {
      signal: options?.signal,
      timeout: 45_000,
    })
    .then((res) => res.data);
}

export function submitEoiLead(payload: unknown, options?: { signal?: AbortSignal }) {
  return http
    .post<CreateLeadResponse>('/leads/eoi', payload, {
      signal: options?.signal,
      timeout: 45_000,
    })
    .then((res) => res.data);
}

export function submitInvestorLead(
  payload: unknown,
  options?: { signal?: AbortSignal },
) {
  return http
    .post<CreateLeadResponse>('/leads/investor', payload, {
      signal: options?.signal,
      timeout: 45_000,
    })
    .then((res) => res.data);
}
