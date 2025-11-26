import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { restaurants as fallbackRestaurants } from '../data/admin';
import { getApiBaseUrl } from '../utils/api';

const AdminRestaurantsScreen: React.FC = () => {
  const [restaurantList, setRestaurantList] = useState(
    fallbackRestaurants.map((r) => ({
      ...r,
      statusKey: r.statusKey ?? r.status,
      statusLabel: r.statusLabel ?? r.status,
    })),
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const baseUrl = useMemo(getApiBaseUrl, []);

  const labelFromKey = (key?: string) => {
    switch (key) {
      case 'pending':
        return 'Chờ duyệt';
      case 'review':
        return 'Đang xem xét';
      case 'active':
        return 'Đang hoạt động';
      case 'suspended':
        return 'Bị khoá';
      default:
        return key ?? '—';
    }
  };

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/restaurants`);
      if (!res.ok) throw new Error('Không tải được danh sách');
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        setRestaurantList(
          data.map((r) => ({
            ...r,
            statusKey: r.statusKey ?? r.status,
            statusLabel: r.status ?? labelFromKey(r.statusKey),
          })),
        );
      }
    } catch (err) {
      // dùng fallback
      setRestaurantList(
        fallbackRestaurants.map((r) => ({
          ...r,
          statusKey: r.statusKey ?? r.status,
          statusLabel: r.statusLabel ?? labelFromKey(r.statusKey ?? r.status),
        })),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateStatus = async (id: string, nextKey: string) => {
    try {
      const res = await fetch(`${baseUrl}/restaurants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusKey: nextKey, status: labelFromKey(nextKey) }),
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
      const updated = await res.json();
      setRestaurantList((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                ...updated,
                statusKey: updated.statusKey ?? nextKey,
                statusLabel: updated.status ?? labelFromKey(nextKey),
              }
            : r,
        ),
      );
    } catch (err) {
      // fallback update local nếu API lỗi
      setRestaurantList((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, statusKey: nextKey, statusLabel: labelFromKey(nextKey) }
            : r,
        ),
      );
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRestaurants(); }} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Quản lý nhà hàng</Text>
          <Text style={styles.subtitle}>Dữ liệu đồng bộ với web superadmin (duyệt/khoá cửa hàng).</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : null}

        {restaurantList.map((item) => (
          <View key={item.id ?? item.name} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <Text style={styles.restaurantAddress}>{item.city}</Text>
                <Text style={[styles.badgeStatus, styles[`status_${item.statusKey ?? item.status}`]]}>
                  {item.statusLabel ?? item.status}
                </Text>
              </View>
              <View style={styles.chips}>
                {item.statusKey === 'pending' || item.statusKey === 'review' ? (
                  <TouchableOpacity
                    style={[styles.chip, styles.primaryChip]}
                    activeOpacity={0.85}
                    onPress={() => updateStatus(item.id, 'active')}
                  >
                    <Text style={styles.chipLabel}>Duyệt đăng ký</Text>
                  </TouchableOpacity>
                ) : null}
                {item.statusKey === 'active' ? (
                  <TouchableOpacity
                    style={[styles.chip, styles.neutralChip]}
                    activeOpacity={0.85}
                    onPress={() => updateStatus(item.id, 'suspended')}
                  >
                    <Text style={[styles.chipLabel, styles.neutralLabel]}>Tạm ngừng</Text>
                  </TouchableOpacity>
                ) : null}
                {item.statusKey === 'suspended' ? (
                  <TouchableOpacity
                    style={[styles.chip, styles.primaryChip]}
                    activeOpacity={0.85}
                    onPress={() => updateStatus(item.id, 'active')}
                  >
                    <Text style={styles.chipLabel}>Mở khóa</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={[styles.chip, styles.dangerChip]}
                  activeOpacity={0.85}
                  onPress={() => updateStatus(item.id, 'suspended')}
                >
                  <Text style={styles.chipDangerLabel}>Khoá cửa hàng</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Doanh thu</Text>
                <Text style={styles.infoValue}>{item.revenue ?? '—'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Đơn xử lý</Text>
                <Text style={styles.infoValue}>{item.orders ?? '—'}</Text>
              </View>
            </View>

            <View style={styles.ratingPill}>
              <Text style={styles.ratingLabel}>Đánh giá: {item.rating ?? item.satisfaction ?? '—'}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 4,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  restaurantAddress: {
    color: colors.muted,
    marginTop: 4,
  },
  badgeStatus: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    fontWeight: '700',
  },
  status_pending: {
    backgroundColor: 'rgba(253, 224, 71, 0.25)',
    color: '#854d0e',
  },
  status_review: {
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    color: '#1d4ed8',
  },
  status_active: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#047857',
  },
  status_suspended: {
    backgroundColor: 'rgba(248, 113, 113, 0.2)',
    color: '#b91c1c',
  },
  chips: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  primaryChip: {
    backgroundColor: '#fff5eb',
  },
  neutralChip: {
    backgroundColor: '#eef2ff',
  },
  dangerChip: {
    backgroundColor: '#ffe4e6',
  },
  chipLabel: {
    color: '#f97316',
    fontWeight: '700',
  },
  neutralLabel: {
    color: colors.primary,
  },
  chipDangerLabel: {
    color: '#d62828',
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  infoItem: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  infoLabel: {
    color: colors.muted,
    fontWeight: '600',
  },
  infoValue: {
    marginTop: spacing.xs,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  ratingPill: {
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
  },
  ratingLabel: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});

export default AdminRestaurantsScreen;
