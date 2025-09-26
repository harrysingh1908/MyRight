/**
 * SearchResult Component
 * 
 * Displays individual search result with different variants,
 * highlighting support, and accessibility features.
 */

'use client';

import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SearchResultProps } from '@/types/components';

export const SearchResult: React.FC<SearchResultProps> = ({
  result,
  position,
  onClick,
  showHighlights = false,
  showScore = true,
  variant = 'default',
  className,
  testId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  // Handle click
  const handleClick = useCallback(() => {
    onClick(result.scenario, position);
  }, [onClick, result.scenario, position]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  // Get variant-specific test ID
  const getTestId = () => {
    if (testId) return testId;
    return `result-${variant}`;
  };

  // Render title with optional highlights
  const renderTitle = () => {
    if (showHighlights && result.highlights) {
      const titleHighlight = result.highlights.find(h => h.field === 'title');
      if (titleHighlight) {
        return (
          <span 
            dangerouslySetInnerHTML={{ __html: titleHighlight.text }}
            className="[&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded [&_mark]:font-medium"
          />
        );
      }
    }
    return result.scenario.title;
  };

  // Render description with optional highlights
  const renderDescription = () => {
    if (showHighlights && result.highlights) {
      const descHighlight = result.highlights.find(h => h.field === 'description');
      if (descHighlight) {
        return (
          <span 
            dangerouslySetInnerHTML={{ __html: descHighlight.text }}
            className="[&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded [&_mark]:font-medium"
          />
        );
      }
    }
    return result.scenario.description;
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div
        data-testid={getTestId()}
        role="article"
        tabIndex={0}
        className={cn(
          'bg-white border border-gray-200 rounded-lg p-4 cursor-pointer',
          'hover:shadow-md hover:border-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-200',
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || `Search result: ${result.scenario.title}`}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {renderTitle()}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                {result.scenario.category}
              </span>
              {showScore && (
                <span className="text-xs text-gray-500">
                  Score: {Math.round(result.score * 100)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant
  if (variant === 'detailed') {
    return (
      <div
        data-testid={getTestId()}
        role="article"
        tabIndex={0}
        className={cn(
          'bg-white border border-gray-200 rounded-lg p-6 cursor-pointer',
          'hover:shadow-md hover:border-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-all duration-200',
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || `Search result: ${result.scenario.title}`}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {renderTitle()}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <span className="capitalize bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {result.scenario.category}
              </span>
              {showScore && (
                <span>Score: {Math.round(result.score * 100)}%</span>
              )}
              <span>Match: {result.matchType}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-gray-700 mb-4">
          {renderDescription()}
        </div>

        {/* Rights preview */}
        {result.scenario.rights && result.scenario.rights.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Your Rights:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {result.scenario.rights.slice(0, 2).map((right, index) => (
                <li key={index}>{right.title}</li>
              ))}
              {result.scenario.rights.length > 2 && (
                <li className="text-gray-500">
                  +{result.scenario.rights.length - 2} more rights
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Highlights */}
        {showHighlights && result.highlights && result.highlights.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Matches:</h4>
            <div className="space-y-1">
              {result.highlights.slice(0, 3).map((highlight, index) => (
                <div key={index} className="text-sm text-gray-600">
                  <span className="text-gray-500 capitalize font-medium">
                    {highlight.field}:
                  </span>{' '}
                  <span 
                    dangerouslySetInnerHTML={{ __html: highlight.text }}
                    className="[&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded [&_mark]:font-medium"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      data-testid={getTestId()}
      role="article"
      tabIndex={0}
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-5 cursor-pointer',
        'hover:shadow-md hover:border-gray-300',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'transition-all duration-200',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || `Search result: ${result.scenario.title}`}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {renderTitle()}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="capitalize bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              {result.scenario.category}
            </span>
            {showScore && (
              <span>Score: {Math.round(result.score * 100)}%</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-gray-700 text-sm mb-3 line-clamp-2">
        {renderDescription()}
      </div>

      {/* Highlights - only show non-title highlights to avoid duplicates */}
      {showHighlights && result.highlights && result.highlights.length > 0 && (
        <div className="mb-3">
          {result.highlights.filter(h => h.field !== 'title').slice(0, 2).map((highlight, index) => (
            <div key={index} className="text-sm text-gray-600 mb-1">
              <span className="text-gray-500 capitalize">
                {highlight.field}:
              </span>{' '}
              <span 
                dangerouslySetInnerHTML={{ __html: highlight.text }}
                className="[&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded"
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{result.scenario.rights.length} rights</span>
          <span>{result.scenario.actionSteps.length} steps</span>
        </div>
        <div className="text-xs text-gray-400">
          Click to view
        </div>
      </div>
    </div>
  );
};

export default SearchResult;