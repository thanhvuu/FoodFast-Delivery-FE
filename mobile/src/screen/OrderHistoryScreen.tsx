import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import shadows from '../theme/shadows';
import useOrders from '../hooks/useOrders';
import type { CustomerHomeStackParamList } from '../navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const statusColor = (status?: string) => {
  if (!status) return colors.muted;
  if (status === 'delivered') return colors.success;
  if (status === 'on-the-way' || status === 'preparing') return colors.primary;
  if (status === 'pending') return colors.accent;
  return colors.text;
};

const formatDate = (value?: string) => {
  if (!value) return 'Chưa rõ ngày';
  const date = new Date(value);
  if (!Number.isFinite(date.valueOf())) return 'Chưa rõ ngày';
  return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
};

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<CustomerHomeStackParamList>>();
  const { orders, reload, cancelOrder } = useOrders();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  if (!orders.length) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Đơn hàng</Text>
          <Text style={styles.subtitle}>Bạn chưa có đơn nào. Hãy đặt món để theo dõi lịch sử.</Text>
        </View>
        <View style={styles.emptyState}>
          <TouchableOpacity style={styles.trackButton} onPress={() => navigation.navigate('Home')} activeOpacity={0.9}>
            <Text style={styles.trackButtonLabel}>Mua món ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Đơn hàng</Text>
        <Text style={styles.subtitle}>Theo dõi và xem lại các đơn đã đặt</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {orders.map((order) => {
          const canCancel = order.status === 'pending';
          return (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={[styles.orderStatus, { color: statusColor(order.trackingStatus ?? order.status) }]}>
                {order.trackingStatus ?? order.status}
              </Text>
            </View>
            <Text style={styles.metaText}>Ngày đặt: {formatDate(order.placedAt)}</Text>
            <View style={styles.divider} />
            <View style={styles.itemList}>
              {order.items.map((item) => (
                <Text key={`${order.id}-${item.productId}`} style={styles.itemText}>
                  • {item.quantity}x {item.productId}
                </Text>
              ))}
            </View>
            <Text style={styles.totalLabel}>
              Tổng cộng: <Text style={styles.totalValue}>{order.total.toLocaleString('vi-VN')}₫</Text>
            </Text>
            <TouchableOpacity
              style={styles.trackButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Tracking', { orderId: order.id })}
            >
              <Text style={styles.trackButtonLabel}>Theo dõi đơn này</Text>
            </TouchableOpacity>
            {canCancel ? (
              <TouchableOpacity
                style={[styles.trackButton, styles.cancelButton]}
                activeOpacity={0.85}
                onPress={() => cancelOrder(order.id)}
              >
                <Text style={[styles.trackButtonLabel, styles.cancelButtonLabel]}>Hủy đơn</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )})}
        <Text style={styles.helperText}>
          Bạn có thể đặt lại món yêu thích từ danh sách này hoặc theo dõi đơn đang giao trong mục "Theo dõi đơn hàng".
        </Text>
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
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  orderStatus: {
    fontWeight: '700',
  },
  metaText: {
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  itemList: {
    marginBottom: spacing.sm,
  },
  itemText: {
    color: colors.text,
    marginBottom: 4,
  },
  totalLabel: {
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    color: colors.primary,
  },
  trackButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  trackButtonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#FFE8E6',
    marginTop: spacing.sm,
  },
  cancelButtonLabel: {
    color: '#D62828',
  },
  helperText: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.md,
  },
});

export default OrderHistoryScreen;
