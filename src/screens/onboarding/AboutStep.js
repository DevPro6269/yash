import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input, Dropdown } from '../../components';
import { highestEducationOptions, professionOptions, incomeRanges } from '../../const/aboutOptions';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';

// Static option arrays moved to '../../cont/aboutOptions'

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
          <Dropdown
            label="Highest Education"
            placeholder="Select education"
            value={education}
            options={highestEducationOptions}
            searchable
            searchPlaceholder="Search education..."
            onSelect={(selected) => setEducation(selected.id)}
          />

          <Dropdown
            label="Profession"
            placeholder="Select profession"
            value={profession}
            options={professionOptions}
            searchable
            searchPlaceholder="Search profession..."
            onSelect={(selected) => setProfession(selected.id)}
          />

          <Dropdown
            label="Income Range (Yearly Or Annualy)"
            placeholder="Select income range"
            value={income}
            options={incomeRanges}
            searchable
            searchPlaceholder="Search income range..."
            onSelect={(selected) => setIncome(selected.id)}
          />

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
  
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  backButton: {
    flex: 1,
    backgroundColor: colors.background.white
  },
  nextButton: {
    flex: 2,
  },
});
