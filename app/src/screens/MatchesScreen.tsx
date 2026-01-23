import React, { useState, useMemo } from 'react';
import { View, FlatList, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { mockProfiles } from '../data/mockProfiles';
import MatchCard from '../components/MatchCard';
import FilterModal, { FilterState } from '../components/FilterModal';
import { Ionicons } from '@expo/vector-icons';

type MatchesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Matches'>;

export default function MatchesScreen() {
  const navigation = useNavigation<MatchesScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    minAge: '',
    maxAge: '',
    minIncome: '',
  });

  const filteredProfiles = useMemo(() => {
    return mockProfiles.filter(profile => {
      // City Filter (Case insensitive partial match)
      if (filters.city && !profile.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }

      // Age Filter
      const minAge = parseInt(filters.minAge) || 0;
      const maxAge = parseInt(filters.maxAge) || 100;
      if (profile.age < minAge || profile.age > maxAge) {
        return false;
      }

      // Income Filter (Very basic string parsing for demo)
      // Assuming mock data format like "12-15 LPA"
      if (filters.minIncome) {
        const profileMinIncome = parseInt(profile.income.split('-')[0]) || 0;
        const filterMinIncome = parseInt(filters.minIncome.split(' ')[0]) || 0;
        if (profileMinIncome < filterMinIncome) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

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
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="filter" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <FlatList
        data={filteredProfiles}
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
            <TouchableOpacity onPress={() => setFilters({ city: '', minAge: '', maxAge: '', minIncome: '' })}>
              <Text className="text-blue-500 mt-2 font-medium">Clear Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onApply={setFilters} 
      />
    </SafeAreaView>
  );
}
