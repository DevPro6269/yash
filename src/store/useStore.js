import { create } from 'zustand';
import { authService, profileService } from '../services';

export const useStore = create((set, get) => ({
  user: null,
  profile: null,
  hasSeenIntro: false,
  isLoading: false,
  error: null,
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
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
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
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setProfile: (profile) => set({ profile }),
  
  async initializeAuth() {
    try {
      set({ isLoading: true });
      const result = await authService.getCurrentUser();
      
      if (result && result.user) {
        set({ user: result.user, isAuthenticated: true });
        if (result.profile) {
          set({ profile: result.profile });
        } else {
          const { data: profile } = await profileService.getProfileByUserId(result.user.id);
          if (profile) set({ profile });
        }
      }
    } catch (error) {
      console.error('Initialize auth error:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  async sendOTP(phoneNumber) {
    try {
      set({ isLoading: true, error: null });
      const result = await authService.sendOTP(phoneNumber);
      
      if (!result.success) {
        set({ error: result.error });
      }
      
      return result;
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },
  
  async verifyOTP(phoneNumber, otp) {
    try {
      set({ isLoading: true, error: null });
      const result = await authService.verifyOTP(phoneNumber, otp);
      
      if (result.success) {
        set({ 
          user: result.user, 
          isAuthenticated: true 
        });
        
        if (result.profile) {
          set({ profile: result.profile });
        } else {
          const { data: profile } = await profileService.getProfileByUserId(result.user.id);
          if (profile) set({ profile });
        }
      } else {
        set({ error: result.error });
      }
      
      return result;
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },
  
  async createProfile(profileData) {
    try {
      set({ isLoading: true, error: null });
      const { user } = get();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const result = await profileService.createProfile(user.id, profileData);
      
      if (result.success) {
        set({ profile: result.data });
        get().resetWizardData();
      } else {
        set({ error: result.error });
      }
      
      return result;
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },
  
  async updateProfile(updates) {
    try {
      set({ isLoading: true, error: null });
      const { profile } = get();
      
      if (!profile) {
        throw new Error('No profile found');
      }
      
      const result = await profileService.updateProfile(profile.id, updates);
      
      if (result.success) {
        set({ profile: result.data });
      } else {
        set({ error: result.error });
      }
      
      return result;
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },
  
  async logout() {
    try {
      set({ isLoading: true });
      await authService.signOut();
      set({ 
        user: null, 
        profile: null, 
        isAuthenticated: false,
        hasSeenIntro: false,
      });
      get().resetWizardData();
    } catch (error) {
      console.error('Logout error:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
