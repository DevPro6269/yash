import { supabase } from '../config/supabase';

export const connectionService = {
  async sendConnectionRequest(senderId, receiverId) {
    try {
      const { data: existing } = await supabase
        .from('connections')
        .select('*')
        .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
        .single();

      if (existing) {
        return { success: false, error: 'Connection already exists' };
      }

      const { data, error } = await supabase
        .from('connections')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Send connection request error:', error);
      return { success: false, error: error.message };
    }
  },

  async acceptConnectionRequest(connectionId) {
    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId)
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('conversations')
        .insert({
          connection_id: connectionId,
        });

      return { success: true, data };
    } catch (error) {
      console.error('Accept connection error:', error);
      return { success: false, error: error.message };
    }
  },

  async declineConnectionRequest(connectionId) {
    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: 'declined' })
        .eq('id', connectionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Decline connection error:', error);
      return { success: false, error: error.message };
    }
  },

  async blockConnection(connectionId) {
    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: 'blocked' })
        .eq('id', connectionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Block connection error:', error);
      return { success: false, error: error.message };
    }
  },

  async getMyConnections(userId, status = null) {
    try {
      let query = supabase
        .from('connections')
        .select(`
          *,
          sender:profiles!connections_sender_id_fkey(*),
          receiver:profiles!connections_receiver_id_fkey(*)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get connections error:', error);
      return { success: false, error: error.message };
    }
  },

  async getPendingRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select(`
          *,
          sender:profiles!connections_sender_id_fkey(*)
        `)
        .eq('receiver_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get pending requests error:', error);
      return { success: false, error: error.message };
    }
  },

  async getConnectionStatus(userId, otherUserId) {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get connection status error:', error);
      return { success: false, error: error.message };
    }
  },
};
