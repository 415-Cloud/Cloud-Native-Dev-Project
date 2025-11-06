import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ExerciseItem } from '../components/ExerciseItem';
import { Button } from '../components/Button';
import { theme } from '../theme';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

const mockExercises: Exercise[] = [
  {
    name: 'Barbell Squat',
    sets: '4',
    reps: '8-10',
    rest: '90s',
  },
  {
    name: 'Romanian Deadlift',
    sets: '3',
    reps: '10-12',
    rest: '60s',
  },
  {
    name: 'Leg Press',
    sets: '3',
    reps: '12-15',
    rest: '45s',
  },
  {
    name: 'Walking Lunges',
    sets: '3',
    reps: '12 each leg',
    rest: '60s',
  },
  {
    name: 'Leg Curls',
    sets: '3',
    reps: '12-15',
    rest: '45s',
  },
  {
    name: 'Calf Raises',
    sets: '4',
    reps: '15-20',
    rest: '30s',
  },
];

interface WorkoutDetailScreenProps {
  route: {
    params: {
      workoutId: string;
    };
  };
  navigation: any;
}

export const WorkoutDetailScreen: React.FC<WorkoutDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { workoutId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.workoutTitle}>Full Body Strength</Text>
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>45 min</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Exercises</Text>
              <Text style={styles.metaValue}>{mockExercises.length}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Difficulty</Text>
              <Text style={styles.metaValue}>Intermediate</Text>
            </View>
          </View>
        </View>

        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {mockExercises.map((exercise, index) => (
            <ExerciseItem
              key={index}
              name={exercise.name}
              sets={exercise.sets}
              reps={exercise.reps}
              rest={exercise.rest}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Start Workout"
            onPress={() => {
              // Navigate to workout timer screen
            }}
            variant="primary"
          />
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
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  workoutTitle: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  metaValue: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  exercisesSection: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
  },
});

