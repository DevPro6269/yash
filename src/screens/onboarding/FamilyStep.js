import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input, Dropdown } from '../../components';
import { namePrefixOptions } from '../../const/namePrefixes';
import { colors, typography, spacing } from '../../theme';
import { useStore } from '../../store/useStore';

export const FamilyStep = ({ navigation }) => {
  const { wizardData, setWizardData } = useStore();
  const [fatherName, setFatherName] = useState(wizardData.family.fatherName || '');
  const [fatherPrefix, setFatherPrefix] = useState(wizardData.family.fatherPrefix || 'Mr.');
  const [fatherOccupation, setFatherOccupation] = useState(wizardData.family.fatherOccupation || '');
  const [motherName, setMotherName] = useState(wizardData.family.motherName || '');
  const [motherPrefix, setMotherPrefix] = useState(wizardData.family.motherPrefix || 'Ms.');
  const [motherOccupation, setMotherOccupation] = useState(wizardData.family.motherOccupation || '');

  const handleNext = () => {
    setWizardData('family', { fatherPrefix, fatherName, fatherOccupation, motherPrefix, motherName, motherOccupation });
    navigation.navigate('AddressStep');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={colors.background.gradient}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Family Details</Text>
          <Text style={styles.subtitle}>Step 4 of 6</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.groupLabel}>Father's Name</Text>
          <View style={styles.nameRow}>
            <View style={styles.prefixInline}>
              <Dropdown
                placeholder="Prefix"
                value={fatherPrefix}
                options={namePrefixOptions}
                searchable
                searchPlaceholder="Search prefix..."
                onSelect={(opt) => setFatherPrefix(opt.id)}
                style={styles.prefixDropdown}
                searchPlaceholderStyle={styles.hidden}
              />
            </View>
            <View style={styles.nameInline}>
              <Input
                value={fatherName}
                onChangeText={setFatherName}
                placeholder="Enter father's name"
                style={styles.input}
                inputStyle={styles.nameInput}
              />
            </View>
          </View>

          <Input
            label="Father's Occupation"
            value={fatherOccupation}
            onChangeText={setFatherOccupation}
            placeholder="Enter father's occupation"
            style={styles.input}
          />

          <Text style={styles.groupLabel}>Mother's Name</Text>
          <View style={styles.nameRow}>
            <View style={styles.prefixInline}>
              <Dropdown
                placeholder="Prefix"
                value={motherPrefix}
                options={namePrefixOptions}
                searchable
                searchPlaceholder="Search prefix..."
                onSelect={(opt) => setMotherPrefix(opt.id)}
                style={styles.prefixDropdown}
                searchPlaceholderStyle={styles.hidden}
              />
            </View>
            <View style={styles.nameInline}>
              <Input
                value={motherName}
                onChangeText={setMotherName}
                placeholder="Enter mother's name"
                style={styles.input}
                inputStyle={styles.nameInput}
              />
            </View>
          </View>

          <Input
            label="Mother's Occupation"
            value={motherOccupation}
            onChangeText={setMotherOccupation}
            placeholder="Enter mother's occupation"
            style={styles.input}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={styles.backButton}
          />
          <Button
            title="Next"
            onPress={handleNext}
            disabled={!fatherPrefix || !fatherName || !fatherOccupation || !motherPrefix || !motherName || !motherOccupation}
            style={styles.nextButton}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    color: colors.text.white,
    opacity: 0.8,
  },
  form: {
    marginBottom: spacing.xl,
  },
  groupLabel: {
    ...typography.label,
    color: colors.text.white,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  prefixInline: {
    width: 110,
  },
  prefixDropdown: {
    minHeight: 48,
  },
  nameInline: {
    flex: 1,
  },
  nameInput: {
    paddingVertical: 12,
  },
  hidden: {
    display: 'none',
  },
  input: {
    marginBottom: spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
