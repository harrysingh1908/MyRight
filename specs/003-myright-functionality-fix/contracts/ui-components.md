# UI Components Contract

**Components**: SearchInterface, SearchResults, CategoryNavigation, ScenarioDetail  
**Purpose**: User interface component behavior and integration contracts  
**Date**: 2025-09-27

## SearchInterface Component Contract

**Purpose**: Primary search input interface with autocomplete and suggestions

### Props Contract
```typescript
interface SearchInterfaceProps {
  onSearch: (query: string, filters: SearchFilters) => void;    // Required: Search callback
  onFilterChange: (filters: SearchFilters) => void;            // Required: Filter update callback  
  initialQuery?: string;                                       // Optional: Pre-populated search
  placeholder?: string;                                        // Optional: Input placeholder text
  isLoading?: boolean;                                         // Optional: Loading state display
  suggestions?: QuerySuggestion[];                             // Optional: Popular search suggestions
  autoFocus?: boolean;                                         // Optional: Auto-focus on mount
}
```

### Behavior Contract
- **Search Input**: Accepts text input with real-time validation (1-200 chars)
- **Autocomplete**: Shows suggestions after 2+ characters typed, debounced 300ms
- **Search Execution**: Triggers onSearch callback on Enter key or search button click
- **Filter UI**: Provides category checkboxes and urgency level selector
- **Keyboard Navigation**: Full keyboard accessibility for all interactions
- **Mobile Responsive**: Touch-friendly interface with appropriate input sizing

### State Management
```typescript
interface SearchInterfaceState {
  query: string;                    // Current search input value
  filters: SearchFilters;           // Active search filters
  showAutocomplete: boolean;        // Autocomplete visibility
  autocompleteSuggestions: AutocompleteSuggestion[];  // Current suggestions
  isValid: boolean;                 // Query validation status
}
```

### Integration Requirements
- Must integrate with SearchService.autocomplete() for suggestions
- Must handle SearchService.search() loading states appropriately  
- Must preserve search state during navigation
- Must work with URL parameters for shareable search links

## SearchResults Component Contract

**Purpose**: Display search results with ranking, highlighting, and interaction

### Props Contract
```typescript
interface SearchResultsProps {
  results: SearchResult[];                                     // Required: Search results array
  query: string;                                              // Required: Original search query
  totalCount: number;                                         // Required: Total available results
  isLoading?: boolean;                                        // Optional: Loading state
  onResultClick: (scenarioId: string) => void;               // Required: Result selection callback
  onLoadMore?: () => void;                                    // Optional: Pagination callback
  showConfidence?: boolean;                                   // Optional: Show relevance scores
}
```

### Behavior Contract
- **Result Display**: Shows results as cards with title, summary, confidence score
- **Highlighting**: Highlights matched search terms in result text
- **Ranking Indicators**: Visual indicators for semantic vs keyword matches
- **Urgency Signals**: Color coding or icons for high/medium/low urgency scenarios
- **Result Actions**: Click handling for scenario navigation
- **Load More**: Pagination for results beyond initial batch (10 results)

### Result Card Layout
```typescript
interface ResultCardContent {
  title: string;                    // Scenario title with search term highlighting
  summary: string;                  // Description excerpt (150 chars max)
  category: string;                 // Legal category with icon
  confidence: number;               // Relevance score (0-100)
  urgencyLevel: 'low' | 'medium' | 'high';  // Visual urgency indicator
  matchType: 'semantic' | 'keyword' | 'category';  // Match type badge
  actionPreview: string[];          // First 2 action steps preview
}
```

### Empty State Handling
- **No Results**: Helpful message with search suggestions and category links
- **Loading State**: Skeleton loading cards maintaining layout
- **Error State**: Clear error message with retry option

## CategoryNavigation Component Contract

**Purpose**: Legal category browsing and filtering interface

### Props Contract
```typescript
interface CategoryNavigationProps {
  categories: Category[];                                      // Required: Available categories
  selectedCategories: string[];                               // Required: Active category filters
  onCategorySelect: (categoryId: string) => void;            // Required: Selection callback
  onCategoryDeselect: (categoryId: string) => void;          // Required: Deselection callback
  layout?: 'grid' | 'list' | 'tabs';                        // Optional: Display layout
  showCounts?: boolean;                                       // Optional: Show scenario counts
}
```

### Behavior Contract
- **Category Display**: Visual cards with icons, names, descriptions, scenario counts
- **Multi-Select**: Allow multiple category selection for filtering
- **Visual Feedback**: Clear selected/unselected states with accessibility
- **Category Info**: Hover/tap shows category description and example scenarios
- **Responsive Layout**: Grid on desktop, vertical list on mobile
- **Keyboard Navigation**: Tab navigation through all categories

### Category Card Layout
```typescript
interface CategoryCardContent {
  icon: string;                     // Category icon (emoji or icon class)
  name: string;                     // Category display name
  description: string;              // Brief category explanation
  scenarioCount: number;            // Number of available scenarios
  color: string;                    // Theme color for visual consistency
  examples: string[];               // 2-3 example scenario titles
}
```

### Selection States
- **Unselected**: Default state with standard styling
- **Selected**: Highlighted state with checkmark or border
- **Disabled**: Grayed out when no scenarios available
- **Loading**: Skeleton state during content loading

## ScenarioDetail Component Contract

