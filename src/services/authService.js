import { supabase } from '../config/supabase';

export const authService = {
  async sendOTP(phoneNumber) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message };
    }
  },

  async verifyOTP(phoneNumber, otp) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

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

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          auth_id: authUser.id,
          phone_number: authUser.phone,
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
      
      if (error) throw error;
      if (!user) return null;

      const { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single();

      return dbUser;
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
