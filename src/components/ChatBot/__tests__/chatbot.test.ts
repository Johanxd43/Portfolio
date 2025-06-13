import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useNLP } from '../hooks/useNLP';
import { useMessageCache } from '../hooks/useMessageCache';
import { useErrorHandling } from '../hooks/useErrorHandling';
import NLPService from '../services/nlpService';
import CacheService from '../services/cacheService';
import ErrorService from '../services/errorService';

describe('ChatBot Core Services', () => {
  describe('NLP Service', () => {
    it('should process messages correctly', async () => {
      const nlpService = NLPService.getInstance();
      const result = await nlpService.processMessage('¿Cuál es tu experiencia?');
      
      expect(result).toBeDefined();
      expect(result.intent.name).toBe('experience');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should maintain context between messages', async () => {
      const nlpService = NLPService.getInstance();
      await nlpService.processMessage('¿Cuál es tu experiencia?');
      const context = nlpService.getContext();
      
      expect(context.currentTopic).toBe('experience');
    });
  });

  describe('Cache Service', () => {
    it('should cache and retrieve items correctly', () => {
      const cacheService = CacheService.getInstance();
      const testKey = 'test';
      const testValue = { data: 'test' };

      cacheService.set(testKey, testValue);
      const cached = cacheService.get(testKey);

      expect(cached).toEqual(testValue);
    });

    it('should respect TTL settings', async () => {
      const cacheService = CacheService.getInstance();
      const testKey = 'ttl-test';
      const testValue = { data: 'test' };

      cacheService.set(testKey, testValue, 100); // 100ms TTL
      await new Promise(resolve => setTimeout(resolve, 150));
      const cached = cacheService.get(testKey);

      expect(cached).toBeNull();
    });
  });

  describe('Error Service', () => {
    it('should log and handle errors appropriately', () => {
      const errorService = ErrorService.getInstance();
      const testError = new Error('Test error');

      errorService.logError(testError, 'medium', 'system');
      const stats = errorService.getErrorStats();

      expect(stats.total).toBeGreaterThan(0);
      expect(stats.bySeverity.medium).toBeGreaterThan(0);
    });
  });
});

describe('ChatBot Hooks', () => {
  describe('useNLP', () => {
    it('should initialize and process messages', async () => {
      const { result } = renderHook(() => useNLP());

      await act(async () => {
        const response = await result.current.processMessage('Hola');
        expect(response).toBeDefined();
        expect(response.intent).toBeDefined();
      });
    });
  });

  describe('useMessageCache', () => {
    it('should cache and retrieve messages', () => {
      const { result } = renderHook(() => useMessageCache());
      const testKey = 'test-message';
      const testValue = 'Hello, world!';

      act(() => {
        result.current.set(testKey, testValue);
        const cached = result.current.get(testKey);
        expect(cached).toBe(testValue);
      });
    });
  });

  describe('useErrorHandling', () => {
    it('should handle and track errors', () => {
      const { result } = renderHook(() => useErrorHandling());
      const testError = new Error('Test error');

      act(() => {
        result.current.handleError(testError);
        expect(result.current.lastError).toBeDefined();
        expect(result.current.lastError?.message).toBe('Test error');
      });
    });
  });
});