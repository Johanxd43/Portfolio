import { useCallback, useEffect } from 'react';
import { ChatMessage } from '../types';
import AnalyticsService from '../services/analyticsService';

export function useAnalytics() {
  const analytics = AnalyticsService.getInstance();

  useEffect(() => {
    const startTime = Date.now();
    return () => {
      analytics.trackEvent('session_end', {
        duration: Date.now() - startTime
      });
    };
  }, []);

  const trackMessage = useCallback((message: ChatMessage) => {
    analytics.trackEvent('message', {
      isUser: message.isUser,
      timestamp: message.timestamp,
      hasSuggestions: !!message.suggestions?.length,
      contentLength: message.content.length
    });
  }, []);

  const trackFeedback = useCallback((messageId: string, feedback: 'positive' | 'negative') => {
    analytics.trackEvent('feedback', {
      messageId,
      feedback,
      timestamp: new Date()
    });
  }, []);

  const trackError = useCallback((error: Error, context?: any) => {
    analytics.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date()
    });
  }, []);

  return {
    trackMessage,
    trackFeedback,
    trackError
  };
}