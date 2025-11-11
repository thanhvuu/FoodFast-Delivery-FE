import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_USER_STORAGE_KEY } from '../constants/api';
import { readUsersFromFile, saveUsersToFile, StoredUserRecord } from '../utils/userFileStore';

type StoredUser = Omit<StoredUserRecord, 'password'> & { password?: string };

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

const parseStoredUser = (value: string | null): StoredUser | null => {
  if (!value) {
    return null;
  }
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object') {
      return parsed as StoredUser;
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

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      throw new Error('Vui lòng nhập email và mật khẩu');
    }

    const users = await readUsersFromFile();
    const matched = users.find(
      (item) => item.email?.toLowerCase() === trimmedEmail && item.password === password
    );

    if (!matched) {
      throw new Error('Thông tin đăng nhập không chính xác');
    }

    const { password: _password, ...sanitized } = matched;
    const sanitizedUser: StoredUser = sanitized;
    setUser(sanitizedUser);
    await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(sanitizedUser));
    return sanitizedUser;
  }, []);

  const register = useCallback(async ({ username, email, password }: RegisterPayload) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!username || !trimmedEmail || !password) {
      throw new Error('Vui lòng nhập đầy đủ và chính xác thông tin');
    }

    const users = await readUsersFromFile();
    const existed = users.some((item) => item.email?.toLowerCase() === trimmedEmail);

    if (existed) {
      throw new Error('Email đã tồn tại');
    }

    const newUser: StoredUserRecord = {
      id: Date.now().toString(),
      username,
      email: trimmedEmail,
      password,
    };

    const nextUsers = [...users, newUser];

    await saveUsersToFile(nextUsers);

    const { password: _password, ...sanitized } = newUser;
    const sanitizedUser: StoredUser = sanitized;
    return sanitizedUser;
  }, []);

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
