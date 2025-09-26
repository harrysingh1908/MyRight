/**
 * Integration Test: Content Loading and Validation
 * 
 * This test validates the end-to-end content management functionality from
 * loading scenarios to validation and categorization. It MUST FAIL initially
 * until ContentService and related components are implemented.
 * 
 * Integration Requirements:
 * 1. Content loads correctly from JSON files
 * 2. Source links are validated and accessible
 * 3. Content validation catches quality issues
 * 4. Categories are properly organized and displayed
 * 5. Content statistics are accurate
 */

import { ContentService } from '@/services/contentService';
import { SourceValidator } from '@/services/sourceValidator';
import {
  ContentConfig,
  ContentFilter,
  ValidationResult,
  ContentStatistics
} from '@/types/content';
import { LegalScenario } from '@/types';

// Mock file system operations for testing
const mockFileSystem = {
  '/data/scenarios/employment/salary-unpaid.json': JSON.stringify({
    id: 'salary-unpaid-employment',
    title: 'Employer Not Paying Salary or Wages',
    description: 'When your employer refuses to pay your salary, wages, or withholds payment without valid reason',
    category: 'employment',
    rights: [
      {
        id: 'wage-payment-right',
        title: 'Right to Timely Payment of Wages',
        description: 'Every worker has the right to receive wages on time',
        legalBasis: {
          law: 'Payment of Wages Act, 1936',
          section: 'Section 5',
          url: 'https://labour.gov.in/sites/default/files/ThePaymentofWagesAct1936.pdf'
        },
        application: 'Applies to all employees earning up to ₹24,000 per month'
      }
    ],
    actionSteps: [
      {
        order: 1,
        title: 'Document Your Employment',
        description: 'Gather employment documents',
        type: 'documentation',
        difficulty: 'easy',
        timeEstimate: '1-2 hours',
        cost: 'free'
      }
    ],
    sources: [
      {
        id: 'wage-act-source',
        title: 'Payment of Wages Act, 1936',
        authority: 'Ministry of Labour and Employment',
        url: 'https://labour.gov.in/sites/default/files/ThePaymentofWagesAct1936.pdf',
        type: 'law',
        publishedDate: '1936-12-23',
        lastVerified: '2024-01-15',
        status: 'active'
      }
    ],
    keywords: ['salary', 'wages', 'unpaid', 'employer'],
    variations: ['My company is not paying salary'],
    lastUpdated: '2024-01-15',
    validationStatus: {
      sourcesVerified: true,
      legalReview: true,
      clarityReview: true,
      lastValidated: '2024-01-15'
    },
    severity: 'high'
  }),

  '/data/scenarios/housing/security-deposit.json': JSON.stringify({
    id: 'security-deposit-housing',
    title: 'Landlord Not Returning Security Deposit',
    description: 'When landlord refuses to return security deposit after tenancy ends',
    category: 'housing',
    rights: [],
    actionSteps: [],
    sources: [
      {
        id: 'rent-act-source',
        title: 'State Rent Control Acts',
        authority: 'State Housing Departments',
        url: 'https://housing.gov.in/rent-control-acts',
        type: 'law',
        lastVerified: '2024-01-15',
        status: 'active'
      }
    ],
    keywords: ['security deposit', 'landlord', 'tenant'],
    variations: ['Landlord not returning deposit'],
    lastUpdated: '2024-01-15',
    validationStatus: {
      sourcesVerified: false, // This scenario has validation issues
      legalReview: true,
      clarityReview: false,
      lastValidated: '2023-12-01' // Outdated validation
    },
    severity: 'medium'
  }),

  '/data/categories.json': JSON.stringify({
    categories: [
      {
        id: 'employment',
        name: 'Employment & Labor Rights',
        description: 'Rights related to workplace issues',
        icon: '💼',
        color: '#3b82f6',
        scenarioCount: 1,
        sortOrder: 1,
        isActive: true,
        slug: 'employment',
        keywords: ['work', 'job', 'salary']
      },
      {
        id: 'housing',
        name: 'Housing & Property Rights',
        description: 'Rights related to rental and property issues',
        icon: '🏠',
        color: '#10b981',
        scenarioCount: 1,
        sortOrder: 2,
        isActive: true,
        slug: 'housing',
        keywords: ['rent', 'property', 'landlord']
      }
    ]
  })
};

