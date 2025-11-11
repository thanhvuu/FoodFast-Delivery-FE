import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import shadows from '../theme/shadows';
import { FoodItem } from '../data/menu';

export type FoodCardProps = {
  item: FoodItem;
  onPress?: (item: FoodItem) => void;
  variant?: 'grid' | 'featured';
};

const FoodCard: React.FC<FoodCardProps> = ({ item, onPress, variant = 'grid' }: FoodCardProps) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      onPress={() => onPress?.(item)}
      style={[styles.container, variant === 'featured' && styles.featuredContainer]}
    >
      <Image source={{ uri: item.image }} style={[styles.image, variant === 'featured' && styles.featuredImage]} />
      <View style={[styles.content, variant === 'featured' && styles.featuredContent]}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={variant === 'featured' ? 2 : 3}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{item.price.toLocaleString('vi-VN')}₫</Text>
          <View style={styles.ratingWrapper}>
            <Text style={styles.rating}>★ {item.rating.toFixed(1)}</Text>
            <Text style={styles.votes}>({item.votes})</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.card,
  },
  featuredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  image: {
    width: '100%',
    height: 140,
  },
  featuredImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginRight: spacing.md,
  },
  content: {
    padding: spacing.md,
    flex: 1,
  },
  featuredContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  category: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: colors.text,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  votes: {
    color: colors.muted,
    fontSize: 12,
  },
});

export default FoodCard;