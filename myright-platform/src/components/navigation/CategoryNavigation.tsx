/**
 * CategoryNavigation Component
 * 
 * Displays categories in various layouts with keyboard navigation,
 * icons, counts, and accessibility features.
 */

'use client';

import React, { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { CategoryNavigationProps } from '@/types/components';
import { Category } from '@/types/content';

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  layout = 'grid',
  showCounts = false,
  showDescriptions = false,
  gridColumns = 3,
  className,
  testId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string) => {
    onCategorySelect(categoryId);
  }, [onCategorySelect]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, categoryId: string) => {
    if (!containerRef.current) return;

    const buttons = Array.from(containerRef.current.querySelectorAll('button[data-category-id]')) as HTMLButtonElement[];
    const currentIndex = buttons.findIndex(btn => btn.getAttribute('data-category-id') === categoryId);
    
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = buttons.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleCategorySelect(categoryId);
        return;
    }

    if (nextIndex !== currentIndex && buttons[nextIndex]) {
      buttons[nextIndex]?.focus();
    }
  }, [handleCategorySelect]);

  // Sort categories by sortOrder
  const sortedCategories = [...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Render category button
  const renderCategoryButton = (category: Category, index: number) => {
    const isSelected = selectedCategory === category.id;
    
    return (
      <button
        key={category.id}
        data-category-id={category.id}
        onClick={() => handleCategorySelect(category.id)}
        onKeyDown={(e) => handleKeyDown(e, category.id)}
        className={cn(
          'group relative flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200',
          'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          isSelected 
            ? 'bg-blue-50 border-blue-300 text-blue-900' 
            : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900',
          layout === 'list' && 'flex-row justify-start text-left space-x-4 w-full',
          layout === 'tabs' && 'flex-row space-x-2 border-b-2 border-t-0 border-x-0 rounded-none px-6 py-3',
          layout === 'sidebar' && 'w-full justify-start text-left'
        )}
        aria-label={`${category.name} category${showCounts ? `, ${category.scenarioCount} scenarios` : ''}`}
        aria-pressed={isSelected}
        tabIndex={index === 0 ? 0 : -1}
      >
        {/* Icon */}
        <div className={cn(
          'text-2xl mb-2',
          layout === 'list' && 'mb-0 text-xl',
          layout === 'tabs' && 'mb-0 text-lg',
          layout === 'sidebar' && 'mb-0 text-lg'
        )}>
          {category.icon}
        </div>

        {/* Content */}
        <div className={cn(
          'flex flex-col items-center text-center',
          layout === 'list' && 'items-start text-left flex-1',
          layout === 'tabs' && 'items-center',
          layout === 'sidebar' && 'items-start text-left flex-1 ml-3'
        )}>
          {/* Name */}
          <div className={cn(
            'font-medium',
            layout === 'grid' && 'text-sm',
            layout === 'list' && 'text-base',
            layout === 'tabs' && 'text-sm font-semibold',
            layout === 'sidebar' && 'text-sm'
          )}>
            {category.name}
          </div>

          {/* Description */}
          {showDescriptions && category.description && (
            <div className={cn(
              'text-xs text-gray-500 mt-1 line-clamp-2',
              layout === 'tabs' && 'hidden'
            )}>
              {category.description}
            </div>
          )}

          {/* Count */}
          {showCounts && category.scenarioCount !== undefined && (
            <div className={cn(
              'text-xs font-medium px-2 py-1 rounded-full mt-2',
              isSelected 
                ? 'bg-blue-200 text-blue-800' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200',
              layout === 'list' && 'mt-1',
              layout === 'tabs' && 'ml-2 mt-0',
              layout === 'sidebar' && 'mt-1'
            )}>
              {category.scenarioCount}
            </div>
          )}
        </div>

        {/* Selected indicator for tabs layout */}
        {layout === 'tabs' && isSelected && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
        )}
      </button>
    );
  };

  // Get container classes based on layout
  const getContainerClasses = () => {
    switch (layout) {
      case 'grid':
        return cn(
          'grid gap-4',
          `grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(gridColumns, categories.length)}`
        );
      case 'list':
        return 'flex flex-col space-y-2';
      case 'tabs':
        return 'flex flex-wrap border-b border-gray-200 -mb-px';
      case 'sidebar':
        return 'flex flex-col space-y-1';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';
    }
  };

  // Get test ID based on layout
  const getTestId = () => {
    if (testId) return testId;
    return `category-${layout}`;
  };

  return (
    <nav
      ref={containerRef}
      className={cn('w-full', className)}
      data-testid={getTestId()}
      aria-label={ariaLabel || 'Category navigation'}
      aria-describedby={ariaDescribedBy}
      role="navigation"
      {...props}
    >
      {/* Navigation title for screen readers */}
      <h2 className="sr-only">Browse by Category</h2>

      {/* Categories container */}
      <div className={getContainerClasses()}>
        {sortedCategories.map((category, index) => 
          renderCategoryButton(category, index)
        )}
      </div>

      {/* Categories count */}
      {showCounts && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          {categories.length} categories • {categories.reduce((total, cat) => total + (cat.scenarioCount || 0), 0)} total scenarios
        </div>
      )}
    </nav>
  );
};

export default CategoryNavigation;