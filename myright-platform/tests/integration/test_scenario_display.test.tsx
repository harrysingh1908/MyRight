/**
 * Integration Test: Scenario Display with Sources
 * 
 * This test validates the end-to-end scenario display functionality from
 * loading scenario data to rendering complete information with sources.
 * It MUST FAIL initially until all components are implemented.
 * 
 * Integration Requirements:
 * 1. Scenario details render completely with all sections
 * 2. Legal rights display with proper formatting
 * 3. Action steps show in logical sequence
 * 4. Official sources are properly attributed and linked
 * 5. Related scenarios and navigation work correctly
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// These imports will fail until components are implemented
import { ScenarioDetail } from '@/components/content/ScenarioDetail';
import { LegalRights } from '@/components/content/LegalRights';
import { ActionSteps } from '@/components/content/ActionSteps';
import { SourceAttribution } from '@/components/content/SourceAttribution';
import { RelatedScenarios } from '@/components/content/RelatedScenarios';
import { ContentService } from '@/services/contentService';

import { LegalScenario } from '@/types';
import { ScenarioDetailProps } from '@/types/components';

// Complete test scenario with all required data
const completeScenario: LegalScenario = {
  id: 'salary-unpaid-employment',
  title: 'Employer Not Paying Salary or Wages',
  description: 'When your employer refuses to pay your salary, wages, or withholds payment without valid reason, you have legal rights to recover your dues and take action for non-payment.',
  category: 'employment',
  rights: [
    {
      id: 'wage-payment-right',
      title: 'Right to Timely Payment of Wages',
      description: 'Every worker has the fundamental right to receive their wages on time as agreed in their employment contract or as per legal requirements.',
      legalBasis: {
        law: 'Payment of Wages Act, 1936',
        section: 'Section 5',
        url: 'https://labour.gov.in/sites/default/files/ThePaymentofWagesAct1936.pdf'
      },
      application: 'Applies to all employees earning up to ₹24,000 per month. Wages must be paid before the 7th of the following month for monthly paid employees.',
      limitations: [
        'Only applies to employees earning below ₹24,000 per month',
        'Does not cover contract workers in some cases'
      ],
      examples: [
        'Filing complaint with District Labor Officer',
        'Approaching Labor Court for wage recovery'
      ]
    },
    {
      id: 'complaint-right',
      title: 'Right to File Complaint for Non-Payment',
      description: 'You can file a formal complaint with labor authorities if wages are not paid within the legal timeframe.',
      legalBasis: {
        law: 'Payment of Wages Act, 1936',
        section: 'Section 15',
        url: 'https://labour.gov.in/sites/default/files/ThePaymentofWagesAct1936.pdf'
      },
      application: 'File complaint within 6 months of wage being due. Authority can order payment with compensation.'
    }
  ],
  actionSteps: [
    {
      order: 1,
      title: 'Document Your Employment and Wage Details',
      description: 'Gather all employment-related documents including appointment letter, salary slips, bank statements, and any communication about wages.',
      type: 'documentation',
      difficulty: 'easy',
      timeEstimate: '1-2 hours',
      cost: 'free',
      documentsNeeded: [
        'Employment contract or appointment letter',
        'Previous salary slips',
        'Bank statements showing previous wage payments'
      ],
      warnings: [
        'Keep original documents safe - submit only photocopies for complaints'
      ]
    },
    {
      order: 2,
      title: 'Send Written Notice to Employer',
      description: 'Send a formal written notice to your employer demanding payment of due wages within a reasonable time (typically 15 days).',
      type: 'negotiation',
      difficulty: 'easy',
      timeEstimate: '30 minutes',
      cost: 'free',
      contacts: [
        {
          name: 'India Post',
          type: 'government',
          phones: ['1800-11-2011'],
          website: 'https://www.indiapost.gov.in',
          hours: 'Monday to Saturday 9 AM to 5 PM'
        }
      ]
    },
    {
      order: 3,
      title: 'File Complaint with Labor Inspector',
      description: 'If employer doesn\'t respond to notice, file formal complaint with District Labor Officer or Inspector under Payment of Wages Act.',
      type: 'complaint',
      difficulty: 'medium',
      timeEstimate: '2-3 hours',
      cost: 'free',
      prerequisites: [2],
      resources: [
        {
          title: 'Payment of Wages Act Complaint Form',
          url: 'https://labour.gov.in/sites/default/files/forms_0.pdf',
          type: 'form',
          description: 'Official form for filing wage complaint',
          isFree: true,
          languages: ['English', 'Hindi']
        }
      ]
    }
  ],
  sources: [
    {
      id: 'payment-wages-act',
      title: 'The Payment of Wages Act, 1936',
      authority: 'Ministry of Labour and Employment, Government of India',
      url: 'https://labour.gov.in/sites/default/files/ThePaymentofWagesAct1936.pdf',
      type: 'law',
      publishedDate: '1936-12-23',
      lastVerified: '2024-01-15',
      status: 'active',
      excerpt: 'An Act to ensure the payment of wages to certain classes of persons employed in industry.'
    },
    {
      id: 'labour-ministry-guidelines',
      title: 'Guidelines on Payment of Wages',
      authority: 'Ministry of Labour and Employment',
      url: 'https://labour.gov.in/whatsnew/guidelines-payment-wages',
      type: 'guideline',
      lastVerified: '2024-01-15',
      status: 'active'
    }
  ],
  relatedScenarios: [
    'workplace-harassment-employment',
    'wrongful-termination-employment'
  ],
  keywords: ['salary', 'wages', 'unpaid', 'employer', 'payment'],
  variations: [
    'My company is not paying my salary for the last 3 months',
    'Employer refuses to pay overtime wages'
  ],
  lastUpdated: '2024-01-15',
  validationStatus: {
    sourcesVerified: true,
    legalReview: true,
    clarityReview: true,
    lastValidated: '2024-01-15',
    validator: 'Legal Content Team'
  },
  severity: 'high',
  timeSensitivity: {
    urgent: true,
    deadline: '6 months from wage due date',
    description: 'Complaint must be filed within 6 months of wage being due as per Payment of Wages Act'
  }
};

// Related scenarios for testing
const relatedScenarios: LegalScenario[] = [
  {
    id: 'workplace-harassment-employment',
    title: 'Workplace Harassment and Discrimination',
    description: 'Dealing with harassment, discrimination, or hostile work environment',
    category: 'employment',
    rights: [],
    actionSteps: [],
    sources: [],
    keywords: ['harassment', 'workplace', 'discrimination'],
    variations: [],
    lastUpdated: '2024-01-15',
    validationStatus: {
      sourcesVerified: true,
      legalReview: true,
      clarityReview: true,
      lastValidated: '2024-01-15'
    },
    severity: 'high'
  }
];

// Test component that integrates all scenario display components
const CompleteScenarioDisplay: React.FC<{ scenarioId: string }> = ({ scenarioId }) => {
  const [scenario, setScenario] = React.useState<LegalScenario | null>(null);
  const [relatedScenariosData, setRelatedScenariosData] = React.useState<LegalScenario[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const contentService = React.useMemo(() => new ContentService({
    scenariosDir: '/data/scenarios',
    embeddingsDir: '/data/embeddings',
    supportedFormats: ['json'],
    validateOnLoad: true,
    enableCaching: true,
    cacheDuration: 300000,
    preloadContent: false
  }), []);

  React.useEffect(() => {
    const loadScenarioData = async () => {
      try {
        setLoading(true);
        
        // Load main scenario
        const scenarioData = await contentService.loadScenario(scenarioId);
        setScenario(scenarioData);
        
        // Load related scenarios if available
        if (scenarioData.relatedScenarios && scenarioData.relatedScenarios.length > 0) {
          const relatedPromises = scenarioData.relatedScenarios.map(id =>
            contentService.loadScenario(id).catch(() => null)
          );
          const related = await Promise.all(relatedPromises);
          setRelatedScenariosData(related.filter(Boolean) as LegalScenario[]);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load scenario');
      } finally {
        setLoading(false);
      }
    };

    loadScenarioData();
  }, [scenarioId, contentService]);

  if (loading) return <div data-testid="scenario-loading">Loading scenario...</div>;
  if (error) return <div data-testid="scenario-error">{error}</div>;
  if (!scenario) return <div data-testid="scenario-not-found">Scenario not found</div>;

  return (
    <div data-testid="complete-scenario-display">
      <ScenarioDetail
        scenario={scenario}
        showRelatedScenarios={true}
        relatedScenarios={relatedScenariosData}
      />
    </div>
  );
};

describe('Scenario Display Integration', () => {
  let contentService: ContentService;

  beforeEach(() => {
    // Mock content service to return test data
    contentService = new ContentService({
      scenariosDir: '/data/scenarios',
      embeddingsDir: '/data/embeddings',
      supportedFormats: ['json'],
      validateOnLoad: true,
      enableCaching: true,
      cacheDuration: 300000,
      preloadContent: false
    });

    jest.spyOn(contentService, 'loadScenario').mockImplementation(async (id: string) => {
      if (id === 'salary-unpaid-employment') return completeScenario;
      if (id === 'workplace-harassment-employment') return relatedScenarios[0]!;
      throw new Error(`Scenario not found: ${id}`);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Complete Scenario Display', () => {
    test('should render complete scenario with all sections', async () => {
      render(<CompleteScenarioDisplay scenarioId="salary-unpaid-employment" />);
      
      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId('scenario-loading')).not.toBeInTheDocument();
      });

      // Check main scenario information
      expect(screen.getByText('Employer Not Paying Salary or Wages')).toBeInTheDocument();
      expect(screen.getByText(/when your employer refuses to pay/i)).toBeInTheDocument();
      
      // Check severity and urgency indicators
      expect(screen.getByText(/high severity/i)).toBeInTheDocument();
      expect(screen.getByText(/urgent/i)).toBeInTheDocument();
      
      // Check category
      expect(screen.getByText(/employment/i)).toBeInTheDocument();
    });

    test('should display all legal rights with proper formatting', async () => {
      render(<CompleteScenarioDisplay scenarioId="salary-unpaid-employment" />);
      
      await waitFor(() => {
        expect(screen.getByText('Right to Timely Payment of Wages')).toBeInTheDocument();
      });

      // Check legal basis information
      expect(screen.getByText('Payment of Wages Act, 1936')).toBeInTheDocument();
      expect(screen.getByText('Section 5')).toBeInTheDocument();
      
      // Check application details
      expect(screen.getByText(/applies to all employees earning up to/i)).toBeInTheDocument();
      
      // Check limitations
      expect(screen.getByText(/only applies to employees earning below/i)).toBeInTheDocument();
      
      // Check examples
      expect(screen.getByText(/filing complaint with district labor officer/i)).toBeInTheDocument();
    });

    test('should show action steps in correct order', async () => {
      render(<CompleteScenarioDisplay scenarioId="salary-unpaid-employment" />);
      
      await waitFor(() => {
        expect(screen.getByText('Document Your Employment and Wage Details')).toBeInTheDocument();
      });

      // Check step ordering
      const steps = screen.getAllByRole('listitem');
      expect(steps[0]).toHaveTextContent('Document Your Employment');
      expect(steps[1]).toHaveTextContent('Send Written Notice');
      expect(steps[2]).toHaveTextContent('File Complaint');
      
      // Check step metadata
      expect(screen.getByText(/1-2 hours/i)).toBeInTheDocument(); // Time estimate
      expect(screen.getByText(/easy/i)).toBeInTheDocument(); // Difficulty
      expect(screen.getByText(/free/i)).toBeInTheDocument(); // Cost
    });

    test('should display required documents and warnings', async () => {
      render(<CompleteScenarioDisplay scenarioId="salary-unpaid-employment" />);
      
      await waitFor(() => {
        expect(screen.getByText(/employment contract or appointment letter/i)).toBeInTheDocument();
      });

      // Check documents needed
      expect(screen.getByText(/previous salary slips/i)).toBeInTheDocument();
      expect(screen.getByText(/bank statements/i)).toBeInTheDocument();
      
      // Check warnings
      expect(screen.getByText(/keep original documents safe/i)).toBeInTheDocument();
    });

    test('should show contact information and resources', async () => {
      render(<CompleteScenarioDisplay scenarioId="salary-unpaid-employment" />);
      
      await waitFor(() => {
        expect(screen.getByText('India Post')).toBeInTheDocument();
      });

      // Check contact details
      expect(screen.getByText('1800-11-2011')).toBeInTheDocument();
      expect(screen.getByText(/monday to saturday 9 am to 5 pm/i)).toBeInTheDocument();
      
      // Check resource links
      expect(screen.getByText('Payment of Wages Act Complaint Form')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /complaint form/i })).toBeInTheDocument();
    });
  });

  describe('Official Sources Display', () => {
    test('should display all official sources with proper attribution', async () => {
      render(<CompleteScenarioDisplay scenarioId="salary-unpaid-employment" />);
      
      await waitFor(() => {
        expect(screen.getByText('The Payment of Wages Act, 1936')).toBeInTheDocument();
      });

      // Check source authority
      expect(screen.getByText(/ministry of labour and employment/i)).toBeInTheDocument();
      
      // Check source type
      expect(screen.getByText(/law/i)).toBeInTheDocument();
      
      // Check verification status
      expect(screen.getByText(/last verified/i)).toBeInTheDocument();
      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
      
      // Check excerpt
      expect(screen.getByText(/an act to ensure the payment of wages/i)).toBeInTheDocument();
    });

    test('should make source links clickable and trackable', async () => {
      const user = userEvent.setup();
      const onSourceClick = jest.fn();
      
      render(
        <SourceAttribution
          sources={completeScenario.sources}
          onSourceClick={onSourceClick}
          showVerificationDates={true}
        />
      );

      const sourceLink = screen.getByRole('link', { name: /payment of wages act/i });
      await user.click(sourceLink);
      
      expect(onSourceClick).toHaveBeenCalledWith(
        'https://labour.gov.in/sites/default/files/ThePaymentofWagesAct1936.pdf',
        expect.objectContaining({
          id: 'payment-wages-act',
          title: 'The Payment of Wages Act, 1936'
        })
      );
    });

    test('should show source verification status and warnings', async () => {
      const scenarioWithBrokenSource = {
        ...completeScenario,
        sources: [
          ...completeScenario.sources,
          {
            id: 'broken-source',
            title: 'Broken Link Example',
            authority: 'Test Authority',
            url: 'https://broken-link.gov.in',
            type: 'law' as const,
            lastVerified: '2020-01-01',
            status: 'inactive' as const
          }
        ]
      };
      
      render(<SourceAttribution sources={scenarioWithBrokenSource.sources} />);
      
      // Should show warning for old verification
      expect(screen.getByText(/verification may be outdated/i)).toBeInTheDocument();
      
      // Should show inactive status
      expect(screen.getByText(/inactive/i)).toBeInTheDocument();
    });
  });

  describe('Related Scenarios Integration', () => {
    test('should load and display related scenarios', async () => {
      render(<CompleteScenarioDisplay scenarioId="salary-unpaid-employment" />);
      
      await waitFor(() => {
        expect(screen.getByText('Workplace Harassment and Discrimination')).toBeInTheDocument();
      });

      // Check related scenario information
      expect(screen.getByText(/dealing with harassment/i)).toBeInTheDocument();
      
      // Should be clickable
      const relatedLink = screen.getByRole('link', { name: /workplace harassment/i });
      expect(relatedLink).toBeInTheDocument();
    });

    test('should handle navigation to related scenarios', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();
      
      // Mock navigation
      jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
        push: mockNavigate,
        replace: jest.fn(),
        back: jest.fn(),
      });
      
      render(<CompleteScenarioDisplay scenarioId="salary-unpaid-employment" />);
      
      await waitFor(() => {
        expect(screen.getByText('Workplace Harassment and Discrimination')).toBeInTheDocument();
      });

      const relatedLink = screen.getByRole('link', { name: /workplace harassment/i });
      await user.click(relatedLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/scenario/workplace-harassment-employment');
    });
  });

  describe('Interactive Features', () => {
    test('should support expandable sections', async () => {
      const user = userEvent.setup();
      
      render(<ScenarioDetail scenario={completeScenario} />);
      
      // Legal rights should be expandable
      const expandRightsButton = screen.getByRole('button', { name: /show legal rights/i });
      await user.click(expandRightsButton);
      
      expect(screen.getByText('Right to Timely Payment of Wages')).toBeVisible();
      
      // Should be collapsible
      const collapseButton = screen.getByRole('button', { name: /hide legal rights/i });
      await user.click(collapseButton);
      
      expect(screen.getByText('Right to Timely Payment of Wages')).not.toBeVisible();
    });

    test('should support step-by-step action plan', async () => {
      const user = userEvent.setup();
      
      render(<ActionSteps steps={completeScenario.actionSteps} format="timeline" />);
      
      // Should show progress through steps
      const firstStep = screen.getByText('Document Your Employment');
      await user.click(firstStep);
      
      // Should mark step as active or completed
      expect(firstStep).toHaveClass('active');
      
      // Should show step details
      expect(screen.getByText(/gather all employment-related documents/i)).toBeVisible();
    });

    test('should support printing and sharing', async () => {
      const user = userEvent.setup();
      
      render(<ScenarioDetail scenario={completeScenario} mode="full" />);
      
      // Should have print button
      const printButton = screen.getByRole('button', { name: /print/i });
      await user.click(printButton);
      
      // Mock print functionality
      expect(window.print).toHaveBeenCalled();
      
      // Should have share button
      const shareButton = screen.getByRole('button', { name: /share/i });
      expect(shareButton).toBeInTheDocument();
    });
  });

  describe('Accessibility and User Experience', () => {
    test('should have proper heading hierarchy', async () => {
      render(<ScenarioDetail scenario={completeScenario} />);
      
      const headings = screen.getAllByRole('heading');
      
      // Should start with h1 for scenario title
      expect(headings[0]).toHaveProperty('tagName', 'H1');
      
      // Should have logical hierarchy
      expect(headings.find(h => h.textContent === 'Legal Rights')).toHaveProperty('tagName', 'H2');
      expect(headings.find(h => h.textContent === 'Action Steps')).toHaveProperty('tagName', 'H2');
    });

    test('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      
      render(<ScenarioDetail scenario={completeScenario} />);
      
      // Should be able to tab through interactive elements
      await user.tab();
      expect(document.activeElement).toHaveAttribute('role', 'button');
      
      // Should be able to activate with Enter
      await user.keyboard('{Enter}');
      
      // Should expand/collapse sections
      expect(screen.getByText('Right to Timely Payment of Wages')).toBeVisible();
    });

    test('should support screen readers', async () => {
      render(<ScenarioDetail scenario={completeScenario} />);
      
      // Should have proper ARIA labels
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Legal scenario details');
      
      // Should announce urgent items
      const urgentAlert = screen.getByRole('alert');
      expect(urgentAlert).toHaveTextContent(/urgent/i);
      
      // Should have descriptive link text
      const sourceLinks = screen.getAllByRole('link');
      sourceLinks.forEach(link => {
        expect(link).toHaveAttribute('aria-label');
      });
    });

    test('should work on mobile devices', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      Object.defineProperty(window, 'innerHeight', { value: 667 });
      
      render(<ScenarioDetail scenario={completeScenario} />);
      
      // Should use mobile-friendly layout
      expect(screen.getByTestId('mobile-scenario-layout')).toBeInTheDocument();
      
      // Should have touch-friendly interactive elements
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const styles = getComputedStyle(button);
        expect(parseInt(styles.minHeight, 10)).toBeGreaterThanOrEqual(44); // iOS minimum
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle missing scenario gracefully', async () => {
      jest.spyOn(contentService, 'loadScenario').mockRejectedValue(
        new Error('Scenario not found')
      );
      
      render(<CompleteScenarioDisplay scenarioId="non-existent" />);
      
      await waitFor(() => {
        expect(screen.getByTestId('scenario-error')).toBeInTheDocument();
      });
      
      expect(screen.getByText(/scenario not found/i)).toBeInTheDocument();
    });

    test('should handle scenarios with missing data', async () => {
      const incompleteScenario = {
        ...completeScenario,
        rights: [],
        actionSteps: [],
        sources: []
      };
      
      render(<ScenarioDetail scenario={incompleteScenario} />);
      
      // Should show appropriate messages for missing sections
      expect(screen.getByText(/no legal rights information available/i)).toBeInTheDocument();
      expect(screen.getByText(/no action steps available/i)).toBeInTheDocument();
      expect(screen.getByText(/no official sources available/i)).toBeInTheDocument();
    });

    test('should handle broken source links gracefully', async () => {
      const scenarioWithBrokenSources = {
        ...completeScenario,
        sources: [
          {
            id: 'broken-source',
            title: 'Broken Government Link',
            authority: 'Test Ministry',
            url: 'https://broken.gov.in/404',
            type: 'law' as const,
            lastVerified: '2024-01-15',
            status: 'inactive' as const
          }
        ]
      };
      
      render(<SourceAttribution sources={scenarioWithBrokenSources.sources} />);
      
      // Should show warning for inactive links
      expect(screen.getByText(/link may not be accessible/i)).toBeInTheDocument();
      
      // Should still display the source information
      expect(screen.getByText('Broken Government Link')).toBeInTheDocument();
    });
  });
});