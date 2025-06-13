import { CacheConfig, CacheStats } from '../types';

class OptimizedCacheService {
  private static instance: OptimizedCacheService;
  private cache: Map<string, any>;
  private config: CacheConfig;
  private stats: CacheStats;

  private constructor() {
    this.cache = new Map();
    this.config = this.getDefaultConfig();
    this.stats = this.initializeStats();
  }

  private getDefaultConfig(): CacheConfig {
    return {
      maxSize: 1000,
      ttl: 30 * 60 * 1000, // 30 minutos
      cleanupInterval: 5 * 60 * 1000 // 5 minutos
    };
  }

  private initializeStats(): CacheStats {
    return {
      hits: 0,
      misses: 0,
      size: 0,
      lastCleanup: Date.now()
    };
  }

  public static getInstance(): OptimizedCacheService {
    if (!OptimizedCacheService.instance) {
      OptimizedCacheService.instance = new OptimizedCacheService();
    }
    return OptimizedCacheService.instance;
  }

  public set(key: string, value: any, ttl?: number): void {
    this.cleanup();
    
    const item = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl
    };

    this.cache.set(key, item);
    this.stats.size = this.cache.size;
  }

  public get(key: string): any {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.value;
  }

  private isExpired(item: any): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  private cleanup(): void {
    if (Date.now() - this.stats.lastCleanup < this.config.cleanupInterval) {
      return;
    }

    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
      }
    }

    this.stats.lastCleanup = Date.now();
    this.stats.size = this.cache.size;
  }

  public getStats(): CacheStats {
    return {
      ...this.stats,
      hitRate: this.calculateHitRate()
    };
  }

  private calculateHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total > 0 ? this.stats.hits / total : 0;
  }
}

export default OptimizedCacheService;