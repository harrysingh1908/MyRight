/**
 * Component prop types for MyRight platform React components
 * 
 * These interfaces define the contracts for all UI components,
 * ensuring type safety and consistent API design.
 */

import { ReactNode } from 'react';
import { 
  LegalScenario, 
  LegalRight, 
  ActionStep, 
  ContactInfo, 
  ResourceLink 
} from './index';
import { 
  SearchResult, 
  SearchResponse, 
  AutocompleteSuggestion,
  SearchFilters 
} from './search';
import { Category } from './content';

/**
 * Base props that all components might accept
 */
export interface BaseComponentProps {
  /** Custom CSS class names */
  className?: string;
  
  /** Inline styles */
  style?: React.CSSProperties;
  
  /** Test identifier for testing */
  testId?: string;
  
  /** Accessibility label */
  'aria-label'?: string;
  
  /** Accessibility description */
  'aria-describedby'?: string;
}

/**
 * Props for SearchInterface component
 */
export interface SearchInterfaceProps extends BaseComponentProps {
  /** Current search query */
  query?: string;
  
  /** Callback when query changes */
  onQueryChange: (query: string) => void;
  
  /** Callback when search is submitted */
  onSearch: (query: string, filters?: SearchFilters) => void;
  
  /** Whether search is currently loading */
  isLoading?: boolean;
  
  /** Placeholder text for search input */
  placeholder?: string;
  
  /** Whether to show autocomplete suggestions */
  showAutocomplete?: boolean;
  
  /** Autocomplete suggestions */
  suggestions?: AutocompleteSuggestion[];
  
  /** Applied search filters */
  filters?: SearchFilters;
  
  /** Callback when filters change */
  onFiltersChange?: (filters: SearchFilters) => void;
  
  /** Whether to show filter options */
  showFilters?: boolean;
}

/**
 * Props for SearchResults component
 */
export interface SearchResultsProps extends BaseComponentProps {
  /** Search response data */
  searchResponse?: SearchResponse;
  
  /** Whether search is loading */
  isLoading: boolean;
  
  /** Error message if search failed */
  error?: string;
  
  /** Callback when a result is clicked */
  onResultClick: (scenario: LegalScenario, position: number) => void;
  
  /** Callback to load more results */
  onLoadMore?: () => void;
  
  /** Whether more results are available */
  hasMore?: boolean;
  
  /** Results per page */
  pageSize?: number;
  
  /** Current page number */
  currentPage?: number;
}

/**
 * Props for individual SearchResult component
 */
export interface SearchResultProps extends BaseComponentProps {
  /** Search result data */
  result: SearchResult;
  
  /** Position in results list */
  position: number;
  
  /** Callback when result is clicked */
  onClick: (scenario: LegalScenario, position: number) => void;
  
  /** Whether to show highlights */
  showHighlights?: boolean;
  
  /** Whether to show match score */
  showScore?: boolean;
  
  /** Display format */
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Props for AutoComplete component
 */
export interface AutoCompleteProps extends BaseComponentProps {
  /** Current input value */
  value: string;
  
  /** Autocomplete suggestions */
  suggestions: AutocompleteSuggestion[];
  
  /** Whether suggestions are loading */
  isLoading: boolean;
  
  /** Callback when suggestion is selected */
  onSelect: (suggestion: string) => void;
  
  /** Callback when input value changes */
  onInputChange: (value: string) => void;
  
  /** Maximum number of suggestions to show */
  maxSuggestions?: number;
  
  /** Whether dropdown is currently open */
  isOpen: boolean;
  
  /** Callback when dropdown state changes */
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * Props for ScenarioDetail component
 */
export interface ScenarioDetailProps extends BaseComponentProps {
  /** The legal scenario to display */
  scenario: LegalScenario;
  
  /** Whether to expand all sections by default */
  expandedByDefault?: boolean;
  
  /** Callback when an action step is clicked */
  onActionStepClick?: (step: ActionStep) => void;
  
  /** Callback when a source link is clicked */
  onSourceClick?: (url: string) => void;
  
