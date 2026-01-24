import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';
import { educationLevels, incomeRanges } from '../../data/mockData';

export const AboutStep = ({ navigation }) => {
  const { wizardData, setWizardData } = useStore();
  const [education, setEducation] = useState(wizardData.about.education || '');
  const [profession, setProfession] = useState(wizardData.about.profession || '');
  const [income, setIncome] = useState(wizardData.about.income || '');
  const [bio, setBio] = useState(wizardData.about.bio || '');

  const handleNext = () => {
    setWizardData('about', { education, profession, income, bio });
    navigation.navigate('FamilyStep');
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
          <Text style={styles.title}>About You</Text>
          <Text style={styles.subtitle}>Step 3 of 6</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Education</Text>
          <View style={styles.optionsGrid}>
            {educationLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.optionButton,
                  education === level && styles.optionButtonSelected,
                ]}
                onPress={() => setEducation(level)}
              >
                <Text style={[
                  styles.optionText,
                  education === level && styles.optionTextSelected,
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Profession"
            value={profession}
            onChangeText={setProfession}
            placeholder="e.g., Software Engineer"
            style={styles.input}
          />

          <Text style={styles.label}>Income Range</Text>
          <View style={styles.optionsGrid}>
            {incomeRanges.map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.optionButton,
                  income === range && styles.optionButtonSelected,
                ]}
                onPress={() => setIncome(range)}
              >
                <Text style={[
                  styles.optionText,
                  income === range && styles.optionTextSelected,
                ]}>
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself..."
            multiline={true}
            numberOfLines={4}
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
            disabled={!education || !profession || !income || !bio}
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
  label: {
    ...typography.h4,
    color: colors.text.white,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: colors.background.white,
    borderColor: colors.secondary.gold,
  },
  optionText: {
    ...typography.body2,
    color: colors.text.white,
  },
  optionTextSelected: {
    color: colors.primary.main,
    fontWeight: '600',
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
