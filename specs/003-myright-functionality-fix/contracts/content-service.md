# ContentService Contract

**Service**: ContentService  
**Purpose**: Legal scenario content loading and management  
**Date**: 2025-09-27

## Interface Contract

### getScenario(id: string): Promise<LegalScenario>

**Purpose**: Load complete legal scenario with all rights and action steps

**Input Contract**:
```typescript
// id: string - Scenario identifier (kebab-case format)
// Examples: "salary-unpaid-employment", "defective-product-consumer"
```

**Output Contract**:
```typescript
interface LegalScenario {
  id: string;                    // Matches input id
  title: string;                 // User-facing scenario title  
  description: string;           // Plain language summary
  category: CategoryType;        // Legal domain classification
  
  rights: LegalRight[];          // Individual legal rights (1-10 per scenario)
  actionSteps: ActionStep[];     // Step-by-step guidance (3-15 steps)
  relatedScenarios: string[];    // IDs of related scenarios (2-5)
  
  searchTerms: string[];         // Natural language variations (5-20)
  lastUpdated: Date;             // Content revision tracking
  sources: LegalSource[];        // Government source verification (1-5)
}
```

**Behavior Contract**:
- Returns complete scenario data including all nested objects
- All government source URLs must be verified as working
- Action steps ordered by logical execution sequence  
- Related scenarios filtered to same or adjacent categories
- Content must be legally accurate with plain language explanations

**Error Contract**:
```typescript
// Scenario not found
throw new Error("Legal scenario 'invalid-id' not found")

// Data corruption
throw new Error("Scenario data validation failed for 'scenario-id'")

// Source validation failure  
throw new Error("Government sources unavailable for 'scenario-id'")
```

### getByCategory(category: CategoryType): Promise<LegalScenario[]>

**Purpose**: Load all scenarios for specific legal category with filtering

**Input Contract**:
```typescript
type CategoryType = 'employment' | 'consumer' | 'housing' | 'police' | 'family' | 'digital';
```

**Output Contract**:
```typescript
// Array of LegalScenario objects filtered by category
LegalScenario[] // Ordered by relevance/popularity
```

**Behavior Contract**:
- Returns scenarios ordered by search popularity and legal importance
- Only includes active scenarios (isActive: true)
- Includes scenario summaries optimized for category browsing
- Maximum 20 scenarios per category to avoid overwhelming users
- Results cached for 1 hour per category

### getAllScenarios(): Promise<LegalScenario[]>

**Purpose**: Load complete scenario index for search processing and navigation

**Output Contract**:
```typescript
// Complete array of all active legal scenarios
LegalScenario[] // All categories included
```

**Behavior Contract**:
- Returns all scenarios across all categories
- Used primarily for search index generation and admin functions
- Includes full scenario data including embeddings metadata
- Results cached for 2 hours due to comprehensive data load

### validateSources(): Promise<SourceValidationReport>

**Purpose**: Verify all government source links are accessible and current

**Output Contract**:
```typescript
interface SourceValidationReport {
  totalSources: number;          // Total government URLs checked
  validSources: number;          // Currently accessible URLs  
  invalidSources: InvalidSource[]; // Failed validation details
  lastValidated: Date;           // Validation run timestamp
  nextValidation: Date;          // Scheduled next check
}

interface InvalidSource {
  scenarioId: string;            // Scenario containing invalid source
  sourceUrl: string;             // Failed government URL
  error: string;                 // HTTP error or timeout details
  lastWorking: Date;             // When this URL last worked
  backupUrl?: string;            // Alternative source if available
}
```

**Behavior Contract**:
- Checks all government source URLs via HTTP HEAD requests
- Updates scenario metadata with validation timestamps
- Generates alerts for critical source failures
- Runs automatically weekly, can be triggered manually
- Respects government site rate limits (max 1 req/second)

### getCategoryMetadata(): Promise<Category[]>

**Purpose**: Load category definitions for navigation and filtering

**Output Contract**:
```typescript
interface Category {
  id: string;                    // Category identifier
  name: string;                  // Display name
  description: string;           // Category explanation
  icon: string;                  // UI icon identifier
  color: string;                 // Theme color
  scenarioCount: number;         // Current scenario count
  keywords: string[];            // Search term associations
  sortOrder: number;             // Navigation display order
  isActive: boolean;             // Visibility flag
}
```

