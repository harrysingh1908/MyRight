# Component Library Documentation

## Overview

The MyRight Platform component library is built with React 18, TypeScript, and Tailwind CSS. All components follow accessibility guidelines (WCAG 2.1 AA) and include comprehensive keyboard navigation support.

## Design System

### Color Palette
```css
/* Primary Colors */
--primary-50: #eff6ff;    /* Light blue backgrounds */
--primary-100: #dbeafe;   /* Subtle highlights */
--primary-600: #2563eb;   /* Primary actions */
--primary-700: #1d4ed8;   /* Hover states */

/* Semantic Colors */
--success: #10b981;       /* Success states */
--warning: #f59e0b;       /* Warning states */
--error: #ef4444;         /* Error states */
--info: #3b82f6;          /* Information */
```

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: Menlo, Monaco, monospace

### Spacing
- Uses Tailwind's 4px base unit
- Consistent 8px, 12px, 16px, 24px, 32px spacing

## Search Components

### SearchInterface

The main search input component with autocomplete and filtering capabilities.

#### Props
```typescript
interface SearchInterfaceProps {
  query: string;                    // Current search query
  onQueryChange: (query: string) => void; // Query change handler
  onSearch: (query: string) => void; // Search submit handler
  isLoading?: boolean;              // Loading state
  placeholder?: string;             // Input placeholder
  showAutocomplete?: boolean;       // Show autocomplete dropdown
  suggestions?: AutocompleteSuggestion[]; // Autocomplete suggestions
  filters?: SearchFilters;          // Current filters
  onFiltersChange?: (filters: SearchFilters) => void; // Filter change handler
  showFilters?: boolean;            // Show filter UI
  className?: string;               // Additional CSS classes
  testId?: string;                  // Test identifier
  'aria-label'?: string;            // Accessibility label
  'aria-describedby'?: string;      // Accessibility description
}
```

#### Usage
```tsx
import { SearchInterface } from '@/components/search/SearchInterface';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  return (
    <SearchInterface
      query={query}
      onQueryChange={setQuery}
      onSearch={handleSearch}
      suggestions={suggestions}
      showAutocomplete={true}
      placeholder="Search for legal rights..."
      aria-label="Legal rights search"
    />
  );
}
```

#### Features
- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Screen reader support
- ✅ Debounced input for performance
- ✅ Autocomplete dropdown with highlighting
- ✅ Filter integration
- ✅ Loading states with visual feedback

### SearchResults

Displays search results in a clean, organized layout.

#### Props
```typescript
interface SearchResultsProps {
  searchResponse?: SearchResponse; // Search results data
  isLoading?: boolean;           // Loading state
  onResultClick?: (scenario: LegalScenario, position: number) => void; // Result click handler
  onLoadMore?: () => void;       // Load more handler
  hasMore?: boolean;             // More results available
  className?: string;            // Additional CSS classes
  testId?: string;               // Test identifier
}
```

#### Usage
```tsx
import { SearchResults } from '@/components/search/SearchResults';

function ResultsPage() {
  return (
    <SearchResults
      searchResponse={searchResponse}
      isLoading={isLoading}
      onResultClick={handleResultClick}
      testId="search-results"
    />
  );
}
```

#### Features
- ✅ Responsive grid layout
- ✅ Loading skeletons
- ✅ Empty state messaging
- ✅ Result highlighting
- ✅ Click and keyboard interaction
- ✅ Infinite scroll support

### SearchResult

Individual search result item component.

#### Props
```typescript
interface SearchResultProps {
  result: SearchResult;           // Search result data
  onClick?: (scenario: LegalScenario) => void; // Click handler
  showHighlights?: boolean;       // Show text highlights
  variant?: 'default' | 'compact'; // Display variant
  className?: string;             // Additional CSS classes
}
```

#### Usage
```tsx
import { SearchResult } from '@/components/search/SearchResult';

function ResultItem({ result }: { result: SearchResult }) {
  return (
    <SearchResult
      result={result}
      onClick={handleClick}
      showHighlights={true}
      variant="default"
    />
  );
}
```

## Content Components

### ScenarioDetail

Comprehensive scenario display with expandable sections.

#### Props
```typescript
interface ScenarioDetailProps {
  scenario: LegalScenario;        // Scenario data
  onRightClick?: (right: LegalRight) => void; // Right click handler
  onActionClick?: (action: ActionStep) => void; // Action click handler
  onSourceClick?: (source: LegalSource) => void; // Source click handler
  showRelatedScenarios?: boolean; // Show related scenarios section
  relatedScenarios?: LegalScenario[]; // Related scenarios data
  mode?: 'full' | 'summary';     // Display mode
  className?: string;             // Additional CSS classes
}
```

