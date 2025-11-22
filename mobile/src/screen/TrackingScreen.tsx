import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import HeaderBar from '../components/HeaderBar';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { CustomerHomeStackParamList } from '../navigation/types';
import StatCard from '../components/StatCard';
import OrderTimeline, { OrderStep } from '../components/OrderTimeline';
import InfoCard from '../components/InfoCard';
import AppFooter from '../components/AppFooter';

const steps: OrderStep[] = [
  { id: 'placed', title: 'Đơn hàng đã đặt', time: '10:15 - 15/04', isActive: true },
  { id: 'confirmed', title: 'Nhà hàng xác nhận', time: '10:18 - 15/04', isActive: true },
  { id: 'preparing', title: 'Đang chế biến', time: '10:25 - 15/04', isActive: true },
  { id: 'on-the-way', title: 'Đang giao', time: '10:45 - 15/04', isActive: true },
  { id: 'delivered', title: 'Đã giao hàng', time: '11:10 - 15/04' },
];

type Props = NativeStackScreenProps<CustomerHomeStackParamList, 'Tracking'>;

const TrackingScreen: React.FC<Props> = ({ navigation }) => {
  const activeStep = useMemo(() => steps.find((step) => !step.isActive) ?? steps[steps.length - 1], []);

  return (
    <ScreenContainer>
      <HeaderBar title="Theo dõi đơn" onBackPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Lộ trình giao hàng</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCardWrapper}>
            <StatCard title="Mã đơn" value="#FF2456" />
          </View>
          <View style={[styles.statCardWrapper, styles.statCardWrapperRight]}>
            <StatCard title="Địa chỉ" value="52/3A Điện Biên Phủ" highlight="Nguyễn Văn A" />
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCardWrapper}>
            <StatCard title="Tình trạng" value={activeStep.title} highlight={activeStep.time} />
          </View>
          <View style={[styles.statCardWrapper, styles.statCardWrapperRight]}>
            <StatCard title="Thanh toán" value="Tiền mặt" highlight="Dự kiến: 255.000₫" />
          </View>
        </View>

        <InfoCard
          title="Thông tin giao nhận"
          description="Tài xế: Nguyễn B - 0901 222 333\nNhà hàng: 213 Nguyễn Văn Cừ, Quận 5"
          badge="Trực tiếp"
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
  timelineCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: spacing.lg,
  },
});

export default TrackingScreen;