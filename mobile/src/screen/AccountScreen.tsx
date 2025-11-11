import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderBar from '../components/HeaderBar';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import shadows from '../theme/shadows';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context';

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const actions = useMemo(
    () => [
      {
        key: 'tracking',
        title: 'Theo dõi đơn hàng',
        description: 'Kiểm tra trạng thái đơn hàng hiện tại của bạn theo thời gian thực.',
        onPress: () => navigation.navigate('Tracking'),
      },
      {
        key: 'history',
        title: 'Lịch sử đặt món',
        description: 'Xem lại các món ăn đã đặt và đặt lại chỉ với một chạm.',
        onPress: () => navigation.navigate('OrderHistory'),
      },
    ],
    [navigation],
  );

  const displayName = user?.username || user?.email || 'Người dùng FoodFast';

  return (
    <View style={styles.container}>
      <HeaderBar title="Tài khoản" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{displayName}</Text>
            {user?.email ? <Text style={styles.profileMeta}>{user.email}</Text> : null}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiện ích</Text>
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
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 24,
    ...shadows.card,
    marginBottom: spacing.xl,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFE8DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  profileMeta: {
    marginTop: 4,
    color: colors.muted,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
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
});

export default AccountScreen;
