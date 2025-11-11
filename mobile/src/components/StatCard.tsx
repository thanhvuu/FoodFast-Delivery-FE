import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import shadows from '../theme/shadows';

type StatCardProps = {
  title: string;
  value: string;
  highlight?: string;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, highlight }: StatCardProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {highlight ? <Text style={styles.highlight}>{highlight}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    minWidth: 150,
    ...shadows.card,
  },
  title: {
    color: colors.muted,
    fontSize: 13,
  },
  value: {
    marginTop: spacing.sm,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  highlight: {
    marginTop: spacing.xs,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default StatCard;