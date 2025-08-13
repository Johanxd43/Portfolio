import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNLP } from '../hooks/useNLP';
import { useMessageCache } from '../hooks/useMessageCache';
import { useErrorHandling } from '../hooks/useErrorHandling';

vi.mock('../hooks/useNLP', () => ({
  useNLP: () => ({
    processMessage: vi.fn().mockResolvedValue({
      intent: { name: 'test', confidence: 0.9 },
      response: 'mocked',
      suggestions: [],
      confidence: 0.9,
    }),
    isProcessing: false,
    error: null,
  }),
}));

vi.mock('../hooks/useMessageCache', () => ({
  useMessageCache: () => {
    const store = new Map<string, any>();
    return {
      set: (key: string, value: any) => {
        store.set(key, value);
      },
      get: (key: string) => store.get(key),
    };
  },
}));

describe('ChatBot Hooks', () => {
  describe('useNLP', () => {
    it('should initialize and process messages', async () => {
      const { result } = renderHook(() => useNLP());

      await act(async () => {
        const response = await result.current.processMessage('Hola');
        expect(response).toBeDefined();
        expect(response.intent.name).toBe('test');
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
      });

      expect(result.current.lastError).toBeDefined();
      expect(result.current.lastError?.message).toBe('Test error');
    });
  });
});
