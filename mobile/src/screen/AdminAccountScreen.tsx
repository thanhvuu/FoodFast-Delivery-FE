import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useAuth } from '../context';

const AdminAccountScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Hồ sơ quản trị</Text>
          <Text style={styles.subtitle}>Cập nhật thông tin và cài đặt tài khoản quản trị viên.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
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
            <Text style={styles.infoValue}>{user?.address ?? '—'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bảo mật & quyền truy cập</Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Đổi mật khẩu</Text>
              <Text style={styles.settingDescription}>Đảm bảo mật khẩu mạnh và cập nhật định kỳ.</Text>
            </View>
            <TouchableOpacity style={styles.settingButton} activeOpacity={0.85}>
              <Text style={styles.settingButtonLabel}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Quản lý thành viên</Text>
              <Text style={styles.settingDescription}>Phân quyền nhân sự vận hành hệ thống.</Text>
            </View>
            <TouchableOpacity style={styles.settingButton} activeOpacity={0.85}>
              <Text style={styles.settingButtonLabel}>Thiết lập</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hỗ trợ</Text>
          <Text style={styles.supportText}>Hotline: 1900 969 948</Text>
          <Text style={styles.supportText}>Email: support@foodfast.io</Text>
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
    alignItems: 'center',
  },
  infoLabel: {
    color: colors.muted,
    fontWeight: '600',
  },
  infoValue: {
    color: colors.text,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingLabel: {
    fontWeight: '700',
    color: colors.text,
  },
  settingDescription: {
    color: colors.muted,
    marginTop: 4,
  },
  settingButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  settingButtonLabel: {
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

export default AdminAccountScreen;
