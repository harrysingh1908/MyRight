/**
 * Search-related types for MyRight platform semantic search functionality
 * 
 * These interfaces define the search engine contracts, result formats,
 * and configuration options for legal scenario discovery.
 */

import { LegalScenario } from './index';

/**
 * Configuration for search behavior and parameters
 */
export interface SearchConfig {
  /** Minimum similarity score to include in results (0.0 to 1.0) */
  minScore: number;
  
  /** Maximum number of results to return */
  maxResults: number;
  
  /** Number of autocomplete suggestions to show */
  autocompleteSuggestions: number;
  
  /** Whether to include fuzzy matching for typos */
  enableFuzzyMatch: boolean;
  
  /** Boost factor for exact keyword matches */
  keywordBoost: number;
  
  /** Boost factor for title matches */
  titleBoost: number;
  
  /** Whether to enable category filtering */
  enableCategoryFilter: boolean;
  
  /** Whether to enable severity filtering */
  enableSeverityFilter: boolean;
}

/**
 * Represents a search result with relevance scoring
 */
export interface SearchResult {
  /** The legal scenario that matched */
  scenario: LegalScenario;
  
  /** Relevance score (0.0 to 1.0, higher = more relevant) */
  score: number;
  
  /** Which parts of the scenario matched the query */
  matchedFields: MatchedField[];
  
  /** Highlighted text snippets showing the match */
  highlights: SearchHighlight[];
  
  /** Reason why this result was included */
  matchType: 'title' | 'description' | 'keywords' | 'rights' | 'actions' | 'semantic';
}

/**
 * Information about which field in the scenario matched
 */
export interface MatchedField {
  /** Name of the field that matched */
  field: 'title' | 'description' | 'keywords' | 'rights' | 'actionSteps' | 'variations';
  
  /** Score for this specific field match */
  score: number;
  
  /** The specific text that matched */
  matchedText: string;
  
  /** Position of the match in the field */
  position?: {
    start: number;
    end: number;
  };
}

/**
 * Highlighted text snippet for search results
 */
export interface SearchHighlight {
  /** The text with highlighting markers */
  text: string;
  
  /** Field this highlight came from */
  field: string;
  
  /** Original text before highlighting */
  originalText: string;
}

/**
 * Complete response from a search operation
 */
export interface SearchResponse {
  /** Search query that was executed */
  query: string;
  
  /** Array of matching results */
  results: SearchResult[];
  
  /** Total number of potential matches found */
  totalMatches: number;
  
  /** Time taken to execute search (milliseconds) */
  searchTime: number;
  
  /** Applied filters */
  filters: SearchFilters;
  
  /** Search statistics and metadata */
  metadata: SearchMetadata;
  
  /** Suggestions for query refinement */
  suggestions?: QuerySuggestion[];
  
  /** Did-you-mean suggestions for potential typos */
  didYouMean?: string[];
}

/**
 * Filters that can be applied to search results
 */
export interface SearchFilters {
  /** Filter by category */
  categories?: string[];
  
  /** Filter by severity level */
  severities?: Array<'low' | 'medium' | 'high' | 'critical'>;
  
  /** Filter by time sensitivity */
  urgent?: boolean;
  
  /** Filter by action difficulty */
  maxDifficulty?: 'easy' | 'medium' | 'hard';
  
  /** Filter by cost level */
  maxCost?: 'free' | 'low' | 'medium' | 'high';
  
  /** Filter by validation status */
  onlyValidated?: boolean;
}

/**
 * Metadata about the search operation
 */
export interface SearchMetadata {
  /** Total scenarios in the database */
  totalScenarios: number;
  
  /** Number of scenarios that passed initial filtering */
  filteredScenarios: number;
  
  /** Search algorithm used */
  algorithm: 'semantic' | 'keyword' | 'hybrid';
  
  /** Whether embedding vectors were used */
  usedEmbeddings: boolean;
  
