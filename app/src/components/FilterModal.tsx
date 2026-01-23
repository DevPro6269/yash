import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  city: string;
  minAge: string;
  maxAge: string;
  minIncome: string; // Simplification: just a string for bucket filtering
}

export default function FilterModal({ visible, onClose, onApply }: FilterModalProps) {
  const [city, setCity] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [income, setIncome] = useState('');

  const handleApply = () => {
    onApply({ city, minAge, maxAge, minIncome: income });
    onClose();
  };

  const handleReset = () => {
    setCity('');
    setMinAge('');
    setMaxAge('');
    setIncome('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl h-[70%] p-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-900">Filter Matches</Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
              <Ionicons name="close" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* City Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">City</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Mumbai, Delhi"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-base"
              />
            </View>

            {/* Age Range */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Age Range</Text>
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <TextInput
                    value={minAge}
                    onChangeText={setMinAge}
                    placeholder="Min"
                    keyboardType="numeric"
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center"
                  />
                </View>
                <View className="justify-center">
                  <Text className="text-gray-400">-</Text>
                </View>
                <View className="flex-1">
                  <TextInput
                    value={maxAge}
                    onChangeText={setMaxAge}
                    placeholder="Max"
                    keyboardType="numeric"
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center"
                  />
                </View>
              </View>
            </View>

            {/* Income Bucket (Simple Buttons) */}
            <View className="mb-8">
              <Text className="text-sm font-semibold text-gray-700 mb-3">Minimum Income</Text>
              <View className="flex-row flex-wrap gap-2">
                {['5 LPA', '10 LPA', '15 LPA', '20 LPA'].map((val) => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => setIncome(income === val ? '' : val)}
                    className={`px-4 py-2 rounded-full border ${
                      income === val 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      income === val ? 'text-white' : 'text-gray-600'
                    }`}>
                      {val}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View className="flex-row space-x-4 pt-4 border-t border-gray-100">
            <TouchableOpacity 
              onPress={handleReset}
              className="flex-1 py-4 bg-gray-100 rounded-xl items-center"
            >
              <Text className="text-gray-700 font-bold">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleApply}
              className="flex-1 py-4 bg-blue-600 rounded-xl items-center shadow-md shadow-blue-200"
            >
              <Text className="text-white font-bold">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
