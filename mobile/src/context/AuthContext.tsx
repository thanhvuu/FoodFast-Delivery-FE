import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_USER_STORAGE_KEY } from '../constants/api';
import { readUsersFromFile, saveUsersToFile, StoredUserRecord } from '../utils/userFileStore';
import { getApiBaseUrl } from '../utils/api';

export type UserRole = 'customer' | 'admin' | 'restaurant';

type StoredUser = Omit<StoredUserRecord, 'password'> & { password?: string };
export type AuthenticatedUser = StoredUser;

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: StoredUser | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<StoredUser>;
  register: (payload: RegisterPayload) => Promise<StoredUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const presetUsers: StoredUserRecord[] = [
  {
    id: 'admin',
    username: 'Nguyễn Quản Trị',
    email: 'admin@gmail.com',
    password: 'admin',
    role: 'admin',
    phone: '0909000900',
    address: 'Trụ sở chính FoodFast, Thủ Đức',
    hub: 'FoodFast Hub',
  },
  {
    id: 'restaurant',
    username: 'FastGrill Station',
    email: 'res@gmail.com',
    password: 'res',
    role: 'restaurant',
    phone: '0908123456',
    address: 'Pad-05, Khu vực trung tâm',
    contactName: 'Mai Anh',
  },
];

const ensureRole = (data: StoredUser | null): StoredUser | null => {
  if (!data) {
    return null;
  }

  if (!data.role) {
    return { ...data, role: 'customer' };
  }

  return data;
};

const parseStoredUser = (value: string | null): StoredUser | null => {
  if (!value) {
    return null;
  }
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object') {
      return ensureRole(parsed as StoredUser);
    }
    return null;
  } catch (error) {
    console.warn('Không thể phân tích dữ liệu người dùng đã lưu', error);
    return null;
  }
};

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_USER_STORAGE_KEY);
        const parsed = parseStoredUser(stored);
        if (parsed) {
          setUser(parsed);
        }
      } catch (error) {
        console.warn('Không thể tải thông tin người dùng đã lưu', error);
      } finally {
        setInitializing(false);
      }
    };

    loadStoredUser();
  }, []);

  const fetchUsersFromApi = useCallback(async (): Promise<StoredUserRecord[]> => {
    const baseUrl = getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/users`);
      if (!res.ok) throw new Error(`API trả về mã ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? (data as StoredUserRecord[]) : [];
    } catch (err) {
      console.warn('Không thể tải users từ API, dùng fallback local', err);
      return [];
    }
  }, []);

  const createUserApi = useCallback(async (payload: StoredUserRecord): Promise<StoredUserRecord | null> => {
    const baseUrl = getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API trả về mã ${res.status}`);
      const data = await res.json();
      return data as StoredUserRecord;
    } catch (err) {
      console.warn('Không thể tạo user trên API, dùng local fallback', err);
      return null;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      throw new Error('Vui lòng nhập email và mật khẩu');
    }

    const matchedPreset = presetUsers.find(
      (item) => item.email.toLowerCase() === trimmedEmail && item.password === password
    );

    if (matchedPreset) {
      const { password: _password, ...sanitized } = matchedPreset;
      const sanitizedUser: StoredUser = ensureRole(sanitized) as StoredUser;
      setUser(sanitizedUser);
      await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(sanitizedUser));
      return sanitizedUser;
    }

    const apiUsers = await fetchUsersFromApi();
    const matchedApi = apiUsers.find(
      (item) => item.email?.toLowerCase() === trimmedEmail && item.password === password
    );
    if (matchedApi) {
      const { password: _password, ...sanitized } = matchedApi;
      const sanitizedUser: StoredUser = ensureRole(sanitized) as StoredUser;
      setUser(sanitizedUser);
      await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(sanitizedUser));
      return sanitizedUser;
    }

    const users = await readUsersFromFile();
    const matched = users.find(
      (item) => item.email?.toLowerCase() === trimmedEmail && item.password === password
    );

    if (!matched) {
      throw new Error('Thông tin đăng nhập không chính xác');
    }

    const { password: _password, ...sanitized } = matched;
    const sanitizedUser: StoredUser = ensureRole(sanitized) as StoredUser;
    setUser(sanitizedUser);
    await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(sanitizedUser));
    return sanitizedUser;
  }, [fetchUsersFromApi]);

  const register = useCallback(async ({ username, email, password }: RegisterPayload) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!username || !trimmedEmail || !password) {
      throw new Error('Vui lòng nhập đầy đủ và chính xác thông tin');
    }

    // kiểm tra trùng email trên API
    const apiUsers = await fetchUsersFromApi();
    const existedApi = apiUsers.some((item) => item.email?.toLowerCase() === trimmedEmail);
    if (existedApi) {
      throw new Error('Email đã tồn tại');
    }

    const fileUsers = await readUsersFromFile();
    const existedFile = fileUsers.some((item) => item.email?.toLowerCase() === trimmedEmail);
    if (existedFile) {
      throw new Error('Email đã tồn tại (local)');
    }

    const newUser: StoredUserRecord = {
      id: Date.now().toString(),
      username,
      email: trimmedEmail,
      password,
      role: 'customer',
    };

    const created = await createUserApi(newUser);
    const mergedUser = created ?? newUser;

    const nextUsers = [...fileUsers, mergedUser];
    await saveUsersToFile(nextUsers);

    const { password: _password, ...sanitized } = mergedUser;
    const sanitizedUser: StoredUser = ensureRole(sanitized) as StoredUser;
    return sanitizedUser;
  }, [createUserApi, fetchUsersFromApi]);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem(AUTH_USER_STORAGE_KEY);
    } catch (error) {
      console.warn('Không thể xoá thông tin người dùng đã lưu', error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_USER_STORAGE_KEY);
      const parsed = parseStoredUser(stored);
      setUser(parsed);
    } catch (error) {
      console.warn('Không thể làm mới thông tin người dùng đã lưu', error);
    }
  }, []);

  const value = useMemo(
    () => ({ user, initializing, login, register, logout, refreshUser }),
    [user, initializing, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};
