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
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body1,
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text.primary,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.status.error,
  },
  disabled: {
    backgroundColor: colors.background.light,
    color: colors.text.light,
  },
  errorText: {
    ...typography.caption,
    color: colors.status.error,
    marginTop: spacing.xs,
  },
});
