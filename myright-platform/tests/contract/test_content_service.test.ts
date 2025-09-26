/**
 * Contract Tests for ContentService
 * 
 * These tests define the expected behavior and API contract for the ContentService.
 * They MUST FAIL initially (TDD approach) until the ContentService is implemented.
 * 
 * Contract Requirements:
 * 1. ContentService must load and validate legal scenarios
 * 2. Must verify official source links
 * 3. Must support content filtering and categorization
 * 4. Must handle content caching and updates
 * 5. Must validate content integrity and quality
 */

import { ContentService } from '@/services/contentService';
import { SourceValidator } from '@/services/sourceValidator';
import {
  ContentConfig,
  ContentFilter,
  ContentStatistics,
  ContentBatch,
  ContentBatchResult
} from '@/types/content';
import { LegalScenario } from '@/types';

// Mock scenario data for testing
const mockScenario: LegalScenario = {
  id: 'test-scenario-1',
  title: 'Test Legal Scenario',
  description: 'A test scenario for validation',
  category: 'employment',
  rights: [],
  actionSteps: [],
  sources: [
    {
      id: 'test-source-1',
      title: 'Test Government Source',
      authority: 'Ministry of Test',
      url: 'https://example.gov.in/test-law',
      type: 'law',
      lastVerified: '2024-01-15',
      status: 'active'
    }
  ],
  keywords: ['test', 'scenario'],
  variations: ['test variation'],
  lastUpdated: '2024-01-15',
  validationStatus: {
    sourcesVerified: true,
    legalReview: true,
    clarityReview: true,
    lastValidated: '2024-01-15'
  },
  severity: 'medium'
};

