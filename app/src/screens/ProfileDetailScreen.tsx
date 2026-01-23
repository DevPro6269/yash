import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { mockProfiles } from '../data/mockProfiles';
import { Ionicons } from '@expo/vector-icons';

type ProfileDetailRouteProp = RouteProp<RootStackParamList, 'ProfileDetail'>;
const { height } = Dimensions.get('window');

export default function ProfileDetailScreen() {
  const route = useRoute<ProfileDetailRouteProp>();
  const navigation = useNavigation();
  const { profileId } = route.params;
  
  const profile = mockProfiles.find(p => p.id === profileId);

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Profile not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentInsetAdjustmentBehavior="never" className="flex-1">
        {/* Hero Image */}
        <View className="relative w-full">
          <Image 
            source={{ uri: profile.photoUrl }} 
            className="w-full bg-gray-200"
            style={{ height: height * 0.5 }}
            resizeMode="cover"
          />
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="absolute top-12 left-4 bg-white/30 p-2 rounded-full blur-sm"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View className="-mt-8 bg-white rounded-t-3xl pt-8 px-6 pb-32 min-h-screen">
          {/* Header Info */}
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-3xl font-bold text-gray-900">{profile.name}, {profile.age}</Text>
              <View className="flex-row items-center mt-1">
                {profile.isVerified && (
                  <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded-full mr-2">
                    <Ionicons name="checkmark-circle" size={14} color="#3B82F6" />
                    <Text className="text-blue-600 text-xs font-semibold ml-1">Verified</Text>
                  </View>
                )}
                <Text className="text-gray-500 text-sm">{profile.job}</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View className="flex-row flex-wrap justify-between mb-8 bg-gray-50 p-4 rounded-2xl">
            <View className="w-[48%] mb-4 flex-row items-center space-x-3">
              <View className="bg-white p-2 rounded-full">
                <Ionicons name="location" size={20} color="#EF4444" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-medium uppercase">City</Text>
                <Text className="text-gray-900 font-semibold">{profile.city}</Text>
              </View>
            </View>
            
            <View className="w-[48%] mb-4 flex-row items-center space-x-3">
              <View className="bg-white p-2 rounded-full">
                <Ionicons name="briefcase" size={20} color="#F59E0B" />
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-medium uppercase">Income</Text>
                <Text className="text-gray-900 font-semibold">{profile.income}</Text>
              </View>
            </View>
          </View>

          {/* Bio Section */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-3">About</Text>
            <Text className="text-gray-600 leading-relaxed text-base">
              {profile.bio}
            </Text>
          </View>

          {/* Additional Details Placeholder */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-3">Education</Text>
            <Text className="text-gray-600 leading-relaxed text-base">
              Masters in Computer Science • IIT Bombay
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-8 flex-row items-center justify-between shadow-2xl">
        <TouchableOpacity 
          className="flex-1 mr-3 py-4 bg-white border border-gray-200 rounded-xl items-center"
        >
          <Text className="text-gray-700 font-bold text-lg">Shortlist</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 ml-3 py-4 bg-red-500 rounded-xl items-center shadow-lg shadow-red-200"
        >
          <Text className="text-white font-bold text-lg">Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
