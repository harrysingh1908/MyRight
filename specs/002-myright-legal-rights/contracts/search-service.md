# Search API Contract

**Component**: Semantic Search Service  
**Type**: Client-side TypeScript Module  
**Purpose**: Process user queries and return ranked legal scenarios

## Interface Definition

```typescript
interface SearchService {
  /**
   * Initialize search service with embeddings and content data
   * Called once during app startup
   */
  initialize(config: SearchConfig): Promise<void>;
  
  /**
   * Process search query and return ranked results
   * Primary search method
   */
  search(query: string, options?: SearchOptions): Promise<SearchResponse>;
  
  /**
   * Get search suggestions for auto-complete
   */
  getSuggestions(partialQuery: string): Promise<string[]>;
  
  /**
   * Get scenarios by category for browsing
   */
  getScenariosByCategory(category: CategoryType): Promise<LegalScenario[]>;
}
```

## Input/Output Contracts

### SearchConfig
```typescript
interface SearchConfig {
  embeddingsUrl: string;         // URL to embeddings JSON file
  scenariosUrl: string;          // URL to scenarios data
  minConfidence: number;         // Minimum confidence threshold (default: 0.7)
  maxResults: number;            // Maximum results to return (default: 10)
  enableFallback: boolean;       // Use keyword search if semantic fails
}
```

### SearchOptions
```typescript
interface SearchOptions {
  category?: CategoryType;       // Filter by specific category
  limit?: number;                // Override max results
  includeRelated?: boolean;      // Include related scenarios in results
  confidenceThreshold?: number;  // Override minimum confidence
}
```

### SearchResponse
```typescript
interface SearchResponse {
  query: string;                 // Original search query
  results: SearchResult[];       // Ranked results array
  confidence: number;            // Best match confidence score
  responseTime: number;          // Processing time in milliseconds
  searchType: 'semantic' | 'keyword' | 'category' | 'fallback';
  suggestions?: string[];        // Alternative query suggestions
  totalMatches: number;          // Total scenarios considered
}

interface SearchResult {
  scenario: LegalScenario;       // Complete scenario data
  confidence: number;            // Match confidence (0-1)
  matchReason: string;           // Why this scenario matched
  highlights?: string[];         // Matching text snippets
  rank: number;                  // Position in results (1-based)
}
```

## Method Specifications

### initialize(config: SearchConfig)
**Purpose**: Load and prepare search data for client-side processing  
**Performance**: Must complete within 2 seconds on 3G connection  
**Error Handling**: Throw SearchInitializationError if data loading fails

```typescript
// Success case
await searchService.initialize({
  embeddingsUrl: '/data/embeddings.json',
  scenariosUrl: '/data/scenarios.json',
  minConfidence: 0.7,
  maxResults: 10,
  enableFallback: true
});

// Error case
throw new SearchInitializationError('Failed to load embeddings data');
```

### search(query: string, options?: SearchOptions)
**Purpose**: Main search functionality with semantic matching  
**Performance**: Must return results within 200ms after initialization  
**Validation**: Query must be 1-100 characters, non-empty after trimming

```typescript
// High confidence match
const response = await searchService.search("boss not paying salary");
// Returns: { 
//   results: [{ scenario: salaryScenario, confidence: 0.95, rank: 1 }],
//   confidence: 0.95,
//   searchType: 'semantic'
// }

// Low confidence / no match
const response = await searchService.search("random unrelated query");
// Returns: {
//   results: [],
//   confidence: 0.2,
//   searchType: 'fallback',
//   suggestions: ["Did you mean legal rights?", "Browse categories instead"]
// }
```

### getSuggestions(partialQuery: string)
**Purpose**: Provide auto-complete suggestions for search input  
**Performance**: Must return within 50ms for responsive typing  
**Behavior**: Return top 5 most likely completions

```typescript
const suggestions = await searchService.getSuggestions("boss not");
// Returns: ["boss not paying salary", "boss not giving salary", "boss not paying on time"]
```

