import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';
import { connectionService } from '../../services/connectionService';

export const ConnectionsScreen = () => {
  const { profile } = useStore();
  const [activeTab, setActiveTab] = useState('received');
  const [connections, setConnections] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      // Incoming pending requests
      const receivedRes = await connectionService.getPendingRequests(profile.id);
      const received = (receivedRes.success ? receivedRes.data : []).map((c) => ({
        id: c.id,
        status: c.status,
        profile: {
          id: c.sender?.id,
          name: [c.sender?.first_name, c.sender?.last_name].filter(Boolean).join(' '),
          age: c.sender?.dob ? Math.abs(new Date(Date.now() - new Date(c.sender.dob).getTime()).getUTCFullYear() - 1970) : null,
          profession: c.sender?.profession || '—',
          city: [c.sender?.city, c.sender?.state].filter(Boolean).join(', '),
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
        },
        timestamp: new Date(c.created_at).toLocaleDateString(),
      }));

      // Outgoing pending requests
      const allMineRes = await connectionService.getMyConnections(profile.id, 'pending');
      const sent = (allMineRes.success ? allMineRes.data : [])
        .filter((c) => c.sender_id === profile.id)
        .map((c) => ({
          id: c.id,
          status: c.status,
          profile: {
            id: c.receiver?.id,
            name: [c.receiver?.first_name, c.receiver?.last_name].filter(Boolean).join(' '),
            age: c.receiver?.dob ? Math.abs(new Date(Date.now() - new Date(c.receiver.dob).getTime()).getUTCFullYear() - 1970) : null,
            profession: c.receiver?.profession || '—',
            city: [c.receiver?.city, c.receiver?.state].filter(Boolean).join(', '),
            photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
          },
          timestamp: new Date(c.created_at).toLocaleDateString(),
        }));

      setConnections({ received, sent });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile?.id]);

  const handleAccept = async (id) => {
    const res = await connectionService.acceptConnectionRequest(id);
    if (res.success) loadData();
  };

  const handleDecline = async (id) => {
    const res = await connectionService.declineConnectionRequest(id);
    if (res.success) loadData();
  };

  const handleCancel = async (id) => {
    // For simplicity, decline own pending sent request (or implement a delete endpoint later)
    const res = await connectionService.declineConnectionRequest(id);
    if (res.success) loadData();
  };

  const renderReceivedRequest = ({ item }) => (
    <Card style={styles.requestCard}>
      <View style={styles.requestContent}>
        <Image source={{ uri: item.profile.photo }} style={styles.avatar} />
        
        <View style={styles.requestInfo}>
          <Text style={styles.name}>{item.profile.name}, {item.profile.age}</Text>
          <Text style={styles.profession}>{item.profile.profession}</Text>
          <Text style={styles.location}>{item.profile.city}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Button
          title="Decline"
          onPress={() => handleDecline(item.id)}
          variant="outline"
          size="small"
          style={styles.declineButton}
        />
        <Button
          title="Accept"
          onPress={() => handleAccept(item.id)}
          size="small"
          style={styles.acceptButton}
        />
      </View>
    </Card>
  );

  const renderSentRequest = ({ item }) => (
    <Card style={styles.requestCard}>
      <View style={styles.requestContent}>
        <Image source={{ uri: item.profile.photo }} style={styles.avatar} />
        
        <View style={styles.requestInfo}>
          <Text style={styles.name}>{item.profile.name}, {item.profile.age}</Text>
          <Text style={styles.profession}>{item.profile.profession}</Text>
          <Text style={styles.location}>{item.profile.city}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            <Text style={[
              styles.status,
              item.status === 'accepted' && styles.statusAccepted,
              item.status === 'pending' && styles.statusPending,
            ]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {item.status === 'pending' && (
        <Button
          title="Cancel Request"
          onPress={() => handleCancel(item.id)}
          variant="outline"
          size="small"
          style={styles.cancelButton}
        />
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.background.gradient}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Connections</Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'received' && styles.activeTab]}
          onPress={() => setActiveTab('received')}
        >
          <Text style={[styles.tabText, activeTab === 'received' && styles.activeTabText]}>
            Received ({connections.received.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}
        >
          <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>
            Sent ({connections.sent.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'received' ? connections.received : connections.sent}
        renderItem={activeTab === 'received' ? renderReceivedRequest : renderSentRequest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.text.light} />
            <Text style={styles.emptyText}>{loading ? 'Loading...' : `No ${activeTab} requests`}</Text>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary.main,
  },
  tabText: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.primary.main,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
  },
  requestCard: {
    marginBottom: spacing.md,
  },
  requestContent: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  requestInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  profession: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  location: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  timestamp: {
    ...typography.caption,
    color: colors.text.light,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    ...typography.caption,
    fontWeight: '600',
  },
  statusAccepted: {
    color: colors.status.success,
  },
  statusPending: {
    color: colors.status.warning,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  declineButton: {
    flex: 1,
  },
  acceptButton: {
    flex: 1,
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body1,
    color: colors.text.light,
    marginTop: spacing.md,
  },
});
