import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

const AdminRestaurantsScreen: React.FC = () => {
  const restaurantList = useMemo(
    () => [
      {
        name: 'FastGrill Station',
        address: 'Pad-05, Thủ Đức',
        revenue: '1.449.000 đ',
        orders: 4,
        satisfaction: '98% hài lòng',
      },
      {
        name: 'Sushi Express',
        address: 'Pad-09, Quận 1',
        revenue: '1.102.000 đ',
        orders: 3,
        satisfaction: '94% hài lòng',
      },
      {
        name: 'Healthy Bowl',
        address: 'Pad-12, Bình Thạnh',
        revenue: '958.000 đ',
        orders: 5,
        satisfaction: '96% hài lòng',
      },
    ],
    []
  );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Quản lý nhà hàng</Text>
          <Text style={styles.subtitle}>Theo dõi hiệu suất và trạng thái vận hành của từng đối tác.</Text>
        </View>

        {restaurantList.map((item) => (
          <View key={item.name} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <Text style={styles.restaurantAddress}>{item.address}</Text>
              </View>
              <TouchableOpacity style={styles.manageButton} activeOpacity={0.85}>
                <Text style={styles.manageLabel}>Quản lý</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Doanh thu</Text>
                <Text style={styles.infoValue}>{item.revenue}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Đơn xử lý</Text>
                <Text style={styles.infoValue}>{item.orders}</Text>
              </View>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>Đánh giá: {item.satisfaction}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  restaurantAddress: {
    color: colors.muted,
    marginTop: 4,
  },
  manageButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  manageLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  infoItem: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  infoLabel: {
    color: colors.muted,
    fontWeight: '600',
  },
  infoValue: {
    marginTop: spacing.xs,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    backgroundColor: 'rgba(68, 140, 255, 0.12)',
    borderRadius: 18,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
  },
  badgeLabel: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});

export default AdminRestaurantsScreen;
