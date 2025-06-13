import { Intent, IntentClassification } from './types';

const intentPatterns = {
  experience: [
    'experiencia', 'trabajo', 'profesional', 'carrera', 'laboral',
    'empleo', 'ocupación', 'trayectoria'
  ],
  projects: [
    'proyecto', 'portfolio', 'trabajo', 'desarrollo', 'implementación',
    'solución', 'aplicación', 'sistema'
  ],
  skills: [
    'habilidad', 'tecnología', 'skill', 'conocimiento', 'competencia',
    'capacidad', 'especialidad', 'técnica'
  ],
  contact: [
    'contacto', 'email', 'correo', 'mensaje', 'comunicar', 'teléfono',
    'llamar', 'ubicación'
  ],
  greeting: [
    'hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos',
    'hey', 'hi'
  ],
  farewell: [
    'adiós', 'hasta luego', 'chao', 'bye', 'nos vemos', 'gracias',
    'hasta pronto'
  ]
};

export const classifyIntent = (input: string): IntentClassification => {
  const normalizedInput = input.toLowerCase();
  const words = normalizedInput.split(/\s+/);
  
  const scores = Object.entries(intentPatterns).reduce((acc, [intent, patterns]) => {
    const matchCount = patterns.reduce((count, pattern) => {
      return count + (normalizedInput.includes(pattern) ? 1 : 0);
    }, 0);
    
    const score = matchCount / patterns.length;
    return { ...acc, [intent]: score };
  }, {} as Record<string, number>);

  const maxScore = Math.max(...Object.values(scores));
  const intent = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as Intent || 'unknown';

  return {
    intent,
    confidence: maxScore
  };
};

export const shouldHandoff = (classification: IntentClassification): boolean => {
  return classification.confidence < 0.3;
};