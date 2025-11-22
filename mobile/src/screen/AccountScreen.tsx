import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import shadows from '../theme/shadows';
import { AccountStackParamList } from '../navigation/types';
import { useAuth } from '../context';

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AccountStackParamList>>();
  const { user, logout } = useAuth();

  const actions = useMemo(
    () => [
      {
        key: 'profile',
        title: 'Cập nhật thông tin',
        description: 'Điền đủ thông tin để được lưu lại ưng ý.',
        onPress: () => navigation.navigate('Account'),
      },
      {
        key: 'tracking',
        title: 'Theo dõi đơn hàng',
        description: 'Kiểm tra trạng thái đơn hàng hiện tại của bạn.',
        onPress: () => navigation.navigate('Tracking'),
      },
      {
        key: 'history',
        title: 'Đơn đã đặt',
        description: 'Xem lại các đơn hàng và đặt lại món yêu thích.',
        onPress: () => navigation.navigate('OrderHistory'),
      },
    ],
    [navigation],
  );

  const displayName = user?.username || user?.email || 'Người dùng FoodFast';

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroGreeting}>Xin chào</Text>
        <Text style={styles.heroName}>{displayName}</Text>
        <Text style={styles.heroHandle}>@foodfast</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>Tài khoản của tôi</Text>
          <Text style={styles.sectionHint}>Cập nhật ngay</Text>
        </View>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.key}
            style={styles.actionCard}
            onPress={action.onPress}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </View>
            <Text style={styles.actionIndicator}>›</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.9} onPress={logout}>
          <Text style={styles.logoutLabel}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  heroGreeting: {
    color: '#fff',
    opacity: 0.9,
  },
  heroName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  heroHandle: {
    color: '#fff',
    marginTop: 4,
    opacity: 0.85,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  sectionHint: {
    color: colors.primary,
    fontWeight: '700',
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.card,
  },
  actionContent: {
    flex: 1,
    paddingRight: spacing.md,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  actionDescription: {
    color: colors.muted,
    lineHeight: 20,
  },
  actionIndicator: {
    fontSize: 22,
    color: colors.muted,
  },
  logoutButton: {
    marginTop: spacing.lg,
    backgroundColor: '#fff4ed',
    paddingVertical: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD2B2',
  },
  logoutLabel: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
});

export default AccountScreen;
