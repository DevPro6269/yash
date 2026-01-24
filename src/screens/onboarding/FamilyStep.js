import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../../components';
import { colors, typography, spacing } from '../../theme';
import { useStore } from '../../store/useStore';

export const FamilyStep = ({ navigation }) => {
  const { wizardData, setWizardData } = useStore();
  const [fatherName, setFatherName] = useState(wizardData.family.fatherName || '');
  const [fatherOccupation, setFatherOccupation] = useState(wizardData.family.fatherOccupation || '');
  const [motherName, setMotherName] = useState(wizardData.family.motherName || '');
  const [motherOccupation, setMotherOccupation] = useState(wizardData.family.motherOccupation || '');

  const handleNext = () => {
    setWizardData('family', { fatherName, fatherOccupation, motherName, motherOccupation });
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
          <Input
            label="Father's Name"
            value={fatherName}
            onChangeText={setFatherName}
            placeholder="Enter father's name"
            style={styles.input}
          />

          <Input
            label="Father's Occupation"
            value={fatherOccupation}
            onChangeText={setFatherOccupation}
            placeholder="Enter father's occupation"
            style={styles.input}
          />

          <Input
            label="Mother's Name"
            value={motherName}
            onChangeText={setMotherName}
            placeholder="Enter mother's name"
            style={styles.input}
          />

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
            disabled={!fatherName || !fatherOccupation || !motherName || !motherOccupation}
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
