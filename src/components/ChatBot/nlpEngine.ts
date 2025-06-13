import { NLPResult, Intent, Entity, Sentiment, ConversationContext } from './types';
import * as tf from '@tensorflow/tfjs';
import { load } from '@tensorflow-models/universal-sentence-encoder';
import { Tokenizer } from '@nlpjs/core';
import { containerBootstrap } from '@nlpjs/core';
import { Nlp } from '@nlpjs/nlp';
import { LangEs } from '@nlpjs/lang-es';

export class NLPEngine {
  private tokenizer: Tokenizer;
  private encoder: any;
  private nlp: Nlp;
  private context: ConversationContext;
  private readonly intentThreshold = 0.7;
  private isInitialized = false;

  constructor() {
    this.tokenizer = new Tokenizer();
    this.context = {
      history: [],
      entities: new Map(),
      currentTopic: null,
      sentiment: 'neutral'
    };
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Inicializar NLP.js
      const container = await containerBootstrap();
      container.use(LangEs);
      this.nlp = container.get('nlp');
      await this.trainNLP();

      // Cargar Universal Sentence Encoder
      this.encoder = await load();

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing NLP Engine:', error);
      throw error;
    }
  }

  private async trainNLP() {
    await this.nlp.addLanguage('es');
    
    // Experiencia
    await this.nlp.addDocument('es', 'cuál es tu experiencia', 'experience');
    await this.nlp.addDocument('es', 'dónde has trabajado', 'experience');
    await this.nlp.addDocument('es', 'cuéntame sobre tu trabajo', 'experience');
    
    // Proyectos
    await this.nlp.addDocument('es', 'qué proyectos has hecho', 'projects');
    await this.nlp.addDocument('es', 'muéstrame tu portafolio', 'projects');
    await this.nlp.addDocument('es', 'cuáles son tus trabajos', 'projects');
    
    // Habilidades
    await this.nlp.addDocument('es', 'qué tecnologías conoces', 'skills');
    await this.nlp.addDocument('es', 'cuáles son tus habilidades', 'skills');
    await this.nlp.addDocument('es', 'qué sabes hacer', 'skills');
    
    // Contacto
    await this.nlp.addDocument('es', 'cómo puedo contactarte', 'contact');
    await this.nlp.addDocument('es', 'cuál es tu email', 'contact');
    await this.nlp.addDocument('es', 'información de contacto', 'contact');

    await this.nlp.train();
  }

  public async processInput(input: string): Promise<NLPResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const intent = await this.classifyIntent(input);
      const sentiment = await this.analyzeSentiment(input);
      const entities = await this.extractEntities(input);
      const response = await this.generateResponse(intent.name);
      
      this.updateContext({
        input,
        intent,
        entities,
        sentiment,
        timestamp: new Date()
      });
      
      return {
        intent,
        entities,
        sentiment,
        response,
        confidence: intent.confidence
      };
    } catch (error) {
      console.error('Error processing input:', error);
      return this.getFallbackResponse();
    }
  }

  private async classifyIntent(input: string): Promise<Intent> {
    const result = await this.nlp.process('es', input);
    return {
      name: result.intent || 'unknown',
      confidence: result.score || 0
    };
  }

  private async analyzeSentiment(input: string): Promise<Sentiment> {
    const embeddings = await this.encoder.embed(input);
    const sentimentScore = await this.computeSentimentScore(embeddings);
    
    if (sentimentScore > 0.2) return 'positive';
    if (sentimentScore < -0.2) return 'negative';
    return 'neutral';
  }

  private async extractEntities(input: string): Promise<Entity[]> {
    const tokens = this.tokenizer.tokenize(input);
    const entities: Entity[] = [];
    
    tokens.forEach((token, index) => {
      if (this.isNamedEntity(token)) {
        entities.push({
          id: `entity_${index}`,
          type: this.getEntityType(token),
          value: token,
          start: input.indexOf(token),
          end: input.indexOf(token) + token.length
        });
      }
    });
    
    return entities;
  }

  private async generateResponse(intent: string): Promise<string> {
    const responses: Record<string, string[]> = {
      experience: [
        "Mi experiencia incluye roles en computación cuántica y desarrollo de software. ¿Te gustaría saber más sobre algún área específica?",
        "He trabajado en proyectos de automatización industrial y optimización cuántica. ¿Qué aspecto te interesa más?"
      ],
      projects: [
        "He desarrollado varios proyectos innovadores como SmartCAD Vision y PathOptimizer Pro. ¿Te gustaría conocer más detalles sobre alguno?",
        "Mi portafolio incluye soluciones de IA industrial y optimización cuántica. ¿Sobre cuál te gustaría saber más?"
      ],
      skills: [
        "Mis principales habilidades incluyen Python, computación cuántica, y automatización industrial. ¿Te gustaría profundizar en alguna área?",
        "Tengo experiencia en desarrollo de software, optimización cuántica y sistemas CNC. ¿Qué área te interesa más?"
      ],
      contact: [
        "Puedes contactarme por email a johan-willi@hotmail.com o por teléfono al (+34) 629903206. ¿Qué método prefieres?",
        "Estoy disponible para consultas en Donostia – San Sebastian. ¿Te gustaría agendar una llamada?"
      ],
      unknown: [
        "No estoy seguro de entender. ¿Podrías reformular tu pregunta?",
        "¿Podrías ser más específico sobre lo que te gustaría saber?"
      ]
    };

    const intentResponses = responses[intent] || responses.unknown;
    return intentResponses[Math.floor(Math.random() * intentResponses.length)];
  }

  private getFallbackResponse(): NLPResult {
    return {
      intent: { name: 'unknown', confidence: 0 },
      entities: [],
      sentiment: 'neutral',
      response: "No estoy seguro de entender. ¿Podrías reformular tu pregunta?",
      confidence: 0
    };
  }

  private isNamedEntity(token: string): boolean {
    return /^[A-Z]/.test(token) || this.isKnownEntity(token);
  }

  private isKnownEntity(token: string): boolean {
    const knownEntities = ['Python', 'JavaScript', 'React', 'Node.js', 'TypeScript'];
    return knownEntities.includes(token);
  }

  private getEntityType(token: string): string {
    if (this.isCompanyName(token)) return 'company';
    if (this.isTechnology(token)) return 'technology';
    return 'unknown';
  }

  private isCompanyName(token: string): boolean {
    const companies = ['Landoo', 'Multiverse'];
    return companies.includes(token);
  }

  private isTechnology(token: string): boolean {
    const technologies = ['Python', 'JavaScript', 'React', 'Node.js'];
    return technologies.includes(token);
  }

  private async computeSentimentScore(embeddings: tf.Tensor): Promise<number> {
    return embeddings.mean().dataSync()[0];
  }

  private updateContext(turn: any): void {
    this.context.history.push(turn);
    if (this.context.history.length > 10) {
      this.context.history.shift();
    }
    
    turn.entities.forEach((entity: Entity) => {
      this.context.entities.set(entity.id, entity);
    });
    
    this.context.currentTopic = turn.intent.name;
    this.context.sentiment = turn.sentiment;
  }

  public getContext(): ConversationContext {
    return this.context;
  }
}