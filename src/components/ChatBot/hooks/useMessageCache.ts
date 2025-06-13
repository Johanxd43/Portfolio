import { useMemo, useCallback, useEffect, useRef } from 'react';
import { openDB } from 'idb';

const MAX_CACHE_SIZE = 100;
const DEFAULT_TTL = 1000 * 60 * 30;

interface CacheItem<T> {
  data: T;
  timestamp: number;
  accessCount: number;
}

export function useMessageCache<T>(ttl: number = DEFAULT_TTL) {
  const cache = useMemo(() => new Map<string, CacheItem<T>>(), []);
  const dbRef = useRef<any>(null);

  // Inicializar IndexedDB
  useEffect(() => {
    const initDB = async () => {
      dbRef.current = await openDB('chatbot-cache', 1, {
        upgrade(db) {
          db.createObjectStore('cache');
        }
      });
    };
    initDB();
  }, []);

  const set = useCallback(async (key: string, data: T) => {
    try {
      // Limpiar caché si excede el límite
      if (cache.size >= MAX_CACHE_SIZE) {
        const leastUsed = Array.from(cache.entries())
          .sort(([, a], [, b]) => a.accessCount - b.accessCount)[0];
        if (leastUsed) {
          cache.delete(leastUsed[0]);
          if (dbRef.current) {
            await dbRef.current.delete('cache', leastUsed[0]);
          }
        }
      }

      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        accessCount: 0
      };

      cache.set(key, item);
      if (dbRef.current) {
        await dbRef.current.put('cache', item, key);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }, [cache]);

  const get = useCallback(async (key: string): Promise<T | null> => {
    try {
      let item = cache.get(key);

      if (!item && dbRef.current) {
        item = await dbRef.current.get('cache', key);
        if (item) {
          cache.set(key, item);
        }
      }

      if (!item || Date.now() - item.timestamp > ttl) {
        cache.delete(key);
        if (dbRef.current) {
          await dbRef.current.delete('cache', key);
        }
        return null;
      }

      item.accessCount++;
      return item.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }, [cache, ttl]);

  const clear = useCallback(async () => {
    try {
      cache.clear();
      if (dbRef.current) {
        await dbRef.current.clear('cache');
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }, [cache]);

  // Limpieza periódica
  useEffect(() => {
    const cleanup = async () => {
      const now = Date.now();
      const expired = Array.from(cache.entries())
        .filter(([, item]) => now - item.timestamp > ttl);

      for (const [key] of expired) {
        cache.delete(key);
        if (dbRef.current) {
          await dbRef.current.delete('cache', key);
        }
      }
    };

    const interval = setInterval(cleanup, ttl / 2);
    return () => clearInterval(interval);
  }, [cache, ttl]);

  return { set, get, clear };
}