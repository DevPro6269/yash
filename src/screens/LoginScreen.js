import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';
import { supabase } from '../config/supabase';

export const LoginScreen = ({ navigation }) => {
  const { sendOTP, verifyOTP } = useStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ensure only digits are stored and cap at 10 characters
  const handlePhoneChange = (text) => {
    const digitsOnly = text.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  // Ensure OTP is numeric and max 6 digits
  const handleOtpChange = (text) => {
    const digitsOnly = text.replace(/\D/g, '').slice(0, 6);
    setOtp(digitsOnly);
  };

  const formatPhone = (raw) => `+91${raw}`; // Adjust if you support multiple countries

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // Note: With new schema, we can't pre-check if profile exists by phone
      // since auth.users stores phone and profiles.id = auth.uid()
      // Just send OTP and let the auth flow handle it
      const result = await sendOTP(formatPhone(phone));
      if (result.success) {
        setOtpSent(true);
        Alert.alert('OTP Sent', 'We have sent an OTP to your phone number.', [{ text: 'OK' }]);
      } else {
        Alert.alert('Failed to send OTP', result.error || 'Please try again.');
      }
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

    setLoading(true);

    try {
      const result = await verifyOTP(formatPhone(phone), otp);
      if (result.success) {
        Alert.alert('Login Successful!', 'Welcome back!', [{ text: 'OK' }]);
        // Navigation will happen automatically via AppNavigator from store state
      } else {
        Alert.alert('Invalid OTP', result.error || 'The OTP you entered is incorrect. Please try again.');
      }
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
              onChangeText={handlePhoneChange}
              placeholder="Enter 10-digit phone number"
              keyboardType="phone-pad"
              style={styles.input}
            />
          ) : (
            <>
              <Input
                label="OTP"
                value={otp}
                onChangeText={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                keyboardType="number-pad"
                style={styles.input}
              />
              
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
    backgroundColor: colors.background.white,
  },
  nextButton: {
    flex: 2,
  },
  resendButton: {
    marginTop: spacing.md,
  },
});
