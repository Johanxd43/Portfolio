import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { CHAT_CONFIG } from '../constants';

interface QueuedMessage {
  message: ChatMessage;
  priority: number;
  timestamp: number;
}

export function useMessageQueue() {
  const [queue, setQueue] = useState<QueuedMessage[]>([]);
  const [processing, setProcessing] = useState(false);

  const enqueue = useCallback((message: ChatMessage, priority: number = 1) => {
    setQueue(prev => {
      const newQueue = [...prev, {
        message,
        priority,
        timestamp: Date.now()
      }].sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);

      // Mantener el límite de mensajes
      if (newQueue.length > CHAT_CONFIG.MAX_MESSAGES) {
        return newQueue.slice(-CHAT_CONFIG.MAX_MESSAGES);
      }
      return newQueue;
    });
  }, []);

  const dequeue = useCallback(async (processor: (message: ChatMessage) => Promise<void>) => {
    if (processing || queue.length === 0) return;

    setProcessing(true);
    try {
      const item = queue[0];
      await processor(item.message);
      setQueue(prev => prev.slice(1));
    } finally {
      setProcessing(false);
    }
  }, [queue, processing]);

  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    enqueue,
    dequeue,
    clear,
    size: queue.length,
    processing
  };
}