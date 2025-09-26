# QuickStart: MyRight Development Setup

**Target**: Get MyRight platform running locally in under 30 minutes  
**Phase**: 1 - Development Environment  
**Updated**: 2025-09-26

## Prerequisites Checklist

```bash
# Required software versions
node --version    # Should be 18.x or higher
npm --version     # Should be 9.x or higher  
git --version     # Any recent version
python --version  # 3.8+ for embedding generation
```

**Install missing prerequisites:**
```bash
# Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python (for embeddings)
sudo apt-get install python3 python3-pip
```

## Project Setup (5 minutes)

### 1. Initialize Next.js Project
```bash
# Create new Next.js project with TypeScript
npx create-next-app@latest myright-platform --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd myright-platform

# Install additional dependencies
npm install @sentence-transformers/transformers
npm install -D @playwright/test jest @testing-library/react @testing-library/jest-dom
```

### 2. Project Structure Setup
```bash
# Create required directories
mkdir -p src/components/{ui,search,content}
mkdir -p src/services
mkdir -p src/types
mkdir -p src/data/{scenarios,embeddings}
mkdir -p public/data
mkdir -p scripts/embeddings
mkdir -p tests/{unit,integration,e2e}

# Create essential files
touch src/types/index.ts
touch src/services/searchService.ts
touch src/services/contentService.ts
```

### 3. Environment Configuration
```bash
# Create environment file
cat > .env.local << EOF
NEXT_PUBLIC_APP_NAME=MyRight
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_EMBEDDINGS_URL=/data/embeddings.json
NEXT_PUBLIC_SCENARIOS_URL=/data/scenarios.json
NODE_ENV=development
EOF
```

## Core Types Definition (5 minutes)

Create `src/types/index.ts`:
```typescript
// Legal domain types
export interface LegalScenario {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  priority: number;
  rights: LegalRight[];
  actionSteps: ActionStep[];
  variations: string[];
  embedding: number[];
  relatedScenarios: string[];
  lastUpdated: string;
  verified: boolean;
  sourceCount: number;
}

export interface LegalRight {
  id: string;
  text: string;
  legalBasis: string;
  confidence: 'high' | 'medium' | 'low';
  sources: OfficialSource[];
  displayOrder: number;
  highlighted: boolean;
}

export interface ActionStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  documentsNeeded: string[];
  timeframe: string;
  cost: string;
  difficulty: 'easy' | 'medium' | 'complex';
  legalHelpRecommended: boolean;
}

export interface OfficialSource {
  id: string;
  title: string;
  url: string;
  type: SourceType;
  organization: string;
  reliability: 'primary' | 'secondary' | 'supporting';
  lastChecked: string;
  status: 'active' | 'broken' | 'moved' | 'archive';
}

export type CategoryType = 'employment' | 'consumer' | 'housing' | 'police' | 'family' | 'digital';
export type SourceType = 'central-act' | 'court-judgment' | 'government-guideline' | 'ministry-notification';

// Search types
export interface SearchResult {
  scenario: LegalScenario;
  confidence: number;
  matchReason: string;
  rank: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  confidence: number;
  responseTime: number;
  searchType: 'semantic' | 'keyword' | 'category' | 'fallback';
  suggestions?: string[];
  totalMatches: number;
}
```

## Sample Content Setup (10 minutes)

### 1. Create Sample Scenario
Create `src/data/scenarios/salary-unpaid.json`:
```json
{
  "id": "salary-unpaid",
  "title": "Unpaid or Delayed Salary",
  "description": "When your employer fails to pay salary on the agreed date or withholds payment without valid reason",
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
          "reliability": "primary",
          "lastChecked": "2025-09-26T00:00:00Z",
          "status": "active"
        }
      ],
      "displayOrder": 1,
      "highlighted": true
    }
  ],
  "actionSteps": [
    {
      "id": "step-document-delay",
      "stepNumber": 1,
      "title": "Document the salary delay",
      "description": "Keep detailed records of when salary was due vs when (if) it was paid",
      "documentsNeeded": ["Employment contract", "Salary slips", "Bank statements"],
      "timeframe": "Immediate",
      "cost": "Free",
      "difficulty": "easy",
      "legalHelpRecommended": false
    }
  ],
  "variations": [
    "boss not paying salary",
    "company owes me money", 
    "employer delayed salary",
    "salary not received on time",
    "unpaid wages",
    "company didn't pay me",
    "boss refusing to pay"
  ],
  "embedding": [],
  "relatedScenarios": ["wrongful-termination"],
  "lastUpdated": "2025-09-26T00:00:00Z",
  "verified": true,
  "sourceCount": 1
}
```

### 2. Create Categories Data
Create `src/data/categories.json`:
```json
{
  "categories": [
    {
      "id": "employment",
      "name": "Employment & Workplace",
      "description": "Salary, termination, harassment, and workplace rights",
      "icon": "briefcase",
      "displayOrder": 1,
      "scenarioCount": 3
    },
    {
      "id": "consumer",
      "name": "Consumer Rights",
      "description": "Defective products, billing issues, and service disputes",
      "icon": "shopping-cart",
      "displayOrder": 2,
      "scenarioCount": 2
    }
  ]
}
```

## Basic Services Implementation (5 minutes)

