import { useState, useCallback, useRef } from 'react';

export interface ChatResponse {
  response: string;
  suggestions?: Array<{ text: string; action: string; }>;
}

export const useOpenRouterChat = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Need to use refs for tracking messages internally if we want full history,
  // but for the AI Gateway proxy, we will pass the conversation history in ChatBot.tsx.

  // Provide a function that supports SSE streaming to a callback
  const processMessageStream = useCallback(
    async (
      messages: any[],
      onChunk: (chunk: string) => void,
      onComplete: (suggestions?: Array<{ text: string; action: string }>) => void,
      onError: (err: Error) => void
    ) => {
      setIsProcessing(true);
      setError(null);

      const workerUrl = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787/api/chat';

      try {
        const response = await fetch(workerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
          throw new Error(`Proxy error: ${response.statusText}`);
        }

        if (!response.body) {
          throw new Error('ReadableStream not supported in this browser.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;

        let fullContent = '';

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);

                if (data === '[DONE]') {
                  // End of stream stream
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  const token = parsed.choices?.[0]?.delta?.content || '';
                  if (token) {
                    fullContent += token;
                    onChunk(token);
                  }
                } catch (e) {
                  console.warn('Error parsing stream chunk:', data, e);
                }
              }
            }
          }
        }

        // Simplistic NLP or regex to generate some basic suggestions based on response
        let suggestions: Array<{ text: string; action: string }> | undefined;
        const lowerContent = fullContent.toLowerCase();
        if (lowerContent.includes('proyecto') || lowerContent.includes('quantum')) {
            suggestions = [{ text: "Ver proyectos", action: "projects" }];
        } else if (lowerContent.includes('experiencia') || lowerContent.includes('cv')) {
            suggestions = [{ text: "Ver CV", action: "experience" }];
        }

        onComplete(suggestions);

      } catch (err: any) {
        console.error('Chat error:', err);
        setError(err);
        onError(err);
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return {
    processMessageStream,
    isProcessing,
    error,
    isInitialized: true,
  };
};
