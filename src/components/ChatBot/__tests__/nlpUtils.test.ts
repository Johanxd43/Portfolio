import { describe, it, expect } from 'vitest';
import { generatePythonTrainingData } from '../utils/nlpUtils';
import { intentPatterns } from '../data/responses';

describe('generatePythonTrainingData', () => {
  it('should return an object with intents, responses, and patterns keys', () => {
    const result = generatePythonTrainingData();

    expect(result).toHaveProperty('intents');
    expect(result).toHaveProperty('responses');
    expect(result).toHaveProperty('patterns');

    expect(Array.isArray(result.intents)).toBe(true);
    expect(Array.isArray(result.responses)).toBe(true);
    expect(typeof result.patterns).toBe('object');
    expect(result.patterns).not.toBeNull();
  });

  it('should correctly map intentPatterns into the training data format', () => {
    const result = generatePythonTrainingData();

    const expectedIntentNames = Object.keys(intentPatterns);

    // Check intents array
    expect(result.intents.length).toBe(expectedIntentNames.length);
    result.intents.forEach(intentData => {
      expect(expectedIntentNames).toContain(intentData.name);

      const originalPattern = intentPatterns[intentData.name];
      expect(intentData.patterns).toEqual(originalPattern.patterns);
      expect(intentData.contextPatterns).toEqual(originalPattern.contextPatterns || []);
    });

    // Check responses array
    const totalOriginalResponses = Object.values(intentPatterns).reduce(
      (sum, pattern) => sum + pattern.responses.length,
      0
    );
    expect(result.responses.length).toBe(totalOriginalResponses);

    // Check patterns object
    expect(Object.keys(result.patterns).length).toBe(expectedIntentNames.length);
    Object.keys(result.patterns).forEach(intent => {
      const originalPattern = intentPatterns[intent];
      expect(result.patterns[intent]).toEqual({
        main: originalPattern.patterns,
        context: originalPattern.contextPatterns || []
      });
    });
  });

  it('should assign empty arrays for missing optional fields like context', () => {
    // This assumes there's at least one intent with missing context or contextPatterns,
    // or we are just validating the actual output which uses || []
    const result = generatePythonTrainingData();

    result.intents.forEach(intentData => {
      expect(Array.isArray(intentData.contextPatterns)).toBe(true);
    });

    result.responses.forEach(responseData => {
      expect(Array.isArray(responseData.context)).toBe(true);
    });

    Object.values(result.patterns).forEach((patternData: any) => {
      expect(Array.isArray(patternData.context)).toBe(true);
    });
  });
});
