import { useState, useEffect, useCallback } from 'react';
import MonitoringService from '../services/monitoringService';
import { ServiceHealth } from '../types';

export function useMonitoring(interval = 30000) {
  const [health, setHealth] = useState<ServiceHealth | null>(null);
  const monitoringService = MonitoringService.getInstance();

  const checkHealth = useCallback(async () => {
    try {
      const currentHealth = await monitoringService.checkHealth();
      setHealth(currentHealth);
    } catch (error) {
      console.error('Error checking health:', error);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const timer = setInterval(checkHealth, interval);
    return () => clearInterval(timer);
  }, [checkHealth, interval]);

  return {
    health,
    checkHealth,
    getStats: monitoringService.getStats.bind(monitoringService)
  };
}