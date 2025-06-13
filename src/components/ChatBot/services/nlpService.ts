import { NLPResult, Intent } from '../types';
import * as tf from '@tensorflow/tfjs';

export class NLPService {
  private static instance: NLPService;
  private worker: Worker | null = null;
  private cache: Map<string, Float32Array>;
  private readonly maxCacheSize = 1000;
  private readonly similarityThreshold = 0.85;

  private constructor() {
    this.cache = new Map();
    this.initializeWorker();
  }

  public static getInstance(): NLPService {
    if (!NLPService.instance) {
      NLPService.instance = new NLPService();
    }
    return NLPService.instance;
  }

  private initializeWorker() {
    try {
      this.worker = new Worker(
        new URL('../workers/nlpWorker.ts', import.meta.url),
        { type: 'module' }
      );
      
      this.worker.postMessage({ type: 'initialize' });
      
      this.worker.onerror = (error) => {
        console.error('Worker error:', error);
        this.worker = null;
      };
    } catch (error) {
      console.error('Error creating worker:', error);
    }
  }

  public async processMessage(message: string): Promise<NLPResult> {
    if (!this.worker) {
      return this.getFallbackResponse();
    }

    try {
      const embeddings = await this.getEmbeddings(message);
      const intent = await this.classifyIntent(embeddings);
      
      if (intent.confidence >= this.similarityThreshold) {
        return this.generateResponse(intent);
      }
      
      return this.getFallbackResponse();
    } catch (error) {
      console.error('Error processing message:', error);
      return this.getFallbackResponse();
    }
  }

  private async getEmbeddings(text: string): Promise<Float32Array> {
    // Verificar caché
    const cached = this.cache.get(text);
    if (cached) return cached;

    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not available'));
        return;
      }

      const handler = (e: MessageEvent) => {
        if (e.data.type === 'embeddings') {
          this.worker?.removeEventListener('message', handler);
          const embeddings = new Float32Array(e.data.data);
          
          // Actualizar caché
          if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
          }
          this.cache.set(text, embeddings);
          
          resolve(embeddings);
        } else if (e.data.type === 'error') {
          this.worker?.removeEventListener('message', handler);
          reject(new Error(e.data.error));
        }
      };

      this.worker.addEventListener('message', handler);
      this.worker.postMessage({ type: 'process', text });
    });
  }

  private async classifyIntent(embeddings: Float32Array): Promise<Intent> {
    // Implementar clasificación de intención usando embeddings
    // Por ahora retornamos una intención simulada
    return {
      name: 'greeting',
      confidence: 0.9
    };
  }

  private generateResponse(intent: Intent): NLPResult {
    // Implementar generación de respuesta basada en la intención
    return {
      intent,
      response: "¡Hola! ¿En qué puedo ayudarte?",
      suggestions: [
        { text: "Experiencia", action: "experience" },
        { text: "Proyectos", action: "projects" }
      ],
      confidence: intent.confidence
    };
  }

  private getFallbackResponse(): NLPResult {
    return {
      intent: { name: 'unknown', confidence: 0 },
      response: "Lo siento, no entendí tu mensaje. ¿Podrías reformularlo?",
      suggestions: [
        { text: "Ver opciones", action: "help" }
      ],
      confidence: 0
    };
  }

  public cleanup() {
    if (this.worker) {
      this.worker.postMessage({ type: 'cleanup' });
      this.worker.terminate();
      this.worker = null;
    }
    this.cache.clear();
  }
}

export default NLPService;