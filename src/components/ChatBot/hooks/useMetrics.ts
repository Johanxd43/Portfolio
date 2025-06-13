import { useEffect, useCallback } from 'react';
import MetricsService from '../services/metricsService';

export function useMetrics() {
  const metricsService = MetricsService.getInstance();

  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const sessionDuration = Date.now() - startTime;
      console.log('Session duration:', sessionDuration);
    };
  }, []);

  const trackResponseTime = useCallback((callback: () => Promise<void>) => {
    const startTime = Date.now();
    return callback().finally(() => {
      metricsService.trackResponseTime(startTime);
    });
  }, []);

  const updateQualityMetrics = useCallback((metrics: {
    grammaticalAccuracy?: number;
    contextualRelevance?: number;
    responseCompleteness?: number;
  }) => {
    metricsService.updateQualityMetrics(metrics);
  }, []);

  return {
    trackResponseTime,
    updateQualityMetrics,
    getMetrics: metricsService.getMetrics
  };
}