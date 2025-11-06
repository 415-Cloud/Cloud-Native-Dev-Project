import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { WorkoutCard } from '../components/WorkoutCard';
import { theme } from '../theme';

interface Workout {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  exercises: number;
}

const mockWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Full Body Strength',
    duration: '45 min',
    difficulty: 'Intermediate',
    exercises: 8,
  },
  {
    id: '2',
    title: 'Upper Body Power',
    duration: '30 min',
    difficulty: 'Advanced',
    exercises: 6,
  },
  {
    id: '3',
    title: 'Leg Day Blast',
    duration: '50 min',
    difficulty: 'Intermediate',
    exercises: 7,
  },
  {
    id: '4',
    title: 'Core & Cardio',
    duration: '25 min',
    difficulty: 'Beginner',
    exercises: 5,
  },
  {
    id: '5',
    title: 'Push Day',
    duration: '40 min',
    difficulty: 'Intermediate',
    exercises: 6,
  },
  {
    id: '6',
    title: 'Pull Day',
    duration: '40 min',
    difficulty: 'Intermediate',
    exercises: 6,
  },
];

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.title}>Your Workouts</Text>
        </View>

        <View style={styles.workoutList}>
          {mockWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              title={workout.title}
              duration={workout.duration}
              difficulty={workout.difficulty}
              exercises={workout.exercises}
              onPress={() =>
                navigation.navigate('WorkoutDetail', { workoutId: workout.id })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
  },
  workoutList: {
    marginTop: theme.spacing.md,
  },
});

