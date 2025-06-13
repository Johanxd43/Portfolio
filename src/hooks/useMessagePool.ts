const MESSAGE_POOL_SIZE = 50;

export function useMessagePool() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      if (newMessages.length > MESSAGE_POOL_SIZE) {
        return newMessages.slice(-MESSAGE_POOL_SIZE);
      }
      return newMessages;
    });
  }, []);

  return { messages, addMessage };
}