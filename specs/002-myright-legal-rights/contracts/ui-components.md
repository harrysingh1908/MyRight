# UI Components Contract

**Component**: React/Next.js Frontend Components  
**Type**: User Interface Specification  
**Purpose**: Define component interfaces for professional, accessible UI

## Core Components

### SearchInterface Component
**Purpose**: Main search entry point with auto-complete and suggestions  
**Constitutional Requirements**: Accessibility first, mobile-optimized

```typescript
interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

interface SearchInterfaceState {
  query: string;
  showSuggestions: boolean;
  selectedSuggestionIndex: number;
}

// Required features
const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSearch,
  isLoading,
  placeholder = "Describe your legal situation...",
  suggestions = [],
  onSuggestionSelect
}) => {
  // Must support:
  // - Real-time auto-complete (debounced)
  // - Keyboard navigation (arrow keys, enter, escape)
  // - Mobile-friendly touch targets (min 44px)
  // - Screen reader compatibility
  // - Loading states with proper ARIA labels
}
```

### SearchResults Component
**Purpose**: Display ranked search results with confidence indicators  
**Requirements**: Clear source attribution, professional presentation

```typescript
interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  confidence: number;
  responseTime: number;
  onResultClick: (scenarioId: string) => void;
  onSourceClick: (sourceUrl: string) => void;
}

interface SearchResultProps {
  result: SearchResult;
  rank: number;
  onResultClick: (scenarioId: string) => void;
  onSourceClick: (sourceUrl: string) => void;
}

// Display requirements
const SearchResult: React.FC<SearchResultProps> = ({ result, rank }) => {
  return (
    <div className="search-result" data-testid={`result-${rank}`}>
      {/* Must include:
          - Scenario title and description
          - Confidence indicator (visual + text)
          - Source attribution clearly visible
          - "View details" call-to-action
          - Responsive design for mobile */}
    </div>
  );
};
```

### ScenarioDetail Component
**Purpose**: Display complete scenario with rights, actions, and sources  
**Requirements**: Source credibility display, action guidance

```typescript
interface ScenarioDetailProps {
  scenario: LegalScenario;
  onRelatedScenarioClick: (scenarioId: string) => void;
  onSourceClick: (sourceUrl: string) => void;
  onBackClick: () => void;
}

const ScenarioDetail: React.FC<ScenarioDetailProps> = ({ scenario }) => {
  return (
    <div className="scenario-detail">
      {/* Required sections:
          1. Scenario description (plain language)
          2. Your Rights section with citations
          3. Action Steps (numbered, clear)
          4. Official Sources (prominent, clickable)
          5. Related Scenarios
          6. Legal disclaimers */}
    </div>
  );
};
```

### CategoryNavigation Component
**Purpose**: Browse legal areas through visual category tiles  
**Requirements**: Inclusive design, clear iconography

```typescript
interface CategoryNavigationProps {
  categories: Category[];
  onCategorySelect: (categoryId: CategoryType) => void;
  selectedCategory?: CategoryType;
}

interface CategoryTileProps {
  category: Category;
  isSelected: boolean;
  onSelect: (categoryId: CategoryType) => void;
}

const CategoryTile: React.FC<CategoryTileProps> = ({ category, onSelect }) => {
  return (
    <button
      className="category-tile"
      onClick={() => onSelect(category.id)}
      aria-label={`Browse ${category.name} legal scenarios`}
    >
      {/* Must include:
          - Visual icon (accessibility friendly)
          - Category name
          - Brief description
          - Scenario count
          - Touch-friendly sizing (min 44px)
          - Clear hover/focus states */}
    </button>
  );
};
```

## Layout Components

### AppLayout Component
**Purpose**: Main application shell with navigation and disclaimers  
**Requirements**: Professional appearance, mobile-first design

```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: PageType;
}

type PageType = 'home' | 'search' | 'scenario' | 'category' | 'about';

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentPage }) => {
  return (
    <div className="app-layout">
      <Header currentPage={currentPage} />
      <main className="main-content" role="main">
        {children}
      </main>
      <LegalDisclaimer />
      <Footer />
    </div>
  );
};
```

### Header Component
**Purpose**: Site navigation and branding  
**Requirements**: Professional branding, accessible navigation

```typescript
interface HeaderProps {
  currentPage: PageType;
  onNavigate?: (page: PageType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  return (
    <header className="site-header" role="banner">
      {/* Must include:
          - MyRight logo/branding
          - Navigation menu (if applicable)
          - Search shortcut
          - Mobile hamburger menu
          - Skip to content link */}
    </header>
  );
};
```

### LegalDisclaimer Component
**Purpose**: Clear information vs advice distinction  
**Requirements**: Visible but not intimidating, constitutional compliance

```typescript
interface LegalDisclaimerProps {
  variant?: 'footer' | 'inline' | 'modal';
  onLearnMore?: () => void;
}

const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ variant = 'footer' }) => {
  return (
    <div className={`legal-disclaimer disclaimer-${variant}`}>
      {/* Required text:
          "This provides legal information, not legal advice. 
           Consult a lawyer for specific situations." 
          
          Must be:
          - Clearly visible but not overwhelming
          - Easy to understand language
          - Link to more detailed terms */}
    </div>
  );
};
```

## Design System Contract

### Typography Standards
```typescript
interface TypographyScale {
  // Professional, readable fonts
  fontFamily: {
    primary: 'Inter, system-ui, sans-serif';    // Clean, professional
    secondary: 'Georgia, serif';                // For emphasis
    mono: 'JetBrains Mono, monospace';         // For citations
  };
  
  // Accessible sizing (minimum 16px base)
  fontSize: {
    xs: '0.75rem';    // 12px - minimal use only
    sm: '0.875rem';   // 14px - secondary text
    base: '1rem';     // 16px - body text minimum
    lg: '1.125rem';   // 18px - comfortable reading
    xl: '1.25rem';    // 20px - headings
    '2xl': '1.5rem';  // 24px - major headings
    '3xl': '2rem';    // 32px - page titles
  };
  
  // Clear hierarchy
  fontWeight: {
    normal: 400;
    medium: 500;
    semibold: 600;
    bold: 700;
  };
}
```

