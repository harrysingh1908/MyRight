/**
 * Contract Tests for UI Components
 * 
 * These tests define the expected behavior and API contracts for React components.
 * They MUST FAIL initially (TDD approach) until the components are implemented.
 * 
 * Contract Requirements:
 * 1. Components must follow accessibility standards (WCAG 2.1 AA)
 * 2. Must handle loading and error states gracefully
 * 3. Must support keyboard navigation and screen readers
 * 4. Must be mobile-responsive and touch-friendly
 * 5. Must follow consistent design patterns
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

// Import components that don't exist yet - tests MUST FAIL
import { SearchInterface } from '@/components/search/SearchInterface';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchResult } from '@/components/search/SearchResult';
import { ScenarioDetail } from '@/components/content/ScenarioDetail';
import { CategoryNavigation } from '@/components/navigation/CategoryNavigation';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';

import {
  SearchInterfaceProps,
  SearchResultsProps,
  SearchResultProps,
  ScenarioDetailProps,
  CategoryNavigationProps,
  LegalDisclaimerProps
} from '@/types/components';
import { LegalScenario } from '@/types';
import { SearchResponse, SearchResult as SearchResultType } from '@/types/search';
import { Category } from '@/types/content';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock data for testing
const mockScenario: LegalScenario = {
  id: 'test-scenario',
  title: 'Test Legal Scenario',
  description: 'A comprehensive test scenario for UI components',
  category: 'employment',
  rights: [
    {
      id: 'test-right',
      title: 'Right to Test',
      description: 'This is a test right',
      legalBasis: {
        law: 'Test Act, 2024',
        section: 'Section 1'
      },
      application: 'Applies to all test cases'
    }
  ],
  actionSteps: [
    {
      order: 1,
      title: 'Test Action Step',
      description: 'Perform this test action',
      type: 'documentation',
      difficulty: 'easy',
      timeEstimate: '5 minutes',
      cost: 'free'
    }
  ],
  sources: [
    {
      id: 'test-source',
      title: 'Test Government Source',
      authority: 'Test Ministry',
      url: 'https://test.gov.in',
      type: 'law',
      lastVerified: '2024-01-15',
      status: 'active'
    }
  ],
  keywords: ['test', 'scenario'],
  variations: ['test variation'],
  lastUpdated: '2024-01-15',
  validationStatus: {
    sourcesVerified: true,
    legalReview: true,
    clarityReview: true,
    lastValidated: '2024-01-15'
  },
  severity: 'medium'
};

const mockSearchResult: SearchResultType = {
  scenario: mockScenario,
  score: 0.85,
  matchedFields: [
    {
      field: 'title',
      score: 0.9,
      matchedText: 'Test Legal Scenario'
    }
  ],
  highlights: [
    {
      text: '<mark>Test</mark> Legal Scenario',
      field: 'title',
      originalText: 'Test Legal Scenario'
    }
  ],
  matchType: 'title'
};

const mockSearchResponse: SearchResponse = {
  query: 'test query',
  results: [mockSearchResult],
  totalMatches: 1,
  searchTime: 150,
  filters: {},
  metadata: {
    totalScenarios: 100,
    filteredScenarios: 1,
    algorithm: 'semantic',
    usedEmbeddings: true,
    performance: {
      preprocessing: 10,
      similarity: 80,
      ranking: 30,
      highlighting: 30
    }
  }
};

const mockCategories: Category[] = [
  {
    id: 'employment',
    name: 'Employment',
    description: 'Work-related legal issues',
    icon: '💼',
    color: '#3b82f6',
    scenarioCount: 5,
    sortOrder: 1,
    isActive: true,
    slug: 'employment',
    keywords: ['work', 'job', 'salary']
  },
  {
    id: 'housing',
    name: 'Housing',
    description: 'Property and rental issues',
    icon: '🏠',
    color: '#10b981',
    scenarioCount: 3,
    sortOrder: 2,
    isActive: true,
    slug: 'housing',
    keywords: ['rent', 'property', 'landlord']
  }
];

describe('SearchInterface Component Contract', () => {
  const defaultProps: SearchInterfaceProps = {
    query: '',
    onQueryChange: jest.fn(),
    onSearch: jest.fn(),
    isLoading: false,
    placeholder: 'Search for legal rights...'
  };

  test('should render with basic props', () => {
    render(<SearchInterface {...defaultProps} />);
    
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('should have proper accessibility attributes', async () => {
    const { container } = render(<SearchInterface {...defaultProps} />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    
    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toHaveAttribute('aria-label');
    expect(searchInput).toHaveAttribute('placeholder');
  });

  test('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    
    render(<SearchInterface {...defaultProps} onSearch={onSearch} />);
    
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'salary not paid');
    await user.keyboard('{Enter}');
    
    expect(onSearch).toHaveBeenCalledWith('salary not paid');
  });

  test('should show loading state', () => {
    render(<SearchInterface {...defaultProps} isLoading={true} />);
    
    expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled();
  });

  test('should display autocomplete suggestions when provided', () => {
    const suggestions = [
      { text: 'salary not paid', type: 'scenario_title' as const, score: 0.9, matchCount: 5 },
      { text: 'wage theft', type: 'keyword' as const, score: 0.8, matchCount: 3 }
    ];
    
    render(
      <SearchInterface 
        {...defaultProps} 
        showAutocomplete={true} 
        suggestions={suggestions}
      />
    );
    
    // Autocomplete should be accessible
    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('aria-expanded');
  });
});

describe('SearchResults Component Contract', () => {
  const defaultProps: SearchResultsProps = {
    searchResponse: mockSearchResponse,
    isLoading: false,
    onResultClick: jest.fn()
  };

  test('should render search results correctly', () => {
    render(<SearchResults {...defaultProps} />);
    
    expect(screen.getByText('Test Legal Scenario')).toBeInTheDocument();
    expect(screen.getByText(/1 result found/i)).toBeInTheDocument();
  });

  test('should show loading state with skeleton', () => {
    render(<SearchResults {...defaultProps} isLoading={true} />);
    
    expect(screen.getByTestId('results-loading')).toBeInTheDocument();
  });

  test('should display no results message', () => {
    const emptyResponse = { ...mockSearchResponse, results: [], totalMatches: 0 };
    
    render(<SearchResults {...defaultProps} searchResponse={emptyResponse} />);
    
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  test('should handle result click events', async () => {
    const user = userEvent.setup();
    const onResultClick = jest.fn();
    
    render(<SearchResults {...defaultProps} onResultClick={onResultClick} />);
    
    const resultElement = screen.getByRole('article');
    await user.click(resultElement);
    
    expect(onResultClick).toHaveBeenCalledWith(mockScenario, 0);
  });

  test('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    const onResultClick = jest.fn();
    
    render(<SearchResults {...defaultProps} onResultClick={onResultClick} />);
    
    const resultElement = screen.getByRole('article');
    resultElement.focus();
    await user.keyboard('{Enter}');
    
    expect(onResultClick).toHaveBeenCalled();
  });
});

describe('SearchResult Component Contract', () => {
  const defaultProps: SearchResultProps = {
    result: mockSearchResult,
    position: 0,
    onClick: jest.fn()
  };

  test('should render result information', () => {
    render(<SearchResult {...defaultProps} />);
    
    expect(screen.getByText('Test Legal Scenario')).toBeInTheDocument();
    expect(screen.getByText(/score: 85%/i)).toBeInTheDocument();
    expect(screen.getByText(/employment/i)).toBeInTheDocument();
  });

  test('should display highlights when enabled', () => {
    render(<SearchResult {...defaultProps} showHighlights={true} />);
    
    const highlight = screen.getByText('Test', { selector: 'mark' });
    expect(highlight).toBeInTheDocument();
  });

  test('should support different display variants', () => {
    const { rerender } = render(<SearchResult {...defaultProps} variant="compact" />);
    
    expect(screen.getByTestId('result-compact')).toBeInTheDocument();
    
    rerender(<SearchResult {...defaultProps} variant="detailed" />);
    expect(screen.getByTestId('result-detailed')).toBeInTheDocument();
  });
});

describe('ScenarioDetail Component Contract', () => {
  const defaultProps: ScenarioDetailProps = {
    scenario: mockScenario
  };

  test('should render complete scenario information', () => {
    render(<ScenarioDetail {...defaultProps} expandedByDefault={true} />);
    
    expect(screen.getByText('Test Legal Scenario')).toBeInTheDocument();
    expect(screen.getByText(/A comprehensive test scenario/)).toBeInTheDocument();
    expect(screen.getByText('Right to Test')).toBeInTheDocument();
    expect(screen.getByText('Test Action Step')).toBeInTheDocument();
  });

  test('should have proper heading hierarchy', async () => {
    const { container } = render(<ScenarioDetail {...defaultProps} />);
    
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);
    
    // Check accessibility
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should support expandable sections', async () => {
    const user = userEvent.setup();
    
    render(<ScenarioDetail {...defaultProps} />);
    
    const expandButton = screen.getByRole('button', { name: /show action steps/i });
    await user.click(expandButton);
    
    expect(screen.getByText('Test Action Step')).toBeVisible();
  });

  test('should handle source links correctly', async () => {
    const user = userEvent.setup();
    const onSourceClick = jest.fn();
    
    render(<ScenarioDetail {...defaultProps} onSourceClick={onSourceClick} />);
    
    // Expand sources section first
    const sourcesButton = screen.getByRole('button', { name: /sources & references/i });
    await user.click(sourcesButton);
    
    const sourceLink = screen.getByRole('link', { name: /test government source/i });
    await user.click(sourceLink);
    
    expect(onSourceClick).toHaveBeenCalledWith('https://test.gov.in');
  });

  test('should display severity and time sensitivity', () => {
    const urgentScenario = {
      ...mockScenario,
      severity: 'critical' as const,
      timeSensitivity: {
        urgent: true,
        deadline: '30 days',
        description: 'Must act quickly'
      }
    };
    
    render(<ScenarioDetail scenario={urgentScenario} />);
    
    expect(screen.getByText(/critical/i)).toBeInTheDocument();
    expect(screen.getByText(/urgent/i)).toBeInTheDocument();
  });
});

describe('CategoryNavigation Component Contract', () => {
  const defaultProps: CategoryNavigationProps = {
    categories: mockCategories,
    onCategorySelect: jest.fn()
  };

  test('should render all categories', () => {
    render(<CategoryNavigation {...defaultProps} />);
    
    expect(screen.getByText('Employment')).toBeInTheDocument();
    expect(screen.getByText('Housing')).toBeInTheDocument();
  });

  test('should display category icons and counts', () => {
    render(<CategoryNavigation {...defaultProps} showCounts={true} />);
    
    expect(screen.getByText('💼')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Employment count
  });

  test('should handle category selection', async () => {
    const user = userEvent.setup();
    const onCategorySelect = jest.fn();
    
    render(<CategoryNavigation {...defaultProps} onCategorySelect={onCategorySelect} />);
    
    const employmentCategory = screen.getByRole('button', { name: /employment/i });
    await user.click(employmentCategory);
    
    expect(onCategorySelect).toHaveBeenCalledWith('employment');
  });

  test('should support different layouts', () => {
    const { rerender } = render(
      <CategoryNavigation {...defaultProps} layout="grid" />
    );
    
    expect(screen.getByTestId('category-grid')).toBeInTheDocument();
    
    rerender(<CategoryNavigation {...defaultProps} layout="list" />);
    expect(screen.getByTestId('category-list')).toBeInTheDocument();
  });

  test('should be keyboard navigable', async () => {
    const user = userEvent.setup();
    
    render(<CategoryNavigation {...defaultProps} />);
    
    const firstCategory = screen.getByRole('button', { name: /employment/i });
    firstCategory.focus();
    
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: /housing/i })).toHaveFocus();
  });
});

describe('LegalDisclaimer Component Contract', () => {
  const defaultProps: LegalDisclaimerProps = {
    variant: 'full'
  };

  test('should render disclaimer content', () => {
    render(<LegalDisclaimer {...defaultProps} />);
    
    expect(screen.getByText(/not legal advice/i)).toBeInTheDocument();
    expect(screen.getByText(/consult qualified lawyer/i)).toBeInTheDocument();
  });

  test('should support expandable format', async () => {
    const user = userEvent.setup();
    
    render(<LegalDisclaimer {...defaultProps} variant="compact" />);
    
    const expandButton = screen.getByRole('button', { name: /show full disclaimer/i });
    await user.click(expandButton);
    
    expect(screen.getByText(/full legal disclaimer text/i)).toBeInTheDocument();
  });

  test('should be dismissible when configured', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    
    render(
      <LegalDisclaimer 
        {...defaultProps} 
        isDismissible={true} 
        onClose={onClose}
      />
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  test('should meet accessibility standards', async () => {
    const { container } = render(<LegalDisclaimer {...defaultProps} />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Global Component Accessibility Standards', () => {
  test('all components should support focus management', () => {
    // This test ensures components have proper focus management
    render(
      <div>
        <SearchInterface 
          query="" 
          onQueryChange={jest.fn()} 
          onSearch={jest.fn()} 
        />
        <CategoryNavigation 
          categories={mockCategories} 
          onCategorySelect={jest.fn()} 
        />
      </div>
    );
    
    // At least one element should be focusable (tabindex="0" or no tabindex)
    const interactiveElements = screen.getAllByRole('button');
    const focusableElements = interactiveElements.filter(element => 
      element.getAttribute('tabindex') !== '-1'
    );
    expect(focusableElements.length).toBeGreaterThan(0);
    
    // CategoryNavigation should implement roving focus (one element with tabindex="0")
    const categoryButtons = interactiveElements.filter(element => 
      element.getAttribute('data-category-id')
    );
    if (categoryButtons.length > 0) {
      const focusableCategories = categoryButtons.filter(element => 
        element.getAttribute('tabindex') === '0'
      );
      expect(focusableCategories.length).toBe(1); // Exactly one should be focusable
    }
  });

  test('all components should support high contrast mode', () => {
    // Mock high contrast media query
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-contrast: high)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    
    render(<SearchInterface query="" onQueryChange={jest.fn()} onSearch={jest.fn()} />);
    
    // Component should render without errors in high contrast mode
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  test('all components should support reduced motion preferences', () => {
    // Mock reduced motion media query
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    
    render(<ScenarioDetail scenario={mockScenario} />);
    
    // Component should render without animations when reduced motion is preferred
    expect(screen.getByText('Test Legal Scenario')).toBeInTheDocument();
  });
});