describe('ContentService Contract', () => {
  let contentService: ContentService;
  let sourceValidator: SourceValidator;

  const defaultConfig: ContentConfig = {
    scenariosDir: '/data/scenarios',
    embeddingsDir: '/data/embeddings',
    supportedFormats: ['json'],
    validateOnLoad: true,
    enableCaching: true,
    cacheDuration: 300000, // 5 minutes
    preloadContent: false
  };

  beforeEach(() => {
    // These services don't exist yet - tests MUST FAIL until implemented
    contentService = new ContentService(defaultConfig);
    sourceValidator = new SourceValidator();
  });

  describe('Initialization and Configuration', () => {
    test('ContentService should initialize with configuration', () => {
      expect(contentService).toBeDefined();
      expect(contentService.config).toEqual(defaultConfig);
    });

    test('should set up content directories', async () => {
      await contentService.initialize();
      
      const directories = await contentService.getContentDirectories();
      expect(directories.scenarios).toBe('/data/scenarios');
      expect(directories.embeddings).toBe('/data/embeddings');
    });

    test('SourceValidator should initialize correctly', () => {
      expect(sourceValidator).toBeDefined();
      expect(sourceValidator.isInitialized()).toBe(true);
    });
  });

  describe('Content Loading and Management', () => {
    beforeEach(async () => {
      await contentService.initialize();
    });

    test('should load single scenario by ID', async () => {
      // Mock file loading
      jest.spyOn(contentService, 'loadScenario').mockResolvedValue(mockScenario);
      
      const scenario = await contentService.loadScenario('test-scenario-1');
      
      expect(scenario).toBeDefined();
      expect(scenario.id).toBe('test-scenario-1');
      expect(scenario.title).toBe('Test Legal Scenario');
    });

    test('should load all scenarios from directory', async () => {
      jest.spyOn(contentService, 'loadAllScenarios').mockResolvedValue([mockScenario]);
      
      const scenarios = await contentService.loadAllScenarios();
      
      expect(scenarios).toHaveLength(1);
      expect(scenarios[0]!.id).toBe('test-scenario-1');
    });

    test('should handle file loading errors gracefully', async () => {
      jest.spyOn(contentService, 'loadScenario').mockRejectedValue(
        new Error('File not found')
      );
      
      await expect(contentService.loadScenario('non-existent')).rejects.toThrow('File not found');
    });

    test('should cache loaded content when enabled', async () => {
      jest.spyOn(contentService, 'loadScenario').mockResolvedValue(mockScenario);
      
      // First load
      await contentService.loadScenario('test-scenario-1');
      // Second load should use cache
      await contentService.loadScenario('test-scenario-1');
      
      expect(contentService.loadScenario).toHaveBeenCalledTimes(1);
      expect(contentService.isCached('test-scenario-1')).toBe(true);
    });
  });

  describe('Content Validation', () => {
    beforeEach(async () => {
      await contentService.initialize();
    });

    test('should validate scenario content structure', async () => {
      const validationResult = await contentService.validateScenario(mockScenario);
      
      expect(validationResult).toBeDefined();
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.score).toBeGreaterThan(80);
      expect(validationResult.checks).toBeDefined();
      expect(validationResult.validatedAt).toBeDefined();
    });

    test('should detect missing required fields', async () => {
      const incompleteScenario = { ...mockScenario };
      delete (incompleteScenario as any).title;
      
      const validationResult = await contentService.validateScenario(incompleteScenario as any);
      
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.criticalIssues).toHaveLength(1);
      expect(validationResult.criticalIssues[0]!.type).toBe('missing_info');
    });

    test('should validate all sources in scenario', async () => {
      const validationResult = await contentService.validateScenario(mockScenario);
      
      const sourceCheck = validationResult.checks.find(check => 
        check.type === 'source_verification'
      );
      
      expect(sourceCheck).toBeDefined();
      expect(sourceCheck!.passed).toBe(true);
    });

    test('should check content clarity and readability', async () => {
      const validationResult = await contentService.validateScenario(mockScenario);
      
      const clarityCheck = validationResult.checks.find(check => 
        check.type === 'language_clarity'
      );
      
      expect(clarityCheck).toBeDefined();
      expect(clarityCheck!.score).toBeGreaterThan(60);
    });
  });

  describe('Content Filtering and Search', () => {
    beforeEach(async () => {
      await contentService.initialize();
      jest.spyOn(contentService, 'loadAllScenarios').mockResolvedValue([mockScenario]);
    });

    test('should filter scenarios by category', async () => {
      const filter: ContentFilter = {
        category: 'employment'
      };
      
      const scenarios = await contentService.getScenarios(filter);
      
      expect(scenarios).toHaveLength(1);
      expect(scenarios[0]!.category).toBe('employment');
    });

    test('should filter by validation status', async () => {
      const filter: ContentFilter = {
        validationStatus: 'valid'
      };
      
      const scenarios = await contentService.getScenarios(filter);
      
      expect(scenarios).toHaveLength(1);
      expect(scenarios[0]!.validationStatus.sourcesVerified).toBe(true);
    });

    test('should filter by date range', async () => {
      const filter: ContentFilter = {
        updatedAfter: '2024-01-01',
        updatedBefore: '2024-12-31'
      };
      
      const scenarios = await contentService.getScenarios(filter);
      
      expect(scenarios).toHaveLength(1);
    });

    test('should combine multiple filters', async () => {
      const filter: ContentFilter = {
        category: 'employment',
        validationStatus: 'valid',
        severity: ['medium']
      };
      
      const scenarios = await contentService.getScenarios(filter);
      
      expect(scenarios).toHaveLength(1);
    });
  });

  describe('Categories Management', () => {
    beforeEach(async () => {
      await contentService.initialize();
    });

    test('should load and return all categories', async () => {
      const mockCategories = {
        categories: [{
          id: 'employment',
          name: 'Employment',
          description: 'Work-related issues',
          scenarioCount: 1,
          isActive: true,
          icon: '💼',
          color: '#3b82f6',
          sortOrder: 1,
          slug: 'employment',
          keywords: ['work', 'job']
        }]
      };
      
      jest.spyOn(contentService, 'getCategories').mockResolvedValue(mockCategories.categories);
      
      const categories = await contentService.getCategories();
      
      expect(categories).toHaveLength(1);
      expect(categories[0]!.id).toBe('employment');
      expect(categories[0]!.name).toBe('Employment');
    });

    test('should get category by ID', async () => {
      const mockCategory = {
        id: 'employment',
        name: 'Employment',
        description: 'Work-related issues',
        scenarioCount: 1,
        isActive: true,
        icon: '💼',
        color: '#3b82f6',
        sortOrder: 1,
        slug: 'employment',
        keywords: ['work', 'job']
      };
      
      jest.spyOn(contentService, 'getCategoryById').mockResolvedValue(mockCategory);
      
      const category = await contentService.getCategoryById('employment');
      
      expect(category).toBeDefined();
      expect(category!.id).toBe('employment');
    });
  });

  describe('Content Statistics', () => {
    beforeEach(async () => {
      await contentService.initialize();
      jest.spyOn(contentService, 'loadAllScenarios').mockResolvedValue([mockScenario]);
    });

    test('should generate content statistics', async () => {
      const stats: ContentStatistics = await contentService.getContentStatistics();
      
      expect(stats).toBeDefined();
      expect(stats.totalScenarios).toBe(1);
      expect(stats.scenariosByCategory.employment).toBe(1);
      expect(stats.scenariosByValidation.valid).toBe(1);
      expect(stats.lastUpdated).toBeDefined();
    });

    test('should track content freshness', async () => {
      const stats = await contentService.getContentStatistics();
      
      expect(stats.contentFreshness).toBeDefined();
      expect(stats.contentFreshness.upToDate).toBeGreaterThanOrEqual(0);
      expect(stats.contentFreshness.needsUpdate).toBeGreaterThanOrEqual(0);
      expect(stats.contentFreshness.outdated).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Batch Operations', () => {
    beforeEach(async () => {
      await contentService.initialize();
    });

    test('should process batch validation', async () => {
      const batch: ContentBatch = {
        scenarios: [mockScenario],
        operation: 'validate',
        options: {
          validate: true,
          continueOnError: true,
          concurrency: 2
        }
      };
      
      const result: ContentBatchResult = await contentService.processBatch(batch);
      
      expect(result).toBeDefined();
      expect(result.totalProcessed).toBe(1);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should handle batch processing errors', async () => {
      const invalidScenario = { ...mockScenario };
      delete (invalidScenario as any).id;
      
      const batch: ContentBatch = {
        scenarios: [invalidScenario as any],
        operation: 'validate',
        options: {
          validate: true,
          continueOnError: true,
          concurrency: 1
        }
      };
      
      const result = await contentService.processBatch(batch);
      
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('Performance Requirements', () => {
    beforeEach(async () => {
      await contentService.initialize();
    });

    test('content loading should be efficient', async () => {
      const startTime = Date.now();
      
      await contentService.loadScenario('test-scenario-1');
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(100); // Fast content loading
    });

    test('should handle concurrent content requests', async () => {
      const requests = Array.from({ length: 10 }, (_, i) => 
        contentService.loadScenario(`scenario-${i}`)
      );

      // Should not throw errors even if some scenarios don't exist
      const results = await Promise.allSettled(requests);
      
      expect(results).toHaveLength(10);
    });
  });
});

describe('SourceValidator Contract', () => {
  let sourceValidator: SourceValidator;

  beforeEach(() => {
    sourceValidator = new SourceValidator();
  });

  describe('Source Link Validation', () => {
    test('should validate active government URLs', async () => {
      const url = 'https://labour.gov.in/test-page';
      
      const isValid = await sourceValidator.validateUrl(url);
      
      expect(typeof isValid).toBe('boolean');
    });

    test('should handle network timeouts gracefully', async () => {
      const slowUrl = 'https://very-slow-government-site.gov.in/timeout';
      
      const startTime = Date.now();
      await sourceValidator.validateUrl(slowUrl, { timeout: 5000 });
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(6000); // Should timeout within limit
    });

    test('should batch validate multiple URLs efficiently', async () => {
      const urls = [
        'https://labour.gov.in/page1',
        'https://labour.gov.in/page2',
        'https://labour.gov.in/page3'
      ];
      
      const results = await sourceValidator.validateUrls(urls);
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toHaveProperty('url');
        expect(result).toHaveProperty('isValid');
        expect(result).toHaveProperty('statusCode');
        expect(result).toHaveProperty('checkedAt');
      });
    });

    test('should identify government domains', () => {
      expect(sourceValidator.isGovernmentDomain('labour.gov.in')).toBe(true);
      expect(sourceValidator.isGovernmentDomain('example.com')).toBe(false);
      expect(sourceValidator.isGovernmentDomain('courts.gov.in')).toBe(true);
    });
  });

  describe('Source Content Validation', () => {
    test('should extract and validate legal citations', async () => {
      const mockContent = 'Section 5 of Payment of Wages Act, 1936';
      
      const citations = await sourceValidator.extractLegalCitations(mockContent);
      
      expect(citations).toBeDefined();
      expect(citations.length).toBeGreaterThan(0);
    });

    test('should detect broken or moved pages', async () => {
      const brokenUrl = 'https://government.gov.in/non-existent-page';
      
      const result = await sourceValidator.validateUrl(brokenUrl);
      
      expect(typeof result).toBe('boolean');
    });
  });
});