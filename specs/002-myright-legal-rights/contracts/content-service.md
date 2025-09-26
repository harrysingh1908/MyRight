# Content Management Contract

**Component**: Content Service  
**Type**: Static Data Management + Build Process  
**Purpose**: Manage legal scenarios, sources, and embeddings generation

## Interface Definition

```typescript
interface ContentService {
  /**
   * Load scenario by ID with all related data
   */
  getScenario(id: string): Promise<LegalScenario>;
  
  /**
   * Load all scenarios for a category
   */
  getScenariosByCategory(category: CategoryType): Promise<LegalScenario[]>;
  
  /**
   * Get all categories with metadata
   */
  getCategories(): Promise<Category[]>;
  
  /**
   * Validate source URLs and update status
   */
  validateSources(): Promise<SourceValidationReport>;
  
  /**
   * Generate embeddings for new content
   */
  generateEmbeddings(scenarios: LegalScenario[]): Promise<EmbeddingData>;
}
```

## Data Management Contracts

### Content Loading
```typescript
interface ContentLoader {
  /**
   * Load and validate scenario content from JSON files
   * Must handle missing files gracefully
   */
  loadScenarios(): Promise<LegalScenario[]>;
  
  /**
   * Load category definitions
   */
  loadCategories(): Promise<Category[]>;
  
  /**
   * Load pre-computed embeddings
   */
  loadEmbeddings(): Promise<EmbeddingData>;
}
```

### Content Validation
```typescript
interface ContentValidator {
  /**
   * Validate scenario structure and required fields
   */
  validateScenario(scenario: LegalScenario): ValidationResult;
  
  /**
   * Check all government sources for availability
   */
  validateSources(sources: OfficialSource[]): Promise<SourceValidationReport>;
  
  /**
   * Verify legal citations format and accuracy
   */
  validateCitations(rights: LegalRight[]): ValidationResult;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}
```

## Build Process Contracts

### Embedding Generation
**Purpose**: Generate semantic vectors for all scenarios and variations  
**Tool**: Python script using sentence-transformers  
**Output**: Optimized JSON file for client-side loading

```python
# Build script interface
def generate_embeddings(scenarios_dir: str, output_path: str) -> EmbeddingResult:
    """
    Generate embeddings for all scenarios and variations
    
    Args:
        scenarios_dir: Path to scenario JSON files
        output_path: Where to save embeddings.json
        
    Returns:
        EmbeddingResult with success status and metadata
    """
    pass

class EmbeddingResult:
    success: bool
    embeddings_count: int
    file_size_kb: int
    processing_time_seconds: float
    errors: List[str]
```

### Content Processing Pipeline
```typescript
interface BuildPipeline {
  /**
   * Complete build process for production deployment
   */
  build(): Promise<BuildResult>;
  
  /**
   * Validate all content before build
   */
  preValidate(): Promise<ValidationSummary>;
  
  /**
   * Generate optimized production assets
   */
  generateAssets(): Promise<AssetManifest>;
  
  /**
   * Run post-build verification
   */
  postValidate(): Promise<ValidationSummary>;
}

interface BuildResult {
  success: boolean;
  duration: number;
  assetsGenerated: string[];
  errors: BuildError[];
  warnings: BuildWarning[];
  performance: {
    totalBundleSize: number;
    embeddingsSize: number;
    contentSize: number;
  };
}
```

## Source Management Contracts

### Source Validation Service
```typescript
interface SourceValidator {
  /**
   * Check if URL returns 200 status
   */
  checkUrl(url: string): Promise<UrlStatus>;
  
  /**
   * Validate government domain (.gov.in, court sites)
   */
  validateDomain(url: string): boolean;
  
  /**
   * Extract metadata from government document
   */
  extractMetadata(url: string): Promise<SourceMetadata>;
}

interface UrlStatus {
  url: string;
  status: 'active' | 'broken' | 'moved' | 'timeout';
  statusCode?: number;
  redirectUrl?: string;
  responseTime: number;
  lastChecked: string;
}

interface SourceMetadata {
  title: string;
  organization: string;
  documentType: 'act' | 'judgment' | 'guideline' | 'notification';
  publishDate?: string;
  relevantSections?: string[];
}
```

### Automated Monitoring
```typescript
interface SourceMonitor {
  /**
   * Daily check of all source URLs
   * Runs as scheduled job
   */
  dailySourceCheck(): Promise<MonitoringReport>;
  
  /**
   * Alert system for broken sources
   */
  sendAlerts(brokenSources: OfficialSource[]): Promise<void>;
  
  /**
   * Generate weekly source health report
   */
  generateHealthReport(): Promise<SourceHealthReport>;
}

interface MonitoringReport {
  totalSources: number;
  activeSources: number;
  brokenSources: number;
  newIssues: OfficialSource[];
  resolvedIssues: OfficialSource[];
  timestamp: string;
}
```

## Content Structure Contracts

### Scenario Content Requirements
Every legal scenario MUST include:

```typescript
interface ScenarioContentRequirements {
  // Required fields (build fails if missing)
  id: string;                    // Must be unique, kebab-case
  title: string;                 // 3-50 characters
  description: string;           // 50-200 characters, plain language
  category: CategoryType;        // Must match valid categories
  rights: LegalRight[];          // Minimum 3, maximum 7 rights
  actionSteps: ActionStep[];     // Minimum 3 actionable steps
  variations: string[];          // Minimum 8 natural language variations
  
  // Validation rules
  sourceVerification: {
    allRightsHaveSources: boolean;     // Every right needs government source
    sourcesAreGovernment: boolean;     // Only .gov.in or court sites
    citationsAreStandardized: boolean; // Follow citation format
  };
  
  // Content quality
  readabilityScore: number;      // Must be 60+ (accessible language)
  legalAccuracy: boolean;        // Verified by legal professional
  lastReviewed: string;          // Must be within 6 months
}
```

### Citation Format Contract
**Standard Format**: "According to [Act Name Year, Section X], [plain language right description]."

```typescript
interface CitationFormat {
  actName: string;               // e.g., "Labor Code"
  year: number;                  // e.g., 2020
  section: string;               // e.g., "Section 18" or "Chapter 3, Section 45"
  plainLanguageRight: string;    // Non-technical explanation
  sourceUrl: string;             // Direct link to government document
  
  // Generated citation example:
  // "According to Labor Code 2020, Section 18, you have the right to receive salary within 7 days of the due date."
}
```

## Performance Contracts

### Data Size Limits
```typescript
interface PerformanceLimits {
  maxScenarios: 50;              // Total scenario limit for performance
  maxEmbeddingSize: 300;         // KB limit for embeddings file
  maxContentSize: 200;           // KB limit for all scenario data
  maxSourcesPerRight: 3;         // Sources per legal right
  maxVariationsPerScenario: 15;  // Search variations limit
  
  // Load time requirements
  maxInitializationTime: 2000;   // ms on 3G connection
  maxSearchResponseTime: 200;    // ms after initialization
}
```

### Content Optimization
```typescript
interface ContentOptimizer {
  /**
   * Compress scenario data for production
   */
  compressContent(scenarios: LegalScenario[]): CompressedContent;
  
  /**
   * Optimize embedding vectors for size
   */
  optimizeEmbeddings(embeddings: number[][]): OptimizedEmbeddings;
  
  /**
   * Generate efficient search index
   */
  buildSearchIndex(scenarios: LegalScenario[]): SearchIndex;
}
```

## Testing Contracts

### Content Testing Requirements
```typescript
describe('Content Service', () => {
  test('all scenarios must have government sources', () => {
    scenarios.forEach(scenario => {
      scenario.rights.forEach(right => {
        expect(right.sources.length).toBeGreaterThan(0);
        right.sources.forEach(source => {
          expect(source.url).toMatch(/\.gov\.in|court\.gov|supremecourt/);
        });
      });
    });
  });
  
  test('all source URLs must be accessible', async () => {
    const sourceCheck = await contentService.validateSources();
    expect(sourceCheck.brokenSources.length).toBe(0);
  });
  
  test('embeddings must be generated for all scenarios', () => {
    const embeddings = await contentService.loadEmbeddings();
    expect(embeddings.scenarioEmbeddings.length).toBe(scenarios.length);
  });
});
```

### Source Validation Testing
```typescript
describe('Source Validation', () => {
  test('should detect broken government links', async () => {
    const brokenUrl = 'https://legislative.gov.in/nonexistent';
    const status = await sourceValidator.checkUrl(brokenUrl);
    expect(status.status).toBe('broken');
  });
  
  test('should validate government domains only', () => {
    expect(sourceValidator.validateDomain('https://legislative.gov.in')).toBe(true);
    expect(sourceValidator.validateDomain('https://example.com')).toBe(false);
  });
});
```

## Usage Examples

### Content Loading
```typescript
// Load specific scenario with all data
const scenario = await contentService.getScenario('salary-unpaid');
console.log(scenario.rights.length); // Shows number of rights
console.log(scenario.actionSteps.length); // Shows action steps

// Load category for navigation
const employmentScenarios = await contentService.getScenariosByCategory('employment');
displayCategoryPage(employmentScenarios);
```

### Build Process
```bash
# Generate embeddings during build
npm run build:embeddings

# Validate content before deploy
npm run validate:content

# Full production build
npm run build:production
```

### Source Monitoring
```typescript
// Daily automated check
const report = await sourceMonitor.dailySourceCheck();
if (report.brokenSources > 0) {
  await sourceMonitor.sendAlerts(report.newIssues);
}

// Manual source validation
const validation = await contentService.validateSources();
console.log(`${validation.activeSources}/${validation.totalSources} sources active`);
```

This contract ensures content quality, source reliability, and performance standards while supporting the constitutional requirement for verified government sources and professional presentation quality.