### 1. Content Service
Create `src/services/contentService.ts`:
```typescript
import { LegalScenario, Category, CategoryType } from '@/types';

class ContentService {
  private scenarios: LegalScenario[] = [];
  private categories: Category[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Load scenarios (in production, this would be from API/static files)
      const scenarioResponse = await fetch('/data/scenarios.json');
      const scenarioData = await scenarioResponse.json();
      this.scenarios = scenarioData.scenarios || [];
      
      // Load categories
      const categoryResponse = await fetch('/data/categories.json');
      const categoryData = await categoryResponse.json();
      this.categories = categoryData.categories || [];
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize content service:', error);
      throw new Error('Content service initialization failed');
    }
  }

  async getScenario(id: string): Promise<LegalScenario | null> {
    await this.initialize();
    return this.scenarios.find(s => s.id === id) || null;
  }

  async getScenariosByCategory(category: CategoryType): Promise<LegalScenario[]> {
    await this.initialize();
    return this.scenarios.filter(s => s.category === category);
  }

  async getCategories(): Promise<Category[]> {
    await this.initialize();
    return this.categories;
  }
}

export const contentService = new ContentService();
```

### 2. Basic Search Service
Create `src/services/searchService.ts`:
```typescript
import { SearchResponse, SearchResult, LegalScenario } from '@/types';
import { contentService } from './contentService';

class SearchService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    await contentService.initialize();
    this.initialized = true;
  }

  async search(query: string): Promise<SearchResponse> {
    await this.initialize();
    
    const startTime = Date.now();
    const scenarios = await contentService.getScenarios();
    
    // Simple keyword matching for quickstart (semantic search comes later)
    const results: SearchResult[] = scenarios
      .map((scenario, index) => {
        const matchScore = this.calculateKeywordMatch(query, scenario);
        return {
          scenario,
          confidence: matchScore,
          matchReason: matchScore > 0.5 ? 'Strong keyword match' : 'Partial match',
          rank: index + 1
        };
      })
      .filter(result => result.confidence > 0.3)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    return {
      query,
      results,
      confidence: results[0]?.confidence || 0,
      responseTime: Date.now() - startTime,
      searchType: 'keyword',
      totalMatches: results.length
    };
  }

  private calculateKeywordMatch(query: string, scenario: LegalScenario): number {
    const queryWords = query.toLowerCase().split(' ');
    const scenarioText = [
      scenario.title,
      scenario.description,
      ...scenario.variations
    ].join(' ').toLowerCase();

    const matches = queryWords.filter(word => scenarioText.includes(word));
    return matches.length / queryWords.length;
  }
}

export const searchService = new SearchService();
```

## Basic UI Components (5 minutes)

### 1. Search Interface
Create `src/components/search/SearchInterface.tsx`:
```typescript
'use client';

import { useState } from 'react';

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchInterface({ 
  onSearch, 
  isLoading = false,
  placeholder = "Describe your legal situation..." 
}: SearchInterfaceProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}
```

### 2. Basic Layout
Create `src/components/ui/Layout.tsx`:
```typescript
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">MyRight</h1>
            <nav>
              <span className="text-sm text-gray-600">Legal Information Platform</span>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600">
            This provides legal information, not legal advice. Consult a lawyer for specific situations.
          </p>
        </div>
      </footer>
    </div>
  );
}
```

## Development Server Setup

### 1. Update Next.js App Page
Replace `src/app/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import Layout from '@/components/ui/Layout';
import SearchInterface from '@/components/search/SearchInterface';
import { searchService } from '@/services/searchService';
import { SearchResult } from '@/types';

export default function Home() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await searchService.search(query);
      setResults(response.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Know Your Legal Rights
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Find information about your legal rights in common situations
        </p>
        
        <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
        
        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold">Search Results</h3>
            {results.map((result, index) => (
              <div key={result.scenario.id} className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold">{result.scenario.title}</h4>
                <p className="text-gray-600">{result.scenario.description}</p>
                <p className="text-sm text-blue-600 mt-2">
                  Confidence: {Math.round(result.confidence * 100)}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
```

### 2. Start Development
```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# You should see the MyRight homepage with search functionality
```

## Quick Testing (5 minutes)

### 1. Test Basic Search
- Open http://localhost:3000
- Search for "salary not paid"
- Verify it returns the salary scenario with confidence score
- Check that basic UI is professional and responsive

### 2. Test Mobile Responsiveness
```bash
# Test on different screen sizes
# Chrome DevTools -> Toggle device toolbar
# Test iPhone SE (375px) and desktop (1200px+)
```

### 3. Verify Core Requirements
- ✅ Professional appearance (clean design, proper typography)
- ✅ Search functionality working
- ✅ Legal disclaimer visible in footer
- ✅ Mobile-responsive layout
- ✅ Government source links in scenario data

## Next Development Steps

### Immediate (Next 2-3 hours)
1. **Add more scenarios**: Create 4-5 additional scenarios with full content
2. **Implement semantic search**: Add embedding generation and similarity matching
3. **Enhance UI**: Add category navigation and search results styling
4. **Add source verification**: Implement automated link checking

### Short-term (Next few days)
1. **Content creation**: Complete all 10 MVP scenarios
2. **Professional polish**: Match design quality of established legal platforms
3. **Performance optimization**: Implement PWA features and caching
4. **User testing**: Test with real users and iterate

### Production Readiness
1. **Legal review**: Have legal professional verify all content
2. **Source validation**: Ensure all government links are functional
3. **Performance testing**: Validate <3 second load times
4. **Deployment**: Set up CI/CD and hosting infrastructure

## Troubleshooting

### Common Issues
```bash
# Module not found errors
npm install --save-dev @types/node

# Build failures
npm run build
# Check for TypeScript errors

# Search not working
# Check browser console for network errors
# Verify data files are in public/data/
```

### Performance Optimization
```bash
# Bundle analysis
npm install --save-dev @next/bundle-analyzer
# Add to next.config.js and run npm run analyze
```

**Estimated setup time**: 30 minutes for basic working platform  
**Ready for**: Adding content, implementing semantic search, UI polish