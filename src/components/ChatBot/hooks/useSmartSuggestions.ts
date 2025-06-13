import { useCallback, useState, useEffect } from 'react';
import { intentPatterns } from '../data/responses';

interface Suggestion {
  text: string;
  action: string;
  relevance: number;
}

export function useSmartSuggestions() {
  const [userInterests, setUserInterests] = useState<Map<string, number>>(new Map());
  
  const trackInteraction = useCallback((action: string) => {
    setUserInterests(prev => {
      const newInterests = new Map(prev);
      newInterests.set(action, (newInterests.get(action) || 0) + 1);
      return newInterests;
    });
  }, []);

  const getSuggestions = useCallback((
    currentIntent: string,
    context: string[],
    messageHistory: string[]
  ): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const pattern = intentPatterns[currentIntent];
    
    if (pattern?.responses) {
      // Añadir sugerencias basadas en el patrón actual
      pattern.responses.forEach(response => {
        response.suggestions?.forEach(suggestion => {
          suggestions.push({
            ...suggestion,
            relevance: userInterests.get(suggestion.action) || 0
          });
        });
      });
    }

    // Añadir sugerencias basadas en el contexto
    context.forEach(ctx => {
      const relatedPattern = Object.values(intentPatterns).find(p => 
        p.contextPatterns?.includes(ctx)
      );
      
      if (relatedPattern?.responses[0]?.suggestions) {
        relatedPattern.responses[0].suggestions.forEach(suggestion => {
          if (!suggestions.some(s => s.action === suggestion.action)) {
            suggestions.push({
              ...suggestion,
              relevance: (userInterests.get(suggestion.action) || 0) * 0.8
            });
          }
        });
      }
    });

    // Ordenar por relevancia y limitar a 4 sugerencias
    return suggestions
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 4);
  }, [userInterests]);

  return {
    getSuggestions,
    trackInteraction
  };
}