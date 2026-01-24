import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';
import { communities, castes } from '../../data/mockData';

export const IdentityStep = ({ navigation }) => {
  const { wizardData, setWizardData } = useStore();
  const [profileFor, setProfileFor] = useState(wizardData.identity.profileFor || '');
  const [community, setCommunity] = useState(wizardData.identity.community || '');
  const [caste, setCaste] = useState(wizardData.identity.caste || '');

  const profileForOptions = ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend', 'Relative'];

  const handleNext = () => {
    setWizardData('identity', { profileFor, community, caste });
    navigation.navigate('BasicStep');
  };

  return (
    <LinearGradient
      colors={colors.background.gradient}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Let's Get Started</Text>
          <Text style={styles.subtitle}>Step 1 of 6</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Profile is being created for</Text>
          <View style={styles.optionsGrid}>
            {profileForOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  profileFor === option && styles.optionButtonSelected,
                ]}
                onPress={() => setProfileFor(option)}
              >
                <Text style={[
                  styles.optionText,
                  profileFor === option && styles.optionTextSelected,
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Community</Text>
          <View style={styles.optionsGrid}>
            {communities.map((comm) => (
              <TouchableOpacity
                key={comm}
                style={[
                  styles.optionButton,
                  community === comm && styles.optionButtonSelected,
                ]}
                onPress={() => {
                  setCommunity(comm);
                  setCaste('');
                }}
              >
                <Text style={[
                  styles.optionText,
                  community === comm && styles.optionTextSelected,
                ]}>
                  {comm}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {community && (
            <>
              <Text style={styles.label}>Caste</Text>
              <View style={styles.optionsGrid}>
                {castes[community]?.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.optionButton,
                      caste === c && styles.optionButtonSelected,
                    ]}
                    onPress={() => setCaste(c)}
                  >
                    <Text style={[
                      styles.optionText,
                      caste === c && styles.optionTextSelected,
                    ]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        <Button
          title="Next"
          onPress={handleNext}
          disabled={!profileFor || !community || !caste}
          style={styles.button}
        />
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
  button: {
    marginTop: spacing.lg,
  },
});
