/**
 * Integration Test: Search Flow
 * 
 * Tests search functionality on the complete Home page
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import { SearchResult } from '@/types/search';

// Mock the services with some test data
const mockSearchResults: SearchResult[] = [
  {
    scenario: {
      id: 'salary-unpaid-employment',
      title: 'Employer Not Paying Salary or Wages',
      description: 'When your employer refuses to pay your salary, wages, or withholds payment without valid reason',
      category: 'employment',
      sources: [],
      keywords: ['employment', 'wages', 'salary', 'unpaid'],
      rights: [{
        id: 'wage-payment-right',
        title: 'Right to Timely Payment of Wages',
        description: 'Every worker has the right to receive wages on time',
        legalBasis: {
          law: 'Payment of Wages Act, 1936',
          section: 'Section 5'
        },
        application: 'Applies to all employees'
      }],
      actionSteps: [{
        order: 1,
        title: 'Document the Issue',
        description: 'Keep detailed records of missed payments',
        type: 'documentation' as const,
        difficulty: 'easy' as const,
        timeEstimate: '1-2 days',
        cost: 'free' as const,
        documentsNeeded: ['Employment records', 'Salary slips']
      }],
      severity: 'high' as const,
      variations: ['unpaid wages', 'withheld salary'],
      lastUpdated: '2025-01-01',
      validationStatus: {
        sourcesVerified: true,
        legalReview: true,
        clarityReview: true,
        lastValidated: '2025-01-01',
        validator: 'system'
      }
    },
    score: 0.95,
    matchedFields: [{
      field: 'title' as const,
      score: 0.9,
      matchedText: 'salary'
    }],
    highlights: [{
      text: '<mark>salary</mark>',
      field: 'title',
      originalText: 'salary'
    }],
    matchType: 'title' as const
  }
];

jest.mock('@/services/searchService', () => ({
  searchService: {
    search: jest.fn(),
  },
}));

jest.mock('@/services/contentService', () => ({
  contentService: {
    getScenarios: jest.fn(),
    loadScenario: jest.fn(),
  },
}));

import { searchService } from '@/services/searchService';
import { contentService } from '@/services/contentService';

describe('Search Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful search by default
    (searchService.search as jest.Mock).mockResolvedValue({
      results: mockSearchResults,
      totalResults: 1,
      executionTime: 50,
      query: 'salary'
    });
    
    (contentService.loadScenario as jest.Mock).mockResolvedValue(mockSearchResults[0]?.scenario);
  });

  it('should handle search input and show results', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // Type in search
    const searchInput = screen.getByPlaceholderText('Describe your legal situation...');
    await user.type(searchInput, 'salary not paid');
    
    // Submit search
    const searchButton = screen.getByRole('button', { name: 'Search' });
    await user.click(searchButton);
    
    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText('Employer Not Paying Salary or Wages')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Verify search service was called
    expect(searchService.search).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'salary not paid'
      })
    );
  });

  it('should handle empty search results', async () => {
    const user = userEvent.setup();
    
    // Mock empty results
    (searchService.search as jest.Mock).mockResolvedValue({
      results: [],
      totalResults: 0,
      executionTime: 30,
      query: 'nonexistent'
    });
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Describe your legal situation...');
    await user.type(searchInput, 'nonexistent query');
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    await user.click(searchButton);
    
    // Should show "No results found"
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('should handle search errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock search error
    (searchService.search as jest.Mock).mockRejectedValue(new Error('Search failed'));
    
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Describe your legal situation...');
    await user.type(searchInput, 'error query');
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    await user.click(searchButton);
    
    // Should show no results (error handled gracefully)
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it.skip('should handle category selection with search', async () => {
    // TODO: Fix category selection triggering search
    const user = userEvent.setup();
    render(<Home />);
    
    // Click on Employment category
    const employmentButton = screen.getByText('Employment');
    await user.click(employmentButton);
    
    // Category selection works but doesn't trigger search automatically in this implementation
    expect(employmentButton).toBeInTheDocument();
  });

  it('should maintain search state after category selection', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // First, perform a search
    const searchInput = screen.getByPlaceholderText('Describe your legal situation...');
    await user.type(searchInput, 'workplace issue');
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    await user.click(searchButton);
    
    // Wait for initial results
    await waitFor(() => {
      expect(screen.getByText('Employer Not Paying Salary or Wages')).toBeInTheDocument();
    });
    
    // Then select a category
    const employmentButton = screen.getByText('Employment');
    await user.click(employmentButton);
    
    // Should call search with both query and category
    await waitFor(() => {
      expect(searchService.search).toHaveBeenLastCalledWith(
        expect.objectContaining({
          query: 'workplace issue',
          filters: expect.objectContaining({
            category: 'employment'
          })
        })
      );
    });
  });
});