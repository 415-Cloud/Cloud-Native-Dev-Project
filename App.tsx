import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from './screens/HomeScreen';
import { WorkoutDetailScreen } from './screens/WorkoutDetailScreen';
import { CreateWorkoutScreen } from './screens/CreateWorkoutScreen';
import { EditWorkoutScreen } from './screens/EditWorkoutScreen';
import { WorkoutsScreen } from './screens/WorkoutsScreen';
import { ChallengesScreen } from './screens/ChallengesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LoginScreen } from './screens/LoginScreen';
import { AuthProvider } from './context/AuthContext';
import { theme } from './theme';

const RootStack = createNativeStackNavigator();
const DashboardStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator
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
      <DashboardStack.Screen
        name="DashboardHome"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <DashboardStack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{
          title: 'Workout Details',
          headerBackTitleVisible: false,
        }}
      />
      <DashboardStack.Screen
        name="CreateWorkout"
        component={CreateWorkoutScreen}
        options={{
          title: 'Create Workout',
          headerBackTitleVisible: false,
        }}
      />
      <DashboardStack.Screen
        name="EditWorkout"
        component={EditWorkoutScreen}
        options={{
          title: 'Edit Workout',
          headerBackTitleVisible: false,
        }}
      />
    </DashboardStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'fitness-outline';

          if (route.name === 'Dashboard') {
            iconName = 'speedometer-outline';
          } else if (route.name === 'Workouts') {
            iconName = 'barbell-outline';
          } else if (route.name === 'Challenges') {
            iconName = 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Challenges" component={ChallengesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <RootStack.Navigator
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
        initialRouteName="Login"
      >
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}