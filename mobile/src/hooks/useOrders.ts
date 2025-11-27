import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl, safeNumber } from '../utils/api';
import type { CartItem } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export type StoredOrder = {
  id: string;
  items: Array<{ productId: string; quantity: number; price: number; name?: string }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready-for-pickup' | 'delivering' | 'completed' | 'cancelled';
  trackingStatus?: StoredOrder['status'];
  deliveryMethod: 'drone' | 'motorbike';
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  note?: string;
  placedAt: string;
  paymentMethod?: string;
  estimatedArrival?: string;
};

const STORAGE_KEY = 'foodfast-orders';

const readStoredOrders = async (): Promise<StoredOrder[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredOrders = async (orders: StoredOrder[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

const orderSort = (list: StoredOrder[]) =>
  [...list].sort((a, b) => {
    const tsA = Date.parse(a?.placedAt ?? '') || 0;
    const tsB = Date.parse(b?.placedAt ?? '') || 0;
    return tsB - tsA;
  });

type PlaceOrderInput = {
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: 'drone' | 'motorbike';
  customer: { name: string; phone: string; address: string; note?: string };
};

export const useOrders = () => {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const baseUrl = useMemo(getApiBaseUrl, []);
  const { user } = useAuth();

  const mergeOrders = useCallback((local: StoredOrder[], remote: StoredOrder[]) => {
    const unique = new Map<string, StoredOrder>();
    [...local, ...remote].forEach((order) => {
      const normalized: StoredOrder = {
        ...order,
        trackingStatus: order?.trackingStatus ?? order?.status,
        placedAt: order?.placedAt ?? (order as any)?.createdAt ?? order.placedAt,
      };
      if (normalized.id) {
        unique.set(normalized.id, normalized);
      }
    });
    return Array.from(unique.values());
  }, []);

  const fetchRemoteOrders = useCallback(async () => {
    if (!user?.email) return [] as StoredOrder[];
    const response = await fetch(
      `${baseUrl}/orders?customerEmail=${encodeURIComponent(user.email)}`,
    );
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `API trả về mã ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) return [] as StoredOrder[];
    return data as StoredOrder[];
  }, [baseUrl, user?.email]);

  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      const [localOrders, remoteOrders] = await Promise.all([
        readStoredOrders(),
        fetchRemoteOrders(),
      ]);
      const merged = mergeOrders(localOrders, remoteOrders);
      setOrders(orderSort(merged));
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải đơn hàng');
    } finally {
      setIsLoading(false);
    }
  }, [fetchRemoteOrders, mergeOrders]);

  useEffect(() => {
    reload();
  }, [reload]);

  const upsertOrder = useCallback(async (order: StoredOrder) => {
    const current = await readStoredOrders();
    const next = orderSort([order, ...current.filter((item) => item.id !== order.id)]);
    await writeStoredOrders(next);
    setOrders(next);
    return next;
  }, []);

  const placeOrder = useCallback(
    async (input: PlaceOrderInput): Promise<StoredOrder | undefined> => {
      setIsPlacing(true);
      setError(undefined);
      try {
        const orderId = `order-${Date.now()}`;
        const payload: StoredOrder = {
          id: orderId,
          items: input.cartItems.map((item) => ({
            productId: item.id,
            quantity: safeNumber(item.quantity, 1),
            price: safeNumber(item.price, 0),
            name: item.name,
          } as any)),
          subtotal: safeNumber(input.subtotal, 0),
          deliveryFee: safeNumber(input.deliveryFee, 0),
          total: safeNumber(input.total, 0),
          status: 'pending',
          trackingStatus: 'pending',
          deliveryMethod: input.deliveryMethod,
          customerName: input.customer.name,
          customerPhone: input.customer.phone,
          customerEmail: user?.email,
          address: input.customer.address,
          note: input.customer.note,
          placedAt: new Date().toISOString(),
          estimatedArrival: input.deliveryMethod === 'drone' ? '15 - 20 phút' : '25 - 35 phút',
          paymentMethod: 'online',
        } as StoredOrder;

        const response = await fetch(`${baseUrl}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...payload, createdAt: payload.placedAt }),
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || `API trả về mã ${response.status}`);
        }

        const data = await response.json();
        const merged: StoredOrder = {
          ...payload,
          ...data,
          id: (data as StoredOrder)?.id ?? payload.id,
          placedAt: (data as StoredOrder)?.placedAt ?? payload.placedAt,
        };
        await upsertOrder(merged);
        return merged;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể đặt hàng';
        setError(message);
        return undefined;
      } finally {
        setIsPlacing(false);
      }
    },
    [baseUrl, upsertOrder, user?.email],
  );

  const updateStatus = useCallback(
    async (orderId: string, status: StoredOrder['status']) => {
      try {
        const target = orders.find((o) => o.id === orderId);
        if (!target) throw new Error('Không tìm thấy đơn hàng');

        const response = await fetch(`${baseUrl}/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, trackingStatus: status }),
        });
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || `API trả về mã ${response.status}`);
        }
        const data = await response.json();
        const updated: StoredOrder = {
          ...target,
          ...data,
          status: (data?.status as StoredOrder['status']) ?? status,
          trackingStatus: (data?.trackingStatus as StoredOrder['status']) ?? status,
        };
        await upsertOrder(updated);
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái';
        setError(message);
        return undefined;
      }
    },
    [baseUrl, orders, upsertOrder],
  );

  const cancelOrder = useCallback(
    async (orderId: string) => {
      try {
        const target = orders.find((o) => o.id === orderId);
        if (!target) throw new Error('Không tìm thấy đơn hàng');
        if (target.status !== 'pending') throw new Error('Chỉ hủy được đơn đang chờ xác nhận');

        const updated = await updateStatus(orderId, 'cancelled');
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể hủy đơn';
        setError(message);
        return undefined;
      }
    },
    [orders, updateStatus],
  );

  return {
    orders,
    isLoading,
    isPlacing,
    error,
    placeOrder,
    cancelOrder,
    updateStatus,
    reload,
  };
};

export default useOrders;
