# Data Model: MyRight Platform Functionality Implementation

**Date**: 2025-09-27  
**Feature**: MyRight Platform Functionality Implementation  
**Context**: Data structures for legal scenario content, search functionality, and user interactions

## Core Entities

### LegalScenario
**Purpose**: Primary content entity representing a specific legal situation with associated rights and actions

**Fields**:
```typescript
interface LegalScenario {
  // Identity
  id: string;                    // Unique identifier (kebab-case)
  title: string;                 // User-facing scenario title
  description: string;           // Plain language scenario summary
  category: CategoryType;        // Legal domain classification
  
  // Content  
  rights: LegalRight[];          // Individual legal rights in this scenario
  actionSteps: ActionStep[];     // Step-by-step user guidance
  relatedScenarios: string[];    // IDs of related scenarios
  
  // Search & Discovery
  searchTerms: string[];         // Natural language query variations
  tags: string[];                // Additional searchable keywords
  confidence?: number;           // Search result confidence (0-100)
  
  // Metadata
  lastUpdated: Date;             // Content revision tracking
  sources: LegalSource[];        // Government source verification
  isActive: boolean;             // Content publication status
}
```

**Validation Rules**:
- `id` must be unique across all scenarios, follow kebab-case pattern
- `title` must be under 100 characters, use plain language
- `description` must be under 300 characters, avoid legal jargon
- `rights` array must contain at least 1 legal right with government source
- `actionSteps` must provide specific, actionable instructions
- `searchTerms` must include common natural language variations

**State Transitions**:
- Draft → Review → Published → Archived
- Published scenarios can be updated but maintain version history

### LegalRight
**Purpose**: Individual legal right within a scenario, backed by government sources

**Fields**:
```typescript
interface LegalRight {
  // Identity
  id: string;                    // Unique within scenario
  title: string;                 // Right title in plain language
  description: string;           // Detailed explanation without jargon
  
  // Legal Basis
  legalBasis: LegalBasis;        // Official source and citation
  application: string;           // When/how this right applies
  limitations: string[];         // Important constraints or exceptions
  
  // User Guidance  
  actionSteps: ActionStep[];     // Specific steps to exercise this right
  timeframes: string[];          // Relevant deadlines or time limits
  requiredDocuments: string[];   // Documents needed to exercise right
  
  // Metadata
  severity: 'high' | 'medium' | 'low';  // Importance/urgency level
  isVerified: boolean;           // Government source validation status
}
```

**Validation Rules**:
- `legalBasis.url` must be valid government website (verified quarterly)
- `description` must be readable at 8th grade level
- `actionSteps` must be specific and actionable, not vague advice
- `limitations` must clearly explain when right doesn't apply

### LegalBasis  
**Purpose**: Government source citation with verification tracking

**Fields**:
```typescript
interface LegalBasis {
  // Citation
  law: string;                   // Act or regulation name
  section: string;               // Specific section or clause
  url: string;                   // Direct link to official source
  
  // Verification
  lastVerified: Date;            // Last source validation date
  isValid: boolean;              // Current link status
  backupUrl?: string;            // Alternative source if primary fails
  
  // Context
  jurisdiction: 'central' | 'state';  // Legal authority level
  effectiveDate: Date;           // When this law took effect
  amendments?: Amendment[];      // Recent changes to this law
}
```

**Validation Rules**:
- `url` must point to official government domain (.gov.in, .nic.in)
- `law` and `section` must match official legal document naming
- `lastVerified` must be within 90 days for active scenarios
- Links validated via automated quarterly checks

### ActionStep
**Purpose**: Specific, actionable instruction for users to exercise their rights

