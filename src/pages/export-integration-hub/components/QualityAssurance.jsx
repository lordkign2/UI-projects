import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QualityAssurance = ({ palette, onValidationComplete }) => {
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [expandedIssue, setExpandedIssue] = useState(null);

  const runValidation = async () => {
    setIsValidating(true);
    
    // Simulate validation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults = {
      overall: {
        score: 87,
        status: 'warning', // 'success', 'warning', 'error'
        blockers: 1,
        warnings: 3,
        passed: 12
      },
      categories: [
        {
          id: 'contrast',
          name: 'Contrast Ratios',
          status: 'success',
          score: 95,
          issues: [],
          description: 'All color combinations meet WCAG AA standards'
        },
        {
          id: 'colorblind',
          name: 'Color Blindness',
          status: 'warning',
          score: 78,
          issues: [
            {
              id: 'protanopia-issue',
              severity: 'warning',
              title: 'Protanopia Distinction Issue',
              description: 'Colors #DC2626 and #D97706 may be difficult to distinguish for users with protanopia',
              suggestion: 'Consider adjusting hue or adding pattern/texture differentiation',
              affectedColors: ['#DC2626', '#D97706']
            }
          ],
          description: 'Some color combinations may be challenging for colorblind users'
        },
        {
          id: 'wcag',
          name: 'WCAG Compliance',
          status: 'error',
          score: 65,
          issues: [
            {
              id: 'wcag-blocker',
              severity: 'error',
              title: 'AAA Compliance Failure',
              description: 'Color combination fails WCAG AAA standards for small text',
              suggestion: 'Increase contrast ratio to at least 7:1 or use only for large text (18pt+)',
              affectedColors: ['#0EA5E9'],
              blocking: true
            }
          ],
          description: 'Critical accessibility compliance issues detected'
        },
        {
          id: 'brand',
          name: 'Brand Consistency',
          status: 'success',
          score: 92,
          issues: [],
          description: 'Colors align well with brand guidelines'
        }
      ]
    };
    
    setValidationResults(mockResults);
    setIsValidating(false);
    onValidationComplete(mockResults);
  };

  useEffect(() => {
    runValidation();
  }, [palette]);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'info': return 'Info';
      default: return 'CheckCircle';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-accent';
      default: return 'text-success';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success bg-success/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'error': return 'text-error bg-error/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  if (!validationResults) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm text-text-secondary">Running quality assurance checks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Quality Assurance</h3>
          <p className="text-sm text-text-secondary mt-1">
            Final validation before export
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          onClick={runValidation}
          loading={isValidating}
        >
          Re-validate
        </Button>
      </div>
      {/* Overall Score */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-text-primary">Overall Quality Score</h4>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(validationResults?.overall?.status)}`}>
            {validationResults?.overall?.score}/100
          </div>
        </div>
        
        <div className="w-full h-2 bg-border rounded-full overflow-hidden mb-3">
          <div 
            className={`h-full transition-all duration-1000 ${
              validationResults?.overall?.score >= 90 
                ? 'bg-success' 
                : validationResults?.overall?.score >= 70 
                ? 'bg-warning' :'bg-error'
            }`}
            style={{ width: `${validationResults?.overall?.score}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-success">
              <Icon name="CheckCircle" size={14} />
              <span>{validationResults?.overall?.passed} passed</span>
            </div>
            <div className="flex items-center space-x-1 text-warning">
              <Icon name="AlertTriangle" size={14} />
              <span>{validationResults?.overall?.warnings} warnings</span>
            </div>
            {validationResults?.overall?.blockers > 0 && (
              <div className="flex items-center space-x-1 text-error">
                <Icon name="AlertCircle" size={14} />
                <span>{validationResults?.overall?.blockers} blockers</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Category Results */}
      <div className="space-y-4">
        {validationResults?.categories?.map((category) => (
          <div key={category?.id} className="border border-border rounded-lg">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    category?.status === 'success' ? 'bg-success' :
                    category?.status === 'warning' ? 'bg-warning' : 'bg-error'
                  }`} />
                  <div>
                    <h5 className="font-medium text-text-primary">{category?.name}</h5>
                    <p className="text-xs text-text-secondary mt-1">{category?.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-text-primary">{category?.score}%</span>
                  {category?.issues?.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName={expandedIssue === category?.id ? "ChevronUp" : "ChevronDown"}
                      onClick={() => setExpandedIssue(expandedIssue === category?.id ? null : category?.id)}
                    >
                      {category?.issues?.length} issues
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Issues */}
            {expandedIssue === category?.id && category?.issues?.length > 0 && (
              <div className="border-t border-border p-4 bg-muted/30">
                <div className="space-y-3">
                  {category?.issues?.map((issue) => (
                    <div key={issue?.id} className="p-3 bg-surface rounded-lg border border-border">
                      <div className="flex items-start space-x-3">
                        <Icon 
                          name={getSeverityIcon(issue?.severity)} 
                          size={16} 
                          className={getSeverityColor(issue?.severity)} 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="font-medium text-text-primary">{issue?.title}</h6>
                            {issue?.blocking && (
                              <div className="px-2 py-1 bg-error/10 text-error text-xs font-medium rounded">
                                Blocking
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-text-secondary mb-2">{issue?.description}</p>
                          <p className="text-sm text-accent mb-3">{issue?.suggestion}</p>
                          
                          {issue?.affectedColors && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-text-secondary">Affected colors:</span>
                              <div className="flex space-x-1">
                                {issue?.affectedColors?.map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-4 h-4 rounded border border-border"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Export Readiness */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Export Readiness</p>
            <p className="text-xs text-text-secondary mt-1">
              {validationResults?.overall?.blockers > 0 
                ? 'Resolve blocking issues before export' 
                : 'Ready for export with minor warnings'
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {validationResults?.overall?.blockers > 0 ? (
              <Button variant="outline" disabled>
                <Icon name="Lock" size={16} className="mr-2" />
                Export Blocked
              </Button>
            ) : (
              <Button variant="success">
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Ready to Export
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAssurance;