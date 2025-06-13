import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  content: string;
  isUser: boolean;
}

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "¡Hola! Soy tu asistente virtual. Puedo ayudarte a explorar el portafolio. ¿Qué te gustaría saber? Por ejemplo:\n- Experiencia profesional\n- Proyectos destacados\n- Habilidades técnicas\n- Información de contacto",
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      content: input.trim(),
      isUser: true
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Process user input and generate response
    const response = generateResponse(input.toLowerCase());
    setTimeout(() => {
      setMessages(prev => [...prev, response]);
    }, 500);
  };

  const generateResponse = (input: string): Message => {
    if (input.includes('experiencia') || input.includes('trabajo') || input.includes('profesional')) {
      navigate('/resume');
      return {
        content: "Te he dirigido a la sección de Currículum donde podrás ver mi experiencia profesional detallada. ¿Hay algo específico que te gustaría saber sobre mi trayectoria?",
        isUser: false
      };
    }
    
    if (input.includes('proyecto') || input.includes('trabajo') || input.includes('portfolio')) {
      navigate('/projects');
      return {
        content: "Te he llevado a la sección de Proyectos donde podrás ver mis trabajos más destacados. Cada proyecto incluye una descripción detallada y las tecnologías utilizadas. ¿Te gustaría saber más sobre algún proyecto en particular?",
        isUser: false
      };
    }
    
    if (input.includes('habilidad') || input.includes('tecnología') || input.includes('skill')) {
      navigate('/resume');
      return {
        content: "En la sección de Currículum podrás encontrar todas mis habilidades técnicas organizadas por categorías. ¿Hay alguna tecnología específica que te interese?",
        isUser: false
      };
    }
    
    if (input.includes('contacto') || input.includes('email') || input.includes('mensaje')) {
      navigate('/contact');
      return {
        content: "Te he dirigido al formulario de contacto. Puedes enviarme un mensaje directo o usar cualquiera de los medios de contacto disponibles. ¿Necesitas ayuda con algo más?",
        isUser: false
      };
    }

    if (input.includes('hola') || input.includes('buenos días') || input.includes('buenas')) {
      return {
        content: "¡Hola! Soy el asistente virtual del portafolio. Puedo ayudarte a encontrar información sobre:\n- Experiencia profesional\n- Proyectos destacados\n- Habilidades técnicas\n- Información de contacto\n\n¿Qué te gustaría conocer?",
        isUser: false
      };
    }

    return {
      content: "Entiendo que quieres saber sobre '" + input + "'. ¿Podrías ser más específico? Puedo ayudarte con información sobre mi experiencia profesional, proyectos, habilidades técnicas o datos de contacto.",
      isUser: false
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-600">
          <h1 className="text-2xl font-bold text-white">Asistente del Portafolio</h1>
        </div>
        
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 whitespace-pre-line ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="¿Qué te gustaría saber sobre mi portafolio?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Send className="h-5 w-5 mr-2" />
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;