### Color Palette
```typescript
interface ColorPalette {
  // Professional, trustworthy colors
  primary: {
    50: '#f0f9ff';   // Light backgrounds
    500: '#3b82f6';  // Primary actions
    600: '#2563eb';  // Hover states
    900: '#1e3a8a';  // Dark text
  };
  
  // Legal/government inspired
  government: {
    50: '#f8fafc';
    500: '#64748b';  // Official feel
    600: '#475569';
    900: '#0f172a';
  };
  
  // Semantic colors
  success: '#059669';  // Successful actions
  warning: '#d97706';  // Confidence warnings
  error: '#dc2626';    // Broken sources/errors
  
  // Accessibility compliant grays
  gray: {
    50: '#f9fafb';
    100: '#f3f4f6';
    300: '#d1d5db';  // Borders
    500: '#6b7280';  // Secondary text
    700: '#374151';  // Primary text
    900: '#111827';  // Headings
  };
}
```

### Accessibility Standards
```typescript
interface AccessibilityRequirements {
  // WCAG 2.1 AA Compliance
  colorContrast: {
    normalText: 4.5;      // Minimum contrast ratio
    largeText: 3.0;       // 18px+ or bold 14px+
    nonText: 3.0;         // Icons, borders
  };
  
  // Touch targets (mobile-first)
  touchTargets: {
    minimum: '44px';      // iOS/Android standard
    comfortable: '48px';   // Preferred size
    spacing: '8px';       // Between adjacent targets
  };
  
  // Keyboard navigation
  focusIndicators: {
    visible: true;        // Always show focus
    highContrast: true;   // Clear focus rings
    skipLinks: true;      // Skip to main content
  };
  
  // Screen reader support
  semanticMarkup: {
    headings: true;       // Proper h1-h6 hierarchy
    landmarks: true;      // nav, main, aside, footer
    ariaLabels: true;     // Descriptive labels
    altText: true;        // All images
  };
}
```

## Component Performance Contracts

### Loading States
```typescript
interface LoadingStateProps {
  type: 'search' | 'content' | 'sources';
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ type, message }) => {
  // Must provide:
  // - Visual loading indicator
  // - Screen reader announcement
  // - Estimated time if applicable
  // - Cancel option if relevant
};
```

### Error Boundaries
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, onError }) => {
  // Must handle:
  // - Search service failures
  // - Content loading errors  
  // - Network connectivity issues
  // - Graceful degradation options
};
```

## Mobile Optimization Contract

### Responsive Breakpoints
```typescript
interface ResponsiveBreakpoints {
  mobile: '320px';     // Small phones
  tablet: '768px';     // iPads, large phones
  desktop: '1024px';   // Laptops and up
  
  // Mobile-first approach
  // Default styles for mobile
  // Use min-width media queries for larger screens
}
```

### Touch Interactions
```typescript
interface TouchInteractionRequirements {
  // Gesture support
  gestures: {
    swipeBack: boolean;      // Navigate back from scenario
    pullToRefresh: boolean;  // Refresh search results
    tapToExpand: boolean;    // Expand/collapse sections
  };
  
  // Performance
  scrolling: {
    smooth: boolean;         // Smooth scroll behavior
    momentum: boolean;       // iOS momentum scrolling
    virtualizing: boolean;   // For long lists (if needed)
  };
  
  // Feedback
  haptics: boolean;          // Vibration feedback (where supported)
  visualFeedback: boolean;   // Button press animations
}
```

## Testing Contract

### Component Testing Requirements
```typescript
describe('SearchInterface Component', () => {
  test('should handle keyboard navigation', () => {
    render(<SearchInterface onSearch={mockSearch} suggestions={mockSuggestions} />);
    
    // Test arrow key navigation
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'ArrowDown' });
    expect(screen.getByRole('option')).toHaveFocus();
  });
  
  test('should be accessible to screen readers', () => {
    render(<SearchInterface onSearch={mockSearch} />);
    
    expect(screen.getByRole('textbox')).toHaveAccessibleName();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby');
  });
  
  test('should work on touch devices', () => {
    render(<SearchInterface onSearch={mockSearch} />);
    
    // Test touch interactions
    fireEvent.touchStart(screen.getByRole('textbox'));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });
});
```

### Visual Regression Testing
```typescript
// Requirement: All components must maintain visual consistency
describe('Visual Regression', () => {
  test('SearchInterface matches design system', async () => {
    const component = render(<SearchInterface {...defaultProps} />);
    await expect(component).toMatchSnapshot();
  });
  
  test('Components render correctly on mobile', async () => {
    setViewport({ width: 375, height: 667 }); // iPhone SE
    const component = render(<ScenarioDetail scenario={mockScenario} />);
    await expect(component).toMatchSnapshot();
  });
});
```

## Usage Examples

### Search Flow Implementation
```typescript
const SearchPage: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const searchResults = await searchService.search(query);
      setResults(searchResults.results);
    } catch (error) {
      // Error boundary will catch and display error
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AppLayout currentPage="search">
      <SearchInterface 
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      <SearchResults 
        results={results}
        onResultClick={navigateToScenario}
      />
    </AppLayout>
  );
};
```

This contract ensures all UI components meet constitutional requirements for accessibility, professional appearance, and source credibility while providing excellent user experience across all devices.