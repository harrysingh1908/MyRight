/**
 * SearchResults Component
 * 
 * Displays search results with loading states, empty states,
 * and proper accessibility features.
 */

'use client';

import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SearchResultsProps } from '@/types/components';
import { LegalScenario } from '@/types';

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchResponse,
  isLoading,
  error,
  onResultClick,
  onLoadMore,
  hasMore = false,
  pageSize: _pageSize = 10,
  currentPage: _currentPage = 1,
  className,
  testId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  // Handle result click
  const handleResultClick = useCallback((scenario: LegalScenario, position: number) => {
    onResultClick(scenario, position);
  }, [onResultClick]);

  // Handle keyboard navigation on results
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLElement>,
    scenario: LegalScenario,
    position: number
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleResultClick(scenario, position);
    }
  }, [handleResultClick]);

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div 
        className={cn('w-full', className)}
        data-testid="results-loading"
        aria-label="Loading search results"
        {...props}
      >
        <div className="text-center py-4 mb-4">
          <div className="text-gray-600 font-medium">Searching...</div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-white rounded-lg p-6 shadow-sm border">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className={cn('w-full text-center py-8', className)}
        data-testid="results-error"
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 font-medium mb-2">Search Error</div>
          <div className="text-red-700 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  // No results
  if (!searchResponse || !searchResponse.results || searchResponse.results.length === 0) {
    return (
      <div 
        className={cn('w-full text-center py-8', className)}
        data-testid="results-empty"
        aria-label="No search results found"
        {...props}
      >
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="text-gray-500 text-lg font-medium mb-2">
            No results found
          </div>
          <div className="text-gray-600 text-sm">
            Try different keywords or adjust your filters
          </div>
        </div>
      </div>
    );
  }

  const { results, totalMatches, query, searchTime } = searchResponse;

  return (
    <div 
      className={cn('w-full', className)}
      data-testid={testId}
      aria-label={ariaLabel || `${totalMatches} search results for "${query}"`}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {/* Results header */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{totalMatches} result{totalMatches !== 1 ? 's' : ''} found</span>
          {query && (
            <span> for &ldquo;<span className="font-medium text-gray-900">{query}</span>&rdquo;</span>
          )}
          {searchTime && (
            <span className="text-gray-500"> · Search completed in {searchTime}ms</span>
          )}
        </div>
      </div>

      {/* Results list */}
      <div className="space-y-4" role="list" aria-label="Search results">
        {results.map((result, index) => (
          <article
            key={result.scenario.id}
            role="article"
            tabIndex={0}
            className={cn(
              'bg-white rounded-lg border border-gray-200 p-6 shadow-sm',
              'hover:shadow-md hover:border-gray-300 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'transition-all duration-200'
            )}
            onClick={() => handleResultClick(result.scenario, index)}
            onKeyDown={(e) => handleKeyDown(e, result.scenario, index)}
            aria-label={`Search result ${index + 1}: ${result.scenario.title}`}
          >
            {/* Result header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {result.scenario.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="capitalize bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {result.scenario.category}
                  </span>
                  <span>Score: {Math.round(result.score * 100)}%</span>
                  <span>Match: {result.matchType}</span>
                </div>
              </div>
            </div>

            {/* Result description */}
            <div className="text-gray-700 text-sm mb-4 line-clamp-3">
              {result.scenario.description}
            </div>

            {/* Result highlights */}
            {result.highlights && result.highlights.length > 0 && (
              <div className="mb-4">
                {result.highlights.slice(0, 2).map((highlight, highlightIndex) => (
                  <div key={highlightIndex} className="text-sm text-gray-600 mb-1">
                    <span className="text-gray-500 capitalize">{highlight.field}:</span>{' '}
                    <span 
                      dangerouslySetInnerHTML={{ __html: highlight.text }}
                      className="[&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Result metadata */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{result.scenario.rights.length} rights</span>
                <span>{result.scenario.actionSteps.length} action steps</span>
                {result.scenario.severity && (
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    result.scenario.severity === 'critical' && 'bg-red-100 text-red-700',
                    result.scenario.severity === 'high' && 'bg-orange-100 text-orange-700',
                    result.scenario.severity === 'medium' && 'bg-yellow-100 text-yellow-700',
                    result.scenario.severity === 'low' && 'bg-green-100 text-green-700'
                  )}>
                    {result.scenario.severity}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400">
                Click to view details
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load more button */}
      {hasMore && onLoadMore && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            className={cn(
              'px-6 py-3 bg-blue-600 text-white rounded-lg font-medium',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'transition-colors duration-200'
            )}
          >
            Load More Results
          </button>
        </div>
      )}

      {/* Results footer */}
      <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
        Showing {results.length} of {totalMatches} results
        {hasMore && ' · More results available'}
      </div>
    </div>
  );
};

export default SearchResults;