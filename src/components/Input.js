import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  secureTextEntry = false,
  editable = true,
  style,
  inputStyle,
}) => {
  const isMultiline = Boolean(multiline);
  const isSecure = Boolean(secureTextEntry);
  const isEditable = Boolean(editable);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isMultiline && styles.multiline,
          error && styles.inputError,
          !isEditable && styles.disabled,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.light}
        multiline={isMultiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        secureTextEntry={isSecure}
        editable={isEditable}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  input: {
    ...typography.input,
    backgroundColor: colors.background.white,
    borderWidth: 1.5,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    color: colors.text.primary,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  inputError: {
    borderColor: colors.status.error,
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: colors.background.lighter,
    color: colors.text.tertiary,
    borderColor: colors.border.light,
  },
  errorText: {
    ...typography.caption,
    color: colors.status.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
