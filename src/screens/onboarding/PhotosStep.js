import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useStore } from '../../store/useStore';

export const PhotosStep = ({ navigation }) => {
  const { wizardData, setWizardData } = useStore();
  const [photo, setPhoto] = useState(wizardData.photos.photo || null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    setWizardData('photos', { photo });
    navigation.navigate('AuthScreen');
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
          <Text style={styles.title}>Add Your Photo *</Text>
          <Text style={styles.subtitle}>Step 6 of 6 • Required</Text>
        </View>

        <View style={styles.photoContainer}>
          {photo ? (
            <TouchableOpacity onPress={pickImage} style={styles.photoWrapper}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <View style={styles.editOverlay}>
                <Ionicons name="camera" size={32} color={colors.text.white} />
                <Text style={styles.editText}>Change Photo</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
              <Ionicons name="camera" size={48} color={colors.text.white} />
              <Text style={styles.uploadText}>Upload Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Photo Tips:</Text>
          <Text style={styles.tipText}>• Use a clear, recent photo</Text>
          <Text style={styles.tipText}>• Face should be clearly visible</Text>
          <Text style={styles.tipText}>• Avoid group photos</Text>
          <Text style={styles.tipText}>• Professional or casual attire</Text>
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
            disabled={!photo}
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
  photoContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 150,
    height: 100,
    borderRadius: borderRadius.lg,
    borderWidth: 4,
    borderColor: colors.background.white,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: spacing.md,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    alignItems: 'center',
  },
  editText: {
    ...typography.body2,
    color: colors.text.white,
    marginTop: spacing.xs,
  },
  uploadButton: {
    width: 250,
    height: 333,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.background.white,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    ...typography.h4,
    color: colors.text.white,
    marginTop: spacing.md,
  },
  tips: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  tipsTitle: {
    ...typography.h4,
    color: colors.text.white,
    marginBottom: spacing.sm,
  },
  tipText: {
    ...typography.body2,
    color: colors.text.white,
    marginVertical: spacing.xs,
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
