import { useState, useCallback, useEffect, useRef } from 'react';
import { NLPResult, Intent, MemoryItem } from '../types';
import * as tf from '@tensorflow/tfjs';
import { load } from '@tensorflow-models/universal-sentence-encoder';
import { useNetworkRetry } from './useNetworkRetry';

interface ShortTermMemory {
  recentTopics: string[];
  contextStack: string[];
  lastResponse: string;
  userPreferences: Set<string>;
  interactionCount: number;
}

interface LongTermMemory {
  patterns: Map<string, number>;
  preferences: Set<string>;
  successfulResponses: Map<string, number>;
  failedResponses: Map<string, number>;
  userFeedback: Map<string, number>;
}

const MEMORY_LIMIT = 10;
const CONFIDENCE_THRESHOLD = 0.75;
const CONTEXT_WEIGHT = 0.3;
const PREFERENCE_WEIGHT = 0.2;

export function useNLP() {
  const [lightModel, setLightModel] = useState<boolean>(true);
  const [heavyModel, setHeavyModel] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [modelLoadProgress, setModelLoadProgress] = useState(0);
  const { retryWithBackoff } = useNetworkRetry();

  const shortTermMemory = useRef<ShortTermMemory>({
    recentTopics: [],
    contextStack: [],
    lastResponse: '',
    userPreferences: new Set(),
    interactionCount: 0
  });

  const longTermMemory = useRef<LongTermMemory>({
    patterns: new Map(),
    preferences: new Set(),
    successfulResponses: new Map(),
    failedResponses: new Map(),
    userFeedback: new Map()
  });

  // Patrones mejorados con más contexto y variaciones
  const lightPatterns = {
    experience: {
      patterns: [
        'experiencia', 'trabajo', 'profesional', 'carrera', 'laboral',
        'trayectoria', 'cv', 'currículum', 'ocupación', 'empleo'
      ],
      contextPatterns: [
        'anterior', 'actual', 'pasado', 'presente', 'futuro',
        'empresa', 'puesto', 'cargo', 'responsabilidades'
      ],
      responses: [
        {
          text: "Mi experiencia incluye roles en computación cuántica y desarrollo de software. ¿Te gustaría saber más sobre algún área específica?",
          confidence: 0.8,
          context: 'general',
          suggestions: [
            { text: "Rol actual", action: "current_role" },
            { text: "Computación Cuántica", action: "quantum_computing" }
          ]
        },
        {
          text: "Actualmente trabajo como Consultor Logístico en Landoo, donde aplico mis conocimientos en optimización y desarrollo. ¿Qué te gustaría saber sobre mi rol actual?",
          confidence: 0.9,
          context: 'current',
          suggestions: [
            { text: "Responsabilidades", action: "current_responsibilities" },
            { text: "Tecnologías", action: "current_tech" }
          ]
        }
      ]
    },
    projects: {
      patterns: [
        'proyecto', 'portfolio', 'desarrollo', 'implementación',
        'solución', 'aplicación', 'sistema', 'trabajo'
      ],
      contextPatterns: [
        'reciente', 'destacado', 'importante', 'principal',
        'tecnología', 'resultado', 'impacto', 'cliente'
      ],
      responses: [
        {
          text: "He desarrollado varios proyectos innovadores como SmartCAD Vision y PathOptimizer Pro. ¿Sobre cuál te gustaría saber más?",
          confidence: 0.8,
          context: 'general',
          suggestions: [
            { text: "SmartCAD Vision", action: "smartcad" },
            { text: "PathOptimizer", action: "pathoptimizer" }
          ]
        },
        {
          text: "SmartCAD Vision es un sistema de interpretación inteligente de planos que utiliza IA. ¿Te gustaría conocer más detalles técnicos?",
          confidence: 0.9,
          context: 'smartcad',
          suggestions: [
            { text: "Tecnologías", action: "smartcad_tech" },
            { text: "Resultados", action: "smartcad_results" }
          ]
        }
      ]
    }
  };

  // Inicialización progresiva mejorada
  useEffect(() => {
    const initializeHeavyModel = async () => {
      try {
        await retryWithBackoff(async () => {
          const model = await load({
            onProgress: (progress) => setModelLoadProgress(progress)
          });
          setHeavyModel(model);
        });
      } catch (err) {
        console.warn('Heavy model failed to load, falling back to light model');
      }
    };

    const timer = setTimeout(initializeHeavyModel, 2000);
    return () => clearTimeout(timer);
  }, [retryWithBackoff]);

  // Sistema de memoria mejorado
  const updateMemory = useCallback((
    message: string,
    response: NLPResult,
    successful: boolean
  ) => {
    const { recentTopics, contextStack, userPreferences } = shortTermMemory.current;
    const { patterns, successfulResponses, failedResponses } = longTermMemory.current;

    // Actualizar memoria a corto plazo
    recentTopics.unshift(response.intent.name);
    if (recentTopics.length > MEMORY_LIMIT) recentTopics.pop();

    contextStack.unshift(response.response);
    if (contextStack.length > MEMORY_LIMIT) contextStack.pop();

    shortTermMemory.current.lastResponse = response.response;
    shortTermMemory.current.interactionCount++;

    // Actualizar memoria a largo plazo
    patterns.set(message, (patterns.get(message) || 0) + 1);
    
    if (successful) {
      successfulResponses.set(response.intent.name, 
        (successfulResponses.get(response.intent.name) || 0) + 1);
    } else {
      failedResponses.set(response.intent.name,
        (failedResponses.get(response.intent.name) || 0) + 1);
    }

    // Análisis de preferencias
    response.suggestions?.forEach(suggestion => {
      if (suggestion.action) {
        userPreferences.add(suggestion.action);
      }
    });
  }, []);

  // Procesamiento principal mejorado
  const processMessage = useCallback(async (message: string): Promise<NLPResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Procesamiento con modelo ligero
      const lightResult = await processWithLightModel(message);
      
      // 2. Enriquecimiento con contexto
      const contextualConfidence = calculateContextualConfidence(
        lightResult,
        shortTermMemory.current
      );

      if (contextualConfidence > CONFIDENCE_THRESHOLD) {
        const enhancedResult = enhanceWithContext(
          lightResult,
          shortTermMemory.current
        );
        updateMemory(message, enhancedResult, true);
        return enhancedResult;
      }

      // 3. Procesamiento con modelo pesado si está disponible
      if (heavyModel) {
        const heavyResult = await processWithHeavyModel(message);
        if (heavyResult.confidence > CONFIDENCE_THRESHOLD) {
          updateMemory(message, heavyResult, true);
          return heavyResult;
        }
      }

      // 4. Fallback a respuesta contextual
      const fallbackResult = await generateContextualResponse(
        message,
        shortTermMemory.current
      );
      updateMemory(message, fallbackResult, false);
      return fallbackResult;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error processing message');
      setError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [heavyModel, updateMemory]);

  // Funciones auxiliares mejoradas...
  const calculateContextualConfidence = (
    result: NLPResult,
    memory: ShortTermMemory
  ): number => {
    const baseConfidence = result.confidence;
    const contextBonus = memory.recentTopics.includes(result.intent.name) ? 
      CONTEXT_WEIGHT : 0;
    const preferenceBonus = memory.userPreferences.has(result.intent.name) ?
      PREFERENCE_WEIGHT : 0;

    return Math.min(1, baseConfidence + contextBonus + preferenceBonus);
  };

  const enhanceWithContext = (
    result: NLPResult,
    memory: ShortTermMemory
  ): NLPResult => {
    // Implementar lógica de mejora basada en contexto
    return result;
  };

  // ... resto de la implementación

  return {
    processMessage,
    isProcessing,
    error,
    modelLoadProgress,
    shortTermMemory: shortTermMemory.current,
    longTermMemory: longTermMemory.current
  };
}