import React, { useMemo } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import HeaderBar from '../components/HeaderBar';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { CustomerHomeStackParamList, CustomerTabParamList } from '../navigation/types';
import { allFoods, featured, popular, normalizeCategory } from '../data/menu';
import FoodCard from '../components/FoodCard';
import { useCart } from '../context/CartContext';
import useProducts from '../hooks/useProducts';

type Props = NativeStackScreenProps<CustomerHomeStackParamList, 'FoodDetail'>;

const FoodDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { products, reload } = useProducts();
  const allFood = useMemo(() => (products?.length ? products : allFoods), [products]);
  const tabNavigation = useNavigation<BottomTabNavigationProp<CustomerTabParamList>>();
  const fallbackFood = allFoods[0] ?? featured[0] ?? popular[0];
  const selected = useMemo(() => {
    const params = route.params;
    if (params?.id) {
      return allFood.find((item) => item.id === params.id) ?? allFood[0] ?? fallbackFood;
    }
    if (params?.category) {
      const normalized = normalizeCategory(params.category);
      const match = allFood.find((item) => normalizeCategory(item.category) === normalized);
      if (match) return match;
    }
    return allFood[0] ?? fallbackFood;
  }, [route.params?.id, route.params?.category, allFood, fallbackFood]);

  const recommendations = useMemo(
    () => allFood.filter((item) => item.id !== selected.id).slice(0, 3),
    [selected.id],
  );
  const { addItem } = useCart();

  const priceNumber = typeof selected.price === 'number' ? selected.price : Number(selected.price ?? 0);
  const ratingNumber = typeof selected.rating === 'number' ? selected.rating : Number(selected.rating ?? 0);
  const votesNumber = typeof selected.votes === 'number' ? selected.votes : Number(selected.votes ?? 0);
  const ratingLabel = Number.isFinite(ratingNumber) ? ratingNumber.toFixed(1) : '0.0';
  const votesLabel = Number.isFinite(votesNumber) ? votesNumber : 0;
  const priceLabel = Number.isFinite(priceNumber) ? priceNumber.toLocaleString('vi-VN') : '0';

  const handleAddToCart = () => {
    addItem(selected);
    Alert.alert('Thành công', `${selected.name} đã được thêm vào giỏ hàng.`, [
      { text: 'Tiếp tục chọn món' },
      { text: 'Xem giỏ hàng', onPress: () => tabNavigation.navigate('CartTab') },
    ]);
  };

  return (
    <ScreenContainer>
      <HeaderBar title="Chi tiết món" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.refreshRow}>
          <TouchableOpacity style={styles.reloadButton} onPress={reload} activeOpacity={0.85}>
            <Text style={styles.reloadLabel}>Làm mới món</Text>
          </TouchableOpacity>
        </View>
        <Image source={{ uri: selected.image }} style={styles.heroImage} />
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.category}>{selected.category}</Text>
              <Text style={styles.title}>{selected.name}</Text>
            </View>
            <View style={styles.pricePill}>
              <Text style={styles.price}>{priceLabel}₫</Text>
            </View>
          </View>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>★ {ratingLabel}</Text>
            <Text style={styles.votes}>({votesLabel} đánh giá)</Text>
          </View>
          <Text style={styles.description}>{selected.description}</Text>
          <View style={styles.metaBlock}>
            <View style={[styles.metaItem, styles.metaItemLeft]}>
              <Text style={styles.metaLabel}>Thời gian chuẩn bị</Text>
              <Text style={styles.metaValue}>15 - 20 phút</Text>
            </View>
            <View style={[styles.metaItem, styles.metaItemRight]}>
              <Text style={styles.metaLabel}>Khẩu phần</Text>
              <Text style={styles.metaValue}>2 người</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9} onPress={handleAddToCart}>
            <Text style={styles.ctaLabel}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Đề xuất dành cho bạn</Text>
        <View style={styles.recommendations}>
          {recommendations.map((item) => (
            <View key={item.id} style={styles.recommendationItem}>
              <FoodCard item={item} onPress={() => navigation.replace('FoodDetail', { id: item.id })} />
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  refreshRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    alignItems: 'flex-end',
  },
  reloadButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#EEF6FF',
    borderRadius: 12,
  },
  reloadLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  heroImage: {
    width: '90%',
    height: 220,
    borderRadius: 24,
    marginVertical: spacing.lg,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: 32,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  category: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  pricePill: {
    backgroundColor: '#FFE8DA',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.xs,
  },
  votes: {
    fontSize: 12,
    color: colors.muted,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  metaBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaItemLeft: {
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    paddingRight: spacing.md,
  },
  metaItemRight: {
    paddingLeft: spacing.md,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  recommendations: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  recommendationItem: {
    flex: 1,
  },
});

export default FoodDetailScreen;
