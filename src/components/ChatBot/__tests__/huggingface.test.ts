import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { HfInference } from '@huggingface/inference';

vi.mock('@huggingface/inference', () => ({
  HfInference: vi.fn(() => ({
    textGeneration: vi.fn()
  }))
}));

describe('useHuggingFaceChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.resetModules();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should initialize in fallback mode when no token is provided', async () => {
    const { useHuggingFaceChat } = await import('../hooks/useHuggingFaceChat');
    const { result } = renderHook(() => useHuggingFaceChat());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isUsingFallback).toBe(true);
    expect(result.current.isInitialized).toBe(true);
  });

  it('should try to initialize Hugging Face when token is provided', async () => {
    const mockTextGeneration = vi.fn().mockResolvedValue({
      generated_text: 'Test response'
    });

    (HfInference as vi.Mock).mockImplementation(() => ({
      textGeneration: mockTextGeneration
    }));

    vi.stubEnv('VITE_HUGGING_FACE_TOKEN', 'test-token');
    vi.resetModules();
    const { useHuggingFaceChat } = await import('../hooks/useHuggingFaceChat');

    const { result } = renderHook(() => useHuggingFaceChat());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(HfInference).toHaveBeenCalledWith('test-token');
    expect(mockTextGeneration).toHaveBeenCalled();
  });

  it('should handle message processing in fallback mode', async () => {
    const { useHuggingFaceChat } = await import('../hooks/useHuggingFaceChat');
    const { result } = renderHook(() => useHuggingFaceChat());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    let response: any;
    await act(async () => {
      response = await result.current.processMessage('experiencia');
    });

    expect(response.response).toContain('Consultor Logístico');
    expect(response.suggestions).toBeDefined();
    expect(response.suggestions?.length).toBeGreaterThan(0);
  });

  it('should handle errors gracefully', async () => {
    const mockTextGeneration = vi.fn().mockRejectedValue(new Error('API Error'));

    (HfInference as vi.Mock).mockImplementation(() => ({
      textGeneration: mockTextGeneration
    }));

    vi.stubEnv('VITE_HUGGING_FACE_TOKEN', 'test-token');
    vi.resetModules();
    const { useHuggingFaceChat } = await import('../hooks/useHuggingFaceChat');

    const { result } = renderHook(() => useHuggingFaceChat());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    let response: any;
    await act(async () => {
      response = await result.current.processMessage('test');
    });

    expect(response.response).toBeDefined();
    expect(result.current.error).toBeDefined();
  });
});
