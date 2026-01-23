import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Profile } from '../types/Profile';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

interface MatchCardProps {
  profile: Profile;
  onPress: () => void;
}

export default function MatchCard({ profile, onPress }: MatchCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.9}
      className="mb-4 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
      style={{ width: cardWidth }}
    >
      {/* Image Container */}
      <View className="relative h-48 w-full bg-gray-200">
        <Image 
          source={{ uri: profile.photoUrl }} 
          className="h-full w-full"
          resizeMode="cover"
        />
        
        {/* Gradient Overlay (Simulated with semi-transparent view) */}
        <View className="absolute bottom-0 w-full h-20 bg-black/30" />
        
        {/* Verified Badge */}
        {profile.isVerified && (
          <View className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-sm">
            <Ionicons name="checkmark-circle" size={16} color="#3B82F6" />
          </View>
        )}

        {/* Name & Age Overlay */}
        <View className="absolute bottom-2 left-2 right-2">
          <Text className="text-white font-bold text-base shadow-sm" numberOfLines={1}>
            {profile.name}, {profile.age}
          </Text>
        </View>
      </View>

      {/* Details Footer */}
      <View className="p-3 bg-white space-y-2">
        {/* Location Chip */}
        <View className="flex-row items-center space-x-1">
          <Ionicons name="location-outline" size={12} color="#6B7280" />
          <Text className="text-gray-600 text-xs font-medium" numberOfLines={1}>
            {profile.city}
          </Text>
        </View>

        {/* Income Chip */}
        <View className="flex-row items-center space-x-1">
          <Ionicons name="briefcase-outline" size={12} color="#6B7280" />
          <Text className="text-gray-600 text-xs font-medium" numberOfLines={1}>
            {profile.income}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
