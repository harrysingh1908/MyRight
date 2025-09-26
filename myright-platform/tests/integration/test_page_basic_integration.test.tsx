/**
 * Basic Page Integration Test
 * 
 * Tests the main page components work together without complex service calls
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';

// Mock the services to avoid real API calls
jest.mock('@/services/searchService', () => ({
  searchService: {
    search: jest.fn().mockResolvedValue({
      results: [],
      totalResults: 0,
      executionTime: 50,
      query: 'test'
    }),
  },
}));

jest.mock('@/services/contentService', () => ({
  contentService: {
    getScenario: jest.fn().mockResolvedValue(null),
  },
}));

describe('Home Page Basic Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the home page with all components', () => {
    render(<Home />);
    
    // Check header elements
    expect(screen.getByText('MyRight')).toBeInTheDocument();
    expect(screen.getByText('Legal Rights Platform')).toBeInTheDocument();
    
    // Check search interface
    expect(screen.getByPlaceholderText('Describe your legal situation...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    
    // Check categories section
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Employment')).toBeInTheDocument();
    expect(screen.getByText('Housing')).toBeInTheDocument();
    
    // Check welcome message
    expect(screen.getByText('Know Your Rights')).toBeInTheDocument();
    expect(screen.getByText(/Search for legal scenarios/)).toBeInTheDocument();
  });

  it('should allow typing in search input', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Describe your legal situation...');
    await user.type(searchInput, 'employment issue');
    
    expect(searchInput).toHaveValue('employment issue');
  });

  it('should handle category selection', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // Click on Employment category
    const employmentCategory = screen.getByText('Employment');
    await user.click(employmentCategory);
    
    // Should trigger search functionality (mocked)
    // Component should handle the click without errors
    expect(employmentCategory).toBeInTheDocument();
  });

  it('should allow dismissing legal disclaimer', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    // Should show disclaimer initially
    expect(screen.getByText(/This information is not legal advice/)).toBeInTheDocument();
    
    // Find and click dismiss button
    const dismissButton = screen.getByRole('button', { name: /close disclaimer/i });
    await user.click(dismissButton);
    
    // Disclaimer should be gone
    expect(screen.queryByText(/This information is not legal advice/)).not.toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const user = userEvent.setup();
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Describe your legal situation...');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    
    await user.type(searchInput, 'salary not paid');
    await user.click(searchButton);
    
    // Should not crash and should handle the search
    expect(searchInput).toHaveValue('salary not paid');
  });
});