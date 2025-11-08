import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StyleGuideGenerator = ({ palette, onGenerateStyleGuide, onExportPDF }) => {
  const [styleGuideConfig, setStyleGuideConfig] = useState({
    includeTypography: true,
    includeAccessibility: true,
    includeUsageExamples: true,
    includeBrandGuidelines: true,
    includeCodeSnippets: true,
    template: 'modern'
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean, minimal design' },
    { id: 'corporate', name: 'Corporate', description: 'Professional layout' },
    { id: 'creative', name: 'Creative', description: 'Bold, artistic style' }
  ];

  const typographyPairings = [
    {
      id: 'inter-roboto',
      primary: 'Inter',
      secondary: 'Roboto Mono',
      description: 'Modern, clean pairing for digital products',
      compatibility: 'Excellent'
    },
    {
      id: 'poppins-source',
      primary: 'Poppins',
      secondary: 'Source Code Pro',
      description: 'Friendly, approachable design system',
      compatibility: 'Good'
    },
    {
      id: 'montserrat-fira',
      primary: 'Montserrat',
      secondary: 'Fira Code',
      description: 'Professional with developer focus',
      compatibility: 'Good'
    }
  ];

  const usageGuidelines = [
    {
      color: palette?.colors?.[0],
      usage: 'Primary actions, links, and brand elements',
      avoid: 'Large text blocks, backgrounds with poor contrast',
      examples: ['Call-to-action buttons', 'Navigation links', 'Brand logos']
    },
    {
      color: palette?.colors?.[1],
      usage: 'Secondary actions, highlights, and accents',
      avoid: 'Primary navigation, critical alerts',
      examples: ['Secondary buttons', 'Icon highlights', 'Progress indicators']
    }
  ];

  const handleConfigChange = (key, value) => {
    setStyleGuideConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerateStyleGuide = async () => {
    setIsGenerating(true);
    try {
      await onGenerateStyleGuide(styleGuideConfig);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    setIsGenerating(true);
    try {
      await onExportPDF(styleGuideConfig);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Style Guide Generator</h3>
          <p className="text-sm text-text-secondary mt-1">
            Create comprehensive brand guidelines
          </p>
        </div>
        <Icon name="BookOpen" size={20} className="text-text-secondary" />
      </div>
      {/* Template Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-text-primary mb-3">Template Style</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {templates?.map((template) => (
            <button
              key={template?.id}
              onClick={() => handleConfigChange('template', template?.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                styleGuideConfig?.template === template?.id
                  ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-accent hover:bg-muted'
              }`}
            >
              <div className="font-medium text-sm">{template?.name}</div>
              <div className="text-xs text-text-secondary mt-1">{template?.description}</div>
            </button>
          ))}
        </div>
      </div>
      {/* Configuration Options */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-text-primary mb-3">Include Sections</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'includeTypography', label: 'Typography Pairings', icon: 'Type' },
            { key: 'includeAccessibility', label: 'Accessibility Guidelines', icon: 'Shield' },
            { key: 'includeUsageExamples', label: 'Usage Examples', icon: 'Eye' },
            { key: 'includeBrandGuidelines', label: 'Brand Guidelines', icon: 'Star' },
            { key: 'includeCodeSnippets', label: 'Code Snippets', icon: 'Code' }
          ]?.map((option) => (
            <label key={option?.key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={styleGuideConfig?.[option?.key]}
                onChange={(e) => handleConfigChange(option?.key, e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <Icon name={option?.icon} size={16} className="text-text-secondary" />
              <span className="text-sm text-text-primary">{option?.label}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Typography Pairings Preview */}
      {styleGuideConfig?.includeTypography && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-primary mb-3">Recommended Typography</h4>
          <div className="space-y-3">
            {typographyPairings?.slice(0, 2)?.map((pairing) => (
              <div key={pairing?.id} className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-text-primary">
                      {pairing?.primary} + {pairing?.secondary}
                    </span>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      pairing?.compatibility === 'Excellent' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                    }`}>
                      {pairing?.compatibility}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-text-secondary">{pairing?.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Usage Guidelines Preview */}
      {styleGuideConfig?.includeUsageExamples && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-primary mb-3">Usage Guidelines</h4>
          <div className="space-y-3">
            {usageGuidelines?.slice(0, 2)?.map((guideline, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: guideline?.color?.value }}
                  />
                  <span className="font-medium text-sm text-text-primary">
                    {guideline?.color?.name}
                  </span>
                </div>
                <div className="text-xs text-text-secondary space-y-1">
                  <div><strong>Use for:</strong> {guideline?.usage}</div>
                  <div><strong>Avoid:</strong> {guideline?.avoid}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Export Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          iconName="FileText"
          onClick={handleGenerateStyleGuide}
          loading={isGenerating}
          className="flex-1"
        >
          Generate Web Guide
        </Button>
        <Button
          variant="default"
          iconName="Download"
          onClick={handleExportPDF}
          loading={isGenerating}
          className="flex-1"
        >
          Export PDF Guide
        </Button>
      </div>
      {/* Export History */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-text-primary mb-3">Recent Exports</h4>
        <div className="space-y-2">
          {[
            { name: 'Brand Guidelines v2.1.pdf', date: '2 hours ago', size: '2.4 MB' },
            { name: 'Style Guide Web Export', date: '1 day ago', size: '1.8 MB' }
          ]?.map((export_, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <Icon name="FileText" size={16} className="text-text-secondary" />
                <div>
                  <div className="text-sm font-medium text-text-primary">{export_?.name}</div>
                  <div className="text-xs text-text-secondary">{export_?.date} • {export_?.size}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" iconName="Download">
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyleGuideGenerator;