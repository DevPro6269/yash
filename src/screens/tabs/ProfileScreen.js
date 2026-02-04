import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge, Button, Input } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';

export const ProfileScreen = ({ navigation }) => {
  const { profile, updateProfile, logout, initializeAuth } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const primaryPhoto = useMemo(() => {
    const photos = Array.isArray(profile?.photos) ? profile.photos : [];
    const publicPhotos = photos.filter(p => !p?.is_private);
    const primary = publicPhotos.find(p => p?.is_primary) || publicPhotos[0];
    return primary?.image_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop';
  }, [profile?.photos]);

  const getAge = (dob) => {
    if (!dob) return null;
    const d = new Date(dob);
    const diff = Date.now() - d.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const startEdit = () => {
    setForm({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      city: profile?.city || '',
      state: profile?.state || '',
      education: profile?.education || '',
      profession: profile?.profession || '',
      income_range: profile?.income_range || '',
      bio: profile?.bio || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updates = { ...form };
      const res = await updateProfile(updates);
      if (!res.success) {
        Alert.alert('Update Failed', res.error || 'Could not update profile');
        return;
      }
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handlePauseProfile = () => {
    Alert.alert('Pause Profile', 'Are you sure you want to pause your profile?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Pause', onPress: () => console.log('Profile paused') },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => logout() },
    ]);
  };

  if (!profile) {
    return null;
  }

  const completionPercentage = 85;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.background.gradient}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: primaryPhoto }}
            style={styles.profilePhoto}
          />
          <Text style={styles.profileName}>
            {[profile.first_name, profile.last_name].filter(Boolean).join(' ')}
          </Text>
          <Text style={styles.profileDetails}>
            {getAge(profile.dob) || '—'} • {profile.city || '—'}
          </Text>

          <View style={styles.verificationBadge}>
            <Badge
              label={profile.verification_status === 'verified' ? 'Verified' : 'Pending Verification'}
              variant={profile.verification_status === 'verified' ? 'verified' : 'pending'}
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              try {
                await initializeAuth();
              } finally {
                setRefreshing(false);
              }
            }}
          />
        }
      >
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Profile Completion</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>{completionPercentage}% Complete</Text>
        </Card>

        {/* <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Received</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Sent</Text>
            </View>
          </View>
        </Card> */}

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>About</Text>
          {!isEditing ? (
            <>
              <View style={styles.infoRow}>
                <Ionicons name="briefcase-outline" size={20} color={colors.text.secondary} />
                <Text style={styles.infoText}>{profile.profession || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={20} color={colors.text.secondary} />
                <Text style={styles.infoText}>{profile.education || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={20} color={colors.text.secondary} />
                <Text style={styles.infoText}>{profile.income_range || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color={colors.text.secondary} />
                <Text style={styles.infoText}>{[profile.city, profile.state].filter(Boolean).join(', ') || '—'}</Text>
              </View>
              {profile.bio ? (
                <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.text.secondary} />
                  <Text style={styles.infoText}>{profile.bio}</Text>
                </View>
              ) : null}
            </>
          ) : (
            <>
              <Input label="First Name" value={form.first_name} onChangeText={(t) => setForm({ ...form, first_name: t })} style={styles.input} />
              <Input label="Last Name" value={form.last_name} onChangeText={(t) => setForm({ ...form, last_name: t })} style={styles.input} />
              <Input label="City" value={form.city} onChangeText={(t) => setForm({ ...form, city: t })} style={styles.input} />
              <Input label="State" value={form.state} onChangeText={(t) => setForm({ ...form, state: t })} style={styles.input} />
              <Input label="Education" value={form.education} onChangeText={(t) => setForm({ ...form, education: t })} style={styles.input} />
              <Input label="Profession" value={form.profession} onChangeText={(t) => setForm({ ...form, profession: t })} style={styles.input} />
              <Input label="Income Range" value={form.income_range} onChangeText={(t) => setForm({ ...form, income_range: t })} style={styles.input} />
              <Input label="Bio" value={form.bio} onChangeText={(t) => setForm({ ...form, bio: t })} style={styles.input} multiline />
            </>
          )}
        </Card>

        <Card style={styles.actionCard}>
          {!isEditing ? (
            <TouchableOpacity style={styles.actionItem} onPress={startEdit}>
              <Ionicons name="create-outline" size={24} color={colors.primary.main} />
              <Text style={styles.actionText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={24} color={colors.text.light} />
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', padding: spacing.md, gap: spacing.md }}>
              <Button title="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => setIsEditing(false)} />
              <Button title="Save" style={{ flex: 1 }} onPress={handleSave} loading={saving} />
            </View>
          )}

          <View style={styles.divider} />

          {/* <TouchableOpacity style={styles.actionItem} onPress={handlePauseProfile}>
            <Ionicons name="pause-circle-outline" size={24} color={colors.status.warning} />
            <Text style={styles.actionText}>Pause Profile</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.light} />
          </TouchableOpacity> */}

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.text.secondary} />
            <Text style={styles.actionText}>Logout</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.light} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionItem} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={24} color={colors.status.error} />
            <Text style={[styles.actionText, styles.deleteText]}>Delete Account</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.light} />
          </TouchableOpacity>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  header: {
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    borderWidth: 4,
    borderColor: colors.background.white,
    marginBottom: spacing.md,
  },
  profileName: {
    ...typography.h2,
    color: colors.text.white,
    marginBottom: spacing.xs,
  },
  profileDetails: {
    ...typography.body1,
    color: colors.text.white,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  verificationBadge: {
    marginTop: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  statsCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
  },
  progressText: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
    gap: spacing.md,
  },
  infoText: {
    ...typography.body1,
    color: colors.text.primary,
  },
  input: {
    marginBottom: spacing.sm,
  },
  actionCard: {
    marginBottom: spacing.md,
    padding: 0,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  actionText: {
    ...typography.body1,
    color: colors.text.primary,
    flex: 1,
  },
  deleteText: {
    color: colors.status.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    ...typography.caption,
    color: colors.text.light,
  },
});
