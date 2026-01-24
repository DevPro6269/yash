import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';
import { indianStates } from '../../data/mockData';

export const AddressStep = ({ navigation }) => {
  const { wizardData, setWizardData } = useStore();
  const [state, setState] = useState(wizardData.address.state || '');
  const [city, setCity] = useState(wizardData.address.city || '');
  const [address, setAddress] = useState(wizardData.address.address || '');
  const [showStates, setShowStates] = useState(false);

  const handleNext = () => {
    setWizardData('address', { state, city, address });
    navigation.navigate('PhotosStep');
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
          <Text style={styles.title}>Address</Text>
          <Text style={styles.subtitle}>Step 5 of 6</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>State</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowStates(!showStates)}
          >
            <Text style={styles.dropdownText}>
              {state || 'Select State'}
            </Text>
          </TouchableOpacity>

          {showStates && (
            <View style={styles.optionsGrid}>
              {indianStates.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.optionButton,
                    state === s && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setState(s);
                    setShowStates(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    state === s && styles.optionTextSelected,
                  ]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Input
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="Enter city"
            style={styles.input}
          />

          <Input
            label="Residential Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            multiline={true}
            numberOfLines={3}
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
            disabled={!state || !city || !address}
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
  },
  dropdown: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  dropdownText: {
    ...typography.body1,
    color: colors.text.primary,
  },
  input: {
    marginBottom: spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
    maxHeight: 300,
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
