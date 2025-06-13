import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export function useErrorBoundary() {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorInfo: null
  });

  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    setErrorState({
      hasError: true,
      error,
      errorInfo
    });
  }, []);

  const resetError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }, []);

  return {
    ...errorState,
    handleError,
    resetError
  };
}