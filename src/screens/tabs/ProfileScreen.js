import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge, Button } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';

export const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useStore();

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon');
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

  if (!user) {
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
            source={{ uri: user.photo || 'https://i.pravatar.cc/300' }}
            style={styles.profilePhoto}
          />
          <Text style={styles.profileName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.profileDetails}>
            {user.age || '25'} • {user.city}
          </Text>
          
          <View style={styles.verificationBadge}>
            <Badge
              label={user.verified ? 'Verified' : 'Pending Verification'}
              variant={user.verified ? 'verified' : 'pending'}
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Profile Completion</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>{completionPercentage}% Complete</Text>
        </Card>

        <Card style={styles.statsCard}>
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
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.infoText}>{user.profession}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.infoText}>{user.education}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.infoText}>{user.income}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="resize-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.infoText}>{user.height}</Text>
          </View>
        </Card>

        <Card style={styles.actionCard}>
          <TouchableOpacity style={styles.actionItem} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={24} color={colors.primary.main} />
            <Text style={styles.actionText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.light} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionItem} onPress={handlePauseProfile}>
            <Ionicons name="pause-circle-outline" size={24} color={colors.status.warning} />
            <Text style={styles.actionText}>Pause Profile</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.light} />
          </TouchableOpacity>

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
