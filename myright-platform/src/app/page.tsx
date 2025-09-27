'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { SearchInterface } from '@/components/search/SearchInterface';
import { SearchResults } from '@/components/search/SearchResults';
import { CategoryNavigation } from '@/components/navigation/CategoryNavigation';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import { SearchService, SearchConfig } from '@/services';
import { SearchRequest, SearchFilters, SearchResponse, AutocompleteSuggestion } from '@/types/search';
import { LegalScenario, Category } from '@/types/content';

export default function Home() {
  const [searchResponse, setSearchResponse] = useState<SearchResponse | undefined>();
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Create services for client-side use
  const searchService = React.useMemo(() => {
    const config: SearchConfig = {
      minScore: 0.3,
      maxResults: 20,
      autocompleteSuggestions: 8,
      enableFuzzyMatch: true,
      keywordBoost: 1.2,
      titleBoost: 1.5,
      enableCategoryFilter: true,
      enableSeverityFilter: true,
    };
    return new SearchService(config);
  }, []);

  useEffect(() => {
    // Set up mock categories for client-side demo
    const mockCategories: Category[] = [
      { 
        id: 'employment', 
        name: 'Employment', 
        description: 'Workplace rights and issues',
        icon: '👔',
        color: '#3B82F6',
        scenarioCount: 5,
        sortOrder: 1,
        isActive: true,
        slug: 'employment',
        keywords: ['work', 'job', 'salary', 'wages']
      },
      { 
        id: 'housing', 
        name: 'Housing', 
        description: 'Rental and property matters',
        icon: '🏠',
        color: '#10B981',
        scenarioCount: 3,
        sortOrder: 2,
        isActive: true,
        slug: 'housing',
        keywords: ['rent', 'landlord', 'tenant', 'property']
      },
      { 
        id: 'consumer', 
        name: 'Consumer', 
        description: 'Product and service issues',
        icon: '🛒',
        color: '#F59E0B',
        scenarioCount: 2,
        sortOrder: 3,
        isActive: true,
        slug: 'consumer',
        keywords: ['product', 'service', 'refund', 'warranty']
      }
    ];
    setCategories(mockCategories);

    // Initialize search service with mock data
    const initializeSearch = async () => {
      // This would normally load from your API or static files
      // For now, we'll use empty data to prevent build errors
      await searchService.loadContent([], {});
    };
    initializeSearch();
  }, [searchService]);

  const handleSearch = useCallback(async (query: string, filters?: SearchFilters) => {
    setIsSearching(true);
    const request: SearchRequest = { query, filters };
    try {
      const results = await searchService.search(request);
      setSearchResponse(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleResultClick = useCallback(async (_scenario: LegalScenario, _position: number) => {
    if (isSearching) return;
    
    try {
      // Handle scenario click navigation
    } catch (error) {
      console.error('Error handling result click:', error);
    }
  }, [isSearching]);

  const handleCategorySelect = useCallback(async (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Trigger search with category filter
    const newFilters = { ...activeFilters, category: categoryId };
    setActiveFilters(newFilters);
    
    if (searchQuery) {
      await handleSearch(searchQuery, newFilters);
    }
  }, [searchQuery, activeFilters, handleSearch]);

  const handleQueryChange = (newQuery: string) => {
    setSearchQuery(newQuery);
  };

  const handleFilterChange = useCallback((filters: SearchFilters) => {
    setActiveFilters(filters);
    if (searchQuery) {
      handleSearch(searchQuery, filters);
    }
  }, [searchQuery, handleSearch]);

  const handleAutocomplete = async (query: string) => {
    if (query.length > 2) {
      const response = await searchService.autocomplete({ query });
      setAutocompleteSuggestions(response.suggestions);
    } else {
      setAutocompleteSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                MyRight
              </h1>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Legal Rights Platform
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Legal Disclaimer */}
      {showDisclaimer && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LegalDisclaimer
              variant="banner"
              isDismissible={true}
              onClose={() => setShowDisclaimer(false)}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Categories
              </h2>
              <CategoryNavigation
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                layout="sidebar"
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Search Interface */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <SearchInterface
                query={searchQuery}
                onQueryChange={(q) => {
                  handleQueryChange(q);
                  handleAutocomplete(q);
                }}
                onSearch={handleSearch}
                isLoading={isSearching}
                placeholder="Search for legal rights..."
                showAutocomplete={true}
                suggestions={autocompleteSuggestions}
                filters={activeFilters}
                onFiltersChange={handleFilterChange}
                showFilters={true}
                className="w-full max-w-4xl"
                testId="search-interface"
              />
            </div>

            {/* Search Results or Welcome Message */}
            {searchQuery ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <SearchResults
                  searchResponse={searchResponse}
                  isLoading={isSearching}
                  onResultClick={handleResultClick}
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">⚖️</div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Know Your Rights
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Search for legal scenarios and understand your rights in various situations.
                    Select a category above or describe your situation to get started.
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    💡 Try searching for &ldquo;unpaid wages&rdquo;, &ldquo;tenant rights&rdquo;, or &ldquo;workplace harassment&rdquo;
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
