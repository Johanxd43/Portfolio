import { MonitoringStats, ServiceHealth } from '../types';
import AnalyticsService from './analyticsService';
import ErrorService from './errorService';
import MetricsService from './metricsService';

class MonitoringService {
  private static instance: MonitoringService;
  private analyticsService: AnalyticsService;
  private errorService: ErrorService;
  private metricsService: MetricsService;
  private healthChecks: Map<string, () => Promise<boolean>>;
  private stats: MonitoringStats;

  private constructor() {
    this.analyticsService = AnalyticsService.getInstance();
    this.errorService = ErrorService.getInstance();
    this.metricsService = MetricsService.getInstance();
    this.healthChecks = new Map();
    this.stats = this.initializeStats();
    this.initializeHealthChecks();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private initializeStats(): MonitoringStats {
    return {
      uptime: 0,
      lastCheck: Date.now(),
      servicesHealth: new Map(),
      performance: {
        responseTime: 0,
        memoryUsage: 0,
        cpuUsage: 0
      }
    };
  }

  private initializeHealthChecks(): void {
    this.healthChecks.set('nlp', this.checkNLPService.bind(this));
    this.healthChecks.set('cache', this.checkCacheService.bind(this));
    this.healthChecks.set('analytics', this.checkAnalyticsService.bind(this));
  }

  public async checkHealth(): Promise<ServiceHealth> {
    const health: ServiceHealth = {
      status: 'healthy',
      timestamp: new Date(),
      services: {}
    };

    for (const [service, check] of this.healthChecks.entries()) {
      try {
        const isHealthy = await check();
        health.services[service] = {
          status: isHealthy ? 'healthy' : 'degraded',
          lastCheck: new Date()
        };
      } catch (error) {
        health.services[service] = {
          status: 'unhealthy',
          lastCheck: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        health.status = 'degraded';
      }
    }

    this.updateStats(health);
    return health;
  }

  private async checkNLPService(): Promise<boolean> {
    // Implementar verificación del servicio NLP
    return true;
  }

  private async checkCacheService(): Promise<boolean> {
    // Implementar verificación del servicio de caché
    return true;
  }

  private async checkAnalyticsService(): Promise<boolean> {
    // Implementar verificación del servicio de analytics
    return true;
  }

  private updateStats(health: ServiceHealth): void {
    this.stats.uptime = Date.now() - this.stats.lastCheck;
    this.stats.servicesHealth = new Map(
      Object.entries(health.services).map(([key, value]) => [key, value])
    );
    this.stats.lastCheck = Date.now();
  }

  public getStats(): MonitoringStats {
    return this.stats;
  }
}

export default MonitoringService;