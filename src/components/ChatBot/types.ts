// Tipos centralizados para el chatbot
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: Array<{ text: string; action: string; }>;
  feedback?: 'positive' | 'negative';
}

export interface NLPResult {
  response: string;
  suggestions: Array<{ text: string; action: string; }>;
  metadata?: {
    intent: string;
    confidence: number;
    category: string;
    tags: string[];
  };
}

export interface ConversationContext {
  history: string[];
  currentTopic?: string;
  topicDepth: number;
  lastInteraction: Date;
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: Record<string, ServiceStatus>;
}

export interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: Date;
  error?: string;
}

export interface MonitoringStats {
  uptime: number;
  lastCheck: number;
  servicesHealth: Map<string, ServiceStatus>;
  performance: {
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

export interface CacheConfig {
  maxSize: number;
  ttl: number;
  cleanupInterval: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  lastCleanup: number;
  hitRate?: number;
}

export interface SecurityConfig {
  encryptionEnabled: boolean;
  retentionPeriod: number;
  dataCategories: string[];
  sensitivePatterns: RegExp[];
}

export interface ChatMetrics {
  responseTime: number;
  intentAccuracy: number;
  userSatisfaction: number;
  sessionDuration: number;
  completionRate: number;
}

export interface QualityMetrics {
  grammaticalAccuracy: number;
  contextualRelevance: number;
  responseCompleteness: number;
}