import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeaderBar from '../components/HeaderBar';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import shadows from '../theme/shadows';
import { RootStackParamList } from '../navigation/types';

const ORDERS = [
  {
    id: 'FF-20240901',
    date: '12/09/2024',
    status: 'Hoàn thành',
    statusColor: colors.success,
    total: '185.000đ',
    items: ['Bún bò Huế đặc biệt', 'Nước sâm bí đao'],
  },
  {
    id: 'FF-20240817',
    date: '28/08/2024',
    status: 'Đang giao',
    statusColor: colors.primary,
    total: '132.000đ',
    items: ['Cơm gà xối mỡ', 'Trà chanh mật ong'],
  },
  {
    id: 'FF-20240802',
    date: '05/08/2024',
    status: 'Đã hủy',
    statusColor: '#D62828',
    total: '96.000đ',
    items: ['Bánh mì đặc biệt', 'Cà phê sữa đá'],
  },
];

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <HeaderBar title="Lịch sử đặt món" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {ORDERS.map((order) => (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={[styles.orderStatus, { color: order.statusColor }]}>{order.status}</Text>
            </View>
            <Text style={styles.metaText}>Ngày đặt: {order.date}</Text>
            <View style={styles.divider} />
            <View style={styles.itemList}>
              {order.items.map((item) => (
                <Text key={item} style={styles.itemText}>
                  • {item}
                </Text>
              ))}
            </View>
            <Text style={styles.totalLabel}>Tổng cộng: <Text style={styles.totalValue}>{order.total}</Text></Text>
          </View>
        ))}
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
  helperText: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.md,
  },
});

export default OrderHistoryScreen;
