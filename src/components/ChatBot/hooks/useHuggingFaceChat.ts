import { useState, useCallback, useEffect, useRef } from 'react';
import { HfInference } from '@huggingface/inference';
import { portfolioData } from '../data/portfolioData';

const HUGGING_FACE_TOKEN = import.meta.env.VITE_HUGGING_FACE_TOKEN;
const MODEL_ID = "facebook/blenderbot-90M";
const FALLBACK_MODEL_ID = "facebook/blenderbot-400M-distill";

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

export function useHuggingFaceChat() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const conversationHistory = useRef<string[]>([]);
  const hf = useRef<HfInference | null>(null);
  const initAttempts = useRef(0);
  const MAX_INIT_ATTEMPTS = 3;
  const currentModel = useRef(MODEL_ID);
  const initPromise = useRef<Promise<HfInference | null> | null>(null);
  const useFallbackMode = useRef(false); // Iniciar intentando usar Hugging Face
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const validateToken = useCallback(() => {
    if (!HUGGING_FACE_TOKEN?.trim()) {
      console.info('No Hugging Face token provided, using fallback mode');
      return false;
    }
    return true;
  }, []);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const initHuggingFace = useCallback(async () => {
    if (initPromise.current) return initPromise.current;
    if (isInitialized && hf.current) return hf.current;
    if (initAttempts.current >= MAX_INIT_ATTEMPTS) {
      console.info('Max initialization attempts reached, using fallback mode');
      useFallbackMode.current = true;
      setIsInitialized(true);
      return null;
    }

    initPromise.current = (async () => {
      try {
        clearTimeouts();

        if (!validateToken()) {
          useFallbackMode.current = true;
          setIsInitialized(true);
          return null;
        }

        initAttempts.current++;
        console.info('Initializing Hugging Face, attempt:', initAttempts.current);
        
        const inference = new HfInference(HUGGING_FACE_TOKEN);

        // Test con un mensaje simple
        const testPromise = inference.textGeneration({
          model: currentModel.current,
          inputs: "Hola",
          parameters: {
            max_new_tokens: 50,
            return_full_text: false
          }
        });

        const timeoutPromise = new Promise((_, reject) => {
          timeoutRef.current = setTimeout(() => {
            reject(new Error('Initialization timeout'));
          }, 10000);
        });

        await Promise.race([testPromise, timeoutPromise]);

        clearTimeouts();
        hf.current = inference;
        setIsInitialized(true);
        useFallbackMode.current = false;
        initAttempts.current = 0;
        console.info('Hugging Face initialized successfully');
        return inference;

      } catch (error) {
        console.info('Error initializing Hugging Face, attempting recovery...');
        clearTimeouts();

        if (currentModel.current === MODEL_ID) {
          console.info('Trying fallback model...');
          currentModel.current = FALLBACK_MODEL_ID;
          initPromise.current = null;
          return initHuggingFace();
        }

        if (initAttempts.current < MAX_INIT_ATTEMPTS) {
          const delay = Math.pow(2, initAttempts.current) * 1000;
          console.info(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          initPromise.current = null;
          return initHuggingFace();
        }

        console.info('All initialization attempts failed, using fallback mode');
        useFallbackMode.current = true;
        setIsInitialized(true);
        return null;
      } finally {
        clearTimeouts();
        initPromise.current = null;
      }
    })();

    return initPromise.current;
  }, [validateToken, clearTimeouts]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        if (validateToken()) {
          await initHuggingFace();
        } else {
          useFallbackMode.current = true;
          setIsInitialized(true);
        }
      } catch (error) {
        if (mounted) {
          console.info('Initialization failed, using fallback mode');
          useFallbackMode.current = true;
          setIsInitialized(true);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      clearTimeouts();
    };
  }, [initHuggingFace, validateToken, clearTimeouts]);

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

      const client = await initHuggingFace();
      if (!client) {
        return {
          response: getDefaultResponse(message),
          suggestions: getSuggestions(message, '')
        };
      }

      const response = await Promise.race([
        client.textGeneration({
          model: currentModel.current,
          inputs: `${SYSTEM_PROMPT}\n\nHistorial:\n${conversationHistory.current.join('\n')}\n\nUsuario: ${message}\nNova:`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.2,
            do_sample: true,
            return_full_text: false
          }
        }),
        new Promise((_, reject) => {
          const timeout = setTimeout(() => {
            clearTimeout(timeout);
            reject(new Error('Response timeout'));
          }, 10000);
        })
      ]);

      let generatedText = response.generated_text.trim();

      if (!generatedText || generatedText.length < 10) {
        return {
          response: getDefaultResponse(message),
          suggestions: getSuggestions(message, '')
        };
      }

      conversationHistory.current = [
        ...conversationHistory.current,
        `Usuario: ${message}`,
        `Nova: ${generatedText}`
      ].slice(-6);

      return {
        response: generatedText,
        suggestions: getSuggestions(message, generatedText)
      };

    } catch (err) {
      console.info('Error processing message, using fallback response');
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return {
        response: getDefaultResponse(message),
        suggestions: getSuggestions(message, '')
      };
    } finally {
      setIsProcessing(false);
    }
  }, [initHuggingFace]);

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

    return "¿Podrías ser más específico? Puedo informarte sobre experiencia profesional, proyectos destacados, habilidades técnicas o datos de contacto.";
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