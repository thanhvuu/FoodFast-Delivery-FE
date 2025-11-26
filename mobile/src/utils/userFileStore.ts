import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FALLBACK_KEY = 'foodfast-users-cache';

export type StoredUserRecord = {
  id: string;
  username?: string;
  email: string;
  password?: string;
  role?: 'customer' | 'admin' | 'restaurant';
  phone?: string;
  address?: string;
  contactName?: string;
  hub?: string;
  [key: string]: unknown;
};

const DB_FILE_NAME = 'dbmb.json';

const resolveDatabasePath = (): string | null => {
  const baseDirectory = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
  if (!baseDirectory) {
    return null;
  }
  return `${baseDirectory}${DB_FILE_NAME}`;
};

const ensureDatabaseExists = async (path: string): Promise<void> => {
  const info = await FileSystem.getInfoAsync(path);

  if (!info.exists) {
    await FileSystem.writeAsStringAsync(path, '[]', {
      encoding: FileSystem.EncodingType.UTF8,
    });
  }
};

export const readUsersFromFile = async (): Promise<StoredUserRecord[]> => {
  const path = resolveDatabasePath();
  if (!path) {
    // fallback AsyncStorage
    const cached = await AsyncStorage.getItem(FALLBACK_KEY);
    if (!cached) return [];
    try {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? (parsed as StoredUserRecord[]) : [];
    } catch (error) {
      console.warn('Không thể đọc dữ liệu người dùng (AsyncStorage)', error);
      return [];
    }
  }

  await ensureDatabaseExists(path);

  try {
    const content = await FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const data = content ? JSON.parse(content) : [];
    return Array.isArray(data) ? (data as StoredUserRecord[]) : [];
  } catch (error) {
    console.warn('Không thể đọc dữ liệu người dùng từ file, fallback AsyncStorage', error);
    const cached = await AsyncStorage.getItem(FALLBACK_KEY);
    if (!cached) return [];
    try {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? (parsed as StoredUserRecord[]) : [];
    } catch (err) {
      return [];
    }
  }
};

export const saveUsersToFile = async (users: StoredUserRecord[]): Promise<void> => {
  const payload = JSON.stringify(users, null, 2);
  const path = resolveDatabasePath();

  if (!path) {
    await AsyncStorage.setItem(FALLBACK_KEY, payload);
    return;
  }

  await ensureDatabaseExists(path);

  try {
    await FileSystem.writeAsStringAsync(path, payload, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    await AsyncStorage.setItem(FALLBACK_KEY, payload); // lưu song song để fallback
  } catch (error) {
    console.warn('Không thể lưu dữ liệu người dùng vào file, lưu tạm AsyncStorage', error);
    await AsyncStorage.setItem(FALLBACK_KEY, payload);
  }
};
