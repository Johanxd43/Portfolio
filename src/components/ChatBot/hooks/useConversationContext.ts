import { useState, useCallback } from 'react';

interface ConversationContext {
  topic: string | null;
  depth: number;
  history: string[];
  entities: Map<string, string>;
  userPreferences: Set<string>;
  lastInteraction: Date;
}

export function useConversationContext() {
  const [context, setContext] = useState<ConversationContext>({
    topic: null,
    depth: 0,
    history: [],
    entities: new Map(),
    userPreferences: new Set(),
    lastInteraction: new Date()
  });

  const updateContext = useCallback((message: string, detectedIntent?: string) => {
    setContext(prev => {
      const now = new Date();
      const timeSinceLastInteraction = now.getTime() - prev.lastInteraction.getTime();
      
      // Reiniciar contexto si ha pasado mucho tiempo
      if (timeSinceLastInteraction > 30 * 60 * 1000) { // 30 minutos
        return {
          topic: detectedIntent || null,
          depth: 0,
          history: [message],
          entities: new Map(),
          userPreferences: prev.userPreferences,
          lastInteraction: now
        };
      }

      return {
        topic: detectedIntent || prev.topic,
        depth: detectedIntent === prev.topic ? prev.depth + 1 : 0,
        history: [...prev.history, message].slice(-10),
        entities: prev.entities,
        userPreferences: prev.userPreferences,
        lastInteraction: now
      };
    });
  }, []);

  const addUserPreference = useCallback((preference: string) => {
    setContext(prev => ({
      ...prev,
      userPreferences: new Set([...prev.userPreferences, preference])
    }));
  }, []);

  const addEntity = useCallback((key: string, value: string) => {
    setContext(prev => ({
      ...prev,
      entities: new Map(prev.entities.set(key, value))
    }));
  }, []);

  return {
    context,
    updateContext,
    addUserPreference,
    addEntity
  };
}