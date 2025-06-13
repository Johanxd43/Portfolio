import { ConversationContext } from './types';

const CONTEXT_TIMEOUT = 1000 * 60 * 30; // 30 minutos

class ContextManager {
  private context: ConversationContext;

  constructor() {
    this.context = this.getInitialContext();
  }

  private getInitialContext(): ConversationContext {
    return {
      topicDepth: 0,
      lastInteraction: new Date(),
      userPreferences: [],
      conversationHistory: []
    };
  }

  public updateContext(input: string, topic?: string): void {
    const now = new Date();
    
    // Reiniciar contexto si ha pasado mucho tiempo
    if (this.hasContextExpired()) {
      this.context = this.getInitialContext();
    }

    this.context = {
      ...this.context,
      currentTopic: topic || this.context.currentTopic,
      topicDepth: topic === this.context.currentTopic ? 
        this.context.topicDepth + 1 : 0,
      lastInteraction: now,
      conversationHistory: [
        ...this.context.conversationHistory,
        input
      ].slice(-10) // Mantener solo las últimas 10 interacciones
    };
  }

  public getContext(): ConversationContext {
    return this.context;
  }

  private hasContextExpired(): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - this.context.lastInteraction.getTime();
    return timeDiff > CONTEXT_TIMEOUT;
  }

  public addUserPreference(preference: string): void {
    if (!this.context.userPreferences.includes(preference)) {
      this.context.userPreferences = [
        ...this.context.userPreferences,
        preference
      ];
    }
  }

  public reset(): void {
    this.context = this.getInitialContext();
  }
}

export const contextManager = new ContextManager();