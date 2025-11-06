import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './screens/HomeScreen';
import { WorkoutDetailScreen } from './screens/WorkoutDetailScreen';
import { CreateWorkoutScreen } from './screens/CreateWorkoutScreen';
import { theme } from './theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WorkoutDetail"
          component={WorkoutDetailScreen}
          options={{
            title: 'Workout Details',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="CreateWorkout"
          component={CreateWorkoutScreen}
          options={{
            title: 'Create Workout',
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

