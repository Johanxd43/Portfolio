import { ChatMetrics, QualityMetrics } from '../types';

class MetricsService {
  private static instance: MetricsService;
  private metrics: ChatMetrics = {
    responseTime: 0,
    intentAccuracy: 0,
    userSatisfaction: 0,
    sessionDuration: 0,
    completionRate: 0
  };

  private qualityMetrics: QualityMetrics = {
    grammaticalAccuracy: 0,
    contextualRelevance: 0,
    responseCompleteness: 0
  };

  private constructor() {}

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  public trackResponseTime(startTime: number): void {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    this.metrics.responseTime = (this.metrics.responseTime + responseTime) / 2;
  }

  public updateIntentAccuracy(predicted: string, actual: string): void {
    const accuracy = predicted === actual ? 1 : 0;
    this.metrics.intentAccuracy = (this.metrics.intentAccuracy + accuracy) / 2;
  }

  public updateQualityMetrics(metrics: Partial<QualityMetrics>): void {
    this.qualityMetrics = {
      ...this.qualityMetrics,
      ...metrics
    };
  }

  public getMetrics(): { chat: ChatMetrics; quality: QualityMetrics } {
    return {
      chat: this.metrics,
      quality: this.qualityMetrics
    };
  }
}

export default MetricsService;