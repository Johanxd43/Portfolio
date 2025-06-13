import { pipeline, Pipeline } from '@huggingface/inference';
import { CacheService } from './cacheService';
import { ErrorService } from './errorService';

export class HuggingFaceService {
  private static instance: HuggingFaceService;
  private conversationPipeline: Pipeline;
  private intentPipeline: Pipeline;
  private sentimentPipeline: Pipeline;
  private cacheService: CacheService;
  private errorService: ErrorService;
  private isInitialized = false;

  private constructor() {
    this.cacheService = CacheService.getInstance();
    this.errorService = ErrorService.getInstance();
  }

  public static getInstance(): HuggingFaceService {
    if (!HuggingFaceService.instance) {
      HuggingFaceService.instance = new HuggingFaceService();
    }
    return HuggingFaceService.instance;
  }

  public async initialize(onProgress?: (progress: number) => void): Promise<void> {
    if (this.isInitialized) return;

    try {
      onProgress?.(0.1);
      
      // Inicializar pipelines en paralelo
      const [conversationPipeline, intentPipeline, sentimentPipeline] = await Promise.all([
        pipeline('conversational', {
          model: 'PlanckAI/chat-bot-es',
          tokenizer: 'PlanckAI/chat-bot-es'
        }).then(p => {
          onProgress?.(0.4);
          return p;
        }),
        
        pipeline('text-classification', {
          model: 'dccuchile/bert-base-spanish-wwm-uncased',
          tokenizer: 'dccuchile/bert-base-spanish-wwm-uncased'
        }).then(p => {
          onProgress?.(0.7);
          return p;
        }),
        
        pipeline('sentiment-analysis', {
          model: 'finiteautomata/beto-sentiment-analysis',
          tokenizer: 'finiteautomata/beto-sentiment-analysis'
        }).then(p => {
          onProgress?.(0.9);
          return p;
        })
      ]);

      this.conversationPipeline = conversationPipeline;
      this.intentPipeline = intentPipeline;
      this.sentimentPipeline = sentimentPipeline;

      this.isInitialized = true;
      onProgress?.(1.0);
    } catch (error) {
      this.errorService.logError(
        error instanceof Error ? error : new Error('Initialization failed'),
        'high',
        'nlp'
      );
      throw error;
    }
  }

  public async processMessage(message: string, context: string[] = []): Promise<{
    response: string;
    intent: string;
    sentiment: string;
    confidence: number;
  }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Verificar caché
      const cacheKey = `hf_${message}_${context.join('_')}`;
      const cached = await this.cacheService.get(cacheKey);
      if (cached) return cached;

      // Procesar en paralelo
      const [conversationResult, intentResult, sentimentResult] = await Promise.all([
        this.conversationPipeline(message, context),
        this.intentPipeline(message),
        this.sentimentPipeline(message)
      ]);

      const result = {
        response: conversationResult.generated_text,
        intent: intentResult[0].label,
        sentiment: sentimentResult[0].label,
        confidence: Math.max(
          intentResult[0].score,
          sentimentResult[0].score
        )
      };

      // Guardar en caché
      await this.cacheService.set(cacheKey, result);

      return result;
    } catch (error) {
      this.errorService.logError(
        error instanceof Error ? error : new Error('Processing failed'),
        'medium',
        'nlp',
        { message, context }
      );
      throw error;
    }
  }
}

export default HuggingFaceService;