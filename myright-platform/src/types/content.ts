/**
 * Content management types for MyRight platform
 * 
 * These interfaces define content organization, validation, and management
 * for legal scenarios, categories, and official sources.
 */

import { LegalScenario } from './index';

// Re-export for convenience
export type { LegalScenario };

/**
 * Category for organizing legal scenarios
 */
export interface Category {
  /** Unique identifier for the category */
  id: string;
  
  /** Display name of the category */
  name: string;
  
  /** Brief description of what scenarios this category covers */
  description: string;
  
  /** Icon or emoji representing this category */
  icon: string;
  
  /** Color theme for this category (hex code) */
  color: string;
  
  /** Number of scenarios in this category */
  scenarioCount: number;
  
  /** Alias for scenarioCount to support 'count' property */
  count?: number;
  
  /** Subcategories within this category */
  subcategories?: Subcategory[];
  
  /** Sort order for display */
  sortOrder: number;
  
  /** Whether this category is currently active */
  isActive: boolean;
  
  /** SEO-friendly URL slug */
  slug: string;
  
  /** Keywords for search and filtering */
  keywords: string[];
  
  /** Related categories */
  relatedCategories?: string[];
}

/**
 * Subcategory for more specific organization
 */
export interface Subcategory {
  /** Unique identifier within the parent category */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Brief description */
  description: string;
  
  /** Number of scenarios */
  scenarioCount: number;
  
  /** Sort order */
  sortOrder: number;
  
  /** Whether active */
  isActive: boolean;
}

/**
 * Content validation results and status
 */
export interface ValidationResult {
  /** Overall validation status */
  isValid: boolean;
  
  /** Specific validation checks performed */
  checks: ValidationCheck[];
  
  /** Overall score (0-100) */
  score: number;
  
  /** When validation was performed */
  validatedAt: string;
  
  /** Who performed the validation */
  validator: string;
  
  /** Next scheduled validation date */
  nextValidation?: string;

  /** Critical issues found during validation */
  criticalIssues: ValidationIssue[];

  /** Warnings found during validation */
  warnings: ValidationIssue[];

  /** Suggestions for improvement */
  suggestions: ValidationIssue[];
}

/**
 * Configuration for the content service
 */
export interface ContentConfig {
  /** Directory where scenario JSON files are stored */
  scenariosDir: string;
  
  /** Directory where embedding files are stored */
  embeddingsDir: string;
  
  /** Path to the categories JSON file */
  categoriesFile: string;

  /** Path to the validation rules file */
  validationRules: string;

  /** Supported file formats for content */
  supportedFormats: string[];
  
  /** Whether to validate content when it's loaded */
  validateOnLoad: boolean;
  
  /** Whether to preload all content on startup */
  preloadContent: boolean;
  
  /** Enable content caching */
  enableCaching: boolean;
  
  /** Cache duration in milliseconds */
  cacheDuration: number;
}

/**
 * A single validation check performed on content
 */
export interface ValidationCheck {
  /** Name of the validation check */
  name: string;
  
  /** Type of check performed */
  type: 'source_verification' | 'legal_accuracy' | 'language_clarity' | 'completeness' | 'accessibility';
  
  /** Whether this check passed */
  passed: boolean;
  
  /** Score for this check (0-100) */
  score: number;
  
  /** Details about what was checked */
  details: string;
  
  /** Issues found during this check */
  issues: ValidationIssue[];
  
  /** When this check was performed */
  checkedAt: string;
}

/**
 * Validation issue or suggestion
 */
export interface ValidationIssue {
  /** Severity level */
  severity: 'critical' | 'warning' | 'suggestion';
  
  /** Type of issue */
  type: 'broken_link' | 'outdated_info' | 'unclear_language' | 'missing_info' | 'legal_accuracy' | 'accessibility';
  
  /** Human-readable description */
  message: string;
  
  /** Location of the issue */
  location?: {
    field: string;
    position?: number;
  };
  
