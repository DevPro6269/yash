import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const isDisabled = Boolean(disabled);
  const isLoading = Boolean(loading);
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary.main : colors.text.white} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'outline' && styles.outlineText,
          variant === 'secondary' && styles.secondaryText,
          textStyle,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
    shadowColor: colors.primary.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  small: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    minHeight: 40,
  },
  medium: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    minHeight: 50,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl + spacing.md,
    minHeight: 56,
  },
  primary: {
    backgroundColor: colors.primary.main,
  },
  secondary: {
    backgroundColor: colors.secondary.amber,
    shadowColor: colors.secondary.amber,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary.main,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    ...typography.button,
    color: colors.text.white,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.text.white,
    fontWeight: '600',
  },
  secondaryText: {
    color: colors.text.white,
    fontWeight: '600',
  },
  outlineText: {
    color: colors.primary.main,
    fontWeight: '600',
  },
});
