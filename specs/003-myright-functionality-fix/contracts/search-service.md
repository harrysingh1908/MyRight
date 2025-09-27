# SearchService Contract

**Service**: SearchService  
**Purpose**: Core search functionality for legal scenarios  
**Date**: 2025-09-27

## Interface Contract

### search(request: SearchRequest): Promise<SearchResponse>

**Purpose**: Execute semantic or keyword search for legal scenarios

**Input Contract**:
```typescript
interface SearchRequest {
  query: string;                 // Required: User search text, 1-200 chars
  filters?: SearchFilters;       // Optional: Category and refinement filters
  maxResults?: number;           // Optional: Max results (1-50, default: 10)
  searchType?: 'auto' | 'semantic' | 'keyword';  // Algorithm preference
}

interface SearchFilters {
  categories?: CategoryType[];   // Filter by legal domains
  urgencyLevel?: 'low' | 'medium' | 'high';
  hasGovernmentSource?: boolean; // Only verified sources
}
```

**Output Contract**:
```typescript
interface SearchResponse {
  query: string;                 // Echo of search query
  results: SearchResult[];       // Ranked search results  
  totalCount: number;            // Total available matches
  searchTime: number;            // Response time in milliseconds
  algorithm: 'semantic' | 'keyword';  // Algorithm used
  suggestions?: string[];        // Alternative query suggestions
}

interface SearchResult {
  scenario: LegalScenario;       // Complete scenario data
  confidence: number;            // Relevance score (0-100)
  matchType: 'semantic' | 'keyword' | 'category';
  highlightedText: string[];     // Matching text snippets
  urgencyLevel: 'low' | 'medium' | 'high';
}
```

**Behavior Contract**:
- Returns results ordered by confidence score (highest first)
- Empty query returns error with helpful message
- No matches returns empty results with suggestions
- Semantic search used for queries >70% confidence, otherwise keyword
- Response time must be <2000ms for standard queries
- Handles special characters and Hindi transliteration

**Error Contract**:
```typescript
// Invalid query
throw new Error("Search query must be 1-200 characters")

// No results
return { results: [], suggestions: ["employment rights", "salary issues"] }

// System error  
throw new Error("Search service temporarily unavailable")
```

### autocomplete(partial: string): Promise<AutocompleteResponse>

**Purpose**: Provide real-time search suggestions as user types

**Input Contract**:
```typescript
// partial: string - Partial query text, 1-50 chars
```

**Output Contract**:
```typescript
interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];  // Ordered by relevance
  hasMore: boolean;                       // More suggestions available
}

interface AutocompleteSuggestion {
  text: string;           // Suggested completion
  category?: string;      // Associated legal category
  resultCount: number;    // Expected results for this suggestion
  type: 'scenario' | 'category' | 'popular';  // Suggestion source
}
```

**Behavior Contract**:
- Minimum 2 characters required for suggestions
- Returns max 8 suggestions ordered by popularity/relevance
- Includes mix of scenario titles and popular searches
- Response time must be <500ms
- Debounced to avoid excessive calls

### getSuggestions(): Promise<QuerySuggestion[]>

**Purpose**: Get popular searches and category guidance for empty search state

**Output Contract**:
```typescript
interface QuerySuggestion {
  text: string;           // Suggested search query
  category: string;       // Legal category
  description: string;    // What user will find
  popularity: number;     // Usage frequency (1-100)
}
```

**Behavior Contract**:
- Returns 12 suggestions covering all categories
- Ordered by popularity and category balance
- Updated weekly based on search analytics
- Static fallback if analytics unavailable

## Integration Points

### Component Integration
```typescript
// SearchInterface component usage
const searchService = new SearchService();

const handleSearch = async (query: string, filters: SearchFilters) => {
  setIsSearching(true);
  try {
    const response = await searchService.search({ query, filters });
    setSearchResponse(response);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsSearching(false);
  }
};
```

### Caching Strategy
- Search results cached for 5 minutes per unique query
- Autocomplete results cached for 1 hour
- Popular suggestions cached for 24 hours
- Cache invalidated when content updates

## Testing Requirements

### Contract Tests
```typescript
describe('SearchService Contract', () => {
  test('search returns results for valid query', async () => {
    const response = await searchService.search({ query: 'salary not paid' });
    expect(response.results).toBeDefined();
    expect(response.results[0].confidence).toBeGreaterThan(0);
    expect(response.searchTime).toBeLessThan(2000);
  });

  test('autocomplete provides suggestions for partial input', async () => {
    const response = await searchService.autocomplete('sal');
    expect(response.suggestions.length).toBeGreaterThan(0);
    expect(response.suggestions[0].text).toContain('sal');
  });

  test('handles empty query gracefully', async () => {
    await expect(searchService.search({ query: '' }))
      .rejects.toThrow('Search query must be 1-200 characters');
  });
});
```

### Performance Tests
- Load test with 100 concurrent searches
- Verify <2s response time for 95% of queries  
- Memory usage monitoring for embedding operations
- Stress test autocomplete with rapid-fire requests

## Implementation Notes

### Semantic Search Algorithm
1. Convert user query to embedding vector using sentence-transformers
2. Calculate cosine similarity with all scenario embeddings  
3. Return results above similarity threshold (>0.7)
4. Fall back to keyword search if no high-confidence matches

### Keyword Search Fallback
1. Tokenize query and scenario content
2. Calculate TF-IDF or simple term matching scores
3. Boost matches in title/description vs general content
4. Apply category filters and ranking

### Error Handling
- Graceful degradation when embedding service fails
- Clear error messages for malformed queries
- Fallback suggestions when no results found
- Retry logic for transient failures