**Fields**:
```typescript
interface ActionStep {
  // Identity
  id: string;                    // Unique within parent entity
  stepNumber: number;            // Execution order
  title: string;                 // Brief step description
  
  // Instructions
  description: string;           // Detailed instructions
  requiredDocuments: string[];   // Documents needed for this step
  timeframe?: string;            // Deadline or expected duration  
  cost?: string;                 // Associated fees or costs
  
  // Guidance
  tips: string[];                // Helpful advice for this step
  commonMistakes: string[];      // What to avoid
  alternatives: string[];        // Other ways to complete this step
  
  // Resources
  officialForms?: string[];      // Government forms or applications
  contactInfo?: ContactInfo;     // Relevant office or helpline
  
  // Metadata  
  difficulty: 'easy' | 'medium' | 'hard';  // Complexity level
  isOptional: boolean;           // Required vs recommended step
}
```

**Validation Rules**:
- Steps must be ordered logically with clear dependencies
- `description` must be specific enough to follow without legal knowledge
- `timeframe` should include both deadlines and expected processing time
- All referenced forms and contacts must be current and verified

### SearchResult
**Purpose**: Search response with relevance scoring and result metadata

**Fields**:
```typescript
interface SearchResult {
  // Core Result
  scenario: LegalScenario;       // Full scenario data
  confidence: number;            // Relevance score (0-100)
  matchType: 'semantic' | 'keyword' | 'category';  // How match was found
  
  // Match Details  
  matchedTerms: string[];        // Which search terms matched
  highlightedText: string[];     // Text snippets with match highlights
  relevanceReason: string;       // Why this result is relevant
  
  // User Guidance
  quickActions: string[];        // Immediate steps user can take
  urgencyLevel: 'low' | 'medium' | 'high';  // How urgent this issue is
  
  // Metadata
  categoryMatch: boolean;        // Whether category also matches
  isExactMatch: boolean;         // High-confidence semantic match
  searchRank: number;            // Position in search results
}
```

**Validation Rules**:
- `confidence` must be 0-100, with >70 considered good match
- `matchType` determines result ordering (semantic > keyword > category)
- `highlightedText` limited to 3 most relevant snippets per result
- `urgencyLevel` based on legal timeframes and consequences

### SearchRequest
**Purpose**: User search input with filters and configuration

**Fields**:
```typescript
interface SearchRequest {
  // Query
  query: string;                 // User's search text
  filters: SearchFilters;        // Category and refinement filters
  
  // Configuration
  maxResults: number;            // Maximum results to return (default: 10)
  includeRelated: boolean;       // Include related scenarios (default: true)
  searchType: 'auto' | 'semantic' | 'keyword';  // Search algorithm preference
  
  // Context
  sessionId?: string;            // For search analytics
  userLocation?: string;         // For jurisdiction-specific results
  previousSearches?: string[];   // For improving relevance
}
```

### SearchFilters
**Purpose**: Refinement options for search results

**Fields**:
```typescript
interface SearchFilters {
  // Core Filters
  categories: CategoryType[];    // Legal domain filters
  urgencyLevel?: 'low' | 'medium' | 'high';  // Time sensitivity
  
  // Content Filters  
  hasGovernmentSource: boolean;  // Only verified government sources
  hasActionSteps: boolean;       // Only scenarios with clear guidance
  complexity?: 'simple' | 'complex';  // User's legal knowledge level
  
  // Metadata Filters
  recentlyUpdated?: boolean;     // Content freshness
  isPopular?: boolean;           // Commonly searched scenarios
}
```

### Category
**Purpose**: Legal domain classification for navigation and filtering

**Fields**:
```typescript
interface Category {
  // Identity
  id: string;                    // Unique category identifier
  name: string;                  // Display name
  slug: string;                  // URL-friendly identifier
  
  // Presentation
  description: string;           // Category explanation
  icon: string;                  // UI icon identifier
  color: string;                 // Theme color hex code
  
  // Content
  scenarioCount: number;         // Number of scenarios in category
  keywords: string[];            // Search terms that match this category
  
  // Navigation
  sortOrder: number;             // Display order
  isActive: boolean;             // Whether to show in navigation
  parentCategory?: string;       // For hierarchical categories
}
```

