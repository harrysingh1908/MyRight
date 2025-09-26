'use client';

import React, { useState, useCallback } from 'react';
import { SearchInterface } from '@/components/search/SearchInterface';
import { SearchResults } from '@/components/search/SearchResults';
import { CategoryNavigation } from '@/components/navigation/CategoryNavigation';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import { searchService } from '@/services/searchService';
import { SearchRequest, SearchFilters, SearchResponse } from '@/types/search';
import { LegalScenario, Category } from '@/types/content';

export default function Home() {
  const [searchResponse, setSearchResponse] = useState<SearchResponse | undefined>();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Sample categories for navigation
  const categories: Category[] = [
    { 
      id: 'employment', 
      name: 'Employment', 
      description: 'Workplace rights and issues', 
      scenarioCount: 15, 
      count: 15, 
      icon: '💼', 
      color: '#3B82F6',
      sortOrder: 1,
      isActive: true,
      slug: 'employment',
      keywords: ['work', 'job', 'salary', 'workplace', 'employment']
    },
    { 
      id: 'housing', 
      name: 'Housing', 
      description: 'Tenant and housing rights', 
      scenarioCount: 12, 
      count: 12, 
      icon: '🏠', 
      color: '#10B981',
      sortOrder: 2,
      isActive: true,
      slug: 'housing',
      keywords: ['rent', 'tenant', 'landlord', 'housing', 'eviction']
    },
    { 
      id: 'consumer', 
      name: 'Consumer', 
      description: 'Consumer protection', 
      scenarioCount: 8, 
      count: 8, 
      icon: '🛒', 
      color: '#F59E0B',
      sortOrder: 3,
      isActive: true,
      slug: 'consumer',
      keywords: ['purchase', 'refund', 'warranty', 'consumer', 'product']
    },
    { 
      id: 'family', 
      name: 'Family', 
      description: 'Family law matters', 
      scenarioCount: 10, 
      count: 10, 
      icon: '👨‍👩‍👧‍👦', 
      color: '#EF4444',
      sortOrder: 4,
      isActive: true,
      slug: 'family',
      keywords: ['family', 'child', 'custody', 'divorce', 'marriage']
    },
    { 
      id: 'digital', 
      name: 'Digital', 
      description: 'Digital rights and privacy', 
      scenarioCount: 6, 
      count: 6, 
      icon: '💻', 
      color: '#8B5CF6',
      sortOrder: 5,
      isActive: true,
      slug: 'digital',
      keywords: ['privacy', 'data', 'digital', 'online', 'internet']
    },
    { 
      id: 'police', 
      name: 'Police', 
      description: 'Police interactions', 
      scenarioCount: 5, 
      count: 5, 
      icon: '👮', 
      color: '#6B7280',
      sortOrder: 6,
      isActive: true,
      slug: 'police',
      keywords: ['police', 'arrest', 'rights', 'law enforcement', 'stop']
    },
  ];

  const handleSearch = useCallback(async (query: string, filters?: SearchFilters) => {
    setIsSearching(true);
    setSearchQuery(query);
    
    try {
      const request: SearchRequest = {
        query,
        filters: filters || activeFilters,
        pagination: { page: 1, pageSize: 20 }
      };
      const results = await searchService.search(request);
      setSearchResponse(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResponse(undefined);
    } finally {
      setIsSearching(false);
    }
  }, [activeFilters]);

  const handleResultClick = useCallback(async (scenario: LegalScenario, position: number) => {
    // Handle result click - could navigate to detail page or show modal
    console.log('Clicked scenario:', scenario.id, 'at position:', position);
    // For now, just log - in a full app this would navigate to a detail page
  }, []);

  const handleCategorySelect = useCallback(async (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Trigger search with category filter
    const newFilters = { ...activeFilters, category: categoryId };
    setActiveFilters(newFilters);
    
    if (searchQuery) {
      await handleSearch(searchQuery, newFilters);
    }
  }, [searchQuery, activeFilters, handleSearch]);

  const handleQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFiltersChange = useCallback((filters: SearchFilters) => {
    setActiveFilters(filters);
    if (searchQuery) {
      handleSearch(searchQuery, filters);
    }
  }, [searchQuery, handleSearch]);

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
                onQueryChange={handleQueryChange}
                onSearch={handleSearch}
                onFiltersChange={handleFiltersChange}
                isLoading={isSearching}
                placeholder="Describe your legal situation..."
                showFilters={true}
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
                    💡 Try searching for "unpaid wages", "tenant rights", or "workplace harassment"
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
