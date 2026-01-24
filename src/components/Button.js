import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../theme';

const gradientStart = { x: 0, y: 0 };
const gradientEnd = { x: 1, y: 1 };

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
  const getButtonContent = () => {
    if (variant === 'primary') {
      return (
        <LinearGradient
          colors={colors.background.gradient}
          start={gradientStart}
          end={gradientEnd}
          style={[
            styles.button,
            styles[size],
            isDisabled && styles.disabled,
            style,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.white} />
          ) : (
            <Text style={[styles.text, styles.primaryText, textStyle]}>
              {title}
            </Text>
          )}
        </LinearGradient>
      );
    }

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
        activeOpacity={0.7}
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

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled || isLoading}
        activeOpacity={0.8}
      >
        {getButtonContent()}
      </TouchableOpacity>
    );
  }

  return getButtonContent();
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  primary: {
    backgroundColor: colors.primary.main,
  },
  secondary: {
    backgroundColor: colors.secondary.gold,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
    color: colors.text.white,
  },
  primaryText: {
    color: colors.text.white,
  },
  secondaryText: {
    color: colors.text.primary,
  },
  outlineText: {
    color: colors.primary.main,
  },
});
