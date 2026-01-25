import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input, Dropdown } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';
import { profileService } from '../../services';

export const IdentityStep = ({ navigation }) => {
  const { wizardData, setWizardData } = useStore();
  const [profileFor, setProfileFor] = useState(wizardData.identity.profileFor || 'Self');
  const [gender, setGender] = useState(wizardData.identity.gender || '');
  const [community, setCommunity] = useState(wizardData.identity.community || null);
  const [caste, setCaste] = useState(wizardData.identity.caste || null);
  const [gotra, setGotra] = useState(wizardData.identity.gotra || '');
  
  const [communities, setCommunities] = useState([]);
  const [castes, setCastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profileForOptions = [
    { id: 'Self', name: 'Self' },
    { id: 'Son', name: 'Son' },
    { id: 'Daughter', name: 'Daughter' },
    { id: 'Brother', name: 'Brother' },
    { id: 'Sister', name: 'Sister' },
    { id: 'Relative', name: 'Relative' },
  ];
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
      gotra,
    });
    navigation.navigate('BasicStep');
  };

  return (
    <LinearGradient
      colors={colors.background.gradient}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
            <View style={styles.section}>
              <Dropdown
                label="Profile is being created for"
                placeholder="Select who this profile is for"
                value={profileFor}
                options={profileForOptions}
                searchable
                searchPlaceholder="Search..."
                onSelect={(selected) => setProfileFor(selected.id)}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Gender</Text>
              <View style={styles.genderGrid}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.genderButton,
                      gender === option && styles.genderButtonSelected,
                    ]}
                    onPress={() => setGender(option)}
                  >
                    <Text style={[
                      styles.genderText,
                      gender === option && styles.genderTextSelected,
                    ]}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Dropdown
                label="Community"
                placeholder="Select Community"
                value={community?.id}
                options={communities}
                searchable
                searchPlaceholder="Search community..."
                onSelect={(selected) => {
                  setCommunity(selected);
                  setCaste(null);
                }}
              />
            </View>

            {community && (
              <>
                <View style={styles.section}>
                  <Dropdown
                    label="Caste"
                    placeholder="Select Caste"
                    value={caste?.id}
                    options={castes}
                    searchable
                    searchPlaceholder="Search caste..."
                    onSelect={(selected) => setCaste(selected)}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Gotra</Text>
                  <Input
                    value={gotra}
                    onChangeText={setGotra}
                    placeholder="Enter your gotra"
                  />
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={!profileFor || !gender || !community || !caste || !gotra}
        />
      </View>
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
    padding: spacing.xl,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.xxl,
    marginTop: spacing.lg,
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
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.h4,
    color: colors.text.white,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  genderGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  genderButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: colors.secondary.cream,
    borderColor: colors.secondary.gold,
  },
  genderText: {
    ...typography.h4,
    color: colors.text.white,
    fontWeight: '500',
  },
  genderTextSelected: {
    color: colors.primary.dark,
    fontWeight: '700',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    paddingBottom: spacing.xl + 20,
    backgroundColor: 'transparent',
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
