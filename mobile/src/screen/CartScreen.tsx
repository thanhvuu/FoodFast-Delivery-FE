import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
 from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import HeaderBar from '../components/HeaderBar';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useCart, type CartItem } from '../context/CartContext';
import type { RootStackParamList } from '../navigation/AppNavigator';

const DELIVERY_FEE = 15000;

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  const { deliveryFee, total } = useMemo(() => {
    const fee = items.length > 0 ? DELIVERY_FEE : 0;
    return {
      deliveryFee: fee,
      total: subtotal + fee,
    };
  }, [items.length, subtotal]);

  const renderItem: ListRenderItem<CartItem> = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemRow}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.itemPrice}>{item.price.toLocaleString('vi-VN')}₫</Text>
        </View>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            style={[styles.quantityButton, styles.quantityButtonGhost]}
            accessibilityLabel={`Giảm ${item.name}`}
          >
            <Text style={styles.quantityButtonLabel}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            style={styles.quantityButton}
            accessibilityLabel={`Tăng ${item.name}`}
          >
            <Text style={[styles.quantityButtonLabel, styles.quantityButtonLabelDark]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemFooter}>
        <Text style={styles.itemSubtotalLabel}>Thành tiền</Text>
        <View style={styles.itemFooterActions}>
          <Text style={styles.itemSubtotalValue}>
            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
          </Text>
          <TouchableOpacity
            onPress={() => removeItem(item.id)}
            style={styles.removeButton}
            accessibilityLabel={`Xóa ${item.name} khỏi giỏ hàng`}
          >
            <Text style={styles.removeButtonLabel}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const keyExtractor = (item: CartItem) => item.id;

  const handleCheckout = () => {
    if (!items.length) {
      return;
    }
    navigation.navigate('Checkout');
  };

  return (
    <ScreenContainer>
      <HeaderBar
        title="Giỏ hàng"
        onBackPress={() => navigation.goBack()}
        showAuthControls={false}
        showCartButton={false}
      />
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
          <Text style={styles.emptySubtitle}>
            Thêm những món yêu thích để bắt đầu đơn hàng đầu tiên ngay hôm nay.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.emptyCta}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyCtaLabel}>Khám phá thực đơn</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Tổng kết đơn hàng</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tạm tính</Text>
                <Text style={styles.summaryValue}>{subtotal.toLocaleString('vi-VN')}₫</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phí giao drone</Text>
                <Text style={styles.summaryValue}>
                  {deliveryFee > 0 ? `${deliveryFee.toLocaleString('vi-VN')}₫` : 'Miễn phí'}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
                <Text style={styles.summaryTotalValue}>{total.toLocaleString('vi-VN')}₫</Text>
              </View>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} activeOpacity={0.9}>
                <Text style={styles.checkoutButtonLabel}>Tiến hành đặt drone</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 18,
    marginRight: spacing.md,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  itemCategory: {
    color: colors.muted,
    marginTop: 2,
  },
  itemPrice: {
    marginTop: spacing.xs,
    color: colors.primary,
    fontWeight: '700',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5FC',
    padding: spacing.xs,
    borderRadius: 20,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE8DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonGhost: {
    backgroundColor: '#fff',
  },
  quantityButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  quantityButtonLabelDark: {
    color: colors.primary,
  },
  quantityValue: {
    marginHorizontal: spacing.sm,
    fontWeight: '700',
    color: colors.text,
  },
  itemFooter: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemFooterActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSubtotalLabel: {
    color: colors.muted,
  },
  itemSubtotalValue: {
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.md,
  },
  removeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: '#FBE7E7',
    borderRadius: 16,
  },
  removeButtonLabel: {
    color: '#D14343',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
    fontWeight: '600',
    color: colors.text,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  checkoutButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 28,
    alignItems: 'center',
  },
  checkoutButtonLabel: {
    color: '#fff',
    fontWeight: '700',
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

export default CartScreen;
