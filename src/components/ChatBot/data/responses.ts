// Tipos de datos para el sistema de respuestas
export interface ResponseTemplate {
  text: string;
  context?: string[];
  requires?: string[];
  suggestions: Array<{ text: string; action: string }>;
  followUp?: string[];
  metadata?: {
    intent: string;
    confidence: number;
    category: string;
    tags: string[];
  };
}

export interface IntentPattern {
  patterns: string[];
  contextPatterns?: string[];
  responses: ResponseTemplate[];
  followUp?: string[];
}

// Patrones de intención expandidos
export const intentPatterns: Record<string, IntentPattern> = {
  experience: {
    patterns: [
      'experiencia', 'trabajo', 'profesional', 'carrera', 'laboral',
      'empleo', 'ocupación', 'trayectoria', 'rol', 'puesto',
      'curriculum', 'cv', 'resumen', 'perfil'
    ],
    contextPatterns: [
      'actual', 'anterior', 'cuántica', 'logística', 'desarrollo',
      'consultor', 'multiverse', 'landoo', 'industrial', 'software'
    ],
    responses: [
      {
        text: "Actualmente trabajo como Consultor Logístico en Landoo, donde aplico mis conocimientos en optimización y desarrollo de soluciones empresariales. Mi rol incluye:\n\n• Gestión de proyectos logísticos internacionales\n• Implementación de soluciones Odoo\n• Optimización de procesos empresariales\n\n¿Te gustaría saber más sobre algún aspecto específico?",
        context: ['actual', 'landoo', 'consultor'],
        metadata: {
          intent: 'experience',
          confidence: 0.9,
          category: 'current_role',
          tags: ['landoo', 'logistics', 'consulting']
        },
        suggestions: [
          { text: "Responsabilidades", action: "current_responsibilities" },
          { text: "Tecnologías", action: "current_tech" },
          { text: "Experiencia previa", action: "previous_experience" }
        ]
      },
      {
        text: "En Multiverse Computing trabajé como Desarrollador de Software, enfocándome en:\n\n• Desarrollo de algoritmos cuánticos\n• Optimización de procesos industriales\n• Integración con sistemas CNC\n\n¿Te interesa conocer más sobre algún proyecto específico?",
        context: ['anterior', 'multiverse', 'cuántica'],
        metadata: {
          intent: 'experience',
          confidence: 0.9,
          category: 'previous_role',
          tags: ['multiverse', 'quantum', 'development']
        },
        suggestions: [
          { text: "Proyectos Cuánticos", action: "quantum_projects" },
          { text: "Tecnologías", action: "quantum_tech" },
          { text: "Rol actual", action: "current_role" }
        ]
      }
    ]
  },
  education: {
    patterns: [
      'educación', 'estudios', 'formación', 'título', 'grado',
      'universidad', 'carrera', 'académico', 'certificación'
    ],
    contextPatterns: [
      'ingeniería', 'mecatrónica', 'zaragoza', 'cursos',
      'certificados', 'especialización'
    ],
    responses: [
      {
        text: "Soy Ingeniero en Mecatrónica por la Universidad de Zaragoza, con especialización en Automatización y Control Industrial. Mi formación combina:\n\n• Ingeniería Mecánica\n• Electrónica\n• Programación\n• Control Industrial\n\n¿Qué área te gustaría conocer más a fondo?",
        metadata: {
          intent: 'education',
          confidence: 0.9,
          category: 'formal_education',
          tags: ['engineering', 'mechatronics', 'automation']
        },
        suggestions: [
          { text: "Especialización", action: "specialization" },
          { text: "Certificaciones", action: "certifications" },
          { text: "Proyectos académicos", action: "academic_projects" }
        ]
      }
    ]
  },
  skills_technical: {
    patterns: [
      'habilidad técnica', 'tecnología', 'herramienta', 'lenguaje',
      'framework', 'biblioteca', 'stack', 'técnico'
    ],
    contextPatterns: [
      'programación', 'desarrollo', 'frontend', 'backend',
      'quantum', 'cuántica', 'automatización', 'industrial'
    ],
    responses: [
      {
        text: "Mis habilidades técnicas abarcan múltiples áreas:\n\n• Desarrollo: Python, C++, JavaScript/TypeScript\n• Computación Cuántica: Qiskit, D-Wave\n• Web: React, Node.js, Three.js\n• Industrial: MATLAB, sistemas CNC\n\n¿Sobre qué área te gustaría profundizar?",
        metadata: {
          intent: 'skills_technical',
          confidence: 0.9,
          category: 'technical_skills',
          tags: ['programming', 'quantum', 'web', 'industrial']
        },
        suggestions: [
          { text: "Desarrollo Web", action: "web_dev" },
          { text: "Computación Cuántica", action: "quantum_computing" },
          { text: "Automatización", action: "automation" }
        ]
      }
    ]
  },
  skills_soft: {
    patterns: [
      'habilidad blanda', 'soft skill', 'competencia', 'personal',
      'interpersonal', 'comunicación', 'liderazgo'
    ],
    contextPatterns: [
      'equipo', 'gestión', 'comunicación', 'proyecto',
      'cliente', 'colaboración', 'adaptación'
    ],
    responses: [
      {
        text: "Mis habilidades blandas incluyen:\n\n• Liderazgo de equipos técnicos\n• Comunicación efectiva con clientes\n• Gestión de proyectos internacionales\n• Adaptabilidad y aprendizaje continuo\n\n¿Te gustaría conocer más sobre alguna de estas áreas?",
        metadata: {
          intent: 'skills_soft',
          confidence: 0.9,
          category: 'soft_skills',
          tags: ['leadership', 'communication', 'management']
        },
        suggestions: [
          { text: "Liderazgo", action: "leadership" },
          { text: "Gestión de proyectos", action: "project_management" },
          { text: "Comunicación", action: "communication" }
        ]
      }
    ]
  },
  languages: {
    patterns: [
      'idioma', 'lengua', 'idiomas', 'nivel', 'hablar',
      'escribir', 'inglés', 'español'
    ],
    contextPatterns: [
      'nativo', 'fluido', 'profesional', 'técnico',
      'certificado', 'oral', 'escrito'
    ],
    responses: [
      {
        text: "Mis habilidades lingüísticas incluyen:\n\n• Español: Nativo\n• Inglés: Nivel B1 (Intermedio)\n\nPuedo mantener conversaciones técnicas y profesionales en ambos idiomas. ¿Necesitas más detalles sobre algún aspecto específico?",
        metadata: {
          intent: 'languages',
          confidence: 0.9,
          category: 'language_skills',
          tags: ['spanish', 'english', 'communication']
        },
        suggestions: [
          { text: "Nivel técnico", action: "technical_language" },
          { text: "Certificaciones", action: "language_certs" },
          { text: "Experiencia internacional", action: "international_exp" }
        ]
      }
    ]
  }
};