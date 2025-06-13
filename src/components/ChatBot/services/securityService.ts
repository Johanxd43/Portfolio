import { SecurityConfig } from '../types';

class SecurityService {
  private static instance: SecurityService;
  private config: SecurityConfig;

  private constructor() {
    this.config = {
      encryptionEnabled: true,
      retentionPeriod: 30 * 24 * 60 * 60 * 1000, // 30 días
      dataCategories: ['messages', 'userInfo', 'analytics'],
      sensitivePatterns: [
        /\b\d{16}\b/, // Tarjetas de crédito
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Emails
        /\b(?:\+?34|0034)?[ -]*(6|7)[ -]*([0-9][ -]*){8}\b/ // Teléfonos españoles
      ]
    };
  }

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  public sanitizeMessage(message: string): string {
    let sanitized = message;
    this.config.sensitivePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    return sanitized;
  }

  public shouldRetainData(timestamp: Date): boolean {
    const age = Date.now() - timestamp.getTime();
    return age <= this.config.retentionPeriod;
  }

  public validateDataCategory(category: string): boolean {
    return this.config.dataCategories.includes(category);
  }
}

export default SecurityService;