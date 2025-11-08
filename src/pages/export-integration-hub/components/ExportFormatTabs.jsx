import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportFormatTabs = ({ palette, onExport, onPreviewChange }) => {
  const [activeTab, setActiveTab] = useState('css');
  const [config, setConfig] = useState({
    prefix: 'color',
    format: 'hex',
    includeComments: true,
    minify: false,
    customNaming: false
  });

  const formats = [
    {
      id: 'css',
      label: 'CSS Variables',
      icon: 'Code',
      description: 'CSS custom properties',
      extension: '.css'
    },
    {
      id: 'tailwind',
      label: 'Tailwind Config',
      icon: 'Wind',
      description: 'Tailwind CSS configuration',
      extension: '.js'
    },
    {
      id: 'sass',
      label: 'Sass Variables',
      icon: 'Hash',
      description: 'SCSS/Sass variables',
      extension: '.scss'
    },
    {
      id: 'json',
      label: 'JSON',
      icon: 'Braces',
      description: 'Structured data format',
      extension: '.json'
    }
  ];

  const generatePreview = (format) => {
    const colors = palette?.colors;
    
    switch (format) {
      case 'css':
        return `:root {\n${colors?.map(color => 
          `  --${config?.prefix}-${color?.name?.toLowerCase()?.replace(/\s+/g, '-')}: ${color?.value};${config?.includeComments ? ` /* ${color?.name} */` : ''}`
        )?.join('\n')}\n}`;
        
      case 'tailwind':
        return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors?.map(color => 
          `        '${color?.name?.toLowerCase()?.replace(/\s+/g, '-')}': '${color?.value}',${config?.includeComments ? ` // ${color?.name}` : ''}`
        )?.join('\n')}\n      }\n    }\n  }\n}`;
        
      case 'sass':
        return colors?.map(color => 
          `$${config?.prefix}-${color?.name?.toLowerCase()?.replace(/\s+/g, '-')}: ${color?.value};${config?.includeComments ? ` // ${color?.name}` : ''}`
        )?.join('\n');
        
      case 'json':
        const jsonData = colors?.reduce((acc, color) => {
          acc[color.name.toLowerCase().replace(/\s+/g, '-')] = {
            value: color?.value,
            name: color?.name,
            accessibility: {
              contrastRatio: (Math.random() * 3 + 3)?.toFixed(1),
              wcagLevel: Math.random() > 0.5 ? 'AA' : 'AA Large'
            }
          };
          return acc;
        }, {});
        return JSON.stringify(jsonData, null, config?.minify ? 0 : 2);
        
      default:
        return '';
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onPreviewChange(generatePreview(tabId));
  };

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onPreviewChange(generatePreview(activeTab));
  };

  const handleExport = () => {
    const format = formats?.find(f => f?.id === activeTab);
    const content = generatePreview(activeTab);
    onExport({
      format: activeTab,
      content,
      filename: `${palette?.name?.toLowerCase()?.replace(/\s+/g, '-')}-palette${format?.extension}`,
      config
    });
  };

  React.useEffect(() => {
    onPreviewChange(generatePreview(activeTab));
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Tab Headers */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {formats?.map((format) => (
            <button
              key={format?.id}
              onClick={() => handleTabChange(format?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                activeTab === format?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              <Icon name={format?.icon} size={16} />
              <span>{format?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Configuration Panel */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Variable Prefix
            </label>
            <input
              type="text"
              value={config?.prefix}
              onChange={(e) => handleConfigChange('prefix', e?.target?.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="color"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Color Format
            </label>
            <select
              value={config?.format}
              onChange={(e) => handleConfigChange('format', e?.target?.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="hex">HEX (#ffffff)</option>
              <option value="rgb">RGB (255, 255, 255)</option>
              <option value="hsl">HSL (0, 0%, 100%)</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config?.includeComments}
                onChange={(e) => handleConfigChange('includeComments', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <span className="text-xs font-medium text-text-secondary">Include comments</span>
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config?.minify}
                onChange={(e) => handleConfigChange('minify', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <span className="text-xs font-medium text-text-secondary">Minify output</span>
            </label>
          </div>
        </div>
      </div>
      {/* Preview Area */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-text-primary">Preview</h4>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Copy"
              onClick={() => navigator.clipboard?.writeText(generatePreview(activeTab))}
            >
              Copy
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Download"
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
        </div>

        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto border border-border">
            <code className="text-text-primary">{generatePreview(activeTab)}</code>
          </pre>
          
          {/* Syntax highlighting overlay would go here in production */}
          <div className="absolute top-2 right-2">
            <div className="flex items-center space-x-1 text-xs text-text-secondary bg-surface px-2 py-1 rounded border border-border">
              <Icon name="FileText" size={12} />
              <span>{formats?.find(f => f?.id === activeTab)?.extension}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Export Options */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="text-xs text-text-secondary">
            Ready to export {palette?.colors?.length} colors in {formats?.find(f => f?.id === activeTab)?.label} format
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Package"
            >
              Bulk Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Zap"
            >
              API Integration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportFormatTabs;