import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export type OrderStep = {
  id: string;
  title: string;
  time: string;
  isActive?: boolean;
};

type OrderTimelineProps = {
  steps: OrderStep[];
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({ steps }: OrderTimelineProps) => {
  return (
    <View style={styles.container}>
      {steps.map((step: OrderStep, index: number) => {
        const isLast = index === steps.length - 1;
        return (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.indicatorColumn}>
              <View style={[styles.indicator, step.isActive && styles.indicatorActive]} />
              {!isLast ? <View style={styles.connector} /> : null}
            </View>
            <View style={[styles.contentColumn, isLast && styles.lastContentColumn]}>
              <Text style={[styles.title, step.isActive && styles.titleActive]}>{step.title}</Text>
              <Text style={[styles.time, step.isActive && styles.timeActive]}>{step.time}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 32,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EFF1F7',
    marginBottom: spacing.sm,
  },
  lastContentColumn: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.sm,
  },
  titleActive: {
    color: colors.primary,
  },
  time: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 13,
  },
  timeActive: {
    color: colors.text,
  },
});

export default OrderTimeline;