#### Usage
```tsx
import { ScenarioDetail } from '@/components/content/ScenarioDetail';

function ScenarioPage({ scenario }: { scenario: LegalScenario }) {
  return (
    <ScenarioDetail
      scenario={scenario}
      mode="full"
      showRelatedScenarios={true}
      onSourceClick={handleSourceClick}
    />
  );
}
```

#### Features
- ✅ Collapsible sections (Rights, Actions, Sources)
- ✅ Severity indicators with color coding
- ✅ Time sensitivity warnings
- ✅ Source validation status
- ✅ Print-friendly layout
- ✅ Social sharing integration

## Navigation Components

### CategoryNavigation

Category selection and browsing interface.

#### Props
```typescript
interface CategoryNavigationProps {
  categories: Category[];         // Available categories
  selectedCategory?: string;      // Currently selected category
  onCategorySelect: (categoryId: string) => void; // Selection handler
  showCounts?: boolean;          // Show scenario counts
  layout?: 'horizontal' | 'vertical' | 'grid'; // Layout variant
  className?: string;            // Additional CSS classes
}
```

#### Usage
```tsx
import { CategoryNavigation } from '@/components/navigation/CategoryNavigation';

function Navigation() {
  return (
    <CategoryNavigation
      categories={categories}
      selectedCategory={selectedCategory}
      onCategorySelect={handleCategorySelect}
      layout="horizontal"
      showCounts={true}
    />
  );
}
```

#### Features
- ✅ Multiple layout options
- ✅ Category icons with semantic meaning
- ✅ Scenario count indicators
- ✅ Keyboard navigation
- ✅ Mobile-responsive design

## UI Components

### LegalDisclaimer

Legal disclaimer and terms display.

#### Props
```typescript
interface LegalDisclaimerProps {
  content?: string;               // Disclaimer content
  variant?: 'full' | 'compact' | 'modal'; // Display variant
  isDismissible?: boolean;        // Can be dismissed
  onDismiss?: () => void;        // Dismiss handler
  className?: string;             // Additional CSS classes
}
```

#### Usage
```tsx
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';

function App() {
  return (
    <LegalDisclaimer
      variant="compact"
      isDismissible={true}
      onDismiss={handleDismiss}
    />
  );
}
```

## Accessibility Guidelines

### Keyboard Navigation
All components support full keyboard navigation:

- **Tab/Shift+Tab**: Navigate between elements
- **Enter/Space**: Activate buttons and links
- **Arrow keys**: Navigate within component groups
- **Escape**: Close modals and dropdowns

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Live regions for dynamic content
- Skip links for main content

### Color and Contrast
- WCAG AA color contrast ratios (4.5:1 minimum)
- Color not used as sole indicator
- High contrast mode support

### Focus Management
- Visible focus indicators
- Focus trapping in modals
- Logical focus order
- Focus restoration after interactions

## Performance Optimizations

### Lazy Loading
```tsx
// Lazy load heavy components
const ScenarioDetail = lazy(() => import('./ScenarioDetail'));

function App() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ScenarioDetail scenario={scenario} />
    </Suspense>
  );
}
```

### Memoization
```tsx
// Memoize expensive calculations
const SearchResults = memo(({ searchResponse }: SearchResultsProps) => {
  const processedResults = useMemo(() => 
    processSearchResults(searchResponse?.results), 
    [searchResponse?.results]
  );
  
  return <div>{/* render results */}</div>;
});
```

### Virtual Scrolling
For large result sets, components support virtual scrolling to maintain performance.

## Testing Components

All components include comprehensive test coverage:

### Unit Tests
```typescript
describe('SearchInterface', () => {
  test('should handle query input', () => {
    const onQueryChange = jest.fn();
    render(<SearchInterface query="" onQueryChange={onQueryChange} />);
    
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'employment rights' }
    });
    
    expect(onQueryChange).toHaveBeenCalledWith('employment rights');
  });
});
```

### Integration Tests  
```typescript
describe('Search Flow', () => {
  test('should complete full search workflow', async () => {
    render(<SearchPage />);
    
    // Type query
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'salary dispute' }
    });
    
    // Submit search
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    
    // Verify results
    await waitFor(() => {
      expect(screen.getByText(/results found/i)).toBeInTheDocument();
    });
  });
});
```

## Customization

### Theming
Components support theme customization via CSS custom properties:

```css
:root {
  --primary-color: #2563eb;
  --border-radius: 0.5rem;
  --spacing-unit: 1rem;
}
```

### Custom Styling
All components accept `className` props for additional styling:

```tsx
<SearchInterface
  className="custom-search-styles"
  query={query}
  onQueryChange={setQuery}
/>
```

### Component Variants
Most components support multiple variants for different use cases:

```tsx
// Compact search for mobile
<SearchInterface variant="compact" />

// Summary view for quick preview
<ScenarioDetail mode="summary" />

// Grid layout for categories
<CategoryNavigation layout="grid" />
```