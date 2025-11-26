import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';

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

export const getApiBaseUrl = () => {
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

export const safeNumber = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
