import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

const heroImage =
  'https://images.unsplash.com/photo-1601924579534-811e171ad6a5?auto=format&fit=crop&w=1200&q=80';

const quickLinks = [
  { id: 'nearby', label: 'Gần tôi' },
  { id: 'favorite', label: 'Món yêu thích' },
  { id: 'freeship', label: 'Freeship 0đ' },
];

type Props = NativeStackScreenProps<CustomerHomeStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleSeeAll = () => {
    navigation.navigate('Tracking');
  };

  const handlePressRestaurant = (item: RestaurantShowcase) => {
    if (item.foodId) {
      navigation.navigate('FoodDetail', { id: item.foodId });
    } else {
      navigation.navigate('FoodDetail', { id: 'chicken' });
    }
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.searchHeader}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Bạn muốn ăn gì?"
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
            />
            <Text style={styles.voiceIcon}>🎙️</Text>
          </View>
          <View style={styles.helperRow}>
            <Text style={styles.helperText}>Hà Nội</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.helperText}>Ưu đãi mới</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.helperText}>0đ giao hàng</Text>
          </View>
        </View>

        <View style={styles.quickLinkRow}>
          {quickLinks.map((item) => (
            <TouchableOpacity key={item.id} style={styles.quickLink} activeOpacity={0.85}>
              <Text style={styles.quickLinkLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {discoveryFilters.map((filter) => (
            <TagPill key={filter} label={filter} />
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
            <TouchableOpacity key={item.id} style={styles.categoryCard} activeOpacity={0.85}>
              <View style={[styles.categoryIcon, { backgroundColor: item.background }]}>
                <Text style={[styles.categoryEmoji, { color: item.color }]}>{item.icon}</Text>
              </View>
              <Text style={styles.categoryLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
    paddingBottom: spacing.xxl,
  },
  searchHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    height: 48,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  voiceIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontWeight: '600',
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  helperText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  dot: {
    marginHorizontal: spacing.xs,
    color: colors.muted,
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
  horizontalList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});

export default HomeScreen;
