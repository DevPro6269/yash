import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../../components';
import { colors, typography, spacing } from '../../theme';
import { useStore } from '../../store/useStore';

export const AuthScreen = ({ navigation }) => {
  const { setUser, wizardData } = useStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }
    setOtpSent(true);
    Alert.alert('OTP Sent', `OTP sent to ${phone}`);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }
    
    const userData = {
      id: Date.now().toString(),
      phone,
      ...wizardData.identity,
      ...wizardData.basic,
      ...wizardData.about,
      ...wizardData.family,
      ...wizardData.address,
      ...wizardData.photos,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    
    setUser(userData);
    navigation.replace('MainTabs');
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
            {otpSent ? 'Verify OTP' : 'Phone Verification'}
          </Text>
          <Text style={styles.subtitle}>
            {otpSent 
              ? `Enter the OTP sent to ${phone}`
              : 'Enter your phone number to continue'
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
            <Input
              label="OTP"
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter 6-digit OTP"
              keyboardType="number-pad"
              style={styles.input}
            />
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
            title={otpSent ? 'Verify & Continue' : 'Send OTP'}
            onPress={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={otpSent ? otp.length !== 6 : phone.length !== 10}
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
