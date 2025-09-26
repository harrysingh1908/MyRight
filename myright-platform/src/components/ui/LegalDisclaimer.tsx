/**
 * LegalDisclaimer Component
 * 
 * Displays legal disclaimer with expandable content,
 * dismissible options, and accessibility features.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { AlertTriangle, X, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LegalDisclaimerProps } from '@/types/components';

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({
  isExpanded: controlledExpanded,
  onToggleExpand,
  variant = 'full',
  showCloseButton = false,
  onClose,
  isDismissible = false,
  className,
  testId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  
  // Determine if component is controlled or uncontrolled
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  // Handle expansion toggle
  const handleToggleExpand = useCallback(() => {
    if (isControlled && onToggleExpand) {
      onToggleExpand(!isExpanded);
    } else {
      setInternalExpanded(prev => !prev);
    }
  }, [isControlled, isExpanded, onToggleExpand]);

  // Handle close
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Legal disclaimer content
  const shortDisclaimer = "This information is not legal advice and should not be relied upon as such. Always consult qualified lawyer for legal guidance specific to your situation.";
  
  const fullDisclaimer = `This platform provides general information about legal rights and procedures in India. This information is not legal advice and should not be relied upon as such. 

Legal situations are complex and fact-specific. The information provided here may not apply to your particular circumstances. Laws and regulations change frequently, and this information may not reflect the most current legal developments.

Always consult with a qualified lawyer admitted to practice in your jurisdiction before making any legal decisions or taking any legal action. The use of this platform does not create an attorney-client relationship.

We make no representations or warranties about the accuracy, completeness, or reliability of the information provided. We disclaim all liability for any errors or omissions in the content or for any actions taken based on this information.`;

  // Get variant-specific styling
  const getVariantClasses = () => {
    switch (variant) {
      case 'banner':
        return 'bg-yellow-50 border-l-4 border-yellow-400 p-4';
      case 'compact':
        return 'bg-gray-50 border border-gray-200 rounded-lg p-4';
      case 'full':
      default:
        return 'bg-blue-50 border border-blue-200 rounded-lg p-6';
    }
  };

  // Get icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'banner':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />;
      case 'compact':
        return <Info className="h-4 w-4 text-gray-600 flex-shrink-0" />;
      case 'full':
      default:
        return <AlertTriangle className="h-6 w-6 text-blue-600 flex-shrink-0" />;
    }
  };

  return (
    <div
      className={cn(getVariantClasses(), className)}
      data-testid={testId}
      role="region"
      aria-label={ariaLabel || 'Legal disclaimer'}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Icon */}
          {getIcon()}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className={cn(
              'font-semibold',
              variant === 'banner' && 'text-yellow-800 text-sm',
              variant === 'compact' && 'text-gray-900 text-sm',
              variant === 'full' && 'text-blue-900 text-base mb-2'
            )}>
              Legal Disclaimer
            </div>

            {/* Content based on variant */}
            {variant === 'full' && (
              <div className="text-blue-800 text-sm space-y-3">
                <p>{shortDisclaimer}</p>
                
                {isExpanded && (
                  <div className="space-y-3 pt-3 border-t border-blue-200">
                    {fullDisclaimer.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-blue-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {/* Expand/Collapse button for full variant */}
                <button
                  onClick={handleToggleExpand}
                  className="inline-flex items-center space-x-1 text-blue-700 hover:text-blue-900 font-medium text-sm transition-colors duration-200"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Hide full disclaimer' : 'Show full disclaimer'}
                >
                  <span>{isExpanded ? 'Show less' : 'Read full disclaimer'}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}

            {variant === 'compact' && (
              <div className="text-gray-700 text-sm">
                {isExpanded ? (
                  <div className="space-y-2">
                    <p>{shortDisclaimer}</p>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        Full legal disclaimer text: {fullDisclaimer.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                ) : (
                  <p>{shortDisclaimer.substring(0, 80)}...</p>
                )}

                {/* Expand/Collapse button for compact variant */}
                <button
                  onClick={handleToggleExpand}
                  className="inline-flex items-center space-x-1 text-gray-600 hover:text-gray-800 font-medium text-xs mt-2 transition-colors duration-200"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Hide full disclaimer' : 'Show full disclaimer'}
                >
                  <span>{isExpanded ? 'Show less' : 'Show full disclaimer'}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>
            )}

            {variant === 'banner' && (
              <div className="text-yellow-700 text-sm">
                <p>{shortDisclaimer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Close button */}
        {(isDismissible || showCloseButton) && onClose && (
          <button
            onClick={handleClose}
            className={cn(
              'ml-3 flex-shrink-0 rounded-full p-1 transition-colors duration-200',
              variant === 'banner' && 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100',
              variant === 'compact' && 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
              variant === 'full' && 'text-blue-400 hover:text-blue-600 hover:bg-blue-100'
            )}
            aria-label="Close disclaimer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LegalDisclaimer;