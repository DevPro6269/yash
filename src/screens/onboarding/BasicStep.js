import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Input } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';

const heightOptions = [
  "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"", "6'7\"", "6'8\"",
];

export const BasicStep = ({ navigation }) => {
  const { wizardData, setWizardData } = useStore();
  const [firstName, setFirstName] = useState(wizardData.basic.firstName || '');
  const [lastName, setLastName] = useState(wizardData.basic.lastName || '');
  const [dob, setDob] = useState(wizardData.basic.dob ? new Date(wizardData.basic.dob) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [height, setHeight] = useState(wizardData.basic.height || '');

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleNext = () => {
    const dobString = dob ? dob.toISOString().split('T')[0] : '';
    setWizardData('basic', { firstName, lastName, dob: dobString, height });
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

          <View style={styles.input}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.datePickerText, !dob && styles.placeholderText]}>
                {dob ? formatDate(dob) : 'Select date of birth'}
              </Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dob || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1950, 0, 1)}
              />
            )}
          </View>

          <View style={styles.input}>
            <Text style={styles.label}>Height</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.heightScroll}
              contentContainerStyle={styles.heightScrollContent}
            >
              {heightOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.heightOption,
                    height === option && styles.heightOptionSelected,
                  ]}
                  onPress={() => setHeight(option)}
                >
                  <Text style={[
                    styles.heightOptionText,
                    height === option && styles.heightOptionTextSelected,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
  label: {
    ...typography.label,
    color: colors.text.white,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  datePickerButton: {
    backgroundColor: colors.background.white,
    borderWidth: 1.5,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerText: {
    ...typography.input,
    color: colors.text.primary,
  },
  placeholderText: {
    color: colors.text.tertiary,
  },
  calendarIcon: {
    fontSize: 20,
  },
  heightScroll: {
    marginTop: spacing.xs,
  },
  heightScrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  heightOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 70,
    alignItems: 'center',
  },
  heightOptionSelected: {
    backgroundColor: colors.background.white,
    borderColor: colors.primary.main,
  },
  heightOptionText: {
    ...typography.body2,
    color: colors.text.white,
    fontWeight: '500',
  },
  heightOptionTextSelected: {
    color: colors.primary.main,
    fontWeight: '700',
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
