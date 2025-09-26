# API Documentation

## Overview

The MyRight Platform provides a comprehensive API for searching and accessing legal content. The API is built with TypeScript and follows strict contract-based design principles.

## Core Services

### SearchService

The `SearchService` handles all search-related functionality including semantic search, filtering, and autocomplete.

#### Configuration

```typescript
interface SearchConfig {
  minScore: number;           // Minimum similarity score (0.0-1.0)
  maxResults: number;         // Maximum results per query  
  autocompleteSuggestions: number; // Max autocomplete suggestions
  enableFuzzyMatch: boolean;  // Enable fuzzy matching
  keywordBoost: number;       // Keyword search boost factor
  titleBoost: number;         // Title matching boost factor
  enableCategoryFilter: boolean; // Enable category filtering
  enableSeverityFilter: boolean; // Enable severity filtering
}
```

#### Methods

##### `search(request: SearchRequest): Promise<SearchResponse>`

Performs a comprehensive search across legal scenarios.

**Parameters:**
```typescript
interface SearchRequest {
  query: string;                    // Search query text
  filters?: SearchFilters;          // Optional filters
  limit?: number;                   // Results limit
  algorithm?: 'semantic' | 'keyword' | 'hybrid'; // Search algorithm
}

interface SearchFilters {
  categories?: string[];            // Filter by categories
  severities?: ('low' | 'medium' | 'high' | 'critical')[];
  dateRange?: {                     // Filter by date range
    start: string;
    end: string;
  };
}
```

**Response:**
```typescript
interface SearchResponse {
  results: SearchResult[];          // Search results array
  totalMatches: number;             // Total matching scenarios
  searchTime: number;               // Query execution time (ms)
  metadata: SearchMetadata;         // Search metadata
}

interface SearchResult {
  scenario: LegalScenario;          // Legal scenario data
  score: number;                    // Relevance score (0.0-1.0)
  matchedFields: MatchedField[];    // Fields that matched
  highlights: SearchHighlight[];    // Text highlights
  matchType: 'semantic' | 'title' | 'keyword'; // Match type
}
```

**Example:**
```typescript
const searchService = new SearchService(config);
await searchService.loadContent(scenarios, embeddings);

const response = await searchService.search({
  query: 'employer not paying salary',
  filters: {
    categories: ['employment'],
    severities: ['high', 'critical']
  },
  limit: 10
});

console.log(`Found ${response.totalMatches} results in ${response.searchTime}ms`);
```

##### `getAutocomplete(query: string, limit?: number): Promise<AutocompleteSuggestion[]>`

Provides autocomplete suggestions for search queries.

**Parameters:**
- `query`: Partial search query
- `limit`: Maximum suggestions (default: 5)

**Response:**
```typescript
interface AutocompleteSuggestion {
  text: string;                     // Suggestion text
  type: 'scenario_title' | 'category' | 'keyword'; // Suggestion type
  score: number;                    // Relevance score
  matchCount: number;               // Number of matching results
  category?: string;                // Associated category
}
```

##### `getScenariosByCategory(categoryId: string): Promise<LegalScenario[]>`

Retrieves all scenarios for a specific category.

**Parameters:**
- `categoryId`: Category identifier ('employment', 'housing', etc.)

**Response:**
- Array of `LegalScenario` objects

### ContentService

The `ContentService` manages legal content loading, validation, and caching.

#### Configuration

```typescript
interface ContentConfig {
  dataDirectory: string;            // Base data directory path
  enableCaching: boolean;           // Enable content caching
  cacheTimeout: number;             // Cache timeout (ms)
  enableValidation: boolean;        // Enable content validation
  batchSize: number;                // Batch processing size
}
```

#### Methods

##### `loadScenario(scenarioId: string): Promise<LegalScenario>`

Loads a specific legal scenario by ID.

##### `loadAllScenarios(): Promise<LegalScenario[]>`

Loads all available legal scenarios.

##### `getCategories(): Promise<Category[]>`

Retrieves all available categories.