### getScenariosByCategory(category: CategoryType)
**Purpose**: Support category-based browsing navigation  
**Performance**: Return within 100ms (data should be pre-loaded)  
**Sorting**: Return scenarios ordered by priority, then alphabetically

```typescript
const scenarios = await searchService.getScenariosByCategory('employment');
// Returns: [salaryScenario, harassmentScenario, terminationScenario] ordered by priority
```

## Error Handling

### Error Types
```typescript
class SearchError extends Error {
  code: string;
  details?: any;
}

class SearchInitializationError extends SearchError {
  code = 'SEARCH_INIT_FAILED';
}

class SearchQueryError extends SearchError {
  code = 'INVALID_QUERY';
}

class SearchTimeoutError extends SearchError {
  code = 'SEARCH_TIMEOUT';
}
```

### Error Scenarios
```typescript
// Invalid query
if (query.trim().length === 0) {
  throw new SearchQueryError('Query cannot be empty');
}

// Timeout handling
if (processingTime > 500) {
  throw new SearchTimeoutError('Search took too long, please try again');
}

// Initialization failure
if (!embeddingsLoaded) {
  throw new SearchInitializationError('Search service not properly initialized');
}
```

## Performance Contracts

### Response Time Requirements
- **Initialization**: <2 seconds on 3G connection
- **Search**: <200ms after initialization
- **Suggestions**: <50ms for responsive auto-complete
- **Category Browse**: <100ms (pre-loaded data)

### Memory Usage
- **Total Bundle**: <500KB including all search data
- **Runtime Memory**: <50MB peak usage during search
- **Embedding Cache**: <10MB persistent cache

### Accuracy Requirements
- **Semantic Match**: 80%+ accuracy for relevant scenarios in top 3 results
- **Confidence Threshold**: 0.7 minimum for displaying results
- **Fallback Success**: 60%+ accuracy when semantic search fails

## Testing Contracts

### Unit Tests Required
```typescript
describe('SearchService', () => {
  test('should initialize with valid config', async () => {
    await expect(searchService.initialize(validConfig)).resolves.toBeUndefined();
  });
  
  test('should return high-confidence results for known queries', async () => {
    const result = await searchService.search('salary not paid');
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.results[0].scenario.id).toBe('salary-unpaid');
  });
  
  test('should handle empty queries gracefully', async () => {
    await expect(searchService.search('')).rejects.toThrow(SearchQueryError);
  });
  
  test('should provide fallback for low-confidence matches', async () => {
    const result = await searchService.search('random gibberish');
    expect(result.searchType).toBe('fallback');
    expect(result.suggestions.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests Required
- Search accuracy across all 10 MVP scenarios
- Performance testing with realistic query volumes
- Error handling under various failure conditions
- Cross-browser compatibility testing

## Usage Examples

### Basic Search Flow
```typescript
// Initialize once during app startup
await searchService.initialize({
  embeddingsUrl: '/api/embeddings',
  scenariosUrl: '/api/scenarios',
  minConfidence: 0.7,
  maxResults: 5
});

// Handle user search
const userQuery = "company didn't pay me";
const results = await searchService.search(userQuery);

if (results.confidence > 0.7) {
  // Display relevant scenarios
  displaySearchResults(results.results);
} else {
  // Show "no results" with suggestions
  showNoResults(results.suggestions);
}
```

### Category Browsing Flow
```typescript
// Get employment scenarios for category page
const employmentScenarios = await searchService.getScenariosByCategory('employment');
displayCategoryResults('employment', employmentScenarios);
```

### Auto-complete Flow
```typescript
// Real-time suggestions as user types
const handleInputChange = async (input: string) => {
  if (input.length > 2) {
    const suggestions = await searchService.getSuggestions(input);
    showAutoComplete(suggestions);
  }
};
```

This contract ensures the search functionality meets constitutional requirements for accessibility, accuracy, and performance while providing a clean interface for the frontend to consume.