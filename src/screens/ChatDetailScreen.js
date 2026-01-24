import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { mockMessages, mockChats } from '../data/mockData';

export const ChatDetailScreen = ({ route, navigation }) => {
  const { chatId } = route.params;
  const chat = mockChats.find(c => c.id === chatId);
  const [messages, setMessages] = useState(mockMessages[chatId] || []);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: `m${Date.now()}`,
        text: inputText,
        sender: 'me',
        timestamp: 'Just now',
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const isInputEmpty = !inputText.trim();

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.theirMessage,
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myBubble : styles.theirBubble,
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'me' ? styles.myMessageText : styles.theirMessageText,
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          item.sender === 'me' ? styles.myMessageTime : styles.theirMessageTime,
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
          <Image source={{ uri: chat?.profile.photo }} style={styles.avatar} />
          <View>
            <Text style={styles.headerTitle}>{chat?.profile.name}</Text>
            <Text style={styles.headerSubtitle}>Online</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.text.white} />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
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
