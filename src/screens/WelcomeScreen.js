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
    // TODO: Navigate to login screen when implemented
    console.log('Login pressed');
  };

  return (
    <LinearGradient
      colors={colors.background.gradient}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="heart-circle" size={100} color={colors.secondary.gold} />
          </View>
          <Text style={styles.appName}>Matrimony App</Text>
          <Text style={styles.tagline}>Find Your Perfect Life Partner</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Create New Profile"
            onPress={handleCreateProfile}
            style={styles.createButton}
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
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl * 2,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  appName: {
    ...typography.h1,
    fontSize: 32,
    color: colors.text.white,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.body1,
    color: colors.text.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: spacing.md,
  },
  createButton: {
    marginBottom: spacing.sm,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  loginButtonText: {
    ...typography.body1,
    color: colors.text.white,
    fontWeight: '500',
  },
  footer: {
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.body2,
    color: colors.text.white,
    opacity: 0.9,
  },
});
