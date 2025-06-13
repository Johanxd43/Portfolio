import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHuggingFaceChat } from '../hooks/useHuggingFaceChat';
import { HfInference } from '@huggingface/inference';

// Mock HfInference
vi.mock('@huggingface/inference', () => ({
  HfInference: vi.fn(() => ({
    conversational: vi.fn()
  }))
}));

describe('useHuggingFaceChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should initialize in fallback mode when no token is provided', async () => {
    const { result } = renderHook(() => useHuggingFaceChat());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.isUsingFallback).toBe(true);
    expect(result.current.isInitialized).toBe(true);
  });

  it('should try to initialize Hugging Face when token is provided', async () => {
    const mockConversational = vi.fn().mockResolvedValue({
      generated_text: 'Test response'
    });

    (HfInference as jest.Mock).mockImplementation(() => ({
      conversational: mockConversational
    }));

    vi.stubEnv('VITE_HUGGING_FACE_TOKEN', 'test-token');

    const { result } = renderHook(() => useHuggingFaceChat());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(HfInference).toHaveBeenCalledWith('test-token');
    expect(mockConversational).toHaveBeenCalled();
  });

  it('should handle message processing in fallback mode', async () => {
    const { result } = renderHook(() => useHuggingFaceChat());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    let response;
    await act(async () => {
      response = await result.current.processMessage('experiencia');
    });
    
    expect(response.response).toContain('Consultor Logístico');
    expect(response.suggestions).toBeDefined();
    expect(response.suggestions?.length).toBeGreaterThan(0);
  });

  it('should handle errors gracefully', async () => {
    const mockConversational = vi.fn().mockRejectedValue(new Error('API Error'));

    (HfInference as jest.Mock).mockImplementation(() => ({
      conversational: mockConversational
    }));

    vi.stubEnv('VITE_HUGGING_FACE_TOKEN', 'test-token');

    const { result } = renderHook(() => useHuggingFaceChat());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    let response;
    await act(async () => {
      response = await result.current.processMessage('test');
    });
    
    expect(response.response).toBeDefined();
    expect(result.current.error).toBeDefined();
  });
});