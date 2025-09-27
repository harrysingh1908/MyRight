/**
 * Contract Test: SearchService.autocomplete() Method
 * 
 * These tests define the expected behavior of SearchService.autocomplete()
 * and MUST FAIL initially (TDD approach) before implementation.
 * 
 * Contract: SearchService.autocomplete(request: AutocompleteRequest): Promise<AutocompleteResponse>
 */

import { searchService } from '@/services/searchService';
import { AutocompleteRequest, AutocompleteResponse } from '@/types/search';

describe('SearchService.autocomplete() Contract', () => {
  beforeEach(() => {
    // Clear any caches or state before each test
    jest.clearAllMocks();
  });

  describe('Basic Autocomplete Functionality', () => {
    test('should return suggestions for partial query', async () => {
      const request: AutocompleteRequest = {
        query: 'sal',
        limit: 8
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      expect(response).toBeDefined();
      expect(response.query).toBe('sal');
      expect(response.suggestions).toBeDefined();
      expect(Array.isArray(response.suggestions)).toBe(true);
      expect(response.suggestions.length).toBeLessThanOrEqual(8);
    });

    test('should require minimum 2 characters for suggestions', async () => {
      const request: AutocompleteRequest = {
        query: 's',
        limit: 5
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      // Should return empty suggestions or throw error for queries too short
      expect(response.suggestions.length).toBe(0);
    });

    test('should handle empty query gracefully', async () => {
      const request: AutocompleteRequest = {
        query: '',
        limit: 5
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      expect(response.suggestions.length).toBe(0);
    });
  });

  describe('Suggestion Quality and Structure', () => {
    test('should return relevant suggestions for legal terms', async () => {
      const request: AutocompleteRequest = {
        query: 'employment',
        limit: 10
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      expect(response.suggestions.length).toBeGreaterThan(0);
      
      // Each suggestion should be relevant to the input
      response.suggestions.forEach(suggestion => {
        expect(suggestion.text.toLowerCase()).toContain('employment');
      });
    });

    test('should return properly structured suggestions', async () => {
      const request: AutocompleteRequest = {
        query: 'salary',
        limit: 5
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      if (response.suggestions.length > 0) {
        const suggestion = response.suggestions[0]!;
        
        expect(suggestion.text).toBeDefined();
        expect(typeof suggestion.text).toBe('string');
        expect(suggestion.text.length).toBeGreaterThan(0);
        
        if (suggestion.category) {
          expect(typeof suggestion.category).toBe('string');
        }
        
        if (suggestion.type) {
          expect(['scenario', 'category', 'popular']).toContain(suggestion.type);
        }
      }
    });

    test('should order suggestions by relevance', async () => {
      const request: AutocompleteRequest = {
        query: 'consumer',
        limit: 5
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      if (response.suggestions.length > 1) {
        // First suggestion should be most relevant (exact match or starts with query)
        const firstSuggestion = response.suggestions[0]!;
        expect(
          firstSuggestion.text.toLowerCase().startsWith('consumer') ||
          firstSuggestion.text.toLowerCase() === 'consumer'
        ).toBe(true);
      }
    });
  });

  describe('Performance Requirements', () => {
    test('should respond within 500ms for autocomplete requests', async () => {
      const startTime = Date.now();
      
      const request: AutocompleteRequest = {
        query: 'police',
        limit: 8
      };

      await searchService.autocomplete(request);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(500); // <500ms requirement
    });
  });

  describe('Suggestion Types and Categories', () => {
    test('should include scenario title suggestions', async () => {
      const request: AutocompleteRequest = {
        query: 'unpaid',
        limit: 10,
        types: ['scenario_title']
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      // Should include suggestions that are scenario titles
      const scenarioSuggestions = response.suggestions.filter(s => s.type === 'scenario_title');
      expect(scenarioSuggestions.length).toBeGreaterThan(0);
    });

    test('should include category suggestions when relevant', async () => {
      const request: AutocompleteRequest = {
        query: 'employ',
        limit: 10,
        types: ['category']
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      // Should include category suggestions
      const categorySuggestions = response.suggestions.filter(s => s.type === 'category');
      if (categorySuggestions.length > 0) {
        expect(categorySuggestions[0]!.category).toBeDefined();
      }
    });

    test('should include common phrase suggestions', async () => {
      const request: AutocompleteRequest = {
        query: 'legal',
        limit: 10,
        types: ['common_phrase']
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      // Should include common phrase suggestions
      const phraseSuggestions = response.suggestions.filter(s => s.type === 'common_phrase');
      if (phraseSuggestions.length > 0) {
        expect(phraseSuggestions[0]!.text).toContain('legal');
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle special characters in query', async () => {
      const request: AutocompleteRequest = {
        query: 'salary-payment',
        limit: 5
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      expect(response).toBeDefined();
      expect(Array.isArray(response.suggestions)).toBe(true);
    });

    test('should handle Hindi transliteration input', async () => {
      const request: AutocompleteRequest = {
        query: 'kaam',  // Hindi transliteration for work
        limit: 5
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      expect(response).toBeDefined();
      expect(Array.isArray(response.suggestions)).toBe(true);
      // May return empty suggestions if Hindi support not implemented
    });

    test('should respect limit parameter', async () => {
      const request: AutocompleteRequest = {
        query: 'rights',
        limit: 3
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      expect(response.suggestions.length).toBeLessThanOrEqual(3);
    });

    test('should handle very long partial query', async () => {
      const longQuery = 'employment workplace harassment complaint procedure government'.substring(0, 50);
      const request: AutocompleteRequest = {
        query: longQuery,
        limit: 5
      };

      const response: AutocompleteResponse = await searchService.autocomplete(request);

      expect(response).toBeDefined();
      expect(Array.isArray(response.suggestions)).toBe(true);
    });
  });

  describe('Caching and Optimization', () => {
    test('should handle rapid successive requests efficiently', async () => {
      const requests = [
        'sa',
        'sal',
        'sala',
        'salar',
        'salary'
      ];

      const startTime = Date.now();

      // Fire multiple requests in quick succession
      const promises = requests.map(query => 
        searchService.autocomplete({ query, limit: 5 })
      );

      const responses = await Promise.all(promises);

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // All requests should complete, total time should be reasonable
      expect(responses.length).toBe(5);
      expect(totalTime).toBeLessThan(1000); // Less than 1 second for 5 requests
      
      responses.forEach(response => {
        expect(response).toBeDefined();
        expect(Array.isArray(response.suggestions)).toBe(true);
      });
    });
  });
});