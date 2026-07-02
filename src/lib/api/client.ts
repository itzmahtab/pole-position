import { API_ENDPOINTS, RETRY_CONFIG, CACHE_DURATION } from '@/lib/utils/constants';
import type { ApiResponse, ApiConfig, CacheEntry, QueryParams } from '@/types/api';

class ApiClient {
  private config: ApiConfig;
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseUrl: '',
      timeout: 10000,
      retries: RETRY_CONFIG.maxRetries,
      retryDelay: RETRY_CONFIG.baseDelay,
      cacheDuration: 60000,
      ...config,
    };
  }

  async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    queryParams?: QueryParams
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, queryParams);
    const cacheKey = this.getCacheKey(url, options);

    const cached = this.getFromCache<T>(cacheKey);
    if (cached && !this.isExpired(cached)) {
      return {
        data: cached.data,
        status: 200,
        source: 'cache',
        cached: true,
        timestamp: new Date().toISOString(),
      };
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...this.config.headers,
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        this.setCache(cacheKey, data, response.headers.get('etag') || undefined);

        return {
          data,
          status: response.status,
          source: 'api',
          cached: false,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        lastError = error as Error;

        if (attempt < this.config.retries - 1) {
          const delay = this.config.retryDelay * Math.pow(2, attempt);
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  private buildUrl(endpoint: string, params?: QueryParams): string {
    const url = new URL(endpoint, this.config.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private getCacheKey(url: string, options: RequestInit): string {
    return `${options.method || 'GET'}:${url}`;
  }

  private getFromCache<T>(key: string): CacheEntry<T> | undefined {
    return this.cache.get(key) as CacheEntry<T> | undefined;
  }

  private setCache<T>(key: string, data: T, etag?: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.config.cacheDuration,
      etag,
      source: 'memory',
    });
  }

  private isExpired(entry: CacheEntry<unknown>): boolean {
    return Date.now() > entry.expiresAt;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const openF1Client = new ApiClient({
  baseUrl: API_ENDPOINTS.openf1,
  cacheDuration: CACHE_DURATION.live * 1000,
});

export const jolpicaClient = new ApiClient({
  baseUrl: API_ENDPOINTS.jolpica,
  cacheDuration: CACHE_DURATION.standings * 1000,
});

export const weatherClient = new ApiClient({
  baseUrl: API_ENDPOINTS.openweather,
  cacheDuration: CACHE_DURATION.weather * 1000,
});
