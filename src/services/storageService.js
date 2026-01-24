import { supabase } from '../config/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export const storageService = {
  async uploadProfilePhoto(userId, uri, isPrivate = false) {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileExt = uri.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, decode(base64), {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl, path: filePath };
    } catch (error) {
      console.error('Upload profile photo error:', error);
      return { success: false, error: error.message };
    }
  },

  async uploadVerificationDocument(userId, uri, docType) {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileExt = uri.split('.').pop();
      const fileName = `${userId}/${docType}_${Date.now()}.${fileExt}`;
      const filePath = `verification-docs/${fileName}`;

      const { data, error } = await supabase.storage
        .from('verification-docs')
        .upload(filePath, decode(base64), {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('verification-docs')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl, path: filePath };
    } catch (error) {
      console.error('Upload verification document error:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteFile(bucket, filePath) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete file error:', error);
      return { success: false, error: error.message };
    }
  },

  async getSignedUrl(bucket, filePath, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) throw error;
      return { success: true, url: data.signedUrl };
    } catch (error) {
      console.error('Get signed URL error:', error);
      return { success: false, error: error.message };
    }
  },
};
