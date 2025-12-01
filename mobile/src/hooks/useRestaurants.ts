import { useCallback, useEffect, useMemo, useState } from 'react';
import { restaurants as fallbackRestaurants } from '../data/admin';
import { getApiBaseUrl } from '../utils/api';

export type RestaurantItem = {
  id: string;
  name: string;
  owner?: string;
  city?: string;
  statusKey?: string;
  statusLabel?: string;
  rating?: string;
  openingHours?: {
    open?: string;
    close?: string;
  };
  isOpen?: boolean;
  displayStatus?: string;
  displayStatusKey?: string;
};

const normalizeStatus = (value?: string) => value?.toString().trim().toLowerCase() || 'pending';

const toMinutes = (time?: string | null): number | null => {
  if (!time) return null;
  const [h, m] = time.split(':').map((v) => Number(v));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
};

const isWithinHours = (hours?: { open?: string; close?: string }) => {
  if (!hours?.open || !hours?.close) return true;
  const openM = toMinutes(hours.open);
  const closeM = toMinutes(hours.close);
  if (openM === null || closeM === null) return true;
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  // Overnight window (e.g., 21:00 - 06:00)
  if (closeM < openM) {
    return current >= openM || current < closeM;
  }
  if (closeM === openM) return false;
  return current >= openM && current < closeM;
};

const mapRestaurant = (item: Partial<RestaurantItem>): RestaurantItem => {
  const base: RestaurantItem = {
    id: (item.id as string) || item.name || 'restaurant',
    name: item.name || 'Nhà hàng',
    owner: item.owner || 'Ẩn danh',
    city: item.city || '—',
    statusKey: item.statusKey || item.statusLabel || (item as any).status || 'pending',
    statusLabel: item.statusLabel || (item as any).status || 'Đang cập nhật',
    rating: item.rating || '—',
    openingHours: item.openingHours,
  };

  const open = isWithinHours(base.openingHours);
  return {
    ...base,
    isOpen: open,
    displayStatusKey: open ? base.statusKey : 'closed',
    displayStatus: open ? base.statusLabel || 'Đang hoạt động' : 'Đã đóng cửa',
  };
};

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>(fallbackRestaurants.map(mapRestaurant));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const baseUrl = useMemo(getApiBaseUrl, []);

  const fetchRestaurants = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await fetch(`${baseUrl}/restaurants`);
      if (!response.ok) {
        throw new Error(`API trả về mã ${response.status}`);
      }
      const data = (await response.json()) as Partial<RestaurantItem>[] | undefined;
      if (Array.isArray(data)) {
        setRestaurants(data.map(mapRestaurant));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải danh sách nhà hàng';
      setError(message);
      setRestaurants(fallbackRestaurants.map(mapRestaurant));
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const activeRestaurants = useMemo(
    () => restaurants.filter((item) => normalizeStatus(item.statusKey) === 'active'),
    [restaurants],
  );

  return { restaurants: activeRestaurants, isLoading, error, reload: fetchRestaurants };
};

export default useRestaurants;
