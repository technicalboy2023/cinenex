// In-memory cache wrapper using node-cache
import NodeCache from 'node-cache';

const CACHE_TTL = parseInt(process.env.CACHE_TTL || '86400', 10);

// Singleton cache instance
let cacheInstance: NodeCache | null = null;

function getCache(): NodeCache {
  if (!cacheInstance) {
    cacheInstance = new NodeCache({
      stdTTL: CACHE_TTL,
      checkperiod: CACHE_TTL * 0.2, // Check for expired keys every 20% of TTL
      useClones: false,             // Better perf for read-heavy usage
    });
  }
  return cacheInstance;
}

/**
 * Get cached value or fetch from source
 */
export async function getOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cache = getCache();
  const cached = cache.get<T>(key);
  if (cached !== undefined) {
    return cached;
  }

  const data = await fetcher();
  cache.set(key, data, ttl ?? CACHE_TTL);
  return data;
}

export function getCacheStats() {
  const cache = getCache();
  return cache.getStats();
}

export function flushCache() {
  const cache = getCache();
  cache.flushAll();
}

export function deleteCacheKey(key: string) {
  const cache = getCache();
  cache.del(key);
}
