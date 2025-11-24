import { useCallback, useEffect, useMemo, useState } from 'react';
import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';
import type { FoodItem } from '../data/menu';
import { featured, popular } from '../data/menu';

const fallbackMenu = [...featured, ...popular];
const DEFAULT_BASE_URL = 'http://localhost:4000';

const sanitizeUrl = (url: string) => url.replace(/\/+$/, '');

const extractHost = (raw?: string | null): string | undefined => {
  if (!raw) return undefined;
  try {
    const url = raw.startsWith('http') ? raw : `http://${raw}`;
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
};

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envUrl) return sanitizeUrl(envUrl);

  const hostFromConstants = extractHost(Constants.expoConfig?.hostUri);
  const hostFromBundle = extractHost(NativeModules?.SourceCode?.scriptURL);
  const host = hostFromConstants ?? hostFromBundle;

  if (host) {
    const resolvedHost =
      Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1') ? '10.0.2.2' : host;
    return `http://${resolvedHost}:4000`;
  }

  return DEFAULT_BASE_URL;
};

export type UseProductsResult = {
  products: FoodItem[];
  isLoading: boolean;
  error?: string;
  reload: () => void;
};

export const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<FoodItem[]>(fallbackMenu);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const baseUrl = useMemo(getBaseUrl, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await fetch(`${baseUrl}/products`);
      if (!response.ok) {
        throw new Error(`API trả về mã ${response.status}`);
      }
      const data: FoodItem[] = await response.json();
      if (Array.isArray(data) && data.length) {
        setProducts(data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu sản phẩm';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    reload: fetchProducts,
  };
};

export default useProducts;
