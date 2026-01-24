import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { mockChats } from '../../data/mockData';

export const ChatsScreen = ({ navigation }) => {
  const [chats, setChats] = useState(mockChats);

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
            <Text style={styles.emptyText}>No conversations yet</Text>
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
