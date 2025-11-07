import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { theme } from '../theme';

interface WorkoutCardProps {
  title: string;
  duration: string;
  difficulty: string;
  exercises: number;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  title,
  duration,
  difficulty,
  exercises,
  onPress,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return theme.colors.success;
      case 'intermediate':
        return theme.colors.warning;
      case 'advanced':
        return theme.colors.error;
      default:
        return theme.colors.secondary;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.headerRight}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(difficulty) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(difficulty) },
                ]}
              >
                {difficulty}
              </Text>
            </View>
            {(onEdit || onDelete) && (
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.menuIcon}>⋮</Text>
                </TouchableOpacity>
                {showMenu && (onEdit || onDelete) && (
                  <View style={styles.menuOptions}>
                    {onEdit && (
                      <TouchableOpacity
                        style={styles.menuOption}
                        onPress={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          onEdit();
                        }}
                      >
                        <Text style={styles.menuOptionText}>Edit</Text>
                      </TouchableOpacity>
                    )}
                    {onDelete && (
                      <TouchableOpacity
                        style={[styles.menuOption, styles.deleteOption]}
                        onPress={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          onDelete();
                        }}
                      >
                        <Text style={[styles.menuOptionText, styles.deleteText]}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{duration}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Exercises</Text>
            <Text style={styles.infoValue}>{exercises}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardContent: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    padding: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  menuOptions: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 100,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuOption: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  menuOptionText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontSize: 14,
  },
  deleteText: {
    color: theme.colors.error,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  difficultyText: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
});