// Mock broken scenario for validation testing
const brokenScenario = {
  // Missing required id field
  title: 'Broken Scenario',
  // Missing description
  category: 'invalid-category',
  rights: [],
  actionSteps: [],
  sources: [
    {
      id: 'broken-source',
      title: 'Broken Link Source',
      authority: 'Unknown Authority',
      url: 'https://broken-link.gov.in/404', // This URL should fail validation
      type: 'law',
      lastVerified: '2020-01-01', // Very old verification
      status: 'active'
    }
  ],
  keywords: [],
  variations: [],
  lastUpdated: '2020-01-01', // Very outdated
  validationStatus: {
    sourcesVerified: false,
    legalReview: false,
    clarityReview: false,
    lastValidated: '2020-01-01'
  },
  severity: 'low'
};

describe('Content Loading and Validation Integration', () => {
  let contentService: ContentService;
  let sourceValidator: SourceValidator;

  const testConfig: ContentConfig = {
    scenariosDir: '/data/scenarios',
    embeddingsDir: '/data/embeddings',
    supportedFormats: ['json'],
    validateOnLoad: true,
    enableCaching: true,
    cacheDuration: 300000,
    preloadContent: false
  };

  beforeEach(async () => {
    // Mock file system operations
    jest.spyOn(require('fs').promises, 'readFile').mockImplementation(async (path: string) => {
      const pathStr = path.toString();
      if (mockFileSystem[pathStr as keyof typeof mockFileSystem]) {
        return mockFileSystem[pathStr as keyof typeof mockFileSystem];
      }
      throw new Error(`File not found: ${path}`);
    });

    jest.spyOn(require('fs').promises, 'readdir').mockImplementation(async (path: string) => {
      const pathStr = path.toString();
      if (pathStr.includes('employment')) {
        return ['salary-unpaid.json'];
      }
      if (pathStr.includes('housing')) {
        return ['security-deposit.json'];
      }
      if (pathStr.includes('scenarios')) {
        return ['employment', 'housing'];
      }
      return [];
    });

    // Initialize services
    contentService = new ContentService(testConfig);
    sourceValidator = new SourceValidator();
    await contentService.initialize();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Content Loading Integration', () => {
    test('should load all scenarios from directory structure', async () => {
      const scenarios = await contentService.loadAllScenarios();
      
      expect(scenarios).toHaveLength(2);
      
      const salaryScenario = scenarios.find(s => s.id === 'salary-unpaid-employment');
      expect(salaryScenario).toBeDefined();
      expect(salaryScenario!.title).toBe('Employer Not Paying Salary or Wages');
      expect(salaryScenario!.category).toBe('employment');
      
      const housingScenario = scenarios.find(s => s.id === 'security-deposit-housing');
      expect(housingScenario).toBeDefined();
      expect(housingScenario!.category).toBe('housing');
    });

    test('should load and parse categories correctly', async () => {
      const categories = await contentService.getCategories();
      
      expect(categories).toHaveLength(2);
      
      const employmentCategory = categories.find(c => c.id === 'employment');
      expect(employmentCategory).toBeDefined();
      expect(employmentCategory!.name).toBe('Employment & Labor Rights');
      expect(employmentCategory!.scenarioCount).toBe(1);
      
      const housingCategory = categories.find(c => c.id === 'housing');
      expect(housingCategory).toBeDefined();
      expect(housingCategory!.icon).toBe('🏠');
    });

    test('should handle file loading errors gracefully', async () => {
      // Mock a file system error
      jest.spyOn(require('fs').promises, 'readFile').mockRejectedValueOnce(
        new Error('Permission denied')
      );
      
      await expect(contentService.loadScenario('non-existent')).rejects.toThrow();
    });

    test('should cache loaded content when enabled', async () => {
      const readFileSpy = jest.spyOn(require('fs').promises, 'readFile');
      
      // First load
      await contentService.loadScenario('salary-unpaid-employment');
      const firstCallCount = readFileSpy.mock.calls.length;
      
      // Second load should use cache
      await contentService.loadScenario('salary-unpaid-employment');
      const secondCallCount = readFileSpy.mock.calls.length;
      
      expect(secondCallCount).toBe(firstCallCount); // No additional file reads
      expect(contentService.isCached('salary-unpaid-employment')).toBe(true);
    });
  });

  describe('Content Validation Integration', () => {
    test('should validate good scenario successfully', async () => {
      const scenario = await contentService.loadScenario('salary-unpaid-employment');
      const validationResult = await contentService.validateScenario(scenario);
      
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.score).toBeGreaterThan(80);
      expect(validationResult.criticalIssues).toHaveLength(0);
      
      // Check that all validation checks were performed
      const checkTypes = validationResult.checks.map(c => c.type);
      expect(checkTypes).toContain('source_verification');
      expect(checkTypes).toContain('legal_accuracy');
      expect(checkTypes).toContain('language_clarity');
      expect(checkTypes).toContain('completeness');
    });

    test('should detect validation issues in problematic content', async () => {
      const validationResult = await contentService.validateScenario(brokenScenario as any);
      
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.score).toBeLessThan(60);
      expect(validationResult.criticalIssues.length).toBeGreaterThan(0);
      
      // Should detect missing ID
      const missingIdIssue = validationResult.criticalIssues.find(
        issue => issue.type === 'missing_info' && issue.message.includes('id')
      );
      expect(missingIdIssue).toBeDefined();
    });

    test('should validate source links and detect broken URLs', async () => {
      // Mock URL validation
      jest.spyOn(sourceValidator, 'validateUrl').mockImplementation(async (url: string) => {
        return !url.includes('broken-link'); // Return false for broken links
      });
      
      const validationResult = await contentService.validateScenario(brokenScenario as any);
      
      const sourceCheck = validationResult.checks.find(c => c.type === 'source_verification');
      expect(sourceCheck).toBeDefined();
      expect(sourceCheck!.passed).toBe(false);
      
      const brokenLinkIssue = validationResult.criticalIssues.find(
        issue => issue.type === 'broken_link'
      );
      expect(brokenLinkIssue).toBeDefined();
    });

    test('should check content freshness and flag outdated content', async () => {
      const validationResult = await contentService.validateScenario(brokenScenario as any);
      
      const outdatedIssue = validationResult.warnings.find(
        issue => issue.message.includes('outdated') || issue.message.includes('old')
      );
      expect(outdatedIssue).toBeDefined();
    });
  });

  describe('Content Filtering and Organization', () => {
    beforeEach(async () => {
      // Pre-load all scenarios
      await contentService.loadAllScenarios();
    });

    test('should filter scenarios by category', async () => {
      const employmentFilter: ContentFilter = {
        category: 'employment'
      };
      
      const scenarios = await contentService.getScenarios(employmentFilter);
      
      expect(scenarios).toHaveLength(1);
      expect(scenarios[0]!.category).toBe('employment');
    });

    test('should filter by validation status', async () => {
      const validFilter: ContentFilter = {
        validationStatus: 'valid'
      };
      
      const validScenarios = await contentService.getScenarios(validFilter);
      
      // Only scenarios with proper validation should be returned
      validScenarios.forEach(scenario => {
        expect(scenario.validationStatus.sourcesVerified).toBe(true);
        expect(scenario.validationStatus.legalReview).toBe(true);
      });
    });

    test('should filter by severity level', async () => {
      const highSeverityFilter: ContentFilter = {
        severity: ['high']
      };
      
      const scenarios = await contentService.getScenarios(highSeverityFilter);
      
      scenarios.forEach(scenario => {
        expect(scenario.severity).toBe('high');
      });
    });

    test('should combine multiple filters', async () => {
      const combinedFilter: ContentFilter = {
        category: 'employment',
        validationStatus: 'valid',
        severity: ['high']
      };
      
      const scenarios = await contentService.getScenarios(combinedFilter);
      
      scenarios.forEach(scenario => {
        expect(scenario.category).toBe('employment');
        expect(scenario.severity).toBe('high');
        expect(scenario.validationStatus.sourcesVerified).toBe(true);
      });
    });
  });

  describe('Content Statistics Integration', () => {
    beforeEach(async () => {
      await contentService.loadAllScenarios();
    });

    test('should generate accurate content statistics', async () => {
      const stats: ContentStatistics = await contentService.getContentStatistics();
      
      expect(stats.totalScenarios).toBe(2);
      expect(stats.scenariosByCategory.employment).toBe(1);
      expect(stats.scenariosByCategory.housing).toBe(1);
      
      // Validation statistics
      expect(stats.scenariosByValidation.valid).toBe(1); // Only employment scenario is fully valid
      expect(stats.scenariosByValidation.needsReview).toBe(1); // Housing scenario has issues
      
      expect(stats.lastUpdated).toBeDefined();
    });

    test('should track content freshness accurately', async () => {
      const stats = await contentService.getContentStatistics();
      
      expect(stats.contentFreshness.upToDate).toBe(1); // Employment scenario from 2024
      expect(stats.contentFreshness.outdated).toBe(1); // Housing scenario from 2020
      expect(stats.contentFreshness.needsUpdate).toBe(0);
    });

    test('should monitor source verification status', async () => {
      // Mock source validation
      jest.spyOn(sourceValidator, 'validateUrls').mockResolvedValue([
        {
          url: 'https://labour.gov.in/sites/default/files/ThePaymentofWagesAct1936.pdf',
          isValid: true,
          statusCode: 200,
          checkedAt: new Date().toISOString()
        },
        {
          url: 'https://housing.gov.in/rent-control-acts',
          isValid: false,
          statusCode: 404,
          checkedAt: new Date().toISOString()
        }
      ]);
      
      const stats = await contentService.getContentStatistics();
      
      expect(stats.sourceStatus.verified).toBe(1);
      expect(stats.sourceStatus.broken).toBe(1);
    });
  });

  describe('Batch Operations Integration', () => {
    test('should process batch validation efficiently', async () => {
      const scenarios = await contentService.loadAllScenarios();
      
      const batchResult = await contentService.processBatch({
        scenarios,
        operation: 'validate',
        options: {
          validate: true,
          continueOnError: true,
          concurrency: 2
        }
      });
      
      expect(batchResult.totalProcessed).toBe(2);
      expect(batchResult.successful).toBe(1); // Employment scenario should pass
      expect(batchResult.failed).toBe(1); // Housing scenario should fail
      expect(batchResult.processingTime).toBeGreaterThan(0);
      expect(batchResult.validationResults).toHaveLength(2);
    });

    test('should handle batch processing with progress tracking', async () => {
      const scenarios = await contentService.loadAllScenarios();
      const progressUpdates: Array<{ completed: number; total: number }> = [];
      
      await contentService.processBatch({
        scenarios,
        operation: 'validate',
        options: {
          validate: true,
          continueOnError: true,
          concurrency: 1
        },
        onProgress: (completed, total) => {
          progressUpdates.push({ completed, total });
        }
      });
      
      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(progressUpdates[progressUpdates.length - 1]).toEqual({
        completed: 2,
        total: 2
      });
    });
  });

  describe('Performance and Reliability', () => {
    test('should handle large numbers of scenarios efficiently', async () => {
      // Mock large dataset
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        ...mockFileSystem['/data/scenarios/employment/salary-unpaid.json'],
        id: `scenario-${i}`
      }));
      
      jest.spyOn(contentService, 'loadAllScenarios').mockResolvedValue(largeDataset);
      
      const startTime = Date.now();
      const stats = await contentService.getContentStatistics();
      const endTime = Date.now();
      
      expect(stats.totalScenarios).toBe(100);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle concurrent validation requests', async () => {
      const scenario = await contentService.loadScenario('salary-unpaid-employment');
      
      // Start multiple validations concurrently
      const validationPromises = Array.from({ length: 5 }, () =>
        contentService.validateScenario(scenario)
      );
      
      const results = await Promise.all(validationPromises);
      
      // All should complete successfully
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.isValid).toBe(true);
      });
    });

    test('should recover from temporary failures', async () => {
      let failureCount = 0;
      
      // Mock intermittent failures
      jest.spyOn(require('fs').promises, 'readFile').mockImplementation(async (path: string) => {
        failureCount++;
        if (failureCount <= 2) {
          throw new Error('Temporary failure');
        }
        
        const pathStr = path.toString();
        if (mockFileSystem[pathStr as keyof typeof mockFileSystem]) {
          return mockFileSystem[pathStr as keyof typeof mockFileSystem];
        }
        throw new Error(`File not found: ${path}`);
      });
      
      // Should eventually succeed after retries
      const scenario = await contentService.loadScenario('salary-unpaid-employment');
      expect(scenario).toBeDefined();
      expect(scenario.id).toBe('salary-unpaid-employment');
    });
  });
});