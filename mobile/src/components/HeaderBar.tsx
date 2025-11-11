import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useAuth } from '../context';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../context';

export type HeaderBarProps = {
  title?: string;
  onBackPress?: () => void;
  showAuthControls?: boolean;
  showCartButton?: boolean;
};

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onBackPress,
  showAuthControls = true,
  showCartButton = true,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAuthPress = useCallback(async () => {
    if (user) {
      try {
        setIsProcessing(true);
        await logout();
      } catch (error) {
        console.warn('Không thể đăng xuất người dùng', error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      navigation.navigate('Auth');
    }
  }, [logout, navigation, user]);

  const handleCartPress = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  const handleAccountPress = useCallback(() => {
    navigation.navigate('Account');
  }, [navigation]);

  const displayName = user?.username || user?.email || '';

  return (
    <View style={styles.container}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress} accessibilityRole="button" style={styles.backButton}>
          <Text style={styles.backLabel}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}
      <Text style={styles.title}>{title ?? 'FoodFast'}</Text>
      <View style={styles.actionContainer}>
        {showCartButton ? (
          <TouchableOpacity
            onPress={handleCartPress}
            style={styles.cartButton}
            accessibilityRole="button"
            activeOpacity={0.85}
          >
            <View style={styles.cartIconWrapper}>
              <View style={styles.cartHandle} />
              <View style={styles.cartBasket}>
                <View style={[styles.cartDivider, { left: 6 }]} />
                <View style={[styles.cartDivider, { right: 6 }]} />
              </View>
            </View>
            {totalItems > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeLabel}>{totalItems}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
        {showAuthControls ? (
          user ? (
            <View style={styles.authRow}>
              {displayName ? (
                <TouchableOpacity
                  onPress={handleAccountPress}
                  accessibilityRole="button"
                  style={styles.userLabelButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.userLabel} numberOfLines={1}>
                    {String(displayName)}
                  </Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={handleAuthPress}
                style={[styles.authButton, isProcessing && styles.authButtonDisabled]}
                activeOpacity={0.85}
                disabled={isProcessing}
              >
                {isProcessing ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.authButtonText}>Đăng xuất</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleAuthPress}
              style={styles.authButton}
              activeOpacity={0.85}
            >
              <Text style={styles.authButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
          )
        ) : (
          <View style={styles.sidePlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE8DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLabel: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
  },
  sidePlaceholder: {
    width: 40,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  actionContainer: {
    minWidth: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cartButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F4F5FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  cartIconWrapper: {
    width: 22,
    alignItems: 'center',
  },
  cartHandle: {
    width: 16,
    height: 8,
    borderWidth: 1.6,
    borderColor: colors.text,
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: -1,
  },
  cartBasket: {
    width: 20,
    height: 10,
    borderWidth: 1.6,
    borderColor: colors.text,
    borderTopWidth: 1.1,
    borderRadius: 4,
    justifyContent: 'flex-end',
    paddingBottom: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  cartDivider: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    width: 1.2,
    backgroundColor: colors.text,
    opacity: 0.85,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  authRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLabelButton: {
    marginRight: spacing.xs,
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.xs,
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
  userLabel: {
    color: colors.muted,
    maxWidth: 140,
  },
  authButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
  },
  authButtonDisabled: {
    opacity: 0.8,
  },
  authButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default HeaderBar;