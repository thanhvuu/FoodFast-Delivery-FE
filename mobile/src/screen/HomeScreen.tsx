import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import HeaderBar from '../components/HeaderBar';
import SectionHeader from '../components/SectionHeader';
import FoodCard from '../components/FoodCard';
import TagPill from '../components/TagPill';
import AppFooter from '../components/AppFooter';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { RootStackParamList } from '../navigation/AppNavigator';
import { categories, featured, popular, FoodItem } from '../data/menu';

const heroImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Món yêu thích');

  const filteredPopular = useMemo(() => {
    if (activeCategory === 'Món yêu thích') {
      return popular;
    }
    return popular.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleSelectFood = (item: FoodItem) => {
    navigation.navigate('FoodDetail', { id: item.id });
  };

  return (
    <ScreenContainer>
      <HeaderBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ImageBackground source={{ uri: heroImage }} style={styles.hero} imageStyle={styles.heroImage}>
          <Text style={styles.heroKicker}>Đặt món yêu thích</Text>
          <Text style={styles.heroTitle}>Thưởng thức Bữa Ăn Đậm Đà</Text>
          <Text style={styles.heroSubtitle}>
            Khám phá thực đơn phong phú và giao tận nơi chỉ trong vài chạm.
          </Text>
          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Tracking')}
            >
              <Text style={styles.primaryButtonLabel}>Theo dõi đơn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Contact')}
            >
              <Text style={styles.secondaryButtonLabel}>Liên hệ</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View>
          <SectionHeader
            title="Khám phá thực đơn"
            subtitle="Chọn những món ăn phù hợp khẩu vị của cả gia đình."
          />
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => (
              <TagPill label={item} isActive={item === activeCategory} onPress={() => setActiveCategory(item)} />
            )}
          />
        </View>

        <SectionHeader title="Món nổi bật" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {featured.map((item) => (
            <View key={item.id} style={styles.featuredCard}>
              <FoodCard item={item} variant="featured" onPress={handleSelectFood} />
            </View>
          ))}
        </ScrollView>

        <SectionHeader title="Những món gần bạn" />
        <View style={styles.grid}>
          {filteredPopular.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <FoodCard item={item} onPress={handleSelectFood} />
            </View>
          ))}
        </View>

        <AppFooter />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: spacing.xl,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  heroImage: {
    borderRadius: 32,
    opacity: 0.35,
  },
  heroKicker: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: spacing.sm,
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 28,
  },
  primaryButtonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  secondaryButtonLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  categoryList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
  },
  featuredCard: {
    width: 300,
    marginRight: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: spacing.lg,
  },
});

export default HomeScreen;