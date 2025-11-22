import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useAuth } from '../context';

const AdminDashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const overviewStats = useMemo(
    () => [
      { label: 'Tổng đơn', value: '7' },
      { label: 'Đơn đã giao', value: '4' },
      { label: 'Đơn đang giao', value: '2' },
      { label: 'Đơn huỷ', value: '1' },
      { label: 'Nhà hàng', value: '3' },
      { label: 'Đối tác', value: '5' },
      { label: 'Đội drone', value: '4' },
    ],
    []
  );

  const recentOrders = useMemo(
    () => [
      { code: 'Đơn 05', customer: 'Mai Anh', amount: '189.000 đ', status: 'Chờ xác nhận' },
      { code: 'Đơn 04', customer: 'Minh Tuấn', amount: '208.000 đ', status: 'Đang giao' },
      { code: 'Đơn 03', customer: 'Thuỳ Linh', amount: '168.000 đ', status: 'Đã giao' },
      { code: 'Đơn 02', customer: 'Hoàng Nam', amount: '197.000 đ', status: 'Đã giao' },
    ],
    []
  );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hồ sơ quản trị</Text>
          <Text style={styles.sectionDescription}>
            Thông tin quản trị viên về tổng quan hệ thống FoodFast.
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Họ và tên</Text>
            <Text style={styles.infoValue}>{user?.username ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số điện thoại</Text>
            <Text style={styles.infoValue}>{user?.phone ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Địa chỉ</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {user?.address ?? '—'}
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.85}>
            <Text style={styles.logoutLabel}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tổng quan hệ thống</Text>
          <Text style={styles.sectionDescription}>Theo dõi hoạt động toàn hệ thống trong hôm nay.</Text>

          <View style={styles.statsGrid}>
            {overviewStats.map((item) => (
              <View key={item.label} style={styles.statItem}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
          <Text style={styles.sectionDescription}>Danh sách cập nhật mới nhất từ các nhà hàng.</Text>

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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    color: colors.muted,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontWeight: '600',
    color: colors.muted,
    flex: 1,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    color: colors.text,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  logoutLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statItem: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  orderList: {
    gap: spacing.sm,
  },
  orderRow: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default AdminDashboardScreen;
