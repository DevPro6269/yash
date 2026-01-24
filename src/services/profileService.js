import { supabase } from '../config/supabase';

export const profileService = {
  async getProfileByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          community:communities(id, name),
          caste:castes(id, name),
          photos:profile_photos(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: error.message };
    }
  },

  async createProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          ...profileData,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Create profile error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateProfile(profileId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  },

  async getCommunities() {
    try {
      console.log('profileService: Fetching communities from Supabase...');
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('is_active', true)
        .order('name');

      console.log('profileService: Supabase response - data:', data, 'error:', error);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get communities error:', error);
      return { success: false, error: error.message };
    }
  },

  async getCastesByCommunity(communityId) {
    try {
      const { data, error } = await supabase
        .from('castes')
        .select('*')
        .eq('community_id', communityId)
        .order('name');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get castes error:', error);
      return { success: false, error: error.message };
    }
  },

  async searchProfiles(filters = {}) {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          community:communities(id, name),
          caste:castes(id, name),
          photos:profile_photos!inner(*)
        `)
        .eq('verification_status', 'verified');

      if (filters.communityId) {
        query = query.eq('community_id', filters.communityId);
      }

      if (filters.casteId) {
        query = query.eq('caste_id', filters.casteId);
      }

      if (filters.gender) {
        query = query.eq('gender', filters.gender);
      }

      if (filters.minAge || filters.maxAge) {
        const today = new Date();
        if (filters.maxAge) {
          const minDob = new Date(today.getFullYear() - filters.maxAge, today.getMonth(), today.getDate());
          query = query.gte('dob', minDob.toISOString());
        }
        if (filters.minAge) {
          const maxDob = new Date(today.getFullYear() - filters.minAge, today.getMonth(), today.getDate());
          query = query.lte('dob', maxDob.toISOString());
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Search profiles error:', error);
      return { success: false, error: error.message };
    }
  },

  async addProfilePhoto(profileId, photoData) {
    try {
      const { data, error } = await supabase
        .from('profile_photos')
        .insert({
          profile_id: profileId,
          ...photoData,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Add profile photo error:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteProfilePhoto(photoId) {
    try {
      const { error } = await supabase
        .from('profile_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete profile photo error:', error);
      return { success: false, error: error.message };
    }
  },
};
