import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { workoutService, CreateWorkoutRequest, Workout } from '../services/workoutService';
import { useAuth } from '../context/AuthContext';

interface EditWorkoutScreenProps {
  navigation?: any;
  route?: {
    params?: {
      workoutId?: number;
    };
  };
}

export const EditWorkoutScreen: React.FC<EditWorkoutScreenProps> = ({
  navigation,
  route,
}) => {
  const { userId } = useAuth();
  const workoutId = route?.params?.workoutId;
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [formData, setFormData] = useState<Partial<CreateWorkoutRequest>>({
    type: '',
    duration: undefined,
    calories: undefined,
    distance: undefined,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!workoutId) {
        setError('Workout ID not provided');
        setLoadingWorkout(false);
        return;
      }

      try {
        setError(null);
        const workoutData = await workoutService.getWorkoutById(workoutId);
        setWorkout(workoutData);
        setFormData({
          type: workoutData.type,
          duration: workoutData.duration,
          calories: workoutData.calories,
          distance: workoutData.distance,
          notes: workoutData.notes || '',
        });
      } catch (err) {
        console.error('Error fetching workout:', err);
        setError('Failed to load workout.');
      } finally {
        setLoadingWorkout(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  const handleChange = (field: keyof CreateWorkoutRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    if (!formData.type?.trim()) {
      setError('Workout type is required');
      return;
    }

    if (!formData.duration || formData.duration <= 0) {
      setError('Duration must be greater than 0');
      return;
    }

    if (!workoutId) {
      setError('Workout ID not found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await workoutService.updateWorkout(workoutId, {
        type: formData.type.trim(),
        duration: Number(formData.duration),
        calories: formData.calories ? Number(formData.calories) : undefined,
        distance: formData.distance ? Number(formData.distance) : undefined,
        notes: formData.notes?.trim() || undefined,
      });

      // Navigate back to detail screen
      navigation?.goBack();
    } catch (err: any) {
      console.error('Error updating workout:', err);
      setError(err.message || 'Failed to update workout');
    } finally {
      setLoading(false);
    }
  };

  if (loadingWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Edit Workout</Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Workout Type *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Running, Strength Training"
              placeholderTextColor={theme.colors.text.secondary}
              value={formData.type}
              onChangeText={(text) => handleChange('type', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration (minutes) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 30, 45"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="numeric"
              value={formData.duration?.toString() || ''}
              onChangeText={(text) => handleChange('duration', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Calories (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 300"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="numeric"
              value={formData.calories?.toString() || ''}
              onChangeText={(text) => handleChange('calories', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Distance (km, optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5.2"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="numeric"
              value={formData.distance?.toString() || ''}
              onChangeText={(text) => handleChange('distance', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any specific notes about your workout"
              placeholderTextColor={theme.colors.text.secondary}
              multiline
              numberOfLines={4}
              value={formData.notes}
              onChangeText={(text) => handleChange('notes', text)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={loading ? 'Updating...' : 'Update Workout'}
              onPress={handleSubmit}
              variant="primary"
              disabled={loading}
            />
            <Button
              title="Cancel"
              onPress={() => navigation?.goBack()}
              variant="secondary"
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.body.fontSize,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  cancelButton: {
    marginTop: theme.spacing.sm,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
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
  },
});