**Behavior Contract**:
- Returns categories ordered by sortOrder field
- Only includes active categories (isActive: true)
- Scenario counts updated in real-time based on current content
- Used for category navigation and search filtering UI

## Integration Points

### Component Integration
```typescript
// ScenarioDetail component usage
const contentService = new ContentService();

const loadScenario = async (scenarioId: string) => {
  setIsLoading(true);
  try {
    const scenario = await contentService.getScenario(scenarioId);
    setScenario(scenario);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

// CategoryNavigation component usage  
const loadCategoryScenarios = async (category: CategoryType) => {
  const scenarios = await contentService.getByCategory(category);
  setFilteredScenarios(scenarios);
};
```

### Caching Strategy
- Individual scenarios cached for 4 hours (content stability)
- Category results cached for 1 hour (moderate update frequency)
- All scenarios cached for 2 hours (search index stability)
- Source validation results cached for 24 hours
- Cache invalidated immediately when content updates deployed

## Testing Requirements

### Contract Tests
```typescript
describe('ContentService Contract', () => {
  test('getScenario returns complete scenario data', async () => {
    const scenario = await contentService.getScenario('salary-unpaid-employment');
    expect(scenario.id).toBe('salary-unpaid-employment');
    expect(scenario.rights.length).toBeGreaterThan(0);
    expect(scenario.actionSteps.length).toBeGreaterThan(0);
    expect(scenario.sources.length).toBeGreaterThan(0);
  });

  test('getByCategory filters scenarios correctly', async () => {
    const scenarios = await contentService.getByCategory('employment');
    scenarios.forEach(scenario => {
      expect(scenario.category).toBe('employment');
    });
  });

  test('validateSources checks government URLs', async () => {
    const report = await contentService.validateSources();
    expect(report.totalSources).toBeGreaterThan(0);
    expect(report.validSources).toBeLessThanOrEqual(report.totalSources);
  });

  test('handles invalid scenario ID gracefully', async () => {
    await expect(contentService.getScenario('nonexistent-scenario'))
      .rejects.toThrow('Legal scenario \'nonexistent-scenario\' not found');
  });
});
```

### Data Validation Tests
- JSON schema validation for all scenario files
- Government source URL accessibility verification
- Legal content accuracy spot checks
- Performance benchmarks for large dataset operations

## Implementation Notes

### Content Loading Strategy
1. Load scenarios from static JSON files at build time
2. Validate data structure against TypeScript interfaces
3. Pre-process search terms and related scenario mappings
4. Generate content metadata for optimization

### Source Validation Algorithm
1. Extract all government URLs from scenario sources
2. Perform HTTP HEAD requests with proper User-Agent
3. Record response codes and timing information  
4. Update scenario metadata with validation results
5. Generate notifications for critical failures

### Error Handling
- Graceful fallback when individual scenarios fail to load
- Clear error messages distinguishing content vs system failures
- Retry logic for transient network failures during source validation
- Backup source URLs when primary government links fail

### Performance Optimization
- Lazy loading for scenario detail pages
- Preloading for popular scenarios based on analytics
- Compression for large legal documents
- CDN caching for static content files

## Data Dependencies

### Required Content Files
```
src/data/scenarios/employment/
├── salary-unpaid.json              # Unpaid salary rights and procedures
├── wrongful-termination.json       # Termination without cause/notice  
└── workplace-harassment.json       # Sexual/workplace harassment rights

src/data/scenarios/consumer/
├── defective-product.json          # Product defect and refund rights
└── online-shopping-fraud.json      # E-commerce fraud protection

src/data/scenarios/housing/
├── security-deposit.json           # Deposit return and disputes
└── eviction-protection.json        # Tenant rights during eviction

// Additional categories with 1-2 scenarios each
```

### Government Source Requirements
- All URLs must be official government domains (.gov.in, .nic.in)
- Direct links to specific legal documents (PDFs preferred)
- Backup citations to gazette notifications for recent laws
- Contact information for relevant government offices/helplines

This contract ensures reliable content delivery for the legal rights platform while maintaining government source credibility and user accessibility.