'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RegistryUserType = 'sender' | 'carrier' | null;

type RegistryWizardState = {
  step: 1 | 2 | 3;
  userType: RegistryUserType;
  setStep: (step: 1 | 2 | 3) => void;
  setUserType: (userType: RegistryUserType) => void;
  reset: () => void;
};

export const useRegistryWizardStore = create<RegistryWizardState>()(
  persist(
    (set) => ({
      step: 1,
      userType: null,
      setStep: (step) => set({ step }),
      setUserType: (userType) => set({ userType, step: userType ? 2 : 1 }),
      reset: () => set({ step: 1, userType: null }),
    }),
    { name: 'clox-registry-wizard' },
  ),
);

/** Avoid SSR/client mismatch for persisted wizard state. */
export function useRegistryWizardHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const finish = () => setHydrated(true);
    finish();
    return useRegistryWizardStore.persist.onFinishHydration(finish);
  }, []);
  return hydrated;
}
