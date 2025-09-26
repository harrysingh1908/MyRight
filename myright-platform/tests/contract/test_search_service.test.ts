/**
 * Contract Tests for SearchService
 * 
 * These tests define the expected behavior and API contract for the SearchService.
 * They MUST FAIL initially (TDD approach) until the SearchService is implemented.
 * 
 * Contract Requirements:
 * 1. SearchService must provide semantic search functionality
 * 2. Must support autocomplete suggestions
 * 3. Must handle category-based filtering
 * 4. Must return relevance scores and highlights
 * 5. Must validate search performance (<200ms requirement)
 */

import {
  SearchService,
  EmbeddingService
} from '@/services/searchService';
import {
  SearchRequest,
  SearchResponse,
  AutocompleteRequest,
  AutocompleteResponse,
  SearchConfig,
  SearchFilters
} from '@/types/search';
import { LegalScenario } from '@/types';

// Mock data for testing
const mockScenarios: LegalScenario[] = [
  {
    id: 'salary-unpaid-employment',
    title: 'Employer Not Paying Salary or Wages',
    description: 'When your employer refuses to pay your salary, wages, or withholds payment without valid reason',
    category: 'employment',
    rights: [],
    actionSteps: [],
    sources: [],
    keywords: ['salary', 'wages', 'unpaid', 'employer'],
    variations: ['My company is not paying salary', 'Boss withholds wages'],
    lastUpdated: '2024-01-15',
    validationStatus: {
      sourcesVerified: true,
      legalReview: true,
      clarityReview: true,
      lastValidated: '2024-01-15'
    },
    severity: 'high'
  }
];

const mockEmbeddings = {
  'salary-unpaid-employment': {
    title: [0.1, 0.2, 0.3, 0.4, 0.5],
    description: [0.2, 0.3, 0.4, 0.5, 0.6],
    combined: [0.15, 0.25, 0.35, 0.45, 0.55]
  }
};

