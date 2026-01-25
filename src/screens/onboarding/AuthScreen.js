import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../../components';
import { colors, typography, spacing } from '../../theme';
import { useStore } from '../../store/useStore';
import { profileService } from '../../services';
import { supabase } from '../../config/supabase';

const STATIC_OTP = '123456'; // Development OTP - remove in production

export const AuthScreen = ({ navigation }) => {
  const { setUser, wizardData } = useStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }
    setOtpSent(true);
    // Development mode - show static OTP
    Alert.alert(
      'OTP Sent (Dev Mode)', 
      `Development OTP: ${STATIC_OTP}\n\nIn production, this will be sent via SMS.`,
      [{ text: 'OK' }]
    );
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    // Verify static OTP in development
    if (otp !== STATIC_OTP) {
      Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Checking if user exists with phone:', phone);
      
      // Step 1: Check if user already exists with this phone number
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', phone)
        .single();

      let userData;

      if (existingUser) {
        console.log('User already exists with ID:', existingUser.id);
        
        // Check if this user already has a profile
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', existingUser.id)
          .single();

        if (existingProfile) {
          // Profile already exists - show error
          Alert.alert(
            'Profile Already Exists',
            'A profile with this phone number already exists. Please use a different phone number or login to your existing account.',
            [{ text: 'OK' }]
          );
          return;
        }

        // User exists but no profile - use existing user
        userData = existingUser;
        console.log('Using existing user, creating new profile');
      } else {
        // No user exists - create new user
        console.log('Creating new user with phone:', phone);
        
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            phone_number: phone,
            role: 'user',
            account_status: 'active',
          })
          .select()
          .single();

        if (userError) {
          console.error('User creation error:', userError);
          throw new Error(userError.message);
        }

        userData = newUser;
        console.log('User created with ID:', userData.id);
      }
      
      // Step 2: Create profile in database
      const profileData = {
        // Identity
        gender: wizardData.identity.gender,
        community_id: wizardData.identity.community,
        caste_id: wizardData.identity.caste,
        gotra: wizardData.identity.gotra || null,
        managed_by: wizardData.identity.profileFor?.toLowerCase() === 'self' ? 'self' : 
                    wizardData.identity.profileFor?.toLowerCase() === 'son' || wizardData.identity.profileFor?.toLowerCase() === 'daughter' ? 'parent' :
                    wizardData.identity.profileFor?.toLowerCase() === 'brother' || wizardData.identity.profileFor?.toLowerCase() === 'sister' ? 'sibling' : 'relative',
        
        // Basic Info
        first_name: wizardData.basic.firstName,
        last_name: wizardData.basic.lastName,
        dob: wizardData.basic.dob,
        marital_status: 'never_married', // Default value, can be added to form later
        // Note: height_cm expects integer, but we have "4'8\"" format - skip for now
        
        // Professional
        education: wizardData.about.education,
        profession: wizardData.about.profession,
        income_range: wizardData.about.income,
        bio: wizardData.about.bio,
        
        // Family
        father_name: wizardData.family.fatherName,
        father_occupation: wizardData.family.fatherOccupation || null,
        mother_name: wizardData.family.motherName,
        mother_occupation: wizardData.family.motherOccupation || null,
        siblings_count: wizardData.family.siblings || 0,
        
        // Location
        city: wizardData.address.city,
        state: wizardData.address.state,
        country: wizardData.address.country || 'India',
      };

      console.log('Creating profile with data:', profileData);

      const profileResult = await profileService.createProfile(userData.id, profileData);

      if (!profileResult.success) {
        throw new Error(profileResult.error || 'Failed to create profile');
      }

      console.log('Profile created successfully:', profileResult.data);

      // Step 3: Upload profile photo to Supabase Storage
      if (wizardData.photos.photo) {
        try {
          console.log('Uploading profile photo to storage...');
          
          // Read the file from local URI
          const response = await fetch(wizardData.photos.photo);
          const blob = await response.blob();
          const arrayBuffer = await new Response(blob).arrayBuffer();
          
          // Generate unique filename
          const fileExt = wizardData.photos.photo.split('.').pop();
          const fileName = `${profileResult.data.id}_${Date.now()}.${fileExt}`;
          const filePath = `${profileResult.data.id}/${fileName}`;
          
          // Upload to Supabase Storage bucket 'profile-photos'
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile-photos')
            .upload(filePath, arrayBuffer, {
              contentType: `image/${fileExt}`,
              upsert: false,
            });

          if (uploadError) {
            console.error('Storage upload error:', uploadError);
            throw uploadError;
          }

          console.log('Photo uploaded to storage:', uploadData.path);

          // Get public URL for the uploaded photo
          const { data: urlData } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(filePath);

          const publicUrl = urlData.publicUrl;
          console.log('Public URL:', publicUrl);

          // Save photo URL to profile_photos table
          const { data: photoData, error: photoError } = await supabase
            .from('profile_photos')
            .insert({
              profile_id: profileResult.data.id,
              image_url: publicUrl,
              storage_path: filePath,
              is_primary: true,
              is_private: false,
            })
            .select()
            .single();

          if (photoError) {
            console.error('Photo database insert error:', photoError);
            // Don't fail profile creation if photo DB insert fails
          } else {
            console.log('Profile photo saved to database successfully');
          }
        } catch (photoErr) {
          console.error('Photo upload exception:', photoErr);
          // Don't fail profile creation if photo upload fails
        }
      }

      // Update local store with user data
      const localUserData = {
        id: userData.id,
        profileId: profileResult.data.id,
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
      
      setUser(localUserData);
      
      Alert.alert(
        'Success!', 
        'Your profile has been created successfully.',
        [{ text: 'OK' }]
      );
      
      // Navigation will happen automatically via AppNavigator when isAuthenticated becomes true
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create profile. Please try again.');
      console.error('Profile creation error:', error);
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
            title={otpSent ? 'Verify OTP' : 'Send OTP'}
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
