import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

const statuses = ['Tất cả', 'Chờ xác nhận', 'Đang chế biến', 'Đang giao', 'Đã giao'];

const RestaurantOrdersScreen: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState('Tất cả');

  const orders = useMemo(
    () => [
      { code: 'Đơn 05', customer: 'Mai Anh', amount: '189.000 đ', status: 'Chờ xác nhận', time: '5 phút trước' },
      { code: 'Đơn 04', customer: 'Mai Anh', amount: '189.000 đ', status: 'Đang chế biến', time: '12 phút trước' },
      { code: 'Đơn 03', customer: 'Bảo Long', amount: '208.000 đ', status: 'Đang giao', time: '20 phút trước' },
      { code: 'Đơn 02', customer: 'Thuỳ Trang', amount: '189.000 đ', status: 'Đã giao', time: '1 giờ trước' },
    ],
    []
  );

  const filteredOrders = useMemo(() => {
    if (activeStatus === 'Tất cả') {
      return orders;
    }
    return orders.filter((item) => item.status === activeStatus);
  }, [activeStatus, orders]);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Quản lý đơn hàng</Text>
        <Text style={styles.subtitle}>Theo dõi tiến độ chế biến và giao nhận trong ngày.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {statuses.map((status) => {
            const isActive = status === activeStatus;
            return (
              <TouchableOpacity
                key={status}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveStatus(status)}
                activeOpacity={0.85}
              >
                <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>{status}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          {filteredOrders.map((item) => (
            <View key={item.code} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderCode}>{item.code}</Text>
                <Text style={styles.orderAmount}>{item.amount}</Text>
              </View>
              <Text style={styles.orderCustomer}>{item.customer}</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderStatus}>{item.status}</Text>
                <Text style={styles.orderTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
  },
  filterRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterLabel: {
    color: colors.muted,
    fontWeight: '600',
  },
  filterLabelActive: {
    color: '#fff',
  },
  list: {
    gap: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 4,
    gap: spacing.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderCode: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  orderAmount: {
    color: colors.primary,
    fontWeight: '700',
  },
  orderCustomer: {
    color: colors.muted,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderStatus: {
    color: colors.accent,
    fontWeight: '700',
  },
  orderTime: {
    color: colors.muted,
  },
});

export default RestaurantOrdersScreen;
