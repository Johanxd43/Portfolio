import { useCallback } from 'react';
import { findBestMatch, selectResponse } from '../utils/nlpUtils';

interface NLPResponse {
  response: string;
  suggestions: Array<{ text: string; action: string; }>;
}

export function useSimpleNLP() {
  const processMessage = useCallback(async (message: string): Promise<NLPResponse> => {
    // Encontrar la mejor coincidencia de intención
    const match = findBestMatch(message);
    
    if (match.confidence > 0.3) {
      const response = selectResponse(match.intent, match.context);
      return {
        response: response.text,
        suggestions: response.suggestions
      };
    }

    // Si no hay una coincidencia clara, usar respuesta por defecto
    const defaultResponse = selectResponse('unknown');
    return {
      response: defaultResponse.text,
      suggestions: defaultResponse.suggestions
    };
  }, []);

  return { processMessage };
}