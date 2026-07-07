import { describe, it, expect, vi } from 'vitest';
import { findBestMatch, selectResponse } from '../utils/nlpUtils';

// Mock intentPatterns with a controlled subset of dummy data
vi.mock('../data/responses', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../data/responses')>();
  return {
    ...actual,
    intentPatterns: {
      greeting: {
        patterns: ['hola', 'buenos días', 'saludos'],
        contextPatterns: ['amigo'],
        responses: [
          {
            text: '¡Hola! ¿En qué puedo ayudarte?',
            suggestions: [],
            metadata: { intent: 'greeting', confidence: 1, category: 'general', tags: [] }
          },
          {
            text: '¡Hola amigo!',
            context: ['amigo'],
            suggestions: [],
            metadata: { intent: 'greeting', confidence: 1, category: 'general', tags: [] }
          }
        ]
      },
      farewell: {
        patterns: ['adiós', 'hasta luego', 'chau'],
        responses: [
          {
            text: '¡Hasta luego!',
            suggestions: [],
            metadata: { intent: 'farewell', confidence: 1, category: 'general', tags: [] }
          }
        ]
      },
      complex_intent: {
        patterns: ['test', 'prueba'],
        contextPatterns: ['context1', 'context2'],
        responses: [
          {
            text: 'Respuesta base',
            suggestions: []
          },
          {
            text: 'Respuesta con context1',
            context: ['context1'],
            suggestions: []
          },
          {
            text: 'Respuesta con context1 y context2',
            context: ['context1', 'context2'],
            suggestions: []
          }
        ]
      }
    }
  };
});

describe('nlpUtils', () => {
  describe('findBestMatch', () => {
    it('returns unknown intent when there is no match', () => {
      const result = findBestMatch('algo completamente diferente');
      expect(result).toEqual({
        intent: 'unknown',
        confidence: 0,
        context: []
      });
    });

    it('matches an intent perfectly based on main patterns', () => {
      const result = findBestMatch('hola');
      // matchScore = 1
      // total patterns = 3 (patterns) + 1 (contextPatterns) = 4
      // confidence = 1 / 4 = 0.25
      expect(result.intent).toBe('greeting');
      expect(result.confidence).toBe(0.25);
      expect(result.context).toEqual([]);
    });

    it('adds context match correctly and improves confidence', () => {
      const result = findBestMatch('hola amigo');
      // matchScore = 1 (hola) + 0.5 (amigo) = 1.5
      // total = 4
      // confidence = 1.5 / 4 = 0.375
      expect(result.intent).toBe('greeting');
      expect(result.confidence).toBe(0.375);
      expect(result.context).toEqual(['amigo']);
    });

    it('is case insensitive', () => {
      const result = findBestMatch('BUENOS DÍAS');
      expect(result.intent).toBe('greeting');
      expect(result.context).toEqual([]);
    });

    it('selects the intent with highest confidence', () => {
      // If we say 'hola adiós', it might match both.
      // 'hola': matchScore = 1, total = 4 -> confidence = 0.25
      // 'adiós': matchScore = 1, total = 3 -> confidence = 0.333
      // Should pick 'farewell' because 0.333 > 0.25
      const result = findBestMatch('hola adiós');
      expect(result.intent).toBe('farewell');
      expect(result.confidence).toBeCloseTo(0.333, 2);
    });
  });

  describe('selectResponse', () => {
    it('returns default response if intent is not found', () => {
      const response = selectResponse('non_existent_intent');
      expect(response.metadata?.intent).toBe('unknown');
      expect(response.category).toBeUndefined(); // fallback has category 'fallback' in getDefaultResponse
      expect(response.metadata?.category).toBe('fallback');
    });

    it('returns first response if no context is provided and none matches', () => {
      const response = selectResponse('greeting');
      expect(response.text).toBe('¡Hola! ¿En qué puedo ayudarte?');
    });

    it('returns context-matched response', () => {
      const response = selectResponse('greeting', ['amigo']);
      expect(response.text).toBe('¡Hola amigo!');
    });

    it('selects the response with the most context matches', () => {
      const response = selectResponse('complex_intent', ['context1', 'context2']);
      expect(response.text).toBe('Respuesta con context1 y context2');
    });

    it('ignores context if it is empty', () => {
      const response = selectResponse('complex_intent', []);
      expect(response.text).toBe('Respuesta base');
    });
  });
});
