# Data Model: MyRight Legal Rights Platform

**Date**: 2025-09-26  
**Phase**: 1 - Design  
**Status**: Completed

## Core Entities

### Legal Scenario
**Purpose**: Represents a specific legal situation that users commonly face
**Storage**: JSON file with embedded vectors for semantic search

```typescript
interface LegalScenario {
  id: string;                    // Unique identifier (e.g., "salary-unpaid")
  title: string;                 // Display title
  description: string;           // Plain language situation description
  category: CategoryType;        // Main legal category
  priority: number;              // Display order priority (1-10)
  
  // Content sections
  rights: LegalRight[];          // 3-5 key rights with citations
  actionSteps: ActionStep[];     // Step-by-step guidance
  relatedScenarios: string[];    // IDs of related scenarios
  
  // Search optimization
  variations: string[];          // Natural language search variations
  embedding: number[];           // Pre-computed semantic vector
  keywords: string[];            // Fallback keyword search terms
  
  // Metadata
  lastUpdated: string;           // ISO date string
  verified: boolean;             // Legal professional verification status
  sourceCount: number;           // Number of official sources cited
}
```

### Legal Right
**Purpose**: Individual legal right or protection within a scenario
**Attributes**: Each right includes plain language + citation + source

```typescript
interface LegalRight {
  id: string;                    // Unique within scenario
  text: string;                  // Plain language explanation
  legalBasis: string;            // Formal legal citation
  confidence: 'high' | 'medium' | 'low';  // Source reliability
  
  // Source attribution
  sources: OfficialSource[];     // Verifiable government sources
  
  // Display
  displayOrder: number;          // Order within scenario
  highlighted: boolean;          // Mark as key right
}
```

### Action Step
**Purpose**: Specific actionable step users can take
**Structure**: Ordered list with documents and authorities

```typescript
interface ActionStep {
  id: string;
  stepNumber: number;            // Sequential order
  title: string;                 // Brief step title
  description: string;           // Detailed instruction
  
  // Requirements
  documentsNeeded: string[];     // Required paperwork
  timeframe: string;             // Expected duration
  cost: string;                  // Associated costs if any
  
  // Contacts
  relevantAuthorities: Authority[];  // Government offices/contacts
  
  // Complexity
  difficulty: 'easy' | 'medium' | 'complex';
  legalHelpRecommended: boolean; // Suggest lawyer consultation
}
```

### Official Source
**Purpose**: Verifiable government or legal authority reference
**Validation**: Automated link checking + manual review

```typescript
interface OfficialSource {
  id: string;
  title: string;                 // Document/page title
  url: string;                   // Official government URL
  type: SourceType;              // Type of source
  
  // Verification
  lastChecked: string;           // ISO date of last verification
  status: 'active' | 'broken' | 'moved' | 'archive';
  backupUrl?: string;            // Alternative source if available
  
  // Authority
  organization: string;          // Publishing organization
  reliability: 'primary' | 'secondary' | 'supporting';
  
  // Content
  relevantSection?: string;      // Specific section reference
  summary: string;               // Brief content summary
}
```

### Category
**Purpose**: Main legal area grouping for navigation
**Display**: Visual tiles with icons and descriptions

```typescript
interface Category {
  id: CategoryType;
  name: string;                  // Display name
  description: string;           // Brief explanation
  icon: string;                  // Icon identifier
  
  // Organization
  displayOrder: number;          // Layout order
  scenarioCount: number;         // Number of scenarios in category
  
  // Navigation
  popularScenarios: string[];    // Most accessed scenario IDs
  searchKeywords: string[];      // Category-specific search terms
}

type CategoryType = 
  | 'employment' 
  | 'consumer' 
  | 'housing' 
  | 'police' 
  | 'family' 
  | 'digital';
```

### Search Query & Results
**Purpose**: Track search behavior and optimize results
**Privacy**: No personal data stored, session-only

```typescript
interface SearchQuery {
  sessionId: string;             // Anonymous session identifier
  timestamp: string;             // Query time
  
  // Query data
  originalQuery: string;         // User's search text
  processedQuery: string;        // Cleaned/normalized version
  embedding: number[];           // Query vector for matching
  
  // Results
  results: SearchResult[];       // Ranked results returned
  selectedResult?: string;       // Which result user clicked
  
  // Performance
  responseTime: number;          // Milliseconds to return results
  confidence: number;            // Best result confidence score
}

interface SearchResult {
  scenarioId: string;            // Matched scenario
  confidence: number;            // Similarity score (0-1)
  matchType: 'semantic' | 'keyword' | 'category';
  rank: number;                  // Position in results (1-based)
}
```

## Data Relationships

### Scenario → Rights → Sources
```
LegalScenario
├── rights: LegalRight[]
│   └── sources: OfficialSource[]
├── actionSteps: ActionStep[]
│   └── relevantAuthorities: Authority[]
└── relatedScenarios: string[] → LegalScenario[]
```

