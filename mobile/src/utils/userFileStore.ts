import * as FileSystem from 'expo-file-system';

export type StoredUserRecord = {
  id: string;
  username?: string;
  email: string;
  password?: string;
  [key: string]: unknown;
};

const DB_FILE_NAME = 'dbmb.json';

const resolveDatabasePath = (): string => {
  const baseDirectory = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;

  if (!baseDirectory) {
    throw new Error('Không thể xác định vị trí lưu trữ dữ liệu người dùng');
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
  await ensureDatabaseExists(path);

  try {
    const content = await FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const data = content ? JSON.parse(content) : [];
    return Array.isArray(data) ? (data as StoredUserRecord[]) : [];
  } catch (error) {
    console.warn('Không thể đọc dữ liệu người dùng từ file', error);
    return [];
  }
};

export const saveUsersToFile = async (users: StoredUserRecord[]): Promise<void> => {
  const path = resolveDatabasePath();
  await ensureDatabaseExists(path);

  try {
    await FileSystem.writeAsStringAsync(path, JSON.stringify(users, null, 2), {
      encoding: FileSystem.EncodingType.UTF8,
    });
  } catch (error) {
    console.warn('Không thể lưu dữ liệu người dùng vào file', error);
    throw new Error('Không thể lưu dữ liệu người dùng');
  }
};
