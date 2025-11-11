import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

const quickLinks = ['Về chúng tôi', 'Tin tức', 'Mobile-app', 'Liên hệ', 'Theo dõi đơn'];

const AppFooter: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>FoodFast Delivery</Text>
      <Text style={styles.description}>
        Dịch vụ giao đồ ăn nhanh chóng với thực đơn đa dạng, phù hợp mọi khẩu vị trong gia đình bạn.
      </Text>
      <View style={styles.linkRow}>
        {quickLinks.map((link) => (
          <TouchableOpacity key={link} onPress={() => Linking.openURL('https://foodfast.vn/')}>
            <Text style={styles.link}>{link}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.copyright}>© 2025 FoodFast Delivery. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
  },
  brand: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  linkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
  },
  link: {
    marginRight: spacing.md,
    marginBottom: spacing.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  copyright: {
    marginTop: spacing.lg,
    color: colors.muted,
    fontSize: 12,
  },
});

export default AppFooter;