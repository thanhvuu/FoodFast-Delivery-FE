import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import HeaderBar from '../components/HeaderBar';
import TagPill from '../components/TagPill';
import FoodCard from '../components/FoodCard';
import spacing from '../theme/spacing';
import colors from '../theme/colors';
import { CustomerHomeStackParamList } from '../navigation/types';
import { allFoods, normalizeCategory } from '../data/menu';
import { discoveryFilters } from '../data/home';
import useProducts from '../hooks/useProducts';

const CategoryScreen: React.FC<
  NativeStackScreenProps<CustomerHomeStackParamList, 'CategoryListing'>
> = ({ route, navigation }) => {
  const initialCategory = route.params?.category ?? discoveryFilters[0];
  const [activeCategory, setActiveCategory] = React.useState(initialCategory);
  const [priceSort, setPriceSort] = React.useState<'none' | 'asc' | 'desc'>('none');
  const { products } = useProducts();
  const menu = React.useMemo(() => (products?.length ? products : allFoods), [products]);

  React.useEffect(() => {
    if (route.params?.category) {
      setActiveCategory(route.params.category);
    }
  }, [route.params?.category]);

  const filteredFoods = React.useMemo(() => {
    const normalized = normalizeCategory(activeCategory);
    return menu.filter((item) => normalizeCategory(item.category) === normalized);
  }, [activeCategory, menu]);

  const sortedFoods = React.useMemo(() => {
    const items = [...filteredFoods];

    if (priceSort === 'asc') {
      return items.sort((a, b) => a.price - b.price);
    }

    if (priceSort === 'desc') {
      return items.sort((a, b) => b.price - a.price);
    }

    return items;
  }, [filteredFoods, priceSort]);

  const handleSelectSort = (value: 'asc' | 'desc') => {
    setPriceSort((current) => (current === value ? 'none' : value));
  };

  return (
    <ScreenContainer>
      <HeaderBar title={activeCategory} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {discoveryFilters.map((filter) => (
            <TagPill
              key={filter}
              label={filter}
              isActive={activeCategory === filter}
              onPress={() => setActiveCategory(filter)}
            />
          ))}
        </ScrollView>

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sắp xếp giá</Text>
          <View style={styles.sortButtons}>
            <TagPill
              label="Tăng dần"
              isActive={priceSort === 'asc'}
              onPress={() => handleSelectSort('asc')}
            />
            <TagPill
              label="Giảm dần"
              isActive={priceSort === 'desc'}
              onPress={() => handleSelectSort('desc')}
            />
          </View>
        </View>

        <View style={styles.listWrapper}>
          {sortedFoods.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có món nào trong danh mục này.</Text>
          ) : (
            sortedFoods.map((item) => (
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
  filterRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sortRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortLabel: {
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.sm,
  },
  sortButtons: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default CategoryScreen;
