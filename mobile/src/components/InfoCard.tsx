import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import shadows from '../theme/shadows';

type InfoCardProps = {
  title: string;
  description: string;
  badge?: string;
  footer?: string;
  align?: 'left' | 'center';
};

const InfoCard: React.FC<InfoCardProps> = ({ title, description, badge, footer, align = 'left' }: InfoCardProps) => {
  return (
    <View style={[styles.container, align === 'center' && styles.centered]}>
      {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.description, align === 'center' && styles.centeredText]}>{description}</Text>
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    ...shadows.card,
  },
  centered: {
    alignItems: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE8DA',
    color: colors.primary,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  centeredText: {
    textAlign: 'center',
  },
  footer: {
    marginTop: spacing.md,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default InfoCard;