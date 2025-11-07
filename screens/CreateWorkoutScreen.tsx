import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { workoutService, CreateWorkoutRequest } from '../services/workoutService';
import { useAuth } from '../context/AuthContext';

interface CreateWorkoutScreenProps {
  navigation?: any;
  route?: {
    params?: {
      userId?: string;
    };
  };
}

export const CreateWorkoutScreen: React.FC<CreateWorkoutScreenProps> = ({
  navigation,
  route,
}) => {
  const { userId } = useAuth();
  
  const [formData, setFormData] = useState<CreateWorkoutRequest>({
    userId: userId || '',
    type: '',
    duration: 30,
    calories: undefined,
    distance: undefined,
    notes: undefined,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validation
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    if (!formData.type.trim()) {
      setError('Workout type is required');
      return;
    }
    
    if (formData.duration <= 0) {
      setError('Duration must be greater than 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await workoutService.createWorkout({
        ...formData,
        userId: userId,
        type: formData.type.trim(),
        calories: formData.calories || undefined,
        distance: formData.distance || undefined,
        notes: formData.notes?.trim() || undefined,
      });
      
      // Navigate back to home screen
      navigation?.goBack();
    } catch (err: any) {
      console.error('Error creating workout:', err);
      setError(err.message || 'Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Workout</Text>
            <Text style={styles.subtitle}>
              Log your workout session
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Workout Type *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Running, Full Body, Yoga"
                placeholderTextColor={theme.colors.text.muted}
                value={formData.type}
                onChangeText={(text) =>
                  setFormData({ ...formData, type: text })
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Duration (minutes) *</Text>
              <TextInput
                style={styles.input}
                placeholder="30"
                placeholderTextColor={theme.colors.text.muted}
                keyboardType="number-pad"
                value={formData.duration?.toString() || ''}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setFormData({ ...formData, duration: num });
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Calories (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="250"
                placeholderTextColor={theme.colors.text.muted}
                keyboardType="number-pad"
                value={formData.calories?.toString() || ''}
                onChangeText={(text) => {
                  const num = text ? parseInt(text) || undefined : undefined;
                  setFormData({ ...formData, calories: num });
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Distance (km, optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="5.0"
                placeholderTextColor={theme.colors.text.muted}
                keyboardType="decimal-pad"
                value={formData.distance?.toString() || ''}
                onChangeText={(text) => {
                  const num = text ? parseFloat(text) || undefined : undefined;
                  setFormData({ ...formData, distance: num });
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any notes about your workout..."
                placeholderTextColor={theme.colors.text.muted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={formData.notes || ''}
                onChangeText={(text) =>
                  setFormData({ ...formData, notes: text })
                }
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={loading ? 'Creating...' : 'Create Workout'}
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
  keyboardView: {
    flex: 1,
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
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
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
  form: {
    marginTop: theme.spacing.md,
  },
  field: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    minHeight: 100,
    paddingTop: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  cancelButton: {
    marginTop: theme.spacing.sm,
  },
});

