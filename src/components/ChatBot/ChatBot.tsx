import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Minimize2, Bot, Loader2, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHuggingFaceChat } from './hooks/useHuggingFaceChat';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: Array<{ text: string; action: string; }>;
  feedback?: 'positive' | 'negative';
}

const ChatBot: React.FC = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // <--- Inicialización del hook
  const { processMessage, isProcessing, error, isInitialized, isUsingFallback } = useHuggingFaceChat();

  useEffect(() => {
    if (showWelcome) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: "¡Hola! 👋 Soy Nova, tu asistente virtual. Estoy aquí para ayudarte a explorar el portafolio.\n\nPuedo informarte sobre:\n• 💼 Experiencia profesional\n• 🚀 Proyectos destacados\n• 💡 Habilidades técnicas\n• 📬 Información de contacto",
        isUser: false,
        timestamp: new Date(),
        suggestions: [
          { text: "Experiencia", action: "experience" },
          { text: "Proyectos", action: "projects" },
          { text: "Habilidades", action: "skills" },
          { text: "Contacto", action: "contact" }
        ]
      };
      setMessages([welcomeMessage]);
      setShowWelcome(false);
    }
  }, [showWelcome]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInput('');
    setIsTyping(true);

    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('experiencia') || lowerContent.includes('currículum') || lowerContent.includes('cv')) {
      console.log("INTENTANDO NAVEGAR A: /resume (vía texto directo)");
      navigate('/resume');
      console.log("NAVEGACIÓN A /resume EJECUTADA (vía texto directo).");
      setIsTyping(false);
      setIsMinimized(true);
      return;
    } else if (lowerContent.includes('proyecto') || lowerContent.includes('trabajos')) {
      console.log("INTENTANDO NAVEGAR A: /projects (vía texto directo)");
      navigate('/projects');
      console.log("NAVEGACIÓN A /projects EJECUTADA (vía texto directo).");
      setIsTyping(false);
      setIsMinimized(true);
      return;
    } else if (lowerContent.includes('contacto') || lowerContent.includes('email') || lowerContent.includes('teléfono')) {
      console.log("INTENTANDO NAVEGAR A: /contact (vía texto directo)");
      navigate('/contact');
      console.log("NAVEGACIÓN A /contact EJECUTADA (vía texto directo).");
      setIsTyping(false);
      setIsMinimized(true);
      return;
    }
    try {
      const response = await processMessage(content);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        isUser: false,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      addMessage(botMessage);
    } catch (error) {
      console.error('Error generating response:', error);
      addMessage({
        id: (Date.now() + 1).toString(),
        content: "Lo siento, ha ocurrido un error. ¿Podrías intentarlo de nuevo?",
        isUser: false,
        timestamp: new Date(),
        suggestions: [{ text: "Reintentar", action: "retry" }]
      });
    } finally {
      setIsTyping(false);
    }
  }, [addMessage, processMessage, navigate, setIsMinimized]);

  const handleSuggestionClick = useCallback((suggestion: { text: string; action: string }) => {
    // Añade estos console.log para depurar
    console.log("Sugerencia clicada:", suggestion.text, "Acción:", suggestion.action); 

    // Lógica para navegar según la acción de la sugerencia
    if (suggestion.action === 'experience') {
      console.log("INTENTANDO NAVEGAR A: /resume (vía sugerencia)");
      navigate('/resume');
      console.log("NAVEGACIÓN A /resume EJECUTADA (vía sugerencia).");
      setIsMinimized(true);
    } else if (suggestion.action === 'projects') {
      console.log("INTENTANDO NAVEGAR A: /projects (vía sugerencia)");
      navigate('/projects');
      console.log("NAVEGACIÓN A /projects EJECUTADA (vía sugerencia).");
      setIsMinimized(true);
    } else if (suggestion.action === 'contact') {
      console.log("INTENTANDO NAVEGAR A: /contact (vía sugerencia)");
      navigate('/contact');
      console.log("NAVEGACIÓN A /contact EJECUTADA (vía sugerencia).");
      setIsMinimized(true);
    } else if (suggestion.action === 'skills' || suggestion.action === 'quantum_skills' || suggestion.action === 'automation' || suggestion.action === 'smartcad' || suggestion.action === 'pathoptimizer' || suggestion.action === 'email' || suggestion.action === 'phone' || suggestion.action === 'current_role') {
      handleSendMessage(suggestion.text);
    } else {
      handleSendMessage(suggestion.text);
    }
  }, [navigate, handleSendMessage, setIsMinimized]); 

  const handleFeedback = useCallback((messageId: string, type: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback: type } : msg
    ));
  }, []);

  if (!isInitialized && !isUsingFallback) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-full shadow-2xl flex items-center space-x-3"
      >
        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
        <span className="text-sm text-gray-600">Inicializando Nova...</span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 bg-white shadow-2xl flex items-center transition-all duration-300 z-[999999] ${
        isMinimized 
          ? 'w-auto rounded-full' 
          : 'w-80 h-[500px] rounded-[20px] flex-col backdrop-blur-sm bg-white/95'
      }`}
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
      }}
    >
      {isMinimized ? (
        <motion.button
          onClick={() => setIsMinimized(false)}
          className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white hover:from-purple-700 hover:to-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="h-5 w-5" />
        </motion.button>
      ) : (
        <>
          <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-[20px] flex justify-between items-center w-full">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/10 rounded-full">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-white">Nova</h2>
                {isUsingFallback && (
                  <span className="text-[10px] text-white/80">Modo básico</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Minimizar chat"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              style={{ maxHeight: 'calc(500px - 120px)' }}
            >
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] space-y-2`}>
                      <div className={`rounded-xl p-3 shadow-sm ${
                        message.isUser
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-100/80 backdrop-blur-sm text-gray-900'
                      }`}>
                        <p className="whitespace-pre-line leading-relaxed text-sm">{message.content}</p>
                      </div>

                      {!message.isUser && (
                        <div className="flex items-center space-x-1.5 justify-end">
                          <button
                            onClick={() => handleFeedback(message.id, 'positive')}
                            className={`p-1 rounded-full transition-all ${
                              message.feedback === 'positive' 
                                ? 'text-green-600 bg-green-100 scale-110' 
                                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                            }`}
                            aria-label="Respuesta útil"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'negative')}
                            className={`p-1 rounded-full transition-all ${
                              message.feedback === 'negative' 
                                ? 'text-red-600 bg-red-100 scale-110' 
                                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            aria-label="Respuesta no útil"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {message.suggestions && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {message.suggestions.map((suggestion, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1 bg-white border border-gray-200 text-gray-800 rounded-full text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            >
                              {suggestion.text}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-xs">Nova está escribiendo...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 border-t border-gray-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-3 py-2 bg-gray-100/80 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors shadow-sm"
                  disabled={isTyping}
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </form>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ChatBot;
