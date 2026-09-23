import type { AppLocale } from '@/locales';

export type RegistryRole = 'sender' | 'carrier';

export function registryPath(locale: AppLocale | string, role?: RegistryRole) {
  const base = `/${locale}/registry`;
  return role ? `${base}?role=${role}` : base;
}
