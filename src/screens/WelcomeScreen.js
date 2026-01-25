import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';

export const WelcomeScreen = ({ navigation }) => {
  const handleCreateProfile = () => {
    navigation.navigate('Onboarding');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient colors={colors.background.gradient} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroIconWrap}>
          <View style={styles.heroIconBg}>
            <Ionicons name="heart" size={56} color={colors.text.white} />
          </View>
          <View style={styles.ring} />
          <View style={[styles.ring, styles.ring2]} />
        </View>
        <Text style={styles.title}>Find your life partner</Text>
        <Text style={styles.subtitle}>Serious matchmaking built for trust, privacy and families.</Text>
      </View>

      {/* Primary CTA Card */}
      <View style={styles.card}>
        <View style={styles.points}>
          <View style={styles.pointRow}>
            <Ionicons name="shield-checkmark" size={18} color={colors.secondary.gold} />
            <Text style={styles.pointText}>Verified profiles and secure onboarding</Text>
          </View>
          <View style={styles.pointRow}>
            <Ionicons name="people" size={18} color={colors.secondary.gold} />
            <Text style={styles.pointText}>Matches by community, values and interests</Text>
          </View>
          <View style={styles.pointRow}>
            <Ionicons name="chatbubbles" size={18} color={colors.secondary.gold} />
            <Text style={styles.pointText}>Private chat once there’s a mutual interest</Text>
          </View>
        </View>

        <Button
          title="Create your profile"
          onPress={handleCreateProfile}
          style={styles.primaryCta}
          textStyle={styles.primaryCtaText}
        />

        <TouchableOpacity style={styles.secondaryLink} onPress={handleLogin}>
          <Text style={styles.secondaryLinkText}>Already have an account?</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.text.white} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xxl * 1.2,
    paddingHorizontal: spacing.lg,
  },
  heroIconWrap: {
    marginBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  ring2: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  title: {
    ...typography.h1,
    color: colors.text.white,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  subtitle: {
    ...typography.body1,
    color: colors.text.white,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 340,
  },
  card: {
    marginTop: spacing.xxl,
    marginHorizontal: spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  points: {
    gap: spacing.sm,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pointText: {
    ...typography.body1,
    color: colors.text.white,
    opacity: 0.95,
  },
  primaryCta: {
    backgroundColor: colors.text.white,
    shadowColor: colors.text.white,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryCtaText: {
    color: colors.primary.main,
    fontWeight: '700',
  },
  secondaryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  secondaryLinkText: {
    ...typography.body1,
    color: colors.text.white,
    opacity: 0.9,
  },
  badgesWrap: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  badgeText: {
    ...typography.body2,
    color: colors.text.white,
    opacity: 0.95,
  },
});
