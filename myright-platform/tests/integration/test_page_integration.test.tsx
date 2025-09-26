/**
 * Integration tests for main page component integration
 * 
 * Tests the integration of SearchInterface, CategoryNavigation, 
 * SearchResults, and LegalDisclaimer components on the home page.
 */

import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import Home from '@/app/page';

// Mock the services
jest.mock('@/services/searchService', () => ({
  searchService: {
    search: jest.fn(),
  },
}));

jest.mock('@/services/contentService', () => ({
  contentService: {
    getScenario: jest.fn(),
  },
}));

// Mock the components that might have complex dependencies
jest.mock('@/components/search/SearchInterface', () => ({
  SearchInterface: ({ onSearch, onQueryChange, query, placeholder, onFiltersChange, isLoading }: any) => (
    <div data-testid="search-interface">
      <input
        data-testid="search-input"
        value={query || ''}
        onChange={(e) => onQueryChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
      />
      <button
        data-testid="search-button"
        onClick={() => onSearch?.(query || '', {})}
        disabled={isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      <button
        data-testid="filters-button"
        onClick={() => onFiltersChange?.({})}
      >
        Filters
      </button>
    </div>
  ),
}));

jest.mock('@/components/search/SearchResults', () => ({
  SearchResults: ({ searchResponse, isLoading, onResultClick }: any) => (
    <div data-testid="search-results">
      {isLoading && <div data-testid="loading">Loading results...</div>}
      {searchResponse?.results?.map((result: any, index: number) => (
        <div
          key={result.scenario.id}
          data-testid={`result-${index}`}
          onClick={() => onResultClick?.(result.scenario, index)}
        >
          {result.scenario.title}
        </div>
      ))}
      {searchResponse && searchResponse.results.length === 0 && (
        <div data-testid="no-results">No results found</div>
      )}
    </div>
  ),
}));

jest.mock('@/components/navigation/CategoryNavigation', () => ({
  CategoryNavigation: ({ categories, onCategorySelect, selectedCategory }: any) => (
    <div data-testid="category-navigation">
      {categories.map((category: any) => (
        <button
          key={category.id}
          data-testid={`category-${category.id}`}
          onClick={() => onCategorySelect?.(category.id)}
          className={selectedCategory === category.id ? 'selected' : ''}
        >
          {category.icon} {category.name} ({category.count})
        </button>
      ))}
    </div>
  ),
}));

jest.mock('@/components/ui/LegalDisclaimer', () => ({
  LegalDisclaimer: ({ variant, isDismissible, onClose }: any) => (
    <div data-testid="legal-disclaimer" data-variant={variant}>
      <div>Legal Disclaimer Content</div>
      {isDismissible && (
        <button data-testid="dismiss-disclaimer" onClick={onClose}>
          Dismiss
        </button>
      )}
    </div>
  ),
}));

describe('Page Integration Tests', () => {
  const mockSearchService = require('@/services/searchService').searchService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchService.search.mockResolvedValue({
      query: 'test query',
      results: [
        {
          scenario: {
            id: 'test-scenario-1',
            title: 'Test Employment Scenario',
            category: 'employment',
          },
          score: 0.95,
          matchedFields: [],
          highlights: [],
          matchType: 'title' as const,
        },
      ],
      metadata: {
        totalResults: 1,
        searchTime: 100,
        algorithm: 'semantic' as const,
      },
    });
  });

  test('T062-1: renders all main page components', () => {
    render(<Home />);
    
    // Check that all major components are present
    expect(screen.getByText('MyRight')).toBeInTheDocument();
    expect(screen.getByText('Legal Rights Platform')).toBeInTheDocument();
    expect(screen.getByTestId('legal-disclaimer')).toBeInTheDocument();
    expect(screen.getByTestId('category-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('search-interface')).toBeInTheDocument();
    expect(screen.getByText('Know Your Rights')).toBeInTheDocument();
  });

  test('T062-2: legal disclaimer is dismissible', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // Check disclaimer is visible
    expect(screen.getByTestId('legal-disclaimer')).toBeInTheDocument();
    
    // Dismiss the disclaimer
    await user.click(screen.getByTestId('dismiss-disclaimer'));
    
    // Disclaimer should be gone
    expect(screen.queryByTestId('legal-disclaimer')).not.toBeInTheDocument();
  });

  test('T062-3: category navigation displays all categories with counts', () => {
    render(<Home />);
    
    const categoryNav = screen.getByTestId('category-navigation');
    
    // Check all categories are present with their icons and counts
    expect(within(categoryNav).getByTestId('category-employment')).toHaveTextContent('💼 Employment (15)');
    expect(within(categoryNav).getByTestId('category-housing')).toHaveTextContent('🏠 Housing (12)');
    expect(within(categoryNav).getByTestId('category-consumer')).toHaveTextContent('🛒 Consumer (8)');
    expect(within(categoryNav).getByTestId('category-family')).toHaveTextContent('👨‍👩‍👧‍👦 Family (10)');
    expect(within(categoryNav).getByTestId('category-digital')).toHaveTextContent('💻 Digital (6)');
    expect(within(categoryNav).getByTestId('category-police')).toHaveTextContent('👮 Police (5)');
  });

  test('T062-4: search interface integration works correctly', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // Type in search query
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'unpaid wages');
    
    // Submit search
    await user.click(screen.getByTestId('search-button'));
    
    // Check that search service was called
    await waitFor(() => {
      expect(mockSearchService.search).toHaveBeenCalledWith({
        query: 'unpaid wages',
        filters: {},
        pagination: { page: 1, pageSize: 20 },
      });
    });
    
    // Check results are displayed
    expect(screen.getByTestId('search-results')).toBeInTheDocument();
  });

  test('T062-5: category selection triggers filtered search', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // First perform a search to set query
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'workplace issue');
    await user.click(screen.getByTestId('search-button'));
    
    // Clear previous calls
    mockSearchService.search.mockClear();
    
    // Select employment category
    await user.click(screen.getByTestId('category-employment'));
    
    // Check that filtered search was triggered
    await waitFor(() => {
      expect(mockSearchService.search).toHaveBeenCalledWith({
        query: 'workplace issue',
        filters: { category: 'employment' },
        pagination: { page: 1, pageSize: 20 },
      });
    });
  });

  test('T062-6: search results display with loading states', async () => {
    const user = userEvent.setup();
    
    // Mock a slower search to test loading state
    mockSearchService.search.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        query: 'test',
        results: [],
        metadata: { totalResults: 0, searchTime: 500, algorithm: 'semantic' as const },
      }), 100))
    );
    
    render(<Home />);
    
    // Start search
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'test query');
    await user.click(screen.getByTestId('search-button'));
    
    // Check loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('Searching...')).toBeInTheDocument();
    
    // Wait for search to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    // Check no results state
    expect(screen.getByTestId('no-results')).toBeInTheDocument();
  });

  test('T062-7: result click handling works correctly', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<Home />);
    
    // Perform search to get results
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'employment issue');
    await user.click(screen.getByTestId('search-button'));
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByTestId('result-0')).toBeInTheDocument();
    });
    
    // Click on first result
    await user.click(screen.getByTestId('result-0'));
    
    // Check that result click was handled
    expect(consoleSpy).toHaveBeenCalledWith(
      'Clicked scenario:',
      'test-scenario-1',
      'at position:',
      0
    );
    
    consoleSpy.mockRestore();
  });

  test('T062-8: welcome message displays when no search performed', () => {
    render(<Home />);
    
    // Check welcome content is visible
    expect(screen.getByText('Know Your Rights')).toBeInTheDocument();
    expect(screen.getByText(/Search for legal scenarios and understand your rights/)).toBeInTheDocument();
    expect(screen.getByText(/Try searching for "unpaid wages"/)).toBeInTheDocument();
    
    // Search results should not be visible
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
  });

  test('T062-9: filters integration works correctly', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // Type search query first
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'legal issue');
    await user.click(screen.getByTestId('search-button'));
    
    // Clear previous calls
    mockSearchService.search.mockClear();
    
    // Trigger filters change
    await user.click(screen.getByTestId('filters-button'));
    
    // Check that search was called with filters
    await waitFor(() => {
      expect(mockSearchService.search).toHaveBeenCalledWith({
        query: 'legal issue',
        filters: {},
        pagination: { page: 1, pageSize: 20 },
      });
    });
  });

  test('T062-10: responsive layout structure is maintained', () => {
    render(<Home />);
    
    // Check main layout structure
    const main = screen.getByRole('main');
    expect(main).toHaveClass('lg:col-span-3');
    
    // Check sidebar structure
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveClass('lg:col-span-1');
    
    // Check header structure
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
    
    // Check that disclaimer uses proper variant
    const disclaimer = screen.getByTestId('legal-disclaimer');
    expect(disclaimer).toHaveAttribute('data-variant', 'banner');
  });
});