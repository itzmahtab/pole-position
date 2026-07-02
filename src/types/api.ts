export interface ApiResponse<T> {
  data: T;
  status: number;
  source: 'api' | 'cache';
  cached: boolean;
  timestamp: string;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  cacheDuration: number;
  headers?: Record<string, string>;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  etag?: string;
  source: 'memory' | 'redis';
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}
