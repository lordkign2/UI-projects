import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceReportPanel = ({ selectedColor, onFixSuggestion }) => {
  const [expandedViolations, setExpandedViolations] = useState(new Set(['contrast-violations']));
  const [selectedWCAGLevel, setSelectedWCAGLevel] = useState('AA');

  // Mock compliance data
  const complianceData = {
    summary: {
      totalViolations: 8,
      criticalViolations: 3,
      warningViolations: 5,
      passedChecks: 12,
      overallScore: 65
    },
    violations: [
      {
        id: 'contrast-violations',
        category: 'Color Contrast',
        level: 'critical',
        count: 3,
        wcagCriteria: '1.4.3, 1.4.6',
        description: 'Text and background color combinations do not meet minimum contrast requirements',
        items: [
          {
            id: 'cv-1',
            colors: ['#2563EB', '#FFFFFF'],
            currentRatio: 3.2,
            requiredRatio: 4.5,
            element: 'Primary button text',
            suggestion: 'Darken primary color to #1D4ED8 for 4.7:1 ratio'
          },
          {
            id: 'cv-2',
            colors: ['#D97706', '#FFFFFF'],
            currentRatio: 4.1,
            requiredRatio: 7.0,
            element: 'Warning text (AAA)',
            suggestion: 'Darken warning color to #B45309 for 7.2:1 ratio'
          },
          {
            id: 'cv-3',
            colors: ['#64748B', '#FFFFFF'],
            currentRatio: 2.8,
            requiredRatio: 4.5,
            element: 'Secondary text',
            suggestion: 'Darken neutral color to #475569 for 5.1:1 ratio'
          }
        ]
      },
      {
        id: 'color-dependency',
        category: 'Color Dependency',
        level: 'warning',
        count: 2,
        wcagCriteria: '1.4.1',
        description: 'Information conveyed through color alone without additional indicators',
        items: [
          {
            id: 'cd-1',
            element: 'Status indicators',
            issue: 'Success/error states rely only on color',
            suggestion: 'Add icons or text labels to status indicators'
          },
          {
            id: 'cd-2',
            element: 'Chart data points',
            issue: 'Data series differentiated only by color',
            suggestion: 'Use patterns, shapes, or labels for data series'
          }
        ]
      },
      {
        id: 'focus-indicators',
        category: 'Focus Management',
        level: 'warning',
        count: 3,
        wcagCriteria: '2.4.7',
        description: 'Focus indicators may not be visible against certain backgrounds',
        items: [
          {
            id: 'fi-1',
            element: 'Color picker buttons',
            issue: 'Focus ring not visible on dark colors',
            suggestion: 'Use high-contrast focus ring with white outline'
          },
          {
            id: 'fi-2',
            element: 'Palette grid items',
            issue: 'Focus indicators blend with similar colors',
            suggestion: 'Implement dual-color focus ring system'
          },
          {
            id: 'fi-3',
            element: 'Export buttons',
            issue: 'Focus state contrast insufficient',
            suggestion: 'Increase focus ring contrast to 3:1 minimum'
          }
        ]
      }
    ]
  };

  const toggleViolationExpansion = (violationId) => {
    setExpandedViolations(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(violationId)) {
        newSet?.delete(violationId);
      } else {
        newSet?.add(violationId);
      }
      return newSet;
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-accent';
      default: return 'text-text-secondary';
    }
  };

  const getLevelBg = (level) => {
    switch (level) {
      case 'critical': return 'bg-error/10 border-error/20';
      case 'warning': return 'bg-warning/10 border-warning/20';
      case 'info': return 'bg-accent/10 border-accent/20';
      default: return 'bg-muted border-border';
    }
  };

  const handleApplyFix = (suggestion, violationId, itemId) => {
    if (onFixSuggestion) {
      onFixSuggestion({ suggestion, violationId, itemId });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Compliance Report</h3>
          <p className="text-sm text-text-secondary">WCAG 2.1 Analysis Results</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedWCAGLevel}
            onChange={(e) => setSelectedWCAGLevel(e?.target?.value)}
            className="px-3 py-1 text-sm border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="AA">WCAG AA</option>
            <option value="AAA">WCAG AAA</option>
          </select>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-error">{complianceData?.summary?.totalViolations}</div>
              <div className="text-sm text-text-secondary">Total Issues</div>
            </div>
            <Icon name="AlertTriangle" size={24} className="text-error" />
          </div>
        </div>
        <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-success">{complianceData?.summary?.passedChecks}</div>
              <div className="text-sm text-text-secondary">Passed Checks</div>
            </div>
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
        </div>
      </div>
      {/* Overall Score */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Accessibility Score</span>
          <span className="text-lg font-bold text-text-primary">{complianceData?.summary?.overallScore}%</span>
        </div>
        <div className="w-full h-2 bg-background rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${complianceData?.summary?.overallScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${
              complianceData?.summary?.overallScore >= 80 ? 'bg-success' :
              complianceData?.summary?.overallScore >= 60 ? 'bg-warning' : 'bg-error'
            }`}
          />
        </div>
      </div>
      {/* Violations List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {complianceData?.violations?.map((violation) => (
          <div key={violation?.id} className={`border rounded-lg ${getLevelBg(violation?.level)}`}>
            <button
              onClick={() => toggleViolationExpansion(violation?.id)}
              className="w-full p-4 text-left hover:bg-black/5 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={violation?.level === 'critical' ? 'AlertCircle' : 'AlertTriangle'} 
                    size={20} 
                    className={getLevelColor(violation?.level)} 
                  />
                  <div>
                    <h4 className="font-medium text-text-primary">{violation?.category}</h4>
                    <p className="text-sm text-text-secondary">
                      {violation?.count} issues • WCAG {violation?.wcagCriteria}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    violation?.level === 'critical' ? 'bg-error text-error-foreground' :
                    violation?.level === 'warning' ? 'bg-warning text-warning-foreground' :
                    'bg-accent text-accent-foreground'
                  }`}>
                    {violation?.level}
                  </span>
                  <Icon 
                    name={expandedViolations?.has(violation?.id) ? 'ChevronUp' : 'ChevronDown'} 
                    size={16} 
                    className="text-text-secondary" 
                  />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {expandedViolations?.has(violation?.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <p className="text-sm text-text-secondary mb-4">{violation?.description}</p>
                    <div className="space-y-3">
                      {violation?.items?.map((item) => (
                        <div key={item?.id} className="p-3 bg-background rounded-lg border border-border">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h5 className="font-medium text-text-primary text-sm">{item?.element}</h5>
                              {item?.colors && (
                                <div className="flex items-center space-x-2 mt-1">
                                  {item?.colors?.map((color, index) => (
                                    <div key={index} className="flex items-center space-x-1">
                                      <div
                                        className="w-4 h-4 rounded border border-border"
                                        style={{ backgroundColor: color }}
                                      />
                                      <span className="text-xs text-text-secondary">{color}</span>
                                    </div>
                                  ))}
                                  {item?.currentRatio && (
                                    <span className="text-xs text-text-secondary">
                                      • {item?.currentRatio}:1 ratio
                                    </span>
                                  )}
                                </div>
                              )}
                              {item?.issue && (
                                <p className="text-sm text-text-secondary mt-1">{item?.issue}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-text-primary">{item?.suggestion}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="Wand2"
                              iconPosition="left"
                              onClick={() => handleApplyFix(item?.suggestion, violation?.id, item?.id)}
                            >
                              Apply Fix
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      {/* Export Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" iconName="FileText" iconPosition="left" fullWidth>
            Export Report
          </Button>
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left" fullWidth>
            PDF Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReportPanel;