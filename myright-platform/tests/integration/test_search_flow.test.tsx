/**
 * Integration Test: Complete Search Flow
 * 
 * This test validates the end-to-end search functionality from user input
 * to result display using the complete Home page component.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Home page component removed - using custom components
// import Home from '@/app/page';

import { LegalScenario } from '@/types';
import { SearchConfig, SearchResponse } from '@/types/search';
import { SearchService } from '@/services/searchService';
import { SearchInterface } from '@/components/search/SearchInterface';
import { SearchResults } from '@/components/search/SearchResults';
// import { SearchResult } from '@/types/search';

// Mock legal scenarios for integration testing
const mockScenarios: LegalScenario[] = [
  {
    id: 'salary-unpaid-employment',
    title: 'Employer Not Paying Salary or Wages',
    description: 'When your employer refuses to pay your salary, wages, or withholds payment without valid reason',
    category: 'employment',
    rights: [
      {
        id: 'wage-payment-right',
        title: 'Right to Timely Payment of Wages',
        description: 'Every worker has the right to receive wages on time',
        legalBasis: {
          law: 'Payment of Wages Act, 1936',
          section: 'Section 5'
        },
        application: 'Applies to all employees'
      }
    ],
    actionSteps: [
      {
        order: 1,
        title: 'Document Employment Details',
        description: 'Gather employment documents and salary records',
        type: 'documentation',
        difficulty: 'easy',
        timeEstimate: '1-2 hours',
        cost: 'free'
      }
    ],
    sources: [
      {
        id: 'wage-act-source',
        title: 'Payment of Wages Act, 1936',
        authority: 'Ministry of Labour',
        url: 'https://labour.gov.in/wages-act',
        type: 'law',
        lastVerified: '2024-01-15',
        status: 'active'
      }
    ],
    keywords: ['salary', 'wages', 'unpaid', 'employer', 'payment'],
    variations: [
      'My company is not paying my salary',
      'Boss refuses to pay wages',
      'Salary has been pending for months'
    ],
    lastUpdated: '2024-01-15',
    validationStatus: {
      sourcesVerified: true,
      legalReview: true,
      clarityReview: true,
      lastValidated: '2024-01-15'
    },
    severity: 'high'
  },
  {
    id: 'security-deposit-housing',
    title: 'Landlord Not Returning Security Deposit',
    description: 'When landlord refuses to return security deposit after tenancy ends',
    category: 'housing',
    rights: [
      {
        id: 'deposit-return-right',
        title: 'Right to Security Deposit Return',
        description: 'Tenant has right to get security deposit back',
        legalBasis: {
          law: 'Rent Control Act',
          section: 'Various State Acts'
        },
        application: 'Applies to all rental agreements'
      }
    ],
    actionSteps: [
      {
        order: 1,
        title: 'Review Rental Agreement',
        description: 'Check rental agreement terms about deposit',
        type: 'documentation',
        difficulty: 'easy',
        timeEstimate: '30 minutes',
        cost: 'free'
      }
    ],
    sources: [
      {
        id: 'rent-act-source',
        title: 'State Rent Control Acts',
        authority: 'State Housing Departments',
        url: 'https://housing.gov.in/rent-acts',
        type: 'law',
        lastVerified: '2024-01-15',
        status: 'active'
      }
    ],
    keywords: ['security deposit', 'landlord', 'tenant', 'rental', 'housing'],
    variations: [
      'Landlord not returning deposit',
      'Security deposit refund issue',
      'Tenant deposit rights'
    ],
    lastUpdated: '2024-01-15',
    validationStatus: {
      sourcesVerified: true,
      legalReview: true,
      clarityReview: true,
      lastValidated: '2024-01-15'
    },
    severity: 'medium'
  }
];

// Mock embeddings for semantic search
const mockEmbeddings = {
  'salary-unpaid-employment': {
    title: Array.from({ length: 384 }, () => Math.random()),
    description: Array.from({ length: 384 }, () => Math.random()),
    combined: Array.from({ length: 384 }, () => Math.random())
  },
  'security-deposit-housing': {
    title: Array.from({ length: 384 }, () => Math.random()),
    description: Array.from({ length: 384 }, () => Math.random()),
    combined: Array.from({ length: 384 }, () => Math.random())
  }
};

// Integration Test Component that combines search interface and results
const SearchFlowTestComponent: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [searchResponse, setSearchResponse] = React.useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const searchService = React.useMemo(() => {
    const config: SearchConfig = {
      minScore: 0.3,
      maxResults: 20,
      autocompleteSuggestions: 5,
      enableFuzzyMatch: true,
      keywordBoost: 1.5,
      titleBoost: 2.0,
      enableCategoryFilter: true,
      enableSeverityFilter: true
    };
    return new SearchService(config);
  }, []);

  React.useEffect(() => {
    // Initialize search service with mock data
    searchService.loadContent(mockScenarios, mockEmbeddings);
  }, [searchService]);

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await searchService.search({ 
        query: searchQuery,
        includeHighlights: true 
      });
      setSearchResponse(response);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (scenario: LegalScenario, position: number) => {
    // Track result click for analytics
    console.log('Result clicked:', scenario.id, position);
  };

  return (
    <div>
      <SearchInterface
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        isLoading={isLoading}
        placeholder="Search for legal rights and solutions..."
      />
      <SearchResults
        searchResponse={searchResponse || undefined}
        isLoading={isLoading}
        onResultClick={handleResultClick}
      />
    </div>
  );
};

describe('Complete Search Flow Integration', () => {
  beforeEach(() => {
    // Clear any previous test state
    jest.clearAllMocks();
  });

  test('should complete full search flow from input to results', async () => {
    const user = userEvent.setup();
    
    render(<SearchFlowTestComponent />);
    
    // Step 1: User enters search query
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'salary not paid');
    
    // Step 2: User submits search
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);
    
    // Step 3: Loading state should be shown
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
    
    // Step 4: Results should appear after loading
    await waitFor(() => {
      expect(screen.getByText('Employer Not Paying Salary or Wages')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Step 5: Search metadata should be displayed
    expect(screen.getByText(/1 result found/i)).toBeInTheDocument();
    expect(screen.getByText(/search completed in/i)).toBeInTheDocument();
  });

  test('should show relevant results for different query types', async () => {
    const user = userEvent.setup();
    
    render(<SearchFlowTestComponent />);
    
    // Test 1: Employment-related query
    const searchInput = screen.getByRole('searchbox');
    await user.clear(searchInput);
    await user.type(searchInput, 'unpaid wages');
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Employer Not Paying Salary or Wages')).toBeInTheDocument();
    });
    
    // Test 2: Housing-related query
    await user.clear(searchInput);
    await user.type(searchInput, 'security deposit not returned');
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Landlord Not Returning Security Deposit')).toBeInTheDocument();
    });
  });

  test('should handle semantic search variations', async () => {
    const user = userEvent.setup();
    
    render(<SearchFlowTestComponent />);
    
    const searchInput = screen.getByRole('searchbox');
    
    // Test semantic similarity - different words, same meaning
    await user.type(searchInput, 'company not giving money for work');
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    await waitFor(() => {
      // Should still find salary-related scenario due to semantic similarity
      expect(screen.getByText('Employer Not Paying Salary or Wages')).toBeInTheDocument();
    });
  });

  test('should display search results with proper highlights', async () => {
    const user = userEvent.setup();
    
    render(<SearchFlowTestComponent />);
    
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'salary');
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    await waitFor(() => {
      // Check for highlighted search terms
      const highlightedText = screen.getByText('salary', { selector: 'mark' });
      expect(highlightedText).toBeInTheDocument();
    });
  });

  test('should handle no results scenario', async () => {
    const user = userEvent.setup();
    
    render(<SearchFlowTestComponent />);
    
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'completely unrelated alien invasion');
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
      expect(screen.getByText(/try different keywords/i)).toBeInTheDocument();
    });
  });

  test('should meet performance requirements', async () => {
    const user = userEvent.setup();
    
    render(<SearchFlowTestComponent />);
    
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'salary');
    
    const startTime = Date.now();
    // Use the exact button text to avoid ambiguity
    await user.click(screen.getByRole('button', { name: 'Search' }));
    
    await waitFor(() => {
      expect(screen.getByText('Employer Not Paying Salary or Wages')).toBeInTheDocument();
    });
    
    const endTime = Date.now();
    const searchTime = endTime - startTime;
    
    // Should complete search within 200ms requirement
    expect(searchTime).toBeLessThan(200);
  });

  test('should handle result clicks and navigation', async () => {
    const user = userEvent.setup();
    
    render(<SearchFlowTestComponent />);
    
    // Perform search
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'salary');
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Employer Not Paying Salary or Wages')).toBeInTheDocument();
    });
    
    // Click on result
    const resultElement = screen.getByRole('article');
    await user.click(resultElement);
    
    // Should trigger navigation or show details
    // (Actual behavior depends on implementation)
  });

  test('should support keyboard navigation throughout flow', async () => {
    const user = userEvent.setup();
    
    render(<SearchFlowTestComponent />);
    
    // Navigate with keyboard only
    const searchInput = screen.getByRole('searchbox');
    searchInput.focus();
    
    await user.keyboard('salary not paid');
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText('Employer Not Paying Salary or Wages')).toBeInTheDocument();
    });
    
    // Navigate to results with keyboard
    await user.keyboard('{Tab}');
    const resultElement = document.activeElement;
    expect(resultElement).toHaveAttribute('role', 'article');
    
    // Select result with keyboard
    await user.keyboard('{Enter}');
  });

  test('should handle concurrent searches gracefully', async () => {
    const user = userEvent.setup();
    
    render(<SearchFlowTestComponent />);
    
    const searchInput = screen.getByRole('searchbox');
    
    // Start first search
    await user.type(searchInput, 'salary');
    user.click(screen.getByRole('button', { name: /search/i }));
    
    // Start second search before first completes
    await user.clear(searchInput);
    await user.type(searchInput, 'deposit');
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    // Should show results for the latest search only
    await waitFor(() => {
      expect(screen.getByText('Landlord Not Returning Security Deposit')).toBeInTheDocument();
      expect(screen.queryByText('Employer Not Paying Salary or Wages')).not.toBeInTheDocument();
    });
  });

  test('should maintain search state during user interactions', async () => {
    const user = userEvent.setup();
    
    render(<SearchFlowTestComponent />);
    
    // Perform search
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'salary unpaid');
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Employer Not Paying Salary or Wages')).toBeInTheDocument();
    });
    
    // Search input should retain the query
    expect(searchInput).toHaveValue('salary unpaid');
    
    // Results should remain visible
    expect(screen.getByText('Employer Not Paying Salary or Wages')).toBeInTheDocument();
  });
});

describe('Search Flow Error Handling', () => {
  test('should handle search service errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock search service to throw error
    const MockErrorSearchComponent: React.FC = () => {
      const [query, setQuery] = React.useState('');
      const [error, setError] = React.useState<string | null>(null);
      const [isLoading, setIsLoading] = React.useState(false);
      
      const handleSearch = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          // Simulate service error
          throw new Error('Search service unavailable');
        } catch (err) {
          setError('Search failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
      return (
        <div>
          <SearchInterface
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
          {error && <div role="alert">{error}</div>}
        </div>
      );
    };
    
    render(<MockErrorSearchComponent />);
    
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'test query');
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/search failed/i)).toBeInTheDocument();
    });
  });

  test('should handle network failures during search', async () => {
    const user = userEvent.setup();
    
    // This would test actual network failure scenarios
    // Implementation depends on how search service handles network errors
    render(<SearchFlowTestComponent />);
    
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'network test');
    
    // Mock network failure
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    // Should show appropriate error message
    await waitFor(() => {
      expect(screen.getByText(/connection error/i)).toBeInTheDocument();
    });
  });
});