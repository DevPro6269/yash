import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useStore } from '../store/useStore';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'heart',
    title: 'Find Your Perfect Match',
    description: 'Discover compatible profiles based on your preferences and values',
  },
  {
    id: '2',
    icon: 'people',
    title: 'Connect with Families',
    description: 'Build meaningful connections with verified profiles and their families',
  },
  {
    id: '3',
    icon: 'shield-checkmark',
    title: 'Safe & Secure',
    description: 'Your privacy and security are our top priorities with verified profiles',
  },
];

export const IntroScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const { setHasSeenIntro } = useStore();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      setHasSeenIntro(true);
      navigation.replace('Welcome');
    }
  };

  const handleSkip = () => {
    setHasSeenIntro(true);
    navigation.replace('Welcome');
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={120} color={colors.secondary.gold} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={colors.background.gradient}
      style={styles.container}
    >
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {renderDots()}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
        <Ionicons name="arrow-forward" size={20} color={colors.text.primary} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: spacing.xxl + spacing.md,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    ...typography.body1,
    color: colors.text.white,
    opacity: 0.8,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.white,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body1,
    color: colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.white,
    opacity: 0.3,
    marginHorizontal: spacing.xs,
  },
  activeDot: {
    width: 24,
    opacity: 1,
    backgroundColor: colors.secondary.gold,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary.gold,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  nextButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
});
