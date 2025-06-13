import { useState, useCallback, useEffect, useRef } from 'react';
import HuggingFaceService from '../services/huggingFaceService';
import { useMessageCache } from './useMessageCache';
import { useNetworkRetry } from './useNetworkRetry';
import { NLPResult } from '../types';

export function useHuggingFace() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [modelLoadProgress, setModelLoadProgress] = useState(0);
  const contextRef = useRef<string[]>([]);
  const messageCache = useMessageCache<NLPResult>();
  const { retryWithBackoff } = useNetworkRetry();
  const service = HuggingFaceService.getInstance();

  useEffect(() => {
    const initialize = async () => {
      try {
        await service.initialize((progress) => {
          setModelLoadProgress(progress);
        });
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize'));
      }
    };

    initialize();
  }, []);

  const processMessage = useCallback(async (
    message: string,
    context: string[] = []
  ): Promise<NLPResult> => {
    if (!isInitialized) {
      throw new Error('HuggingFace service not initialized');
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Verificar caché
      const cached = await messageCache.get(message);
      if (cached) return cached;

      // Procesar mensaje
      const result = await retryWithBackoff(() => 
        service.processMessage(message, [...contextRef.current, ...context])
      );

      // Actualizar contexto
      contextRef.current = [message, ...contextRef.current].slice(0, 5);

      // Guardar en caché
      await messageCache.set(message, result);

      return {
        intent: {
          name: result.intent,
          confidence: result.confidence
        },
        response: result.response,
        suggestions: getSuggestionsForIntent(result.intent),
        sentiment: result.sentiment
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Processing failed');
      setError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [isInitialized, retryWithBackoff, messageCache]);

  const getSuggestionsForIntent = (intent: string) => {
    // Implementar lógica de sugerencias basada en el intent
    const suggestions = {
      experience: [
        { text: "Rol actual", action: "current_role" },
        { text: "Experiencia previa", action: "previous_roles" }
      ],
      projects: [
        { text: "SmartCAD Vision", action: "smartcad" },
        { text: "PathOptimizer", action: "pathoptimizer" }
      ],
      // ... más sugerencias
    };

    return suggestions[intent as keyof typeof suggestions] || [];
  };

  return {
    processMessage,
    isProcessing,
    error,
    isInitialized,
    modelLoadProgress
  };
}