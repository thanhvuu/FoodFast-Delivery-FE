import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import SectionHeader from '../components/SectionHeader';
import TagPill from '../components/TagPill';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { CustomerHomeStackParamList } from '../navigation/types';
import RestaurantCard from '../components/RestaurantCard';
import type { RestaurantShowcase } from '../data/home';
import { discoveryFilters, shortcuts, topRatedRestaurants, newRestaurants } from '../data/home';
import useProducts from '../hooks/useProducts';
import useRestaurants from '../hooks/useRestaurants';
import type { RestaurantItem } from '../hooks/useRestaurants';

const heroImage =
  'https://images.unsplash.com/photo-1601924579534-811e171ad6a5?auto=format&fit=crop&w=1200&q=80';

const quickLinks = [
  { id: 'nearby', label: 'Gần tôi' },
  { id: 'favorite', label: 'Món yêu thích' },
  { id: 'freeship', label: 'Freeship 0đ' },
];

type Props = NativeStackScreenProps<CustomerHomeStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = React.useState<string | undefined>(undefined);
  const { products } = useProducts();
  const { restaurants } = useRestaurants();

  const dishCountByRestaurant = React.useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((item) => {
      const name = item?.restaurant?.name?.toString().trim().toLowerCase();
      if (!name) return;
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return counts;
  }, [products]);

  const handleSeeAll = () => {
    navigation.navigate('CategoryListing');
  };

  const handleOpenRestaurant = (item: RestaurantItem) => {
    navigation.navigate('RestaurantMenu', { restaurant: item });
  };

  const handlePressRestaurant = (item: RestaurantShowcase) => {
    if (item.foodId) {
      navigation.navigate('FoodDetail', { id: item.foodId });
    } else {
      navigation.navigate('FoodDetail', { id: 'chicken' });
    }
  };

  const handleSelectCategory = (label: string) => {
    setSelectedFilter(label);
    navigation.navigate('CategoryListing', { category: label });
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.quickLinkRow}>
          {quickLinks.map((item) => (
            <TouchableOpacity key={item.id} style={styles.quickLink} activeOpacity={0.85}>
              <Text style={styles.quickLinkLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {discoveryFilters.map((filter) => (
            <TagPill
              key={filter}
              label={filter}
              isActive={selectedFilter === filter}
              onPress={() => handleSelectCategory(filter)}
            />
          ))}
        </ScrollView>

        <ImageBackground source={{ uri: heroImage }} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroLabel}>Deal Hot Hôm Nay Từ 0đ!</Text>
            <Text style={styles.heroSub}>Giao nhanh - Ưu đãi mọi khung giờ</Text>
            <TouchableOpacity style={styles.heroButton} activeOpacity={0.9} onPress={handleSeeAll}>
              <Text style={styles.heroButtonText}>Xem ngay</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.categoryGrid}>
          {shortcuts.slice(0, 6).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.categoryCard}
              activeOpacity={0.85}
              onPress={() => handleSelectCategory(item.label)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: item.background }]}>
                <Text style={[styles.categoryEmoji, { color: item.color }]}>{item.icon}</Text>
              </View>
              <Text style={styles.categoryLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader
          title="Nhà hàng đang hoạt động"
          subtitle="Chỉ hiển thị nhà hàng đã duyệt, kèm số món đang bán."
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.restaurantList}>
          {restaurants.map((res) => {
            const count = dishCountByRestaurant.get(res.name.toLowerCase()) || 0;
            const isOpen = res.isOpen !== false;
            const hours =
              res.openingHours?.open && res.openingHours?.close
                ? `${res.openingHours.open} - ${res.openingHours.close}`
                : undefined;
            return (
              <TouchableOpacity
                key={res.id}
                style={styles.restaurantCard}
                activeOpacity={0.88}
                onPress={() => handleOpenRestaurant(res)}
              >
                <View style={styles.restaurantTopRow}>
                  <Text style={styles.restaurantName} numberOfLines={1}>
                    {res.name}
                  </Text>
                  <View style={isOpen ? styles.statusPill : styles.statusPillClosed}>
                    <Text style={isOpen ? styles.statusText : styles.statusTextClosed}>
                      {res.displayStatus || (isOpen ? 'Đang hoạt động' : 'Đã đóng cửa')}
                    </Text>
                  </View>
                </View>
                <Text style={styles.restaurantMeta} numberOfLines={1}>
                  {res.owner || 'Ẩn danh'} • {res.city || '—'} {hours ? `• ${hours}` : ''}
                </Text>
                <Text style={styles.restaurantCount}>{count} món hiện có</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <SectionHeader
          title="Top Quán Rating 5* tuần này"
          subtitle="Gợi ý quán được tin nổi bật do bạn thức đánh giá 5*"
          actionLabel="Xem tất cả"
          onActionPress={handleSeeAll}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {topRatedRestaurants.map((item) => (
            <RestaurantCard key={item.id} item={item} onPress={handlePressRestaurant} />
          ))}
        </ScrollView>

        <SectionHeader title="Quán Mới Lên Sàn" actionLabel="Xem tất cả" onActionPress={handleSeeAll} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {newRestaurants.map((item) => (
            <RestaurantCard key={item.id} item={item} onPress={handlePressRestaurant} />
          ))}
        </ScrollView>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  quickLinkRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  quickLink: {
    backgroundColor: '#FFF4ED',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 14,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#FFD7BF',
  },
  quickLinkLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  hero: {
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  heroImage: {
    borderRadius: 20,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: spacing.lg,
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  heroSub: {
    color: '#fff',
    marginTop: 4,
    fontWeight: '600',
  },
  heroButton: {
    marginTop: spacing.md,
    backgroundColor: '#FFE8DA',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  heroButtonText: {
    color: colors.primary,
    fontWeight: '800',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  categoryIcon: {
    width: 54,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryLabel: {
    marginTop: spacing.sm,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  restaurantList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  restaurantCard: {
    width: 260,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  restaurantTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  restaurantName: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 16,
    flex: 1,
    marginRight: spacing.sm,
  },
  statusPill: {
    backgroundColor: '#E6F6EB',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusPillClosed: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    color: '#14804A',
    fontWeight: '700',
    fontSize: 12,
  },
  statusTextClosed: {
    color: '#991B1B',
    fontWeight: '700',
    fontSize: 12,
  },
  restaurantMeta: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  restaurantCount: {
    color: colors.text,
    fontWeight: '700',
  },
});

export default HomeScreen;
