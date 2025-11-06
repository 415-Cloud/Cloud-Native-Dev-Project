import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { workoutService, Workout } from '../services/workoutService';

interface WorkoutDetailScreenProps {
  route?: {
    params?: {
      workoutId?: string;
    };
  };
  navigation?: any;
}

const getDifficulty = (duration: number): string => {
  if (duration < 30) return 'Beginner';
  if (duration < 45) return 'Intermediate';
  return 'Advanced';
};

export const WorkoutDetailScreen: React.FC<WorkoutDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const workoutId = route?.params?.workoutId || '1';
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setError(null);
        const workoutData = await workoutService.getWorkoutById(
          parseInt(workoutId)
        );
        setWorkout(workoutData);
      } catch (err) {
        console.error('Error fetching workout:', err);
        setError('Failed to load workout details.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !workout) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            {error || 'Workout not found'}
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="primary"
            style={styles.backButton}
          />
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
      >
        <View style={styles.header}>
          <Text style={styles.workoutTitle}>{workout.type}</Text>
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>{workout.duration} min</Text>
            </View>
            {workout.calories && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Calories</Text>
                <Text style={styles.metaValue}>{workout.calories}</Text>
              </View>
            )}
            {workout.distance && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Distance</Text>
                <Text style={styles.metaValue}>{workout.distance} km</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Difficulty</Text>
              <Text style={styles.metaValue}>
                {getDifficulty(workout.duration)}
              </Text>
            </View>
          </View>
        </View>

        {workout.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{workout.notes}</Text>
            </View>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Workout Details</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{workout.type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {new Date(workout.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>
                {new Date(workout.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Edit Workout"
            onPress={() => {
              // Navigate to edit workout screen
              navigation.navigate('EditWorkout', { workoutId: workout.id });
            }}
            variant="secondary"
            style={styles.button}
          />
          <Button
            title="Delete Workout"
            onPress={async () => {
              try {
                await workoutService.deleteWorkout(workout.id);
                navigation.goBack();
              } catch (err) {
                console.error('Error deleting workout:', err);
              }
            }}
            variant="outline"
            style={styles.button}
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
    flexWrap: 'wrap',
  },
  metaItem: {
    flex: 1,
    minWidth: '45%',
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
  notesSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  notesContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  notesText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    lineHeight: 24,
  },
  infoSection: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  button: {
    marginBottom: theme.spacing.sm,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
});