### EmbeddingVector
**Purpose**: Semantic search vector representation of content

**Fields**:
```typescript
interface EmbeddingVector {
  // Identity
  id: string;                    // Unique vector identifier  
  scenarioId: string;            // Associated legal scenario
  text: string;                  // Original text that was embedded
  
  // Vector Data
  vector: number[];              // High-dimensional embedding vector
  model: string;                 // Embedding model used (e.g., 'sentence-transformers')
  dimensions: number;            // Vector dimensionality
  
  // Metadata
  createdAt: Date;               // When embedding was generated
  type: 'title' | 'description' | 'searchTerm';  // What text was embedded
  language: 'en' | 'hi';         // Text language
}
```

**Validation Rules**:
- `vector` array length must match `dimensions` field
- All vectors in system must use same model and dimensions
- `text` must be the exact source text used for embedding generation
- Embeddings regenerated when source content changes

### ContactInfo
**Purpose**: Government office or helpline contact information

**Fields**:
```typescript
interface ContactInfo {
  // Basic Info
  name: string;                  // Office or department name
  type: 'office' | 'helpline' | 'court' | 'online';  // Contact type
  
  // Contact Details
  phone?: string;                // Phone number with country code
  email?: string;                // Official email address
  website?: string;              // Official website URL
  address?: string;              // Physical address
  
  // Availability
  hours: string;                 // Operating hours
  languages: string[];           // Supported languages
  
  // Verification
  lastVerified: Date;            // Contact info validation date
  isActive: boolean;             // Whether contact is currently functional
}
```

**Validation Rules**:
- All contact information verified quarterly
- Phone numbers must include proper formatting
- Email addresses must be official government domains
- Hours must specify timezone (IST)

## Entity Relationships

```
LegalScenario 1---* LegalRight
LegalScenario 1---* ActionStep  
LegalScenario *---* Category (via category field)
LegalScenario 1---* EmbeddingVector

LegalRight 1---1 LegalBasis
LegalRight 1---* ActionStep

ActionStep *---1 ContactInfo (optional)

SearchResult 1---1 LegalScenario
SearchRequest 1---1 SearchFilters

EmbeddingVector *---1 LegalScenario
```

## Data Storage Strategy

### File Structure
```
src/data/
├── scenarios/
│   ├── employment/
│   │   ├── salary-unpaid.json
│   │   ├── wrongful-termination.json
│   │   └── workplace-harassment.json
│   ├── consumer/
│   │   ├── defective-product.json
│   │   └── online-shopping-fraud.json
│   └── [other-categories]/
├── embeddings/
│   ├── scenario-embeddings.json     # Pre-computed vectors
│   └── search-term-embeddings.json  # Common query vectors
├── categories.json                  # Category definitions
└── metadata/
    ├── sources-validation.json      # Government source status
    └── content-updates.json         # Change tracking
```

### Validation Schema
- All JSON files validated against TypeScript interfaces at build time
- Government source URLs validated via automated testing
- Content freshness monitored through `lastUpdated` fields
- Search term effectiveness tracked through usage analytics

## Performance Considerations

### Caching Strategy
- Legal scenarios cached in browser storage for offline access
- Embedding vectors loaded lazily for search functionality  
- Search results cached for common queries
- Government source validation cached for 30 days

### Search Optimization
- Pre-computed embeddings for all scenario variations
- Similarity search using optimized cosine similarity algorithm
- Result ranking combines semantic score with popularity metrics
- Fallback to keyword search for low-confidence semantic matches

### Data Size Management
- Scenario content optimized for mobile loading
- Embedding vectors compressed using quantization techniques
- Images and media served via CDN when added
- Progressive loading for non-critical content sections

This data model provides the foundation for implementing comprehensive legal scenario search and discovery while maintaining performance, accuracy, and constitutional compliance requirements.