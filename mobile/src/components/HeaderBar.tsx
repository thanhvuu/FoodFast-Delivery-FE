import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export type HeaderBarProps = {
  title?: string;
  onBackPress?: () => void;
};

const HeaderBar: React.FC<HeaderBarProps> = ({ title, onBackPress }: HeaderBarProps) => {
  return (
    <View style={styles.container}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress} accessibilityRole="button" style={styles.backButton}>
          <Text style={styles.backLabel}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title}>{title ?? 'FoodFast'}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE8DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLabel: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
});

export default HeaderBar;