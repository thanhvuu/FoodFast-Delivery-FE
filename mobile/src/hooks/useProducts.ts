import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FoodItem } from '../data/menu';
import { allFoods } from '../data/menu';
import { getApiBaseUrl } from '../utils/api';

const fallbackMenu = allFoods;

const mergeProducts = (remote: FoodItem[]): FoodItem[] => {
  const map = new Map<string, FoodItem>();
  remote.forEach((item) => map.set(item.id, item));
  fallbackMenu.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
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
  const baseUrl = useMemo(getApiBaseUrl, []);

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
        setProducts(mergeProducts(data));
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
