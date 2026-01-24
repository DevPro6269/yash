import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';
import { profileService } from '../../services';

export const IdentityStep = ({ navigation }) => {
  const { wizardData, setWizardData } = useStore();
  const [profileFor, setProfileFor] = useState(wizardData.identity.profileFor || '');
  const [gender, setGender] = useState(wizardData.identity.gender || '');
  const [community, setCommunity] = useState(wizardData.identity.community || null);
  const [caste, setCaste] = useState(wizardData.identity.caste || null);
  
  const [communities, setCommunities] = useState([]);
  const [castes, setCastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profileForOptions = ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend', 'Relative'];
  const genderOptions = ['male', 'female'];

  useEffect(() => {
    loadCommunities();
  }, []);

  useEffect(() => {
    if (community) {
      loadCastes(community.id);
    } else {
      setCastes([]);
    }
  }, [community]);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      console.log('Loading communities...');
      const result = await profileService.getCommunities();
      console.log('Communities result:', result);
      if (result.success) {
        console.log('Communities loaded:', result.data);
        setCommunities(result.data);
      } else {
        console.error('Failed to load communities:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('Exception loading communities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCastes = async (communityId) => {
    try {
      const result = await profileService.getCastesByCommunity(communityId);
      if (result.success) {
        setCastes(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNext = () => {
    setWizardData('identity', { 
      profileFor,
      gender,
      community: community.id,
      communityName: community.name,
      caste: caste.id,
      casteName: caste.name,
    });
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

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.secondary.gold} />
            <Text style={styles.loadingText}>Loading communities...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <Button title="Retry" onPress={loadCommunities} style={styles.retryButton} />
          </View>
        ) : (
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

            <Text style={styles.label}>Gender</Text>
            <View style={styles.optionsGrid}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    gender === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => setGender(option)}
                >
                  <Text style={[
                    styles.optionText,
                    gender === option && styles.optionTextSelected,
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Community</Text>
            <View style={styles.optionsGrid}>
              {communities.map((comm) => (
                <TouchableOpacity
                  key={comm.id}
                  style={[
                    styles.optionButton,
                    community?.id === comm.id && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setCommunity(comm);
                    setCaste(null);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    community?.id === comm.id && styles.optionTextSelected,
                  ]}>
                    {comm.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {community && (
              <>
                <Text style={styles.label}>Caste</Text>
                <View style={styles.optionsGrid}>
                  {castes.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      style={[
                        styles.optionButton,
                        caste?.id === c.id && styles.optionButtonSelected,
                      ]}
                      onPress={() => setCaste(c)}
                    >
                      <Text style={[
                        styles.optionText,
                        caste?.id === c.id && styles.optionTextSelected,
                      ]}>
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        <Button
          title="Next"
          onPress={handleNext}
          disabled={!profileFor || !gender || !community || !caste}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  loadingText: {
    ...typography.body1,
    color: colors.text.white,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  errorText: {
    ...typography.body1,
    color: colors.text.white,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 120,
  },
});