  /** Whether to show related scenarios */
  showRelatedScenarios?: boolean;
  
  /** Array of related scenarios */
  relatedScenarios?: LegalScenario[];
  
  /** Display mode for different contexts */
  mode?: 'full' | 'preview' | 'print' | 'mobile';
}

/**
 * Props for LegalRights component
 */
export interface LegalRightsProps extends BaseComponentProps {
  /** Array of legal rights */
  rights: LegalRight[];
  
  /** Whether rights are expanded by default */
  expandedByDefault?: boolean;
  
  /** Display format */
  layout?: 'list' | 'cards' | 'accordion';
  
  /** Callback when right is clicked */
  onRightClick?: (right: LegalRight) => void;
  
  /** Whether to show legal basis */
  showLegalBasis?: boolean;
  
  /** Maximum rights to display initially */
  maxVisible?: number;
}

/**
 * Props for ActionSteps component
 */
export interface ActionStepsProps extends BaseComponentProps {
  /** Array of action steps */
  steps: ActionStep[];
  
  /** Currently active step */
  activeStep?: number;
  
  /** Completed steps */
  completedSteps?: number[];
  
  /** Callback when step is clicked */
  onStepClick?: (step: ActionStep, index: number) => void;
  
  /** Display format */
  format?: 'numbered' | 'checklist' | 'timeline';
  
  /** Whether to show difficulty indicators */
  showDifficulty?: boolean;
  
  /** Whether to show time estimates */
  showTimeEstimate?: boolean;
  
  /** Whether to show cost information */
  showCost?: boolean;
}

/**
 * Props for SourceAttribution component
 */
export interface SourceAttributionProps extends BaseComponentProps {
  /** Official sources to display */
  sources: LegalScenario['sources'];
  
  /** Display format */
  format?: 'list' | 'inline' | 'compact';
  
  /** Callback when source is clicked */
  onSourceClick?: (url: string, source: LegalScenario['sources'][0]) => void;
  
  /** Whether to show source type icons */
  showTypeIcons?: boolean;
  
  /** Whether to show last verified dates */
  showVerificationDates?: boolean;
  
  /** Maximum sources to show before collapsing */
  maxVisible?: number;
}

/**
 * Props for CategoryNavigation component
 */
export interface CategoryNavigationProps extends BaseComponentProps {
  /** Categories to display */
  categories: Category[];
  
  /** Currently selected category */
  selectedCategory?: string;
  
  /** Callback when category is selected */
  onCategorySelect: (categoryId: string) => void;
  
  /** Display layout */
  layout?: 'grid' | 'list' | 'tabs' | 'sidebar';
  
  /** Whether to show scenario counts */
  showCounts?: boolean;
  
  /** Whether to show category descriptions */
  showDescriptions?: boolean;
  
  /** Grid columns (for grid layout) */
  gridColumns?: number;
}

/**
 * Props for CategoryTile component
 */
export interface CategoryTileProps extends BaseComponentProps {
  /** Category data */
  category: Category;
  
  /** Whether this category is selected */
  isSelected?: boolean;
  
  /** Callback when category is clicked */
  onClick: (categoryId: string) => void;
  
  /** Tile size */
  size?: 'small' | 'medium' | 'large';
  
  /** Whether to show scenario count */
  showCount?: boolean;
  
  /** Whether to show description */
  showDescription?: boolean;
}

/**
 * Props for AppLayout component
 */
export interface AppLayoutProps extends BaseComponentProps {
  /** Page content */
  children: ReactNode;
  
  /** Page title */
  title?: string;
  
  /** Page description for SEO */
  description?: string;
  
  /** Whether to show header */
  showHeader?: boolean;
  
  /** Whether to show footer */
  showFooter?: boolean;
  
  /** Whether to show navigation */
  showNavigation?: boolean;
  
  /** Layout variant */
  variant?: 'default' | 'fullwidth' | 'centered';
}

/**
 * Props for Header component
 */
export interface HeaderProps extends BaseComponentProps {
  /** App title/logo */
  title?: string;
  
