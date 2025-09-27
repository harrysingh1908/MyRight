/**
 * Core domain types for MyRight legal rights platform
 * 
 * These interfaces define the fundamental data structures for legal scenarios,
 * rights, and action steps. All services and components depend on these types.
 */

/**
 * Represents a complete legal scenario with associated rights and remedies
 */
export interface LegalScenario {
  /** Unique identifier for the scenario */
  id: string;
  
  /** Human-readable title of the scenario */
  title: string;
  
  /** Detailed description of the legal situation */
  description: string;
  
  /** Category this scenario belongs to (employment, housing, etc.) */
  category: string;
  
  /** Legal rights that apply to this scenario */
  rights: LegalRight[];
  
  /** Actionable steps the user can take */
  actionSteps: ActionStep[];
  
  /** Official government sources backing this information */
  sources: OfficialSource[];
  
  /** Related scenarios that might also apply */
  relatedScenarios?: string[];
  
  /** Keywords for search and matching */
  keywords: string[];
  
  /** Natural language variations for this scenario */
  variations: string[];
  
  /** When this scenario was last updated */
  lastUpdated: string;
  
  /** Content validation status */
  validationStatus: ValidationStatus;
  
  /** Severity/urgency level (low, medium, high, critical) */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Time sensitivity (how quickly action should be taken) */
  timeSensitivity?: {
    urgent: boolean;
    deadline?: string;
    description?: string;
  };
}

/**
 * Represents a specific legal right that applies to a scenario
 */
export interface LegalRight {
  /** Unique identifier for this right */
  id: string;
  
  /** Title of the legal right */
  title: string;
  
  /** Detailed explanation of the right in plain language */
  description: string;
  
  /** Legal basis (which law, act, or regulation) */
  legalBasis: {
    /** Name of the law/act */
    law: string;
    /** Specific section or article */
    section?: string;
    /** URL to the official text */
    url?: string;
  };
  
  /** How this right applies to the specific scenario */
  application: string;
  
  /** Action steps specific to exercising this right */
  actionSteps: ActionStep[];
  
  /** Limitations or conditions on this right */
  limitations?: string[];
  
  /** Examples of how this right has been exercised */
  examples?: string[];
}

/**
 * Represents an actionable step a user can take
 */
export interface ActionStep {
  /** Step number in the sequence */
  order: number;
  
  /** Title of this action step */
  title: string;
  
  /** Detailed instructions for this step */
  description: string;
  
  /** Type of action (documentation, complaint, legal, etc.) */
  type: 'documentation' | 'complaint' | 'legal' | 'negotiation' | 'escalation' | 'prevention';
  
  /** How difficult this step is to complete */
  difficulty: 'easy' | 'medium' | 'hard';
  
  /** Estimated time to complete this step */
  timeEstimate: string;
  
  /** Cost involved (free, low, medium, high) */
  cost: 'free' | 'low' | 'medium' | 'high';
  
  /** Documents or evidence needed for this step */
  documentsNeeded?: string[];
  
  /** Contact information for relevant authorities */
  contacts?: ContactInfo[];
  
  /** Links to forms or online services */
  resources?: ResourceLink[];
  
  /** Prerequisites that must be completed first */
  prerequisites?: number[];
  
  /** Warning or important notes about this step */
  warnings?: string[];
}

/**
 * Official government sources that validate the legal information
 */
export interface OfficialSource {
  /** Unique identifier for this source */
  id: string;
  
  /** Title of the source document/page */
  title: string;
  
  /** Government department or authority */
  authority: string;
  
  /** Official URL to the source */
  url: string;
  
  /** Type of official source */
  type: 'law' | 'regulation' | 'circular' | 'guideline' | 'judgment' | 'notification';
  
  /** Date this source was published */
  publishedDate?: string;
  
  /** Date this source was last verified as accessible */
  lastVerified: string;
  
  /** Current status of this source link */
  status: 'active' | 'inactive' | 'moved' | 'archived';
  
  /** Relevant excerpt from the source */
  excerpt?: string;
}

/**
 * Contact information for authorities, organizations, or services
 */
export interface ContactInfo {
  /** Name of the organization or office */
  name: string;
  
  /** Type of contact */
  type: 'government' | 'court' | 'police' | 'ngo' | 'legal_aid' | 'helpline';
  
  /** Physical address */
  address?: string;
  
  /** Phone numbers */
  phones?: string[];
  
  /** Email addresses */
  emails?: string[];
  
  /** Website URL */
  website?: string;
  
  /** Office hours */
  hours?: string;
  
  /** Whether this contact provides services in multiple languages */
  languages?: string[];
  
  /** Whether this is a 24/7 service */
  available24x7?: boolean;
}

/**
 * Links to helpful resources, forms, or services
 */
export interface ResourceLink {
  /** Title of the resource */
  title: string;
  
  /** URL to the resource */
  url: string;
  
  /** Type of resource */
  type: 'form' | 'guide' | 'service' | 'calculator' | 'directory' | 'app';
  
  /** Brief description of what this resource provides */
  description: string;
  
  /** Whether the resource is free or paid */
  isFree: boolean;
  
  /** Language(s) the resource is available in */
  languages: string[];
}

/**
 * Validation status for content quality assurance
 */
export interface ValidationStatus {
  /** Whether all sources have been verified */
  sourcesVerified: boolean;
  
  /** Whether legal accuracy has been reviewed */
  legalReview: boolean;
  
  /** Whether plain language clarity has been checked */
  clarityReview: boolean;
  
  /** Date of last validation */
  lastValidated: string;
  
  /** Who validated this content */
  validator?: string;
  
  /** Any validation notes or concerns */
  notes?: string[];
}

// All types are exported inline above