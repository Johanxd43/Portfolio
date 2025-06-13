import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CHAT_CONFIG } from '../constants';

export function useMessageHistory() {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('chat_history', []);
  const [undoStack, setUndoStack] = useState<ChatMessage[][]>([]);
  const [redoStack, setRedoStack] = useState<ChatMessage[][]>([]);

  const addMessage = useCallback((message: ChatMessage) => {
    setUndoStack(prev => [...prev, messages]);
    setRedoStack([]);
    setMessages(prev => {
      const newMessages = [...prev, message];
      if (newMessages.length > CHAT_CONFIG.MAX_MESSAGES) {
        return newMessages.slice(-CHAT_CONFIG.MAX_MESSAGES);
      }
      return newMessages;
    });
  }, [messages, setMessages]);

  const removeMessage = useCallback((messageId: string) => {
    setUndoStack(prev => [...prev, messages]);
    setRedoStack([]);
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, [messages, setMessages]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, messages]);
    setMessages(previousState);
    setUndoStack(prev => prev.slice(0, -1));
  }, [messages, undoStack, setMessages]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, messages]);
    setMessages(nextState);
    setRedoStack(prev => prev.slice(0, -1));
  }, [messages, redoStack, setMessages]);

  const clear = useCallback(() => {
    setUndoStack(prev => [...prev, messages]);
    setRedoStack([]);
    setMessages([]);
  }, [messages, setMessages]);

  return {
    messages,
    addMessage,
    removeMessage,
    undo,
    redo,
    clear,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0
  };
}