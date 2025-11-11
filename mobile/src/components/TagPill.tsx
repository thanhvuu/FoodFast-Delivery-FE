import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export type TagPillProps = {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
};

const TagPill: React.FC<TagPillProps> = ({ label, isActive, onPress }: TagPillProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.container, isActive ? styles.activeContainer : styles.inactiveContainer]}
    >
      <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    marginRight: spacing.sm,
  },
  activeContainer: {
    backgroundColor: colors.primary,
  },
  inactiveContainer: {
    backgroundColor: '#F0F2F8',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#fff',
  },
  inactiveLabel: {
    color: colors.muted,
  },
});

export default TagPill;