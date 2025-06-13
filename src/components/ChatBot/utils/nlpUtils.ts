import { intentPatterns, ResponseTemplate } from '../data/responses';

interface MatchResult {
  intent: string;
  confidence: number;
  context: string[];
}

export const findBestMatch = (input: string): MatchResult => {
  const normalizedInput = input.toLowerCase();
  const words = normalizedInput.split(/\s+/);
  
  let bestMatch = {
    intent: 'unknown',
    confidence: 0,
    context: [] as string[]
  };

  // Analizar cada patrón de intención
  Object.entries(intentPatterns).forEach(([intent, pattern]) => {
    let matchScore = 0;
    let contextMatches: string[] = [];

    // Verificar patrones principales
    pattern.patterns.forEach(p => {
      if (normalizedInput.includes(p)) {
        matchScore += 1;
      }
    });

    // Verificar patrones de contexto
    pattern.contextPatterns?.forEach(p => {
      if (normalizedInput.includes(p)) {
        contextMatches.push(p);
        matchScore += 0.5;
      }
    });

    // Normalizar puntuación
    const confidence = matchScore / (pattern.patterns.length + (pattern.contextPatterns?.length || 0));

    if (confidence > bestMatch.confidence) {
      bestMatch = {
        intent,
        confidence,
        context: contextMatches
      };
    }
  });

  return bestMatch;
};

export const selectResponse = (
  intent: string,
  context: string[] = []
): ResponseTemplate => {
  const intentData = intentPatterns[intent];
  if (!intentData) {
    return getDefaultResponse();
  }

  // Buscar respuesta que mejor coincida con el contexto
  const responses = intentData.responses;
  let bestResponse = responses[0];
  let bestContextMatch = 0;

  responses.forEach(response => {
    if (!response.context) return;

    const contextMatches = response.context.filter(c => 
      context.includes(c)
    ).length;

    if (contextMatches > bestContextMatch) {
      bestResponse = response;
      bestContextMatch = contextMatches;
    }
  });

  return bestResponse;
};

export const getDefaultResponse = (): ResponseTemplate => ({
  text: "No estoy seguro de entender tu pregunta. ¿Podrías reformularla? Puedo ayudarte con información sobre mi experiencia profesional, proyectos, habilidades técnicas o datos de contacto.",
  metadata: {
    intent: 'unknown',
    confidence: 0,
    category: 'fallback',
    tags: ['unknown', 'fallback']
  },
  suggestions: [
    { text: "Ver experiencia", action: "experience" },
    { text: "Ver proyectos", action: "projects" },
    { text: "Ver habilidades", action: "skills" }
  ]
});

// Función para generar datos de entrenamiento en formato específico para Python
export const generatePythonTrainingData = () => {
  const trainingData = {
    intents: [] as any[],
    responses: [] as any[],
    patterns: {} as any
  };

  Object.entries(intentPatterns).forEach(([intent, data]) => {
    // Agregar intent
    trainingData.intents.push({
      name: intent,
      patterns: data.patterns,
      contextPatterns: data.contextPatterns || []
    });

    // Agregar respuestas
    data.responses.forEach(response => {
      trainingData.responses.push({
        intent,
        text: response.text,
        context: response.context || [],
        metadata: response.metadata
      });
    });

    // Agregar patrones
    trainingData.patterns[intent] = {
      main: data.patterns,
      context: data.contextPatterns || []
    };
  });

  return trainingData;
};