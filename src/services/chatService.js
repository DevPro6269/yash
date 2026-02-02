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

  // Get unread counts per conversation using a Postgres RPC
  async getUnreadCountsByConversation(userId) {
    try {
      const { data, error } = await supabase
        .rpc('unread_counts_for_user', { uid: userId });
      if (error) throw error;
      // Expect array of { conversation_id, unread_count }
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Get unread counts by conversation error:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // Mark a conversation as read for a user using RPC
  async markConversationRead(conversationId, userId) {
    try {
      const { data, error } = await supabase
        .rpc('mark_conversation_read', { cid: conversationId, uid: userId });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Mark conversation read error:', error);
      return { success: false, error: error.message };
    }
  },

  // Subscribe to all new messages (inserts). Client can decide how to handle.
  subscribeToAllMessages(callback) {
    const subscription = supabase
      .channel('messages:all')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => callback(payload.new)
      )
      .subscribe();
    return subscription;
  },

  async getMyConversations(userId) {
    try {
      let query = supabase
        .from('conversations')
        .select(`
          *,
          connection:connections!inner(
            *,
            sender:profiles!connections_sender_id_fkey(*),
            receiver:profiles!connections_receiver_id_fkey(*)
          )
        `)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      // Filter by sender/receiver on the foreign table using foreignTable option
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`, { foreignTable: 'connections' });

      const { data, error } = await query;

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

  subscribeToMessages(conversationId, callback, onStatus) {
    const channel = supabase
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
          try {
            callback(payload.new);
          } catch (e) {
            console.error('Realtime message handler error:', e);
          }
        }
      )
      .subscribe((status) => {
        if (onStatus) onStatus(status);
        if (status === 'SUBSCRIBED') {
          // Ready to receive realtime
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Realtime channel error for conversation', conversationId);
        } else if (status === 'TIMED_OUT') {
          console.warn('Realtime channel timed out for conversation', conversationId);
        } else if (status === 'CLOSED') {
          // closed
        }
      });

    return channel;
  },

  unsubscribeFromMessages(channel) {
    if (channel) {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        console.error('Remove channel error:', e);
      }
    }
  },

  async getUnreadCount(userId) {
    try {
      // Fetch conversations for this user via joined connections table
      let convQuery = supabase
        .from('conversations')
        .select(`
          id,
          connections:connections!inner(sender_id, receiver_id)
        `);

      convQuery = convQuery.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`, { foreignTable: 'connections' });

      const { data: conversations, error: convErr } = await convQuery;
      if (convErr) throw convErr;

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
 
  // Ensure a conversation exists for an accepted connection
  async getOrCreateConversationByConnectionId(connectionId) {
    try {
      const { data: existing, error: getErr } = await supabase
        .from('conversations')
        .select('*')
        .eq('connection_id', connectionId)
        .single();
      if (existing) return { success: true, data: existing };
      if (getErr && getErr.code !== 'PGRST116') throw getErr;

      const { data, error } = await supabase
        .from('conversations')
        .insert({ connection_id: connectionId })
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Create conversation error:', error);
      return { success: false, error: error.message };
    }
  },

  // Subscribe to conversation updates (e.g., last_message_at)
  subscribeToConversation(conversationId, callback) {
    const subscription = supabase
      .channel(`conversations:${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'conversations', filter: `id=eq.${conversationId}` },
        (payload) => callback(payload.new)
      )
      .subscribe();
    return subscription;
  },
};