  /** Whether to show search in header */
  showSearch?: boolean;
  
  /** Current search query */
  searchQuery?: string;
  
  /** Search callback */
  onSearch?: (query: string) => void;
  
  /** Whether to show navigation menu */
  showNavigation?: boolean;
  
  /** Navigation items */
  navigationItems?: NavigationItem[];
  
  /** Whether header should be sticky */
  sticky?: boolean;
}

/**
 * Navigation item for header/navigation components
 */
export interface NavigationItem {
  /** Item label */
  label: string;
  
  /** Item URL or path */
  href: string;
  
  /** Whether item is currently active */
  isActive?: boolean;
  
  /** Icon component */
  icon?: ReactNode;
  
  /** Child navigation items */
  children?: NavigationItem[];
}

/**
 * Props for LegalDisclaimer component
 */
export interface LegalDisclaimerProps extends BaseComponentProps {
  /** Whether disclaimer is expanded */
  isExpanded?: boolean;
  
  /** Callback when expand state changes */
  onToggleExpand?: (expanded: boolean) => void;
  
  /** Display variant */
  variant?: 'full' | 'compact' | 'banner';
  
  /** Whether to show close button */
  showCloseButton?: boolean;
  
  /** Callback when closed */
  onClose?: () => void;
  
  /** Whether disclaimer is dismissible */
  isDismissible?: boolean;
}

/**
 * Props for ContactInfo component
 */
export interface ContactInfoProps extends BaseComponentProps {
  /** Contact information */
  contacts: ContactInfo[];
  
  /** Display format */
  format?: 'list' | 'cards' | 'inline';
  
  /** Whether to show contact type icons */
  showTypeIcons?: boolean;
  
  /** Whether to make phone numbers clickable */
  enablePhoneLinks?: boolean;
  
  /** Whether to make email addresses clickable */
  enableEmailLinks?: boolean;
  
  /** Maximum contacts to show initially */
  maxVisible?: number;
}

/**
 * Props for ResourceLinks component
 */
export interface ResourceLinksProps extends BaseComponentProps {
  /** Resource links */
  resources: ResourceLink[];
  
  /** Display format */
  format?: 'list' | 'grid' | 'buttons';
  
  /** Whether to show resource type icons */
  showTypeIcons?: boolean;
  
  /** Whether to show descriptions */
  showDescriptions?: boolean;
  
  /** Whether to show language indicators */
  showLanguages?: boolean;
  
  /** Whether to show free/paid status */
  showCostStatus?: boolean;
  
  /** Maximum resources to show initially */
  maxVisible?: number;
}

/**
 * Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /** Child components */
  children: ReactNode;
  
  /** Custom error fallback component */
  fallback?: ReactNode;
  
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  
  /** Whether to show error details in development */
  showErrorDetails?: boolean;
}

/**
 * Props for LoadingStates components
 */
export interface LoadingStateProps extends BaseComponentProps {
  /** Loading message */
  message?: string;
  
  /** Loading variant */
  variant?: 'spinner' | 'skeleton' | 'dots' | 'progress';
  
  /** Size of loading indicator */
  size?: 'small' | 'medium' | 'large';
  
  /** Whether to center the loading indicator */
  centered?: boolean;
}

/**
 * Props for SkeletonLoader component
 */
export interface SkeletonLoaderProps extends BaseComponentProps {
  /** Number of skeleton lines */
  lines?: number;
  
  /** Skeleton variant */
  variant?: 'text' | 'card' | 'list' | 'custom';
  
  /** Animation type */
  animation?: 'pulse' | 'wave' | 'none';
  
  /** Custom skeleton structure */
  structure?: SkeletonStructure[];
}

/**
 * Skeleton structure definition
 */
export interface SkeletonStructure {
  /** Type of skeleton element */
  type: 'text' | 'rectangle' | 'circle' | 'image';
  
  /** Width (CSS value) */
  width?: string;
  
  /** Height (CSS value) */
  height?: string;
  
  /** Margin bottom (CSS value) */
  marginBottom?: string;
}