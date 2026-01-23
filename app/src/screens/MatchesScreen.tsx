import React, { useState } from 'react';
import { View, FlatList, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { mockProfiles } from '../data/mockProfiles';
import MatchCard from '../components/MatchCard';
import { Ionicons } from '@expo/vector-icons';

type MatchesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Matches'>;

export default function MatchesScreen() {
  const navigation = useNavigation<MatchesScreenNavigationProp>();
  // We'll use this state later for filtering
  const [profiles, setProfiles] = useState(mockProfiles);

  const handleCardPress = (profileId: string) => {
    navigation.navigate('ProfileDetail', { profileId });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Matches</Text>
          <Text className="text-sm text-gray-500 font-medium">Verified Profiles Only</Text>
        </View>
        <TouchableOpacity 
          className="p-2 bg-gray-100 rounded-full"
          onPress={() => {/* Open filter modal - Next Task */}}
        >
          <Ionicons name="filter" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard 
            profile={item} 
            onPress={() => handleCardPress(item.id)} 
          />
        )}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-gray-400 text-lg">No matches found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
