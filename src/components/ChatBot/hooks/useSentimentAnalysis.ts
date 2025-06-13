import { useState, useCallback } from 'react';

type Sentiment = 'positive' | 'negative' | 'neutral';

interface SentimentState {
  current: Sentiment;
  history: Sentiment[];
  score: number;
}

export function useSentimentAnalysis() {
  const [sentiment, setSentiment] = useState<SentimentState>({
    current: 'neutral',
    history: [],
    score: 0
  });

  const analyzeSentiment = useCallback((text: string): Sentiment => {
    const positiveWords = ['gracias', 'excelente', 'genial', 'bueno', 'me gusta', 'perfecto'];
    const negativeWords = ['malo', 'error', 'problema', 'no entiendo', 'confuso', 'difícil'];
    
    text = text.toLowerCase();
    
    let score = 0;
    positiveWords.forEach(word => {
      if (text.includes(word)) score += 1;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) score -= 1;
    });
    
    return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
  }, []);

  const updateSentiment = useCallback((text: string) => {
    const newSentiment = analyzeSentiment(text);
    
    setSentiment(prev => {
      const newHistory = [...prev.history, newSentiment].slice(-5);
      const newScore = prev.score + (newSentiment === 'positive' ? 1 : newSentiment === 'negative' ? -1 : 0);
      
      return {
        current: newSentiment,
        history: newHistory,
        score: newScore
      };
    });
  }, [analyzeSentiment]);

  return {
    sentiment,
    updateSentiment,
    analyzeSentiment
  };
}