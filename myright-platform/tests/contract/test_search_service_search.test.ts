/**
 * Contract Test: SearchService.search() Method
 * 
 * These tests define the expected behavior of the SearchService.search() method
 * and MUST FAIL initially (TDD approach) before implementation.
 * 
 * Contract: SearchService.search(request: SearchRequest): Promise<SearchResponse>
 */

import { searchService } from '@/services/searchService';
import { SearchRequest, SearchResponse, SearchFilters } from '@/types/search';

describe('SearchService.search() Contract', () => {
  beforeEach(() => {
    // Clear any caches or state before each test
    jest.clearAllMocks();
  });

  describe('Basic Search Functionality', () => {
    test('should return search results for valid query', async () => {
      const request: SearchRequest = {
        query: 'salary not paid'
      };

      const response: SearchResponse = await searchService.search(request);

      expect(response).toBeDefined();
      expect(response.query).toBe('salary not paid');
      expect(response.results).toBeDefined();
      expect(Array.isArray(response.results)).toBe(true);
      expect(response.totalMatches).toBeGreaterThanOrEqual(0);
      expect(response.searchTime).toBeGreaterThan(0);
      expect(response.searchTime).toBeLessThan(2000); // <2s requirement
    });

    test('should handle empty query gracefully', async () => {
      const request: SearchRequest = {
        query: ''
      };

      await expect(searchService.search(request))
        .rejects
        .toThrow('Search query must be 1-200 characters');
    });

    test('should handle very long query gracefully', async () => {
      const longQuery = 'a'.repeat(250);
      const request: SearchRequest = {
        query: longQuery
      };

      await expect(searchService.search(request))
        .rejects
        .toThrow('Search query must be 1-200 characters');
    });
  });

  describe('Search Results Structure', () => {
    test('should return properly structured search results', async () => {
      const request: SearchRequest = {
        query: 'employment rights',
        pagination: { page: 1, pageSize: 5 }
      };

      const response: SearchResponse = await searchService.search(request);

      if (response.results.length > 0) {
        const result = response.results[0]!;
        
        expect(result.scenario).toBeDefined();
        expect(result.scenario.id).toBeDefined();
        expect(result.scenario.title).toBeDefined();
        expect(result.scenario.category).toBeDefined();
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(1);
        expect(result.matchType).toMatch(/^(title|description|keywords|rights|actions|semantic)$/);
      }
    });

    test('should order results by score (highest first)', async () => {
      const request: SearchRequest = {
        query: 'workplace harassment',
        pagination: { page: 1, pageSize: 10 }
      };

      const response: SearchResponse = await searchService.search(request);

      if (response.results.length > 1) {
        for (let i = 0; i < response.results.length - 1; i++) {
          expect(response.results[i]!.score)
            .toBeGreaterThanOrEqual(response.results[i + 1]!.score);
        }
      }
    });
  });

  describe('Category Filtering', () => {
    test('should filter results by category when specified', async () => {
      const filters: SearchFilters = {
        categories: ['employment'],
        onlyValidated: true
      };

      const request: SearchRequest = {
        query: 'workplace issues',
        filters
      };

      const response: SearchResponse = await searchService.search(request);

      // All results should be from employment category
      response.results.forEach(result => {
        expect(result.scenario.category).toBe('employment');
      });
    });

    test('should handle multiple category filters', async () => {
      const filters: SearchFilters = {
        categories: ['employment', 'consumer'],
        onlyValidated: true
      };

      const request: SearchRequest = {
        query: 'legal help',
        filters
      };

      const response: SearchResponse = await searchService.search(request);

      // All results should be from specified categories
      response.results.forEach(result => {
        expect(['employment', 'consumer']).toContain(result.scenario.category);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle no results gracefully', async () => {
      const request: SearchRequest = {
        query: 'xyz nonexistent topic abc'
      };

      const response: SearchResponse = await searchService.search(request);

      expect(response.results).toEqual([]);
      expect(response.totalMatches).toBe(0);
    });

    test('should provide helpful suggestions when no results found', async () => {
      const request: SearchRequest = {
        query: 'completely invalid search query xyz',
        includeSuggestions: true
      };

      const response: SearchResponse = await searchService.search(request);

      expect(response.results).toEqual([]);
      if (response.suggestions) {
        expect(Array.isArray(response.suggestions)).toBe(true);
      }
    });
  });

  describe('Performance Requirements', () => {
    test('should respond within 2 seconds for standard queries', async () => {
      const startTime = Date.now();
      
      const request: SearchRequest = {
        query: 'consumer rights'
      };

      await searchService.search(request);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(2000);
    });
  });
});