import { useState, useCallback, useRef } from 'react';
import { CHAT_CONFIG } from '../constants';

export function useTypingIndicator() {
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startTyping = useCallback(() => {
    setIsTyping(true);
  }, []);

  const stopTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsTyping(false);
  }, []);

  const simulateTyping = useCallback((messageLength: number) => {
    startTyping();
    
    // Calcular tiempo de escritura basado en la longitud del mensaje
    const typingTime = Math.min(
      messageLength * 50, // 50ms por carácter
      CHAT_CONFIG.TYPING_DELAY
    );

    timeoutRef.current = setTimeout(() => {
      stopTyping();
    }, typingTime);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [startTyping, stopTyping]);

  return {
    isTyping,
    startTyping,
    stopTyping,
    simulateTyping
  };
}