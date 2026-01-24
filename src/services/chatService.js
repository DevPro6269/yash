import { supabase } from '../config/supabase';

export const chatService = {
  async getConversationByConnectionId(connectionId) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('connection_id', connectionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get conversation error:', error);
      return { success: false, error: error.message };
    }
  },

  async getMyConversations(userId) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          connection:connections!inner(
            *,
            sender:profiles!connections_sender_id_fkey(*),
            receiver:profiles!connections_receiver_id_fkey(*)
          )
        `)
        .or(`connection.sender_id.eq.${userId},connection.receiver_id.eq.${userId}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get conversations error:', error);
      return { success: false, error: error.message };
    }
  },

  async getMessages(conversationId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, first_name, last_name)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data: data.reverse() };
    } catch (error) {
      console.error('Get messages error:', error);
      return { success: false, error: error.message };
    }
  },

  async sendMessage(conversationId, senderId, content, messageType = 'text') {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          message_type: messageType,
          is_read: false,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          last_message_preview: content.substring(0, 100),
        })
        .eq('id', conversationId);

      return { success: true, data };
    } catch (error) {
      console.error('Send message error:', error);
      return { success: false, error: error.message };
    }
  },

  async markMessagesAsRead(conversationId, userId) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Mark messages as read error:', error);
      return { success: false, error: error.message };
    }
  },

  subscribeToMessages(conversationId, callback) {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return subscription;
  },

  unsubscribeFromMessages(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  },

  async getUnreadCount(userId) {
    try {
      const { data: conversations } = await supabase
        .from('conversations')
        .select(`
          id,
          connection:connections!inner(sender_id, receiver_id)
        `)
        .or(`connection.sender_id.eq.${userId},connection.receiver_id.eq.${userId}`);

      if (!conversations) return { success: true, count: 0 };

      const conversationIds = conversations.map(c => c.id);
      
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)
        .neq('sender_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('Get unread count error:', error);
      return { success: false, error: error.message, count: 0 };
    }
  },
};
