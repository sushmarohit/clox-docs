'use client';

import { create } from 'zustand';

export type RegistryUserType = 'sender' | 'carrier' | null;

type RegistryWizardState = {
  step: 1 | 2 | 3;
  userType: RegistryUserType;
  setStep: (step: 1 | 2 | 3) => void;
  setUserType: (userType: RegistryUserType) => void;
  reset: () => void;
};

export const useRegistryWizardStore = create<RegistryWizardState>()((set) => ({
  step: 1,
  userType: null,
  setStep: (step) => set({ step }),
  setUserType: (userType) => set({ userType, step: userType ? 2 : 1 }),
  reset: () => set({ step: 1, userType: null }),
}));
