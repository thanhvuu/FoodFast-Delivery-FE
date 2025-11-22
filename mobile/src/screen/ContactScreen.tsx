import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import HeaderBar from '../components/HeaderBar';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { CustomerHomeStackParamList } from '../navigation/types';
import InfoCard from '../components/InfoCard';
import AppFooter from '../components/AppFooter';

const mapImage = 'https://images.unsplash.com/photo-1529927336841-95c6c1c76045?auto=format&fit=crop&w=1200&q=80';

type Props = NativeStackScreenProps<CustomerHomeStackParamList, 'Contact'>;

const ContactScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <HeaderBar title="Liên hệ" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardRow}>
          <View style={styles.cardColumn}>
            <InfoCard
              title="Chúng tôi luôn sẵn sàng hỗ trợ"
              description="Đội ngũ FoodFast luôn sẵn sàng lắng nghe và giải quyết mọi vấn đề của bạn 24/7."
              badge="Hỗ trợ"
              footer="Hotline: 1900 636 999"
            />
          </View>
          <View style={styles.cardColumn}>
            <InfoCard
              title="Kết nối nhanh"
              description="Gửi email tới support@foodfast.vn hoặc chat trực tiếp qua ứng dụng để được tư vấn."
              badge="Email"
              footer="support@foodfast.vn"
            />
          </View>
        </View>

        <Text style={styles.mapTitle}>Bản đồ quán ăn</Text>
        <ImageBackground source={{ uri: mapImage }} style={styles.map} imageStyle={styles.mapImage}>
          <View style={styles.mapOverlay}>
            <Text style={styles.mapLabel}>123 Nguyễn Trãi, Quận 5, TP. HCM</Text>
            <TouchableOpacity style={styles.mapButton} onPress={() => Linking.openURL('https://maps.google.com')}>
              <Text style={styles.mapButtonLabel}>Xem chỉ đường</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

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
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xl,
  },
  cardColumn: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  map: {
    height: 220,
    borderRadius: 32,
    overflow: 'hidden',
  },
  mapImage: {
    borderRadius: 32,
  },
  mapOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  mapLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  mapButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },
  mapButtonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default ContactScreen;