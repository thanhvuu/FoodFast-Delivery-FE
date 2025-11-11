const env = (
  (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}
);

const fallbackBaseUrl = 'http://localhost:5173/api';

const normalizeBaseUrl = (url: string): string => {
  if (!url) {
    return fallbackBaseUrl;
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const resolveBaseUrl = (): string => {
  const candidate = env.EXPO_PUBLIC_AUTH_API_BASE_URL ?? env.AUTH_API_BASE_URL ?? fallbackBaseUrl;
  return normalizeBaseUrl(candidate);
};

export const API_BASE_URL = resolveBaseUrl();
export const USERS_API_URL = `${API_BASE_URL}/users`;

export const AUTH_USER_STORAGE_KEY = '@foodfast/user';