  /** Suggested fix */
  suggestion?: string;
  
  /** Whether this issue blocks publication */
  blocking: boolean;
}

/**
 * Content statistics and analytics
 */
export interface ContentStatistics {
  /** Total number of scenarios */
  totalScenarios: number;
  
  /** Number by category */
  scenariosByCategory: Record<string, number>;
  
  /** Number by validation status */
  scenariosByValidation: {
    valid: number;
    needsReview: number;
    invalid: number;
  };
  
  /** Content freshness */
  contentFreshness: {
    upToDate: number;
    needsUpdate: number;
    outdated: number;
  };
  
  /** Source verification status */
  sourceStatus: {
    verified: number;
    pending: number;
    broken: number;
  };
  
  /** Last updated */
  lastUpdated: string;
}

/**
 * Content file metadata
 */
export interface ContentFileInfo {
  /** File path relative to content directory */
  path: string;
  
  /** File size in bytes */
  size: number;
  
  /** File modification date */
  lastModified: string;
  
  /** File format */
  format: 'json' | 'yaml' | 'markdown';
  
  /** Content hash for change detection */
  hash: string;
  
  /** Whether file is readable */
  isReadable: boolean;
  
  /** Parse errors (if any) */
  parseErrors?: string[];
}

/**
 * Bulk content operations
 */
export interface ContentBatch {
  /** Scenarios to process */
  scenarios: LegalScenario[];
  
  /** Operation type */
  operation: 'create' | 'update' | 'validate' | 'delete';
  
  /** Batch processing options */
  options: {
    /** Whether to validate before processing */
    validate: boolean;
    /** Whether to continue on errors */
    continueOnError: boolean;
    /** Maximum parallel operations */
    concurrency: number;
  };
  
  /** Processing progress callback */
  onProgress?: (completed: number, total: number) => void;
}

/**
 * Content batch processing result
 */
export interface ContentBatchResult {
  /** Total items processed */
  totalProcessed: number;
  
  /** Successfully processed items */
  successful: number;
  
  /** Failed items with errors */
  failed: number;
  
  /** Processing errors */
  errors: Array<{
    scenarioId: string;
    error: string;
  }>;
  
  /** Validation results */
  validationResults: ValidationResult[];
  
  /** Processing time in milliseconds */
  processingTime: number;
}

/**
 * Content search and filtering
 */
export interface ContentFilter {
  /** Filter by category */
  category?: string;
  
  /** Filter by validation status */
  validationStatus?: 'valid' | 'needs_review' | 'invalid';
  
  /** Filter by last update date */
  updatedAfter?: string;
  updatedBefore?: string;
  
  /** Filter by severity */
  severity?: Array<'low' | 'medium' | 'high' | 'critical'>;
  
  /** Text search in content */
  textSearch?: string;
  
  /** Filter by source verification status */
  sourceStatus?: 'verified' | 'pending' | 'broken';
}

/**
 * Content export options
 */
export interface ContentExportOptions {
  /** Format to export to */
  format: 'json' | 'csv' | 'yaml' | 'markdown';
  
  /** Which fields to include */
  fields?: string[];
  
  /** Filters to apply */
  filters?: ContentFilter;
  
  /** Whether to include validation data */
  includeValidation: boolean;
  
  /** Whether to include embeddings */
  includeEmbeddings: boolean;
  
  /** Compression options */
  compression?: {
    enabled: boolean;
    format: 'gzip' | 'zip';
  };
}

/**
 * Content import options
 */
export interface ContentImportOptions {
  /** Source format */
  format: 'json' | 'csv' | 'yaml' | 'markdown';
  
  /** Whether to validate imported content */
  validate: boolean;
  
  /** How to handle conflicts */
  conflictResolution: 'skip' | 'overwrite' | 'merge';
  
  /** Whether to generate embeddings for new content */
  generateEmbeddings: boolean;
  
  /** Batch size for processing */
  batchSize: number;
}