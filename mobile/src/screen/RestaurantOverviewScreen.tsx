import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useAuth } from '../context';

const RestaurantOverviewScreen: React.FC = () => {
  const { user } = useAuth();

  const overviewStats = useMemo(
    () => [
      { label: 'Doanh thu', value: '1.449.000 đ' },
      { label: 'Đơn đang xử lý', value: '4' },
      { label: 'Đánh giá', value: '4.6/5', helper: '98% khách hài lòng' },
    ],
    []
  );

  const quickActions = useMemo(
    () => [
      { label: 'Tạo món mới' },
      { label: 'Quản lý khuyến mãi' },
    ],
    []
  );

  const recentOrders = useMemo(
    () => [
      { code: 'Đơn 05', customer: 'Mai Anh', amount: '189.000 đ', status: 'Chờ xác nhận' },
      { code: 'Đơn 04', customer: 'Mai Anh', amount: '189.000 đ', status: 'Đang chế biến' },
      { code: 'Đơn 03', customer: 'Bảo Long', amount: '208.000 đ', status: 'Đang giao' },
      { code: 'Đơn 02', customer: 'Thuỳ Trang', amount: '189.000 đ', status: 'Đã giao' },
    ],
    []
  );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>{user?.username ?? 'Nhà hàng'}</Text>
          <Text style={styles.subtitle}>
            Drone pad: {user?.address ?? '—'} · Liên hệ: {user?.phone ?? '—'}
          </Text>

          <View style={styles.statRow}>
            {overviewStats.map((item) => (
              <View key={item.label} style={styles.statCard}>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
                {item.helper ? <Text style={styles.statHelper}>{item.helper}</Text> : null}
              </View>
            ))}
          </View>

          <View style={styles.actionsRow}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.label} style={styles.actionButton} activeOpacity={0.85}>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Đơn gần đây</Text>
          <View style={styles.orderList}>
            {recentOrders.map((item) => (
              <View key={item.code} style={styles.orderRow}>
                <View>
                  <Text style={styles.orderCode}>{item.code}</Text>
                  <Text style={styles.orderCustomer}>{item.customer}</Text>
                </View>
                <View style={styles.orderMeta}>
                  <Text style={styles.orderAmount}>{item.amount}</Text>
                  <Text style={styles.orderStatus}>{item.status}</Text>
                </View>
              </View>
            ))}
          </View>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.md,
  },
  statLabel: {
    color: colors.muted,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  statHelper: {
    marginTop: 4,
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 22,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  actionLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  orderList: {
    gap: spacing.sm,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.md,
    alignItems: 'center',
  },
  orderCode: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  orderCustomer: {
    marginTop: 4,
    color: colors.muted,
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontWeight: '700',
    color: colors.primary,
  },
  orderStatus: {
    marginTop: 4,
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default RestaurantOverviewScreen;
