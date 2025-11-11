import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';

export type HeaderBarProps = {
  title?: string;
  onBackPress?: () => void;
  showAuthControls?: boolean;
};

const HeaderBar: React.FC<HeaderBarProps> = ({ title, onBackPress, showAuthControls = true }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuth();
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

  const displayName = user?.username || user?.email;

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
        {showAuthControls ? (
          user ? (
            <View style={styles.authRow}>
              {displayName ? (
                <Text style={styles.userLabel} numberOfLines={1}>
                  {displayName}
                </Text>
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
  authRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLabel: {
    color: colors.muted,
    marginRight: spacing.xs,
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
