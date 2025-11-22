import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import shadows from '../theme/shadows';

const notifications = [
  {
    id: 'promo-1',
    title: 'Flash Sale giờ trưa',
    message: 'Đặt món ngay để nhận ưu đãi freeship trong 30 phút tới.',
    tone: '#FF6B35',
  },
  {
    id: 'order-tip',
    title: 'Mẹo săn quán ngon',
    message: 'Thêm món vào mục yêu thích để nhận thông báo khuyến mãi sớm nhất.',
    tone: '#1E7FFF',
  },
];

const NotificationScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thông báo</Text>
        <Text style={styles.subtitle}>Nhận tin khuyến mãi và cập nhật đơn hàng</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={[styles.badge, { backgroundColor: `${item.tone}1A`, borderColor: item.tone }]}>
              <Text style={[styles.badgeLabel, { color: item.tone }]}>Mới</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMessage}>{item.message}</Text>
          </View>
        ))}
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Bạn đã xem hết thông báo</Text>
          <Text style={styles.emptyDescription}>
            Khi có ưu đãi mới, chúng tôi sẽ gửi tới bạn ngay tại đây.
          </Text>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    color: colors.muted,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  badgeLabel: {
    fontWeight: '800',
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardMessage: {
    color: colors.muted,
    lineHeight: 20,
  },
  emptyBox: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: '#F8F9FD',
    alignItems: 'center',
  },
  emptyTitle: {
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  emptyDescription: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationScreen;
