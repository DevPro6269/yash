import { supabase } from '../config/supabase';
import { profileService } from './profileService';

// Helper to normalize Indian phone numbers to E.164 format (+91XXXXXXXXXX)
function normalizePhoneE164IN(input) {
  if (!input) return input;
  const trimmed = String(input).trim();
  // If already starts with '+' assume E.164; do a light sanity clean
  if (trimmed.startsWith('+')) {
    // remove spaces and hyphens inside
    return '+' + trimmed.slice(1).replace(/[^0-9]/g, '');
  }
  // Remove all non-digits
  let digits = trimmed.replace(/[^0-9]/g, '');
  // Drop leading zeros
  digits = digits.replace(/^0+/, '');
  // Ensure country code 91
  if (!digits.startsWith('91')) {
    digits = '91' + digits;
  }
  return `+${digits}`;
}

// Helper to normalize Indian phone numbers for storage and lookups (10-digit local number)
function normalizePhoneStorageIN(input) {
  if (!input) return input;
  // keep only digits
  let digits = String(input).replace(/[^0-9]/g, '');
  // If it includes country code, take the last 10 digits (Indian local number)
  if (digits.length > 10) {
    digits = digits.slice(-10);
  }
  return digits;
}

export const authService = {
  async sendOTP(phoneNumber) {
    try {
      const formattedPhoneNumber = normalizePhoneE164IN(phoneNumber);
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhoneNumber,
      });
       console.log('Send OTP response:', { data, error });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message };
    }
  },

  async verifyOTP(phoneNumber, otp) {
    try {
      const formattedPhoneNumber = normalizePhoneE164IN(phoneNumber);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhoneNumber,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;
      console.log('Verify OTP response:', { data, error });
      const user = data.user;
      if (!user) throw new Error('No user returned after OTP verification');

      // Fetch profile (may not exist yet for new users)
      const { data: profile } = await profileService.getProfile(user.id);
      
      return { success: true, user: data.user, profile, session: data.session };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message };
    }
  },


  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Get current user response:', { user, error });
      if (error) throw error;
      if (!user) return null;

      // Fetch profile directly using auth user id
      const { data: profile } = await profileService.getProfile(user.id);
      console.log('Get current Profile response:', { profile });
      
      return { user, profile: profile || null };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
