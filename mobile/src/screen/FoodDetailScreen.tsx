import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import HeaderBar from '../components/HeaderBar';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { RootStackParamList } from '../navigation/AppNavigator';
import { featured, popular } from '../data/menu';
import FoodCard from '../components/FoodCard';

const allFood = [...featured, ...popular];

type Props = NativeStackScreenProps<RootStackParamList, 'FoodDetail'>;

const FoodDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const selected = useMemo(() => {
    if (!route.params?.id) {
      return allFood[0];
    }
    return allFood.find((item) => item.id === route.params?.id) ?? allFood[0];
  }, [route.params?.id]);

  const recommendations = useMemo(() => allFood.filter((item) => item.id !== selected.id).slice(0, 3), [selected.id]);

  return (
    <ScreenContainer>
      <HeaderBar title="Chi tiết món" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: selected.image }} style={styles.heroImage} />
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.category}>{selected.category}</Text>
              <Text style={styles.title}>{selected.name}</Text>
            </View>
            <View style={styles.pricePill}>
              <Text style={styles.price}>{selected.price.toLocaleString('vi-VN')}₫</Text>
            </View>
          </View>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>★ {selected.rating.toFixed(1)}</Text>
            <Text style={styles.votes}>({selected.votes} đánh giá)</Text>
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
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
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
  heroImage: {
    width: '90%',
    height: 220,
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: 32,
    padding: spacing.xl,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  category: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: spacing.xs,
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  pricePill: {
    backgroundColor: '#FFE8DA',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  price: {
    color: colors.primary,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  rating: {
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.xs,
  },
  votes: {
    color: colors.muted,
  },
  description: {
    marginTop: spacing.md,
    color: colors.muted,
    lineHeight: 22,
    fontSize: 14,
  },
  metaBlock: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    justifyContent: 'space-between',
  },
  metaItem: {
    backgroundColor: '#F4F5FC',
    padding: spacing.md,
    borderRadius: 20,
    flex: 1,
  },
  metaItemLeft: {
    marginRight: spacing.sm,
  },
  metaItemRight: {
    marginLeft: spacing.sm,
  },
  metaLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  metaValue: {
    color: colors.text,
    fontWeight: '700',
  },
  ctaButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 32,
    alignItems: 'center',
  },
  ctaLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  sectionTitle: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  recommendations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  recommendationItem: {
    width: '48%',
    marginTop: spacing.lg,
  },
});

export default FoodDetailScreen;