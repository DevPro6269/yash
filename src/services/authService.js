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

      const dbUser = await this.getOrCreateUser(user);
      
      return { success: true, user: dbUser, session: data.session };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message };
    }
  },

  async getOrCreateUser(authUser) {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authUser.id)
        .single();

      if (existingUser) {
        await supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', existingUser.id);
        
        return existingUser;
      }

      // Fallback: try to find by phone number if auth_id was never backfilled
      const phoneStorage = normalizePhoneStorageIN(authUser.phone);
      if (phoneStorage) {
        const { data: userByPhone } = await supabase
          .from('users')
          .select('*')
          .eq('phone_number', phoneStorage)
          .single();
        if (userByPhone) {
          const { data: updatedUser } = await supabase
            .from('users')
            .update({
              auth_id: authUser.id,
              last_login_at: new Date().toISOString(),
              phone_number: phoneStorage,
            })
            .eq('id', userByPhone.id)
            .select()
            .single();
          return updatedUser || userByPhone;
        }
      }

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          auth_id: authUser.id,
          phone_number: phoneStorage || normalizePhoneStorageIN(authUser.phone),
          role: 'user',
          account_status: 'active',
          last_login_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) throw createError;
      return newUser;
    } catch (error) {
      console.error('Get or create user error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Get current user response:', { user, error });
      if (error) throw error;
      if (!user) return null;

      const { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single();

      if (!dbUser) return null;

      console.log('db user is', { id: dbUser.id });

      const { data: profile } = await profileService.getProfileByUserId(dbUser.id);
      // profile may be null if the user hasn't created one yet
      console.log('Get current Profile response:', { profile });
      return { user: dbUser, profile: profile || null };
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
