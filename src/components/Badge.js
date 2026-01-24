import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

export const Badge = ({ label, variant = 'verified', size = 'medium', style }) => {
  return (
    <View style={[
      styles.badge,
      styles[variant],
      styles[`${size}Badge`],
      style,
    ]}>
      <Text style={[
        styles.text,
        styles[`${size}Text`],
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  mediumBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  largeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  verified: {
    backgroundColor: colors.badge.verified,
  },
  pending: {
    backgroundColor: colors.badge.pending,
  },
  rejected: {
    backgroundColor: colors.badge.rejected,
  },
  text: {
    ...typography.caption,
    color: colors.text.white,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});
