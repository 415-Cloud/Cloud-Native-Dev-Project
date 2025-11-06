import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface ExerciseItemProps {
  name: string;
  sets: string;
  reps: string;
  rest?: string;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  name,
  sets,
  reps,
  rest,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Sets</Text>
            <Text style={styles.detailValue}>{sets}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Reps</Text>
            <Text style={styles.detailValue}>{reps}</Text>
          </View>
          {rest && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rest</Text>
              <Text style={styles.detailValue}>{rest}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.index}>
        <View style={styles.indexCircle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    flex: 1,
  },
  name: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  details: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  index: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.accent,
    opacity: 0.3,
  },
});

