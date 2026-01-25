import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';
import { chatService } from '../../services/chatService';

export const ChatsScreen = ({ navigation }) => {
  const { profile } = useStore();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapConversation = (c) => {
    const me = profile?.id;
    const other = c.connection.sender_id === me ? c.connection.receiver : c.connection.sender;
    const name = [other?.first_name, other?.last_name].filter(Boolean).join(' ');
    return {
      id: c.id,
      profile: {
        id: other?.id,
        name: name || 'Member',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
      },
      lastMessage: c.last_message_preview || 'Say hi and start your conversation!',
      timestamp: c.last_message_at ? new Date(c.last_message_at).toLocaleDateString() : '',
      unreadCount: 0,
    };
  };

  useEffect(() => {
    const load = async () => {
      if (!profile?.id) return;
      setLoading(true);
      try {
        const res = await chatService.getMyConversations(profile.id);
        if (res.success) {
          setChats((res.data || []).map(mapConversation));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [profile?.id]);

  const handleChatPress = (chatId) => {
    navigation.navigate('ChatDetail', { chatId });
  };

  const renderChat = ({ item }) => (
    <TouchableOpacity onPress={() => handleChatPress(item.id)}>
      <Card style={styles.chatCard}>
        <View style={styles.chatContent}>
          <Image source={{ uri: item.profile.photo }} style={styles.avatar} />
          
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.name}>{item.profile.name}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            
            <View style={styles.messageRow}>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.background.gradient}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Chats</Text>
      </LinearGradient>

      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={colors.text.light} />
            <Text style={styles.emptyText}>{loading ? 'Loading...' : 'No conversations yet'}</Text>
            <Text style={styles.emptySubtext}>
              Start connecting with matches to begin chatting
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingTop: spacing.xxl + spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text.white,
  },
  listContent: {
    padding: spacing.md,
  },
  chatCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  chatContent: {
    flexDirection: 'row',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h4,
    color: colors.text.primary,
  },
  timestamp: {
    ...typography.caption,
    color: colors.text.light,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...typography.body2,
    color: colors.text.secondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  unreadBadge: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.full,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  unreadText: {
    ...typography.caption,
    color: colors.text.white,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    ...typography.h4,
    color: colors.text.secondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body2,
    color: colors.text.light,
    textAlign: 'center',
  },
});