**Purpose**: Complete legal scenario information display with actions

### Props Contract
```typescript
interface ScenarioDetailProps {
  scenario: LegalScenario;                                    // Required: Complete scenario data
  onRelatedScenarioClick: (scenarioId: string) => void;     // Required: Related scenario navigation
  onSourceClick: (sourceUrl: string) => void;               // Required: Government source link handler
  showBreadcrumbs?: boolean;                                 // Optional: Navigation breadcrumbs
  expandable?: boolean;                                      // Optional: Collapsible sections
}
```

### Behavior Contract
- **Structured Display**: Clear sections for rights, actions, sources, related content
- **Government Sources**: Clickable links to official sources with validation status
- **Action Steps**: Numbered, actionable instructions with difficulty indicators
- **Legal Disclaimers**: Prominent but non-intrusive legal information disclaimers
- **Related Scenarios**: Navigation to similar or related legal situations
- **Mobile Optimization**: Readable text sizing and touch-friendly interactions

### Content Layout Structure
```typescript
interface ScenarioDetailLayout {
  header: {
    title: string;                  // Scenario title
    category: string;               // Category with icon
    lastUpdated: Date;              // Content freshness indicator
    urgencyIndicator: string;       // Visual urgency level
  };
  
  rights: LegalRightDisplay[];      // Individual rights with sources
  actionSteps: ActionStepDisplay[]; // Step-by-step guidance
  sources: SourceLinkDisplay[];     // Government source links
  relatedScenarios: RelatedScenarioDisplay[];  // Navigation to related content
  disclaimer: DisclaimerDisplay;    // Legal disclaimer section
}
```

### Interactive Elements
- **Expandable Sections**: Collapsible rights and action details for mobile
- **Copy Action Steps**: Copy individual steps or entire action plan
- **Share Scenario**: Share specific scenario via URL or social media
- **Print Friendly**: CSS optimized layout for printing legal information
- **Bookmark**: Save scenario for offline access (PWA feature)

## Component Integration Contract

### Search Flow Integration
```typescript
// Complete search flow between components
const handleSearchFlow = (query: string, filters: SearchFilters) => {
  // 1. SearchInterface triggers search
  setIsSearching(true);
  
  // 2. SearchService processes query
  const response = await searchService.search({ query, filters });
  
  // 3. SearchResults displays results
  setSearchResponse(response);
  setIsSearching(false);
  
  // 4. User clicks result -> ScenarioDetail loads
  const handleResultClick = (scenarioId: string) => {
    const scenario = await contentService.getScenario(scenarioId);
    setActiveScenario(scenario);
  };
};
```

### Category Flow Integration  
```typescript
// Category browsing flow
const handleCategoryFlow = (categoryId: string) => {
  // 1. CategoryNavigation triggers category selection
  setSelectedCategory(categoryId);
  
  // 2. ContentService loads category scenarios
  const scenarios = await contentService.getByCategory(categoryId);
  
  // 3. SearchResults displays filtered results
  setFilteredResults(scenarios.map(scenario => ({
    scenario,
    confidence: 100,
    matchType: 'category'
  })));
};
```

## Testing Requirements

### Component Testing
```typescript
describe('UI Components Contract', () => {
  test('SearchInterface handles user input and triggers search', async () => {
    const onSearch = jest.fn();
    render(<SearchInterface onSearch={onSearch} />);
    
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'salary issues' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onSearch).toHaveBeenCalledWith('salary issues', expect.any(Object));
  });

  test('SearchResults displays results with correct highlighting', () => {
    const results = [mockSearchResult];
    render(<SearchResults results={results} query="salary" />);
    
    expect(screen.getByText(/salary/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
  });

  test('CategoryNavigation allows multi-select filtering', () => {
    const onSelect = jest.fn();
    const categories = [mockEmploymentCategory, mockConsumerCategory];
    render(<CategoryNavigation categories={categories} onCategorySelect={onSelect} />);
    
    fireEvent.click(screen.getByText('Employment'));
    expect(onSelect).toHaveBeenCalledWith('employment');
  });

  test('ScenarioDetail displays complete legal information', () => {
    const scenario = mockLegalScenario;
    render(<ScenarioDetail scenario={scenario} />);
    
    expect(screen.getByText(scenario.title)).toBeInTheDocument();
    expect(screen.getByText(/government sources/i)).toBeInTheDocument();
    expect(screen.getByText(/action steps/i)).toBeInTheDocument();
  });
});
```

### Integration Testing
- Search flow: Input → Results → Detail navigation
- Category flow: Category select → Filtered results → Detail view
- Mobile responsiveness across all components
- Keyboard navigation and accessibility compliance
- Error handling and loading states

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML structure  
- **Color Contrast**: Minimum 4.5:1 contrast ratio for all text elements
- **Focus Management**: Clear focus indicators and logical tab order
- **Alternative Text**: Meaningful descriptions for icons and images

### Mobile Accessibility
- **Touch Targets**: Minimum 44px touch target size for all interactive elements
- **Text Sizing**: Readable text at standard mobile zoom levels (16px+ base size)
- **Gesture Support**: Standard mobile gestures for navigation and interaction
- **Voice Search**: Integration with device voice input capabilities

This UI contract ensures consistent, accessible, and functional user interfaces that integrate seamlessly with the legal content and search services.