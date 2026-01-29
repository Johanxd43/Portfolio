import { useState, useCallback, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { portfolioData } from '../data/portfolioData';

const SYSTEM_PROMPT = `
Eres Nova, el asistente virtual inteligente de ${portfolioData.profile.name}.
Tu misión es actuar como el primer punto de contacto profesional, demostrando conocimiento profundo sobre su perfil en Mecatrónica, Computación Cuántica y Desarrollo de Software.

BASE DE CONOCIMIENTO:
${JSON.stringify(portfolioData, null, 2)}

DIRECTRICES DE PERSONALIDAD:
1. **Identidad:** Eres profesional, técnico pero accesible. Te apasiona la innovación y la eficiencia.
2. **Precisión:** Utiliza EXCLUSIVAMENTE la información proporcionada en la BASE DE CONOCIMIENTO. Si te preguntan algo que no está ahí (como edad exacta o dirección privada), responde que no tienes ese dato pero puedes ofrecer su email.
3. **Formato:** Tus respuestas deben ser breves (máx 3 oraciones), claras y orientadas a la acción (invitar a ver proyectos o contactar).
4. **Idioma:** Responde siempre en Español.

EJEMPLOS DE RESPUESTA:
- "Johan se especializa en crear puentes entre el hardware y el software, destacando en proyectos como SmartCAD Vision."
- "Su experiencia en Multiverse Computing le permitió aplicar algoritmos cuánticos a problemas industriales reales."
`;

export function useOpenRouter() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized] = useState(true);
  const conversationHistory = useRef<{ role: string; content: string }[]>([]);
  const useFallbackMode = useRef(false);

  const processMessage = useCallback(async (message: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      if (useFallbackMode.current) {
        return {
          response: getDefaultResponse(message),
          suggestions: getSuggestions(message, '')
        };
      }

      // Add user message to temporary history for the API call
      const currentMessages = [
        ...conversationHistory.current,
        { role: 'user', content: message }
      ];

      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: {
          messages: currentMessages,
          systemPrompt: SYSTEM_PROMPT
        }
      });

      if (error) throw error;

      const generatedText = data?.content || '';

      if (!generatedText || generatedText.length < 2) {
         throw new Error('Empty response');
      }

      // Update history
      conversationHistory.current = [
        ...conversationHistory.current,
        { role: 'user', content: message },
        { role: 'assistant', content: generatedText }
      ].slice(-10); // Keep last 10 messages

      return {
        response: generatedText,
        suggestions: getSuggestions(message, generatedText)
      };

    } catch (err) {
      console.error('Error processing message, using fallback response:', err);
      // Fallback response handling
      return {
        response: getDefaultResponse(message),
        suggestions: getSuggestions(message, '')
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getDefaultResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('experiencia') || lowerMessage.includes('trabajo')) {
      return "Actualmente soy Consultor Logístico en Landoo, donde optimizo procesos y gestiono proyectos internacionales. Antes trabajé como Desarrollador de Software en Multiverse Computing, enfocado en computación cuántica. ¿Qué te gustaría saber específicamente?";
    }

    if (lowerMessage.includes('proyecto') || lowerMessage.includes('desarrollo')) {
      return "Los proyectos más destacados son SmartCAD Vision (interpretación de planos con IA), PathOptimizer Pro (optimización de trayectorias) e IntelliBot Industry (asistente industrial). ¿Te gustaría conocer más detalles de alguno?";
    }

    if (lowerMessage.includes('habilidad') || lowerMessage.includes('tecnología')) {
      return "Las principales habilidades incluyen desarrollo en Python y C++, especialización en computación cuántica y automatización industrial. También experiencia con Odoo y sistemas CNC. ¿Qué área te interesa más?";
    }

    if (lowerMessage.includes('contacto') || lowerMessage.includes('email')) {
      return "Puedes contactar por email (johan-willi@hotmail.com) o teléfono (+34 629903206). La ubicación es Donostia – San Sebastian. ¿Qué método prefieres?";
    }

    return "Lo siento, tuve un problema de conexión momentáneo. Pero puedo informarte sobre experiencia profesional, proyectos destacados, habilidades técnicas o datos de contacto.";
  };

  const getSuggestions = (input: string, response: string) => {
    const lowerInput = input.toLowerCase();
    const lowerResponse = response.toLowerCase();

    if (lowerInput.includes('experiencia') || lowerResponse.includes('experiencia')) {
      return [
        { text: "Rol actual", action: "current_role" },
        { text: "Computación Cuántica", action: "quantum" },
        { text: "Ver proyectos", action: "projects" }
      ];
    }

    if (lowerInput.includes('proyecto') || lowerResponse.includes('proyecto')) {
      return [
        { text: "SmartCAD Vision", action: "smartcad" },
        { text: "PathOptimizer Pro", action: "pathoptimizer" },
        { text: "Ver habilidades", action: "skills" }
      ];
    }

    if (lowerInput.includes('habilidad') || lowerResponse.includes('habilidad')) {
      return [
        { text: "Computación Cuántica", action: "quantum_skills" },
        { text: "Automatización", action: "automation" },
        { text: "Ver proyectos", action: "projects" }
      ];
    }

    if (lowerInput.includes('contacto') || lowerResponse.includes('contacto')) {
      return [
        { text: "Email", action: "email" },
        { text: "Teléfono", action: "phone" },
        { text: "Ver experiencia", action: "experience" }
      ];
    }

    return [
      { text: "Ver experiencia", action: "experience" },
      { text: "Ver proyectos", action: "projects" },
      { text: "Contactar", action: "contact" }
    ];
  };

  return {
    processMessage,
    isProcessing,
    error,
    isInitialized,
    isUsingFallback: useFallbackMode.current,
    clearHistory: () => {
      conversationHistory.current = [];
    }
  };
}
