import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import HeaderBar from '../components/HeaderBar';
import SectionHeader from '../components/SectionHeader';
import FoodCard from '../components/FoodCard';
import spacing from '../theme/spacing';
import colors from '../theme/colors';
import { CustomerHomeStackParamList } from '../navigation/types';
import useProducts from '../hooks/useProducts';
import { allFoods } from '../data/menu';

const statusToneMap: Record<string, string> = {
  active: '#14804A',
  pending: '#B45309',
  review: '#4338CA',
  closed: '#991B1B',
};

type Props = NativeStackScreenProps<CustomerHomeStackParamList, 'RestaurantMenu'>;

const RestaurantMenuScreen: React.FC<Props> = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const { products, isLoading } = useProducts();
  const menu = React.useMemo(() => (products?.length ? products : allFoods), [products]);

  const normalizedName = React.useMemo(
    () => restaurant?.name?.toString().trim().toLowerCase(),
    [restaurant?.name],
  );

  const restaurantFoods = React.useMemo(
    () =>
      menu.filter((item) => {
        const name = item.restaurant?.name?.toString().trim().toLowerCase();
        return normalizedName ? name === normalizedName : false;
      }),
    [menu, normalizedName],
  );

  const statusTone = statusToneMap[restaurant?.displayStatusKey ?? ''] || colors.primary;
  const hoursLabel = restaurant?.openingHours
    ? `${restaurant.openingHours.open ?? '--:--'} - ${restaurant.openingHours.close ?? '--:--'}`
    : undefined;

  return (
    <ScreenContainer>
      <HeaderBar title={restaurant?.name || 'Nhà hàng'} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.restaurantName}>{restaurant?.name}</Text>
              <Text style={styles.metaText} numberOfLines={1}>
                {(restaurant?.owner || 'Ẩn danh') + ' • ' + (restaurant?.city || '—')}
              </Text>
            </View>
            {restaurant?.displayStatus ? (
              <View style={[styles.statusPill, { backgroundColor: statusTone + '22' }]}>
                <Text style={[styles.statusText, { color: statusTone }]}>{restaurant.displayStatus}</Text>
              </View>
            ) : null}
          </View>

          {hoursLabel ? <Text style={styles.metaText}>Giờ mở cửa: {hoursLabel}</Text> : null}
          <Text style={styles.menuCount}>{restaurantFoods.length} món đang bán</Text>
        </View>

        <SectionHeader title="Menu" subtitle="Các món đang phục vụ" />
        <View style={styles.listWrapper}>
          {restaurantFoods.length === 0 ? (
            <Text style={styles.emptyText}>{isLoading ? 'Đang tải menu...' : 'Nhà hàng chưa có món nào.'}</Text>
          ) : (
            restaurantFoods.map((item) => (
              <View key={item.id} style={styles.cardWrapper}>
                <FoodCard
                  item={item}
                  variant="featured"
                  onPress={(selected) => navigation.navigate('FoodDetail', { id: selected.id })}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
    gap: spacing.xs,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  metaText: {
    color: colors.muted,
  },
  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 14,
  },
  statusText: {
    fontWeight: '700',
  },
  menuCount: {
    marginTop: spacing.sm,
    fontWeight: '700',
    color: colors.text,
  },
  listWrapper: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  cardWrapper: {
    marginBottom: spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: spacing.lg,
    fontWeight: '600',
  },
});

export default RestaurantMenuScreen;
