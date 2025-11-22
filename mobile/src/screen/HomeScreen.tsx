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
import AppFooter from '../components/AppFooter';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { RootStackParamList } from '../navigation/AppNavigator';
import RestaurantCard from '../components/RestaurantCard';
import type { RestaurantShowcase } from '../data/home';
import { discoveryFilters, shortcuts, topRatedRestaurants, newRestaurants } from '../data/home';

const heroImage =
  'https://images.unsplash.com/photo-1604908176997-1251882fa4a9?auto=format&fit=crop&w=1200&q=80';

const accentBadge = 'https://images.unsplash.com/photo-1580915411961-d6e5ca8d4866?auto=format&fit=crop&w=1200&q=80';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleSeeAll = () => {
    navigation.navigate('Contact');
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
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.deliveryLabel}>Giao đến:</Text>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryAddress}>669 Hoàn Kiếm, Hà Nội</Text>
              <Text style={styles.deliveryChevron}>⌄</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.phoneButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={styles.phoneIcon}>📞</Text>
          </TouchableOpacity>
        </View>

        <ImageBackground source={{ uri: heroImage }} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Deal Hot Hôm Nay Tại Hà Nội</Text>
            <View style={styles.heroFooter}>
              <TouchableOpacity
                style={styles.ctaButton}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Tracking')}
              >
                <Text style={styles.ctaLabel}>Đặt ngay</Text>
              </TouchableOpacity>
              <ImageBackground source={{ uri: accentBadge }} style={styles.accentImage} imageStyle={styles.accentImageStyle} />
            </View>
          </View>
        </ImageBackground>

        <View style={styles.grid}>
          {shortcuts.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <TouchableOpacity style={[styles.shortcutCard, { backgroundColor: item.background }]}> 
                <Text style={[styles.shortcutIcon, { color: item.color }]}>{item.icon}</Text>
              </TouchableOpacity>
              <Text style={styles.shortcutLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {discoveryFilters.map((filter) => (
            <TagPill key={filter} label={filter} />
          ))}
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

        <AppFooter />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  deliveryLabel: {
    color: colors.muted,
    fontSize: 13,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryAddress: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  deliveryChevron: {
    marginLeft: spacing.xs,
    fontSize: 18,
    color: colors.primary,
  },
  phoneButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE8DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIcon: {
    fontSize: 18,
    color: colors.primary,
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
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: spacing.lg,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    width: '70%',
  },
  heroFooter: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaButton: {
    backgroundColor: '#FFE8DA',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 18,
  },
  ctaLabel: {
    color: colors.primary,
    fontWeight: '800',
  },
  accentImage: {
    width: 96,
    height: 64,
    borderRadius: 12,
  },
  accentImageStyle: {
    borderRadius: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shortcutCard: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutIcon: {
    fontSize: 26,
  },
  shortcutLabel: {
    marginTop: spacing.xs,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    fontSize: 13,
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});

export default HomeScreen;
