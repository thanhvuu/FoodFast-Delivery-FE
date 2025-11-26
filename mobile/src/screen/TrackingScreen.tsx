import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import HeaderBar from '../components/HeaderBar';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { CustomerHomeStackParamList } from '../navigation/types';
import StatCard from '../components/StatCard';
import OrderTimeline, { OrderStep } from '../components/OrderTimeline';
import InfoCard from '../components/InfoCard';
import AppFooter from '../components/AppFooter';
import useOrders, { StoredOrder } from '../hooks/useOrders';
import { safeNumber } from '../utils/api';

const statusRank: Record<string, number> = {
  pending: 0,
  preparing: 1,
  'ready-for-pickup': 2,
  delivering: 3,
  'on-the-way': 3,
  completed: 4,
  delivered: 4,
};

const formatTime = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (!Number.isFinite(date.valueOf())) return undefined;
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${hours}:${minutes} - ${day}/${month}`;
};

const buildSteps = (order?: StoredOrder): OrderStep[] => {
  const currentStatus = (order?.trackingStatus ?? order?.status ?? 'pending').toLowerCase();
  if (currentStatus === 'cancelled') {
    const cancelledTime = formatTime(order?.placedAt);
    return [
      { id: 'placed', title: 'Đơn hàng đã đặt', time: cancelledTime, isActive: true },
      { id: 'cancelled', title: 'Đã hủy', time: cancelledTime, isActive: true },
    ];
  }
  const normalizedStatus =
    currentStatus === 'on-the-way'
      ? 'delivering'
      : currentStatus === 'ready for pickup'
        ? 'ready-for-pickup'
        : currentStatus;
  const rank = statusRank[normalizedStatus] ?? 0;
  const placedTime = formatTime(order?.placedAt);
  return [
    { id: 'placed', title: 'Đơn hàng đã đặt', time: placedTime, isActive: rank >= 0 },
    { id: 'preparing', title: 'Đang chế biến', time: placedTime, isActive: rank >= 1 },
    { id: 'ready', title: 'Sẵn sàng lấy hàng', time: placedTime, isActive: rank >= 2 },
    { id: 'delivering', title: 'Đang giao', time: order?.estimatedArrival, isActive: rank >= 3 },
    { id: 'delivered', title: 'Đã hoàn tất', time: order?.estimatedArrival, isActive: rank >= 4 },
  ];
};

type Props = NativeStackScreenProps<CustomerHomeStackParamList, 'Tracking'>;

const TrackingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orders, reload, cancelOrder, updateStatus, error } = useOrders();
  const orderId = route.params?.orderId;
  const [droneProgress, setDroneProgress] = useState(0);
  const [nearArrival, setNearArrival] = useState(false);
  const [deliveredNotice, setDeliveredNotice] = useState(false);
  const [waitRemaining, setWaitRemaining] = useState(120); // giây chờ ở trạng thái pending
  const [otp, setOtp] = useState('');
  const [otpStatus, setOtpStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const activeOrder = useMemo(() => {
    if (!orders.length) return undefined;
    if (orderId) {
      const match = orders.find((item) => item.id === orderId);
      if (match) return match;
    }
    return orders[0];
  }, [orders, orderId]);

  const steps = useMemo(() => buildSteps(activeOrder), [activeOrder]);
  const activeStep = useMemo(() => steps.find((step) => !step.isActive) ?? steps[steps.length - 1], [steps]);

  const totalLabel = useMemo(() => {
    if (!activeOrder) return '—';
    const total = safeNumber(activeOrder.total, 0);
    return `${total.toLocaleString('vi-VN')}₫`;
  }, [activeOrder]);

  const derivedStatus = useMemo(() => {
    const base = (activeOrder?.trackingStatus ?? activeOrder?.status ?? '').toLowerCase();
    if (base === 'completed' || base === 'delivered' || base === 'cancelled') return base;
    if (droneProgress >= 100) return 'delivered';
    if (droneProgress >= 80) return 'ready-for-pickup';
    if (droneProgress >= 50) return 'delivering';
    if (droneProgress > 0) return 'preparing';
    return 'pending';
  }, [activeOrder?.status, activeOrder?.trackingStatus, droneProgress]);

  const statusText = useMemo(() => {
    switch (derivedStatus) {
      case 'pending':
        return 'Pending';
      case 'preparing':
        return 'Preparing';
      case 'ready-for-pickup':
        return 'Ready for Pickup';
      case 'delivering':
      case 'on-the-way':
        return 'Delivering';
      case 'completed':
      case 'delivered':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return derivedStatus;
    }
  }, [derivedStatus]);

  const canCancel = derivedStatus === 'pending';
  const canComplete =
    activeOrder && deliveredNotice && derivedStatus !== 'completed' && derivedStatus !== 'cancelled';
  const isArriving =
    derivedStatus === 'delivering' ||
    derivedStatus === 'on-the-way' ||
    derivedStatus === 'ready-for-pickup' ||
    deliveredNotice;

  const handleCompletePress = async () => {
    if (!activeOrder?.id) return;
    const updated = await updateStatus(activeOrder.id, 'completed');
    if (updated) {
      Alert.alert('Đã giao hàng', 'Đơn hàng đã được đánh dấu hoàn tất.');
    }
  };

  const alertedRef = useRef(false);
  const waitIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startedRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      setDroneProgress(0);
      setNearArrival(false);
      setDeliveredNotice(false);
      setWaitRemaining(120);
      setOtp('');
      setOtpStatus('idle');
      alertedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (waitIntervalRef.current) clearInterval(waitIntervalRef.current);
      startedRef.current = false;

      const startFlying = () => {
        if (startedRef.current) return;
        startedRef.current = true;
        intervalRef.current = setInterval(() => {
          setDroneProgress((prev) => {
            if (prev >= 100) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              return 100;
            }
            const next = prev + 3; // chậm hơn để giữ pending/preparing lâu hơn
            if (next >= 80 && !alertedRef.current) {
              alertedRef.current = true;
              setNearArrival(true);
              Alert.alert('Drone sắp đến', 'Drone cách điểm giao ~200m, vui lòng chuẩn bị nhận hàng.');
            }
            if (next >= 100 && !deliveredNotice) {
              setDeliveredNotice(true);
              Alert.alert('Đơn đã giao', 'Đơn hàng đã được giao tới. Vui lòng xác nhận hoàn tất.');
            }
            return next;
          });
        }, 2500);
      };

      waitIntervalRef.current = setInterval(() => {
        setWaitRemaining((prev) => {
          const next = Math.max(prev - 1, 0);
          if (next === 0) {
            if (waitIntervalRef.current) {
              clearInterval(waitIntervalRef.current);
              waitIntervalRef.current = null;
            }
            startFlying();
          }
          return next;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (waitIntervalRef.current) clearInterval(waitIntervalRef.current);
      };
    }, [deliveredNotice]),
  );

  const handleStartNow = useCallback(() => {
    if (waitIntervalRef.current) {
      clearInterval(waitIntervalRef.current);
      waitIntervalRef.current = null;
    }
    setWaitRemaining(0); // trigger startFlying via effect
  }, []);

  const handleOtpSubmit = async () => {
    const sanitized = otp.trim();
    if (!sanitized) {
      setOtpStatus('error');
      return;
    }
    if (sanitized !== '123456') {
      setOtpStatus('error');
      Alert.alert('OTP không đúng', 'Vui lòng kiểm tra lại mã OTP.');
      return;
    }
    setOtpStatus('success');
    if (activeOrder?.id) {
      await updateStatus(activeOrder.id, 'completed');
      Alert.alert('Hoàn tất đơn', 'OTP đúng, đơn hàng đã được xác nhận hoàn tất.');
    }
  };

  if (!orders.length) {
    return (
      <ScreenContainer>
        <HeaderBar title="Theo dõi đơn" onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
          <Text style={styles.emptySubtitle}>Đặt món và quay lại đây để theo dõi trạng thái từng bước.</Text>
          <TouchableOpacity style={styles.emptyCta} activeOpacity={0.9} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.emptyCtaLabel}>Mua món ngay</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <HeaderBar title="Theo dõi đơn" onBackPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Lộ trình giao hàng</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.statsRow}>
          <View style={styles.statCardWrapper}>
            <StatCard title="Mã đơn" value={activeOrder?.id ?? '#'} />
          </View>
          <View style={[styles.statCardWrapper, styles.statCardWrapperRight]}>
            <StatCard title="Địa chỉ" value={activeOrder?.address ?? 'Chưa cập nhật'} highlight={activeOrder?.customerName} />
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCardWrapper}>
            <StatCard title="Tình trạng" value={statusText} highlight={activeStep.time} />
          </View>
          <View style={[styles.statCardWrapper, styles.statCardWrapperRight]}>
            <StatCard title="Thanh toán" value="Online" highlight={`Tổng: ${totalLabel}`} />
          </View>
        </View>
        {canCancel ? (
          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.85}
            onPress={() => cancelOrder(activeOrder?.id ?? '')}
          >
            <Text style={styles.cancelButtonLabel}>Hủy đơn hàng</Text>
          </TouchableOpacity>
        ) : null}
        {isArriving && canComplete ? (
          <View style={styles.arrivedCard}>
            <Text style={styles.arrivedTitle}>Đơn đã giao tới</Text>
            <Text style={styles.arrivedSubtitle}>Vui lòng xác nhận đã nhận hàng.</Text>
            <TouchableOpacity
              style={styles.completeButton}
              activeOpacity={0.85}
              onPress={handleCompletePress}
            >
              <Text style={styles.completeButtonLabel}>Hoàn tất đơn</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {!isArriving && canComplete && deliveredNotice ? (
          <TouchableOpacity
            style={styles.completeButton}
            activeOpacity={0.85}
            onPress={handleCompletePress}
          >
            <Text style={styles.completeButtonLabel}>Hoàn tất đơn</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Tiến trình drone</Text>
          {waitRemaining > 0 ? (
            <View style={styles.waitRow}>
              <Text style={styles.waitText}>Đang chuẩn bị, drone cất cánh sau {waitRemaining}s</Text>
              <TouchableOpacity style={styles.waitButton} activeOpacity={0.85} onPress={handleStartNow}>
                <Text style={styles.waitButtonLabel}>Bay ngay</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(droneProgress, 100)}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{Math.round(droneProgress)}% hành trình</Text>
          {nearArrival ? <Text style={styles.nearArrival}>Drone sắp đến điểm giao • chuẩn bị OTP</Text> : null}
        </View>

        {activeOrder?.status !== 'completed' && activeOrder?.status !== 'delivered' && activeOrder?.status !== 'cancelled' ? (
          <View style={styles.otpCard}>
            <Text style={styles.otpTitle}>Xác nhận bằng OTP</Text>
            <Text style={styles.otpSubtitle}>Nhập mã OTP để xác nhận đã nhận hàng (mặc định: 123456).</Text>
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="Nhập OTP"
              keyboardType="number-pad"
              style={styles.otpInput}
              placeholderTextColor={colors.muted}
            />
            <TouchableOpacity style={styles.otpButton} activeOpacity={0.9} onPress={handleOtpSubmit}>
              <Text style={styles.otpButtonLabel}>Xác nhận OTP</Text>
            </TouchableOpacity>
            {otpStatus === 'success' ? <Text style={styles.otpSuccess}>OTP đúng, đơn sẽ được hoàn tất.</Text> : null}
            {otpStatus === 'error' ? <Text style={styles.otpError}>OTP không hợp lệ, thử lại.</Text> : null}
          </View>
        ) : null}

        <InfoCard
          title="Thông tin giao nhận"
          description={`Người nhận: ${activeOrder?.customerName ?? '—'} - ${activeOrder?.customerPhone ?? ''}\nĐịa chỉ: ${
            activeOrder?.address ?? '—'
          }`}
          badge={activeOrder?.deliveryMethod === 'motorbike' ? 'Giao xe máy' : 'Drone'}
        />

        <View style={styles.timelineCard}>
          <OrderTimeline steps={steps} />
        </View>

        <AppFooter />
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
    marginBottom: spacing.lg,
  },
  errorText: {
    color: 'red',
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  statCardWrapper: {
    flex: 1,
    flexBasis: '48%',
    minWidth: 150,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  statCardWrapperRight: {
    marginRight: 0,
  },
  cancelButton: {
    backgroundColor: '#FFE8E6',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  cancelButtonLabel: {
    color: '#D62828',
    fontWeight: '700',
  },
  completeButton: {
    backgroundColor: '#ECFDF3',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  completeButtonLabel: {
    color: '#15803D',
    fontWeight: '700',
  },
  arrivedCard: {
    backgroundColor: '#FFF8F1',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing.xs,
  },
  arrivedTitle: {
    fontWeight: '800',
    color: colors.text,
  },
  arrivedSubtitle: {
    color: colors.muted,
  },
  timelineCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyCta: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 14,
  },
  emptyCtaLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  progressTitle: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E6E8F0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressLabel: {
    marginTop: spacing.xs,
    color: colors.muted,
  },
  waitRow: {
    backgroundColor: '#f5f7fb',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waitText: {
    flex: 1,
    color: colors.text,
    fontWeight: '600',
  },
  waitButton: {
    marginLeft: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  waitButtonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  nearArrival: {
    marginTop: spacing.sm,
    color: colors.accent,
    fontWeight: '700',
  },
  otpCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  otpTitle: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  otpSubtitle: {
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  otpButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  otpButtonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  otpSuccess: {
    color: colors.success,
    marginTop: spacing.xs,
  },
  otpError: {
    color: '#D62828',
    marginTop: spacing.xs,
  },
});

export default TrackingScreen;
