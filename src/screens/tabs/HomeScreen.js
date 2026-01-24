import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge, Button } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { mockProfiles } from '../../data/mockData';

export const HomeScreen = ({ navigation }) => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [showFilters, setShowFilters] = useState(false);

  const handleConnect = (profileId) => {
    console.log('Connect with:', profileId);
  };

  const renderProfile = ({ item }) => (
    <Card style={styles.profileCard}>
      <Image source={{ uri: item.photo }} style={styles.profileImage} />
      
      <View style={styles.profileInfo}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileName}>{item.name}, {item.age}</Text>
          {item.verified && (
            <Badge label="Verified" variant="verified" size="small" />
          )}
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.infoText}>{item.profession}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.infoText}>{item.city}, {item.state}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.infoText}>{item.education}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="resize-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.infoText}>{item.height}</Text>
        </View>

        <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>

        <Button
          title="Connect"
          onPress={() => handleConnect(item.id)}
          style={styles.connectButton}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.background.gradient}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Discover Matches</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={24} color={colors.text.white} />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={profiles}
        renderItem={renderProfile}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>
            <Text style={styles.modalSubtitle}>Filter options coming soon...</Text>
            <Button
              title="Close"
              onPress={() => setShowFilters(false)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingTop: spacing.xxl + spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text.white,
  },
  filterButton: {
    padding: spacing.sm,
  },
  listContent: {
    padding: spacing.md,
  },
  profileCard: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  profileInfo: {
    padding: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  profileName: {
    ...typography.h3,
    color: colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
    gap: spacing.sm,
  },
  infoText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  bio: {
    ...typography.body2,
    color: colors.text.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  connectButton: {
    marginTop: spacing.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    minHeight: 300,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    ...typography.body1,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  closeButton: {
    marginTop: spacing.lg,
  },
});