##### `validateContent(scenario: LegalScenario): Promise<ValidationResult>`

Validates scenario content structure and sources.

### SourceValidator

The `SourceValidator` service validates legal source URLs and content.

#### Methods

##### `validateUrls(urls: string[]): Promise<UrlValidationResult[]>`

Validates an array of URLs for accessibility and authenticity.

**Response:**
```typescript
interface UrlValidationResult {
  url: string;                      // Original URL
  isValid: boolean;                 // Validation status
  statusCode: number;               // HTTP status code
  responseTime: number;             // Response time (ms)
  checkedAt: string;                // Validation timestamp
}
```

## Data Models

### LegalScenario

```typescript
interface LegalScenario {
  id: string;                       // Unique identifier
  title: string;                    // Scenario title
  description: string;              // Detailed description
  category: string;                 // Category ID
  rights: LegalRight[];             // Legal rights array
  actionSteps: ActionStep[];        // Recommended actions
  sources: LegalSource[];           // Legal sources
  keywords: string[];               // Associated keywords
  variations: string[];             // Query variations
  lastUpdated: string;              // Last update date
  validationStatus: ValidationStatus; // Content validation status
  severity: 'low' | 'medium' | 'high' | 'critical'; // Urgency level
}
```

### LegalRight

```typescript
interface LegalRight {
  id: string;                       // Right identifier
  title: string;                    // Right title
  description: string;              // Detailed description
  legalBasis: string;               // Legal foundation
  applicability: string;            // When it applies
  limitations?: string;             // Limitations or exceptions
}
```

### ActionStep

```typescript
interface ActionStep {
  id: string;                       // Step identifier
  title: string;                    // Step title
  description: string;              // Detailed description
  order: number;                    // Execution order
  timeframe: string;                // Expected timeframe
  difficulty: 'easy' | 'medium' | 'hard'; // Complexity level
  cost: 'free' | 'low' | 'medium' | 'high'; // Associated costs
  requirements: string[];           // Prerequisites
}
```

### LegalSource

```typescript
interface LegalSource {
  id: string;                       // Source identifier
  title: string;                    // Source title
  url: string;                      // Source URL
  type: 'act' | 'rule' | 'regulation' | 'case_law' | 'government'; // Source type
  jurisdiction: string;             // Applicable jurisdiction
  lastVerified: string;             // Last verification date
  isPrimary: boolean;               // Primary vs secondary source
}
```

## Error Handling

All API methods implement comprehensive error handling:

```typescript
try {
  const response = await searchService.search(request);
  // Handle successful response
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
  } else if (error instanceof NetworkError) {
    // Handle network errors  
  } else {
    // Handle unexpected errors
  }
}
```

## Performance Considerations

### Caching Strategy
- **Service Level**: Results cached for 5 minutes
- **Content Level**: Scenarios cached for 1 hour
- **Embedding Level**: Vectors cached until content update

### Search Optimization
- **Semantic Search**: Uses pre-computed embeddings
- **Filtering**: Applied before similarity computation  
- **Pagination**: Implemented for large result sets
- **Debouncing**: Query debouncing for autocomplete

### Response Times
- **Search**: < 200ms for cached queries
- **Autocomplete**: < 100ms
- **Content Loading**: < 50ms for cached content

## Rate Limiting

Currently no rate limiting is implemented, but recommended limits:
- **Search**: 60 requests/minute
- **Autocomplete**: 120 requests/minute  
- **Content**: 300 requests/minute

## Testing

All services include comprehensive test coverage:
- **Contract Tests**: Validate API contracts
- **Integration Tests**: Test service interactions
- **Performance Tests**: Measure response times
- **Error Tests**: Validate error handling

Example test:
```typescript
describe('SearchService Contract', () => {
  test('should perform semantic search', async () => {
    const response = await searchService.search({
      query: 'employer not paying wages'
    });
    
    expect(response.results.length).toBeGreaterThan(0);
    expect(response.results[0]?.score).toBeGreaterThan(0.3);
    expect(response.searchTime).toBeLessThan(200);
  });
});
```