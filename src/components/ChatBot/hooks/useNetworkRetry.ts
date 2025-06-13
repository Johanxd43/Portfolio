import { useCallback } from 'react';

export function useNetworkRetry() {
  const MAX_RETRIES = 3;
  const BACKOFF_MULTIPLIER = 1.5;
  const INITIAL_DELAY = 1000;

  const retryWithBackoff = async <T>(
    operation: () => Promise<T>,
    retries = MAX_RETRIES
  ): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      if (retries === 0) throw error;
      
      const delay = INITIAL_DELAY * Math.pow(BACKOFF_MULTIPLIER, MAX_RETRIES - retries);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return retryWithBackoff(operation, retries - 1);
    }
  };

  return { retryWithBackoff };
}