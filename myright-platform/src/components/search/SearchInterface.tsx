/**
 * SearchInterface Component
 * 
 * A comprehensive search interface with autocomplete, accessibility features,
 * and responsive design for the MyRight platform.
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, Loader2, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInterfaceProps } from '@/types/components';
import { AutocompleteSuggestion } from '@/types/search';

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  query = '',
  onQueryChange,
  onSearch,
  isLoading = false,
  placeholder = 'Search for legal rights...',
  showAutocomplete = false,
  suggestions = [],
  filters,
  onFiltersChange,
  showFilters = false,
  className,
  testId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const [localQuery, setLocalQuery] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // Sync local query with prop
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setLocalQuery(newQuery);
    onQueryChange(newQuery);
    
    // Show suggestions if autocomplete is enabled and there's a query
    if (showAutocomplete && newQuery.trim()) {
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [onQueryChange, showAutocomplete]);

  // Handle search submission
  const handleSearch = useCallback((searchQuery?: string) => {
    const queryToSearch = searchQuery ?? localQuery;
    if (filters && Object.keys(filters).length > 0) {
      onSearch(queryToSearch, filters);
    } else {
      onSearch(queryToSearch);
    }
    setShowSuggestions(false);
  }, [localQuery, onSearch, filters]);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  }, [handleSearch]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
          const suggestion = suggestions[activeSuggestionIndex];
          if (suggestion) {
            handleSearch(suggestion.text);
            setLocalQuery(suggestion.text);
            onQueryChange(suggestion.text);
          }
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  }, [showSuggestions, suggestions, activeSuggestionIndex, handleSearch, onQueryChange]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: AutocompleteSuggestion) => {
    setLocalQuery(suggestion.text);
    onQueryChange(suggestion.text);
    handleSearch(suggestion.text);
    setShowSuggestions(false);
  }, [onQueryChange, handleSearch]);

  // Handle input blur with delay to allow suggestion clicks
  const handleInputBlur = useCallback(() => {
    // Delay hiding suggestions to allow clicks on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }, 150);
  }, []);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    if (showAutocomplete && localQuery.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [showAutocomplete, localQuery, suggestions.length]);

  // Clear search
  const handleClear = useCallback(() => {
    setLocalQuery('');
    onQueryChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, [onQueryChange]);

  // Toggle filter panel
  const handleFilterToggle = useCallback(() => {
    setShowFilterPanel(prev => !prev);
  }, []);

  // Generate unique IDs for accessibility
  const searchId = `search-${Math.random().toString(36).substr(2, 9)}`;
  const suggestionsId = `suggestions-${searchId}`;
  const filtersId = `filters-${searchId}`;

  return (
    <div 
      className={cn('relative w-full max-w-2xl mx-auto', className)}
      data-testid={testId}
      {...props}
    >
      <form onSubmit={handleSubmit} className="relative">
        {/* Main search input */}
        <div className="relative flex items-center">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              role={showAutocomplete ? 'combobox' : 'searchbox'}
              id={searchId}
              value={localQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              placeholder={placeholder}
              aria-label={ariaLabel || 'Search for legal rights and scenarios'}
              aria-describedby={ariaDescribedBy}
              aria-expanded={showAutocomplete ? showSuggestions : undefined}
              aria-haspopup={showAutocomplete ? 'listbox' : undefined}
              aria-controls={showAutocomplete && showSuggestions ? suggestionsId : undefined}
              aria-autocomplete={showAutocomplete ? 'list' : undefined}
              disabled={isLoading}
              className={cn(
                'w-full pl-12 pr-16 py-3 text-base',
                'border border-gray-300 rounded-lg',
                'bg-white shadow-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                'transition-all duration-200'
              )}
            />
            
            {/* Search icon */}
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" 
              aria-hidden="true"
            />
            
            {/* Clear button */}
            {localQuery && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className={cn(
                  'absolute right-12 top-1/2 -translate-y-1/2',
                  'p-1 rounded-full hover:bg-gray-100',
                  'text-gray-400 hover:text-gray-600',
                  'transition-colors duration-200'
                )}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Filter toggle button */}
          {showFilters && (
            <button
              type="button"
              onClick={handleFilterToggle}
              aria-label="Toggle search filters"
              aria-expanded={showFilterPanel}
              aria-controls={filtersId}
              className={cn(
                'ml-2 p-3 rounded-lg border',
                'bg-white hover:bg-gray-50',
                'border-gray-300 hover:border-gray-400',
                'text-gray-600 hover:text-gray-800',
                'transition-colors duration-200',
                showFilterPanel && 'bg-blue-50 border-blue-300 text-blue-700'
              )}
            >
              <Filter className="h-5 w-5" />
            </button>
          )}
          
          {/* Search button */}
          <button
            type="submit"
            disabled={isLoading}
            aria-label={isLoading ? 'Searching...' : 'Search'}
            className={cn(
              'ml-2 px-6 py-3 rounded-lg',
              'bg-blue-600 hover:bg-blue-700',
              'text-white font-medium',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:bg-blue-400 disabled:cursor-not-allowed',
              'transition-colors duration-200',
              'flex items-center gap-2'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Autocomplete suggestions */}
        {showAutocomplete && showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            id={suggestionsId}
            role="listbox"
            aria-label="Search suggestions"
            className={cn(
              'absolute top-full left-0 right-0 mt-1 z-50',
              'bg-white border border-gray-200 rounded-lg shadow-lg',
              'max-h-64 overflow-y-auto'
            )}
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.type}-${suggestion.text}`}
                role="option"
                aria-selected={index === activeSuggestionIndex}
                className={cn(
                  'px-4 py-3 cursor-pointer flex items-center justify-between',
                  'hover:bg-gray-50 border-b border-gray-100 last:border-b-0',
                  index === activeSuggestionIndex && 'bg-blue-50 text-blue-900'
                )}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{suggestion.text}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {suggestion.type.replace('_', ' ')} • {suggestion.matchCount} matches
                  </div>
                </div>
                <div className="ml-2 text-xs text-gray-400">
                  {Math.round(suggestion.score * 100)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Filter panel */}
      {showFilters && showFilterPanel && (
        <div
          ref={filterPanelRef}
          id={filtersId}
          className={cn(
            'absolute top-full left-0 right-0 mt-1 z-40',
            'bg-white border border-gray-200 rounded-lg shadow-lg p-4'
          )}
        >
          <div className="text-sm font-medium text-gray-700 mb-3">
            Filter Results
          </div>
          {/* Filter content will be implemented based on specific needs */}
          <div className="text-sm text-gray-500">
            Advanced filtering options coming soon...
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;