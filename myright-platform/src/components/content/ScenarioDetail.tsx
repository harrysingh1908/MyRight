/**
 * ScenarioDetail Component
 * 
 * Comprehensive display of legal scenario with expandable sections,
 * action steps, rights, and source links with accessibility.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScenarioDetailProps } from '@/types/components';
import { ActionStep } from '@/types';

export const ScenarioDetail: React.FC<ScenarioDetailProps> = ({
  scenario,
  expandedByDefault = false,
  onActionStepClick,
  onSourceClick,
  showRelatedScenarios = false,
  relatedScenarios = [],
  mode: _mode = 'full',
  className,
  testId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const [expandedSections, setExpandedSections] = useState({
    rights: expandedByDefault,
    actionSteps: expandedByDefault,
    sources: expandedByDefault,
    related: false
  });

  // Toggle section expansion
  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Handle source link click
  const handleSourceClick = useCallback((url: string, e?: React.MouseEvent) => {
    if (onSourceClick) {
      e?.preventDefault();
      onSourceClick(url);
    }
  }, [onSourceClick]);

  // Handle action step click
  const handleActionStepClick = useCallback((step: ActionStep) => {
    if (onActionStepClick) {
      onActionStepClick(step);
    }
  }, [onActionStepClick]);

  // Get severity styling
  const getSeverityStyle = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get difficulty styling
  const getDifficultyStyle = (difficulty?: string) => {
    switch (difficulty) {
      case 'hard':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'easy':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <article
      className={cn('max-w-4xl mx-auto bg-white', className)}
      data-testid={testId}
      aria-label={ariaLabel || `Legal scenario: ${scenario.title}`}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {scenario.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                {scenario.category}
              </span>
              {scenario.severity && (
                <span className={cn(
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
                  getSeverityStyle(scenario.severity)
                )}>
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {scenario.severity}
                </span>
              )}
              {scenario.timeSensitivity?.urgent && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                  <Clock className="h-4 w-4 mr-1" />
                  Urgent
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-lg text-gray-700 leading-relaxed">
          {scenario.description}
        </div>

        {/* Time sensitivity details */}
        {scenario.timeSensitivity && (
          <div className="mt-4 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              <span className="font-medium text-orange-800">Time Sensitive</span>
            </div>
            {scenario.timeSensitivity.deadline && (
              <p className="text-orange-700 text-sm">
                Deadline: {scenario.timeSensitivity.deadline}
              </p>
            )}
            {scenario.timeSensitivity.description && (
              <p className="text-orange-700 text-sm mt-1">
                {scenario.timeSensitivity.description}
              </p>
            )}
          </div>
        )}
      </header>

      {/* Rights Section */}
      <section className="mb-8">
        <button
          onClick={() => toggleSection('rights')}
          className="flex items-center justify-between w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-expanded={expandedSections.rights}
          aria-controls="rights-content"
        >
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Your Rights ({scenario.rights.length})
          </h2>
          {expandedSections.rights ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          )}
        </button>
        
        {expandedSections.rights && (
          <div id="rights-content" className="mt-4 space-y-4">
            {scenario.rights.map((right, index) => (
              <div key={right.id || index} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {right.title}
                </h3>
                <p className="text-gray-700 mb-3">
                  {right.description}
                </p>
                {right.legalBasis && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <strong>Legal Basis:</strong> {right.legalBasis.law}
                    {right.legalBasis.section && `, ${right.legalBasis.section}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Action Steps Section */}
      <section className="mb-8">
        <button
          onClick={() => toggleSection('actionSteps')}
          className="flex items-center justify-between w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          aria-expanded={expandedSections.actionSteps}
          aria-controls="actionsteps-content"
          aria-label={expandedSections.actionSteps ? 'Hide action steps' : 'Show action steps'}
        >
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Action Steps ({scenario.actionSteps.length})
          </h2>
          {expandedSections.actionSteps ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          )}
        </button>
        
        {expandedSections.actionSteps && (
          <div id="actionsteps-content" className="mt-4">
            <div className="space-y-4">
              {scenario.actionSteps
                .sort((a, b) => a.order - b.order)
                .map((step, index) => (
                  <div 
                    key={step.order || index}
                    className={cn(
                      'bg-white border border-gray-200 rounded-lg p-6 transition-all duration-200',
                      onActionStepClick && 'cursor-pointer hover:shadow-md hover:border-gray-300'
                    )}
                    onClick={() => handleActionStepClick(step)}
                    tabIndex={onActionStepClick ? 0 : undefined}
                    role={onActionStepClick ? 'button' : undefined}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {step.order}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-700 mb-4">
                          {step.description}
                        </p>
                        
                        {/* Step metadata */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {step.difficulty && (
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium border',
                              getDifficultyStyle(step.difficulty)
                            )}>
                              {step.difficulty}
                            </span>
                          )}
                          {step.timeEstimate && (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {step.timeEstimate}
                            </span>
                          )}
                          {step.cost && (
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {step.cost}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>

      {/* Sources Section */}
      <section className="mb-8">
        <button
          onClick={() => toggleSection('sources')}
          className="flex items-center justify-between w-full p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
          aria-expanded={expandedSections.sources}
          aria-controls="sources-content"
        >
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ExternalLink className="h-5 w-5 mr-2 text-purple-600" />
            Sources & References ({scenario.sources.length})
          </h2>
          {expandedSections.sources ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          )}
        </button>
        
        {expandedSections.sources && (
          <div id="sources-content" className="mt-4 space-y-3">
            {scenario.sources.map((source, index) => (
              <div key={source.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {source.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {source.authority} • {source.type}
                    </p>
                    <div className="text-xs text-gray-500">
                      Last verified: {source.lastVerified}
                    </div>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleSourceClick(source.url, e)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                    aria-label={`Open ${source.title} in new tab`}
                  >
                    Visit Source
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Scenarios Section */}
      {showRelatedScenarios && relatedScenarios.length > 0 && (
        <section className="mb-8">
          <button
            onClick={() => toggleSection('related')}
            className="flex items-center justify-between w-full p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
            aria-expanded={expandedSections.related}
            aria-controls="related-content"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              Related Scenarios ({relatedScenarios.length})
            </h2>
            {expandedSections.related ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
          
          {expandedSections.related && (
            <div id="related-content" className="mt-4 space-y-3">
              {relatedScenarios.map((relatedScenario) => (
                <div key={relatedScenario.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {relatedScenario.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {relatedScenario.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Updated: {scenario.lastUpdated}
            </span>
            {scenario.validationStatus?.sourcesVerified && (
              <span className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified Sources
              </span>
            )}
          </div>
        </div>
      </footer>
    </article>
  );
};

export default ScenarioDetail;