import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import HeaderBar from '../components/HeaderBar';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useCart } from '../context';
import type { CartStackParamList, CustomerTabParamList } from '../navigation/types';
import useOrders from '../hooks/useOrders';

const DELIVERY_METHODS = [
  {
    key: 'drone',
    label: 'Giao bằng drone',
    icon: '🚁',
    highlight: 'Nhanh nhất',
    description: '10 - 15 phút, theo dõi trực tiếp',
  },
  {
    key: 'motorbike',
    label: 'Giao xe máy',
    icon: '🛵',
    highlight: 'Tiết kiệm',
    description: '25 - 35 phút, phù hợp nội thành',
  },
] as const;

type DeliveryMethodKey = (typeof DELIVERY_METHODS)[number]['key'];

type Props = NativeStackScreenProps<CartStackParamList, 'Checkout'>;

type CheckoutForm = {
  fullName: string;
  phone: string;
  address: string;
  note: string;
};

const INITIAL_FORM: CheckoutForm = {
  fullName: '',
  phone: '',
  address: '',
  note: '',
};

const calculateDeliveryFee = (method: DeliveryMethodKey, subtotal: number) => {
  if (subtotal <= 0) {
    return 0;
  }

  if (method === 'drone') {
    if (subtotal >= 150000) {
      return 35000;
    }
    return 45000;
  }

  if (subtotal >= 120000) {
    return 0;
  }
  return 15000;
};

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const tabNavigation = useNavigation<BottomTabNavigationProp<CustomerTabParamList>>();
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodKey>('drone');
  const [paymentMethod] = useState<'online' | 'cod'>('online');
  const { placeOrder, isPlacing, error: orderError } = useOrders();

  const deliveryFee = useMemo(() => calculateDeliveryFee(deliveryMethod, subtotal), [deliveryMethod, subtotal]);
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const handleChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
      Alert.alert('Giỏ hàng trống', 'Hãy chọn món trước khi đặt drone nhé.');
      return;
    }

    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }

    const order = await placeOrder({
      cartItems: items,
      subtotal,
      deliveryFee,
      total,
      deliveryMethod,
      // luôn thanh toán online như yêu cầu
      // (paymentMethod lưu trong hook là 'online')
      customer: {
        name: form.fullName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        note: form.note.trim(),
      },
    });

    if (!order) {
      Alert.alert('Đặt hàng thất bại', 'Vui lòng thử lại sau ít phút.');
      return;
    }

    const summary = `Đơn ${order.id}\nTổng thanh toán: ${order.total.toLocaleString('vi-VN')}₫`;

    Alert.alert('Đặt hàng thành công', summary, [
      {
        text: 'Theo dõi đơn',
        onPress: () => {
          clearCart();
          navigation.navigate('Tracking', { orderId: order.id });
        },
      },
      {
        text: 'Về trang chủ',
        style: 'cancel',
        onPress: () => {
          clearCart();
          tabNavigation.navigate('HomeTab');
        },
      },
    ]);
  };

  const renderOrderItems = () =>
    items.map((item) => (
      <View key={item.id} style={styles.orderItemRow}>
        <View style={styles.orderItemInfo}>
          <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
          <Text style={styles.orderItemName}>{item.name}</Text>
        </View>
        <Text style={styles.orderItemPrice}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</Text>
      </View>
    ));

  if (!items.length) {
    return (
      <ScreenContainer>
        <HeaderBar title="Đặt drone" onBackPress={() => navigation.goBack()} showAuthControls={false} showCartButton={false} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Bạn chưa có món nào trong giỏ.</Text>
          <Text style={styles.emptySubtitle}>Hãy quay lại thực đơn và thêm món trước khi đặt drone nhé!</Text>
          <TouchableOpacity onPress={() => tabNavigation.navigate('HomeTab')} style={styles.emptyCta} activeOpacity={0.85}>
            <Text style={styles.emptyCtaLabel}>Khám phá thực đơn</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <HeaderBar
        title="Đặt drone"
        onBackPress={() => navigation.goBack()}
        showAuthControls={false}
        showCartButton={false}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
        <View style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Họ và tên</Text>
            <TextInput
              value={form.fullName}
              onChangeText={(value) => handleChange('fullName', value)}
              placeholder="Nhập họ tên người nhận"
              style={styles.input}
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={styles.fieldRow}>
            <View style={[styles.field, styles.fieldHalf]}>
              <Text style={styles.fieldLabel}>Số điện thoại</Text>
              <TextInput
                value={form.phone}
                onChangeText={(value) => handleChange('phone', value)}
                placeholder="Ví dụ: 0901 234 567"
                style={styles.input}
                keyboardType="phone-pad"
                placeholderTextColor={colors.muted}
              />
            </View>
            <View style={[styles.field, styles.fieldHalf]}>
              <Text style={styles.fieldLabel}>Ghi chú</Text>
              <TextInput
                value={form.note}
                onChangeText={(value) => handleChange('note', value)}
                placeholder="Thời gian nhận, lưu ý..."
                style={styles.input}
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Địa chỉ</Text>
            <TextInput
              value={form.address}
              onChangeText={(value) => handleChange('address', value)}
              placeholder="Số nhà, tên đường, phường/xã"
              style={[styles.input, styles.inputMultiline]}
              placeholderTextColor={colors.muted}
              multiline
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Chọn phương thức giao</Text>
        <View style={styles.methodGrid}>
          {DELIVERY_METHODS.map((method, index) => {
            const isActive = method.key === deliveryMethod;
            const isLast = index === DELIVERY_METHODS.length - 1;
            return (
              <TouchableOpacity
                key={method.key}
                style={[styles.methodCard, !isLast && styles.methodCardSpacing, isActive && styles.methodCardActive]}
                onPress={() => setDeliveryMethod(method.key)}
                activeOpacity={0.9}
              >
                <View style={styles.methodHeader}>
                  <Text style={styles.methodIcon}>{method.icon}</Text>
                  <View style={styles.methodHeaderText}>
                    <Text style={styles.methodLabel}>{method.label}</Text>
                    <Text style={styles.methodHighlight}>{method.highlight}</Text>
                  </View>
                </View>
                <Text style={styles.methodDescription}>{method.description}</Text>
                {isActive ? <Text style={styles.methodActiveBadge}>Đang chọn</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.mapCard}>
          <Text style={styles.mapTitle}>Lộ trình bay dự kiến</Text>
          <Text style={styles.mapDescription}>
            Drone sẽ khởi hành từ bếp trung tâm và hạ cánh gần địa chỉ {form.address || 'của bạn'}.
            Bạn có thể theo dõi trạng thái từng giai đoạn ngay sau khi đặt hàng.
          </Text>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderLabel}>Bản đồ mô phỏng đường bay</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
          {renderOrderItems()}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{subtotal.toLocaleString('vi-VN')}₫</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {deliveryMethod === 'drone' ? 'Phí drone siêu tốc' : 'Phí giao tiêu chuẩn'}
            </Text>
            <Text style={styles.summaryValue}>{deliveryFee > 0 ? `${deliveryFee.toLocaleString('vi-VN')}₫` : 'Miễn phí'}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowTotal]}>
            <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
            <Text style={styles.summaryTotalValue}>{total.toLocaleString('vi-VN')}₫</Text>
          </View>
          {orderError ? <Text style={styles.errorText}>{orderError}</Text> : null}
          <TouchableOpacity
            style={[styles.submitButton, isPlacing && styles.submitButtonDisabled]}
            onPress={handlePlaceOrder}
            activeOpacity={0.9}
            disabled={isPlacing}
          >
            <Text style={styles.submitButtonLabel}>
              {isPlacing ? 'Đang đặt...' : 'Đặt drone ngay'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.md,
  },
  fieldRow: {
    flexDirection: 'row',
    marginHorizontal: -spacing.sm,
  },
  fieldHalf: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  fieldLabel: {
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: '#F4F5FC',
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  methodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  methodCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  methodCardSpacing: {
    marginRight: spacing.md,
  },
  methodCardActive: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  methodHeaderText: {
    marginLeft: spacing.sm,
  },
  methodIcon: {
    fontSize: 24,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  methodHighlight: {
    color: colors.accent,
    marginTop: 2,
    fontWeight: '600',
  },
  methodDescription: {
    color: colors.muted,
    lineHeight: 20,
  },
  methodActiveBadge: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: '#FFE8DA',
    color: colors.primary,
    fontWeight: '600',
  },
  mapCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  mapDescription: {
    color: colors.muted,
    lineHeight: 20,
  },
  mapPlaceholder: {
    marginTop: spacing.md,
    height: 160,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E6F3',
    backgroundColor: '#F4F6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderLabel: {
    color: colors.accent,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  orderItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemQuantity: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F4F5FC',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '700',
    color: colors.primary,
    marginRight: spacing.sm,
  },
  orderItemName: {
    color: colors.text,
    fontWeight: '600',
    maxWidth: 180,
  },
  orderItemPrice: {
    color: colors.text,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  summaryRowTotal: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF8',
  },
  summaryLabel: {
    color: colors.muted,
  },
  summaryValue: {
    color: colors.text,
    fontWeight: '600',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 28,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: spacing.sm,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyCta: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 28,
  },
  emptyCtaLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default CheckoutScreen;
