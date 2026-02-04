import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';
import { chatService } from '../services/chatService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export const ChatDetailScreen = ({ route, navigation }) => {
  const { chatId } = route.params; // conversation id
  const { profile } = useStore();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [header, setHeader] = useState({ name: 'Member', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop' });
  const subRef = useRef(null);
  const listRef = useRef(null);
  const pollRef = useRef(null);
  const insets = useSafeAreaInsets();

  const loadMessages = async () => {
    const res = await chatService.getMessages(chatId, 50);
    if (res.success) {
      setMessages(res.data.map(m => ({
        id: m.id,
        text: m.content,
        senderId: m.sender_id,
        timestamp: new Date(m.created_at).toLocaleTimeString(),
      })));
    }
  };

  const scrollToBottom = useCallback(() => {
    // Defer to the next frame to ensure content size is updated
    requestAnimationFrame(() => {
      try {
        listRef.current?.scrollToEnd({ animated: true });
      } catch (e) {}
    });
  }, []);

  const loadHeader = async () => {
    // Fetch conversation to determine other user from connection join
    const res = await chatService.getMyConversations(profile?.id);
    if (res.success) {
      const conv = (res.data || []).find(c => c.id === chatId);
      if (conv) {
        const me = profile?.id;
        const other = conv.connection.sender_id === me ? conv.connection.receiver : conv.connection.sender;
        const name = [other?.first_name, other?.last_name].filter(Boolean).join(' ');
        setHeader({ name: name || 'Member', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop' });
      }
    }
  };

  const handleSend = async () => {
    const content = inputText.trim();
    if (!content) return;
    setInputText('');
    // Optimistic
    const tempId = `temp-${Date.now()}`;
    setMessages(prev => [...prev, { id: tempId, text: content, senderId: profile?.id, timestamp: new Date().toLocaleTimeString() }]);
    await chatService.sendMessage(chatId, profile?.id, content);
  };

  useFocusEffect(
    useCallback(() => {
      if (!profile?.id || !chatId) {
        console.warn('ChatDetail: missing identifiers', { userId: profile?.id, chatId });
        return () => {};
      }

      let active = true;
      const init = async () => {
        console.log('ChatDetail focus init chatId:', chatId);
        await loadHeader();
        await loadMessages();
        chatService.markConversationRead(chatId, profile.id);
        scrollToBottom();
      };
      init();

      // Subscribe while focused only
      if (subRef.current) {
        chatService.unsubscribeFromMessages(subRef.current);
        subRef.current = null;
      }
      subRef.current = chatService.subscribeToMessages(
        chatId,
        (newMsg) => {
          if (!active) return;
          setMessages(prev => [...prev, { id: newMsg.id, text: newMsg.content, senderId: newMsg.sender_id, timestamp: new Date(newMsg.created_at).toLocaleTimeString() }]);
          scrollToBottom();
          if (newMsg.sender_id !== profile.id) {
            chatService.markConversationRead(chatId, profile.id);
          }
        },
        (status) => console.log('Chat realtime status:', status)
      );

      // lightweight polling fallback while focused (in case realtime delivers late)
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      pollRef.current = setInterval(() => {
        loadMessages();
      }, 4000);

      return () => {
        active = false;
        chatService.unsubscribeFromMessages(subRef.current);
        subRef.current = null;
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      };
    }, [profile?.id, chatId])
  );

  useEffect(() => {
    // Whenever the message list changes, attempt to keep view at the end
    if (messages?.length) scrollToBottom();
  }, [messages, scrollToBottom]);

  const isInputEmpty = !inputText.trim();

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.senderId === profile?.id ? styles.myMessage : styles.theirMessage,
    ]}>
      <View style={[
        styles.messageBubble,
        item.senderId === profile?.id ? styles.myBubble : styles.theirBubble,
      ]}>
        <Text style={[
          styles.messageText,
          item.senderId === profile?.id ? styles.myMessageText : styles.theirMessageText,
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          item.senderId === profile?.id ? styles.myMessageTime : styles.theirMessageTime,
        ]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.background.gradient}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.white} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Image source={{ uri: header.photo }} style={styles.avatar} />
          <View>
            <Text style={styles.headerTitle}>{header.name}</Text>
            <Text style={styles.headerSubtitle}>Online</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.text.white} />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.messagesList, { paddingBottom: spacing.xl + Math.max(insets.bottom, 12) + 56 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToBottom}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 8) }] }>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.text.light}
            multiline={true}
          />
          <TouchableOpacity
            style={[styles.sendButton, isInputEmpty && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={isInputEmpty}
          >
            <Ionicons
              name="send"
              size={24}
              color={!isInputEmpty ? colors.text.white : colors.text.light}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: spacing.xxl + spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.text.white,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.text.white,
    opacity: 0.8,
  },
  moreButton: {
    padding: spacing.sm,
  },
  messagesList: {
    padding: spacing.md,
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  myBubble: {
    backgroundColor: colors.primary.main,
    borderBottomRightRadius: spacing.xs,
  },
  theirBubble: {
    backgroundColor: colors.background.white,
    borderBottomLeftRadius: spacing.xs,
  },
  messageText: {
    ...typography.body1,
    marginBottom: spacing.xs,
  },
  myMessageText: {
    color: colors.text.white,
  },
  theirMessageText: {
    color: colors.text.primary,
  },
  messageTime: {
    ...typography.caption,
  },
  myMessageTime: {
    color: colors.text.white,
    opacity: 0.8,
  },
  theirMessageTime: {
    color: colors.text.light,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.background.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body1,
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.background.light,
  },
});
