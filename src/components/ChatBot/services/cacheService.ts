class CacheService {
  private static instance: CacheService;
  private cache: Map<string, any>;
  private config: {
    maxSize: number;
    ttl: number;
  };

  private constructor() {
    this.cache = new Map();
    this.config = {
      maxSize: 1000,
      ttl: 30 * 60 * 1000 // 30 minutes
    };
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public set(key: string, value: any, ttl?: number): void {
    const item = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl
    };

    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, item);
  }

  public get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  public clear(): void {
    this.cache.clear();
  }
}

export { CacheService };

export default CacheService