  /** Performance breakdown */
  performance: {
    /** Time for text processing */
    preprocessing: number;
    /** Time for similarity computation */
    similarity: number;
    /** Time for result ranking */
    ranking: number;
    /** Time for highlight generation */
    highlighting: number;
  };
}

/**
 * Suggestion for query refinement
 */
export interface QuerySuggestion {
  /** Suggested query text */
  query: string;
  
  /** Reason for this suggestion */
  reason: 'similar_terms' | 'broader_scope' | 'narrower_scope' | 'category_specific';
  
  /** Expected number of results for this query */
  estimatedResults: number;
}

/**
 * Autocomplete suggestion for search input
 */
export interface AutocompleteSuggestion {
  /** Suggested completion text */
  text: string;
  
  /** Type of suggestion */
  type: 'scenario_title' | 'category' | 'keyword' | 'common_phrase';
  
  /** Relevance score for ordering */
  score: number;
  
  /** How many scenarios would match this suggestion */
  matchCount: number;
  
  /** Category this suggestion belongs to */
  category?: string;
}

/**
 * Request parameters for search operations
 */
export interface SearchRequest {
  /** Search query text */
  query: string;
  
  /** Applied filters */
  filters?: SearchFilters;
  
  /** Result pagination */
  pagination?: {
    page: number;
    pageSize: number;
  };
  
  /** Sort order for results */
  sort?: 'relevance' | 'title' | 'category' | 'severity' | 'updated';
  
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  
  /** Whether to include highlights in response */
  includeHighlights?: boolean;
  
  /** Whether to include suggestions in response */
  includeSuggestions?: boolean;
}

/**
 * Request for autocomplete suggestions
 */
export interface AutocompleteRequest {
  /** Partial query text */
  query: string;
  
  /** Maximum number of suggestions to return */
  limit?: number;
  
  /** Types of suggestions to include */
  types?: Array<'scenario_title' | 'category' | 'keyword' | 'common_phrase'>;
  
  /** Filter suggestions by category */
  category?: string;
}

/**
 * Response for autocomplete requests
 */
export interface AutocompleteResponse {
  /** Original query */
  query: string;
  
  /** Array of suggestions */
  suggestions: AutocompleteSuggestion[];
  
  /** Time taken to generate suggestions */
  responseTime: number;
}

/**
 * Search analytics and usage tracking
 */
export interface SearchAnalytics {
  /** Total number of searches performed */
  totalSearches: number;
  
  /** Average response time across all searches */
  averageResponseTime: number;
  
  /** Map of popular queries and their frequency */
  popularQueries: Map<string, number>;
  
  /** Map of category usage frequency */
  categoryUsage: Map<string, number>;
  
  /** Map of click-through rates for query-result pairs */
  clickThroughRates: Map<string, number>;
  
  /** Overall search success rate (searches with results) */
  searchSuccessRate: number;
}

/**
 * Performance metrics for search operations
 */
export interface SearchPerformanceMetrics {
  /** Total number of searches performed */
  totalSearches: number;
  
  /** Average response time in milliseconds */
  averageResponseTime: number;
  
  /** Cache hit rate (0.0 to 1.0) */
  cacheHitRate: number;
  
  /** Success rate (searches that returned results) */
  successRate: number;
  
  /** Most popular queries */
  popularQueries: Array<{
    query: string;
    count: number;
  }>;
  
  /** Category usage statistics */
  categoryUsage: Array<{
    category: string;
    count: number;
  }>;
}

/**
 * Embedding vector for semantic search
 */
export interface EmbeddingVector {
  /** Scenario ID this embedding represents */
  scenarioId: string;
  
  /** Vector values (typically 384 dimensions for MiniLM) */
  vector: number[];
  
  /** Field this embedding was generated from */
  source: 'title' | 'description' | 'combined' | 'keywords';
  
  /** When this embedding was created */
  createdAt: string;
  
  /** Model used to generate this embedding */
  model: string;
  
  /** Version of the embedding model */
  modelVersion: string;
}