### Category → Scenarios
```
Category
└── scenarios: LegalScenario[] (filtered by category)
    ├── popularScenarios: string[] → LegalScenario[]
    └── scenarioCount: computed from scenarios.length
```

### Search → Results → Scenarios
```
SearchQuery
└── results: SearchResult[]
    └── scenarioId: string → LegalScenario
```

## Storage Schema

### File Structure
```
data/
├── scenarios/
│   ├── employment/
│   │   ├── salary-unpaid.json
│   │   ├── wrongful-termination.json
│   │   └── workplace-harassment.json
│   ├── consumer/
│   │   ├── defective-product.json
│   │   └── online-shopping-fraud.json
│   └── [other categories]/
├── categories.json              # Category definitions
├── embeddings/
│   ├── scenario-embeddings.json    # Pre-computed vectors
│   └── search-index.json           # Optimized search data
└── sources/
    └── verified-sources.json       # Source verification status
```

### Content JSON Structure
```json
{
  "id": "salary-unpaid",
  "title": "Unpaid or Delayed Salary",
  "description": "When your employer fails to pay salary on the agreed date or withholds payment",
  "category": "employment",
  "priority": 1,
  
  "rights": [
    {
      "id": "right-timely-payment",
      "text": "You have the right to receive your salary by the 7th day of the following month",
      "legalBasis": "Payment of Wages Act 1936, Section 5",
      "confidence": "high",
      "sources": [
        {
          "id": "wages-act-1936",
          "title": "Payment of Wages Act 1936",
          "url": "https://legislative.gov.in/sites/default/files/A1936-04.pdf",
          "type": "central-act",
          "organization": "Ministry of Labour and Employment",
          "reliability": "primary"
        }
      ]
    }
  ],
  
  "actionSteps": [
    {
      "stepNumber": 1,
      "title": "Document the delay",
      "description": "Keep records of salary due dates and actual payment dates",
      "documentsNeeded": ["Employment contract", "Salary slips", "Bank statements"],
      "timeframe": "Immediate",
      "difficulty": "easy"
    }
  ],
  
  "variations": [
    "boss not paying salary",
    "company owes me money",
    "employer delayed salary",
    "salary not received on time",
    "unpaid wages"
  ],
  
  "embedding": [0.1234, -0.5678, 0.9012, ...],
  
  "relatedScenarios": ["wrongful-termination", "workplace-harassment"],
  
  "lastUpdated": "2025-09-26T00:00:00Z",
  "verified": true,
  "sourceCount": 3
}
```

## Data Processing Pipeline

### Build Time Processing
1. **Content Ingestion**: Load scenario markdown/JSON files
2. **Embedding Generation**: Create vectors for scenarios and variations
3. **Source Validation**: Check all government links for availability
4. **Search Index Creation**: Build optimized search data structure
5. **Static Asset Generation**: Output production-ready JSON files

### Runtime Processing
1. **Query Processing**: Clean and normalize user search input
2. **Embedding Generation**: Convert query to vector (client-side)
3. **Similarity Matching**: Compare against pre-computed scenario embeddings
4. **Result Ranking**: Sort by confidence score with relevance filters
5. **Response Assembly**: Return structured results with metadata

### Content Updates
1. **Source Monitoring**: Daily automated link checking
2. **Content Review**: Quarterly legal professional review
3. **User Feedback**: Integration of user suggestions and corrections
4. **Version Control**: Track all content changes with audit trail

## Performance Considerations

### Data Size Optimization
- **Embeddings**: ~200KB for 10 scenarios with variations
- **Content**: ~100KB for complete scenario data
- **Total Bundle**: <500KB including all data and code

### Loading Strategy
- **Critical Path**: Core app + essential UI (~50KB)
- **Search Data**: Load embeddings after initial render
- **Content**: Progressive loading based on user interaction
- **Offline**: Cache essential scenarios for PWA functionality

### Search Performance
- **Target**: <200ms for search results
- **Optimization**: Pre-computed embeddings, efficient similarity algorithms
- **Fallback**: Keyword search if semantic matching is slow
- **Caching**: Browser caching for repeated queries

## Validation Rules

### Content Validation
- **Source Requirement**: Every legal right MUST have verified government source
- **Citation Format**: Standard format for all legal citations
- **Plain Language**: Content MUST pass readability tests
- **Professional Review**: Legal expert approval required before publication

### Data Integrity
- **Link Validation**: All URLs MUST be functional government sources
- **Embedding Quality**: Semantic vectors MUST pass similarity tests
- **Schema Compliance**: All data MUST match TypeScript interfaces
- **Performance Budgets**: Total data size MUST stay under limits

This data model supports the constitutional requirements for source credibility, accessibility, and situation-based navigation while enabling efficient semantic search and professional presentation.