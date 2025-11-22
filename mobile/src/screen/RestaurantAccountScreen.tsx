import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useAuth } from '../context';

const RestaurantAccountScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Tài khoản nhà hàng</Text>
          <Text style={styles.subtitle}>Thông tin vận hành và hỗ trợ dành cho đối tác.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin cửa hàng</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tên nhà hàng</Text>
            <Text style={styles.infoValue}>{user?.username ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Liên hệ</Text>
            <Text style={styles.infoValue}>{user?.phone ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Khu vực</Text>
            <Text style={styles.infoValue}>{user?.address ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Quản lý</Text>
            <Text style={styles.infoValue}>{user?.contactName ?? '—'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tiện ích</Text>
          <View style={styles.utilityRow}>
            <View>
              <Text style={styles.utilityLabel}>Thiết lập thực đơn</Text>
              <Text style={styles.utilityDescription}>Thêm, chỉnh sửa món ăn và phân nhóm món.</Text>
            </View>
            <TouchableOpacity style={styles.utilityButton} activeOpacity={0.85}>
              <Text style={styles.utilityButtonLabel}>Quản lý</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.utilityRow}>
            <View>
              <Text style={styles.utilityLabel}>Cấu hình ưu đãi</Text>
              <Text style={styles.utilityDescription}>Tạo mã giảm giá và lịch khuyến mãi riêng.</Text>
            </View>
            <TouchableOpacity style={styles.utilityButton} activeOpacity={0.85}>
              <Text style={styles.utilityButtonLabel}>Thiết lập</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hỗ trợ đối tác</Text>
          <Text style={styles.supportText}>Hotline: 1900 969 948</Text>
          <Text style={styles.supportText}>Email: partner@foodfast.io</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.85}>
          <Text style={styles.logoutLabel}>Đăng xuất</Text>
        </TouchableOpacity>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: colors.muted,
    fontWeight: '600',
  },
  infoValue: {
    color: colors.text,
    fontWeight: '700',
  },
  utilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  utilityLabel: {
    fontWeight: '700',
    color: colors.text,
  },
  utilityDescription: {
    color: colors.muted,
    marginTop: 4,
  },
  utilityButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  utilityButtonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  supportText: {
    color: colors.text,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: colors.primary,
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 4,
  },
  logoutLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default RestaurantAccountScreen;
