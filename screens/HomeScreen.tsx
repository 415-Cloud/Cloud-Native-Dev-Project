import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { WorkoutCard } from '../components/WorkoutCard';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { workoutService, Workout as ApiWorkout } from '../services/workoutService';

// Temporary user ID - in a real app, this would come from auth
const TEMP_USER_ID = 'user-1';

interface WorkoutCardData {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  exercises: number;
}

// Transform API workout to card data
const transformWorkout = (workout: ApiWorkout): WorkoutCardData => {
  // Map workout type to a display format
  const getDifficulty = (duration: number): string => {
    if (duration < 30) return 'Beginner';
    if (duration < 45) return 'Intermediate';
    return 'Advanced';
  };

  return {
    id: workout.id.toString(),
    title: workout.type || 'Workout',
    duration: `${workout.duration} min`,
    difficulty: getDifficulty(workout.duration),
    exercises: 0, // Backend doesn't track exercises, so we'll show 0 for now
  };
};

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [workouts, setWorkouts] = useState<WorkoutCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = async () => {
    try {
      setError(null);
      const apiWorkouts = await workoutService.getWorkouts(TEMP_USER_ID);
      const transformedWorkouts = apiWorkouts.map(transformWorkout);
      setWorkouts(transformedWorkouts);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Failed to load workouts. Make sure the workout service is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading workouts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.title}>Your Workouts</Text>
            </View>
            <Button
              title="+"
              onPress={() => navigation.navigate('CreateWorkout')}
              variant="primary"
              style={styles.addButton}
            />
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.workoutList}>
          {workouts.length === 0 && !error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No workouts yet</Text>
              <Text style={styles.emptySubtext}>
                Start logging your workouts to see them here
              </Text>
            </View>
          ) : (
            workouts.map((workout) => (
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
            ))
          )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 0,
    minHeight: 48,
    marginLeft: theme.spacing.md,
  },
  workoutList: {
    marginTop: theme.spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    backgroundColor: theme.colors.error + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

