import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Minimize2, Bot, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHuggingFaceChat } from './hooks/useHuggingFaceChat';
import QuantumLoader from '../QuantumLoader';

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
        content: "¡Hola! 👋 Soy Nova, tu asistente de inteligencia artificial.\n\nEstoy conectado a la base de conocimiento de Johan Sebastián para responder preguntas sobre:\n• ⚛️ Computación Cuántica\n• 🏭 Automatización Industrial\n• 💻 Desarrollo de Software\n\n¿En qué puedo ayudarte hoy?",
        isUser: false,
        timestamp: new Date(),
        suggestions: [
          { text: "Ver proyectos Quantum", action: "projects" },
          { text: "¿Experiencia en IA?", action: "experience" },
          { text: "Stack tecnológico", action: "skills" },
          { text: "Contactar", action: "contact" }
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
        className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm p-4 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center space-x-3 border border-purple-500/30"
      >
        <QuantumLoader size={20} />
        <span className="text-sm text-gray-300">Inicializando Nova...</span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 flex items-center transition-all duration-300 z-[999999] ${
        isMinimized 
          ? 'w-auto rounded-full' 
          : 'w-80 h-[500px] rounded-[20px] flex-col backdrop-blur-md bg-gray-900/95 border border-purple-500/30'
      }`}
      style={{
        boxShadow: isMinimized
          ? '0 0 15px rgba(139, 92, 246, 0.5)'
          : '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}
    >
      {isMinimized ? (
        <motion.button
          onClick={() => setIsMinimized(false)}
          className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white shadow-lg"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Abrir chat"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      ) : (
        <>
          <div className="px-4 py-3 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 rounded-t-[20px] flex justify-between items-center w-full border-b border-purple-500/20">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-purple-500/20 rounded-full border border-purple-500/30">
                <Bot className="h-4 w-4 text-cyan-300" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-gray-100">Nova</h2>
                {isUsingFallback && (
                  <span className="text-[10px] text-gray-400">Modo básico</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Minimizar chat"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent"
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
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                          : 'bg-gray-800/80 text-gray-200 border border-gray-700'
                      }`}>
                        <p className="whitespace-pre-line leading-relaxed text-sm font-light">{message.content}</p>
                      </div>

                      {!message.isUser && (
                        <div className="flex items-center space-x-1.5 justify-end">
                          <button
                            onClick={() => handleFeedback(message.id, 'positive')}
                            className={`p-1 rounded-full transition-all ${
                              message.feedback === 'positive' 
                                ? 'text-green-400 bg-green-900/30 scale-110'
                                : 'text-gray-500 hover:text-green-400 hover:bg-green-900/20'
                            }`}
                            aria-label="Respuesta útil"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'negative')}
                            className={`p-1 rounded-full transition-all ${
                              message.feedback === 'negative' 
                                ? 'text-red-400 bg-red-900/30 scale-110'
                                : 'text-gray-500 hover:text-red-400 hover:bg-red-900/20'
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
                              className="px-3 py-1 bg-gray-800 border border-purple-500/30 text-cyan-300 rounded-full text-xs font-medium hover:bg-gray-700 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(139,92,246,0.1)]"
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
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <QuantumLoader size={16} />
                    <span className="text-xs font-mono">Nova procesando...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 border-t border-gray-800 bg-gray-900/50">
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
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-500 hover:to-cyan-500 transition-colors shadow-lg"
                  disabled={isTyping}
                  aria-label="Enviar mensaje"
                  title="Enviar mensaje"
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
