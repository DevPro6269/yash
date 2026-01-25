import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge, Button } from '../../components';
import { connectionService } from '../../services/connectionService';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { supabase } from '../../config/supabase';
import { useStore } from '../../store/useStore';

export const HomeScreen = ({ navigation }) => {
  const { user ,profile } = useStore();
  const [profiles, setProfiles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAge = (dob) => {
    if (!dob) return null;
    const d = new Date(dob);
    const diff = Date.now() - d.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const formatHeight = (cm) => {
    if (!cm) return null;
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remInches = Math.round(inches % 12);
    return `${feet}' ${remInches}\" (${cm} cm)`;
  };

  const mapProfile = (p) => {
    const name = [p.first_name, p.last_name].filter(Boolean).join(' ');
    const age = getAge(p.dob);
    const verified = p.verification_status === 'verified';
    // Resolve image from profile_photos if present, prefer primary and not private
    let photo = null;
    if (Array.isArray(p.profile_photos) && p.profile_photos.length > 0) {
      const publicPhotos = p.profile_photos.filter((ph) => ph && ph.is_private !== true);
      const primary = publicPhotos.find((ph) => ph.is_primary) || publicPhotos[0];
      photo = primary?.image_url || null;
    }
    // Fallback image if none available
    if (!photo) {
      photo = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop';
    }
    return {
      id: p.id,
      name,
      age,
      verified,
      profession: p.profession || '—',
      city: p.city || '—',
      state: p.state || '—',
      education: p.education || '—',
      height: formatHeight(p.height_cm) || '—',
      bio: p.bio || '—',
      photo,
    };
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        // Require profile gender to enforce opposite-gender matching
        const g = (profile?.gender || '').toLowerCase();
        if (!g) {
          setProfiles([]);
          setError('Please set your gender to see matches');
          return;
        }
        let query = supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            dob,
            profession,
            education,
            city,
            state,
            height_cm,
            bio,
            verification_status,
            profile_photos ( image_url, is_primary, is_private )
          `)
          .order('id', { ascending: false })
          .limit(50);

        // Exclude current user's own profile if available
        if (profile?.id) {
          query = query.neq('user_id', profile.id);
        }

        // Show opposite gender profiles always
        const targetGender = g === 'male' ? 'female' : g === 'female' ? 'male' : null;
        if (targetGender) {
          query = query.eq('gender', targetGender);
        }

        const { data, error } = await query;

        if (error) throw error;
        let mapped = (data || []).map(mapProfile);

        // Fetch existing connections to mark statuses (pending/accepted/declined)
        if (profile?.id) {
          const { data: connsRes, success } = await connectionService.getMyConnections(profile.id);
          if (success && Array.isArray(connsRes)) {
            const statusMap = new Map();
            connsRes.forEach((c) => {
              const otherId = c.sender_id === profile.id ? c.receiver_id : c.sender_id;
              statusMap.set(otherId, c.status);
            });
            // annotate status
            mapped = mapped.map((p) => ({ ...p, requestStatus: statusMap.get(p.id) || p.requestStatus }));
            // filter out any profiles that already have a connection in any status
            mapped = mapped.filter((p) => !statusMap.has(p.id));
          }
        }

        setProfiles(mapped);
      } catch (e) {
        console.error('Failed to load profiles:', e);
        setError('Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [profile?.gender, profile?.id]);

  const [requestingId, setRequestingId] = useState(null);

  const handleConnect = async (receiverProfileId) => {
    if (!profile?.id) return;
    try {
      setRequestingId(receiverProfileId);
      const { success, error } = await connectionService.sendConnectionRequest(profile.id, receiverProfileId);
      if (!success) {
        console.error('Send request failed:', error);
      } else {
        // Optimistic UI: mark this card as pending
        setProfiles((prev) => prev.map(p => p.id === receiverProfileId ? { ...p, requestStatus: 'pending' } : p));
      }
    } finally {
      setRequestingId(null);
    }
  };

  const renderProfile = ({ item }) => (
    <Card style={styles.profileCard}>
      <Image source={{ uri: item.photo }} style={styles.profileImage} />
      
      <View style={styles.profileInfo}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileName}>{item.name}, {item.age}</Text>
          {item.verified && (
            <Badge label="Verified" variant="verified" size="small" />
          )}
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.infoText}>{item.profession}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.infoText}>{item.city}, {item.state}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.infoText}>{item.education}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="resize-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.infoText}>{item.height}</Text>
        </View>

        <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>

        <Button
          title={item.requestStatus === 'accepted' ? 'Connected' : item.requestStatus === 'pending' ? 'Requested' : 'Connect'}
          onPress={() => handleConnect(item.id)}
          disabled={item.requestStatus === 'accepted' || item.requestStatus === 'pending' || requestingId === item.id}
          loading={requestingId === item.id}
          style={styles.connectButton}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.background.gradient}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Discover Matches</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={24} color={colors.text.white} />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={profiles}
        renderItem={renderProfile}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.listContent, profiles.length === 0 && { paddingTop: spacing.xl }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name={loading ? 'hourglass' : 'alert-circle'} size={28} color={colors.text.secondary} />
            <Text style={styles.emptyText}>{loading ? 'Loading matches...' : (error || 'No profiles found')}</Text>
          </View>
        }
      />

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>
            <Text style={styles.modalSubtitle}>Filter options coming soon...</Text>
            <Button
              title="Close"
              onPress={() => setShowFilters(false)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingTop: spacing.xxl + spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text.white,
  },
  filterButton: {
    padding: spacing.sm,
  },
  listContent: {
    padding: spacing.md,
  },
  profileCard: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  profileInfo: {
    padding: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  profileName: {
    ...typography.h3,
    color: colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
    gap: spacing.sm,
  },
  infoText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  bio: {
    ...typography.body2,
    color: colors.text.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  connectButton: {
    marginTop: spacing.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    minHeight: 300,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    ...typography.body1,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  closeButton: {
    marginTop: spacing.lg,
  },
});