describe('SearchService Contract', () => {
  let searchService: SearchService;
  let embeddingService: EmbeddingService;
  
  const defaultConfig: SearchConfig = {
    minScore: 0.3,
    maxResults: 20,
    autocompleteSuggestions: 5,
    enableFuzzyMatch: true,
    keywordBoost: 1.5,
    titleBoost: 2.0,
    enableCategoryFilter: true,
    enableSeverityFilter: true
  };

  beforeEach(() => {
    // These services don't exist yet - tests MUST FAIL until implemented
    searchService = new SearchService(defaultConfig);
    embeddingService = new EmbeddingService();
  });

  describe('Initialization and Configuration', () => {
    test('SearchService should initialize with configuration', () => {
      expect(searchService).toBeDefined();
      expect(searchService.config).toEqual(defaultConfig);
    });

    test('SearchService should load scenarios and embeddings', async () => {
      await searchService.loadContent(mockScenarios, mockEmbeddings);
      expect(searchService.getScenarioCount()).toBe(1);
    });

    test('EmbeddingService should initialize correctly', () => {
      expect(embeddingService).toBeDefined();
      expect(embeddingService.getDimension()).toBe(384); // MiniLM dimension
    });
  });

  describe('Core Search Functionality', () => {
    beforeEach(async () => {
      await searchService.loadContent(mockScenarios, mockEmbeddings);
    });

    test('should perform basic text search and return results', async () => {
      const request: SearchRequest = {
        query: 'salary not paid',
        includeHighlights: true,
        includeSuggestions: false
      };

      const response: SearchResponse = await searchService.search(request);

      expect(response).toBeDefined();
      expect(response.query).toBe('salary not paid');
      expect(response.results).toHaveLength(1);
      expect(response.totalMatches).toBe(1);
      expect(response.searchTime).toBeLessThan(200); // Performance requirement
      
      const result = response.results[0]!;
      expect(result.scenario.id).toBe('salary-unpaid-employment');
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result.matchedFields).toBeDefined();
      expect(result.highlights).toBeDefined();
    });

    test('should support semantic similarity search', async () => {
      const request: SearchRequest = {
        query: 'company not giving money for work' // Different words, same meaning
      };

      const response = await searchService.search(request);
      
      expect(response.results).toHaveLength(1);
      expect(response.results[0]?.matchType).toBe('semantic');
      expect(response.results[0]?.score).toBeGreaterThan(0.3); // Above threshold
    });

    test('should handle empty search query', async () => {
      const request: SearchRequest = { query: '' };
      const response = await searchService.search(request);
      
      expect(response.results).toHaveLength(0);
      expect(response.totalMatches).toBe(0);
    });

    test('should handle no matches found', async () => {
      const request: SearchRequest = { 
        query: 'completely unrelated topic about aliens' 
      };
      
      const response = await searchService.search(request);
      expect(response.results).toHaveLength(0);
      expect(response.totalMatches).toBe(0);
    });
  });

  describe('Search Filtering', () => {
    beforeEach(async () => {
      await searchService.loadContent(mockScenarios, mockEmbeddings);
    });

    test('should filter by category', async () => {
      const filters: SearchFilters = {
        categories: ['employment']
      };
      
      const request: SearchRequest = {
        query: 'salary',
        filters
      };

      const response = await searchService.search(request);
      expect(response.results).toHaveLength(1);
      expect(response.filters).toEqual(filters);
    });

    test('should filter by severity', async () => {
      const filters: SearchFilters = {
        severities: ['high']
      };
      
      const request: SearchRequest = {
        query: 'salary',
        filters
      };

      const response = await searchService.search(request);
      expect(response.results).toHaveLength(1);
    });

    test('should combine multiple filters', async () => {
      const filters: SearchFilters = {
        categories: ['employment'],
        severities: ['high'],
        onlyValidated: true
      };
      
      const response = await searchService.search({
        query: 'salary',
        filters
      });
      
      expect(response.results).toHaveLength(1);
    });
  });

  describe('Autocomplete Functionality', () => {
    beforeEach(async () => {
      await searchService.loadContent(mockScenarios, mockEmbeddings);
    });

    test('should provide autocomplete suggestions', async () => {
      const request: AutocompleteRequest = {
        query: 'sal',
        limit: 5
      };

      const response: AutocompleteResponse = await searchService.getAutocompleteSuggestions(request);
      
      expect(response).toBeDefined();
      expect(response.query).toBe('sal');
      expect(response.suggestions).toBeDefined();
      expect(response.suggestions.length).toBeLessThanOrEqual(5);
      expect(response.responseTime).toBeLessThan(100); // Fast autocomplete
      
      if (response.suggestions.length > 0) {
        const suggestion = response.suggestions[0]!;
        expect(suggestion.text).toContain('sal');
        expect(suggestion.type).toBeDefined();
        expect(suggestion.score).toBeGreaterThan(0);
      }
    });

    test('should filter autocomplete by type', async () => {
      const request: AutocompleteRequest = {
        query: 'emp',
        types: ['category']
      };

      const response = await searchService.getAutocompleteSuggestions(request);
      
      response.suggestions.forEach((suggestion) => {
        expect(suggestion.type).toBe('category');
      });
    });
  });

  describe('Category-Based Browsing', () => {
    beforeEach(async () => {
      await searchService.loadContent(mockScenarios, mockEmbeddings);
    });

    test('should get scenarios by category', async () => {
      const scenarios = await searchService.getScenariosByCategory('employment');
      
      expect(scenarios).toHaveLength(1);
      expect(scenarios[0]?.category).toBe('employment');
    });

    test('should handle invalid category', async () => {
      const scenarios = await searchService.getScenariosByCategory('invalid-category');
      expect(scenarios).toHaveLength(0);
    });

    test('should get all categories with counts', async () => {
      const categories = await searchService.getAvailableCategories();
      
      expect(categories).toBeDefined();
      expect(categories.employment).toBe(1);
    });
  });

  describe('Performance Requirements', () => {
    beforeEach(async () => {
      await searchService.loadContent(mockScenarios, mockEmbeddings);
    });

    test('search should complete within 200ms', async () => {
      const startTime = Date.now();
      
      await searchService.search({ query: 'salary' });
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(200);
    });

    test('autocomplete should complete within 100ms', async () => {
      const startTime = Date.now();
      
      await searchService.getAutocompleteSuggestions({ query: 'sal' });
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should handle concurrent search requests', async () => {
      const requests = Array.from({ length: 10 }, (_, i) => 
        searchService.search({ query: `salary ${i}` })
      );

      const responses = await Promise.all(requests);
      
      expect(responses).toHaveLength(10);
      responses.forEach((response) => {
        expect(response.searchTime).toBeLessThan(200);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed search requests', async () => {
      const invalidRequest = { query: null } as any;
      
      await expect(searchService.search(invalidRequest)).rejects.toThrow();
    });

    test('should handle embedding service failures gracefully', async () => {
      // Mock embedding service failure
      jest.spyOn(embeddingService, 'generateEmbedding').mockRejectedValue(
        new Error('Embedding service unavailable')
      );

      // Should fall back to keyword search
      const response = await searchService.search({ query: 'salary' });
      expect(response.metadata.algorithm).toBe('keyword');
    });
  });
});

describe('EmbeddingService Contract', () => {
  let embeddingService: EmbeddingService;

  beforeEach(() => {
    embeddingService = new EmbeddingService();
  });

  describe('Embedding Generation', () => {
    test('should generate embeddings for text', async () => {
      const text = 'Employer not paying salary';
      const embedding = await embeddingService.generateEmbedding(text);
      
      expect(embedding).toBeDefined();
      expect(Array.isArray(embedding)).toBe(true);
      expect(embedding).toHaveLength(384); // MiniLM dimension
      expect(embedding.every((val) => typeof val === 'number')).toBe(true);
    });

    test('should generate consistent embeddings for same text', async () => {
      const text = 'Same text input';
      
      const embedding1 = await embeddingService.generateEmbedding(text);
      const embedding2 = await embeddingService.generateEmbedding(text);
      
      expect(embedding1).toEqual(embedding2);
    });

    test('should handle empty text', async () => {
      await expect(embeddingService.generateEmbedding('')).rejects.toThrow();
    });
  });

  describe('Similarity Computation', () => {
    test('should compute cosine similarity between embeddings', async () => {
      const vec1 = [1, 0, 0];
      const vec2 = [0, 1, 0];
      const vec3 = [1, 0, 0];
      
      const similarity1 = embeddingService.cosineSimilarity(vec1, vec2);
      const similarity2 = embeddingService.cosineSimilarity(vec1, vec3);
      
      expect(similarity1).toBe(0); // Orthogonal vectors
      expect(similarity2).toBe(1); // Identical vectors
    });

    test('should find most similar embeddings', async () => {
      const queryEmbedding = [1, 0, 0];
      const candidateEmbeddings = [
        { id: 'a', vector: [1, 0, 0] },
        { id: 'b', vector: [0, 1, 0] },
        { id: 'c', vector: [0.9, 0.1, 0] }
      ];
      
      const results = embeddingService.findMostSimilar(
        queryEmbedding, 
        candidateEmbeddings, 
        2
      );
      
      expect(results).toHaveLength(2);
      expect(results[0]?.id).toBe('a'); // Perfect match
      expect(results[1]?.id).toBe('c'); // Close match
    });
  });
});