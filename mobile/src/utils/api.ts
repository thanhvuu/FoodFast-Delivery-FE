import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';

const DEFAULT_BASE_URL = 'http://localhost:4000';

const sanitizeUrl = (url: string) => url.replace(/\/+$/, '');

const normalizeUrl = (raw?: string | null): string | undefined => {
  if (!raw) return undefined;

  const cleaned = raw.startsWith('blob:') ? raw.replace(/^blob:/, '') : raw;

  try {
    const parsed = new URL(cleaned.startsWith('http') ? cleaned : `http://${cleaned}`);
    if (!['http:', 'https:'].includes(parsed.protocol)) return undefined;
    return sanitizeUrl(parsed.toString());
  } catch {
    return undefined;
  }
};

const extractHost = (raw?: string | null): string | undefined => {
  const normalized = normalizeUrl(raw);
  if (!normalized) return undefined;
  return new URL(normalized).hostname;
};

export const getApiBaseUrl = () => {
  const envUrl = normalizeUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
  if (envUrl) return envUrl;

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
