import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChatMessage } from '../types';

export function useMessageVirtualization(messages: ChatMessage[]) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
    scrollToFn: (offset, { behavior }) => {
      if (parentRef.current) {
        parentRef.current.scrollTop = offset;
      }
    }
  });

  return {
    parentRef,
    virtualizer
  };
}