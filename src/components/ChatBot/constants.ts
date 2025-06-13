// Constantes centralizadas
export const CACHE_CONFIG = {
  MAX_SIZE: 1000,
  TTL: 30 * 60 * 1000, // 30 minutos
  CLEANUP_INTERVAL: 5 * 60 * 1000 // 5 minutos
};

export const CHAT_CONFIG = {
  MAX_MESSAGES: 50,
  MAX_SUGGESTIONS: 4,
  TYPING_DELAY: 500,
  RESPONSE_TIMEOUT: 10000
};

export const NLP_CONFIG = {
  CONFIDENCE_THRESHOLD: 0.7,
  MAX_CONTEXT_LENGTH: 5,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};

export const MONITORING_CONFIG = {
  HEALTH_CHECK_INTERVAL: 30000,
  METRICS_RETENTION: 24 * 60 * 60 * 1000, // 24 horas
  PERFORMANCE_SAMPLE_RATE: 60000 // 1 minuto
};

export const SECURITY_CONFIG = {
  DATA_RETENTION: 30 * 24 * 60 * 60 * 1000, // 30 días
  SENSITIVE_PATTERNS: [
    /\b\d{16}\b/, // Tarjetas de crédito
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Emails
    /\b(?:\+?34|0034)?[ -]*(6|7)[ -]*([0-9][ -]*){8}\b/ // Teléfonos españoles
  ]
};

export const ERROR_MESSAGES = {
  INITIALIZATION: 'Error al inicializar el chatbot',
  PROCESSING: 'Error al procesar el mensaje',
  NETWORK: 'Error de conexión',
  TIMEOUT: 'Tiempo de espera agotado',
  UNKNOWN: 'Error desconocido'
};

export const MODELS = {
  PRIMARY: 'facebook/blenderbot-90M',
  FALLBACK: 'facebook/blenderbot-400M-distill'
};