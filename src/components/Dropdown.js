import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';
import { colors, typography, spacing, borderRadius } from '../theme';

export const Dropdown = ({ 
  label, 
  placeholder = 'Select an option',
  value, 
  options = [], 
  onSelect,
  style,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search...'
}) => {
  const labelField = options && options.length > 0 && options[0].name !== undefined ? 'name' : 'label';
  const valueField = options && options.length > 0 && options[0].id !== undefined ? 'id' : 'value';

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <RNEDropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        itemTextStyle={styles.itemText}
        activeColor={colors.secondary.cream}
        data={options}
        labelField={labelField}
        valueField={valueField}
        placeholder={placeholder}
        value={value}
        search={!!searchable}
        searchPlaceholder={searchPlaceholder}
        disable={disabled}
        onChange={(item) => onSelect(item)}
        renderRightIcon={() => (
          <Ionicons name="chevron-down" size={18} color={colors.text.white} />
        )}
        renderItem={(item, selected) => (
          <View style={[styles.item, selected && styles.itemSelected]}>
            <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
              {item[labelField]}
            </Text>
            {selected && (
              <Ionicons name="checkmark-circle" size={18} color={colors.primary.light} />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body1,
    color: colors.text.white,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 56,
  },
  dropdownContainer: {
    borderRadius: borderRadius.md,
    borderColor: colors.border.light,
    paddingVertical: spacing.xs,
  },
  placeholderStyle: {
    ...typography.body1,
    color: 'rgba(255,255,255,0.7)',
  },
  selectedTextStyle: {
    ...typography.body1,
    color: colors.text.white,
  },
  inputSearchStyle: {
    ...typography.input,
    height: 40,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.medium,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.white,
  },
  item: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemSelected: {
    backgroundColor: colors.secondary.cream,
  },
  itemText: {
    ...typography.body1,
    color: colors.text.primary,
  },
  itemTextSelected: {
    color: colors.primary.dark,
    fontWeight: '600',
  },
});
