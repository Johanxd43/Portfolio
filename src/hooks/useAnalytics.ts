import { useState, useCallback, useEffect } from 'react';
import { AnalyticsService } from '../services/analyticsService';

export function useAnalytics() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const analyticsService = AnalyticsService.getInstance();

  useEffect(() => {
    return () => {
      analyticsService.cleanup();
    };
  }, []);

  const getAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getAnalytics();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching analytics';
      setError(new Error(errorMessage));
      console.error('Analytics error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const trackEvent = useCallback(async (eventName: string, data: any) => {
    try {
      await analyticsService.trackEvent(eventName, data);
    } catch (err) {
      console.error('Error tracking event:', err);
    }
  }, []);

  return {
    getAnalytics,
    trackEvent,
    isLoading,
    error
  };
}