import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../../components';
import { colors, typography, spacing } from '../../theme';
import { useStore } from '../../store/useStore';

export const BasicStep = ({ navigation }) => {
  const { wizardData, setWizardData } = useStore();
  const [firstName, setFirstName] = useState(wizardData.basic.firstName || '');
  const [lastName, setLastName] = useState(wizardData.basic.lastName || '');
  const [dob, setDob] = useState(wizardData.basic.dob || '');
  const [height, setHeight] = useState(wizardData.basic.height || '');

  const handleNext = () => {
    setWizardData('basic', { firstName, lastName, dob, height });
    navigation.navigate('AboutStep');
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
          <Text style={styles.title}>Basic Information</Text>
          <Text style={styles.subtitle}>Step 2 of 6</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            style={styles.input}
          />

          <Input
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
            style={styles.input}
          />

          <Input
            label="Date of Birth"
            value={dob}
            onChangeText={setDob}
            placeholder="DD/MM/YYYY"
            style={styles.input}
          />

          <Input
            label="Height"
            value={height}
            onChangeText={setHeight}
            placeholder="e.g., 5'6 inches"
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
            disabled={!firstName || !lastName || !dob || !height}
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
