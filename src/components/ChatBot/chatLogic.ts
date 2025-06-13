import { ChatResponse, IntentClassification } from './types';
import { classifyIntent, shouldHandoff } from './intentClassifier';
import { contextManager } from './contextManager';

export const generateResponse = async (
  input: string,
  currentPath: string
): Promise<ChatResponse> => {
  try {
    const classification = classifyIntent(input);
    const context = contextManager.getContext();

    // Actualizar contexto con la nueva interacción
    contextManager.updateContext(input, classification.intent);

    // Si la confianza es baja, usar respuesta genérica
    if (shouldHandoff(classification)) {
      return getGenericResponse(input, context);
    }

    // Generar respuesta basada en la intención
    return await getIntentBasedResponse(classification, context, currentPath);
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      message: "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde.",
      suggestions: [
        { text: "Reintentar", action: "retry" }
      ]
    };
  }
};

const getIntentBasedResponse = async (
  classification: IntentClassification,
  context: ConversationContext,
  currentPath: string
): Promise<ChatResponse> => {
  switch (classification.intent) {
    case 'experience':
      return {
        message: `${getContextualGreeting(context)}Mi experiencia incluye:\n\n• Consultor Logístico en Landoo (2024-Presente)\n• Desarrollador de Software en Multiverse Computing (2022-2023)\n• Experiencia en optimización cuántica y sistemas CNC\n\n¿Te gustaría saber más sobre algún rol específico?`,
        suggestions: [
          { text: "Rol actual", action: "current_role" },
          { text: "Computación Cuántica", action: "quantum_computing" },
          { text: "Logística", action: "logistics" }
        ]
      };

    case 'projects':
      return {
        message: `${getContextualGreeting(context)}Mis proyectos más destacados incluyen:\n\n• SmartCAD Vision - Interpretación inteligente de planos\n• PathOptimizer Pro - Optimización cuántica de trayectorias\n• IntelliBot Industry - Asistente virtual industrial\n\n¿Sobre cuál te gustaría saber más?`,
        suggestions: [
          { text: "SmartCAD Vision", action: "smartcad" },
          { text: "PathOptimizer", action: "pathoptimizer" },
          { text: "IntelliBot", action: "intellibot" }
        ]
      };

    case 'skills':
      return {
        message: `${getContextualGreeting(context)}Mis principales áreas de experiencia incluyen:\n\n• Computación Cuántica: Python, D-Wave, Optimización\n• Desarrollo: Python, C++, Odoo\n• Automatización: CNC, MATLAB, Control Industrial\n\n¿Qué área te interesa más?`,
        suggestions: [
          { text: "Computación Cuántica", action: "quantum_skills" },
          { text: "Desarrollo", action: "dev_skills" },
          { text: "Automatización", action: "automation_skills" }
        ]
      };

    case 'contact':
      return {
        message: `${getContextualGreeting(context)}Puedes contactarme a través de:\n\n• Email: johan-willi@hotmail.com\n• Ubicación: Donostia – San Sebastian\n• Teléfono: (+34) 629903206\n\n¿Qué método prefieres?`,
        suggestions: [
          { text: "Email", action: "email_contact" },
          { text: "Teléfono", action: "phone_contact" }
        ]
      };

    case 'greeting':
      return {
        message: "¡Hola! Soy Nova, tu asistente virtual especializado en tecnología industrial. ¿En qué puedo ayudarte hoy?\n\nPuedo informarte sobre:\n• Experiencia en computación cuántica\n• Proyectos de automatización\n• Habilidades técnicas\n• Información de contacto",
        suggestions: [
          { text: "Experiencia", action: "experience" },
          { text: "Proyectos", action: "projects" },
          { text: "Habilidades", action: "skills" },
          { text: "Contacto", action: "contact" }
        ]
      };

    case 'farewell':
      return {
        message: "¡Gracias por tu interés! Si necesitas más información, no dudes en preguntarme. ¡Hasta pronto!",
        suggestions: [
          { text: "Volver a empezar", action: "restart" }
        ]
      };

    default:
      return getGenericResponse(input, context);
  }
};

const getContextualGreeting = (context: ConversationContext): string => {
  if (context.topicDepth === 0) {
    return '';
  }
  return context.topicDepth === 1 ? 
    'Entiendo que quieres saber más. ' : 
    'Perfecto, profundicemos en eso. ';
};

const getGenericResponse = (input: string, context: ConversationContext): ChatResponse => {
  return {
    message: `Entiendo que quieres saber sobre "${input}". ¿Podrías ser más específico? Puedo ayudarte con información sobre mi experiencia en computación cuántica, proyectos de automatización, habilidades técnicas o datos de contacto.`,
    suggestions: [
      { text: "Experiencia", action: "experience" },
      { text: "Proyectos", action: "projects" },
      { text: "Habilidades", action: "skills" },
      { text: "Contacto", action: "contact" }
    ]
  };
};