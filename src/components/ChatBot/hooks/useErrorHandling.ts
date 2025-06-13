import { useState, useCallback } from 'react';
import ErrorService from '../services/errorService';
import { ErrorEvent } from '../types';

export function useErrorHandling() {
  const [lastError, setLastError] = useState<ErrorEvent | null>(null);
  const errorService = ErrorService.getInstance();

  const handleError = useCallback((
    error: Error,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    category: 'network' | 'nlp' | 'security' | 'validation' | 'system' = 'system',
    context?: Record<string, any>
  ) => {
    const errorEvent: ErrorEvent = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date()
    };

    setLastError(errorEvent);
    errorService.logError(error, severity, category, context);
  }, []);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  const getErrorStats = useCallback(() => {
    return errorService.getErrorStats();
  }, []);

  return {
    lastError,
    handleError,
    clearError,
    getErrorStats
  };
}