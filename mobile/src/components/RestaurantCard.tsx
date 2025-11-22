import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import shadows from '../theme/shadows';
import { RestaurantShowcase } from '../data/home';

export type RestaurantCardProps = {
  item: RestaurantShowcase;
  onPress?: (item: RestaurantShowcase) => void;
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({ item, onPress }: RestaurantCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      accessibilityRole="button"
      onPress={() => onPress?.(item)}
    >
      <ImageBackground source={{ uri: item.image }} style={styles.image} imageStyle={styles.imageRadius}>
        <View style={styles.topRow}>
          <View style={styles.ratingPill}>
            <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
            <Text style={styles.distanceText}>{item.distance}</Text>
          </View>
          {item.badge ? (
            <View style={[styles.flashPill, { backgroundColor: item.badgeTone ?? colors.primary }]}> 
              <Text style={styles.flashText}>{item.badge}</Text>
            </View>
          ) : null}
        </View>
        {item.highlight ? (
          <View style={styles.bottomLabel}>
            <Text style={styles.bottomLabelText}>{item.highlight}</Text>
          </View>
        ) : null}
      </ImageBackground>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.tags} numberOfLines={1}>
          {item.tags}
        </Text>
        <Text style={styles.priceInfo}>{item.priceInfo}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 240,
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.card,
    marginRight: spacing.md,
  },
  image: {
    height: 160,
    width: '100%',
    justifyContent: 'space-between',
  },
  imageRadius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  ratingPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#F59E0B',
    fontWeight: '800',
    marginRight: spacing.xs,
    fontSize: 12,
  },
  distanceText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 12,
  },
  flashPill: {
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
  },
  flashText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  bottomLabel: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFEFE1',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: spacing.sm,
  },
  bottomLabelText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  tags: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  priceInfo: {
    color: '#FF5722',
    fontWeight: '800',
    fontSize: 13,
  },
});

export default RestaurantCard;
