import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
    <LinearGradient
      colors={colors.background.gradient}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name="heart-circle" size={80} color={colors.text.white} />
            </View>
          </View>
          <Text style={styles.appName}>Matrimony App</Text>
          <Text style={styles.tagline}>Find Your Perfect Life Partner</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Create New Profile"
            onPress={handleCreateProfile}
            style={styles.createButton}
            textStyle={styles.createButtonText}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Already have an account? Login</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.text.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.featureRow}>
            <Ionicons name="shield-checkmark" size={20} color={colors.secondary.gold} />
            <Text style={styles.featureText}>100% Verified Profiles</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="lock-closed" size={20} color={colors.secondary.gold} />
            <Text style={styles.featureText}>Secure & Private</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="people" size={20} color={colors.secondary.gold} />
            <Text style={styles.featureText}>Trusted by Thousands</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl + spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl * 2,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appName: {
    ...typography.h1,
    fontSize: 34,
    color: colors.text.white,
    marginBottom: spacing.sm,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagline: {
    ...typography.body1,
    fontSize: 17,
    color: colors.text.white,
    opacity: 0.95,
    textAlign: 'center',
    fontWeight: '400',
  },
  buttonContainer: {
    gap: spacing.lg,
  },
  createButton: {
    backgroundColor: colors.text.white,
    shadowColor: colors.text.white,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  createButtonText: {
    color: colors.primary.main,
    fontWeight: '700',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    gap: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loginButtonText: {
    ...typography.body1,
    color: colors.text.white,
    fontWeight: '600',
  },
  footer: {
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  featureText: {
    ...typography.body2,
    fontSize: 15,
    color: colors.text.white,
    opacity: 0.95,
    fontWeight: '500',
  },
});
