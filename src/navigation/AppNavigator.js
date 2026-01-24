import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { useStore } from '../store/useStore';

import { IntroScreen } from '../screens/IntroScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';

import { IdentityStep } from '../screens/onboarding/IdentityStep';
import { BasicStep } from '../screens/onboarding/BasicStep';
import { AboutStep } from '../screens/onboarding/AboutStep';
import { FamilyStep } from '../screens/onboarding/FamilyStep';
import { AddressStep } from '../screens/onboarding/AddressStep';
import { PhotosStep } from '../screens/onboarding/PhotosStep';
import { AuthScreen } from '../screens/onboarding/AuthScreen';

import { HomeScreen } from '../screens/tabs/HomeScreen';
import { ConnectionsScreen } from '../screens/tabs/ConnectionsScreen';
import { ChatsScreen } from '../screens/tabs/ChatsScreen';
import { ProfileScreen } from '../screens/tabs/ProfileScreen';
import { ChatDetailScreen } from '../screens/ChatDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Connections') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.light,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 0),
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Connections" component={ConnectionsScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="IdentityStep" component={IdentityStep} />
      <Stack.Screen name="BasicStep" component={BasicStep} />
      <Stack.Screen name="AboutStep" component={AboutStep} />
      <Stack.Screen name="FamilyStep" component={FamilyStep} />
      <Stack.Screen name="AddressStep" component={AddressStep} />
      <Stack.Screen name="PhotosStep" component={PhotosStep} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, hasSeenIntro } = useStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          !hasSeenIntro ? (
            <Stack.Screen name="Intro" component={IntroScreen} />
          ) : (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingStack} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="ChatDetail"
              component={ChatDetailScreen}
              options={{
                presentation: 'card',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
