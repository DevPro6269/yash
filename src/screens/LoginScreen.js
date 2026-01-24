import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';
import { supabase } from '../config/supabase';

const STATIC_OTP = '123456'; // Development OTP

export const LoginScreen = ({ navigation }) => {
  const { setUser } = useStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // Check if user exists with this phone number
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', phone)
        .single();

      if (!existingUser) {
        Alert.alert(
          'Account Not Found',
          'No account exists with this phone number. Please create a new profile.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Check if user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', existingUser.id)
        .single();

      if (!profile) {
        Alert.alert(
          'Profile Not Found',
          'Your account exists but has no profile. Please complete your profile setup.',
          [{ text: 'OK' }]
        );
        return;
      }

      setOtpSent(true);
      Alert.alert(
        'OTP Sent (Dev Mode)',
        `Development OTP: ${STATIC_OTP}\n\nIn production, this will be sent via SMS.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Login check error:', error);
      Alert.alert('Error', 'Failed to verify phone number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    if (otp !== STATIC_OTP) {
      Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
      return;
    }

    setLoading(true);

    try {
      console.log('Logging in user with phone:', phone);

      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', phone)
        .single();

      if (userError || !userData) {
        throw new Error('User not found');
      }

      // Get profile data with related data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          community:communities(id, name),
          caste:castes(id, name)
        `)
        .eq('user_id', userData.id)
        .single();

      if (profileError || !profileData) {
        throw new Error('Profile not found');
      }

      console.log('User logged in successfully:', userData.id);

      // Update last login
      await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userData.id);

      // Set user in store
      const localUserData = {
        id: userData.id,
        profileId: profileData.id,
        phone: userData.phone_number,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        gender: profileData.gender,
        dob: profileData.dob,
        education: profileData.education,
        profession: profileData.profession,
        income: profileData.income_range,
        bio: profileData.bio,
        city: profileData.city,
        state: profileData.state,
        country: profileData.country,
        community: profileData.community,
        caste: profileData.caste,
        verified: profileData.verification_status === 'verified',
        createdAt: userData.created_at,
      };

      setUser(localUserData);

      Alert.alert(
        'Login Successful!',
        'Welcome back!',
        [{ text: 'OK' }]
      );

      // Navigation will happen automatically via AppNavigator
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (otpSent) {
      setOtpSent(false);
      setOtp('');
    } else {
      navigation.goBack();
    }
  };

  return (
    <LinearGradient
      colors={colors.background.gradient}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {otpSent ? 'Verify OTP' : 'Login'}
          </Text>
          <Text style={styles.subtitle}>
            {otpSent
              ? `Enter the OTP sent to ${phone}`
              : 'Enter your phone number to login'
            }
          </Text>
        </View>

        <View style={styles.form}>
          {!otpSent ? (
            <Input
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter 10-digit phone number"
              keyboardType="phone-pad"
              style={styles.input}
            />
          ) : (
            <>
              <Input
                label="OTP"
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter 6-digit OTP"
                keyboardType="number-pad"
                style={styles.input}
              />
              <View style={styles.devHint}>
                <Text style={styles.devHintText}>
                  💡 Dev Mode: Use OTP <Text style={styles.devHintCode}>{STATIC_OTP}</Text>
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={styles.backButton}
          />
          <Button
            title={otpSent ? 'Verify & Login' : 'Send OTP'}
            onPress={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={otpSent ? otp.length !== 6 : phone.length !== 10}
            loading={loading}
            style={styles.nextButton}
          />
        </View>

        {otpSent && (
          <Button
            title="Resend OTP"
            onPress={handleSendOTP}
            variant="outline"
            style={styles.resendButton}
          />
        )}
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
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    marginBottom: spacing.xl,
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
  devHint: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: spacing.md,
    borderRadius: 8,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary.amber,
  },
  devHintText: {
    ...typography.body2,
    color: colors.text.white,
    fontSize: 13,
  },
  devHintCode: {
    fontWeight: '700',
    color: colors.secondary.amber,
    fontSize: 16,
    letterSpacing: 2,
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
  resendButton: {
    marginTop: spacing.md,
  },
});
