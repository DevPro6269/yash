import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  hasSeenIntro: false,
  wizardData: {
    identity: {},
    basic: {},
    about: {},
    family: {},
    address: {},
    photos: {},
  },
  isAuthenticated: false,
  
  setHasSeenIntro: (value) => set({ hasSeenIntro: value }),
  
  setWizardData: (step, data) => set((state) => ({
    wizardData: {
      ...state.wizardData,
      [step]: { ...state.wizardData[step], ...data },
    },
  })),
  
  resetWizardData: () => set({
    wizardData: {
      identity: {},
      basic: {},
      about: {},
      family: {},
      address: {},
      photos: {},
    },
  }),
  
  setUser: (user) => set({ user, isAuthenticated: true }),
  
  logout: () => set({ user: null, isAuthenticated: false }),
}));
