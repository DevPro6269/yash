import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MatchesScreen from '../screens/MatchesScreen';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Matches" 
          component={MatchesScreen} 
          options={{ title: 'Verified Matches' }}
        />
        <Stack.Screen 
          name="ProfileDetail" 
          component={ProfileDetailScreen} 
          options={{ title: 'Profile Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
